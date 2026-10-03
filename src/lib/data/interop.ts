export const fhirBundle = {
  resourceType: "Bundle",
  id: "ayu-036-sae-041",
  type: "collection",
  timestamp: "2026-10-03T14:58:11+05:30",
  entry: [
    {
      resource: {
        resourceType: "ResearchStudy",
        id: "AYU-036",
        identifier: [{ system: "https://ctri.nic.in", value: "CTRI/2026/04/084502" }],
        title: "Guduchi (Tinospora cordifolia) hepatic safety registry",
        status: "active",
        phase: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/research-study-phase", code: "phase-4" }] },
        sponsor: { reference: "Organization/AIIA" },
      },
    },
    {
      resource: {
        resourceType: "ResearchSubject",
        id: "PT-036-0118",
        study: { reference: "ResearchStudy/AYU-036" },
        status: "on-study",
        consent: { reference: "Consent/ICF-036-0118-v1.2" },
      },
    },
    {
      resource: {
        resourceType: "AdverseEvent",
        id: "SAE-2026-041",
        subject: { reference: "ResearchSubject/PT-036-0118" },
        date: "2026-10-01",
        seriousness: { coding: [{ code: "serious" }] },
        severity: { coding: [{ code: "severe" }] },
        event: { coding: [{ system: "https://www.meddra.org", code: "10024681", display: "Hepatic enzyme increased (DEMO dictionary)" }] },
        suspectEntity: [{ instance: { reference: "Medication/B-1142" }, causality: { assessment: { coding: [{ system: "WHO-UMC", code: "probable" }] } } }],
      },
    },
    {
      resource: {
        resourceType: "Medication",
        id: "B-1142",
        code: { text: "Guduchi Ghana Vati 500 mg — Batch B-1142" },
        batch: { lotNumber: "B-1142", expirationDate: "2028-03-13" },
      },
    },
  ],
};

export const sdtmAePreview = [
  { STUDYID: "AYU-036", USUBJID: "036-0118", AESEQ: "1", AETERM: "ALT/AST elevation >3x ULN", AEPTCD: "10024681", AESER: "Y", AESEV: "SEVERE", AEREL: "PROBABLE", AEOUT: "NOT RECOVERED", AESTDTC: "2026-10-01", AEBODSYS: "Hepatobiliary" },
  { STUDYID: "AYU-036", USUBJID: "036-0074", AESEQ: "1", AETERM: "ALT 2.4x ULN", AEPTCD: "10001551", AESER: "N", AESEV: "MODERATE", AEREL: "POSSIBLE", AEOUT: "RECOVERING", AESTDTC: "2026-09-24", AEBODSYS: "Hepatobiliary" },
  { STUDYID: "AYU-031", USUBJID: "031-0177", AESEQ: "1", AETERM: "Acute gastritis", AEPTCD: "10017853", AESER: "Y", AESEV: "MODERATE", AEREL: "POSSIBLE", AEOUT: "RECOVERED", AESTDTC: "2026-09-15", AEBODSYS: "Gastrointestinal" },
  { STUDYID: "AYU-024", USUBJID: "024-0088", AESEQ: "1", AETERM: "Somnolence", AEPTCD: "10041349", AESER: "N", AESEV: "MILD", AEREL: "PROBABLE", AEOUT: "ONGOING", AESTDTC: "2026-09-28", AEBODSYS: "Nervous system" },
];

export const sdtmDmPreview = [
  { STUDYID: "AYU-036", USUBJID: "036-0118", SITEID: "SITE-02", AGE: "58", SEX: "F", PRAKRITI: "Pitta-Vata", ARM: "Guduchi Ghana Vati", RFSTDTC: "2026-07-26" },
  { STUDYID: "AYU-036", USUBJID: "036-0074", SITEID: "SITE-01", AGE: "47", SEX: "M", PRAKRITI: "Pitta", ARM: "Guduchi Ghana Vati", RFSTDTC: "2026-06-03" },
  { STUDYID: "AYU-024", USUBJID: "024-0088", SITEID: "SITE-01", AGE: "34", SEX: "F", PRAKRITI: "Vata", ARM: "Ashwagandha 300mg", RFSTDTC: "2026-05-19" },
  { STUDYID: "AYU-031", USUBJID: "031-0177", SITEID: "SITE-05", AGE: "44", SEX: "M", PRAKRITI: "Kapha-Pitta", ARM: "AYUSH-64 + SC", RFSTDTC: "2026-06-30" },
];

export const defineXmlSnippet = `<ItemGroupDef OID="IG.AE" Name="AE" Domain="AE"
  Purpose="Tabulation" def:Structure="One record per adverse event per subject">
  <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes"/>
  <ItemRef ItemOID="IT.AE.USUBJID" Mandatory="Yes"/>
  <ItemRef ItemOID="IT.AE.AETERM" Mandatory="Yes"/>
  <ItemRef ItemOID="IT.AE.AEPTCD" Mandatory="No"
    Comment="MedDRA PT code — DEMO dictionary, not licensed"/>
  <ItemRef ItemOID="IT.AE.AEREL" Mandatory="Yes"
    Comment="WHO-UMC causality category"/>
  <ItemRef ItemOID="IT.AE.AESER" Mandatory="Yes"/>
</ItemGroupDef>`;

export const interopResources = [
  { name: "ResearchStudy", mapped: true, count: 12, note: "Full portfolio, CTRI identifier bound" },
  { name: "ResearchSubject", mapped: true, count: 1528, note: "De-identified; consent reference linked" },
  { name: "AdverseEvent", mapped: true, count: 21, note: "WHO-UMC causality extension + batch reference" },
  { name: "Consent", mapped: true, count: 1528, note: "Versioned ICF, DPDP purpose tag" },
  { name: "Medication", mapped: true, count: 9, note: "Batch/lot-level — enables batch traceability" },
  { name: "Observation (Prakriti)", mapped: true, count: 1528, note: "Draft Ayush-CT profile — NAMASTE/TM2 dual-coded" },
  { name: "Patient", mapped: false, count: 0, note: "Intentionally omitted — DPDP data minimisation" },
];
