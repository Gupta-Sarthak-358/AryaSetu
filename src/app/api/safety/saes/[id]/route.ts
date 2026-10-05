import { getSae, updateSae } from "@/lib/server/repo";
import { assertSameOrigin, requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(req);
    const user = await requireRole("Pharmacovigilance", "PI");
    const { id } = await params;
    const body = await req.json();
    const sae = await getSae(id);
    if (!sae) return Response.json({ error: "Not found" }, { status: 404 });

    const WHO_UMC = ["Certain", "Probable", "Possible", "Unlikely", "Unassessable"];
    if (body.whoUmc !== undefined && !WHO_UMC.includes(body.whoUmc)) {
      return Response.json({ error: `whoUmc must be one of: ${WHO_UMC.join(", ")}` }, { status: 400 });
    }
    if (body.naranjo !== undefined && (typeof body.naranjo !== "number" || body.naranjo < -4 || body.naranjo > 13)) {
      return Response.json({ error: "naranjo must be a number between -4 and 13" }, { status: 400 });
    }
    if (body.status !== undefined && !["Open", "Initial Reported", "Full Reported", "EC Opinion", "Closed"].includes(body.status)) {
      return Response.json({ error: "invalid status" }, { status: 400 });
    }
    if (body.expectedness !== undefined && !["Expected", "Unexpected"].includes(body.expectedness)) {
      return Response.json({ error: "expectedness must be Expected or Unexpected" }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (body.whoUmc) patch.whoUmc = body.whoUmc;
    if (typeof body.naranjo === "number") patch.naranjo = body.naranjo;
    if (body.status) patch.status = body.status;
    if (body.expectedness) patch.expectedness = body.expectedness;

    const before = `WHO-UMC ${sae.whoUmc}, Naranjo ${sae.naranjo}, ${sae.status}`;
    const next = await updateSae(id, patch);
    const after = `WHO-UMC ${next!.whoUmc}, Naranjo ${next!.naranjo}, ${next!.status}`;

    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "SAE triage updated",
      entity: "SAE",
      entityId: id,
      before,
      after,
      reason: body.reason ?? null,
    });

    return Response.json({ sae: next });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("Pharmacovigilance", "PI", "Ethics", "Admin", "Regulator");
    const { id } = await params;
    const sae = await getSae(id);
    if (!sae) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ sae });
  } catch (e) {
    return errorResponse(e);
  }
}
