// ==============================================================================
// CARA -- HOME ADVOCACY & INDEPENDENT VISITOR INTELLIGENCE API ROUTE
// GET /api/v1/home-advocacy-independent-visitor-intelligence
// Cross-domain composite: independentVisitorRecords + advocacyServiceRecords +
// representationRecords + visitComplianceRecords + childSatisfactionRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeAdvocacyIndependentVisitor,
  type IndependentVisitorRecordInput,
  type AdvocacyServiceRecordInput,
  type RepresentationRecordInput,
  type VisitComplianceRecordInput,
  type ChildSatisfactionRecordInput,
} from "@/lib/engines/home-advocacy-independent-visitor-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawIndependentVisitor = (store.independentVisitorRecords ?? []) as any[];
    const independent_visitor_records: IndependentVisitorRecordInput[] = rawIndependentVisitor.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      visitor_name: r.visitor_name ?? "",
      visitor_organisation: r.visitor_organisation ?? "",
      allocated: !!r.allocated,
      allocation_date: r.allocation_date ?? null,
      dbs_cleared: !!r.dbs_cleared,
      training_completed: !!r.training_completed,
      child_consented: !!r.child_consented,
      child_matched: !!r.child_matched,
      matching_quality: r.matching_quality ?? "unmatched",
      relationship_established: !!r.relationship_established,
      visits_planned_per_quarter: r.visits_planned_per_quarter ?? 0,
      visits_completed_per_quarter: r.visits_completed_per_quarter ?? 0,
      last_visit_date: r.last_visit_date ?? null,
      visit_duration_minutes: r.visit_duration_minutes ?? 0,
      child_engaged_during_visit: !!r.child_engaged_during_visit,
      issues_raised_by_visitor: r.issues_raised_by_visitor ?? 0,
      issues_resolved: r.issues_resolved ?? 0,
      visitor_report_submitted: !!r.visitor_report_submitted,
      child_wishes_recorded: !!r.child_wishes_recorded,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAdvocacyService = (store.advocacyServiceRecords ?? []) as any[];
    const advocacy_service_records: AdvocacyServiceRecordInput[] = rawAdvocacyService.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      advocacy_provider: r.advocacy_provider ?? "",
      service_type: r.service_type ?? "general",
      referral_date: (r.referral_date ?? today).toString(),
      referral_accepted: !!r.referral_accepted,
      advocate_allocated: !!r.advocate_allocated,
      advocate_name: r.advocate_name ?? "",
      first_contact_date: r.first_contact_date ?? null,
      days_to_first_contact: r.days_to_first_contact ?? 0,
      advocacy_plan_in_place: !!r.advocacy_plan_in_place,
      child_informed_of_rights: !!r.child_informed_of_rights,
      child_understands_role: !!r.child_understands_role,
      meetings_attended_by_advocate: r.meetings_attended_by_advocate ?? 0,
      meetings_total: r.meetings_total ?? 0,
      outcome_achieved: !!r.outcome_achieved,
      outcome_documented: !!r.outcome_documented,
      child_satisfaction: r.child_satisfaction ?? 3,
      advocacy_independent_of_home: !!r.advocacy_independent_of_home,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRepresentation = (store.representationRecords ?? []) as any[];
    const representation_records: RepresentationRecordInput[] = rawRepresentation.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      context: r.context ?? "other",
      date: (r.date ?? today).toString(),
      child_views_sought: !!r.child_views_sought,
      child_views_documented: !!r.child_views_documented,
      child_views_presented: !!r.child_views_presented,
      child_attended_meeting: !!r.child_attended_meeting,
      advocate_present: !!r.advocate_present,
      independent_visitor_consulted: !!r.independent_visitor_consulted,
      child_felt_heard: !!r.child_felt_heard,
      decision_reflected_views: !!r.decision_reflected_views,
      feedback_given_to_child: !!r.feedback_given_to_child,
      representation_quality: r.representation_quality ?? "adequate",
      barriers_to_participation: Array.isArray(r.barriers_to_participation) ? r.barriers_to_participation : [],
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawVisitCompliance = (store.visitComplianceRecords ?? []) as any[];
    const visit_compliance_records: VisitComplianceRecordInput[] = rawVisitCompliance.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      visit_type: r.visit_type ?? "other",
      scheduled_date: (r.scheduled_date ?? today).toString(),
      actual_date: r.actual_date ?? null,
      visit_completed: !!r.visit_completed,
      within_timescale: !!r.within_timescale,
      visit_private: !!r.visit_private,
      child_seen_alone: !!r.child_seen_alone,
      child_views_recorded: !!r.child_views_recorded,
      follow_up_actions: r.follow_up_actions ?? 0,
      follow_up_completed: r.follow_up_completed ?? 0,
      report_filed: !!r.report_filed,
      report_filed_on_time: !!r.report_filed_on_time,
      visit_quality: r.visit_quality ?? "adequate",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildSatisfaction = (store.childAdvocacySatisfactionRecords ?? []) as any[];
    const child_satisfaction_records: ChildSatisfactionRecordInput[] = rawChildSatisfaction.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      survey_date: (r.survey_date ?? today).toString(),
      knows_independent_visitor: !!r.knows_independent_visitor,
      feels_listened_to: !!r.feels_listened_to,
      trusts_advocate: !!r.trusts_advocate,
      understands_complaints_process: !!r.understands_complaints_process,
      would_use_advocacy_again: !!r.would_use_advocacy_again,
      satisfaction_with_iv: r.satisfaction_with_iv ?? 3,
      satisfaction_with_advocacy: r.satisfaction_with_advocacy ?? 3,
      satisfaction_with_representation: r.satisfaction_with_representation ?? 3,
      feels_views_make_difference: !!r.feels_views_make_difference,
      suggestions_for_improvement: r.suggestions_for_improvement ?? "",
      child_voice_method: r.child_voice_method ?? "face_to_face",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeAdvocacyIndependentVisitor({
      today,
      total_children,
      independent_visitor_records,
      advocacy_service_records,
      representation_records,
      visit_compliance_records,
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
