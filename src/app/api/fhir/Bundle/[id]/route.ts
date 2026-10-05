import { getAdverseEvents, getSae, getStudy } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";
import { buildSaeBundle } from "@/lib/server/fhir";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const sae = await getSae(id);
    if (!sae) return Response.json({ error: "Not found" }, { status: 404 });
    const [aes, study] = await Promise.all([getAdverseEvents(), getStudy(sae.studyId)]);
    const ae = aes.find((a) => a.id === sae.aeId);
    if (!ae || !study) return Response.json({ error: "Linked records missing" }, { status: 500 });
    return Response.json(buildSaeBundle(sae, ae, study), {
      headers: { "Content-Type": "application/fhir+json" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
