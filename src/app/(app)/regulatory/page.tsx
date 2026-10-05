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
        title="CTRI and ethics"
        sub="Prospective registration, six-monthly updates, IEC approvals"
        right={<Status kind="ok" label="12 of 12 registered before first enrolment" />}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <KpiTile label="CTRI updates overdue" value={String(overdue.length)} kind="crit" sub={overdue.map((s) => s.id).join(", ") || "None"} />
        <KpiTile label="IEC approvals expiring <45d" value={String(expiring.length)} kind="warn" sub={expiring.map((s) => s.id).join(", ")} />
        <KpiTile label="CTRI compliance" value="96%" kind="ok" sub="All registered before first enrolment" />
      </div>

      <Card className="p-0">
        <div className="border-b border-[#E3DED4] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-[#1C2A21]">Registration & ethics register</h3>
          <p className="mt-0.5 text-[11px] text-[#4A5A4F]">All 12 studies · sync status as of 03 Oct 15:00 IST</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
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
                  <tr key={s.id} className={`row-hover border-b border-[#E3DED4] last:border-0 ${i % 2 === 1 ? "bg-[#FDFCF9]" : ""}`}>
                    <td className="px-4 py-2.5">
                      <Link href={`/studies/${s.id}`} className="font-mono2 text-[11.5px] font-medium text-[#2D5A3D] hover:text-[#22452F]">{s.id}</Link>
                      <span className="block max-w-[200px] truncate text-[10.5px] text-[#7A887D]">{s.shortTitle}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono2 text-[10.5px] whitespace-nowrap text-[#4A5A4F]">{s.ctriNumber}</td>
                    <td className="py-2.5 pr-4"><StatusAuto status={s.ctriStatus} /></td>
                    <td className="py-2.5 pr-4 num whitespace-nowrap text-[#4A5A4F]">{fmtDate(s.ctriRegistered)}</td>
                    <td className="py-2.5 pr-4 num whitespace-nowrap text-[#4A5A4F]">{fmtDate(s.iecApproval)}</td>
                    <td className={`py-2.5 pr-4 num whitespace-nowrap ${expiringIec ? "font-semibold text-[#8A6A1F]" : "text-[#4A5A4F]"}`}>{fmtDate(s.iecExpiry)}</td>
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
              { item: "SAE-2026-041 expedited review", meta: "Panel E-2 · opinion due 01 Nov", crit: true },
              { item: "AYU-031 Amendment 3 re-consent plan", meta: "16 participants pending", crit: false },
              { item: "AYU-019 Rasaushadhi risk ICF v1.3", meta: "96 re-consents required", crit: false },
              { item: "Annual continuing review — AYU-018", meta: "IEC expires 29 Oct 2026", crit: false },
            ].map((r) => (
              <div key={r.item} className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-3">
                <div>
                  <p className="text-[12px] text-[#1C2A21]">{r.item}</p>
                  <p className="mt-0.5 font-mono2 text-[9.5px] text-[#7A887D]">{r.meta}</p>
                </div>
                <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${r.crit ? "bg-[#A44A2A] live-dot" : "bg-[#B98A2F]"}`} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle title="Which rules apply" sub="Governing regime recorded per study, versioned" />
          <p className="text-[12px] leading-relaxed text-[#4A5A4F]">
            ASU drugs are governed under Chapter IV-A of the Drugs and Cosmetics Act and Part XVI of the Rules;
            whether a given AIIA trial falls under NDCT 2019 depends on the product&rsquo;s regulatory status.
            AryaSetu records the governing-regime decision per study, versioned.
          </p>
          <div className="mt-3 rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-3">
            <p className="text-[12px] font-semibold text-[#1C2A21]">Demo data</p>
            <div className="mt-2 space-y-1.5 text-[11.5px]">
              <p className="flex items-center justify-between"><span className="text-[#4A5A4F]">AYU-036, AYU-019 (Phase IV surveillance)</span><Badge>GCP-ASU + NPVCC</Badge></p>
              <p className="flex items-center justify-between"><span className="text-[#4A5A4F]">AYU-024, AYU-031, AYU-050 (interventional)</span><Badge>GCP-ASU + ICMR</Badge></p>
              <p className="flex items-center justify-between"><span className="text-[#4A5A4F]">SAE reporting chain</span><Badge>NDCT 2019 TIMELINES</Badge></p>
            </div>
          </div>
          <p className="mt-2.5 text-[10.5px] text-[#7A887D]">Jan 2026 NDCT amendments (test-licence timelines, EC registration) tracked in the rule engine&rsquo;s change log.</p>
        </Card>
      </div>
    </div>
  );
}
