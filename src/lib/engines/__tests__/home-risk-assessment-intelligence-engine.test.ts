// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME RISK ASSESSMENT INTELLIGENCE ENGINE TESTS
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  computeHomeRiskAssessment,
  type HomeRiskAssessmentInput,
  type RiskAssessmentInput,
  type BehaviourSupportPlanInput,
} from "../home-risk-assessment-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeRA(overrides: Partial<RiskAssessmentInput> = {}): RiskAssessmentInput {
  return {
    id: "ra_1",
    child_id: "yp_alex",
    domain: "aggression",
    current_level: "medium",
    previous_level: "high",
    trend: "decreasing",
    status: "current",
    assessed_date: "2026-05-12",
    review_date: "2026-06-12",
    has_child_views: true,
    mitigation_count: 2,
    effective_mitigations: 2,
    ...overrides,
  };
}

function makeBSP(overrides: Partial<BehaviourSupportPlanInput> = {}): BehaviourSupportPlanInput {
  return {
    id: "bsp_1",
    child_id: "yp_alex",
    status: "active",
    last_reviewed: "2026-04-26",
    review_date: "2026-06-26",
    has_child_views: true,
    primary_behaviour_count: 2,
    improving_behaviours: 2,
    positive_strategy_count: 3,
    de_escalation_stages: 3,
    has_safety_plan: true,
    ...overrides,
  };
}

function baseInput(overrides: Partial<HomeRiskAssessmentInput> = {}): HomeRiskAssessmentInput {
  return {
    today: "2026-05-26",
    total_children: 3,
    child_ids: ["yp_alex", "yp_jordan", "yp_casey"],
    risk_assessments: [
      makeRA({ id: "r1", child_id: "yp_alex", domain: "aggression", trend: "decreasing" }),
      makeRA({ id: "r2", child_id: "yp_jordan", domain: "absconding", trend: "decreasing" }),
      makeRA({ id: "r3", child_id: "yp_casey", domain: "self_harm", current_level: "medium", trend: "stable" }),
      makeRA({ id: "r4", child_id: "yp_alex", domain: "exploitation", current_level: "low", trend: "decreasing" }),
    ],
    behaviour_support_plans: [
      makeBSP({ id: "b1", child_id: "yp_alex" }),
      makeBSP({ id: "b2", child_id: "yp_jordan" }),
    ],
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("Home Risk Assessment Intelligence Engine", () => {

  // ── Structure ─────────────────────────────────────────────────────────────

  it("returns a well-shaped result", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r).toHaveProperty("risk_rating");
    expect(r).toHaveProperty("risk_score");
    expect(r).toHaveProperty("headline");
    expect(r).toHaveProperty("risk_profile");
    expect(r).toHaveProperty("bsp_profile");
    expect(r).toHaveProperty("strengths");
    expect(r).toHaveProperty("concerns");
    expect(r).toHaveProperty("recommendations");
    expect(r).toHaveProperty("insights");
  });

  it("assigns a valid rating", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(["outstanding", "good", "adequate", "inadequate", "insufficient_data"]).toContain(r.risk_rating);
  });

  it("scores between 0 and 100", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_score).toBeGreaterThanOrEqual(0);
    expect(r.risk_score).toBeLessThanOrEqual(100);
  });

  // ── Insufficient Data ─────────────────────────────────────────────────────

  it("returns insufficient_data with no assessments or plans", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [],
      behaviour_support_plans: [],
    }));
    expect(r.risk_rating).toBe("insufficient_data");
    expect(r.risk_score).toBe(0);
  });

  it("has concerns when no data", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [],
      behaviour_support_plans: [],
    }));
    expect(r.concerns.length).toBeGreaterThan(0);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  // ── Risk Profile ──────────────────────────────────────────────────────────

  it("counts current assessments only", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", status: "current" }),
        makeRA({ id: "r2", status: "archived" }),
      ],
    }));
    expect(r.risk_profile.total_assessments).toBe(1);
  });

  it("identifies children with assessments", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_profile.children_with_assessments).toContain("yp_alex");
    expect(r.risk_profile.children_with_assessments).toContain("yp_jordan");
    expect(r.risk_profile.children_with_assessments).toContain("yp_casey");
    expect(r.risk_profile.children_without_assessments).toEqual([]);
  });

  it("identifies children without assessments", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", child_id: "yp_alex" })],
    }));
    expect(r.risk_profile.children_without_assessments).toContain("yp_jordan");
    expect(r.risk_profile.children_without_assessments).toContain("yp_casey");
  });

  it("counts risk levels correctly", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", current_level: "high" }),
        makeRA({ id: "r2", current_level: "very_high" }),
        makeRA({ id: "r3", current_level: "medium" }),
      ],
    }));
    expect(r.risk_profile.high_risk_count).toBe(1);
    expect(r.risk_profile.very_high_risk_count).toBe(1);
  });

  it("counts domains correctly", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_profile.domains["aggression"]).toBe(1);
    expect(r.risk_profile.domains["absconding"]).toBe(1);
    expect(r.risk_profile.domains["self_harm"]).toBe(1);
    expect(r.risk_profile.domains["exploitation"]).toBe(1);
  });

  it("counts trends correctly", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_profile.decreasing_trend_count).toBe(3);
    expect(r.risk_profile.stable_trend_count).toBe(1);
    expect(r.risk_profile.increasing_trend_count).toBe(0);
  });

  it("detects overdue reviews", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", review_date: "2026-05-01" }), // overdue
        makeRA({ id: "r2", review_date: "2026-06-15" }), // not overdue
      ],
    }));
    expect(r.risk_profile.overdue_reviews).toBe(1);
  });

  it("calculates child views rate", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", has_child_views: true }),
        makeRA({ id: "r2", has_child_views: false }),
      ],
    }));
    expect(r.risk_profile.child_views_rate).toBe(50);
  });

  it("calculates mitigation effectiveness rate", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", mitigation_count: 3, effective_mitigations: 2 }),
        makeRA({ id: "r2", mitigation_count: 2, effective_mitigations: 2 }),
      ],
    }));
    // 4 effective out of 5 total = 80%
    expect(r.risk_profile.mitigation_effectiveness_rate).toBe(80);
  });

  // ── BSP Profile ───────────────────────────────────────────────────────────

  it("counts active BSPs only", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [
        makeBSP({ id: "b1", status: "active" }),
        makeBSP({ id: "b2", status: "archived" }),
      ],
    }));
    expect(r.bsp_profile.active_plans).toBe(1);
  });

  it("detects overdue BSP reviews", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [
        makeBSP({ id: "b1", review_date: "2026-05-01" }), // overdue
        makeBSP({ id: "b2", review_date: "2026-07-01" }), // not overdue
      ],
    }));
    expect(r.bsp_profile.overdue_reviews).toBe(1);
  });

  it("calculates improving behaviour rate", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [
        makeBSP({ id: "b1", primary_behaviour_count: 2, improving_behaviours: 1 }),
        makeBSP({ id: "b2", primary_behaviour_count: 3, improving_behaviours: 2 }),
      ],
    }));
    // 3 improving out of 5 = 60%
    expect(r.bsp_profile.improving_behaviour_rate).toBe(60);
  });

  it("calculates average strategies per plan", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [
        makeBSP({ id: "b1", positive_strategy_count: 4 }),
        makeBSP({ id: "b2", positive_strategy_count: 2 }),
      ],
    }));
    expect(r.bsp_profile.avg_strategies_per_plan).toBe(3);
  });

  it("calculates safety plan coverage", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [
        makeBSP({ id: "b1", has_safety_plan: true }),
        makeBSP({ id: "b2", has_safety_plan: false }),
      ],
    }));
    expect(r.bsp_profile.safety_plan_coverage).toBe(50);
  });

  // ── Rating Boundaries ─────────────────────────────────────────────────────

  it("rates outstanding (score >= 80)", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_score).toBeGreaterThanOrEqual(80);
    expect(r.risk_rating).toBe("outstanding");
  });

  it("rates good (65 <= score < 80)", () => {
    // All covered, but some overdue reviews and mixed trends
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", child_id: "yp_alex", trend: "decreasing", review_date: "2026-05-01" }), // overdue
        makeRA({ id: "r2", child_id: "yp_jordan", trend: "stable" }),
        makeRA({ id: "r3", child_id: "yp_casey", trend: "stable", has_child_views: false }),
      ],
      behaviour_support_plans: [
        makeBSP({ id: "b1", improving_behaviours: 1 }),
      ],
    }));
    expect(r.risk_score).toBeGreaterThanOrEqual(65);
    expect(r.risk_score).toBeLessThan(80);
    expect(r.risk_rating).toBe("good");
  });

  it("rates adequate (45 <= score < 65)", () => {
    // One child missing, one overdue RA, stable trends, mixed views/mitigations
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", child_id: "yp_alex", trend: "stable", has_child_views: true, review_date: "2026-05-01", mitigation_count: 2, effective_mitigations: 0 }),
        makeRA({ id: "r2", child_id: "yp_jordan", trend: "stable", has_child_views: true }),
      ],
      behaviour_support_plans: [
        makeBSP({ id: "b1", has_child_views: true, improving_behaviours: 0, has_safety_plan: true, review_date: "2026-05-01" }),
      ],
    }));
    expect(r.risk_score).toBeGreaterThanOrEqual(45);
    expect(r.risk_score).toBeLessThan(65);
    expect(r.risk_rating).toBe("adequate");
  });

  it("rates inadequate (score < 45)", () => {
    // Many gaps, increasing risks, no views, overdue everything
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", child_id: "yp_alex", current_level: "very_high", trend: "increasing", has_child_views: false, review_date: "2026-04-01", mitigation_count: 2, effective_mitigations: 0 }),
        makeRA({ id: "r2", child_id: "yp_alex", domain: "self_harm", current_level: "high", trend: "increasing", has_child_views: false, review_date: "2026-04-01", mitigation_count: 1, effective_mitigations: 0 }),
      ],
      behaviour_support_plans: [
        makeBSP({ id: "b1", has_child_views: false, improving_behaviours: 0, has_safety_plan: false, review_date: "2026-04-01" }),
      ],
    }));
    expect(r.risk_score).toBeLessThan(45);
    expect(r.risk_rating).toBe("inadequate");
  });

  // ── Scoring Modifiers ─────────────────────────────────────────────────────

  it("penalises increasing risk trends", () => {
    const stable = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", trend: "stable" }),
        makeRA({ id: "r2", trend: "stable" }),
      ],
    }));
    const increasing = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", trend: "increasing" }),
        makeRA({ id: "r2", trend: "increasing" }),
      ],
    }));
    expect(increasing.risk_score).toBeLessThan(stable.risk_score);
  });

  it("rewards decreasing trends", () => {
    const stable = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", trend: "stable" }),
        makeRA({ id: "r2", trend: "stable" }),
      ],
    }));
    const decreasing = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", trend: "decreasing" }),
        makeRA({ id: "r2", trend: "decreasing" }),
      ],
    }));
    expect(decreasing.risk_score).toBeGreaterThan(stable.risk_score);
  });

  it("penalises very high risk", () => {
    const medium = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", current_level: "medium" })],
    }));
    const veryHigh = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", current_level: "very_high" })],
    }));
    expect(veryHigh.risk_score).toBeLessThan(medium.risk_score);
  });

  it("penalises overdue reviews", () => {
    const onTime = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", review_date: "2026-06-15" })],
    }));
    const overdue = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", review_date: "2026-04-01" })],
    }));
    expect(overdue.risk_score).toBeLessThan(onTime.risk_score);
  });

  // ── Strengths ─────────────────────────────────────────────────────────────

  it("notes strength for all children covered", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.strengths.some(s => s.toLowerCase().includes("all children"))).toBe(true);
  });

  it("notes strength for no increasing trends", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.strengths.some(s => s.toLowerCase().includes("no increasing"))).toBe(true);
  });

  it("notes strength for decreasing trends", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.strengths.some(s => s.toLowerCase().includes("decreasing"))).toBe(true);
  });

  it("notes strength for child views", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.strengths.some(s => s.toLowerCase().includes("child views"))).toBe(true);
  });

  // ── Concerns ──────────────────────────────────────────────────────────────

  it("raises concern for children without assessments", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", child_id: "yp_alex" })],
    }));
    expect(r.concerns.some(c => c.toLowerCase().includes("without risk assessments"))).toBe(true);
  });

  it("raises concern for very high risk", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", current_level: "very_high" })],
    }));
    expect(r.concerns.some(c => c.toLowerCase().includes("very high"))).toBe(true);
  });

  it("raises concern for increasing trends", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", trend: "increasing" })],
    }));
    expect(r.concerns.some(c => c.toLowerCase().includes("increasing"))).toBe(true);
  });

  it("raises concern for overdue reviews", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", review_date: "2026-04-01" })],
    }));
    expect(r.concerns.some(c => c.toLowerCase().includes("overdue"))).toBe(true);
  });

  // ── Recommendations ───────────────────────────────────────────────────────

  it("recommends assessments for uncovered children", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", child_id: "yp_alex" })],
    }));
    expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.regulatory_ref === "Reg 12")).toBe(true);
  });

  it("recommends strategy review for increasing trends", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", trend: "increasing" })],
    }));
    expect(r.recommendations.some(rec => rec.recommendation.toLowerCase().includes("increasing"))).toBe(true);
  });

  it("recommendations have ranked order", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", child_id: "yp_alex", trend: "increasing", current_level: "very_high", review_date: "2026-04-01" }),
      ],
    }));
    const ranks = r.recommendations.map(rec => rec.rank);
    for (let i = 0; i < ranks.length - 1; i++) {
      expect(ranks[i]).toBeLessThan(ranks[i + 1]);
    }
  });

  // ── Insights ──────────────────────────────────────────────────────────────

  it("generates critical insight for very high risk", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [makeRA({ id: "r1", current_level: "very_high" })],
    }));
    expect(r.insights.some(i => i.severity === "critical" && i.text.toLowerCase().includes("very high"))).toBe(true);
  });

  it("generates positive insight for decreasing trends", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.insights.some(i => i.severity === "positive")).toBe(true);
  });

  it("generates positive insight for mitigation effectiveness", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.insights.some(i => i.severity === "positive" && i.text.toLowerCase().includes("mitigation"))).toBe(true);
  });

  // ── Headlines ─────────────────────────────────────────────────────────────

  it("outstanding headline mentions outstanding", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.headline.toLowerCase()).toContain("outstanding");
  });

  it("inadequate headline mentions inadequate", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [
        makeRA({ id: "r1", child_id: "yp_alex", current_level: "very_high", trend: "increasing", has_child_views: false, review_date: "2026-04-01", mitigation_count: 2, effective_mitigations: 0 }),
        makeRA({ id: "r2", child_id: "yp_alex", current_level: "high", trend: "increasing", has_child_views: false, review_date: "2026-04-01", mitigation_count: 1, effective_mitigations: 0 }),
      ],
      behaviour_support_plans: [
        makeBSP({ id: "b1", has_child_views: false, improving_behaviours: 0, has_safety_plan: false, review_date: "2026-04-01" }),
      ],
    }));
    expect(r.headline.toLowerCase()).toContain("inadequate");
  });

  // ── Score Clamping ────────────────────────────────────────────────────────

  it("clamps score to minimum 0", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: Array.from({ length: 5 }, (_, i) => makeRA({
        id: `r${i}`,
        child_id: "yp_alex",
        current_level: "very_high",
        trend: "increasing",
        has_child_views: false,
        review_date: "2026-04-01",
        mitigation_count: 2,
        effective_mitigations: 0,
      })),
      behaviour_support_plans: [],
    }));
    expect(r.risk_score).toBeGreaterThanOrEqual(0);
  });

  it("clamps score to maximum 100", () => {
    const r = computeHomeRiskAssessment(baseInput());
    expect(r.risk_score).toBeLessThanOrEqual(100);
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  it("works with only BSPs and no risk assessments", () => {
    const r = computeHomeRiskAssessment(baseInput({
      risk_assessments: [],
      behaviour_support_plans: [makeBSP({ id: "b1" })],
    }));
    expect(r.risk_rating).not.toBe("insufficient_data");
    expect(r.risk_score).toBeGreaterThan(0);
  });

  it("works with only risk assessments and no BSPs", () => {
    const r = computeHomeRiskAssessment(baseInput({
      behaviour_support_plans: [],
    }));
    expect(r.risk_rating).not.toBe("insufficient_data");
    expect(r.risk_score).toBeGreaterThan(0);
  });

  it("handles zero children gracefully", () => {
    const r = computeHomeRiskAssessment(baseInput({
      total_children: 0,
      child_ids: [],
      risk_assessments: [makeRA()],
    }));
    expect(r.risk_score).toBeGreaterThanOrEqual(0);
  });
});
