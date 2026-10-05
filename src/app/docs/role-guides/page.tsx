export const metadata = { title: "Guides for all 7 roles — AryaSetu Docs" };

const roles = [
  { role: "Principal Investigator", org: "Trial site", sees: "Their own studies", does: "Trial conduct, e-signature on CRFs, SAE reporting within 24h", cannot: "Open studies they don't belong to (403, logged)" },
  { role: "Study Coordinator", org: "Trial site", sees: "Assigned studies", does: "Screening, enrolment, visits, consent, query responses", cannot: "Apply e-signatures, assess causality" },
  { role: "Monitor", org: "Sponsor", sees: "Assigned studies", does: "Source-data verification, raise queries, deviations, CAPA follow-up", cannot: "Edit CRF data, close their own queries" },
  { role: "Ethics Committee", org: "IEC, AIIA", sees: "All studies (read)", does: "SAE review, compensation opinion, consent oversight", cannot: "Any data entry" },
  { role: "Pharmacovigilance (NPvCC)", org: "NPvCC, AIIA", sees: "All safety data", does: "Triage, dual causality, signal watch, DSMB feed", cannot: "Edit trial operations data" },
  { role: "Administration", org: "AIIA", sees: "Full portfolio", does: "Users, roles, alerts, configuration", cannot: "Edit clinical records" },
  { role: "Regulator (read-only)", org: "Ministry", sees: "Everything, read-only", does: "Audit verification, export review", cannot: "Write anything; every view is watermarked" },
];

export default function RoleGuides() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For trial staff</p>
      <h1 className="display mt-2 text-[30px] font-medium">Guides for all 7 roles</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
        Access is role plus study membership. The server checks every request; UI hiding is never the control.
      </p>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4]">
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-[#F3EFE5]">
            <tr className="text-[10.5px] tracking-wider text-[#7A887D] uppercase">
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Sees</th>
              <th className="px-4 py-2.5 font-medium">Does</th>
              <th className="px-4 py-2.5 font-medium">Cannot</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r, i) => (
              <tr key={r.role} className={i > 0 ? "border-t border-[#E3DED4]" : ""}>
                <td className="px-4 py-3 font-semibold text-[#1C2A21]">{r.role}<span className="block text-[10.5px] font-normal text-[#7A887D]">{r.org}</span></td>
                <td className="px-4 py-3 text-[#4A5A4F]">{r.sees}</td>
                <td className="px-4 py-3 text-[#4A5A4F]">{r.does}</td>
                <td className="px-4 py-3 text-[#A44A2A]">{r.cannot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-[#4A5A4F]">The same matrix is live in the app at <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1.5 py-0.5 rounded">/admin</code>, with a per-study membership list below it.</p>
    </article>
  );
}
