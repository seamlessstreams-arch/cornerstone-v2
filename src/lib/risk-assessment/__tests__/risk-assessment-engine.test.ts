// ══════════════════════════════════════════════════════════════════════════════
// Risk Assessment & Management Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateChildRiskCompliance,
  calculateHomeRiskMetrics,
  getRiskCategoryLabel,
  getRiskLevelLabel,
} from "../risk-assessment-engine";
import type {
  ChildRiskProfile,
  RiskAssessment,
  RiskIncident,
  ControlMeasure,
} from "../risk-assessment-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeMeasures(): ControlMeasure[] {
  return [
    { id: "cm-1", description: "1:1 supervision during triggers", status: "active", implementedDate: "2026-03-01T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "effective" },
    { id: "cm-2", description: "Daily check-in with keyworker", status: "active", implementedDate: "2026-03-01T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-sw-01", effectiveness: "effective" },
  ];
}

function makeAssessments(): RiskAssessment[] {
  return [
    {
      id: "ra-1",
      category: "self_harm",
      currentLevel: "medium",
      previousLevel: "high",
      dateAssessed: "2026-05-01T10:00:00Z",
      nextReviewDate: "2026-06-01T10:00:00Z",
      assessedBy: "staff-rm-01",
      triggers: ["Conflict with peers", "Contact visits cancelled"],
      controlMeasures: makeMeasures(),
      contextualFactors: ["History of trauma", "Recent placement move"],
      protectiveFactors: ["Strong keyworker relationship", "Engaged in therapy"],
      escalationPlan: "Contact CAMHS duty, notify placing authority",
      childAware: true,
    },
    {
      id: "ra-2",
      category: "missing",
      currentLevel: "low",
      dateAssessed: "2026-04-15T10:00:00Z",
      nextReviewDate: "2026-05-15T10:00:00Z", // slightly overdue
      assessedBy: "staff-rm-01",
      triggers: ["Arguments in home"],
      controlMeasures: [
        { id: "cm-3", description: "Check-ins every 2 hours when upset", status: "active", implementedDate: "2026-04-15T10:00:00Z", lastReviewedDate: "2026-04-15T10:00:00Z", responsiblePerson: "staff-sw-02", effectiveness: "effective" },
      ],
      contextualFactors: ["Peer influence"],
      protectiveFactors: ["Good school attendance"],
      escalationPlan: "Missing protocol — notify police after 1 hour",
      childAware: true,
    },
    {
      id: "ra-3",
      category: "substance_misuse",
      currentLevel: "medium",
      dateAssessed: "2026-04-20T10:00:00Z",
      nextReviewDate: "2026-05-20T10:00:00Z",
      assessedBy: "staff-sw-01",
      triggers: ["Weekend unsupervised time", "Contact with previous peer group"],
      controlMeasures: [
        { id: "cm-4", description: "Random room checks", status: "active", implementedDate: "2026-04-20T10:00:00Z", lastReviewedDate: "2026-05-01T10:00:00Z", responsiblePerson: "staff-rm-01", effectiveness: "partially_effective" },
      ],
      contextualFactors: ["Previous cannabis use"],
      protectiveFactors: ["Engaged in sports"],
      escalationPlan: "Refer to substance misuse service",
      childAware: true,
    },
  ];
}

function makeIncidents(): RiskIncident[] {
  return [
    { id: "ri-1", date: "2026-05-10T20:00:00Z", category: "self_harm", severity: "medium", description: "Superficial scratching to arm", immediateActionTaken: "First aid, 1:1 support, CAMHS notified", riskReassessed: true, notifiedParties: ["CAMHS", "Social worker"], recordedBy: "staff-rm-01" },
    { id: "ri-2", date: "2026-04-28T22:00:00Z", category: "missing", severity: "low", description: "Late return from school (20 mins)", immediateActionTaken: "Phone contact made, child returned safely", riskReassessed: false, notifiedParties: [], recordedBy: "staff-sw-02" },
  ];
}

function makeProfile(overrides: Partial<ChildRiskProfile> = {}): ChildRiskProfile {
  return {
    childId: "child-alex",
    childName: "Alex Turner",
    homeId: "home-oak",
    dateOfBirth: "2012-01-15T00:00:00Z",
    riskAssessments: makeAssessments(),
    incidents: makeIncidents(),
    positiveRiskTaking: [
      { id: "pr-1", date: "2026-05-05T14:00:00Z", description: "Independent bus journey to school", riskIdentified: "Travel alone", mitigationsInPlace: ["Phone check-in", "Known route", "Time window agreed"], outcome: "Successful — child confident", recordedBy: "staff-sw-01" },
    ],
    childInvolvedInPlanning: true,
    multiAgencyMeetingDate: "2026-04-10T10:00:00Z",
    lastOverallReviewDate: "2026-05-01T10:00:00Z",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Child Risk Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateChildRiskCompliance", () => {
  it("evaluates well-managed child risk profile", () => {
    const result = evaluateChildRiskCompliance(makeProfile(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.overallRiskLevel).toBe("medium");
    expect(result.riskManagementScore).toBeGreaterThan(70);
  });

  it("identifies overall risk level as highest single risk", () => {
    const profile = makeProfile({
      riskAssessments: [
        ...makeAssessments(),
        { id: "ra-high", category: "cse", currentLevel: "high", dateAssessed: "2026-05-01T10:00:00Z", nextReviewDate: "2026-06-01T10:00:00Z", assessedBy: "staff-rm-01", triggers: [], controlMeasures: makeMeasures(), contextualFactors: [], protectiveFactors: [], escalationPlan: "Refer to CSE team", childAware: true },
      ],
    });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.overallRiskLevel).toBe("high");
    expect(result.activeHighRisks).toContain("cse");
  });

  it("flags overdue risk assessments", () => {
    const profile = makeProfile({
      riskAssessments: [
        { id: "ra-overdue", category: "aggression_to_others", currentLevel: "medium", dateAssessed: "2026-03-01T10:00:00Z", nextReviewDate: "2026-04-01T10:00:00Z", assessedBy: "staff-rm-01", triggers: [], controlMeasures: makeMeasures(), contextualFactors: [], protectiveFactors: [], escalationPlan: "Physical intervention as last resort", childAware: true },
      ],
    });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.assessmentsOverdue.length).toBe(1);
    expect(result.issues.some(i => i.includes("overdue for review"))).toBe(true);
  });

  it("flags no risk assessments on file", () => {
    const profile = makeProfile({ riskAssessments: [] });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("No risk assessments on file"))).toBe(true);
  });

  it("warns about overall review overdue", () => {
    const profile = makeProfile({ lastOverallReviewDate: "2026-03-01T10:00:00Z" }); // >30 days
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.overallReviewOverdue).toBe(true);
    expect(result.warnings.some(w => w.includes("Overall risk review overdue"))).toBe(true);
  });

  it("counts incidents correctly", () => {
    const result = evaluateChildRiskCompliance(makeProfile(), NOW);
    expect(result.incidentsLast30Days).toBe(2); // both May 10 and Apr 28 within 30 days of May 17
    expect(result.incidentsLast90Days).toBe(2);
  });

  it("warns about high incident frequency", () => {
    const manyIncidents: RiskIncident[] = [
      { id: "ri-1", date: "2026-05-16T10:00:00Z", category: "aggression_to_others", severity: "medium", description: "A", immediateActionTaken: "B", riskReassessed: true, notifiedParties: [], recordedBy: "staff-01" },
      { id: "ri-2", date: "2026-05-14T10:00:00Z", category: "aggression_to_others", severity: "low", description: "A", immediateActionTaken: "B", riskReassessed: true, notifiedParties: [], recordedBy: "staff-01" },
      { id: "ri-3", date: "2026-05-12T10:00:00Z", category: "self_harm", severity: "medium", description: "A", immediateActionTaken: "B", riskReassessed: true, notifiedParties: [], recordedBy: "staff-01" },
    ];
    const profile = makeProfile({ incidents: manyIncidents });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.incidentsLast30Days).toBe(3);
    expect(result.warnings.some(w => w.includes("3 incidents in last 30 days"))).toBe(true);
  });

  it("flags unreassessed high-severity incidents", () => {
    const incidents: RiskIncident[] = [
      { id: "ri-1", date: "2026-05-15T10:00:00Z", category: "self_harm", severity: "high", description: "Serious self-harm", immediateActionTaken: "A&E", riskReassessed: false, notifiedParties: ["CAMHS"], recordedBy: "staff-01" },
    ];
    const profile = makeProfile({ incidents });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("without subsequent risk reassessment"))).toBe(true);
  });

  it("warns about ineffective control measures", () => {
    const assessments = makeAssessments();
    assessments[0].controlMeasures[0].effectiveness = "ineffective";
    const profile = makeProfile({ riskAssessments: assessments });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.ineffectiveMeasures).toBe(1);
    expect(result.warnings.some(w => w.includes("ineffective"))).toBe(true);
  });

  it("flags high risk without active control measures", () => {
    const profile = makeProfile({
      riskAssessments: [
        { id: "ra-1", category: "cse", currentLevel: "high", dateAssessed: "2026-05-01T10:00:00Z", nextReviewDate: "2026-06-01T10:00:00Z", assessedBy: "staff-rm-01", triggers: [], controlMeasures: [{ id: "cm-disc", description: "Old measure", status: "discontinued", implementedDate: "2026-01-01", lastReviewedDate: "2026-03-01", responsiblePerson: "staff-01" }], contextualFactors: [], protectiveFactors: [], escalationPlan: "Refer", childAware: true },
      ],
    });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("No active control measures"))).toBe(true);
  });

  it("warns about child not involved in planning", () => {
    const profile = makeProfile({ childInvolvedInPlanning: false });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("not involved in risk management"))).toBe(true);
  });

  it("flags missing multi-agency meeting for high-risk child", () => {
    const profile = makeProfile({
      multiAgencyMeetingDate: undefined,
      riskAssessments: [
        { id: "ra-1", category: "cse", currentLevel: "high", dateAssessed: "2026-05-01T10:00:00Z", nextReviewDate: "2026-06-01T10:00:00Z", assessedBy: "staff-rm-01", triggers: [], controlMeasures: makeMeasures(), contextualFactors: [], protectiveFactors: [], escalationPlan: "Refer", childAware: true },
      ],
    });
    const result = evaluateChildRiskCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("No multi-agency meeting"))).toBe(true);
  });

  it("tracks positive risk-taking entries", () => {
    const result = evaluateChildRiskCompliance(makeProfile(), NOW);
    expect(result.positiveRiskEntries).toBe(1);
  });

  it("calculates risk management score", () => {
    const result = evaluateChildRiskCompliance(makeProfile(), NOW);
    expect(result.riskManagementScore).toBe(100);

    const minimal = makeProfile({
      riskAssessments: [
        { id: "ra-overdue", category: "aggression_to_others", currentLevel: "high", dateAssessed: "2026-01-01T10:00:00Z", nextReviewDate: "2026-02-01T10:00:00Z", assessedBy: "staff-01", triggers: [], controlMeasures: [{ id: "cm-disc", description: "Old", status: "discontinued", implementedDate: "2026-01-01", lastReviewedDate: "2026-01-01", responsiblePerson: "staff-01", effectiveness: "ineffective" }], contextualFactors: [], protectiveFactors: [], escalationPlan: "X", childAware: false },
      ],
      incidents: [
        { id: "ri-1", date: "2026-05-15T10:00:00Z", category: "self_harm", severity: "critical", description: "X", immediateActionTaken: "Y", riskReassessed: false, notifiedParties: [], recordedBy: "staff-01" },
      ],
      positiveRiskTaking: [],
      childInvolvedInPlanning: false,
      lastOverallReviewDate: "2026-02-01T10:00:00Z",
      multiAgencyMeetingDate: undefined,
    });
    const minResult = evaluateChildRiskCompliance(minimal, NOW);
    expect(minResult.riskManagementScore).toBeLessThan(30);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Risk Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeRiskMetrics", () => {
  it("calculates metrics for home", () => {
    const profiles = [
      makeProfile({ childId: "c1", childName: "Alex" }),
      makeProfile({ childId: "c2", childName: "Jordan" }),
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.childCount).toBe(2);
    expect(result.overallManagementScore).toBe(100);
    expect(result.childInvolvementRate).toBe(100);
  });

  it("counts children at high/very high risk", () => {
    const profiles = [
      makeProfile({ childId: "c1", childName: "Alex" }), // medium
      makeProfile({
        childId: "c2",
        childName: "Jordan",
        riskAssessments: [
          { id: "ra-h", category: "cce", currentLevel: "very_high", dateAssessed: "2026-05-01T10:00:00Z", nextReviewDate: "2026-06-01T10:00:00Z", assessedBy: "staff-rm-01", triggers: [], controlMeasures: makeMeasures(), contextualFactors: [], protectiveFactors: [], escalationPlan: "X", childAware: true },
        ],
        multiAgencyMeetingDate: "2026-05-01T10:00:00Z",
      }),
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.childrenAtVeryHighRisk).toBe(1);
  });

  it("aggregates incidents across children", () => {
    const profiles = [
      makeProfile({ childId: "c1", childName: "Alex" }),
      makeProfile({ childId: "c2", childName: "Jordan" }),
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.totalIncidents30Days).toBe(4); // 2 each (both incidents within 30 days)
    expect(result.totalIncidents90Days).toBe(4); // 2 each
  });

  it("identifies most prevalent risks", () => {
    const profiles = [
      makeProfile({ childId: "c1" }),
      makeProfile({ childId: "c2" }),
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.mostPrevalentRisks.length).toBeGreaterThan(0);
    expect(result.mostPrevalentRisks).toContain("self_harm");
  });

  it("calculates positive risk-taking rate", () => {
    const profiles = [
      makeProfile({ childId: "c1", positiveRiskTaking: [] }),
      makeProfile({ childId: "c2" }), // has 1 entry
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.positiveRiskTakingRate).toBe(50);
  });

  it("identifies children with compliance issues", () => {
    const profiles = [
      makeProfile({ childId: "c1", childName: "Alex" }),
      makeProfile({ childId: "c2", childName: "Jordan", riskAssessments: [] }),
    ];
    const result = calculateHomeRiskMetrics(profiles, "home-oak", NOW);
    expect(result.childrenWithIssues.length).toBe(1);
    expect(result.childrenWithIssues[0].childName).toBe("Jordan");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getRiskCategoryLabel returns readable labels", () => {
    expect(getRiskCategoryLabel("self_harm")).toBe("Self-Harm");
    expect(getRiskCategoryLabel("cse")).toBe("Child Sexual Exploitation");
    expect(getRiskCategoryLabel("missing")).toBe("Missing from Care");
  });

  it("getRiskLevelLabel returns readable labels", () => {
    expect(getRiskLevelLabel("low")).toBe("Low");
    expect(getRiskLevelLabel("very_high")).toBe("Very High");
  });
});
