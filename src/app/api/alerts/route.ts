import { getAlerts } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireUser();
    const alerts = await getAlerts();
    return Response.json({ alerts });
  } catch (e) {
    return errorResponse(e);
  }
}
