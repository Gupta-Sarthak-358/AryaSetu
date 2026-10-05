"use client";

import { Bell, ChevronDown, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePersona, useRole } from "@/lib/role";
import { personas } from "@/lib/data/personas";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Alert, Role } from "@/lib/types";
import { useShell } from "@/lib/shell-context";
import { CommandPalette } from "@/components/CommandPalette";

const crumbs: Record<string, string> = {
  dashboard: "Command Center",
  studies: "Studies",
  safety: "Safety · NPvCC",
  batches: "Batch Trace",
  regulatory: "CTRI & Ethics",
  interop: "Interoperability",
  audit: "Audit Chain",
  consent: "Consent · DPDP",
  admin: "Roles & Access",
};

const sevColor: Record<string, string> = {
  critical: "bg-[#A44A2A]",
  warning: "bg-[#B98A2F]",
  info: "bg-[#3E6B8C]",
};

export function Topbar({ sessionName, sessionRole }: { sessionName?: string; sessionRole?: string }) {
  const { role, setRole } = useRole();
  const persona = usePersona();
  const displayName = sessionName ?? persona.name;
  const displayRole = sessionRole ?? role;
  const [roleOpen, setRoleOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const segs = pathname.split("/").filter(Boolean);
  const crit = alerts.filter((a) => a.severity === "critical").length;

  const { toggleMobile, isCommandOpen, setIsCommandOpen } = useShell();

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => (r.ok ? r.json() : { alerts: [] }))
      .then((d) => setAlerts(d.alerts ?? []))
      .catch(() => setAlerts([]));
  }, [role]);

  const switchRole = async (r: Role) => {
    const p = personas.find((x) => x.role === r);
    if (p) {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: p.email, password: "AryaSetu@123" }),
      }).catch(() => {});
    }
    setRole(r);
    setRoleOpen(false);
    router.refresh();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#E3DED4] bg-[#FAF9F6]/95 px-4 py-2.5 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger trigger */}
          <button
            onClick={toggleMobile}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] hover:bg-[#F3EFE5] lg:hidden"
            aria-label="Open sidebar navigation"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[12.5px] text-[#4A5A4F] truncate" aria-label="Breadcrumb">
            <Link href="/dashboard" className="hidden sm:inline hover:text-[#1C2A21]">AryaSetu</Link>
            {segs.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-[#C9C2B2]">/</span>
                <span className={i === segs.length - 1 ? "font-semibold text-[#1C2A21]" : "hover:text-[#1C2A21]"}>
                  {crumbs[s] ?? s}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Global Quick Search Button (Triggers Command Palette) */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="mx-auto hidden w-full max-w-sm items-center justify-between rounded-lg border border-[#E3DED4] bg-[#FFFFFF] px-3 py-1.5 text-[12px] text-[#7A887D] hover:border-[#2D5A3D] hover:shadow-xs transition-all md:flex"
        >
          <span className="flex items-center gap-2">
            <Search size={14} className="text-[#2D5A3D]" />
            <span>Search studies, SAEs, batch lots…</span>
          </span>
          <kbd className="rounded border border-[#E3DED4] bg-[#F3EFE5] px-1.5 py-0.5 font-mono2 text-[10px] text-[#4A5A4F]">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          {/* Search Icon on Mobile */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] hover:text-[#1C2A21] md:hidden"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* Live System Time */}
          <span className="hidden items-center gap-2 font-mono2 text-[11px] text-[#4A5A4F] xl:flex">
            <span className="h-[6px] w-[6px] rounded-full bg-[#2D5A3D] animate-ping" />
            03-OCT-2026 15:00 IST
          </span>

          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => { setBellOpen(!bellOpen); setRoleOpen(false); }}
              aria-label={`Alerts, ${alerts.length} active`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] transition-colors hover:border-[#2D5A3D] hover:text-[#1C2A21] active:bg-[#F3EFE5]"
            >
              <Bell size={16} />
              {alerts.length > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono2 text-[9.5px] font-bold shadow-xs",
                  crit > 0 ? "bg-[#A44A2A] text-white" : "bg-[#B98A2F] text-white"
                )}>
                  {alerts.length}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-[340px] sm:w-[380px] rounded-xl border border-[#C9C2B2] bg-[#FFFFFF] p-2 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-[#E3DED4] px-2 py-2">
                  <p className="text-[12px] font-semibold text-[#1C2A21]">Active Regulatory Alerts ({alerts.length})</p>
                  <span className="text-[10px] text-[#7A887D]">NDCT 2019 Rules</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto space-y-1 py-1.5 scrollbar-thin">
                  {alerts.map((a) => (
                    <Link
                      key={a.id}
                      href={a.href}
                      onClick={() => setBellOpen(false)}
                      className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[#F3EFE5] transition-colors"
                    >
                      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", sevColor[a.severity])} />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[12px] font-medium leading-snug text-[#1C2A21]">{a.title}</span>
                        <span className="font-mono2 text-[10px] text-[#7A887D]">{a.studyId ?? "PORTFOLIO"} · {a.action}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => { setRoleOpen(!roleOpen); setBellOpen(false); }}
              aria-label={`Signed in as ${displayName}, ${displayRole}. Switch role`}
              className="flex min-h-[40px] items-center gap-2 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] px-2 py-1 transition-all hover:border-[#2D5A3D] hover:shadow-xs active:bg-[#F3EFE5]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 font-mono2 text-[10px] font-bold text-[#2D5A3D]">
                {displayName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-[11.5px] leading-tight font-medium text-[#1C2A21]">{displayName}</span>
                <span className="block font-mono2 text-[9px] leading-tight tracking-wider text-[#2D5A3D] font-semibold uppercase">{displayRole}</span>
              </span>
              <ChevronDown size={12} className="text-[#7A887D]" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 mt-2 w-[320px] rounded-xl border border-[#C9C2B2] bg-[#FFFFFF] p-2 shadow-xl z-50">
                <div className="flex items-center gap-1.5 border-b border-[#E3DED4] px-2 py-2">
                  <Sparkles size={13} className="text-[#2D5A3D]" />
                  <p className="text-[12px] font-semibold text-[#1C2A21]">Switch Clinical Persona / Role</p>
                </div>
                <div className="max-h-[340px] overflow-y-auto space-y-1 py-1.5 scrollbar-thin">
                  {personas.map((p) => (
                    <button
                      key={p.role}
                      onClick={() => switchRole(p.role as Role)}
                      className={cn(
                        "flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                        p.role === role ? "bg-[#2D5A3D]/10 border border-[#2D5A3D]/20" : "hover:bg-[#F3EFE5]"
                      )}
                    >
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", p.role === role ? "bg-[#2D5A3D]" : "bg-[#C9C2B2]")} />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[12px] font-medium text-[#1C2A21]">{p.name}</span>
                        <span className="font-mono2 text-[10px] text-[#7A887D]">{p.role} · {p.org}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] transition-colors hover:border-[#A44A2A] hover:text-[#A44A2A] active:bg-[#F3EFE5]"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Global Command Palette Dialog */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
