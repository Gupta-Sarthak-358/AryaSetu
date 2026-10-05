export const metadata = { title: "KPI and alert setup — AryaSetu Docs" };

export default function KpiAlerts() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For trial staff</p>
      <h1 className="display mt-2 text-[30px] font-medium">KPI and alert setup</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <p>Nothing on the Command Center is hardcoded. Every alert is computed from the live database on each request by the rule engine (<code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1.5 py-0.5 rounded">src/lib/server/rules.ts</code>).</p>
        <h2 className="text-[17px] font-semibold">The five rules</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>SAE clock</strong> — any open SAE → critical alert with the NDCT 24h deadline; overdue escalates automatically</li>
          <li><strong>CTRI update</strong> — any study whose six-monthly update is past due → warning</li>
          <li><strong>IEC expiry</strong> — approval expiring within 45 days → warning</li>
          <li><strong>Batch cluster</strong> — ≥3 hepatic AEs on one batch in 30 days → warning (this is the B-1142 rule)</li>
          <li><strong>Query aging</strong> — open queries, and count aged &gt;14 days → info</li>
        </ul>
        <h2 className="text-[17px] font-semibold">Why rules before ML</h2>
        <p>Statutory deadlines are deterministic — a rule either fires or it doesn&apos;t, and it&apos;s testable. Machine learning gets layered on after the rules are proven correct against real usage, never before.</p>
      </div>
    </article>
  );
}
