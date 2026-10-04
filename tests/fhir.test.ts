import { describe, expect, it } from "vitest";
import { buildAdverseEventFhir, buildResearchStudy, buildSaeBundle } from "@/lib/server/fhir";
import { studies } from "@/lib/data/studies";
import { adverseEvents, saes } from "@/lib/data/safety";

const study = studies.find((s) => s.id === "AYU-036")!;
const sae = saes.find((s) => s.id === "SAE-2026-041")!;
const ae = adverseEvents.find((a) => a.id === sae.aeId)!;

describe("FHIR R4 builders", () => {
  it("builds a ResearchStudy with CTRI identifier", () => {
    const rs = buildResearchStudy(study);
    expect(rs.resourceType).toBe("ResearchStudy");
    expect(rs.id).toBe("AYU-036");
    expect(rs.identifier[0].system).toBe("https://ctri.nic.in");
    expect(rs.identifier[0].value).toBe(study.ctriNumber);
    expect(rs.site).toHaveLength(study.sites.length);
  });

  it("builds an AdverseEvent with WHO-UMC, Naranjo and batch extensions", () => {
    const fhir = buildAdverseEventFhir(ae, sae);
    expect(fhir.resourceType).toBe("AdverseEvent");
    expect(fhir.id).toBe("SAE-2026-041");
    expect(fhir.suspectEntity[0].causality.assessment.coding[0].code).toBe("probable");
    const naranjo = fhir.extension.find((e) => e.url.includes("naranjo-score"));
    expect(naranjo?.valueInteger).toBe(7);
    const batch = fhir.extension.find((e) => e.url.includes("batch-lot"));
    expect(batch?.valueString).toBe("B-1142");
  });

  it("builds a collection Bundle with 4 linked resources", () => {
    const bundle = buildSaeBundle(sae, ae, study);
    expect(bundle.resourceType).toBe("Bundle");
    expect(bundle.type).toBe("collection");
    expect(bundle.entry).toHaveLength(4);
    const types = bundle.entry.map((e) => e.resource.resourceType);
    expect(types).toEqual(["ResearchStudy", "ResearchSubject", "AdverseEvent", "Medication"]);
  });
});
