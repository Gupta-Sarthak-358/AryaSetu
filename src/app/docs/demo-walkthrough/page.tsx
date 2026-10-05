export const metadata = { title: "Demo walkthrough — AryaSetu Docs" };

const stops = [
  { t: "0:00", title: "Command Center", do: "Point at the 6 KPI tiles and the telemetry tabs. Scan the Priority Action Queue — every alert is computed, not seeded." },
  { t: "0:30", title: "SAE workspace (SAE-2026-041)", do: "Read the 24h clock (now OVERDUE — the engine escalates). Walk the statutory chain to compensation. Open the dual-causality panel. Download CIOMS-I PDF." },
  { t: "1:05", title: "Batch trace (B-1142)", do: "Follow lot → QC variance → 3 sites → 6 participants → 3 hepatic AEs. The cluster rule fired on its own." },
  { t: "1:30", title: "Safety command", do: "Show live ROR+PRR+χ² disproportionality and the person-time exposure rates. Note the FAERS-style limitations banner." },
  { t: "1:50", title: "Audit chain", do: "Simulate tamper on record #7 — chain goes INVALID and names the broken record. Restore." },
  { t: "2:10", title: "Interoperability", do: "Open the live FHIR bundle for the same SAE. Point at the SDTM/ADaM/Define-XML/.xpt download row." },
  { t: "2:30", title: "Roles & access", do: "Show the 7×11 permission matrix, the study-level ACL, and the deployment diagnostics card (live DB host + counts)." },
];

export default function DemoWalkthrough() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">Start here</p>
      <h1 className="display mt-2 text-[30px] font-medium">Demo walkthrough</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">Seven stops, three minutes. Sign in as PV Officer first (pv@aryasetu.in / AryaSetu@123).</p>
      <div className="mt-6 space-y-3">
        {stops.map((s) => (
          <div key={s.t} className="panel flex gap-4 p-4">
            <span className="num w-12 shrink-0 text-[12px] font-semibold text-[#2D5A3D]">{s.t}</span>
            <div>
              <h2 className="text-[14px] font-semibold">{s.title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#4A5A4F]">{s.do}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-[#4A5A4F]">If time runs short, drop stops 4 and 6 — never drop 2, 3, or 5.</p>
    </article>
  );
}
