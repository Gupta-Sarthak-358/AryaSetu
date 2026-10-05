import { getAdverseEvents, getBatches } from "./repo";

export interface ExposureRow {
  product: string;
  batchIds: string[];
  dosed: number;
  personYears: number;
  events: number;
  serious: number;
  ratePer1000PY: number;
  ciLow: number;
  ciHigh: number;
}

function poissonCI(k: number, py: number): [number, number] {
  if (k === 0 || py <= 0) return [0, 0];
  const rate = k / py;
  const se = Math.sqrt(k) / py;
  return [Math.max(0, rate - 1.96 * se), rate + 1.96 * se];
}

export async function computeExposureRows(): Promise<ExposureRow[]> {
  const [batches, aes] = await Promise.all([getBatches(), getAdverseEvents()]);
  const now = Date.now();
  const byProduct = new Map<string, { batchIds: Set<string>; dosed: number; personYears: number; events: number; serious: number }>();

  for (const b of batches) {
    const key = b.product;
    const entry = byProduct.get(key) ?? { batchIds: new Set<string>(), dosed: 0, personYears: 0, events: 0, serious: 0 };
    entry.batchIds.add(b.id);
    for (const p of b.participantsDosed) {
      entry.dosed += 1;
      entry.personYears += Math.max(0, now - new Date(p.firstDose).getTime()) / (365.25 * 86400_000);
    }
    byProduct.set(key, entry);
  }

  for (const ae of aes) {
    if (!ae.batchId) continue;
    const batch = batches.find((b) => b.id === ae.batchId);
    if (!batch) continue;
    const entry = byProduct.get(batch.product);
    if (!entry) continue;
    entry.events += 1;
    if (ae.seriousness === "Serious") entry.serious += 1;
  }

  return [...byProduct.entries()]
    .map(([product, e]) => {
      const rate = e.personYears > 0 ? (e.events / e.personYears) * 1000 : 0;
      const [lo, hi] = poissonCI(e.events, e.personYears);
      return {
        product,
        batchIds: [...e.batchIds],
        dosed: e.dosed,
        personYears: Math.round(e.personYears * 100) / 100,
        events: e.events,
        serious: e.serious,
        ratePer1000PY: Math.round(rate * 10) / 10,
        ciLow: Math.round(lo * 1000 * 10) / 10,
        ciHigh: Math.round(hi * 1000 * 10) / 10,
      };
    })
    .sort((a, b) => b.ratePer1000PY - a.ratePer1000PY);
}
