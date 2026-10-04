import { buildDefineXml, buildOdmXml } from "@/lib/server/exports";
import { requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function GET(_req: Request, { params }: { params: Promise<{ kind: string }> }) {
  try {
    const user = await requireRole("PI", "Pharmacovigilance", "Admin", "Regulator");
    const { kind } = await params;
    const isDefine = kind === "define-xml";
    const isOdm = kind === "odm";
    if (!isDefine && !isOdm) return Response.json({ error: "Unknown (define-xml|odm)" }, { status: 404 });

    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "Metadata export generated",
      entity: "Export",
      entityId: isDefine ? "Define-XML 2.1" : "ODM 1.3.2 (CDASH)",
    });

    return new Response(isDefine ? buildDefineXml() : buildOdmXml(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${isDefine ? "define" : "odm-cdash"}_aryasetu_demo.xml"`,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
