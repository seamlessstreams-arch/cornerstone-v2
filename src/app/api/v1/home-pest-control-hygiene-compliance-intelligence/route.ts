// ==============================================================================
// CORNERSTONE -- HOME PEST CONTROL & HYGIENE COMPLIANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-pest-control-hygiene-compliance-intelligence
// Cross-domain composite: pestInspectionRecords + treatmentRecords +
// kitchenHygieneRecords + cleanlinessRatingRecords + productSafetyRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePestControlHygieneCompliance,
  type PestInspectionRecordInput,
  type TreatmentRecordInput,
  type KitchenHygieneRecordInput,
  type CleanlinessRatingRecordInput,
  type ProductSafetyRecordInput,
} from "@/lib/engines/home-pest-control-hygiene-compliance-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawPestInspections = (store.pestInspectionRecords ?? []) as any[];
    const pest_inspection_records: PestInspectionRecordInput[] = rawPestInspections.map((r: any) => ({
      id: r.id ?? "",
      inspection_date: (r.inspection_date ?? today).toString(),
      inspector_type: r.inspector_type ?? "internal_staff",
      areas_inspected: Array.isArray(r.areas_inspected) ? r.areas_inspected : [],
      pests_found: !!r.pests_found,
      pest_types_found: Array.isArray(r.pest_types_found) ? r.pest_types_found : [],
      severity: r.severity ?? "none",
      scheduled: !!r.scheduled,
      completed_on_time: !!r.completed_on_time,
      follow_up_required: !!r.follow_up_required,
      follow_up_completed: !!r.follow_up_completed,
      report_filed: !!r.report_filed,
      corrective_actions_identified: r.corrective_actions_identified ?? 0,
      corrective_actions_completed: r.corrective_actions_completed ?? 0,
      next_inspection_date: r.next_inspection_date ?? null,
      children_areas_affected: !!r.children_areas_affected,
      staff_id: r.staff_id ?? "",
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTreatments = (store.treatmentRecords ?? []) as any[];
    const treatment_records: TreatmentRecordInput[] = rawTreatments.map((r: any) => ({
      id: r.id ?? "",
      treatment_date: (r.treatment_date ?? today).toString(),
      pest_type: r.pest_type ?? "",
      treatment_method: r.treatment_method ?? "preventive",
      product_used: r.product_used ?? "",
      product_child_safe: !!r.product_child_safe,
      coshh_compliant: !!r.coshh_compliant,
      area_treated: r.area_treated ?? "",
      children_relocated_during_treatment: !!r.children_relocated_during_treatment,
      re_entry_time_observed: !!r.re_entry_time_observed,
      treatment_effective: !!r.treatment_effective,
      follow_up_treatment_required: !!r.follow_up_treatment_required,
      follow_up_treatment_completed: !!r.follow_up_treatment_completed,
      risk_assessment_completed: !!r.risk_assessment_completed,
      staff_id: r.staff_id ?? "",
      contractor_name: r.contractor_name ?? "",
      contractor_certified: !!r.contractor_certified,
      documentation_complete: !!r.documentation_complete,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawKitchenHygiene = (store.kitchenHygieneRecords ?? []) as any[];
    const kitchen_hygiene_records: KitchenHygieneRecordInput[] = rawKitchenHygiene.map((r: any) => ({
      id: r.id ?? "",
      audit_date: (r.audit_date ?? today).toString(),
      auditor_type: r.auditor_type ?? "internal",
      overall_score: r.overall_score ?? 0,
      food_storage_compliant: !!r.food_storage_compliant,
      temperature_monitoring_compliant: !!r.temperature_monitoring_compliant,
      cleaning_schedule_followed: !!r.cleaning_schedule_followed,
      pest_evidence_found: !!r.pest_evidence_found,
      hand_hygiene_compliant: !!r.hand_hygiene_compliant,
      waste_management_compliant: !!r.waste_management_compliant,
      cross_contamination_controls: !!r.cross_contamination_controls,
      staff_training_current: !!r.staff_training_current,
      fridge_temperature_in_range: !!r.fridge_temperature_in_range,
      freezer_temperature_in_range: !!r.freezer_temperature_in_range,
      cooking_temperature_verified: !!r.cooking_temperature_verified,
      allergen_controls_in_place: !!r.allergen_controls_in_place,
      corrective_actions_raised: r.corrective_actions_raised ?? 0,
      corrective_actions_closed: r.corrective_actions_closed ?? 0,
      food_hygiene_rating: r.food_hygiene_rating ?? 0,
      date_labelling_compliant: !!r.date_labelling_compliant,
      surface_cleanliness_passed: !!r.surface_cleanliness_passed,
      equipment_maintained: !!r.equipment_maintained,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCleanlinessRatings = (store.cleanlinessRatingRecords ?? []) as any[];
    const cleanliness_rating_records: CleanlinessRatingRecordInput[] = rawCleanlinessRatings.map((r: any) => ({
      id: r.id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      area_name: r.area_name ?? "",
      area_type: r.area_type ?? "other",
      cleanliness_score: r.cleanliness_score ?? 5,
      hygiene_standard_met: !!r.hygiene_standard_met,
      deep_clean_completed: !!r.deep_clean_completed,
      deep_clean_due_date: r.deep_clean_due_date ?? null,
      deep_clean_overdue: !!r.deep_clean_overdue,
      infection_control_compliant: !!r.infection_control_compliant,
      hazards_identified: r.hazards_identified ?? 0,
      hazards_resolved: r.hazards_resolved ?? 0,
      odour_issues: !!r.odour_issues,
      damp_mould_issues: !!r.damp_mould_issues,
      ventilation_adequate: !!r.ventilation_adequate,
      child_involved_in_assessment: !!r.child_involved_in_assessment,
      staff_id: r.staff_id ?? "",
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawProductSafety = (store.productSafetyRecords ?? []) as any[];
    const product_safety_records: ProductSafetyRecordInput[] = rawProductSafety.map((r: any) => ({
      id: r.id ?? "",
      product_name: r.product_name ?? "",
      product_type: r.product_type ?? "other",
      child_safe_certified: !!r.child_safe_certified,
      coshh_assessment_completed: !!r.coshh_assessment_completed,
      coshh_sheet_available: !!r.coshh_sheet_available,
      stored_securely: !!r.stored_securely,
      locked_storage: !!r.locked_storage,
      labelled_correctly: !!r.labelled_correctly,
      in_date: r.in_date !== undefined ? !!r.in_date : true,
      expiry_date: r.expiry_date ?? null,
      staff_trained_on_use: !!r.staff_trained_on_use,
      risk_assessment_completed: !!r.risk_assessment_completed,
      first_aid_instructions_available: !!r.first_aid_instructions_available,
      alternative_child_safe_product_available: !!r.alternative_child_safe_product_available,
      usage_logged: !!r.usage_logged,
      last_audit_date: r.last_audit_date ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computePestControlHygieneCompliance({
      today,
      total_children,
      pest_inspection_records,
      treatment_records,
      kitchen_hygiene_records,
      cleanliness_rating_records,
      product_safety_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
