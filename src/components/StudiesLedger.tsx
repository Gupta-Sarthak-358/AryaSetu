"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, Download } from "lucide-react";
import { Badge, Card, ProgressBar, StatusAuto } from "@/components/ui";
import { pct } from "@/lib/utils";
import type { Study } from "@/lib/types";

export function StudiesLedger({ studies }: { studies: Study[] }) {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPhase, setSelectedPhase] = useState("All");
  const [sortField, setSortField] = useState<"id" | "enrolled" | "phase">("id");
  const [sortAsc, setSortAsc] = useState(true);

  const statuses = ["All", "Recruiting", "Follow-up", "Analysis", "Safety Hold", "Close-out"];
  const phases = ["All", "Phase II", "Phase III", "Pilot"];

  const filtered = useMemo(() => {
    return studies
      .filter((s) => {
        const matchesQuery =
          query.trim() === "" ||
          s.id.toLowerCase().includes(query.toLowerCase()) ||
          s.shortTitle.toLowerCase().includes(query.toLowerCase()) ||
          s.intervention.toLowerCase().includes(query.toLowerCase()) ||
          s.indication.toLowerCase().includes(query.toLowerCase());

        const matchesStatus =
          selectedStatus === "All" || s.status.toLowerCase() === selectedStatus.toLowerCase();

        const matchesPhase =
          selectedPhase === "All" || s.phase.toLowerCase().includes(selectedPhase.toLowerCase());

        return matchesQuery && matchesStatus && matchesPhase;
      })
      .sort((a, b) => {
        if (sortField === "id") {
          return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        }
        if (sortField === "enrolled") {
          return sortAsc ? a.enrolled - b.enrolled : b.enrolled - a.enrolled;
        }
        return sortAsc ? a.phase.localeCompare(b.phase) : b.phase.localeCompare(a.phase);
      });
  }, [studies, query, selectedStatus, selectedPhase, sortField, sortAsc]);

  const toggleSort = (field: "id" | "enrolled" | "phase") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const exportCsv = () => {
    const headers = ["Study ID", "Title", "Intervention", "Phase", "CTRI Status", "Enrolled", "Target", "Status", "Risk"];
    const rows = filtered.map((s) => [
      s.id,
      `"${s.shortTitle}"`,
      `"${s.intervention}"`,
      s.phase,
      s.ctriStatus,
      s.enrolled,
      s.target,
      s.status,
      s.risk,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AryaSetu_Studies_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A887D]" />
            <input
              type="text"
              placeholder="Filter by trial ID, botanical drug, indication..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-[#E3DED4] bg-[#FFFFFF] py-2 pl-9 pr-3 text-[13px] text-[#1C2A21] outline-none placeholder:text-[#7A887D] focus:border-[#2D5A3D]"
            />
          </div>

          {/* Phase Filter Dropdown */}
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="rounded-lg border border-[#E3DED4] bg-[#FFFFFF] px-3 py-2 text-[12px] text-[#4A5A4F] outline-none focus:border-[#2D5A3D]"
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                Phase: {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="hidden lg:flex gap-1 overflow-x-auto p-0.5 rounded-lg border border-[#E3DED4] bg-[#FFFFFF]">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedStatus === st
                    ? "bg-[#2D5A3D] text-white"
                    : "text-[#4A5A4F] hover:text-[#1C2A21] hover:bg-[#F3EFE5]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] px-3 py-2 text-[12px] font-medium text-[#4A5A4F] hover:border-[#2D5A3D] hover:text-[#1C2A21] transition-all"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Studies Ledger Table */}
      <Card className="ledger-strong p-0 overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="sticky-thead border-b-2 border-[#C9C2B2] bg-[#FAF9F6] text-[10.5px] tracking-wider text-[#4A5A4F] uppercase">
                <th
                  onClick={() => toggleSort("id")}
                  className="px-4 py-3 font-semibold cursor-pointer hover:text-[#1C2A21]"
                >
                  <span className="inline-flex items-center gap-1">
                    Study ID <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3 pr-4 font-semibold">Title · Intervention</th>
                <th
                  onClick={() => toggleSort("phase")}
                  className="py-3 pr-4 font-semibold cursor-pointer hover:text-[#1C2A21]"
                >
                  <span className="inline-flex items-center gap-1">
                    Phase <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3 pr-4 font-semibold">CTRI Status</th>
                <th
                  onClick={() => toggleSort("enrolled")}
                  className="py-3 pr-4 font-semibold cursor-pointer hover:text-[#1C2A21]"
                >
                  <span className="inline-flex items-center gap-1">
                    Enrolment <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 pr-4 font-semibold">Risk Level</th>
                <th className="py-3 pr-4 text-right font-semibold">Open Queries</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#7A887D]">
                    No clinical studies match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="row-hover border-b border-[#E3DED4] last:border-0 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/studies/${s.id}`}
                        className="rounded font-mono2 text-[12px] font-bold text-[#2D5A3D] hover:text-[#22452F]"
                      >
                        {s.id}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Link href={`/studies/${s.id}`} className="block max-w-[380px] rounded group">
                        <span className="block truncate font-medium text-[#1C2A21] group-hover:underline">
                          {s.shortTitle}
                        </span>
                        <span className="block truncate text-[11.5px] text-[#7A887D]">
                          {s.intervention}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap text-[#4A5A4F]">{s.phase}</td>
                    <td className="py-3 pr-4">
                      <StatusAuto status={s.ctriStatus} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <ProgressBar
                          value={s.enrolled}
                          max={s.target}
                          kind={pct(s.enrolled, s.target) > 75 ? "ok" : pct(s.enrolled, s.target) > 40 ? "info" : "warn"}
                          className="w-20"
                        />
                        <span className="num text-[11px] font-medium text-[#4A5A4F]">
                          {s.enrolled}<span className="text-[#C9C2B2]">/{s.target}</span> ({pct(s.enrolled, s.target)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusAuto status={s.status} live={s.status === "Recruiting"} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusAuto status={s.risk} />
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Badge>{Math.max(0, (s.id.charCodeAt(4) + s.id.charCodeAt(6)) % 6)}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
