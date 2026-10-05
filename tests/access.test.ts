import { beforeAll, describe, expect, it } from "vitest";
import { ensureBoot } from "@/lib/server/boot";
import { assertStudyAccess, type SessionUser } from "@/lib/server/auth";

beforeAll(async () => {
  await ensureBoot();
});

const allUser: SessionUser = {
  id: "U-001",
  name: "Admin",
  designation: "d",
  org: "o",
  email: "admin@aryasetu.in",
  role: "Admin",
  studies: ["ALL"],
};

const scopedUser: SessionUser = {
  id: "U-002",
  name: "PI",
  designation: "d",
  org: "o",
  email: "pi@aryasetu.in",
  role: "PI",
  studies: ["AYU-024", "AYU-036", "AYU-050"],
};

describe("study access control", () => {
  it("ALL-scope user opens any study including CTRI imports", async () => {
    await expect(assertStudyAccess(allUser, "AYU-024")).resolves.toBeUndefined();
    await expect(assertStudyAccess(allUser, "CTRI-064321")).resolves.toBeUndefined();
  });

  it("scoped user opens member studies only", async () => {
    await expect(assertStudyAccess(scopedUser, "AYU-036")).resolves.toBeUndefined();
    await expect(assertStudyAccess(scopedUser, "AYU-031")).rejects.toThrow("No membership");
    await expect(assertStudyAccess(scopedUser, "CTRI-064321")).rejects.toThrow("No membership");
  });
});
