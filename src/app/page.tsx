import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

const badges = ["GCP-ASU", "NDCT Rules 2019", "CTRI", "CDISC · SDTM", "HL7 FHIR R4", "DPDP Act 2023", "ISO/IEC 27001", "CERT-In"];

const metrics = [
  { label: "Active studies", value: "12" },
  { label: "Participants enrolled", value: "1,528" },
  { label: "Sites across India", value: "8" },
  { label: "Statutory clocks running", value: "1" },
  { label: "Audit records chained", value: "2,418" },
  { label: "CTRI compliance", value: "96%" },
];

const modules = [
  {
    code: "01",
    title: "Trial Command",
    desc: "One auditable view of the entire AIIA research portfolio — lifecycle, enrolment, deviations, data quality.",
    items: ["Real-time portfolio KPIs with drill-down", "Per-study lifecycle: protocol → close-out", "Enrolment vs target, planned/actual", "Deviation and CAPA workflows", "Data-query aging and site quality"],
  },
  {
    code: "02",
    title: "Safety · NPvCC",
    desc: "Pharmacovigilance built around AIIA's role as National Pharmacovigilance Coordination Centre for ASU&H drugs.",
    items: ["AE/SAE capture and routing", "NDCT 2019 statutory clock engine", "MedDRA / WHODrug coding (demo dictionaries)", "WHO-UMC + Naranjo dual causality", "Signal detection and DSMB feed"],
  },
  {
    code: "03",
    title: "Interoperability",
    desc: "Standards as working artifacts you can inspect, not logos on a slide.",
    items: ["HL7 FHIR R4 resource bundles", "CDISC SDTM DM/AE tabulation previews", "ADaM ADSL and Define-XML export", "ABDM-ready architecture (blueprint)", "EDC / HIS connector model"],
  },
  {
    code: "04",
    title: "Governance",
    desc: "ALCOA+ integrity across every record, role and signature.",
    items: ["7-role RBAC with study-level ACL", "Hash-chained, tamper-evident audit", "Hash-bound e-signatures", "Consent versioning and DPDP controls", "CTRI / IEC milestone tracking"],
  },
];

const roles = [
  ["Principal Investigator", "Trial conduct, e-signature, SAE reporting within 24 hours"],
  ["Study Coordinator", "Screening, enrolment, visits, consent management"],
  ["Monitor", "SDV, data queries, deviations and CAPA follow-up"],
  ["Ethics Committee", "SAE review, compensation opinion, consent oversight"],
  ["Pharmacovigilance (NPvCC)", "Triage, causality assessment, signal detection"],
  ["Administration", "Portfolio command, users, alerts and configuration"],
  ["Regulator (read-only)", "Oversight view across all studies, audit and exports"],
];

const docColumns = [
  { title: "Getting started", links: ["Platform overview", "Quick start — 10 minutes", "Judge demo script", "Deployment guide", "Synthetic data policy"] },
  { title: "Platform guides", links: ["Role-based user guides (7)", "KPI & alert configuration", "FHIR R4 profile reference", "Batch traceability model", "API reference (planned)"] },
  { title: "Compliance", links: ["GCP-ASU alignment map", "NDCT 2019 SAE timeline engine", "DPDP Act 2023 privacy controls", "ALCOA+ audit design", "CTRI reporting checklist"] },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-300">
      <div className="border-b border-[#1c1c20] bg-[#0d0d0f] px-6 py-1.5">
        <p className="mx-auto flex max-w-6xl items-center gap-2 text-[10.5px] tracking-wider text-zinc-500 uppercase">
          <ShieldCheck size={11} className="text-emerald-500" />
          AryaSetu · National Clinical Trial Management System · Ministry of Ayush · All India Institute of Ayurveda
          <span className="ml-auto hidden font-mono2 text-[10px] text-zinc-600 normal-case sm:block">Demonstration build · synthetic data only</span>
        </p>
      </div>

      <nav className="sticky top-0 z-50 border-b border-[#1c1c20] bg-[#0a0a0b]/92 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-emerald-500/15 text-emerald-400">
              <Activity size={15} strokeWidth={2.2} />
            </span>
            <span className="text-[14px] font-semibold tracking-wide text-zinc-50">ARYASETU</span>
          </Link>
          <div className="hidden items-center gap-6 text-[12.5px] text-zinc-500 md:flex">
            <a href="#platform" className="hover:text-zinc-200">Platform</a>
            <a href="#roles" className="hover:text-zinc-200">Roles</a>
            <a href="#docs" className="hover:text-zinc-200">Documentation</a>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/login" className="btn-outline">Sign in</Link>
            <Link href="/login" className="btn">Launch live demo</Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-[#1c1c20]">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <p className="font-mono2 text-[11px] tracking-[0.16em] text-emerald-400 uppercase">SIH26046 · CTMS for Ayurveda research</p>
          <h1 className="mt-4 max-w-3xl text-[40px] leading-[1.08] font-semibold tracking-[-0.02em] text-zinc-50 md:text-[52px]">
            Every Ayurveda trial. One auditable truth.
          </h1>
          <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-zinc-400">
            AryaSetu is a real-time, cloud-based, GCP-ASU compliant Clinical Trial Management
            System for the All India Institute of Ayurveda — unifying trial execution, NPvCC
            pharmacovigilance, CTRI/NDCT 2019 regulatory timelines and CDISC/FHIR
            interoperability in a single role-aware platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/login" className="btn">Enter live demo <ArrowRight size={14} /></Link>
            <a href="#docs" className="btn-outline">Read documentation</a>
          </div>
          <p className="mt-6 font-mono2 text-[10.5px] tracking-wider text-zinc-600 uppercase">
            SYS 03-OCT-2026 15:00 IST · 12 studies · 8 sites · 1 statutory clock active · audit chain verified
          </p>
        </div>

        <div className="border-t border-[#1c1c20]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {metrics.map((m, i) => (
              <div key={m.label} className={`px-6 py-5 ${i > 0 ? "border-l border-[#1c1c20]" : ""}`}>
                <p className="num text-[26px] font-semibold text-zinc-50">{m.value}</p>
                <p className="section-label mt-1.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1c1c20] py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-2 px-6">
          <span className="section-label mr-2">Aligned to</span>
          {badges.map((b) => (
            <span key={b} className="rounded-[4px] border border-[#2d2d33] px-2.5 py-1 font-mono2 text-[10px] tracking-wider text-zinc-500">
              {b}
            </span>
          ))}
        </div>
      </section>

      <section id="platform" className="border-b border-[#1c1c20]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="section-label">Platform</p>
          <h2 className="mt-2 max-w-2xl text-[26px] font-semibold tracking-tight text-zinc-50">
            Four modules. One source of truth for Ayurveda clinical research.
          </h2>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-zinc-500">
            Today, study status, recruitment, safety and compliance are tracked across spreadsheets
            and disconnected tools. AryaSetu replaces that with one real-time system — evaluable on
            data integrity, safety-reporting timeliness, interoperability and audit completeness.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-[#222226] bg-[#222226] md:grid-cols-2 xl:grid-cols-4">
            {modules.map((m) => (
              <div key={m.code} className="bg-[#121214] p-5">
                <p className="font-mono2 text-[11px] text-zinc-600">{m.code}</p>
                <h3 className="mt-2 text-[15px] font-semibold text-zinc-100">{m.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">{m.desc}</p>
                <ul className="mt-4 space-y-2 border-t border-[#1c1c20] pt-4">
                  {m.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-400">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-emerald-500" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="border-b border-[#1c1c20]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="section-label">Access model</p>
          <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-zinc-50">Strictly role-based. Study-level access control.</h2>
          <div className="mt-8 overflow-hidden rounded-md border border-[#222226]">
            {roles.map(([role, desc], i) => (
              <div key={role} className={`flex items-baseline justify-between gap-6 px-5 py-3.5 ${i > 0 ? "border-t border-[#1c1c20]" : ""} ${i % 2 === 0 ? "bg-[#121214]" : "bg-[#0f0f11]"}`}>
                <span className="text-[13px] font-medium text-zinc-200">{role}</span>
                <span className="text-right text-[12px] text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-[11.5px] leading-relaxed text-zinc-600">
            UI hiding is not security. Every route is permission-checked against role and study
            membership; every check, grant and denial is written to the audit chain.
          </p>
        </div>
      </section>

      <section id="docs" className="border-b border-[#1c1c20] bg-[#0d0d0f]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="section-label">Documentation</p>
          <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-zinc-50">Everything a judge, auditor or site needs.</h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-[#222226] bg-[#222226] md:grid-cols-3">
            {docColumns.map((col) => (
              <div key={col.title} className="bg-[#121214] p-5">
                <h3 className="text-[13.5px] font-semibold text-zinc-100">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 border-t border-[#1c1c20] pt-4">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="group flex cursor-pointer items-center gap-2 text-[12.5px] text-zinc-400 hover:text-zinc-100">
                        <ArrowUpRight size={11} className="text-zinc-600 group-hover:text-emerald-400" />
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-md border border-[#222226] bg-[#121214] px-6 py-10 text-center">
            <h2 className="text-[22px] font-semibold tracking-tight text-zinc-50">See the whole portfolio move in real time.</h2>
            <p className="mx-auto mt-2 max-w-lg text-[13px] text-zinc-500">
              Twelve studies, eight sites, one live safety event and a running statutory clock — all on synthetic data.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="btn">Launch live demo <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1c1c20] bg-[#0d0d0f]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-6 py-7 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-emerald-500/15 text-emerald-400">
              <Activity size={13} />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-zinc-200">ARYASETU</p>
              <p className="text-[9.5px] tracking-wider text-zinc-600 uppercase">SIH26046 · Ministry of Ayush · AIIA</p>
            </div>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-zinc-600">
            Clinical-trial data is sensitive personal data. This demonstration uses synthetic,
            de-identified datasets only; MedDRA/WHODrug appear as demonstration dictionaries.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-zinc-500">
            <a href="#platform" className="hover:text-zinc-200">Platform</a>
            <a href="#docs" className="hover:text-zinc-200">Docs</a>
            <Link href="/login" className="hover:text-zinc-200">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
