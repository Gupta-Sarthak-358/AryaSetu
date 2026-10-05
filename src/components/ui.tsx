import { cn } from "@/lib/utils";
import Link from "next/link";

export function Card({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <div id={id} className={cn("panel p-4", className)}>{children}</div>;
}

export function CardTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#E3DED4] pb-3">
      <div>
        <h3 className="text-[14px] font-semibold text-[#1C2A21]">{title}</h3>
        {sub && <p className="mt-0.5 text-[12px] text-[#4A5A4F]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export type StatusKind = "ok" | "warn" | "crit" | "info" | "neutral" | "violet";

const dotColor: Record<StatusKind, string> = {
  ok: "bg-[#2D5A3D]",
  warn: "bg-[#B98A2F]",
  crit: "bg-[#A44A2A]",
  info: "bg-[#3E6B8C]",
  neutral: "bg-[#7A887D]",
  violet: "bg-[#6B5A8C]",
};

const textColor: Record<StatusKind, string> = {
  ok: "text-[#2D5A3D]",
  warn: "text-[#8A6A1F]",
  crit: "text-[#A44A2A]",
  info: "text-[#3E6B8C]",
  neutral: "text-[#4A5A4F]",
  violet: "text-[#6B5A8C]",
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
    <span className={cn("inline-flex items-center gap-1 rounded border border-[#E3DED4] bg-[#F3EFE5] px-1.5 py-0.5 text-[10.5px] font-medium text-[#4A5A4F]", className)}>
      {children}
    </span>
  );
}

export function KpiTile({ label, value, sub, kind = "neutral", href }: { label: string; value: string; sub?: React.ReactNode; kind?: StatusKind; href?: string }) {
  const inner = (
    <div className="panel p-3.5 transition-all hover:-translate-y-px hover:border-[#C9C2B2] hover:shadow-[0_2px_8px_rgba(28,42,33,0.1)] active:translate-y-0 active:bg-[#F3EFE5]">
      <p className="section-label">{label}</p>
      <p className={cn("num mt-2 text-[24px] leading-none font-semibold", kind === "crit" ? "text-[#A44A2A]" : kind === "warn" ? "text-[#8A6A1F]" : kind === "ok" ? "text-[#2D5A3D]" : "text-[#1C2A21]")}>{value}</p>
      {sub && <div className="mt-2 text-[11px] text-[#4A5A4F]">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function ProgressBar({ value, max, kind = "ok", className }: { value: number; max: number; kind?: StatusKind; className?: string }) {
  const pctVal = Math.min(100, Math.round((value / max) * 100));
  const colors: Record<StatusKind, string> = { ok: "bg-[#2D5A3D]", warn: "bg-[#B98A2F]", crit: "bg-[#A44A2A]", info: "bg-[#3E6B8C]", neutral: "bg-[#7A887D]", violet: "bg-[#6B5A8C]" };
  return (
    <div className={cn("h-[4px] w-full overflow-hidden rounded-sm bg-[#E3DED4]", className)}>
      <div className={cn("h-full rounded-sm", colors[kind])} style={{ width: `${pctVal}%` }} />
    </div>
  );
}

export function PageHeader({ code, title, sub, right }: { code?: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {code && <p className="font-mono2 text-[10.5px] tracking-[0.08em] text-[#7A887D] uppercase">{code}</p>}
        <h1 className="display mt-1 text-[24px] font-medium text-[#1C2A21]">{title}</h1>
        {sub && <p className="mt-0.5 max-w-2xl text-[13px] text-[#4A5A4F]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
