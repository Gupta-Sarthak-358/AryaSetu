import { verifyChain } from "@/lib/server/audit";
import { requireRole, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireRole("Admin", "Monitor", "Ethics", "Pharmacovigilance", "Regulator");
    const result = await verifyChain();
    return Response.json(result);
  } catch (e) {
    return errorResponse(e);
  }
}
