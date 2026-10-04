import { describe, expect, it } from "vitest";
import { countdown, fakeHash, fmtNum, pct } from "@/lib/utils";

describe("utils", () => {
  it("pct computes rounded percentages with zero guard", () => {
    expect(pct(1528, 2360)).toBe(65);
    expect(pct(1, 0)).toBe(0);
  });

  it("fmtNum formats en-IN grouping", () => {
    expect(fmtNum(1528)).toBe("1,528");
  });

  it("countdown computes signed HH:MM and overdue flag", () => {
    const future = countdown("2026-10-05T00:00:00Z", "2026-10-04T18:00:00Z");
    expect(future.text).toBe("06:00");
    expect(future.overdue).toBe(false);
    const past = countdown("2026-10-04T00:00:00Z", "2026-10-04T06:30:00Z");
    expect(past.text).toBe("-06:30");
    expect(past.overdue).toBe(true);
  });

  it("fakeHash is deterministic and hex", () => {
    const a = fakeHash("SAE-2026-041|initial");
    const b = fakeHash("SAE-2026-041|initial");
    const c = fakeHash("SAE-2026-041|changed");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[0-9a-f]{40}$/);
  });
});
