import { getSaes } from "@/lib/server/repo";
import { requireRole, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireRole("Pharmacovigilance", "PI", "Ethics", "Admin", "Regulator");
    const saes = await getSaes();
    return Response.json({ saes });
  } catch (e) {
    return errorResponse(e);
  }
}
