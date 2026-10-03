"use client";

import { useState } from "react";
import { AeBars, EnrollmentTrend, SiteBars } from "@/components/charts";
import { aeByWeek, enrollmentPortfolio, siteEnrolment } from "@/lib/data/ops";
import { studies } from "@/lib/data/studies";
import { cn } from "@/lib/utils";

const tabs = ["Enrolment", "Safety", "Sites", "Regulatory"] as const;

export function ChartTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Enrolment");
  const ctriCounts = {
    Registered: studies.filter((s) => s.ctriStatus === "Registered").length,
    "Update Due": studies.filter((s) => s.ctriStatus === "Update Due").length,
    "Under Review": studies.filter((s) => s.ctriStatus === "Under Review").length,
    Submitted: studies.filter((s) => s.ctriStatus === "Submitted").length,
  };

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#222226] pb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-100">Portfolio telemetry</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">All 12 studies · as of 03 Oct 15:00 IST</p>
        </div>
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-[4px] border px-2.5 py-1 text-[11px] font-medium transition-colors",
                tab === t
                  ? "border-[#3f3f46] bg-[#1a1a1e] text-zinc-100"
                  : "border-[#2d2d33] text-zinc-500 hover:border-[#3f3f46] hover:text-zinc-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Enrolment" && <EnrollmentTrend data={enrollmentPortfolio} />}
      {tab === "Safety" && (
        <>
          <AeBars data={aeByWeek} />
          <div className="mt-2 flex items-center gap-4 text-[10.5px] text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-sky-500" /> Non-serious</span>
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-red-500" /> Serious</span>
            <span className="num ml-auto">Last 5 weeks · all studies</span>
          </div>
        </>
      )}
      {tab === "Sites" && <SiteBars data={siteEnrolment} />}
      {tab === "Regulatory" && (
        <div className="grid gap-2 py-1 sm:grid-cols-2">
          {Object.entries(ctriCounts).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-[5px] border border-[#222226] bg-[#101012] px-3.5 py-3">
              <span className="text-[12px] text-zinc-400">CTRI — {k}</span>
              <span className="num text-[18px] font-semibold text-zinc-100">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-[5px] border border-amber-500/25 bg-amber-500/5 px-3.5 py-3">
            <span className="text-[12px] text-zinc-400">IEC approvals expiring &lt; 45d</span>
            <span className="num text-[18px] font-semibold text-amber-300">{studies.filter((s) => new Date(s.iecExpiry) < new Date("2026-11-15")).length}</span>
          </div>
          <div className="flex items-center justify-between rounded-[5px] border border-[#222226] bg-[#101012] px-3.5 py-3">
            <span className="text-[12px] text-zinc-400">Prospective registration</span>
            <span className="num text-[18px] font-semibold text-emerald-400">12/12</span>
          </div>
        </div>
      )}
    </div>
  );
}
