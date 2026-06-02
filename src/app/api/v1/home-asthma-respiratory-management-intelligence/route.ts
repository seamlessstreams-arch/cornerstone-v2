// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME ASTHMA & RESPIRATORY MANAGEMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-asthma-respiratory-management-intelligence
// Cross-domain composite: asthmaActionPlanRecords + inhalerTechniqueRecords +
// triggerManagementRecords + peakFlowRecords + emergencyPreparednessRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeAsthmaRespiratoryManagement,
  type AsthmaActionPlanRecordInput,
  type InhalerTechniqueRecordInput,
  type TriggerManagementRecordInput,
  type PeakFlowRecordInput,
  type EmergencyPreparednessRecordInput,
} from "@/lib/engines/home-asthma-respiratory-management-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawActionPlans = (store.asthmaActionPlanRecords ?? []) as any[];
    const action_plan_records: AsthmaActionPlanRecordInput[] = rawActionPlans.map((a: any) => ({
      id: a.id ?? "",
      child_id: a.child_id ?? "",
      date_created: (a.date_created ?? today).toString(),
      date_reviewed: a.date_reviewed ?? null,
      review_due_date: a.review_due_date ?? null,
      plan_in_place: !!a.plan_in_place,
      plan_current: !!a.plan_current,
      gp_approved: !!a.gp_approved,
      parent_carer_informed: !!a.parent_carer_informed,
      staff_briefed: !!a.staff_briefed,
      school_notified: !!a.school_notified,
      plan_accessible: !!a.plan_accessible,
      severity_level: a.severity_level ?? "mild_intermittent",
      personalised_triggers_documented: !!a.personalised_triggers_documented,
      medication_details_included: !!a.medication_details_included,
      emergency_steps_included: !!a.emergency_steps_included,
      child_involved_in_plan: !!a.child_involved_in_plan,
      plan_shared_with_child: !!a.plan_shared_with_child,
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const rawInhaler = (store.inhalerTechniqueRecords ?? []) as any[];
    const inhaler_technique_records: InhalerTechniqueRecordInput[] = rawInhaler.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? "",
      date: (i.date ?? today).toString(),
      assessor: i.assessor ?? "",
      assessor_role: i.assessor_role ?? "staff",
      inhaler_type: i.inhaler_type ?? "mdi",
      technique_correct: !!i.technique_correct,
      steps_completed_correctly: i.steps_completed_correctly ?? 0,
      steps_total: i.steps_total ?? 0,
      spacer_used_correctly: !!i.spacer_used_correctly,
      child_can_self_administer: !!i.child_can_self_administer,
      child_understands_when_to_use: !!i.child_understands_when_to_use,
      retraining_needed: !!i.retraining_needed,
      retraining_provided: !!i.retraining_provided,
      next_check_due: i.next_check_due ?? null,
      notes: i.notes ?? "",
      created_at: (i.created_at ?? today).toString(),
    }));

    const rawTrigger = (store.triggerManagementRecords ?? []) as any[];
    const trigger_management_records: TriggerManagementRecordInput[] = rawTrigger.map((t: any) => ({
      id: t.id ?? "",
      child_id: t.child_id ?? "",
      date: (t.date ?? today).toString(),
      trigger_type: t.trigger_type ?? "other",
      trigger_identified: !!t.trigger_identified,
      avoidance_plan_in_place: !!t.avoidance_plan_in_place,
      avoidance_plan_effective: !!t.avoidance_plan_effective,
      environmental_controls_implemented: !!t.environmental_controls_implemented,
      child_can_identify_trigger: !!t.child_can_identify_trigger,
      child_can_manage_exposure: !!t.child_can_manage_exposure,
      episode_occurred: !!t.episode_occurred,
      episode_severity: t.episode_severity ?? null,
      action_taken_appropriate: !!t.action_taken_appropriate,
      staff_aware_of_trigger: !!t.staff_aware_of_trigger,
      documented_in_care_plan: !!t.documented_in_care_plan,
      notes: t.notes ?? "",
      created_at: (t.created_at ?? today).toString(),
    }));

    const rawPeakFlow = (store.peakFlowRecords ?? []) as any[];
    const peak_flow_records: PeakFlowRecordInput[] = rawPeakFlow.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      date: (p.date ?? today).toString(),
      time_of_day: p.time_of_day ?? "morning",
      reading_value: p.reading_value ?? 0,
      personal_best: p.personal_best ?? 0,
      zone: p.zone ?? "green",
      technique_correct: !!p.technique_correct,
      child_performed_independently: !!p.child_performed_independently,
      recorded_in_diary: !!p.recorded_in_diary,
      action_required: !!p.action_required,
      action_taken: !!p.action_taken,
      staff_supervised: !!p.staff_supervised,
      trend_direction: p.trend_direction ?? null,
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawEmergency = (store.emergencyPreparednessRecords ?? []) as any[];
    const emergency_preparedness_records: EmergencyPreparednessRecordInput[] = rawEmergency.map((e: any) => ({
      id: e.id ?? "",
      date: (e.date ?? today).toString(),
      assessment_type: e.assessment_type ?? "equipment_check",
      emergency_inhaler_accessible: !!e.emergency_inhaler_accessible,
      spacer_available: !!e.spacer_available,
      nebuliser_available: !!e.nebuliser_available,
      nebuliser_serviced: !!e.nebuliser_serviced,
      emergency_protocol_displayed: !!e.emergency_protocol_displayed,
      staff_trained_in_emergency: !!e.staff_trained_in_emergency,
      staff_count_trained: e.staff_count_trained ?? 0,
      staff_count_total: e.staff_count_total ?? 0,
      ambulance_procedure_known: !!e.ambulance_procedure_known,
      emergency_contacts_current: !!e.emergency_contacts_current,
      oxygen_saturation_monitor_available: !!e.oxygen_saturation_monitor_available,
      child_id: e.child_id ?? null,
      drill_completed_successfully: !!e.drill_completed_successfully,
      response_time_minutes: e.response_time_minutes ?? null,
      lessons_identified: e.lessons_identified ?? "",
      actions_completed: !!e.actions_completed,
      notes: e.notes ?? "",
      created_at: (e.created_at ?? today).toString(),
    }));

    const result = computeAsthmaRespiratoryManagement({
      today,
      total_children,
      action_plan_records,
      inhaler_technique_records,
      trigger_management_records,
      peak_flow_records,
      emergency_preparedness_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
