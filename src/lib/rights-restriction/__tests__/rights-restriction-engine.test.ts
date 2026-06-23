import { describe, it, expect } from "vitest";
import {
  analyseRestrictionReview,
  buildRestrictionOverview,
} from "../rights-restriction-engine";
import type { RestrictionReview } from "../types";

const NOW = "2026-06-23T12:00:00.000Z";

function review(over: Partial<RestrictionReview> = {}): RestrictionReview {
  return {
    id: "rr_1",
    child_id: "yp_alex",
    home_id: "home_oak",
    review_date: "2026-06-20",
    decision_considered: "Continue overnight door monitoring",
    restriction_kind: "surveillance_monitoring",
    restriction_description: "Sensor on bedroom door overnight",
    reason: "Repeated night-time absconding with high risk",
    immediate_safety_concern: "Left at 2am twice last week",
    risk_being_managed: "Child sexual exploitation risk when missing at night",
    child_understands: "yes",
    child_wishes_feelings: "Alex says it makes him feel watched but understands why",
    child_objects: "no",
    capacity_competence_notes: "Understands the reason when explained calmly",
    parental_social_worker_views: "Social worker agrees it is proportionate for now",
    best_interests_reasoning: "Keeping Alex safe at night outweighs the intrusion, which is time-limited and the least intrusive sensor option",
    least_restrictive_alternatives: "Considered staff sitting outside door and a check every 30 mins",
    alternatives_outcome: "Hourly checks did not prevent the absconding; a sensor is less intrusive than a waking-night staff at the door",
    proportionality_reasoning: "The monitoring is limited to overnight and to the door only, proportionate to a serious exploitation risk",
    duration: "Overnight, until next review",
    next_review_date: "2026-07-15",
    legal_advice_required: "no",
    escalation_notes: "",
    manager_decision: "approved",
    manager_id: "staff_dl",
    responsible_person: "Registered Manager",
    evidence_relied_upon: "Missing episodes log, return interviews, risk assessment",
    linked_record_ids: ["inc_1"],
    status: "active",
    created_at: NOW,
    updated_at: NOW,
    created_by: "staff_dl",
    updated_by: "staff_dl",
    ...over,
  };
}

describe("analyseRestrictionReview", () => {
  it("rates a complete, well-reasoned review highly with no high flags", () => {
    const a = analyseRestrictionReview(review(), NOW);
    expect(a.completenessPct).toBeGreaterThanOrEqual(90);
    expect(a.flags.some((f) => f.severity === "high")).toBe(false);
    expect(a.needsManagerAttention).toBe(false);
    expect(a.proportionalityPrompts.length).toBeGreaterThan(0);
  });

  it("flags a missing child voice as high and explains why", () => {
    const a = analyseRestrictionReview(review({ child_wishes_feelings: "" }), NOW);
    const f = a.flags.find((x) => x.key === "no-child-voice")!;
    expect(f.severity).toBe("high");
    expect(f.why.length).toBeGreaterThan(0);
    expect(a.needsManagerAttention).toBe(true);
  });

  it("flags a missing review date and least-restrictive alternatives", () => {
    const a = analyseRestrictionReview(review({ next_review_date: null, least_restrictive_alternatives: "" }), NOW);
    expect(a.flags.map((f) => f.key)).toEqual(expect.arrayContaining(["no-review-date", "no-least-restrictive"]));
  });

  it("flags an overdue review for an active restriction", () => {
    const a = analyseRestrictionReview(review({ next_review_date: "2026-05-01" }), NOW);
    expect(a.flags.some((f) => f.key === "overdue-review")).toBe(true);
  });

  it("flags objection with no legal/LA advice considered", () => {
    const a = analyseRestrictionReview(review({ child_objects: "yes", legal_advice_required: "no", manager_decision: "approved" }), NOW);
    expect(a.flags.some((f) => f.key === "objection-no-advice")).toBe(true);
  });

  it("flags a pending manager decision as needing attention", () => {
    const a = analyseRestrictionReview(review({ manager_decision: "pending" }), NOW);
    expect(a.flags.some((f) => f.key === "manager-pending")).toBe(true);
    expect(a.needsManagerAttention).toBe(true);
  });
});

describe("buildRestrictionOverview", () => {
  const children = [
    { id: "yp_alex", name: "Alex" },
    { id: "yp_jordan", name: "Jordan" },
  ];

  it("reports settled with no reviews", () => {
    const o = buildRestrictionOverview({ now: NOW, reviews: [], children, incidents: [] });
    expect(o.total).toBe(0);
    expect(o.homeStatus).toBe("settled");
    expect(o.alerts).toHaveLength(0);
  });

  it("is deterministic", () => {
    const args = { now: NOW, reviews: [review()], children, incidents: [] };
    expect(buildRestrictionOverview(args)).toEqual(buildRestrictionOverview(args));
  });

  it("raises the right alerts for a weak review", () => {
    const weak = review({ id: "rr_weak", next_review_date: null, child_wishes_feelings: "", least_restrictive_alternatives: "", proportionality_reasoning: "" });
    const o = buildRestrictionOverview({ now: NOW, reviews: [weak], children, incidents: [] });
    const keys = o.alerts.map((a) => a.key);
    expect(keys).toEqual(expect.arrayContaining(["no_review_date", "without_child_voice", "without_least_restrictive", "weak_incomplete_reasoning"]));
    expect(o.homeStatus).toBe("action_needed");
  });

  it("cross-references a recent incident pattern", () => {
    const incidents = Array.from({ length: 4 }, (_, i) => ({ id: `i${i}`, child_id: "yp_alex", date: "2026-06-10", severity: "moderate", type: "verbal", description: "x" }) as never);
    const o = buildRestrictionOverview({ now: NOW, reviews: [review()], children, incidents });
    expect(o.alerts.some((a) => a.key === "linked_to_repeated_incidents")).toBe(true);
  });

  it("does not raise the incident alert below the threshold", () => {
    const incidents = [{ id: "i0", child_id: "yp_alex", date: "2026-06-10", severity: "low", type: "verbal", description: "x" }] as never[];
    const o = buildRestrictionOverview({ now: NOW, reviews: [review()], children, incidents });
    expect(o.alerts.some((a) => a.key === "linked_to_repeated_incidents")).toBe(false);
  });
});
