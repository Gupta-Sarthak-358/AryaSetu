import Link from "next/link";
import { Badge, Card, CardTitle, KpiTile, PageHeader, Status, StatusAuto } from "@/components/ui";
import { getStudies } from "@/lib/server/repo";
import { fmtDate } from "@/lib/utils";

export default async function RegulatoryPage() {
  const studies = await getStudies();
  const overdue = studies.filter((s) => s.ctriStatus === "Update Due");
  const expiring = studies.filter((s) => new Date(s.iecExpiry) < new Date("2026-11-15"));

  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 05 · REGULATORY COMMAND"
        title="CTRI & Ethics Tracking"
        sub="Prospective registration, six-monthly updates, IEC approvals and milestone oversight"
        right={<Status kind="ok" label="12/12 prospectively registered" />}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <KpiTile label="CTRI updates overdue" value={String(overdue.length)} kind="crit" sub={overdue.map((s) => s.id).join(", ") || "None"} />
        <KpiTile label="IEC approvals expiring <45d" value={String(expiring.length)} kind="warn" sub={expiring.map((s) => s.id).join(", ")} />
        <KpiTile label="CTRI compliance" value="96%" kind="ok" sub="All registered before first enrolment" />
      </div>

      <Card className="p-0">
        <div className="border-b border-[#222226] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-100">Registration & ethics register</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">All 12 studies · sync status as of 03 Oct 15:00 IST</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                <th className="px-4 py-2.5 font-medium">Study</th>
                <th className="py-2.5 pr-4 font-medium">CTRI number</th>
                <th className="py-2.5 pr-4 font-medium">CTRI status</th>
                <th className="py-2.5 pr-4 font-medium">Registered</th>
                <th className="py-2.5 pr-4 font-medium">IEC approval</th>
                <th className="py-2.5 pr-4 font-medium">IEC expiry</th>
                <th className="py-2.5 pr-4 font-medium">Next action</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((s, i) => {
                const overdueCt = s.ctriStatus === "Update Due";
                const expiringIec = new Date(s.iecExpiry) < new Date("2026-11-15");
                return (
                  <tr key={s.id} className={`row-hover border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""}`}>
                    <td className="px-4 py-2.5">
                      <Link href={`/studies/${s.id}`} className="font-mono2 text-[11.5px] font-medium text-emerald-400 hover:text-emerald-300">{s.id}</Link>
                      <span className="block max-w-[200px] truncate text-[10.5px] text-zinc-600">{s.shortTitle}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono2 text-[10.5px] whitespace-nowrap text-zinc-400">{s.ctriNumber}</td>
                    <td className="py-2.5 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                    <td className="py-2.5 pr-4 num whitespace-nowrap text-zinc-400">{fmtDate(s.ctriRegistered)}</td>
                    <td className="py-2.5 pr-4 num whitespace-nowrap text-zinc-400">{fmtDate(s.iecApproval)}</td>
                    <td className={`py-2.5 pr-4 num whitespace-nowrap ${expiringIec ? "font-semibold text-amber-300" : "text-zinc-400"}`}>{fmtDate(s.iecExpiry)}</td>
                    <td className="py-2.5 pr-4">
                      {overdueCt ? <Status kind="crit" label="File CTRI update now" live />
                        : expiringIec ? <Status kind="warn" label="Renew IEC approval" />
                        : <Status kind="neutral" label="On track" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardTitle title="Ethics Committee workload" sub="IEC, AIIA" />
          <div className="space-y-2">
            {[
              { item: "SAE-2026-041 expedited review", meta: "PANEL E-2 · OPINION DUE 01 NOV", crit: true },
              { item: "AYU-031 Amendment 3 re-consent plan", meta: "16 PARTICIPANTS PENDING", crit: false },
              { item: "AYU-019 Rasaushadhi risk ICF v1.3", meta: "96 RE-CONSENTS REQUIRED", crit: false },
              { item: "Annual continuing review — AYU-018", meta: "IEC EXPIRES 29 OCT 2026", crit: false },
            ].map((r) => (
              <div key={r.item} className="flex items-center justify-between rounded-[5px] border border-[#222226] bg-[#101012] p-3">
                <div>
                  <p className="text-[12px] text-zinc-200">{r.item}</p>
                  <p className="mt-0.5 font-mono2 text-[9.5px] text-zinc-600">{r.meta}</p>
                </div>
                <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${r.crit ? "bg-red-400 live-dot" : "bg-amber-400"}`} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle title="NDCT 2019 applicability" sub="Versioned governing-regime classification" />
          <p className="text-[12px] leading-relaxed text-zinc-500">
            ASU drugs are governed under Chapter IV-A of the Drugs and Cosmetics Act and Part XVI of the Rules;
            whether a given AIIA trial falls under NDCT 2019 depends on the product&rsquo;s regulatory status.
            AryaSetu records the governing-regime decision per study, versioned.
          </p>
          <div className="mt-3 rounded-[5px] border border-[#222226] bg-[#101012] p-3">
            <p className="section-label">Demo classification</p>
            <div className="mt-2 space-y-1.5 text-[11.5px]">
              <p className="flex items-center justify-between"><span className="text-zinc-400">AYU-036, AYU-019 (Phase IV surveillance)</span><Badge>GCP-ASU + NPVCC</Badge></p>
              <p className="flex items-center justify-between"><span className="text-zinc-400">AYU-024, AYU-031, AYU-050 (interventional)</span><Badge>GCP-ASU + ICMR</Badge></p>
              <p className="flex items-center justify-between"><span className="text-zinc-400">SAE reporting chain</span><Badge>NDCT 2019 TIMELINES</Badge></p>
            </div>
          </div>
          <p className="mt-2.5 text-[10.5px] text-zinc-600">Jan 2026 NDCT amendments (test-licence timelines, EC registration) tracked in the rule engine&rsquo;s change log.</p>
        </Card>
      </div>
    </div>
  );
}
