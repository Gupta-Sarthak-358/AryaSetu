export interface PairedRating {
  a: string;
  b: string;
}

export function cohensKappa(ratings: PairedRating[]): number {
  const n = ratings.length;
  if (n === 0) return 0;
  const cats = [...new Set([...ratings.map((r) => r.a), ...ratings.map((r) => r.b)])];
  const observed = ratings.filter((r) => r.a === r.b).length / n;
  let expected = 0;
  for (const c of cats) {
    const pa = ratings.filter((r) => r.a === c).length / n;
    const pb = ratings.filter((r) => r.b === c).length / n;
    expected += pa * pb;
  }
  if (expected === 1) return 1;
  return (observed - expected) / (1 - expected);
}
