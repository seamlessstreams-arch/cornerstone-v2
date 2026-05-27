import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeManagementWalkroundOversight,
  type WalkroundInput,
} from "@/lib/engines/home-management-walkround-oversight-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Management walkrounds → WalkroundInput[]
  const rawWalkrounds = (store.managementWalkrounds as any[] ?? []);
  const walkrounds: WalkroundInput[] = rawWalkrounds.map((w: any) => {
    const followUpActions = (w.follow_up_actions_logged ?? []) as any[];
    // Derive completed: actions with a past deadline (assume completed if exists)
    // Simple heuristic: count actions where deadline <= today
    const completedFollowUp = followUpActions.filter(
      (a: any) => a.deadline && a.deadline <= today
    ).length;

    return {
      id: w.id ?? "",
      walkround_type: w.walkround_type ?? "daily",
      positive_observations_count: (w.observations_positive ?? []).length,
      improvements_count: (w.observations_for_improvement ?? []).length,
      child_interactions_count: (w.child_interactions ?? []).length,
      staff_interactions_count: (w.staff_interactions ?? []).length,
      environmental_checks_good: (w.environmental_checks ?? []).filter(
        (c: any) => c.status === "good"
      ).length,
      environmental_checks_total: (w.environmental_checks ?? []).length,
      immediate_actions_count: (w.immediate_actions_taken ?? []).length,
      follow_up_actions_count: followUpActions.length,
      follow_up_actions_completed: completedFollowUp,
      themes_count: (w.themes_emerging ?? []).length,
      positive_practice_noted_count: (w.positive_staff_practice_noted ?? []).length,
    };
  });

  const result = computeManagementWalkroundOversight({
    today,
    total_staff: (staff as any[]).length,
    walkrounds,
  });

  return NextResponse.json({ data: result });
}
