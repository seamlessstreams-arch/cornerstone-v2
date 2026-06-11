// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME BATHROOM & SHOWER FACILITIES INTELLIGENCE API ROUTE
// GET /api/v1/home-bathroom-shower-facilities-intelligence
// Cross-domain composite: cleanlinessAuditRecords + showerAvailabilityRecords +
// hotWaterRecords + privacyRecords + accessibilityRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBathroomShowerFacilities,
  type CleanlinessAuditRecordInput,
  type ShowerAvailabilityRecordInput,
  type HotWaterRecordInput,
  type PrivacyRecordInput,
  type AccessibilityRecordInput,
} from "@/lib/engines/home-bathroom-shower-facilities-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawCleanliness = (store.cleanlinessAuditRecords ?? []) as any[];
    const cleanliness_audit_records: CleanlinessAuditRecordInput[] = rawCleanliness.map((a: any) => ({
      id: a.id ?? "",
      date: (a.date ?? today).toString(),
      bathroom_id: a.bathroom_id ?? "",
      bathroom_name: a.bathroom_name ?? "",
      auditor: a.auditor ?? "",
      overall_score: a.overall_score ?? 3,
      surfaces_clean: !!a.surfaces_clean,
      floor_clean: !!a.floor_clean,
      toilet_clean: !!a.toilet_clean,
      sink_clean: !!a.sink_clean,
      shower_bath_clean: !!a.shower_bath_clean,
      mirrors_clean: !!a.mirrors_clean,
      bins_emptied: !!a.bins_emptied,
      supplies_stocked: !!a.supplies_stocked,
      mould_detected: !!a.mould_detected,
      limescale_detected: !!a.limescale_detected,
      ventilation_adequate: !!a.ventilation_adequate,
      odour_free: !!a.odour_free,
      hazards_found: !!a.hazards_found,
      hazard_description: a.hazard_description ?? "",
      corrective_action_taken: !!a.corrective_action_taken,
      follow_up_required: !!a.follow_up_required,
      follow_up_completed: !!a.follow_up_completed,
      child_feedback_collected: !!a.child_feedback_collected,
      child_feedback_positive: !!a.child_feedback_positive,
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const rawShowerAvailability = (store.showerAvailabilityRecords ?? []) as any[];
    const shower_availability_records: ShowerAvailabilityRecordInput[] = rawShowerAvailability.map((s: any) => ({
      id: s.id ?? "",
      date: (s.date ?? today).toString(),
      bathroom_id: s.bathroom_id ?? "",
      bathroom_name: s.bathroom_name ?? "",
      shower_functional: !!s.shower_functional,
      bath_functional: !!s.bath_functional,
      hot_water_available: !!s.hot_water_available,
      cold_water_available: !!s.cold_water_available,
      adequate_water_pressure: !!s.adequate_water_pressure,
      drainage_clear: !!s.drainage_clear,
      showerhead_condition: s.showerhead_condition ?? "good",
      anti_slip_measures_in_place: !!s.anti_slip_measures_in_place,
      shower_curtain_screen_intact: !!s.shower_curtain_screen_intact,
      reported_by: s.reported_by ?? "",
      time_of_check: s.time_of_check ?? "",
      downtime_hours: s.downtime_hours ?? 0,
      repair_requested: !!s.repair_requested,
      repair_completed: !!s.repair_completed,
      child_affected: !!s.child_affected,
      alternative_provided: !!s.alternative_provided,
      notes: s.notes ?? "",
      created_at: (s.created_at ?? today).toString(),
    }));

    const rawHotWater = (store.hotWaterRecords ?? []) as any[];
    const hot_water_records: HotWaterRecordInput[] = rawHotWater.map((h: any) => ({
      id: h.id ?? "",
      date: (h.date ?? today).toString(),
      bathroom_id: h.bathroom_id ?? "",
      bathroom_name: h.bathroom_name ?? "",
      temperature_celsius: h.temperature_celsius ?? 0,
      within_safe_range: !!h.within_safe_range,
      tmv_fitted: !!h.tmv_fitted,
      tmv_tested: !!h.tmv_tested,
      tmv_test_passed: !!h.tmv_test_passed,
      scalding_risk_identified: !!h.scalding_risk_identified,
      scalding_incident_occurred: !!h.scalding_incident_occurred,
      legionella_check_completed: !!h.legionella_check_completed,
      legionella_check_passed: !!h.legionella_check_passed,
      water_quality_acceptable: !!h.water_quality_acceptable,
      tested_by: h.tested_by ?? "",
      next_test_due: (h.next_test_due ?? today).toString(),
      corrective_action_required: !!h.corrective_action_required,
      corrective_action_completed: !!h.corrective_action_completed,
      notes: h.notes ?? "",
      created_at: (h.created_at ?? today).toString(),
    }));

    const rawPrivacy = (store.privacyRecords ?? []) as any[];
    const privacy_records: PrivacyRecordInput[] = rawPrivacy.map((p: any) => ({
      id: p.id ?? "",
      date: (p.date ?? today).toString(),
      bathroom_id: p.bathroom_id ?? "",
      bathroom_name: p.bathroom_name ?? "",
      lock_fitted: !!p.lock_fitted,
      lock_functional: !!p.lock_functional,
      lock_overridable_externally: !!p.lock_overridable_externally,
      frosted_window_or_blind: !!p.frosted_window_or_blind,
      adequate_screening: !!p.adequate_screening,
      individual_towels_provided: !!p.individual_towels_provided,
      personal_storage_available: !!p.personal_storage_available,
      knock_before_entry_policy_observed: !!p.knock_before_entry_policy_observed,
      child_consulted_on_privacy: !!p.child_consulted_on_privacy,
      child_satisfied_with_privacy: !!p.child_satisfied_with_privacy,
      shared_bathroom: !!p.shared_bathroom,
      sharing_arrangement_appropriate: !!p.sharing_arrangement_appropriate,
      privacy_complaint_received: !!p.privacy_complaint_received,
      complaint_resolved: !!p.complaint_resolved,
      assessed_by: p.assessed_by ?? "",
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawAccessibility = (store.accessibilityRecords ?? []) as any[];
    const accessibility_records: AccessibilityRecordInput[] = rawAccessibility.map((a: any) => ({
      id: a.id ?? "",
      date: (a.date ?? today).toString(),
      bathroom_id: a.bathroom_id ?? "",
      bathroom_name: a.bathroom_name ?? "",
      wheelchair_accessible: !!a.wheelchair_accessible,
      grab_rails_fitted: !!a.grab_rails_fitted,
      grab_rails_secure: !!a.grab_rails_secure,
      non_slip_flooring: !!a.non_slip_flooring,
      level_access_shower: !!a.level_access_shower,
      adequate_space_for_mobility: !!a.adequate_space_for_mobility,
      emergency_pull_cord_fitted: !!a.emergency_pull_cord_fitted,
      emergency_pull_cord_functional: !!a.emergency_pull_cord_functional,
      height_appropriate_fittings: !!a.height_appropriate_fittings,
      sensory_adjustments_made: !!a.sensory_adjustments_made,
      individual_needs_assessment_completed: !!a.individual_needs_assessment_completed,
      adaptations_match_care_plan: !!a.adaptations_match_care_plan,
      child_can_use_independently: !!a.child_can_use_independently,
      assessed_by: a.assessed_by ?? "",
      next_review_due: (a.next_review_due ?? today).toString(),
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const result = computeBathroomShowerFacilities({
      today,
      total_children,
      cleanliness_audit_records,
      shower_availability_records,
      hot_water_records,
      privacy_records,
      accessibility_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
