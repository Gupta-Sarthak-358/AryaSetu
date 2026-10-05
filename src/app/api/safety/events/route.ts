import { createAe, createSae, getStudy, nextAeId, nextSaeId } from "@/lib/server/repo";
import { assertSameOrigin, assertStudyAccess, requireRole, errorResponse } from "@/lib/server/auth";
import { appendAuditDirect } from "@/lib/server/audit";
import type { AdverseEvent, Sae, SaeTimelineStep } from "@/lib/types";

const HOUR = 3600_000;
const DAY = 24 * HOUR;

function ndctTimeline(awarenessIso: string, piName: string): { steps: SaeTimelineStep[]; initial: string; full: string } {
  const t0 = new Date(awarenessIso).getTime();
  const iso = (ms: number) => new Date(ms).toISOString();
  return {
    initial: iso(t0 + 24 * HOUR),
    full: iso(t0 + 14 * DAY),
    steps: [
      { label: "Site awareness — PI informed", rule: "T0", dueAt: iso(t0), doneAt: iso(t0), status: "done", actor: `${piName} (auto-captured)` },
      { label: "Initial report to Licensing Authority, Sponsor & EC", rule: "NDCT 2019 — within 24 hours", dueAt: iso(t0 + 24 * HOUR), doneAt: null, status: "due-now", actor: piName },
      { label: "Full SAE report (sponsor + investigator)", rule: "NDCT 2019 — within 14 days of awareness", dueAt: iso(t0 + 14 * DAY), doneAt: null, status: "pending", actor: "Sponsor PV Cell / PI" },
      { label: "Ethics Committee compensation opinion", rule: "NDCT 2019 — within 30 days", dueAt: iso(t0 + 30 * DAY), doneAt: null, status: "pending", actor: "IEC, AIIA" },
      { label: "Expert committee recommendation (compensation)", rule: "NDCT 2019 — within 60 days", dueAt: iso(t0 + 60 * DAY), doneAt: null, status: "pending", actor: "CDSCO-nominated expert committee" },
      { label: "Licensing Authority order", rule: "NDCT 2019 — within 90 days", dueAt: iso(t0 + 90 * DAY), doneAt: null, status: "pending", actor: "Licensing Authority" },
      { label: "Sponsor compensation payment (if ordered)", rule: "NDCT 2019 — within 30 days of order", dueAt: iso(t0 + 120 * DAY), doneAt: null, status: "pending", actor: "Sponsor" },
    ],
  };
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const user = await requireRole("PI", "Coordinator", "Pharmacovigilance");
    const body = await req.json();

    const required = ["studyId", "siteId", "participantId", "term", "severity", "seriousness", "onset"];
    for (const f of required) {
      if (!body[f]) return Response.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
    if (!["Serious", "Non-serious"].includes(body.seriousness)) {
      return Response.json({ error: "seriousness must be Serious or Non-serious" }, { status: 400 });
    }
    if (!["Mild", "Moderate", "Severe"].includes(body.severity)) {
      return Response.json({ error: "severity must be Mild, Moderate or Severe" }, { status: 400 });
    }
    if (isNaN(Date.parse(body.onset))) {
      return Response.json({ error: "onset must be a valid date" }, { status: 400 });
    }
    await assertStudyAccess(user, body.studyId);
    const study = await getStudy(body.studyId);
    if (!study) return Response.json({ error: "Unknown study" }, { status: 404 });

    const awareness = body.awarenessAt ? new Date(body.awarenessAt).toISOString() : new Date().toISOString();
    const aeId = await nextAeId();
    const ae: AdverseEvent = {
      id: aeId,
      studyId: body.studyId,
      siteId: body.siteId,
      participantId: body.participantId,
      batchId: body.batchId ?? null,
      term: body.term,
      meddraPt: body.meddraPt ?? body.term,
      meddraCode: body.meddraCode ?? "DEMO",
      seriousness: body.seriousness,
      severity: body.severity,
      onset: body.onset,
      reported: awareness.slice(0, 10),
      outcome: "Ongoing",
      whoUmc: body.whoUmc ?? "Possible",
      naranjo: typeof body.naranjo === "number" ? body.naranjo : 0,
      whodrug: body.whodrug ?? study.intervention,
      dechallenge: "Not done",
      concomitant: body.concomitant ?? [],
    };
    await createAe(ae);

    let sae: Sae | null = null;
    if (ae.seriousness === "Serious") {
      const saeId = await nextSaeId();
      const tl = ndctTimeline(awareness, user.name);
      sae = {
        id: saeId,
        aeId: ae.id,
        studyId: ae.studyId,
        siteId: ae.siteId,
        participantId: ae.participantId,
        batchId: ae.batchId,
        term: ae.term,
        meddraPt: ae.meddraPt,
        seriousnessCriteria: body.seriousnessCriteria ?? ["Medically significant"],
        severity: ae.severity === "Severe" ? "Severe" : "Moderate",
        awarenessAt: awareness,
        initialDueAt: tl.initial,
        fullDueAt: tl.full,
        status: "Open",
        whoUmc: ae.whoUmc,
        naranjo: ae.naranjo,
        expectedness: body.expectedness ?? "Unexpected",
        compensationEligible: true,
        timeline: tl.steps,
        narrative: body.narrative ?? "",
        cioms: false,
      };
      await createSae(sae);
    }

    await appendAuditDirect({
      actor: user.name,
      role: user.role,
      action: sae ? "SAE reported (intake)" : "AE reported (intake)",
      entity: sae ? "SAE" : "AE",
      entityId: sae?.id ?? ae.id,
      before: null,
      after: `${ae.term} · ${ae.studyId} · ${ae.participantId}`,
      reason: sae ? "24h statutory clock started" : null,
    });

    return Response.json({ ae, sae }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
