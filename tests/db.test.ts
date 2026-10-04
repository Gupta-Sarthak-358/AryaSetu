import { beforeAll, describe, expect, it } from "vitest";
import { ensureBoot } from "@/lib/server/boot";
import { verifyChain } from "@/lib/server/audit";
import { getStudies } from "@/lib/server/repo";
import { evaluateRules } from "@/lib/server/rules";
import { getDb } from "@/lib/server/db";

beforeAll(async () => {
  await ensureBoot();
});

describe("database boot + seed", () => {
  it("seeds 12 studies", async () => {
    const studies = await getStudies();
    expect(studies).toHaveLength(12);
  });

  it("audit chain verifies after boot", async () => {
    const result = await verifyChain();
    expect(result.valid).toBe(true);
    expect(result.count).toBeGreaterThanOrEqual(2);
  });
});

describe("audit chain tamper evidence", () => {
  it("detects a direct database edit and names the broken record", async () => {
    const db = getDb();
    const client = (db as unknown as { $client: { query: (sql: string) => Promise<unknown> } }).$client;
    await client.query("UPDATE audit_events SET action = 'TAMPERED' WHERE seq = 1");
    const result = await verifyChain();
    expect(result.valid).toBe(false);
    expect(result.brokenAt).toBe(1);
  });
});

describe("rule engine", () => {
  it("computes alerts from live data, not seed", async () => {
    const alerts = await evaluateRules();
    const sae = alerts.find((a) => a.severity === "critical" && a.title.includes("SAE-2026-041"));
    expect(sae).toBeDefined();
    const cluster = alerts.find((a) => a.title.includes("B-1142") && a.title.includes("cluster"));
    expect(cluster).toBeDefined();
    expect(cluster?.severity).toBe("warning");
  });
});
