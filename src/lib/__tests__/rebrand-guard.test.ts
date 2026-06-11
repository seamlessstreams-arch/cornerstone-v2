// ══════════════════════════════════════════════════════════════════════════════
// CARA OS — REBRAND GUARD (vitest wrapper)
//
// Runs scripts/check-rebrand.js inside the test suite so CI fails if any
// user-facing legacy brand term reappears. See that script for the rules and
// the list of internal identifiers that intentionally keep legacy names.
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";

describe("rebrand guard", () => {
  // Walks the whole src/public/docs tree — needs more than the 5s default.
  it("source contains no user-facing legacy brand terms", { timeout: 60000 }, () => {
    const script = path.join(process.cwd(), "scripts", "check-rebrand.js");
    let output = "";
    let failed = false;
    try {
      output = execFileSync("node", [script], { encoding: "utf8" });
    } catch (err) {
      failed = true;
      const e = err as { stdout?: string; stderr?: string };
      output = `${e.stdout ?? ""}\n${e.stderr ?? ""}`;
    }
    expect(failed, `check-rebrand reported violations:\n${output}`).toBe(false);
    expect(output).toContain("Rebrand check passed");
  });
});
