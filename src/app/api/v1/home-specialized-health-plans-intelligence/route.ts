// ══════════════════════════════════════════════════════════════════════════════
// API — HOME SPECIALIZED HEALTH PLANS INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeSpecializedHealthPlans,
  type ADHDPlanInput,
  type AllergyPlanInput,
  type AsthmaPlanInput,
  type AutismPlanInput,
  type DiabeticCarePlanInput,
  type EpilepsyPlanInput,
  type ContinencePlanInput,
  type PhysioOtPlanInput,
  type MenstrualHealthPlanInput,
  type OccupationalTherapyInput,
} from "@/lib/engines/home-specialized-health-plans-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── ADHD Plans ─────────────────────────────────────────────────────────
  const adhd_plans: ADHDPlanInput[] = (store.adhdPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    has_medication: !!(p.medication),
    strategies_count:
      (p.executive_function_support?.length ?? 0) +
      (p.time_blindness_strategies?.length ?? 0) +
      (p.rsd_support?.length ?? 0),
    child_voice_provided: !!(p.child_voice),
    key_worker_assigned: !!(p.key_worker),
  }));

  // ── Allergy Plans ──────────────────────────────────────────────────────
  const allergy_plans: AllergyPlanInput[] = (store.allergyPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    aai_prescribed: !!(p.aai_prescribed),
    staff_trained_count: p.staff_trained_names?.length ?? 0,
    school_has_plan: !!(p.school_has_plan),
    child_wears_medical_alert: !!(p.child_wears_medical_alert),
    allergens_count: p.allergens?.length ?? 0,
    emergency_protocol_count: p.emergency_protocol?.length ?? 0,
  }));

  // ── Asthma Plans ───────────────────────────────────────────────────────
  const asthma_plans: AsthmaPlanInput[] = (store.asthmaPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    has_preventer_inhaler: !!(p.preventer_inhaler),
    has_reliever_inhaler: !!(p.reliever_inhaler),
    school_has_inhaler: !!(p.school_has_inhaler),
    spare_inhaler_locations_count: p.spare_inhaler_locations?.length ?? 0,
    child_can_self_medicate: !!(p.child_can_self_medicate),
  }));

  // ── Autism Plans ───────────────────────────────────────────────────────
  const autism_plans: AutismPlanInput[] = (store.autismPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    sensory_profile_count: p.sensory_profile?.length ?? 0,
    strategies_count:
      (p.staff_do_strategies?.length ?? 0) +
      (p.staff_do_not_strategies?.length ?? 0),
    child_voice_provided: !!(p.child_voice),
    external_support_count: p.external_support?.length ?? 0,
  }));

  // ── Diabetic Care Plans ────────────────────────────────────────────────
  const diabetic_care_plans: DiabeticCarePlanInput[] = (store.diabeticCarePlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    cgm_in_use: !!(p.cgm_in_use),
    school_plan_in_place: !!(p.school_plan_in_place),
    child_can_self_manage: p.child_can_self_manage !== "not_at_all",
    emergency_contacts_count: p.emergency_contacts?.length ?? 0,
    flags_for_review_count: p.flags_for_review?.length ?? 0,
  }));

  // ── Epilepsy Plans ─────────────────────────────────────────────────────
  const epilepsy_plans: EpilepsyPlanInput[] = (store.epilepsySeizurePlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    has_rescue_medication: !!(p.rescue_medication),
    staff_trained_count: p.staff_trained_to_admin?.length ?? 0,
    school_plan_in_place: !!(p.school_plan_in_place),
    safe_sleeping_documented: (p.safe_sleeping_arrangements?.length ?? 0) > 0,
    recent_seizure_count: p.recent_seizure_log?.length ?? 0,
  }));

  // ── Continence Plans ───────────────────────────────────────────────────
  const continence_plans: ContinencePlanInput[] = (store.continencePlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    privacy_measures_count: p.privacy_measures?.length ?? 0,
    child_voice_provided: !!(p.child_voice),
    external_support_count: p.external_support_engaged?.length ?? 0,
    strategies_count:
      (p.staff_do_strategies?.length ?? 0) +
      (p.staff_do_not_strategies?.length ?? 0),
  }));

  // ── Physio/OT Plans ────────────────────────────────────────────────────
  const physio_ot_plans: PhysioOtPlanInput[] = (store.physioOtPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    goals_count: p.goals?.length ?? 0,
    exercises_count: p.exercises_programs?.length ?? 0,
    school_plan_in_place: !!(p.school_plan_in_place),
    child_voice_provided: !!(p.child_voice),
    next_appointment_set: !!(p.next_appointment),
  }));

  // ── Menstrual Health Plans ─────────────────────────────────────────────
  const menstrual_health_plans: MenstrualHealthPlanInput[] = (store.menstrualHealthPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    plan_reviewed_date: (p.plan_reviewed_date ?? "").toString().slice(0, 10),
    child_chosen_products: !!(p.child_chosen_products),
    child_comfort_level: p.child_comfort_level ?? "not_discussed",
    education_delivered_count: p.education_delivered?.length ?? 0,
  }));

  // ── Occupational Therapy Records ───────────────────────────────────────
  const occupational_therapy_records: OccupationalTherapyInput[] = (store.occupationalTherapyRecords as any[]).map((r: any) => ({
    id: r.id,
    child_id: r.child_id,
    assessment_date: (r.assessment_date ?? "").toString().slice(0, 10),
    next_review_date: (r.next_review_date ?? "").toString().slice(0, 10),
    recommendations_count: r.recommendations?.length ?? 0,
    sensory_diet_count: r.sensory_diet?.length ?? 0,
    equipment_count: r.equipment_provided?.length ?? 0,
    report_provided: !!(r.report_provided),
    staff_training_provided: !!(r.staff_training),
  }));

  const result = computeHomeSpecializedHealthPlans({
    today,
    adhd_plans,
    allergy_plans,
    asthma_plans,
    autism_plans,
    diabetic_care_plans,
    epilepsy_plans,
    continence_plans,
    physio_ot_plans,
    menstrual_health_plans,
    occupational_therapy_records,
    total_children: store.youngPeople?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
