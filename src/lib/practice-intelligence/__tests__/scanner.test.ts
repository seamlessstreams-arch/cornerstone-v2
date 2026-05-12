import { describe, it, expect, vi } from "vitest";

// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE INTELLIGENCE — SCANNER SERVICE TESTS
// ══════════════════════════════════════════════════════════════════════════════

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => null),
}));

import {
  runPracticeIntelligenceScan,
  getLatestScan,
  listScans,
} from "../scanner.service";

describe("runPracticeIntelligenceScan (demo mode)", () => {
  it("returns a scan result", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(scan).not.toBeNull();
    expect(scan.id).toBeDefined();
  });

  it("scan has home_id and scan_date", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(scan.home_id).toBeDefined();
    expect(scan.scan_date).toBeDefined();
  });

  it("scan has status 'completed'", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(scan.status).toBe("completed");
  });

  it("scan contains child_summaries array", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.child_summaries)).toBe(true);
    expect(scan.child_summaries.length).toBeGreaterThan(0);
  });

  it("each child summary has required fields", async () => {
    const scan = await runPracticeIntelligenceScan();
    for (const cs of scan.child_summaries) {
      expect(cs.child_id).toBeDefined();
      expect(cs.child_name).toBeDefined();
      expect(cs).toHaveProperty("recent_incidents");
      expect(cs).toHaveProperty("overall_presentation");
      expect(cs).toHaveProperty("risk_level");
    }
  });

  it("scan contains risk_patterns array", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.risk_patterns)).toBe(true);
  });

  it("scan contains practice_drift_alerts array", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.practice_drift_alerts)).toBe(true);
  });

  it("scan contains training_need_alerts array", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.training_need_alerts)).toBe(true);
  });

  it("scan contains oversight_prompts array", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.oversight_prompts)).toBe(true);
  });

  it("scan contains suggested_keywork and suggested_reflective arrays", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.suggested_keywork)).toBe(true);
    expect(Array.isArray(scan.suggested_reflective)).toBe(true);
  });

  it("scan contains repeated_triggers and therapeutic_patterns", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(Array.isArray(scan.repeated_triggers)).toBe(true);
    expect(Array.isArray(scan.therapeutic_patterns)).toBe(true);
  });

  it("scan contains home_dynamics_summary", async () => {
    const scan = await runPracticeIntelligenceScan();
    expect(scan.home_dynamics_summary).toBeDefined();
    expect(scan.home_dynamics_summary).toHaveProperty("emotional_climate");
    expect(scan.home_dynamics_summary).toHaveProperty("risk_level");
    expect(scan.home_dynamics_summary).toHaveProperty("incident_count");
  });
});

describe("getLatestScan (demo mode)", () => {
  it("returns a scan object", async () => {
    const scan = await getLatestScan();
    expect(scan).not.toBeNull();
  });
});

describe("listScans (demo mode)", () => {
  it("returns an array", async () => {
    const scans = await listScans();
    expect(Array.isArray(scans)).toBe(true);
    expect(scans.length).toBeGreaterThan(0);
  });
});
