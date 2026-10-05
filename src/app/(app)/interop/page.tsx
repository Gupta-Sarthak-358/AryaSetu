import { Badge, Card, CardTitle, PageHeader, StatusAuto } from "@/components/ui";
import { defineXmlSnippet, fhirBundle, interopResources, sdtmAePreview, sdtmDmPreview } from "@/lib/data/interop";
import { FileDown } from "lucide-react";

export default function InteropPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Data exports"
        sub="FHIR bundles, SDTM tables and Define-XML, generated from the register"
        right={<div className="flex gap-1.5"><Badge>FHIR R4</Badge><Badge>SDTM</Badge><Badge>Define-XML</Badge></div>}
      />

      <Card>
        <CardTitle
          title="FHIR endpoints"
          sub="Served from the database as FHIR JSON — sign-in required"
          right={<Badge>GET</Badge>}
        />
        <div className="space-y-1.5 font-mono2 text-[11px]">
          {[
            ["/api/fhir/ResearchStudy/AYU-036", "ResearchStudy — Guduchi registry"],
            ["/api/fhir/AdverseEvent/SAE-2026-041", "AdverseEvent — with WHO-UMC + Naranjo + batch extensions"],
            ["/api/fhir/Bundle/SAE-2026-041", "Bundle — Study + Subject + AdverseEvent + Medication"],
          ].map(([path, desc]) => (
            <a key={path} href={path} target="_blank" className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] px-3 py-2 hover:border-[#2D5A3D]/50">
              <span className="text-[#2D5A3D]">{path}</span>
              <span className="text-[#7A887D]">{desc}</span>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle
          title="Downloadable exports"
          sub="Generated on request · role-checked · every export logged"
          right={<Badge>CSV / XML</Badge>}
        />
        <div className="grid gap-1.5 font-mono2 text-[11px] sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["/api/export/sdtm/dm", "SDTM DM", "Demographics, all studies"],
            ["/api/export/sdtm/ae", "SDTM AE", "Full AE domain from register"],
            ["/api/export/sdtm/ex", "SDTM EX", "Exposure with batch lots"],
            ["/api/export/xpt/ae", "AE.xpt", "Binary SAS Transport v5 (draft)"],
            ["/api/export/adam/adsl", "ADaM ADSL", "Subject-level analysis set"],
            ["/api/export/metadata/define-xml", "Define-XML 2.1", "Dataset metadata"],
            ["/api/export/metadata/odm", "ODM 1.3.2", "CDASH instruments (draft)"],
          ].map(([href, name, desc]) => (
            <a key={href} href={href} className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] px-3 py-2 hover:border-[#2D5A3D]/50">
              <span className="text-[#2D5A3D]">{name}</span>
              <span className="text-[#7A887D]">{desc}</span>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle title="FHIR R4 resource coverage" sub="Draft Ayush-CT profile — exchange layer, not the internal database" />
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {interopResources.map((r) => (
            <div key={r.name} className={`rounded-[5px] border p-3 ${r.mapped ? "border-[#E3DED4] bg-[#FFFFFF]" : "border-[#E3DED4] bg-[#F3EFE5]"}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[11.5px] text-[#1C2A21]">{r.name}</span>
                <StatusAuto status={r.mapped ? "Implemented" : "Excluded"} />
              </div>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-[#4A5A4F]">{r.note}</p>
              {r.mapped && <p className="num mt-1 text-[10px] text-[#2D5A3D]">{r.count.toLocaleString("en-IN")} resources</p>}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardTitle
            title="FHIR bundle — SAE-2026-041"
            sub="GET /fhir/Bundle/ayu-036-sae-041 · application/fhir+json"
            right={<span className="btn-outline cursor-pointer !py-1 text-[11px]"><FileDown size={11} /> .json</span>}
          />
          <pre className="max-h-[380px] overflow-auto rounded-[5px] border border-[#E3DED4] bg-[#F3EFE5] p-3.5 font-mono2 text-[10px] leading-relaxed text-[#4A5A4F] scrollbar-thin">
{JSON.stringify(fhirBundle, null, 2)}
          </pre>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardTitle
            title="SDTM AE table"
            sub="Submission tabulation from the event register"
              right={<span className="btn-outline cursor-pointer !py-1 text-[11px]"><FileDown size={11} /> .xpt</span>}
            />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left font-mono2 text-[10px]">
                <thead>
                  <tr className="border-b border-[#E3DED4] text-[#4A5A4F] uppercase">
                    {Object.keys(sdtmAePreview[0]).map((k) => <th key={k} className="pr-3 pb-2 font-medium whitespace-nowrap">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sdtmAePreview.map((row, i) => (
                    <tr key={i} className="border-b border-[#E3DED4] last:border-0">
                      {Object.values(row).map((v, j) => <td key={j} className="py-1.5 pr-3 whitespace-nowrap text-[#4A5A4F]">{v}</td>)}
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
                  <tr className="border-b border-[#E3DED4] text-[#4A5A4F] uppercase">
                    {Object.keys(sdtmDmPreview[0]).map((k) => <th key={k} className="pr-3 pb-2 font-medium whitespace-nowrap">{k}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sdtmDmPreview.map((row, i) => (
                    <tr key={i} className="border-b border-[#E3DED4] last:border-0">
                      {Object.values(row).map((v, j) => <td key={j} className="py-1.5 pr-3 whitespace-nowrap text-[#4A5A4F]">{v}</td>)}
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
          <pre className="overflow-auto rounded-[5px] border border-[#E3DED4] bg-[#F3EFE5] p-3.5 font-mono2 text-[10px] leading-relaxed text-[#4A5A4F] scrollbar-thin">
{defineXmlSnippet}
          </pre>
        </Card>

        <Card>
          <CardTitle title="What connects today" sub="Working exports and documented limits" />
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
              <div key={r.label} className="flex items-center justify-between gap-3 rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-2.5">
                <span className="text-[11.5px] text-[#4A5A4F]">{r.label}</span>
                <StatusAuto status={r.status} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-[#7A887D]">
            AryaSetu never claims certification: CDISC/FHIR artifacts are demonstrated as working exports on synthetic data; ABDM is documented as a blueprint until sandbox access is granted.
          </p>
        </Card>
      </div>
    </div>
  );
}
