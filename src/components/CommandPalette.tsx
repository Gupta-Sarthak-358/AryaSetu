"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Stethoscope, HeartPulse, Boxes, ShieldCheck, FileCheck2, ArrowRight } from "lucide-react";

interface SearchItem {
  id: string;
  category: "Study" | "Safety / SAE" | "Batch" | "Regulatory" | "Audit";
  title: string;
  sub: string;
  href: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: "AYU-024", category: "Study", title: "Ashwagandha in Generalized Anxiety (Phase III)", sub: "191/240 Enrolled · Low Risk · AIIMS Delhi", href: "/studies/AYU-024" },
  { id: "AYU-031", category: "Study", title: "AYUSH-64 in Post-COVID Fatigue (Phase III)", sub: "312/350 Enrolled · Moderate Risk · AIIA New Delhi", href: "/studies/AYU-031" },
  { id: "AYU-042", category: "Study", title: "Curcumin Nano-emulsion in Osteoarthritis (Phase II)", sub: "84/120 Enrolled · Low Risk · BHU Varanasi", href: "/studies/AYU-042" },
  { id: "AYU-058", category: "Study", title: "Triphala Extract in Type 2 Diabetes", sub: "142/200 Enrolled · Recruiting · NIA Jaipur", href: "/studies/AYU-058" },
  { id: "AYU-067", category: "Study", title: "Brahmi Rasayana in Age-Associated Cognitive Decline", sub: "65/150 Enrolled · Low Risk · IPGTRA Jamnagar", href: "/studies/AYU-067" },
  { id: "SAE-2026-041", category: "Safety / SAE", title: "SAE-2026-041: Acute hepatic transaminase elevation", sub: "Ayush-64 · Batch B-1142 · 24h statutory clock active", href: "/safety/SAE-2026-041" },
  { id: "AE-2026-108", category: "Safety / SAE", title: "AE-2026-108: Mild dyspepsia post-dose", sub: "Ashwagandha · Batch B-2109 · Resolved", href: "/safety" },
  { id: "B-1142", category: "Batch", title: "Batch B-1142: AYUSH-64 Film-coated 500mg", sub: "Under Review · 3 Linked AEs · Indian Medicines Mfg", href: "/batches" },
  { id: "B-2109", category: "Batch", title: "Batch B-2109: Ashwagandha Aqueous Extract 300mg", sub: "Released · 180 Dosed · Green Ayush Labs", href: "/batches" },
  { id: "CTRI-081234", category: "Regulatory", title: "CTRI/2026/02/081234", sub: "Prospective Trial Registration · Fully Compliant", href: "/regulatory" },
  { id: "IEC-AIIA-2026", category: "Regulatory", title: "Institutional Ethics Committee AIIA Approval", sub: "Valid till Jan 2027 · Review Scheduled", href: "/regulatory" },
  { id: "AUDIT-007", category: "Audit", title: "Audit Record #7: Batch Dispense Signature", sub: "Hash 7a9e4f... · SHA-256 Chained Block", href: "/audit" },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setSelectedIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filtered = query.trim() === ""
    ? SEARCH_ITEMS.slice(0, 7)
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = useCallback(
    (item: SearchItem) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 bg-[#1C2A21]/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#C9C2B2] bg-[#FAF9F6] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 border-b border-[#E3DED4] bg-[#FFFFFF] px-4 py-3">
          <Search size={18} className="text-[#2D5A3D]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search studies (e.g. AYU-024), SAEs, batch lots, CTRI..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-[14px] text-[#1C2A21] outline-none placeholder:text-[#7A887D]"
          />
          <button 
            onClick={onClose}
            className="rounded p-1 text-[#7A887D] hover:bg-[#F3EFE5] hover:text-[#1C2A21]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#7A887D]">
              No records found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#2D5A3D] text-[#FFFFFF]"
                        : "hover:bg-[#F3EFE5] text-[#1C2A21]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-md ${isSelected ? "bg-white/10 text-white" : "bg-[#F3EFE5] text-[#2D5A3D]"}`}>
                        {item.category === "Study" && <Stethoscope size={15} />}
                        {item.category === "Safety / SAE" && <HeartPulse size={15} />}
                        {item.category === "Batch" && <Boxes size={15} />}
                        {item.category === "Regulatory" && <FileCheck2 size={15} />}
                        {item.category === "Audit" && <ShieldCheck size={15} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono2 text-[10.5px] font-bold uppercase tracking-wider ${isSelected ? "text-[#E9E0C8]" : "text-[#2D5A3D]"}`}>
                            {item.id}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? "bg-white/20 text-white" : "bg-[#E3DED4] text-[#4A5A4F]"}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className={`text-[12.5px] font-medium truncate mt-0.5 ${isSelected ? "text-[#FFFFFF]" : "text-[#1C2A21]"}`}>
                          {item.title}
                        </p>
                        <p className={`text-[11px] truncate ${isSelected ? "text-white/80" : "text-[#7A887D]"}`}>
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`shrink-0 ml-2 transition-transform ${isSelected ? "translate-x-0.5 text-white" : "text-[#C9C2B2]"}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-[#E3DED4] bg-[#F3EFE5] px-4 py-2 text-[11px] text-[#7A887D]">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="rounded border border-[#C9C2B2] bg-white px-1 font-mono2 text-[9px]">↑</kbd> <kbd className="rounded border border-[#C9C2B2] bg-white px-1 font-mono2 text-[9px]">↓</kbd></span>
            <span>Select <kbd className="rounded border border-[#C9C2B2] bg-white px-1 font-mono2 text-[9px]">↵</kbd></span>
          </div>
          <span>AryaSetu National Clinical Trial Registry</span>
        </div>
      </div>
    </div>
  );
}
