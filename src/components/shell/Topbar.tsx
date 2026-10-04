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
  critical: "bg-red-400",
  warning: "bg-amber-400",
  info: "bg-sky-400",
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
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#1c1c20] bg-[#0a0a0b]/92 px-5 py-2.5 backdrop-blur-sm">
      <nav className="flex items-center gap-1.5 text-[12px] text-zinc-500">
        <span className="font-mono2 text-[10.5px] tracking-wider text-zinc-600 uppercase">AryaSetu</span>
        {segs.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-zinc-700">/</span>
            <span className={i === segs.length - 1 ? "font-medium text-zinc-200" : ""}>{crumbs[s] ?? s}</span>
          </span>
        ))}
      </nav>

      <div className="mx-auto hidden w-full max-w-sm items-center gap-2 rounded-[5px] border border-[#2d2d33] bg-[#121214] px-2.5 py-[5px] text-[12px] text-zinc-500 md:flex">
        <Search size={13} />
        <input
          placeholder="Search studies, participants, SAEs, batches…"
          className="w-full bg-transparent text-zinc-300 outline-none placeholder:text-zinc-600"
        />
        <kbd className="rounded border border-[#2d2d33] px-1 font-mono2 text-[9.5px] text-zinc-600">⌘K</kbd>
      </div>

      <span className="hidden items-center gap-2 font-mono2 text-[11px] text-zinc-500 lg:flex">
        <span className="live-dot inline-block h-[6px] w-[6px] rounded-full bg-emerald-400" />
        03-OCT-2026 15:00 IST
      </span>

      <div className="relative">
        <button
          onClick={() => { setBellOpen(!bellOpen); setRoleOpen(false); }}
          className="relative flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#2d2d33] bg-[#121214] text-zinc-400 hover:text-zinc-200"
        >
          <Bell size={14} />
          <span className={cn("absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-[3px] px-0.5 font-mono2 text-[9px] font-bold", crit > 0 ? "bg-red-500 text-white" : "bg-amber-500 text-black")}>
            {alerts.length}
          </span>
        </button>
        {bellOpen && (
          <div className="absolute right-0 mt-1.5 w-[380px] rounded-md border border-[#2d2d33] bg-[#121214] p-1.5 shadow-2xl">
            <p className="section-label px-2 py-1.5">Active alerts · {alerts.length}</p>
            {alerts.map((a) => (
              <Link key={a.id} href={a.href} onClick={() => setBellOpen(false)} className="flex items-start gap-2.5 rounded-[5px] px-2 py-2 hover:bg-[#1a1a1e]">
                <span className={cn("mt-1.5 h-[6px] w-[6px] shrink-0 rounded-full", sevColor[a.severity])} />
                <span>
                  <span className="block text-[12px] leading-snug text-zinc-200">{a.title}</span>
                  <span className="font-mono2 text-[10px] text-zinc-600">{a.studyId ?? "PORTFOLIO"} · {a.action.toUpperCase()} →</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => { setRoleOpen(!roleOpen); setBellOpen(false); }}
          className="flex items-center gap-2 rounded-[5px] border border-[#2d2d33] bg-[#121214] py-1 pr-2 pl-1 hover:border-[#3f3f46]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#1e1e22] font-mono2 text-[10px] font-semibold text-zinc-300">
            {displayName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
          <span className="text-left">
            <span className="block text-[11.5px] leading-tight font-medium text-zinc-200">{displayName}</span>
            <span className="block font-mono2 text-[9px] leading-tight tracking-wider text-emerald-400 uppercase">{displayRole}</span>
          </span>
          <ChevronDown size={12} className="text-zinc-600" />
        </button>
        {roleOpen && (
          <div className="absolute right-0 mt-1.5 w-[300px] rounded-md border border-[#2d2d33] bg-[#121214] p-1.5 shadow-2xl">
            <p className="section-label px-2 py-1.5">Switch role · demo personas</p>
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => switchRole(p.role as Role)}
                className={cn("flex w-full items-center gap-2.5 rounded-[5px] px-2 py-2 text-left hover:bg-[#1a1a1e]", p.role === role && "bg-[#1a1a1e]")}
              >
                <span className={cn("h-[6px] w-[6px] shrink-0 rounded-full", p.role === role ? "bg-emerald-400" : "bg-zinc-700")} />
                <span>
                  <span className="block text-[12px] text-zinc-200">{p.name}</span>
                  <span className="font-mono2 text-[9.5px] text-zinc-600 uppercase">{p.role} · {p.org}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        title="Sign out"
        className="flex h-8 w-8 items-center justify-center rounded-[5px] border border-[#2d2d33] bg-[#121214] text-zinc-500 hover:text-red-400"
      >
        <LogOut size={13} />
      </button>
    </header>
  );
}
