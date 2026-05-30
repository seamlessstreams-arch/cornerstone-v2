// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME CHILD'S VOICE & PARTICIPATION INTELLIGENCE API ROUTE
// GET /api/v1/home-child-voice-participation-intelligence
// Cross-domain composite: meetingAttendanceRecords + consultationRecords +
// feedbackActionRecords + councilEngagementRecords + feelingHeardRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeChildVoiceParticipation,
  type MeetingAttendanceRecordInput,
  type ConsultationRecordInput,
  type FeedbackActionRecordInput,
  type CouncilEngagementRecordInput,
  type FeelingHeardRecordInput,
} from "@/lib/engines/home-child-voice-participation-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawMeetingAttendance = (store.meetingAttendanceRecords ?? []) as any[];
    const meeting_attendance_records: MeetingAttendanceRecordInput[] = rawMeetingAttendance.map((m: any) => ({
      id: m.id ?? "",
      child_id: m.child_id ?? "",
      date: (m.date ?? today).toString(),
      meeting_type: m.meeting_type ?? "house_meeting",
      attended: !!m.attended,
      invited: !!m.invited,
      contributed: !!m.contributed,
      chaired_by_child: !!m.chaired_by_child,
      minutes_recorded: !!m.minutes_recorded,
      actions_from_meeting: m.actions_from_meeting ?? 0,
      actions_completed: m.actions_completed ?? 0,
      child_feedback_positive: !!m.child_feedback_positive,
      duration_minutes: m.duration_minutes ?? 0,
      notes: m.notes ?? "",
      created_at: (m.created_at ?? today).toString(),
    }));

    const rawConsultation = (store.consultationRecords ?? []) as any[];
    const consultation_records: ConsultationRecordInput[] = rawConsultation.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      date: (c.date ?? today).toString(),
      consultation_type: c.consultation_type ?? "individual",
      topic: c.topic ?? "",
      child_engaged: !!c.child_engaged,
      child_views_recorded: !!c.child_views_recorded,
      views_shared_with_staff: !!c.views_shared_with_staff,
      outcome_communicated_to_child: !!c.outcome_communicated_to_child,
      child_satisfied_with_process: !!c.child_satisfied_with_process,
      follow_up_required: !!c.follow_up_required,
      follow_up_completed: !!c.follow_up_completed,
      duration_minutes: c.duration_minutes ?? 0,
      facilitator: c.facilitator ?? "",
      notes: c.notes ?? "",
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawFeedbackAction = (store.feedbackActionRecords ?? []) as any[];
    const feedback_action_records: FeedbackActionRecordInput[] = rawFeedbackAction.map((f: any) => ({
      id: f.id ?? "",
      child_id: f.child_id ?? "",
      date: (f.date ?? today).toString(),
      feedback_source: f.feedback_source ?? "child_direct",
      feedback_category: f.feedback_category ?? "care",
      feedback_received: !!f.feedback_received,
      acknowledged: !!f.acknowledged,
      action_planned: !!f.action_planned,
      action_taken: !!f.action_taken,
      outcome_communicated: !!f.outcome_communicated,
      child_satisfied_with_outcome: !!f.child_satisfied_with_outcome,
      days_to_action: f.days_to_action ?? 0,
      escalated: !!f.escalated,
      notes: f.notes ?? "",
      created_at: (f.created_at ?? today).toString(),
    }));

    const rawCouncilEngagement = (store.councilEngagementRecords ?? []) as any[];
    const council_engagement_records: CouncilEngagementRecordInput[] = rawCouncilEngagement.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      date: (c.date ?? today).toString(),
      council_type: c.council_type ?? "child_council",
      role: c.role ?? "member",
      attended: !!c.attended,
      contributed: !!c.contributed,
      agenda_item_raised: !!c.agenda_item_raised,
      agenda_item_actioned: !!c.agenda_item_actioned,
      minutes_shared: !!c.minutes_shared,
      child_felt_listened_to: !!c.child_felt_listened_to,
      decisions_influenced: c.decisions_influenced ?? 0,
      notes: c.notes ?? "",
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawFeelingHeard = (store.feelingHeardRecords ?? []) as any[];
    const feeling_heard_records: FeelingHeardRecordInput[] = rawFeelingHeard.map((f: any) => ({
      id: f.id ?? "",
      child_id: f.child_id ?? "",
      date: (f.date ?? today).toString(),
      assessment_method: f.assessment_method ?? "direct_question",
      feels_listened_to: !!f.feels_listened_to,
      feels_views_matter: !!f.feels_views_matter,
      feels_changes_happen: !!f.feels_changes_happen,
      knows_how_to_complain: !!f.knows_how_to_complain,
      knows_advocate: !!f.knows_advocate,
      overall_satisfaction: f.overall_satisfaction ?? 3,
      specific_concern: f.specific_concern ?? "",
      concern_addressed: !!f.concern_addressed,
      notes: f.notes ?? "",
      created_at: (f.created_at ?? today).toString(),
    }));

    const result = computeChildVoiceParticipation({
      today,
      total_children,
      meeting_attendance_records,
      consultation_records,
      feedback_action_records,
      council_engagement_records,
      feeling_heard_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
