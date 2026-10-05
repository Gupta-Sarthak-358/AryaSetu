# Validation Checklist — run against every change

Born from a real bug: ALL-scope users silently saw 12 of 52 studies because seed expansion and the API's `"ALL"` check disagreed. Every item below is a class of bug we have caught or must never ship.

## 1. Access control (automated: `tests/access.test.ts`)

- [ ] `requireUser` on every API route except `auth/login` (login needs no session by definition)
- [ ] `requireRole(...)` lists are minimal per route (audit read: Admin/Monitor/Ethics/PV/Regulator — never PI/Coordinator)
- [ ] `assertStudyAccess` on every study-scoped read AND write (list, detail, triage, intake, queries, deviations)
- [ ] `"ALL"` wildcard resolves from `personas.ts` at read time — never from stored membership rows (seed expansion must not be trusted)
- [ ] Denials return 403 with a reason AND write an audit entry (`Access denied (role|study)`)
- [ ] Login failures write audit entries; successful logins write audit entries
- [ ] Regression test: ALL user opens member + non-member + CTRI-imported study (all pass); scoped user gets 403 on non-member and CTRI import

## 2. Mutation safety (automated where pure)

- [ ] `assertSameOrigin` on every POST (including logout)
- [ ] Enum allowlists on every free-text clinical field: WHO-UMC (5), seriousness (2), severity (3), deviation severity (3), SAE status (5), expectedness (2)
- [ ] Numeric ranges enforced (Naranjo -4..13)
- [ ] Required-field checks before any DB write
- [ ] Every mutation appends an audit entry with before/after
- [ ] ID generators are collision-free (`nextAeId`, `nextSaeId`, `nextQueryId`, `nextDeviationId`)

## 3. Crash-proof rendering

- [ ] No `!` non-null assertions on DB-derived lookups in pages (`.find(...)!`, `siteById(...)!`); use conditional render or `notFound()`
- [ ] Empty states render: zero open SAEs, zero queries, zero deviations, empty batches, no linked AEs
- [ ] CTRI-imported studies (no batches, generated milestones) render on every page without crashing
- [ ] Countdown handles overdue (negative) without NaN or layout break

## 4. HTTP correctness

- [ ] Unknown IDs → 404, never 500 (`getSae`, `getStudy`, FHIR, CIOMS, exports)
- [ ] Auth failures → 401; permission failures → 403; bad input → 400
- [ ] Downloads set `Content-Type` + `Content-Disposition: attachment`
- [ ] FHIR endpoints serve `application/fhir+json`

## 5. Data layer

- [ ] Boot DDL is idempotent (`IF NOT EXISTS`); seed runs once (users-table check), never duplicates
- [ ] `seed:ctri` validates CTRI format, skips duplicates, writes audit entry
- [ ] Test env (`VITEST=1`) uses in-memory PGlite — tests never touch dev/prod data
- [ ] No secrets in repo (`.env` gitignored; `DATABASE_URL` never returned by any API — `/api/diag` exposes host only)

## 6. Release gates (must all pass)

- [ ] `npm test` — currently 26+ tests
- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run build` — all routes compile
- [ ] `git diff --check` — no whitespace errors
- [ ] Live smoke after deploy: login → `/api/diag` (host + counts) → `/api/studies` count matches Neon
