# Limitations — honest scope of this build

Rule for this project: **no claim on a page may outrun the code behind it.** This file is the single place where every limitation is registered.

## Data
- All data is synthetic and de-identified. No real patient, site-staff or CTRI records are processed.
- MedDRA and WHODrug appear as **demonstration dictionaries**, not licensed terminology.
- The audit chain contains 12 curated demo entries (presented as "of 2,418"); the hash-linking and tamper-detection logic is real, the volume is illustrative.
- The 24h SAE countdown is computed from a fixed demo "now" (03 Oct 2026 15:00 IST), not wall-clock time.

## Security
- Demo personas switch instantly with no password — a judge convenience, clearly labelled on `/admin`. Production auth (OIDC + MFA, Argon2id, session management) is designed, not built.
- Route-level RBAC enforcement is a production design; in this build, all routes are reachable by all personas.
- The audit chain is application-level tamper evidence — **not WORM storage, not a 21 CFR Part 11 certification, not a qualified e-signature.**

## Integrations
- **ABDM:** blueprint only. No ABHA, HIP or HIU adapter is connected; nothing is claimed beyond the documented boundary on `/interop`.
- **CTRI:** statuses are curated demo data; no live registry sync exists yet. (Competitor precedent scrapes CTRI; we prefer the official channel when available.)
- **EDC/HIS connectors:** planned Phase 2; not present.
- **CDASH / ODM:** planned Phase 3; SDTM/ADaM/Define-XML exist as previews.

## Clinical
- Causality (WHO-UMC/Naranjo), liver-sentinel and cluster rules are heuristics for demonstration — **not clinically validated decision support**, and must not be presented as such.
- Prakriti inter-rater reliability QA and individualization-aware protocol logic are documented concepts (see handouts), not implemented logic.

## Engineering
- No backend, database, API, tests, or CI in this stage — by plan (Stage 1 = frontend-complete demo on the final domain shapes).
- The ROR disproportionality table uses illustrative expected counts on a small dataset.
- Offline mode: out of scope.

## Procurement-stage items (not research items)
- Licensed MedDRA/WHODrug; ABDM sandbox access; India-resident cloud account; ISO 27001 / CERT-In certification of the hosting environment; qualified e-signature provider.
