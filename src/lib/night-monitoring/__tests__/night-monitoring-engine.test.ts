// ══════════════════════════════════════════════════════════════════════════════
// Night Monitoring & Sleep Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateNightShiftCompliance,
  calculateHomeNightMetrics,
  getNightIncidentTypeLabel,
  getSleepStatusLabel,
  getCheckFrequencyLabel,
} from "../night-monitoring-engine";
import type { NightShift, NightCheckPlan, NightCheck, NightIncident, SleepPattern } from "../night-monitoring-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeCheckPlans(): NightCheckPlan[] {
  return [
    { childId: "child-a", childName: "Alex", frequency: "30_min", riskLevel: "standard" },
    { childId: "child-b", childName: "Beth", frequency: "30_min", riskLevel: "standard" },
    { childId: "child-c", childName: "Charlie", frequency: "60_min", riskLevel: "enhanced", specialInstructions: "Check breathing" },
  ];
}

function makeChecks(childIds: string[], count: number): NightCheck[] {
  const checks: NightCheck[] = [];
  for (let i = 0; i < count; i++) {
    for (const childId of childIds) {
      checks.push({
        id: `chk-${childId}-${i}`,
        childId,
        childName: childId.replace("child-", ""),
        timestamp: `2026-05-16T${String(22 + Math.floor(i / 2)).padStart(2, "0")}:${String((i % 2) * 30).padStart(2, "0")}:00Z`,
        status: "asleep",
        observation: "Sleeping peacefully",
        checkedBy: "staff-wn-01",
        doorOpen: true,
      });
    }
  }
  return checks;
}

function makeShift(overrides: Partial<NightShift> = {}): NightShift {
  // 9 hours at 30-min intervals = 18 checks per child; 2 children at 30min + 1 at 60min = 18+18+9 = 45 expected
  return {
    id: "shift-001",
    homeId: "home-oak",
    date: "2026-05-16",
    startTime: "2026-05-16T22:00:00Z",
    endTime: "2026-05-17T07:00:00Z",
    staffOnDuty: ["staff-wn-01"],
    staffCount: 1,
    requiredStaffCount: 1,
    checks: makeChecks(["child-a", "child-b", "child-c"], 18), // 18 rounds x 3 children = 54 checks
    incidents: [],
    handoverCompleted: true,
    handoverNotes: "Quiet night. All children slept well.",
    handoverTime: "2026-05-17T07:00:00Z",
    allChecksCompleted: true,
    missedChecks: 0,
    ...overrides,
  };
}

function makeSleepPatterns(): SleepPattern[] {
  return [
    { childId: "child-a", childName: "Alex", date: "2026-05-16", estimatedSleepTime: "22:30", estimatedWakeTime: "07:00", totalSleepHours: 8.5, wakingEpisodes: 0, overallQuality: "good" },
    { childId: "child-b", childName: "Beth", date: "2026-05-16", estimatedSleepTime: "23:00", estimatedWakeTime: "06:30", totalSleepHours: 7.5, wakingEpisodes: 1, overallQuality: "fair" },
    { childId: "child-c", childName: "Charlie", date: "2026-05-16", estimatedSleepTime: "22:00", estimatedWakeTime: "05:30", totalSleepHours: 7.5, wakingEpisodes: 3, overallQuality: "poor" },
  ];
}

// ══════════════════════════════════════════════════════════════════════════════
// Shift Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateNightShiftCompliance", () => {
  it("marks compliant shift", () => {
    const result = evaluateNightShiftCompliance(makeShift(), makeCheckPlans());
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.staffingAdequate).toBe(true);
    expect(result.handoverCompleted).toBe(true);
  });

  it("flags understaffing", () => {
    const shift = makeShift({ staffCount: 0, requiredStaffCount: 1 });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.staffingAdequate).toBe(false);
    expect(result.issues.some(i => i.includes("Understaffed"))).toBe(true);
  });

  it("flags unchecked children", () => {
    // Only check child-a and child-b, miss child-c
    const shift = makeShift({ checks: makeChecks(["child-a", "child-b"], 18) });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.childrenNotChecked).toContain("Charlie");
    expect(result.issues.some(i => i.includes("not checked"))).toBe(true);
  });

  it("flags missed checks > 3", () => {
    const shift = makeShift({ missedChecks: 5 });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.issues.some(i => i.includes("5 checks missed"))).toBe(true);
  });

  it("warns about missed checks <= 3", () => {
    const shift = makeShift({ missedChecks: 2 });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.warnings.some(w => w.includes("2 check(s) missed"))).toBe(true);
  });

  it("flags low check completion rate", () => {
    // Very few checks compared to expected
    const shift = makeShift({ checks: makeChecks(["child-a", "child-b", "child-c"], 3) }); // only 9 checks vs ~45 expected
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.checkCompletionRate).toBeLessThan(80);
    expect(result.issues.some(i => i.includes("below 80%"))).toBe(true);
  });

  it("flags unescalated high severity incidents", () => {
    const incident: NightIncident = {
      id: "inc-1",
      childId: "child-a",
      childName: "Alex",
      timestamp: "2026-05-17T01:00:00Z",
      type: "self_harm_risk",
      severity: "high",
      description: "Found with sharp object",
      actionTaken: "Removed item, 1:1 support",
      escalated: false,
      resolved: true,
      resolvedTime: "2026-05-17T01:30:00Z",
      recordedBy: "staff-wn-01",
    };
    const shift = makeShift({ incidents: [incident] });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.highSeverityIncidents).toBe(1);
    expect(result.issues.some(i => i.includes("not escalated"))).toBe(true);
  });

  it("flags missing handover", () => {
    const shift = makeShift({ handoverCompleted: false });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.handoverCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("handover not completed"))).toBe(true);
  });

  it("counts incidents correctly", () => {
    const incidents: NightIncident[] = [
      { id: "i1", childId: "child-a", childName: "Alex", timestamp: "2026-05-17T01:00:00Z", type: "nightmare", severity: "low", description: "Bad dream", actionTaken: "Comfort", escalated: false, resolved: true, resolvedTime: "2026-05-17T01:15:00Z", recordedBy: "staff-wn-01" },
      { id: "i2", childId: "child-b", childName: "Beth", timestamp: "2026-05-17T03:00:00Z", type: "noise_disturbance", severity: "low", description: "Loud music", actionTaken: "Asked to turn down", escalated: false, resolved: true, resolvedTime: "2026-05-17T03:05:00Z", recordedBy: "staff-wn-01" },
    ];
    const shift = makeShift({ incidents });
    const result = evaluateNightShiftCompliance(shift, makeCheckPlans());
    expect(result.incidentCount).toBe(2);
    expect(result.highSeverityIncidents).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeNightMetrics", () => {
  it("calculates metrics for compliant home", () => {
    const shifts = [
      makeShift({ id: "s1", date: "2026-05-16" }),
      makeShift({ id: "s2", date: "2026-05-15" }),
      makeShift({ id: "s3", date: "2026-05-14" }),
    ];
    const result = calculateHomeNightMetrics(shifts, makeCheckPlans(), makeSleepPatterns(), "home-oak", NOW);
    expect(result.totalNightsRecorded).toBe(3);
    expect(result.overallComplianceRate).toBe(100);
    expect(result.staffingComplianceRate).toBe(100);
  });

  it("calculates sleep metrics", () => {
    const patterns = [
      ...makeSleepPatterns(),
      { childId: "child-c", childName: "Charlie", date: "2026-05-15", totalSleepHours: 5, wakingEpisodes: 4, overallQuality: "poor" as const },
      { childId: "child-c", childName: "Charlie", date: "2026-05-14", totalSleepHours: 6, wakingEpisodes: 2, overallQuality: "poor" as const },
    ];
    const result = calculateHomeNightMetrics([makeShift()], makeCheckPlans(), patterns, "home-oak", NOW);
    expect(result.averageSleepHours).toBeGreaterThan(0);
    expect(result.poorSleepRate).toBeGreaterThan(0);
    expect(result.childrenWithSleepIssues.length).toBe(1);
    expect(result.childrenWithSleepIssues[0].childName).toBe("Charlie");
  });

  it("counts incidents by type", () => {
    const shifts = [
      makeShift({
        id: "s1",
        date: "2026-05-16",
        incidents: [
          { id: "i1", childId: "child-a", childName: "Alex", timestamp: "2026-05-17T01:00:00Z", type: "nightmare", severity: "low", description: "Bad dream", actionTaken: "Comfort", escalated: false, resolved: true, recordedBy: "staff-wn-01" },
          { id: "i2", childId: "child-a", childName: "Alex", timestamp: "2026-05-17T03:00:00Z", type: "nightmare", severity: "low", description: "Another bad dream", actionTaken: "Comfort", escalated: false, resolved: true, recordedBy: "staff-wn-01" },
          { id: "i3", childId: "child-b", childName: "Beth", timestamp: "2026-05-17T02:00:00Z", type: "bed_wetting", severity: "low", description: "Wet bed", actionTaken: "Changed bedding", escalated: false, resolved: true, recordedBy: "staff-wn-01" },
        ],
      }),
    ];
    const result = calculateHomeNightMetrics(shifts, makeCheckPlans(), [], "home-oak", NOW);
    expect(result.totalIncidents30Days).toBe(3);
    expect(result.incidentsByType.find(t => t.type === "nightmare")?.count).toBe(2);
  });

  it("calculates handover rate", () => {
    const shifts = [
      makeShift({ id: "s1", date: "2026-05-16", handoverCompleted: true }),
      makeShift({ id: "s2", date: "2026-05-15", handoverCompleted: false }),
    ];
    const result = calculateHomeNightMetrics(shifts, makeCheckPlans(), [], "home-oak", NOW);
    expect(result.handoverCompletionRate).toBe(50);
  });

  it("provides recent shift summary", () => {
    const shifts = [
      makeShift({ id: "s1", date: "2026-05-16" }),
      makeShift({ id: "s2", date: "2026-05-15" }),
    ];
    const result = calculateHomeNightMetrics(shifts, makeCheckPlans(), [], "home-oak", NOW);
    expect(result.recentShifts.length).toBe(2);
    expect(result.recentShifts[0]).toHaveProperty("compliant");
    expect(result.recentShifts[0]).toHaveProperty("checkRate");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getNightIncidentTypeLabel returns readable labels", () => {
    expect(getNightIncidentTypeLabel("nightmare")).toBe("Nightmare");
    expect(getNightIncidentTypeLabel("self_harm_risk")).toBe("Self-Harm Risk");
    expect(getNightIncidentTypeLabel("absconding_attempt")).toBe("Absconding Attempt");
  });

  it("getSleepStatusLabel returns readable labels", () => {
    expect(getSleepStatusLabel("asleep")).toBe("Asleep");
    expect(getSleepStatusLabel("awake_distressed")).toBe("Awake (Distressed)");
  });

  it("getCheckFrequencyLabel returns readable labels", () => {
    expect(getCheckFrequencyLabel("30_min")).toBe("Every 30 Minutes");
    expect(getCheckFrequencyLabel("15_min")).toBe("Every 15 Minutes");
  });
});
