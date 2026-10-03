import { Card, KpiTile, PageHeader, StatusAuto } from "@/components/ui";
import { consentRecords } from "@/lib/data/ops";
import { Lock, Languages, ShieldCheck, Video } from "lucide-react";

export default function ConsentPage() {
  const totalActive = consentRecords.reduce((a, c) => a + c.active, 0);
  const totalPending = consentRecords.reduce((a, c) => a + c.reconsentPending, 0);
  const totalAv = consentRecords.reduce((a, c) => a + c.avConsent, 0);

  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 08 · PRIVACY & CONSENT"
        title="Consent & DPDP Controls"
        sub="Versioned informed consent, multilingual delivery, purpose-bound processing under DPDP Act 2023"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <KpiTile label="Active consents" value={totalActive.toLocaleString("en-IN")} sub={<span className="text-emerald-500">99.1% coverage</span>} />
        <KpiTile label="Re-consents pending" value={String(totalPending)} kind="warn" sub="Amendment-driven" />
        <KpiTile label="AV consents recorded" value={String(totalAv)} sub="Vulnerable subjects (NDCT)" />
        <KpiTile label="Identifier fields in schema" value="0" kind="ok" sub="Data minimisation by design" />
      </div>

      <Card className="p-0">
        <div className="border-b border-[#222226] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-100">Consent versions by study</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">Every consent is hash-stamped to the exact ICF version signed</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
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
                <tr key={c.studyId} className={`row-hover border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""}`}>
                  <td className="px-4 py-2.5 font-mono2 text-[11.5px] font-medium text-emerald-400">{c.studyId}</td>
                  <td className="py-2.5 pr-4 text-zinc-300">{c.version}</td>
                  <td className="py-2.5 pr-4 font-mono2 text-[10.5px] text-zinc-400">{c.language}</td>
                  <td className="py-2.5 pr-4 text-right num text-zinc-300">{c.active}</td>
                  <td className="py-2.5 pr-4 text-right">
                    {c.reconsentPending > 0 ? <span className="num font-semibold text-amber-300">{c.reconsentPending}</span> : <span className="num text-zinc-700">0</span>}
                  </td>
                  <td className="py-2.5 pr-4 text-right num text-zinc-300">{c.avConsent}</td>
                  <td className="py-2.5 pr-4"><StatusAuto status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#222226] pb-2.5"><Lock size={14} className="text-emerald-400" /><h3 className="text-[13px] font-semibold text-zinc-100">DPDP Act 2023 posture</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-zinc-500">
            <li>· Purpose tags bound to every consent record — processing limited to declared purpose</li>
            <li>· No identifier columns in participant schema; linkage keys held separately</li>
            <li>· Withdrawal propagates to dashboards within the same audit chain</li>
            <li>· Research exemption (Sec 17(2)(b)) treated as narrow — participant-specific decisions still governed</li>
            <li>· Encryption in transit and at rest; India-resident hosting posture (ISO 27001, CERT-In)</li>
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#222226] pb-2.5"><Languages size={14} className="text-sky-400" /><h3 className="text-[13px] font-semibold text-zinc-100">Multilingual consent</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-zinc-500">
            <li>· ICF rendered in English, Hindi, Gujarati, Kannada, Assamese by site</li>
            <li>· Audio narration for low-literacy participants (BHASHINI-style delivery, planned)</li>
            <li>· Comprehension check recorded before signature</li>
            <li>· Impartial witness documented where applicable</li>
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center gap-2 border-b border-[#222226] pb-2.5"><Video size={14} className="text-violet-400" /><h3 className="text-[13px] font-semibold text-zinc-100">Audio-visual consent</h3></div>
          <ul className="space-y-2 text-[11.5px] leading-relaxed text-zinc-500">
            <li>· AV consent for vulnerable subjects per NDCT 2019 scope</li>
            <li>· Recording hash-stamped and bound to ICF version + participant key</li>
            <li>· Re-consent on every protocol amendment, tracked to zero-pending</li>
            <li>· 115 AV recordings across 6 studies in this demo dataset</li>
          </ul>
        </Card>
      </div>

      <Card className="border-emerald-500/20">
        <div className="flex items-start gap-3">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400" />
          <p className="text-[11.5px] leading-relaxed text-zinc-500">
            <span className="font-semibold text-zinc-200">Demonstration note:</span> this build processes only synthetic,
            de-identified data. The DPDP controls shown here are the designed posture of the production system;
            no certification is claimed. Provisions of the DPDP Rules are tracked as they commence (2025–2027).
          </p>
        </div>
      </Card>
    </div>
  );
}
