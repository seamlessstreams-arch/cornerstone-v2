export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStaffRotaAdequateStaffing,
  type ShiftCoverageRecordInput,
  type RatioComplianceRecordInput,
  type OvertimeRecordInput,
  type AgencyUsageRecordInput,
  type RotaPlanningRecordInput,
} from "@/lib/engines/home-staff-rota-adequate-staffing-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const total_staff = ((store.staff as any[]) || []).length;

    const rawShiftCoverage = (store.shiftCoverageRecords ?? []) as any[];
    const shift_coverage_records: ShiftCoverageRecordInput[] = rawShiftCoverage.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      shift_type: r.shift_type ?? "day",
      planned_staff_count: r.planned_staff_count ?? 0,
      actual_staff_count: r.actual_staff_count ?? 0,
      shift_fully_covered: !!(r.shift_fully_covered),
      vacancy_reason: r.vacancy_reason ?? null,
      cover_arranged: !!(r.cover_arranged),
      cover_type: r.cover_type ?? null,
      handover_completed: !!(r.handover_completed),
      handover_quality_rating: r.handover_quality_rating ?? 3,
      lone_working_occurred: !!(r.lone_working_occurred),
      lone_working_risk_assessed: !!(r.lone_working_risk_assessed),
      shift_incidents_count: r.shift_incidents_count ?? 0,
      staff_member_ids: r.staff_member_ids ?? [],
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRatioCompliance = (store.ratioComplianceRecords ?? []) as any[];
    const ratio_compliance_records: RatioComplianceRecordInput[] = rawRatioCompliance.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      time_period: r.time_period ?? "full_day",
      children_present: r.children_present ?? 0,
      staff_on_duty: r.staff_on_duty ?? 0,
      required_ratio: r.required_ratio ?? "1:2",
      actual_ratio: r.actual_ratio ?? "1:2",
      ratio_met: !!(r.ratio_met),
      ratio_breach_duration_minutes: r.ratio_breach_duration_minutes ?? 0,
      breach_reason: r.breach_reason ?? null,
      corrective_action_taken: !!(r.corrective_action_taken),
      corrective_action_detail: r.corrective_action_detail ?? null,
      senior_staff_on_duty: !!(r.senior_staff_on_duty),
      qualified_staff_count: r.qualified_staff_count ?? 0,
      manager_notified: !!(r.manager_notified),
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawOvertime = (store.overtimeRecords ?? []) as any[];
    const overtime_records: OvertimeRecordInput[] = rawOvertime.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      staff_name: r.staff_name ?? "",
      date: (r.date ?? today).toString(),
      overtime_hours: r.overtime_hours ?? 0,
      overtime_reason: r.overtime_reason ?? "other",
      overtime_approved: !!(r.overtime_approved),
      approved_by: r.approved_by ?? null,
      consecutive_days_worked: r.consecutive_days_worked ?? 0,
      rest_period_compliant: !!(r.rest_period_compliant),
      fatigue_risk_acknowledged: !!(r.fatigue_risk_acknowledged),
      working_time_directive_compliant: !!(r.working_time_directive_compliant),
      total_weekly_hours: r.total_weekly_hours ?? 0,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAgencyUsage = (store.agencyUsageRecords ?? []) as any[];
    const agency_usage_records: AgencyUsageRecordInput[] = rawAgencyUsage.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      agency_name: r.agency_name ?? "",
      agency_staff_name: r.agency_staff_name ?? "",
      shift_type: r.shift_type ?? "day",
      hours_worked: r.hours_worked ?? 0,
      usage_reason: r.usage_reason ?? "other",
      agency_staff_known_to_home: !!(r.agency_staff_known_to_home),
      agency_staff_inducted: !!(r.agency_staff_inducted),
      dbs_verified: !!(r.dbs_verified),
      children_briefed: !!(r.children_briefed),
      feedback_collected: !!(r.feedback_collected),
      feedback_rating: r.feedback_rating ?? null,
      cost: r.cost ?? 0,
      repeat_booking: !!(r.repeat_booking),
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRotaPlanning = (store.rotaPlanningRecords ?? []) as any[];
    const rota_planning_records: RotaPlanningRecordInput[] = rawRotaPlanning.map((r: any) => ({
      id: r.id ?? "",
      week_commencing: (r.week_commencing ?? today).toString(),
      rota_published_date: (r.rota_published_date ?? today).toString(),
      days_advance_published: r.days_advance_published ?? 0,
      all_shifts_filled: !!(r.all_shifts_filled),
      unfilled_shifts_count: r.unfilled_shifts_count ?? 0,
      skill_mix_adequate: !!(r.skill_mix_adequate),
      senior_cover_every_shift: !!(r.senior_cover_every_shift),
      staff_preferences_considered: !!(r.staff_preferences_considered),
      fairness_score: r.fairness_score ?? 3,
      contingency_plan_in_place: !!(r.contingency_plan_in_place),
      rota_approved_by_manager: !!(r.rota_approved_by_manager),
      staff_consulted: !!(r.staff_consulted),
      changes_after_publication: r.changes_after_publication ?? 0,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeStaffRotaAdequateStaffing({
      today,
      total_staff,
      shift_coverage_records,
      ratio_compliance_records,
      overtime_records,
      agency_usage_records,
      rota_planning_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
