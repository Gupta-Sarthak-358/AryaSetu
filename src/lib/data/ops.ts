import type { Alert, AuditEntry, ConsentRecord, TickerEvent } from "../types";
import { fakeHash } from "../utils";

const rawAudit: Omit<AuditEntry, "hash" | "prevHash">[] = [
  { seq: 1, ts: "2026-10-03T14:58:11+05:30", actor: "Dr. Sameer Joshi", role: "Pharmacovigilance", action: "SAE triage updated", entity: "SAE", entityId: "SAE-2026-041", before: "Causality: Possible", after: "Causality: Probable (WHO-UMC)", reason: "Dechallenge positive on repeat LFT" },
  { seq: 2, ts: "2026-10-03T14:12:44+05:30", actor: "Dr. Meera Kulkarni", role: "PI", action: "e-Signature applied", entity: "CRF", entityId: "AYU-024 / PT-024-0151 / Visit-6", before: "Unsigned", after: "Signed v1.3 (hash-bound)", reason: "Source data verified" },
  { seq: 3, ts: "2026-10-03T13:47:02+05:30", actor: "System", role: "Admin", action: "Alert raised", entity: "Milestone", entityId: "AYU-031 / CTRI six-monthly update", before: "Due 28-Sep", after: "OVERDUE +5d", reason: "Rule engine: CTRI-update-sla" },
  { seq: 4, ts: "2026-10-03T12:31:56+05:30", actor: "Sister Kavitha Nair", role: "Coordinator", action: "Participant enrolled", entity: "Participant", entityId: "AYU-050 / PT-050-0174", before: "Screened", after: "Enrolled (consent v2.2, Hindi)", reason: null },
  { seq: 5, ts: "2026-10-03T11:58:20+05:30", actor: "Shri Rohan Deshpande", role: "Monitor", action: "Data query raised", entity: "Query", entityId: "DQ-0441 (AYU-018, SITE-03)", before: null, after: "Open — VAS score missing, Visit-4", reason: "SDV discrepancy" },
  { seq: 6, ts: "2026-10-03T10:22:37+05:30", actor: "Dr. Rajesh Bhatt", role: "PI", action: "SAE initial report drafted", entity: "SAE", entityId: "SAE-2026-041", before: "Draft", after: "Ready for submission (24h clock: 10h50m remaining at draft)", reason: "NDCT 2019 initial report" },
  { seq: 7, ts: "2026-10-03T09:44:15+05:30", actor: "Prof. Indira Rao", role: "Ethics", action: "SAE review assigned", entity: "SAE", entityId: "SAE-2026-041", before: "Unassigned", after: "Assigned to IEC panel E-2", reason: "Expedited review requested" },
  { seq: 8, ts: "2026-10-02T17:26:49+05:30", actor: "System", role: "Admin", action: "Batch signal rule fired", entity: "Batch", entityId: "B-1142", before: "2 hepatic AEs", after: "3 hepatic AEs — cluster threshold met", reason: "Rule: same-batch same-SOC ≥3 in 30d" },
  { seq: 9, ts: "2026-10-02T16:03:28+05:30", actor: "Dr. Sameer Joshi", role: "Pharmacovigilance", action: "WHO-UMC causality recorded", entity: "AE", entityId: "AE-1035", before: null, after: "Possible (5 criteria met)", reason: null },
  { seq: 10, ts: "2026-10-02T15:40:59+05:30", actor: "Sister Kavitha Nair", role: "Coordinator", action: "Consent re-affirmation logged", entity: "Consent", entityId: "AYU-031 / PT-031-0201", before: "Consent v2.0", after: "Consent v2.1 re-affirmed", reason: "Protocol amendment 3" },
  { seq: 11, ts: "2026-10-02T14:19:33+05:30", actor: "Dr. Anil Tripathi", role: "PI", action: "Deviation reported", entity: "Deviation", entityId: "DV-0117 (AYU-018)", before: null, after: "Major — Visit window breach +4d", reason: "Participant hospitalization (unrelated)" },
  { seq: 12, ts: "2026-10-02T11:05:14+05:30", actor: "System", role: "Admin", action: "CTRI sync (simulated)", entity: "Study", entityId: "AYU-036", before: "Recruiting", after: "Recruiting — status verified", reason: "Daily CTRI metadata check" },
];

export const auditChain: AuditEntry[] = (() => {
  let prev = "0".repeat(40);
  return rawAudit.map((e) => {
    const hash = fakeHash(`${e.seq}|${e.ts}|${e.actor}|${e.action}|${e.entityId}|${prev}`);
    const entry: AuditEntry = { ...e, prevHash: prev, hash };
    prev = hash;
    return entry;
  });
})();

export const alerts: Alert[] = [
  { id: "AL-01", severity: "critical", title: "SAE-2026-041 — initial report clock running (24h rule)", studyId: "AYU-036", ts: "2026-10-03T14:58:11+05:30", action: "Open SAE workspace", href: "/safety/SAE-2026-041" },
  { id: "AL-02", severity: "warning", title: "CTRI six-monthly update overdue by 5 days", studyId: "AYU-031", ts: "2026-10-03T13:47:02+05:30", action: "Open CTRI tracker", href: "/regulatory" },
  { id: "AL-03", severity: "warning", title: "Batch B-1142 hepatic AE cluster threshold met (3 in 30d)", studyId: "AYU-036", ts: "2026-10-02T17:26:49+05:30", action: "Open batch trace", href: "/batches" },
  { id: "AL-04", severity: "info", title: "Monitoring visit due at IPGT&RA Jamnagar (AYU-024)", studyId: "AYU-024", ts: "2026-10-03T09:12:00+05:30", action: "View study", href: "/studies/AYU-024" },
  { id: "AL-05", severity: "warning", title: "IEC approval for AYU-018 expires in 26 days", studyId: "AYU-018", ts: "2026-10-03T08:00:00+05:30", action: "View regulatory", href: "/regulatory" },
  { id: "AL-06", severity: "info", title: "47 data queries open portfolio-wide; 12 aged > 14 days", studyId: null, ts: "2026-10-03T07:30:00+05:30", action: "Open data quality", href: "/studies" },
];

export const consentRecords: ConsentRecord[] = [
  { studyId: "AYU-024", version: "ICF v2.1", language: "EN / HI / GU", active: 191, reconsentPending: 0, avConsent: 12, dpdpPurpose: "Interventional trial — anxiety", status: "Current" },
  { studyId: "AYU-031", version: "ICF v2.1 (Amendment 3)", language: "EN / HI / GU / KN", active: 198, reconsentPending: 16, avConsent: 8, dpdpPurpose: "Interventional trial — post-COVID fatigue", status: "Amendment Pending" },
  { studyId: "AYU-036", version: "ICF v1.2", language: "EN / HI / GU", active: 233, reconsentPending: 0, avConsent: 21, dpdpPurpose: "Safety registry — Guduchi", status: "Current" },
  { studyId: "AYU-018", version: "ICF v1.0", language: "EN / HI / RJ / UP", active: 220, reconsentPending: 0, avConsent: 30, dpdpPurpose: "Pragmatic trial — osteoarthritis", status: "Current" },
  { studyId: "AYU-042", version: "ICF v1.1", language: "EN / HI / AS", active: 88, reconsentPending: 4, avConsent: 0, dpdpPurpose: "Interventional trial — anaemia (women)", status: "Current" },
  { studyId: "AYU-019", version: "ICF v1.3 (Rasaushadhi risk)", language: "EN / HI / GU", active: 96, reconsentPending: 96, avConsent: 44, dpdpPurpose: "Sentinel safety — Naga Bhasma", status: "Amendment Pending" },
];

export const tickerEvents: TickerEvent[] = [
  { ts: "14:58", text: "SAE-2026-041 causality updated to Probable (WHO-UMC) — NPvCC", kind: "safety" },
  { ts: "14:12", text: "Dr. Meera Kulkarni applied e-signature — AYU-024 CRF Visit-6", kind: "audit" },
  { ts: "13:47", text: "Rule engine: CTRI update AYU-031 now OVERDUE (+5d)", kind: "regulatory" },
  { ts: "12:31", text: "PT-050-0174 enrolled at Arya Vaidya Sala, Kottakkal (AYU-050)", kind: "enrolment" },
  { ts: "11:58", text: "Query DQ-0441 raised — AYU-018 VAS score missing (SDV)", kind: "query" },
  { ts: "10:22", text: "SAE-2026-041 initial report drafted — 24h clock running", kind: "safety" },
  { ts: "09:44", text: "IEC panel E-2 assigned to SAE-2026-041 expedited review", kind: "regulatory" },
  { ts: "09:12", text: "Visit-4 completed — PT-024-0166, NIA Jaipur (AYU-024)", kind: "visit" },
  { ts: "08:37", text: "Batch B-1142 cluster rule fired: 3 hepatic AEs in 30 days", kind: "safety" },
  { ts: "08:02", text: "PT-042-0088 enrolled at State Ayurvedic College, Guwahati (AYU-042)", kind: "enrolment" },
  { ts: "Yesterday", text: "Query DQ-0439 closed — AYU-036 missing weight entry resolved", kind: "query" },
  { ts: "Yesterday", text: "Monitoring visit report filed — AYU-031, SDM Hassan", kind: "audit" },
  { ts: "Yesterday", text: "CTRI daily sync verified — 12 studies, 1 update overdue", kind: "regulatory" },
  { ts: "Yesterday", text: "PT-055-0041 enrolled — Brahmi MCI trial, NIA Jaipur", kind: "enrolment" },
];

export const kpis = {
  activeStudies: 12,
  enrolled: 1528,
  target: 2360,
  sitesActive: 8,
  sitesTotal: 8,
  openSaes: 1,
  dataQueriesOpen: 47,
  dataQueriesAged: 12,
  ctriCompliance: 96,
  consentCompliance: 99.1,
  auditIntegrity: "VERIFIED",
  medianSaeReportHours: 7.5,
};

export const enrollmentPortfolio = [
  { month: "Apr", enrolled: 122, target: 190 },
  { month: "May", enrolled: 348, target: 520 },
  { month: "Jun", enrolled: 612, target: 860 },
  { month: "Jul", enrolled: 884, target: 1210 },
  { month: "Aug", enrolled: 1120, target: 1580 },
  { month: "Sep", enrolled: 1336, target: 1970 },
  { month: "Oct", enrolled: 1528, target: 2360 },
];

export const aeByWeek = [
  { week: "W36", nonSerious: 4, serious: 0 },
  { week: "W37", nonSerious: 3, serious: 1 },
  { week: "W38", nonSerious: 6, serious: 0 },
  { week: "W39", nonSerious: 2, serious: 1 },
  { week: "W40", nonSerious: 5, serious: 1 },
];

export const siteEnrolment = [
  { site: "AIIA New Delhi", enrolled: 402, target: 420 },
  { site: "IPGT&RA Jamnagar", enrolled: 318, target: 340 },
  { site: "NIA Jaipur", enrolled: 224, target: 300 },
  { site: "BHU Varanasi", enrolled: 176, target: 260 },
  { site: "SDM Hassan", enrolled: 118, target: 220 },
  { site: "Kottakkal", enrolled: 92, target: 180 },
  { site: "CCRAS Patna", enrolled: 47, target: 140 },
  { site: "Guwahati", enrolled: 19, target: 100 },
];

export const myTasks = [
  { id: "TSK-1187", title: "Submit SAE-2026-041 initial report (24h rule)", due: "03 Oct 21:12", studyId: "AYU-036", priority: "critical" },
  { id: "TSK-1184", title: "File CTRI six-monthly update", due: "Overdue +5d", studyId: "AYU-031", priority: "high" },
  { id: "TSK-1180", title: "Respond to query DQ-0441 — VAS score", due: "05 Oct", studyId: "AYU-018", priority: "medium" },
  { id: "TSK-1176", title: "Review re-consent plan, Amendment 3", due: "07 Oct", studyId: "AYU-031", priority: "medium" },
  { id: "TSK-1171", title: "Sign CRF pack — PT-024-0151 Visit-6", due: "08 Oct", studyId: "AYU-024", priority: "low" },
];

export const monitoringCompliance = [
  { id: "MV-0312", studyId: "AYU-024", site: "IPGT&RA Jamnagar", type: "Interim monitoring", due: "03 Oct", state: "Due today" },
  { id: "MV-0308", studyId: "AYU-036", site: "NIA Jaipur", type: "Interim monitoring", due: "29 Sep", state: "Overdue 4d" },
  { id: "MV-0301", studyId: "AYU-031", site: "SDM Hassan", type: "Trip report filing", due: "27 Sep", state: "Report late 6d" },
  { id: "MV-0299", studyId: "AYU-018", site: "BHU Varanasi", type: "Close-out visit (planned)", due: "18 Nov", state: "Scheduled" },
  { id: "MV-0295", studyId: "AYU-042", site: "CCRAS Patna", type: "Initiation visit", due: "14 Oct", state: "Scheduled" },
];
