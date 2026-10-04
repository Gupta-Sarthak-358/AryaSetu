import { getBatches } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    await requireUser();
    const batches = await getBatches();
    return Response.json({ batches });
  } catch (e) {
    return errorResponse(e);
  }
}
