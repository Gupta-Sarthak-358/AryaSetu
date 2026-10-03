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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[208px] flex-col border-r border-[#1c1c20] bg-[#0d0d0f]">
      <Link href="/" className="flex items-center gap-2.5 border-b border-[#1c1c20] px-4 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-emerald-500/15 text-emerald-400">
          <Activity size={15} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-[13px] leading-none font-semibold tracking-wide text-zinc-50">ARYASETU</span>
          <span className="mt-1 block text-[9px] tracking-[0.16em] text-zinc-600 uppercase">AIIA · National CTMS</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-px overflow-y-auto px-2 py-3 scrollbar-thin">
        <p className="section-label px-2 pt-1 pb-2">Modules</p>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-[5px] px-2.5 py-[7px] text-[12.5px] transition-colors",
                active
                  ? "bg-[#1a1a1e] font-medium text-zinc-50"
                  : "text-zinc-500 hover:bg-[#141416] hover:text-zinc-300"
              )}
            >
              <item.icon size={14} strokeWidth={1.8} className={active ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400"} />
              <span className="flex-1">{item.label}</span>
              {item.href === "/safety" && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-red-500/15 px-1 font-mono2 text-[10px] text-red-400">1</span>
              )}
              {active && <span className="h-3.5 w-[2px] rounded-full bg-emerald-400" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#1c1c20] px-4 py-3">
        <p className="text-[9.5px] leading-relaxed tracking-wider text-zinc-600 uppercase">
          Synthetic demo data only<br />No real patient data
        </p>
      </div>
    </aside>
  );
}
