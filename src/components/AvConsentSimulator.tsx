"use client";

import { useState } from "react";
import { Play, Pause, Volume2, ShieldCheck, CheckCircle2, Globe } from "lucide-react";
import { Card, CardTitle } from "@/components/ui";

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिन्दी)", site: "AIIA New Delhi · NIA Jaipur" },
  { code: "en", name: "English", site: "AIIMS New Delhi · Central Repository" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", site: "IPGTRA Jamnagar" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", site: "GAMC Bengaluru" },
  { code: "bn", name: "Bengali (বাংলা)", site: "JB Roy State Ayurvedic Medical College, Kolkata" },
];

export function AvConsentSimulator() {
  const [selectedLang, setSelectedLang] = useState("hi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(38); // percent

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <Card className="border border-[#2D5A3D]/40 bg-[#FFFFFF] shadow-xs">
      <CardTitle
        title="NDCT Audio-Visual (AV) Consent & Multilingual Verification Station"
        sub="Mandatory recorded consent workflow for vulnerable participants under NDCT Rules 2019 & DPDP Act 2023"
        right={
          <span className="flex items-center gap-1.5 rounded-full bg-[#2D5A3D]/10 px-2.5 py-0.5 font-mono2 text-[10.5px] font-bold text-[#2D5A3D]">
            <ShieldCheck size={12} /> DPDP Minimised
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Language Selection */}
        <div className="rounded-lg border border-[#E3DED4] bg-[#FAF9F6] p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4A5A4F]">
            <Globe size={13} className="text-[#2D5A3D]" />
            <span>Select Scheduled Language</span>
          </div>

          <div className="space-y-1">
            {LANGUAGES.map((lang) => {
              const active = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-full text-left rounded-md px-2.5 py-2 text-[12px] transition-all ${
                    active
                      ? "bg-[#2D5A3D] text-white font-medium shadow-xs"
                      : "bg-white border border-[#E3DED4] text-[#1C2A21] hover:bg-[#F3EFE5]"
                  }`}
                >
                  <span className="block">{lang.name}</span>
                  <span className={`block text-[10px] mt-0.5 ${active ? "text-white/80" : "text-[#7A887D]"}`}>
                    {lang.site}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Simulated AV Player & Waveform */}
        <div className="lg:col-span-2 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3DED4] pb-2 mb-3">
              <div>
                <span className="font-mono2 text-[10.5px] font-bold text-[#2D5A3D]">REC-AV-2026-0812</span>
                <p className="text-[12.5px] font-semibold text-[#1C2A21]">
                  Vulnerable Subject Informed Consent · Version 2.1 ({currentLang.name})
                </p>
              </div>
              <span className="rounded bg-[#F3EFE5] px-2 py-0.5 font-mono2 text-[10.5px] text-[#4A5A4F]">
                Hash: 89ab3f…21c0
              </span>
            </div>

            {/* Audio Waveform visualization */}
            <div className="rounded-lg bg-[#FAF9F6] border border-[#E3DED4] p-4 my-2">
              <div className="flex items-center justify-between text-[11px] text-[#7A887D] mb-2 font-mono2">
                <span>02:14 / 05:48</span>
                <span className="flex items-center gap-1 text-[#2D5A3D]">
                  <Volume2 size={13} /> 128 kbps AAC (Secure Storage)
                </span>
              </div>

              {/* Fake Audio Bars */}
              <div className="flex items-end gap-1 h-12 py-1 justify-between">
                {[18, 32, 45, 60, 24, 78, 92, 54, 30, 48, 80, 65, 34, 52, 90, 74, 40, 28, 62, 85, 45, 30, 70, 50, 22].map(
                  (height, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        i < 10
                          ? isPlaying
                            ? "bg-[#2D5A3D] animate-pulse"
                            : "bg-[#2D5A3D]"
                          : "bg-[#C9C2B2]"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>

              {/* Progress Slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-1 bg-[#E3DED4] rounded-lg appearance-none cursor-pointer accent-[#2D5A3D]"
                />
              </div>
            </div>
          </div>

          {/* Player Controls & Safeguards */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E3DED4]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D5A3D] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#22452F] transition-colors"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? "Pause Recording" : "Play Narration"}</span>
              </button>
              <span className="text-[11px] text-[#7A887D]">
                Independent witness acknowledged: <strong className="text-[#1C2A21]">Prof. S. N. Pathak</strong>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#2D5A3D] font-medium">
              <CheckCircle2 size={13} />
              <span>Biometric-Free Signature Verified</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
