// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME HOBBIES & INTERESTS DEVELOPMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-hobbies-interests-development-intelligence
// Cross-domain composite: hobbyParticipationRecords + interestExplorationRecords +
// talentDevelopmentRecords + creativeExpressionRecords + childLedActivityRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHobbiesInterestsDevelopment,
  type HobbyParticipationInput,
  type InterestExplorationInput,
  type TalentDevelopmentInput,
  type CreativeExpressionInput,
  type ChildLedActivityInput,
} from "@/lib/engines/home-hobbies-interests-development-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawHobbies = (store.hobbyParticipationRecords ?? []) as any[];
    const hobby_participation_records: HobbyParticipationInput[] = rawHobbies.map((h: any) => ({
      id: h.id ?? "",
      child_id: h.child_id ?? "",
      hobby_name: h.hobby_name ?? "",
      hobby_category: h.hobby_category ?? "other",
      start_date: (h.start_date ?? today).toString(),
      end_date: h.end_date ?? null,
      active: h.active !== false,
      sessions_planned: h.sessions_planned ?? 0,
      sessions_attended: h.sessions_attended ?? 0,
      child_enjoyment_rating: h.child_enjoyment_rating ?? 3,
      skill_progression_rating: h.skill_progression_rating ?? 3,
      staff_supported: !!h.staff_supported,
      external_club: !!h.external_club,
      peer_participation: !!h.peer_participation,
      child_chose_hobby: !!h.child_chose_hobby,
      cost_approved: h.cost_approved !== false,
      review_date: h.review_date ?? null,
      review_overdue: !!h.review_overdue,
      notes_recorded: !!h.notes_recorded,
      created_at: (h.created_at ?? today).toString(),
    }));

    const rawExplorations = (store.interestExplorationRecords ?? []) as any[];
    const interest_exploration_records: InterestExplorationInput[] = rawExplorations.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      interest_area: e.interest_area ?? "",
      exploration_type: e.exploration_type ?? "other",
      date: (e.date ?? today).toString(),
      duration_minutes: e.duration_minutes ?? 0,
      child_initiated: !!e.child_initiated,
      child_engagement_rating: e.child_engagement_rating ?? 3,
      led_to_ongoing_hobby: !!e.led_to_ongoing_hobby,
      new_experience: !!e.new_experience,
      cultural_exposure: !!e.cultural_exposure,
      staff_facilitated: !!e.staff_facilitated,
      documented: !!e.documented,
      child_feedback_positive: !!e.child_feedback_positive,
      created_at: (e.created_at ?? today).toString(),
    }));

    const rawTalent = (store.talentDevelopmentRecords ?? []) as any[];
    const talent_development_records: TalentDevelopmentInput[] = rawTalent.map((t: any) => ({
      id: t.id ?? "",
      child_id: t.child_id ?? "",
      talent_area: t.talent_area ?? "",
      programme_type: t.programme_type ?? "other",
      start_date: (t.start_date ?? today).toString(),
      end_date: t.end_date ?? null,
      active: t.active !== false,
      sessions_planned: t.sessions_planned ?? 0,
      sessions_completed: t.sessions_completed ?? 0,
      achievement_level: t.achievement_level ?? "beginner",
      external_recognition: !!t.external_recognition,
      professional_instructor: !!t.professional_instructor,
      progress_documented: !!t.progress_documented,
      child_motivation_rating: t.child_motivation_rating ?? 3,
      cost_funded: t.cost_funded !== false,
      review_date: t.review_date ?? null,
      review_overdue: !!t.review_overdue,
      created_at: (t.created_at ?? today).toString(),
    }));

    const rawCreative = (store.creativeExpressionRecords ?? []) as any[];
    const creative_expression_records: CreativeExpressionInput[] = rawCreative.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      expression_type: c.expression_type ?? "other",
      activity_date: (c.activity_date ?? today).toString(),
      duration_minutes: c.duration_minutes ?? 0,
      facilitated: !!c.facilitated,
      child_initiated: !!c.child_initiated,
      materials_provided: !!c.materials_provided,
      output_produced: !!c.output_produced,
      output_displayed: !!c.output_displayed,
      child_satisfaction_rating: c.child_satisfaction_rating ?? 3,
      therapeutic_value: !!c.therapeutic_value,
      shared_with_others: !!c.shared_with_others,
      documented: !!c.documented,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawChildLed = (store.childLedActivityRecords ?? []) as any[];
    const child_led_activity_records: ChildLedActivityInput[] = rawChildLed.map((a: any) => ({
      id: a.id ?? "",
      child_id: a.child_id ?? "",
      activity_name: a.activity_name ?? "",
      activity_type: a.activity_type ?? "other",
      activity_date: (a.activity_date ?? today).toString(),
      duration_minutes: a.duration_minutes ?? 0,
      staff_supported: !!a.staff_supported,
      other_children_involved: a.other_children_involved ?? 0,
      child_satisfaction_rating: a.child_satisfaction_rating ?? 3,
      resources_provided: !!a.resources_provided,
      outcome_positive: !!a.outcome_positive,
      documented: !!a.documented,
      autonomy_respected: a.autonomy_respected !== false,
      created_at: (a.created_at ?? today).toString(),
    }));

    const result = computeHobbiesInterestsDevelopment({
      today,
      total_children,
      hobby_participation_records,
      interest_exploration_records,
      talent_development_records,
      creative_expression_records,
      child_led_activity_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
