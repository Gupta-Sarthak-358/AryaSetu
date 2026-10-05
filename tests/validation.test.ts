import { describe, expect, it } from "vitest";
import { assertSameOrigin, HttpError } from "@/lib/server/auth";
import { nextAeId, nextDeviationId, nextQueryId, nextSaeId } from "@/lib/server/repo";
import { ensureBoot } from "@/lib/server/boot";

describe("assertSameOrigin", () => {
  const req = (headers: Record<string, string>) => new Request("http://localhost:3100/api/x", { headers });

  it("passes same-origin requests", () => {
    expect(() => assertSameOrigin(req({ origin: "http://localhost:3100", host: "localhost:3100" }))).not.toThrow();
  });

  it("passes requests without origin (same-origin fetch/S2S)", () => {
    expect(() => assertSameOrigin(req({ host: "localhost:3100" }))).not.toThrow();
  });

  it("rejects cross-origin mutation attempts with 403", () => {
    try {
      assertSameOrigin(req({ origin: "https://evil.example", host: "localhost:3100" }));
      expect.unreachable("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(403);
    }
  });
});

describe("id generators", () => {
  it("produce well-formed, increasing ids from seeded data", async () => {
    await ensureBoot();
    const [ae, sae, q, d] = await Promise.all([nextAeId(), nextSaeId(), nextQueryId(), nextDeviationId()]);
    expect(ae).toMatch(/^AE-\d+$/);
    expect(sae).toMatch(/^SAE-2026-0\d+$/);
    expect(q).toMatch(/^DQ-\d{4}$/);
    expect(d).toMatch(/^DV-\d{4}$/);
    expect(parseInt(ae.replace("AE-", ""), 10)).toBeGreaterThanOrEqual(1042);
  });
});
