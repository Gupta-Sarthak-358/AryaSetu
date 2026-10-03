import { cn } from "@/lib/utils";
import Link from "next/link";

export function Card({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <div id={id} className={cn("panel p-4", className)}>{children}</div>;
}

export function CardTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#222226] pb-3">
      <div>
        <h3 className="text-[13px] font-semibold text-zinc-100">{title}</h3>
        {sub && <p className="mt-0.5 text-[11px] text-zinc-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export type StatusKind = "ok" | "warn" | "crit" | "info" | "neutral" | "violet";

const dotColor: Record<StatusKind, string> = {
  ok: "bg-emerald-400",
  warn: "bg-amber-400",
  crit: "bg-red-400",
  info: "bg-sky-400",
  neutral: "bg-zinc-500",
  violet: "bg-violet-400",
};

const textColor: Record<StatusKind, string> = {
  ok: "text-emerald-400",
  warn: "text-amber-400",
  crit: "text-red-400",
  info: "text-sky-400",
  neutral: "text-zinc-400",
  violet: "text-violet-400",
};

export function Status({ kind = "neutral", label, className, live }: { kind?: StatusKind; label: string; className?: string; live?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-medium whitespace-nowrap", textColor[kind], className)}>
      <span className={cn("h-[6px] w-[6px] rounded-full", dotColor[kind], live && "live-dot")} />
      {label}
    </span>
  );
}

export function statusKind(status: string): StatusKind {
  const s = status.toLowerCase();
  if (["recruiting", "active", "registered", "done", "verified", "released", "current", "resolved", "recovered", "closed", "low", "certain", "implemented", "on track"].some((k) => s.includes(k))) return "ok";
  if (["safety hold", "quarantined", "critical", "overdue", "fatal", "invalid"].some((k) => s.includes(k))) return "crit";
  if (["update due", "under review", "amendment pending", "due-now", "moderate", "high", "major", "capa", "recovering", "probable", "demo"].some((k) => s.includes(k))) return "warn";
  if (["follow-up", "analysis", "open", "ongoing", "info", "initiating", "possible", "blueprint", "planned", "draft"].some((k) => s.includes(k))) return "info";
  if (["close-out", "completed", "pilot", "violet", "unexpected"].some((k) => s.includes(k))) return "violet";
  return "neutral";
}

export function StatusAuto({ status, className, live }: { status: string; className?: string; live?: boolean }) {
  return <Status kind={statusKind(status)} label={status} className={className} live={live} />;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border border-[#2d2d33] bg-[#1a1a1e] px-1.5 py-0.5 text-[10.5px] font-medium text-zinc-400", className)}>
      {children}
    </span>
  );
}

export function KpiTile({ label, value, sub, kind = "neutral", href }: { label: string; value: string; sub?: React.ReactNode; kind?: StatusKind; href?: string }) {
  const inner = (
    <div className="panel p-3.5 transition-colors hover:border-[#2d2d33]">
      <p className="section-label">{label}</p>
      <p className={cn("num mt-2 text-[24px] leading-none font-semibold", kind === "crit" ? "text-red-400" : kind === "warn" ? "text-amber-400" : kind === "ok" ? "text-emerald-400" : "text-zinc-50")}>{value}</p>
      {sub && <div className="mt-2 text-[11px] text-zinc-500">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function ProgressBar({ value, max, kind = "ok", className }: { value: number; max: number; kind?: StatusKind; className?: string }) {
  const pctVal = Math.min(100, Math.round((value / max) * 100));
  const colors: Record<StatusKind, string> = { ok: "bg-emerald-500", warn: "bg-amber-500", crit: "bg-red-500", info: "bg-sky-500", neutral: "bg-zinc-500", violet: "bg-violet-500" };
  return (
    <div className={cn("h-[4px] w-full overflow-hidden rounded-sm bg-white/8", className)}>
      <div className={cn("h-full rounded-sm", colors[kind])} style={{ width: `${pctVal}%` }} />
    </div>
  );
}

export function PageHeader({ code, title, sub, right }: { code: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono2 text-[10.5px] tracking-[0.14em] text-zinc-500 uppercase">{code}</p>
        <h1 className="mt-1 text-[19px] font-semibold tracking-tight text-zinc-50">{title}</h1>
        {sub && <p className="mt-0.5 text-[12px] text-zinc-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
