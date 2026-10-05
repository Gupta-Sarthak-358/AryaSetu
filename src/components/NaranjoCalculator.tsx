"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSignature, RefreshCw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";

interface NaranjoQuestion {
  id: number;
  q: string;
  note: string;
  options: { label: string; score: number }[];
  currentChoice: number; // index of option
}

const INITIAL_QUESTIONS: NaranjoQuestion[] = [
  {
    id: 1,
    q: "Previous conclusive reports on this reaction?",
    note: "Guduchi hepatotoxicity case series published in AYUSH literature",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
  {
    id: 2,
    q: "Event appeared after suspect drug was given?",
    note: "Week-8 LFT post-dose initiation on 26-Jul-2026",
    options: [{ label: "Yes (+2)", score: 2 }, { label: "No (-1)", score: -1 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
  {
    id: 3,
    q: "Improved on withdrawal (dechallenge)?",
    note: "Serum ALT declining sharply post-drug withdrawal",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
  {
    id: 4,
    q: "Reaction reappeared on re-administration?",
    note: "Rechallenge withheld due to ethical & safety protocol limits",
    options: [{ label: "Yes (+2)", score: 2 }, { label: "No (-1)", score: -1 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 2,
  },
  {
    id: 5,
    q: "Are there alternative causes (non-drug)?",
    note: "Viral hepatitis panel negative; zero alcohol or acetaminophen history",
    options: [{ label: "No (+2)", score: 2 }, { label: "Yes (-1)", score: -1 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
  {
    id: 6,
    q: "Did the reaction appear with placebo?",
    note: "Registry / pragmatic arm — no placebo control group",
    options: [{ label: "No (+1)", score: 1 }, { label: "Yes (-1)", score: -1 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 2,
  },
  {
    id: 7,
    q: "Drug detected in toxic blood concentrations?",
    note: "Blood level concentration not measured in protocol assay",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 1,
  },
  {
    id: 8,
    q: "Was the reaction more severe when dose increased?",
    note: "Consistent with cumulative clinical drug exposure",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
  {
    id: 9,
    q: "Similar reaction to same/similar drugs in the past?",
    note: "Subject has no documented past reaction to Tinospora cordifolia",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 1,
  },
  {
    id: 10,
    q: "Was adverse event confirmed by objective evidence?",
    note: "Serial laboratory LFT panel (ALT, AST, Bilirubin) on record",
    options: [{ label: "Yes (+1)", score: 1 }, { label: "No (0)", score: 0 }, { label: "Do not know (0)", score: 0 }],
    currentChoice: 0,
  },
];

const WHO_UMC_CATEGORIES = ["Certain", "Probable", "Possible", "Unlikely", "Unassessable"];

export function NaranjoCalculator({
  saeId,
  initialWhoUmc,
  initialNaranjo,
}: {
  saeId: string;
  initialWhoUmc: string;
  initialNaranjo: number;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<NaranjoQuestion[]>(INITIAL_QUESTIONS);
  const [whoUmc, setWhoUmc] = useState(initialWhoUmc);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Compute live score
  const totalScore = questions.reduce((acc, q) => acc + q.options[q.currentChoice].score, 0);

  // Naranjo scale classification
  const getClassification = (score: number) => {
    if (score >= 9) return { label: "Definite ADR", color: "text-[#2D5A3D]", bg: "bg-[#2D5A3D]/10" };
    if (score >= 5) return { label: "Probable ADR", color: "text-[#8A6A1F]", bg: "bg-[#B98A2F]/10" };
    if (score >= 1) return { label: "Possible ADR", color: "text-[#3E6B8C]", bg: "bg-[#3E6B8C]/10" };
    return { label: "Doubtful ADR", color: "text-[#7A887D]", bg: "bg-[#E3DED4]" };
  };

  const classification = getClassification(totalScore);

  const handleOptionChange = (qIndex: number, optionIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIndex] = { ...next[qIndex], currentChoice: optionIndex };
      return next;
    });
  };

  const handleSaveTriage = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/safety/saes/${saeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whoUmc,
          naranjo: totalScore,
          reason: reason || `Naranjo score recalculated to ${totalScore} (${classification.label})`,
        }),
      });

      if (res.ok) {
        setMessage(`Causality updated to ${totalScore} (${classification.label}) & chained to audit.`);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setMessage(d.error ?? "Failed to save triage. Please ensure adequate role permissions.");
      }
    } catch {
      setMessage("Network error occurred during causality submission.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-4">
      <CardTitle
        title="Interactive Dual Causality Assessment"
        sub="WHO-UMC standard paired with real-time Naranjo probability algorithm"
        right={
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono2 text-[11px] font-bold ${classification.bg} ${classification.color}`}>
            Score: {totalScore} / 13 · {classification.label}
          </span>
        }
      />

      {/* Top Causality Scorecards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#B98A2F]/40 bg-[#B98A2F]/5 p-3 text-center">
          <p className="section-label">WHO-UMC Algorithm</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <select
              value={whoUmc}
              onChange={(e) => setWhoUmc(e.target.value)}
              className="rounded border border-[#C9C2B2] bg-white px-2 py-1 text-[13px] font-semibold text-[#8A6A1F] outline-none"
            >
              {WHO_UMC_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-[#2D5A3D]/40 bg-[#2D5A3D]/5 p-3 text-center">
          <p className="section-label">Live Naranjo Score</p>
          <p className="num mt-1 text-[18px] font-bold text-[#2D5A3D]">
            {totalScore} <span className="text-[12px] font-normal text-[#4A5A4F]">/ 13 pts (baseline: {initialNaranjo})</span>
          </p>
          <p className={`text-[11px] font-semibold mt-0.5 ${classification.color}`}>
            {classification.label}
          </p>
        </div>
      </div>

      {/* 10-Item Interactive Questionnaire */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-2.5 transition-colors hover:border-[#C9C2B2]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[12px] font-medium text-[#1C2A21]">
                  <span className="font-mono2 text-[#7A887D] mr-1.5">{idx + 1}.</span>
                  {q.q}
                </p>
                <p className="text-[10.5px] text-[#7A887D] mt-0.5">{q.note}</p>
              </div>

              {/* Selectable score buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {q.options.map((opt, optIdx) => {
                  const isSelected = q.currentChoice === optIdx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleOptionChange(idx, optIdx)}
                      className={`rounded px-2 py-1 text-[10px] font-mono2 font-semibold transition-all ${
                        isSelected
                          ? "bg-[#2D5A3D] text-white shadow-xs"
                          : "border border-[#E3DED4] bg-[#FAF9F6] text-[#4A5A4F] hover:bg-[#F3EFE5]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Reason & Save Action */}
      <div className="border-t border-[#E3DED4] pt-3">
        <label className="block text-[11px] font-medium text-[#4A5A4F]">
          Causality Rationalization / Clinical Notes (Stored in Cryptographic Audit Chain)
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Serial LFT regression validates positive dechallenge; WHO-UMC retained as Probable"
          className="mt-1 w-full rounded-lg border border-[#E3DED4] bg-[#FFFFFF] px-3 py-2 text-[12px] text-[#1C2A21] outline-none placeholder:text-[#7A887D] focus:border-[#2D5A3D]"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveTriage}
            disabled={saving}
            className="btn min-h-[38px] !py-1.5 text-[12px]"
          >
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <FileSignature size={13} />}
            <span>Commit Causality Triage</span>
          </button>

          {message && (
            <span
              className={`text-[11.5px] font-medium ${
                message.includes("updated") ? "text-[#2D5A3D]" : "text-[#A44A2A]"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
