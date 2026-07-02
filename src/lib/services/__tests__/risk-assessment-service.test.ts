// ══════════════════════════════════════════════════════════════════════════════
// CARA — RISK ASSESSMENT SERVICE TESTS
// Pure-function tests for risk scoring, profile computation, trend analysis,
// review overdue detection, and child risk summary.
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { _testing } from "../risk-assessment-service";

const {
  computeRiskScore,
  computeRiskProfile,
  computeRiskTrend,
  isReviewOverdue,
  computeChildRiskSummary,
  RISK_CATEGORIES,
  RISK_MATRIX,
} = _testing;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Fixed "now" for deterministic date tests. */
const NOW = new Date("2026-06-01T00:00:00Z");

/** Build a minimal risk assessment for profile/trend tests. */
function ra(
  category: string,
  current_risk_level: "very_high" | "high" | "medium" | "low" | "very_low",
  status: string,
) {
  return { category, current_risk_level, status };
}

/** Build a minimal child risk assessment. */
function childRa(
  child_id: string | null,
  category: string,
  current_risk_level: "very_high" | "high" | "medium" | "low" | "very_low",
  status: string,
) {
  return { child_id, category, current_risk_level, status };
}

// ── RISK_CATEGORIES ─────────────────────────────────────────────────────────

describe("RISK_CATEGORIES", () => {
  it("has exactly 15 entries", () => {
    expect(RISK_CATEGORIES).toHaveLength(15);
  });

  it("each entry has category, label, description, and regulationRef", () => {
    for (const rc of RISK_CATEGORIES) {
      expect(rc).toHaveProperty("category");
      expect(rc).toHaveProperty("label");
      expect(rc).toHaveProperty("description");
      expect(rc).toHaveProperty("regulationRef");
      expect(typeof rc.category).toBe("string");
      expect(typeof rc.label).toBe("string");
      expect(typeof rc.description).toBe("string");
      expect(typeof rc.regulationRef).toBe("string");
    }
  });

  it("contains expected categories", () => {
    const cats = RISK_CATEGORIES.map((c) => c.category);
    expect(cats).toContain("self_harm");
    expect(cats).toContain("exploitation");
    expect(cats).toContain("radicalisation");
    expect(cats).toContain("fire_setting");
  });
});

// ── RISK_MATRIX ─────────────────────────────────────────────────────────────

describe("RISK_MATRIX", () => {
  it("has 25 entries (5x5 grid)", () => {
    expect(Object.keys(RISK_MATRIX)).toHaveLength(25);
  });

  it("maps 1x1 to very_low (score 1)", () => {
    expect(RISK_MATRIX["1x1"]).toBe("very_low");
  });

  it("maps 2x2 to very_low (score 4)", () => {
    expect(RISK_MATRIX["2x2"]).toBe("very_low");
  });

  it("maps 1x5 to low (score 5)", () => {
    expect(RISK_MATRIX["1x5"]).toBe("low");
  });

  it("maps 3x3 to medium (score 9)", () => {
    expect(RISK_MATRIX["3x3"]).toBe("medium");
  });

  it("maps 3x5 to high (score 15)", () => {
    expect(RISK_MATRIX["3x5"]).toBe("high");
  });

  it("maps 5x5 to very_high (score 25)", () => {
    expect(RISK_MATRIX["5x5"]).toBe("very_high");
  });

  it("maps 4x5 to very_high (score 20)", () => {
    expect(RISK_MATRIX["4x5"]).toBe("very_high");
  });
});

// ── computeRiskScore ────────────────────────────────────────────────────────

describe("computeRiskScore", () => {
  it("returns very_low for likelihood=1, impact=1 (score 1)", () => {
    const result = computeRiskScore(1, 1);
    expect(result.score).toBe(1);
    expect(result.level).toBe("very_low");
  });

  it("returns low for likelihood=1, impact=5 (score 5)", () => {
    const result = computeRiskScore(1, 5);
    expect(result.score).toBe(5);
    expect(result.level).toBe("low");
  });

  it("returns medium for likelihood=3, impact=4 (score 12)", () => {
    const result = computeRiskScore(3, 4);
    expect(result.score).toBe(12);
    expect(result.level).toBe("medium");
  });

  it("returns high for likelihood=5, impact=3 (score 15)", () => {
    const result = computeRiskScore(5, 3);
    expect(result.score).toBe(15);
    expect(result.level).toBe("high");
  });

  it("returns very_high for likelihood=5, impact=5 (score 25)", () => {
    const result = computeRiskScore(5, 5);
    expect(result.score).toBe(25);
    expect(result.level).toBe("very_high");
  });

  it("returns very_high for likelihood=4, impact=5 (score 20, boundary)", () => {
    const result = computeRiskScore(4, 5);
    expect(result.score).toBe(20);
    expect(result.level).toBe("very_high");
  });

  it("returns high for likelihood=4, impact=4 (score 16)", () => {
    const result = computeRiskScore(4, 4);
    expect(result.score).toBe(16);
    expect(result.level).toBe("high");
  });
});

// ── computeRiskProfile ──────────────────────────────────────────────────────

describe("computeRiskProfile", () => {
  it("returns zeroed profile for empty assessments", () => {
    const profile = computeRiskProfile([]);
    expect(profile.total_assessments).toBe(0);
    expect(profile.active).toBe(0);
    expect(profile.by_level.very_high).toBe(0);
    expect(profile.by_level.high).toBe(0);
    expect(profile.by_level.medium).toBe(0);
    expect(profile.by_level.low).toBe(0);
    expect(profile.by_level.very_low).toBe(0);
    expect(profile.by_category).toEqual({});
    expect(profile.highest_risk_category).toBeNull();
    expect(profile.overall_risk_level).toBe("very_low");
    expect(profile.needs_immediate_review).toBe(0);
  });

  it("counts all active assessments correctly", () => {
    const assessments = [
      ra("self_harm", "high", "active"),
      ra("exploitation", "medium", "active"),
      ra("absconding", "low", "active"),
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.total_assessments).toBe(3);
    expect(profile.active).toBe(3);
  });

  it("handles mixed statuses (only active/escalated count as active)", () => {
    const assessments = [
      ra("self_harm", "very_high", "active"),
      ra("exploitation", "high", "escalated"),
      ra("absconding", "medium", "mitigated"),
      ra("bullying", "low", "closed"),
      ra("fire_setting", "very_low", "under_review"),
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.total_assessments).toBe(5);
    expect(profile.active).toBe(2); // active + escalated
  });

  it("computes by_level correctly", () => {
    const assessments = [
      ra("self_harm", "very_high", "active"),
      ra("exploitation", "high", "active"),
      ra("absconding", "high", "mitigated"),
      ra("bullying", "medium", "active"),
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.by_level.very_high).toBe(1);
    expect(profile.by_level.high).toBe(2);
    expect(profile.by_level.medium).toBe(1);
    expect(profile.by_level.low).toBe(0);
    expect(profile.by_level.very_low).toBe(0);
  });

  it("computes by_category correctly", () => {
    const assessments = [
      ra("self_harm", "high", "active"),
      ra("self_harm", "medium", "mitigated"),
      ra("exploitation", "low", "active"),
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.by_category).toEqual({ self_harm: 2, exploitation: 1 });
  });

  it("identifies highest_risk_category from active assessments", () => {
    const assessments = [
      ra("self_harm", "medium", "active"),
      ra("exploitation", "very_high", "active"),
      ra("absconding", "high", "mitigated"), // not active, ignored
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.highest_risk_category).toBe("exploitation");
  });

  it("sets overall_risk_level to highest active level", () => {
    const assessments = [
      ra("self_harm", "low", "active"),
      ra("exploitation", "high", "active"),
      ra("absconding", "very_high", "mitigated"), // not active
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.overall_risk_level).toBe("high");
  });

  it("counts needs_immediate_review for very_high and high active assessments", () => {
    const assessments = [
      ra("self_harm", "very_high", "active"),
      ra("exploitation", "high", "escalated"),
      ra("absconding", "medium", "active"),
      ra("bullying", "high", "mitigated"), // not active
    ];
    const profile = computeRiskProfile(assessments);
    expect(profile.needs_immediate_review).toBe(2);
  });
});

// ── computeRiskTrend ────────────────────────────────────────────────────────

describe("computeRiskTrend", () => {
  it("returns improving when high/very_high active risks decreased", () => {
    const current = [
      ra("self_harm", "medium", "active"),
    ];
    const previous = [
      ra("self_harm", "high", "active"),
      ra("exploitation", "very_high", "active"),
    ];
    const trend = computeRiskTrend(current, previous);
    expect(trend.direction).toBe("improving");
    expect(trend.change_count).toBeLessThan(0);
  });

  it("returns stable when high/very_high active risks unchanged", () => {
    const current = [
      ra("self_harm", "high", "active"),
    ];
    const previous = [
      ra("self_harm", "high", "active"),
    ];
    const trend = computeRiskTrend(current, previous);
    expect(trend.direction).toBe("stable");
    expect(trend.change_count).toBe(0);
  });

  it("returns deteriorating when high/very_high active risks increased", () => {
    const current = [
      ra("self_harm", "very_high", "active"),
      ra("exploitation", "high", "active"),
      ra("absconding", "high", "escalated"),
    ];
    const previous = [
      ra("self_harm", "medium", "active"),
    ];
    const trend = computeRiskTrend(current, previous);
    expect(trend.direction).toBe("deteriorating");
    expect(trend.change_count).toBeGreaterThan(0);
  });

  it("calculates new_risks as increase in active count", () => {
    const current = [
      ra("self_harm", "medium", "active"),
      ra("exploitation", "low", "active"),
      ra("absconding", "low", "active"),
    ];
    const previous = [
      ra("self_harm", "medium", "active"),
    ];
    const trend = computeRiskTrend(current, previous);
    expect(trend.new_risks).toBe(2);
  });

  it("calculates closed_risks as decrease in active count", () => {
    const current = [
      ra("self_harm", "medium", "active"),
    ];
    const previous = [
      ra("self_harm", "medium", "active"),
      ra("exploitation", "low", "active"),
      ra("absconding", "low", "active"),
    ];
    const trend = computeRiskTrend(current, previous);
    expect(trend.closed_risks).toBe(2);
  });

  it("returns zeros for empty inputs", () => {
    const trend = computeRiskTrend([], []);
    expect(trend.direction).toBe("stable");
    expect(trend.change_count).toBe(0);
    expect(trend.new_risks).toBe(0);
    expect(trend.closed_risks).toBe(0);
  });
});

// ── isReviewOverdue ─────────────────────────────────────────────────────────

describe("isReviewOverdue", () => {
  it("returns true when next review date is in the past", () => {
    expect(isReviewOverdue("2026-05-01", NOW)).toBe(true);
  });

  it("returns false when next review date is in the future", () => {
    expect(isReviewOverdue("2026-07-01", NOW)).toBe(false);
  });

  it("returns false when next review date is exactly now", () => {
    // getTime() > getTime() is false when equal
    expect(isReviewOverdue("2026-06-01T00:00:00Z", NOW)).toBe(false);
  });
});

// ── computeChildRiskSummary ─────────────────────────────────────────────────

describe("computeChildRiskSummary", () => {
  it("returns empty summary for no assessments", () => {
    const summary = computeChildRiskSummary([]);
    expect(summary.child_id).toBeNull();
    expect(summary.total).toBe(0);
    expect(summary.active_high_plus).toBe(0);
    expect(summary.categories).toEqual([]);
    expect(summary.recommended_review_frequency).toBe("quarterly");
    expect(summary.flag_level).toBe("green");
  });

  it("returns correct child_id from first assessment", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "low", "active"),
    ]);
    expect(summary.child_id).toBe("child-1");
  });

  it("counts active_high_plus correctly", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "very_high", "active"),
      childRa("child-1", "exploitation", "high", "escalated"),
      childRa("child-1", "absconding", "medium", "active"),
      childRa("child-1", "bullying", "high", "mitigated"), // not active
    ]);
    expect(summary.active_high_plus).toBe(2);
  });

  it("collects unique categories", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "medium", "active"),
      childRa("child-1", "self_harm", "low", "mitigated"),
      childRa("child-1", "exploitation", "high", "active"),
    ]);
    expect(summary.categories).toEqual(["self_harm", "exploitation"]);
  });

  it("sets flag_level to red for very_high active risk", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "very_high", "active"),
    ]);
    expect(summary.flag_level).toBe("red");
  });

  it("sets flag_level to red for high active risk", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "exploitation", "high", "active"),
    ]);
    expect(summary.flag_level).toBe("red");
  });

  it("sets flag_level to amber for medium active risk", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "absconding", "medium", "active"),
    ]);
    expect(summary.flag_level).toBe("amber");
  });

  it("sets flag_level to green for low active risk", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "bullying", "low", "active"),
    ]);
    expect(summary.flag_level).toBe("green");
  });

  it("sets flag_level to green when all risks are mitigated (no active)", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "very_high", "mitigated"),
      childRa("child-1", "exploitation", "high", "closed"),
    ]);
    expect(summary.flag_level).toBe("green");
  });

  it("sets recommended_review_frequency to weekly for very_high", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "self_harm", "very_high", "active"),
    ]);
    expect(summary.recommended_review_frequency).toBe("weekly");
  });

  it("sets recommended_review_frequency to fortnightly for high", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "exploitation", "high", "escalated"),
    ]);
    expect(summary.recommended_review_frequency).toBe("fortnightly");
  });

  it("sets recommended_review_frequency to monthly for medium", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "absconding", "medium", "active"),
    ]);
    expect(summary.recommended_review_frequency).toBe("monthly");
  });

  it("sets recommended_review_frequency to quarterly for low/very_low", () => {
    const summary = computeChildRiskSummary([
      childRa("child-1", "bullying", "low", "active"),
      childRa("child-1", "fire_setting", "very_low", "active"),
    ]);
    expect(summary.recommended_review_frequency).toBe("quarterly");
  });
});
