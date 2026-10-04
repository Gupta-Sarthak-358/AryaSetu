"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { Badge, Card, PageHeader, Status } from "@/components/ui";
import { fmtDateTime } from "@/lib/utils";
import type { AuditEntry } from "@/lib/types";

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [verify, setVerify] = useState<{ valid: boolean; brokenAt: number | null; count: number } | null>(null);
  const [tampered, setTampered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/audit").then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))),
      fetch("/api/audit/verify").then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))),
    ])
      .then(([a, v]) => {
        setEntries(a.entries);
        setVerify(v);
      })
      .catch(() => setError("Sign in as Admin, Monitor, Ethics, PV or Regulator to read the audit chain."));
  }, []);

  const chainInvalid = tampered || (verify && !verify.valid);

  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 07 · ALCOA+ INTEGRITY"
        title="Audit Chain"
        sub="Append-only, hash-linked records — who, what, when, before → after, why"
        right={
          <button
            onClick={() => setTampered(!tampered)}
            className={tampered ? "btn-crit" : "btn-outline"}
          >
            {tampered ? "Restore record #7" : "Simulate tamper on record #7"}
          </button>
        }
      />

      <div className={`panel flex flex-wrap items-center justify-between gap-4 p-4 ${chainInvalid ? "border-red-500/35" : "border-emerald-500/25"}`}>
        <div className="flex items-center gap-3">
          {chainInvalid ? <XCircle size={22} className="text-red-400" /> : <CheckCircle2 size={22} className="text-emerald-400" />}
          <div>
            <p className={`text-[14px] font-semibold ${chainInvalid ? "text-red-400" : "text-emerald-300"}`}>
              {chainInvalid ? "AUDIT CHAIN: INVALID — break detected" : "AUDIT CHAIN: VERIFIED"}
            </p>
            <p className="mt-0.5 text-[11.5px] text-zinc-500">
              {tampered
                ? "Record #7&rsquo;s stored hash no longer matches its recomputed content hash; every subsequent link is suspect."
                : verify
                  ? `${verify.count} records re-computed and linked server-side (SHA-256) · verified just now`
                  : error ?? "Verifying…"}
            </p>
          </div>
        </div>
        <Status kind={chainInvalid ? "crit" : "ok"} label={chainInvalid ? "Tamper evident" : "SHA-256 chain · DB-backed"} live />
      </div>

      {error && (
        <div className="panel border-amber-500/25 p-3.5 text-[12px] text-amber-300">{error}</div>
      )}

      <Card className="p-0">
        <div className="border-b border-[#222226] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-100">Chain records</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">{entries.length} entries · served from the database · each row links to the previous hash</p>
        </div>
        <div className="divide-y divide-[#1c1c20]">
          {[...entries].reverse().map((e) => {
            const isTampered = tampered && e.seq === 7;
            return (
              <div key={e.seq} className={`flex gap-4 px-4 py-3 ${isTampered ? "bg-red-500/[0.05]" : ""}`}>
                <span className="num w-7 shrink-0 pt-0.5 text-[10.5px] text-zinc-600">#{e.seq}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12.5px] font-medium text-zinc-200">{e.action}</span>
                    <Badge>{e.entity} · {e.entityId}</Badge>
                    {isTampered && <Status kind="crit" label="Modified outside system" live />}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {e.actor} · {e.role} · <span className="num">{fmtDateTime(e.ts)}</span>
                  </p>
                  <div className="mt-1.5 grid gap-1 text-[11px] md:grid-cols-2">
                    {e.before && <p className="truncate"><span className="text-zinc-600">Before: </span><span className="text-zinc-400">{e.before}</span></p>}
                    {e.after && <p className="truncate"><span className="text-zinc-600">After: </span><span className="text-emerald-400/90">{e.after}</span></p>}
                    {e.reason && <p className="truncate md:col-span-2"><span className="text-zinc-600">Reason: </span><span className="text-zinc-400">{e.reason}</span></p>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 font-mono2 text-[9.5px]">
                    <span className={isTampered ? "text-red-400" : "text-emerald-500/70"}>hash {e.hash.slice(0, 12)}…{e.hash.slice(-6)}</span>
                    <span className="text-zinc-700">prev {e.prevHash.slice(0, 12)}…</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <div className="mb-2 flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /><h3 className="text-[13px] font-semibold text-zinc-100">How the chain works</h3></div>
          <p className="text-[11.5px] leading-relaxed text-zinc-500">
            Each record&rsquo;s SHA-256 is computed over its content plus the previous record&rsquo;s hash and stored in the
            append-only audit_events table. Editing any historical record breaks every link after it — detected by a
            single verification pass over the database.
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 text-[13px] font-semibold text-zinc-100">ALCOA+ coverage</h3>
          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            {["Attributable", "Legible", "Contemporaneous", "Original", "Accurate", "Complete", "Consistent", "Enduring", "Available"].map((a) => (
              <span key={a} className="flex items-center gap-1.5 rounded-[3px] bg-emerald-500/5 px-2 py-1 text-emerald-400">
                <CheckCircle2 size={9} /> {a}
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-[13px] font-semibold text-zinc-100">Honest scope</h3>
          <p className="text-[11.5px] leading-relaxed text-zinc-500">
            Application-level tamper evidence over a real database — not WORM storage, not a 21 CFR Part 11
            certification. HSM-bound signing keys and object-lock storage are Phase-2/3 items.
          </p>
        </Card>
      </div>
    </div>
  );
}
