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
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[208px] flex-col border-r border-[#E3DED4] bg-[#FFFFFF]">
      <Link href="/" className="flex items-center gap-2.5 border-b border-[#E3DED4] px-4 py-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
          <Activity size={15} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-[13px] leading-none font-semibold tracking-wide text-[#1C2A21]">ARYASETU</span>
          <span className="mt-1 block text-[9px] tracking-[0.08em] text-[#7A887D] uppercase">AIIA · National CTMS</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-px overflow-y-auto px-2 py-3 scrollbar-thin" aria-label="Primary">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-[5px] px-2.5 py-[10px] text-[13px] transition-colors",
                active
                  ? "bg-[#E9E0C8] font-medium text-[#1C2A21]"
                  : "text-[#4A5A4F] hover:bg-[#EFE8D6] hover:text-[#1C2A21] active:bg-[#E7DCC2]"
              )}
            >
              <item.icon size={15} strokeWidth={1.8} className={active ? "text-[#2D5A3D]" : "text-[#7A887D] group-hover:text-[#4A5A4F]"} />
              <span className="flex-1">{item.label}</span>
              {item.href === "/safety" && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-sm bg-[#A44A2A]/10 px-1 font-mono2 text-[10px] text-[#A44A2A]">1</span>
              )}
              {active && <span className="h-3.5 w-[2px] rounded-full bg-[#2D5A3D]" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#E3DED4] px-4 py-3">
        <p className="text-[10px] leading-relaxed text-[#7A887D]">
          Demo build · synthetic data only
        </p>
      </div>
    </aside>
  );
}
