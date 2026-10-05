import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";

const badges = ["GCP-ASU", "NDCT Rules 2019", "CTRI", "CDISC SDTM", "HL7 FHIR R4", "DPDP Act 2023"];

const metrics = [
  { label: "Active studies", value: "12" },
  { label: "Participants enrolled", value: "1,528" },
  { label: "Sites reporting", value: "8" },
  { label: "SAE clocks running", value: "1" },
  { label: "Audit records chained", value: "2,418" },
  { label: "CTRI compliance", value: "96%" },
];

const modules = [
  {
    title: "Trial register",
    desc: "Twelve studies, one enrolment ledger. Lifecycle, deviations and queries per study.",
    items: ["Portfolio KPIs with drill-down", "Protocol to close-out per study", "Enrolment against target", "Deviations and CAPA follow-up"],
  },
  {
    title: "Safety and NPvCC",
    desc: "Serious events with a running 24-hour clock. Causality recorded twice.",
    items: ["AE and SAE capture", "NDCT 2019 clock on every SAE", "WHO-UMC plus Naranjo", "Signal feed for DSMB"],
  },
  {
    title: "Records you can inspect",
    desc: "FHIR bundles and SDTM tables rendered from the same data, not screenshots.",
    items: ["FHIR R4 bundles", "SDTM DM and AE previews", "ADaM ADSL and Define-XML", "Connector model for EDC and HIS"],
  },
  {
    title: "Access and audit",
    desc: "Seven roles, study-level membership. Every grant and denial lands in the chain.",
    items: ["Role plus study membership checks", "Hash-chained audit entries", "Hash-bound signatures", "CTRI and IEC milestone dates"],
  },
];

const roles: Array<[string, string]> = [
  ["Principal Investigator", "Signs off trials, reports SAEs within 24 hours"],
  ["Study Coordinator", "Screens, enrols, records visits and consent"],
  ["Monitor", "Verifies source data, raises and closes queries"],
  ["Ethics Committee", "Reviews SAEs, compensation opinions, consent"],
  ["Pharmacovigilance (NPvCC)", "Triages events, assesses causality, watches signals"],
  ["Administration", "Manages portfolio, users and alerts"],
  ["Regulator (read-only)", "Reads across studies, audit and exports"],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C2A21]">
      <div className="border-b border-[#E3DED4] bg-[#F3EFE5] px-6 py-1.5">
        <p className="mx-auto flex max-w-6xl items-center gap-2 text-[11px] text-[#4A5A4F]">
          <ShieldCheck size={12} className="text-[#2D5A3D]" />
          AryaSetu · National Clinical Trial Management System · Ministry of Ayush · All India Institute of Ayurveda
          <span className="ml-auto hidden font-mono2 text-[10px] text-[#7A887D] sm:block">Demo build · synthetic data only</span>
        </p>
      </div>

      <nav className="sticky top-0 z-50 border-b border-[#E3DED4] bg-[#FAF9F6]/95 backdrop-blur-sm" aria-label="Site">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5" aria-label="AryaSetu home">
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
              <Activity size={15} strokeWidth={2.2} />
            </span>
            <span className="text-[14px] font-semibold tracking-wide text-[#1C2A21]">ARYASETU</span>
          </Link>
          <div className="hidden items-center gap-6 text-[13px] text-[#4A5A4F] md:flex">
            <a href="#platform" className="hover:text-[#1C2A21]">Platform</a>
            <a href="#roles" className="hover:text-[#1C2A21]">Roles</a>
            <a href="#docs" className="hover:text-[#1C2A21]">Documentation</a>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/login" className="btn-outline">Sign in</Link>
            <Link href="/login" className="btn">Open the register</Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
          <p className="text-[12px] font-medium text-[#2D5A3D]">SIH26046 · Ayurveda trial register</p>
          <h1 className="display mt-3 max-w-3xl text-[40px] leading-[1.1] font-medium text-[#1C2A21] md:text-[52px]">
            Every Ayurveda trial. One auditable truth.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[#4A5A4F]">
            Track 12 studies across 8 sites — enrolment, safety events with running
            statutory clocks, and a hash-chained audit trail — from a single register
            built for AIIA trial staff, ethics committees and regulators.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn">Open the register <ArrowRight size={14} /></Link>
            <a href="#docs" className="btn-outline">How it records data</a>
          </div>
          <p className="mt-5 font-mono2 text-[11px] text-[#7A887D]">
            03-Oct-2026 15:00 IST · 12 studies · 8 sites · 1 clock running · chain verified
          </p>
        </div>

        <div className="border-t border-[#E3DED4]">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {metrics.map((m, i) => (
              <div key={m.label} className={`px-6 py-5 ${i > 0 ? "border-l border-[#E3DED4]" : ""}`}>
                <dd className="num text-[26px] font-semibold text-[#1C2A21]">{m.value}</dd>
                <dt className="mt-1 text-[11px] text-[#4A5A4F]">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-[#E3DED4] py-4">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-2 px-6" aria-label="Standards followed">
          {badges.map((b) => (
            <li key={b} className="rounded-full border border-[#E3DED4] bg-[#FFFFFF] px-2.5 py-1 font-mono2 text-[10px] text-[#4A5A4F]">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section id="platform" className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="display text-[28px] font-medium text-[#1C2A21]">
            Four parts, one register.
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
            Study status, recruitment, safety and compliance currently live in
            spreadsheets. This replaces them with one system judges can inspect
            record by record.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((m, i) => (
              <article key={m.title} className={`panel p-5 transition-colors hover:border-[#C9C2B2] active:bg-[#F3EFE5] ${i === 0 ? "ledger-strong" : ""}`}>
                <h3 className="text-[15px] font-semibold text-[#1C2A21]">{m.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#4A5A4F]">{m.desc}</p>
                <ul className="mt-3 space-y-2 border-t border-[#E3DED4] pt-3">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12.5px] text-[#1C2A21]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#2D5A3D]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="border-b border-[#E3DED4]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-[22px] font-semibold text-[#1C2A21]">Who can see and change what</h2>
          <p className="mt-1.5 max-w-2xl text-[13px] text-[#4A5A4F]">
            Screens hide things by role. The server checks every request against role
            and study membership, and writes each check to the audit chain.
          </p>
          <div className="mt-6 overflow-hidden rounded-lg border border-[#E3DED4] bg-[#FFFFFF]">
            {roles.map(([role, desc], i) => (
              <div key={role} className={`flex items-baseline justify-between gap-6 px-5 py-3.5 ${i > 0 ? "border-t border-[#E3DED4]" : ""} ${role.startsWith("Pharmacovigilance") ? "border-l-2 border-l-[#A44A2A] bg-[#FDF8F4]" : ""}`}>
                <span className="text-[13.5px] font-medium text-[#1C2A21]">{role}</span>
                <span className="text-right text-[12.5px] text-[#4A5A4F]">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" className="border-b border-[#E3DED4] bg-[#F3EFE5]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-[22px] font-semibold text-[#1C2A21]">Records and guides</h2>
          <p className="mt-1.5 text-[13px] text-[#4A5A4F]">Role guides, compliance maps and export references.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { title: "Start here", links: [["Platform overview", "/#platform"], ["10-minute quick start", "/login"], ["Demo walkthrough", "/dashboard"], ["Synthetic data policy", "/consent"]] },
              { title: "For trial staff", links: [["Guides for all 7 roles", "/admin"], ["KPI and alert setup", "/dashboard"], ["FHIR R4 reference", "/interop"], ["Batch traceability notes", "/batches"]] },
              { title: "For reviewers", links: [["GCP-ASU alignment map", "/regulatory"], ["NDCT 2019 SAE timelines", "/safety"], ["DPDP privacy controls", "/consent"], ["CTRI reporting checklist", "/regulatory"]] },
            ].map((col) => (
              <div key={col.title} className="panel p-5">
                <h3 className="text-[13.5px] font-semibold text-[#1C2A21]">{col.title}</h3>
                <ul className="mt-3 space-y-2.5 border-t border-[#E3DED4] pt-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="group flex items-center gap-2 rounded text-[12.5px] text-[#4A5A4F] hover:text-[#1C2A21] active:text-[#2D5A3D]">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-lg border border-[#C9C2B2] border-t-2 border-t-[#2D5A3D] bg-[#FFFFFF] px-6 py-10 text-center">
            <h2 className="display text-[24px] font-medium text-[#1C2A21]">Check today&apos;s register.</h2>
            <p className="mx-auto mt-2 max-w-lg text-[13px] text-[#4A5A4F]">
              12 studies, 8 sites, 1 open SAE with its clock running — all synthetic demo data.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/login" className="btn">Open the register <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E3DED4] bg-[#F3EFE5]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-6 py-7 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#2D5A3D]/10 text-[#2D5A3D]">
              <Activity size={13} />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-[#1C2A21]">ARYASETU</p>
              <p className="text-[10px] text-[#7A887D]">SIH26046 · Ministry of Ayush · AIIA</p>
            </div>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-[#7A887D]">
            Trial data is sensitive personal data. This demo uses synthetic,
            de-identified records only.
          </p>
        </div>
      </footer>
    </div>
  );
}
