export const metadata = { title: "Batch traceability notes — AryaSetu Docs" };

export default function BatchTraceability() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For trial staff</p>
      <h1 className="display mt-2 text-[30px] font-medium">Batch traceability notes</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <p>Classical Ayurveda formulations vary batch to batch — a single Arishta can combine 50+ herbs with self-generated alcohol. AryaSetu makes the formulation lot a first-class entity with four edges:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Manufacture + QC</strong> — assay and heavy-metal certificates per lot (assay failures and contaminant metals are flagged, not hidden)</li>
          <li><strong>Distribution</strong> — which sites received the lot, and how much</li>
          <li><strong>Administration</strong> — which participants were dosed, from when</li>
          <li><strong>Safety outcome</strong> — which AEs are linked, with causality</li>
        </ul>
        <h2 className="text-[17px] font-semibold">The cluster rule</h2>
        <p>When ≥3 same-system events accumulate on one batch within 30 days, the rule engine fires a signal-review alert automatically. Demo: Batch B-1142 (Guduchi Ghana Vati) accumulated 3 hepatic AEs across two sites — the rule caught it without a human noticing.</p>
        <h2 className="text-[17px] font-semibold">Rasaushadhi nuance</h2>
        <p>Herbo-mineral products (e.g., Naga Bhasma) contain intentional heavy metals. AryaSetu tracks intended content and contaminant metals separately, and quarantines lots like B-1190 when limits are breached.</p>
      </div>
    </article>
  );
}
