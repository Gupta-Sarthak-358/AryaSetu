# AryaSetu — National CTMS for Ayurveda Research

**SIH26046 · Ministry of Ayush · All India Institute of Ayurveda (AIIA)**

AryaSetu is a real-time, cloud-based, GCP-ASU compliant Clinical Trial Management System (CTMS) for AIIA — unifying trial execution, NPvCC pharmacovigilance, CTRI/NDCT 2019 regulatory timelines and CDISC/FHIR interoperability in a single role-aware platform.

> **Demonstration build.** All data is synthetic and de-identified. MedDRA/WHODrug appear as demonstration dictionaries. See `docs/LIMITATIONS.md` for the honest scope of every claim.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 29 static routes
npm run lint       # 0 errors, 0 warnings
```

Open `/login`, pick any of the 7 demo personas, and explore. Every route is static; no backend or environment variables are required for the demo.

## Module map

| Route | Module |
|---|---|
| `/` | Product homepage — platform, roles, documentation |
| `/dashboard` | Live Command Center — KPIs, telemetry tabs, priority action queue, My Tasks, monitoring compliance |
| `/studies` · `/studies/[id]` | Portfolio + study record (lifecycle stepper, enrolment, sites, deviations, queries, record history) |
| `/safety` · `/safety/[id]` | NPvCC pharmacovigilance — 24h SAE clock, dual causality, ROR screening, AE register |
| `/batches` | Batch-to-bedside traceability — lot → QC → sites → participants → AEs |
| `/regulatory` | CTRI & IEC register, ethics workload, NDCT applicability |
| `/interop` | FHIR R4 bundles, SDTM DM/AE (with Prakriti), Define-XML, integration boundary |
| `/audit` | Hash-chained ALCOA+ audit with live tamper simulation |
| `/consent` | Consent versioning, AV consent, DPDP controls |
| `/admin` | 7-role permission matrix, study-level ACL |

## Stack

Next.js 16 (App Router, static export-ready) · TypeScript · Tailwind v4 · Recharts · Inter + JetBrains Mono. Mock data layer in `src/lib/data/` is typed against the same shapes the production API will serve.

## Documentation

- `docs/ARCHITECTURE.md` — system design, data flow, design register
- `docs/REQUIREMENTS_TRACEABILITY.md` — every PS requirement → where it is demonstrated
- `docs/DEMO_SCRIPT.md` — 90-second judge walkthrough
- `docs/JUDGE_QA.md` — anticipated questions with honest answers
- `docs/SECURITY.md` — RBAC/ACL, audit chain, DPDP posture (demo vs production)
- `docs/LIMITATIONS.md` — what is mocked, what is not claimed
- `docs/DEVELOPMENT_PLAN.md` — staged roadmap (Stage 1 done → Stage 3)
- `docs/DIFFERENTIATORS.md` — A1–A3 structural differentiators
- `docs/PPT_CONTENT.md` — SIH 6-slide content source

## License / data policy

Code: team-internal for SIH 2026 evaluation. Data: 100% synthetic; no real patient data is processed anywhere in this repository.
