import Link from "next/link";
import { ArrowRight, FlaskConical, PackageCheck, TriangleAlert, Users } from "lucide-react";
import { Badge, Card, CardTitle, PageHeader, Status, StatusAuto } from "@/components/ui";
import { batches } from "@/lib/data/batches";
import { adverseEvents } from "@/lib/data/safety";
import { siteById } from "@/lib/data/sites";
import { fmtDate } from "@/lib/utils";

export default function BatchesPage() {
  const focus = batches.find((b) => b.id === "B-1142")!;
  const linkedAeDetails = adverseEvents.filter((a) => focus.linkedAes.includes(a.id));

  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 04 · UNIQUE TO ARYASETU"
        title="Batch-to-Bedside Traceability"
        sub="Formulation lot → QC certificates → sites shipped → participants dosed → adverse events linked"
        right={<Status kind="warn" label="1 signal review open" live />}
      />

      <Card className="p-0">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
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
                <tr key={b.id} className={`row-hover border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""} ${b.id === focus.id ? "bg-amber-500/[0.04]" : ""}`}>
                  <td className="px-4 py-2.5 font-mono2 text-[11.5px] font-semibold text-emerald-400">{b.id}</td>
                  <td className="py-2.5 pr-4 max-w-[220px] truncate text-zinc-300">{b.product}</td>
                  <td className="py-2.5 pr-4 max-w-[200px] truncate text-zinc-500">{b.manufacturer}</td>
                  <td className="py-2.5 pr-4 text-right num text-zinc-400">{b.sitesShipped.length}</td>
                  <td className="py-2.5 pr-4 text-right num text-zinc-400">{b.participantsDosed.length}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className={`num ${b.linkedAes.length >= 3 ? "font-semibold text-red-400" : "text-zinc-400"}`}>{b.linkedAes.length}</span>
                  </td>
                  <td className="py-2.5 pr-4"><StatusAuto status={b.status} live={b.status === "Under Review"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="panel border-amber-500/25 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono2 text-[16px] font-bold text-amber-300">{focus.id}</span>
              <h2 className="text-[15px] font-semibold text-zinc-100">{focus.product}</h2>
              <StatusAuto status={focus.status} live />
            </div>
            <p className="mt-1 text-[12px] text-zinc-500">{focus.formulation} · {focus.manufacturer}</p>
          </div>
          <Badge>Assay variance: Tinosporaside 0.31% (spec 0.40–0.60%)</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#1c1c20] pb-2.5">
              <FlaskConical size={13} className="text-emerald-400" />
              <h3 className="text-[12px] font-semibold text-zinc-200">QC certificates</h3>
            </div>
            <div className="space-y-1.5">
              {focus.assay.map((a) => (
                <div key={a.marker} className={`rounded-[4px] border p-2 text-[11px] ${a.pass ? "border-[#222226] bg-[#101012]" : "border-amber-500/30 bg-amber-500/5"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">{a.marker}</span>
                    <span className={`font-mono2 text-[9.5px] font-bold ${a.pass ? "text-emerald-400" : "text-amber-300"}`}>{a.pass ? "PASS" : "FAIL"}</span>
                  </div>
                  <p className="mt-0.5 font-mono2 text-[10px] text-zinc-600">{a.result} · spec {a.spec}</p>
                </div>
              ))}
            </div>
            <p className="section-label mt-3">Heavy metals (AYUSH limits)</p>
            <div className="mt-1.5 space-y-1">
              {focus.heavyMetals.map((h) => (
                <div key={h.metal} className="flex justify-between font-mono2 text-[10.5px]">
                  <span className="text-zinc-500">{h.metal}</span>
                  <span className="text-zinc-300">{h.result} / {h.limit} {h.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#1c1c20] pb-2.5">
              <PackageCheck size={13} className="text-sky-400" />
              <h3 className="text-[12px] font-semibold text-zinc-200">Shipped to sites</h3>
            </div>
            <div className="space-y-1.5">
              {focus.sitesShipped.map((s) => (
                <div key={s.siteId} className="rounded-[4px] border border-[#222226] bg-[#101012] p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-zinc-200">{siteById(s.siteId)?.city}</span>
                    <span className="num text-[10.5px] text-zinc-400">{s.qty} vials</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-zinc-600">{siteById(s.siteId)?.name.split("—")[0]} · {fmtDate(s.shipped)}</p>
                </div>
              ))}
            </div>
            <p className="num mt-3 text-[10px] text-zinc-600 uppercase">Mfg {fmtDate(focus.mfgDate)} · Exp {fmtDate(focus.expDate)}</p>
          </div>

          <div className="panel-2 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#1c1c20] pb-2.5">
              <Users size={13} className="text-violet-400" />
              <h3 className="text-[12px] font-semibold text-zinc-200">Participants dosed</h3>
            </div>
            <div className="space-y-1">
              {focus.participantsDosed.map((p) => (
                <div key={p.participantId} className="flex items-center justify-between rounded-[4px] bg-[#101012] px-2 py-1.5 font-mono2 text-[10.5px]">
                  <span className="text-zinc-300">{p.participantId}</span>
                  <span className="text-zinc-600">{siteById(p.siteId)?.city} · {fmtDate(p.firstDose)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">Synthetic participant IDs only — DPDP data minimisation by design.</p>
          </div>

          <div className="panel-2 border-red-500/25 p-3.5">
            <div className="mb-3 flex items-center gap-2 border-b border-[#1c1c20] pb-2.5">
              <TriangleAlert size={13} className="text-red-400" />
              <h3 className="text-[12px] font-semibold text-zinc-200">Linked adverse events</h3>
            </div>
            <div className="space-y-1.5">
              {linkedAeDetails.map((a) => (
                <Link href="/safety" key={a.id} className="block rounded-[4px] border border-red-500/20 bg-red-500/5 p-2 hover:border-red-500/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono2 text-[11px] font-medium text-red-300">{a.id}</span>
                    <StatusAuto status={a.seriousness} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[10.5px] text-zinc-400">{a.term}</p>
                  <p className="mt-1 font-mono2 text-[9.5px] text-zinc-600 uppercase">{a.participantId} · WHO-UMC {a.whoUmc}</p>
                </Link>
              ))}
            </div>
            <div className="mt-2.5 rounded-[4px] border border-amber-500/25 bg-amber-500/5 p-2.5">
              <p className="text-[11px] font-medium text-amber-300">Cluster rule fired</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-500">Same batch, same SOC (hepatobiliary), ≥3 events in 30 days → NPvCC signal review</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 font-mono2 text-[10px] tracking-wider uppercase">
          {["Manufacture + QC", "Distribution", "Administration", "Safety outcome", "Regulatory action"].map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight size={10} className="text-zinc-700" />}
              <span className={`rounded-[3px] border px-2 py-1 ${i === 3 ? "border-red-500/30 text-red-400" : "border-[#2d2d33] text-zinc-500"}`}>{s}</span>
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardTitle title="Why this matters for Ayurveda trials" sub="Formulation variability is a first-class safety variable" />
        <div className="grid gap-4 md:grid-cols-3 text-[12px] leading-relaxed text-zinc-500">
          <p>Classical polyherbal formulations carry real batch-to-batch variability — a single Arishta can combine 50+ herbs with self-generated alcohol. Assay variance is expected; tracing its clinical consequence is impossible without lot-level linkage.</p>
          <p>Rasaushadhi products contain intentional heavy metals (e.g., Naga Bhasma). AryaSetu tracks intended-content and contaminant metals separately, quarantining lots like B-1190 when spec limits are breached.</p>
          <p>When an SAE occurs, the batch view answers in one click: who else received this lot, where, and what happened — turning a two-week manual investigation into a same-day signal assessment.</p>
        </div>
      </Card>
    </div>
  );
}
