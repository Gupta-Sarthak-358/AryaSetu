# AryaSetu — one place to run all of AIIA's Ayurveda clinical trials

AryaSetu is a single website where the All India Institute of Ayurveda (AIIA) can see and manage **every clinical trial in one place** — which studies are running, how many patients have joined, whether any medicine has caused side effects, and whether all the government paperwork (registrations, approvals, safety reports) is on time.

**Try it live:** https://arya-setu.vercel.app — click "Launch live demo", pick any person (doctor, nurse, safety officer…), password is `AryaSetu@123`.

## What it does, in plain words

- **One dashboard for everything** — instead of tracking trials across spreadsheets, everyone sees the same live numbers: studies, patients, sites, alerts.
- **Safety first** — when a patient has a serious side effect, the system starts a legal countdown (24 hours to file the first report) and walks the team through every step up to compensation, exactly as the law (NDCT Rules 2019) requires.
- **Medicine tracking** — every batch of Ayurvedic medicine is traced from the factory, to the hospital, to the patient, to any side effect. If three liver problems appear on one batch in a month, the system raises the alarm by itself.
- **Paperwork that proves itself** — every click is recorded in a tamper-proof diary. If anyone edits an old record, the system turns red and names the edited record.
- **Everyone sees only their part** — doctors, nurses, monitors, ethics committee members, safety officers, admins and government observers each get their own view; nobody can open a study they don't belong to.
- **Speaks international formats** — with one click it produces the standard files regulators expect (FHIR health-data bundles, CDISC trial tables, CIOMS safety reports).

## The data inside

Everything you see is **demonstration data** — no real patients. The 12 detailed studies are realistic mock trials, plus 40 real public trial listings from India's official registry (CTRI) so the portfolio looks like the real thing.

## For the team

- `docs/` — detailed documentation (architecture, demo script, judge Q&A, development plan, PPT content)
- Built with Next.js + TypeScript + PostgreSQL (Neon). Run `npm install`, then `npm run dev`.
- Checks before pushing: `npm test`, `npm run lint`, `npm run build` — all must pass.
