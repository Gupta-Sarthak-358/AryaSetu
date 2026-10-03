import type { DataQuery, Deviation } from "../types";

export const deviations: Deviation[] = [
  { id: "DV-0117", studyId: "AYU-018", siteId: "SITE-03", type: "Visit window breach", severity: "Major", reported: "2026-10-02", status: "CAPA", description: "Visit-5 conducted +4 days outside window; participant hospitalized (unrelated). CAPA: SMS reminders + travel support." },
  { id: "DV-0116", studyId: "AYU-031", siteId: "SITE-05", type: "IP storage temperature excursion", severity: "Major", reported: "2026-09-27", status: "CAPA", description: "Pharmacy refrigerator 11.2°C for 3h overnight. Batch potency re-verified; CAPA: alarm + backup unit." },
  { id: "DV-0115", studyId: "AYU-024", siteId: "SITE-04", type: "Assessment not performed", severity: "Minor", reported: "2026-09-22", status: "Closed", description: "HAM-A assessment missed at Visit-3 due to assessor absence; repeated within 72h." },
  { id: "DV-0114", studyId: "AYU-036", siteId: "SITE-01", type: "Consent version lapse", severity: "Critical", reported: "2026-09-18", status: "CAPA", description: "One participant signed superseded ICF v1.0 after v1.2 effective. Re-consented same day; IEC notified within 7 days." },
  { id: "DV-0113", studyId: "AYU-050", siteId: "SITE-06", type: "Randomization code handling", severity: "Minor", reported: "2026-09-12", status: "Closed", description: "Sealed envelope stored in unlocked drawer overnight; no unblinding occurred." },
  { id: "DV-0112", studyId: "AYU-042", siteId: "SITE-07", type: "Eligibility deviation", severity: "Major", reported: "2026-09-05", status: "CAPA", description: "Participant enrolled with Hb 9.8 g/dL (protocol floor 10.0). Retained with PI justification; IEC informed." },
  { id: "DV-0111", studyId: "AYU-036", siteId: "SITE-02", type: "LFT sample timing", severity: "Minor", reported: "2026-08-30", status: "Closed", description: "Week-8 LFT drawn at week 8+2d for 2 participants due to local holiday." },
  { id: "DV-0110", studyId: "AYU-019", siteId: "SITE-02", type: "Dosing documentation", severity: "Major", reported: "2026-08-19", status: "CAPA", description: "Rasaushadhi administration log incomplete for 1 participant-day. Triggered enrolment pause review." },
];

export const dataQueries: DataQuery[] = [
  { id: "DQ-0441", studyId: "AYU-018", siteId: "SITE-03", field: "VAS pain score, Visit-4", raised: "2026-10-03", ageDays: 0, status: "Open" },
  { id: "DQ-0440", studyId: "AYU-024", siteId: "SITE-02", field: "HAM-A item 7 blank", raised: "2026-10-01", ageDays: 2, status: "Open" },
  { id: "DQ-0439", studyId: "AYU-036", siteId: "SITE-01", field: "Weight missing, Visit-6", raised: "2026-09-30", ageDays: 3, status: "Resolved" },
  { id: "DQ-0438", studyId: "AYU-031", siteId: "SITE-05", field: "Con-med ibuprofen dates inconsistent", raised: "2026-09-29", ageDays: 4, status: "Open" },
  { id: "DQ-0437", studyId: "AYU-050", siteId: "SITE-04", field: "Fasting glucose — units ambiguous", raised: "2026-09-28", ageDays: 5, status: "Open" },
  { id: "DQ-0436", studyId: "AYU-042", siteId: "SITE-07", field: "Hb value outside plausible range", raised: "2026-09-25", ageDays: 8, status: "Open" },
  { id: "DQ-0435", studyId: "AYU-018", siteId: "SITE-07", field: "X-ray date precedes consent", raised: "2026-09-21", ageDays: 12, status: "Open" },
  { id: "DQ-0434", studyId: "AYU-036", siteId: "SITE-03", field: "Prakriti assessment unsigned by assessor", raised: "2026-09-19", ageDays: 14, status: "Open" },
  { id: "DQ-0433", studyId: "AYU-055", siteId: "SITE-03", field: "MoCA score transcription mismatch", raised: "2026-09-17", ageDays: 16, status: "Open" },
  { id: "DQ-0432", studyId: "AYU-011", siteId: "SITE-04", field: "eGFR formula version discrepancy", raised: "2026-09-15", ageDays: 18, status: "Resolved" },
];
