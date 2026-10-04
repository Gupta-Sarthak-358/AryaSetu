import { getAdverseEvents } from "./repo";

export interface SignalRow {
  product: string;
  event: string;
  a: number;
  ror: number;
  prr: number;
  chi2: number;
  signal: boolean;
}

export function computeSignalStats(a: number, b: number, c: number, d: number) {
  const safe = (x: number) => (x === 0 ? 0.5 : x);
  const ror = (safe(a) / safe(b)) / (safe(c) / safe(d));
  const prr = (safe(a) / (safe(a) + safe(b))) / (safe(c) / (safe(c) + safe(d)));
  const n = a + b + c + d;
  const chi2 = n > 0 ? (n * Math.pow(a * d - b * c, 2)) / ((a + b) * (c + d) * (a + c) * (b + d) + 1e-9) : 0;
  return { ror, prr, chi2 };
}

export async function computeSignalRows(): Promise<SignalRow[]> {
  const aes = await getAdverseEvents();
  const products = [...new Set(aes.map((a) => a.whodrug))];
  const events = [...new Set(aes.map((a) => a.meddraPt))];

  const rows: SignalRow[] = [];
  for (const product of products) {
    const drugAes = aes.filter((x) => x.whodrug === product);
    for (const event of events) {
      const a = drugAes.filter((x) => x.meddraPt === event).length;
      if (a === 0) continue;
      const b = drugAes.length - a;
      const c = aes.filter((x) => x.whodrug !== product && x.meddraPt === event).length;
      const d = aes.length - a - b - c;
      const { ror, prr, chi2 } = computeSignalStats(a, b, c, d);
      rows.push({
        product,
        event,
        a,
        ror: Math.round(ror * 10) / 10,
        prr: Math.round(prr * 10) / 10,
        chi2: Math.round(chi2 * 100) / 100,
        signal: a >= 3 && ror >= 2,
      });
    }
  }
  return rows.sort((x, y) => y.ror - x.ror);
}
