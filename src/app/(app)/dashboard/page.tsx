import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, Card, CardTitle, KpiTile, PageHeader, ProgressBar, Status, StatusAuto } from "@/components/ui";
import { ChartTabs } from "@/components/ChartTabs";
import { studies } from "@/lib/data/studies";
import { alerts, auditChain, kpis, monitoringCompliance, myTasks } from "@/lib/data/ops";
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

export default function DashboardPage() {
  const cd = countdown("2026-10-03T21:12:00+05:30");
  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 01 · NATIONAL COMMAND"
        title="Live Command Center"
        sub="Entire AIIA clinical-research portfolio — one auditable, real-time view"
        right={<Status kind="ok" label="Audit chain verified" live />}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Active studies" value={String(kpis.activeStudies)} sub={<span className="text-emerald-500">+2 this quarter</span>} href="/studies" />
        <KpiTile label="Enrolled" value={fmtNum(kpis.enrolled)} sub={<span>of {fmtNum(kpis.target)} · {pct(kpis.enrolled, kpis.target)}%</span>} href="/studies" />
        <KpiTile label="Sites active" value={`${kpis.sitesActive}/${kpis.sitesTotal}`} sub="8 states covered" href="/studies" />
        <KpiTile label="Open SAEs" value={String(kpis.openSaes)} kind="crit" sub={<span className="text-red-400">24h clock {cd.text}</span>} href="/safety/SAE-2026-041" />
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
              <Link key={a.id} href={a.href} className={`row-hover flex items-start gap-2.5 rounded-[5px] border border-[#222226] bg-[#101012] p-2.5 pl-3 transition-colors ${a.severity === "critical" ? "border-l-2 border-l-red-500" : a.severity === "warning" ? "border-l-2 border-l-amber-500" : "border-l-2 border-l-sky-500"}`}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] leading-snug text-zinc-200">{a.title}</span>
                  <span className="mt-0.5 flex items-center gap-1 font-mono2 text-[10px] text-zinc-600 uppercase">
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
          <CardTitle title="My tasks" sub="Assigned to current role" right={<Badge>{myTasks.length}</Badge>} />
          <div className="space-y-1.5">
            {myTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2.5 rounded-[5px] border border-[#222226] bg-[#101012] p-2.5">
                <Status kind={prioKind[t.priority]} label="" className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-snug text-zinc-200">{t.title}</p>
                  <p className="mt-0.5 font-mono2 text-[10px] text-zinc-600">{t.id} · {t.studyId} · DUE {t.due.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle title="Monitoring compliance" sub="Overdue visits and late trip reports — CRA oversight" />
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                <th className="pb-2 pr-4 font-medium">Visit</th>
                <th className="pb-2 pr-4 font-medium">Study · site</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Due</th>
                <th className="pb-2 font-medium">State</th>
              </tr>
            </thead>
            <tbody>
              {monitoringCompliance.map((m) => (
                <tr key={m.id} className="row-hover border-b border-[#1c1c20] last:border-0">
                  <td className="py-2 pr-4 font-mono2 text-[11px] text-zinc-400">{m.id}</td>
                  <td className="py-2 pr-4"><span className="text-emerald-400">{m.studyId}</span> <span className="text-zinc-600">·</span> <span className="text-zinc-400">{m.site}</span></td>
                  <td className="py-2 pr-4 text-zinc-400">{m.type}</td>
                  <td className="py-2 pr-4 font-mono2 text-[11px] text-zinc-500">{m.due}</td>
                  <td className="py-2"><StatusAuto status={m.state === "Scheduled" ? "On track" : m.state.includes("late") || m.state.includes("Overdue") ? "Overdue" : "Due-now"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <CardTitle
          title="Study portfolio"
          sub="Lifecycle status, enrolment and risk — click any row to drill down"
          right={<Link href="/studies" className="text-[11.5px] font-medium text-emerald-400 hover:text-emerald-300">View all 12 →</Link>}
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
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
                <tr key={s.id} className="row-hover border-b border-[#1c1c20] last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link href={`/studies/${s.id}`} className="block">
                      <span className="font-mono2 text-[11.5px] font-semibold text-emerald-400">{s.id}</span>
                      <span className="block max-w-[320px] truncate text-[11.5px] text-zinc-500">{s.shortTitle}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap text-zinc-400">{s.phase}</td>
                  <td className="py-2.5 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <ProgressBar value={s.enrolled} max={s.target} kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"} className="w-20" />
                      <span className="num text-[11px] text-zinc-400">{pct(s.enrolled, s.target)}%</span>
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
          <CardTitle title="Safety signal feed" sub="NPvCC surveillance" />
          <div className="space-y-2">
            <div className="rounded-[5px] border border-amber-500/25 bg-amber-500/5 p-3">
              <p className="text-[12px] font-medium text-amber-300">Batch B-1142 hepatic cluster</p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                3 transaminase events in 30 days on one Guduchi batch. Signal review opened; DSMB notification queued.
              </p>
            </div>
            <div className="rounded-[5px] border border-red-500/25 bg-red-500/5 p-3">
              <p className="text-[12px] font-medium text-red-400">Hy&rsquo;s law screen positive</p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                SAE-2026-041: ALT &gt;3× ULN + bilirubin &gt;2× ULN. Liver sentinel rule fired — causality Probable (WHO-UMC).
              </p>
            </div>
            <Link href="/safety" className="block text-[11.5px] font-medium text-emerald-400 hover:text-emerald-300">Open NPvCC workspace →</Link>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle
            title="Recent audit activity"
            sub="Hash-chained · ALCOA+ · tamper-evident"
            right={<Status kind="ok" label="Chain verified" live />}
          />
          <div className="space-y-px">
            {auditChain.slice(0, 5).map((e) => (
              <Link href="/audit" key={e.seq} className="row-hover flex items-center gap-3 rounded-[4px] px-2 py-2">
                <span className="num w-7 shrink-0 text-[10.5px] text-zinc-600">#{e.seq}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] text-zinc-300">{e.action} — <span className="text-zinc-500">{e.entityId}</span></span>
                  <span className="text-[10.5px] text-zinc-600">{e.actor} · {e.role}</span>
                </span>
                <code className="hidden shrink-0 font-mono2 text-[9.5px] text-emerald-500/70 md:block">{e.hash.slice(0, 8)}…{e.hash.slice(-4)}</code>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
