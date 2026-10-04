import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, FileText, MapPin } from "lucide-react";
import { Badge, Card, CardTitle, ProgressBar, StatusAuto } from "@/components/ui";
import { EnrollmentTrend, PrakritiDonut } from "@/components/charts";
import { getAdverseEvents, getBatches, getDataQueries, getDeviations, getSites, getStudies, getStudy } from "@/lib/server/repo";
import { QueryPanel } from "@/components/QueryPanel";
import { DeviationPanel } from "@/components/DeviationPanel";
import { fmtDate, pct } from "@/lib/utils";

const stepState: Record<string, { dot: string; text: string }> = {
  done: { dot: "bg-emerald-500", text: "text-zinc-300" },
  current: { dot: "bg-amber-400 live-dot", text: "text-amber-300" },
  overdue: { dot: "bg-red-500", text: "text-red-400" },
  pending: { dot: "bg-zinc-700", text: "text-zinc-600" },
};

const anchors = [
  { id: "lifecycle", label: "Lifecycle" },
  { id: "enrolment", label: "Enrolment" },
  { id: "sites", label: "Sites" },
  { id: "regulatory", label: "Regulatory" },
  { id: "quality", label: "Deviations & queries" },
  { id: "safety", label: "Safety & batches" },
  { id: "history", label: "Record history" },
];

export default async function StudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [study, studies, sites, deviations, dataQueries, adverseEvents, batches] = await Promise.all([
    getStudy(id),
    getStudies(),
    getSites(),
    getDeviations(),
    getDataQueries(),
    getAdverseEvents(),
    getBatches(),
  ]);
  if (!study) notFound();

  const siteById = (sid: string) => sites.find((s) => s.id === sid);
  const batchById = (bid: string) => batches.find((b) => b.id === bid);
  const idx = studies.findIndex((s) => s.id === study.id);
  const prev = studies[idx - 1];
  const next = studies[idx + 1];
  const studyDeviations = deviations.filter((d) => d.studyId === study.id);
  const studyQueries = dataQueries.filter((q) => q.studyId === study.id);
  const studyAes = adverseEvents.filter((a) => a.studyId === study.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono2 text-[10.5px] text-zinc-500">
          {prev ? (
            <Link href={`/studies/${prev.id}`} className="flex items-center gap-1 hover:text-zinc-200"><ChevronLeft size={12} /> {prev.id}</Link>
          ) : <span className="text-zinc-700">—</span>}
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-300">RECORD {idx + 1} OF {studies.length}</span>
          <span className="text-zinc-700">|</span>
          {next ? (
            <Link href={`/studies/${next.id}`} className="flex items-center gap-1 hover:text-zinc-200">{next.id} <ChevronRight size={12} /></Link>
          ) : <span className="text-zinc-700">—</span>}
        </div>
        <div className="flex gap-2">
          <span className="btn-outline cursor-pointer"><Download size={12} /> JSON</span>
          <span className="btn-outline cursor-pointer"><Download size={12} /> CSV</span>
          <span className="btn cursor-pointer"><FileText size={12} /> Open EDC workspace</span>
        </div>
      </div>

      <div className="border-b border-[#1c1c20] pb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono2 text-[17px] font-bold text-emerald-400">{study.id}</span>
          <StatusAuto status={study.status} live={study.status === "Recruiting"} />
          <StatusAuto status={study.risk} />
          <span className="font-mono2 text-[10.5px] text-zinc-600">{study.ctriNumber}</span>
        </div>
        <h1 className="mt-2 max-w-3xl text-[16px] leading-snug font-medium text-zinc-100">{study.title}</h1>
        <p className="mt-1.5 text-[12px] text-zinc-500">
          {study.design} · {study.intervention} · PI: {study.pi} · Sponsor: {study.sponsor}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[190px_1fr]">
        <aside className="hidden xl:block">
          <div className="sticky top-16 space-y-px">
            <p className="section-label px-2 pb-2">On this record</p>
            {anchors.map((a) => (
              <a key={a.id} href={`#${a.id}`} className="block rounded-[4px] px-2 py-1.5 text-[12px] text-zinc-500 hover:bg-[#141416] hover:text-zinc-200">
                {a.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <Card id="lifecycle">
            <CardTitle title="Study lifecycle" sub="Protocol → IEC → CTRI → activation → enrolment → follow-up → close-out" />
            <div className="flex items-start overflow-x-auto pb-2 scrollbar-thin">
              {study.milestones.map((m, i) => {
                const st = stepState[m.status];
                return (
                  <div key={i} className="flex min-w-[150px] flex-1 flex-col">
                    <div className="flex items-center">
                      <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${st.dot}`} />
                      {i < study.milestones.length - 1 && <span className={`h-px w-full ${m.status === "done" ? "bg-emerald-500/40" : "bg-[#2d2d33]"}`} />}
                    </div>
                    <p className={`mt-2 pr-3 text-[11.5px] leading-snug font-medium ${st.text}`}>{m.label}</p>
                    <p className="num mt-0.5 text-[10px] text-zinc-600">{fmtDate(m.date)}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <div id="enrolment" className="grid gap-3 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardTitle
                title="Enrolment vs target"
                sub={`${study.enrolled} of ${study.target} · ${pct(study.enrolled, study.target)}% · ${study.screened} screened`}
                right={<Badge>{pct(study.enrolled, study.target)}%</Badge>}
              />
              <EnrollmentTrend data={study.enrollmentCurve} />
            </Card>
            <Card>
              <CardTitle title="Prakriti distribution" sub="Baseline constitution — draft Ayush-CT profile" />
              <PrakritiDonut data={study.prakritiSplit} />
              <div className="mt-1 grid grid-cols-2 gap-1.5">
                {study.prakritiSplit.map((p, i) => (
                  <div key={p.prakriti} className="flex items-center gap-2 text-[11px]">
                    <span className="h-[6px] w-[6px] rounded-full" style={{ background: ["#10b981", "#f59e0b", "#38bdf8", "#8b5cf6"][i] }} />
                    <span className="text-zinc-400">{p.prakriti}</span>
                    <span className="num ml-auto text-zinc-500">{p.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card id="sites">
            <CardTitle title="Sites" sub={`${study.sites.length} participating sites`} />
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                  <th className="pb-2 font-medium">Site</th>
                  <th className="pb-2 font-medium">PI</th>
                  <th className="pb-2 text-right font-medium">Screened</th>
                  <th className="pb-2 font-medium">Enrolled</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {study.sites.map((sid) => {
                  const site = siteById(sid)!;
                  return (
                    <tr key={sid} className="row-hover border-b border-[#1c1c20] last:border-0">
                      <td className="py-2 pr-3">
                        <span className="block text-zinc-200">{site.name.split("—")[0]}</span>
                        <span className="flex items-center gap-1 text-[10.5px] text-zinc-600"><MapPin size={9} /> {site.city}, {site.state}</span>
                      </td>
                      <td className="py-2 pr-3 text-zinc-400">{site.pi}</td>
                      <td className="py-2 pr-3 text-right num text-zinc-400">{site.screened}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={site.enrolled} max={site.target} className="w-14" />
                          <span className="num text-zinc-300">{site.enrolled}</span>
                        </div>
                      </td>
                      <td className="py-2"><StatusAuto status={site.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          <div id="regulatory" className="grid gap-3 xl:grid-cols-2">
            <Card>
              <CardTitle title="Regulatory & ethics" sub="CTRI · IEC" />
              <dl className="space-y-2.5 text-[12px]">
                {[
                  ["CTRI number", <span key="n" className="font-mono2 text-[11px] text-zinc-300">{study.ctriNumber}</span>],
                  ["CTRI status", <StatusAuto key="s" status={study.ctriStatus} />],
                  ["Registered", <span key="r" className="num text-zinc-300">{fmtDate(study.ctriRegistered)}</span>],
                  ["IEC approval", <span key="a" className="num text-zinc-300">{fmtDate(study.iecApproval)}</span>],
                  ["IEC expiry", <span key="e" className="num text-amber-300">{fmtDate(study.iecExpiry)}</span>],
                  ["Study window", <span key="w" className="num text-[11px] text-zinc-300">{fmtDate(study.startDate)} → {fmtDate(study.endDate)}</span>],
                ].map(([k, v], i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[#1c1c20] pb-2 last:border-0">
                    <dt className="text-zinc-500">{k}</dt><dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card id="history">
              <CardTitle title="Record history" sub="Versioned changes to this study record" />
              <div className="space-y-2">
                {[
                  { v: "v2.1", d: "Protocol amendment — visit window widened ±3d", by: "Dr. Meera Kulkarni", ts: "12 Sep 2026" },
                  { v: "v2.0", d: "CTRI public record synced", by: "System (daily sync)", ts: "28 Aug 2026" },
                  { v: "v1.9", d: "Site SITE-08 initiated", by: "Admin", ts: "11 May 2026" },
                  { v: "v1.8", d: "Initial record created", by: "Sponsor", ts: fmtDate(study.startDate) },
                ].map((h) => (
                  <div key={h.v} className="flex items-center gap-3 text-[11.5px]">
                    <span className="num w-9 shrink-0 rounded-[3px] border border-[#2d2d33] px-1 py-0.5 text-center text-[10px] text-zinc-400">{h.v}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-zinc-300">{h.d}</p>
                      <p className="text-[10px] text-zinc-600">{h.by} · {h.ts}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div id="quality" className="grid gap-3 xl:grid-cols-2">
            <Card>
              <CardTitle title="Deviations" sub={`${studyDeviations.length} recorded`} right={studyDeviations.some((d) => d.status === "CAPA") ? <StatusAuto status="CAPA" /> : undefined} />
              <DeviationPanel
                studyId={study.id}
                sites={study.sites.map((sid) => ({ id: sid, city: siteById(sid)?.city ?? sid }))}
                deviations={studyDeviations}
              />
            </Card>

            <Card>
              <CardTitle title="Data queries" sub={`${studyQueries.filter((q) => q.status === "Open").length} open`} />
              <QueryPanel studyId={study.id} siteId={study.sites[0]} queries={studyQueries} />
            </Card>
          </div>

          <Card id="safety">
            <CardTitle title="Safety & investigational product" sub={`${studyAes.length} AEs · ${study.batches.length} batches`} />
            <div className="grid gap-3 xl:grid-cols-2">
              <div className="space-y-2">
                {studyAes.length === 0 && <p className="text-[11.5px] text-zinc-600">No adverse events recorded for this study.</p>}
                {studyAes.slice(0, 5).map((a) => (
                  <Link href="/safety" key={a.id} className="flex items-start justify-between gap-2 rounded-[5px] border border-[#222226] bg-[#101012] p-3 hover:border-[#3f3f46]">
                    <div>
                      <p className="line-clamp-1 text-[12px] text-zinc-200">{a.term}</p>
                      <p className="mt-0.5 font-mono2 text-[9.5px] text-zinc-600 uppercase">{a.id} · {a.participantId} · {a.whoUmc} · Naranjo {a.naranjo}</p>
                    </div>
                    <StatusAuto status={a.seriousness} />
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                {study.batches.map((bid) => batchById(bid)).filter((b) => b !== undefined).map((b) => (
                  <Link href="/batches" key={b.id} className="flex items-center justify-between rounded-[5px] border border-[#222226] bg-[#101012] p-3 hover:border-[#3f3f46]">
                    <div>
                      <p className="text-[12px] font-medium text-zinc-200"><span className="font-mono2 text-emerald-400">{b.id}</span> — {b.product}</p>
                      <p className="text-[10.5px] text-zinc-600">{b.participantsDosed.length} participants dosed · {b.linkedAes.length} linked AEs</p>
                    </div>
                    <StatusAuto status={b.status} />
                  </Link>
                ))}
                {study.batches.length === 0 && <p className="text-[11.5px] text-zinc-600">Non-drug intervention — no investigational product batches.</p>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
