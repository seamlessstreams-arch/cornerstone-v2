import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeBehaviourSupportPlan } from "@/lib/engines/home-behaviour-support-plan-intelligence-engine";
import type { BehaviourSupportPlanRecordInput } from "@/lib/engines/home-behaviour-support-plan-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.behaviourSupportPlans as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const plans: BehaviourSupportPlanRecordInput[] = raw.map((r: any) => {
      const primaryBehaviours = Array.isArray(r.primary_behaviours) ? r.primary_behaviours : [];
      const triggers = Array.isArray(r.known_triggers) ? r.known_triggers : [];
      const deEscalation = Array.isArray(r.de_escalation) ? r.de_escalation : [];
      const positiveStrategies = Array.isArray(r.positive_strategies) ? r.positive_strategies : [];
      const safetyPlan = Array.isArray(r.safety_plan) ? r.safety_plan : [];
      const profInput = Array.isArray(r.professional_input) ? r.professional_input : [];
      const restrictive = Array.isArray(r.restrictive_interventions) ? r.restrictive_interventions : [];
      const reviews = Array.isArray(r.review_history) ? r.review_history : [];

      return {
        id: r.id,
        child_id: r.child_id,
        status: r.status || "active",
        primary_behaviour_count: primaryBehaviours.length,
        high_severity_behaviour_count: primaryBehaviours.filter((b: any) => b.severity === "high").length,
        worsening_behaviour_count: primaryBehaviours.filter((b: any) => b.trend === "worsening").length,
        known_trigger_count: triggers.length,
        high_likelihood_trigger_count: triggers.filter((t: any) => t.likelihood === "high").length,
        early_warning_count: Array.isArray(r.early_warnings) ? r.early_warnings.length : 0,
        de_escalation_stage_count: deEscalation.length,
        positive_strategy_count: positiveStrategies.length,
        effective_strategy_count: positiveStrategies.filter(
          (s: any) => s.effectiveness === "highly_effective" || s.effectiveness === "effective",
        ).length,
        reward_count: Array.isArray(r.rewards) ? r.rewards.length : 0,
        boundary_count: Array.isArray(r.boundaries) ? r.boundaries.length : 0,
        safety_plan_item_count: safetyPlan.length,
        has_communication_needs: !!(r.communication_needs && r.communication_needs.trim()),
        has_sensory_considerations: !!(r.sensory_considerations && r.sensory_considerations.trim()),
        has_child_views: !!(r.child_views && r.child_views.trim()),
        has_parent_views: !!(r.parent_views && r.parent_views.trim()),
        professional_input_count: profInput.length,
        staff_guidance_count: Array.isArray(r.staff_guidance) ? r.staff_guidance.length : 0,
        restrictive_intervention_count: restrictive.length,
        restrictive_last_resort_count: restrictive.filter((ri: any) => ri.last_resort === true).length,
        review_count: reviews.length,
        has_review_date: !!r.review_date,
        review_date: r.review_date ? r.review_date.toString().slice(0, 10) : "",
      };
    });

    const result = computeBehaviourSupportPlan({ today, total_children, plans });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
