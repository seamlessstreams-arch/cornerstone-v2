// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME BEDROOM TEMPERATURE & VENTILATION INTELLIGENCE API ROUTE
// GET /api/v1/home-bedroom-temperature-ventilation-intelligence
// Cross-domain composite: temperatureMonitoringRecords + ventilationRecords +
// heatingCheckRecords + windowComplianceRecords + childComfortRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBedroomTemperatureVentilation,
  type TemperatureMonitoringRecordInput,
  type VentilationRecordInput,
  type HeatingCheckRecordInput,
  type WindowComplianceRecordInput,
  type ChildComfortRecordInput,
} from "@/lib/engines/home-bedroom-temperature-ventilation-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawTempMonitoring = (store.temperatureMonitoringRecords ?? []) as any[];
    const temperature_monitoring_records: TemperatureMonitoringRecordInput[] = rawTempMonitoring.map((t: any) => ({
      id: t.id ?? "",
      bedroom_id: t.bedroom_id ?? "",
      child_id: t.child_id ?? null,
      date: (t.date ?? today).toString(),
      time_of_day: t.time_of_day ?? "morning",
      temperature_celsius: t.temperature_celsius ?? 0,
      target_min_celsius: t.target_min_celsius ?? 18,
      target_max_celsius: t.target_max_celsius ?? 21,
      within_range: !!t.within_range,
      thermometer_calibrated: !!t.thermometer_calibrated,
      recorded_by: t.recorded_by ?? "",
      location: t.location ?? "bedroom",
      season: t.season ?? "winter",
      action_required: !!t.action_required,
      action_taken: !!t.action_taken,
      action_details: t.action_details ?? "",
      notes: t.notes ?? "",
      created_at: (t.created_at ?? today).toString(),
    }));

    const rawVentilation = (store.ventilationRecords ?? []) as any[];
    const ventilation_records: VentilationRecordInput[] = rawVentilation.map((v: any) => ({
      id: v.id ?? "",
      bedroom_id: v.bedroom_id ?? "",
      child_id: v.child_id ?? null,
      date: (v.date ?? today).toString(),
      ventilation_type: v.ventilation_type ?? "natural",
      adequate: !!v.adequate,
      air_quality_checked: !!v.air_quality_checked,
      air_quality_acceptable: !!v.air_quality_acceptable,
      condensation_present: !!v.condensation_present,
      mould_present: !!v.mould_present,
      ventilation_system_working: !!v.ventilation_system_working,
      maintenance_required: !!v.maintenance_required,
      maintenance_completed: !!v.maintenance_completed,
      inspected_by: v.inspected_by ?? "",
      notes: v.notes ?? "",
      created_at: (v.created_at ?? today).toString(),
    }));

    const rawHeatingChecks = (store.heatingCheckRecords ?? []) as any[];
    const heating_check_records: HeatingCheckRecordInput[] = rawHeatingChecks.map((h: any) => ({
      id: h.id ?? "",
      bedroom_id: h.bedroom_id ?? "",
      date: (h.date ?? today).toString(),
      heating_type: h.heating_type ?? "central_heating",
      system_operational: !!h.system_operational,
      thermostat_working: !!h.thermostat_working,
      thermostat_accessible_to_child: !!h.thermostat_accessible_to_child,
      radiator_guards_fitted: !!h.radiator_guards_fitted,
      temperature_controllable: !!h.temperature_controllable,
      safety_check_passed: !!h.safety_check_passed,
      last_service_date: h.last_service_date ?? null,
      service_overdue: !!h.service_overdue,
      engineer_certified: !!h.engineer_certified,
      issues_found: !!h.issues_found,
      issues_resolved: !!h.issues_resolved,
      resolution_date: h.resolution_date ?? null,
      checked_by: h.checked_by ?? "",
      notes: h.notes ?? "",
      created_at: (h.created_at ?? today).toString(),
    }));

    const rawWindowCompliance = (store.windowComplianceRecords ?? []) as any[];
    const window_compliance_records: WindowComplianceRecordInput[] = rawWindowCompliance.map((w: any) => ({
      id: w.id ?? "",
      bedroom_id: w.bedroom_id ?? "",
      child_id: w.child_id ?? null,
      date: (w.date ?? today).toString(),
      window_restrictor_fitted: !!w.window_restrictor_fitted,
      restrictor_functional: !!w.restrictor_functional,
      window_lockable: !!w.window_lockable,
      lock_functional: !!w.lock_functional,
      window_opens_adequately: !!w.window_opens_adequately,
      safety_glass_fitted: !!w.safety_glass_fitted,
      trickle_vent_present: !!w.trickle_vent_present,
      trickle_vent_open: !!w.trickle_vent_open,
      window_condition: w.window_condition ?? "good",
      draught_proofing_adequate: !!w.draught_proofing_adequate,
      child_can_open_for_ventilation: !!w.child_can_open_for_ventilation,
      fall_risk_assessed: !!w.fall_risk_assessed,
      fall_risk_mitigated: !!w.fall_risk_mitigated,
      compliance_met: !!w.compliance_met,
      inspected_by: w.inspected_by ?? "",
      notes: w.notes ?? "",
      created_at: (w.created_at ?? today).toString(),
    }));

    const rawChildComfort = (store.childComfortRecords ?? []) as any[];
    const child_comfort_records: ChildComfortRecordInput[] = rawChildComfort.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      bedroom_id: c.bedroom_id ?? "",
      date: (c.date ?? today).toString(),
      comfort_rating: c.comfort_rating ?? 3,
      temperature_preference: c.temperature_preference ?? "comfortable",
      ventilation_preference: c.ventilation_preference ?? "comfortable",
      sleeps_well_temperature: !!c.sleeps_well_temperature,
      bedding_adequate: !!c.bedding_adequate,
      bedding_seasonal: !!c.bedding_seasonal,
      heating_control_understood: !!c.heating_control_understood,
      can_adjust_temperature: !!c.can_adjust_temperature,
      window_usage_confident: !!c.window_usage_confident,
      requested_changes: !!c.requested_changes,
      changes_actioned: !!c.changes_actioned,
      changes_details: c.changes_details ?? "",
      child_voice_captured: !!c.child_voice_captured,
      feedback_method: c.feedback_method ?? "verbal",
      notes: c.notes ?? "",
      created_at: (c.created_at ?? today).toString(),
    }));

    const result = computeBedroomTemperatureVentilation({
      today,
      total_children,
      temperature_monitoring_records,
      ventilation_records,
      heating_check_records,
      window_compliance_records,
      child_comfort_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
