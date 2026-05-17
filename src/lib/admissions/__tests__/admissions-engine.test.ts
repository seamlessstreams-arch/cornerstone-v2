// ══════════════════════════════════════════════════════════════════════════════
// Admissions & Impact Assessment Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateReferralCompliance,
  calculateHomeAdmissionsMetrics,
  getMatchingFactorLabel,
  getImpactLevelLabel,
} from "../admissions-engine";
import type { AdmissionReferral, ImpactAssessment, MatchingScore } from "../admissions-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeMatchingScores(): MatchingScore[] {
  return [
    { factor: "age_compatibility", score: 4, rationale: "Within 2 years of existing children" },
    { factor: "gender_mix", score: 5, rationale: "Mixed home, balanced" },
    { factor: "risk_compatibility", score: 3, rationale: "Medium risk — manageable with existing group" },
    { factor: "needs_compatibility", score: 4, rationale: "Similar therapeutic needs, good group fit" },
    { factor: "peer_dynamics", score: 4, rationale: "No known conflicts, positive indicators" },
    { factor: "statement_of_purpose", score: 5, rationale: "Fully within SoP criteria" },
    { factor: "staff_skills", score: 4, rationale: "Staff trained in relevant areas" },
    { factor: "capacity", score: 5, rationale: "Bed available, within Ofsted registered number" },
  ];
}

function makeImpactAssessment(overrides: Partial<ImpactAssessment> = {}): ImpactAssessment {
  return {
    id: "ia-001",
    completedDate: "2026-05-02T14:00:00Z",
    completedBy: "staff-rm-01",
    overallImpactLevel: "low_concern",
    existingChildrenConsulted: true,
    childrenConsulted: ["Alex", "Jordan", "Sam", "Casey"],
    staffConsulted: true,
    riskAssessmentCompleted: true,
    childImpacts: [
      { childName: "Alex", childId: "child-alex", impactLevel: "neutral", considerations: ["Similar age"], childView: "Happy to have someone new", mitigations: [] },
      { childName: "Jordan", childId: "child-jordan", impactLevel: "low_concern", considerations: ["May compete for staff attention"], childView: "OK with it", mitigations: ["Increased keywork time for Jordan during transition"] },
      { childName: "Sam", childId: "child-sam", impactLevel: "positive", considerations: ["Similar interests, potential friendship"], childView: "Excited", mitigations: [] },
      { childName: "Casey", childId: "child-casey", impactLevel: "neutral", considerations: ["No concerns identified"], childView: "Doesnt mind", mitigations: [] },
    ],
    staffingAdequate: true,
    environmentSuitable: true,
    educationArranged: true,
    healthNeedsAssessable: true,
    mitigations: ["Enhanced supervision first 2 weeks", "Daily check-ins with all existing children"],
    conditions: ["School place confirmed before admission"],
    ...overrides,
  };
}

function makeReferral(overrides: Partial<AdmissionReferral> = {}): AdmissionReferral {
  return {
    id: "ref-001",
    homeId: "home-oak",
    referralDate: "2026-05-01T10:00:00Z",
    childName: "Riley Johnson",
    childAge: 13,
    childGender: "Male",
    placingAuthority: "Anyshire County Council",
    admissionType: "planned",
    status: "admitted",
    impactAssessment: makeImpactAssessment(),
    matchingScores: makeMatchingScores(),
    decisionDate: "2026-05-03T10:00:00Z",
    decisionBy: "staff-rm-01",
    decisionRationale: "Good match for existing group. Impact assessment shows low concerns with appropriate mitigations. School place secured. Within Statement of Purpose.",
    approvedByRI: true,
    admissionDate: "2026-05-07T14:00:00Z",
    postAdmissionReviewDate: "2026-05-09T10:00:00Z",
    postAdmissionReviewCompleted: true,
    welcomePlanInPlace: true,
    existingChildrenInformed: true,
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Referral Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateReferralCompliance", () => {
  it("marks compliant admission", () => {
    const result = evaluateReferralCompliance(makeReferral(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.impactAssessmentCompleted).toBe(true);
    expect(result.existingChildrenConsulted).toBe(true);
    expect(result.overallMatchScore).toBeGreaterThan(3);
    expect(result.riApproval).toBe(true);
    expect(result.postAdmissionReviewDone).toBe(true);
  });

  it("flags missing impact assessment", () => {
    const referral = makeReferral({ impactAssessment: undefined, status: "approved" });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.impactAssessmentCompleted).toBe(false);
    expect(result.issues.some(i => i.includes("Impact assessment not completed"))).toBe(true);
  });

  it("flags existing children not consulted", () => {
    const referral = makeReferral({
      impactAssessment: makeImpactAssessment({ existingChildrenConsulted: false }),
    });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.existingChildrenConsulted).toBe(false);
    expect(result.issues.some(i => i.includes("Existing children not consulted"))).toBe(true);
  });

  it("warns about low match score", () => {
    const lowScores: MatchingScore[] = [
      { factor: "age_compatibility", score: 2, rationale: "Large age gap" },
      { factor: "risk_compatibility", score: 2, rationale: "Conflicting risk profiles" },
      { factor: "peer_dynamics", score: 2, rationale: "Known conflict history" },
    ];
    const referral = makeReferral({ matchingScores: lowScores });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.overallMatchScore).toBe(2);
    expect(result.warnings.some(w => w.includes("Low overall match score"))).toBe(true);
  });

  it("flags decision not recorded", () => {
    const referral = makeReferral({ decisionDate: undefined, decisionRationale: undefined });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.decisionRecorded).toBe(false);
    expect(result.issues.some(i => i.includes("Decision not properly recorded"))).toBe(true);
  });

  it("flags RI approval not obtained", () => {
    const referral = makeReferral({ approvedByRI: false });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.riApproval).toBe(false);
    expect(result.issues.some(i => i.includes("Responsible Individual"))).toBe(true);
  });

  it("flags post-admission review not completed", () => {
    const referral = makeReferral({
      postAdmissionReviewCompleted: false,
      admissionDate: "2026-05-10T14:00:00Z", // well over 72 hours
    });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.postAdmissionReviewDone).toBe(false);
    expect(result.issues.some(i => i.includes("Post-admission review"))).toBe(true);
  });

  it("warns about missing welcome plan", () => {
    const referral = makeReferral({ welcomePlanInPlace: false });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.welcomePlanExists).toBe(false);
    expect(result.warnings.some(w => w.includes("Welcome plan"))).toBe(true);
  });

  it("warns about existing children not informed", () => {
    const referral = makeReferral({ existingChildrenInformed: false });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.warnings.some(w => w.includes("Existing children not informed"))).toBe(true);
  });

  it("warns about significant concerns on admitted child", () => {
    const referral = makeReferral({
      impactAssessment: makeImpactAssessment({
        childImpacts: [
          { childName: "Alex", childId: "child-alex", impactLevel: "significant_concern", considerations: ["Peer conflict risk"], mitigations: ["Separation plan"] },
        ],
      }),
    });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.warnings.some(w => w.includes("significant concern"))).toBe(true);
  });

  it("does not flag incomplete assessment for received status", () => {
    const referral = makeReferral({ status: "received", impactAssessment: undefined, matchingScores: [] });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.issues.filter(i => i.includes("Impact assessment"))).toHaveLength(0);
  });

  it("calculates days to decision", () => {
    const result = evaluateReferralCompliance(makeReferral(), NOW);
    expect(result.daysToDecision).toBe(2); // May 1 → May 3
  });

  it("warns about late emergency assessment", () => {
    const referral = makeReferral({
      admissionType: "emergency",
      referralDate: "2026-05-01T10:00:00Z",
      impactAssessment: makeImpactAssessment({ completedDate: "2026-05-05T10:00:00Z" }), // 96 hours
    });
    const result = evaluateReferralCompliance(referral, NOW);
    expect(result.assessmentTimely).toBe(false);
    expect(result.warnings.some(w => w.includes("72 hours"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Admissions Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeAdmissionsMetrics", () => {
  it("calculates metrics for home", () => {
    const referrals = [
      makeReferral({ id: "r1", status: "admitted" }),
      makeReferral({ id: "r2", status: "declined", decisionRationale: "No capacity", decisionDate: "2026-04-15T10:00:00Z", referralDate: "2026-04-12T10:00:00Z", impactAssessment: makeImpactAssessment(), approvedByRI: false }),
      makeReferral({ id: "r3", status: "withdrawn" }),
    ];
    const result = calculateHomeAdmissionsMetrics(referrals, "home-oak", 4, 4, NOW);
    expect(result.totalReferralsLast12Months).toBe(3);
    expect(result.admittedCount).toBe(1);
    expect(result.declinedCount).toBe(1);
    expect(result.withdrawnCount).toBe(1);
    expect(result.occupancyRate).toBe(100);
  });

  it("calculates impact assessment rate", () => {
    const referrals = [
      makeReferral({ id: "r1", status: "admitted" }),
      makeReferral({ id: "r2", status: "admitted", impactAssessment: undefined }),
    ];
    const result = calculateHomeAdmissionsMetrics(referrals, "home-oak", 4, 3, NOW);
    expect(result.impactAssessmentRate).toBe(50);
  });

  it("calculates average match score", () => {
    const referrals = [makeReferral({ id: "r1", status: "admitted" })];
    const result = calculateHomeAdmissionsMetrics(referrals, "home-oak", 4, 4, NOW);
    expect(result.averageMatchScore).toBeGreaterThan(3);
  });

  it("calculates post-admission review rate", () => {
    const referrals = [
      makeReferral({ id: "r1", status: "admitted", postAdmissionReviewCompleted: true }),
      makeReferral({ id: "r2", status: "admitted", postAdmissionReviewCompleted: false }),
    ];
    const result = calculateHomeAdmissionsMetrics(referrals, "home-oak", 4, 4, NOW);
    expect(result.postAdmissionReviewRate).toBe(50);
  });

  it("calculates occupancy rate", () => {
    const result = calculateHomeAdmissionsMetrics([], "home-oak", 4, 3, NOW);
    expect(result.currentOccupancy).toBe(3);
    expect(result.maxCapacity).toBe(4);
    expect(result.occupancyRate).toBe(75);
  });

  it("handles no referrals", () => {
    const result = calculateHomeAdmissionsMetrics([], "home-oak", 4, 0, NOW);
    expect(result.totalReferralsLast12Months).toBe(0);
    expect(result.impactAssessmentRate).toBe(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getMatchingFactorLabel returns readable labels", () => {
    expect(getMatchingFactorLabel("age_compatibility")).toBe("Age Compatibility");
    expect(getMatchingFactorLabel("peer_dynamics")).toBe("Peer Dynamics");
  });

  it("getImpactLevelLabel returns readable labels", () => {
    expect(getImpactLevelLabel("significant_concern")).toBe("Significant Concern");
    expect(getImpactLevelLabel("positive")).toBe("Positive");
  });
});
