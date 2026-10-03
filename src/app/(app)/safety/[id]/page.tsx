import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileSignature, Scale } from "lucide-react";
import { Badge, Card, CardTitle, Status, StatusAuto } from "@/components/ui";
import { adverseEvents, saeById, saes } from "@/lib/data/safety";
import { batchById } from "@/lib/data/batches";
import { studyById } from "@/lib/data/studies";
import { siteById } from "@/lib/data/sites";
import { countdown, fmtDateTime } from "@/lib/utils";

export function generateStaticParams() {
  return saes.map((s) => ({ id: s.id }));
}

const stepStyles: Record<string, { ring: string; text: string }> = {
  done: { ring: "bg-emerald-500", text: "text-zinc-300" },
  "due-now": { ring: "bg-red-500 live-dot", text: "text-red-400" },
  pending: { ring: "bg-zinc-700", text: "text-zinc-600" },
  overdue: { ring: "bg-red-500", text: "text-red-400" },
};

export default async function SaeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sae = saeById(id);
  if (!sae) notFound();

  const study = studyById(sae.studyId)!;
  const site = siteById(sae.siteId)!;
  const ae = adverseEvents.find((a) => a.id === sae.aeId);
  const batch = sae.batchId ? batchById(sae.batchId) : null;
  const cd = countdown(sae.initialDueAt);
  const isOpen = sae.status === "Open";

  const naranjoItems = [
    { q: "Previous conclusive reports on this reaction?", score: 1, note: "Guduchi hepatotoxicity case series published" },
    { q: "Event appeared after suspect drug given?", score: 2, note: "Week-8 LFT, dosing from 26-Jul" },
    { q: "Improved on withdrawal (dechallenge)?", score: 1, note: "ALT declining post-withdrawal" },
    { q: "Reaction reappeared on re-administration?", score: 0, note: "Rechallenge not attempted (ethically withheld)" },
    { q: "Alternative causes (non-drug)?", score: 2, note: "Viral panel negative; no alcohol history" },
    { q: "Reaction to placebo?", score: 0, note: "Not applicable — registry" },
    { q: "Drug detected in toxic concentrations?", score: 0, note: "Not measured" },
    { q: "Dose-response relationship?", score: 1, note: "Consistent with cumulative exposure" },
    { q: "Similar reaction to same/similar drugs?", score: 0, note: "No prior history" },
    { q: "Confirmed by objective evidence?", score: 1, note: "Serial LFT values on record" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/safety" className="inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500 hover:text-emerald-400">
          <ArrowLeft size={12} /> Safety · NPvCC
        </Link>
        <span className="font-mono2 text-[10.5px] text-zinc-600 uppercase">ICSR {sae.id} · demo record</span>
      </div>

      <div className="panel border-red-500/25 p-5">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono2 text-[19px] font-bold text-red-400">{sae.id}</span>
              <StatusAuto status={sae.status} live={isOpen} />
              <StatusAuto status={sae.severity} />
              <StatusAuto status={sae.expectedness} />
            </div>
            <h1 className="mt-2 text-[15px] leading-snug font-medium text-zinc-100">{sae.term}</h1>
            <p className="mt-1.5 text-[12px] text-zinc-500">
              {study.id} — {study.shortTitle} · {site.name} · Participant {sae.participantId} (synthetic)
              {batch && <> · Suspect product: <Link href="/batches" className="text-emerald-400 hover:text-emerald-300">{batch.product}, Batch {batch.id}</Link></>}
            </p>
            <p className="mt-1 font-mono2 text-[10px] tracking-wider text-zinc-600 uppercase">
              Seriousness criteria: {sae.seriousnessCriteria.join(" · ")}
            </p>
          </div>
          {isOpen && (
            <div className="rounded-md border border-red-500/30 bg-red-500/5 px-5 py-3.5 text-center">
              <p className="text-[9.5px] font-bold tracking-wider text-red-400 uppercase">24h initial report clock</p>
              <p className="num mt-1 text-[38px] leading-none font-semibold text-red-400">{cd.text}</p>
              <p className="mt-1 font-mono2 text-[10px] text-zinc-500">DUE {fmtDateTime(sae.initialDueAt)}</p>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardTitle
          title="Safety-to-compensation statutory chain"
          sub="NDCT Rules 2019 — every clock computed from time of awareness"
          right={<Badge>AWARENESS {fmtDateTime(sae.awarenessAt)}</Badge>}
        />
        <div>
          {sae.timeline.map((t, i) => {
            const st = stepStyles[t.status];
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${st.ring}`} />
                  {i < sae.timeline.length - 1 && <span className={`w-px flex-1 ${t.status === "done" ? "bg-emerald-500/40" : "bg-[#2d2d33]"}`} />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-[13px] font-medium ${st.text}`}>{t.label}</p>
                    <Badge>{t.rule}</Badge>
                    {t.status === "due-now" && <Status kind="crit" label="Due now" live />}
                    {t.doneAt && <span className="font-mono2 text-[10px] text-emerald-500">DONE {fmtDateTime(t.doneAt)}</span>}
                  </div>
                  <p className="mt-1 font-mono2 text-[10.5px] text-zinc-600 uppercase">
                    Due {fmtDateTime(t.dueAt)} · Owner: {t.actor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 xl:grid-cols-2">
        <Card>
          <CardTitle title="Causality panel — dual method" sub="WHO-UMC category + full Naranjo worksheet" />
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="rounded-[5px] border border-amber-500/25 bg-amber-500/5 p-3 text-center">
              <p className="section-label">WHO-UMC</p>
              <p className="mt-1 text-[16px] font-semibold text-amber-300">{sae.whoUmc}</p>
            </div>
            <div className="rounded-[5px] border border-emerald-500/25 bg-emerald-500/5 p-3 text-center">
              <p className="section-label">Naranjo score</p>
              <p className="num mt-1 text-[16px] font-semibold text-emerald-300">{sae.naranjo} / 13 · Probable</p>
            </div>
          </div>
          <div className="space-y-1">
            {naranjoItems.map((n, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[4px] bg-[#101012] px-2.5 py-1.5 text-[11px]">
                <span className={`num w-6 shrink-0 text-center font-semibold ${n.score > 0 ? "text-emerald-400" : "text-zinc-700"}`}>
                  {n.score > 0 ? `+${n.score}` : "0"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-zinc-300">{n.q}</p>
                  <p className="truncate text-[10px] text-zinc-600">{n.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardTitle title="Case narrative" sub="CIOMS-I ready" />
            <p className="text-[12.5px] leading-relaxed text-zinc-400">{sae.narrative}</p>
            {ae && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-[4px] bg-[#101012] p-2.5"><p className="section-label">Dechallenge</p><p className="mt-1 text-zinc-300">{ae.dechallenge}</p></div>
                <div className="rounded-[4px] bg-[#101012] p-2.5"><p className="section-label">Concomitant</p><p className="mt-1 text-zinc-300">{ae.concomitant.length ? ae.concomitant.join(", ") : "None"}</p></div>
                <div className="rounded-[4px] bg-[#101012] p-2.5"><p className="section-label">MedDRA PT (demo)</p><p className="mt-1 text-zinc-300">{ae.meddraPt} · <span className="font-mono2">{ae.meddraCode}</span></p></div>
                <div className="rounded-[4px] bg-[#101012] p-2.5"><p className="section-label">WHODrug (demo)</p><p className="mt-1 text-zinc-300">{ae.whodrug}</p></div>
              </div>
            )}
          </Card>

          <Card>
            <CardTitle title="Compensation & reporting actions" sub="NDCT 2019 chain" />
            <div className="mb-4 flex items-center gap-2.5 rounded-[5px] border border-amber-500/25 bg-amber-500/5 p-3">
              <Scale size={14} className="shrink-0 text-amber-300" />
              <p className="text-[11.5px] leading-relaxed text-zinc-400">
                Compensation eligibility: <span className="font-semibold text-amber-300">{sae.compensationEligible ? "Flagged for EC review" : "Not indicated"}</span>
                {sae.compensationEligible && " — formula computation available after Seventh Schedule verification."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="btn-crit cursor-pointer justify-center"><FileSignature size={12} /> Submit 24h initial report</span>
              <span className="btn-outline cursor-pointer justify-center"><Download size={12} /> CIOMS-I form</span>
              <span className="btn-outline cursor-pointer justify-center"><Download size={12} /> SUSAR line listing</span>
              <span className="btn-outline cursor-pointer justify-center"><Download size={12} /> Notify DSMB</span>
            </div>
            <p className="mt-3 text-[10.5px] leading-relaxed text-zinc-600">
              Every submission applies a hash-bound e-signature and writes to the audit chain. Exports are simulated in this demo build.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
