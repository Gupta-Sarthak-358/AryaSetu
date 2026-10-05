import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Card, CardTitle, KpiTile, PageHeader, ProgressBar, Status, StatusAuto } from "@/components/ui";
import { ChartTabs } from "@/components/ChartTabs";
import { kpis, monitoringCompliance, myTasks } from "@/lib/data/ops";
import { getAuditEntries, getStudies } from "@/lib/server/repo";
import { evaluateRules } from "@/lib/server/rules";
import { countdown, fmtNum, pct } from "@/lib/utils";

const sevKind: Record<string, "crit" | "warn" | "info"> = {
  critical: "crit",
  warning: "warn",
  info: "info",
};

const prioKind: Record<string, "crit" | "warn" | "neutral"> = {
  critical: "crit",
  high: "warn",
  medium: "neutral",
  low: "neutral",
};

export default async function DashboardPage() {
  const [studies, alerts, auditChain] = await Promise.all([getStudies(), evaluateRules(), getAuditEntries()]);
  const cd = countdown("2026-10-03T21:12:00+05:30");
  return (
    <div className="space-y-4">
      <PageHeader
        title="Trial register"
        sub="12 studies across 8 sites — enrolment, safety clocks and audit, as of 03 Oct 15:00 IST"
        right={<Status kind="ok" label="Audit chain verified" live />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Active studies" value={String(kpis.activeStudies)} sub={<span className="text-[#2D5A3D]">+2 this quarter</span>} href="/studies" />
        <KpiTile label="Enrolled" value={fmtNum(kpis.enrolled)} sub={<span>of {fmtNum(kpis.target)} · {pct(kpis.enrolled, kpis.target)}%</span>} href="/studies" />
        <KpiTile label="Sites reporting" value={`${kpis.sitesActive}/${kpis.sitesTotal}`} sub="8 states covered" href="/studies" />
        <KpiTile label="Open SAEs" value={String(kpis.openSaes)} kind="crit" sub={<span className="text-[#A44A2A]">24h clock {cd.text}</span>} href="/safety/SAE-2026-041" />
        <KpiTile label="Queries open" value={String(kpis.dataQueriesOpen)} kind="warn" sub={<span>{kpis.dataQueriesAged} aged &gt;14d</span>} href="/studies" />
        <KpiTile label="CTRI compliance" value={`${kpis.ctriCompliance}%`} kind="ok" sub="1 update overdue" href="/regulatory" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartTabs />
        </div>

        <Card>
          <CardTitle title="Priority action queue" sub="Ordered by statutory urgency" right={<Status kind="crit" label={`${alerts.length} active`} live />} />
          <div className="space-y-1.5">
            {alerts.map((a) => (
              <Link key={a.id} href={a.href} className={`row-hover flex items-start gap-2.5 rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-2.5 pl-3 transition-colors active:bg-[#F3EFE5] ${a.severity === "critical" ? "border-l-2 border-l-[#A44A2A]" : a.severity === "warning" ? "border-l-2 border-l-[#B98A2F]" : "border-l-2 border-l-[#3E6B8C]"}`}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] leading-snug text-[#1C2A21]">{a.title}</span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono2 text-[10px] text-[#7A887D]">
                    {a.studyId ?? "PORTFOLIO"} · {a.action} <ArrowUpRight size={9} />
                  </span>
                </span>
                <Status kind={sevKind[a.severity]} label="" live={a.severity === "critical"} className="mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="My tasks" sub="For the signed-in role" right={<Badge>{myTasks.length}</Badge>} />
          <div className="space-y-1.5">
            {myTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2.5 rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-2.5">
                <Status kind={prioKind[t.priority]} label="" className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-snug text-[#1C2A21]">{t.title}</p>
                  <p className="mt-0.5 font-mono2 text-[10px] text-[#7A887D]">{t.id} · {t.studyId} · due {t.due}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2 ledger-strong">
          <CardTitle title="Site visits owed" sub="Overdue visits and late trip reports" />
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b-2 border-[#C9C2B2] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="pb-2 pr-4 font-medium">Visit</th>
                <th className="pb-2 pr-4 font-medium">Study · site</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Due</th>
                <th className="pb-2 font-medium">State</th>
              </tr>
            </thead>
            <tbody>
              {monitoringCompliance.map((m) => (
                <tr key={m.id} className="row-hover border-b border-[#E3DED4] last:border-0">
                  <td className="py-2 pr-4 font-mono2 text-[11px] text-[#4A5A4F]">{m.id}</td>
                  <td className="py-2 pr-4"><span className="font-medium text-[#2D5A3D]">{m.studyId}</span> <span className="text-[#C9C2B2]">·</span> <span className="text-[#4A5A4F]">{m.site}</span></td>
                  <td className="py-2 pr-4 text-[#4A5A4F]">{m.type}</td>
                  <td className="py-2 pr-4 font-mono2 text-[11px] text-[#4A5A4F]">{m.due}</td>
                  <td className="py-2"><StatusAuto status={m.state === "Scheduled" ? "On track" : m.state.includes("late") || m.state.includes("Overdue") ? "Overdue" : "Due-now"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <CardTitle
          title="Studies"
          sub="Enrolment and risk — open a row for the study file"
          right={<Link href="/studies" className="text-[11.5px] font-medium text-[#2D5A3D] hover:text-[#22452F]">View all 12</Link>}
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="pb-2 pr-4 font-medium">Study</th>
                <th className="pb-2 pr-4 font-medium">Phase</th>
                <th className="pb-2 pr-4 font-medium">CTRI</th>
                <th className="pb-2 pr-4 font-medium">Enrolment</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {studies.slice(0, 7).map((s) => (
                <tr key={s.id} className="row-hover border-b border-[#E3DED4] last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link href={`/studies/${s.id}`} className="block rounded px-1 py-0.5 active:bg-[#F3EFE5]">
                      <span className="font-mono2 text-[11.5px] font-semibold text-[#2D5A3D]">{s.id}</span>
                      <span className="block max-w-[320px] truncate text-[11.5px] text-[#4A5A4F]">{s.shortTitle}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap text-[#4A5A4F]">{s.phase}</td>
                  <td className="py-2.5 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <ProgressBar value={s.enrolled} max={s.target} kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"} className="w-20" />
                      <span className="num text-[11px] text-[#4A5A4F]">{pct(s.enrolled, s.target)}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4"><StatusAuto status={s.status} live={s.status === "Recruiting"} /></td>
                  <td className="py-2.5"><StatusAuto status={s.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="Open safety events" sub="NPvCC watch list" />
          <div className="space-y-2">
            <div className="rounded-[6px] border border-[#B98A2F]/40 bg-[#B98A2F]/5 p-3">
              <p className="text-[12px] font-medium text-[#8A6A1F]">Batch B-1142 hepatic cluster</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#4A5A4F]">
                3 transaminase events in 30 days on one Guduchi batch. Review opened; DSMB note queued.
              </p>
            </div>
            <div className="rounded-[6px] border-2 border-[#A44A2A]/50 bg-[#A44A2A]/5 p-3">
              <p className="text-[13px] font-semibold text-[#A44A2A]">SAE-2026-041 · clock running {cd.text}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#4A5A4F]">
                ALT &gt;3× ULN + bilirubin &gt;2× ULN. Causality Probable (WHO-UMC). Investigator alerted; sponsor and IEC transmission pending.
              </p>
              <Link href="/safety/SAE-2026-041" className="btn-crit mt-2 !min-h-[44px] text-[12px]">Open SAE-2026-041</Link>
            </div>
            <Link href="/safety" className="block text-[11.5px] font-medium text-[#2D5A3D] hover:text-[#22452F]">All safety events</Link>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle
            title="Latest audit entries"
            sub="Newest first, hash-linked"
            right={<Status kind="ok" label="Chain verified" live />}
          />
          <div className="space-y-px">
            {auditChain.slice(0, 5).map((e) => (
              <Link href="/audit" key={e.seq} className="row-hover flex items-center gap-3 rounded-[4px] px-2 py-2 active:bg-[#F3EFE5]">
                <span className="num w-7 shrink-0 text-[10.5px] text-[#7A887D]">#{e.seq}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] text-[#1C2A21]">{e.action} — <span className="text-[#4A5A4F]">{e.entityId}</span></span>
                  <span className="text-[10.5px] text-[#7A887D]">{e.actor} · {e.role}</span>
                </span>
                <code className="hidden shrink-0 font-mono2 text-[9.5px] text-[#2D5A3D]/70 md:block">{e.hash.slice(0, 8)}…{e.hash.slice(-4)}</code>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
