// ==============================================================================
// CARA -- HOME PET & ANIMAL THERAPY INTELLIGENCE API ROUTE
// GET /api/v1/home-pet-animal-therapy-intelligence
// Cross-domain composite: therapySessionRecords + petCareRecords +
// animalInteractionRecords + animalWelfareRecords + childEngagementRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePetAnimalTherapy,
  type TherapySessionInput,
  type PetCareInput,
  type AnimalInteractionInput,
  type AnimalWelfareInput,
  type ChildEngagementInput,
} from "@/lib/engines/home-pet-animal-therapy-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawSessions = (store.therapySessionRecords ?? []) as any[];
    const therapy_session_records: TherapySessionInput[] = rawSessions.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      session_date: (s.session_date ?? today).toString(),
      session_type: s.session_type ?? "individual",
      animal_type: s.animal_type ?? "",
      animal_name: s.animal_name ?? "",
      therapist_name: s.therapist_name ?? "",
      duration_minutes: s.duration_minutes ?? 0,
      goals_set: !!s.goals_set,
      goals_met: !!s.goals_met,
      child_engagement_rating: s.child_engagement_rating ?? 3,
      outcome_rating: s.outcome_rating ?? 3,
      child_feedback_positive: !!s.child_feedback_positive,
      staff_present: !!s.staff_present,
      risk_assessment_completed: !!s.risk_assessment_completed,
      notes_recorded: !!s.notes_recorded,
      follow_up_planned: !!s.follow_up_planned,
      created_at: (s.created_at ?? today).toString(),
    }));

    const rawCare = (store.petCareRecords ?? []) as any[];
    const pet_care_records: PetCareInput[] = rawCare.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      animal_id: c.animal_id ?? "",
      animal_type: c.animal_type ?? "",
      care_date: (c.care_date ?? today).toString(),
      care_type: c.care_type ?? "general",
      responsibility_assigned: !!c.responsibility_assigned,
      responsibility_completed: !!c.responsibility_completed,
      supervised: !!c.supervised,
      child_initiated: !!c.child_initiated,
      child_engagement_rating: c.child_engagement_rating ?? 3,
      skills_demonstrated: Array.isArray(c.skills_demonstrated) ? c.skills_demonstrated : [],
      staff_observer: c.staff_observer ?? "",
      notes_recorded: !!c.notes_recorded,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawInteractions = (store.animalInteractionRecords ?? []) as any[];
    const animal_interaction_records: AnimalInteractionInput[] = rawInteractions.map((i: any) => ({
      id: i.id ?? "",
      child_id: i.child_id ?? "",
      animal_id: i.animal_id ?? "",
      animal_type: i.animal_type ?? "",
      interaction_date: (i.interaction_date ?? today).toString(),
      interaction_type: i.interaction_type ?? "recreational",
      duration_minutes: i.duration_minutes ?? 0,
      setting: i.setting ?? "indoor",
      child_mood_before: i.child_mood_before ?? 3,
      child_mood_after: i.child_mood_after ?? 3,
      positive_outcome: !!i.positive_outcome,
      behavioural_improvement: !!i.behavioural_improvement,
      emotional_regulation_observed: !!i.emotional_regulation_observed,
      risk_assessment_current: !!i.risk_assessment_current,
      staff_present: !!i.staff_present,
      notes_recorded: !!i.notes_recorded,
      created_at: (i.created_at ?? today).toString(),
    }));

    const rawWelfare = (store.animalWelfareRecords ?? []) as any[];
    const animal_welfare_records: AnimalWelfareInput[] = rawWelfare.map((w: any) => ({
      id: w.id ?? "",
      animal_id: w.animal_id ?? "",
      animal_type: w.animal_type ?? "",
      animal_name: w.animal_name ?? "",
      check_date: (w.check_date ?? today).toString(),
      check_type: w.check_type ?? "routine",
      health_status: w.health_status ?? "good",
      welfare_standards_met: !!w.welfare_standards_met,
      environment_suitable: !!w.environment_suitable,
      diet_appropriate: !!w.diet_appropriate,
      exercise_adequate: !!w.exercise_adequate,
      veterinary_up_to_date: !!w.veterinary_up_to_date,
      insurance_current: !!w.insurance_current,
      risk_assessment_current: !!w.risk_assessment_current,
      concerns_identified: !!w.concerns_identified,
      concerns_actioned: !!w.concerns_actioned,
      next_review_date: w.next_review_date ?? null,
      review_overdue: !!w.review_overdue,
      created_at: (w.created_at ?? today).toString(),
    }));

    const rawEngagement = (store.childEngagementRecords ?? []) as any[];
    const child_engagement_records: ChildEngagementInput[] = rawEngagement.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      assessment_date: (e.assessment_date ?? today).toString(),
      engagement_level: e.engagement_level ?? "moderate",
      therapeutic_benefit_observed: !!e.therapeutic_benefit_observed,
      confidence_improved: !!e.confidence_improved,
      empathy_demonstrated: !!e.empathy_demonstrated,
      responsibility_skills_improved: !!e.responsibility_skills_improved,
      social_skills_improved: !!e.social_skills_improved,
      emotional_regulation_improved: !!e.emotional_regulation_improved,
      child_self_reported_benefit: !!e.child_self_reported_benefit,
      staff_reported_benefit: !!e.staff_reported_benefit,
      overall_progress_rating: e.overall_progress_rating ?? 3,
      barriers_identified: Array.isArray(e.barriers_identified) ? e.barriers_identified : [],
      support_plan_in_place: !!e.support_plan_in_place,
      review_date: e.review_date ?? null,
      review_overdue: !!e.review_overdue,
      created_at: (e.created_at ?? today).toString(),
    }));

    const result = computePetAnimalTherapy({
      today,
      total_children,
      therapy_session_records,
      pet_care_records,
      animal_interaction_records,
      animal_welfare_records,
      child_engagement_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
