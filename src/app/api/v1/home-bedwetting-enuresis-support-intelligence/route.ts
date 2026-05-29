export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBedwettingEnuresisSupport,
  type ManagementPlanRecordInput,
  type DiscreetSupportRecordInput,
  type DignityPreservationRecordInput,
  type MedicalReferralRecordInput,
  type EmotionalWellbeingRecordInput,
} from "@/lib/engines/home-bedwetting-enuresis-support-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawManagementPlans = (store.enuresisManagementPlanRecords ?? []) as any[];
    const management_plan_records: ManagementPlanRecordInput[] = rawManagementPlans.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      plan_created_date: (r.plan_created_date ?? today).toString(),
      plan_type: r.plan_type ?? "individual_enuresis_plan",
      plan_active: r.plan_active ?? false,
      reviewed: r.reviewed ?? false,
      review_date: r.review_date ?? null,
      review_frequency: r.review_frequency ?? "monthly",
      child_involved_in_planning: r.child_involved_in_planning ?? false,
      parent_carer_informed: r.parent_carer_informed ?? false,
      triggers_identified: r.triggers_identified ?? false,
      triggers_documented: r.triggers_documented ?? null,
      night_routine_documented: r.night_routine_documented ?? false,
      fluid_intake_guidance_included: r.fluid_intake_guidance_included ?? false,
      protective_bedding_in_place: r.protective_bedding_in_place ?? false,
      alarm_system_used: r.alarm_system_used ?? false,
      medication_component: r.medication_component ?? false,
      medication_name: r.medication_name ?? null,
      progress_rating: r.progress_rating ?? 3,
      outcomes_documented: r.outcomes_documented ?? false,
      staff_trained_on_plan: r.staff_trained_on_plan ?? false,
      last_incident_date: r.last_incident_date ?? null,
      incident_frequency: r.incident_frequency ?? "occasional",
      goals: r.goals ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDiscreetSupport = (store.enuresisDiscreetSupportRecords ?? []) as any[];
    const discreet_support_records: DiscreetSupportRecordInput[] = rawDiscreetSupport.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      support_type: r.support_type ?? "bedding_change",
      handled_discreetly: r.handled_discreetly ?? false,
      child_aware_of_discretion: r.child_aware_of_discretion ?? false,
      other_children_unaware: r.other_children_unaware ?? false,
      staff_approach_appropriate: r.staff_approach_appropriate ?? false,
      child_dignity_maintained: r.child_dignity_maintained ?? false,
      private_storage_used: r.private_storage_used ?? false,
      timing_appropriate: r.timing_appropriate ?? false,
      staff_member: r.staff_member ?? "",
      child_feedback: r.child_feedback ?? null,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDignity = (store.enuresisDignityPreservationRecords ?? []) as any[];
    const dignity_preservation_records: DignityPreservationRecordInput[] = rawDignity.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      private_laundry_arrangement: r.private_laundry_arrangement ?? false,
      discreet_bedding_storage: r.discreet_bedding_storage ?? false,
      room_access_restricted_appropriately: r.room_access_restricted_appropriately ?? false,
      no_peer_awareness_incidents: r.no_peer_awareness_incidents ?? false,
      child_not_blamed_or_shamed: r.child_not_blamed_or_shamed ?? false,
      language_used_sensitively: r.language_used_sensitively ?? false,
      child_empowered_in_management: r.child_empowered_in_management ?? false,
      self_management_skills_taught: r.self_management_skills_taught ?? false,
      age_appropriate_explanation_given: r.age_appropriate_explanation_given ?? false,
      normalisation_approach_used: r.normalisation_approach_used ?? false,
      overnight_stays_supported: r.overnight_stays_supported ?? false,
      school_trip_support_provided: r.school_trip_support_provided ?? false,
      peer_teasing_addressed: r.peer_teasing_addressed ?? false,
      peer_teasing_incidents: r.peer_teasing_incidents ?? 0,
      overall_dignity_score: r.overall_dignity_score ?? 3,
      issues_identified: r.issues_identified ?? [],
      issues_resolved: r.issues_resolved ?? false,
      resolution_date: r.resolution_date ?? null,
      assessed_by: r.assessed_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawMedical = (store.enuresisMedicalReferralRecords ?? []) as any[];
    const medical_referral_records: MedicalReferralRecordInput[] = rawMedical.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      referral_date: (r.referral_date ?? today).toString(),
      referral_type: r.referral_type ?? "gp",
      referral_reason: r.referral_reason ?? "",
      referral_made_by: r.referral_made_by ?? "",
      referral_accepted: r.referral_accepted ?? false,
      appointment_date: r.appointment_date ?? null,
      appointment_attended: r.appointment_attended ?? false,
      outcome_documented: r.outcome_documented ?? false,
      outcome_summary: r.outcome_summary ?? null,
      follow_up_required: r.follow_up_required ?? false,
      follow_up_date: r.follow_up_date ?? null,
      follow_up_completed: r.follow_up_completed ?? false,
      medication_prescribed: r.medication_prescribed ?? false,
      medication_name: r.medication_name ?? null,
      medication_reviewed: r.medication_reviewed ?? false,
      treatment_plan_received: r.treatment_plan_received ?? false,
      treatment_plan_implemented: r.treatment_plan_implemented ?? false,
      professional_advice_shared_with_staff: r.professional_advice_shared_with_staff ?? false,
      child_consented_to_referral: r.child_consented_to_referral ?? false,
      parent_informed: r.parent_informed ?? false,
      social_worker_informed: r.social_worker_informed ?? false,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawEmotional = (store.enuresisEmotionalWellbeingRecords ?? []) as any[];
    const emotional_wellbeing_records: EmotionalWellbeingRecordInput[] = rawEmotional.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      assessment_type: r.assessment_type ?? "staff_assessment",
      emotional_impact_level: r.emotional_impact_level ?? "mild",
      child_self_esteem_rating: r.child_self_esteem_rating ?? 3,
      child_anxiety_around_bedtime: r.child_anxiety_around_bedtime ?? false,
      child_anxiety_around_sleepovers: r.child_anxiety_around_sleepovers ?? false,
      child_avoids_overnight_activities: r.child_avoids_overnight_activities ?? false,
      child_talks_openly_about_issue: r.child_talks_openly_about_issue ?? false,
      child_feels_supported: r.child_feels_supported ?? false,
      child_feels_embarrassed: r.child_feels_embarrassed ?? false,
      child_feels_different: r.child_feels_different ?? false,
      peer_relationship_impact: r.peer_relationship_impact ?? "none",
      school_impact: r.school_impact ?? "none",
      therapeutic_support_offered: r.therapeutic_support_offered ?? false,
      therapeutic_support_accepted: r.therapeutic_support_accepted ?? false,
      therapeutic_support_type: r.therapeutic_support_type ?? null,
      coping_strategies_in_place: r.coping_strategies_in_place ?? false,
      coping_strategies_effective: r.coping_strategies_effective ?? false,
      progress_since_last_assessment: r.progress_since_last_assessment ?? "first_assessment",
      staff_member: r.staff_member ?? "",
      child_voice_captured: r.child_voice_captured ?? false,
      child_wishes_recorded: r.child_wishes_recorded ?? null,
      confidence_in_management: r.confidence_in_management ?? false,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeBedwettingEnuresisSupport({
      today,
      total_children,
      management_plan_records,
      discreet_support_records,
      dignity_preservation_records,
      medical_referral_records,
      emotional_wellbeing_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
