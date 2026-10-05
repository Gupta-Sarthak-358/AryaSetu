export const metadata = { title: "10-minute quick start — AryaSetu Docs" };

export default function QuickStart() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">Start here</p>
      <h1 className="display mt-2 text-[30px] font-medium">10-minute quick start</h1>
      <div className="mt-6 space-y-4 text-[14px] leading-[1.75] text-[#1C2A21]">
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Open</strong> https://arya-setu.vercel.app and read the homepage top to bottom (2 min).</li>
          <li><strong>Sign in</strong> — pick any of the 7 demo personas on <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1.5 py-0.5 rounded">/login</code>. Demo password: <code className="font-mono2 text-[12px] bg-[#F3EFE5] px-1.5 py-0.5 rounded">AryaSetu@123</code> (1 min).</li>
          <li><strong>Command Center</strong> — read the 6 KPI tiles, click the telemetry tabs, scan the Priority Action Queue (2 min).</li>
          <li><strong>Open SAE-2026-041</strong> — the red card. Read the statutory chain, then click CIOMS-I PDF (2 min).</li>
          <li><strong>Batch trace</strong> — follow Batch B-1142 from QC to the AE cluster (1 min).</li>
          <li><strong>Audit chain</strong> — click &ldquo;Simulate tamper on record #7&rdquo;, watch INVALID, restore (1 min).</li>
          <li><strong>Interop</strong> — open the live FHIR bundle and download AE.xpt (1 min).</li>
        </ol>
        <p>That is the whole system. Everything else — studies, regulatory, consent, admin — follows the same pattern: dense tables, real data, audit-logged actions.</p>
      </div>
    </article>
  );
}
