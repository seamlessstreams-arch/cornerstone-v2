// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SUBSTANCE MISUSE PREVENTION INTELLIGENCE API ROUTE
// GET /api/v1/home-substance-misuse-prevention-intelligence
// Cross-domain composite: substanceEducationRecords + substanceRiskAssessmentRecords +
// earlyInterventionRecords + substanceReferralRecords + harmReductionRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSubstanceMisusePrevention,
  type SubstanceEducationRecordInput,
  type SubstanceRiskAssessmentRecordInput,
  type EarlyInterventionRecordInput,
  type SubstanceReferralRecordInput,
  type HarmReductionRecordInput,
} from "@/lib/engines/home-substance-misuse-prevention-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawEducation = (store.substanceEducationRecords ?? []) as any[];
    const substance_education_records: SubstanceEducationRecordInput[] = rawEducation.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      date: (e.date ?? today).toString(),
      topic: e.topic ?? "general_awareness",
      session_type: e.session_type ?? "group",
      attended: !!e.attended,
      engaged: !!e.engaged,
      understanding_demonstrated: !!e.understanding_demonstrated,
      child_feedback_positive: !!e.child_feedback_positive,
      age_appropriate: !!e.age_appropriate,
      facilitator: e.facilitator ?? "",
      duration_minutes: e.duration_minutes ?? 0,
      follow_up_planned: !!e.follow_up_planned,
      follow_up_completed: !!e.follow_up_completed,
      linked_to_risk_assessment: !!e.linked_to_risk_assessment,
      notes: e.notes ?? "",
      created_at: (e.created_at ?? today).toString(),
    }));

    const rawRiskAssessment = (store.substanceRiskAssessmentRecords ?? []) as any[];
    const risk_assessment_records: SubstanceRiskAssessmentRecordInput[] = rawRiskAssessment.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      assessment_type: r.assessment_type ?? "routine",
      risk_level: r.risk_level ?? "low",
      completed: !!r.completed,
      completed_by: r.completed_by ?? "",
      risk_factors_identified: r.risk_factors_identified ?? 0,
      protective_factors_identified: r.protective_factors_identified ?? 0,
      action_plan_created: !!r.action_plan_created,
      action_plan_reviewed: !!r.action_plan_reviewed,
      review_date: r.review_date ?? null,
      review_overdue: !!r.review_overdue,
      shared_with_social_worker: !!r.shared_with_social_worker,
      shared_with_health: !!r.shared_with_health,
      parental_involvement: !!r.parental_involvement,
      child_involved_in_assessment: !!r.child_involved_in_assessment,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawIntervention = (store.earlyInterventionRecords ?? []) as any[];
    const early_intervention_records: EarlyInterventionRecordInput[] = rawIntervention.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? "",
      date: (i.date ?? today).toString(),
      intervention_type: i.intervention_type ?? "brief_intervention",
      trigger: i.trigger ?? "routine_monitoring",
      status: i.status ?? "planned",
      sessions_planned: i.sessions_planned ?? 0,
      sessions_completed: i.sessions_completed ?? 0,
      child_engaged: !!i.child_engaged,
      outcomes_positive: !!i.outcomes_positive,
      measurable_improvement: !!i.measurable_improvement,
      risk_level_reduced: !!i.risk_level_reduced,
      facilitator: i.facilitator ?? "",
      reviewed: !!i.reviewed,
      review_date: i.review_date ?? null,
      notes: i.notes ?? "",
      created_at: (i.created_at ?? today).toString(),
    }));

    const rawReferral = (store.substanceReferralRecords ?? []) as any[];
    const referral_records: SubstanceReferralRecordInput[] = rawReferral.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      referral_to: r.referral_to ?? "gp",
      reason: r.reason ?? "",
      urgency: r.urgency ?? "routine",
      referral_made_within_target: !!r.referral_made_within_target,
      target_days: r.target_days ?? 0,
      actual_days: r.actual_days ?? 0,
      accepted: !!r.accepted,
      appointment_date: r.appointment_date ?? null,
      appointment_attended: !!r.appointment_attended,
      outcome_recorded: !!r.outcome_recorded,
      outcome_positive: !!r.outcome_positive,
      follow_up_required: !!r.follow_up_required,
      follow_up_completed: !!r.follow_up_completed,
      child_consented: !!r.child_consented,
      parent_informed: !!r.parent_informed,
      social_worker_informed: !!r.social_worker_informed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawHarmReduction = (store.harmReductionRecords ?? []) as any[];
    const harm_reduction_records: HarmReductionRecordInput[] = rawHarmReduction.map((h: any) => ({
      id: h.id ?? "",
      child_id: h.child_id ?? "",
      date: (h.date ?? today).toString(),
      strategy_type: h.strategy_type ?? "safety_planning",
      implemented: !!h.implemented,
      child_engaged: !!h.child_engaged,
      child_understands_strategy: !!h.child_understands_strategy,
      reviewed: !!h.reviewed,
      review_date: h.review_date ?? null,
      review_overdue: !!h.review_overdue,
      effectiveness_rating: h.effectiveness_rating ?? 3,
      risk_reduced: !!h.risk_reduced,
      documented: !!h.documented,
      shared_with_team: !!h.shared_with_team,
      linked_to_care_plan: !!h.linked_to_care_plan,
      notes: h.notes ?? "",
      created_at: (h.created_at ?? today).toString(),
    }));

    const result = computeSubstanceMisusePrevention({
      today,
      total_children,
      substance_education_records,
      risk_assessment_records,
      early_intervention_records,
      referral_records,
      harm_reduction_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
