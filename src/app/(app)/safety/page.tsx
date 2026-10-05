import Link from "next/link";
import { AlertTriangle, Clock3 } from "lucide-react";
import { Badge, Card, CardTitle, PageHeader, Status, StatusAuto } from "@/components/ui";
import { AeBars } from "@/components/charts";
import { SafetyDisclaimer } from "@/components/SafetyDisclaimer";
import { NewEventForm } from "@/components/NewEventForm";
import { aeByWeek } from "@/lib/data/ops";
import { getAdverseEvents, getBatches, getSaes, getSites, getStudies } from "@/lib/server/repo";
import { computeSignalRows } from "@/lib/server/signal";
import { computeExposureRows } from "@/lib/server/exposure";
import { countdown, fmtDate } from "@/lib/utils";

export default async function SafetyPage() {
  const [adverseEvents, saes, studies, sites, batches, rorRows, exposureRows] = await Promise.all([getAdverseEvents(), getSaes(), getStudies(), getSites(), getBatches(), computeSignalRows(), computeExposureRows()]);
  const safetySummary = {
    openSaes: saes.filter((s) => s.status === "Open").length,
    signalReview: 1,
    medianReportHours: 7.5,
  };
  const openSae = saes.find((s) => s.status === "Open");
  const cd = openSae ? countdown(openSae.initialDueAt) : null;
  const studyById = (sid: string) => studies.find((s) => s.id === sid);
  const siteById = (sid: string) => sites.find((s) => s.id === sid);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Safety events"
        sub="AE and SAE capture, demo coding dictionaries, dual causality, statutory clocks"
        right={<div className="flex gap-3"><Status kind="crit" label={`${safetySummary.openSaes} open SAE`} live /><Status kind="warn" label={`${safetySummary.signalReview} signal under review`} /></div>}
      />

      <SafetyDisclaimer />

      <NewEventForm
        studies={studies.map((s) => ({ id: s.id, shortTitle: s.shortTitle }))}
        sites={sites.map((s) => ({ id: s.id, name: s.name, city: s.city }))}
        batches={batches.map((b) => ({ id: b.id, product: b.product }))}
      />

      {openSae && cd ? (
      <Link href={`/safety/${openSae.id}`}>
        <div className="panel relative overflow-hidden border-[#A44A2A]/40 p-4 hover:border-[#A44A2A]/60">
          <div className="absolute inset-y-0 left-0 w-[3px] bg-[#A44A2A]" />
          <div className="flex flex-wrap items-center justify-between gap-4 pl-2">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <AlertTriangle size={14} className="text-[#A44A2A]" />
                <span className="font-mono2 text-[15px] font-bold text-[#A44A2A]">{openSae.id}</span>
                <StatusAuto status="Severe" />
                <StatusAuto status="Unexpected" />
                <Status kind="crit" label="Clock running" live />
              </div>
              <p className="mt-1.5 max-w-2xl text-[13px] text-[#1C2A21]">{openSae.term}</p>
              <p className="mt-1 font-mono2 text-[10.5px] text-[#7A887D] uppercase">
                {openSae.studyId} · {siteById(openSae.siteId)?.name.split("—")[0]} · {openSae.participantId} · BATCH {openSae.batchId}
              </p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-[10px] font-semibold tracking-wider text-[#A44A2A] uppercase">
                <Clock3 size={11} /> NDCT 24h initial report
              </p>
              <p className="num mt-1 text-[34px] leading-none font-semibold text-[#A44A2A]">{cd.text}</p>
              <p className="mt-0.5 text-[10.5px] text-[#7A887D]">{cd.overdue ? "Overdue — 24h limit breached" : "of the 24 hours left"}</p>
            </div>
          </div>
          <div className="mt-3 ml-2 h-[4px] overflow-hidden rounded-sm bg-[#E3DED4]">
            <div className="h-full w-[74%] rounded-sm bg-[#A44A2A]" />
          </div>
          <p className="mt-2 ml-2 text-[10.5px] text-[#7A887D]">
            Awareness 02 Oct 21:12 IST → initial due 03 Oct 21:12 IST · chain: 14d full report → 30d EC opinion → 60d expert committee → 90d LA order → 30d payment
          </p>
        </div>
      </Link>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-3">
        <Card>
          <CardTitle title="AE volume — last 5 weeks" sub="Serious vs non-serious, all studies" />
          <AeBars data={aeByWeek} />
          <div className="mt-2 flex items-center gap-4 text-[10.5px] text-[#4A5A4F]">
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-[#3E6B8C]" /> Non-serious</span>
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-[#A44A2A]" /> Serious</span>
            <span className="num ml-auto">Median report: {safetySummary.medianReportHours}h</span>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle
            title="Signal screening"
            sub="ROR, PRR and χ² computed live from the AE table · signal flag at ROR ≥ 2 with N ≥ 3"
            right={<Badge>Computed live</Badge>}
          />
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
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
                <tr key={r.product + r.event} className={`row-hover border-b border-[#E3DED4] last:border-0 ${r.signal ? "bg-[#A44A2A]/[0.04]" : ""}`}>
                  <td className="py-2 pr-4 text-[#1C2A21]">{r.product}</td>
                  <td className="py-2 pr-4 text-[#4A5A4F]">{r.event}</td>
                  <td className="py-2 pr-4 text-right num text-[#1C2A21]">{r.a}</td>
                  <td className={`py-2 pr-4 text-right num font-semibold ${r.signal ? "text-[#A44A2A]" : "text-[#4A5A4F]"}`}>{r.ror.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-right num text-[#4A5A4F]">{r.prr.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-right num text-[#4A5A4F]">{r.chi2.toFixed(2)}</td>
                  <td className="py-2">{r.signal ? <Status kind="crit" label="Signal — under review" live /> : <Status kind="neutral" label="No signal" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2.5 text-[10.5px] leading-relaxed text-[#7A887D]">
            ROR is a screening measure on small counts — it detects disproportionate reporting, not risk.
            Signal confirmation requires case review and, where possible, exposure denominators.
          </p>
        </Card>
      </div>

      <Card>
        <CardTitle
            title="Event rates by exposure"
            sub="Events per 1,000 person-years per product, from batch dosing records"
            right={<Badge>Person-time</Badge>}
        />
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
              <th className="pb-2 pr-4 font-medium">Product</th>
              <th className="pb-2 pr-4 text-right font-medium">Dosed</th>
              <th className="pb-2 pr-4 text-right font-medium">Person-yrs</th>
              <th className="pb-2 pr-4 text-right font-medium">Events</th>
              <th className="pb-2 pr-4 text-right font-medium">Serious</th>
              <th className="pb-2 pr-4 text-right font-medium">Rate /1,000 PY</th>
              <th className="pb-2 font-medium">95% CI</th>
            </tr>
          </thead>
          <tbody>
            {exposureRows.map((r) => (
              <tr key={r.product} className={`row-hover border-b border-[#E3DED4] last:border-0 ${r.ratePer1000PY > 500 ? "bg-[#A44A2A]/[0.04]" : ""}`}>
                <td className="py-2 pr-4 max-w-[240px] truncate text-[#1C2A21]">{r.product}</td>
                <td className="py-2 pr-4 text-right num text-[#4A5A4F]">{r.dosed}</td>
                <td className="py-2 pr-4 text-right num text-[#4A5A4F]">{r.personYears}</td>
                <td className="py-2 pr-4 text-right num text-[#1C2A21]">{r.events}</td>
                <td className={`py-2 pr-4 text-right num ${r.serious > 0 ? "font-semibold text-[#A44A2A]" : "text-[#4A5A4F]"}`}>{r.serious}</td>
                <td className={`py-2 pr-4 text-right num font-semibold ${r.ratePer1000PY > 500 ? "text-[#A44A2A]" : "text-[#1C2A21]"}`}>{r.ratePer1000PY}</td>
                <td className="py-2 num text-[11px] text-[#4A5A4F]">[{r.ciLow} – {r.ciHigh}]</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2.5 text-[10.5px] leading-relaxed text-[#7A887D]">
          Rates contextualise counts: 3 hepatic events mean something very different at 6 person-months than at 600 person-years.
          Person-time is computed per batch from first-dose dates; CI is normal-approximation Poisson.
        </p>
      </Card>

      <Card>
        <CardTitle
          title="Adverse event register"
          sub="MedDRA-coded, dual causality — full table below"
          right={<span className="text-[11.5px] text-[#4A5A4F]">Full table below</span>}
        />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
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
                <tr key={a.id} className={`row-hover border-b border-[#E3DED4] last:border-0 ${i % 2 === 1 ? "bg-[#FDFCF9]" : ""}`}>
                  <td className="py-2 pr-4">
                    <span className="font-mono2 text-[11px] font-medium text-[#1C2A21]">{a.id}</span>
                    <span className="block max-w-[260px] truncate text-[11px] text-[#4A5A4F]">{a.term}</span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span className="font-mono2 text-[11px] text-[#2D5A3D]">{a.studyId}</span>
                    <span className="block font-mono2 text-[10px] text-[#7A887D]">{a.participantId}</span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap text-[#4A5A4F]">
                    {a.meddraPt}
                    <span className="block font-mono2 text-[10px] text-[#7A887D]">{a.meddraCode}</span>
                  </td>
                  <td className="py-2 pr-4">
                    {a.batchId ? <Link href="/batches" className="font-mono2 text-[11px] text-[#2D5A3D] hover:text-[#22452F]">{a.batchId}</Link> : <span className="text-[#C9C2B2]">—</span>}
                  </td>
                  <td className="py-2 pr-4"><StatusAuto status={a.seriousness} /></td>
                  <td className="py-2 pr-4"><StatusAuto status={a.whoUmc} /></td>
                  <td className="py-2 pr-4 text-center num text-[#1C2A21]">{a.naranjo}</td>
                  <td className="py-2"><StatusAuto status={a.outcome} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle title="SAE cases" sub="Statutory tracking per NDCT 2019" />
        <div className="grid gap-2.5 md:grid-cols-3">
          {saes.map((s) => {
            const st = studyById(s.studyId)!;
            return (
              <Link key={s.id} href={`/safety/${s.id}`} className="panel-2 p-3.5 hover:border-[#C9C2B2]">
                <div className="flex items-center justify-between">
                  <span className="font-mono2 text-[13px] font-bold text-[#1C2A21]">{s.id}</span>
                  <StatusAuto status={s.status} live={s.status === "Open"} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-[11.5px] text-[#4A5A4F]">{s.term}</p>
                <p className="mt-2 text-[10.5px] text-[#7A887D]">{st.shortTitle} · {siteById(s.siteId)?.city}</p>
                <p className="num mt-2 border-t border-[#E3DED4] pt-2 text-[10px] text-[#7A887D] uppercase">Initial due {fmtDate(s.initialDueAt)}</p>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
