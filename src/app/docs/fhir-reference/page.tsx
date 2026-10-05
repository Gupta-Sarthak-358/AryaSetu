export const metadata = { title: "FHIR R4 reference — AryaSetu Docs" };

const endpoints = [
  ["GET /api/fhir/ResearchStudy/{id}", "ResearchStudy with CTRI identifier, phase, sponsor, sites", "ResearchStudy/AYU-036"],
  ["GET /api/fhir/AdverseEvent/{id}", "AdverseEvent with MedDRA PT, seriousness, WHO-UMC + Naranjo + batch extensions", "AdverseEvent/SAE-2026-041"],
  ["GET /api/fhir/Bundle/{saeId}", "Collection bundle: Study + Subject + AdverseEvent + Medication", "Bundle/SAE-2026-041"],
];

export default function FhirReference() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For trial staff</p>
      <h1 className="display mt-2 text-[30px] font-medium">FHIR R4 reference</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <p>AryaSetu serves FHIR R4 as <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1.5 py-0.5 rounded">application/fhir+json</code> from the live database — not screenshots. Sign in, then open any endpoint:</p>
        <div className="overflow-hidden rounded-lg border border-[#E3DED4]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#F3EFE5]">
              <tr className="text-[10.5px] tracking-wider text-[#7A887D] uppercase">
                <th className="px-4 py-2.5 font-medium">Endpoint</th>
                <th className="px-4 py-2.5 font-medium">Returns</th>
                <th className="px-4 py-2.5 font-medium">Try</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e, i) => (
                <tr key={e[0]} className={i > 0 ? "border-t border-[#E3DED4]" : ""}>
                  <td className="px-4 py-3 font-mono2 text-emerald-700">{e[0]}</td>
                  <td className="px-4 py-3 text-[#4A5A4F]">{e[1]}</td>
                  <td className="px-4 py-3 font-mono2 text-[#2D5A3D]">{e[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-[17px] font-semibold">Resource coverage</h2>
        <p>Mapped: ResearchStudy, ResearchSubject, AdverseEvent, Consent, Medication, Observation (Prakriti, draft Ayush-CT profile). <strong>Patient is intentionally omitted</strong> — DPDP data minimisation.</p>
        <h2 className="text-[17px] font-semibold">Extensions</h2>
        <p>AdverseEvent carries three AryaSetu extensions: <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1 py-0.5 rounded">naranjo-score</code>, <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1 py-0.5 rounded">batch-lot</code>, <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1 py-0.5 rounded">dechallenge</code>.</p>
      </div>
    </article>
  );
}
