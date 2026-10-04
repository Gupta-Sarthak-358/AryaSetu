"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatusAuto } from "@/components/ui";
import type { DataQuery } from "@/lib/types";

interface Props {
  studyId: string;
  siteId: string;
  queries: DataQuery[];
}

export function QueryPanel({ studyId, siteId, queries }: Props) {
  const router = useRouter();
  const [field, setField] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const raise = async () => {
    if (!field.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/studies/${studyId}/queries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId, field }),
    });
    setBusy(false);
    if (res.ok) {
      setField("");
      setMsg("Query raised (Monitor action, audit-logged).");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? `Failed (${res.status}) — Monitor role required.`);
    }
  };

  const respond = async (qid: string) => {
    const res = await fetch(`/api/queries/${qid}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? `Failed (${res.status}) — PI/Coordinator required.`);
    }
  };

  return (
    <div className="space-y-2">
      {queries.length === 0 && <p className="text-[11.5px] text-zinc-600">No queries for this study.</p>}
      {queries.map((q) => (
        <div key={q.id} className="flex items-start justify-between gap-2 rounded-[5px] border border-[#222226] bg-[#101012] p-3">
          <div>
            <p className="text-[12px] text-zinc-200">{q.field}</p>
            <p className="mt-0.5 font-mono2 text-[9.5px] text-zinc-600 uppercase">{q.id} · {q.ageDays}D OLD</p>
          </div>
          <div className="flex items-center gap-2">
            {q.status === "Open" && (
              <button onClick={() => respond(q.id)} className="btn-outline !px-2 !py-0.5 text-[10px]">Resolve</button>
            )}
            <StatusAuto status={q.status} />
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="Raise query — e.g. HAM-A item 7 blank"
          className="flex-1 rounded-[5px] border border-[#2d2d33] bg-[#0d0d0f] px-2.5 py-1.5 text-[11.5px] text-zinc-200 outline-none placeholder:text-zinc-600"
        />
        <button onClick={raise} disabled={busy} className="btn-outline shrink-0 !py-1.5 text-[11px]">{busy ? "…" : "Raise"}</button>
      </div>
      {msg && <p className={`text-[10.5px] ${msg.includes("raised") ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>}
    </div>
  );
}
