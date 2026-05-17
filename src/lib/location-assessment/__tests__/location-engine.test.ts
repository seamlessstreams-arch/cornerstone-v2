// ══════════════════════════════════════════════════════════════════════════════
// Location Assessment Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateLocationCompliance,
  calculateHomeLocationMetrics,
  getServiceLabel,
  getAreaRiskLabel,
  getRiskLevelLabel,
} from "../location-engine";
import type {
  LocationAssessment,
  LocalService,
  AreaRisk,
  ActionPlanItem,
} from "../location-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeServices(): LocalService[] {
  return [
    { category: "gp_surgery", name: "Oakfield Medical Centre", distanceMiles: 0.8, accessibleByPublicTransport: true },
    { category: "dentist", name: "Smile Dental Practice", distanceMiles: 1.2, accessibleByPublicTransport: true },
    { category: "hospital_ae", name: "County General Hospital", distanceMiles: 5.5, accessibleByPublicTransport: true },
    { category: "camhs", name: "CAMHS Community Team", distanceMiles: 3.2, accessibleByPublicTransport: true, waitingTimeWeeks: 8 },
    { category: "school_secondary", name: "Oakfield Academy", distanceMiles: 1.5, accessibleByPublicTransport: true },
    { category: "school_primary", name: "St Mary's Primary", distanceMiles: 0.5, accessibleByPublicTransport: true },
    { category: "police_station", name: "Oakfield Police Station", distanceMiles: 2.0, accessibleByPublicTransport: true },
    { category: "fire_station", name: "County Fire Station", distanceMiles: 3.0, accessibleByPublicTransport: true },
    { category: "pharmacy", name: "Boots Pharmacy", distanceMiles: 0.6, accessibleByPublicTransport: true },
    { category: "public_transport", name: "Oakfield Bus Station", distanceMiles: 0.4, accessibleByPublicTransport: true },
    { category: "leisure_facilities", name: "Oakfield Leisure Centre", distanceMiles: 1.8, accessibleByPublicTransport: true },
    { category: "library", name: "Oakfield Library", distanceMiles: 1.0, accessibleByPublicTransport: true },
  ];
}

function makeAreaRisks(): AreaRisk[] {
  return [
    { category: "crime_general", level: "low", description: "Below-average crime rate for area type", source: "Police data Q1 2026", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    { category: "drug_activity", level: "medium", description: "Some cannabis use reported in local park", source: "Police community report", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["Avoid park after dark", "Staff supervision on outings"] },
    { category: "road_safety", level: "low", description: "30mph zone, crossing patrol at school times", source: "Highways assessment", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    { category: "antisocial_behaviour", level: "low", description: "Occasional reports, not persistent", source: "Police data Q1 2026", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
  ];
}

function makeActionPlan(): ActionPlanItem[] {
  return [
    { id: "ap-001", description: "Update police data for Q2 2026", assignedTo: "staff-rm-01", dueDate: "2026-06-15T00:00:00Z", status: "open" },
    { id: "ap-002", description: "Review neighbour relationships following new fence dispute", assignedTo: "staff-rm-01", dueDate: "2026-05-30T00:00:00Z", status: "in_progress" },
    { id: "ap-003", description: "Confirm school transport arrangements for September", assignedTo: "staff-kl-02", dueDate: "2026-07-01T00:00:00Z", status: "open" },
    { id: "ap-004", description: "Update fire evacuation route after road closure", assignedTo: "staff-jb-01", dueDate: "2026-04-01T00:00:00Z", status: "completed", completedDate: "2026-03-28T10:00:00Z" },
  ];
}

function makeAssessment(overrides: Partial<LocationAssessment> = {}): LocationAssessment {
  return {
    id: "la-001",
    homeId: "home-oak",
    homeName: "Oak House",
    address: "14 Oakfield Road, Anytown, AT1 2BC",
    assessmentDate: "2026-03-01T10:00:00Z",
    reviewDueDate: "2027-03-01T10:00:00Z",
    assessedBy: "staff-rm-01",
    approvedBy: "manager-sm-01",
    status: "current",
    localServices: makeServices(),
    areaRisks: makeAreaRisks(),
    neighbourRelationships: [
      { description: "Immediate neighbour (no. 12)", quality: "positive", dateLastAssessed: "2026-03-01T10:00:00Z", notes: "Friendly, aware of home's purpose" },
      { description: "Immediate neighbour (no. 16)", quality: "neutral", dateLastAssessed: "2026-03-01T10:00:00Z" },
      { description: "Across the road (no. 15)", quality: "positive", dateLastAssessed: "2026-03-01T10:00:00Z" },
    ],
    nearestBusStopMiles: 0.2,
    nearestTrainStationMiles: 2.5,
    publicTransportAdequate: true,
    outdoorSpaceAvailable: true,
    safePlayAreaNearby: true,
    communityActivitiesAvailable: true,
    childrenConsulted: true,
    childrenViewsOnArea: [
      "Alex: Likes the park and the chip shop",
      "Jordan: Wishes there was a cinema closer",
      "Sam: Likes that school is walkable",
      "Casey: Feels safe in the area",
    ],
    overallRiskLevel: "low",
    overallSuitability: "suitable",
    keyStrengths: ["Excellent local services", "Good public transport", "Low crime area", "Positive neighbour relationships"],
    keyRisks: ["Some drug activity in local park"],
    actionPlan: makeActionPlan(),
    lastReviewDate: "2026-03-01T10:00:00Z",
    significantChangeSinceLastReview: false,
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Location Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateLocationCompliance", () => {
  it("marks compliant assessment", () => {
    const result = evaluateLocationCompliance(makeAssessment(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.overdue).toBe(false);
    expect(result.annexACoverage).toBe(100);
    expect(result.gpAccessible).toBe(true);
    expect(result.educationAccessible).toBe(true);
    expect(result.childrenConsulted).toBe(true);
  });

  it("flags overdue review", () => {
    const assessment = makeAssessment({ reviewDueDate: "2026-04-01T10:00:00Z" }); // past NOW
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.overdue).toBe(true);
    expect(result.issues.some(i => i.includes("overdue"))).toBe(true);
  });

  it("flags missing Annex A services", () => {
    const assessment = makeAssessment({
      localServices: [
        { category: "gp_surgery", name: "GP", distanceMiles: 1, accessibleByPublicTransport: true },
        // Missing hospital_ae, school_secondary, police_station, public_transport
      ],
    });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.annexACoverage).toBe(20); // 1 of 5 required
    expect(result.issues.some(i => i.includes("Annex A"))).toBe(true);
  });

  it("warns about GP too far", () => {
    const services = makeServices();
    const gpIdx = services.findIndex(s => s.category === "gp_surgery");
    services[gpIdx] = { ...services[gpIdx], distanceMiles: 4.5 };
    const assessment = makeAssessment({ localServices: services });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.gpAccessible).toBe(false);
    expect(result.warnings.some(w => w.includes("GP surgery"))).toBe(true);
  });

  it("warns about education too far", () => {
    const services = makeServices().filter(s => s.category !== "school_secondary" && s.category !== "school_primary");
    services.push({ category: "school_secondary", name: "Far School", distanceMiles: 7, accessibleByPublicTransport: true });
    const assessment = makeAssessment({ localServices: services });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.educationAccessible).toBe(false);
    expect(result.warnings.some(w => w.includes("Education provision"))).toBe(true);
  });

  it("flags high-risk areas without mitigations", () => {
    const risks: AreaRisk[] = [
      { category: "county_lines", level: "high", description: "Known county lines activity", source: "Police intel", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    ];
    const assessment = makeAssessment({ areaRisks: risks });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.issues.some(i => i.includes("high-risk area(s) without mitigations"))).toBe(true);
    expect(result.highRiskAreas).toContain("County Lines");
  });

  it("does not flag high-risk areas with mitigations", () => {
    const risks: AreaRisk[] = [
      { category: "county_lines", level: "high", description: "Known county lines activity", source: "Police intel", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["Enhanced awareness training", "Police liaison meetings"] },
    ];
    const assessment = makeAssessment({ areaRisks: risks });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.issues.filter(i => i.includes("without mitigations"))).toHaveLength(0);
    expect(result.highRiskAreas).toContain("County Lines");
  });

  it("flags children not consulted", () => {
    const assessment = makeAssessment({ childrenConsulted: false });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.childrenConsulted).toBe(false);
    expect(result.issues.some(i => i.includes("Children not consulted"))).toBe(true);
  });

  it("warns about inadequate public transport", () => {
    const assessment = makeAssessment({ publicTransportAdequate: false });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.publicTransportAdequate).toBe(false);
    expect(result.warnings.some(w => w.includes("Public transport"))).toBe(true);
  });

  it("warns about unapproved assessment", () => {
    const assessment = makeAssessment({ approvedBy: undefined });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.warnings.some(w => w.includes("not yet approved"))).toBe(true);
  });

  it("warns about overdue actions", () => {
    const actions: ActionPlanItem[] = [
      { id: "ap-001", description: "Overdue task", assignedTo: "staff-rm-01", dueDate: "2026-04-01T00:00:00Z", status: "overdue" },
    ];
    const assessment = makeAssessment({ actionPlan: actions });
    const result = evaluateLocationCompliance(assessment, NOW);
    expect(result.overdueActions).toBe(1);
    expect(result.warnings.some(w => w.includes("overdue action"))).toBe(true);
  });

  it("calculates area risk score", () => {
    const result = evaluateLocationCompliance(makeAssessment(), NOW);
    // 3 low (90 each) + 1 medium (60) = (270+60)/4 = 82.5 → 83
    expect(result.areaRiskScore).toBe(83);
  });

  it("calculates days until review", () => {
    const result = evaluateLocationCompliance(makeAssessment(), NOW);
    // March 1 2027 - May 17 2026 ≈ 288 days
    expect(result.daysUntilReviewDue).toBeGreaterThan(280);
    expect(result.daysUntilReviewDue).toBeLessThan(295);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Location Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeLocationMetrics", () => {
  it("calculates metrics for assessment", () => {
    const result = calculateHomeLocationMetrics(makeAssessment(), NOW);
    expect(result.assessmentCurrent).toBe(true);
    expect(result.reviewOverdue).toBe(false);
    expect(result.totalServicesAssessed).toBe(12);
    expect(result.servicesWithinReach).toBe(12); // all within thresholds
    expect(result.totalAreaRisks).toBe(4);
    expect(result.highRisks).toBe(0);
    expect(result.mediumRisks).toBe(1);
  });

  it("calculates action plan metrics", () => {
    const result = calculateHomeLocationMetrics(makeAssessment(), NOW);
    expect(result.totalActions).toBe(4);
    expect(result.completedActions).toBe(1);
    expect(result.outstandingActions).toBe(3); // 1 open + 1 in_progress + 1 open
    expect(result.actionCompletionRate).toBe(25); // 1/4
  });

  it("counts neighbour relationships", () => {
    const result = calculateHomeLocationMetrics(makeAssessment(), NOW);
    expect(result.neighbourRelationshipsPositive).toBe(2);
    expect(result.neighbourRelationshipsNegative).toBe(0);
  });

  it("calculates overall location score", () => {
    const result = calculateHomeLocationMetrics(makeAssessment(), NOW);
    // servicesAccessScore ~100 * 0.4 + areaRiskScore 83 * 0.4 + coverage 100 * 0.2
    expect(result.overallLocationScore).toBeGreaterThan(85);
  });

  it("handles overdue assessment", () => {
    const assessment = makeAssessment({ reviewDueDate: "2026-04-01T10:00:00Z" });
    const result = calculateHomeLocationMetrics(assessment, NOW);
    expect(result.reviewOverdue).toBe(true);
    expect(result.assessmentCurrent).toBe(false);
  });

  it("counts high risks correctly", () => {
    const risks: AreaRisk[] = [
      { category: "county_lines", level: "high", description: "Test", source: "Test", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["Mitigation"] },
      { category: "cse_risk", level: "very_high", description: "Test", source: "Test", dateAssessed: "2026-03-01T10:00:00Z", mitigations: ["Mitigation"] },
      { category: "crime_general", level: "medium", description: "Test", source: "Test", dateAssessed: "2026-03-01T10:00:00Z", mitigations: [] },
    ];
    const assessment = makeAssessment({ areaRisks: risks });
    const result = calculateHomeLocationMetrics(assessment, NOW);
    expect(result.highRisks).toBe(2);
    expect(result.mediumRisks).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Label helpers", () => {
  it("getServiceLabel returns readable labels", () => {
    expect(getServiceLabel("gp_surgery")).toBe("GP Surgery");
    expect(getServiceLabel("hospital_ae")).toBe("Hospital A&E");
    expect(getServiceLabel("camhs")).toBe("CAMHS");
  });

  it("getAreaRiskLabel returns readable labels", () => {
    expect(getAreaRiskLabel("county_lines")).toBe("County Lines");
    expect(getAreaRiskLabel("cse_risk")).toBe("CSE Risk");
  });

  it("getRiskLevelLabel returns readable labels", () => {
    expect(getRiskLevelLabel("very_high")).toBe("Very High");
    expect(getRiskLevelLabel("low")).toBe("Low");
  });
});
