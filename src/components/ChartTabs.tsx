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
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#E3DED4] pb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C2A21]">Enrolment and safety</h3>
          <p className="mt-0.5 text-[12px] text-[#4A5A4F]">12 studies · 03 Oct 15:00 IST</p>
        </div>
        <div className="flex gap-1" role="tablist" aria-label="Portfolio charts">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "min-h-[44px] rounded-[4px] border px-2.5 py-1 text-[11px] font-medium transition-colors active:bg-[#F3EFE5]",
                tab === t
                  ? "border-[#2D5A3D] bg-[#2D5A3D]/5 text-[#1C2A21]"
                  : "border-[#E3DED4] text-[#4A5A4F] hover:border-[#C9C2B2] hover:text-[#1C2A21]"
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
          <div className="mt-2 flex items-center gap-4 text-[10.5px] text-[#4A5A4F]">
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-[#3E6B8C]" /> Non-serious</span>
            <span className="flex items-center gap-1.5"><span className="h-[6px] w-[6px] rounded-full bg-[#A44A2A]" /> Serious</span>
            <span className="num ml-auto">Last 5 weeks · all studies</span>
          </div>
        </>
      )}
      {tab === "Sites" && <SiteBars data={siteEnrolment} />}
      {tab === "Regulatory" && (
        <div className="grid gap-2 py-1 sm:grid-cols-2">
          {Object.entries(ctriCounts).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] px-3.5 py-3">
              <span className="text-[12px] text-[#4A5A4F]">CTRI — {k}</span>
              <span className="num text-[18px] font-semibold text-[#1C2A21]">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-[5px] border border-[#B98A2F]/40 bg-[#B98A2F]/5 px-3.5 py-3">
            <span className="text-[12px] text-[#4A5A4F]">IEC approvals expiring &lt; 45d</span>
            <span className="num text-[18px] font-semibold text-[#8A6A1F]">{studies.filter((s) => new Date(s.iecExpiry) < new Date("2026-11-15")).length}</span>
          </div>
          <div className="flex items-center justify-between rounded-[5px] border border-[#E3DED4] bg-[#FFFFFF] px-3.5 py-3">
            <span className="text-[12px] text-[#4A5A4F]">Prospective registration</span>
            <span className="num text-[18px] font-semibold text-[#2D5A3D]">12/12</span>
          </div>
        </div>
      )}
    </div>
  );
}
