import { describe, it, expect } from "vitest";
import {
  computeChildRiskReviewMetrics,
  identifyChildRiskReviewAlerts,
} from "./child-risk-assessment-review-service";
import type { ChildRiskAssessmentReviewRecord } from "./child-risk-assessment-review-service";

// -- Factory ------------------------------------------------------------------

function makeRecord(overrides: Partial<ChildRiskAssessmentReviewRecord> = {}): ChildRiskAssessmentReviewRecord {
  return {
    id: "rev-1",
    home_id: "home-1",
    risk_domain: "self_harm",
    review_outcome: "risk_unchanged",
    current_risk_level: "medium",
    review_frequency: "monthly",
    review_date: "2026-05-01",
    child_name: "Child A",
    child_id: null,
    reviewed_by: "Reviewer 1",
    child_participated: true,
    social_worker_consulted: true,
    multi_agency_input: true,
    triggers_updated: true,
    protective_factors_reviewed: true,
    safety_plan_updated: true,
    staff_briefed: true,
    management_oversight: true,
    evidence_documented: true,
    dynamic_factors_assessed: true,
    historical_factors_reviewed: true,
    contingency_plan_current: true,
    issues_found: [],
    actions_taken: [],
    previous_risk_level: null,
    next_review_date: null,
    notes: null,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    ...overrides,
  };
}

// -- computeChildRiskReviewMetrics --------------------------------------------

describe("computeChildRiskReviewMetrics", () => {
  it("returns zeroes for empty array", () => {
    const m = computeChildRiskReviewMetrics([]);
    expect(m.total_reviews).toBe(0);
    expect(m.risk_increased_count).toBe(0);
    expect(m.new_risk_count).toBe(0);
    expect(m.risk_reduced_count).toBe(0);
    expect(m.very_high_count).toBe(0);
    expect(m.unique_children).toBe(0);
  });

  it("counts review outcomes correctly", () => {
    const records = [
      makeRecord({ id: "1", review_outcome: "risk_increased" }),
      makeRecord({ id: "2", review_outcome: "risk_increased" }),
      makeRecord({ id: "3", review_outcome: "new_risk_identified" }),
      makeRecord({ id: "4", review_outcome: "risk_reduced" }),
      makeRecord({ id: "5", review_outcome: "risk_unchanged" }),
    ];
    const m = computeChildRiskReviewMetrics(records);
    expect(m.risk_increased_count).toBe(2);
    expect(m.new_risk_count).toBe(1);
    expect(m.risk_reduced_count).toBe(1);
  });

  it("counts very_high risk level", () => {
    const records = [
      makeRecord({ id: "1", current_risk_level: "very_high" }),
      makeRecord({ id: "2", current_risk_level: "high" }),
      makeRecord({ id: "3", current_risk_level: "very_high" }),
    ];
    const m = computeChildRiskReviewMetrics(records);
    expect(m.very_high_count).toBe(2);
  });

  it("calculates boolean rates", () => {
    const records = [
      makeRecord({ id: "1", child_participated: true, staff_briefed: true, management_oversight: true }),
      makeRecord({ id: "2", child_participated: false, staff_briefed: false, management_oversight: false }),
    ];
    const m = computeChildRiskReviewMetrics(records);
    expect(m.child_participated_rate).toBe(50);
    expect(m.staff_briefed_rate).toBe(50);
    expect(m.management_oversight_rate).toBe(50);
  });

  it("builds breakdowns by domain, outcome, level, frequency", () => {
    const records = [
      makeRecord({ id: "1", risk_domain: "self_harm", review_outcome: "risk_reduced", current_risk_level: "low", review_frequency: "weekly" }),
      makeRecord({ id: "2", risk_domain: "self_harm", review_outcome: "risk_unchanged", current_risk_level: "medium", review_frequency: "monthly" }),
      makeRecord({ id: "3", risk_domain: "exploitation", review_outcome: "risk_reduced", current_risk_level: "low", review_frequency: "weekly" }),
    ];
    const m = computeChildRiskReviewMetrics(records);
    expect(m.by_risk_domain["self_harm"]).toBe(2);
    expect(m.by_risk_domain["exploitation"]).toBe(1);
    expect(m.by_review_outcome["risk_reduced"]).toBe(2);
    expect(m.by_risk_level["low"]).toBe(2);
    expect(m.by_review_frequency["weekly"]).toBe(2);
  });

  it("counts unique children", () => {
    const records = [
      makeRecord({ id: "1", child_name: "A" }),
      makeRecord({ id: "2", child_name: "A" }),
      makeRecord({ id: "3", child_name: "B" }),
    ];
    const m = computeChildRiskReviewMetrics(records);
    expect(m.unique_children).toBe(2);
  });
});

// -- identifyChildRiskReviewAlerts --------------------------------------------

describe("identifyChildRiskReviewAlerts", () => {
  it("returns empty for empty input", () => {
    expect(identifyChildRiskReviewAlerts([])).toEqual([]);
  });

  it("fires critical alert for risk_increased without safety plan update", () => {
    const records = [makeRecord({ review_outcome: "risk_increased", safety_plan_updated: false, child_participated: true, staff_briefed: true, triggers_updated: true, contingency_plan_current: true })];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "risk_increased_no_plan");
    expect(found).toBeDefined();
    expect(found!.severity).toBe("critical");
  });

  it("fires high alert for child not participated (>= 1 record)", () => {
    const records = [makeRecord({ child_participated: false, staff_briefed: true, triggers_updated: true, contingency_plan_current: true })];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "child_not_participated");
    expect(found).toBeDefined();
    expect(found!.severity).toBe("high");
    expect(found!.message).toContain("1 review has");
  });

  it("fires high alert for staff not briefed (>= 1 record)", () => {
    const records = [makeRecord({ staff_briefed: false, child_participated: true, triggers_updated: true, contingency_plan_current: true })];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "staff_not_briefed");
    expect(found).toBeDefined();
    expect(found!.severity).toBe("high");
  });

  it("fires medium alert for triggers not updated (>= 2 records)", () => {
    const records = [
      makeRecord({ id: "1", triggers_updated: false, child_participated: true, staff_briefed: true, contingency_plan_current: true }),
      makeRecord({ id: "2", triggers_updated: false, child_participated: true, staff_briefed: true, contingency_plan_current: true }),
    ];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "triggers_not_updated");
    expect(found).toBeDefined();
    expect(found!.severity).toBe("medium");
  });

  it("does NOT fire triggers alert for only 1 record without triggers updated", () => {
    const records = [makeRecord({ triggers_updated: false, child_participated: true, staff_briefed: true, contingency_plan_current: true })];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "triggers_not_updated");
    expect(found).toBeUndefined();
  });

  it("fires medium alert for contingency plans not current (>= 2 records)", () => {
    const records = [
      makeRecord({ id: "1", contingency_plan_current: false, child_participated: true, staff_briefed: true, triggers_updated: true }),
      makeRecord({ id: "2", contingency_plan_current: false, child_participated: true, staff_briefed: true, triggers_updated: true }),
    ];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "contingency_not_current");
    expect(found).toBeDefined();
    expect(found!.severity).toBe("medium");
  });

  it("does NOT fire contingency alert for only 1 record", () => {
    const records = [makeRecord({ contingency_plan_current: false, child_participated: true, staff_briefed: true, triggers_updated: true })];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "contingency_not_current");
    expect(found).toBeUndefined();
  });

  it("uses plural wording for multiple reviews", () => {
    const records = [
      makeRecord({ id: "1", child_participated: false, staff_briefed: true }),
      makeRecord({ id: "2", child_participated: false, staff_briefed: true }),
    ];
    const alerts = identifyChildRiskReviewAlerts(records);
    const found = alerts.find((a) => a.type === "child_not_participated");
    expect(found).toBeDefined();
    expect(found!.message).toContain("2 reviews have");
  });
});
