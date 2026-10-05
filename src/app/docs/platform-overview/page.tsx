export const metadata = { title: "Platform overview — AryaSetu Docs" };

export default function PlatformOverview() {
  return (
    <article className="prose max-w-none">
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">Start here</p>
      <h1 className="display mt-2 text-[30px] font-medium">Platform overview</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <p>AryaSetu is a National Clinical Trial Management System (CTMS) for Ayurveda research, built for the All India Institute of Ayurveda (AIIA) under the Ministry of Ayush. It replaces spreadsheet tracking with one real-time, auditable system of record.</p>
        <h2 className="text-[17px] font-semibold">What it unifies</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Trial execution</strong> — lifecycle from protocol to close-out across 12 curated studies and 8 sites, plus 40 real CTRI registry records (52 total)</li>
          <li><strong>NPvCC pharmacovigilance</strong> — AE/SAE intake, dual causality (WHO-UMC + Naranjo), disproportionality screening and exposure-adjusted rates</li>
          <li><strong>Regulatory timelines</strong> — CTRI and IEC tracking, with an NDCT 2019 statutory clock engine that computes every deadline from time of awareness</li>
          <li><strong>Interoperability</strong> — live FHIR R4 endpoints, downloadable SDTM/ADaM/Define-XML/ODM, and a working binary .xpt export</li>
          <li><strong>Governance</strong> — 7-role RBAC with study-level ACL and a hash-chained, tamper-evident audit trail</li>
        </ul>
        <h2 className="text-[17px] font-semibold">What it is not</h2>
        <p>A certified compliance product, a licensed MedDRA/WHODrug deployment, or a real ABDM integration. Every limitation is stated on the page where it applies — see the synthetic data policy.</p>
      </div>
    </article>
  );
}
