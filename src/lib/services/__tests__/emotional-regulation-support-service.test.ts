import { describe, it, expect } from "vitest";
import { _testing, type EmotionalRegulationSupportRecord } from "../emotional-regulation-support-service";

const { computeEmotionalRegulationMetrics, identifyEmotionalRegulationAlerts } = _testing;

const now = new Date(new Date().toISOString().split("T")[0]);

function makeRecord(overrides?: Partial<EmotionalRegulationSupportRecord>): EmotionalRegulationSupportRecord {
  return {
    id: overrides?.id ?? "a-1", home_id: overrides?.home_id ?? "home-1",
    regulation_strategy: overrides?.regulation_strategy ?? "co_regulation",
    emotional_trigger: overrides?.emotional_trigger ?? "transition_change",
    support_outcome: overrides?.support_outcome ?? "regulated_with_support",
    child_age_group: overrides?.child_age_group ?? "thirteen_to_fifteen",
    support_date: overrides?.support_date ?? now.toISOString().split("T")[0],
    child_name: overrides?.child_name ?? "Child A",
    child_id: "child_id" in (overrides ?? {}) ? (overrides!.child_id ?? null) : null,
    staff_name: overrides?.staff_name ?? "Staff A",
    child_participated: overrides?.child_participated ?? true,
    trauma_informed: overrides?.trauma_informed ?? true,
    age_appropriate: overrides?.age_appropriate ?? true,
    child_chose_strategy: overrides?.child_chose_strategy ?? true,
    environment_adapted: overrides?.environment_adapted ?? true,
    relationship_based: overrides?.relationship_based ?? true,
    de_escalation_used: overrides?.de_escalation_used ?? true,
    follow_up_planned: overrides?.follow_up_planned ?? true,
    care_plan_linked: overrides?.care_plan_linked ?? true,
    learning_shared: overrides?.learning_shared ?? true,
    parent_informed: overrides?.parent_informed ?? true,
    recorded_promptly: overrides?.recorded_promptly ?? true,
    issues_found: overrides?.issues_found ?? [], actions_taken: overrides?.actions_taken ?? [],
    support_duration_minutes: overrides?.support_duration_minutes ?? 20,
    next_review_date: "next_review_date" in (overrides ?? {}) ? (overrides!.next_review_date ?? null) : null,
    notes: "notes" in (overrides ?? {}) ? (overrides!.notes ?? null) : null,
    created_at: overrides?.created_at ?? now.toISOString(), updated_at: overrides?.updated_at ?? now.toISOString(),
  };
}

describe("emotional-regulation-support-service", () => {
  describe("computeEmotionalRegulationMetrics", () => {
    it("returns zeros for empty", () => { const m = computeEmotionalRegulationMetrics([]); expect(m.total_supports).toBe(0); expect(m.regulated_independently_count).toBe(0); expect(m.not_regulated_count).toBe(0); expect(m.escalated_count).toBe(0); expect(m.trauma_reminder_count).toBe(0); expect(m.child_participated_rate).toBe(0); expect(m.average_duration).toBe(0); expect(m.unique_children).toBe(0); });
    it("returns empty breakdowns", () => { const m = computeEmotionalRegulationMetrics([]); expect(m.by_regulation_strategy).toEqual({}); expect(m.by_emotional_trigger).toEqual({}); expect(m.by_support_outcome).toEqual({}); expect(m.by_child_age_group).toEqual({}); });
    it("counts regulated_independently", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ support_outcome: "regulated_independently" })]).regulated_independently_count).toBe(1); });
    it("counts not_regulated", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ support_outcome: "not_regulated" })]).not_regulated_count).toBe(1); });
    it("counts escalated", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ support_outcome: "escalated" })]).escalated_count).toBe(1); });
    it("counts trauma_reminder", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ emotional_trigger: "trauma_reminder" })]).trauma_reminder_count).toBe(1); });
    it("returns 100% boolean rates with defaults", () => { const m = computeEmotionalRegulationMetrics([makeRecord()]); expect(m.child_participated_rate).toBe(100); expect(m.trauma_informed_rate).toBe(100); expect(m.age_appropriate_rate).toBe(100); expect(m.child_chose_strategy_rate).toBe(100); expect(m.environment_adapted_rate).toBe(100); expect(m.relationship_based_rate).toBe(100); expect(m.de_escalation_rate).toBe(100); expect(m.follow_up_planned_rate).toBe(100); expect(m.care_plan_linked_rate).toBe(100); expect(m.learning_shared_rate).toBe(100); expect(m.parent_informed_rate).toBe(100); expect(m.recorded_promptly_rate).toBe(100); });
    it("child_participated_rate 0 when false", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ child_participated: false })]).child_participated_rate).toBe(0); });
    it("mixed boolean rate", () => { const m = computeEmotionalRegulationMetrics([makeRecord({ child_participated: true }), makeRecord({ child_participated: false }), makeRecord({ child_participated: true })]); expect(m.child_participated_rate).toBe(66.7); });
    it("average_duration single", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ support_duration_minutes: 30 })]).average_duration).toBe(30); });
    it("average_duration multi", () => { expect(computeEmotionalRegulationMetrics([makeRecord({ support_duration_minutes: 10 }), makeRecord({ support_duration_minutes: 30 })]).average_duration).toBe(20); });
    it("unique_children distinct", () => { const m = computeEmotionalRegulationMetrics([makeRecord({ child_name: "A" }), makeRecord({ child_name: "B" }), makeRecord({ child_name: "A" })]); expect(m.unique_children).toBe(2); });
    it("counts all 10 regulation strategies", () => { const strategies = ["co_regulation","breathing_exercises","sensory_tools","safe_space","emotional_coaching","distraction","physical_activity","creative_expression","talking_therapy","other"] as const; const records = strategies.map(s => makeRecord({ regulation_strategy: s })); const m = computeEmotionalRegulationMetrics(records); for (const s of strategies) expect(m.by_regulation_strategy[s]).toBe(1); });
    it("counts all 10 emotional triggers", () => { const triggers = ["transition_change","peer_conflict","contact_family","school_pressure","sensory_overload","rejection_perceived","boundary_testing","trauma_reminder","unknown","other"] as const; const records = triggers.map(t => makeRecord({ emotional_trigger: t })); const m = computeEmotionalRegulationMetrics(records); for (const t of triggers) expect(m.by_emotional_trigger[t]).toBe(1); });
    it("counts all 5 support outcomes", () => { const outcomes = ["regulated_independently","regulated_with_support","partially_regulated","not_regulated","escalated"] as const; const records = outcomes.map(o => makeRecord({ support_outcome: o })); const m = computeEmotionalRegulationMetrics(records); for (const o of outcomes) expect(m.by_support_outcome[o]).toBe(1); });
    it("counts all 5 age groups", () => { const groups = ["under_8","eight_to_twelve","thirteen_to_fifteen","sixteen_plus","not_specified"] as const; const records = groups.map(g => makeRecord({ child_age_group: g })); const m = computeEmotionalRegulationMetrics(records); for (const g of groups) expect(m.by_child_age_group[g]).toBe(1); });
  });

  describe("identifyEmotionalRegulationAlerts", () => {
    it("returns empty for clean", () => { expect(identifyEmotionalRegulationAlerts([makeRecord()])).toEqual([]); });
    it("returns empty for empty", () => { expect(identifyEmotionalRegulationAlerts([])).toEqual([]); });
    it("fires escalated_not_trauma_informed", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ support_outcome: "escalated", trauma_informed: false, child_name: "Jo" })]); expect(a[0].type).toBe("escalated_not_trauma_informed"); expect(a[0].severity).toBe("critical"); expect(a[0].message).toContain("Jo"); });
    it("escalated_not_trauma_informed per-record", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ id: "a-1", support_outcome: "escalated", trauma_informed: false }), makeRecord({ id: "a-2", support_outcome: "escalated", trauma_informed: false })]); expect(a.filter(x => x.type === "escalated_not_trauma_informed")).toHaveLength(2); });
    it("no alert if escalated but trauma-informed", () => { expect(identifyEmotionalRegulationAlerts([makeRecord({ support_outcome: "escalated", trauma_informed: true })]).filter(x => x.type === "escalated_not_trauma_informed")).toHaveLength(0); });
    it("fires not_trauma_informed singular", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ trauma_informed: false })]); const f = a.find(x => x.type === "not_trauma_informed"); expect(f).toBeDefined(); expect(f!.severity).toBe("high"); expect(f!.message).toContain("1 emotional regulation support was"); });
    it("not_trauma_informed plural", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ trauma_informed: false }), makeRecord({ trauma_informed: false })]); const f = a.find(x => x.type === "not_trauma_informed"); expect(f!.message).toContain("2 emotional regulation supports were"); });
    it("fires child_not_participated singular", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ child_participated: false })]); const f = a.find(x => x.type === "child_not_participated"); expect(f).toBeDefined(); expect(f!.severity).toBe("high"); });
    it("no_follow_up_planned not for 1", () => { expect(identifyEmotionalRegulationAlerts([makeRecord({ follow_up_planned: false })]).find(x => x.type === "no_follow_up_planned")).toBeUndefined(); });
    it("no_follow_up_planned fires for 2", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ follow_up_planned: false }), makeRecord({ follow_up_planned: false })]); expect(a.find(x => x.type === "no_follow_up_planned")).toBeDefined(); });
    it("learning_not_shared not for 2", () => { expect(identifyEmotionalRegulationAlerts([makeRecord({ learning_shared: false }), makeRecord({ learning_shared: false })]).find(x => x.type === "learning_not_shared")).toBeUndefined(); });
    it("learning_not_shared fires for 3", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ learning_shared: false }), makeRecord({ learning_shared: false }), makeRecord({ learning_shared: false })]); expect(a.find(x => x.type === "learning_not_shared")).toBeDefined(); });
    it("fires all applicable", () => { const a = identifyEmotionalRegulationAlerts([makeRecord({ support_outcome: "escalated", trauma_informed: false, child_participated: false, follow_up_planned: false, learning_shared: false }), makeRecord({ follow_up_planned: false, learning_shared: false }), makeRecord({ learning_shared: false })]); const types = a.map(x => x.type); expect(types).toContain("escalated_not_trauma_informed"); expect(types).toContain("not_trauma_informed"); expect(types).toContain("child_not_participated"); expect(types).toContain("no_follow_up_planned"); expect(types).toContain("learning_not_shared"); });
  });
});
