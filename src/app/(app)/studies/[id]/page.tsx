import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, FileText, MapPin } from "lucide-react";
import { Badge, Card, CardTitle, ProgressBar, StatusAuto } from "@/components/ui";
import { EnrollmentTrend, PrakritiDonut } from "@/components/charts";
import { getAdverseEvents, getBatches, getDataQueries, getDeviations, getSites, getStudies, getStudy } from "@/lib/server/repo";
import { QueryPanel } from "@/components/QueryPanel";
import { DeviationPanel } from "@/components/DeviationPanel";
import { cohensKappa } from "@/lib/kappa";
import { getAssessments } from "@/lib/data/assessments";
import { namasteFor } from "@/lib/data/namaste";
import { fmtDate, pct } from "@/lib/utils";

const stepState: Record<string, { dot: string; text: string }> = {
  done: { dot: "bg-[#2D5A3D]", text: "text-[#1C2A21]" },
  current: { dot: "bg-[#B98A2F] live-dot", text: "text-[#8A6A1F]" },
  overdue: { dot: "bg-[#A44A2A]", text: "text-[#A44A2A]" },
  pending: { dot: "bg-[#C9C2B2]", text: "text-[#7A887D]" },
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
        <div className="flex items-center gap-2 font-mono2 text-[10.5px] text-[#4A5A4F]">
          {prev ? (
            <Link href={`/studies/${prev.id}`} className="flex items-center gap-1 hover:text-[#1C2A21]"><ChevronLeft size={12} /> {prev.id}</Link>
          ) : <span className="text-[#C9C2B2]">—</span>}
          <span className="text-[#C9C2B2]">|</span>
          <span className="text-[#1C2A21]">RECORD {idx + 1} OF {studies.length}</span>
          <span className="text-[#C9C2B2]">|</span>
          {next ? (
            <Link href={`/studies/${next.id}`} className="flex items-center gap-1 hover:text-[#1C2A21]">{next.id} <ChevronRight size={12} /></Link>
          ) : <span className="text-[#C9C2B2]">—</span>}
        </div>
        <div className="flex gap-2">
          <a href={`/api/studies/${study.id}`} target="_blank" className="btn-outline">
            <Download size={12} /> JSON
          </a>
          <a href={`/api/export/sdtm/dm`} className="btn-outline">
            <Download size={12} /> SDTM CSV
          </a>
          <a href={`#quality`} className="btn">
            <FileText size={12} /> Query & EDC Records
          </a>
        </div>
      </div>

      <div className="border-b border-[#E3DED4] pb-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono2 text-[17px] font-bold text-[#2D5A3D]">{study.id}</span>
          <StatusAuto status={study.status} live={study.status === "Recruiting"} />
          <StatusAuto status={study.risk} />
          <span className="font-mono2 text-[10.5px] text-[#7A887D]">{study.ctriNumber}</span>
        </div>
        <h1 className="display mt-2 max-w-3xl text-[21px] leading-snug font-medium text-[#1C2A21]">{study.title}</h1>
        <p className="mt-1.5 text-[12px] text-[#4A5A4F]">
          {study.design} · {study.intervention} · PI: {study.pi} · Sponsor: {study.sponsor}
        </p>
        {(() => {
          const m = namasteFor(study.indication);
          return m ? (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-[10.5px]">
              <span className="text-[#7A887D]">Indication dual-coded (draft):</span>
              <span className="rounded-[3px] border border-[#E3DED4] px-1.5 py-px font-mono2 text-[#2D5A3D]">NAMASTE {m.namasteCode}</span>
              <span className="rounded-[3px] border border-[#E3DED4] px-1.5 py-px font-mono2 text-[#3E6B8C]">ICD-11 {m.tm2Code}</span>
              <span className="text-[#7A887D]">({m.sanskrit})</span>
            </p>
          ) : null;
        })()}
      </div>

      <div className="grid gap-4 xl:grid-cols-[190px_1fr]">
        <aside className="hidden xl:block">
          <div className="sticky top-16 space-y-px">
            <p className="section-label px-2 pb-2">On this record</p>
            {anchors.map((a) => (
              <a key={a.id} href={`#${a.id}`} className="block rounded-[4px] px-2 py-1.5 text-[12px] text-[#4A5A4F] hover:bg-[#F3EFE5] hover:text-[#1C2A21]">
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
                      {i < study.milestones.length - 1 && <span className={`h-px w-full ${m.status === "done" ? "bg-[#2D5A3D]/40" : "bg-[#E3DED4]"}`} />}
                    </div>
                    <p className={`mt-2 pr-3 text-[11.5px] leading-snug font-medium ${st.text}`}>{m.label}</p>
                    <p className="num mt-0.5 text-[10px] text-[#7A887D]">{fmtDate(m.date)}</p>
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
                    <span className="h-[6px] w-[6px] rounded-full" style={{ background: ["#2D5A3D", "#B98A2F", "#3E6B8C", "#6B5A8C"][i] }} />
                    <span className="text-[#4A5A4F]">{p.prakriti}</span>
                    <span className="num ml-auto text-[#4A5A4F]">{p.count}</span>
                  </div>
                ))}
              </div>
              {(() => {
                const { assessorA, assessorB, rows } = getAssessments(study.id);
                const k = cohensKappa(rows.map((r) => ({ a: r.ratingA, b: r.ratingB })));
                const agree = rows.filter((r) => r.ratingA === r.ratingB).length;
                return (
                  <div className="mt-4 border-t border-[#E3DED4] pt-3">
                    <div className="flex items-center justify-between">
                      <p className="section-label">Inter-rater reliability</p>
                      <Badge>κ = {k.toFixed(2)}</Badge>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#4A5A4F]">
                      {assessorA} vs {assessorB} — {agree}/{rows.length} agreements.
                      {k < 0.4
                        ? " Below the 0.40 threshold — assessor calibration retraining triggered (published Prakriti κ ≈ 0.20–0.40)."
                        : " Within acceptable range for Prakriti assessment (published κ ≈ 0.20–0.40)."}
                    </p>
                  </div>
                );
              })()}
            </Card>
          </div>

          <Card id="sites">
            <CardTitle title="Sites" sub={`${study.sites.length} participating sites`} />
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
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
                    <tr key={sid} className="row-hover border-b border-[#E3DED4] last:border-0">
                      <td className="py-2 pr-3">
                        <span className="block text-[#1C2A21]">{site.name.split("—")[0]}</span>
                        <span className="flex items-center gap-1 text-[10.5px] text-[#7A887D]"><MapPin size={9} /> {site.city}, {site.state}</span>
                      </td>
                      <td className="py-2 pr-3 text-[#4A5A4F]">{site.pi}</td>
                      <td className="py-2 pr-3 text-right num text-[#4A5A4F]">{site.screened}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={site.enrolled} max={site.target} className="w-14" />
                          <span className="num text-[#1C2A21]">{site.enrolled}</span>
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
                  ["CTRI number", <span key="n" className="font-mono2 text-[11px] text-[#1C2A21]">{study.ctriNumber}</span>],
                  ["CTRI status", <StatusAuto key="s" status={study.ctriStatus} />],
                  ["Registered", <span key="r" className="num text-[#1C2A21]">{fmtDate(study.ctriRegistered)}</span>],
                  ["IEC approval", <span key="a" className="num text-[#1C2A21]">{fmtDate(study.iecApproval)}</span>],
                  ["IEC expiry", <span key="e" className="num text-[#8A6A1F]">{fmtDate(study.iecExpiry)}</span>],
                  ["Study window", <span key="w" className="num text-[11px] text-[#1C2A21]">{fmtDate(study.startDate)} → {fmtDate(study.endDate)}</span>],
                ].map(([k, v], i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[#E3DED4] pb-2 last:border-0">
                    <dt className="text-[#4A5A4F]">{k}</dt><dd>{v}</dd>
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
                    <span className="num w-9 shrink-0 rounded-[3px] border border-[#E3DED4] px-1 py-0.5 text-center text-[10px] text-[#4A5A4F]">{h.v}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[#1C2A21]">{h.d}</p>
                      <p className="text-[10px] text-[#7A887D]">{h.by} · {h.ts}</p>
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
                {studyAes.length === 0 && <p className="text-[11.5px] text-[#7A887D]">No adverse events recorded for this study.</p>}
                {studyAes.slice(0, 5).map((a) => (
                  <Link href="/safety" key={a.id} className="flex items-start justify-between gap-2 rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-3 hover:border-[#C9C2B2]">
                    <div>
                      <p className="line-clamp-1 text-[12px] text-[#1C2A21]">{a.term}</p>
                      <p className="mt-0.5 font-mono2 text-[9.5px] text-[#7A887D] uppercase">{a.id} · {a.participantId} · {a.whoUmc} · Naranjo {a.naranjo}</p>
                    </div>
                    <StatusAuto status={a.seriousness} />
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                {study.batches.map((bid) => batchById(bid)).filter((b) => b !== undefined).map((b) => (
                  <Link href="/batches" key={b.id} className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] p-3 hover:border-[#C9C2B2]">
                    <div>
                      <p className="text-[12px] font-medium text-[#1C2A21]"><span className="font-mono2 text-[#2D5A3D]">{b.id}</span> — {b.product}</p>
                      <p className="text-[10.5px] text-[#7A887D]">{b.participantsDosed.length} participants dosed · {b.linkedAes.length} linked AEs</p>
                    </div>
                    <StatusAuto status={b.status} />
                  </Link>
                ))}
                {study.batches.length === 0 && <p className="text-[11.5px] text-[#7A887D]">Non-drug intervention — no investigational product batches.</p>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
