"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { personas, roleDescriptions } from "@/lib/data/personas";
import { useRole, RoleProvider } from "@/lib/role";
import type { Role } from "@/lib/types";
import Link from "next/link";

function LoginInner() {
  const router = useRouter();
  const { setRole } = useRole();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const doLogin = async (loginEmail: string, loginPassword: string, role: Role) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Login failed");
        setBusy(false);
        return;
      }
      setRole(role);
      router.push("/dashboard");
    } catch {
      setError("Network error — is the server running?");
      setBusy(false);
    }
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
        <h1 className="text-[22px] font-semibold tracking-tight text-zinc-50">Sign in</h1>
        <p className="mt-1.5 text-[12.5px] text-zinc-500">
          Real session authentication (Argon2id + HttpOnly cookie). Demo password for all personas: <code className="font-mono2 text-emerald-400">AryaSetu@123</code>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = personas.find((x) => x.email === email);
            doLogin(email, password, p?.role ?? "Admin");
          }}
          className="mt-5 grid gap-2 rounded-md border border-[#222226] bg-[#121214] p-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="email"
            required
            placeholder="email — e.g. pv@aryasetu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[5px] border border-[#2d2d33] bg-[#0d0d0f] px-3 py-2 text-[12.5px] text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#3f3f46]"
          />
          <input
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-[5px] border border-[#2d2d33] bg-[#0d0d0f] px-3 py-2 text-[12.5px] text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-[#3f3f46]"
          />
          <button type="submit" disabled={busy} className="btn justify-center disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {error && <p className="mt-2 text-[12px] text-red-400">{error}</p>}

        <p className="section-label mt-8 mb-3">Or pick a demo persona</p>
        <div className="overflow-hidden rounded-md border border-[#222226]">
          {personas.map((p, i) => (
            <button
              key={p.role}
              disabled={busy}
              onClick={() => doLogin(p.email, "AryaSetu@123", p.role)}
              className={`group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-3 text-left transition-colors hover:bg-[#17171a] disabled:opacity-50 ${i > 0 ? "border-t border-[#1c1c20]" : ""} ${i % 2 === 0 ? "bg-[#101012]" : "bg-[#0d0d0f]"}`}
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
          Synthetic data only · every login is written to the audit chain
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
