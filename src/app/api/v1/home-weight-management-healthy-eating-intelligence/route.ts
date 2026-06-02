// ==============================================================================
// CORNERSTONE -- HOME WEIGHT MANAGEMENT & HEALTHY EATING INTELLIGENCE API ROUTE
// GET /api/v1/home-weight-management-healthy-eating-intelligence
// Cross-domain composite: weightMonitoringRecords + bmiTrackingRecords +
// healthyEatingRecords + portionControlRecords + bodyPositivityRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeWeightManagementHealthyEating,
  type WeightMonitoringRecordInput,
  type BmiTrackingRecordInput,
  type HealthyEatingRecordInput,
  type PortionControlRecordInput,
  type BodyPositivityRecordInput,
} from "@/lib/engines/home-weight-management-healthy-eating-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawWeightMonitoring = (store.weightMonitoringRecords ?? []) as any[];
    const weight_monitoring_records: WeightMonitoringRecordInput[] = rawWeightMonitoring.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      weight_kg: r.weight_kg ?? 0,
      height_cm: r.height_cm ?? 0,
      measured_by: r.measured_by ?? "other",
      measurement_context: r.measurement_context ?? "other",
      weight_trend: r.weight_trend ?? "unknown",
      within_healthy_range: !!r.within_healthy_range,
      action_taken: !!r.action_taken,
      action_details: r.action_details ?? "",
      gp_notified: !!r.gp_notified,
      child_informed: !!r.child_informed,
      child_consent_obtained: !!r.child_consent_obtained,
      follow_up_date: r.follow_up_date ?? null,
      follow_up_completed: !!r.follow_up_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawBmiTracking = (store.bmiTrackingRecords ?? []) as any[];
    const bmi_tracking_records: BmiTrackingRecordInput[] = rawBmiTracking.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      bmi_value: r.bmi_value ?? 0,
      bmi_category: r.bmi_category ?? "unknown",
      centile_position: r.centile_position ?? null,
      plotted_on_growth_chart: !!r.plotted_on_growth_chart,
      growth_chart_reviewed: !!r.growth_chart_reviewed,
      trend_direction: r.trend_direction ?? "unknown",
      referral_made: !!r.referral_made,
      referral_type: r.referral_type ?? "none",
      professional_involved: !!r.professional_involved,
      review_frequency_weeks: r.review_frequency_weeks ?? 0,
      last_professional_review: r.last_professional_review ?? null,
      child_age_appropriate_discussion: !!r.child_age_appropriate_discussion,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawHealthyEating = (store.healthyEatingRecords ?? []) as any[];
    const healthy_eating_records: HealthyEatingRecordInput[] = rawHealthyEating.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      programme_name: r.programme_name ?? "",
      programme_type: r.programme_type ?? "other",
      date: (r.date ?? today).toString(),
      attended: !!r.attended,
      engaged: !!r.engaged,
      child_enjoyed: !!r.child_enjoyed,
      child_satisfaction: r.child_satisfaction ?? 3,
      learning_objectives_met: !!r.learning_objectives_met,
      skills_gained: Array.isArray(r.skills_gained) ? r.skills_gained : [],
      staff_led: !!r.staff_led,
      external_provider: !!r.external_provider,
      dietary_knowledge_improved: !!r.dietary_knowledge_improved,
      healthy_choice_made: !!r.healthy_choice_made,
      follow_up_planned: !!r.follow_up_planned,
      follow_up_completed: !!r.follow_up_completed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPortionControl = (store.portionControlRecords ?? []) as any[];
    const portion_control_records: PortionControlRecordInput[] = rawPortionControl.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      assessment_type: r.assessment_type ?? "other",
      understands_portions: !!r.understands_portions,
      age_appropriate_portions_served: !!r.age_appropriate_portions_served,
      child_self_serves: !!r.child_self_serves,
      child_makes_healthy_choices: !!r.child_makes_healthy_choices,
      overeating_concerns: !!r.overeating_concerns,
      undereating_concerns: !!r.undereating_concerns,
      emotional_eating_identified: !!r.emotional_eating_identified,
      support_plan_in_place: !!r.support_plan_in_place,
      staff_trained_on_portions: !!r.staff_trained_on_portions,
      meals_balanced: !!r.meals_balanced,
      snack_provision_appropriate: !!r.snack_provision_appropriate,
      hydration_adequate: !!r.hydration_adequate,
      child_voice_captured: !!r.child_voice_captured,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawBodyPositivity = (store.bodyPositivityRecords ?? []) as any[];
    const body_positivity_records: BodyPositivityRecordInput[] = rawBodyPositivity.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      activity_type: r.activity_type ?? "other",
      child_engaged: !!r.child_engaged,
      child_satisfaction: r.child_satisfaction ?? 3,
      positive_body_image_discussed: !!r.positive_body_image_discussed,
      media_literacy_included: !!r.media_literacy_included,
      self_esteem_component: !!r.self_esteem_component,
      weight_stigma_addressed: !!r.weight_stigma_addressed,
      staff_facilitated: !!r.staff_facilitated,
      external_professional_involved: !!r.external_professional_involved,
      child_voice_captured: !!r.child_voice_captured,
      concerns_identified: !!r.concerns_identified,
      concerns_details: r.concerns_details ?? "",
      referral_made: !!r.referral_made,
      referral_type: r.referral_type ?? "none",
      outcomes_documented: !!r.outcomes_documented,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeWeightManagementHealthyEating({
      today,
      total_children,
      weight_monitoring_records,
      bmi_tracking_records,
      healthy_eating_records,
      portion_control_records,
      body_positivity_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
