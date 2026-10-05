export const metadata = { title: "NDCT 2019 SAE timelines — AryaSetu Docs" };

const steps = [
  ["Site awareness (T0)", "Reference point for every clock below", "Recorded"],
  ["Initial report to Licensing Authority, Sponsor & EC", "Within 24 hours", "Computed, live countdown"],
  ["Full SAE report (sponsor + investigator)", "Within 14 days of awareness", "Computed"],
  ["Ethics Committee compensation opinion", "Within 30 days", "Computed"],
  ["Expert committee recommendation", "Within 60 days", "Computed"],
  ["Licensing Authority order", "Within 90 days", "Computed"],
  ["Sponsor compensation payment (if ordered)", "Within 30 days of order", "Computed"],
];

export default function NdctTimelines() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For reviewers</p>
      <h1 className="display mt-2 text-[30px] font-medium">NDCT Rules 2019 — SAE timeline chain</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
        Every clock is computed from the time of awareness, not from discovery by a coordinator later.
        The demo SAE (SAE-2026-041) is currently OVERDUE on its 24-hour initial report — the engine escalates rather than going quiet.
      </p>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4]">
        <table className="w-full text-left text-[12.5px]">
          <thead className="bg-[#F3EFE5]">
            <tr className="text-[10.5px] tracking-wider text-[#7A887D] uppercase">
              <th className="px-4 py-2.5 font-medium">Step</th>
              <th className="px-4 py-2.5 font-medium">Rule</th>
              <th className="px-4 py-2.5 font-medium">In AryaSetu</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => (
              <tr key={s[0]} className={i > 0 ? "border-t border-[#E3DED4]" : ""}>
                <td className="px-4 py-3 text-[#1C2A21]">{s[0]}</td>
                <td className="px-4 py-3 text-[#4A5A4F]">{s[1]}</td>
                <td className="px-4 py-3 text-[#2D5A3D]">{s[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
