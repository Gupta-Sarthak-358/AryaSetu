import { createQuery, nextQueryId } from "@/lib/server/repo";
import { assertSameOrigin, assertStudyAccess, requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(req);
    const user = await requireRole("Monitor", "Admin");
    const { id: studyId } = await params;
    await assertStudyAccess(user, studyId);
    const body = await req.json();
    if (!body.siteId || !body.field) return Response.json({ error: "siteId and field required" }, { status: 400 });

    const q = {
      id: await nextQueryId(),
      studyId,
      siteId: body.siteId,
      field: body.field,
      raised: new Date().toISOString().slice(0, 10),
      ageDays: 0,
      status: "Open" as const,
    };
    await createQuery(q);
    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "Data query raised",
      entity: "Query",
      entityId: `${q.id} (${studyId})`,
      after: `Open — ${q.field}`,
      reason: body.reason ?? null,
    });
    return Response.json({ query: q }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
