import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const sections = [
  {
    title: "Start here",
    items: [
      { href: "/docs/platform-overview", label: "Platform overview", desc: "What AryaSetu is and why it exists" },
      { href: "/docs/quick-start", label: "10-minute quick start", desc: "Sign in and walk the demo" },
      { href: "/docs/demo-walkthrough", label: "Demo walkthrough", desc: "The judge tour, stop by stop" },
      { href: "/docs/synthetic-data-policy", label: "Synthetic data policy", desc: "What is real, what is mocked" },
    ],
  },
  {
    title: "For trial staff",
    items: [
      { href: "/docs/role-guides", label: "Guides for all 7 roles", desc: "PI, Coordinator, Monitor, Ethics, PV, Admin, Regulator" },
      { href: "/docs/kpi-alerts", label: "KPI and alert setup", desc: "How the rule engine computes alerts" },
      { href: "/docs/fhir-reference", label: "FHIR R4 reference", desc: "Live endpoints and resource coverage" },
      { href: "/docs/batch-traceability", label: "Batch traceability notes", desc: "Lot → site → participant → AE" },
    ],
  },
  {
    title: "For reviewers",
    items: [
      { href: "/docs/gcp-asu-map", label: "GCP-ASU alignment map", desc: "Which controls implement which guideline" },
      { href: "/docs/ndct-timelines", label: "NDCT 2019 SAE timelines", desc: "The full statutory chain, with sources" },
      { href: "/docs/dpdp-controls", label: "DPDP privacy controls", desc: "Consent, purpose limitation, minimisation" },
      { href: "/docs/ctri-checklist", label: "CTRI reporting checklist", desc: "Registration and update requirements" },
    ],
  },
];

export default function DocsHome() {
  return (
    <div>
      <p className="font-mono2 text-[11px] tracking-[0.16em] text-[#2D5A3D] uppercase">Documentation</p>
      <h1 className="display mt-2 text-[34px] font-medium">Read the platform before you open it.</h1>
      <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-[#4A5A4F]">
        Every guide below is public — no sign-in needed. The app itself is a separate,
        role-gated workspace.
      </p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="flex items-center gap-2 text-[15px] font-semibold"><BookOpen size={14} className="text-[#2D5A3D]" /> {s.title}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {s.items.map((i) => (
                <Link key={i.href} href={i.href} className="panel card-hover p-4 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-[#1C2A21]">{i.label}</span>
                    <ArrowRight size={13} className="text-[#7A887D] group-hover:text-[#2D5A3D] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="mt-1 text-[12px] text-[#4A5A4F]">{i.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
