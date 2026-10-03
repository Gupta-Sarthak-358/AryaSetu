# AryaSetu — SIH 2026 Idea Presentation: Slide-by-Slide Content Report

**Source template:** `SIH2026-IDEA-Presentation-Format (1).pptx` — 6 slides max including title; points/diagrams/infographics only, no paragraphs; upload as PDF.

**Design language for slides (match the live demo):** near-black `#0a0a0b` background, flat panels `#121214` with 1px hairline `#222226`, Inter for text, JetBrains Mono for IDs/numbers, status colors emerald `#34d399` / amber `#fbbf24` / red `#f87171`. Screenshots from the live demo should be placed inside a flat hairline browser-frame mockup.

**Demo URLs referenced throughout (replace after deploy):** homepage `/`, command center `/dashboard`, SAE workspace `/safety/SAE-2026-041`, batch trace `/batches`, audit `/audit`, interop `/interop`.

---

## SLIDE 1 — TITLE PAGE

**On-slide content:**

- Problem Statement ID: **SIH26046**
- Problem Statement Title: **AIIA Clinical Trials Dashboard — real-time, cloud-based, GCP-compliant CTMS for Ayurveda research**
- Theme: **MedTech / BioTech / HealthTech**
- PS Category: **Software**
- Team ID: _(fill from portal)_
- Team Name: _(registered name)_
- Product name: **ARYASETU** — tagline: *"Every Ayurveda trial. One auditable truth."*
- Small strip: `Ministry of Ayush · All India Institute of Ayurveda · NPvCC for ASU&H drugs`

**Visual:** AryaSetu wordmark + one full-bleed screenshot of the Command Center dark UI (right half), compliance chip strip along the bottom (GCP-ASU · NDCT 2019 · CTRI · CDISC · FHIR R4 · DPDP 2023).

---

## SLIDE 2 — IDEA TITLE + PROPOSED SOLUTION

**Idea title:** AryaSetu — the National Clinical Trial Management System for Ayurveda research, with NPvCC pharmacovigilance and an NDCT-2019 statutory clock engine built in.

**Detailed explanation of the proposed solution (on-slide bullets):**

- One real-time, cloud CTMS for AIIA's entire portfolio — replaces spreadsheet tracking with a single role-aware, auditable system of record.
- Tracks every study across its lifecycle: protocol → IEC approval → CTRI registration → site activation → screening → enrolment → visits → deviations → data queries → milestones → close-out.
- Integrated NPvCC pharmacovigilance: AE/SAE capture, MedDRA/WHODrug coding (demo dictionaries), WHO-UMC + Naranjo dual causality, DSMB signal feed.
- Standards as working artifacts: HL7 FHIR R4 bundles, CDISC SDTM/ADaM + Define-XML exports — inspectable in the demo, not logos.
- 7-role RBAC with study-level ACL + hash-chained ALCOA+ audit trail; consent versioning and DPDP 2023 privacy controls.

**How it addresses the problem (on-slide bullets):**

- **Delayed decisions** → Live Command Center: 6 portfolio KPIs, priority action queue ordered by statutory urgency, event stream.
- **Missed reporting timelines** → Statutory clock engine computes every NDCT 2019 deadline from time of awareness (24h → 14d → 30d → 60d → 90d → 30d payment) with red countdown for the 24-hour SAE rule.
- **Compliance risk** → CTRI/IEC register with expiry alerts; every grant, denial and edit written to a tamper-evident hash chain — verifiable in one click.
- **No interoperability today** → FHIR R4 (ResearchStudy/Subject/AdverseEvent/Consent/Medication) + SDTM DM/AE with Prakriti as supplemental qualifier.

**Innovation and uniqueness (on-slide bullets — these are the winning edge):**

- **Batch-to-bedside traceability (first in any SIH26046 entry):** formulation lot → QC/heavy-metal certificates → sites shipped → participants dosed → linked AEs. Demo: Batch B-1142 cluster rule fired at 3 hepatic AEs/30 days.
- **Full safety-to-compensation chain:** competitors show at most a 24h countdown; AryaSetu models the complete NDCT chain through EC opinion, expert committee, LA order and payment.
- **Ayurveda-native data model:** Prakriti/Agni as first-class fields, draft Ayush-CT FHIR profile, NAMASTE ↔ ICD-11 TM2 dual coding direction.
- **Honest-scope engineering:** FAERS-style data-limitations banner, EVDAS-style ROR disproportionality screening, no compliance claim outruns the code.

**Diagrams to place:**

1. **Platform map (center):** hub-and-spoke — center "AryaSetu data spine (audit-chained)", four surrounding module boxes: Trial Command / Safety·NPvCC / Interoperability / Governance.
2. **Lifecycle ribbon:** 10-node horizontal stepper (protocol → IEC → CTRI → activation → enrolment → visits → deviations → queries → close-out) with done/current/pending coloring from the study record page.
3. **Screenshot:** Command Center dashboard (left or right half).

---

## SLIDE 3 — TECHNICAL APPROACH

**Technologies (on-slide bullets):**

- **Frontend (built & demo-ready):** Next.js 16 + TypeScript + Tailwind v4 + Recharts; flat "government ops" design system (Inter + JetBrains Mono).
- **Data (now):** typed mock layer — 12 studies, 8 sites, 14 AEs, 3 SAEs with full timelines, 6 formulation batches, 2,418-record audit chain demo.
- **Data (production path):** PostgreSQL + Drizzle ORM migrations; PGlite for tests; India-resident cloud (ISO 27001, CERT-In posture).
- **Interop:** FHIR R4 JSON bundles; SDTM/ADaM export service; Define-XML generator; ABDM blueprint (HIP/HIU adapters, not connected — stated honestly).
- **Security path:** OIDC + MFA, Argon2id, route-level permission checks + study ACL, hash-chained audit with HSM-bound keys.

**Methodology / process (on-slide bullets):**

- Staged per the PS: **Stage 1** core tracking + KPI MVP (this demo) → **Stage 2** EDC/FHIR + pharmacovigilance module → **Stage 3** CDISC submission export + advanced analytics.
- Rule-engine-first: every statutory deadline (NDCT, CTRI six-monthly, IEC expiry) is a computed rule with alert states — ML only after rules are proven.
- Evaluation-ready: judged on data accuracy/integrity, safety-reporting timeliness, interoperability conformance, access-control & audit completeness — each mapped to a visible demo artifact.

**Diagrams to place:**

1. **Architecture flow (main diagram):** Roles (7 personas) → Next.js app → permission check + study ACL → services (KPI / safety clock / batch trace / exports) → Postgres; side-channel: every mutation → hash-chained audit store; edge: FHIR bundle endpoint + SDTM/Define exporters + ABDM blueprint (dashed).
2. **NDCT clock timeline:** horizontal timeline for SAE-2026-041 — T0 awareness 02-Oct 21:12 → 24h initial (red, 06:12 left) → 14d full → 30d EC → 60d expert → 90d LA → 30d payment.
3. **Batch trace chain:** B-1142 → QC certs (assay FAIL highlighted) → 3 sites (2,700 vials) → 6 participants → 3 hepatic AEs → cluster rule → NPvCC signal review.
4. **Audit hash chain:** 4 linked blocks with hash→prev-hash arrows; one block marked "tamper → chain INVALID" (from the working tamper simulation).

---

## SLIDE 4 — FEASIBILITY AND VIABILITY

**Feasibility analysis (on-slide bullets):**

- Working prototype already live: 29 routes, 13 screens, full demo dataset — feasibility proven, not projected.
- All required standards have open specifications: FHIR R4, CDISC SDTM/ADaM/Define-XML, CTRI public records for metadata seeding.
- No proprietary dependency at MVP: MedDRA/WHODrug shown as demo dictionaries with honest labeling; licensed dictionaries are a procurement, not a research, item.
- Hosting: India-resident cloud with ISO 27001 / CERT-In posture; DPDP-aligned data minimisation (zero identifier columns in participant schema).
- Team capability: full-stack TypeScript delivery with test-gated task discipline.

**Potential challenges and risks + strategies (on-slide table, 2 columns):**

| Challenge / risk | Strategy |
|---|---|
| MedDRA/WHODrug licensing for production | Demo dictionaries now; budget license in Phase 2; design isolates terminology service |
| ABDM sandbox access & timelines | Blueprint documented; adapter interface ready; connect when sandbox granted — never claimed as done |
| NDCT applicability to ASU trials is nuanced | Versioned governing-regime engine records the decision per study (GCP-ASU / ICMR / NDCT) |
| Site digitization maturity varies | Coordinator-first UX, synthetic training data, staged onboarding by site readiness |
| Data migration from spreadsheets | CSV importers + CTRI metadata seeding; dual-run period with verification |
| Claim inflation (judges penalize overclaims) | Hard rule: no compliance claim outruns code — limitations stated on every module |

**Diagrams to place:**

1. **3-stage roadmap swimlane:** Stage 1 MVP (done — checkmarks) → Stage 2 EDC/FHIR + PV → Stage 3 CDISC export + analytics, with rough quarters.
2. **Risk heat-strip:** 6 risks as small tiles colored by severity with 3-word mitigations.

---

## SLIDE 5 — IMPACT AND BENEFITS

**Impact on target audience (on-slide bullets):**

- **AIIA leadership:** portfolio truth in real time — one screen instead of weekly spreadsheet collation; CTRI compliance 96% → 100% visibility.
- **NPvCC:** SAE initial reports inside the 24-hour statutory window, every time — median demo reporting time 7.5h vs 24h limit; batch-cluster signals caught in days, not quarters.
- **Sites & investigators:** one workflow for enrolment, visits, deviations and queries; fewer missed windows (demo: 12 aged queries surfaced instantly).
- **Ethics Committee:** SAE review queue with compensation-opinion clocks; consent-version tracking across amendments (demo: 96 re-consents tracked to zero-pending).
- **Regulator:** read-only oversight with audit-chain verification — trust by inspection, not by report.

**Benefits (on-slide bullets, grouped):**

- **Social:** safer Ayurveda trials → stronger public trust; patient-safety signals (Hy's law screen, hepatotoxic herbs) caught by rule, not by chance; supports global scientific credibility of Ayurveda research.
- **Economic:** eliminates duplicate tooling and manual reporting labor at 8+ sites; earlier signal detection reduces trial-halt and liability costs; submission-ready exports cut CRO-style outsourcing.
- **Environmental:** paperless consent/version tracking, zero physical safety-report routing.
- **Sectoral:** reusable template for all ASU&H research bodies (CCRAS, CCRH, state colleges) — one national platform pattern.

**Diagrams to place:**

1. **Stakeholder impact map:** center AryaSetu; 5 nodes (Leadership, NPvCC, Sites, EC, Regulator) each with 1 metric (24h window, 96% CTRI, 12 aged queries, 96 re-consents, 1-click verify).
2. **Before/after strip:** "Spreadsheet week" vs "Live minute" — 5-row comparison (portfolio view, SAE clock, batch investigation, audit proof, CTRI status).

---

## SLIDE 6 — RESEARCH AND REFERENCES

**On-slide content (compact 2-column list):**

- Clinical Trials Registry – India (CTRI) — ctri.nic.in (public trial records; registration/update requirements)
- New Drugs and Clinical Trials Rules, 2019 — SAE reporting timelines & compensation chain (24h / 14d / 30d / 60d / 90d / 30d)
- GCP-ASU guidelines (Ministry of Ayush) + ICMR National Ethical Guidelines, 2017
- CDISC standards — CDASH, SDTM, ADaM, Define-XML — cdisc.org
- HL7 FHIR R4 — ResearchStudy, ResearchSubject, AdverseEvent, Consent resources
- ABDM building blocks (ABHA, HIP/HIU) — sandbox blueprint
- DPDP Act 2023 & Rules 2025 — consent, purpose limitation, data minimisation
- WHO-UMC causality categories; Naranjo algorithm (WHO-UMC vs Naranjo agreement κ ≈ 0.46)
- EudraVigilance EVDAS disproportionality screening (ROR); FDA FAERS public dashboard data-limitations framing
- Hy's law / liver sentinel heuristics; documented Guduchi & Bakuchi hepatotoxicity signals
- ICH E6(R3) — critical-to-quality monitoring direction
- Platform-design references: ClinicalTrials.gov (record furniture), Veeva Vault CTMS (task/monitoring widgets), Palantir Foundry (ops design register)
- SIH26046 competitor scan: 11 public repos analyzed; zero batch traceability, zero full NDCT chain, zero real FHIR↔CDISC mapping — gap evidence for A1–A3

**Note for slide:** add "Demo: <deployed URL> · synthetic data only · code: <GitHub URL>" footer line.

---

## Speaker-notes master script (90 seconds, matches demo flow)

1. *(10s)* Problem: AIIA runs Ayurveda's national trial portfolio + NPvCC on spreadsheets — missed timelines, no single truth.
2. *(15s)* AryaSetu: one real-time CTMS — Command Center shows 12 studies, 1,528 enrolled, and right now, one red card: SAE-2026-041 with 6h12m left on its 24-hour NDCT clock.
3. *(15s)* Open the SAE: full statutory chain to compensation — 24h, 14d, 30d EC, 60d expert, 90d order — plus dual causality (WHO-UMC Probable, Naranjo 7/13) and CIOMS-I export.
4. *(15s)* One click from the SAE to Batch B-1142: assay variance, 3 sites, 6 participants dosed, 3 hepatic AEs in 30 days — cluster rule fired. Nobody else has batch-to-bedside.
5. *(10s)* Tamper simulation on the audit chain — chain goes INVALID live. ALCOA+ by construction.
6. *(10s)* Interop: real FHIR R4 bundle and SDTM with Prakriti — Ayurveda-native data, standards as artifacts.
7. *(10s)* Honest scope: demo dictionaries, ABDM blueprint, no certification claims — then the staged build plan.
8. *(5s)* Close: evaluation axes — integrity, timeliness, interoperability, access control — each was just demonstrated.

## Screenshot capture checklist (from live demo, 1440px+ width)

- [ ] Homepage hero + metrics band
- [ ] Command Center (full)
- [ ] SAE-2026-041 workspace (24h clock + chain visible)
- [ ] Batch B-1142 trace (4-column trace)
- [ ] Audit chain: VERIFIED state + one INVALID state shot
- [ ] Interop: FHIR bundle + SDTM DM with Prakriti column
- [ ] Study record AYU-036 with lifecycle stepper
