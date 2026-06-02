// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME EYE HEALTH & VISION CARE INTELLIGENCE API ROUTE
// GET /api/v1/home-eye-health-vision-care-intelligence
// Cross-domain composite: eyeTestRecords + prescriptionRecords +
// opticianReferralRecords + visualAidRecords + childEngagementRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeEyeHealthVisionCare,
  type EyeTestRecordInput,
  type PrescriptionRecordInput,
  type OpticianReferralRecordInput,
  type VisualAidRecordInput,
  type ChildEngagementRecordInput,
} from "@/lib/engines/home-eye-health-vision-care-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawEyeTests = (store.eyeTestRecords ?? []) as any[];
    const eye_test_records: EyeTestRecordInput[] = rawEyeTests.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      scheduled_date: (r.scheduled_date ?? today).toString(),
      attended: !!r.attended,
      date_attended: r.date_attended ?? null,
      optician_name: r.optician_name ?? "",
      practice_name: r.practice_name ?? "",
      outcome: r.outcome ?? "not_attended",
      next_test_date: r.next_test_date ?? null,
      child_consented: !!r.child_consented,
      child_accompanied_by: r.child_accompanied_by ?? "",
      findings_summary: r.findings_summary ?? null,
      visual_acuity_left: r.visual_acuity_left ?? null,
      visual_acuity_right: r.visual_acuity_right ?? null,
      colour_vision_tested: !!r.colour_vision_tested,
      field_test_completed: !!r.field_test_completed,
      child_cooperative: !!r.child_cooperative,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPrescriptions = (store.prescriptionRecords ?? []) as any[];
    const prescription_records: PrescriptionRecordInput[] = rawPrescriptions.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date_prescribed: (r.date_prescribed ?? today).toString(),
      prescription_type: r.prescription_type ?? "glasses",
      prescribed_by: r.prescribed_by ?? "",
      dispensed: !!r.dispensed,
      date_dispensed: r.date_dispensed ?? null,
      child_using_correctly: !!r.child_using_correctly,
      replacement_needed: !!r.replacement_needed,
      replacement_arranged: !!r.replacement_arranged,
      review_date: r.review_date ?? null,
      review_completed: !!r.review_completed,
      child_comfortable: !!r.child_comfortable,
      child_consented: !!r.child_consented,
      cost_covered: r.cost_covered !== false,
      follow_up_required: !!r.follow_up_required,
      follow_up_date: r.follow_up_date ?? null,
      follow_up_completed: !!r.follow_up_completed,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawReferrals = (store.opticianReferralRecords ?? []) as any[];
    const optician_referral_records: OpticianReferralRecordInput[] = rawReferrals.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      referral_date: (r.referral_date ?? today).toString(),
      referral_reason: r.referral_reason ?? "routine",
      referred_by: r.referred_by ?? "",
      referred_to: r.referred_to ?? "",
      appointment_date: r.appointment_date ?? null,
      appointment_attended: !!r.appointment_attended,
      outcome: r.outcome ?? "pending",
      waiting_time_days: r.waiting_time_days ?? 0,
      urgent: !!r.urgent,
      child_consented: !!r.child_consented,
      parent_carer_informed: !!r.parent_carer_informed,
      social_worker_informed: !!r.social_worker_informed,
      follow_up_required: !!r.follow_up_required,
      follow_up_date: r.follow_up_date ?? null,
      follow_up_completed: !!r.follow_up_completed,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawVisualAids = (store.visualAidRecords ?? []) as any[];
    const visual_aid_records: VisualAidRecordInput[] = rawVisualAids.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      aid_type: r.aid_type ?? "glasses",
      date_provided: (r.date_provided ?? today).toString(),
      condition: r.condition ?? "good",
      child_using: !!r.child_using,
      child_comfortable_with_aid: !!r.child_comfortable_with_aid,
      replacement_needed: !!r.replacement_needed,
      replacement_arranged: !!r.replacement_arranged,
      last_checked_date: r.last_checked_date ?? null,
      check_overdue: !!r.check_overdue,
      suitable_for_needs: !!r.suitable_for_needs,
      spare_available: !!r.spare_available,
      school_notified: !!r.school_notified,
      cost_covered: r.cost_covered !== false,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawEngagement = (store.childEyeHealthEngagementRecords ?? []) as any[];
    const child_engagement_records: ChildEngagementRecordInput[] = rawEngagement.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      engagement_type: r.engagement_type ?? "eye_health_education",
      child_participated: !!r.child_participated,
      child_views_sought: !!r.child_views_sought,
      child_views_recorded: !!r.child_views_recorded,
      child_understood_information: !!r.child_understood_information,
      child_made_choices: !!r.child_made_choices,
      age_appropriate_approach: !!r.age_appropriate_approach,
      positive_experience: !!r.positive_experience,
      concerns_raised_by_child: !!r.concerns_raised_by_child,
      concerns_addressed: !!r.concerns_addressed,
      independence_promoted: !!r.independence_promoted,
      staff_member: r.staff_member ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeEyeHealthVisionCare({
      today,
      total_children,
      eye_test_records,
      prescription_records,
      optician_referral_records,
      visual_aid_records,
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
