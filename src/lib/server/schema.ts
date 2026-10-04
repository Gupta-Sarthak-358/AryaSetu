import { pgTable, text, timestamp, jsonb, bigint, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  org: text("org").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
});

export const studyMemberships = pgTable("study_memberships", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  studyId: text("study_id").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const studies = pgTable("studies", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  payload: jsonb("payload").notNull(),
});

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  payload: jsonb("payload").notNull(),
});

export const adverseEvents = pgTable("adverse_events", {
  id: text("id").primaryKey(),
  studyId: text("study_id").notNull(),
  batchId: text("batch_id"),
  seriousness: text("seriousness").notNull(),
  payload: jsonb("payload").notNull(),
});

export const saes = pgTable("saes", {
  id: text("id").primaryKey(),
  studyId: text("study_id").notNull(),
  status: text("status").notNull(),
  payload: jsonb("payload").notNull(),
});

export const batches = pgTable("batches", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  payload: jsonb("payload").notNull(),
});

export const deviations = pgTable("deviations", {
  id: text("id").primaryKey(),
  studyId: text("study_id").notNull(),
  payload: jsonb("payload").notNull(),
});

export const dataQueries = pgTable("data_queries", {
  id: text("id").primaryKey(),
  studyId: text("study_id").notNull(),
  status: text("status").notNull(),
  payload: jsonb("payload").notNull(),
});

export const consentRecords = pgTable("consent_records", {
  studyId: text("study_id").primaryKey(),
  payload: jsonb("payload").notNull(),
});

export const alerts = pgTable("alerts", {
  id: text("id").primaryKey(),
  severity: text("severity").notNull(),
  payload: jsonb("payload").notNull(),
});

export const tickerEvents = pgTable("ticker_events", {
  id: integer("id").primaryKey(),
  payload: jsonb("payload").notNull(),
});

export const auditEvents = pgTable("audit_events", {
  seq: bigint("seq", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  ts: text("ts").notNull(),
  actor: text("actor").notNull(),
  role: text("role").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  before: text("before"),
  after: text("after"),
  reason: text("reason"),
  prevHash: text("prev_hash").notNull(),
  hash: text("hash").notNull(),
});
