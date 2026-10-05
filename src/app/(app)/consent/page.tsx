import { Card, KpiTile, PageHeader, StatusAuto } from "@/components/ui";
import { getConsentRecords } from "@/lib/server/repo";
import { Lock, Languages, ShieldCheck, Video } from "lucide-react";

export default async function ConsentPage() {
  const consentRecords = await getConsentRecords();
  const totalActive = consentRecords.reduce((a, c) => a + c.active, 0);
  const totalPending = consentRecords.reduce((a, c) => a + c.reconsentPending, 0);
  const totalAv = consentRecords.reduce((a, c) => a + c.avConsent, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Consent and privacy"
        sub="Versioned consent, multilingual forms, purpose-limited use under the DPDP Act"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <KpiTile label="Active consents" value={totalActive.toLocaleString("en-IN")} sub={<span className="text-[#2D5A3D]">99.1% coverage</span>} />
        <KpiTile label="Re-consents pending" value={String(totalPending)} kind="warn" sub="Amendment-driven" />
        <KpiTile label="AV consents recorded" value={String(totalAv)} sub="Vulnerable subjects (NDCT)" />
        <KpiTile label="Identifier fields in schema" value="0" kind="ok" sub="Data minimisation by design" />
      </div>

      <Card className="p-0">
        <div className="border-b border-[#E3DED4] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-[#1C2A21]">Consent versions by study</h3>
          <p className="mt-0.5 text-[11px] text-[#4A5A4F]">Each consent links to the exact form version signed</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="px-4 py-2.5 font-medium">Study</th>
                <th className="py-2.5 pr-4 font-medium">ICF version</th>
                <th className="py-2.5 pr-4 font-medium">Languages</th>
                <th className="py-2.5 pr-4 text-right font-medium">Active</th>
                <th className="py-2.5 pr-4 text-right font-medium">Re-consent pending</th>
                <th className="py-2.5 pr-4 text-right font-medium">AV consent</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {consentRecords.map((c, i) => (
                <tr key={c.studyId} className={`row-hover border-b border-[#E3DED4] last:border-0 ${i % 2 === 1 ? "bg-[#FDFCF9]" : ""}`}>
                  <td className="px-4 py-2.5 font-mono2 text-[11.5px] font-medium text-[#2D5A3D]">{c.studyId}</td>
                  <td className="py-2.5 pr-4 text-[#1C2A21]">{c.version}</td>
                  <td className="py-2.5 pr-4 font-mono2 text-[10.5px] text-[#4A5A4F]">{c.language}</td>
                  <td className="py-2.5 pr-4 text-right num text-[#1C2A21]">{c.active}</td>
                  <td className="py-2.5 pr-4 text-right">
                    {c.reconsentPending > 0 ? <span className="num font-semibold text-[#8A6A1F]">{c.reconsentPending}</span> : <span className="num text-[#C9C2B2]">0</span>}
                  </td>
                  <td className="py-2.5 pr-4 text-right num text-[#1C2A21]">{c.avConsent}</td>
                  <td className="py-2.5 pr-4"><StatusAuto status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5"><Lock size={14} className="text-[#2D5A3D]" /><h3 className="text-[13px] font-semibold text-[#1C2A21]">DPDP Act 2023 posture</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-[#4A5A4F]">
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Purpose tags on every consent record — use limited to the stated purpose</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />No identifier columns in the participant schema; linkage keys held separately</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Withdrawal carries through to dashboards in the same audit chain</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Research exemption treated narrowly — decisions stay participant-specific</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Encryption in transit and at rest; India-resident hosting</li>
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5"><Languages size={14} className="text-[#3E6B8C]" /><h3 className="text-[13px] font-semibold text-[#1C2A21]">Multilingual consent</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-[#4A5A4F]">
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Forms in English, Hindi, Gujarati, Kannada and Assamese by site</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Audio narration for low-literacy participants (planned)</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Comprehension check recorded before signature</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Impartial witness documented where needed</li>
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5"><Video size={14} className="text-[#6B5A8C]" /><h3 className="text-[13px] font-semibold text-[#1C2A21]">Audio-visual consent</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-[#4A5A4F]">
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Recorded AV consent for vulnerable participants</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Recording linked to form version and participant key</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />Re-consent on every amendment, tracked to zero pending</li>
            <li><span className="mr-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[#2D5A3D]" aria-hidden />115 AV recordings across 6 studies in this demo data</li>
          </ul>
        </Card>
      </div>

      <Card className="ledger-strong">
        <div className="flex items-start gap-3">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#2D5A3D]" />
          <p className="text-[11.5px] leading-relaxed text-[#4A5A4F]">
            <span className="font-semibold text-[#1C2A21]">Demonstration note:</span> this build processes only synthetic,
            de-identified data. The DPDP controls shown here are the designed posture of the production system;
            no certification is claimed. Provisions of the DPDP Rules are tracked as they commence (2025–2027).
          </p>
        </div>
      </Card>
    </div>
  );
}
