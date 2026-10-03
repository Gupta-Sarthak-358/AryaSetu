# Judge Q&A — anticipated questions, honest answers

## Data & compliance

**Q: Is this real patient data?**
No. Every record is synthetic and de-identified; the participant schema has zero identifier columns by design (DPDP data minimisation). CTRI numbers follow the real format for realism.

**Q: Are you using licensed MedDRA / WHODrug?**
No — demonstration dictionaries, labelled as such wherever they appear (`/safety`, SAE workspace). Production requires licensed dictionaries; the terminology service is isolated so this is a procurement swap, not a rewrite.

**Q: Are you CDISC / 21 CFR Part 11 compliant or certified?**
No certification is claimed anywhere. We demonstrate working artifacts: SDTM DM/AE previews, Define-XML metadata, FHIR R4 bundles. The audit trail is application-level tamper evidence, not WORM storage. This is deliberate: our analysis of other entries found compliance claims outrunning code — we took the opposite rule.

**Q: Is ABDM integrated?**
Not connected — it is a documented blueprint (ABHA, HIP/HIU adapters) pending sandbox access. The integration boundary on `/interop` shows exactly what is real and what is planned.

**Q: How does the audit chain actually work?**
Each record's hash is computed over its content plus the previous record's hash; editing history breaks every later link, detected by one re-verification pass — try the tamper simulation on `/audit`. Production binds signing to HSM-backed keys; demo uses browser-side hashing.

## Safety & regulatory

**Q: Your 24-hour clock — is that the real rule?**
Yes: NDCT Rules 2019 — investigator's initial SAE report within 24 hours to licensing authority, sponsor and EC; full report within 14 days of awareness; EC compensation opinion within 30 days; expert committee within 60; LA order within 90; sponsor payment within 30 days of order. All are computed from time of awareness.

**Q: Does NDCT even apply to Ayurveda (ASU) trials?**
Nuance, honestly: ASU drugs sit under Chapter IV-A of the D&C Act and Part XVI of the Rules; applicability depends on the product. AryaSetu records a versioned governing-regime decision per study (GCP-ASU / ICMR / NDCT) rather than assuming — see `/regulatory`.

**Q: WHO-UMC vs Naranjo — why both?**
Published agreement between the two is only moderate (κ ≈ 0.46). For multi-ingredient Ayurveda formulations, single-scale causality is fragile; the dual panel exposes disagreement instead of hiding it.

**Q: What is the ROR table on the safety page?**
EudraVigilance/EVDAS-style disproportionality screening — reporting odds ratio per product–event pair. We label it a screening measure: it detects disproportionate reporting, not risk. Signal confirmation needs case review.

## Architecture & engineering

**Q: Where is the backend?**
This submission is the frontend-complete Stage 1: 29 static routes with a typed mock layer mirroring the API shapes. Stage 2 swaps the data layer for Postgres + services (Drizzle, migrations, OIDC) without rewriting UI. Architecture and plan: `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_PLAN.md`.

**Q: Why Next.js and not (X)?**
One language across UI and API routes, static-deployable demo today, server components for the real backend tomorrow, and the strongest hiring/ecosystem pool. The data layer is isolated, so the framework choice is not a lock-in risk.

**Q: How is RBAC enforced — really?**
Demo: instant persona switch for judge convenience (stated on `/admin`). Production design: OIDC + MFA sessions, route-level permission checks, study-membership ACL, deny-by-default (zero memberships → empty portfolio), and every denial written to the audit chain. UI hiding is never the control.

**Q: What makes this different from the other SIH26046 entries?**
We analyzed 11 public repos. Zero have batch/lot traceability; zero model the full NDCT compensation chain; zero have a real FHIR↔CDISC mapping story; most claim certifications with no code behind them. AryaSetu's three differentiators (A1–A3 in `docs/DIFFERENTIATORS.md`) are built and visible in the demo.

## Scope

**Q: What is NOT built?**
Backend persistence, real auth, CDASH/ODM, EDC/HIS connectors, ABDM adapters, offline mode, trained ML. Full list with reasons: `docs/LIMITATIONS.md`.
