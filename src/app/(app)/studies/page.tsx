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
        code="SEC 02 · PORTFOLIO"
        title="Studies"
        sub={`${studies.length} studies · ${fmtNum(portfolioTotals.enrolled)} enrolled of ${fmtNum(portfolioTotals.target)} target · 8 sites`}
        right={
          <div className="flex gap-1.5">
            {["All", "Recruiting", "Follow-up", "Analysis", "Safety Hold", "Close-out"].map((f, i) => (
              <span key={f} className={`cursor-pointer rounded-[4px] border px-2.5 py-1 text-[11px] font-medium ${i === 0 ? "border-[#3f3f46] bg-[#1a1a1e] text-zinc-100" : "border-[#2d2d33] text-zinc-500 hover:border-[#3f3f46] hover:text-zinc-300"}`}>
                {f}
              </span>
            ))}
          </div>
        }
      />

      <Card className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="sticky-thead border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
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
              {studies.map((s, i) => (
                <tr key={s.id} className={`row-hover border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""}`}>
                  <td className="px-4 py-3">
                    <Link href={`/studies/${s.id}`} className="font-mono2 text-[11.5px] font-semibold text-emerald-400 hover:text-emerald-300">{s.id}</Link>
                  </td>
                  <td className="py-3 pr-4">
                    <Link href={`/studies/${s.id}`} className="block max-w-[380px]">
                      <span className="block truncate text-zinc-200">{s.shortTitle}</span>
                      <span className="block truncate text-[11px] text-zinc-600">{s.intervention}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-zinc-400">{s.phase}</td>
                  <td className="py-3 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.enrolled} max={s.target} kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"} className="w-16" />
                      <span className="num text-[11px] text-zinc-400">{s.enrolled}<span className="text-zinc-600">/{s.target}</span></span>
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
