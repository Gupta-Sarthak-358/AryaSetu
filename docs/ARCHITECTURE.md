# AryaSetu — Architecture

## 1. Overview

AryaSetu is a full-stack TypeScript CTMS delivered in two registers:

- **Demo register (this build):** statically-generated Next.js app; all data served from a typed in-repo mock layer. Zero infrastructure required; deployable anywhere (Vercel/Netlify/static host).
- **Production register (designed, Stage 2+):** the same frontend backed by Postgres + API services on India-resident cloud.

The mock layer (`src/lib/data/*.ts`) is typed against the same domain shapes the API will return, so the swap is a data-access rewrite, not a UI rewrite.

## 2. Domain model (current)

```
Study (12) ──┬── Site (8)                    src/lib/data/studies.ts, sites.ts
             ├── Milestone (lifecycle)      per-study, status: done/current/pending/overdue
             ├── Batch (6) ── QC assay/heavy metals ── SitesShipped ── ParticipantsDosed
             │                                    └── linkedAes ← the traceability edge
             ├── AdverseEvent (14)          MedDRA PT code, WHODrug, WHO-UMC, Naranjo, batchId
             │      └── SAE (3) ── timeline[] statutory steps (NDCT 2019)
             ├── Deviation (8) / DataQuery (10)
             └── ConsentRecord (6)          ICF version, languages, re-consent, DPDP purpose

AuditEntry (12 demo of 2,418)                hash = H(content + prevHash)  src/lib/data/ops.ts
Persona (7 roles) + permission matrix        src/lib/data/personas.ts, /admin
Interop artifacts                            FHIR bundle, SDTM DM/AE, Define-XML  src/lib/data/interop.ts
```

Key design decision: **batch/lot is a first-class entity with edges to sites, participants and AEs** — this is what makes batch-to-bedside traceability a query instead of an investigation.

## 3. Request/flow architecture (demo)

```
Browser → Next.js static routes
        ├─ Server components render pages from src/lib/data (build-time)
        ├─ Client islands: role context (localStorage), tamper simulation,
        │  chart tabs, dropdowns, disclaimer acknowledgement
        └─ Recharts for telemetry (enrolment, AE volume, site bars, Prakriti donut)
```

No network calls at runtime. Role switching is client-side state for judge convenience (see SECURITY.md for the production model).

## 4. Production target (Stage 2–3)

```
7 roles → Next.js app (Vercel or India-region container)
        → OIDC + MFA session → route-level permission check → study ACL
        → services: KPI/read-models · safety clock engine · batch trace · export service
        → PostgreSQL (Drizzle ORM, migrations) · S3-class object store (consent AV, exports)
        → append-only audit store (HSM-bound hash chain, WORM option)
        → edge: FHIR R4 API · SDTM/ADaM/Define-XML exporters · ABDM HIP/HIU adapters (blueprint)
```

Rule-engine-first: every statutory deadline (NDCT 24h/14d/30d/60d/90d, CTRI six-monthly, IEC expiry) is a computed rule with alert states. ML is deferred until rules are proven.

## 5. Design register ("government ops")

Flat near-black neutral (`#0a0a0b`/`#121214`), 1px hairlines, 4–6px radius, no shadows/gradients/glass. Inter for UI, JetBrains Mono for all IDs/hashes/timestamps/numerics. Status = 6px dot + text (emerald/amber/red/sky semantic only). Influences: Palantir Foundry (density, monochrome), ClinicalTrials.gov (record furniture: prev/next, download actions, anchor rail), FAERS/EudraVigilance (disclaimer + ROR screening).

## 6. Repo layout

```
src/
  app/                 routes — /, /login, (app)/* 9 modules
  components/          ui.tsx (primitives), charts.tsx, ChartTabs, shell/
  lib/
    types.ts           domain types (single source of truth for shapes)
    data/              mock layer: studies, sites, safety, batches, quality, ops, interop, personas
    role.tsx           role context (demo)
    utils.ts           formatting, fake-hash generator, countdowns
docs/                  this documentation set
stitch/                Stitch-generated design screens (reference)
```
