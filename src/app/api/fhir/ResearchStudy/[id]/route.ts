import { getStudy } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";
import { buildResearchStudy } from "@/lib/server/fhir";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const study = await getStudy(id);
    if (!study) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(buildResearchStudy(study), {
      headers: { "Content-Type": "application/fhir+json" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
