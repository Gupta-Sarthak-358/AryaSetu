import { evaluateRules } from "@/lib/server/rules";
import { requireUser, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireUser();
    const alerts = await evaluateRules();
    return Response.json({ alerts });
  } catch (e) {
    return errorResponse(e);
  }
}
