// ══════════════════════════════════════════════════════════════════════════════
// Staff Wellbeing & Resilience Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  assessStaffWellbeing,
  calculateHomeWellbeingMetrics,
  getBurnoutRiskLabel,
} from "../staff-wellbeing-engine";
import type { StaffWellbeingRecord, WellbeingCheckin, AbsenceRecord } from "../staff-wellbeing-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeCheckin(overrides: Partial<WellbeingCheckin> = {}): WellbeingCheckin {
  return {
    date: "2026-05-10T10:00:00Z",
    overallRating: 4,
    workloadManageable: true,
    feelingSupported: true,
    sleepQuality: 4,
    workLifeBalance: 3,
    teamRelationships: 4,
    recordedBy: "staff-rm-01",
    ...overrides,
  };
}

function makeAbsence(overrides: Partial<AbsenceRecord> = {}): AbsenceRecord {
  return {
    id: "abs-001",
    type: "sick_short_term",
    startDate: "2026-04-01T00:00:00Z",
    endDate: "2026-04-03T00:00:00Z",
    totalDays: 3,
    returnToWorkDone: true,
    fitNote: false,
    ...overrides,
  };
}

function makeRecord(overrides: Partial<StaffWellbeingRecord> = {}): StaffWellbeingRecord {
  return {
    staffId: "staff-001",
    staffName: "Sarah Johnson",
    homeId: "home-oak",
    role: "Senior Residential Worker",
    startDate: "2023-03-15T00:00:00Z",
    contractedHours: 37.5,
    isAgency: false,
    wellbeingCheckins: [
      makeCheckin({ date: "2026-04-10T10:00:00Z", overallRating: 3 }),
      makeCheckin({ date: "2026-04-25T10:00:00Z", overallRating: 4 }),
      makeCheckin({ date: "2026-05-10T10:00:00Z", overallRating: 4 }),
    ],
    absences: [makeAbsence()],
    supervisionAttendance: 92,
    lastSupervisionDate: "2026-05-05T10:00:00Z",
    reflectivePracticeEngagement: 75,
    overtimeHoursLast30Days: 8,
    consecutiveShiftsMax: 4,
    sleepInCountLast30Days: 3,
    restrictedPracticeInvolvement: 1,
    activeSupport: [],
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Individual Assessment Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("assessStaffWellbeing", () => {
  it("marks healthy staff as low burnout risk", () => {
    const result = assessStaffWellbeing(makeRecord(), NOW);
    expect(result.burnoutRiskLevel).toBe("low");
    expect(result.burnoutScore).toBeLessThan(30);
    expect(result.issues).toHaveLength(0);
  });

  it("detects high absence pattern", () => {
    const record = makeRecord({
      absences: [
        makeAbsence({ id: "a1", startDate: "2025-06-01T00:00:00Z", totalDays: 5 }),
        makeAbsence({ id: "a2", startDate: "2025-09-01T00:00:00Z", totalDays: 4 }),
        makeAbsence({ id: "a3", startDate: "2026-01-10T00:00:00Z", totalDays: 3 }),
        makeAbsence({ id: "a4", startDate: "2026-03-20T00:00:00Z", totalDays: 5 }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.absenceDaysLast12Months).toBe(17);
    expect(result.issues.some(i => i.includes("High absence"))).toBe(true);
  });

  it("calculates Bradford Factor correctly", () => {
    // 3 spells, 9 total days → 3^2 * 9 = 81
    const record = makeRecord({
      absences: [
        makeAbsence({ id: "a1", startDate: "2026-01-10T00:00:00Z", totalDays: 3, type: "sick_short_term" }),
        makeAbsence({ id: "a2", startDate: "2026-02-15T00:00:00Z", totalDays: 3, type: "sick_short_term" }),
        makeAbsence({ id: "a3", startDate: "2026-04-01T00:00:00Z", totalDays: 3, type: "sick_short_term" }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.bradfordFactor).toBe(81); // 3^2 * 9
  });

  it("flags Bradford Factor concern at threshold", () => {
    // 5 spells, 10 days → 5^2 * 10 = 250
    const record = makeRecord({
      absences: [
        makeAbsence({ id: "a1", startDate: "2025-08-01T00:00:00Z", totalDays: 2, type: "sick_short_term" }),
        makeAbsence({ id: "a2", startDate: "2025-10-01T00:00:00Z", totalDays: 2, type: "sick_short_term" }),
        makeAbsence({ id: "a3", startDate: "2026-01-01T00:00:00Z", totalDays: 2, type: "sick_short_term" }),
        makeAbsence({ id: "a4", startDate: "2026-03-01T00:00:00Z", totalDays: 2, type: "sick_short_term" }),
        makeAbsence({ id: "a5", startDate: "2026-04-15T00:00:00Z", totalDays: 2, type: "sick_short_term" }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.bradfordFactor).toBe(250);
    expect(result.issues.some(i => i.includes("Bradford Factor"))).toBe(true);
  });

  it("flags excessive overtime", () => {
    const record = makeRecord({ overtimeHoursLast30Days: 25 });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.overtimeConcern).toBe(true);
    expect(result.issues.some(i => i.includes("overtime"))).toBe(true);
    expect(result.recommendations.some(r => r.includes("workload review"))).toBe(true);
  });

  it("flags consecutive shifts concern", () => {
    const record = makeRecord({ consecutiveShiftsMax: 7 });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.consecutiveShiftsConcern).toBe(true);
    expect(result.issues.some(i => i.includes("consecutive"))).toBe(true);
  });

  it("flags overdue supervision", () => {
    const record = makeRecord({ lastSupervisionDate: "2026-03-01T10:00:00Z" }); // > 42 days ago
    const result = assessStaffWellbeing(record, NOW);
    expect(result.supervisionOverdue).toBe(true);
    expect(result.issues.some(i => i.includes("Supervision overdue"))).toBe(true);
  });

  it("does not flag recent supervision", () => {
    const record = makeRecord({ lastSupervisionDate: "2026-05-10T10:00:00Z" });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.supervisionOverdue).toBe(false);
  });

  it("detects declining wellbeing trend", () => {
    const record = makeRecord({
      wellbeingCheckins: [
        makeCheckin({ date: "2026-04-01T10:00:00Z", overallRating: 5 }),
        makeCheckin({ date: "2026-04-15T10:00:00Z", overallRating: 4 }),
        makeCheckin({ date: "2026-05-01T10:00:00Z", overallRating: 3 }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.wellbeingTrend).toBe("declining");
  });

  it("detects improving wellbeing trend", () => {
    const record = makeRecord({
      wellbeingCheckins: [
        makeCheckin({ date: "2026-04-01T10:00:00Z", overallRating: 2 }),
        makeCheckin({ date: "2026-04-15T10:00:00Z", overallRating: 3 }),
        makeCheckin({ date: "2026-05-01T10:00:00Z", overallRating: 4 }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.wellbeingTrend).toBe("improving");
  });

  it("flags high restraint involvement", () => {
    const record = makeRecord({ restrictedPracticeInvolvement: 5 });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.issues.some(i => i.includes("restraints"))).toBe(true);
    expect(result.recommendations.some(r => r.includes("debrief"))).toBe(true);
  });

  it("identifies critical burnout risk with multiple factors", () => {
    const record = makeRecord({
      wellbeingCheckins: [
        makeCheckin({ date: "2026-04-01T10:00:00Z", overallRating: 2, workloadManageable: false, feelingSupported: false, sleepQuality: 1, workLifeBalance: 1, teamRelationships: 2 }),
        makeCheckin({ date: "2026-04-15T10:00:00Z", overallRating: 2, workloadManageable: false, feelingSupported: false, sleepQuality: 1, workLifeBalance: 1, teamRelationships: 2 }),
        makeCheckin({ date: "2026-05-01T10:00:00Z", overallRating: 1, workloadManageable: false, feelingSupported: false, sleepQuality: 1, workLifeBalance: 1, teamRelationships: 1 }),
      ],
      absences: [
        makeAbsence({ id: "a1", startDate: "2025-08-01T00:00:00Z", totalDays: 5, type: "stress_related" }),
        makeAbsence({ id: "a2", startDate: "2026-02-01T00:00:00Z", totalDays: 10, type: "stress_related" }),
      ],
      overtimeHoursLast30Days: 28,
      consecutiveShiftsMax: 8,
      lastSupervisionDate: "2026-03-01T10:00:00Z",
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.burnoutRiskLevel).toBe("critical");
    expect(result.burnoutScore).toBeGreaterThanOrEqual(70);
  });

  it("flags stress-related absence", () => {
    const record = makeRecord({
      absences: [
        makeAbsence({ id: "a1", startDate: "2026-03-01T00:00:00Z", totalDays: 7, type: "stress_related" }),
      ],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.issues.some(i => i.includes("stress-related"))).toBe(true);
  });

  it("recommends counselling for low wellbeing without existing support", () => {
    const record = makeRecord({
      wellbeingCheckins: [
        makeCheckin({ date: "2026-05-10T10:00:00Z", overallRating: 1, sleepQuality: 1, workLifeBalance: 1, teamRelationships: 2, workloadManageable: false, feelingSupported: false }),
      ],
      activeSupport: [],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.recommendations.some(r => r.includes("counselling"))).toBe(true);
  });

  it("does not recommend counselling if already in place", () => {
    const record = makeRecord({
      wellbeingCheckins: [
        makeCheckin({ date: "2026-05-10T10:00:00Z", overallRating: 1, sleepQuality: 1, workLifeBalance: 1, teamRelationships: 2, workloadManageable: false, feelingSupported: false }),
      ],
      activeSupport: ["counselling_referral"],
    });
    const result = assessStaffWellbeing(record, NOW);
    expect(result.recommendations.some(r => r.includes("counselling"))).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeWellbeingMetrics", () => {
  it("calculates basic metrics for a team", () => {
    const records = [
      makeRecord({ staffId: "s1", staffName: "Alice" }),
      makeRecord({ staffId: "s2", staffName: "Bob" }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.staffCount).toBe(2);
    expect(result.averageWellbeingScore).toBeGreaterThan(0);
    expect(result.supervisionComplianceRate).toBe(100);
  });

  it("calculates burnout risk breakdown", () => {
    const records = [
      makeRecord({ staffId: "s1" }),
      makeRecord({ staffId: "s2", overtimeHoursLast30Days: 30, consecutiveShiftsMax: 8, lastSupervisionDate: "2026-03-01T00:00:00Z" }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.burnoutRiskBreakdown.low).toBe(1);
    expect(result.burnoutRiskBreakdown.high + result.burnoutRiskBreakdown.moderate).toBeGreaterThanOrEqual(1);
  });

  it("calculates agency reliance", () => {
    const records = [
      makeRecord({ staffId: "s1", isAgency: false }),
      makeRecord({ staffId: "s2", isAgency: true }),
      makeRecord({ staffId: "s3", isAgency: false }),
      makeRecord({ staffId: "s4", isAgency: true }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.agencyReliance).toBe(50);
  });

  it("calculates overtime rate", () => {
    const records = [
      makeRecord({ staffId: "s1", overtimeHoursLast30Days: 5 }),
      makeRecord({ staffId: "s2", overtimeHoursLast30Days: 25 }),
      makeRecord({ staffId: "s3", overtimeHoursLast30Days: 30 }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.overtimeRate).toBe(67); // 2 of 3
  });

  it("filters by homeId", () => {
    const records = [
      makeRecord({ staffId: "s1", homeId: "home-oak" }),
      makeRecord({ staffId: "s2", homeId: "home-other" }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.staffCount).toBe(1);
  });

  it("returns empty metrics for no staff", () => {
    const result = calculateHomeWellbeingMetrics([], "home-oak", NOW);
    expect(result.staffCount).toBe(0);
    expect(result.averageWellbeingScore).toBe(0);
  });

  it("identifies high risk staff", () => {
    const records = [
      makeRecord({ staffId: "s1", staffName: "Alice" }),
      makeRecord({
        staffId: "s2",
        staffName: "Bob",
        overtimeHoursLast30Days: 30,
        consecutiveShiftsMax: 8,
        lastSupervisionDate: "2026-03-01T00:00:00Z",
        wellbeingCheckins: [
          makeCheckin({ date: "2026-04-01T10:00:00Z", overallRating: 2 }),
          makeCheckin({ date: "2026-04-15T10:00:00Z", overallRating: 2 }),
          makeCheckin({ date: "2026-05-01T10:00:00Z", overallRating: 1 }),
        ],
      }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.highRiskStaff.length).toBeGreaterThanOrEqual(1);
    expect(result.highRiskStaff[0].staffName).toBe("Bob");
  });

  it("calculates stress-related absence rate", () => {
    const records = [
      makeRecord({
        staffId: "s1",
        absences: [
          makeAbsence({ id: "a1", type: "stress_related", startDate: "2026-03-01T00:00:00Z", totalDays: 5 }),
          makeAbsence({ id: "a2", type: "sick_short_term", startDate: "2026-04-01T00:00:00Z", totalDays: 2 }),
        ],
      }),
    ];
    const result = calculateHomeWellbeingMetrics(records, "home-oak", NOW);
    expect(result.stressRelatedAbsenceRate).toBe(50); // 1 of 2 absences
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("getBurnoutRiskLabel", () => {
  it("returns human-readable labels", () => {
    expect(getBurnoutRiskLabel("low")).toBe("Low Risk");
    expect(getBurnoutRiskLabel("moderate")).toBe("Moderate Risk");
    expect(getBurnoutRiskLabel("high")).toBe("High Risk");
    expect(getBurnoutRiskLabel("critical")).toBe("Critical Risk");
  });
});
