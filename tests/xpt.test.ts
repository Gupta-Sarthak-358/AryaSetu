import { describe, expect, it } from "vitest";
import { buildXpt, fromIbmFloat, toIbmFloat, type XptVar } from "@/lib/server/xpt";

describe("IBM 370 float conversion", () => {
  it("round-trips values", () => {
    for (const v of [0, 1, -1, 7, 3.14159, 1528, 0.31, -42.5, 1000000]) {
      const back = fromIbmFloat(toIbmFloat(v));
      expect(Math.abs(back - v)).toBeLessThan(Math.max(1e-6, Math.abs(v) * 1e-9));
    }
  });

  it("encodes 1.0 with exponent 65 and 0x10 fraction lead", () => {
    const b = toIbmFloat(1);
    expect(b[0]).toBe(65);
    expect(b[1]).toBe(0x10);
  });
});

describe("SAS Transport v5 writer", () => {
  const vars: XptVar[] = [
    { name: "STUDYID", label: "Study", type: "char", len: 10 },
    { name: "AGE", label: "Age", type: "num", len: 8 },
  ];

  const HEADER_RECORDS = 8;

  it("emits correct header structure and row length", () => {
    const buf = buildXpt("DM", "Demo", vars, [["AYU-024", 34], ["AYU-024", 58]]);
    expect(buf.subarray(0, 48).toString("ascii")).toBe("HEADER RECORD*******LIBRARY HEADER RECORD!!!!!!!");
    expect(buf.subarray(80, 88).toString("ascii")).toBe("SAS     ");
    const obsIdx = HEADER_RECORDS * 80 + vars.length * 140;
    expect(buf.subarray(obsIdx, obsIdx + 48).toString("ascii")).toBe("HEADER RECORD*******OBS     HEADER RECORD!!!!!!!");
    const rowLen = vars.reduce((a, v) => a + v.len, 0);
    expect(buf.length).toBe(obsIdx + 80 + 2 * rowLen);
  });

  it("round-trips numeric cells from data section", () => {
    const buf = buildXpt("DM", "Demo", vars, [["AYU-024", 34], ["AYU-024", 58]]);
    const dataStart = HEADER_RECORDS * 80 + vars.length * 140 + 80;
    const rowLen = 18;
    const row1 = buf.subarray(dataStart, dataStart + rowLen);
    expect(row1.subarray(0, 10).toString("ascii").trim()).toBe("AYU-024");
    expect(fromIbmFloat(row1.subarray(10, 18))).toBe(34);
    const row2 = buf.subarray(dataStart + rowLen, dataStart + 2 * rowLen);
    expect(fromIbmFloat(row2.subarray(10, 18))).toBe(58);
  });

  it("namestr declares numeric type 1 and char type 2 big-endian", () => {
    const buf = buildXpt("DM", "Demo", vars, [["AYU-024", 34]]);
    const firstNamestr = buf.subarray(HEADER_RECORDS * 80, HEADER_RECORDS * 80 + 140);
    expect(firstNamestr.readInt16BE(0)).toBe(2);
    const secondNamestr = buf.subarray(HEADER_RECORDS * 80 + 140, HEADER_RECORDS * 80 + 280);
    expect(secondNamestr.readInt16BE(0)).toBe(1);
    expect(secondNamestr.readInt32BE(84)).toBe(10);
  });
});
