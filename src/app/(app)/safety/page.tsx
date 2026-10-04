import Link from "next/link";
import { AlertTriangle, Clock3 } from "lucide-react";
import { Badge, Card, CardTitle, PageHeader, Status, StatusAuto } from "@/components/ui";
import { AeBars } from "@/components/charts";
import { SafetyDisclaimer } from "@/components/SafetyDisclaimer";
import { NewEventForm } from "@/components/NewEventForm";
import { aeByWeek } from "@/lib/data/ops";
import { getAdverseEvents, getBatches, getSaes, getSites, getStudies } from "@/lib/server/repo";
import { computeSignalRows } from "@/lib/server/signal";
import { countdown, fmtDate } from "@/lib/utils";

export default async function SafetyPage() {
  const [adverseEvents, saes, studies, sites, batches, rorRows] = await Promise.all([getAdverseEvents(), getSaes(), getStudies(), getSites(), getBatches(), computeSignalRows()]);
  const safetySummary = {
    openSaes: saes.filter((s) => s.status === "Open").length,
    signalReview: 1,
    medianReportHours: 7.5,
  };
  const openSae = saes.find((s) => s.status === "Open")!;
  const cd = countdown(openSae.initialDueAt);
  const studyById = (sid: string) => studies.find((s) => s.id === sid);
  const siteById = (sid: string) => sites.find((s) => s.id === sid);

  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 03 · NPVCC FOR ASU&H DRUGS · AIIA"
        title="Pharmacovigilance Command"
        sub="AE/SAE capture, MedDRA/WHODrug coding (demo dictionaries), dual causality, statutory timelines"
        right={<div className="flex gap-3"><Status kind="crit" label={`${safetySummary.openSaes} open SAE`} live /><Status kind="warn" label={`${safetySummary.signalReview} signal under review`} /></div>}
      />

      <SafetyDisclaimer />

      <NewEventForm
        studies={studies.map((s) => ({ id: s.id, shortTitle: s.shortTitle }))}
        sites={sites.map((s) => ({ id: s.id, name: s.name, city: s.city }))}
        batches={batches.map((b) => ({ id: b.id, product: b.product }))}
      />

      <Link href={`/safety/${openSae.id}`}>
        <div className="panel relative overflow-hidden border-red-500/30 p-4 hover:border-red-500/50">
          <div className="absolute inset-y-0 left-0 w-[3px] bg-red-500" />
          <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="font-mono2 text-[15px] font-bold text-red-400">{openSae.id}</span>
                <StatusAuto status="Severe" />
                <StatusAuto status="Unexpected" />
                <Status kind="crit" label="24H CLOCK RUNNING" live />
              </div>
              <p className="mt-1.5 max-w-2xl text-[13px] text-zinc-200">{openSae.term}</p>
              <p className="mt-1 font-mono2 text-[10.5px] text-zinc-600 uppercase">
                {openSae.studyId} · {siteById(openSae.siteId)?.name.split("—")[0]} · {openSae.participantId} · BATCH {openSae.batchId}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-[10px] font-semibold tracking-wider text-red-400 uppercase">
                <Clock3 size={11} /> NDCT 24h initial report
              </p>
              <p className="num mt-1 text-[34px] leading-none font-semibold text-red-400">{cd.text}</p>
              <p className="mt-0.5 text-[10.5px] text-zinc-600">{cd.overdue ? "OVERDUE — 24h rule breached" : "remaining of 24 hours"}</p>
            </div>
          </div>
          <div className="mt-3 ml-2 h-[4px] overflow-hidden rounded-sm bg-white/8">
            <div className="h-full w-[74%] rounded-sm bg-red-500" />
          </div>
          <p className="mt-2 ml-2 text-[10.5px] text-zinc-600">
            Awareness 02 Oct 21:12 IST → initial due 03 Oct 21:12 IST · chain: 14d full report → 30d EC opinion → 60d expert committee → 90d LA order → 30d payment
          </p>
        </div>
      </Link>

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="AE volume — last 5 weeks" sub="Serious vs non-serious, all studies" />
          <AeBars data={aeByWeek} />
          <div className="mt-2 flex items-center gap-4 text-[10.5px] text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-sky-500" /> Non-serious</span>
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-red-500" /> Serious</span>
            <span className="num ml-auto">Median report: {safetySummary.medianReportHours}h</span>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle
            title="Disproportionality screening (EVDAS-style)"
            sub="ROR + PRR + χ² computed live from the AE table · signal threshold ROR ≥ 2 with N ≥ 3"
            right={<Badge>LIVE COMPUTATION</Badge>}
          />
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                <th className="pb-2 pr-4 font-medium">Product</th>
                <th className="pb-2 pr-4 font-medium">Event (MedDRA PT, demo)</th>
                <th className="pb-2 pr-4 text-right font-medium">N</th>
                <th className="pb-2 pr-4 text-right font-medium">ROR</th>
                <th className="pb-2 pr-4 text-right font-medium">PRR</th>
                <th className="pb-2 pr-4 text-right font-medium">χ²</th>
                <th className="pb-2 font-medium">Assessment</th>
              </tr>
            </thead>
            <tbody>
              {rorRows.map((r) => (
                <tr key={r.product + r.event} className={`row-hover border-b border-[#1c1c20] last:border-0 ${r.signal ? "bg-red-500/[0.04]" : ""}`}>
                  <td className="py-2 pr-4 text-zinc-300">{r.product}</td>
                  <td className="py-2 pr-4 text-zinc-400">{r.event}</td>
                  <td className="py-2 pr-4 text-right num text-zinc-300">{r.a}</td>
                  <td className={`py-2 pr-4 text-right num font-semibold ${r.signal ? "text-red-400" : "text-zinc-400"}`}>{r.ror.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-right num text-zinc-400">{r.prr.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-right num text-zinc-400">{r.chi2.toFixed(2)}</td>
                  <td className="py-2">{r.signal ? <Status kind="crit" label="Signal — under review" live /> : <Status kind="neutral" label="No signal" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2.5 text-[10.5px] leading-relaxed text-zinc-600">
            ROR is a screening measure on small counts — it detects disproportionate reporting, not risk.
            Signal confirmation requires case review and, where possible, exposure denominators.
          </p>
        </Card>
      </div>

      <Card>
        <CardTitle
          title="Adverse event register"
          sub="MedDRA PT-coded (demo dictionary) · WHODrug (demo) · dual causality"
          right={<span className="cursor-pointer text-[11.5px] font-medium text-emerald-400 hover:text-emerald-300">ICSR line listing →</span>}
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                <th className="pb-2 pr-4 font-medium">AE</th>
                <th className="pb-2 pr-4 font-medium">Study · participant</th>
                <th className="pb-2 pr-4 font-medium">MedDRA PT (demo)</th>
                <th className="pb-2 pr-4 font-medium">Batch</th>
                <th className="pb-2 pr-4 font-medium">Seriousness</th>
                <th className="pb-2 pr-4 font-medium">WHO-UMC</th>
                <th className="pb-2 pr-4 text-center font-medium">Naranjo</th>
                <th className="pb-2 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {adverseEvents.map((a, i) => (
                <tr key={a.id} className={`row-hover border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""}`}>
                  <td className="py-2 pr-4">
                    <span className="font-mono2 text-[11px] font-medium text-zinc-200">{a.id}</span>
                    <span className="block max-w-[260px] truncate text-[11px] text-zinc-500">{a.term}</span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span className="font-mono2 text-[11px] text-emerald-400">{a.studyId}</span>
                    <span className="block font-mono2 text-[10px] text-zinc-600">{a.participantId}</span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap text-zinc-400">
                    {a.meddraPt}
                    <span className="block font-mono2 text-[10px] text-zinc-600">{a.meddraCode}</span>
                  </td>
                  <td className="py-2 pr-4">
                    {a.batchId ? <Link href="/batches" className="font-mono2 text-[11px] text-emerald-400 hover:text-emerald-300">{a.batchId}</Link> : <span className="text-zinc-700">—</span>}
                  </td>
                  <td className="py-2 pr-4"><StatusAuto status={a.seriousness} /></td>
                  <td className="py-2 pr-4"><StatusAuto status={a.whoUmc} /></td>
                  <td className="py-2 pr-4 text-center num text-zinc-300">{a.naranjo}</td>
                  <td className="py-2"><StatusAuto status={a.outcome} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle title="SAE case register" sub="NDCT 2019 statutory tracking" />
        <div className="grid gap-2.5 md:grid-cols-3">
          {saes.map((s) => {
            const st = studyById(s.studyId)!;
            return (
              <Link key={s.id} href={`/safety/${s.id}`} className="panel-2 p-3.5 hover:border-[#3f3f46]">
                <div className="flex items-center justify-between">
                  <span className="font-mono2 text-[13px] font-bold text-zinc-100">{s.id}</span>
                  <StatusAuto status={s.status} live={s.status === "Open"} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-[11.5px] text-zinc-400">{s.term}</p>
                <p className="mt-2 text-[10.5px] text-zinc-600">{st.shortTitle} · {siteById(s.siteId)?.city}</p>
                <p className="num mt-2 border-t border-[#1c1c20] pt-2 text-[10px] text-zinc-600 uppercase">Initial due {fmtDate(s.initialDueAt)}</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
