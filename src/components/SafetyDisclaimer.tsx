"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function SafetyDisclaimer() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="panel-2 flex items-start gap-3 border-[#B98A2F]/40 p-3.5">
      <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#8A6A1F]" />
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-[#1C2A21]">Read reports carefully</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-[#4A5A4F]">
          A report does not establish causation. Reports may duplicate or omit
          details and cannot estimate incidence. Causality here is assessed
          case-by-case (WHO-UMC / Naranjo), never inferred from counts.
          Dictionaries are demo versions, not licensed MedDRA/WHODrug.
        </p>
      </div>
      <button onClick={() => setShow(false)} className="btn-outline min-h-[44px] shrink-0 !py-1 text-[11px]">Hide</button>
    </div>
  );
}
