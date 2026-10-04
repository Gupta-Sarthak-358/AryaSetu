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
- [x] Login-gated app shell; real session user in Topbar; logout
- [x] FHIR R4 API as `application/fhir+json` from DB — ResearchStudy, AdverseEvent (WHO-UMC/Naranjo/batch extensions), SAE Bundle
- [x] Rule engine (`rules.ts`): SAE 24h clock, CTRI overdue, IEC expiry, batch hepatic cluster, aged queries — alerts computed, not seeded
- [x] AE/SAE intake workflow: form → API → auto-computed NDCT deadline chain → audit (`POST /api/safety/events`)
- [x] Query workflow: raise (Monitor) / resolve (PI-Coordinator), role-enforced + audited
- [x] CSRF same-origin checks on mutations; Vitest suite (7 tests: FHIR builders, utils)
- [x] CIOMS-I PDF export (`GET /api/safety/saes/[id]/cioms`, audited) + FHIR bundle download on SAE page
- [x] Deviation report workflow (`POST /api/studies/[id]/deviations`, Monitor/PI/Coordinator, audited)
- [x] DB-backed test suite: tamper detection (direct DB edit → chain INVALID at exact record), rule-engine, boot/seed — 11/11 passing
- [ ] Migration to managed Postgres (Neon/RDS, India region) from PGlite
- [ ] OIDC + MFA (replacing credential demo), full CSRF token flow
- [ ] CTRI metadata seeding via official channel; site onboarding tooling

## Stage 3 — Submission exports & analytics

In progress on branch `stage-2-working`:

- [x] SDTM export service from DB — DM (with PRAKRITI), AE (with BATCHID), EX (batch lots) as CSV downloads, audited (`/api/export/sdtm/[domain]`)
- [x] ADaM ADSL export (`/api/export/adam/adsl`); Define-XML 2.1 + ODM 1.3.2 CDASH drafts (`/api/export/metadata/[kind]`)
- [x] Signal analytics: ROR + PRR + χ² computed live from the AE table (EVDAS-style, replaces static table)
- [x] Prakriti inter-rater reliability QA — paired assessor dataset with live Cohen's κ per study (calibration threshold 0.40)
- [x] NAMASTE ↔ ICD-11 TM2 draft dual-coding (10 indications, clearly labelled draft, shown on study records)
- [x] 19/19 tests (kappa, signal stats, export builders, FHIR, DB, utils)
- [ ] True .xpt (SAS transport) writer for SDTM/ADaM (CSV now; .xpt needs binary writer)
- [ ] EDC/HIS connectors; ABDM HIP/HIU adapters in sandbox
- [ ] Exposure-denominator signal analytics (person-time), temporal patterns
- [ ] Individualization-aware protocol logic (N-of-1/adaptive designs)
- [ ] Evaluation scorecard: injected-anomaly tests for KPI accuracy, audit completeness, RBAC denial rate

## Rules of the plan

1. Rule engines before ML — statutory logic is deterministic and testable first.
2. No claim lands on a page before the code behind it exists (`docs/LIMITATIONS.md` is the register).
3. Every stage ends demo-ready: judges see working software, not promises.
