// ══════════════════════════════════════════════════════════════════════════════
// Transitions & Admissions Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateTransitionCompliance,
  calculateTransitionMetrics,
  getTransitionTypeLabel,
  getTransitionStatusLabel,
} from "../transitions-engine";
import type { Transition, MatchingAssessment, ImpactAssessment } from "../transitions-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeMatching(overrides: Partial<MatchingAssessment> = {}): MatchingAssessment {
  return {
    completedAt: "2026-04-28T10:00:00Z",
    completedBy: "staff-rm-01",
    domains: [
      { domain: "age_appropriateness", score: 4, notes: "Good age fit" },
      { domain: "risk_compatibility", score: 3, notes: "Manageable" },
      { domain: "needs_capability", score: 4, notes: "Can meet needs" },
      { domain: "staffing_capacity", score: 4, notes: "Adequate staffing" },
    ],
    overallScore: 3.75,
    recommendation: "accept",
    existingChildrenConsulted: true,
    existingChildrenViews: "Children positive about new peer joining",
    ...overrides,
  };
}

function makeImpact(overrides: Partial<ImpactAssessment> = {}): ImpactAssessment {
  return {
    completedAt: "2026-04-28T14:00:00Z",
    completedBy: "staff-rm-01",
    impactOnExistingChildren: "neutral",
    impactOnStaffing: "adequate",
    impactOnDynamics: "Positive addition — similar age, shared interests",
    mitigationActions: ["Extra staff for first 72 hours"],
    approvedBy: "staff-ri-01",
    approvedAt: "2026-04-29T09:00:00Z",
    ...overrides,
  };
}

function makeTransition(overrides: Partial<Transition> = {}): Transition {
  return {
    id: "trans-001",
    childId: "child-new",
    childName: "New Child",
    homeId: "home-oak",
    type: "admission_planned",
    status: "established",
    referralDate: "2026-04-20T10:00:00Z",
    referralSource: "LA Placement Team",
    placingAuthority: "County Council",
    socialWorkerName: "Jane Smith",
    expectedArrivalDate: "2026-05-01T14:00:00Z",
    actualArrivalDate: "2026-05-01T14:30:00Z",
    placementPlanDue: "2026-05-08T14:00:00Z",
    placementPlanDate: "2026-05-06T10:00:00Z",
    riskAssessmentCompleted: true,
    childrenGuideProvided: true,
    reg44Notified: true,
    matchingAssessment: makeMatching(),
    impactAssessment: makeImpact(),
    settlingInReviews: [
      { date: "2026-05-01T18:30:00Z", hoursPostArrival: 4, childSettling: "mixed", sleepFirstNight: true, eatFirstMeal: true, engagedWithPeers: false, expressedWorries: ["Missing old foster carer"], supportProvided: ["Keyworker 1:1", "Phone call home"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2026-05-02T14:30:00Z", hoursPostArrival: 24, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Tour of area", "Met school"], concerns: [], reviewedBy: "staff-sw-01" },
      { date: "2026-05-04T14:30:00Z", hoursPostArrival: 72, childSettling: "well", engagedWithPeers: true, expressedWorries: [], supportProvided: ["Started keywork sessions"], concerns: [], reviewedBy: "staff-rm-01" },
    ],
    recordedBy: "staff-rm-01",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateTransitionCompliance", () => {
  it("marks fully compliant transition", () => {
    const result = evaluateTransitionCompliance(makeTransition(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.matchingCompleted).toBe(true);
    expect(result.impactAssessmentCompleted).toBe(true);
    expect(result.placementPlanOnTime).toBe(true);
  });

  it("flags missing matching assessment for planned admission", () => {
    const transition = makeTransition({ matchingAssessment: undefined });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.matchingCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("Matching assessment"))).toBe(true);
  });

  it("does not require matching for emergency admission", () => {
    const transition = makeTransition({
      type: "admission_emergency",
      matchingAssessment: undefined,
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.issues.some(i => i.includes("Matching assessment"))).toBe(false);
  });

  it("flags missing impact assessment", () => {
    const transition = makeTransition({ impactAssessment: undefined });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.impactAssessmentCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("Impact assessment"))).toBe(true);
  });

  it("warns about impact for emergency admissions", () => {
    const transition = makeTransition({
      type: "admission_emergency",
      impactAssessment: undefined,
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.warnings.some(w => w.includes("Emergency admission"))).toBe(true);
  });

  it("flags overdue placement plan", () => {
    const transition = makeTransition({
      placementPlanDate: undefined,
      placementPlanDue: "2026-05-06T14:00:00Z", // past
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.placementPlanOnTime).toBe(false);
    expect(result.issues.some(i => i.includes("Placement plan overdue"))).toBe(true);
  });

  it("passes placement plan completed on time", () => {
    const result = evaluateTransitionCompliance(makeTransition(), NOW);
    expect(result.placementPlanOnTime).toBe(true);
  });

  it("flags missing risk assessment", () => {
    const transition = makeTransition({ riskAssessmentCompleted: false });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.riskAssessmentDone).toBe(false);
    expect(result.issues.some(i => i.includes("Risk assessment"))).toBe(true);
  });

  it("flags missing children guide", () => {
    const transition = makeTransition({ childrenGuideProvided: false });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.childrenGuideGiven).toBe(false);
    expect(result.issues.some(i => i.includes("Children's guide"))).toBe(true);
  });

  it("warns about reg44 notification", () => {
    const transition = makeTransition({ reg44Notified: false });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.reg44Notified).toBe(false);
    expect(result.warnings.some(w => w.includes("Reg 44"))).toBe(true);
  });

  it("detects low matching score", () => {
    const transition = makeTransition({
      matchingAssessment: makeMatching({ overallScore: 2.1 }),
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.warnings.some(w => w.includes("Low matching score"))).toBe(true);
  });

  it("calculates days in placement", () => {
    const transition = makeTransition({
      actualArrivalDate: "2026-05-01T14:00:00Z",
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.daysInPlacement).toBe(16);
  });

  it("monitors settling-in reviews", () => {
    const transition = makeTransition({
      settlingInReviews: [], // none done
      actualArrivalDate: "2026-05-15T14:00:00Z", // 2 days ago — should have 4h and 24h reviews
    });
    const result = evaluateTransitionCompliance(transition, NOW);
    expect(result.settlingInMonitored).toBe(false);
    expect(result.warnings.some(w => w.includes("Settling-in"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateTransitionMetrics", () => {
  it("calculates occupancy", () => {
    const transitions = [
      makeTransition({ id: "t1", status: "established", actualArrivalDate: "2026-03-01T00:00:00Z" }),
      makeTransition({ id: "t2", status: "established", actualArrivalDate: "2026-04-01T00:00:00Z" }),
      makeTransition({ id: "t3", status: "departed", actualArrivalDate: "2026-01-01T00:00:00Z", actualDepartureDate: "2026-04-15T00:00:00Z" }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.currentOccupancy).toBe(2);
    expect(result.occupancyRate).toBe(50);
  });

  it("calculates emergency admission rate", () => {
    const transitions = [
      makeTransition({ id: "t1", type: "admission_planned" }),
      makeTransition({ id: "t2", type: "admission_emergency" }),
      makeTransition({ id: "t3", type: "admission_planned" }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.emergencyAdmissionRate).toBe(33);
  });

  it("calculates matching compliance rate", () => {
    const transitions = [
      makeTransition({ id: "t1", matchingAssessment: makeMatching() }),
      makeTransition({ id: "t2", matchingAssessment: undefined }),
      makeTransition({ id: "t3", matchingAssessment: makeMatching() }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.matchingComplianceRate).toBe(67);
  });

  it("calculates average matching score", () => {
    const transitions = [
      makeTransition({ id: "t1", matchingAssessment: makeMatching({ overallScore: 4.0 }) }),
      makeTransition({ id: "t2", matchingAssessment: makeMatching({ overallScore: 3.0 }) }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.averageMatchingScore).toBe(3.5);
  });

  it("calculates planned move rate", () => {
    const transitions = [
      makeTransition({ id: "t1", type: "leaving_planned", status: "departed", actualDepartureDate: "2026-04-01T00:00:00Z" }),
      makeTransition({ id: "t2", type: "leaving_unplanned", status: "departed", actualDepartureDate: "2026-03-01T00:00:00Z" }),
      makeTransition({ id: "t3", type: "reunification", status: "departed", actualDepartureDate: "2026-02-01T00:00:00Z" }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.plannedMoveRate).toBe(67); // 2 of 3 planned
  });

  it("identifies active transitions", () => {
    const transitions = [
      makeTransition({ id: "t1", status: "settling_in" }),
      makeTransition({ id: "t2", status: "matching_assessment" }),
      makeTransition({ id: "t3", status: "established" }), // not active
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.activeTransitions.length).toBe(2);
  });

  it("filters by homeId", () => {
    const transitions = [
      makeTransition({ id: "t1", homeId: "home-oak" }),
      makeTransition({ id: "t2", homeId: "home-other" }),
    ];
    const result = calculateTransitionMetrics(transitions, "home-oak", 4, NOW);
    expect(result.admissionsThisYear).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getTransitionTypeLabel returns readable labels", () => {
    expect(getTransitionTypeLabel("admission_planned")).toBe("Planned Admission");
    expect(getTransitionTypeLabel("admission_emergency")).toBe("Emergency Admission");
    expect(getTransitionTypeLabel("leaving_18")).toBe("Leaving at 18");
  });

  it("getTransitionStatusLabel returns readable labels", () => {
    expect(getTransitionStatusLabel("settling_in")).toBe("Settling In");
    expect(getTransitionStatusLabel("matching_assessment")).toBe("Matching");
  });
});
