"use client";

import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePersona, useRole } from "@/lib/role";
import { personas } from "@/lib/data/personas";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Alert, Role } from "@/lib/types";

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
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#E3DED4] bg-[#FAF9F6]/95 px-5 py-2.5 backdrop-blur-sm">
      <nav className="flex items-center gap-1.5 text-[12px] text-[#4A5A4F]" aria-label="Breadcrumb">
        {segs.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[#C9C2B2]">/</span>}
            <span className={i === segs.length - 1 ? "font-medium text-[#1C2A21]" : ""}>{crumbs[s] ?? s}</span>
          </span>
        ))}
      </nav>

      <div className="mx-auto hidden w-full max-w-sm items-center gap-2 rounded-[6px] border border-[#E3DED4] bg-[#FFFFFF] px-2.5 py-[5px] text-[12px] text-[#4A5A4F] md:flex">
        <Search size={13} />
        <input
          placeholder="Search studies, SAEs, batches…"
          aria-label="Search studies, SAEs, batches"
          className="w-full bg-transparent text-[#1C2A21] outline-none placeholder:text-[#7A887D]"
        />
        <kbd className="rounded border border-[#E3DED4] px-1 font-mono2 text-[9.5px] text-[#7A887D]">⌘K</kbd>
      </div>

      <span className="hidden items-center gap-2 font-mono2 text-[11px] text-[#4A5A4F] lg:flex">
        <span className="live-dot inline-block h-[6px] w-[6px] rounded-full bg-[#2D5A3D]" />
        03-OCT-2026 15:00 IST
      </span>

      <div className="relative">
        <button
          onClick={() => { setBellOpen(!bellOpen); setRoleOpen(false); }}
          aria-label={`Alerts, ${alerts.length} active`}
          className="relative flex h-11 w-11 items-center justify-center rounded-[6px] border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] transition-colors hover:border-[#2D5A3D] hover:text-[#1C2A21] active:bg-[#F3EFE5]"
        >
          <Bell size={15} />
          <span className={cn("absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-[3px] px-0.5 font-mono2 text-[9px] font-bold", crit > 0 ? "bg-[#A44A2A] text-white" : "bg-[#B98A2F] text-white")}>
            {alerts.length}
          </span>
        </button>
        {bellOpen && (
          <div className="absolute right-0 mt-1.5 w-[380px] rounded-md border border-[#E3DED4] bg-[#FFFFFF] p-1.5 shadow-xl">
            <p className="px-2 py-1.5 text-[12px] font-semibold text-[#1C2A21]">Alerts · {alerts.length}</p>
            {alerts.map((a) => (
              <Link key={a.id} href={a.href} onClick={() => setBellOpen(false)} className="flex items-start gap-2.5 rounded-[5px] px-2 py-2 hover:bg-[#F3EFE5] active:bg-[#E9E2D2]">
                <span className={cn("mt-1.5 h-[6px] w-[6px] shrink-0 rounded-full", sevColor[a.severity])} />
                <span>
                  <span className="block text-[12px] leading-snug text-[#1C2A21]">{a.title}</span>
                  <span className="font-mono2 text-[10px] text-[#7A887D]">{a.studyId ?? "PORTFOLIO"} · {a.action}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => { setRoleOpen(!roleOpen); setBellOpen(false); }}
          aria-label={`Signed in as ${displayName}, ${displayRole}. Switch role`}
          className="flex min-h-[44px] items-center gap-2 rounded-[6px] border border-[#E3DED4] bg-[#FFFFFF] py-1 pr-2 pl-1 transition-colors hover:border-[#2D5A3D] active:bg-[#F3EFE5]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#F3EFE5] font-mono2 text-[10px] font-semibold text-[#1C2A21]">
            {displayName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <span className="text-left">
            <span className="block text-[11.5px] leading-tight font-medium text-[#1C2A21]">{displayName}</span>
            <span className="block font-mono2 text-[9px] leading-tight tracking-wider text-[#2D5A3D] uppercase">{displayRole}</span>
          </span>
          <ChevronDown size={12} className="text-[#7A887D]" />
        </button>
        {roleOpen && (
          <div className="absolute right-0 mt-1.5 w-[300px] rounded-md border border-[#E3DED4] bg-[#FFFFFF] p-1.5 shadow-xl">
            <p className="px-2 py-1.5 text-[12px] font-semibold text-[#1C2A21]">Switch role</p>
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => switchRole(p.role as Role)}
                className={cn("flex min-h-[44px] w-full items-center gap-2.5 rounded-[5px] px-2 py-2 text-left hover:bg-[#F3EFE5] active:bg-[#E9E2D2]", p.role === role && "bg-[#F3EFE5]")}
              >
                <span className={cn("h-[6px] w-[6px] shrink-0 rounded-full", p.role === role ? "bg-[#2D5A3D]" : "bg-[#C9C2B2]")} />
                <span>
                  <span className="block text-[12px] text-[#1C2A21]">{p.name}</span>
                  <span className="font-mono2 text-[9.5px] text-[#7A887D]">{p.role} · {p.org}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        title="Sign out"
        aria-label="Sign out"
        className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-[#E3DED4] bg-[#FFFFFF] text-[#4A5A4F] transition-colors hover:border-[#A44A2A] hover:text-[#A44A2A] active:bg-[#F3EFE5]"
      >
        <LogOut size={14} />
      </button>
    </header>
  );
}
