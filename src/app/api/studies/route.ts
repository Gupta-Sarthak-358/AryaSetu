import { getStudies } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const studies = await getStudies();
    const scoped = user.studies.includes("ALL") ? studies : studies.filter((s) => user.studies.includes(s.id));
    return Response.json({ studies: scoped });
  } catch (e) {
    return errorResponse(e);
  }
}
