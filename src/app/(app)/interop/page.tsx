import { Badge, Card, CardTitle, PageHeader, StatusAuto } from "@/components/ui";
import { defineXmlSnippet, fhirBundle, interopResources, sdtmAePreview, sdtmDmPreview } from "@/lib/data/interop";
import { FileDown } from "lucide-react";

export default function InteropPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 06 · INTEROPERABILITY"
        title="FHIR R4 ↔ CDISC Exchange"
        sub="Standards as working artifacts — live bundles, SDTM previews, Define-XML metadata"
        right={<div className="flex gap-1.5"><Badge>FHIR R4</Badge><Badge>SDTM IG 3.4-ALIGNED</Badge><Badge>DEFINE-XML 2.1</Badge></div>}
      />

      <Card>
        <CardTitle title="FHIR R4 resource coverage" sub="Draft Ayush-CT profile — exchange layer, not the internal database" />
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {interopResources.map((r) => (
            <div key={r.name} className={`rounded-[5px] border p-3 ${r.mapped ? "border-[#2d2d33] bg-[#101012]" : "border-[#222226] bg-[#0d0d0f]"}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[11.5px] text-zinc-100">{r.name}</span>
                <StatusAuto status={r.mapped ? "Implemented" : "Excluded"} />
              </div>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-zinc-500">{r.note}</p>
              {r.mapped && <p className="num mt-1 text-[10px] text-emerald-500">{r.count.toLocaleString("en-IN")} resources</p>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardTitle
            title="Live FHIR Bundle — SAE-2026-041"
            sub="GET /fhir/Bundle/ayu-036-sae-041 · application/fhir+json"
            right={<span className="btn-outline cursor-pointer !py-1 text-[11px]"><FileDown size={11} /> .json</span>}
          />
          <pre className="max-h-[380px] overflow-auto rounded-[5px] border border-[#222226] bg-[#0a0a0b] p-3.5 font-mono2 text-[10px] leading-relaxed text-zinc-500 scrollbar-thin">
{JSON.stringify(fhirBundle, null, 2)}
          </pre>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardTitle
              title="SDTM AE domain — preview"
              sub="Submission-ready tabulation (demo dictionaries)"
              right={<span className="btn-outline cursor-pointer !py-1 text-[11px]"><FileDown size={11} /> .xpt</span>}
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono2 text-[10px]">
                <thead>
                  <tr className="border-b border-[#222226] text-zinc-500 uppercase">
                    {Object.keys(sdtmAePreview[0]).map((k) => <th key={k} className="pr-3 pb-2 font-medium whitespace-nowrap">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sdtmAePreview.map((row, i) => (
                    <tr key={i} className="border-b border-[#1c1c20] last:border-0">
                      {Object.values(row).map((v, j) => <td key={j} className="py-1.5 pr-3 whitespace-nowrap text-zinc-400">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardTitle title="SDTM DM domain — with Prakriti" sub="Ayurveda-specific baseline as supplemental qualifier" />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono2 text-[10px]">
                <thead>
                  <tr className="border-b border-[#222226] text-zinc-500 uppercase">
                    {Object.keys(sdtmDmPreview[0]).map((k) => <th key={k} className="pr-3 pb-2 font-medium whitespace-nowrap">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sdtmDmPreview.map((row, i) => (
                    <tr key={i} className="border-b border-[#1c1c20] last:border-0">
                      {Object.values(row).map((v, j) => <td key={j} className="py-1.5 pr-3 whitespace-nowrap text-zinc-400">{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardTitle title="Define-XML 2.1 — metadata snippet" sub="Machine-readable dataset definitions" right={<span className="btn-outline cursor-pointer !py-1 text-[11px]"><FileDown size={11} /> define.xml</span>} />
          <pre className="overflow-auto rounded-[5px] border border-[#222226] bg-[#0a0a0b] p-3.5 font-mono2 text-[10px] leading-relaxed text-zinc-500 scrollbar-thin">
{defineXmlSnippet}
          </pre>
        </Card>

        <Card>
          <CardTitle title="Integration boundary — honest scope" sub="What is real, what is planned" />
          <div className="space-y-1.5">
            {[
              { label: "FHIR R4 bundle generation (ResearchStudy, Subject, AdverseEvent, Consent, Medication)", status: "Implemented (demo data)" },
              { label: "SDTM DM/AE/EX + Define-XML export", status: "Implemented (demo data)" },
              { label: "ADaM ADSL preview", status: "Implemented (demo data)" },
              { label: "CDASH instrument library + ODM", status: "Planned — Phase 3" },
              { label: "ABDM sandbox (ABHA, HIP/HIU adapters)", status: "Blueprint — not connected" },
              { label: "HIS / EDC live connectors (Ayush Grid A-HMIS)", status: "Planned — Phase 2" },
              { label: "NAMASTE ↔ ICD-11 TM2 dual coding for AE terms", status: "Draft profile" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 rounded-[5px] border border-[#222226] bg-[#101012] p-2.5">
                <span className="text-[11.5px] text-zinc-400">{r.label}</span>
                <StatusAuto status={r.status} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-zinc-600">
            AryaSetu never claims certification: CDISC/FHIR artifacts are demonstrated as working exports on synthetic data; ABDM is documented as a blueprint until sandbox access is granted.
          </p>
        </Card>
      </div>
    </div>
  );
}
