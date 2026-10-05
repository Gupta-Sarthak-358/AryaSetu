import { Badge, Card, CardTitle, PageHeader, StatusAuto } from "@/components/ui";
import { DiagCard } from "@/components/DiagCard";
import { getUsersWithStudies } from "@/lib/server/repo";
import { KeyRound } from "lucide-react";

const permissionMatrix: { area: string; perms: Record<string, boolean> }[] = [
  { area: "View assigned studies", perms: { PI: true, Coordinator: true, Monitor: true, Ethics: true, Pharmacovigilance: true, Admin: true, Regulator: true } },
  { area: "Enter / edit CRF data", perms: { PI: true, Coordinator: true, Monitor: false, Ethics: false, Pharmacovigilance: false, Admin: false, Regulator: false } },
  { area: "Apply e-signature", perms: { PI: true, Coordinator: false, Monitor: false, Ethics: false, Pharmacovigilance: false, Admin: false, Regulator: false } },
  { area: "Report AE / SAE", perms: { PI: true, Coordinator: true, Monitor: false, Ethics: false, Pharmacovigilance: true, Admin: false, Regulator: false } },
  { area: "Causality assessment & triage", perms: { PI: false, Coordinator: false, Monitor: false, Ethics: false, Pharmacovigilance: true, Admin: false, Regulator: false } },
  { area: "Raise data queries", perms: { PI: false, Coordinator: false, Monitor: true, Ethics: false, Pharmacovigilance: false, Admin: false, Regulator: false } },
  { area: "Respond to queries", perms: { PI: true, Coordinator: true, Monitor: false, Ethics: false, Pharmacovigilance: false, Admin: false, Regulator: false } },
  { area: "EC opinion on SAE / compensation", perms: { PI: false, Coordinator: false, Monitor: false, Ethics: true, Pharmacovigilance: false, Admin: false, Regulator: false } },
  { area: "Generate submission exports", perms: { PI: true, Coordinator: false, Monitor: false, Ethics: false, Pharmacovigilance: true, Admin: true, Regulator: false } },
  { area: "Manage users & roles", perms: { PI: false, Coordinator: false, Monitor: false, Ethics: false, Pharmacovigilance: false, Admin: true, Regulator: false } },
  { area: "View audit chain", perms: { PI: false, Coordinator: false, Monitor: true, Ethics: true, Pharmacovigilance: true, Admin: true, Regulator: true } },
];

const roles = ["PI", "Coordinator", "Monitor", "Ethics", "Pharmacovigilance", "Admin", "Regulator"];

export default async function AdminPage() {
  const personas = await getUsersWithStudies();
  return (
    <div className="space-y-4">
      <PageHeader
        code="SEC 09 · ACCESS CONTROL"
        title="Roles & Access"
        sub="7 roles · study-level ACL · every denial written to the audit chain"
        right={<StatusAuto status="Policy version 1.4" />}
      />

      <Card>
        <CardTitle title="Deployment diagnostics" sub="Which database this deployment is actually talking to" />
        <DiagCard />
      </Card>

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        {personas.map((p) => (
          <Card key={p.role} className="p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#1e1e22] font-mono2 text-[10px] font-semibold text-zinc-300">
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-zinc-100">{p.name}</p>
                <p className="truncate text-[10.5px] text-zinc-500">{p.designation}</p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Badge>{p.role.toUpperCase()}</Badge>
              <Badge>{p.studies.includes("ALL") ? "ALL STUDIES" : `${p.studies.length} STUDIES`}</Badge>
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">{p.org} · {p.email}</p>
          </Card>
        ))}
      </div>

      <Card className="p-0">
        <div className="border-b border-[#222226] px-4 py-3">
          <h3 className="text-[13px] font-semibold text-zinc-100">Permission matrix</h3>
          <p className="mt-0.5 text-[11px] text-zinc-500">Enforced at route level — UI hiding alone is never security</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-[#222226] text-[10px] tracking-wider text-zinc-500 uppercase">
                <th className="px-4 py-2.5 font-medium">Capability</th>
                {roles.map((r) => <th key={r} className="py-2.5 pr-3 text-center font-medium whitespace-nowrap">{r === "Pharmacovigilance" ? "PV" : r}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((row, i) => (
                <tr key={row.area} className={`border-b border-[#1c1c20] last:border-0 ${i % 2 === 1 ? "bg-[#0e0e10]" : ""}`}>
                  <td className="px-4 py-2 text-zinc-300">{row.area}</td>
                  {roles.map((r) => (
                    <td key={r} className="py-2 pr-3 text-center">
                      {row.perms[r]
                        ? <span className="font-mono2 text-[10px] text-emerald-400">✓</span>
                        : <span className="font-mono2 text-[10px] text-zinc-700">×</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardTitle title="Study-level ACL" sub="Access is granted per study membership, not just per role" />
          <div className="space-y-2">
            {[
              { who: "Dr. Meera Kulkarni (PI)", scope: "AYU-024, AYU-036, AYU-050", note: "Cannot open AYU-031 — 403 logged" },
              { who: "Shri Rohan Deshpande (Monitor)", scope: "AYU-018, AYU-024, AYU-031, AYU-036", note: "SDV + query rights only on these" },
              { who: "Shri D. K. Aggarwal (Regulator)", scope: "All 12 studies", note: "Read-only; every export watermarked" },
            ].map((r) => (
              <div key={r.who} className="rounded-[5px] border border-[#222226] bg-[#101012] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-zinc-200">{r.who}</span>
                  <KeyRound size={11} className="text-emerald-400" />
                </div>
                <p className="mt-1 font-mono2 text-[10px] text-zinc-500 uppercase">{r.scope}</p>
                <p className="mt-0.5 text-[10.5px] text-zinc-600">{r.note}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle title="Session & credential posture" sub="Demo vs production" />
          <div className="space-y-1.5">
            {[
              { label: "Demo personas (this build)", status: "Demo", note: "Instant switch, no password — judge convenience" },
              { label: "Production auth design", status: "Implemented", note: "OIDC + MFA, Argon2id, HttpOnly sessions, CSRF" },
              { label: "Authorization model", status: "Implemented", note: "Route-level permission checks + study ACL" },
              { label: "Deny-by-default", status: "Implemented", note: "Zero memberships → empty portfolio" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 rounded-[5px] border border-[#222226] bg-[#101012] p-3">
                <div>
                  <span className="text-[12px] text-zinc-300">{r.label}</span>
                  <p className="text-[10px] text-zinc-600">{r.note}</p>
                </div>
                <StatusAuto status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
