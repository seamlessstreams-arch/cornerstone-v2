// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME WATER SAFETY & HYDRATION INTELLIGENCE API ROUTE
// GET /api/v1/home-water-safety-hydration-intelligence
// Cross-domain composite: waterTemperatureRecords + legionellaAssessmentRecords +
// hydrationMonitoringRecords + swimmingCompetencyRecords + waterActivitySafetyRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeWaterSafetyHydration,
  type WaterTemperatureRecordInput,
  type LegionellaAssessmentRecordInput,
  type HydrationMonitoringRecordInput,
  type SwimmingCompetencyRecordInput,
  type WaterActivitySafetyRecordInput,
} from "@/lib/engines/home-water-safety-hydration-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawTemperature = (store.waterTemperatureRecords ?? []) as any[];
    const water_temperature_records: WaterTemperatureRecordInput[] = rawTemperature.map((t: any) => ({
      id: t.id ?? "",
      date: (t.date ?? today).toString(),
      location: t.location ?? "",
      outlet_type: t.outlet_type ?? "hot_tap",
      temperature_celsius: t.temperature_celsius ?? 0,
      within_safe_range: !!t.within_safe_range,
      thermostatic_mixing_valve_fitted: !!t.thermostatic_mixing_valve_fitted,
      tmv_tested: !!t.tmv_tested,
      scald_risk_identified: !!t.scald_risk_identified,
      action_taken_if_unsafe: !!t.action_taken_if_unsafe,
      checked_by: t.checked_by ?? "",
      notes: t.notes ?? "",
      created_at: (t.created_at ?? today).toString(),
    }));

    const rawLegionella = (store.legionellaAssessmentRecords ?? []) as any[];
    const legionella_assessment_records: LegionellaAssessmentRecordInput[] = rawLegionella.map((l: any) => ({
      id: l.id ?? "",
      date: (l.date ?? today).toString(),
      assessment_type: l.assessment_type ?? "monthly_flush",
      compliant: !!l.compliant,
      assessor: l.assessor ?? "",
      dead_legs_identified: l.dead_legs_identified ?? 0,
      dead_legs_remediated: l.dead_legs_remediated ?? 0,
      water_storage_temperature_compliant: !!l.water_storage_temperature_compliant,
      distribution_temperature_compliant: !!l.distribution_temperature_compliant,
      flushing_regime_followed: !!l.flushing_regime_followed,
      written_scheme_in_place: !!l.written_scheme_in_place,
      next_assessment_due: (l.next_assessment_due ?? today).toString(),
      overdue: !!l.overdue,
      findings: l.findings ?? "",
      actions_required: l.actions_required ?? 0,
      actions_completed: l.actions_completed ?? 0,
      notes: l.notes ?? "",
      created_at: (l.created_at ?? today).toString(),
    }));

    const rawHydration = (store.hydrationMonitoringRecords ?? []) as any[];
    const hydration_monitoring_records: HydrationMonitoringRecordInput[] = rawHydration.map((h: any) => ({
      id: h.id ?? "",
      child_id: h.child_id ?? "",
      date: (h.date ?? today).toString(),
      fluid_intake_ml: h.fluid_intake_ml ?? 0,
      target_intake_ml: h.target_intake_ml ?? 0,
      met_target: !!h.met_target,
      hydration_concern_raised: !!h.hydration_concern_raised,
      concern_type: h.concern_type ?? "none",
      intervention_provided: !!h.intervention_provided,
      intervention_type: h.intervention_type ?? "",
      child_encouraged: !!h.child_encouraged,
      accessible_water_available: !!h.accessible_water_available,
      staff_prompted: !!h.staff_prompted,
      notes: h.notes ?? "",
      created_at: (h.created_at ?? today).toString(),
    }));

    const rawSwimming = (store.swimmingCompetencyRecords ?? []) as any[];
    const swimming_competency_records: SwimmingCompetencyRecordInput[] = rawSwimming.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      date: (s.date ?? today).toString(),
      competency_level: s.competency_level ?? "non_swimmer",
      assessment_conducted: !!s.assessment_conducted,
      assessor_qualified: !!s.assessor_qualified,
      water_confidence_rating: s.water_confidence_rating ?? 1,
      can_swim_25m: !!s.can_swim_25m,
      water_safety_knowledge_assessed: !!s.water_safety_knowledge_assessed,
      water_safety_knowledge_passed: !!s.water_safety_knowledge_passed,
      lessons_attended: s.lessons_attended ?? 0,
      lessons_offered: s.lessons_offered ?? 0,
      parental_consent_obtained: !!s.parental_consent_obtained,
      risk_assessment_completed: !!s.risk_assessment_completed,
      notes: s.notes ?? "",
      created_at: (s.created_at ?? today).toString(),
    }));

    const rawWaterActivity = (store.waterActivitySafetyRecords ?? []) as any[];
    const water_activity_safety_records: WaterActivitySafetyRecordInput[] = rawWaterActivity.map((a: any) => ({
      id: a.id ?? "",
      date: (a.date ?? today).toString(),
      activity_type: a.activity_type ?? "swimming_pool",
      risk_assessment_completed: !!a.risk_assessment_completed,
      risk_assessment_approved: !!a.risk_assessment_approved,
      qualified_supervision: !!a.qualified_supervision,
      supervision_ratio_met: !!a.supervision_ratio_met,
      child_competencies_checked: !!a.child_competencies_checked,
      safety_equipment_available: !!a.safety_equipment_available,
      safety_briefing_given: !!a.safety_briefing_given,
      emergency_plan_in_place: !!a.emergency_plan_in_place,
      incident_occurred: !!a.incident_occurred,
      incident_type: a.incident_type ?? "",
      children_participated: a.children_participated ?? 0,
      children_total: a.children_total ?? 0,
      consent_obtained_all: !!a.consent_obtained_all,
      first_aider_present: !!a.first_aider_present,
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const result = computeWaterSafetyHydration({
      today,
      total_children,
      water_temperature_records,
      legionella_assessment_records,
      hydration_monitoring_records,
      swimming_competency_records,
      water_activity_safety_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
