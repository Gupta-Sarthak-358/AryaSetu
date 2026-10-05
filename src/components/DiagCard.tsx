"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

interface Diag {
  app: string;
  commit: string;
  region: string;
  time: string;
  database: {
    driver: string;
    host: string;
    database: string;
    studies: number;
    ctrilImported: number;
    users: number;
    auditEntries: number;
  };
}

export function DiagCard() {
  const [diag, setDiag] = useState<Diag | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/diag")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setDiag)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-[11.5px] text-red-400">Diagnostics unavailable ({error}).</p>;
  if (!diag) return <p className="text-[11.5px] text-zinc-600">Loading deployment diagnostics…</p>;

  const rows: [string, string][] = [
    ["Deployment", `${diag.commit} · ${diag.region} · ${diag.time.slice(0, 16).replace("T", " ")}Z`],
    ["Database driver", diag.database.driver],
    ["DB host", diag.database.host],
    ["DB name", diag.database.database],
    ["Studies", String(diag.database.studies)],
    ["CTRI-imported", String(diag.database.ctrilImported)],
    ["Users", String(diag.database.users)],
    ["Audit entries", String(diag.database.auditEntries)],
  ];

  return (
    <div className="space-y-1.5">
      <div className="mb-2 flex items-center gap-2">
        <Activity size={13} className="text-emerald-400" />
        <p className="font-mono2 text-[10px] tracking-wider text-zinc-600 uppercase">Live deployment check — no secrets exposed</p>
      </div>
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between rounded-[5px] border border-[#222226] bg-[#101012] px-3 py-1.5 text-[11.5px]">
          <span className="text-zinc-500">{k}</span>
          <span className="font-mono2 text-zinc-200">{v}</span>
        </div>
      ))}
    </div>
  );
}
