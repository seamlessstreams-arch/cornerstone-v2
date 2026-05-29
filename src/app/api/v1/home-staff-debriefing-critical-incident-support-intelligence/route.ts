import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStaffDebriefingCriticalIncidentSupport,
  type DebriefingRecordInput,
  type CriticalIncidentRecordInput,
  type WellbeingFollowupRecordInput,
  type LearningExtractionRecordInput,
  type SupportAccessRecordInput,
} from "@/lib/engines/home-staff-debriefing-critical-incident-support-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = (store.staff as any[] ?? []);
  const today = new Date().toISOString().slice(0, 10);

  // ── Debriefing records ────────────────────────────────────────────────
  const rawDebriefings = (store.staffDebriefingRecords as any[] ?? []);
  const debriefing_records: DebriefingRecordInput[] = rawDebriefings.map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? r.staffId ?? "",
    incident_id: r.incident_id ?? r.incidentId ?? "",
    debrief_type: r.debrief_type ?? r.debriefType ?? "formal_structured",
    status: r.status ?? "completed",
    offered_within_24h: !!(r.offered_within_24h ?? r.offeredWithin24h),
    completed_within_48h: !!(r.completed_within_48h ?? r.completedWithin48h),
    staff_felt_supported: !!(r.staff_felt_supported ?? r.staffFeltSupported),
    confidentiality_maintained: !!(r.confidentiality_maintained ?? r.confidentialityMaintained),
    action_plan_created: !!(r.action_plan_created ?? r.actionPlanCreated),
    follow_up_scheduled: !!(r.follow_up_scheduled ?? r.followUpScheduled),
    follow_up_completed: !!(r.follow_up_completed ?? r.followUpCompleted),
    emotional_impact_level: r.emotional_impact_level ?? r.emotionalImpactLevel ?? "moderate",
    debrief_quality_rating: Number(r.debrief_quality_rating ?? r.debriefQualityRating ?? 0),
  }));

  // ── Critical incident records ─────────────────────────────────────────
  const rawIncidents = (store.criticalIncidentRecords as any[] ?? []);
  const critical_incident_records: CriticalIncidentRecordInput[] = rawIncidents.map((r: any) => ({
    id: r.id ?? "",
    incident_type: r.incident_type ?? r.incidentType ?? "physical_assault",
    severity: r.severity ?? "moderate",
    staff_involved_count: Number(r.staff_involved_count ?? r.staffInvolvedCount ?? 1),
    immediate_support_offered: !!(r.immediate_support_offered ?? r.immediateSupportOffered),
    immediate_support_accepted: !!(r.immediate_support_accepted ?? r.immediateSupportAccepted),
    debrief_completed: !!(r.debrief_completed ?? r.debriefCompleted),
    external_support_offered: !!(r.external_support_offered ?? r.externalSupportOffered),
    management_response_within_1h: !!(r.management_response_within_1h ?? r.managementResponseWithin1h),
    incident_documented: !!(r.incident_documented ?? r.incidentDocumented),
    lessons_identified: !!(r.lessons_identified ?? r.lessonsIdentified),
    staff_welfare_check_completed: !!(r.staff_welfare_check_completed ?? r.staffWelfareCheckCompleted),
  }));

  // ── Wellbeing follow-up records ───────────────────────────────────────
  const rawFollowups = (store.wellbeingFollowupRecords as any[] ?? []);
  const wellbeing_followup_records: WellbeingFollowupRecordInput[] = rawFollowups.map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? r.staffId ?? "",
    related_incident_id: r.related_incident_id ?? r.relatedIncidentId ?? "",
    followup_type: r.followup_type ?? r.followupType ?? "welfare_check",
    status: r.status ?? "completed",
    completed_on_time: !!(r.completed_on_time ?? r.completedOnTime),
    staff_satisfied: !!(r.staff_satisfied ?? r.staffSatisfied),
    outcome_positive: !!(r.outcome_positive ?? r.outcomePositive),
    days_since_incident: Number(r.days_since_incident ?? r.daysSinceIncident ?? 0),
    needs_further_followup: !!(r.needs_further_followup ?? r.needsFurtherFollowup),
    further_followup_scheduled: !!(r.further_followup_scheduled ?? r.furtherFollowupScheduled),
  }));

  // ── Learning extraction records ───────────────────────────────────────
  const rawLearning = (store.learningExtractionRecords as any[] ?? []);
  const learning_extraction_records: LearningExtractionRecordInput[] = rawLearning.map((r: any) => ({
    id: r.id ?? "",
    related_incident_id: r.related_incident_id ?? r.relatedIncidentId ?? "",
    learning_type: r.learning_type ?? r.learningType ?? "practice_change",
    learning_shared_with_team: !!(r.learning_shared_with_team ?? r.learningSharedWithTeam),
    implemented: !!(r.implemented),
    impact_assessed: !!(r.impact_assessed ?? r.impactAssessed),
    linked_to_training_plan: !!(r.linked_to_training_plan ?? r.linkedToTrainingPlan),
    documented_in_learning_log: !!(r.documented_in_learning_log ?? r.documentedInLearningLog),
    review_date_set: !!(r.review_date_set ?? r.reviewDateSet),
  }));

  // ── Support access records ────────────────────────────────────────────
  const rawSupport = (store.supportAccessRecords as any[] ?? []);
  const support_access_records: SupportAccessRecordInput[] = rawSupport.map((r: any) => ({
    id: r.id ?? "",
    staff_id: r.staff_id ?? r.staffId ?? "",
    support_type: r.support_type ?? r.supportType ?? "eap",
    access_route: r.access_route ?? r.accessRoute ?? "self_referral",
    accessed: !!(r.accessed),
    timely_access: !!(r.timely_access ?? r.timelyAccess),
    staff_found_helpful: !!(r.staff_found_helpful ?? r.staffFoundHelpful),
    barriers_reported: !!(r.barriers_reported ?? r.barriersReported),
    barrier_type: r.barrier_type ?? r.barrierType ?? "none",
    confidential: !!(r.confidential),
    repeat_access: !!(r.repeat_access ?? r.repeatAccess),
  }));

  const result = computeStaffDebriefingCriticalIncidentSupport({
    today,
    total_staff: staff.length,
    debriefing_records,
    critical_incident_records,
    wellbeing_followup_records,
    learning_extraction_records,
    support_access_records,
  });

  return NextResponse.json({ data: result });
}
