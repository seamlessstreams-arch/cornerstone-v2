// ══════════════════════════════════════════════════════════════════════════════
// Cara HR Files — Workforce Engine Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateTrainingCompliance,
  evaluateSupervisionCompliance,
  calculateWorkforceMetrics,
  identifyTrainingGaps,
  getMandatoryTraining,
  getTrainingRenewalYears,
  formatTrainingName,
} from "../workforce-engine";
import type {
  StaffMember,
  TrainingRecord,
  SupervisionRecord,
  TrainingCategory,
} from "../workforce-engine";

// ── Constants ──────────────────────────────────────────────────────────────

const FIXED_NOW = "2026-05-16T12:00:00Z";

// ── Factories ──────────────────────────────────────────────────────────────

function makeTraining(
  category: TrainingCategory,
  status: "completed" | "expired" | "not_started" | "booked" = "completed",
  expiresAt?: string,
): TrainingRecord {
  return {
    category,
    status,
    ...(status === "completed" && { completedAt: "2026-01-15T10:00:00Z" }),
    ...(expiresAt && { expiresAt }),
    ...(status === "booked" && { bookedFor: "2026-06-01" }),
  };
}

function makeSupervision(overrides: Partial<SupervisionRecord> = {}): SupervisionRecord {
  return {
    id: "sup-1",
    type: "formal",
    date: "2026-05-01T10:00:00Z",
    supervisorId: "user-tl-1",
    supervisorName: "Lisa Chen",
    durationMinutes: 60,
    topics: ["workload", "training progress", "wellbeing"],
    actionPoints: 3,
    actionPointsCompleted: 2,
    signedOff: true,
    ...overrides,
  };
}

function makeStaff(overrides: Partial<StaffMember> = {}): StaffMember {
  // Build complete mandatory training for RSW
  const allMandatory: TrainingCategory[] = [
    "induction", "safeguarding_basic", "first_aid", "fire_safety",
    "data_protection", "equality_diversity", "health_safety", "prevent",
    "online_safety", "medication", "restraint", "attachment_trauma",
    "cse_cce", "mental_health", "record_keeping",
  ];

  return {
    id: "staff-001",
    name: "Sarah Mitchell",
    role: "rsw",
    homeId: "home-oak",
    startDate: "2024-06-01T00:00:00Z",
    contractHours: 37.5,
    isAgency: false,
    training: allMandatory.map(cat => makeTraining(cat, "completed", "2027-01-15T10:00:00Z")),
    supervisions: [
      makeSupervision({ date: "2026-05-01T10:00:00Z" }),
      makeSupervision({ id: "sup-2", date: "2026-04-03T10:00:00Z" }),
      makeSupervision({ id: "sup-3", date: "2026-03-06T10:00:00Z" }),
    ],
    absences: [],
    qualificationLevel: 3,
    qualificationTarget: 3,
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// evaluateTrainingCompliance
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateTrainingCompliance", () => {
  it("returns fully compliant for staff with all training completed", () => {
    const staff = makeStaff();
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.overallCompliant).toBe(true);
    expect(result.expired).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
    expect(result.completionRate).toBe(100);
  });

  it("detects missing training", () => {
    const staff = makeStaff({
      training: [
        makeTraining("induction", "completed"),
        makeTraining("safeguarding_basic", "completed"),
        // Missing everything else
      ],
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.overallCompliant).toBe(false);
    expect(result.missing.length).toBeGreaterThan(5);
    expect(result.completionRate).toBeLessThan(50);
  });

  it("detects expired training", () => {
    const staff = makeStaff({
      training: [
        ...getMandatoryTraining("rsw").map(cat =>
          cat === "safeguarding_basic"
            ? makeTraining("safeguarding_basic", "completed", "2026-01-01T00:00:00Z") // expired
            : makeTraining(cat, "completed", "2027-06-01T00:00:00Z"),
        ),
      ],
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.overallCompliant).toBe(false);
    expect(result.expired).toContain("safeguarding_basic");
  });

  it("detects training expiring soon (within 30 days)", () => {
    const staff = makeStaff({
      training: getMandatoryTraining("rsw").map(cat =>
        cat === "first_aid"
          ? makeTraining("first_aid", "completed", "2026-06-10T00:00:00Z") // 25 days away
          : makeTraining(cat, "completed", "2027-06-01T00:00:00Z"),
      ),
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.expiringSoon).toContain("first_aid");
    expect(result.overallCompliant).toBe(true); // still compliant, just warning
  });

  it("counts booked training as missing (not yet complete)", () => {
    const staff = makeStaff({
      training: getMandatoryTraining("rsw").map(cat =>
        cat === "restraint"
          ? makeTraining("restraint", "booked")
          : makeTraining(cat, "completed", "2027-06-01T00:00:00Z"),
      ),
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.missing).toContain("restraint");
    expect(result.nextActions.some(a => a.includes("booked"))).toBe(true);
  });

  it("requires advanced safeguarding for team_leader", () => {
    const staff = makeStaff({
      role: "team_leader",
      training: getMandatoryTraining("rsw").map(cat =>
        makeTraining(cat, "completed", "2027-06-01T00:00:00Z"),
      ),
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    // Should be missing safeguarding_advanced
    expect(result.missing).toContain("safeguarding_advanced");
    expect(result.overallCompliant).toBe(false);
  });

  it("does not require care training for hr_admin", () => {
    const staff = makeStaff({
      role: "hr_admin",
      training: [
        makeTraining("induction", "completed"),
        makeTraining("safeguarding_basic", "completed"),
        makeTraining("first_aid", "completed"),
        makeTraining("fire_safety", "completed"),
        makeTraining("data_protection", "completed"),
        makeTraining("equality_diversity", "completed"),
        makeTraining("health_safety", "completed"),
        makeTraining("prevent", "completed"),
        makeTraining("online_safety", "completed"),
      ],
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.overallCompliant).toBe(true);
    expect(result.missing).not.toContain("restraint");
    expect(result.missing).not.toContain("medication");
  });

  it("calculates correct completion percentage", () => {
    const mandatory = getMandatoryTraining("rsw");
    const halfComplete = mandatory.slice(0, Math.floor(mandatory.length / 2));
    const staff = makeStaff({
      training: halfComplete.map(cat => makeTraining(cat, "completed", "2027-06-01T00:00:00Z")),
    });
    const result = evaluateTrainingCompliance(staff, FIXED_NOW);
    expect(result.completionRate).toBeGreaterThan(30);
    expect(result.completionRate).toBeLessThan(60);
    expect(result.mandatoryComplete).toBe(halfComplete.length);
    expect(result.mandatoryTotal).toBe(mandatory.length);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// evaluateSupervisionCompliance
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateSupervisionCompliance", () => {
  it("returns compliant for staff with recent supervision", () => {
    const staff = makeStaff();
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.daysSinceLastSupervision).toBeLessThanOrEqual(42);
    expect(result.frequency).toBe("monthly");
  });

  it("returns non-compliant for staff with no supervision in 6+ weeks", () => {
    const staff = makeStaff({
      supervisions: [
        makeSupervision({ date: "2026-03-01T10:00:00Z" }), // ~76 days ago
      ],
    });
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.isCompliant).toBe(false);
    expect(result.daysSinceLastSupervision).toBeGreaterThan(42);
  });

  it("returns none frequency for staff with no formal supervisions", () => {
    const staff = makeStaff({
      supervisions: [
        makeSupervision({ type: "ad_hoc", date: "2026-05-10T10:00:00Z" }), // doesn't count
      ],
    });
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.isCompliant).toBe(false);
    expect(result.frequency).toBe("none");
    expect(result.lastSupervisionDate).toBeNull();
  });

  it("counts supervisions in last 3 months", () => {
    const staff = makeStaff(); // has 3 supervisions in recent months
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.supervisionsInPeriod).toBe(3);
  });

  it("calculates outstanding action points", () => {
    const staff = makeStaff({
      supervisions: [
        makeSupervision({ actionPoints: 5, actionPointsCompleted: 2, date: "2026-05-01T10:00:00Z" }),
        makeSupervision({ id: "sup-2", actionPoints: 3, actionPointsCompleted: 3, date: "2026-04-01T10:00:00Z" }),
      ],
    });
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.actionPointsOutstanding).toBe(3); // 5-2 + 3-3
  });

  it("calculates next due date based on last supervision", () => {
    const staff = makeStaff({
      supervisions: [makeSupervision({ date: "2026-05-01T10:00:00Z" })],
    });
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    // Next due: May 1 + 28 days = May 29
    expect(result.nextDue).toContain("2026-05-29");
  });

  it("counts reflective practice as formal supervision", () => {
    const staff = makeStaff({
      supervisions: [
        makeSupervision({ type: "reflective", date: "2026-05-10T10:00:00Z" }),
      ],
    });
    const result = evaluateSupervisionCompliance(staff, FIXED_NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.lastSupervisionDate).toBe("2026-05-10T10:00:00Z");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// calculateWorkforceMetrics
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateWorkforceMetrics", () => {
  it("calculates basic metrics for team", () => {
    const team = [
      makeStaff({ id: "s1", contractHours: 37.5 }),
      makeStaff({ id: "s2", contractHours: 37.5 }),
      makeStaff({ id: "s3", contractHours: 20, isAgency: true }),
    ];
    const metrics = calculateWorkforceMetrics(team, 4, 0, FIXED_NOW);
    expect(metrics.totalStaff).toBe(3);
    expect(metrics.fullTimeEquivalent).toBeCloseTo(2.5, 1);
    expect(metrics.vacancyRate).toBe(25); // 1/4
    expect(metrics.agencyUsage).toBe(33); // 1/3
  });

  it("calculates turnover rate", () => {
    const team = [makeStaff(), makeStaff({ id: "s2" })];
    const metrics = calculateWorkforceMetrics(team, 2, 1, FIXED_NOW); // 1 leaver
    expect(metrics.turnoverRate).toBe(50); // 1/2
  });

  it("calculates sickness rate", () => {
    const team = [
      makeStaff({
        absences: [{ type: "sickness", startDate: "2026-01-10", daysLost: 5, returnToWorkCompleted: true }],
      }),
      makeStaff({ id: "s2", absences: [] }),
    ];
    const metrics = calculateWorkforceMetrics(team, 2, 0, FIXED_NOW);
    expect(metrics.sicknessRate).toBeGreaterThan(0);
    expect(metrics.sicknessRate).toBeLessThan(5);
  });

  it("calculates training compliance rate", () => {
    const compliantStaff = makeStaff();
    const nonCompliantStaff = makeStaff({
      id: "s2",
      name: "Non-compliant",
      training: [makeTraining("induction", "completed")], // missing most
    });
    const metrics = calculateWorkforceMetrics(
      [compliantStaff, nonCompliantStaff],
      2, 0, FIXED_NOW,
    );
    expect(metrics.trainingComplianceRate).toBe(50); // 1/2
  });

  it("calculates supervision compliance rate", () => {
    const compliantStaff = makeStaff();
    const overdueStaff = makeStaff({
      id: "s2",
      supervisions: [makeSupervision({ date: "2026-01-01T10:00:00Z" })], // very overdue
    });
    const metrics = calculateWorkforceMetrics(
      [compliantStaff, overdueStaff],
      2, 0, FIXED_NOW,
    );
    expect(metrics.supervisionComplianceRate).toBe(50);
    expect(metrics.staffOverdueSupervision).toBe(1);
  });

  it("calculates qualification rate", () => {
    const staff = [
      makeStaff({ qualificationLevel: 3, qualificationTarget: 3 }),
      makeStaff({ id: "s2", qualificationLevel: 2, qualificationTarget: 3 }), // below target
      makeStaff({ id: "s3", qualificationLevel: 5, qualificationTarget: 4 }), // above target
    ];
    const metrics = calculateWorkforceMetrics(staff, 3, 0, FIXED_NOW);
    expect(metrics.qualificationRate).toBe(67); // 2/3
  });

  it("calculates average tenure", () => {
    const staff = [
      makeStaff({ startDate: "2024-05-16T00:00:00Z" }), // 24 months
      makeStaff({ id: "s2", startDate: "2025-05-16T00:00:00Z" }), // 12 months
    ];
    const metrics = calculateWorkforceMetrics(staff, 2, 0, FIXED_NOW);
    expect(metrics.averageTenure).toBeGreaterThanOrEqual(17);
    expect(metrics.averageTenure).toBeLessThanOrEqual(19);
  });

  it("returns 0 vacancy rate when fully staffed", () => {
    const staff = [makeStaff(), makeStaff({ id: "s2" })];
    const metrics = calculateWorkforceMetrics(staff, 2, 0, FIXED_NOW);
    expect(metrics.vacancyRate).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// identifyTrainingGaps
// ══════════════════════════════════════════════════════════════════════════════

describe("identifyTrainingGaps", () => {
  it("identifies no gaps for fully compliant team", () => {
    const team = [makeStaff(), makeStaff({ id: "s2", name: "Staff B" })];
    const gaps = identifyTrainingGaps(team, FIXED_NOW);
    expect(gaps).toHaveLength(0);
  });

  it("identifies critical gap for expired safeguarding", () => {
    const team = [
      makeStaff({
        training: getMandatoryTraining("rsw").map(cat =>
          cat === "safeguarding_basic"
            ? makeTraining("safeguarding_basic", "completed", "2026-01-01T00:00:00Z") // expired
            : makeTraining(cat, "completed", "2027-06-01T00:00:00Z"),
        ),
      }),
    ];
    const gaps = identifyTrainingGaps(team, FIXED_NOW);
    const safeguardingGap = gaps.find(g => g.category === "safeguarding_basic");
    expect(safeguardingGap).toBeDefined();
    expect(safeguardingGap?.urgency).toBe("critical");
  });

  it("sorts gaps by urgency", () => {
    const team = [
      makeStaff({
        training: [
          makeTraining("induction", "completed", "2027-06-01T00:00:00Z"),
          makeTraining("safeguarding_basic", "completed", "2025-12-01T00:00:00Z"), // expired = critical
          makeTraining("first_aid", "expired"), // expired = high
        ],
      }),
    ];
    const gaps = identifyTrainingGaps(team, FIXED_NOW);
    expect(gaps.length).toBeGreaterThan(0);
    // Critical should come before high
    const criticalIdx = gaps.findIndex(g => g.urgency === "critical");
    const highIdx = gaps.findIndex(g => g.urgency === "high");
    if (criticalIdx >= 0 && highIdx >= 0) {
      expect(criticalIdx).toBeLessThan(highIdx);
    }
  });

  it("aggregates staff names for shared gaps", () => {
    const team = [
      makeStaff({
        id: "s1",
        name: "Alice",
        training: getMandatoryTraining("rsw")
          .filter(c => c !== "restraint")
          .map(cat => makeTraining(cat, "completed", "2027-06-01T00:00:00Z")),
      }),
      makeStaff({
        id: "s2",
        name: "Bob",
        training: getMandatoryTraining("rsw")
          .filter(c => c !== "restraint")
          .map(cat => makeTraining(cat, "completed", "2027-06-01T00:00:00Z")),
      }),
    ];
    const gaps = identifyTrainingGaps(team, FIXED_NOW);
    const restraintGap = gaps.find(g => g.category === "restraint");
    expect(restraintGap).toBeDefined();
    expect(restraintGap?.staffAffected).toBe(2);
    expect(restraintGap?.staffNames).toContain("Alice");
    expect(restraintGap?.staffNames).toContain("Bob");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper functions
// ══════════════════════════════════════════════════════════════════════════════

describe("helper functions", () => {
  it("getMandatoryTraining returns 9 for non-care roles", () => {
    const mandatory = getMandatoryTraining("hr_admin");
    expect(mandatory).toHaveLength(9);
    expect(mandatory).not.toContain("restraint");
  });

  it("getMandatoryTraining returns 15 for RSW", () => {
    const mandatory = getMandatoryTraining("rsw");
    expect(mandatory).toHaveLength(15);
    expect(mandatory).toContain("restraint");
    expect(mandatory).toContain("medication");
  });

  it("getMandatoryTraining returns 16 for team_leader (includes advanced safeguarding)", () => {
    const mandatory = getMandatoryTraining("team_leader");
    expect(mandatory).toHaveLength(16);
    expect(mandatory).toContain("safeguarding_advanced");
  });

  it("getTrainingRenewalYears returns correct values", () => {
    expect(getTrainingRenewalYears("first_aid")).toBe(3);
    expect(getTrainingRenewalYears("safeguarding_basic")).toBe(1);
    expect(getTrainingRenewalYears("restraint")).toBe(1);
    expect(getTrainingRenewalYears("induction")).toBeNull(); // no renewal
  });

  it("formatTrainingName returns human-readable names", () => {
    expect(formatTrainingName("safeguarding_basic")).toBe("Safeguarding (Level 1)");
    expect(formatTrainingName("restraint")).toBe("Physical Intervention (PRICE)");
    expect(formatTrainingName("cse_cce")).toBe("CSE/CCE Awareness");
  });
});
