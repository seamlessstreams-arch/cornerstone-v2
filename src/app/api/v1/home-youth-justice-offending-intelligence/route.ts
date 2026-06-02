export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeYouthJusticeOffending,
  type YotLiaisonRecordInput,
  type BehaviourPlanRecordInput,
  type RestorativeJusticeRecordInput,
  type CourtOrderRecordInput,
  type PreventionProgrammeRecordInput,
} from "@/lib/engines/home-youth-justice-offending-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawYotLiaison = (store.yotLiaisonRecords ?? []) as any[];
    const yot_liaison_records: YotLiaisonRecordInput[] = rawYotLiaison.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      yot_worker_name: r.yot_worker_name ?? "",
      meeting_type: r.meeting_type ?? "scheduled",
      meeting_attended: r.meeting_attended ?? false,
      child_attended: r.child_attended ?? false,
      home_staff_attended: r.home_staff_attended ?? false,
      key_issues_discussed: r.key_issues_discussed ?? [],
      actions_agreed: r.actions_agreed ?? [],
      actions_completed: r.actions_completed ?? false,
      actions_completion_date: r.actions_completion_date ?? null,
      information_shared_with_team: r.information_shared_with_team ?? false,
      child_views_captured: r.child_views_captured ?? false,
      next_meeting_date: r.next_meeting_date ?? null,
      quality_rating: r.quality_rating ?? 3,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawBehaviourPlans = (store.behaviourPlanRecords ?? []) as any[];
    const behaviour_plan_records: BehaviourPlanRecordInput[] = rawBehaviourPlans.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      plan_created_date: (r.plan_created_date ?? today).toString(),
      plan_type: r.plan_type ?? "offending_behaviour",
      targets_set: r.targets_set ?? [],
      targets_met: r.targets_met ?? 0,
      total_targets: r.total_targets ?? 0,
      plan_reviewed: r.plan_reviewed ?? false,
      review_date: r.review_date ?? null,
      child_involved_in_planning: r.child_involved_in_planning ?? false,
      child_engaged_with_plan: r.child_engaged_with_plan ?? false,
      professional_input_received: r.professional_input_received ?? false,
      plan_active: r.plan_active ?? true,
      progress_rating: r.progress_rating ?? 3,
      evidence_of_change: r.evidence_of_change ?? false,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRestorativeJustice = (store.restorativeJusticeRecords ?? []) as any[];
    const restorative_justice_records: RestorativeJusticeRecordInput[] = rawRestorativeJustice.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      rj_type: r.rj_type ?? "restorative_conversation",
      child_participated: r.child_participated ?? false,
      child_engaged: r.child_engaged ?? false,
      child_showed_empathy: r.child_showed_empathy ?? false,
      victim_satisfied: r.victim_satisfied ?? null,
      outcome_achieved: r.outcome_achieved ?? false,
      follow_up_required: r.follow_up_required ?? false,
      follow_up_completed: r.follow_up_completed ?? false,
      staff_supported_child: r.staff_supported_child ?? false,
      child_reflection_documented: r.child_reflection_documented ?? false,
      learning_identified: r.learning_identified ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCourtOrders = (store.courtOrderRecords ?? []) as any[];
    const court_order_records: CourtOrderRecordInput[] = rawCourtOrders.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      order_type: r.order_type ?? "referral_order",
      order_start_date: (r.order_start_date ?? today).toString(),
      order_end_date: r.order_end_date ?? null,
      conditions: r.conditions ?? [],
      conditions_complied_with: r.conditions_complied_with ?? 0,
      total_conditions: r.total_conditions ?? 0,
      breach_occurred: r.breach_occurred ?? false,
      breach_date: r.breach_date ?? null,
      breach_reason: r.breach_reason ?? null,
      home_supported_compliance: r.home_supported_compliance ?? false,
      monitoring_in_place: r.monitoring_in_place ?? false,
      review_date: r.review_date ?? null,
      order_active: r.order_active ?? true,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawPreventionProgrammes = (store.preventionProgrammeRecords ?? []) as any[];
    const prevention_programme_records: PreventionProgrammeRecordInput[] = rawPreventionProgrammes.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      programme_name: r.programme_name ?? "",
      programme_type: r.programme_type ?? "mentoring",
      start_date: (r.start_date ?? today).toString(),
      end_date: r.end_date ?? null,
      sessions_planned: r.sessions_planned ?? 0,
      sessions_attended: r.sessions_attended ?? 0,
      child_engaged: r.child_engaged ?? false,
      child_progress_positive: r.child_progress_positive ?? false,
      measurable_outcomes_documented: r.measurable_outcomes_documented ?? false,
      professional_feedback_positive: r.professional_feedback_positive ?? null,
      programme_active: r.programme_active ?? true,
      reoffending_since_start: r.reoffending_since_start ?? false,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeYouthJusticeOffending({
      today,
      total_children,
      yot_liaison_records,
      behaviour_plan_records,
      restorative_justice_records,
      court_order_records,
      prevention_programme_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
