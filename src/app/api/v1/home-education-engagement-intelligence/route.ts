// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME EDUCATION ENGAGEMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-education-engagement-intelligence
// Attendance, PEP compliance, EHCP reviews, school engagement, tutoring, homework.
// CHR 2015 Reg 8.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeEducationEngagement,
  type EduAttendanceInput,
  type PepInput,
  type EhcpInput,
  type SchoolEngagementInput,
  type TutoringInput,
  type HomeworkInput,
} from "@/lib/engines/home-education-engagement-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ────────────────────────────────────────────────────────
  const childIds = new Set<string>();
  for (const c of (store.children ?? []) as any[]) {
    if (c.id) childIds.add(c.id.toString());
  }
  const total_children = childIds.size;

  // ── Edu Attendance Records ─────────────────────────────────────────
  const attendance_records: EduAttendanceInput[] = (
    (store.eduAttendanceRecords ?? []) as any[]
  ).map((r: any) => ({
    id: (r.id ?? "").toString(),
    child_id: (r.child_id ?? "").toString(),
    date: (r.date ?? "").toString().slice(0, 10),
    attendance_code: (r.attendance_code ?? "/").toString(),
    session: (r.session ?? "am").toString(),
    authorised_absence: !!(r.authorised_absence),
  }));

  // ── PEP Records ────────────────────────────────────────────────────
  const pep_records: PepInput[] = (
    (store.pepRecords ?? []) as any[]
  ).map((p: any) => ({
    id: (p.id ?? "").toString(),
    child_id: (p.child_id ?? "").toString(),
    pep_date: (p.pep_date ?? "").toString().slice(0, 10),
    next_review_date: (p.next_review_date ?? "").toString().slice(0, 10),
    status: (p.status ?? "draft").toString(),
    attendance: typeof p.attendance === "number" ? p.attendance : 0,
    exclusions: typeof p.exclusions === "number" ? p.exclusions : 0,
    exclusion_days: typeof p.exclusion_days === "number" ? p.exclusion_days : 0,
    child_views_provided: !!(p.child_views),
    carer_views_provided: !!(p.carer_views),
    targets_count: Array.isArray(p.targets) ? p.targets.length : 0,
    targets_met_count: Array.isArray(p.targets) ? (p.targets as any[]).filter((t: any) => t.attainment === "achieved" || t.progress === "exceeded").length : 0,
    pupil_premium_amount: typeof p.pupil_premium?.annual_allocation === "number" ? p.pupil_premium.annual_allocation : 0,
  }));

  // ── EHCP Records ───────────────────────────────────────────────────
  const ehcp_records: EhcpInput[] = (
    (store.ehcpRecords ?? []) as any[]
  ).map((e: any) => ({
    id: (e.id ?? "").toString(),
    child_id: (e.child_id ?? "").toString(),
    plan_status: (e.plan_status ?? "pre_assessment").toString(),
    next_annual_review_due: (e.next_annual_review_due ?? "").toString().slice(0, 10),
    child_contribution_provided: !!(e.child_contribution),
    outstanding_actions_count: Array.isArray(e.outstanding_actions) ? e.outstanding_actions.length : 0,
    provisions_count: Array.isArray(e.provisions_listed) ? e.provisions_listed.length : 0,
  }));

  // ── School Engagement Events ───────────────────────────────────────
  const school_engagement_events: SchoolEngagementInput[] = (
    (store.schoolEngagementEvents ?? []) as any[]
  ).map((ev: any) => ({
    id: (ev.id ?? "").toString(),
    child_id: (ev.child_id ?? "").toString(),
    event_date: (ev.event_date ?? "").toString().slice(0, 10),
    social_worker_attended: !!(ev.social_worker_attended),
    child_achievements_count: Array.isArray(ev.child_achievements_recognised) ? ev.child_achievements_recognised.length : 0,
    follow_up_actions_count: Array.isArray(ev.follow_up_actions) ? ev.follow_up_actions.length : 0,
  }));

  // ── Tutoring Records ───────────────────────────────────────────────
  const tutoring_records: TutoringInput[] = (
    (store.tutoringRecords ?? []) as any[]
  ).map((t: any) => ({
    id: (t.id ?? "").toString(),
    child_id: (t.child_id ?? "").toString(),
    ongoing: !!(t.ongoing),
    hours_per_week: typeof t.hours_per_week === "number" ? t.hours_per_week : 0,
    child_motivation: (t.child_motivation ?? "mixed").toString(),
    dbs_current: !!(t.dbs_checked_date) && t.dbs_checked_date !== "",
  }));

  // ── Homework Sessions ──────────────────────────────────────────────
  const homework_sessions: HomeworkInput[] = (
    (store.homeworkSessions ?? []) as any[]
  ).map((h: any) => ({
    id: (h.id ?? "").toString(),
    child_id: (h.child_id ?? "").toString(),
    date: (h.date ?? "").toString().slice(0, 10),
    work_completed: !!(h.work_completed),
    child_initiation: (h.child_initiation ?? "reminded").toString(),
    quality_of_work: (h.quality_of_work ?? "adequate").toString(),
  }));

  const result = computeHomeEducationEngagement({
    today,
    attendance_records,
    pep_records,
    ehcp_records,
    school_engagement_events,
    tutoring_records,
    homework_sessions,
    total_children,
  });

  return NextResponse.json({ data: result });
}
