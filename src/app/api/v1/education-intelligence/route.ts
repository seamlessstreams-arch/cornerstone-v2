// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EDUCATION INTELLIGENCE API ROUTE
// GET /api/v1/education-intelligence
// Returns education status, attendance, activities, PEP compliance.
// Reg 8 — Promotion of educational achievement.
// Reg 10 — Enjoyment and achievement.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeEducationIntelligence,
  type ChildInput,
  type EducationRecordInput,
  type ActivityInput,
  type EduAttendanceInput,
} from "@/lib/engines/education-intelligence-engine";

export async function GET() {
  const store = getStore();

  // ── Map children ─────────────────────────────────────────────────────────
  const children: ChildInput[] = store.youngPeople.map((yp) => ({
    id: yp.id,
    name: yp.preferred_name ?? yp.first_name,
  }));

  // ── Map education records ────────────────────────────────────────────────
  const educationRecords: EducationRecordInput[] = store.educationRecords.map((r) => ({
    id: r.id,
    child_id: r.child_id,
    record_type: r.record_type,
    date: r.date,
    school: r.school ?? null,
    attendance_status: r.attendance_status ?? null,
    linked_pep: r.linked_pep ?? false,
    status: r.status,
  }));

  // ── Map activities ───────────────────────────────────────────────────────
  const activities: ActivityInput[] = store.activities.map((a) => ({
    id: a.id,
    child_id: a.child_id,
    date: a.date,
    category: a.category,
    engagement: a.engagement,
    duration_minutes: a.duration_minutes,
    is_new_experience: a.is_new_experience,
  }));

  // ── Map detailed attendance records ──────────────────────────────────────
  const eduAttendance: EduAttendanceInput[] = store.eduAttendanceRecords.map((ea) => ({
    id: ea.id,
    child_id: ea.child_id,
    date: ea.date,
    attendance_code: ea.attendance_code,
    session: ea.session,
  }));

  // ── Run engine ───────────────────────────────────────────────────────────
  const result = computeEducationIntelligence({
    children,
    educationRecords,
    activities,
    eduAttendance,
  });

  return NextResponse.json({ data: result });
}
