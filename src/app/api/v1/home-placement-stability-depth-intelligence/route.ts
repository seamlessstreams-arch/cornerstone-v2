// ══════════════════════════════════════════════════════════════════════════════
// API — HOME PLACEMENT STABILITY DEPTH INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomePlacementStabilityDepth,
  type StabilityRecordInput,
  type StabilityMeetingInput,
  type DisruptionPlanInput,
  type PlacementEndInput,
  type ImpactAssessmentInput,
  type MatchingReferralInput,
} from "@/lib/engines/home-placement-stability-depth-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Stability Records ──────────────────────────────────────────
  const stability_records: StabilityRecordInput[] = (store.placementStabilityRecords as any[]).map((r: any) => ({
    id: r.id,
    child_id: r.child_id,
    days_in_placement: r.days_in_placement ?? 0,
    previous_placements: r.previous_placements ?? 0,
    stability_risk: r.stability_risk ?? "medium",
    trend: r.trend ?? "stable",
    next_review: (r.next_review ?? "").toString().slice(0, 10),
    strengths_count: r.strengths?.length ?? 0,
    concerns_count: r.concerns?.length ?? 0,
  }));

  // ── Stability Meetings ─────────────────────────────────────────
  const stability_meetings: StabilityMeetingInput[] = (store.placementStabilityMeetings as any[]).map((m: any) => ({
    id: m.id,
    child_id: m.child_id,
    meeting_date: (m.meeting_date ?? "").toString().slice(0, 10),
    risk_level: m.risk_level ?? "medium",
    status: m.status ?? "at_risk",
    agreements_count: m.agreements_reached?.length ?? 0,
    child_view_provided: !!(m.child_view),
  }));

  // ── Disruption Prevention Plans ────────────────────────────────
  const disruption_plans: DisruptionPlanInput[] = (store.disruptionPreventionPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    risk_of_disruption_level: p.risk_of_disruption_level ?? "moderate",
    next_review_date: (p.next_review_date ?? "").toString().slice(0, 10),
    child_aware_of_plan: !!(p.child_aware_of_plan),
    child_contribution_provided: !!(p.child_contribution),
    signed_off_by_la: !!(p.signed_off_by_la),
    proactive_actions_count: p.proactive_actions_in_place?.length ?? 0,
  }));

  // ── Placement End Summaries ────────────────────────────────────
  const placement_ends: PlacementEndInput[] = (store.placementEndSummaries as any[]).map((e: any) => {
    const outcomes = e.outcomes ?? {};
    const ratings = [
      outcomes.health?.rating ?? 0,
      outcomes.education?.rating ?? 0,
      outcomes.relationships?.rating ?? 0,
      outcomes.emotional?.rating ?? 0,
      outcomes.independence?.rating ?? 0,
    ];
    const avg_outcome_rating = ratings.length > 0
      ? Math.round((ratings.reduce((s: number, r: number) => s + r, 0) / ratings.length) * 10) / 10
      : 0;

    return {
      id: e.id,
      end_date: (e.end_date ?? "").toString().slice(0, 10),
      end_reason: e.end_reason ?? "placement_disruption",
      duration_months: e.duration_months ?? 0,
      child_reflection_provided: !!(e.child_reflection),
      avg_outcome_rating,
    };
  });

  // ── Placement Impact Assessments ───────────────────────────────
  const impact_assessments: ImpactAssessmentInput[] = (store.placementImpactAssessments as any[]).map((a: any) => ({
    id: a.id,
    assessment_date: (a.assessment_date ?? "").toString().slice(0, 10),
    status: a.status ?? "pending",
    overall_risk: a.overall_risk ?? "medium",
    impact_on_existing_count: a.impact_on_existing?.length ?? 0,
    conditions_count: a.conditions?.length ?? 0,
  }));

  // ── Matching Referrals ─────────────────────────────────────────
  const matching_referrals: MatchingReferralInput[] = (store.matchingReferrals as any[]).map((r: any) => ({
    id: r.id,
    referral_date: (r.referral_date ?? "").toString().slice(0, 10),
    status: r.status ?? "new",
    overall_match: r.overall_match ?? "not_assessed",
    concerns_count: r.concerns?.length ?? 0,
  }));

  const result = computeHomePlacementStabilityDepth({
    today,
    stability_records,
    stability_meetings,
    disruption_plans,
    placement_ends,
    impact_assessments,
    matching_referrals,
    total_children: store.children?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
