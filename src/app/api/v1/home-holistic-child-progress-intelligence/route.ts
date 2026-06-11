// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME HOLISTIC CHILD PROGRESS COMPOSITE INTELLIGENCE API ROUTE
// GET /api/v1/home-holistic-child-progress-intelligence
// Cross-domain composite: outcomeReviews + educationRecords + keyWorkingSessions
// + independenceSkillsRecords for holistic child progress assessment.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHolisticChildProgress,
  type OutcomeReviewInput,
  type EducationRecordInput,
  type KeyWorkSessionInput,
  type IndependenceRecordBasicInput,
} from "@/lib/engines/home-holistic-child-progress-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.length;

    // Outcome reviews
    const rawOutcomes = (store.outcomeReviews ?? []) as any[];
    const outcome_reviews: OutcomeReviewInput[] = rawOutcomes.map((o: any) => ({
      id: o.id ?? "",
      child_id: o.child_id ?? "",
      review_date: (o.review_date ?? o.date ?? today).toString().slice(0, 10),
      domain: o.domain ?? o.category ?? "general",
      score: typeof o.score === "number" ? o.score : (typeof o.rating === "number" ? o.rating : 0),
      previous_score: typeof o.previous_score === "number" ? o.previous_score : null,
      has_evidence: typeof o.evidence === "string" && o.evidence.trim().length > 0 || !!o.has_evidence,
      has_child_voice: typeof o.child_voice === "string" && o.child_voice.trim().length > 0 || !!o.has_child_voice,
      reviewer: o.reviewer ?? o.reviewed_by ?? "",
    }));

    // Education records
    const rawEducation = (store.educationRecords ?? []) as any[];
    const education_records: EducationRecordInput[] = rawEducation.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      date: (e.date ?? e.term_date ?? today).toString().slice(0, 10),
      attendance_rate: typeof e.attendance_rate === "number" ? e.attendance_rate : (typeof e.attendance === "number" ? e.attendance : 0),
      has_pep: !!e.has_pep || !!e.pep_in_place,
      is_engaged: e.is_engaged !== false && e.engagement !== "disengaged",
      has_exclusions: !!e.has_exclusions || (typeof e.exclusions === "number" && e.exclusions > 0),
      achievement_count: typeof e.achievement_count === "number" ? e.achievement_count : (Array.isArray(e.achievements) ? e.achievements.length : 0),
    }));

    // Key working sessions
    const rawKeyWork = (store.keyWorkingSessions ?? []) as any[];
    const key_work_sessions: KeyWorkSessionInput[] = rawKeyWork.map((k: any) => ({
      id: k.id ?? "",
      child_id: k.child_id ?? "",
      date: (k.date ?? k.session_date ?? today).toString().slice(0, 10),
      completed: k.completed !== false && k.status !== "cancelled",
      has_child_voice: typeof k.child_voice === "string" && k.child_voice.trim().length > 0 || !!k.has_child_voice,
      has_goals: Array.isArray(k.goals) ? k.goals.length > 0 : (k.goals_count ?? 0) > 0,
      goals_progressed: Array.isArray(k.goals) ? k.goals.filter((g: any) => g.progressed || g.status === "progressed").length : (k.goals_progressed ?? 0),
      goals_total: Array.isArray(k.goals) ? k.goals.length : (k.goals_total ?? k.goals_count ?? 0),
      duration_minutes: typeof k.duration_minutes === "number" ? k.duration_minutes : (typeof k.duration === "number" ? k.duration : 0),
    }));

    // Independence records (basic)
    const rawIndependence = (store.independenceSkillsRecords ?? []) as any[];
    const independence_records: IndependenceRecordBasicInput[] = rawIndependence.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      review_date: (r.review_date ?? today).toString().slice(0, 10),
      overall_readiness: typeof r.overall_readiness === "number" ? r.overall_readiness : 0,
      skills_count: Array.isArray(r.skills) ? r.skills.length : 0,
      skills_progressing: Array.isArray(r.skills) ? r.skills.filter((s: any) => ["developing", "competent", "independent"].includes(s.proficiency)).length : 0,
      has_child_view: typeof r.child_view === "string" && r.child_view.trim().length > 0,
    }));

    const result = computeHolisticChildProgress({ today, total_children, outcome_reviews, education_records, key_work_sessions, independence_records });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
