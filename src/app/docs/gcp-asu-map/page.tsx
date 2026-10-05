export const metadata = { title: "GCP-ASU alignment map — AryaSetu Docs" };

const rows = [
  ["GCP-ASU principle", "AryaSetu control"],
  ["Protocol compliance and deviation management", "Deviation register per study with severity, CAPA status and audit trail"],
  ["Investigator qualification and responsibility", "PI role with e-signature, study membership, SAE reporting within 24h"],
  ["Ethics committee oversight", "Dedicated Ethics role, IEC approval/expiry tracking, SAE review queue"],
  ["Safety monitoring and reporting", "NPvCC module with dual causality, signal screening, statutory clocks"],
  ["Data quality and integrity (ALCOA+)", "Hash-chained audit trail, e-signature, query aging board"],
  ["Documentation and record keeping", "Versioned study records, CIOMS-I and export artifacts on demand"],
];

export default function GcpAsuMap() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For reviewers</p>
      <h1 className="display mt-2 text-[30px] font-medium">GCP-ASU alignment map</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4]">
        <table className="w-full text-left text-[12.5px]">
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className={`${i > 0 ? "border-t border-[#E3DED4]" : ""} ${i === 0 ? "bg-[#F3EFE5] font-semibold" : ""}`}>
                <td className="px-4 py-3 text-[#1C2A21] w-1/2">{r[0]}</td>
                <td className="px-4 py-3 text-[#4A5A4F]">{r[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-[#4A5A4F]">Alignment means implemented controls, not certification. No GCP certification is claimed anywhere in this build.</p>
    </article>
  );
}
