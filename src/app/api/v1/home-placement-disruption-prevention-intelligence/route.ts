import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePlacementDisruptionPrevention,
  type DisruptionPlanInput,
  type PlacementEndInput,
  type StabilityFactorInput,
} from "@/lib/engines/home-placement-disruption-prevention-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const threeMonthsAgo = new Date(new Date(today).getTime() - 90 * 86400000).toISOString().slice(0, 10);

  // Disruption prevention plans → DisruptionPlanInput[]
  const rawPlans = (store.disruptionPreventionPlans as any[] ?? []);
  const disruption_plans: DisruptionPlanInput[] = rawPlans.map((p: any) => ({
    id: p.id ?? "",
    child_id: p.child_id ?? "",
    risk_level: p.risk_of_disruption_level ?? "low",
    child_aware: !!(p.child_aware_of_plan),
    child_contribution_recorded: !!(p.child_contribution),
    professionals_count: ((p.professionals_involved ?? []) as any[]).length,
    proactive_actions_count: ((p.proactive_actions_in_place ?? []) as any[]).length,
    support_network_count: ((p.support_network_in_place ?? []) as any[]).length,
    warning_signs_count: ((p.warning_signs_to_watch_for ?? []) as any[]).length,
    signed_off_by_la: !!(p.signed_off_by_la),
    reviewed_recently: (p.reviewed_date ?? "") >= threeMonthsAgo,
  }));

  // Placement end summaries → PlacementEndInput[]
  const rawEnds = (store.placementEndSummaries as any[] ?? []);
  const placement_ends: PlacementEndInput[] = rawEnds.map((e: any) => {
    const outcomes = (e.outcomes ?? {}) as any;
    const hasPositive = !!(outcomes.education_progress || outcomes.emotional_wellbeing || outcomes.social_relationships);
    return {
      id: e.id ?? "",
      end_reason: e.end_reason ?? "placement_disruption",
      duration_months: e.duration_months ?? 0,
      had_positive_outcomes: hasPositive,
    };
  });

  // Stability factors — derived from disruption plans' key factors
  const stability_factors: StabilityFactorInput[] = [];
  const factorTypes = ["key_worker_relationship", "school_stability", "family_contact", "therapeutic_support", "peer_relationships", "environmental_comfort"];
  for (const plan of rawPlans) {
    const factors = ((plan as any).key_stability_factors ?? []) as string[];
    const childId = (plan as any).child_id ?? "";
    for (let i = 0; i < Math.min(factors.length, factorTypes.length); i++) {
      stability_factors.push({
        id: `${(plan as any).id}-${i}`,
        child_id: childId,
        factor_type: factorTypes[i],
        strength: factors[i] ? "strong" : "fragile",
      });
    }
    // If plan has fewer factors than expected, add as moderate
    if (factors.length > 0 && factors.length < factorTypes.length) {
      for (let i = factors.length; i < factorTypes.length; i++) {
        stability_factors.push({
          id: `${(plan as any).id}-${i}`,
          child_id: childId,
          factor_type: factorTypes[i],
          strength: "moderate",
        });
      }
    }
  }

  const result = computePlacementDisruptionPrevention({
    today,
    total_children: (children as any[]).length,
    disruption_plans,
    placement_ends,
    stability_factors,
  });

  return NextResponse.json({ data: result });
}
