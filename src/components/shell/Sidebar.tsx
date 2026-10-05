"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Boxes,
  ClipboardCheck,
  FileCheck2,
  HeartPulse,
  LayoutDashboard,
  ListTree,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShell } from "@/lib/shell-context";

const nav = [
  { code: "01", href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { code: "02", href: "/studies", label: "Studies", icon: Stethoscope },
  { code: "03", href: "/safety", label: "Safety · NPvCC", icon: HeartPulse },
  { code: "04", href: "/batches", label: "Batch Trace", icon: Boxes },
  { code: "05", href: "/regulatory", label: "CTRI & Ethics", icon: FileCheck2 },
  { code: "06", href: "/interop", label: "Interoperability", icon: ListTree },
  { code: "07", href: "/audit", label: "Audit Chain", icon: ShieldCheck },
  { code: "08", href: "/consent", label: "Consent · DPDP", icon: ClipboardCheck },
  { code: "09", href: "/admin", label: "Roles & Access", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isMobileOpen, setIsMobileOpen } = useShell();

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#1C2A21]/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[230px] flex-col border-r border-[#E3DED4] bg-[#FFFFFF] transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:w-[216px]"
        )}
      >
        <div className="flex items-center justify-between border-b border-[#E3DED4] px-4 py-3.5">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
              <Activity size={15} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[13px] leading-none font-semibold tracking-wide text-[#1C2A21]">ARYASETU</span>
              <span className="mt-1 block text-[9px] tracking-[0.08em] text-[#7A887D] uppercase">AIIA · National CTMS</span>
            </span>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded p-1 text-[#7A887D] hover:bg-[#F3EFE5] hover:text-[#1C2A21] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-3 scrollbar-thin" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-[6px] px-2.5 py-[9px] text-[13px] transition-all",
                  active
                    ? "bg-[#2D5A3D]/10 font-medium text-[#2D5A3D] shadow-xs"
                    : "text-[#4A5A4F] hover:bg-[#FAF9F6] hover:text-[#1C2A21] active:bg-[#F3EFE5]"
                )}
              >
                <item.icon
                  size={16}
                  strokeWidth={1.8}
                  className={active ? "text-[#2D5A3D]" : "text-[#7A887D] group-hover:text-[#4A5A4F]"}
                />
                <span className="flex-1">{item.label}</span>
                {item.href === "/safety" && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-[#A44A2A] px-1 font-mono2 text-[10px] font-bold text-white">
                    1
                  </span>
                )}
                {active && <span className="h-4 w-[2.5px] rounded-full bg-[#2D5A3D]" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E3DED4] bg-[#FAF9F6] px-4 py-3">
          <div className="flex items-center gap-2 text-[10px] text-[#7A887D]">
            <span className="h-2 w-2 rounded-full bg-[#2D5A3D] animate-pulse" />
            <span>Ministry of Ayush · SIH26046</span>
          </div>
          <p className="mt-1 font-mono2 text-[9px] text-[#7A887D]">
            SHA-256 Ledger Verified
          </p>
        </div>
      </aside>
    </>
  );
}
