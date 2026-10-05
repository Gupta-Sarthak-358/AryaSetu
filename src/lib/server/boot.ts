import { getDb, execDdl } from "./db";
import * as schema from "./schema";
import { studies as mockStudies } from "../data/studies";
import { sites as mockSites } from "../data/sites";
import { adverseEvents as mockAes, saes as mockSaes } from "../data/safety";
import { batches as mockBatches } from "../data/batches";
import { deviations as mockDeviations, dataQueries as mockQueries } from "../data/quality";
import { personas } from "../data/personas";
import { alerts, consentRecords, tickerEvents } from "../data/ops";
import argon2 from "argon2";
import { appendAuditDirect } from "./audit";

const DDL = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  name text NOT NULL,
  designation text NOT NULL,
  org text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL
);
CREATE TABLE IF NOT EXISTS study_memberships (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  study_id text NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS studies (
  id text PRIMARY KEY,
  status text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS sites (
  id text PRIMARY KEY,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS adverse_events (
  id text PRIMARY KEY,
  study_id text NOT NULL,
  batch_id text,
  seriousness text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS saes (
  id text PRIMARY KEY,
  study_id text NOT NULL,
  status text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS batches (
  id text PRIMARY KEY,
  status text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS deviations (
  id text PRIMARY KEY,
  study_id text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS data_queries (
  id text PRIMARY KEY,
  study_id text NOT NULL,
  status text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS consent_records (
  study_id text PRIMARY KEY,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS alerts (
  id text PRIMARY KEY,
  severity text NOT NULL,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS ticker_events (
  id integer PRIMARY KEY,
  payload jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_events (
  seq bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts text NOT NULL,
  actor text NOT NULL,
  role text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text NOT NULL,
  before text,
  after text,
  reason text,
  prev_hash text NOT NULL,
  hash text NOT NULL
);
`;

export const DEMO_PASSWORD = "AryaSetu@123";

const globalBoot = globalThis as unknown as { __aryasetuBoot?: Promise<void> };

export function ensureBoot(): Promise<void> {
  if (!globalBoot.__aryasetuBoot) {
    globalBoot.__aryasetuBoot = boot().catch((e) => {
      globalBoot.__aryasetuBoot = undefined;
      throw e;
    });
  }
  return globalBoot.__aryasetuBoot;
}

async function boot() {
  const db = getDb();
  await execDdl(DDL);

  const existing = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  if (existing.length > 0) return;

  const passwordHash = await argon2.hash(DEMO_PASSWORD, { type: argon2.argon2id });

  for (const [i, p] of personas.entries()) {
    const userId = `U-${String(i + 1).padStart(3, "0")}`;
    await db.insert(schema.users).values({
      id: userId,
      name: p.name,
      designation: p.designation,
      org: p.org,
      email: p.email,
      passwordHash,
      role: p.role,
    });
    const scope = p.studies[0] === "ALL" ? ["ALL"] : p.studies;
    for (const [j, sid] of scope.entries()) {
      await db.insert(schema.studyMemberships).values({ id: `M-${userId}-${j}`, userId, studyId: sid });
    }
  }

  for (const s of mockStudies) await db.insert(schema.studies).values({ id: s.id, status: s.status, payload: s });
  for (const s of mockSites) await db.insert(schema.sites).values({ id: s.id, payload: s });
  for (const a of mockAes) await db.insert(schema.adverseEvents).values({ id: a.id, studyId: a.studyId, batchId: a.batchId, seriousness: a.seriousness, payload: a });
  for (const s of mockSaes) await db.insert(schema.saes).values({ id: s.id, studyId: s.studyId, status: s.status, payload: s });
  for (const b of mockBatches) await db.insert(schema.batches).values({ id: b.id, status: b.status, payload: b });
  for (const d of mockDeviations) await db.insert(schema.deviations).values({ id: d.id, studyId: d.studyId, payload: d });
  for (const q of mockQueries) await db.insert(schema.dataQueries).values({ id: q.id, studyId: q.studyId, status: q.status, payload: q });
  for (const c of consentRecords) await db.insert(schema.consentRecords).values({ studyId: c.studyId, payload: c });
  for (const a of alerts) await db.insert(schema.alerts).values({ id: a.id, severity: a.severity, payload: a });
  for (const [i, t] of tickerEvents.entries()) await db.insert(schema.tickerEvents).values({ id: i + 1, payload: t });

  const seedEvents = [
    { actor: "System", role: "Admin", action: "Database seeded", entity: "System", entityId: "aryasetu-db", before: null, after: "12 studies · 8 sites · 14 AEs · 3 SAEs · 6 batches", reason: "Initial seed from curated demo dataset" },
    { actor: "System", role: "Admin", action: "Users provisioned", entity: "User", entityId: "personas×7", before: null, after: "7 roles with study memberships", reason: "Stage-2 boot" },
  ];
  for (const e of seedEvents) await appendAuditDirect(e);
}
