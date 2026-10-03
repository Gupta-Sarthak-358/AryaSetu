"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { personas, roleDescriptions } from "@/lib/data/personas";
import { useRole, RoleProvider } from "@/lib/role";
import type { Role } from "@/lib/types";
import Link from "next/link";

function LoginInner() {
  const router = useRouter();
  const { setRole } = useRole();

  const enter = (r: Role) => {
    setRole(r);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#0a0a0b] px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-emerald-500/15 text-emerald-400">
          <Activity size={16} />
        </span>
        <span>
          <span className="block text-[15px] leading-none font-semibold tracking-wide text-zinc-50">ARYASETU</span>
          <span className="mt-1 block text-[9px] tracking-[0.16em] text-zinc-600 uppercase">Ministry of Ayush · AIIA</span>
        </span>
      </Link>

      <div className="w-full max-w-2xl">
        <h1 className="text-[22px] font-semibold tracking-tight text-zinc-50">Select a demo persona</h1>
        <p className="mt-1.5 text-[12.5px] text-zinc-500">
          Each role sees a different AryaSetu. Access is enforced per role and study membership —
          switch any time from the topbar.
        </p>

        <div className="mt-6 overflow-hidden rounded-md border border-[#222226]">
          <div className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-[#222226] bg-[#121214] px-4 py-2">
            <span className="section-label">Persona · role</span>
            <span className="section-label">Scope</span>
          </div>
          {personas.map((p, i) => (
            <button
              key={p.role}
              onClick={() => enter(p.role)}
              className={`group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-3 text-left transition-colors hover:bg-[#17171a] ${i > 0 ? "border-t border-[#1c1c20]" : ""} ${i % 2 === 0 ? "bg-[#101012]" : "bg-[#0d0d0f]"}`}
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-zinc-100">{p.name}</span>
                  <span className="rounded-[3px] border border-[#2d2d33] px-1.5 py-px font-mono2 text-[9.5px] tracking-wider text-emerald-400 uppercase">{p.role}</span>
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-zinc-500">{roleDescriptions[p.role]} · {p.org}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono2 text-[10px] text-zinc-600">{p.studies[0] === "ALL" ? "ALL STUDIES" : `${p.studies.length} STUDIES`}</span>
                <ArrowRight size={13} className="text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 font-mono2 text-[10px] tracking-wider text-zinc-600 uppercase">
          <ShieldCheck size={12} className="text-emerald-500" />
          Demo access · synthetic data only · every action is audit-logged
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <RoleProvider>
      <LoginInner />
    </RoleProvider>
  );
}
