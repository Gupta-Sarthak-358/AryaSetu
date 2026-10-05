import { getDb } from "@/lib/server/db";
import { getAuditEntries, getStudies, getUsersWithStudies } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";

function describeDatabase(): { driver: string; host: string; database: string } {
  const url = process.env.DATABASE_URL;
  if (!url) return { driver: "pglite-local", host: "embedded", database: ".pgdata" };
  try {
    const u = new URL(url);
    return { driver: "neon-postgres", host: u.hostname, database: u.pathname.replace("/", "") || "unknown" };
  } catch {
    return { driver: "neon-postgres", host: "unparseable", database: "unknown" };
  }
}

export async function GET() {
  try {
    await requireUser();
    const [studies, users, audit] = await Promise.all([getStudies(), getUsersWithStudies(), getAuditEntries()]);
    getDb();
    return Response.json({
      app: "aryasetu",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      region: process.env.VERCEL_REGION ?? "local",
      time: new Date().toISOString(),
      database: {
        ...describeDatabase(),
        studies: studies.length,
        ctrilImported: studies.filter((s) => s.id.startsWith("CTRI-")).length,
        users: users.length,
        auditEntries: audit.length,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
