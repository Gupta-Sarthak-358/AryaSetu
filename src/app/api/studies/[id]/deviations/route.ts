import { createDeviation, nextDeviationId } from "@/lib/server/repo";
import { assertSameOrigin, assertStudyAccess, requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(req);
    const user = await requireRole("Monitor", "PI", "Coordinator");
    const { id: studyId } = await params;
    await assertStudyAccess(user, studyId);
    const body = await req.json();
    if (!body.siteId || !body.type || !body.description) {
      return Response.json({ error: "siteId, type and description required" }, { status: 400 });
    }

    const d = {
      id: await nextDeviationId(),
      studyId,
      siteId: body.siteId,
      type: body.type,
      severity: body.severity ?? "Minor",
      reported: new Date().toISOString().slice(0, 10),
      status: "Open" as const,
      description: body.description,
    };
    await createDeviation(d);
    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "Deviation reported",
      entity: "Deviation",
      entityId: `${d.id} (${studyId})`,
      after: `${d.severity} — ${d.type}`,
      reason: body.description.slice(0, 120),
    });
    return Response.json({ deviation: d }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
