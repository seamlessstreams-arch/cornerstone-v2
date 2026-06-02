// ==============================================================================
// CORNERSTONE -- HOME CONTINENCE & PERSONAL HYGIENE SUPPORT INTELLIGENCE API ROUTE
// GET /api/v1/home-continence-personal-hygiene-support-intelligence
// Cross-domain composite: continencePlanRecords + hygieneRoutineRecords +
// dignityCareRecords + ageGuidanceRecords + productProvisionRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeContinencePersonalHygieneSupport,
  type ContinencePlanRecordInput,
  type HygieneRoutineRecordInput,
  type DignityCareRecordInput,
  type AgeGuidanceRecordInput,
  type ProductProvisionRecordInput,
} from "@/lib/engines/home-continence-personal-hygiene-support-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawContinencePlans = (store.continencePlanRecords ?? []) as any[];
    const continence_plan_records: ContinencePlanRecordInput[] = rawContinencePlans.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      plan_created_date: (p.plan_created_date ?? today).toString(),
      plan_review_date: p.plan_review_date ?? null,
      plan_reviewed_on_time: !!p.plan_reviewed_on_time,
      condition_type: p.condition_type ?? "other",
      plan_in_place: !!p.plan_in_place,
      plan_personalised: !!p.plan_personalised,
      goals_set: !!p.goals_set,
      goals_reviewed: !!p.goals_reviewed,
      goals_progressing: !!p.goals_progressing,
      medical_advice_sought: !!p.medical_advice_sought,
      medical_professional_involved: !!p.medical_professional_involved,
      gp_referral_made: !!p.gp_referral_made,
      specialist_referral_made: !!p.specialist_referral_made,
      night_management_plan: !!p.night_management_plan,
      daytime_management_plan: !!p.daytime_management_plan,
      school_plan_shared: !!p.school_plan_shared,
      triggers_identified: !!p.triggers_identified,
      fluid_intake_monitored: !!p.fluid_intake_monitored,
      diet_reviewed: !!p.diet_reviewed,
      toileting_schedule_in_place: !!p.toileting_schedule_in_place,
      reward_system_used: !!p.reward_system_used,
      child_involved_in_planning: !!p.child_involved_in_planning,
      parent_carer_informed: !!p.parent_carer_informed,
      social_worker_informed: !!p.social_worker_informed,
      confidentiality_maintained: !!p.confidentiality_maintained,
      staff_aware_of_plan: !!p.staff_aware_of_plan,
      staff_trained: !!p.staff_trained,
      records_kept_securely: !!p.records_kept_securely,
      progress_notes_up_to_date: !!p.progress_notes_up_to_date,
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawHygieneRoutines = (store.hygieneRoutineRecords ?? []) as any[];
    const hygiene_routine_records: HygieneRoutineRecordInput[] = rawHygieneRoutines.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      routine_type: r.routine_type ?? "other",
      routine_supported: !!r.routine_supported,
      routine_completed: !!r.routine_completed,
      child_independent: !!r.child_independent,
      child_prompted: !!r.child_prompted,
      child_assisted: !!r.child_assisted,
      child_refused: !!r.child_refused,
      refusal_handled_sensitively: !!r.refusal_handled_sensitively,
      age_appropriate_approach: !!r.age_appropriate_approach,
      dignity_maintained: !!r.dignity_maintained,
      products_available: !!r.products_available,
      products_suitable: !!r.products_suitable,
      cultural_needs_met: !!r.cultural_needs_met,
      sensory_needs_considered: !!r.sensory_needs_considered,
      same_gender_support_offered: !!r.same_gender_support_offered,
      privacy_respected: !!r.privacy_respected,
      child_choice_respected: !!r.child_choice_respected,
      routine_personalised: !!r.routine_personalised,
      encouragement_given: !!r.encouragement_given,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDignityCare = (store.dignityCareRecords ?? []) as any[];
    const dignity_care_records: DignityCareRecordInput[] = rawDignityCare.map((d: any) => ({
      id: d.id ?? "",
      child_id: d.child_id ?? "",
      date: (d.date ?? today).toString(),
      context: d.context ?? "other",
      dignity_maintained: !!d.dignity_maintained,
      privacy_ensured: !!d.privacy_ensured,
      consent_sought: !!d.consent_sought,
      child_views_respected: !!d.child_views_respected,
      minimal_staff_involved: !!d.minimal_staff_involved,
      same_gender_carer_offered: !!d.same_gender_carer_offered,
      same_gender_carer_provided: !!d.same_gender_carer_provided,
      discrete_approach_used: !!d.discrete_approach_used,
      child_embarrassment_minimised: !!d.child_embarrassment_minimised,
      peer_awareness_managed: !!d.peer_awareness_managed,
      clean_clothes_provided_promptly: !!d.clean_clothes_provided_promptly,
      bedding_changed_promptly: !!d.bedding_changed_promptly,
      no_shaming_language: !!d.no_shaming_language,
      positive_reassurance_given: !!d.positive_reassurance_given,
      incident_recorded_sensitively: !!d.incident_recorded_sensitively,
      child_debriefed: !!d.child_debriefed,
      emotional_support_offered: !!d.emotional_support_offered,
      staff_followed_protocol: !!d.staff_followed_protocol,
      notes: d.notes ?? "",
      created_at: (d.created_at ?? today).toString(),
    }));

    const rawAgeGuidance = (store.ageGuidanceRecords ?? []) as any[];
    const age_guidance_records: AgeGuidanceRecordInput[] = rawAgeGuidance.map((g: any) => ({
      id: g.id ?? "",
      child_id: g.child_id ?? "",
      date: (g.date ?? today).toString(),
      guidance_type: g.guidance_type ?? "other",
      age_appropriate: !!g.age_appropriate,
      development_appropriate: !!g.development_appropriate,
      delivered_sensitively: !!g.delivered_sensitively,
      child_engaged: !!g.child_engaged,
      child_understood: !!g.child_understood,
      visual_aids_used: !!g.visual_aids_used,
      materials_provided: !!g.materials_provided,
      follow_up_planned: !!g.follow_up_planned,
      follow_up_completed: !!g.follow_up_completed,
      delivered_by: g.delivered_by ?? "staff",
      child_questions_encouraged: !!g.child_questions_encouraged,
      child_feedback_positive: !!g.child_feedback_positive,
      parent_carer_consulted: !!g.parent_carer_consulted,
      cultural_sensitivity_shown: !!g.cultural_sensitivity_shown,
      linked_to_care_plan: !!g.linked_to_care_plan,
      notes: g.notes ?? "",
      created_at: (g.created_at ?? today).toString(),
    }));

    const rawProductProvision = (store.productProvisionRecords ?? []) as any[];
    const product_provision_records: ProductProvisionRecordInput[] = rawProductProvision.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      date: (p.date ?? today).toString(),
      product_category: p.product_category ?? "other",
      product_available: !!p.product_available,
      product_suitable: !!p.product_suitable,
      product_preferred_by_child: !!p.product_preferred_by_child,
      sufficient_quantity: !!p.sufficient_quantity,
      stored_discreetly: !!p.stored_discreetly,
      easy_access_for_child: !!p.easy_access_for_child,
      brand_choice_offered: !!p.brand_choice_offered,
      cultural_needs_met: !!p.cultural_needs_met,
      sensory_needs_met: !!p.sensory_needs_met,
      replenished_on_time: !!p.replenished_on_time,
      budget_adequate: !!p.budget_adequate,
      child_consulted_on_choice: !!p.child_consulted_on_choice,
      age_appropriate: !!p.age_appropriate,
      medical_recommendation_followed: !!p.medical_recommendation_followed,
      quality_acceptable: !!p.quality_acceptable,
      child_dignity_preserved: !!p.child_dignity_preserved,
      staff_aware_of_needs: !!p.staff_aware_of_needs,
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const result = computeContinencePersonalHygieneSupport({
      today,
      total_children,
      continence_plan_records,
      hygiene_routine_records,
      dignity_care_records,
      age_guidance_records,
      product_provision_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
