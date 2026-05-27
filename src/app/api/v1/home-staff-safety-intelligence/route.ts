// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME STAFF SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-staff-safety-intelligence
// Lone working, debriefs, grievances, risk assessments.
// HSW Act 1974, CHR 2015 Reg 33/34: "Employment of staff and fitness requirements."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeStaffSafety,
  type LoneWorkingInput,
  type LWRAInput,
  type DebriefInput,
  type GrievanceInput,
} from "@/lib/engines/home-staff-safety-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Lone Working Records ─────────────────────────────────────────────
  const loneWorkingRecords: LoneWorkingInput[] = (
    (store.loneWorkingRecords ?? []) as any[]
  ).map((r: any) => ({
    id: (r.id ?? "").toString(),
    staff_id: (r.staff_id ?? "").toString(),
    scenario: (r.scenario ?? "").toString(),
    risk_level: (r.risk_level ?? "medium").toString() as "low" | "medium" | "high",
    status: (r.status ?? "current").toString() as "current" | "due_review" | "expired",
    assessment_date: (r.assessment_date ?? "").toString().slice(0, 10),
    review_date: (r.review_date ?? "").toString().slice(0, 10),
    assessed_by: (r.assessed_by ?? "").toString(),
    hazards: Array.isArray(r.hazards) ? r.hazards : [],
    control_measures: Array.isArray(r.control_measures) ? r.control_measures : [],
    check_in_protocol: (r.check_in_protocol ?? "").toString(),
    personal_alarm_issued: !!(r.personal_alarm_issued),
    emergency_procedure: (r.emergency_procedure ?? "").toString(),
    notes: (r.notes ?? "").toString(),
  }));

  // ── Lone Working Risk Assessments ────────────────────────────────────
  const riskAssessments: LWRAInput[] = (
    (store.loneWorkingRiskAssessments ?? []) as any[]
  ).map((r: any) => ({
    id: (r.id ?? "").toString(),
    staff_member: (r.staff_member ?? "").toString(),
    role: (r.role ?? "").toString(),
    scenarios: Array.isArray(r.scenarios)
      ? r.scenarios.map((s: any) => ({
          scenario: (s.scenario ?? "").toString(),
          risk: (s.risk ?? "medium").toString(),
          controls: Array.isArray(s.controls) ? s.controls : [],
        }))
      : [],
    overall_risk_level: (r.overall_risk_level ?? "medium").toString() as "low" | "medium" | "high",
    approved_to_work_alone: !!(r.approved_to_work_alone),
    reviewed_date: (r.reviewed_date ?? "").toString().slice(0, 10),
    next_review_date: (r.next_review_date ?? "").toString().slice(0, 10),
    training_completed: Array.isArray(r.training_completed)
      ? r.training_completed.map((t: any) => ({
          course: (t.course ?? "").toString(),
          date: (t.date ?? "").toString(),
          provider: (t.provider ?? "").toString(),
        }))
      : [],
    emergency_protocols: Array.isArray(r.emergency_protocols) ? r.emergency_protocols : [],
  }));

  // ── Staff Debrief Records ────────────────────────────────────────────
  const debriefs: DebriefInput[] = (
    (store.staffDebriefRecords ?? []) as any[]
  ).map((d: any) => ({
    id: (d.id ?? "").toString(),
    date: (d.date ?? "").toString().slice(0, 10),
    type: (d.type ?? "post_incident").toString() as DebriefInput["type"],
    trigger_event: (d.trigger_event ?? "").toString(),
    trigger_date: (d.trigger_date ?? "").toString().slice(0, 10),
    staff_involved: Array.isArray(d.staff_involved) ? d.staff_involved : [],
    facilitated_by: (d.facilitated_by ?? "").toString(),
    status: (d.status ?? "scheduled").toString() as DebriefInput["status"],
    emotional_impact: (d.emotional_impact ?? "moderate").toString() as DebriefInput["emotional_impact"],
    key_themes: Array.isArray(d.key_themes) ? d.key_themes : [],
    support_offered: Array.isArray(d.support_offered) ? d.support_offered : [],
    follow_up_needed: !!(d.follow_up_needed),
    follow_up_details: d.follow_up_details ? d.follow_up_details.toString() : null,
    learning_points: Array.isArray(d.learning_points) ? d.learning_points : [],
  }));

  // ── Staff Grievance Records ──────────────────────────────────────────
  const grievances: GrievanceInput[] = (
    (store.staffGrievanceRecords ?? []) as any[]
  ).map((g: any) => ({
    id: (g.id ?? "").toString(),
    raised_by: (g.raised_by ?? "").toString(),
    raised_date: (g.raised_date ?? "").toString().slice(0, 10),
    category: (g.category ?? "").toString(),
    severity: (g.severity ?? "medium").toString() as GrievanceInput["severity"],
    status: (g.status ?? "informal_raised").toString() as GrievanceInput["status"],
    outcome: (g.outcome ?? "").toString(),
    support_offered: Array.isArray(g.support_offered) ? g.support_offered : [],
  }));

  // ── Total staff ───────────────────────────────────────────────────────
  const totalStaff = (store.staff ?? []).filter(
    (s: any) => s.status === "active" || s.employment_status === "active",
  ).length;

  const result = computeHomeStaffSafety({
    today,
    lone_working_records: loneWorkingRecords,
    risk_assessments: riskAssessments,
    debriefs,
    grievances,
    total_staff: totalStaff,
  });

  return NextResponse.json({ data: result });
}
