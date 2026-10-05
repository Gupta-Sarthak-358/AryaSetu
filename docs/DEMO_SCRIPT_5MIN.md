# Demo Scripts — 2-minute PPT + 3-minute live project demo

## Setup (do 10 minutes before)

1. Open two tabs: (a) the PPT PDF, (b) https://arya-setu.vercel.app
2. In the site tab: go to `/login`, sign in as **PV Officer** (`pv@aryasetu.in` / `AryaSetu@123`) — lands on `/dashboard`
3. Set browser zoom to 100%, resolution 1440px+; hide bookmarks bar
4. Backup: keep the 7 screenshots from `docs/PPT_CONTENT.md` checklist in a folder in case the network dies
5. Phone on silent. Water nearby. Breathe.

---

## PART 1 — 2-minute PPT narration (120s, 6 slides ≈ 20s each)

**Slide 1 — Title (10s). Say:**
> "SIH26046. AryaSetu — a National Clinical Trial Management System for Ayurveda research, for AIIA and the Ministry of Ayush. Every Ayurveda trial, one auditable truth — and it's already live at the URL on this slide."

**Slide 2 — Idea + Solution (30s). Say:**
> "AIIA runs the country's Ayurveda trials and hosts the national pharmacovigilance centre — on spreadsheets. AryaSetu replaces that with one real-time system: trial tracking across the full lifecycle, NPvCC safety with a statutory clock engine, and CDISC-FHIR interoperability as working exports, not logos. Three things nobody else in this problem statement built: batch-to-bedside traceability, the full NDCT safety-to-compensation chain, and an Ayurveda-native data model with Prakriti as a first-class field."

**Slide 3 — Technical approach (25s). Say:**
> "Next.js and TypeScript on Vercel, Postgres on Neon. Sixteen authenticated API routes, Argon2 sessions, role plus study-level access control, and every write lands in a hash-chained audit store. Fifty-two studies in production — twelve curated in depth, forty real CTRI registry records merged through our seed pipeline. Twenty-four automated tests, all green."

**Slide 4 — Feasibility (20s). Say:**
> "Feasibility is proven, not projected — the system you're seeing is deployed. Standards are all open specifications. The honest risks are on the slide: licensed dictionaries are a procurement item, ABDM needs sandbox access, and we state every limitation on the page where it applies."

**Slide 5 — Impact (20s). Say:**
> "For leadership — one portfolio screen instead of weekly collation. For NPvCC — 24-hour SAE windows with automatic escalation. For sites — one workflow for visits, deviations and queries. For regulators — one-click audit verification and downloadable submission files."

**Slide 6 — References + close (15s). Say:**
> "Built on CTRI, NDCT 2019, CDISC, FHIR R4 and DPDP 2023 — with an 11-repository competitor scan behind our three differentiators. The demo URL and code are on screen. Now let me show it working."

---

## PART 2 — 3-minute live demo (180s, 7 stops)

**Stop 0 — Command Center `/dashboard` (0:00–0:30). Do:**
- Point at the 6 KPI tiles: "12 curated studies, 1,528 enrolled, 8 sites — and one red tile."
- Click into telemetry tabs: Enrolment → Safety → Sites → Regulatory. Say: "One panel, four live views, all computed from the database."
- Scroll to Priority Action Queue. Say: "Ordered by statutory urgency, not recency — every alert is computed by a rule engine, not seeded."

**Stop 1 — SAE workspace `/safety/SAE-2026-041` (0:30–1:05). Do:**
- Click the red SAE card. Point at the clock: "NDCT 24-hour initial-report clock — it has escalated to OVERDUE. The engine escalates; it doesn't go quiet."
- Scroll the statutory chain: 24h → 14d full report → 30d EC opinion → 60d expert committee → 90d licensing order → 30d payment. Say: "The full chain to compensation — competitors show a countdown; we model the law."
- Point at WHO-UMC Probable + Naranjo 7/13 worksheet. Say: "Dual causality, because the two scales only agree moderately."
- Click **CIOMS-I form (PDF)** — let it download. Say: "Regulatory paperwork generated on the spot, and the export itself is audit-logged."

**Stop 2 — Batch trace `/batches` (1:05–1:30). Do:**
- Click Batch B-1142. Walk the four columns fast: "Assay variance flagged → shipped to 3 sites → 6 participants dosed → 3 hepatic AEs in 30 days — the cluster rule fired on its own."
- Say the line: "This turns a two-week manual investigation into a same-day signal assessment. Zero of eleven analyzed entries have this."

**Stop 3 — Safety command `/safety` (1:30–1:50). Do:**
- Scroll to the disproportionality table. Say: "ROR plus PRR plus chi-square, computed live from the event table — B-1142 flags as a signal."
- Scroll to exposure-adjusted rates. Say: "And events per thousand person-years, because three events mean different things at six person-months versus six hundred person-years."
- Mention the amber banner: "The FAERS-style limitations notice stays visible — a report is not causation."

**Stop 4 — Audit `/audit` (1:50–2:10). Do:**
- Point at VERIFIED. Click **"Simulate tamper on record #7"** → banner flips red: INVALID. Say: "Every edit, grant and signature is hash-linked — tampering is detectable in one pass, and the verify endpoint names the exact broken record."
- Click restore. Say: "ALCOA+ by construction."

**Stop 5 — Interop `/interop` (2:10–2:30). Do:**
- Click `/api/fhir/Bundle/SAE-2026-041` — raw JSON opens. Say: "A live FHIR R4 bundle for the same SAE you just saw."
- Point at the downloads card: "SDTM with a Prakriti column, ADaM, Define-XML, ODM drafts — and a real binary AE dot-xpt. Standards as artifacts."

**Stop 6 — Access `/admin` (2:30–2:55). Do:**
- Point at the permission matrix. Say: "Seven roles, eleven capabilities, study-level access — and it's enforced, not displayed."
- Topbar → switch role to **PI** → open `/api/studies/AYU-031` in a new tab if asked: 403 "No membership." Say: "Deny by default — and that denial is in the audit chain you just saw."
- Point at the Deployment diagnostics card: "And this deployment tells you its own database host and counts — no mysteries."

**Close (2:55–3:00). Say:**
> "Data integrity, reporting timeliness, interoperability, access control — the four judging axes. You just watched all four working, on a deployed system, with real registry data behind it."

---

## Contingencies

- **Site slow/down:** switch to the screenshot folder; narrate the same stops. Never debug live.
- **Asked about data:** "Twelve curated studies plus forty real public CTRI records; all clinical events synthetic and de-identified."
- **Asked about MedDRA/ABDM/certification:** answer from `docs/JUDGE_QA.md` — short version: demo dictionaries, blueprint, nothing certified, everything labelled.
- **Asked "is the 52 real?":** open `/api/diag` — host and counts on screen.
- **Over time:** drop Stop 3's person-time table and Stop 5's ODM row; never drop Stops 1, 2, 4.
