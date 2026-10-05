import Link from "next/link";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import { Badge, Card, CardTitle, KpiTile, PageHeader, ProgressBar, Status, StatusAuto } from "@/components/ui";
import { ChartTabs } from "@/components/ChartTabs";
import { LiveSaeTimer } from "@/components/LiveSaeTimer";
import { kpis, monitoringCompliance, myTasks } from "@/lib/data/ops";
import { getAuditEntries, getStudies } from "@/lib/server/repo";
import { evaluateRules } from "@/lib/server/rules";
import { fmtNum, pct } from "@/lib/utils";

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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Command Center"
        sub="National clinical trial register: 12 studies across 8 sites — enrolment, statutory NDCT safety clocks, and cryptographic audit ledger"
        right={
          <div className="flex items-center gap-2">
            <Status kind="ok" label="SHA-256 Ledger Verified" live />
          </div>
        }
      />

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile
          label="Active Studies"
          value={String(kpis.activeStudies)}
          sub={<span className="text-[#2D5A3D] font-medium">+2 this quarter</span>}
          href="/studies"
        />
        <KpiTile
          label="Total Enrolled"
          value={fmtNum(kpis.enrolled)}
          sub={<span>of {fmtNum(kpis.target)} · {pct(kpis.enrolled, kpis.target)}% target</span>}
          href="/studies"
        />
        <KpiTile
          label="Active Sites"
          value={`${kpis.sitesActive}/${kpis.sitesTotal}`}
          sub="8 States Covered"
          href="/studies"
        />
        <KpiTile
          label="Open SAE Clocks"
          value={String(kpis.openSaes)}
          kind="crit"
          sub={<span className="text-[#A44A2A] font-medium">NDCT 24h statutory rule</span>}
          href="/safety/SAE-2026-041"
        />
        <KpiTile
          label="Open Queries"
          value={String(kpis.dataQueriesOpen)}
          kind="warn"
          sub={<span>{kpis.dataQueriesAged} aged &gt;14 days</span>}
          href="/studies"
        />
        <KpiTile
          label="CTRI Compliance"
          value={`${kpis.ctriCompliance}%`}
          kind="ok"
          sub="Prospective register"
          href="/regulatory"
        />
      </div>

      {/* Hero Statutory SAE Notification Banner */}
      <div className="relative overflow-hidden rounded-xl border-2 border-[#A44A2A]/40 bg-linear-to-r from-[#A44A2A]/[0.08] to-[#FFFFFF] p-4 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#A44A2A]/10 text-[#A44A2A]">
              <AlertCircle size={22} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono2 text-[14px] font-bold text-[#A44A2A]">SAE-2026-041</span>
                <span className="rounded bg-[#A44A2A] px-2 py-0.5 text-[10.5px] font-bold text-white uppercase tracking-wider">
                  24-Hour Statutory Rule
                </span>
                <span className="rounded bg-[#F3EFE5] px-2 py-0.5 text-[11px] font-medium text-[#4A5A4F]">
                  AYUSH-64 · Site 01 (AIIA Delhi)
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#1C2A21] font-medium">
                Acute transaminase elevation &gt;3× ULN with hyperbilirubinemia. Requires regulatory transmission to CDSCO & Ethics Committee.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/safety/SAE-2026-041"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#A44A2A] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#8A3B22] transition-colors"
                >
                  Inspect SAE File & Causality <ArrowUpRight size={13} />
                </Link>
                <Link
                  href="/safety"
                  className="text-[12px] font-medium text-[#4A5A4F] hover:text-[#1C2A21] underline underline-offset-2"
                >
                  View All Pharmacovigilance Logs
                </Link>
              </div>
            </div>
          </div>

          {/* Live countdown widget */}
          <div className="shrink-0 border-t border-[#E3DED4] pt-3 sm:border-t-0 sm:pt-0">
            <LiveSaeTimer />
          </div>
        </div>
      </div>

      {/* Main Charts & Action Queue */}
      <div className="grid gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartTabs />
        </div>

        <Card>
          <CardTitle
            title="Priority Action Queue"
            sub="Ordered by regulatory urgency"
            right={<Status kind="crit" label={`${alerts.length} active`} live />}
          />
          <div className="space-y-2">
            {alerts.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className={`row-hover flex items-start gap-2.5 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-2.5 pl-3 transition-all hover:shadow-xs active:bg-[#F3EFE5] ${
                  a.severity === "critical"
                    ? "border-l-4 border-l-[#A44A2A]"
                    : a.severity === "warning"
                    ? "border-l-4 border-l-[#B98A2F]"
                    : "border-l-4 border-l-[#3E6B8C]"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium leading-snug text-[#1C2A21]">{a.title}</span>
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

      {/* My Tasks & Site Compliance */}
      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="My Active Tasks" sub="Role-specific assignments" right={<Badge>{myTasks.length}</Badge>} />
          <div className="space-y-2">
            {myTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2.5 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-2.5 hover:border-[#C9C2B2] transition-colors">
                <Status kind={prioKind[t.priority]} label="" className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium leading-snug text-[#1C2A21]">{t.title}</p>
                  <p className="mt-0.5 font-mono2 text-[10px] text-[#7A887D]">{t.id} · {t.studyId} · due {t.due}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2 ledger-strong">
          <CardTitle title="Site Visits & Monitoring Schedule" sub="Overdue visits and monitoring trip reports" />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b-2 border-[#C9C2B2] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                  <th className="pb-2 pr-4 font-semibold">Visit ID</th>
                  <th className="pb-2 pr-4 font-semibold">Study · Site</th>
                  <th className="pb-2 pr-4 font-semibold">Type</th>
                  <th className="pb-2 pr-4 font-semibold">Due Date</th>
                  <th className="pb-2 font-semibold">Compliance State</th>
                </tr>
              </thead>
              <tbody>
                {monitoringCompliance.map((m) => (
                  <tr key={m.id} className="row-hover border-b border-[#E3DED4] last:border-0">
                    <td className="py-2.5 pr-4 font-mono2 text-[11px] text-[#4A5A4F]">{m.id}</td>
                    <td className="py-2.5 pr-4">
                      <span className="font-semibold text-[#2D5A3D]">{m.studyId}</span>
                      <span className="text-[#C9C2B2] mx-1">·</span>
                      <span className="text-[#4A5A4F]">{m.site}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-[#4A5A4F]">{m.type}</td>
                    <td className="py-2.5 pr-4 font-mono2 text-[11px] text-[#4A5A4F]">{m.due}</td>
                    <td className="py-2.5">
                      <StatusAuto status={m.state === "Scheduled" ? "On track" : m.state.includes("late") || m.state.includes("Overdue") ? "Overdue" : "Due-now"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Active Studies Portfolio Quick-Table */}
      <Card>
        <CardTitle
          title="Clinical Trials Portfolio"
          sub="Enrolment progress and protocol risk across all registered studies"
          right={<Link href="/studies" className="text-[12px] font-semibold text-[#2D5A3D] hover:text-[#22452F]">View all 12 studies →</Link>}
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="pb-2.5 pr-4 font-semibold">Study Identifier</th>
                <th className="pb-2.5 pr-4 font-semibold">Phase</th>
                <th className="pb-2.5 pr-4 font-semibold">CTRI Status</th>
                <th className="pb-2.5 pr-4 font-semibold">Enrolment Quota</th>
                <th className="pb-2.5 pr-4 font-semibold">Trial Status</th>
                <th className="pb-2.5 font-semibold">Risk Classification</th>
              </tr>
            </thead>
            <tbody>
              {studies.slice(0, 7).map((s) => (
                <tr key={s.id} className="row-hover border-b border-[#E3DED4] last:border-0">
                  <td className="py-3 pr-4">
                    <Link href={`/studies/${s.id}`} className="block rounded hover:underline">
                      <span className="font-mono2 text-[12px] font-bold text-[#2D5A3D]">{s.id}</span>
                      <span className="block max-w-[340px] truncate text-[12px] font-medium text-[#1C2A21]">{s.shortTitle}</span>
                    </Link>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[#4A5A4F] font-medium">{s.phase}</td>
                  <td className="py-3 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <ProgressBar
                        value={s.enrolled}
                        max={s.target}
                        kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"}
                        className="w-24"
                      />
                      <span className="num text-[11px] font-medium text-[#4A5A4F]">{pct(s.enrolled, s.target)}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><StatusAuto status={s.status} live={s.status === "Recruiting"} /></td>
                  <td className="py-3"><StatusAuto status={s.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Safety & Audit Trail Preview */}
      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="Active Safety Signals" sub="National Pharmacovigilance Watchlist" />
          <div className="space-y-2.5">
            <div className="rounded-lg border border-[#B98A2F]/40 bg-[#B98A2F]/5 p-3">
              <p className="text-[12.5px] font-semibold text-[#8A6A1F]">Batch B-1142: Hepatic Cluster</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#4A5A4F]">
                3 transaminase events in 30 days on Guduchi formulation batch. Statistical ROR &gt; 2.4. Independent DSMB note dispatched.
              </p>
            </div>
            <Link
              href="/safety"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2D5A3D] hover:text-[#22452F]"
            >
              Open Safety Command & NPvCC Center →
            </Link>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle
            title="Cryptographic Audit Trail (SHA-256 Chain)"
            sub="Immutable timestamped event ledger — 21 CFR Part 11 and DPDP 2023 compliant"
            right={<Status kind="ok" label="Hash Chain Intact" live />}
          />
          <div className="space-y-1">
            {auditChain.slice(0, 5).map((e) => (
              <Link
                href="/audit"
                key={e.seq}
                className="row-hover flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors active:bg-[#F3EFE5]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="num w-8 shrink-0 font-mono2 text-[11px] font-semibold text-[#7A887D]">#{e.seq}</span>
                  <div className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-[#1C2A21]">
                      {e.action} — <span className="text-[#4A5A4F]">{e.entityId}</span>
                    </span>
                    <span className="text-[10.5px] text-[#7A887D]">{e.actor} · {e.role}</span>
                  </div>
                </div>
                <code className="hidden shrink-0 font-mono2 text-[10px] text-[#2D5A3D] bg-[#2D5A3D]/5 px-2 py-0.5 rounded md:block">
                  {e.hash.slice(0, 10)}…{e.hash.slice(-6)}
                </code>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
