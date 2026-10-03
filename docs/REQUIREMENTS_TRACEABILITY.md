# Requirements Traceability — SIH26046 → AryaSetu

Every "Expected solution" line from the PS, mapped to the artifact that demonstrates it. Status: **DEMO** (working on synthetic data) · **DESIGNED** (documented, not built) · **STATED** (posture only, no claim of certification).

| # | PS requirement | Where demonstrated | Status |
|---|---|---|---|
| 1 | Real-time portfolio view with per-study drill-down | `/dashboard` (12 studies, KPI tiles, event feed) → `/studies/[id]` | DEMO |
| 2 | Configurable KPIs and alerting | 6 KPI tiles; rule-engine alerts (SAE clock, CTRI overdue, IEC expiry, batch cluster) in Priority Action Queue | DEMO |
| 3 | Strictly role-based access (7 roles) | `/login` personas; `/admin` permission matrix + study ACL; role switcher in topbar | DEMO (enforcement: DESIGNED, see SECURITY.md) |
| 4 | Immutable, ALCOA+ audit trail | `/audit` hash chain + live tamper simulation → INVALID on edit | DEMO |
| 5 | CDISC-aligned data models (CDASH/SDTM/ADaM/Define-XML) | `/interop` SDTM DM/AE previews with Prakriti qualifier, Define-XML snippet; CDASH: Phase 3 | DEMO (SDTM/ADaM/Define) · DESIGNED (CDASH) |
| 6 | HL7 FHIR R4 / ABDM interoperability with EDC and HIS | `/interop` live FHIR Bundle (ResearchStudy, ResearchSubject, AdverseEvent, Consent, Medication); ABDM blueprint | DEMO (FHIR) · DESIGNED (ABDM — not connected, stated honestly) |
| 7 | Pharmacovigilance module reflecting NPvCC role | `/safety` — AE register, MedDRA/WHODrug (demo dictionaries), dual causality (WHO-UMC + Naranjo), ROR disproportionality, SAE register | DEMO |
| 8 | Regulatory-timeline tracking (NDCT 2019) | `/safety/SAE-2026-041` — computed 24h/14d/30d/60d/90d/payment chain with live countdown | DEMO |
| 9 | CTRI and ethics/regulatory milestone tracking | `/regulatory` — CTRI register (12 studies), IEC expiry alerts, EC workload, NDCT applicability | DEMO |
| 10 | Informed-consent management | `/consent` — ICF versions per study, re-consent tracking (96 pending on AYU-019), AV consent counts | DEMO |
| 11 | DPDP Act 2023 privacy controls | `/consent` — purpose tags, zero identifier columns, withdrawal propagation, minimisation posture | DEMO (design) · STATED (operations) |
| 12 | e-Signature and data-integrity controls per GCP | Hash-bound e-signature events in audit chain (e.g., seq #2 CRF sign-off) | DEMO (hash-bound) · DESIGNED (qualified eSign) |
| 13 | Export submission-ready datasets (SDTM/ADaM, Define-XML) | `/interop` — SDTM DM/AE tables, ADaM ADSL note, Define-XML 2.1 snippet | DEMO (preview) |
| 14 | Tailored dashboards per role | 7 personas with distinct scope; per-role modules (NPvCC desk, EC queue, monitor compliance) | DEMO |
| 15 | Secure, data-resident cloud (ISO 27001, CERT-In) | Hosting posture only | STATED — no certification claimed |
| 16 | GCP-ASU / ICMR / NDCT compliance | Governing-regime engine per study (versioned classification) | DESIGNED |
| 17 | Staged build: MVP → EDC/FHIR + PV → CDISC export + analytics | `docs/DEVELOPMENT_PLAN.md`; Stage 1 = this build | DEMO (Stage 1) |

## Evaluation criteria → demo artifact

| SIH evaluation axis | Artifact |
|---|---|
| Data accuracy and integrity | Audit chain tamper simulation; ALCOA+ coverage grid |
| Timeliness of safety and regulatory reporting | 24h SAE countdown (06:12 remaining); median demo reporting 7.5h; CTRI overdue alert |
| Interoperability conformance | FHIR R4 bundle JSON; SDTM DM/AE with Prakriti; Define-XML |
| Access-control and audit completeness | Permission matrix; study ACL; deny-by-default posture; every denial logged |
