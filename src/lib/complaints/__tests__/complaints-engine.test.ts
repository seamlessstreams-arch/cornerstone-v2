// ══════════════════════════════════════════════════════════════════════════════
// Complaints & Compliments Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateComplaintCompliance,
  calculateComplaintsMetrics,
  getCategoryLabel,
  getStageLabel,
  getOutcomeLabel,
} from "../complaints-engine";
import type { Complaint, Compliment } from "../complaints-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeComplaint(overrides: Partial<Complaint> = {}): Complaint {
  return {
    id: "comp-001",
    homeId: "home-oak",
    title: "Food quality concern",
    description: "Meals repetitive and lacking variety",
    category: "food_nutrition",
    stage: "stage_1",
    status: "resolved",
    complainantType: "child",
    childId: "child-001",
    childName: "Jordan Williams",
    receivedAt: "2026-05-01T10:00:00Z",
    acknowledgedAt: "2026-05-02T09:00:00Z",
    investigatorAssigned: "staff-rm-01",
    targetResponseDate: "2026-05-15T10:00:00Z",
    resolvedAt: "2026-05-10T14:00:00Z",
    outcome: "upheld",
    outcomeDescription: "Menu variety improved, children consulted on choices",
    actionsTaken: ["Menu review", "Children consulted", "New supplier engaged"],
    lessonsLearned: "Regular menu consultation with children should be embedded",
    complainantSatisfied: true,
    ofstedNotified: false,
    loggedBy: "staff-rm-01",
    ...overrides,
  };
}

function makeCompliment(overrides: Partial<Compliment> = {}): Compliment {
  return {
    id: "cmpl-001",
    homeId: "home-oak",
    source: "parent_carer",
    sourceName: "Mrs Williams",
    description: "Thank you for the fantastic birthday celebration for Jordan",
    category: "care_quality",
    receivedAt: "2026-05-05T10:00:00Z",
    sharedWithTeam: true,
    loggedBy: "staff-001",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateComplaintCompliance", () => {
  it("marks fully compliant resolved complaint", () => {
    const result = evaluateComplaintCompliance(makeComplaint(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.acknowledgedOnTime).toBe(true);
    expect(result.respondedOnTime).toBe(true);
  });

  it("flags late acknowledgement", () => {
    const complaint = makeComplaint({
      receivedAt: "2026-05-01T10:00:00Z",
      acknowledgedAt: "2026-05-06T10:00:00Z", // 5 days later
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.acknowledgedOnTime).toBe(false);
    expect(result.warnings.some(w => w.includes("Acknowledgement"))).toBe(true);
  });

  it("flags missing acknowledgement past deadline", () => {
    const complaint = makeComplaint({
      receivedAt: "2026-05-01T10:00:00Z",
      acknowledgedAt: undefined,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.acknowledgedOnTime).toBe(false);
    expect(result.issues.some(i => i.includes("not acknowledged"))).toBe(true);
  });

  it("flags overdue response", () => {
    const complaint = makeComplaint({
      status: "investigating",
      targetResponseDate: "2026-05-10T10:00:00Z",
      resolvedAt: undefined,
      outcome: undefined,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.respondedOnTime).toBe(false);
    expect(result.issues.some(i => i.includes("overdue"))).toBe(true);
  });

  it("flags resolved without outcome", () => {
    const complaint = makeComplaint({
      status: "resolved",
      outcome: undefined,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.outcomeRecorded).toBe(false);
    expect(result.issues.some(i => i.includes("outcome"))).toBe(true);
  });

  it("flags Stage 2 without Ofsted notification", () => {
    const complaint = makeComplaint({
      stage: "stage_2",
      ofstedNotified: false,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.ofstedNotifiedIfRequired).toBe(false);
    expect(result.issues.some(i => i.includes("Ofsted"))).toBe(true);
  });

  it("passes Stage 2 with Ofsted notification", () => {
    const complaint = makeComplaint({
      stage: "stage_2",
      ofstedNotified: true,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.ofstedNotifiedIfRequired).toBe(true);
  });

  it("calculates days to resolve", () => {
    const complaint = makeComplaint({
      receivedAt: "2026-05-01T10:00:00Z",
      resolvedAt: "2026-05-08T10:00:00Z",
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.daysToResolve).toBe(7);
  });

  it("does not require Ofsted notification for Stage 1", () => {
    const complaint = makeComplaint({
      stage: "stage_1",
      ofstedNotified: false,
    });
    const result = evaluateComplaintCompliance(complaint, NOW);
    expect(result.ofstedNotifiedIfRequired).toBe(true); // not required at stage 1
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateComplaintsMetrics", () => {
  it("calculates basic metrics", () => {
    const complaints = [
      makeComplaint(),
      makeComplaint({ id: "comp-002", category: "staff_conduct" }),
    ];
    const compliments = [makeCompliment()];
    const result = calculateComplaintsMetrics(complaints, compliments, "home-oak", NOW);

    expect(result.totalComplaints).toBe(2);
    expect(result.totalCompliments).toBe(1);
    expect(result.byCategory.length).toBe(2);
  });

  it("counts open and overdue complaints", () => {
    const complaints = [
      makeComplaint({ status: "investigating", targetResponseDate: "2026-05-10T10:00:00Z", resolvedAt: undefined, outcome: undefined }),
      makeComplaint({ id: "comp-002", status: "open", targetResponseDate: "2026-05-20T10:00:00Z", resolvedAt: undefined, outcome: undefined }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);

    expect(result.openComplaints).toBe(2);
    expect(result.overdueComplaints).toBe(1); // only the one past target
  });

  it("calculates average days to resolve", () => {
    const complaints = [
      makeComplaint({ receivedAt: "2026-05-01T00:00:00Z", resolvedAt: "2026-05-05T00:00:00Z" }),
      makeComplaint({ id: "comp-002", receivedAt: "2026-05-01T00:00:00Z", resolvedAt: "2026-05-11T00:00:00Z" }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.averageDaysToResolve).toBe(7); // (4 + 10) / 2 = 7
  });

  it("calculates child complaints rate", () => {
    const complaints = [
      makeComplaint({ complainantType: "child" }),
      makeComplaint({ id: "comp-002", complainantType: "child" }),
      makeComplaint({ id: "comp-003", complainantType: "parent_carer" }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.childComplaintsRate).toBe(67);
  });

  it("calculates satisfaction rate", () => {
    const complaints = [
      makeComplaint({ complainantSatisfied: true }),
      makeComplaint({ id: "comp-002", complainantSatisfied: true }),
      makeComplaint({ id: "comp-003", complainantSatisfied: false }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.satisfactionRate).toBe(67);
  });

  it("calculates escalation rate", () => {
    const complaints = [
      makeComplaint({ stage: "stage_1" }),
      makeComplaint({ id: "comp-002", stage: "stage_2" }),
      makeComplaint({ id: "comp-003", stage: "stage_1" }),
      makeComplaint({ id: "comp-004", stage: "stage_3_panel" }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.escalationRate).toBe(50);
  });

  it("calculates lessons learned rate", () => {
    const complaints = [
      makeComplaint({ lessonsLearned: "Improve menu variety" }),
      makeComplaint({ id: "comp-002", lessonsLearned: undefined }),
      makeComplaint({ id: "comp-003", lessonsLearned: "Better communication needed" }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.lessonsLearnedRate).toBe(67);
  });

  it("filters by homeId", () => {
    const complaints = [
      makeComplaint({ homeId: "home-oak" }),
      makeComplaint({ id: "comp-002", homeId: "home-other" }),
    ];
    const result = calculateComplaintsMetrics(complaints, [], "home-oak", NOW);
    expect(result.totalComplaints).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getCategoryLabel returns readable labels", () => {
    expect(getCategoryLabel("care_quality")).toBe("Quality of Care");
    expect(getCategoryLabel("staff_conduct")).toBe("Staff Conduct");
    expect(getCategoryLabel("restraint")).toBe("Restraint/PI");
  });

  it("getStageLabel returns readable labels", () => {
    expect(getStageLabel("informal")).toBe("Informal");
    expect(getStageLabel("stage_1")).toBe("Stage 1 (Formal)");
    expect(getStageLabel("stage_2")).toBe("Stage 2 (Independent)");
  });

  it("getOutcomeLabel returns readable labels", () => {
    expect(getOutcomeLabel("upheld")).toBe("Upheld");
    expect(getOutcomeLabel("partially_upheld")).toBe("Partially Upheld");
  });
});
