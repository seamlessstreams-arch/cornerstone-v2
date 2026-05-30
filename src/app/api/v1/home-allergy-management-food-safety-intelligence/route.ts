// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME ALLERGY MANAGEMENT & FOOD SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-allergy-management-food-safety-intelligence
// Cross-domain composite: allergyPlanRecords + allergenAwarenessRecords +
// epipenCheckRecords + foodLabellingRecords + emergencyResponseRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeAllergyManagementFoodSafety,
  type AllergyPlanInput,
  type AllergenAwarenessInput,
  type EpipenCheckInput,
  type FoodLabellingInput,
  type EmergencyResponseInput,
} from "@/lib/engines/home-allergy-management-food-safety-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    // Children with allergies: those who have at least one allergy plan or are flagged
    const rawAllergyPlans = (store.allergyPlanRecords ?? []) as any[];
    const uniqueAllergyChildIds = new Set(rawAllergyPlans.map((p: any) => p.child_id));
    const children_with_allergies = Math.max(
      uniqueAllergyChildIds.size,
      (store.childrenWithAllergiesCount as number) ?? 0,
    );

    const totalStaffArr = (store.staff ?? []) as any[];
    const total_staff = totalStaffArr.filter((s: any) => s.status === "active" || s.status === "current").length || totalStaffArr.length;

    const allergy_plan_records: AllergyPlanInput[] = rawAllergyPlans.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      allergen: p.allergen ?? "",
      severity: p.severity ?? "moderate",
      plan_created_date: (p.plan_created_date ?? today).toString(),
      plan_review_date: p.plan_review_date ?? null,
      plan_review_overdue: !!p.plan_review_overdue,
      plan_shared_with_staff: !!p.plan_shared_with_staff,
      plan_shared_with_child: !!p.plan_shared_with_child,
      emergency_medication_specified: !!p.emergency_medication_specified,
      dietary_requirements_documented: !!p.dietary_requirements_documented,
      cross_contamination_measures: !!p.cross_contamination_measures,
      gp_or_specialist_input: !!p.gp_or_specialist_input,
      parent_carer_consulted: !!p.parent_carer_consulted,
      risk_assessment_completed: !!p.risk_assessment_completed,
      photo_on_plan: !!p.photo_on_plan,
      plan_accessible_in_kitchen: !!p.plan_accessible_in_kitchen,
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawAwareness = (store.allergenAwarenessRecords ?? []) as any[];
    const allergen_awareness_records: AllergenAwarenessInput[] = rawAwareness.map((a: any) => ({
      id: a.id ?? "",
      staff_id: a.staff_id ?? "",
      staff_name: a.staff_name ?? "",
      training_type: a.training_type ?? "induction",
      training_date: (a.training_date ?? today).toString(),
      expiry_date: a.expiry_date ?? null,
      training_expired: !!a.training_expired,
      trainer_name: a.trainer_name ?? "",
      certificate_held: !!a.certificate_held,
      assessment_passed: !!a.assessment_passed,
      covers_all_14_allergens: !!a.covers_all_14_allergens,
      practical_component_completed: !!a.practical_component_completed,
      created_at: (a.created_at ?? today).toString(),
    }));

    const rawEpipens = (store.epipenCheckRecords ?? []) as any[];
    const epipen_check_records: EpipenCheckInput[] = rawEpipens.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      epipen_location: e.epipen_location ?? "",
      check_date: (e.check_date ?? today).toString(),
      expiry_date: (e.expiry_date ?? today).toString(),
      epipen_expired: !!e.epipen_expired,
      epipen_in_date: e.epipen_in_date !== false,
      epipen_accessible: e.epipen_accessible !== false,
      spare_available: !!e.spare_available,
      checked_by: e.checked_by ?? "",
      location_clearly_labelled: !!e.location_clearly_labelled,
      staff_aware_of_location: e.staff_aware_of_location !== false,
      travel_kit_available: !!e.travel_kit_available,
      created_at: (e.created_at ?? today).toString(),
    }));

    const rawLabelling = (store.foodLabellingRecords ?? []) as any[];
    const food_labelling_records: FoodLabellingInput[] = rawLabelling.map((f: any) => ({
      id: f.id ?? "",
      audit_date: (f.audit_date ?? today).toString(),
      area_audited: f.area_audited ?? "kitchen",
      items_checked: f.items_checked ?? 0,
      items_correctly_labelled: f.items_correctly_labelled ?? 0,
      allergen_info_displayed: !!f.allergen_info_displayed,
      cross_contamination_controls: !!f.cross_contamination_controls,
      date_marking_compliant: !!f.date_marking_compliant,
      separate_storage_for_allergens: !!f.separate_storage_for_allergens,
      menu_allergen_info_available: !!f.menu_allergen_info_available,
      auditor_name: f.auditor_name ?? "",
      corrective_actions_required: f.corrective_actions_required ?? 0,
      corrective_actions_completed: f.corrective_actions_completed ?? 0,
      created_at: (f.created_at ?? today).toString(),
    }));

    const rawEmergency = (store.emergencyResponseRecords ?? store.allergyEmergencyResponseRecords ?? []) as any[];
    const emergency_response_records: EmergencyResponseInput[] = rawEmergency.map((e: any) => ({
      id: e.id ?? "",
      drill_date: (e.drill_date ?? today).toString(),
      drill_type: e.drill_type ?? "tabletop",
      scenario: e.scenario ?? "",
      participants_expected: e.participants_expected ?? 0,
      participants_attended: e.participants_attended ?? 0,
      response_time_seconds: e.response_time_seconds ?? null,
      correct_procedure_followed: !!e.correct_procedure_followed,
      epipen_administered_correctly: !!e.epipen_administered_correctly,
      emergency_services_called_correctly: !!e.emergency_services_called_correctly,
      debrief_completed: !!e.debrief_completed,
      lessons_learned_documented: !!e.lessons_learned_documented,
      improvements_identified: e.improvements_identified ?? 0,
      improvements_actioned: e.improvements_actioned ?? 0,
      next_drill_date: e.next_drill_date ?? null,
      created_at: (e.created_at ?? today).toString(),
    }));

    const result = computeAllergyManagementFoodSafety({
      today,
      total_children,
      children_with_allergies,
      total_staff,
      allergy_plan_records,
      allergen_awareness_records,
      epipen_check_records,
      food_labelling_records,
      emergency_response_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
