import { getAdverseEvents, getBatches, getStudies } from "@/lib/server/repo";
import { buildSdtmAe, buildSdtmDm, buildSdtmEx } from "@/lib/server/exports";
import { requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function GET(_req: Request, { params }: { params: Promise<{ domain: string }> }) {
  try {
    const user = await requireRole("PI", "Pharmacovigilance", "Admin", "Regulator");
    const { domain } = await params;
    let content: string;
    if (domain === "ae") content = buildSdtmAe(await getAdverseEvents());
    else if (domain === "dm") content = buildSdtmDm(await getStudies());
    else if (domain === "ex") content = buildSdtmEx(await getBatches());
    else return Response.json({ error: "Unknown domain (ae|dm|ex)" }, { status: 404 });

    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "SDTM export generated",
      entity: "Export",
      entityId: `SDTM-${domain.toUpperCase()}`,
      after: `${content.split("\n").length - 1} records`,
    });

    return new Response(content, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${domain.toUpperCase()}_aryasetu_demo.csv"`,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
