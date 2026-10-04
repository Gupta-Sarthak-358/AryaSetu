import { getStudy } from "@/lib/server/repo";
import { assertStudyAccess, requireUser, errorResponse } from "@/lib/server/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await assertStudyAccess(user, id);
    const study = await getStudy(id);
    if (!study) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ study });
  } catch (e) {
    return errorResponse(e);
  }
}
