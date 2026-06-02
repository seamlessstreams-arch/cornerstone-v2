// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME MENTAL HEALTH INTELLIGENCE API ROUTE
// GET /api/v1/home-mental-health-intelligence
// Mental health check-ins, therapy sessions, safety plans, referrals.
// CHR 2015 Reg 7/10: "Welfare — promote physical/mental health."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeMentalHealth,
  type MentalHealthCheckInInput,
  type TherapySessionInput,
  type SafetyPlanInput,
  type TherapeuticReferralInput,
} from "@/lib/engines/home-mental-health-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Mental health check-ins ─────────────────────────────────────────
  const check_ins: MentalHealthCheckInInput[] = (
    (store.mentalHealthCheckIns ?? []) as any[]
  ).map((c: any) => ({
    id: (c.id ?? "").toString(),
    child_id: (c.child_id ?? "").toString(),
    date: (c.date ?? "").toString().slice(0, 10),
    mood_rating: typeof c.mood_rating === "number" ? c.mood_rating : 0,
    sleep_quality: (c.sleep_quality ?? "").toString(),
    appetite: (c.appetite ?? "").toString(),
    energy: (c.energy ?? "").toString(),
    flags_concerns: Array.isArray(c.flags_concerns) ? c.flags_concerns : [],
    staff_present: (c.staff_present ?? "").toString(),
    follow_up_action: c.follow_up_action ? (c.follow_up_action).toString() : null,
  }));

  // ── Therapy sessions ────────────────────────────────────────────────
  const therapy_sessions: TherapySessionInput[] = (
    (store.traumaTherapyLogs ?? []) as any[]
  ).map((s: any) => ({
    id: (s.id ?? "").toString(),
    child_id: (s.child_id ?? "").toString(),
    session_date: (s.session_date ?? "").toString().slice(0, 10),
    attended: !!(s.attended),
    pre_session_mood_rating: typeof s.pre_session_mood_rating === "number" ? s.pre_session_mood_rating : 0,
    post_session_mood_rating: typeof s.post_session_mood_rating === "number" ? s.post_session_mood_rating : 0,
    escalation_flags: Array.isArray(s.escalation_flags) ? s.escalation_flags : [],
  }));

  // ── Safety plans ────────────────────────────────────────────────────
  const safety_plans: SafetyPlanInput[] = (
    (store.selfHarmSafetyPlanRecords ?? []) as any[]
  ).map((p: any) => ({
    id: (p.id ?? "").toString(),
    child_id: (p.child_id ?? "").toString(),
    plan_date: (p.plan_date ?? "").toString().slice(0, 10),
    status: (p.status ?? "not_currently_needed").toString(),
    child_signed_off: !!(p.child_signed_off),
    next_review_date: (p.next_review_date ?? "").toString().slice(0, 10),
    co_produced_with: Array.isArray(p.co_produced_with) ? p.co_produced_with : [],
    flags_for_review: Array.isArray(p.flags_for_review) ? p.flags_for_review : [],
  }));

  // ── Therapeutic referrals ───────────────────────────────────────────
  const therapeutic_referrals: TherapeuticReferralInput[] = (
    (store.therapeuticInputRecords ?? []) as any[]
  ).map((r: any) => ({
    id: (r.id ?? "").toString(),
    child_id: (r.child_id ?? "").toString(),
    therapy_type: (r.therapy_type ?? "").toString(),
    status: (r.status ?? "pending").toString(),
    referral_date: (r.referral_date ?? "").toString().slice(0, 10),
    start_date: r.start_date ? (r.start_date).toString().slice(0, 10) : null,
    waiting_weeks: typeof r.waiting_weeks === "number" ? r.waiting_weeks : null,
    next_appointment: r.next_appointment ? (r.next_appointment).toString().slice(0, 10) : null,
    review_date: r.review_date ? (r.review_date).toString().slice(0, 10) : null,
  }));

  // ── Totals ──────────────────────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  const result = computeHomeMentalHealth({
    today,
    check_ins,
    therapy_sessions,
    safety_plans,
    therapeutic_referrals,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
