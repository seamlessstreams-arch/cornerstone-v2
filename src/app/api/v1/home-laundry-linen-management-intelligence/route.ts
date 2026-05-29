export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeLaundryLinenManagement,
  type LaundryServiceRecordInput,
  type LinenAdequacyRecordInput,
  type ClothingCareRecordInput,
  type HygieneComplianceRecordInput,
  type ChildSatisfactionRecordInput,
} from "@/lib/engines/home-laundry-linen-management-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawLaundryService = (store.laundryServiceRecords ?? []) as any[];
    const laundry_service_records: LaundryServiceRecordInput[] = rawLaundryService.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      laundry_type: r.laundry_type ?? "personal_clothing",
      items_collected: r.items_collected ?? false,
      items_returned: r.items_returned ?? false,
      returned_within_24h: r.returned_within_24h ?? false,
      returned_clean: r.returned_clean ?? false,
      returned_undamaged: r.returned_undamaged ?? false,
      child_preferences_followed: r.child_preferences_followed ?? false,
      labelling_intact: r.labelling_intact ?? false,
      mixed_with_others: r.mixed_with_others ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawLinenAdequacy = (store.linenAdequacyRecords ?? []) as any[];
    const linen_adequacy_records: LinenAdequacyRecordInput[] = rawLinenAdequacy.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      bedding_sufficient: r.bedding_sufficient ?? false,
      bedding_clean: r.bedding_clean ?? false,
      bedding_condition_good: r.bedding_condition_good ?? false,
      towels_sufficient: r.towels_sufficient ?? false,
      towels_clean: r.towels_clean ?? false,
      towels_condition_good: r.towels_condition_good ?? false,
      spare_linen_available: r.spare_linen_available ?? false,
      linen_age_appropriate: r.linen_age_appropriate ?? false,
      linen_child_chosen: r.linen_child_chosen ?? false,
      seasonal_bedding_provided: r.seasonal_bedding_provided ?? false,
      mattress_condition_good: r.mattress_condition_good ?? false,
      pillow_condition_good: r.pillow_condition_good ?? false,
      overall_adequacy_score: r.overall_adequacy_score ?? 3,
      issues_identified: r.issues_identified ?? [],
      issues_resolved: r.issues_resolved ?? false,
      resolution_date: r.resolution_date ?? null,
      assessed_by: r.assessed_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawClothingCare = (store.clothingCareRecords ?? []) as any[];
    const clothing_care_records: ClothingCareRecordInput[] = rawClothingCare.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      clothing_type: r.clothing_type ?? "everyday",
      care_instructions_followed: r.care_instructions_followed ?? false,
      clothing_returned_to_correct_child: r.clothing_returned_to_correct_child ?? false,
      clothing_condition_maintained: r.clothing_condition_maintained ?? false,
      child_preferences_respected: r.child_preferences_respected ?? false,
      cultural_needs_met: r.cultural_needs_met ?? false,
      clothing_labelled: r.clothing_labelled ?? false,
      ironing_pressing_done: r.ironing_pressing_done ?? false,
      stain_treatment_attempted: r.stain_treatment_attempted ?? false,
      child_involved_in_care: r.child_involved_in_care ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawHygieneCompliance = (store.hygieneComplianceRecords ?? []) as any[];
    const hygiene_compliance_records: HygieneComplianceRecordInput[] = rawHygieneCompliance.map((r: any) => ({
      id: r.id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      laundry_area_clean: r.laundry_area_clean ?? false,
      laundry_area_ventilated: r.laundry_area_ventilated ?? false,
      equipment_maintained: r.equipment_maintained ?? false,
      detergent_appropriate: r.detergent_appropriate ?? false,
      allergen_safe_products_used: r.allergen_safe_products_used ?? false,
      temperature_wash_correct: r.temperature_wash_correct ?? false,
      separation_protocols_followed: r.separation_protocols_followed ?? false,
      infection_control_measures_met: r.infection_control_measures_met ?? false,
      soiled_linen_handled_correctly: r.soiled_linen_handled_correctly ?? false,
      drying_facilities_adequate: r.drying_facilities_adequate ?? false,
      storage_clean_appropriate: r.storage_clean_appropriate ?? false,
      staff_trained: r.staff_trained ?? false,
      hand_hygiene_observed: r.hand_hygiene_observed ?? false,
      overall_compliance_score: r.overall_compliance_score ?? 3,
      issues_identified: r.issues_identified ?? [],
      issues_resolved: r.issues_resolved ?? false,
      resolution_date: r.resolution_date ?? null,
      assessed_by: r.assessed_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSatisfaction = (store.childLaundrySatisfactionRecords ?? []) as any[];
    const child_satisfaction_records: ChildSatisfactionRecordInput[] = rawSatisfaction.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      satisfaction_rating: r.satisfaction_rating ?? 3,
      clothing_clean_enough: r.clothing_clean_enough ?? false,
      clothing_returned_timely: r.clothing_returned_timely ?? false,
      clothing_handled_with_care: r.clothing_handled_with_care ?? false,
      bedding_comfortable: r.bedding_comfortable ?? false,
      preferences_listened_to: r.preferences_listened_to ?? false,
      allowed_to_do_own_laundry: r.allowed_to_do_own_laundry ?? false,
      wants_more_independence: r.wants_more_independence ?? false,
      cultural_needs_respected: r.cultural_needs_respected ?? false,
      favourite_items_treated_well: r.favourite_items_treated_well ?? false,
      feels_respected: r.feels_respected ?? false,
      feedback_text: r.feedback_text ?? null,
      staff_member: r.staff_member ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeLaundryLinenManagement({
      today,
      total_children,
      laundry_service_records,
      linen_adequacy_records,
      clothing_care_records,
      hygiene_compliance_records,
      child_satisfaction_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
