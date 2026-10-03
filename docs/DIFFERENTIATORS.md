# AryaSetu — Structural Differentiators (internal, not shown on site)

Reference for PPT / judge narrative. Do not surface as a homepage section.

## A1 — Batch-to-bedside traceability
Every formulation lot — with assay and heavy-metal certificates — is traced to the sites it shipped to, the participants dosed, and the adverse events linked. When an SAE occurs, the at-risk cohort is one click, not a two-week investigation.
- Demo: `/batches` — Batch B-1142 (Guduchi Ghana Vati) assay variance → 3 sites → 6 participants dosed → 3 hepatic AEs in 30 days → cluster rule fired.
- Why it matters: classical polyherbal formulations have real batch-to-batch variability; Rasaushadhi products (e.g., Naga Bhasma B-1190, quarantined) carry intentional heavy metals tracked separately from contaminants.
- Competitor status: 0/7 analyzed repos have any batch/lot concept.

## A2 — Safety-to-compensation clock
The full NDCT Rules 2019 statutory chain runs as computed deadlines from time of awareness:
1. 24-hour initial report (investigator → LA, sponsor, EC)
2. 14-day full report (sponsor + investigator)
3. 30-day Ethics Committee compensation opinion
4. 60-day expert committee recommendation
5. 90-day Licensing Authority order
6. 30-day sponsor payment after order
- Demo: `/safety/SAE-2026-041` — live 24h countdown + full chain view.
- Competitor status: AyuTrial shows only a 24h countdown; nobody models the full chain.

## A3 — Ayurveda-native data model
Prakriti, Agni and formulation batch variability are first-class fields — dual-coded toward NAMASTE / ICD-11 TM2 in a draft Ayush-CT FHIR profile, instead of being squeezed into conventional-trial forms.
- Demo: Prakriti distribution on study records; SDTM DM domain preview carries a PRAKRITI column; FHIR Observation (Prakriti) in `/interop`.
- Supporting concepts (mention only if asked): dual WHO-UMC + Naranjo causality panel (κ ≈ 0.46 agreement in literature), Prakriti inter-rater reliability QA (κ ≈ 0.2–0.4), liver sentinel rule (ALT/AST > 3× ULN + bilirubin > 2× ULN) for known hepatotoxic herbs (Guduchi, Bakuchi).
