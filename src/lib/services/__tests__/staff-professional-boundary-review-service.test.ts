import { describe, it, expect } from "vitest";
import {
  _testing,
  BOUNDARY_AREAS,
  REVIEW_OUTCOMES,
  REVIEW_STATUSES,
  RISK_LEVELS,
  type StaffProfessionalBoundaryReviewRow,
} from "../staff-professional-boundary-review-service";

const { computeBoundaryReviewMetrics, computeBoundaryReviewAlerts, generateBoundaryReviewAriaInsights } = _testing;

const now = new Date(new Date().toISOString().split("T")[0]);

function makeRow(overrides?: Partial<StaffProfessionalBoundaryReviewRow>): StaffProfessionalBoundaryReviewRow {
  return {
    id: overrides?.id ?? "a-1",
    home_id: overrides?.home_id ?? "home-1",
    staff_name: overrides?.staff_name ?? "Staff A",
    staff_id: "staff_id" in (overrides ?? {}) ? (overrides!.staff_id ?? null) : null,
    review_date: overrides?.review_date ?? now.toISOString().split("T")[0],
    boundary_area: overrides?.boundary_area ?? "physical_contact",
    review_outcome: overrides?.review_outcome ?? "appropriate",
    review_status: overrides?.review_status ?? "completed",
    risk_level: overrides?.risk_level ?? "none",
    training_completed: overrides?.training_completed ?? true,
    supervision_discussed: overrides?.supervision_discussed ?? true,
    policy_acknowledged: overrides?.policy_acknowledged ?? true,
    self_assessment_completed: overrides?.self_assessment_completed ?? true,
    child_impact_assessed: overrides?.child_impact_assessed ?? true,
    management_aware: overrides?.management_aware ?? true,
    action_plan_created: overrides?.action_plan_created ?? true,
    action_plan_completed: overrides?.action_plan_completed ?? true,
    reviewer_name: "reviewer_name" in (overrides ?? {}) ? (overrides!.reviewer_name ?? null) : null,
    investigation_notes: "investigation_notes" in (overrides ?? {}) ? (overrides!.investigation_notes ?? null) : null,
    notes: "notes" in (overrides ?? {}) ? (overrides!.notes ?? null) : null,
    created_at: overrides?.created_at ?? now.toISOString(),
    updated_at: overrides?.updated_at ?? now.toISOString(),
  };
}

describe("staff-professional-boundary-review-service", () => {
  // ── Enum sanity ──────────────────────────────────────────────────────

  describe("enums", () => {
    it("BOUNDARY_AREAS has 10 values", () => { expect(BOUNDARY_AREAS).toHaveLength(10); });
    it("BOUNDARY_AREAS contains physical_contact", () => { expect(BOUNDARY_AREAS).toContain("physical_contact"); });
    it("BOUNDARY_AREAS contains emotional_boundaries", () => { expect(BOUNDARY_AREAS).toContain("emotional_boundaries"); });
    it("BOUNDARY_AREAS contains social_media", () => { expect(BOUNDARY_AREAS).toContain("social_media"); });
    it("BOUNDARY_AREAS contains gift_giving", () => { expect(BOUNDARY_AREAS).toContain("gift_giving"); });
    it("BOUNDARY_AREAS contains personal_disclosure", () => { expect(BOUNDARY_AREAS).toContain("personal_disclosure"); });
    it("BOUNDARY_AREAS contains dual_relationships", () => { expect(BOUNDARY_AREAS).toContain("dual_relationships"); });
    it("BOUNDARY_AREAS contains confidentiality", () => { expect(BOUNDARY_AREAS).toContain("confidentiality"); });
    it("BOUNDARY_AREAS contains favouritism", () => { expect(BOUNDARY_AREAS).toContain("favouritism"); });
    it("BOUNDARY_AREAS contains communication_channels", () => { expect(BOUNDARY_AREAS).toContain("communication_channels"); });
    it("BOUNDARY_AREAS contains home_visits", () => { expect(BOUNDARY_AREAS).toContain("home_visits"); });
    it("REVIEW_OUTCOMES has 5 values", () => { expect(REVIEW_OUTCOMES).toHaveLength(5); });
    it("REVIEW_OUTCOMES contains appropriate", () => { expect(REVIEW_OUTCOMES).toContain("appropriate"); });
    it("REVIEW_OUTCOMES contains boundary_breached", () => { expect(REVIEW_OUTCOMES).toContain("boundary_breached"); });
    it("REVIEW_OUTCOMES contains investigation_required", () => { expect(REVIEW_OUTCOMES).toContain("investigation_required"); });
    it("REVIEW_STATUSES has 5 values", () => { expect(REVIEW_STATUSES).toHaveLength(5); });
    it("REVIEW_STATUSES contains scheduled", () => { expect(REVIEW_STATUSES).toContain("scheduled"); });
    it("REVIEW_STATUSES contains follow_up_required", () => { expect(REVIEW_STATUSES).toContain("follow_up_required"); });
    it("REVIEW_STATUSES contains closed", () => { expect(REVIEW_STATUSES).toContain("closed"); });
    it("RISK_LEVELS has 5 values", () => { expect(RISK_LEVELS).toHaveLength(5); });
    it("RISK_LEVELS contains none", () => { expect(RISK_LEVELS).toContain("none"); });
    it("RISK_LEVELS contains critical", () => { expect(RISK_LEVELS).toContain("critical"); });
  });

  // ── computeBoundaryReviewMetrics ──────────────────────────────────────

  describe("computeBoundaryReviewMetrics", () => {
    it("returns zeros for empty", () => {
      const m = computeBoundaryReviewMetrics([]);
      expect(m.total_reviews).toBe(0);
      expect(m.boundary_breached_count).toBe(0);
      expect(m.investigation_count).toBe(0);
      expect(m.crossed_count).toBe(0);
      expect(m.follow_up_count).toBe(0);
      expect(m.training_completed_rate).toBe(0);
      expect(m.supervision_discussed_rate).toBe(0);
      expect(m.policy_acknowledged_rate).toBe(0);
      expect(m.self_assessment_rate).toBe(0);
      expect(m.child_impact_rate).toBe(0);
      expect(m.management_aware_rate).toBe(0);
      expect(m.action_plan_rate).toBe(0);
      expect(m.action_completed_rate).toBe(0);
      expect(m.unique_staff).toBe(0);
    });

    it("returns empty breakdowns for empty", () => {
      const m = computeBoundaryReviewMetrics([]);
      expect(m.boundary_area_breakdown).toEqual({});
      expect(m.outcome_breakdown).toEqual({});
    });

    it("total_reviews counts rows", () => {
      expect(computeBoundaryReviewMetrics([makeRow(), makeRow(), makeRow()]).total_reviews).toBe(3);
    });

    it("counts boundary_breached", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "boundary_breached" })]).boundary_breached_count).toBe(1);
    });

    it("does not count appropriate as breached", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "appropriate" })]).boundary_breached_count).toBe(0);
    });

    it("does not count boundary_crossed as breached", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "boundary_crossed" })]).boundary_breached_count).toBe(0);
    });

    it("counts investigation_required", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "investigation_required" })]).investigation_count).toBe(1);
    });

    it("does not count minor_concern as investigation", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "minor_concern" })]).investigation_count).toBe(0);
    });

    it("counts boundary_crossed", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "boundary_crossed" })]).crossed_count).toBe(1);
    });

    it("does not count appropriate as crossed", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_outcome: "appropriate" })]).crossed_count).toBe(0);
    });

    it("counts follow_up_required", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_status: "follow_up_required" })]).follow_up_count).toBe(1);
    });

    it("does not count completed as follow_up", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_status: "completed" })]).follow_up_count).toBe(0);
    });

    it("does not count closed as follow_up", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ review_status: "closed" })]).follow_up_count).toBe(0);
    });

    // Boolean rates — all true
    it("returns 100% boolean rates with defaults", () => {
      const m = computeBoundaryReviewMetrics([makeRow()]);
      expect(m.training_completed_rate).toBe(100);
      expect(m.supervision_discussed_rate).toBe(100);
      expect(m.policy_acknowledged_rate).toBe(100);
      expect(m.self_assessment_rate).toBe(100);
      expect(m.child_impact_rate).toBe(100);
      expect(m.management_aware_rate).toBe(100);
      expect(m.action_plan_rate).toBe(100);
      expect(m.action_completed_rate).toBe(100);
    });

    // Boolean rates — all false
    it("training_completed_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ training_completed: false })]).training_completed_rate).toBe(0);
    });

    it("supervision_discussed_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ supervision_discussed: false })]).supervision_discussed_rate).toBe(0);
    });

    it("policy_acknowledged_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ policy_acknowledged: false })]).policy_acknowledged_rate).toBe(0);
    });

    it("self_assessment_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ self_assessment_completed: false })]).self_assessment_rate).toBe(0);
    });

    it("child_impact_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ child_impact_assessed: false })]).child_impact_rate).toBe(0);
    });

    it("management_aware_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ management_aware: false })]).management_aware_rate).toBe(0);
    });

    it("action_plan_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ action_plan_created: false })]).action_plan_rate).toBe(0);
    });

    it("action_completed_rate 0 when false", () => {
      expect(computeBoundaryReviewMetrics([makeRow({ action_plan_completed: false })]).action_completed_rate).toBe(0);
    });

    // Mixed boolean rate
    it("mixed boolean rate uses Math.round * 1000 / 10", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ training_completed: true }),
        makeRow({ training_completed: false }),
        makeRow({ training_completed: true }),
      ]);
      expect(m.training_completed_rate).toBe(66.7);
    });

    it("50% boolean rate", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ supervision_discussed: true }),
        makeRow({ supervision_discussed: false }),
      ]);
      expect(m.supervision_discussed_rate).toBe(50);
    });

    it("33.3% boolean rate", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ policy_acknowledged: true }),
        makeRow({ policy_acknowledged: false }),
        makeRow({ policy_acknowledged: false }),
      ]);
      expect(m.policy_acknowledged_rate).toBe(33.3);
    });

    // Unique staff
    it("unique_staff distinct", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ staff_name: "A" }),
        makeRow({ staff_name: "B" }),
        makeRow({ staff_name: "A" }),
      ]);
      expect(m.unique_staff).toBe(2);
    });

    it("unique_staff 1 for same name", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ staff_name: "A" }),
        makeRow({ staff_name: "A" }),
      ]);
      expect(m.unique_staff).toBe(1);
    });

    // Boundary area breakdown
    it("boundary_area_breakdown counts all 10 areas", () => {
      const records = BOUNDARY_AREAS.map((a) => makeRow({ boundary_area: a }));
      const m = computeBoundaryReviewMetrics(records);
      for (const a of BOUNDARY_AREAS) expect(m.boundary_area_breakdown[a]).toBe(1);
    });

    it("boundary_area_breakdown accumulates duplicates", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ boundary_area: "social_media" }),
        makeRow({ boundary_area: "social_media" }),
        makeRow({ boundary_area: "gift_giving" }),
      ]);
      expect(m.boundary_area_breakdown["social_media"]).toBe(2);
      expect(m.boundary_area_breakdown["gift_giving"]).toBe(1);
    });

    // Outcome breakdown
    it("outcome_breakdown counts all 5 outcomes", () => {
      const records = REVIEW_OUTCOMES.map((o) => makeRow({ review_outcome: o }));
      const m = computeBoundaryReviewMetrics(records);
      for (const o of REVIEW_OUTCOMES) expect(m.outcome_breakdown[o]).toBe(1);
    });

    it("outcome_breakdown accumulates duplicates", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ review_outcome: "appropriate" }),
        makeRow({ review_outcome: "appropriate" }),
        makeRow({ review_outcome: "boundary_breached" }),
      ]);
      expect(m.outcome_breakdown["appropriate"]).toBe(2);
      expect(m.outcome_breakdown["boundary_breached"]).toBe(1);
    });

    // Multiple counts in one set
    it("counts multiple breaches and investigations", () => {
      const m = computeBoundaryReviewMetrics([
        makeRow({ review_outcome: "boundary_breached" }),
        makeRow({ review_outcome: "boundary_breached" }),
        makeRow({ review_outcome: "investigation_required" }),
        makeRow({ review_outcome: "boundary_crossed" }),
        makeRow({ review_outcome: "appropriate" }),
      ]);
      expect(m.boundary_breached_count).toBe(2);
      expect(m.investigation_count).toBe(1);
      expect(m.crossed_count).toBe(1);
    });
  });

  // ── computeBoundaryReviewAlerts ───────────────────────────────────────

  describe("computeBoundaryReviewAlerts", () => {
    it("returns empty for empty", () => {
      expect(computeBoundaryReviewAlerts([])).toEqual([]);
    });

    it("returns empty for clean row", () => {
      expect(computeBoundaryReviewAlerts([makeRow()])).toEqual([]);
    });

    // breach_no_investigation — critical
    it("fires breach_no_investigation for breached + scheduled status", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", review_status: "scheduled", staff_name: "Jo" })]);
      const f = a.find((x) => x.type === "breach_no_investigation");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("critical");
      expect(f!.message).toContain("Jo");
    });

    it("fires breach_no_investigation for breached + follow_up_required status", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", review_status: "follow_up_required" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")).toBeDefined();
    });

    it("no breach_no_investigation when status is in_progress", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", review_status: "in_progress" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")).toBeUndefined();
    });

    it("no breach_no_investigation when status is completed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", review_status: "completed" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")).toBeUndefined();
    });

    it("no breach_no_investigation when status is closed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", review_status: "closed" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")).toBeUndefined();
    });

    it("no breach_no_investigation for appropriate outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "appropriate", review_status: "scheduled" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")).toBeUndefined();
    });

    it("breach_no_investigation includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-99", review_outcome: "boundary_breached", review_status: "scheduled" })]);
      expect(a.find((x) => x.type === "breach_no_investigation")!.record_id).toBe("r-99");
    });

    // breach_management_unaware — critical
    it("fires breach_management_unaware for breached + management unaware", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", management_aware: false, staff_name: "Sam" })]);
      const f = a.find((x) => x.type === "breach_management_unaware");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("critical");
      expect(f!.message).toContain("Sam");
    });

    it("no breach_management_unaware when management is aware", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", management_aware: true })]);
      expect(a.find((x) => x.type === "breach_management_unaware")).toBeUndefined();
    });

    it("no breach_management_unaware for appropriate outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "appropriate", management_aware: false })]);
      expect(a.find((x) => x.type === "breach_management_unaware")).toBeUndefined();
    });

    it("breach_management_unaware includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-50", review_outcome: "boundary_breached", management_aware: false })]);
      expect(a.find((x) => x.type === "breach_management_unaware")!.record_id).toBe("r-50");
    });

    // crossed_no_action_plan — high
    it("fires crossed_no_action_plan for crossed + no action plan", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", action_plan_created: false, staff_name: "Kim" })]);
      const f = a.find((x) => x.type === "crossed_no_action_plan");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("high");
      expect(f!.message).toContain("Kim");
    });

    it("no crossed_no_action_plan when action plan created", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", action_plan_created: true })]);
      expect(a.find((x) => x.type === "crossed_no_action_plan")).toBeUndefined();
    });

    it("no crossed_no_action_plan for appropriate outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "appropriate", action_plan_created: false })]);
      expect(a.find((x) => x.type === "crossed_no_action_plan")).toBeUndefined();
    });

    it("no crossed_no_action_plan for minor_concern", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "minor_concern", action_plan_created: false })]);
      expect(a.find((x) => x.type === "crossed_no_action_plan")).toBeUndefined();
    });

    it("crossed_no_action_plan includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-22", review_outcome: "boundary_crossed", action_plan_created: false })]);
      expect(a.find((x) => x.type === "crossed_no_action_plan")!.record_id).toBe("r-22");
    });

    // high_risk_no_training — high
    it("fires high_risk_no_training for high risk + no training", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "high", training_completed: false, staff_name: "Pat" })]);
      const f = a.find((x) => x.type === "high_risk_no_training");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("high");
      expect(f!.message).toContain("Pat");
      expect(f!.message).toContain("high");
    });

    it("fires high_risk_no_training for critical risk + no training", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "critical", training_completed: false })]);
      const f = a.find((x) => x.type === "high_risk_no_training");
      expect(f).toBeDefined();
      expect(f!.message).toContain("critical");
    });

    it("no high_risk_no_training when training completed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "high", training_completed: true })]);
      expect(a.find((x) => x.type === "high_risk_no_training")).toBeUndefined();
    });

    it("no high_risk_no_training for medium risk", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "medium", training_completed: false })]);
      expect(a.find((x) => x.type === "high_risk_no_training")).toBeUndefined();
    });

    it("no high_risk_no_training for low risk", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "low", training_completed: false })]);
      expect(a.find((x) => x.type === "high_risk_no_training")).toBeUndefined();
    });

    it("no high_risk_no_training for none risk", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ risk_level: "none", training_completed: false })]);
      expect(a.find((x) => x.type === "high_risk_no_training")).toBeUndefined();
    });

    it("high_risk_no_training includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-77", risk_level: "high", training_completed: false })]);
      expect(a.find((x) => x.type === "high_risk_no_training")!.record_id).toBe("r-77");
    });

    // supervision_not_discussed — medium
    it("fires supervision_not_discussed for minor_concern + not discussed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "minor_concern", supervision_discussed: false, staff_name: "Alex" })]);
      const f = a.find((x) => x.type === "supervision_not_discussed");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("medium");
      expect(f!.message).toContain("Alex");
    });

    it("fires supervision_not_discussed for boundary_crossed + not discussed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")).toBeDefined();
    });

    it("fires supervision_not_discussed for boundary_breached + not discussed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")).toBeDefined();
    });

    it("fires supervision_not_discussed for investigation_required + not discussed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "investigation_required", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")).toBeDefined();
    });

    it("no supervision_not_discussed for appropriate outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "appropriate", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")).toBeUndefined();
    });

    it("no supervision_not_discussed when supervision discussed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "minor_concern", supervision_discussed: true })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")).toBeUndefined();
    });

    it("supervision_not_discussed message contains outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")!.message).toContain("boundary crossed");
    });

    it("supervision_not_discussed includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-33", review_outcome: "minor_concern", supervision_discussed: false })]);
      expect(a.find((x) => x.type === "supervision_not_discussed")!.record_id).toBe("r-33");
    });

    // child_impact_not_assessed — medium
    it("fires child_impact_not_assessed for crossed + not assessed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", child_impact_assessed: false, staff_name: "Robin" })]);
      const f = a.find((x) => x.type === "child_impact_not_assessed");
      expect(f).toBeDefined();
      expect(f!.severity).toBe("medium");
      expect(f!.message).toContain("Robin");
    });

    it("fires child_impact_not_assessed for breached + not assessed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")).toBeDefined();
    });

    it("no child_impact_not_assessed for appropriate outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "appropriate", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")).toBeUndefined();
    });

    it("no child_impact_not_assessed for minor_concern", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "minor_concern", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")).toBeUndefined();
    });

    it("no child_impact_not_assessed for investigation_required", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "investigation_required", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")).toBeUndefined();
    });

    it("no child_impact_not_assessed when impact assessed", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_crossed", child_impact_assessed: true })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")).toBeUndefined();
    });

    it("child_impact_not_assessed message contains outcome", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ review_outcome: "boundary_breached", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")!.message).toContain("boundary breached");
    });

    it("child_impact_not_assessed includes record_id", () => {
      const a = computeBoundaryReviewAlerts([makeRow({ id: "r-44", review_outcome: "boundary_crossed", child_impact_assessed: false })]);
      expect(a.find((x) => x.type === "child_impact_not_assessed")!.record_id).toBe("r-44");
    });

    // Multiple alerts per record
    it("fires multiple alerts for a single bad record", () => {
      const a = computeBoundaryReviewAlerts([makeRow({
        review_outcome: "boundary_breached",
        review_status: "scheduled",
        management_aware: false,
        supervision_discussed: false,
        child_impact_assessed: false,
        risk_level: "critical",
        training_completed: false,
      })]);
      const types = a.map((x) => x.type);
      expect(types).toContain("breach_no_investigation");
      expect(types).toContain("breach_management_unaware");
      expect(types).toContain("high_risk_no_training");
      expect(types).toContain("supervision_not_discussed");
      expect(types).toContain("child_impact_not_assessed");
    });

    // Multiple records
    it("fires per-record alerts for multiple records", () => {
      const a = computeBoundaryReviewAlerts([
        makeRow({ id: "r-1", review_outcome: "boundary_breached", review_status: "scheduled", management_aware: false }),
        makeRow({ id: "r-2", review_outcome: "boundary_breached", review_status: "scheduled", management_aware: false }),
      ]);
      expect(a.filter((x) => x.type === "breach_no_investigation")).toHaveLength(2);
      expect(a.filter((x) => x.type === "breach_management_unaware")).toHaveLength(2);
    });

    it("does not fire alerts for fully compliant rows", () => {
      const a = computeBoundaryReviewAlerts([
        makeRow({ review_outcome: "appropriate" }),
        makeRow({ review_outcome: "minor_concern", supervision_discussed: true }),
        makeRow({ review_outcome: "boundary_crossed", action_plan_created: true, supervision_discussed: true, child_impact_assessed: true }),
      ]);
      expect(a).toEqual([]);
    });
  });

  // ── generateBoundaryReviewAriaInsights ────────────────────────────────

  describe("generateBoundaryReviewAriaInsights", () => {
    it("returns 3 insights for empty data", () => {
      const insights = generateBoundaryReviewAriaInsights([]);
      expect(insights).toHaveLength(3);
    });

    it("returns 3 insights for populated data", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow(), makeRow()]);
      expect(insights).toHaveLength(3);
    });

    it("insight 1 starts with [slate]", () => {
      expect(generateBoundaryReviewAriaInsights([])[0]).toMatch(/^\[slate\]/);
    });

    it("insight 2 starts with [amber]", () => {
      expect(generateBoundaryReviewAriaInsights([])[1]).toMatch(/^\[amber\]/);
    });

    it("insight 3 starts with [reflect]", () => {
      expect(generateBoundaryReviewAriaInsights([])[2]).toMatch(/^\[reflect\]/);
    });

    it("insight 1 contains total reviews count", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow(), makeRow(), makeRow()]);
      expect(insights[0]).toContain("3 professional boundary reviews");
    });

    it("insight 1 contains unique staff count", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow({ staff_name: "A" }), makeRow({ staff_name: "B" })]);
      expect(insights[0]).toContain("2 staff members");
    });

    it("insight 1 uses singular staff member for 1", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      expect(insights[0]).toContain("1 staff member");
      expect(insights[0]).not.toContain("1 staff members");
    });

    it("insight 1 contains training completed rate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow({ training_completed: true })]);
      expect(insights[0]).toContain("Training completed rate: 100%");
    });

    it("insight 1 contains policy acknowledged rate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow({ policy_acknowledged: true })]);
      expect(insights[0]).toContain("Policy acknowledged rate: 100%");
    });

    it("insight 1 contains serious count", () => {
      const insights = generateBoundaryReviewAriaInsights([
        makeRow({ review_outcome: "boundary_crossed" }),
        makeRow({ review_outcome: "boundary_breached" }),
        makeRow({ review_outcome: "investigation_required" }),
      ]);
      expect(insights[0]).toContain("3 reviews flagged");
    });

    it("insight 1 serious count is 0 when all appropriate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow({ review_outcome: "appropriate" })]);
      expect(insights[0]).toContain("0 reviews flagged");
    });

    it("insight 2 mentions critical and high alert counts when present", () => {
      const rows = [
        makeRow({ review_outcome: "boundary_breached", review_status: "scheduled", management_aware: false }),
        makeRow({ review_outcome: "boundary_crossed", action_plan_created: false }),
      ];
      const insights = generateBoundaryReviewAriaInsights(rows);
      expect(insights[1]).toMatch(/\d+ critical/);
      expect(insights[1]).toMatch(/\d+ high-priority/);
    });

    it("insight 2 shows no concerns when none", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      expect(insights[1]).toContain("No critical or high-priority boundary concerns");
    });

    it("insight 2 contains supervision discussed rate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      expect(insights[1]).toContain("Supervision discussed rate");
    });

    it("insight 2 contains management aware rate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      expect(insights[1]).toContain("Management aware rate");
    });

    it("insight 2 contains action plan rate", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      expect(insights[1]).toContain("Action plan rate");
    });

    it("insight 3 contains reflective question about boundaries", () => {
      const i = generateBoundaryReviewAriaInsights([])[2];
      expect(i).toContain("professional boundary");
      expect(i).toContain("supervision");
    });

    it("insight 3 is a reflective question", () => {
      const i = generateBoundaryReviewAriaInsights([])[2];
      expect(i).toContain("?");
    });

    it("all insights are strings", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      for (const i of insights) expect(typeof i).toBe("string");
    });

    it("all insights are non-empty strings", () => {
      const insights = generateBoundaryReviewAriaInsights([makeRow()]);
      for (const i of insights) expect(i.length).toBeGreaterThan(0);
    });
  });
});
