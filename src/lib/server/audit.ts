import { createHash } from "crypto";
import { getDb } from "./db";
import * as schema from "./schema";
import { desc } from "drizzle-orm";

export interface AuditWrite {
  actor: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  before?: string | null;
  after?: string | null;
  reason?: string | null;
}

function computeHash(parts: (string | null | undefined)[], prevHash: string) {
  return createHash("sha256").update(parts.map((p) => p ?? "").join("|") + "|" + prevHash).digest("hex");
}

export async function appendAuditDirect(e: AuditWrite, ts?: string) {
  const db = getDb();
  const last = await db.select({ hash: schema.auditEvents.hash }).from(schema.auditEvents).orderBy(desc(schema.auditEvents.seq)).limit(1);
  const prevHash = last[0]?.hash ?? "0".repeat(64);
  const at = ts ?? new Date().toISOString();
  const hash = computeHash([at, e.actor, e.role, e.action, e.entity, e.entityId, e.before, e.after, e.reason], prevHash);
  await db.insert(schema.auditEvents).values({
    ts: at,
    actor: e.actor,
    role: e.role,
    action: e.action,
    entity: e.entity,
    entityId: e.entityId,
    before: e.before ?? null,
    after: e.after ?? null,
    reason: e.reason ?? null,
    prevHash,
    hash,
  });
  return hash;
}

export async function verifyChain(): Promise<{ valid: boolean; brokenAt: number | null; count: number }> {
  const db = getDb();
  const rows = await db.select().from(schema.auditEvents).orderBy(schema.auditEvents.seq);
  let prev = "0".repeat(64);
  for (const r of rows) {
    const expected = computeHash([r.ts, r.actor, r.role, r.action, r.entity, r.entityId, r.before, r.after, r.reason], prev);
    if (r.prevHash !== prev || r.hash !== expected) {
      return { valid: false, brokenAt: r.seq, count: rows.length };
    }
    prev = r.hash;
  }
  return { valid: true, brokenAt: null, count: rows.length };
}
