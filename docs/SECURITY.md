# Security & Privacy — demo posture and production design

## 1. What is true in this demo build

- **No real data:** 100% synthetic, de-identified dataset. No credentials, secrets or `.env` values exist in the repo.
- **Persona switching is instant** (client state, localStorage) — for judge convenience, and labelled as such on `/admin`.
- The audit hash chain and tamper detection execute genuinely in the browser (demo-grade hashing).

## 2. Production authorization model (designed)

- **Authentication:** OIDC with MFA; Argon2id password hashing where passwords exist; HttpOnly, SameSite sessions; CSRF tokens on mutations.
- **Authorization — two layers, both enforced server-side on every request:**
  1. Role permission (matrix on `/admin`: 11 capabilities × 7 roles)
  2. Study-membership ACL (`study_memberships`); deny-by-default — zero memberships → empty portfolio.
- **Every grant and denial is written to the audit chain** — including read-only regulator exports (watermarked).
- **UI hiding is never the control.** Buttons may hide; routes still 403.

## 3. Audit integrity design

- Append-only event store; `hash = HMAC(content ‖ prevHash)` with HSM-bound keys in production (browser hash in demo).
- Verification endpoint recomputes the chain; any edit invalidates every subsequent link (demo: "Simulate tamper on record #7").
- e-Signatures: hash-bound to record version + signer + meaning of signature; qualified e-signature provider is a Phase-2 procurement.
- Target posture: WORM-capable object lock for the audit store. We do not claim 21 CFR Part 11 certification.

## 4. DPDP Act 2023 & privacy posture

- **Data minimisation by schema:** zero direct-identifier columns in the participant entity; linkage keys held separately with restricted access.
- **Purpose limitation:** every consent record carries a DPDP purpose tag; processing is scoped to the declared purpose; purpose changes require re-consent (tracked to zero-pending).
- **Research exemption treated as narrow** (Sec 17(2)(b) + Rule 16): trials make participant-specific decisions, so full DPDP obligations are the design assumption.
- **Withdrawal** propagates through dashboards and exports within the same audit chain.
- **AV consent** for vulnerable subjects per NDCT 2019 scope; recordings hash-stamped and bound to ICF version.
- Encryption in transit and at rest; India data-resident hosting posture (ISO/IEC 27001, CERT-In norms) — stated as posture, not certification.

## 5. Reporting a vulnerability

During SIH evaluation: contact the team lead directly. Do not open public issues with security details.
