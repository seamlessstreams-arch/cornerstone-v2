export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeAromatherapyWellbeingTherapies,
  type AromatherapySessionRecordInput,
  type WellbeingTherapyRecordInput,
  type RelaxationProgrammeRecordInput,
  type CalmingTechniqueRecordInput,
  type ChildBenefitRecordInput,
} from "@/lib/engines/home-aromatherapy-wellbeing-therapies-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawAroma = (store.aromatherapySessionRecords ?? []) as any[];
    const aromatherapy_session_records: AromatherapySessionRecordInput[] = rawAroma.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      session_date: (r.session_date ?? today).toString(),
      session_type: r.session_type ?? "individual",
      therapist_name: r.therapist_name ?? "",
      therapist_qualified: r.therapist_qualified ?? false,
      oils_used: r.oils_used ?? [],
      application_method: r.application_method ?? "diffuser",
      consent_obtained: r.consent_obtained ?? false,
      allergy_check_completed: r.allergy_check_completed ?? false,
      contraindication_check_completed: r.contraindication_check_completed ?? false,
      duration_minutes: r.duration_minutes ?? 0,
      child_mood_before: r.child_mood_before ?? 3,
      child_mood_after: r.child_mood_after ?? 3,
      child_engagement_rating: r.child_engagement_rating ?? 3,
      child_feedback_positive: r.child_feedback_positive ?? false,
      session_goals_set: r.session_goals_set ?? false,
      session_goals_met: r.session_goals_met ?? false,
      adverse_reaction: r.adverse_reaction ?? false,
      adverse_reaction_details: r.adverse_reaction_details ?? null,
      risk_assessment_current: r.risk_assessment_current ?? false,
      notes_recorded: r.notes_recorded ?? false,
      follow_up_planned: r.follow_up_planned ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawWellbeing = (store.wellbeingTherapyRecords ?? []) as any[];
    const wellbeing_therapy_records: WellbeingTherapyRecordInput[] = rawWellbeing.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      therapy_date: (r.therapy_date ?? today).toString(),
      therapy_type: r.therapy_type ?? "aromatherapy",
      therapist_name: r.therapist_name ?? "",
      therapist_qualified: r.therapist_qualified ?? false,
      session_format: r.session_format ?? "individual",
      duration_minutes: r.duration_minutes ?? 0,
      consent_obtained: r.consent_obtained ?? false,
      child_engagement_rating: r.child_engagement_rating ?? 3,
      therapeutic_benefit_observed: r.therapeutic_benefit_observed ?? false,
      child_feedback_positive: r.child_feedback_positive ?? false,
      child_self_reported_benefit: r.child_self_reported_benefit ?? false,
      mood_improvement_observed: r.mood_improvement_observed ?? false,
      anxiety_reduction_observed: r.anxiety_reduction_observed ?? false,
      sleep_improvement_reported: r.sleep_improvement_reported ?? false,
      staff_present: r.staff_present ?? false,
      notes_recorded: r.notes_recorded ?? false,
      follow_up_planned: r.follow_up_planned ?? false,
      referral_source: r.referral_source ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRelaxation = (store.relaxationProgrammeRecords ?? []) as any[];
    const relaxation_programme_records: RelaxationProgrammeRecordInput[] = rawRelaxation.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      programme_name: r.programme_name ?? "",
      start_date: (r.start_date ?? today).toString(),
      review_date: r.review_date ?? null,
      reviewed: r.reviewed ?? false,
      programme_type: r.programme_type ?? "breathing_exercises",
      frequency_per_week: r.frequency_per_week ?? 1,
      sessions_attended: r.sessions_attended ?? 0,
      sessions_planned: r.sessions_planned ?? 0,
      child_engagement_rating: r.child_engagement_rating ?? 3,
      effectiveness_rating: r.effectiveness_rating ?? 3,
      child_feedback_positive: r.child_feedback_positive ?? false,
      child_involved_in_planning: r.child_involved_in_planning ?? false,
      measurable_outcomes_set: r.measurable_outcomes_set ?? false,
      measurable_outcomes_achieved: r.measurable_outcomes_achieved ?? false,
      anxiety_level_before: r.anxiety_level_before ?? 5,
      anxiety_level_after: r.anxiety_level_after ?? 5,
      programme_active: r.programme_active ?? true,
      staff_trained: r.staff_trained ?? false,
      notes_recorded: r.notes_recorded ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCalming = (store.calmingTechniqueRecords ?? []) as any[];
    const calming_technique_records: CalmingTechniqueRecordInput[] = rawCalming.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      technique_date: (r.technique_date ?? today).toString(),
      technique_type: r.technique_type ?? "breathing_technique",
      context: r.context ?? "daily_routine",
      child_initiated: r.child_initiated ?? false,
      staff_guided: r.staff_guided ?? false,
      duration_minutes: r.duration_minutes ?? 0,
      effectiveness_rating: r.effectiveness_rating ?? 3,
      child_mood_before: r.child_mood_before ?? 3,
      child_mood_after: r.child_mood_after ?? 3,
      child_feedback_positive: r.child_feedback_positive ?? false,
      technique_appropriate: r.technique_appropriate ?? false,
      sensory_profile_considered: r.sensory_profile_considered ?? false,
      de_escalation_achieved: r.de_escalation_achieved ?? false,
      notes_recorded: r.notes_recorded ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawBenefit = (store.childBenefitRecords ?? []) as any[];
    const child_benefit_records: ChildBenefitRecordInput[] = rawBenefit.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      assessment_period_start: (r.assessment_period_start ?? today).toString(),
      assessment_period_end: (r.assessment_period_end ?? today).toString(),
      therapies_accessed: r.therapies_accessed ?? [],
      sessions_attended_count: r.sessions_attended_count ?? 0,
      sessions_offered_count: r.sessions_offered_count ?? 0,
      overall_wellbeing_improvement: r.overall_wellbeing_improvement ?? false,
      emotional_regulation_improved: r.emotional_regulation_improved ?? false,
      anxiety_reduced: r.anxiety_reduced ?? false,
      sleep_quality_improved: r.sleep_quality_improved ?? false,
      behaviour_improved: r.behaviour_improved ?? false,
      confidence_improved: r.confidence_improved ?? false,
      social_skills_improved: r.social_skills_improved ?? false,
      self_care_skills_improved: r.self_care_skills_improved ?? false,
      child_self_reported_benefit: r.child_self_reported_benefit ?? false,
      staff_reported_benefit: r.staff_reported_benefit ?? false,
      overall_progress_rating: r.overall_progress_rating ?? 3,
      child_voice_captured: r.child_voice_captured ?? false,
      child_wants_to_continue: r.child_wants_to_continue ?? false,
      barriers_identified: r.barriers_identified ?? [],
      support_plan_updated: r.support_plan_updated ?? false,
      review_date: r.review_date ?? null,
      review_overdue: r.review_overdue ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeAromatherapyWellbeingTherapies({
      today,
      total_children,
      aromatherapy_session_records,
      wellbeing_therapy_records,
      relaxation_programme_records,
      calming_technique_records,
      child_benefit_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
