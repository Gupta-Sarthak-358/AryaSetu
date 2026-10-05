import Link from "next/link";
import { Badge, Card, PageHeader, ProgressBar, StatusAuto } from "@/components/ui";
import { getStudies } from "@/lib/server/repo";
import { fmtNum, pct } from "@/lib/utils";

export default async function StudiesPage() {
  const studies = await getStudies();
  const portfolioTotals = {
    enrolled: studies.reduce((a, s) => a + s.enrolled, 0),
    target: studies.reduce((a, s) => a + s.target, 0),
  };
  return (
    <div className="space-y-4">
      <PageHeader
        title="Studies"
        sub={`${studies.length} studies · ${fmtNum(portfolioTotals.enrolled)} enrolled of ${fmtNum(portfolioTotals.target)} target · 8 sites`}
        right={
          <div className="flex gap-1.5" role="group" aria-label="Filter by status">
            {["All", "Recruiting", "Follow-up", "Analysis", "Safety Hold", "Close-out"].map((f, i) => (
              <button key={f} aria-pressed={i === 0} className={`min-h-[44px] rounded-[4px] border px-2.5 py-1 text-[11px] font-medium active:bg-[#F3EFE5] ${i === 0 ? "border-[#2D5A3D] bg-[#2D5A3D]/5 text-[#1C2A21]" : "border-[#E3DED4] text-[#4A5A4F] hover:border-[#C9C2B2] hover:text-[#1C2A21]"}`}>
                {f}
              </button>
            ))}
          </div>
        }
      />

      <Card className="ledger-strong p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="sticky-thead border-b-2 border-[#C9C2B2] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="px-4 py-2.5 font-medium">Study ID</th>
                <th className="py-2.5 pr-4 font-medium">Title · intervention</th>
                <th className="py-2.5 pr-4 font-medium">Phase</th>
                <th className="py-2.5 pr-4 font-medium">CTRI</th>
                <th className="py-2.5 pr-4 font-medium">Enrolment</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 pr-4 font-medium">Risk</th>
                <th className="py-2.5 pr-4 text-right font-medium">Open queries</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((s) => (
                <tr key={s.id} className="row-hover border-b border-[#E3DED4] last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/studies/${s.id}`} className="rounded font-mono2 text-[11.5px] font-semibold text-[#2D5A3D] hover:text-[#22452F] active:bg-[#F3EFE5]">{s.id}</Link>
                  </td>
                  <td className="py-3 pr-4">
                    <Link href={`/studies/${s.id}`} className="block max-w-[380px] rounded active:bg-[#F3EFE5]">
                      <span className="block truncate font-medium text-[#1C2A21]">{s.shortTitle}</span>
                      <span className="block truncate text-[11px] text-[#7A887D]">{s.intervention}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[#4A5A4F]">{s.phase}</td>
                  <td className="py-3 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.enrolled} max={s.target} kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"} className="w-16" />
                      <span className="num text-[11px] text-[#4A5A4F]">{s.enrolled}<span className="text-[#C9C2B2]">/{s.target}</span></span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><StatusAuto status={s.status} live={s.status === "Recruiting"} /></td>
                  <td className="py-3 pr-4"><StatusAuto status={s.risk} /></td>
                  <td className="py-3 pr-4 text-right">
                    <Badge>{Math.max(0, (s.id.charCodeAt(4) + s.id.charCodeAt(6)) % 6)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
