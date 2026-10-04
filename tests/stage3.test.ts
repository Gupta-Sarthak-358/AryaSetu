import { describe, expect, it } from "vitest";
import { cohensKappa } from "@/lib/kappa";
import { computeSignalStats } from "@/lib/server/signal";
import { buildAdamAdsl, buildSdtmAe, buildSdtmDm } from "@/lib/server/exports";
import { adverseEvents } from "@/lib/data/safety";
import { studies } from "@/lib/data/studies";
import { namasteFor } from "@/lib/data/namaste";

describe("cohensKappa", () => {
  it("returns 1 for perfect agreement", () => {
    const rows = Array.from({ length: 10 }, () => ({ a: "Vata", b: "Vata" }));
    expect(cohensKappa(rows)).toBe(1);
  });

  it("returns 0 for chance-level agreement on balanced disagreement", () => {
    const rows = [
      { a: "Vata", b: "Vata" },
      { a: "Pitta", b: "Pitta" },
      { a: "Vata", b: "Pitta" },
      { a: "Pitta", b: "Vata" },
    ];
    expect(cohensKappa(rows)).toBeCloseTo(0, 5);
  });
});

describe("signal disproportionality", () => {
  it("computes ROR/PRR/chi2 from a 2x2 table", () => {
    const { ror, prr, chi2 } = computeSignalStats(3, 1, 1, 20);
    expect(ror).toBeGreaterThan(2);
    expect(prr).toBeGreaterThan(1);
    expect(chi2).toBeGreaterThan(0);
  });

  it("applies continuity correction on zero cells", () => {
    const { ror } = computeSignalStats(2, 0, 5, 18);
    expect(Number.isFinite(ror)).toBe(true);
  });
});

describe("export builders", () => {
  it("builds SDTM AE with one row per AE and required columns", () => {
    const out = buildSdtmAe(adverseEvents);
    const lines = out.split("\n");
    expect(lines.length).toBe(adverseEvents.length + 1);
    expect(lines[0]).toContain("AETERM");
    expect(lines[0]).toContain("BATCHID");
    expect(out).toContain("SAE-2026-041".split("-").length ? "B-1142" : "");
  });

  it("builds SDTM DM with PRAKRITI column", () => {
    const out = buildSdtmDm(studies.slice(0, 1));
    expect(lines0(out)).toContain("PRAKRITI");
    expect(out.split("\n").length).toBeGreaterThan(1);
  });

  it("builds ADaM ADSL with safety flags", () => {
    const out = buildAdamAdsl(studies.slice(0, 1));
    expect(out).toContain("SAFFL");
  });
});

function lines0(s: string) {
  return s.split("\n")[0];
}

describe("NAMASTE draft mapping", () => {
  it("resolves indication terms to dual codes", () => {
    expect(namasteFor("Generalized anxiety disorder (Chittodvega)")?.namasteCode).toBeDefined();
    expect(namasteFor("Knee osteoarthritis (Janu Sandhigata Vata)")?.tm2Code).toBeDefined();
    expect(namasteFor("unrelated condition")).toBeUndefined();
  });
});
