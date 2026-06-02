import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStaffLoneWorkingSafety,
  type RiskAssessmentRecordInput,
  type CheckInRecordInput,
  type SafetyProtocolRecordInput,
  type CommunicationDeviceRecordInput,
  type IncidentReportingRecordInput,
} from "@/lib/engines/home-staff-lone-working-safety-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  const total_staff = (store.staff as any[] || []).length;

  // ── Risk assessment records ──────────────────────────────────────────
  const rawRiskAssessments = (store.loneWorkingRiskAssessments as any[] ?? []);
  const risk_assessment_records: RiskAssessmentRecordInput[] = rawRiskAssessments.map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? r.staff_member ?? "",
    assessment_date: r.assessment_date ?? r.reviewed_date ?? "",
    review_date: r.review_date ?? r.next_review_date ?? "",
    risk_level: r.risk_level ?? r.overall_risk_level ?? "low",
    status: r.status ?? "current",
    hazards_identified: (r.hazards ?? r.scenarios ?? []).length,
    control_measures_count: (r.control_measures ?? []).length,
    approved: !!(r.approved ?? r.approved_to_work_alone),
    assessor_id: r.assessor_id ?? r.assessed_by ?? "",
    location: r.location ?? "",
    shift_type: r.shift_type ?? "day",
    emergency_procedure_documented: !!(r.emergency_procedure_documented ?? r.emergency_procedure ?? (r.emergency_protocols ?? []).length > 0),
    personal_alarm_included: !!(r.personal_alarm_included ?? r.personal_alarm_issued),
    notes: r.notes ?? "",
  }));

  // ── Check-in records ─────────────────────────────────────────────────
  const rawCheckIns = (store.loneWorkingCheckIns as any[] ?? []);
  const check_in_records: CheckInRecordInput[] = rawCheckIns.map((c: any) => ({
    id: c.id ?? "",
    staff_id: c.staff_id ?? "",
    shift_date: c.shift_date ?? c.date ?? "",
    shift_type: c.shift_type ?? "day",
    scheduled_check_ins: c.scheduled_check_ins ?? c.scheduled ?? 1,
    completed_check_ins: c.completed_check_ins ?? c.completed ?? 0,
    missed_check_ins: c.missed_check_ins ?? c.missed ?? 0,
    late_check_ins: c.late_check_ins ?? c.late ?? 0,
    response_timely: !!(c.response_timely ?? c.timely),
    escalation_triggered: !!(c.escalation_triggered ?? c.escalated),
    escalation_reason: c.escalation_reason ?? "",
    welfare_confirmed: !!(c.welfare_confirmed ?? c.welfare),
    method: c.method ?? "phone",
  }));

  // ── Safety protocol records ──────────────────────────────────────────
  const rawProtocols = (store.loneWorkingSafetyProtocols as any[] ?? []);
  const safety_protocol_records: SafetyProtocolRecordInput[] = rawProtocols.map((p: any) => ({
    id: p.id ?? "",
    staff_id: p.staff_id ?? "",
    protocol_type: p.protocol_type ?? p.type ?? "lone_working_policy",
    date_acknowledged: p.date_acknowledged ?? p.acknowledged_date ?? "",
    understood: !!(p.understood),
    signed: !!(p.signed),
    training_completed: !!(p.training_completed),
    training_date: p.training_date ?? "",
    refresher_due: p.refresher_due ?? "",
    refresher_completed: !!(p.refresher_completed),
    competency_assessed: !!(p.competency_assessed),
    competency_passed: !!(p.competency_passed),
  }));

  // ── Communication device records ─────────────────────────────────────
  const rawDevices = (store.loneWorkingDevices as any[] ?? []);
  const communication_device_records: CommunicationDeviceRecordInput[] = rawDevices.map((d: any) => ({
    id: d.id ?? "",
    staff_id: d.staff_id ?? "",
    device_type: d.device_type ?? d.type ?? "mobile_phone",
    issued: !!(d.issued ?? true),
    issued_date: d.issued_date ?? "",
    tested: !!(d.tested),
    last_test_date: d.last_test_date ?? "",
    test_passed: !!(d.test_passed),
    battery_checked: !!(d.battery_checked),
    signal_confirmed: !!(d.signal_confirmed),
    returned: !!(d.returned),
    condition: d.condition ?? "good",
  }));

  // ── Incident reporting records ───────────────────────────────────────
  const rawIncidents = (store.loneWorkingIncidents as any[] ?? []);
  const incident_reporting_records: IncidentReportingRecordInput[] = rawIncidents.map((i: any) => ({
    id: i.id ?? "",
    staff_id: i.staff_id ?? "",
    incident_date: i.incident_date ?? i.date ?? "",
    reported_date: i.reported_date ?? "",
    incident_type: i.incident_type ?? i.type ?? "other",
    severity: i.severity ?? "low",
    reported_timely: !!(i.reported_timely ?? i.timely),
    investigation_completed: !!(i.investigation_completed),
    follow_up_actions: i.follow_up_actions ?? (i.actions ?? []).length ?? 0,
    follow_up_completed: i.follow_up_completed ?? (i.actions ?? []).filter((a: any) => a.completed).length ?? 0,
    lessons_learned_documented: !!(i.lessons_learned_documented ?? i.lessons_documented),
    manager_notified: !!(i.manager_notified),
    safeguarding_referral_made: !!(i.safeguarding_referral_made),
    risk_assessment_updated: !!(i.risk_assessment_updated),
    debrief_offered: !!(i.debrief_offered),
    debrief_completed: !!(i.debrief_completed),
  }));

  const result = computeStaffLoneWorkingSafety({
    today,
    total_staff,
    risk_assessment_records,
    check_in_records,
    safety_protocol_records,
    communication_device_records,
    incident_reporting_records,
  });

  return NextResponse.json({ data: result });
}
