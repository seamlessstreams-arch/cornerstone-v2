export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeRewardsIncentivesManagement,
  type RewardSchemeRecordInput,
  type ReinforcementRecordInput,
  type IncentiveProgrammeRecordInput,
  type ChildParticipationRecordInput,
  type EquityReviewRecordInput,
} from "@/lib/engines/home-rewards-incentives-management-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawSchemes = (store.rewardSchemeRecords ?? []) as any[];
    const reward_scheme_records: RewardSchemeRecordInput[] = rawSchemes.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      scheme_name: r.scheme_name ?? "",
      scheme_type: r.scheme_type ?? "individual",
      start_date: (r.start_date ?? today).toString(),
      review_date: r.review_date ?? null,
      reviewed: r.reviewed ?? false,
      criteria_clear: r.criteria_clear ?? false,
      criteria_achievable: r.criteria_achievable ?? false,
      criteria_age_appropriate: r.criteria_age_appropriate ?? false,
      criteria_individualised: r.criteria_individualised ?? false,
      reward_meaningful_to_child: r.reward_meaningful_to_child ?? false,
      reward_proportionate: r.reward_proportionate ?? false,
      child_consulted_on_design: r.child_consulted_on_design ?? false,
      child_understands_scheme: r.child_understands_scheme ?? false,
      scheme_active: r.scheme_active ?? true,
      outcomes_documented: r.outcomes_documented ?? false,
      positive_outcomes_achieved: r.positive_outcomes_achieved ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawReinforcement = (store.reinforcementRecords ?? []) as any[];
    const reinforcement_records: ReinforcementRecordInput[] = rawReinforcement.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      reinforcement_type: r.reinforcement_type ?? "verbal_praise",
      context: r.context ?? "",
      behaviour_recognised: r.behaviour_recognised ?? "",
      timely: r.timely ?? false,
      specific: r.specific ?? false,
      genuine: r.genuine ?? false,
      consistent_with_plan: r.consistent_with_plan ?? false,
      child_response_positive: r.child_response_positive ?? false,
      staff_member: r.staff_member ?? "",
      witnessed_by_peers: r.witnessed_by_peers ?? false,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawProgrammes = (store.incentiveProgrammeRecords ?? []) as any[];
    const incentive_programme_records: IncentiveProgrammeRecordInput[] = rawProgrammes.map((r: any) => ({
      id: r.id ?? "",
      programme_name: r.programme_name ?? "",
      programme_type: r.programme_type ?? "home_wide",
      start_date: (r.start_date ?? today).toString(),
      end_date: r.end_date ?? null,
      active: r.active ?? true,
      total_children_eligible: r.total_children_eligible ?? 0,
      total_children_participating: r.total_children_participating ?? 0,
      goals_clearly_defined: r.goals_clearly_defined ?? false,
      progress_tracked: r.progress_tracked ?? false,
      milestones_celebrated: r.milestones_celebrated ?? false,
      children_involved_in_design: r.children_involved_in_design ?? false,
      effectiveness_reviewed: r.effectiveness_reviewed ?? false,
      effectiveness_rating: r.effectiveness_rating ?? 3,
      adjustments_made: r.adjustments_made ?? false,
      outcomes_documented: r.outcomes_documented ?? false,
      positive_outcomes_achieved: r.positive_outcomes_achieved ?? false,
      staff_lead: r.staff_lead ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawParticipation = (store.childParticipationRecords ?? store.rewardChildParticipationRecords ?? []) as any[];
    const child_participation_records: ChildParticipationRecordInput[] = rawParticipation.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      participation_type: r.participation_type ?? "scheme_design",
      child_voice_captured: r.child_voice_captured ?? false,
      child_views_acted_upon: r.child_views_acted_upon ?? false,
      child_satisfied_with_outcome: r.child_satisfied_with_outcome ?? false,
      participation_voluntary: r.participation_voluntary ?? false,
      support_provided_to_participate: r.support_provided_to_participate ?? false,
      age_appropriate_method: r.age_appropriate_method ?? false,
      feedback_documented: r.feedback_documented ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawEquity = (store.equityReviewRecords ?? []) as any[];
    const equity_review_records: EquityReviewRecordInput[] = rawEquity.map((r: any) => ({
      id: r.id ?? "",
      review_date: (r.review_date ?? today).toString(),
      reviewer: r.reviewer ?? "",
      total_children_assessed: r.total_children_assessed ?? 0,
      children_receiving_rewards_count: r.children_receiving_rewards_count ?? 0,
      children_excluded_from_schemes_count: r.children_excluded_from_schemes_count ?? 0,
      exclusion_reasons_documented: r.exclusion_reasons_documented ?? false,
      reward_distribution_fair: r.reward_distribution_fair ?? false,
      cultural_sensitivity_considered: r.cultural_sensitivity_considered ?? false,
      disability_adjustments_made: r.disability_adjustments_made ?? false,
      age_adjustments_made: r.age_adjustments_made ?? false,
      gender_bias_reviewed: r.gender_bias_reviewed ?? false,
      no_discriminatory_patterns: r.no_discriminatory_patterns ?? false,
      children_consulted_on_fairness: r.children_consulted_on_fairness ?? false,
      action_plan_created: r.action_plan_created ?? false,
      action_plan_completed: r.action_plan_completed ?? false,
      overall_equity_rating: r.overall_equity_rating ?? 3,
      findings_documented: r.findings_documented ?? false,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeRewardsIncentivesManagement({
      today,
      total_children,
      reward_scheme_records,
      reinforcement_records,
      incentive_programme_records,
      child_participation_records,
      equity_review_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
