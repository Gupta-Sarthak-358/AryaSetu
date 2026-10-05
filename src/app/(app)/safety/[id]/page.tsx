import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileSignature, Scale } from "lucide-react";
import { Badge, Card, CardTitle, Status, StatusAuto } from "@/components/ui";
import { NaranjoCalculator } from "@/components/NaranjoCalculator";
import { LiveSaeTimer } from "@/components/LiveSaeTimer";
import { getAdverseEvents, getBatch, getSae, getSite, getStudy } from "@/lib/server/repo";
import { fmtDateTime } from "@/lib/utils";

const stepStyles: Record<string, { ring: string; text: string }> = {
  done: { ring: "bg-[#2D5A3D]", text: "text-[#1C2A21]" },
  "due-now": { ring: "bg-[#A44A2A] live-dot", text: "text-[#A44A2A]" },
  pending: { ring: "bg-[#C9C2B2]", text: "text-[#7A887D]" },
  overdue: { ring: "bg-[#A44A2A]", text: "text-[#A44A2A]" },
};

export default async function SaeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sae = await getSae(id);
  if (!sae) notFound();

  const [study, site, adverseEvents, batch] = await Promise.all([
    getStudy(sae.studyId),
    getSite(sae.siteId),
    getAdverseEvents(),
    sae.batchId ? getBatch(sae.batchId) : Promise.resolve(undefined),
  ]);
  if (!study || !site) notFound();
  const ae = adverseEvents.find((a) => a.id === sae.aeId);
  const isOpen = sae.status === "Open";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/safety" className="inline-flex min-h-[44px] items-center gap-1.5 text-[12px] text-[#4A5A4F] hover:text-[#1C2A21]">
          <ArrowLeft size={12} /> Safety events
        </Link>
        <span className="font-mono2 text-[10.5px] text-[#7A887D]">ICSR {sae.id} · demo record</span>
      </div>

      <div className="panel border-[#A44A2A]/40 p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono2 text-[19px] font-bold text-[#A44A2A]">{sae.id}</span>
              <StatusAuto status={sae.status} live={isOpen} />
              <StatusAuto status={sae.severity} />
              <StatusAuto status={sae.expectedness} />
            </div>
            <h1 className="mt-2 text-[16px] leading-snug font-semibold text-[#1C2A21]">{sae.term}</h1>
            <p className="mt-1.5 text-[12.5px] text-[#4A5A4F]">
              {study.id} — {study.shortTitle} · {site.name} · Participant {sae.participantId} (synthetic)
              {batch && <> · Suspect product: <Link href="/batches" className="text-[#2D5A3D] font-medium hover:text-[#22452F]">{batch.product}, Batch {batch.id}</Link></>}
            </p>
            <p className="mt-1 font-mono2 text-[10.5px] tracking-wider text-[#7A887D] uppercase">
              Seriousness criteria: {sae.seriousnessCriteria.join(" · ")}
            </p>
          </div>
          {isOpen && (
            <div className="rounded-xl border border-[#A44A2A]/50 bg-[#A44A2A]/5 px-5 py-3.5 text-right">
              <p className="text-[10px] font-bold tracking-wider text-[#A44A2A] uppercase">NDCT 24h statutory clock</p>
              <div className="mt-1">
                <LiveSaeTimer targetIso={sae.initialDueAt} saeId={sae.id} />
              </div>
              <p className="mt-1 font-mono2 text-[10px] text-[#4A5A4F]">DUE {fmtDateTime(sae.initialDueAt)}</p>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardTitle
          title="Reporting chain"
          sub="Clocks counted from time of awareness, per NDCT 2019"
          right={<Badge>AWARENESS {fmtDateTime(sae.awarenessAt)}</Badge>}
        />
        <div>
          {sae.timeline.map((t, i) => {
            const st = stepStyles[t.status];
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${st.ring}`} />
                  {i < sae.timeline.length - 1 && <span className={`w-px flex-1 ${t.status === "done" ? "bg-[#2D5A3D]/40" : "bg-[#E3DED4]"}`} />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-[13px] font-medium ${st.text}`}>{t.label}</p>
                    <Badge>{t.rule}</Badge>
                    {t.status === "due-now" && <Status kind="crit" label="Due now" live />}
                    {t.doneAt && <span className="font-mono2 text-[10px] text-[#2D5A3D]">DONE {fmtDateTime(t.doneAt)}</span>}
                  </div>
                  <p className="mt-1 font-mono2 text-[10.5px] text-[#7A887D] uppercase">
                    Due {fmtDateTime(t.dueAt)} · Owner: {t.actor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <NaranjoCalculator
            saeId={sae.id}
            initialWhoUmc={sae.whoUmc}
            initialNaranjo={sae.naranjo}
          />
        </div>

        <div className="space-y-3">
          <Card>
            <CardTitle title="Case narrative" sub="CIOMS-I ready" />
            <p className="text-[12.5px] leading-relaxed text-[#4A5A4F]">{sae.narrative}</p>
            {ae && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-[4px] bg-[#F3EFE5] p-2.5"><p className="section-label">Dechallenge</p><p className="mt-1 text-[#1C2A21]">{ae.dechallenge}</p></div>
                <div className="rounded-[4px] bg-[#F3EFE5] p-2.5"><p className="section-label">Concomitant</p><p className="mt-1 text-[#1C2A21]">{ae.concomitant.length ? ae.concomitant.join(", ") : "None"}</p></div>
                <div className="rounded-[4px] bg-[#F3EFE5] p-2.5"><p className="section-label">MedDRA PT (demo)</p><p className="mt-1 text-[#1C2A21]">{ae.meddraPt} · <span className="font-mono2">{ae.meddraCode}</span></p></div>
                <div className="rounded-[4px] bg-[#F3EFE5] p-2.5"><p className="section-label">WHODrug (demo)</p><p className="mt-1 text-[#1C2A21]">{ae.whodrug}</p></div>
              </div>
            )}
          </Card>

          <Card>
            <CardTitle title="Next actions" sub="Reports, forms and notifications" />
            <div className="mb-4 flex items-center gap-2.5 rounded-[5px] border border-[#B98A2F]/40 bg-[#B98A2F]/5 p-3">
              <Scale size={14} className="shrink-0 text-[#8A6A1F]" />
              <p className="text-[11.5px] leading-relaxed text-[#4A5A4F]">
                Compensation eligibility: <span className="font-semibold text-[#8A6A1F]">{sae.compensationEligible ? "Flagged for EC review" : "Not indicated"}</span>
                {sae.compensationEligible && " — formula computation available after Seventh Schedule verification."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="btn-crit cursor-pointer justify-center"><FileSignature size={12} /> Submit 24h initial report</span>
              <a href={`/api/safety/saes/${sae.id}/cioms`} target="_blank" className="btn-outline justify-center"><Download size={12} /> CIOMS-I form (PDF)</a>
              <a href={`/api/fhir/Bundle/${sae.id}`} target="_blank" className="btn-outline justify-center"><Download size={12} /> FHIR bundle (JSON)</a>
              <span className="btn-outline cursor-pointer justify-center"><Download size={12} /> Notify DSMB</span>
            </div>
            <p className="mt-3 text-[10.5px] leading-relaxed text-[#7A887D]">
              Every submission applies a hash-bound e-signature and writes to the audit chain. Exports are simulated in this demo build.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
