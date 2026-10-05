# AryaSetu — SIH 2026 Idea Presentation: Slide-by-Slide Content Report

**Source template:** `SIH2026-IDEA-Presentation-Format (1).pptx` — 6 slides max including title; points/diagrams/infographics only, no paragraphs; upload as PDF.

**Design language for slides (match the live demo):** near-black `#0a0a0b` background, flat panels `#121214` with 1px hairline `#222226`, Inter for text, JetBrains Mono for IDs/numbers, status colors emerald `#34d399` / amber `#fbbf24` / red `#f87171`. Screenshots from the live demo should be placed inside a flat hairline browser-frame mockup.

**Live assets (use these exact URLs):**
- Demo: **https://arya-setu.vercel.app/** (homepage `/`, command center `/dashboard`, SAE workspace `/safety/SAE-2026-041`, batch trace `/batches`, audit `/audit`, interop `/interop`)
- Code: **https://github.com/Gupta-Sarthak-358/AryaSetu** (branch `main` = deployed build)
- Demo login: pick any persona on `/login`, password `AryaSetu@123`

**Dataset truth (keep numbers consistent across slides):**
- **12 curated studies** (full lifecycles, 8 sites, 1,528 enrolled of 2,360 target, 14+ AEs, 3 SAEs, 6 formulation batches) drive the demo narrative
- **40 real CTRI registry records** (public Ayurveda/AYUSH trials, scraped + validated) merged into the production database — 52 studies total in Neon
- All clinical data synthetic and de-identified; registry metadata is real and public

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
- Proof strip (small, mono): `LIVE DEMO arya-setu.vercel.app · CODE github.com/Gupta-Sarthak-358/AryaSetu · 24/24 TESTS GREEN`
- Small strip: `Ministry of Ayush · All India Institute of Ayurveda · NPvCC for ASU&H drugs`

**Visual:** AryaSetu wordmark + one full-bleed screenshot of the Command Center dark UI (right half), compliance chip strip along the bottom (GCP-ASU · NDCT 2019 · CTRI · CDISC · FHIR R4 · DPDP 2023).

---

## SLIDE 2 — IDEA TITLE + PROPOSED SOLUTION

**Idea title:** AryaSetu — the National Clinical Trial Management System for Ayurveda research, with NPvCC pharmacovigilance, an NDCT-2019 statutory clock engine, and batch-to-bedside traceability built in.

**Detailed explanation of the proposed solution (on-slide bullets):**

- One real-time, cloud CTMS for AIIA's entire portfolio — replaces spreadsheet tracking with a single role-aware, auditable system of record. **Deployed and clickable today.**
- Tracks every study across its lifecycle: protocol → IEC approval → CTRI registration → site activation → screening → enrolment → visits → deviations → data queries → milestones → close-out.
- Integrated NPvCC pharmacovigilance: AE/SAE intake workflow, MedDRA/WHODrug coding (demo dictionaries), WHO-UMC + Naranjo dual causality, disproportionality screening (ROR/PRR/χ²) plus exposure-adjusted person-time rates.
- Standards as working artifacts: live FHIR R4 endpoints (`/api/fhir/...`, `application/fhir+json`), CDISC SDTM DM/AE/EX + ADaM ADSL downloads, Define-XML, ODM drafts, real **binary AE.xpt (SAS Transport v5)** generation.
- 7-role RBAC with database-enforced study-level ACL (verified: 403s logged) + SHA-256 hash-chained ALCOA+ audit trail; consent versioning and DPDP 2023 privacy controls.

**How it addresses the problem (on-slide bullets):**

- **Delayed decisions** → Live Command Center: portfolio KPIs, telemetry tabs, priority action queue computed by a live rule engine, event stream.
- **Missed reporting timelines** → Statutory clock engine computes every NDCT 2019 deadline from time of awareness (24h → 14d → 30d → 60d → 90d → 30d payment); overdue clocks escalate automatically.
- **Compliance risk** → CTRI/IEC register with expiry alerts; every grant, denial and edit written to a database-backed hash chain — re-verifiable in one click.
- **No interoperability today** → FHIR R4 (ResearchStudy/Subject/AdverseEvent/Consent/Medication) + SDTM DM/AE with Prakriti as supplemental qualifier + NAMASTE ↔ ICD-11 TM2 draft dual-coding.

**Innovation and uniqueness (on-slide bullets — these are the winning edge):**

- **Batch-to-bedside traceability (first in any SIH26046 entry):** formulation lot → QC/heavy-metal certificates → sites shipped → participants dosed → linked AEs. Demo: Batch B-1142 cluster rule fired at 3 hepatic AEs/30 days.
- **Full safety-to-compensation chain:** competitors show at most a 24h countdown; AryaSetu models the complete NDCT chain through EC opinion, expert committee, LA order and payment.
- **Ayurveda-native data model:** Prakriti/Agni as first-class fields (incl. live Cohen's κ inter-rater reliability QA per study), draft Ayush-CT FHIR profile, NAMASTE ↔ ICD-11 TM2 dual coding.
- **Real binary submission artifacts:** working `.xpt` writer with round-trip verification — nobody else in the field exports anything machine-readable.
- **Honest-scope engineering:** FAERS-style data-limitations banner, demo dictionaries labelled, ABDM stated as blueprint — no compliance claim outruns the code.

**Diagrams to place:**

1. **Platform map (center):** hub-and-spoke — center "AryaSetu data spine (audit-chained, Neon Postgres)", four surrounding module boxes: Trial Command / Safety·NPvCC / Interoperability / Governance. Annotate: `16 API routes · 24/24 tests`.
2. **Lifecycle ribbon:** 10-node horizontal stepper (protocol → IEC → CTRI → activation → enrolment → visits → deviations → queries → close-out) with done/current/pending coloring from the study record page.
3. **Screenshot:** Command Center dashboard (left or right half).

---

## SLIDE 3 — TECHNICAL APPROACH

**Technologies (on-slide bullets):**

- **Frontend:** Next.js 16 + TypeScript + Tailwind v4 + Recharts; flat "government ops" design system (Inter + JetBrains Mono); login-gated app shell.
- **Backend (shipped, not planned):** Drizzle ORM → Neon managed Postgres (Mumbai-region posture); PGlite for local dev + test harness; 16 authenticated API routes; Argon2id sessions over HttpOnly cookies; CSRF origin checks on mutations.
- **Data:** 12 curated studies + 40 real CTRI records merged via an idempotent seed pipeline (`scripts/seed-ctri.ts`) into 52 total; synthetic AEs/SAEs with full statutory timelines.
- **Interop:** live FHIR R4 API; SDTM (CSV) + binary `.xpt` export service; Define-XML + ODM generators; CIOMS-I PDF export; ABDM blueprint (HIP/HIU adapters, not connected — stated honestly).
- **Security (implemented):** route-level permission matrix × 7 roles + study-membership ACL verified live (PI gets 403 + denial logged on non-member study); append-only SHA-256 audit store with verify endpoint.

**Methodology / process (on-slide bullets):**

- Staged per the PS: **Stage 1** command MVP (done) → **Stage 2** persistence/auth/PV workflows (done, on `main`) → **Stage 3** submission exports + analytics (done for CSV/XML/.xpt/ROR extensions; .xpt validated by round-trip tests).
- Rule-engine-first: every statutory deadline (NDCT, CTRI six-monthly, IEC expiry, batch-cluster) is a computed rule over live DB state — ML only after rules are proven.
- Evaluation-mapped: integrity → tamper simulation + verify endpoint; timeliness → live clocks + overdue escalation; interoperability → downloadable FHIR/SDTM/.xpt; access control → matrix + verified 403s + denial logging.
- Test-gated: 24/24 Vitest (FHIR builders, export builders, κ stats, signal stats, DB boot, chain tamper-detection naming the exact broken record).

**Diagrams to place:**

1. **Architecture flow (main diagram):** 7 roles → Next.js app (Vercel) → Argon2id session + route guard + study ACL → API services (rule engine / exports / FHIR / clock) → Neon Postgres (Mumbai); side-channel: every mutation → hash-chained audit store; edge outputs: FHIR API, SDTM/ADaM/.xpt/Define-XML/CIOMS-I downloads.
2. **NDCT clock timeline:** horizontal timeline for SAE-2026-041 — T0 awareness 02-Oct 21:12 → 24h initial → 14d full → 30d EC → 60d expert → 90d LA → 30d payment. (Clock now flags OVERDUE — use it: "the engine escalates, it doesn't go quiet.")
3. **Batch trace chain:** B-1142 → QC certs (assay FAIL highlighted) → 3 sites (2,700 vials) → 6 participants → 3 hepatic AEs → cluster rule → NPvCC signal review.
4. **Audit hash chain:** 4 linked blocks with hash→prev-hash arrows; one block marked "tamper → chain INVALID at record N" (the verify endpoint names the broken record).

---

## SLIDE 4 — FEASIBILITY AND VIABILITY

**Feasibility analysis (on-slide bullets):**

- Working system deployed, not projected: login → DB → audited writes → FHIR/exports, all clickable at the demo URL; 24/24 tests green.
- Real registry fuel: 40 public CTRI Ayurveda trials scraped, schema-validated, spot-checked, merged into the production database.
- All required standards have open specifications: FHIR R4, CDISC SDTM/ADaM/Define-XML/ODM, CTRI public records, CIOMS-I layout, SAS Transport v5.
- No proprietary dependency at MVP: MedDRA/WHODrug shown as demo dictionaries with honest labeling; licensed dictionaries are a procurement, not a research, item.
- Hosting: Vercel (app) + Neon Postgres (data); DPDP-aligned data minimisation (zero identifier columns in participant schema).
- Team capability: full-stack delivery with enforced acceptance checks (`npm test` + `lint` + `build` green before every push).

**Potential challenges and risks + strategies (on-slide table, 2 columns):**

| Challenge / risk | Strategy |
|---|---|
| MedDRA/WHODrug licensing for production | Demo dictionaries now; budget license in Phase 2; design isolates terminology service |
| ABDM sandbox access & timelines | Blueprint documented; adapter interface ready; connect when sandbox granted — never claimed as done |
| NDCT applicability to ASU trials is nuanced | Versioned governing-regime classification per study (GCP-ASU / ICMR / NDCT) |
| Site digitization maturity varies | Coordinator-first UX, synthetic training data, staged onboarding by site readiness |
| Data migration from spreadsheets | CTRI metadata seeding (done) + CSV importers; dual-run period with verification |
| Claim inflation (judges penalize overclaims) | Hard rule: no compliance claim outruns code — limitations stated on every module |

**Diagrams to place:**

1. **3-stage roadmap swimlane:** Stage 1 MVP (done ✓) → Stage 2 persistence/auth/PV (done ✓, on `main`) → Stage 3 exports/analytics (done ✓ except sandbox-gated items), with rough quarters for the remaining external dependencies.
2. **Risk heat-strip:** 6 risks as small tiles colored by severity with 3-word mitigations.

---

## SLIDE 5 — IMPACT AND BENEFITS

**Impact on target audience (on-slide bullets):**

- **AIIA leadership:** portfolio truth in real time — 52-study database behind one screen instead of weekly spreadsheet collation; CTRI compliance with per-record visibility.
- **NPvCC:** SAE initial reports inside the 24-hour statutory window, with automatic overdue escalation; batch-cluster signals (B-1142) caught in days, not quarters; triage edits land straight in the audit chain.
- **Sites & investigators:** one workflow for enrolment, visits, deviations, queries; overdue windows and aged queries surfaced instantly; per-study records with full history.
- **Ethics Committee:** SAE review queue with compensation-opinion clocks; consent-version tracking across amendments (96 re-consents tracked to zero-pending on AYU-019).
- **Regulator:** read-only oversight with one-click audit-chain verification and downloadable submission artifacts — trust by inspection, not by report.

**Benefits (on-slide bullets, grouped):**

- **Social:** safer Ayurveda trials → stronger public trust; patient-safety signals (Hy's law screen, hepatotoxic herbs, person-time rates) caught by rule, not by chance; supports global scientific credibility of Ayurveda research.
- **Economic:** eliminates duplicate tooling and manual reporting labor at 8+ sites; earlier signal detection reduces trial-halt and liability costs; downloadable SDTM/.xpt/CIOMS-I cut CRO-style outsourcing.
- **Environmental:** paperless consent/version tracking, zero physical safety-report routing.
- **Sectoral:** reusable template for all ASU&H research bodies (CCRAS, CCRH, state colleges) — one national platform pattern, real-registry-seeded from day one.

**Diagrams to place:**

1. **Stakeholder impact map:** center AryaSetu; 5 nodes (Leadership, NPvCC, Sites, EC, Regulator) each with 1 metric (52-study DB, 24h window w/ escalation, aged queries surfaced, 96 re-consents, 1-click verify).
2. **Before/after strip:** "Spreadsheet week" vs "Live minute" — 5-row comparison (portfolio view, SAE clock, batch investigation, audit proof, CTRI status).

---

## SLIDE 6 — RESEARCH AND REFERENCES

**On-slide content (compact 2-column list):**

- Clinical Trials Registry – India (CTRI) — ctri.nic.in (40 real public records merged into the production database)
- New Drugs and Clinical Trials Rules, 2019 — SAE reporting timelines & compensation chain (24h / 14d / 30d / 60d / 90d / 30d)
- GCP-ASU guidelines (Ministry of Ayush) + ICMR National Ethical Guidelines, 2017
- CDISC standards — CDASH, SDTM, ADaM, Define-XML — cdisc.org; SAS Transport v5 (TS-140) for `.xpt`
- HL7 FHIR R4 — ResearchStudy, ResearchSubject, AdverseEvent, Consent resources
- CIOMS-I form layout (export implemented)
- ABDM building blocks (ABHA, HIP/HIU) — sandbox blueprint
- DPDP Act 2023 & Rules 2025 — consent, purpose limitation, data minimisation
- WHO-UMC causality categories; Naranjo algorithm (WHO-UMC vs Naranjo agreement κ ≈ 0.46)
- EudraVigilance EVDAS disproportionality screening (ROR/PRR/χ²); FDA FAERS public dashboard data-limitations framing
- Hy's law / liver sentinel heuristics; documented Guduchi & Bakuchi hepatotoxicity signals
- ICH E6(R3) — critical-to-quality monitoring direction
- Platform-design references: ClinicalTrials.gov (record furniture), Veeva Vault CTMS (task/monitoring widgets), Palantir Foundry (ops design register)
- SIH26046 competitor scan: 11 public repos analyzed; zero batch traceability, zero full NDCT chain, zero machine-readable exports — gap evidence for A1–A3

**Footer line (mono, small):** `LIVE DEMO https://arya-setu.vercel.app · CODE https://github.com/Gupta-Sarthak-358/AryaSetu · login: any persona / AryaSetu@123 · synthetic data only`

---

## Speaker-notes master script (90 seconds, matches demo flow)

1. *(10s)* Problem: AIIA runs Ayurveda's national trial portfolio + NPvCC on spreadsheets — missed timelines, no single truth.
2. *(15s)* AryaSetu: live at arya-setu.vercel.app — Command Center over a 52-study database (12 curated + 40 real CTRI records), and one red card: SAE-2026-041, whose NDCT clock has escalated to OVERDUE — the engine escalates instead of going quiet.
3. *(15s)* Open the SAE: full statutory chain to compensation — 24h, 14d, 30d EC, 60d expert, 90d order — dual causality (WHO-UMC + full Naranjo worksheet), CIOMS-I PDF generated on the spot.
4. *(15s)* One click from the SAE to Batch B-1142: assay variance, 3 sites, 6 participants dosed, 3 hepatic AEs in 30 days — cluster rule fired. Person-time rate shown per product. Nobody else has batch-to-bedside.
5. *(10s)* Tamper simulation on the audit chain — chain goes INVALID and the verify endpoint names the broken record. ALCOA+ by construction, on a real database.
6. *(10s)* Interop: live FHIR bundle endpoint, SDTM with Prakriti, and a real binary AE.xpt download — standards as artifacts, not logos.
7. *(10s)* Honest scope: demo dictionaries, ABDM blueprint, nothing certified — then the access model: 7 roles, verified 403s, denials logged.
8. *(5s)* Close: the four judging axes — integrity, timeliness, interoperability, access control — each was just demonstrated, on a deployed system.

## Screenshot capture checklist (from the LIVE site https://arya-setu.vercel.app, 1440px+ width)

- [ ] Homepage hero + metrics band
- [ ] Command Center (full, logged in)
- [ ] SAE-2026-041 workspace (OVERDUE clock + chain + triage panel visible)
- [ ] Batch B-1142 trace (4-column trace)
- [ ] Audit chain: VERIFIED state + one INVALID state shot
- [ ] Interop: live FHIR endpoint list + export downloads card
- [ ] Study record AYU-036 with lifecycle stepper + dual-coding chips + κ panel
