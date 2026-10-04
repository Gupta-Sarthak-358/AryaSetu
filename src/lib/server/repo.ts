import { getDb } from "./db";
import * as schema from "./schema";
import { ensureBoot } from "./boot";
import { eq } from "drizzle-orm";
import type { AdverseEvent, Alert, AuditEntry, Batch, ConsentRecord, DataQuery, Deviation, Sae, Site, Study, TickerEvent } from "../types";

async function db() {
  await ensureBoot();
  return getDb();
}

export async function getStudies(): Promise<Study[]> {
  const rows = await (await db()).select({ payload: schema.studies.payload }).from(schema.studies).orderBy(schema.studies.id);
  return rows.map((r) => r.payload as Study);
}

export async function getStudy(id: string): Promise<Study | undefined> {
  const rows = await (await db()).select({ payload: schema.studies.payload }).from(schema.studies).where(eq(schema.studies.id, id)).limit(1);
  return rows[0]?.payload as Study | undefined;
}

export async function getSites(): Promise<Site[]> {
  const rows = await (await db()).select({ payload: schema.sites.payload }).from(schema.sites).orderBy(schema.sites.id);
  return rows.map((r) => r.payload as Site);
}

export async function getSite(id: string): Promise<Site | undefined> {
  const rows = await (await db()).select({ payload: schema.sites.payload }).from(schema.sites).where(eq(schema.sites.id, id)).limit(1);
  return rows[0]?.payload as Site | undefined;
}

export async function getAdverseEvents(): Promise<AdverseEvent[]> {
  const rows = await (await db()).select({ payload: schema.adverseEvents.payload }).from(schema.adverseEvents).orderBy(schema.adverseEvents.id);
  return rows.map((r) => r.payload as AdverseEvent);
}

export async function getSaes(): Promise<Sae[]> {
  const rows = await (await db()).select({ payload: schema.saes.payload }).from(schema.saes).orderBy(schema.saes.id);
  return rows.map((r) => r.payload as Sae);
}

export async function getSae(id: string): Promise<Sae | undefined> {
  const rows = await (await db()).select({ payload: schema.saes.payload }).from(schema.saes).where(eq(schema.saes.id, id)).limit(1);
  return rows[0]?.payload as Sae | undefined;
}

export async function updateSae(id: string, patch: Partial<Sae>): Promise<Sae | undefined> {
  const d = await db();
  const current = await getSae(id);
  if (!current) return undefined;
  const next = { ...current, ...patch };
  await d.update(schema.saes).set({ status: next.status, payload: next }).where(eq(schema.saes.id, id));
  return next;
}

export async function getBatches(): Promise<Batch[]> {
  const rows = await (await db()).select({ payload: schema.batches.payload }).from(schema.batches).orderBy(schema.batches.id);
  return rows.map((r) => r.payload as Batch);
}

export async function getBatch(id: string): Promise<Batch | undefined> {
  const rows = await (await db()).select({ payload: schema.batches.payload }).from(schema.batches).where(eq(schema.batches.id, id)).limit(1);
  return rows[0]?.payload as Batch | undefined;
}

export async function getDeviations(): Promise<Deviation[]> {
  const rows = await (await db()).select({ payload: schema.deviations.payload }).from(schema.deviations).orderBy(schema.deviations.id);
  return rows.map((r) => r.payload as Deviation);
}

export async function getDataQueries(): Promise<DataQuery[]> {
  const rows = await (await db()).select({ payload: schema.dataQueries.payload }).from(schema.dataQueries).orderBy(schema.dataQueries.id);
  return rows.map((r) => r.payload as DataQuery);
}

export async function getConsentRecords(): Promise<ConsentRecord[]> {
  const rows = await (await db()).select({ payload: schema.consentRecords.payload }).from(schema.consentRecords).orderBy(schema.consentRecords.studyId);
  return rows.map((r) => r.payload as ConsentRecord);
}

export async function getAlerts(): Promise<Alert[]> {
  const rows = await (await db()).select({ payload: schema.alerts.payload }).from(schema.alerts).orderBy(schema.alerts.id);
  return rows.map((r) => r.payload as Alert);
}

export async function getTickerEvents(): Promise<TickerEvent[]> {
  const rows = await (await db()).select({ payload: schema.tickerEvents.payload }).from(schema.tickerEvents).orderBy(schema.tickerEvents.id);
  return rows.map((r) => r.payload as TickerEvent);
}

export interface UserWithStudies {
  id: string;
  name: string;
  designation: string;
  org: string;
  email: string;
  role: string;
  studies: string[];
}

export async function getUsersWithStudies(): Promise<UserWithStudies[]> {
  const d = await db();
  const users = await d.select().from(schema.users).orderBy(schema.users.id);
  const memberships = await d.select().from(schema.studyMemberships);
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    designation: u.designation,
    org: u.org,
    email: u.email,
    role: u.role,
    studies: memberships.filter((m) => m.userId === u.id).map((m) => m.studyId),
  }));
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  const rows = await (await db()).select().from(schema.auditEvents).orderBy(schema.auditEvents.seq);
  return rows.map((r) => ({
    seq: r.seq,
    ts: r.ts,
    actor: r.actor,
    role: r.role as AuditEntry["role"],
    action: r.action,
    entity: r.entity,
    entityId: r.entityId,
    before: r.before,
    after: r.after,
    reason: r.reason,
    hash: r.hash,
    prevHash: r.prevHash,
  }));
}
