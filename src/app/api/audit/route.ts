import { getAuditEntries } from "@/lib/server/repo";
import { requireRole, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireRole("Admin", "Monitor", "Ethics", "Pharmacovigilance", "Regulator");
    const entries = await getAuditEntries();
    return Response.json({ entries });
  } catch (e) {
    return errorResponse(e);
  }
}
