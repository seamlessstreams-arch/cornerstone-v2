import { describe, it, expect } from "vitest";
import {
  shouldProtect, sensitivityRank, sensitivityLabel, maxSensitivity, isIdleLocked,
  PROTECTED_SENSITIVITIES, IDLE_LOCK_OPTIONS,
} from "../screen-protection";

describe("shouldProtect", () => {
  it("protects restricted/confidential/safeguarding/highly_restricted", () => {
    for (const s of ["restricted", "confidential", "safeguarding", "highly_restricted"]) {
      expect(shouldProtect(s)).toBe(true);
    }
  });
  it("does not protect public/internal or empty", () => {
    expect(shouldProtect("public")).toBe(false);
    expect(shouldProtect("internal")).toBe(false);
    expect(shouldProtect(null)).toBe(false);
    expect(shouldProtect(undefined)).toBe(false);
    expect(shouldProtect("")).toBe(false);
  });
  it("matches the exported set", () => {
    expect(PROTECTED_SENSITIVITIES.has("confidential")).toBe(true);
    expect(PROTECTED_SENSITIVITIES.has("public")).toBe(false);
  });
});

describe("sensitivity ranking + labels", () => {
  it("ranks ascending by sensitivity", () => {
    expect(sensitivityRank("public")).toBeLessThan(sensitivityRank("internal"));
    expect(sensitivityRank("internal")).toBeLessThan(sensitivityRank("restricted"));
    expect(sensitivityRank("restricted")).toBeLessThan(sensitivityRank("confidential"));
    expect(sensitivityRank("confidential")).toBeLessThan(sensitivityRank("safeguarding"));
    expect(sensitivityRank("highly_restricted")).toBe(sensitivityRank("safeguarding"));
    expect(sensitivityRank("nonsense")).toBe(0);
  });
  it("labels known + falls back to Sensitive", () => {
    expect(sensitivityLabel("safeguarding")).toBe("Safeguarding");
    expect(sensitivityLabel("highly_restricted")).toBe("Highly restricted");
    expect(sensitivityLabel("weird")).toBe("Sensitive");
  });
  it("maxSensitivity returns the more sensitive token", () => {
    expect(maxSensitivity("public", "confidential")).toBe("confidential");
    expect(maxSensitivity("safeguarding", "internal")).toBe("safeguarding");
    expect(maxSensitivity(null, "restricted")).toBe("restricted");
  });
});

describe("isIdleLocked", () => {
  it("never locks when disabled (0)", () => {
    expect(isIdleLocked(0, 10_000_000, 0)).toBe(false);
  });
  it("locks only once idle threshold is exceeded", () => {
    const last = 1_000_000;
    expect(isIdleLocked(last, last + 60_000, 120)).toBe(false); // 60s < 120s
    expect(isIdleLocked(last, last + 120_000, 120)).toBe(true); // exactly 120s
    expect(isIdleLocked(last, last + 300_000, 120)).toBe(true);
  });
  it("offers an Off option and sensible intervals", () => {
    expect(IDLE_LOCK_OPTIONS.some((o) => o.seconds === 0)).toBe(true);
    expect(IDLE_LOCK_OPTIONS.some((o) => o.seconds === 120)).toBe(true);
  });
});
