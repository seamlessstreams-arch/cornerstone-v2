export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeMobilePhoneScreenTime,
  type ScreenTimeRecordInput,
  type ContentMonitoringRecordInput,
  type UsageAgreementRecordInput,
  type DigitalWellbeingRecordInput,
  type SelfRegulationRecordInput,
} from "@/lib/engines/home-mobile-phone-screen-time-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawScreenTime = (store.screenTimeRecords ?? []) as any[];
    const screen_time_records: ScreenTimeRecordInput[] = rawScreenTime.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      agreed_limit_minutes: r.agreed_limit_minutes ?? 120,
      actual_usage_minutes: r.actual_usage_minutes ?? 0,
      device_type: r.device_type ?? "smartphone",
      usage_categories: r.usage_categories ?? [],
      limit_adhered_to: r.limit_adhered_to ?? false,
      staff_prompted_break: r.staff_prompted_break ?? false,
      child_self_managed: r.child_self_managed ?? false,
      bedtime_device_handover: r.bedtime_device_handover ?? false,
      weekend_or_holiday: r.weekend_or_holiday ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawContentMonitoring = (store.contentMonitoringRecords ?? []) as any[];
    const content_monitoring_records: ContentMonitoringRecordInput[] = rawContentMonitoring.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      monitoring_type: r.monitoring_type ?? "routine_check",
      age_appropriate_content: r.age_appropriate_content ?? false,
      inappropriate_content_found: r.inappropriate_content_found ?? false,
      content_description: r.content_description ?? null,
      action_taken: r.action_taken ?? null,
      child_informed: r.child_informed ?? false,
      child_age_years: r.child_age_years ?? 12,
      filters_active: r.filters_active ?? false,
      safeguarding_referral_needed: r.safeguarding_referral_needed ?? false,
      safeguarding_referral_made: r.safeguarding_referral_made ?? false,
      discussion_with_child: r.discussion_with_child ?? false,
      staff_member: r.staff_member ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawUsageAgreements = (store.usageAgreementRecords ?? []) as any[];
    const usage_agreement_records: UsageAgreementRecordInput[] = rawUsageAgreements.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      agreement_date: (r.agreement_date ?? today).toString(),
      agreement_type: r.agreement_type ?? "initial",
      covers_screen_time_limits: r.covers_screen_time_limits ?? false,
      covers_content_boundaries: r.covers_content_boundaries ?? false,
      covers_social_media_rules: r.covers_social_media_rules ?? false,
      covers_online_safety: r.covers_online_safety ?? false,
      covers_device_care: r.covers_device_care ?? false,
      covers_consequences: r.covers_consequences ?? false,
      child_contributed: r.child_contributed ?? false,
      child_signed: r.child_signed ?? false,
      carer_signed: r.carer_signed ?? false,
      social_worker_informed: r.social_worker_informed ?? false,
      review_date_set: r.review_date_set ?? null,
      agreement_active: r.agreement_active ?? true,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDigitalWellbeing = (store.digitalWellbeingRecords ?? []) as any[];
    const digital_wellbeing_records: DigitalWellbeingRecordInput[] = rawDigitalWellbeing.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      session_type: r.session_type ?? "one_to_one",
      topic: r.topic ?? "online_safety",
      child_engaged: r.child_engaged ?? false,
      child_feedback_positive: r.child_feedback_positive ?? false,
      learning_outcomes_achieved: r.learning_outcomes_achieved ?? false,
      follow_up_planned: r.follow_up_planned ?? false,
      follow_up_completed: r.follow_up_completed ?? false,
      external_resource_used: r.external_resource_used ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSelfRegulation = (store.selfRegulationRecords ?? []) as any[];
    const self_regulation_records: SelfRegulationRecordInput[] = rawSelfRegulation.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      assessment_type: r.assessment_type ?? "observation",
      can_identify_overuse: r.can_identify_overuse ?? false,
      takes_voluntary_breaks: r.takes_voluntary_breaks ?? false,
      follows_agreed_limits: r.follows_agreed_limits ?? false,
      asks_for_help_when_struggling: r.asks_for_help_when_struggling ?? false,
      balances_screen_offline_activities: r.balances_screen_offline_activities ?? false,
      recognises_impact_on_mood: r.recognises_impact_on_mood ?? false,
      self_regulation_score: r.self_regulation_score ?? 3,
      improvement_since_last: r.improvement_since_last ?? "first_assessment",
      support_plan_in_place: r.support_plan_in_place ?? false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeMobilePhoneScreenTime({
      today,
      total_children,
      screen_time_records,
      content_monitoring_records,
      usage_agreement_records,
      digital_wellbeing_records,
      self_regulation_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
