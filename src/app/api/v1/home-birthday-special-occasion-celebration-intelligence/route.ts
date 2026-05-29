// ==============================================================================
// CORNERSTONE -- HOME BIRTHDAY & SPECIAL OCCASION CELEBRATION INTELLIGENCE API ROUTE
// GET /api/v1/home-birthday-special-occasion-celebration-intelligence
// Cross-domain composite: birthdayPlanRecords + celebrationExecutionRecords +
// giftProvisionRecords + memoryMakingRecords + childSatisfactionRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeBirthdaySpecialOccasionCelebration,
  type BirthdayPlanRecordInput,
  type CelebrationExecutionRecordInput,
  type GiftProvisionRecordInput,
  type MemoryMakingRecordInput,
  type ChildSatisfactionRecordInput,
} from "@/lib/engines/home-birthday-special-occasion-celebration-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawBirthdayPlans = (store.birthdayPlanRecords ?? []) as any[];
    const birthday_plan_records: BirthdayPlanRecordInput[] = rawBirthdayPlans.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      child_name: r.child_name ?? "",
      birthday_date: (r.birthday_date ?? today).toString(),
      plan_created: !!r.plan_created,
      plan_created_date: r.plan_created_date ?? null,
      days_advance_planned: r.days_advance_planned ?? 0,
      child_consulted: !!r.child_consulted,
      child_wishes_documented: !!r.child_wishes_documented,
      child_chose_theme: !!r.child_chose_theme,
      child_chose_guests: !!r.child_chose_guests,
      child_chose_food: !!r.child_chose_food,
      child_chose_activity: !!r.child_chose_activity,
      budget_allocated: !!r.budget_allocated,
      budget_amount: r.budget_amount ?? 0,
      cultural_considerations_documented: !!r.cultural_considerations_documented,
      dietary_needs_considered: !!r.dietary_needs_considered,
      family_contact_arranged: !!r.family_contact_arranged,
      social_worker_notified: !!r.social_worker_notified,
      plan_reviewed_by_manager: !!r.plan_reviewed_by_manager,
      special_requests_noted: Array.isArray(r.special_requests_noted) ? r.special_requests_noted : [],
      special_requests_fulfilled: Array.isArray(r.special_requests_fulfilled) ? r.special_requests_fulfilled : [],
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCelebrationExecution = (store.celebrationExecutionRecords ?? []) as any[];
    const celebration_execution_records: CelebrationExecutionRecordInput[] = rawCelebrationExecution.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      celebration_type: r.celebration_type ?? "other",
      date: (r.date ?? today).toString(),
      celebration_held: !!r.celebration_held,
      held_on_actual_date: !!r.held_on_actual_date,
      venue: r.venue ?? "in_home",
      guests_invited: r.guests_invited ?? 0,
      guests_attended: r.guests_attended ?? 0,
      staff_participated: !!r.staff_participated,
      staff_enthusiasm_rating: r.staff_enthusiasm_rating ?? 3,
      peers_participated: !!r.peers_participated,
      peers_count: r.peers_count ?? 0,
      family_attended: !!r.family_attended,
      family_members_count: r.family_members_count ?? 0,
      decorations_provided: !!r.decorations_provided,
      cake_or_treat_provided: !!r.cake_or_treat_provided,
      personalised_to_child: !!r.personalised_to_child,
      child_led_planning: !!r.child_led_planning,
      celebration_duration_minutes: r.celebration_duration_minutes ?? 0,
      atmosphere_rating: r.atmosphere_rating ?? 3,
      cultural_appropriateness: !!r.cultural_appropriateness,
      inclusive_of_all_children: !!r.inclusive_of_all_children,
      safeguarding_considered: !!r.safeguarding_considered,
      risk_assessment_completed: !!r.risk_assessment_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawGiftProvision = (store.giftProvisionRecords ?? []) as any[];
    const gift_provision_records: GiftProvisionRecordInput[] = rawGiftProvision.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      occasion: r.occasion ?? "birthday",
      date: (r.date ?? today).toString(),
      gift_provided: !!r.gift_provided,
      gift_personalised: !!r.gift_personalised,
      child_preferences_considered: !!r.child_preferences_considered,
      age_appropriate: !!r.age_appropriate,
      budget_adequate: !!r.budget_adequate,
      budget_amount: r.budget_amount ?? 0,
      gift_wrapped: !!r.gift_wrapped,
      presented_thoughtfully: !!r.presented_thoughtfully,
      child_reaction_positive: !!r.child_reaction_positive,
      equitable_with_peers: !!r.equitable_with_peers,
      family_contribution_enabled: !!r.family_contribution_enabled,
      social_worker_contribution_enabled: !!r.social_worker_contribution_enabled,
      receipt_documented: !!r.receipt_documented,
      savings_contribution_made: !!r.savings_contribution_made,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawMemoryMaking = (store.memoryMakingRecords ?? []) as any[];
    const memory_making_records: MemoryMakingRecordInput[] = rawMemoryMaking.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      celebration_id: r.celebration_id ?? "",
      activity_type: r.activity_type ?? "photo",
      date: (r.date ?? today).toString(),
      activity_completed: !!r.activity_completed,
      child_participated: !!r.child_participated,
      child_consented: !!r.child_consented,
      memory_stored_securely: !!r.memory_stored_securely,
      added_to_life_story: !!r.added_to_life_story,
      shared_with_family: !!r.shared_with_family,
      child_has_copy: !!r.child_has_copy,
      quality_rating: r.quality_rating ?? 3,
      staff_facilitated: !!r.staff_facilitated,
      peers_involved: !!r.peers_involved,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildSatisfaction = (store.childCelebrationSatisfactionRecords ?? []) as any[];
    const child_satisfaction_records: ChildSatisfactionRecordInput[] = rawChildSatisfaction.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      celebration_id: r.celebration_id ?? "",
      celebration_type: r.celebration_type ?? "birthday",
      date: (r.date ?? today).toString(),
      overall_satisfaction: r.overall_satisfaction ?? 3,
      felt_special: !!r.felt_special,
      felt_listened_to: !!r.felt_listened_to,
      would_change_anything: !!r.would_change_anything,
      change_suggestions: Array.isArray(r.change_suggestions) ? r.change_suggestions : [],
      favourite_moment: r.favourite_moment ?? "",
      felt_included: !!r.felt_included,
      felt_equal_to_peers: !!r.felt_equal_to_peers,
      celebration_matched_wishes: !!r.celebration_matched_wishes,
      child_voice_captured: !!r.child_voice_captured,
      feedback_acted_upon: !!r.feedback_acted_upon,
      follow_up_completed: !!r.follow_up_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeBirthdaySpecialOccasionCelebration({
      today,
      total_children,
      birthday_plan_records,
      celebration_execution_records,
      gift_provision_records,
      memory_making_records,
      child_satisfaction_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
