// ══════════════════════════════════════════════════════════════════════════════
// Leaving Care & Aftercare Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateLeavingCareCompliance,
  calculateHomeLeavingCareMetrics,
  getLeavingCareStatusLabel,
  getAccommodationTypeLabel,
  getEETStatusLabel,
} from "../leaving-care-engine";
import type { LeavingCareProfile, AftercareSupportRecord } from "../leaving-care-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeProfile(overrides: Partial<LeavingCareProfile> = {}): LeavingCareProfile {
  return {
    id: "lc-001",
    childId: "child-maya",
    childName: "Maya Williams",
    dateOfBirth: "2009-03-15T00:00:00Z", // 17 years old
    homeId: "home-oak",
    status: "pathway_planning",
    personalAdviser: "Jane Carter",
    personalAdviserAllocatedDate: "2025-03-20T10:00:00Z",
    pathwayPlan: {
      createdDate: "2025-04-01T10:00:00Z",
      lastReviewedDate: "2026-03-15T10:00:00Z",
      nextReviewDue: "2026-09-15T10:00:00Z",
      createdBy: "staff-rm-01",
      status: "active",
      accommodationPlanned: true,
      educationPlanned: true,
      healthPlanned: true,
      financePlanned: true,
      socialNetworksPlanned: true,
      contingencyPlan: true,
      youngPersonContributed: true,
      socialWorkerSigned: true,
    },
    pathwayPlanReviews: [
      { date: "2026-03-15T10:00:00Z", reviewedBy: "staff-rm-01", attendees: ["Maya", "PA Jane", "SW David", "RM Darren"], youngPersonAttended: true, youngPersonViews: "Wants to go to college", progressSummary: "Good progress in all areas", actionsAgreed: ["Visit college", "Open savings account"], nextReviewDate: "2026-09-15T10:00:00Z" },
    ],
    accommodationPlan: "semi_independent",
    accommodationSecured: false,
    eetStatus: "education_ft",
    eetDetails: "Year 12 at local sixth form",
    financialCapabilityAssessed: true,
    financialCapabilityScore: 55,
    bankAccountOpened: true,
    budgetingSupport: true,
    healthPassportProvided: false,
    gpRegistered: true,
    dentistRegistered: true,
    lifeStoryWorkCompleted: false,
    stayingCloseOffered: false,
    expectedDepartureDate: "2027-09-01T10:00:00Z",
    ...overrides,
  };
}

function makeSupportRecord(overrides: Partial<AftercareSupportRecord> = {}): AftercareSupportRecord {
  return {
    id: "sr-001",
    childId: "child-maya",
    date: "2026-05-10T14:00:00Z",
    type: "visit",
    duration: 60,
    topics: ["Accommodation", "College"],
    supportProvided: ["Helped with housing application"],
    mood: "positive",
    recordedBy: "staff-rm-01",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateLeavingCareCompliance", () => {
  it("marks compliant young person in pathway planning", () => {
    const result = evaluateLeavingCareCompliance(makeProfile(), [], NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.pathwayPlanInPlace).toBe(true);
    expect(result.pathwayPlanCurrent).toBe(true);
    expect(result.personalAdviserAllocated).toBe(true);
    expect(result.eetEngaged).toBe(true);
  });

  it("flags missing pathway plan for 16+", () => {
    const profile = makeProfile({ pathwayPlan: undefined });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.pathwayPlanInPlace).toBe(false);
    expect(result.issues.some(i => i.includes("Pathway Plan not in place"))).toBe(true);
  });

  it("flags outdated pathway plan review", () => {
    const profile = makeProfile({
      pathwayPlan: {
        ...makeProfile().pathwayPlan!,
        lastReviewedDate: "2025-08-01T10:00:00Z", // over 6 months ago
      },
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.pathwayPlanCurrent).toBe(false);
    expect(result.issues.some(i => i.includes("not reviewed in last 6 months"))).toBe(true);
  });

  it("flags missing personal adviser for 16+", () => {
    const profile = makeProfile({ personalAdviser: undefined });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.personalAdviserAllocated).toBe(false);
    expect(result.issues.some(i => i.includes("Personal Adviser not allocated"))).toBe(true);
  });

  it("flags accommodation not secured for transition", () => {
    const profile = makeProfile({ status: "transition", accommodationSecured: false });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.issues.some(i => i.includes("Accommodation not secured"))).toBe(true);
  });

  it("warns about accommodation when departure is imminent", () => {
    const profile = makeProfile({
      status: "pathway_planning",
      accommodationSecured: false,
      expectedDepartureDate: "2026-07-01T10:00:00Z", // less than 90 days
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.warnings.some(w => w.includes("Accommodation not secured"))).toBe(true);
  });

  it("flags NEET status", () => {
    const profile = makeProfile({ eetStatus: "neet" });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.eetEngaged).toBe(false);
    expect(result.issues.some(i => i.includes("NEET"))).toBe(true);
  });

  it("warns about NEET due to illness", () => {
    const profile = makeProfile({ eetStatus: "neet_illness" });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.eetEngaged).toBe(false);
    expect(result.warnings.some(w => w.includes("NEET due to illness"))).toBe(true);
  });

  it("flags missing health passport for departed", () => {
    const profile = makeProfile({
      status: "departed",
      departureDate: "2026-04-01T10:00:00Z",
      healthPassportProvided: false,
      accommodationSecured: true,
      stayingCloseOffered: true,
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.issues.some(i => i.includes("Health passport"))).toBe(true);
  });

  it("flags staying close not offered", () => {
    const profile = makeProfile({
      status: "departed",
      departureDate: "2026-04-01T10:00:00Z",
      accommodationSecured: true,
      stayingCloseOffered: false,
      healthPassportProvided: true,
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.issues.some(i => i.includes("Staying Close"))).toBe(true);
  });

  it("warns about overdue contact", () => {
    const profile = makeProfile({
      status: "staying_close",
      departureDate: "2026-01-01T10:00:00Z",
      accommodationSecured: true,
      stayingCloseOffered: true,
      healthPassportProvided: true,
      keepingInTouchFrequency: "fortnightly",
      lastContactDate: "2026-04-01T10:00:00Z", // 46 days ago, overdue for fortnightly
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.contactUpToDate).toBe(false);
    expect(result.warnings.some(w => w.includes("Contact overdue"))).toBe(true);
  });

  it("calculates overall preparedness score", () => {
    const profile = makeProfile({
      accommodationSecured: true,
      healthPassportProvided: true,
      lifeStoryWorkCompleted: true,
      stayingCloseOffered: true,
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.overallPreparedness).toBe(100); // all factors present
  });

  it("calculates days until departure", () => {
    const profile = makeProfile({
      expectedDepartureDate: "2026-06-17T10:00:00Z",
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.daysUntilDeparture).toBe(31);
  });

  it("does not require pathway plan for under-16", () => {
    const profile = makeProfile({
      dateOfBirth: "2011-05-01T00:00:00Z", // 15 years old
      status: "pre_planning",
      pathwayPlan: undefined,
      personalAdviser: undefined,
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.issues.some(i => i.includes("Pathway Plan"))).toBe(false);
    expect(result.issues.some(i => i.includes("Personal Adviser"))).toBe(false);
  });

  it("warns about young person not contributing to plan", () => {
    const profile = makeProfile({
      pathwayPlan: { ...makeProfile().pathwayPlan!, youngPersonContributed: false },
    });
    const result = evaluateLeavingCareCompliance(profile, [], NOW);
    expect(result.warnings.some(w => w.includes("not contributed"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeLeavingCareMetrics", () => {
  it("calculates basic counts", () => {
    const profiles = [
      makeProfile({ id: "lc1", childId: "c1", status: "pathway_planning" }),
      makeProfile({ id: "lc2", childId: "c2", status: "staying_close", departureDate: "2026-01-01T10:00:00Z", accommodationSecured: true, stayingCloseOffered: true, stayingCloseAccepted: true, healthPassportProvided: true, keepingInTouchFrequency: "monthly", lastContactDate: "2026-05-01T10:00:00Z" }),
      makeProfile({ id: "lc3", childId: "c3", status: "aftercare", departureDate: "2025-06-01T10:00:00Z", accommodationSecured: true, stayingCloseOffered: true, healthPassportProvided: true, keepingInTouchFrequency: "monthly", lastContactDate: "2026-05-10T10:00:00Z" }),
    ];
    const result = calculateHomeLeavingCareMetrics(profiles, [], "home-oak", NOW);
    expect(result.totalYoungPeople).toBe(3);
    expect(result.activePreparation).toBe(1);
    expect(result.stayingClose).toBe(1);
    expect(result.aftercare).toBe(1);
  });

  it("calculates EET rate", () => {
    const profiles = [
      makeProfile({ id: "lc1", childId: "c1", eetStatus: "education_ft" }),
      makeProfile({ id: "lc2", childId: "c2", eetStatus: "neet" }),
      makeProfile({ id: "lc3", childId: "c3", eetStatus: "apprenticeship" }),
    ];
    const result = calculateHomeLeavingCareMetrics(profiles, [], "home-oak", NOW);
    expect(result.eetRate).toBe(67); // 2 of 3
  });

  it("calculates pathway plan compliance", () => {
    const profiles = [
      makeProfile({ id: "lc1", childId: "c1" }), // compliant
      makeProfile({ id: "lc2", childId: "c2", pathwayPlan: undefined }), // no plan
    ];
    const result = calculateHomeLeavingCareMetrics(profiles, [], "home-oak", NOW);
    expect(result.pathwayPlanComplianceRate).toBe(50);
  });

  it("identifies young people needing attention", () => {
    const profiles = [
      makeProfile({ id: "lc1", childId: "c1", childName: "Maya" }), // compliant
      makeProfile({ id: "lc2", childId: "c2", childName: "Jordan", personalAdviser: undefined, pathwayPlan: undefined }), // issues
    ];
    const result = calculateHomeLeavingCareMetrics(profiles, [], "home-oak", NOW);
    expect(result.youngPeopleNeedingAttention.length).toBe(1);
    expect(result.youngPeopleNeedingAttention[0].childName).toBe("Jordan");
  });

  it("calculates average preparedness", () => {
    const profiles = [
      makeProfile({ id: "lc1", childId: "c1", accommodationSecured: true, healthPassportProvided: true, stayingCloseOffered: true, lifeStoryWorkCompleted: true }),
    ];
    const result = calculateHomeLeavingCareMetrics(profiles, [], "home-oak", NOW);
    expect(result.averagePreparedness).toBe(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getLeavingCareStatusLabel returns readable labels", () => {
    expect(getLeavingCareStatusLabel("pathway_planning")).toBe("Pathway Planning");
    expect(getLeavingCareStatusLabel("staying_close")).toBe("Staying Close");
  });

  it("getAccommodationTypeLabel returns readable labels", () => {
    expect(getAccommodationTypeLabel("semi_independent")).toBe("Semi-Independent");
    expect(getAccommodationTypeLabel("staying_put")).toBe("Staying Put");
  });

  it("getEETStatusLabel returns readable labels", () => {
    expect(getEETStatusLabel("apprenticeship")).toBe("Apprenticeship");
    expect(getEETStatusLabel("neet")).toBe("NEET");
  });
});
