import { getAdverseEvents } from "@/lib/server/repo";
import { buildXpt, type XptVar } from "@/lib/server/xpt";
import { requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";

const aeVars: XptVar[] = [
  { name: "STUDYID", label: "Study Identifier", type: "char", len: 10 },
  { name: "USUBJID", label: "Unique Subject Identifier", type: "char", len: 14 },
  { name: "AESEQ", label: "Sequence Number", type: "num", len: 8 },
  { name: "AETERM", label: "Reported Term for the Adverse Event", type: "char", len: 64 },
  { name: "AESER", label: "Serious Event", type: "char", len: 1 },
  { name: "AESEV", label: "Severity/Intensity", type: "char", len: 8 },
  { name: "AEREL", label: "Causality (WHO-UMC)", type: "char", len: 12 },
  { name: "AESTDTC", label: "Start Date/Time of Adverse Event", type: "char", len: 10 },
  { name: "BATCHID", label: "Investigational Product Lot", type: "char", len: 8 },
];

export async function GET(_req: Request, { params }: { params: Promise<{ domain: string }> }) {
  try {
    const user = await requireRole("PI", "Pharmacovigilance", "Admin", "Regulator");
    const { domain } = await params;
    if (domain !== "ae") return Response.json({ error: "Only ae supported in xpt draft" }, { status: 404 });

    const aes = await getAdverseEvents();
    const rows = aes.map((a, i) => [
      a.studyId, a.participantId, i + 1, a.term, a.seriousness === "Serious" ? "Y" : "N",
      a.severity.toUpperCase(), a.whoUmc.toUpperCase(), a.onset, a.batchId ?? "",
    ]);
    const buf = buildXpt("AE", "Adverse Events (AryaSetu demo)", aeVars, rows);

    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: "SDTM .xpt export generated",
      entity: "Export",
      entityId: "AE.xpt",
      after: `${rows.length} records · SAS Transport v5 (draft)`,
    });

    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/x-sas-xport",
        "Content-Disposition": `attachment; filename="ae.xpt"`,
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
