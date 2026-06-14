import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeGovernanceManagementOversight,
  type WalkroundInput,
  type GovernanceMeetingInput,
  type BoardReportInput,
  type OperationalMeetingInput,
  type CommissioningFeedbackInput,
} from "@/lib/engines/home-governance-management-oversight-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Management walkrounds
  const rawWalkrounds = (store.managementWalkrounds as any[] ?? []);
  const walkrounds: WalkroundInput[] = rawWalkrounds.map((w: any) => ({
    id: w.id ?? "",
    date: (w.date ?? today).toString().slice(0, 10),
    areas_visited_count: (w.areas_visited ?? []).length,
    positive_observations: (w.observations_positive ?? []).length,
    improvements_identified: (w.observations_for_improvement ?? []).length,
    child_interactions: (w.child_interactions ?? []).length,
    staff_interactions: (w.staff_interactions ?? []).length,
    immediate_actions_taken: (w.immediate_actions_taken ?? []).length,
    follow_up_actions_logged: (w.follow_up_actions_logged ?? []).length,
  }));

  // Governance meetings
  const rawGovMeetings = (store.governanceMeetings as any[] ?? []);
  const governance_meetings: GovernanceMeetingInput[] = rawGovMeetings.map((g: any) => ({
    id: g.id ?? "",
    date: (g.date ?? today).toString().slice(0, 10),
    attendees_count: (g.attendees ?? []).length,
    key_decisions_count: (g.key_decisions ?? []).length,
    actions_count: (g.actions ?? []).length,
    children_discussed_count: (g.children_discussed ?? []).length,
    regulatory_topics_discussed: !!(g.regulatory_topics && (g.regulatory_topics as any[]).length > 0),
    risk_items_count: (g.risk_items ?? []).length,
  }));

  // Board reports
  const rawBoardReports = (store.boardReports as any[] ?? []);
  const board_reports: BoardReportInput[] = rawBoardReports.map((b: any) => ({
    id: b.id ?? "",
    submitted_date: (b.submitted_date ?? today).toString().slice(0, 10),
    risk_rag: b.risk_rag_rating ?? "amber",
    board_response_received: !!(b.board_response_received),
    actions_agreed_count: (b.actions_agreed ?? []).length,
    areas_of_concern_count: (b.areas_of_concern ?? []).length,
  }));

  // Operational meetings
  const rawOpsMeetings = (store.operationalMeetings as any[] ?? []);
  const operational_meetings: OperationalMeetingInput[] = rawOpsMeetings.map((o: any) => ({
    id: o.id ?? "",
    date: (o.date ?? today).toString().slice(0, 10),
    attendees_count: (o.attendees ?? []).length,
    key_decisions_count: (o.key_decisions ?? []).length,
    child_updates_count: Object.keys(o.child_updates ?? {}).length,
    risks_identified_count: (o.risks_identified ?? []).length,
    actions_agreed_count: (o.actions_agreed ?? []).length,
    positive_moments_shared: (o.positive_moments_shared ?? []).length,
  }));

  // Commissioning feedback
  const rawCommFeedback = (store.commissioningFeedbackRecords as any[] ?? []);
  const commissioning_feedback: CommissioningFeedbackInput[] = rawCommFeedback.map((c: any) => ({
    id: c.id ?? "",
    date: (c.date_received ?? today).toString().slice(0, 10),
    overall_rating: c.overall_rating ?? 3,
    has_strengths: !!(c.strengths && (c.strengths as any[]).length > 0),
    has_development_areas: !!(c.areas_for_development && (c.areas_for_development as any[]).length > 0),
    action_plan_in_place: !!(c.action_plan_agreed),
  }));

  const result = computeGovernanceManagementOversight({
    today,
    total_children: (children as any[]).length,
    walkrounds,
    governance_meetings,
    board_reports,
    operational_meetings,
    commissioning_feedback,
  });

  return NextResponse.json({ data: result });
}
