import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import argon2 from "argon2";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema";
import { ensureBoot } from "./boot";
import { appendAuditDirect } from "./audit";

const COOKIE = "aryasetu_sid";
const SESSION_DAYS = 7;

export interface SessionUser {
  id: string;
  name: string;
  designation: string;
  org: string;
  email: string;
  role: string;
  studies: string[];
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  await ensureBoot();
  const db = getDb();
  const rows = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  const user = rows[0];
  if (!user) return { ok: false, error: "Unknown account" };
  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    await appendAuditDirect({ actor: email, role: "unknown", action: "Login failed", entity: "Session", entityId: email, reason: "Bad password" });
    return { ok: false, error: "Invalid credentials" };
  }
  const sid = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.insert(schema.sessions).values({ id: sid, userId: user.id, expiresAt: expires });
  const jar = await cookies();
  jar.set(COOKIE, sid, { httpOnly: true, sameSite: "lax", path: "/", expires: expires });
  await appendAuditDirect({ actor: user.name, role: user.role, action: "Login", entity: "Session", entityId: user.email });
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  const sid = jar.get(COOKIE)?.value;
  if (sid) {
    const db = getDb();
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sid));
  }
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  await ensureBoot();
  const jar = await cookies();
  const sid = jar.get(COOKIE)?.value;
  if (!sid) return null;
  const db = getDb();
  const rows = await db
    .select({ user: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(and(eq(schema.sessions.id, sid), gt(schema.sessions.expiresAt, new Date())))
    .limit(1);
  const u = rows[0]?.user;
  if (!u) return null;
  const memberships = await db.select({ studyId: schema.studyMemberships.studyId }).from(schema.studyMemberships).where(eq(schema.studyMemberships.userId, u.id));
  return { id: u.id, name: u.name, designation: u.designation, org: u.org, email: u.email, role: u.role, studies: memberships.map((m) => m.studyId) };
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new HttpError(401, "Authentication required");
  return user;
}

export async function requireRole(...roles: string[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    await appendAuditDirect({ actor: user.name, role: user.role, action: "Access denied (role)", entity: "ACL", entityId: roles.join(","), reason: "Route-level permission check" });
    throw new HttpError(403, `Requires role: ${roles.join(" or ")}`);
  }
  return user;
}

export async function assertStudyAccess(user: SessionUser, studyId: string): Promise<void> {
  if (!user.studies.includes(studyId)) {
    await appendAuditDirect({ actor: user.name, role: user.role, action: "Access denied (study)", entity: "ACL", entityId: studyId, reason: "Study membership check" });
    throw new HttpError(403, `No membership for study ${studyId}`);
  }
}

export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host && new URL(origin).host !== host) {
    throw new HttpError(403, "Cross-origin request rejected");
  }
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) {
    return Response.json({ error: e.message }, { status: e.status });
  }
  const msg = e instanceof Error ? e.message : "Internal error";
  return Response.json({ error: msg }, { status: 500 });
}
