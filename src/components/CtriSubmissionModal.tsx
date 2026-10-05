"use client";

import { useState } from "react";
import { CheckCircle2, FileCheck2, Send } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";

interface CtriItem {
  id: string;
  label: string;
  done: boolean;
}

export function CtriSubmissionModal({ studyId = "AYU-031" }: { studyId?: string }) {
  const [items, setItems] = useState<CtriItem[]>([
    { id: "enrolment", label: "Cumulative Enrolment Target Update (312/350 achieved)", done: true },
    { id: "iec", label: "Ethics Committee Annual Renewal Approval Attached", done: true },
    { id: "sae", label: "24h SAE Initial & 14d Comprehensive Safety Summary Synchronized", done: true },
    { id: "deviations", label: "Protocol Deviation Register Verified (0 Critical, 2 Minor)", done: true },
    { id: "batch", label: "Investigational Product Batch Lots QC Certificates Appended", done: false },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const allReady = items.every((i) => i.done);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <Card className="border border-[#B98A2F]/40 bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
      <CardTitle
        title="CTRI Form-24 Biannual Compliance & Milestone Filing Portal"
        sub="Statutory six-monthly trial status update filing to the Clinical Trials Registry - India (ICMR / CDSCO)"
        right={
          <span className="flex items-center gap-1.5 rounded-full bg-[#B98A2F]/10 px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold text-[#8A6A1F]">
            <FileCheck2 size={12} /> Study: {studyId}
          </span>
        }
      />

      <div className="space-y-2 mt-3">
        <p className="text-[12px] text-[#4A5A4F]">
          Select mandatory dossier checkpoints before executing the digital signature transmit:
        </p>

        <div className="space-y-1.5 pt-1">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all ${
                item.done
                  ? "border-[#2D5A3D]/30 bg-[#2D5A3D]/[0.03]"
                  : "border-[#E3DED4] bg-[#FAF9F6] hover:border-[#C9C2B2]"
              }`}
            >
              <div
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  item.done
                    ? "border-[#2D5A3D] bg-[#2D5A3D] text-white"
                    : "border-[#C9C2B2] bg-white"
                }`}
              >
                {item.done && <CheckCircle2 size={12} />}
              </div>
              <span className={`text-[12px] font-medium ${item.done ? "text-[#1C2A21]" : "text-[#7A887D]"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#E3DED4] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#7A887D]">
            {submitted ? (
              <span className="text-[#2D5A3D] font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> CTRI Filing Transmitted · ACK #CTRI-ACK-2026-9921
              </span>
            ) : (
              <span>Dossier readiness: {items.filter((i) => i.done).length} / {items.length} items checked</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allReady || submitting || submitted}
            className="btn min-h-[38px] !py-1.5 text-[12px] disabled:opacity-50"
          >
            <Send size={12} />
            <span>{submitted ? "Filing Recorded" : submitting ? "Transmitting to CTRI…" : "Submit CTRI Form-24"}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
