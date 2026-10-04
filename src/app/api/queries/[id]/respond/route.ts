import { updateQuery } from "@/lib/server/repo";
import { assertSameOrigin, requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(req);
    const user = await requireRole("PI", "Coordinator");
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const next = await updateQuery(id, { status: "Resolved" });
    if (!next) return Response.json({ error: "Not found" }, { status: 404 });
    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "Data query resolved",
      entity: "Query",
      entityId: id,
      before: "Open",
      after: "Resolved",
      reason: body.response ?? null,
    });
    return Response.json({ query: next });
  } catch (e) {
    return errorResponse(e);
  }
}
