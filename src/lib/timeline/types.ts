// ══════════════════════════════════════════════════════════════════════════════
// CARA — UNIVERSAL TIMELINE TYPES
//
// Defines the type system for the Universal Timeline Engine.
// Every action across the platform maps to a TimelineEvent.
// ══════════════════════════════════════════════════════════════════════════════

export type TimelineEventType =
  | "daily_log_created" | "daily_log_updated"
  | "incident_submitted" | "incident_reviewed" | "incident_closed"
  | "risk_assessment_created" | "risk_assessment_updated" | "risk_level_changed"
  | "care_plan_created" | "care_plan_reviewed" | "care_plan_goal_updated"
  | "direct_work_completed" | "key_work_session_completed"
  | "safeguarding_concern_raised" | "safeguarding_referral_made"
  | "medication_administered" | "medication_error_reported"
  | "family_contact_recorded" | "professional_contact_recorded"
  | "education_update_recorded" | "health_update_recorded"
  | "missing_from_care_reported" | "missing_from_care_returned"
  | "restraint_recorded" | "body_map_completed"
  | "task_created" | "task_completed" | "task_overdue"
  | "document_uploaded" | "report_generated"
  | "placement_started" | "placement_ended"
  | "review_scheduled" | "review_completed"
  | "welfare_check_completed" | "night_check_completed"
  | "achievement_recorded" | "complaint_received"
  | "staff_supervision_completed" | "staff_training_completed"
  | "visitor_logged" | "fire_drill_completed"
  | "custom_event";

export type TimelineRiskLevel = "none" | "low" | "medium" | "high" | "critical";
export type TimelineVisibility = "standard" | "sensitive" | "restricted" | "safeguarding";

export interface TimelineEvent {
  id: string;
  event_type: TimelineEventType;
  child_id?: string;
  staff_id?: string;
  placement_id?: string;
  home_id?: string;
  title: string;
  summary: string;
  linked_record_type?: string;
  linked_record_id?: string;
  tags: string[];
  risk_level: TimelineRiskLevel;
  visibility_level: TimelineVisibility;
  metadata?: Record<string, unknown>;
  created_at: string;
  created_by: string;
}

export interface TimelineFilter {
  child_id?: string;
  staff_id?: string;
  home_id?: string;
  event_types?: TimelineEventType[];
  risk_levels?: TimelineRiskLevel[];
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
