# Demo Script — 90 seconds, judge walkthrough

Prerequisite: app running (`npm run dev` or deployed URL). Nothing to seed; the dataset is built in.

## Flow

**0:00–0:10 — Problem frame (homepage `/`)**
"AIIA runs India's Ayurveda trial portfolio and hosts the NPvCC — on spreadsheets. Missed 24-hour SAE windows, no single truth." Point at the metrics band: 12 studies · 1,528 enrolled · 8 sites · 1 statutory clock running.

**0:10–0:25 — Command Center (`/dashboard`)**
"One screen for the whole portfolio." Note the red tile: **Open SAE 1 — 24h clock 06:12**. Priority action queue is ordered by statutory urgency, not recency. Show telemetry tabs (Enrolment/Safety/Sites/Regulatory).

**0:25–0:40 — The SAE workspace (`/safety/SAE-2026-041`)**
"Guduchi registry, week-8 LFT, Hy's law screen positive." Walk the statutory chain: 24h initial report → 14d full → 30d EC opinion → 60d expert committee → 90d LA order → 30d payment. Point at dual causality: WHO-UMC Probable + full Naranjo worksheet (7/13). Mention CIOMS-I export.

**0:40–0:55 — Batch-to-bedside (`/batches`)**
"One click from the SAE: Batch B-1142. Assay variance on Tinosporaside, shipped to 3 sites, 6 participants currently dosed — and 3 hepatic AEs in 30 days. The cluster rule fired on its own." Say the line: **"This turns a two-week investigation into a same-day signal assessment. No other entry has this."**

**0:55–1:05 — Audit chain (`/audit`)**
Click **"Simulate tamper on record #7"** → banner flips to **AUDIT CHAIN: INVALID**. "Every edit, grant and signature is hash-linked. Tampering is detectable in one verification pass." Restore.

**1:05–1:15 — Interoperability (`/interop`)**
FHIR bundle JSON for the same SAE; SDTM DM table **with a Prakriti column** — "Ayurveda-native data inside global standards, via a draft Ayush-CT profile."

**1:15–1:25 — Honest scope + plan**
"Demo dictionaries, ABDM blueprint, no certification claims — every limitation is stated on the page where it applies." Stage 1 (this) done → Stage 2 EDC/FHIR + PV module → Stage 3 submission exports + analytics.

**1:25–1:30 — Close**
"You asked for four things: data integrity, safety-reporting timeliness, interoperability, access control with audit completeness. You just saw all four working."

## Backup Q&A pointers

- If asked to prove RBAC: switch persona in topbar → `/admin` matrix; explain route-level enforcement design (SECURITY.md).
- If asked about real data: all synthetic; CTRI metadata seeding planned like AyuSphere's scrape but via official channel when available.
- If the room is regulatory-heavy: spend the SAE segment on the compensation chain and EC workload in `/regulatory`.
