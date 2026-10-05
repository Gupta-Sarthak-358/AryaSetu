"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSignature } from "lucide-react";

const WHO_UMC = ["Certain", "Probable", "Possible", "Unlikely", "Unassessable"];

export function TriagePanel({ saeId, whoUmc, naranjo }: { saeId: string; whoUmc: string; naranjo: number }) {
  const router = useRouter();
  const [umc, setUmc] = useState(whoUmc);
  const [nar, setNar] = useState(naranjo);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/safety/saes/${saeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whoUmc: umc, naranjo: nar, reason: reason || null }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg("Triage saved — written to the audit chain.");
      setReason("");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error ?? `Failed (${res.status}) — sign in as PV or PI.`);
    }
  };

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between border-b border-[#E3DED4] pb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-[#1C2A21]">Triage — live update</h3>
          <p className="mt-0.5 text-[11px] text-[#4A5A4F]">PV / PI only · writes to database + audit chain</p>
        </div>
        <FileSignature size={14} className="text-[#2D5A3D]" />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="text-[11px] text-[#4A5A4F]">
          WHO-UMC causality
          <select value={umc} onChange={(e) => setUmc(e.target.value)} className="mt-1 w-full rounded-[5px] border border-[#E3DED4] bg-[#FAF9F6] px-2.5 py-2 text-[12px] text-[#1C2A21] outline-none">
            {WHO_UMC.map((w) => <option key={w}>{w}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-[#4A5A4F]">
          Naranjo score (0–13)
          <input type="number" min={0} max={13} value={nar} onChange={(e) => setNar(Number(e.target.value))} className="mt-1 w-full rounded-[5px] border border-[#E3DED4] bg-[#FAF9F6] px-2.5 py-2 text-[12px] text-[#1C2A21] outline-none" />
        </label>
      </div>
      <label className="mt-2.5 block text-[11px] text-[#4A5A4F]">
        Reason (recorded in audit)
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Dechallenge confirmed on repeat LFT" className="mt-1 w-full rounded-[5px] border border-[#E3DED4] bg-[#FAF9F6] px-2.5 py-2 text-[12px] text-[#1C2A21] outline-none placeholder:text-[#7A887D]" />
      </label>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={submit} disabled={busy} className="btn disabled:opacity-50">{busy ? "Saving…" : "Save triage"}</button>
        {msg && <span className={`text-[11px] ${msg.startsWith("Triage saved") ? "text-[#2D5A3D]" : "text-[#A44A2A]"}`}>{msg}</span>}
      </div>
    </div>
  );
}
