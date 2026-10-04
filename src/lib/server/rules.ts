import { getAdverseEvents, getDataQueries, getSaes, getStudies } from "./repo";
import type { AdverseEvent, Alert } from "../types";

const DAY = 86400_000;
const HEPATIC_PATTERN = /hepatic|aminotransferase|bilirubin|ALT|AST/i;

export async function evaluateRules(): Promise<Alert[]> {
  const [saes, studies, aes, queries] = await Promise.all([getSaes(), getStudies(), getAdverseEvents(), getDataQueries()]);
  const now = Date.now();
  const alerts: Alert[] = [];
  let n = 0;
  const nextId = () => `R-${String(++n).padStart(2, "0")}`;

  for (const sae of saes.filter((s) => s.status === "Open")) {
    const due = new Date(sae.initialDueAt).getTime();
    const overdue = due < now;
    alerts.push({
      id: nextId(),
      severity: "critical",
      title: `${sae.id} — initial report ${overdue ? "OVERDUE" : "clock running"} (NDCT 24h rule)`,
      studyId: sae.studyId,
      ts: new Date(now).toISOString(),
      action: "Open SAE workspace",
      href: `/safety/${sae.id}`,
    });
  }

  for (const s of studies.filter((s) => s.ctriStatus === "Update Due")) {
    alerts.push({
      id: nextId(),
      severity: "warning",
      title: `CTRI six-monthly update overdue — ${s.ctriNumber}`,
      studyId: s.id,
      ts: new Date(now).toISOString(),
      action: "Open CTRI tracker",
      href: "/regulatory",
    });
  }

  for (const s of studies.filter((s) => new Date(s.iecExpiry).getTime() - now < 45 * DAY)) {
    const days = Math.ceil((new Date(s.iecExpiry).getTime() - now) / DAY);
    alerts.push({
      id: nextId(),
      severity: "warning",
      title: `IEC approval for ${s.id} expires in ${days} days`,
      studyId: s.id,
      ts: new Date(now).toISOString(),
      action: "View regulatory",
      href: "/regulatory",
    });
  }

  const byBatch = new Map<string, AdverseEvent[]>();
  for (const ae of aes.filter((a) => a.batchId && HEPATIC_PATTERN.test(a.term + " " + a.meddraPt))) {
    const list = byBatch.get(ae.batchId!) ?? [];
    list.push(ae);
    byBatch.set(ae.batchId!, list);
  }
  for (const [batchId, events] of byBatch) {
    const in30d = events.filter((e) => now - new Date(e.reported).getTime() < 30 * DAY);
    if (in30d.length >= 3) {
      alerts.push({
        id: nextId(),
        severity: "warning",
        title: `Batch ${batchId} hepatic AE cluster threshold met (${in30d.length} in 30d)`,
        studyId: events[0].studyId,
        ts: new Date(now).toISOString(),
        action: "Open batch trace",
        href: "/batches",
      });
    }
  }

  const aged = queries.filter((q) => q.status === "Open" && q.ageDays > 14);
  const open = queries.filter((q) => q.status === "Open");
  if (open.length > 0) {
    alerts.push({
      id: nextId(),
      severity: "info",
      title: `${open.length} data queries open portfolio-wide; ${aged.length} aged > 14 days`,
      studyId: null,
      ts: new Date(now).toISOString(),
      action: "Open data quality",
      href: "/studies",
    });
  }

  return alerts;
}
