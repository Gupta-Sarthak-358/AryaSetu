import Link from "next/link";
import { FlaskConical, PackageCheck, TriangleAlert, Users } from "lucide-react";
import { Badge, Card, CardTitle, PageHeader, Status, StatusAuto } from "@/components/ui";
import { getAdverseEvents, getBatches, getSites } from "@/lib/server/repo";
import { fmtDate } from "@/lib/utils";
import { BatchTraceFlow } from "@/components/BatchTraceFlow";

export default async function BatchesPage() {
  const [batches, adverseEvents, sites] = await Promise.all([getBatches(), getAdverseEvents(), getSites()]);
  const siteById = (sid: string) => sites.find((s) => s.id === sid);
  const focus = batches.find((b) => b.id === "B-1142")!;
  const linkedAeDetails = adverseEvents.filter((a) => focus.linkedAes.includes(a.id));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Batch tracing"
        sub="Lot to participant: QC, shipments, dosing and linked events"
        right={<Status kind="warn" label="1 signal review open" live />}
      />

      <Card className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#E3DED4] text-[10px] tracking-wider text-[#4A5A4F] uppercase">
                <th className="px-4 py-2.5 font-medium">Batch</th>
                <th className="py-2.5 pr-4 font-medium">Product</th>
                <th className="py-2.5 pr-4 font-medium">Manufacturer</th>
                <th className="py-2.5 pr-4 text-right font-medium">Sites</th>
                <th className="py-2.5 pr-4 text-right font-medium">Dosed</th>
                <th className="py-2.5 pr-4 text-right font-medium">Linked AEs</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr key={b.id} className={`row-hover border-b border-[#E3DED4] last:border-0 ${i % 2 === 1 ? "bg-[#FDFCF9]" : ""} ${b.id === focus.id ? "bg-[#B98A2F]/[0.06]" : ""}`}>
                  <td className="px-4 py-2.5 font-mono2 text-[11.5px] font-semibold text-[#2D5A3D]">{b.id}</td>
                  <td className="py-2.5 pr-4 max-w-[220px] truncate text-[#1C2A21]">{b.product}</td>
                  <td className="py-2.5 pr-4 max-w-[200px] truncate text-[#4A5A4F]">{b.manufacturer}</td>
                  <td className="py-2.5 pr-4 text-right num text-[#4A5A4F]">{b.sitesShipped.length}</td>
                  <td className="py-2.5 pr-4 text-right num text-[#4A5A4F]">{b.participantsDosed.length}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className={`num ${b.linkedAes.length >= 3 ? "font-semibold text-[#A44A2A]" : "text-[#4A5A4F]"}`}>{b.linkedAes.length}</span>
                  </td>
                  <td className="py-2.5 pr-4"><StatusAuto status={b.status} live={b.status === "Under Review"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="panel border-[#B98A2F]/40 bg-[#B98A2F]/5 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono2 text-[16px] font-bold text-[#8A6A1F]">{focus.id}</span>
              <h2 className="text-[15px] font-semibold text-[#1C2A21]">{focus.product}</h2>
              <StatusAuto status={focus.status} live />
            </div>
            <p className="mt-1 text-[12px] text-[#4A5A4F]">{focus.formulation} · {focus.manufacturer}</p>
          </div>
          <Badge>Assay variance: Tinosporaside 0.31% (spec 0.40–0.60%)</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5">
              <FlaskConical size={13} className="text-[#2D5A3D]" />
              <h3 className="text-[12px] font-semibold text-[#1C2A21]">QC certificates</h3>
            </div>
            <div className="space-y-1.5">
              {focus.assay.map((a) => (
                <div key={a.marker} className={`rounded-[4px] border p-2 text-[11px] ${a.pass ? "border-[#E3DED4] bg-[#FFFFFF]" : "border-[#B98A2F]/40 bg-[#B98A2F]/5"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1C2A21]">{a.marker}</span>
                    <span className={`font-mono2 text-[9.5px] font-bold ${a.pass ? "text-[#2D5A3D]" : "text-[#8A6A1F]"}`}>{a.pass ? "PASS" : "FAIL"}</span>
                  </div>
                  <p className="mt-0.5 font-mono2 text-[10px] text-[#7A887D]">{a.result} · spec {a.spec}</p>
                </div>
              ))}
            </div>
            <p className="section-label mt-3">Heavy metals (AYUSH limits)</p>
            <div className="mt-1.5 space-y-1">
              {focus.heavyMetals.map((h) => (
                <div key={h.metal} className="flex justify-between font-mono2 text-[10.5px]">
                  <span className="text-[#4A5A4F]">{h.metal}</span>
                  <span className="text-[#1C2A21]">{h.result} / {h.limit} {h.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5">
              <PackageCheck size={13} className="text-[#3E6B8C]" />
              <h3 className="text-[12px] font-semibold text-[#1C2A21]">Shipped to sites</h3>
            </div>
            <div className="space-y-1.5">
              {focus.sitesShipped.map((s) => (
                <div key={s.siteId} className="rounded-[4px] border border-[#E3DED4] bg-[#FFFFFF] p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-[#1C2A21]">{siteById(s.siteId)?.city}</span>
                    <span className="num text-[10.5px] text-[#4A5A4F]">{s.qty} vials</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-[#7A887D]">{siteById(s.siteId)?.name.split("—")[0]} · {fmtDate(s.shipped)}</p>
                </div>
              ))}
            </div>
            <p className="num mt-3 text-[10px] text-[#7A887D] uppercase">Mfg {fmtDate(focus.mfgDate)} · Exp {fmtDate(focus.expDate)}</p>
          </div>

          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5">
              <Users size={13} className="text-[#6B5A8C]" />
              <h3 className="text-[12px] font-semibold text-[#1C2A21]">Participants dosed</h3>
            </div>
            <div className="space-y-1">
              {focus.participantsDosed.map((p) => (
                <div key={p.participantId} className="flex items-center justify-between rounded-[4px] bg-[#FFFFFF] px-2 py-1.5 font-mono2 text-[10.5px]">
                  <span className="text-[#1C2A21]">{p.participantId}</span>
                  <span className="text-[#7A887D]">{siteById(p.siteId)?.city} · {fmtDate(p.firstDose)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-[#7A887D]">Synthetic participant IDs only — DPDP data minimisation by design.</p>
          </div>

          <div className="panel-2 border-[#A44A2A]/40 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#E3DED4] pb-2.5">
              <TriangleAlert size={13} className="text-[#A44A2A]" />
              <h3 className="text-[12px] font-semibold text-[#1C2A21]">Linked adverse events</h3>
            </div>
            <div className="space-y-1.5">
              {linkedAeDetails.map((a) => (
                <Link href="/safety" key={a.id} className="block rounded-[4px] border border-[#A44A2A]/30 bg-[#A44A2A]/5 p-2 hover:border-[#A44A2A]/60">
                  <div className="flex items-center justify-between">
                    <span className="font-mono2 text-[11px] font-medium text-[#A44A2A]">{a.id}</span>
                    <StatusAuto status={a.seriousness} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10.5px] text-[#4A5A4F]">{a.term}</p>
                  <p className="mt-1 font-mono2 text-[9.5px] text-[#7A887D] uppercase">{a.participantId} · WHO-UMC {a.whoUmc}</p>
                </Link>
              ))}
            </div>
            <div className="mt-2.5 rounded-[4px] border border-[#B98A2F]/40 bg-[#B98A2F]/5 bg-amber-500/5 p-2.5">
              <p className="text-[11px] font-medium text-[#8A6A1F]">Cluster rule fired</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-[#4A5A4F]">Same batch, same SOC (hepatobiliary), ≥3 events in 30 days → NPvCC signal review</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <BatchTraceFlow batchId={focus.id} />
        </div>
      </div>

      <Card>
        <CardTitle title="Why lot linkage matters" sub="Batch variability is a safety variable in Ayurveda formulations" />
        <div className="grid gap-4 md:grid-cols-3 text-[12px] leading-relaxed text-[#4A5A4F]">
          <p>Classical polyherbal formulations carry real batch-to-batch variability — a single Arishta can combine 50+ herbs with self-generated alcohol. Assay variance is expected; tracing its clinical consequence is impossible without lot-level linkage.</p>
          <p>Rasaushadhi products contain intentional heavy metals (e.g., Naga Bhasma). AryaSetu tracks intended-content and contaminant metals separately, quarantining lots like B-1190 when spec limits are breached.</p>
          <p>When an SAE occurs, the batch view answers in one click: who else received this lot, where, and what happened — turning a two-week manual investigation into a same-day signal assessment.</p>
        </div>
      </Card>
    </div>
  );
}
