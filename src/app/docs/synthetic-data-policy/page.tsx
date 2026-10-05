export const metadata = { title: "Synthetic data policy — AryaSetu Docs" };

export default function SyntheticDataPolicy() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">Start here</p>
      <h1 className="display mt-2 text-[30px] font-medium">Synthetic data policy</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <p>Clinical-trial data is sensitive personal data. AryaSetu is a demonstration build — <strong>no real patient data exists anywhere in it.</strong></p>
        <h2 className="text-[17px] font-semibold">What is real</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>40 public CTRI registry records (titles, CTRI numbers, phases, sponsors, sites) — public metadata only, imported via our validated seed pipeline</li>
          <li>Regulatory timelines and statutory rules (NDCT 2019, GCP-ASU, ICMR, CTRI update cadence)</li>
          <li>The software: every route, every computation, every export</li>
        </ul>
        <h2 className="text-[17px] font-semibold">What is synthetic</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>All participants (IDs only, zero identifier columns by design)</li>
          <li>All adverse events, SAEs, causality assessments, lab values</li>
          <li>All batches, QC certificates, site staffing and consent records</li>
          <li>MedDRA and WHODrug appear as clearly-labelled demonstration dictionaries</li>
        </ul>
        <h2 className="text-[17px] font-semibold">What is not claimed</h2>
        <p>No CDISC, FHIR, GCP or 21 CFR Part 11 certification. No WORM storage. No ABDM connection (documented blueprint only). No qualified e-signature. The audit chain is application-level tamper evidence on a real database, not a regulated store.</p>
      </div>
    </article>
  );
}
