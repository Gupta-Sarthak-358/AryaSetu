# Development Plan — staged build per SIH26046

The PS explicitly allows staging: core tracking/KPI MVP → EDC/FHIR + pharmacovigilance → full CDISC export + analytics.

## Stage 1 — Command MVP (this build, complete)

- [x] Product homepage with platform, roles, documentation
- [x] Live Command Center: KPIs, telemetry tabs, priority action queue, My Tasks, monitoring compliance, event feed
- [x] Studies portfolio + study record (lifecycle stepper, enrolment, sites, deviations, queries, record history)
- [x] NPvCC safety desk: AE register, dual causality, ROR screening, SAE workspace with full NDCT chain
- [x] Batch-to-bedside traceability (A1 differentiator)
- [x] CTRI/IEC regulatory register; consent & DPDP module
- [x] Interop previews: FHIR R4 bundle, SDTM DM/AE with Prakriti, Define-XML
- [x] Audit chain with live tamper simulation; 7-role permission matrix
- [x] 29 static routes, lint-clean, deployable to Vercel

## Stage 2 — Persistence, auth & pharmacovigilance-for-real

In progress on branch `stage-2-working`:

- [x] Postgres semantics via PGlite (dev) + Drizzle ORM; DDL boot + idempotent seed from curated dataset (`src/lib/server/`)
- [x] Argon2id credential auth + HttpOnly session cookies (`/api/auth/login|logout|me`); login/failure events audit-logged
- [x] Route-level role guards + study-membership ACL with deny-by-default; **verified:** PI 200 on member study, 403 on non-member + 403 on audit API, denials written to chain
- [x] Append-only SHA-256 audit store in DB + `/api/audit/verify` (recomputes full chain); tamper simulation still demoable on `/audit`
- [x] SAE triage mutation API (`POST /api/safety/saes/[id]`, PV/PI only, audited)
- [x] All app pages read from the database (force-dynamic); mock layer now serves only as seed source
- [ ] Migration to managed Postgres (Neon/RDS, India region) from PGlite
- [ ] OIDC + MFA (replacing credential demo), CSRF tokens
- [ ] Safety clock engine as a service (NDCT/CTRI/IEC rules with escalation)
- [ ] FHIR R4 API endpoints (ResearchStudy, ResearchSubject, AdverseEvent, Consent, Medication)
- [ ] Real SAE workflow UI: submit → route → e-sign → export CIOMS-I
- [ ] CTRI metadata seeding via official channel; site onboarding tooling

## Stage 3 — Submission exports & analytics

- [ ] SDTM/ADaM export service (.xpt) + Define-XML 2.1 generation; CDASH instrument library + ODM
- [ ] EDC/HIS connectors; ABDM HIP/HIU adapters in sandbox
- [ ] Signal analytics beyond ROR (exposure denominators, temporal patterns)
- [ ] NAMASTE ↔ ICD-11 TM2 dual coding for AE terms (draft Ayush-CT IG → pilot)
- [ ] Prakriti inter-rater reliability QA; individualization-aware protocol logic (N-of-1/adaptive designs)
- [ ] Evaluation scorecard: injected-anomaly tests for KPI accuracy, audit completeness, RBAC denial rate

## Rules of the plan

1. Rule engines before ML — statutory logic is deterministic and testable first.
2. No claim lands on a page before the code behind it exists (`docs/LIMITATIONS.md` is the register).
3. Every stage ends demo-ready: judges see working software, not promises.
