import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Boxes,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileCheck2,
  HeartPulse,
  ListTree,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const badges = [
  "GCP-ASU",
  "NDCT Rules 2019",
  "CTRI",
  "CDISC SDTM",
  "HL7 FHIR R4",
  "DPDP Act 2023",
];

const metrics = [
  { label: "Active studies", value: "12", href: "/studies", sub: "Phase II & III Ayurveda", highlight: false },
  { label: "Participants enrolled", value: "1,528", href: "/studies", sub: "Across 8 clinical sites", highlight: false },
  { label: "Sites reporting", value: "8", href: "/studies", sub: "AIIA, BHU, IPGTRA…", highlight: false },
  { label: "SAE clocks running", value: "1", href: "/safety", sub: "24h statutory NDCT window", highlight: true },
  { label: "Audit records chained", value: "2,418", href: "/audit", sub: "SHA-256 ledger verified", highlight: false },
  { label: "CTRI compliance", value: "96%", href: "/regulatory", sub: "Verified against milestones", highlight: false },
];

const modules = [
  {
    title: "Trial register",
    desc: "Twelve studies, one enrolment ledger. Lifecycle, deviations and queries per study.",
    items: ["Portfolio KPIs with drill-down", "Protocol to close-out per study", "Enrolment against target", "Deviations and CAPA follow-up"],
    href: "/studies",
    tag: "CTMS Core",
    icon: Stethoscope,
  },
  {
    title: "Safety and NPvCC",
    desc: "Serious events with a running 24-hour clock. Causality recorded twice.",
    items: ["AE and SAE capture", "NDCT 2019 clock on every SAE", "WHO-UMC plus Naranjo", "Signal feed for DSMB"],
    href: "/safety",
    tag: "Pharmacovigilance",
    icon: HeartPulse,
  },
  {
    title: "Records you can inspect",
    desc: "FHIR bundles and SDTM tables rendered from the same data, not screenshots.",
    items: ["FHIR R4 bundles", "SDTM DM and AE previews", "ADaM ADSL and Define-XML", "Connector model for EDC and HIS"],
    href: "/interop",
    tag: "HL7 & CDISC",
    icon: ListTree,
  },
  {
    title: "Access and audit",
    desc: "Seven roles, study-level membership. Every grant and denial lands in the chain.",
    items: ["Role plus study membership checks", "Hash-chained audit entries", "Hash-bound signatures", "CTRI and IEC milestone dates"],
    href: "/audit",
    tag: "Ledger",
    icon: ShieldCheck,
  },
];

const deepFeatures = [
  {
    title: "Batch & Botanical Traceability",
    desc: "Trace trial formulations from raw botanical harvest to shelf, with heavy metal assays and CoA records.",
    href: "/batches",
    badge: "ASU GMP",
    icon: Boxes,
  },
  {
    title: "CTRI & Ethics Committee Hub",
    desc: "Track IEC approvals, milestone submissions, and trial protocol versioning under NDCT Rules 2019.",
    href: "/regulatory",
    badge: "Regulatory",
    icon: FileCheck2,
  },
  {
    title: "Digital Consent & DPDP Act 2023",
    desc: "Manage informed consent records, multi-lingual audio/visual verifications, and patient rights.",
    href: "/consent",
    badge: "Privacy",
    icon: ClipboardCheck,
  },
  {
    title: "Role & Permission Management",
    desc: "Configure 7 strict clinical roles with granular study-specific membership and digital signature delegation.",
    href: "/admin",
    badge: "Governance",
    icon: Users,
  },
];

const roles: Array<[string, string, string]> = [
  ["Principal Investigator", "Signs off trials, reports SAEs within 24 hours", "/studies"],
  ["Study Coordinator", "Screens, enrols, records visits and consent", "/consent"],
  ["Monitor", "Verifies source data, raises and closes queries", "/studies"],
  ["Ethics Committee", "Reviews SAEs, compensation opinions, consent", "/regulatory"],
  ["Pharmacovigilance (NPvCC)", "Triages events, assesses causality, watches signals", "/safety"],
  ["Administration", "Manages portfolio, users and alerts", "/admin"],
  ["Regulator (read-only)", "Reads across studies, audit and exports", "/audit"],
];

export default async function Home() {
  const sessionUser = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C2A21]">
      {/* Top Banner */}
      <div className="border-b border-[#E3DED4] bg-[#F3EFE5] px-6 py-2">
        <div className="mx-auto flex max-w-6xl items-center gap-2 text-[11px] text-[#4A5A4F]">
          <ShieldCheck size={13} className="text-[#2D5A3D] shrink-0" />
          <span className="truncate">AryaSetu · National Clinical Trial Management System · Ministry of Ayush · All India Institute of Ayurveda</span>
          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <span className="flex items-center gap-1.5 font-mono2 text-[10px] text-[#2D5A3D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2D5A3D] animate-pulse" />
              Ledger Live
            </span>
            <span className="font-mono2 text-[10px] text-[#7A887D]">Demo build · synthetic data only</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#E3DED4] bg-[#FAF9F6]/95 backdrop-blur-md transition-colors" aria-label="Site">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="AryaSetu home">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#2D5A3D]/10 text-[#2D5A3D] transition-transform duration-200 group-hover:scale-105">
              <Activity size={17} strokeWidth={2.2} />
            </span>
            <span>
              <span className="block text-[14px] font-bold tracking-wide text-[#1C2A21]">ARYASETU</span>
              <span className="block font-mono2 text-[8.5px] tracking-wider uppercase text-[#7A887D] -mt-0.5">AIIA · CTMS</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 text-[13px] text-[#4A5A4F] lg:flex">
            <a href="#platform" className="rounded px-2 py-1 transition-colors hover:text-[#1C2A21] hover:bg-[#F3EFE5]">Platform</a>
            <a href="#features" className="rounded px-2 py-1 transition-colors hover:text-[#1C2A21] hover:bg-[#F3EFE5]">Features</a>
            <a href="#roles" className="rounded px-2 py-1 transition-colors hover:text-[#1C2A21] hover:bg-[#F3EFE5]">Roles</a>
            <Link href="/docs" className="rounded px-2 py-1 transition-colors hover:text-[#1C2A21] hover:bg-[#F3EFE5]">Documentation</Link>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {sessionUser ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg border border-[#C9C2B2] bg-[#FFFFFF] px-3 py-1.5 transition-all hover:border-[#2D5A3D] hover:shadow-xs active:bg-[#F3EFE5]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 font-mono2 text-[10px] font-bold text-[#2D5A3D]">
                    {sessionUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="text-left text-[11px] leading-tight hidden sm:block">
                    <span className="font-semibold text-[#1C2A21] block">{sessionUser.name}</span>
                    <span className="text-[#2D5A3D] font-mono2 text-[9px] uppercase tracking-wider">{sessionUser.role}</span>
                  </div>
                </Link>
                <Link href="/dashboard" className="btn text-[12.5px]">
                  Go to Command Center <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login" className="btn-outline text-[12.5px]">
                  Sign in
                </Link>
                <Link href="/login" className="btn text-[12.5px]">
                  Open the register <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#2D5A3D]/20 bg-[#2D5A3D]/10 px-2.5 py-0.5 font-mono2 text-[11px] font-semibold text-[#2D5A3D]">
              SIH26046 · Ayurveda Trial Register
            </span>
            <span className="flex items-center gap-1.5 rounded-md border border-[#A44A2A]/30 bg-[#FDF8F4] px-2.5 py-0.5 font-mono2 text-[11px] font-medium text-[#A44A2A]">
              <Clock size={11} className="animate-spin" />
              1 Open 24h SAE Clock Active
            </span>
          </div>

          <h1 className="display mt-4 max-w-3xl text-[40px] leading-[1.1] font-medium text-[#1C2A21] md:text-[52px]">
            Every Ayurveda trial. <br className="hidden sm:inline" />One auditable truth.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[#4A5A4F]">
            Track 12 studies across 8 sites — enrolment, safety events with running
            statutory clocks, batch traceability, and a hash-chained audit trail — from a single register
            built for AIIA trial staff, ethics committees, and regulators.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn">
              Open the register <ArrowRight size={14} />
            </Link>
            <Link href="/docs/quick-start" className="btn-outline">
              10-Minute Walkthrough
            </Link>
            <a href="#platform" className="btn-outline">
              Inspect Architecture
            </a>
          </div>

          <p className="mt-5 font-mono2 text-[11px] text-[#7A887D]">
            03-Oct-2026 15:00 IST · 12 studies · 8 sites · 1 clock running · SHA-256 chain verified
          </p>
        </div>

        {/* Live Metrics Grid with Direct Clickable Routing & Hover Affordance */}
        <div className="border-t border-[#E3DED4] bg-[#FFFFFF]">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[#E3DED4]">
            {metrics.map((m) => (
              <Link
                key={m.label}
                href={m.href}
                className={`group flex flex-col justify-between px-5 py-4 transition-all hover:bg-[#FAF9F6] active:bg-[#F3EFE5] ${
                  m.highlight ? "bg-[#FDF8F4] border-l-2 border-l-[#A44A2A]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <dd className={`num text-[26px] font-semibold leading-none ${m.highlight ? "text-[#A44A2A]" : "text-[#1C2A21]"}`}>
                      {m.value}
                    </dd>
                    <ChevronRight size={13} className="text-[#C9C2B2] transition-transform group-hover:translate-x-1 group-hover:text-[#2D5A3D]" />
                  </div>
                  <dt className="mt-1.5 text-[11px] font-medium text-[#1C2A21]">{m.label}</dt>
                </div>
                <span className="mt-2 text-[10px] text-[#7A887D]">{m.sub}</span>
              </Link>
            ))}
          </dl>
        </div>
      </section>

      {/* Standards Badges */}
      <section className="border-b border-[#E3DED4] bg-[#FAF9F6] py-3.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6">
          <span className="text-[11px] font-semibold text-[#7A887D] uppercase tracking-wider mr-2">Standards:</span>
          {badges.map((b) => (
            <Link
              key={b}
              href="/docs/gcp-asu-map"
              className="badge-interactive"
              title={`View ${b} compliance documentation`}
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* Core Platform Modules */}
      <section id="platform" className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2D5A3D]" />
            <h2 className="display text-[28px] font-medium text-[#1C2A21]">
              Four pillars, one clinical register.
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
            Study status, recruitment, safety events and compliance currently live in
            fragmented spreadsheets. AryaSetu replaces them with one unified system inspectors can audit
            record by record.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((m, i) => (
              <article
                key={m.title}
                className={`panel-interactive flex flex-col justify-between p-5 ${i === 0 ? "ledger-strong" : ""}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
                      <m.icon size={16} strokeWidth={2} />
                    </span>
                    <span className="rounded border border-[#E3DED4] bg-[#F3EFE5] px-2 py-0.5 font-mono2 text-[9.5px] font-semibold text-[#4A5A4F]">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold text-[#1C2A21]">{m.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#4A5A4F]">{m.desc}</p>
                  <ul className="mt-3.5 space-y-2 border-t border-[#E3DED4] pt-3">
                    {m.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[12px] text-[#1C2A21]">
                        <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#2D5A3D]" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 border-t border-[#E3DED4] pt-3">
                  <Link
                    href={m.href}
                    className="group flex items-center justify-between text-[12.5px] font-semibold text-[#2D5A3D] hover:text-[#1C2A21]"
                  >
                    <span>Open {m.title}</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Features (Batch Trace, Regulatory, Consent, Admin) */}
      <section id="features" className="border-b border-[#E3DED4] bg-[#F3EFE5]/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#B98A2F]" />
            <h2 className="display text-[26px] font-medium text-[#1C2A21]">
              Full Clinical Lifecycle Coverage
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
            Every specialized AYUSH clinical need — from herbal formulation provenance to patient rights under DPDP 2023.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deepFeatures.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="panel-interactive flex flex-col justify-between p-5 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#FAF9F6] border border-[#E3DED4] text-[#4A5A4F] group-hover:border-[#2D5A3D] group-hover:text-[#2D5A3D] transition-colors">
                      <f.icon size={15} />
                    </span>
                    <span className="font-mono2 text-[10px] text-[#7A887D]">{f.badge}</span>
                  </div>
                  <h3 className="mt-3 text-[14.5px] font-semibold text-[#1C2A21] group-hover:text-[#2D5A3D] transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#4A5A4F]">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11.5px] font-medium text-[#2D5A3D]">
                  <span>Access Module</span>
                  <ChevronRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Role Permission Matrix with Direct Interactive Navigation */}
      <section id="roles" className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-semibold text-[#1C2A21]">Who can see and change what</h2>
              <p className="mt-1.5 max-w-2xl text-[13px] text-[#4A5A4F]">
                Screens hide things by role. The server checks every request against role
                and study membership, and writes each check to the immutable audit chain.
              </p>
            </div>
            <Link href="/login" className="btn-outline hidden sm:inline-flex text-[12px]">
              <Sparkles size={13} className="text-[#2D5A3D]" /> Test Demo Personas
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4] bg-[#FFFFFF] shadow-xs">
            {roles.map(([role, desc, href], i) => (
              <Link
                key={role}
                href={href}
                className={`group flex items-baseline justify-between gap-6 px-5 py-3.5 transition-colors hover:bg-[#FAF9F6] active:bg-[#F3EFE5] ${
                  i > 0 ? "border-t border-[#E3DED4]" : ""
                } ${role.startsWith("Pharmacovigilance") ? "border-l-2 border-l-[#A44A2A] bg-[#FDF8F4]" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[13.5px] font-semibold text-[#1C2A21] group-hover:text-[#2D5A3D] transition-colors">
                    {role}
                  </span>
                  <span className="rounded bg-[#F3EFE5] px-1.5 py-0.2 font-mono2 text-[9px] text-[#7A887D]">Role {i + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-right text-[12.5px] text-[#4A5A4F]">{desc}</span>
                  <ChevronRight size={14} className="text-[#C9C2B2] transition-transform group-hover:translate-x-1 group-hover:text-[#2D5A3D]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Records and Documentation */}
      <section id="docs" className="border-b border-[#E3DED4] bg-[#F3EFE5]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-semibold text-[#1C2A21]">Records, Guides & Compliance Maps</h2>
              <p className="mt-1.5 text-[13px] text-[#4A5A4F]">Role guides, statutory references and data interoperability specifications.</p>
            </div>
            <Link href="/docs" className="btn-outline hidden sm:inline-flex text-[12px]">
              Full Documentation Hub <ExternalLink size={12} />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Start here",
                links: [
                  ["Platform overview", "/docs/platform-overview"],
                  ["10-minute quick start", "/docs/quick-start"],
                  ["Demo walkthrough", "/docs/demo-walkthrough"],
                  ["Synthetic data policy", "/docs/synthetic-data-policy"],
                ],
              },
              {
                title: "For trial staff",
                links: [
                  ["Guides for all 7 roles", "/docs/role-guides"],
                  ["KPI and alert setup", "/docs/kpi-alerts"],
                  ["FHIR R4 reference", "/docs/fhir-reference"],
                  ["Batch traceability notes", "/docs/batch-traceability"],
                ],
              },
              {
                title: "For reviewers & auditors",
                links: [
                  ["GCP-ASU alignment map", "/docs/gcp-asu-map"],
                  ["NDCT 2019 SAE timelines", "/docs/ndct-timelines"],
                  ["DPDP privacy controls", "/docs/dpdp-controls"],
                  ["CTRI reporting checklist", "/docs/ctri-checklist"],
                ],
              },
            ].map((col) => (
              <div key={col.title} className="panel p-5 transition-shadow hover:shadow-md">
                <h3 className="text-[13.5px] font-semibold text-[#1C2A21] flex items-center justify-between">
                  <span>{col.title}</span>
                  <span className="font-mono2 text-[10px] text-[#7A887D]">{col.links.length} docs</span>
                </h3>
                <ul className="mt-3.5 space-y-2 border-t border-[#E3DED4] pt-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group flex items-center justify-between rounded px-1.5 py-1 text-[12.5px] text-[#4A5A4F] hover:bg-[#FAF9F6] hover:text-[#1C2A21] transition-colors"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                        <ChevronRight size={12} className="text-[#C9C2B2] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-xl border border-[#C9C2B2] border-t-4 border-t-[#2D5A3D] bg-[#FFFFFF] px-6 py-12 text-center shadow-sm">
            <h2 className="display text-[26px] font-medium text-[#1C2A21]">Check today&apos;s trial register.</h2>
            <p className="mx-auto mt-2.5 max-w-lg text-[13.5px] leading-relaxed text-[#4A5A4F]">
              12 studies, 8 sites, 1 open SAE with its statutory clock running — all synthetic demo data ready for inspection.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="btn">
                Open the register <ArrowRight size={14} />
              </Link>
              <Link href="/dashboard" className="btn-outline">
                Direct to Command Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E3DED4] bg-[#F3EFE5]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-6 py-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
              <Activity size={15} />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-[#1C2A21]">ARYASETU</p>
              <p className="text-[10px] text-[#7A887D]">SIH26046 · Ministry of Ayush · All India Institute of Ayurveda</p>
            </div>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-[#7A887D]">
            Trial data is sensitive personal health data. This demo environment uses synthetic,
            de-identified records only. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
