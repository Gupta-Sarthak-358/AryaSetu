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
    <div className="flex min-h-screen flex-col items-center bg-[#FAF9F6] px-6 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5" aria-label="AryaSetu home">
        <span className="flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
          <Activity size={16} />
        </span>
        <span>
          <span className="block text-[15px] leading-none font-semibold tracking-wide text-[#1C2A21]">ARYASETU</span>
          <span className="mt-1 block text-[9px] tracking-[0.08em] text-[#7A887D] uppercase">Ministry of Ayush · AIIA</span>
        </span>
      </Link>

      <div className="w-full max-w-2xl">
        <h1 className="display text-[26px] font-medium text-[#1C2A21]">Sign in</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#4A5A4F]">
          Session sign-in (Argon2id, HttpOnly cookie). Demo password for every persona: <code className="rounded bg-[#F3EFE5] px-1 font-mono2 text-[#2D5A3D]">AryaSetu@123</code>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const p = personas.find((x) => x.email === email);
            doLogin(email, password, p?.role ?? "Admin");
          }}
          className="mt-5 grid gap-2 rounded-lg border border-[#E3DED4] bg-[#FFFFFF] p-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            type="email"
            required
            placeholder="email — e.g. pv@aryasetu.in"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[44px] rounded-[6px] border border-[#E3DED4] bg-[#FAF9F6] px-3 py-2 text-[13px] text-[#1C2A21] outline-none placeholder:text-[#7A887D] focus:border-[#2D5A3D]"
          />
          <input
            type="password"
            required
            placeholder="password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[44px] rounded-[6px] border border-[#E3DED4] bg-[#FAF9F6] px-3 py-2 text-[13px] text-[#1C2A21] outline-none placeholder:text-[#7A887D] focus:border-[#2D5A3D]"
          />
          <button type="submit" disabled={busy} className="btn justify-center disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {error && <p role="alert" className="mt-2 text-[12px] text-[#A44A2A]">{error}</p>}

        <h2 className="mt-8 mb-3 text-[14px] font-semibold text-[#1C2A21]">Or pick a demo persona</h2>
        <div className="overflow-hidden rounded-lg border border-[#E3DED4] bg-[#FFFFFF]">
          {personas.map((p, i) => (
            <button
              key={p.role}
              disabled={busy}
              onClick={() => doLogin(p.email, "AryaSetu@123", p.role)}
              className={`group grid min-h-[44px] w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-3 text-left transition-colors hover:bg-[#F3EFE5] active:bg-[#E9E2D2] disabled:opacity-50 ${i > 0 ? "border-t border-[#E3DED4]" : ""}`}
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-[#1C2A21]">{p.name}</span>
                  <span className="rounded-full border border-[#E3DED4] bg-[#F3EFE5] px-1.5 py-px font-mono2 text-[9.5px] text-[#2D5A3D]">{p.role}</span>
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-[#4A5A4F]">{roleDescriptions[p.role]} · {p.org}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono2 text-[10px] text-[#7A887D]">{p.studies[0] === "ALL" ? "All studies" : `${p.studies.length} studies`}</span>
                <ArrowRight size={13} className="text-[#C9C2B2] transition-all group-hover:translate-x-0.5 group-hover:text-[#2D5A3D]" />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-[#7A887D]">
          <ShieldCheck size={12} className="text-[#2D5A3D]" />
          Synthetic data only · sign-ins are written to the audit chain
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
