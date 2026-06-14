import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeLeavingCareTransition,
  type TransitionGoalInput,
  type PathwayPlanInput,
  type AspirationInput,
  type IndependentTravelInput,
  type LeavingCarePackageInput,
} from "@/lib/engines/home-leaving-care-transition-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const sixMonthsAgo = new Date(Date.now() - 180 * 86_400_000).toISOString().slice(0, 10);

  // Transition planning records → goals
  const rawTransitions = (store.transitionPlanningRecords as any[] ?? []);
  const transition_goals: TransitionGoalInput[] = rawTransitions.map((t: any) => ({
    id: t.id ?? "",
    child_id: t.child_id ?? "",
    area: t.area ?? "independent_living",
    status: t.status ?? "not_started",
    percent_complete: t.percent_complete ?? 0,
    has_review_date: !!(t.review_date),
  }));

  // Pathway plans
  const rawPlans = (store.pathwayPlans as any[] ?? []);
  const pathway_plans: PathwayPlanInput[] = rawPlans.map((p: any) => {
    const lastReview = (p.last_review_date ?? "").toString().slice(0, 10);
    return {
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      status: p.status ?? "draft",
      has_personal_advisor: !!(p.personal_advisor),
      has_accommodation_plan: !!(p.accommodation),
      has_eet_plan: !!(p.education_employment_training),
      last_review_within_6_months: lastReview >= sixMonthsAgo,
    };
  });

  // Aspiration records
  const rawAspirations = (store.aspirationRecords as any[] ?? []);
  const aspirations: AspirationInput[] = rawAspirations.map((a: any) => ({
    id: a.id ?? "",
    child_id: a.child_id ?? "",
    child_chose: !!(a.child_chose),
    has_steps_taken: !!(a.steps_taken && (a.steps_taken as any[]).length > 0),
    has_support_identified: !!(a.support_needed && (a.support_needed as any[]).length > 0),
  }));

  // Independent travel records
  const rawTravel = (store.independentTravelRecords as any[] ?? []);
  const independent_travel: IndependentTravelInput[] = rawTravel.map((t: any) => ({
    id: t.id ?? "",
    child_id: t.child_id ?? "",
    routes_mastered: (t.routes_mastered ?? []).length,
    routes_learning: (t.routes_learning ?? []).length,
    has_travel_card: !!(t.travel_cards_held && (t.travel_cards_held as any[]).length > 0),
    has_safety_plan: !!(t.what_if_lost_plan),
  }));

  // Leaving care packages
  const rawPackages = (store.leavingCarePackages as any[] ?? []);
  const leaving_care_packages: LeavingCarePackageInput[] = rawPackages.map((lc: any) => {
    const litProgression = lc.financial_literacy_progression ?? {};
    const litValues = Object.values(litProgression) as string[];
    const progressing = litValues.some((v) => v === "established" || v === "developing");
    return {
      id: lc.id ?? "",
      child_id: lc.child_id ?? "",
      has_junior_isa: !!(lc.junior_isa_provider),
      savings_on_track: (lc.savings_balance ?? 0) > 0,
      setting_up_home_allowance_confirmed: (lc.setting_up_home_allowance ?? 0) > 0,
      financial_literacy_progressing: progressing,
    };
  });

  const result = computeLeavingCareTransition({
    today,
    total_children: (children as any[]).length,
    transition_goals,
    pathway_plans,
    aspirations,
    independent_travel,
    leaving_care_packages,
  });

  return NextResponse.json({ data: result });
}
