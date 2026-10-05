"use client";

import { useState, useEffect } from "react";

export function LiveSaeTimer({
  targetIso = "2026-10-06T21:12:00+05:30",
  saeId = "SAE-2026-041",
  className = "",
}: {
  targetIso?: string;
  saeId?: string;
  className?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    isOverdue: boolean;
    pctRemaining: number;
  }>({
    hours: "23",
    minutes: "45",
    seconds: "12",
    isOverdue: false,
    pctRemaining: 85,
  });

  useEffect(() => {
    const update = () => {
      const targetTime = new Date(targetIso).getTime();
      const now = Date.now();
      const diff = targetTime - now;
      const isOverdue = diff <= 0;
      const absDiff = Math.abs(diff);

      const h = Math.floor(absDiff / 3600000);
      const m = Math.floor((absDiff % 3600000) / 60000);
      const s = Math.floor((absDiff % 60000) / 1000);

      // Total 24 hours = 86,400,000 ms
      const total24hMs = 24 * 3600 * 1000;
      const pct = Math.max(0, Math.min(100, Math.round((absDiff / total24hMs) * 100)));

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        isOverdue,
        pctRemaining: isOverdue ? 100 : pct,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return (
    <div className={`flex flex-col items-end ${className}`} data-sae-id={saeId} aria-label={`Statutory clock for ${saeId}`}>
      <div className="flex items-baseline gap-1 font-mono2 font-semibold">
        <span className="text-[32px] leading-none text-[#A44A2A]">
          {timeLeft.hours}
        </span>
        <span className="text-[20px] text-[#A44A2A]/70 animate-pulse">:</span>
        <span className="text-[32px] leading-none text-[#A44A2A]">
          {timeLeft.minutes}
        </span>
        <span className="text-[20px] text-[#A44A2A]/70 animate-pulse">:</span>
        <span className="text-[22px] leading-none text-[#A44A2A]/90">
          {timeLeft.seconds}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#7A887D]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#A44A2A] animate-ping" />
        <span>{timeLeft.isOverdue ? "24h statutory deadline breached" : "statutory NDCT 2019 clock"}</span>
      </div>
    </div>
  );
}
