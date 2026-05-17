// ══════════════════════════════════════════════════════════════════════════════
// Restraint & Physical Intervention Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateRestraintCompliance,
  calculateHomeRestraintMetrics,
  getInterventionTypeLabel,
  getDeEscalationLabel,
} from "../restraint-engine";
import type {
  RestraintRecord,
  HomeRestraintProfile,
  PostIncidentRecord,
} from "../restraint-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makePostIncidentActions(overrides: Partial<Record<string, boolean>> = {}): PostIncidentRecord[] {
  return [
    { action: "child_debrief", completed: overrides.childDebrief ?? true, completedDate: "2026-05-14T10:00:00Z" },
    { action: "staff_debrief", completed: overrides.staffDebrief ?? true, completedDate: "2026-05-14T14:00:00Z" },
    { action: "medical_check", completed: overrides.medicalCheck ?? true, completedDate: "2026-05-13T21:00:00Z" },
    { action: "body_map_completed", completed: true, completedDate: "2026-05-13T21:00:00Z" },
    { action: "written_record_completed", completed: true, completedDate: "2026-05-14T08:00:00Z" },
    { action: "child_account_recorded", completed: overrides.childAccount ?? true, completedDate: "2026-05-14T11:00:00Z" },
  ];
}

function makeRecord(overrides: Partial<RestraintRecord> = {}): RestraintRecord {
  return {
    id: "rr-001",
    homeId: "home-oak",
    childId: "child-casey",
    childName: "Casey Brown",
    date: "2026-05-13T00:00:00Z",
    startTime: "2026-05-13T19:45:00Z",
    endTime: "2026-05-13T19:52:00Z",
    durationMinutes: 7,
    interventionType: "physical_restraint",
    technique: "team_teach",
    staffInvolved: [
      { staffId: "staff-rm-01", staffName: "Darren Laville", role: "lead", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
      { staffId: "staff-sw-01", staffName: "Sarah Wilson", role: "support", certificationValid: true, certificationExpiry: "2027-03-15T00:00:00Z" },
    ],
    trigger: "Frustration over denied screen time",
    antecedent: "Casey asked for extra gaming time, told no due to school night. Escalated verbally, then began throwing objects.",
    deEscalationAttempted: ["verbal_reassurance", "offered_space", "choices_offered", "reduced_demands"],
    deEscalationDuration: 12,
    reasonForIntervention: "Casey began throwing hard objects towards other child — immediate risk of injury to peer",
    proportionalityJustification: "Physical intervention was necessary to prevent injury to another child. Less restrictive approaches had been attempted for 12 minutes. Intervention ceased as soon as Casey was calm and risk had passed.",
    childPresentation: "Initially very agitated, shouting. Calmed within 5 minutes of hold. Tearful after.",
    positionUsed: "Single elbow — standing, guided to floor when legs gave way",
    injuries: [],
    postIncidentActions: makePostIncidentActions(),
    childDebriefDate: "2026-05-14T10:00:00Z",
    childAccount: "I was angry because I wanted to play my game. I know I shouldnt have thrown things.",
    staffDebriefDate: "2026-05-14T14:00:00Z",
    medicalCheckDate: "2026-05-13T20:00:00Z",
    medicalCheckOutcome: "No injuries identified",
    parentNotified: true,
    parentNotifiedDate: "2026-05-14T09:00:00Z",
    socialWorkerNotified: true,
    socialWorkerNotifiedDate: "2026-05-14T09:30:00Z",
    ofstedNotified: false,
    recordCompletedWithin24Hours: true,
    recordedBy: "staff-rm-01",
    authorisedBy: "staff-rm-01",
    ...overrides,
  };
}

function makeProfile(overrides: Partial<HomeRestraintProfile> = {}): HomeRestraintProfile {
  return {
    homeId: "home-oak",
    restraintRecords: [
      makeRecord({ id: "rr-001", date: "2026-05-13T00:00:00Z", startTime: "2026-05-13T19:45:00Z" }),
      makeRecord({ id: "rr-002", date: "2026-04-28T00:00:00Z", startTime: "2026-04-28T17:30:00Z", childName: "Alex Turner", childId: "child-alex", durationMinutes: 4, trigger: "Conflict with peer", deEscalationDuration: 8 }),
      makeRecord({ id: "rr-003", date: "2026-04-15T00:00:00Z", startTime: "2026-04-15T18:00:00Z", childName: "Casey Brown", durationMinutes: 5, trigger: "Frustration over denied screen time" }),
      makeRecord({ id: "rr-004", date: "2026-03-20T00:00:00Z", startTime: "2026-03-20T20:00:00Z", childName: "Casey Brown", durationMinutes: 10, trigger: "Refusal to go to bed" }),
    ],
    reductionTarget: 10,
    approvedTechnique: "team_teach",
    lastPolicyReviewDate: "2026-04-01T10:00:00Z",
    debriefProtocolInPlace: true,
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Single Restraint Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateRestraintCompliance", () => {
  it("marks compliant restraint record", () => {
    const result = evaluateRestraintCompliance(makeRecord(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.deEscalationEvidenced).toBe(true);
    expect(result.proportionalityJustified).toBe(true);
    expect(result.allStaffCertified).toBe(true);
    expect(result.childDebriefCompleted).toBe(true);
    expect(result.medicalCheckCompleted).toBe(true);
  });

  it("flags no de-escalation attempted", () => {
    const record = makeRecord({ deEscalationAttempted: [], deEscalationDuration: 0 });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.deEscalationEvidenced).toBe(false);
    expect(result.issues.some(i => i.includes("No de-escalation"))).toBe(true);
  });

  it("warns about very brief de-escalation", () => {
    const record = makeRecord({ deEscalationDuration: 1 });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.warnings.some(w => w.includes("brief de-escalation"))).toBe(true);
  });

  it("flags proportionality not justified", () => {
    const record = makeRecord({ proportionalityJustification: "needed" });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.proportionalityJustified).toBe(false);
    expect(result.issues.some(i => i.includes("Proportionality"))).toBe(true);
  });

  it("flags uncertified staff", () => {
    const record = makeRecord({
      staffInvolved: [
        { staffId: "s1", staffName: "A", role: "lead", certificationValid: false },
        { staffId: "s2", staffName: "B", role: "support", certificationValid: true, certificationExpiry: "2027-01-01" },
      ],
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.allStaffCertified).toBe(false);
    expect(result.issues.some(i => i.includes("without valid restraint certification"))).toBe(true);
  });

  it("flags child debrief not completed", () => {
    const record = makeRecord({
      postIncidentActions: makePostIncidentActions({ childDebrief: false }),
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.childDebriefCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("Child debrief"))).toBe(true);
  });

  it("warns about staff debrief not completed", () => {
    const record = makeRecord({
      postIncidentActions: makePostIncidentActions({ staffDebrief: false }),
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.staffDebriefCompleted).toBe(false);
    expect(result.warnings.some(w => w.includes("Staff debrief"))).toBe(true);
  });

  it("flags medical check not completed", () => {
    const record = makeRecord({
      postIncidentActions: makePostIncidentActions({ medicalCheck: false }),
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.medicalCheckCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("Medical check"))).toBe(true);
  });

  it("flags parent not notified", () => {
    const record = makeRecord({ parentNotified: false });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.notificationsComplete).toBe(false);
    expect(result.issues.some(i => i.includes("Parent"))).toBe(true);
  });

  it("flags social worker not notified", () => {
    const record = makeRecord({ socialWorkerNotified: false });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.issues.some(i => i.includes("Social worker"))).toBe(true);
  });

  it("warns about late record completion", () => {
    const record = makeRecord({ recordCompletedWithin24Hours: false });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.recordedTimely).toBe(false);
    expect(result.warnings.some(w => w.includes("24 hours"))).toBe(true);
  });

  it("warns about child account not recorded", () => {
    const record = makeRecord({
      postIncidentActions: makePostIncidentActions({ childAccount: false }),
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.childAccountRecorded).toBe(false);
    expect(result.warnings.some(w => w.includes("Child's own account"))).toBe(true);
  });

  it("flags injury without body map", () => {
    const record = makeRecord({
      injuries: [{ person: "child", personName: "Casey", description: "Red mark on wrist", bodyMapCompleted: false, medicalAttentionRequired: false }],
    });
    const result = evaluateRestraintCompliance(record, NOW);
    expect(result.issues.some(i => i.includes("body map"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Restraint Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeRestraintMetrics", () => {
  it("calculates metrics for home", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.totalRestraints30Days).toBe(2); // May 13 and Apr 28 both within 30 days
    expect(result.totalRestraints90Days).toBe(4);
    expect(result.averagePerMonth).toBe(1.3);
    expect(result.overallComplianceRate).toBe(100);
  });

  it("calculates de-escalation rate", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.deEscalationRate).toBe(100);
  });

  it("calculates average duration", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.averageDuration).toBe(7); // (7+4+5+10)/4 = 6.5 → rounds to 7
  });

  it("identifies incidents by child", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.incidentsByChild.length).toBeGreaterThan(0);
    expect(result.incidentsByChild[0].childName).toBe("Casey Brown");
  });

  it("identifies common triggers", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.commonTriggers.length).toBeGreaterThan(0);
  });

  it("calculates time of day patterns", () => {
    const result = calculateHomeRestraintMetrics(makeProfile(), NOW);
    expect(result.incidentsByTimeOfDay.length).toBe(4);
    // Most should be evening (17:30, 18:00, 19:45, 20:00)
    const evening = result.incidentsByTimeOfDay.find(t => t.period === "evening");
    expect(evening).toBeDefined();
    expect(evening!.count).toBeGreaterThan(0);
  });

  it("calculates reduction achievement", () => {
    const profileWithHistory = makeProfile({
      restraintRecords: [
        // Current period (last 90 days) — 2 records
        makeRecord({ id: "rr-1", date: "2026-05-10T00:00:00Z", startTime: "2026-05-10T18:00:00Z" }),
        makeRecord({ id: "rr-2", date: "2026-04-20T00:00:00Z", startTime: "2026-04-20T18:00:00Z" }),
        // Previous period (90-180 days ago) — 4 records
        makeRecord({ id: "rr-3", date: "2026-02-10T00:00:00Z", startTime: "2026-02-10T18:00:00Z" }),
        makeRecord({ id: "rr-4", date: "2026-01-25T00:00:00Z", startTime: "2026-01-25T18:00:00Z" }),
        makeRecord({ id: "rr-5", date: "2026-01-15T00:00:00Z", startTime: "2026-01-15T18:00:00Z" }),
        makeRecord({ id: "rr-6", date: "2025-12-20T00:00:00Z", startTime: "2025-12-20T18:00:00Z" }),
      ],
    });
    const result = calculateHomeRestraintMetrics(profileWithHistory, NOW);
    expect(result.reductionAchieved).toBe(50); // 4 → 2 = 50% reduction
    expect(result.onTarget).toBe(true); // target is 10%
  });

  it("handles empty records", () => {
    const profile = makeProfile({ restraintRecords: [] });
    const result = calculateHomeRestraintMetrics(profile, NOW);
    expect(result.totalRestraints30Days).toBe(0);
    expect(result.overallComplianceRate).toBe(100);
    expect(result.averageDuration).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getInterventionTypeLabel returns readable labels", () => {
    expect(getInterventionTypeLabel("physical_restraint")).toBe("Physical Restraint");
    expect(getInterventionTypeLabel("guided_away")).toBe("Guided Away");
  });

  it("getDeEscalationLabel returns readable labels", () => {
    expect(getDeEscalationLabel("pace_approach")).toBe("PACE Approach");
    expect(getDeEscalationLabel("offered_space")).toBe("Offered Space");
  });
});
