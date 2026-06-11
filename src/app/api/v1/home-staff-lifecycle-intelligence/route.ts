// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME STAFF LIFECYCLE INTELLIGENCE API ROUTE
// GET /api/v1/home-staff-lifecycle-intelligence
// Staff inductions, sickness, exit interviews, recognition — full lifecycle.
// CHR 2015 Reg 32/33. SCCIF: "How well does the home manage staff lifecycle?"
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeStaffLifecycle,
  type StaffInductionInput,
  type StaffSicknessInput,
  type StaffExitInput,
  type StaffRecognitionInput,
} from "@/lib/engines/home-staff-lifecycle-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Induction Records ─────────────────────────────────────────────────
  const inductionRecords: StaffInductionInput[] = (
    (store.staffInductionRecords ?? []) as any[]
  ).map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? "",
    start_date: (r.start_date ?? "").toString().slice(0, 10),
    overall_status: (r.overall_status ?? "not_started").toString(),
    tasks_total: Array.isArray(r.tasks) ? r.tasks.length : 0,
    tasks_completed: Array.isArray(r.tasks)
      ? r.tasks.filter((t: any) => t.status === "completed").length
      : 0,
  }));

  // ── Sickness Records ──────────────────────────────────────────────────
  const sicknessRecords: StaffSicknessInput[] = (
    (store.staffSicknessRecords ?? []) as any[]
  ).map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? "",
    date_started: (r.date_started ?? "").toString().slice(0, 10),
    date_ended: r.date_ended ? r.date_ended.toString().slice(0, 10) : null,
    total_days: typeof r.total_days === "number" ? r.total_days : 0,
    rtw_status: (r.rtw_status ?? "not_required").toString(),
    occupational_health_referral: !!(r.occupational_health_referral),
    trigger_points_count: Array.isArray(r.trigger_points) ? r.trigger_points.length : 0,
  }));

  // ── Exit Interview Records ────────────────────────────────────────────
  const exitRecords: StaffExitInput[] = (
    (store.staffExitInterviewRecords ?? []) as any[]
  ).map((r: any) => ({
    id: r.id ?? "",
    interview_date: (r.interview_date ?? "").toString().slice(0, 10),
    status: (r.status ?? "not_offered").toString(),
    overall_rating: typeof r.overall_rating === "number" ? r.overall_rating : null,
    would_recommend: typeof r.would_recommend === "boolean" ? r.would_recommend : null,
    improvements_count: Array.isArray(r.improvements) ? r.improvements.length : 0,
  }));

  // ── Recognition Records ───────────────────────────────────────────────
  const recognitionRecords: StaffRecognitionInput[] = (
    (store.staffRecognitionRecords ?? []) as any[]
  ).map((r: any) => ({
    id: r.id ?? "",
    date: (r.date ?? "").toString().slice(0, 10),
    child_contributed_nomination: !!(r.child_contributed_nomination),
    public_celebration: !!(r.public_celebration),
  }));

  // ── Total staff ───────────────────────────────────────────────────────
  const totalStaff = store.staff?.length ?? 0;

  const result = computeHomeStaffLifecycle({
    today,
    induction_records: inductionRecords,
    sickness_records: sicknessRecords,
    exit_interview_records: exitRecords,
    recognition_records: recognitionRecords,
    total_staff: totalStaff,
  });

  return NextResponse.json({ data: result });
}
