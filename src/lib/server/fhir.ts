import type { AdverseEvent, Sae, Study } from "../types";

export function buildResearchStudy(study: Study) {
  return {
    resourceType: "ResearchStudy",
    id: study.id,
    identifier: [{ system: "https://ctri.nic.in", value: study.ctriNumber }],
    title: study.title,
    status: study.status === "Recruiting" ? "active" : study.status === "Completed" ? "completed" : "active",
    phase: {
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/research-study-phase",
        code: study.phase.toLowerCase().replace(" ", "-").replace("pilot", "n-a"),
        display: study.phase,
      }],
    },
    description: `${study.design} · ${study.intervention}`,
    condition: [{ text: study.indication }],
    sponsor: { display: study.sponsor },
    principalInvestigator: { display: study.pi },
    site: study.sites.map((s) => ({ reference: `Location/${s}` })),
  };
}

export function buildResearchSubject(participantId: string, studyId: string) {
  return {
    resourceType: "ResearchSubject",
    id: participantId,
    identifier: [{ system: "https://aryasetu.in/synthetic-subject", value: participantId }],
    status: "on-study",
    study: { reference: `ResearchStudy/${studyId}` },
    consent: { reference: `Consent/ICF-${participantId}` },
  };
}

export function buildAdverseEventFhir(ae: AdverseEvent, sae?: Sae) {
  return {
    resourceType: "AdverseEvent",
    id: sae?.id ?? ae.id,
    identifier: [{ system: "https://aryasetu.in/icsr", value: sae?.id ?? ae.id }],
    actuality: "actual",
    event: {
      coding: [{ system: "https://www.meddra.org", code: ae.meddraCode, display: `${ae.meddraPt} (DEMO dictionary)` }],
      text: ae.term,
    },
    subject: { reference: `ResearchSubject/${ae.participantId}` },
    date: ae.onset,
    recordedDate: ae.reported,
    seriousness: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/adverse-event-seriousness", code: ae.seriousness === "Serious" ? "serious" : "non-serious" }] },
    severity: { coding: [{ code: ae.severity.toLowerCase() }] },
    outcome: { coding: [{ code: ae.outcome.toLowerCase().replace(/ /g, "-") }] },
    suspectEntity: [{
      instance: { display: `${ae.whodrug}${ae.batchId ? ` — Batch ${ae.batchId}` : ""}` },
      causality: {
        assessment: { coding: [{ system: "https://aryasetu.in/who-umc", code: ae.whoUmc.toLowerCase(), display: `WHO-UMC ${ae.whoUmc}` }] },
      },
    }],
    extension: [
      { url: "https://aryasetu.in/fhir/StructureDefinition/naranjo-score", valueInteger: ae.naranjo },
      { url: "https://aryasetu.in/fhir/StructureDefinition/batch-lot", valueString: ae.batchId ?? "none" },
      { url: "https://aryasetu.in/fhir/StructureDefinition/dechallenge", valueString: ae.dechallenge },
    ],
  };
}

export function buildSaeBundle(sae: Sae, ae: AdverseEvent, study: Study) {
  return {
    resourceType: "Bundle",
    id: `bundle-${sae.id.toLowerCase()}`,
    type: "collection",
    timestamp: new Date().toISOString(),
    entry: [
      { resource: buildResearchStudy(study) },
      { resource: buildResearchSubject(sae.participantId, sae.studyId) },
      { resource: buildAdverseEventFhir(ae, sae) },
      {
        resource: {
          resourceType: "Medication",
          id: sae.batchId ?? "unknown",
          code: { text: ae.whodrug },
          batch: sae.batchId ? { lotNumber: sae.batchId } : undefined,
        },
      },
    ],
  };
}
