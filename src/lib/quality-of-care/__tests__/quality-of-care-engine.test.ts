// ══════════════════════════════════════════════════════════════════════════════
// Quality of Care Review (Reg 45) Engine — Tests
//
// Covers: domain scoring, grade assignment, strength/improvement detection,
// overall weighted calculation, regulatory compliance, comparison to previous.
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  generateQualityOfCareReview,
  getDomainLabel,
  getGradeLabel,
  getGradeColor,
} from "../quality-of-care-engine";
import type { QualityInputData } from "../quality-of-care-engine";

// ── Test Fixtures ──────────────────────────────────────────────────────────

function makeInput(overrides: Partial<QualityInputData> = {}): QualityInputData {
  return {
    homeId: "home-oak",
    homeName: "Oak House",
    reviewPeriodStart: "2025-11-01T00:00:00Z",
    reviewPeriodEnd: "2026-05-01T00:00:00Z",
    registeredManager: "Claire Edwards",
    registeredCapacity: 4,
    currentOccupancy: 3,

    safety: {
      totalIncidents: 12,
      restraintCount: 4,
      restraintReductionTrend: "reducing",
      missingEpisodes: 2,
      missingRepeatChildren: 0,
      bullyingIncidents: 1,
      environmentalRiskAssessmentsComplete: true,
      fireDrillsCompliant: true,
      medicationErrorCount: 1,
      deEscalationRate: 85,
      childrenFeelSafe: 92,
    },

    education: {
      averageAttendance: 94,
      pepCompliance: 100,
      exclusionDays: 2,
      childrenInEducation: 100,
      ppSpendRate: 75,
      progressingTowardsTargets: 80,
      enrichmentActivitiesPerWeek: 4,
    },

    health: {
      ihaComplianceRate: 100,
      rhaComplianceRate: 100,
      sdqCompletionRate: 100,
      dentalCheckRate: 90,
      immunisationRate: 100,
      camhsReferralsMade: 1,
      camhsWaitingList: 0,
      healthyEatingScore: 80,
      physicalActivityHoursPerWeek: 4,
    },

    relationships: {
      keyworkComplianceRate: 92,
      keyworkEngagementScore: 4.2,
      childVoiceRate: 85,
      familyContactRate: 90,
      childrensMeetingsHeld: 6,
      complaintsCount: 2,
      complimentsCount: 8,
      staffTurnoverRate: 10,
      agencyUsageRate: 15,
    },

    protection: {
      safeguardingReferralsMade: 2,
      safeguardingConcernsOpen: 1,
      dbsComplianceRate: 100,
      saferRecruitmentCompliant: true,
      trainingComplianceRate: 92,
      supervisionComplianceRate: 95,
      allegationsThisPeriod: 0,
      notifiableEvents: 3,
      notifiableEventsCompliant: 3,
      whistleblowingCulture: 80,
    },

    leadership: {
      reg44VisitsCompliant: true,
      reg44ActionsClosed: 90,
      staffSupervisionRate: 95,
      staffQualificationRate: 85,
      policyReviewsCurrent: true,
      statementOfPurposeCurrent: true,
      complaintResponseRate: 100,
      ofstedActionsComplete: 90,
      improvementPlanProgress: 82,
      staffMorale: 78,
    },

    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Review Generation Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("generateQualityOfCareReview", () => {
  it("generates a complete review with all domains", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input);

    expect(review.homeId).toBe("home-oak");
    expect(review.homeName).toBe("Oak House");
    expect(review.domains).toHaveLength(7); // 6 + overall
    expect(review.overallScore).toBeGreaterThan(0);
    expect(review.overallGrade).toBeDefined();
    expect(review.topStrengths.length).toBeGreaterThan(0);
  });

  it("grades outstanding for high-scoring home", () => {
    const input = makeInput({
      safety: {
        totalIncidents: 3,
        restraintCount: 1,
        restraintReductionTrend: "reducing",
        missingEpisodes: 0,
        missingRepeatChildren: 0,
        bullyingIncidents: 0,
        environmentalRiskAssessmentsComplete: true,
        fireDrillsCompliant: true,
        medicationErrorCount: 0,
        deEscalationRate: 95,
        childrenFeelSafe: 100,
      },
      education: {
        averageAttendance: 98,
        pepCompliance: 100,
        exclusionDays: 0,
        childrenInEducation: 100,
        ppSpendRate: 90,
        progressingTowardsTargets: 90,
        enrichmentActivitiesPerWeek: 5,
      },
    });

    const review = generateQualityOfCareReview(input);
    expect(review.overallScore).toBeGreaterThanOrEqual(80);
    expect(["outstanding", "good"]).toContain(review.overallGrade);
  });

  it("grades inadequate for poorly performing home", () => {
    const input = makeInput({
      safety: {
        totalIncidents: 30,
        restraintCount: 15,
        restraintReductionTrend: "increasing",
        missingEpisodes: 10,
        missingRepeatChildren: 3,
        bullyingIncidents: 5,
        environmentalRiskAssessmentsComplete: false,
        fireDrillsCompliant: false,
        medicationErrorCount: 8,
        deEscalationRate: 30,
        childrenFeelSafe: 50,
      },
      protection: {
        safeguardingReferralsMade: 5,
        safeguardingConcernsOpen: 4,
        dbsComplianceRate: 70,
        saferRecruitmentCompliant: false,
        trainingComplianceRate: 50,
        supervisionComplianceRate: 40,
        allegationsThisPeriod: 2,
        notifiableEvents: 5,
        notifiableEventsCompliant: 2,
        whistleblowingCulture: 30,
      },
      leadership: {
        reg44VisitsCompliant: false,
        reg44ActionsClosed: 30,
        staffSupervisionRate: 40,
        staffQualificationRate: 40,
        policyReviewsCurrent: false,
        statementOfPurposeCurrent: false,
        complaintResponseRate: 50,
        ofstedActionsComplete: 20,
        improvementPlanProgress: 20,
        staffMorale: 30,
      },
    });

    const review = generateQualityOfCareReview(input);
    expect(review.overallScore).toBeLessThan(55);
    expect(["requires_improvement", "inadequate"]).toContain(review.overallGrade);
  });

  it("detects strengths correctly in safety domain", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input);
    const safety = review.domains.find(d => d.domain === "safety");

    expect(safety).toBeDefined();
    expect(safety!.strengths.length).toBeGreaterThan(0);
    expect(safety!.strengths.some(s => s.includes("de-escalation"))).toBe(true);
  });

  it("detects areas for improvement", () => {
    const input = makeInput({
      education: {
        averageAttendance: 80,
        pepCompliance: 60,
        exclusionDays: 10,
        childrenInEducation: 80,
        ppSpendRate: 30,
        progressingTowardsTargets: 50,
        enrichmentActivitiesPerWeek: 1,
      },
    });

    const review = generateQualityOfCareReview(input);
    const education = review.domains.find(d => d.domain === "education_and_learning");

    expect(education!.areasForImprovement.length).toBeGreaterThan(0);
    expect(education!.areasForImprovement.some(a => a.includes("attendance"))).toBe(true);
  });

  it("sets regulatory compliance flags correctly", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input);

    expect(review.regulatoryCompliance.reg44Compliant).toBe(true);
    expect(review.regulatoryCompliance.notifiableEventsCompliant).toBe(true);
    expect(review.regulatoryCompliance.statementOfPurposeCurrent).toBe(true);
    expect(review.regulatoryCompliance.staffingAdequate).toBe(true);
  });

  it("flags non-compliant regulatory areas", () => {
    const input = makeInput({
      leadership: {
        reg44VisitsCompliant: false,
        reg44ActionsClosed: 30,
        staffSupervisionRate: 40,
        staffQualificationRate: 40,
        policyReviewsCurrent: false,
        statementOfPurposeCurrent: false,
        complaintResponseRate: 50,
        ofstedActionsComplete: 20,
        improvementPlanProgress: 20,
        staffMorale: 30,
      },
    });

    const review = generateQualityOfCareReview(input);
    expect(review.regulatoryCompliance.reg44Compliant).toBe(false);
    expect(review.regulatoryCompliance.statementOfPurposeCurrent).toBe(false);
  });

  it("compares with previous score", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input, 60);

    expect(review.previousReviewComparison).toBeDefined();
    expect(review.previousReviewComparison!.previousScore).toBe(60);
    expect(review.previousReviewComparison!.trend).toBe("improving");
  });

  it("marks declining trend when score drops", () => {
    const input = makeInput({
      safety: {
        totalIncidents: 20,
        restraintCount: 10,
        restraintReductionTrend: "increasing",
        missingEpisodes: 5,
        missingRepeatChildren: 2,
        bullyingIncidents: 3,
        environmentalRiskAssessmentsComplete: false,
        fireDrillsCompliant: false,
        medicationErrorCount: 5,
        deEscalationRate: 40,
        childrenFeelSafe: 60,
      },
    });

    const review = generateQualityOfCareReview(input, 90);
    expect(review.previousReviewComparison!.trend).toBe("declining");
  });

  it("includes key metrics in each domain", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input);

    const education = review.domains.find(d => d.domain === "education_and_learning");
    expect(education!.keyMetrics.length).toBeGreaterThan(0);
    expect(education!.keyMetrics.some(m => m.label === "Attendance")).toBe(true);
  });

  it("handles children summary", () => {
    const input = makeInput();
    const review = generateQualityOfCareReview(input);

    expect(review.childrenSummary.capacity).toBe(4);
    expect(review.childrenSummary.occupancy).toBe(3);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Domain Scoring Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Domain scoring", () => {
  it("safety domain scores higher with reducing restraints", () => {
    const inputReducing = makeInput({ safety: { ...makeInput().safety, restraintReductionTrend: "reducing" } });
    const inputIncreasing = makeInput({ safety: { ...makeInput().safety, restraintReductionTrend: "increasing" } });

    const reviewR = generateQualityOfCareReview(inputReducing);
    const reviewI = generateQualityOfCareReview(inputIncreasing);

    const safetyR = reviewR.domains.find(d => d.domain === "safety")!.score;
    const safetyI = reviewI.domains.find(d => d.domain === "safety")!.score;

    expect(safetyR).toBeGreaterThan(safetyI);
  });

  it("relationships domain penalises high agency usage", () => {
    const lowAgency = makeInput({ relationships: { ...makeInput().relationships, agencyUsageRate: 10, staffTurnoverRate: 5 } });
    const highAgency = makeInput({ relationships: { ...makeInput().relationships, agencyUsageRate: 40, staffTurnoverRate: 35 } });

    const reviewL = generateQualityOfCareReview(lowAgency);
    const reviewH = generateQualityOfCareReview(highAgency);

    const relL = reviewL.domains.find(d => d.domain === "positive_relationships")!.score;
    const relH = reviewH.domains.find(d => d.domain === "positive_relationships")!.score;

    expect(relL).toBeGreaterThan(relH);
  });

  it("protection domain flags DBS non-compliance severely", () => {
    const compliant = makeInput({ protection: { ...makeInput().protection, dbsComplianceRate: 100 } });
    const nonCompliant = makeInput({ protection: { ...makeInput().protection, dbsComplianceRate: 70 } });

    const reviewC = generateQualityOfCareReview(compliant);
    const reviewN = generateQualityOfCareReview(nonCompliant);

    const protC = reviewC.domains.find(d => d.domain === "protection_of_children")!.score;
    const protN = reviewN.domains.find(d => d.domain === "protection_of_children")!.score;

    expect(protC - protN).toBeGreaterThanOrEqual(20);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getDomainLabel returns readable labels", () => {
    expect(getDomainLabel("safety")).toBe("How Safe Children Are");
    expect(getDomainLabel("leadership_and_management")).toBe("Leadership & Management");
    expect(getDomainLabel("overall_experiences")).toBe("Overall Experiences & Progress");
  });

  it("getGradeLabel returns readable labels", () => {
    expect(getGradeLabel("outstanding")).toBe("Outstanding");
    expect(getGradeLabel("good")).toBe("Good");
    expect(getGradeLabel("requires_improvement")).toBe("Requires Improvement");
    expect(getGradeLabel("inadequate")).toBe("Inadequate");
  });

  it("getGradeColor returns colour identifiers", () => {
    expect(getGradeColor("outstanding")).toBe("emerald");
    expect(getGradeColor("good")).toBe("blue");
    expect(getGradeColor("requires_improvement")).toBe("amber");
    expect(getGradeColor("inadequate")).toBe("red");
  });
});
