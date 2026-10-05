"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

interface Props {
  studies: { id: string; shortTitle: string }[];
  sites: { id: string; name: string; city: string }[];
  batches: { id: string; product: string }[];
}

const inputCls = "w-full min-h-[44px] rounded-[6px] border border-[#E3DED4] bg-[#FAF9F6] px-2.5 py-2 text-[12px] text-[#1C2A21] outline-none placeholder:text-[#7A887D] focus:border-[#2D5A3D]";

export function NewEventForm({ studies, sites, batches }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    studyId: studies[0]?.id ?? "",
    siteId: sites[0]?.id ?? "",
    participantId: "",
    batchId: "",
    term: "",
    seriousness: "Non-serious",
    severity: "Mild",
    onset: new Date().toISOString().slice(0, 10),
    whoUmc: "Possible",
    narrative: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/safety/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, batchId: form.batchId || null }),
    });
    setBusy(false);
    if (res.ok) {
      const d = await res.json();
      if (d.sae) {
        router.push(`/safety/${d.sae.id}`);
      } else {
        setMsg(`${d.ae.id} recorded and audit-logged.`);
        setForm((f) => ({ ...f, term: "", participantId: "", narrative: "" }));
        router.refresh();
      }
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? `Failed (${res.status})`);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-crit">
        <PlusCircle size={13} /> Report new AE / SAE
      </button>
    );
  }

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between border-b border-[#E3DED4] pb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C2A21]">New safety report</h3>
          <p className="mt-0.5 text-[12px] text-[#4A5A4F]">Serious reports start the 24h clock · PI, Coordinator or PV only</p>
        </div>
        <button onClick={() => setOpen(false)} className="btn-outline min-h-[44px] !py-1 text-[11px]">Close</button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-[11px] text-[#4A5A4F]">Study
          <select value={form.studyId} onChange={(e) => set("studyId", e.target.value)} className={`mt-1 ${inputCls}`}>
            {studies.map((s) => <option key={s.id} value={s.id}>{s.id} — {s.shortTitle}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Site
          <select value={form.siteId} onChange={(e) => set("siteId", e.target.value)} className={`mt-1 ${inputCls}`}>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.city} — {s.name.split("—")[0]}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Participant ID (synthetic)
          <input value={form.participantId} onChange={(e) => set("participantId", e.target.value)} placeholder="PT-036-0199" className={`mt-1 ${inputCls}`} />
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Suspect batch (optional)
          <select value={form.batchId} onChange={(e) => set("batchId", e.target.value)} className={`mt-1 ${inputCls}`}>
            <option value="">— none —</option>
            {batches.map((b) => <option key={b.id} value={b.id}>{b.id} — {b.product}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Seriousness
          <select value={form.seriousness} onChange={(e) => set("seriousness", e.target.value)} className={`mt-1 ${inputCls}`}>
            <option>Non-serious</option><option>Serious</option>
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Severity
          <select value={form.severity} onChange={(e) => set("severity", e.target.value)} className={`mt-1 ${inputCls}`}>
            <option>Mild</option><option>Moderate</option><option>Severe</option>
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Onset date
          <input type="date" value={form.onset} onChange={(e) => set("onset", e.target.value)} className={`mt-1 ${inputCls}`} />
        </label>
        <label className="text-[11px] text-[#4A5A4F]">Initial WHO-UMC
          <select value={form.whoUmc} onChange={(e) => set("whoUmc", e.target.value)} className={`mt-1 ${inputCls}`}>
            <option>Possible</option><option>Probable</option><option>Certain</option><option>Unlikely</option><option>Unassessable</option>
          </select>
        </label>
      </div>
      <label className="mt-2.5 block text-[11px] text-[#4A5A4F]">Event term (as reported)
        <input value={form.term} onChange={(e) => set("term", e.target.value)} placeholder="e.g. ALT 4x ULN with fatigue" className={`mt-1 ${inputCls}`} />
      </label>
      <label className="mt-2.5 block text-[11px] text-[#4A5A4F]">Narrative (optional)
        <textarea value={form.narrative} onChange={(e) => set("narrative", e.target.value)} rows={2} className={`mt-1 ${inputCls}`} />
      </label>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={submit} disabled={busy || !form.term || !form.participantId} className="btn disabled:opacity-50">
          {busy ? "Submitting…" : form.seriousness === "Serious" ? "Submit — start 24h clock" : "Submit report"}
        </button>
        {msg && <span className={`text-[11px] ${msg.includes("recorded") ? "text-[#2D5A3D]" : "text-[#A44A2A]"}`}>{msg}</span>}
      </div>
    </div>
  );
}
