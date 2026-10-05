"use client";

import { useState } from "react";

interface SupplyStage {
  id: string;
  step: string;
  title: string;
  sub: string;
  status: "verified" | "flagged" | "active";
  details: { label: string; val: string }[];
}

const STAGES: SupplyStage[] = [
  {
    id: "cultivation",
    step: "01",
    title: "Botanical Raw Material",
    sub: "Tinospora cordifolia (Guduchi)",
    status: "verified",
    details: [
      { label: "GAP Source", val: "NMPB Certified Forest Reserve, MP" },
      { label: "Collection Period", val: "May 2026 (Mature stem)" },
      { label: "Herbarium Specimen", val: "AIIA-BOT-2026-904 verified" },
    ],
  },
  {
    id: "qc",
    step: "02",
    title: "Phytochemical Fingerprint",
    sub: "HPTLC & Marker Assay",
    status: "flagged",
    details: [
      { label: "Tinosporaside", val: "0.31% (Spec: 0.40–0.60%) — Out of Spec" },
      { label: "Heavy Metals", val: "Pb < 0.2 ppm, As < 0.1 ppm (PASS)" },
      { label: "Pesticide Residue", val: "EP/USP standards compliant" },
    ],
  },
  {
    id: "formulation",
    step: "03",
    title: "GMP Formulation",
    sub: "Guduchi Ghan Vati 500mg",
    status: "verified",
    details: [
      { label: "Mfg Lot Number", val: "B-1142 (3,000 unit batch)" },
      { label: "Mfg Date", val: "10-Jun-2026 · Exp: 09-Jun-2028" },
      { label: "Facility", val: "Indian Medicines Mfg (GMP Certified)" },
    ],
  },
  {
    id: "distribution",
    step: "04",
    title: "Cold Chain & Sites",
    sub: "Shipped across 3 Centres",
    status: "verified",
    details: [
      { label: "Site 01 (Delhi)", val: "60 vials received (22-Jun-2026)" },
      { label: "Site 02 (Jaipur)", val: "40 vials received (24-Jun-2026)" },
      { label: "Site 04 (Varanasi)", val: "40 vials received (25-Jun-2026)" },
    ],
  },
  {
    id: "clinical",
    step: "05",
    title: "Subject Administration",
    sub: "78 Participants Dosed",
    status: "verified",
    details: [
      { label: "Dosing Protocol", val: "1 tablet BID with warm water" },
      { label: "Trial Arm", val: "AYU-031 Post-COVID Fatigue" },
      { label: "Compliance Rate", val: "94.2% via digital pill log" },
    ],
  },
  {
    id: "surveillance",
    step: "06",
    title: "Pharmacovigilance Signal",
    sub: "Hepatic Cluster Detected",
    status: "flagged",
    details: [
      { label: "Linked SAEs", val: "SAE-2026-041 (ALT > 3x ULN)" },
      { label: "Non-serious AEs", val: "AE-2026-092, AE-2026-099" },
      { label: "Regulatory Action", val: "Quarantine hold under review" },
    ],
  },
];

export function BatchTraceFlow({ batchId = "B-1142" }: { batchId?: string }) {
  const [selectedStage, setSelectedStage] = useState<string>("qc");
  const stage = STAGES.find((s) => s.id === selectedStage) || STAGES[1];

  return (
    <div className="rounded-xl border border-[#C9C2B2] bg-[#FAF9F6] p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#E3DED4] pb-3 mb-4">
        <div>
          <span className="font-mono2 text-[10px] uppercase tracking-wider text-[#2D5A3D] font-bold">
            Botanical Supply Chain Traceability Matrix
          </span>
          <h3 className="text-[15px] font-semibold text-[#1C2A21]">
            Interactive Batch Lineage: Lot {batchId}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-[#4A5A4F]">
            <span className="h-2 w-2 rounded-full bg-[#2D5A3D]" /> Verified
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-[#A44A2A]">
            <span className="h-2 w-2 rounded-full bg-[#A44A2A] animate-ping" /> Flagged / Review
          </span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 mb-4">
        {STAGES.map((st) => {
          const isSelected = st.id === selectedStage;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStage(st.id)}
              className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-[#2D5A3D] bg-[#FFFFFF] shadow-sm ring-1 ring-[#2D5A3D]"
                  : "border-[#E3DED4] bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] hover:border-[#C9C2B2]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-mono2 text-[9.5px] font-bold text-[#7A887D]">STEP {st.step}</span>
                {st.status === "flagged" ? (
                  <span className="h-2 w-2 rounded-full bg-[#A44A2A]" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[#2D5A3D]" />
                )}
              </div>
              <span className="text-[11.5px] font-semibold text-[#1C2A21] line-clamp-1">
                {st.title}
              </span>
              <span className="text-[10px] text-[#7A887D] line-clamp-1 mt-0.5">
                {st.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer */}
      <div className="rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3DED4] pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2D5A3D]/10 font-mono2 text-[11px] font-bold text-[#2D5A3D]">
              {stage.step}
            </span>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#1C2A21]">{stage.title}</h4>
              <p className="text-[11px] text-[#7A887D]">{stage.sub}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold ${
              stage.status === "flagged"
                ? "bg-[#A44A2A]/10 text-[#A44A2A]"
                : "bg-[#2D5A3D]/10 text-[#2D5A3D]"
            }`}
          >
            {stage.status === "flagged" ? "Variance / Signal Detected" : "Audit Verified"}
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {stage.details.map((d) => (
            <div key={d.label} className="rounded-md border border-[#E3DED4] bg-[#FAF9F6] p-2.5">
              <span className="block text-[10.5px] text-[#7A887D] uppercase font-medium">{d.label}</span>
              <span className="block text-[12px] font-semibold text-[#1C2A21] mt-0.5">{d.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
