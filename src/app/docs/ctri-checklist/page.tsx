export const metadata = { title: "CTRI reporting checklist — AryaSetu Docs" };

const items = [
  ["Prospective registration before first enrolment", "All 12 demo studies registered pre-enrolment"],
  ["CTRI number on every study record", "Stored and displayed; format validated on import"],
  ["Six-monthly updates filed on time", "Rule engine flags overdue updates portfolio-wide"],
  ["Results uploaded within the required window after completion", "Close-out milestone per study with reminder"],
  ["Registry metadata kept consistent with the trial system", "40 real records imported through the validated seed pipeline"],
  ["Public-facing accuracy", "Synthetic/demo studies clearly labelled; no real records claimed as AryaSetu trials"],
];

export default function CtriChecklist() {
  return (
    <article>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">For reviewers</p>
      <h1 className="display mt-2 text-[30px] font-medium">CTRI reporting checklist</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4]">
        <table className="w-full text-left text-[12.5px]">
          <tbody>
            {items.map((c, i) => (
              <tr key={c[0]} className={i > 0 ? "border-t border-[#E3DED4]" : ""}>
                <td className="px-4 py-3 text-[#1C2A21]">{c[0]}</td>
                <td className="px-4 py-3 text-[#4A5A4F]">{c[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
