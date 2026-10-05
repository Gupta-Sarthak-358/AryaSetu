---
name: AryaSetu Natural Registry v3
base: Stitch assets/a8bc3076673d44f3a2e3389adcdfd9ad (LIGHT, Newsreader + DM Sans, #2D5A3D)
colors:
  paper: '#FAF9F6'
  ink: '#1C2A21'
  leaf: '#2D5A3D'
  sage: '#5A7A62'
  turmeric: '#B98A2F'
  clay-signal: '#A44A2A'
  line: '#E3DED4'
typography:
  display: Newsreader (headlines only, 1.1-1.3, -0.02em)
  body: DM Sans (UI + copy, 1.6-1.8)
  data: JetBrains Mono (hashes, CTRI IDs, clocks only, tabular-nums)
rounded: 8px panels, 9999px badges only
---

# AryaSetu — Natural, not AIish

Paper registry for Ayurveda trials. AIIA / Ministry of Ayush.
Warm paper, deep leaf ink, one turmeric thread. No neon, no glow, no gradients.

## 30-point guards (from your article, enforced in Stitch)

Colors: solid paper + ink + leaf only. Flat buttons, borders not shadows,
section bg changes only on real content shift. No alternating #F5/white stripes.
Typography: never Inter-everywhere. Newsreader display vs DM Sans body,
hero dramatically larger, not 16→24→32 steps.
Layout: never heading→desc→3-cards repeated. Mix table / 2-col / ledger list.
Left-align default, center hero only. Vary padding. Compact hero, not fullscreen + 2 CTAs.
Copy: concrete verbs (track, report, verify). CTAs: `View study file`, `Report SAE`
— never `Learn more` / `Unlock` / `Seamless`. Headings concrete
(`What sites owe this week`), subtitles 1 sentence, sentence case.
Icons/images: Lucide only, no emoji. No mismatched stock, no reused image,
no AI illustrations, no gradient placeholders — omit image if not real.
UX: 6–9 items then `Show more`, fold with tabs/accordion, no blanket scroll-reveal,
44px targets, max 2 CTAs per section.

## What changed vs cyber version and why

- DARK obsidian + emerald glow → LIGHT paper + leaf. Reason: judges/regulators
  trust paper registries; neon grading screams generated.
- Inter-everywhere → Newsreader + DM Sans. Reason: Inter is #1 AI tell.
- Identical SaaS cards → portfolio table + lifecycle list + safety ledger.
  Reason: layout repetition is the fastest AI detector.
- `01/02/03`, ALL-CAPS eyebrows, `A · B · C`, `→` everywhere → removed except
  real sequences (lifecycle, audit seq). Sentence-case labels.
- Single glow accent → turmeric thread on lifecycle only. Boldness in one place.

## Stitch prompts (use verbatim suffix)

`Warm paper #FAF9F6, ink #1C2A21, leaf #2D5A3D, Newsreader headline + DM Sans body, left-aligned, portfolio table + varied sections, Lucide icons, flat buttons, borders not shadows, no gradients, no glow, no 3-card repetition, concrete copy.`

- Landing (AGNOSTIC): compact registry hero with one live readout.
- Dashboard (DESKTOP): table-first command, not KPI card wall.
- Safety / Audit: ledger lines, mono only for hashes/clocks.

Tokens to evolve in `aryasetu/src/app/globals.css`:
`--color-base: #FAF9F6`, `--color-panel: #FFFFFF`, `--color-line: #E3DED4`,
ink text, leaf primary. Keep `panel`, `btn`, `Status` names — change values.

## Routes (AryaSetu only)

`/`, `/login`, `/dashboard`, `/studies`, `/studies/[id]`, `/safety`, `/safety/[id]`,
`/batches`, `/regulatory`, `/interop`, `/audit`, `/consent`, `/admin`.
