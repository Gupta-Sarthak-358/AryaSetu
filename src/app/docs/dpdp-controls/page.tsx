export const metadata = { title: "DPDP privacy controls — AryaSetu Docs" };

const controls = [
  ["Purpose limitation", "Every consent record carries a DPDP purpose tag; processing is scoped to the declared purpose and changes need re-consent"],
  ["Data minimisation", "Participant schema has zero identifier columns; linkage keys held separately with restricted access"],
  ["Consent versioning", "ICF versions tracked per study; re-consent on amendment tracked to zero-pending; AV consent for vulnerable subjects hash-stamped"],
  ["Withdrawal", "Withdrawal propagates to dashboards and exports through the same audit chain"],
  ["Research exemption posture", "Section 17(2)(b) treated as narrow — trials make participant-specific decisions, so full obligations are the design assumption"],
  ["Storage and residency", "Encryption in transit and at rest; India-resident hosting posture (ISO 27001, CERT-In) — stated as posture, not certification"],
];

export default function DpdpControls() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For reviewers</p>
      <h1 className="display mt-2 text-[30px] font-medium">DPDP Act 2023 privacy controls</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4]">
        <table className="w-full text-left text-[12.5px]">
          <tbody>
            {controls.map((c, i) => (
              <tr key={c[0]} className={i > 0 ? "border-t border-[#E3DED4]" : ""}>
                <td className="px-4 py-3 font-semibold text-[#1C2A21] w-1/3">{c[0]}</td>
                <td className="px-4 py-3 text-[#4A5A4F]">{c[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-[#4A5A4F]">Demonstration note: this build processes only synthetic, de-identified data. The controls above are the designed production posture.</p>
    </article>
  );
}
