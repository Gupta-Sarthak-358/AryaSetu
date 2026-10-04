import { getStudies } from "@/lib/server/repo";
import { buildAdamAdsl } from "@/lib/server/exports";
import { requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

export async function GET() {
  try {
    const user = await requireRole("PI", "Pharmacovigilance", "Admin", "Regulator");
    const content = buildAdamAdsl(await getStudies());
    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "ADaM export generated",
      entity: "Export",
      entityId: "ADSL",
      after: `${content.split("\n").length - 1} records`,
    });
    return new Response(content, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ADSL_aryasetu_demo.csv"`,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
