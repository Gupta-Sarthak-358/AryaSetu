"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusAuto } from "@/components/ui";
import type { Deviation } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

interface Props {
  studyId: string;
  sites: { id: string; city: string }[];
  deviations: Deviation[];
}

export function DeviationPanel({ studyId, sites, deviations }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ siteId: sites[0]?.id ?? "", type: "", severity: "Minor", description: "" });

  const submit = async () => {
    setBusy(true);
    const res = await fetch(`/api/studies/${studyId}/deviations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Deviation reported and audit-logged.");
      setForm((f) => ({ ...f, type: "", description: "" }));
      setOpen(false);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? `Failed (${res.status})`);
    }
  };

  return (
    <div className="space-y-2">
      {deviations.length === 0 && <p className="text-[11.5px] text-zinc-600">No deviations recorded for this study.</p>}
      {deviations.map((d) => (
        <div key={d.id} className="rounded-[5px] border border-[#222226] bg-[#101012] p-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-zinc-200">{d.type}</span>
            <StatusAuto status={d.severity} />
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">{d.description}</p>
          <p className="mt-1.5 font-mono2 text-[9.5px] text-zinc-600 uppercase">{d.id} · {fmtDate(d.reported)} · {d.status}</p>
        </div>
      ))}

      {open ? (
        <div className="space-y-2 rounded-[5px] border border-[#2d2d33] bg-[#0d0d0f] p-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="rounded-[5px] border border-[#2d2d33] bg-[#101012] px-2 py-1.5 text-[11px] text-zinc-200">
              {sites.map((s) => <option key={s.id} value={s.id}>{s.city}</option>)}
            </select>
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="rounded-[5px] border border-[#2d2d33] bg-[#101012] px-2 py-1.5 text-[11px] text-zinc-200">
              <option>Minor</option><option>Major</option><option>Critical</option>
            </select>
          </div>
          <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type — e.g. Visit window breach" className="w-full rounded-[5px] border border-[#2d2d33] bg-[#101012] px-2 py-1.5 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-600" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description and immediate action taken" rows={2} className="w-full rounded-[5px] border border-[#2d2d33] bg-[#101012] px-2 py-1.5 text-[11px] text-zinc-200 outline-none placeholder:text-zinc-600" />
          <div className="flex gap-2">
            <button onClick={submit} disabled={busy || !form.type || !form.description} className="btn !py-1 text-[11px] disabled:opacity-50">{busy ? "…" : "Report"}</button>
            <button onClick={() => setOpen(false)} className="btn-outline !py-1 text-[11px]">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-outline !py-1.5 text-[11px]">+ Report deviation</button>
      )}
      {msg && <p className={`text-[10.5px] ${msg.includes("reported") ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>}
    </div>
  );
}
