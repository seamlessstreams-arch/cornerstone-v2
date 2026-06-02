// ==============================================================================
// CORNERSTONE -- HOME POCKET MONEY DISTRIBUTION EQUITY INTELLIGENCE API ROUTE
// GET /api/v1/home-pocket-money-distribution-equity-intelligence
// Cross-domain composite: pocketMoneyDistributionRecords +
// ageAppropriatenessRecords + paymentTimelinessRecords +
// childUnderstandingRecords + transparencyRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computePocketMoneyDistributionEquity,
  type DistributionRecordInput,
  type AgeAppropriatenessRecordInput,
  type PaymentTimelinessRecordInput,
  type ChildUnderstandingRecordInput,
  type TransparencyRecordInput,
} from "@/lib/engines/home-pocket-money-distribution-equity-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawDistribution = (store.pocketMoneyDistributionRecords ?? []) as any[];
    const distribution_records: DistributionRecordInput[] = rawDistribution.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      child_name: r.child_name ?? "",
      child_age: r.child_age ?? 0,
      period: r.period ?? "",
      amount_due: r.amount_due ?? 0,
      amount_paid: r.amount_paid ?? 0,
      currency: r.currency ?? "GBP",
      payment_date: r.payment_date ?? null,
      due_date: (r.due_date ?? today).toString(),
      payment_method: r.payment_method ?? "cash",
      reason_for_difference: r.reason_for_difference ?? "",
      approved_by: r.approved_by ?? "",
      child_signed: !!r.child_signed,
      staff_signed: !!r.staff_signed,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAgeAppropriateness = (store.ageAppropriatenessRecords ?? []) as any[];
    const age_appropriateness_records: AgeAppropriatenessRecordInput[] = rawAgeAppropriateness.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      child_age: r.child_age ?? 0,
      weekly_amount: r.weekly_amount ?? 0,
      local_authority_guidance_amount: r.local_authority_guidance_amount ?? 0,
      age_band: r.age_band ?? "8_to_10",
      amount_meets_guidance: !!r.amount_meets_guidance,
      amount_reviewed: !!r.amount_reviewed,
      last_review_date: r.last_review_date ?? null,
      review_included_child: !!r.review_included_child,
      adjustment_made: !!r.adjustment_made,
      adjustment_reason: r.adjustment_reason ?? "",
      child_satisfied_with_amount: !!r.child_satisfied_with_amount,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPaymentTimeliness = (store.paymentTimelinessRecords ?? []) as any[];
    const payment_timeliness_records: PaymentTimelinessRecordInput[] = rawPaymentTimeliness.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      period: r.period ?? "",
      due_date: (r.due_date ?? today).toString(),
      actual_payment_date: r.actual_payment_date ?? null,
      days_late: r.days_late ?? 0,
      reason_for_delay: r.reason_for_delay ?? "",
      child_informed_of_delay: !!r.child_informed_of_delay,
      compensatory_action_taken: !!r.compensatory_action_taken,
      payment_made: !!r.payment_made,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildUnderstanding = (store.childUnderstandingRecords ?? []) as any[];
    const child_understanding_records: ChildUnderstandingRecordInput[] = rawChildUnderstanding.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      child_age: r.child_age ?? 0,
      understands_amount: !!r.understands_amount,
      understands_frequency: !!r.understands_frequency,
      understands_savings_option: !!r.understands_savings_option,
      understands_how_to_request_extra: !!r.understands_how_to_request_extra,
      discussion_date: (r.discussion_date ?? today).toString(),
      discussed_with: r.discussed_with ?? "",
      age_appropriate_explanation: !!r.age_appropriate_explanation,
      child_has_questions: !!r.child_has_questions,
      questions_addressed: !!r.questions_addressed,
      child_feels_fairly_treated: !!r.child_feels_fairly_treated,
      child_knows_complaint_process: !!r.child_knows_complaint_process,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTransparency = (store.transparencyRecords ?? []) as any[];
    const transparency_records: TransparencyRecordInput[] = rawTransparency.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      record_type: r.record_type ?? "ledger_entry",
      date: (r.date ?? today).toString(),
      record_accessible_to_child: !!r.record_accessible_to_child,
      record_explained_to_child: !!r.record_explained_to_child,
      discrepancy_found: !!r.discrepancy_found,
      discrepancy_resolved: !!r.discrepancy_resolved,
      discrepancy_details: r.discrepancy_details ?? "",
      independent_audit_completed: !!r.independent_audit_completed,
      audit_passed: !!r.audit_passed,
      child_can_view_balance: !!r.child_can_view_balance,
      staff_member: r.staff_member ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computePocketMoneyDistributionEquity({
      today,
      total_children,
      distribution_records,
      age_appropriateness_records,
      payment_timeliness_records,
      child_understanding_records,
      transparency_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
