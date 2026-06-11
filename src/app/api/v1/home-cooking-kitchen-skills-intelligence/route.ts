// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME COOKING & KITCHEN SKILLS INTELLIGENCE API ROUTE
// GET /api/v1/home-cooking-kitchen-skills-intelligence
// Cross-domain composite: cookingSessionRecords + kitchenSafetyRecords +
// mealPreparationRecords + nutritionalUnderstandingRecords +
// cookingIndependenceRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeCookingKitchenSkills,
  type CookingSessionRecordInput,
  type KitchenSafetyRecordInput,
  type MealPreparationRecordInput,
  type NutritionalUnderstandingRecordInput,
  type IndependenceRecordInput,
} from "@/lib/engines/home-cooking-kitchen-skills-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawCookingSessions = (store.cookingSessionRecords ?? []) as any[];
    const cooking_session_records: CookingSessionRecordInput[] = rawCookingSessions.map((s: any) => ({
      id: s.id ?? "",
      child_id: s.child_id ?? "",
      date: (s.date ?? today).toString(),
      session_type: s.session_type ?? "guided",
      dish_category: s.dish_category ?? "dinner",
      attended: !!s.attended,
      engaged: !!s.engaged,
      completed_dish: !!s.completed_dish,
      child_enjoyed: !!s.child_enjoyed,
      child_chose_recipe: !!s.child_chose_recipe,
      staff_member: s.staff_member ?? "",
      duration_minutes: s.duration_minutes ?? 0,
      skills_practised: Array.isArray(s.skills_practised) ? s.skills_practised : [],
      difficulty_level: s.difficulty_level ?? "beginner",
      dietary_requirements_met: !!s.dietary_requirements_met,
      allergen_awareness_demonstrated: !!s.allergen_awareness_demonstrated,
      hand_washing_before: !!s.hand_washing_before,
      apron_worn: !!s.apron_worn,
      notes: s.notes ?? "",
      created_at: (s.created_at ?? today).toString(),
    }));

    const rawKitchenSafety = (store.kitchenSafetyRecords ?? []) as any[];
    const kitchen_safety_records: KitchenSafetyRecordInput[] = rawKitchenSafety.map((k: any) => ({
      id: k.id ?? "",
      child_id: k.child_id ?? "",
      date: (k.date ?? today).toString(),
      assessment_type: k.assessment_type ?? "observation",
      knife_safety_competent: !!k.knife_safety_competent,
      hob_safety_competent: !!k.hob_safety_competent,
      oven_safety_competent: !!k.oven_safety_competent,
      microwave_safety_competent: !!k.microwave_safety_competent,
      electrical_appliance_safety: !!k.electrical_appliance_safety,
      food_hygiene_compliant: !!k.food_hygiene_compliant,
      hand_washing_compliant: !!k.hand_washing_compliant,
      cleaning_after_cooking: !!k.cleaning_after_cooking,
      fire_safety_awareness: !!k.fire_safety_awareness,
      first_aid_awareness: !!k.first_aid_awareness,
      allergies_cross_contamination_aware: !!k.allergies_cross_contamination_aware,
      overall_safe: !!k.overall_safe,
      risk_assessment_completed: !!k.risk_assessment_completed,
      incident_reported: !!k.incident_reported,
      incident_description: k.incident_description ?? "",
      assessor: k.assessor ?? "",
      notes: k.notes ?? "",
      created_at: (k.created_at ?? today).toString(),
    }));

    const rawMealPrep = (store.mealPreparationRecords ?? []) as any[];
    const meal_preparation_records: MealPreparationRecordInput[] = rawMealPrep.map((m: any) => ({
      id: m.id ?? "",
      child_id: m.child_id ?? "",
      date: (m.date ?? today).toString(),
      meal_type: m.meal_type ?? "dinner",
      skill_area: m.skill_area ?? "cooking",
      competency_level: m.competency_level ?? "not_introduced",
      recipe_followed: !!m.recipe_followed,
      portion_appropriate: !!m.portion_appropriate,
      presentation_good: !!m.presentation_good,
      time_management_good: !!m.time_management_good,
      waste_minimal: !!m.waste_minimal,
      served_others: !!m.served_others,
      received_positive_feedback: !!m.received_positive_feedback,
      staff_assessment_score: m.staff_assessment_score ?? 3,
      progression_from_last: m.progression_from_last ?? "first_assessment",
      notes: m.notes ?? "",
      created_at: (m.created_at ?? today).toString(),
    }));

    const rawNutritional = (store.nutritionalUnderstandingRecords ?? []) as any[];
    const nutritional_understanding_records: NutritionalUnderstandingRecordInput[] = rawNutritional.map((n: any) => ({
      id: n.id ?? "",
      child_id: n.child_id ?? "",
      date: (n.date ?? today).toString(),
      topic: n.topic ?? "balanced_diet",
      assessment_method: n.assessment_method ?? "discussion",
      understanding_demonstrated: !!n.understanding_demonstrated,
      can_apply_knowledge: !!n.can_apply_knowledge,
      engaged: !!n.engaged,
      child_feedback_positive: !!n.child_feedback_positive,
      linked_to_cooking_session: !!n.linked_to_cooking_session,
      staff_member: n.staff_member ?? "",
      score_achieved: n.score_achieved ?? 0,
      notes: n.notes ?? "",
      created_at: (n.created_at ?? today).toString(),
    }));

    const rawIndependence = (store.cookingIndependenceRecords ?? []) as any[];
    const independence_records: IndependenceRecordInput[] = rawIndependence.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      independence_area: r.independence_area ?? "independent_cooking",
      current_level: r.current_level ?? "fully_dependent",
      goal_set: !!r.goal_set,
      goal_met: !!r.goal_met,
      progress_since_last: r.progress_since_last ?? "first_assessment",
      age_appropriate: !!r.age_appropriate,
      child_motivated: !!r.child_motivated,
      barriers_identified: Array.isArray(r.barriers_identified) ? r.barriers_identified : [],
      support_plan_in_place: !!r.support_plan_in_place,
      transition_relevance: !!r.transition_relevance,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeCookingKitchenSkills({
      today,
      total_children,
      cooking_session_records,
      kitchen_safety_records,
      meal_preparation_records,
      nutritional_understanding_records,
      independence_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
