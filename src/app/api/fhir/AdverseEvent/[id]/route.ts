import { getAdverseEvents, getSae } from "@/lib/server/repo";
import { requireUser, errorResponse } from "@/lib/server/auth";
import { buildAdverseEventFhir } from "@/lib/server/fhir";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser();
    const { id } = await params;
    const aes = await getAdverseEvents();
    const sae = await getSae(id).catch(() => undefined);
    const ae = aes.find((a) => a.id === id) ?? aes.find((a) => a.id === sae?.aeId);
    if (!ae) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(buildAdverseEventFhir(ae, sae ?? undefined), {
      headers: { "Content-Type": "application/fhir+json" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
