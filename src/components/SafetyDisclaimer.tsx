"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function SafetyDisclaimer() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="panel-2 flex items-start gap-3 border-amber-500/25 p-3.5">
      <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-amber-300">Limitations of spontaneous safety data</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-zinc-500">
          A report of an event does not establish causation. Data may contain duplicates or incomplete
          reports and cannot be used to estimate incidence rates. Causality shown here is assessed
          case-by-case (WHO-UMC / Naranjo), not inferred from counts. Dictionaries are demonstration
          versions, not licensed MedDRA/WHODrug.
        </p>
      </div>
      <button onClick={() => setShow(false)} className="btn-outline shrink-0 !py-1 text-[11px]">Acknowledge</button>
    </div>
  );
}
