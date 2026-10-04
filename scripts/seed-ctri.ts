import fs from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/server/db";
import * as schema from "../src/lib/server/schema";
import { ensureBoot } from "../src/lib/server/boot";
import { appendAuditDirect } from "../src/lib/server/audit";
import type { Study } from "../src/lib/types";

interface CtriRecord {
  ctriNumber: string;
  title: string;
  intervention?: string;
  phase?: string;
  sponsor?: string;
  pi?: string;
  city?: string;
  registrationDate?: string;
  status?: string;
  targetSampleSize?: number;
}

const CTRI_RE = /^CTRI\/\d{4}\/\d{2}\/\d{6}$/;
const SITE_IDS = ["SITE-01", "SITE-02", "SITE-03", "SITE-04", "SITE-05", "SITE-06", "SITE-07", "SITE-08"];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function seededRand(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return (h % 10000) / 10000;
  };
}

function toStudy(rec: CtriRecord): Study {
  const rand = seededRand(rec.ctriNumber);
  const target = rec.targetSampleSize && rec.targetSampleSize > 10 ? rec.targetSampleSize : 100;
  const statusMap: Record<string, Study["status"]> = {
    Recruiting: "Recruiting",
    Completed: "Completed",
    "Not yet recruiting": "Recruiting",
    "Follow-up": "Follow-up",
  };
  const status = statusMap[rec.status ?? ""] ?? "Recruiting";
  const enrolled = status === "Completed" ? target : Math.floor(target * (0.25 + rand() * 0.5));
  const siteCount = 1 + Math.floor(rand() * 3);
  const sites = Array.from({ length: siteCount }, (_, i) => SITE_IDS[Math.floor(rand() * SITE_IDS.length + i) % SITE_IDS.length])
    .filter((v, i, a) => a.indexOf(v) === i);
  const regDate = rec.registrationDate ?? "2024-01-01";
  const reg = new Date(regDate);
  const iec = new Date(reg.getTime() - 20 * 86400_000);
  const iecExp = new Date(reg.getTime() + 365 * 86400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const points = MONTHS.map((_, i) => Math.round((enrolled / 7) * (i + 1) * (0.85 + rand() * 0.3)));
  points[6] = enrolled;
  const tPoints = MONTHS.map((_, i) => Math.round((target / 7) * (i + 1)));

  return {
    id: `CTRI-${rec.ctriNumber.slice(-6)}`,
    title: rec.title,
    shortTitle: rec.title.length > 60 ? rec.title.slice(0, 57) + "…" : rec.title,
    intervention: rec.intervention ?? "As per registry record",
    phase: rec.phase ?? "Not specified",
    design: "Interventional (registry metadata; operational fields synthetic)",
    status,
    risk: "Low",
    ctriNumber: rec.ctriNumber,
    ctriStatus: "Registered",
    ctriRegistered: regDate,
    iecApproval: iso(iec),
    iecExpiry: iso(iecExp),
    sponsor: rec.sponsor ?? "Not specified",
    pi: rec.pi ?? "Not specified",
    indication: "As per registry record",
    target,
    enrolled,
    screened: Math.round(enrolled * 1.4),
    sites,
    startDate: regDate,
    endDate: iso(new Date(reg.getTime() + 540 * 86400_000)),
    milestones: [
      { label: "CTRI registration", date: regDate, status: "done" },
      { label: "First participant enrolled (est.)", date: iso(new Date(reg.getTime() + 45 * 86400_000)), status: "done" },
      { label: status === "Completed" ? "Close-out" : "Interim review", date: null, status: status === "Completed" ? "done" : "current" },
    ],
    enrollmentCurve: MONTHS.map((month, i) => ({ month, enrolled: Math.min(points[i], enrolled), target: tPoints[i] })),
    batches: [],
    prakritiSplit: [
      { prakriti: "Vata", count: Math.round(enrolled * 0.35) },
      { prakriti: "Pitta", count: Math.round(enrolled * 0.3) },
      { prakriti: "Kapha", count: Math.round(enrolled * 0.27) },
      { prakriti: "Dual", count: Math.round(enrolled * 0.08) },
    ],
  };
}

async function main() {
  const file = process.argv[2] ?? path.join(process.cwd(), "data", "ctri_ayurveda_trials.json");
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}\nExpected the scrape deliverable at data/ctri_ayurveda_trials.json (see data/ctri_ayurveda_trials.sample.json for format).`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  const records: CtriRecord[] = Array.isArray(raw) ? raw : raw.records;
  if (!Array.isArray(records) || records.length === 0) {
    console.error("No records found in file.");
    process.exit(1);
  }

  const bad = records.filter((r) => !CTRI_RE.test(r.ctriNumber ?? ""));
  if (bad.length > 0) {
    console.error(`Invalid CTRI numbers in ${bad.length} record(s): ${bad.map((b) => b.ctriNumber).join(", ")}`);
    process.exit(1);
  }

  await ensureBoot();
  const db = getDb();
  let inserted = 0, skipped = 0;
  for (const rec of records) {
    const existing = await db.select({ id: schema.studies.id }).from(schema.studies).where(eq(schema.studies.id, `CTRI-${rec.ctriNumber.slice(-6)}`)).limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    const study = toStudy(rec);
    await db.insert(schema.studies).values({ id: study.id, status: study.status, payload: study });
    inserted++;
  }

  await appendAuditDirect({
    actor: "seed-ctri script",
    role: "Admin",
    action: "CTRI registry import",
    entity: "Study",
    entityId: path.basename(file),
    after: `${inserted} imported, ${skipped} skipped (duplicates)`,
    reason: "Real CTRI registry metadata merged into demo dataset",
  });

  console.log(`Done. ${inserted} studies imported, ${skipped} duplicates skipped.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
