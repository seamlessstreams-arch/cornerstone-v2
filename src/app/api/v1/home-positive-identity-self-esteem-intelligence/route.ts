// ==============================================================================
// CORNERSTONE -- HOME POSITIVE IDENTITY & SELF-ESTEEM INTELLIGENCE API ROUTE
// GET /api/v1/home-positive-identity-self-esteem-intelligence
// Cross-domain composite: identityWorkRecords + lifeStoryRecords +
// selfEsteemProgrammeRecords + achievementRecords + positiveImageRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePositiveIdentitySelfEsteem,
  type IdentityWorkRecordInput,
  type LifeStoryRecordInput,
  type SelfEsteemProgrammeRecordInput,
  type AchievementRecordInput,
  type PositiveImageRecordInput,
} from "@/lib/engines/home-positive-identity-self-esteem-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawIdentityWork = (store.identityWorkRecords ?? []) as any[];
    const identity_work_records: IdentityWorkRecordInput[] = rawIdentityWork.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      work_type: r.work_type ?? "other",
      date: (r.date ?? today).toString(),
      completed: !!r.completed,
      staff_facilitated: !!r.staff_facilitated,
      child_engaged: !!r.child_engaged,
      child_led: !!r.child_led,
      therapeutic_support: !!r.therapeutic_support,
      outcomes_documented: !!r.outcomes_documented,
      child_satisfaction: r.child_satisfaction ?? 3,
      follow_up_planned: !!r.follow_up_planned,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawLifeStory = (store.lifeStoryRecords ?? []) as any[];
    const life_story_records: LifeStoryRecordInput[] = rawLifeStory.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      has_life_story_book: !!r.has_life_story_book,
      life_story_work_active: !!r.life_story_work_active,
      last_session_date: r.last_session_date ?? null,
      sessions_planned: r.sessions_planned ?? 0,
      sessions_completed: r.sessions_completed ?? 0,
      child_engaged: !!r.child_engaged,
      child_led: !!r.child_led,
      staff_trained: !!r.staff_trained,
      therapeutic_input: !!r.therapeutic_input,
      age_appropriate: !!r.age_appropriate,
      materials_provided: !!r.materials_provided,
      child_satisfaction: r.child_satisfaction ?? 3,
      social_worker_involved: !!r.social_worker_involved,
      review_date: r.review_date ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSelfEsteem = (store.selfEsteemProgrammeRecords ?? []) as any[];
    const self_esteem_programme_records: SelfEsteemProgrammeRecordInput[] = rawSelfEsteem.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      programme_name: r.programme_name ?? "",
      programme_type: r.programme_type ?? "other",
      date: (r.date ?? today).toString(),
      sessions_planned: r.sessions_planned ?? 0,
      sessions_attended: r.sessions_attended ?? 0,
      child_engaged: !!r.child_engaged,
      progress_documented: !!r.progress_documented,
      measurable_outcomes: !!r.measurable_outcomes,
      child_satisfaction: r.child_satisfaction ?? 3,
      staff_trained: !!r.staff_trained,
      evidence_based: !!r.evidence_based,
      review_date: r.review_date ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAchievement = (store.achievementRecords ?? []) as any[];
    const achievement_records: AchievementRecordInput[] = rawAchievement.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      achievement_type: r.achievement_type ?? "other",
      date: (r.date ?? today).toString(),
      achievement_description: r.achievement_description ?? "",
      celebrated: !!r.celebrated,
      celebration_method: r.celebration_method ?? "",
      displayed: !!r.displayed,
      shared_with_family: !!r.shared_with_family,
      shared_with_social_worker: !!r.shared_with_social_worker,
      child_proud: !!r.child_proud,
      peers_acknowledged: !!r.peers_acknowledged,
      recorded_in_care_plan: !!r.recorded_in_care_plan,
      staff_initiated: !!r.staff_initiated,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPositiveImage = (store.positiveImageRecords ?? []) as any[];
    const positive_image_records: PositiveImageRecordInput[] = rawPositiveImage.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      activity_type: r.activity_type ?? "other",
      date: (r.date ?? today).toString(),
      completed: !!r.completed,
      child_engaged: !!r.child_engaged,
      child_led: !!r.child_led,
      measurable_improvement: !!r.measurable_improvement,
      child_satisfaction: r.child_satisfaction ?? 3,
      staff_facilitated: !!r.staff_facilitated,
      follow_up_planned: !!r.follow_up_planned,
      outcomes_documented: !!r.outcomes_documented,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computePositiveIdentitySelfEsteem({
      today,
      total_children,
      identity_work_records,
      life_story_records,
      self_esteem_programme_records,
      achievement_records,
      positive_image_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
