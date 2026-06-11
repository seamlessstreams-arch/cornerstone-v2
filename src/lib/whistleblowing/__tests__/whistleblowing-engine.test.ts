// ══════════════════════════════════════════════════════════════════════════════
// Cara — Whistleblowing & Professional Courage Engine Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateConcernHandling,
  evaluatePolicyCompliance,
  evaluateProfessionalCourage,
  evaluateStaffAwareness,
  evaluateCulture,
  generateWhistleblowingIntelligence,
  getConcernCategoryLabel,
  getConcernStatusLabel,
  getRaisedWithLabel,
  getChallengeTypeLabel,
} from "../whistleblowing-engine";
import type {
  WhistleblowingConcern,
  WhistleblowingPolicy,
  ProfessionalCourageRecord,
  StaffAwarenessRecord,
  CultureIndicator,
} from "../whistleblowing-engine";

// ── Demo Data ────────────────────────────────────────────────────────────────

const STAFF_IDS = ["sarah", "tom", "lisa", "darren"];

const demoConcerns: WhistleblowingConcern[] = [
  {
    id: "wc-01", homeId: "oak-house", raisedDate: "2025-02-10",
    raisedBy: "Tom Richards", anonymous: false, category: "poor_practice",
    description: "Concern about inconsistent bedtime routines",
    raisedWith: "registered_manager", status: "resolved",
    acknowledgedDate: "2025-02-11", investigationStartDate: "2025-02-12",
    resolvedDate: "2025-02-25", outcome: "concern_upheld",
    actionsTaken: ["Staff briefing on bedtime procedures", "Updated routine guidance"],
    feedbackToWhistleblower: true, protectionStatus: "no_detriment",
    escalated: false, lessonsLearned: "Importance of consistent routines",
  },
  {
    id: "wc-02", homeId: "oak-house", raisedDate: "2025-04-05",
    raisedBy: "anonymous", anonymous: true, category: "medication_error",
    description: "Concern about PRN medication being given without proper recording",
    raisedWith: "registered_manager", status: "resolved",
    acknowledgedDate: "2025-04-06", investigationStartDate: "2025-04-07",
    resolvedDate: "2025-04-20", outcome: "partially_upheld",
    actionsTaken: ["Medication audit", "Refresher training", "New PRN protocol"],
    feedbackToWhistleblower: true, protectionStatus: "no_detriment",
    escalated: false,
  },
  {
    id: "wc-03", homeId: "oak-house", raisedDate: "2025-05-20",
    raisedBy: "Lisa Williams", anonymous: false, category: "safeguarding",
    description: "Concern about agency staff member's behaviour towards a child",
    raisedWith: "registered_manager", status: "escalated",
    acknowledgedDate: "2025-05-20", investigationStartDate: "2025-05-21",
    outcome: "ongoing", actionsTaken: ["Agency staff removed", "LADO referral made"],
    feedbackToWhistleblower: true, protectionStatus: "no_detriment",
    escalated: true, escalatedTo: "LADO",
  },
];

const demoPolicy: WhistleblowingPolicy = {
  id: "pol-01", homeId: "oak-house", policyVersion: "3.1",
  lastReviewDate: "2025-01-15", nextReviewDate: "2026-01-15",
  status: "current", coversAnonymousReporting: true,
  coversExternalReporting: true, coversProtectionFromDetriment: true,
  coversEscalationProcess: true, accessibleToAllStaff: true,
  staffSignedAwareness: 4, totalStaff: 4,
};

const demoCourage: ProfessionalCourageRecord[] = [
  {
    id: "pc-01", staffId: "tom", staffName: "Tom Richards",
    date: "2025-02-10", context: "Observed inconsistent bedtime practice",
    action: "Raised concern through formal whistleblowing process",
    challengeType: "practice_concern", outcome: "positive_change",
    supportedByManagement: true, documentedInSupervision: true,
  },
  {
    id: "pc-02", staffId: "lisa", staffName: "Lisa Williams",
    date: "2025-03-15", context: "Disagreed with approach to managing Jordan's contact",
    action: "Challenged decision in team meeting with evidence",
    challengeType: "management_decision", outcome: "acknowledged_no_change",
    supportedByManagement: true, documentedInSupervision: true,
  },
  {
    id: "pc-03", staffId: "sarah", staffName: "Sarah Johnson",
    date: "2025-04-01", context: "Social worker not responding to emails about Morgan",
    action: "Escalated to team manager with documented timeline",
    challengeType: "multi_agency_challenge", outcome: "positive_change",
    supportedByManagement: true, documentedInSupervision: true,
  },
  {
    id: "pc-04", staffId: "lisa", staffName: "Lisa Williams",
    date: "2025-05-20", context: "Agency staff member's inappropriate behaviour",
    action: "Immediately reported safeguarding concern to RM",
    challengeType: "safeguarding_alert", outcome: "escalated",
    supportedByManagement: true, documentedInSupervision: true,
  },
  {
    id: "pc-05", staffId: "tom", staffName: "Tom Richards",
    date: "2025-05-25", context: "Staff member not following PBS strategies",
    action: "Raised in supervision with specific examples",
    challengeType: "peer_behaviour", outcome: "positive_change",
    supportedByManagement: true, documentedInSupervision: false,
  },
  {
    id: "pc-06", staffId: "darren", staffName: "Darren Laville",
    date: "2025-06-01", context: "Challenged placing authority on inadequate referral information",
    action: "Formally requested additional information before proceeding",
    challengeType: "multi_agency_challenge", outcome: "positive_change",
    supportedByManagement: true, documentedInSupervision: true,
  },
];

const demoAwareness: StaffAwarenessRecord[] = [
  { id: "sa-01", staffId: "sarah", staffName: "Sarah Johnson", trainingDate: "2025-01-20", trainingType: "refresher", knowsHowToReport: true, knowsExternalRoutes: true, feelsConfidentToRaise: true, understandsProtection: true },
  { id: "sa-02", staffId: "tom", staffName: "Tom Richards", trainingDate: "2025-01-20", trainingType: "refresher", knowsHowToReport: true, knowsExternalRoutes: true, feelsConfidentToRaise: true, understandsProtection: true },
  { id: "sa-03", staffId: "lisa", staffName: "Lisa Williams", trainingDate: "2025-01-20", trainingType: "refresher", knowsHowToReport: true, knowsExternalRoutes: true, feelsConfidentToRaise: true, understandsProtection: true },
  { id: "sa-04", staffId: "darren", staffName: "Darren Laville", trainingDate: "2025-01-20", trainingType: "refresher", knowsHowToReport: true, knowsExternalRoutes: true, feelsConfidentToRaise: true, understandsProtection: true },
];

const demoCulture: CultureIndicator[] = [
  { id: "ci-01", homeId: "oak-house", date: "2025-01-15", source: "staff_survey", opennesScore: 8, trustInManagement: 9, confidenceToChallenge: 8, fearOfReprisal: 2, respondentCount: 4, themes: ["open door policy valued", "team support strong"] },
  { id: "ci-02", homeId: "oak-house", date: "2025-04-15", source: "annual_review", opennesScore: 9, trustInManagement: 9, confidenceToChallenge: 9, fearOfReprisal: 1, respondentCount: 4, themes: ["professional challenge celebrated", "trust in leadership"] },
];

const REF_DATE = "2025-06-15";

// ══════════════════════════════════════════════════════════════════════════════
// Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateConcernHandling", () => {
  it("returns total concerns", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.totalConcerns).toBe(3);
  });

  it("calculates category breakdown", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.categoryBreakdown.poor_practice).toBe(1);
    expect(result.categoryBreakdown.medication_error).toBe(1);
    expect(result.categoryBreakdown.safeguarding).toBe(1);
  });

  it("calculates status breakdown", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.statusBreakdown.resolved).toBe(2);
    expect(result.statusBreakdown.escalated).toBe(1);
  });

  it("calculates average acknowledgement days", () => {
    const result = evaluateConcernHandling(demoConcerns);
    // wc-01: 1 day, wc-02: 1 day, wc-03: 0 days → avg 0.7
    expect(result.averageAcknowledgementDays).toBeLessThanOrEqual(1);
  });

  it("calculates average resolution days", () => {
    const result = evaluateConcernHandling(demoConcerns);
    // wc-01: 15 days, wc-02: 15 days → avg 15
    expect(result.averageResolutionDays).toBe(15);
  });

  it("calculates feedback rate", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.feedbackRate).toBe(100); // All 3 received feedback
  });

  it("calculates protection rate", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.protectionRate).toBe(100); // All no_detriment
  });

  it("calculates escalation rate", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.escalationRate).toBe(33); // 1/3
  });

  it("provides outcome breakdown", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.outcomeBreakdown.concern_upheld).toBe(1);
    expect(result.outcomeBreakdown.partially_upheld).toBe(1);
    expect(result.outcomeBreakdown.ongoing).toBe(1);
  });

  it("returns score > 0", () => {
    const result = evaluateConcernHandling(demoConcerns);
    expect(result.overallScore).toBeGreaterThan(0);
  });

  it("handles empty concerns", () => {
    const result = evaluateConcernHandling([]);
    expect(result.totalConcerns).toBe(0);
    expect(result.overallScore).toBe(0);
  });

  it("penalises slow acknowledgement", () => {
    const slow: WhistleblowingConcern[] = [{
      id: "s1", homeId: "test", raisedDate: "2025-01-01",
      raisedBy: "Staff", anonymous: false, category: "other",
      description: "Test", raisedWith: "line_manager", status: "resolved",
      acknowledgedDate: "2025-01-15", // 14 days!
      resolvedDate: "2025-02-01",
      actionsTaken: [], feedbackToWhistleblower: true,
      protectionStatus: "no_detriment", escalated: false,
    }];
    const fast: WhistleblowingConcern[] = [{
      ...slow[0], id: "f1", acknowledgedDate: "2025-01-02", // 1 day
    }];
    const slowResult = evaluateConcernHandling(slow);
    const fastResult = evaluateConcernHandling(fast);
    expect(fastResult.overallScore).toBeGreaterThan(slowResult.overallScore);
  });
});

describe("evaluatePolicyCompliance", () => {
  it("identifies current policy", () => {
    const result = evaluatePolicyCompliance(demoPolicy, REF_DATE);
    expect(result.policyCurrent).toBe(true);
  });

  it("calculates coverage score", () => {
    const result = evaluatePolicyCompliance(demoPolicy, REF_DATE);
    expect(result.coverageScore).toBe(100); // All 5 areas covered
  });

  it("calculates staff awareness rate", () => {
    const result = evaluatePolicyCompliance(demoPolicy, REF_DATE);
    expect(result.staffAwarenessRate).toBe(100);
  });

  it("returns high score for comprehensive current policy", () => {
    const result = evaluatePolicyCompliance(demoPolicy, REF_DATE);
    expect(result.overallScore).toBe(100);
  });

  it("handles null policy", () => {
    const result = evaluatePolicyCompliance(null, REF_DATE);
    expect(result.policyCurrent).toBe(false);
    expect(result.overallScore).toBe(0);
  });

  it("identifies expired policy", () => {
    const expired: WhistleblowingPolicy = {
      ...demoPolicy, status: "expired", nextReviewDate: "2024-12-01",
    };
    const result = evaluatePolicyCompliance(expired, REF_DATE);
    expect(result.policyCurrent).toBe(false);
  });

  it("penalises partial coverage", () => {
    const partial: WhistleblowingPolicy = {
      ...demoPolicy,
      coversAnonymousReporting: false,
      coversProtectionFromDetriment: false,
    };
    const result = evaluatePolicyCompliance(partial, REF_DATE);
    expect(result.coverageScore).toBe(50);
    expect(result.overallScore).toBeLessThan(100);
  });

  it("penalises low staff awareness", () => {
    const low: WhistleblowingPolicy = {
      ...demoPolicy, staffSignedAwareness: 2, totalStaff: 4,
    };
    const result = evaluatePolicyCompliance(low, REF_DATE);
    expect(result.staffAwarenessRate).toBe(50);
    expect(result.overallScore).toBeLessThan(100);
  });
});

describe("evaluateProfessionalCourage", () => {
  it("returns total records", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    expect(result.totalRecords).toBe(6);
  });

  it("calculates challenge type breakdown", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    expect(result.challengeTypeBreakdown.multi_agency_challenge).toBe(2);
    expect(result.challengeTypeBreakdown.practice_concern).toBe(1);
    expect(result.challengeTypeBreakdown.safeguarding_alert).toBe(1);
    expect(result.challengeTypeBreakdown.peer_behaviour).toBe(1);
    expect(result.challengeTypeBreakdown.management_decision).toBe(1);
  });

  it("calculates positive outcome rate", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    // pc-01: positive, pc-02: acknowledged, pc-03: positive, pc-04: escalated, pc-05: positive, pc-06: positive
    // positive+acknowledged = 5/6 = 83%
    expect(result.positiveOutcomeRate).toBe(83);
  });

  it("calculates management support rate", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    expect(result.managementSupportRate).toBe(100); // All supported
  });

  it("calculates documented in supervision rate", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    // 5/6 = 83% (pc-05 not documented)
    expect(result.documentedInSupervisionRate).toBe(83);
  });

  it("counts staff engaged", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    expect(result.staffEngaged).toBe(4); // All 4 staff
  });

  it("returns score > 0", () => {
    const result = evaluateProfessionalCourage(demoCourage);
    expect(result.overallScore).toBeGreaterThan(0);
  });

  it("handles empty records", () => {
    const result = evaluateProfessionalCourage([]);
    expect(result.totalRecords).toBe(0);
    expect(result.overallScore).toBe(0);
  });
});

describe("evaluateStaffAwareness", () => {
  it("returns total assessments", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.totalAssessments).toBe(4);
  });

  it("counts staff assessed", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.staffAssessed).toBe(4);
  });

  it("calculates knows how to report rate", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.knowsHowToReportRate).toBe(100);
  });

  it("calculates knows external routes rate", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.knowsExternalRoutesRate).toBe(100);
  });

  it("calculates feels confident rate", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.feelsConfidentRate).toBe(100);
  });

  it("calculates understands protection rate", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.understandsProtectionRate).toBe(100);
  });

  it("returns high score for perfect awareness", () => {
    const result = evaluateStaffAwareness(demoAwareness, STAFF_IDS);
    expect(result.overallScore).toBe(100);
  });

  it("handles empty records", () => {
    const result = evaluateStaffAwareness([], STAFF_IDS);
    expect(result.overallScore).toBe(0);
  });

  it("handles empty staff IDs", () => {
    const result = evaluateStaffAwareness(demoAwareness, []);
    expect(result.overallScore).toBe(0);
  });

  it("picks latest assessment per staff", () => {
    const records: StaffAwarenessRecord[] = [
      { id: "old", staffId: "sarah", staffName: "Sarah", trainingDate: "2024-01-01", trainingType: "induction", knowsHowToReport: false, knowsExternalRoutes: false, feelsConfidentToRaise: false, understandsProtection: false },
      { id: "new", staffId: "sarah", staffName: "Sarah", trainingDate: "2025-06-01", trainingType: "refresher", knowsHowToReport: true, knowsExternalRoutes: true, feelsConfidentToRaise: true, understandsProtection: true },
    ];
    const result = evaluateStaffAwareness(records, ["sarah"]);
    expect(result.knowsHowToReportRate).toBe(100);
  });

  it("penalises partial awareness", () => {
    const partial: StaffAwarenessRecord[] = [
      { id: "p1", staffId: "sarah", staffName: "Sarah", trainingDate: "2025-01-01", trainingType: "induction", knowsHowToReport: true, knowsExternalRoutes: false, feelsConfidentToRaise: false, understandsProtection: true },
    ];
    const result = evaluateStaffAwareness(partial, ["sarah"]);
    expect(result.overallScore).toBeLessThan(100);
    expect(result.knowsExternalRoutesRate).toBe(0);
    expect(result.feelsConfidentRate).toBe(0);
  });
});

describe("evaluateCulture", () => {
  it("returns total indicators", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.totalIndicators).toBe(2);
  });

  it("calculates average openness", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.averageOpenness).toBe(8.5);
  });

  it("calculates average trust", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.averageTrust).toBe(9);
  });

  it("calculates average confidence", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.averageConfidence).toBe(8.5);
  });

  it("calculates average fear of reprisal", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.averageFearOfReprisal).toBe(1.5);
  });

  it("detects improving trend", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.improvingTrend).toBe(true); // Jan: 8, Apr: 9
  });

  it("collects unique themes", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.themes.length).toBeGreaterThan(0);
    expect(result.themes).toContain("professional challenge celebrated");
  });

  it("returns high score for positive culture", () => {
    const result = evaluateCulture(demoCulture);
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
  });

  it("handles empty indicators", () => {
    const result = evaluateCulture([]);
    expect(result.totalIndicators).toBe(0);
    expect(result.overallScore).toBe(0);
  });

  it("gives low score for high fear culture", () => {
    const bad: CultureIndicator[] = [{
      id: "b1", homeId: "test", date: "2025-01-01", source: "staff_survey",
      opennesScore: 3, trustInManagement: 2, confidenceToChallenge: 2,
      fearOfReprisal: 9, respondentCount: 4, themes: ["fear of consequences"],
    }];
    const result = evaluateCulture(bad);
    expect(result.overallScore).toBeLessThan(30);
  });
});

describe("generateWhistleblowingIntelligence", () => {
  const result = generateWhistleblowingIntelligence(
    demoConcerns, demoPolicy, demoCourage, demoAwareness, demoCulture,
    STAFF_IDS, "oak-house", "2025-01-01", "2025-06-30", REF_DATE,
  );

  it("returns correct homeId", () => {
    expect(result.homeId).toBe("oak-house");
  });

  it("returns overall score between 0 and 100", () => {
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("returns valid rating", () => {
    expect(["outstanding", "good", "requires_improvement", "inadequate"]).toContain(result.rating);
  });

  it("includes concern handling results", () => {
    expect(result.concernHandling.totalConcerns).toBe(3);
  });

  it("includes policy compliance results", () => {
    expect(result.policyCompliance.policyCurrent).toBe(true);
  });

  it("includes professional courage results", () => {
    expect(result.professionalCourage.totalRecords).toBe(6);
  });

  it("includes staff awareness results", () => {
    expect(result.staffAwareness.staffAssessed).toBe(4);
  });

  it("includes culture results", () => {
    expect(result.culture.totalIndicators).toBe(2);
  });

  it("generates strengths", () => {
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("generates regulatory links", () => {
    expect(result.regulatoryLinks.length).toBeGreaterThan(0);
    expect(result.regulatoryLinks.some((l) => l.includes("Reg 13"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("Public Interest Disclosure Act"))).toBe(true);
  });

  it("demo data produces outstanding or good rating", () => {
    expect(["outstanding", "good"]).toContain(result.rating);
  });
});

describe("scoring thresholds", () => {
  it("returns inadequate for empty data", () => {
    const result = generateWhistleblowingIntelligence(
      [], null, [], [], [], STAFF_IDS,
      "test", "2025-01-01", "2025-06-30", REF_DATE,
    );
    expect(result.rating).toBe("inadequate");
    expect(result.overallScore).toBeLessThan(40);
  });

  it("handles no concerns scenario (redistributes weight)", () => {
    const result = generateWhistleblowingIntelligence(
      [], demoPolicy, demoCourage, demoAwareness, demoCulture,
      STAFF_IDS, "test", "2025-01-01", "2025-06-30", REF_DATE,
    );
    // With no concerns, weight shifts to proactive measures
    expect(result.overallScore).toBeGreaterThan(60);
  });
});

describe("label functions", () => {
  it("getConcernCategoryLabel returns correct labels", () => {
    expect(getConcernCategoryLabel("safeguarding")).toBe("Safeguarding");
    expect(getConcernCategoryLabel("poor_practice")).toBe("Poor Practice");
    expect(getConcernCategoryLabel("policy_breach")).toBe("Policy Breach");
    expect(getConcernCategoryLabel("health_and_safety")).toBe("Health & Safety");
    expect(getConcernCategoryLabel("medication_error")).toBe("Medication Error");
    expect(getConcernCategoryLabel("discrimination")).toBe("Discrimination");
    expect(getConcernCategoryLabel("financial_irregularity")).toBe("Financial Irregularity");
    expect(getConcernCategoryLabel("bullying")).toBe("Bullying");
    expect(getConcernCategoryLabel("neglect")).toBe("Neglect");
    expect(getConcernCategoryLabel("regulatory_breach")).toBe("Regulatory Breach");
    expect(getConcernCategoryLabel("data_protection")).toBe("Data Protection");
    expect(getConcernCategoryLabel("other")).toBe("Other");
  });

  it("getConcernStatusLabel returns correct labels", () => {
    expect(getConcernStatusLabel("raised")).toBe("Raised");
    expect(getConcernStatusLabel("acknowledged")).toBe("Acknowledged");
    expect(getConcernStatusLabel("under_investigation")).toBe("Under Investigation");
    expect(getConcernStatusLabel("resolved")).toBe("Resolved");
    expect(getConcernStatusLabel("escalated")).toBe("Escalated");
    expect(getConcernStatusLabel("closed_no_action")).toBe("Closed — No Action");
    expect(getConcernStatusLabel("withdrawn")).toBe("Withdrawn");
  });

  it("getRaisedWithLabel returns correct labels", () => {
    expect(getRaisedWithLabel("line_manager")).toBe("Line Manager");
    expect(getRaisedWithLabel("registered_manager")).toBe("Registered Manager");
    expect(getRaisedWithLabel("responsible_individual")).toBe("Responsible Individual");
    expect(getRaisedWithLabel("ofsted")).toBe("Ofsted");
    expect(getRaisedWithLabel("local_authority")).toBe("Local Authority");
    expect(getRaisedWithLabel("police")).toBe("Police");
    expect(getRaisedWithLabel("anonymous_hotline")).toBe("Anonymous Hotline");
  });

  it("getChallengeTypeLabel returns correct labels", () => {
    expect(getChallengeTypeLabel("practice_concern")).toBe("Practice Concern");
    expect(getChallengeTypeLabel("policy_disagreement")).toBe("Policy Disagreement");
    expect(getChallengeTypeLabel("safeguarding_alert")).toBe("Safeguarding Alert");
    expect(getChallengeTypeLabel("multi_agency_challenge")).toBe("Multi-Agency Challenge");
    expect(getChallengeTypeLabel("management_decision")).toBe("Management Decision");
    expect(getChallengeTypeLabel("peer_behaviour")).toBe("Peer Behaviour");
  });
});
