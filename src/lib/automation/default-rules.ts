// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DEFAULT AUTOMATION RULES
// Built-in rules covering the core children's-home operational scenarios.
// Each rule maps a domain trigger to one or more deterministic actions.
// CHR 2015 Reg 12 (protection), Reg 13 (missing), Reg 20 (restraint),
// Reg 33 (employment), Reg 34 (leadership), Reg 35 (staffing), Reg 40
// (notification).  SCCIF: How well children are helped and protected.
// ══════════════════════════════════════════════════════════════════════════════

import type { AutomationRule } from "./types";

const NOW = new Date().toISOString();

export const DEFAULT_RULES: AutomationRule[] = [
  // ── 1. Incident Submitted ──────────────────────────────────────────────────
  {
    id: "rule_incident_submitted",
    name: "Incident Submitted — Full Response",
    description:
      "When any incident is submitted: create a manager review task, create a risk review task, add a timeline event, notify senior on shift and the registered manager, and mark the child for follow-up.",
    trigger: "incident_submitted",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Manager review of incident — {{incident_id}}", assignee_role: "registered_manager", due_hours: 24, priority: "high" } },
      { action: "create_risk_review_task", params: { title: "Risk review following incident — {{incident_id}}", due_hours: 48 } },
      { action: "add_timeline_event", params: { category: "incident", summary: "Incident submitted: {{incident_summary}}" } },
      { action: "notify_senior", params: { message: "New incident submitted for {{child_name}}: {{incident_summary}}" } },
      { action: "notify_manager", params: { message: "Incident {{incident_id}} requires your review within 24 hours" } },
      { action: "mark_child_followup", params: { reason: "Incident submitted", followup_hours: 24 } },
    ],
    enabled: true,
    priority: 10,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 2. Incident — High Severity ────────────────────────────────────────────
  {
    id: "rule_incident_severity_high",
    name: "High-Severity Incident — Escalation",
    description:
      "When an incident is flagged high or critical severity: escalate safeguarding visibility, flag the dashboard, and create a compliance alert.",
    trigger: "incident_severity_high",
    conditions: [],
    actions: [
      { action: "escalate_safeguarding", params: { reason: "High-severity incident — {{incident_id}}" } },
      { action: "flag_dashboard", params: { flag: "high_severity_incident", child_id: "{{child_id}}" } },
      { action: "create_compliance_alert", params: { title: "High-severity incident requires Ofsted notification assessment", reg_ref: "Reg 40" } },
      { action: "log_audit_event", params: { event: "high_severity_incident_escalated", incident_id: "{{incident_id}}" } },
    ],
    enabled: true,
    priority: 5,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 3. Risk Review Due in 7 Days ───────────────────────────────────────────
  {
    id: "rule_risk_review_due_7_days",
    name: "Risk Review Due — 7-Day Reminder",
    description:
      "Seven days before a risk assessment review is due: create a reminder task for the key worker, flag the child dashboard, and notify allocated staff.",
    trigger: "risk_review_due_7_days",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Risk assessment review due for {{child_name}}", assignee_role: "key_worker", due_days: 7, priority: "medium" } },
      { action: "flag_dashboard", params: { flag: "risk_review_due", child_id: "{{child_id}}" } },
      { action: "notify_staff", params: { message: "Risk assessment review for {{child_name}} is due in 7 days" } },
    ],
    enabled: true,
    priority: 20,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 4. Daily Log Missing by 9 PM ──────────────────────────────────────────
  {
    id: "rule_daily_log_missing_9pm",
    name: "Daily Log Missing — 9 PM Alert",
    description:
      "If a child's daily log has not been created by 9 PM: create an alert task, notify the shift senior, and log a compliance warning.",
    trigger: "daily_log_missing_9pm",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Daily log missing for {{child_name}} — complete immediately", assignee_role: "shift_senior", due_hours: 2, priority: "high" } },
      { action: "notify_senior", params: { message: "Daily log for {{child_name}} has not been completed. Please ensure it is done before end of shift." } },
      { action: "update_compliance_status", params: { area: "daily_recording", status: "non_compliant", child_id: "{{child_id}}" } },
    ],
    enabled: true,
    priority: 15,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 5. Direct Work Gap — 7 Days ───────────────────────────────────────────
  {
    id: "rule_direct_work_gap_7_days",
    name: "Direct Work Gap — 7-Day Alert",
    description:
      "When no direct work session has been recorded for a child in 7 days: create a task for the key worker and flag the child dashboard.",
    trigger: "direct_work_gap_7_days",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Direct work session overdue for {{child_name}} — schedule within 48 hours", assignee_role: "key_worker", due_hours: 48, priority: "medium" } },
      { action: "flag_dashboard", params: { flag: "direct_work_overdue", child_id: "{{child_id}}" } },
    ],
    enabled: true,
    priority: 25,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 6. Safeguarding Concern Created ────────────────────────────────────────
  {
    id: "rule_safeguarding_concern_created",
    name: "Safeguarding Concern — Immediate Response",
    description:
      "When a safeguarding concern is raised: escalate visibility, notify the registered manager, create an action task, add a timeline event, and log an audit record.",
    trigger: "safeguarding_concern_created",
    conditions: [],
    actions: [
      { action: "escalate_safeguarding", params: { reason: "New safeguarding concern — {{concern_summary}}" } },
      { action: "notify_manager", params: { message: "Safeguarding concern raised for {{child_name}}: {{concern_summary}}. Immediate action required." } },
      { action: "create_task", params: { title: "Action safeguarding concern for {{child_name}}", assignee_role: "registered_manager", due_hours: 4, priority: "critical" } },
      { action: "add_timeline_event", params: { category: "safeguarding", summary: "Safeguarding concern raised: {{concern_summary}}" } },
      { action: "log_audit_event", params: { event: "safeguarding_concern_created", child_id: "{{child_id}}", detail: "{{concern_summary}}" } },
    ],
    enabled: true,
    priority: 1,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 7. Missing from Care Reported ──────────────────────────────────────────
  {
    id: "rule_missing_from_care_reported",
    name: "Missing from Care — Immediate Protocol",
    description:
      "When a child is reported missing: notify the police liaison contact, create a return interview task, add a timeline event, and flag the dashboard.",
    trigger: "missing_from_care_reported",
    conditions: [],
    actions: [
      { action: "send_notification", params: { role: "police_liaison", message: "{{child_name}} reported missing from care at {{reported_time}}. Missing protocol initiated." } },
      { action: "create_task", params: { title: "Return interview for {{child_name}} upon return", assignee_role: "independent_person", due_hours: 72, priority: "high" } },
      { action: "add_timeline_event", params: { category: "missing", summary: "{{child_name}} reported missing from care" } },
      { action: "flag_dashboard", params: { flag: "missing_from_care", child_id: "{{child_id}}" } },
      { action: "notify_manager", params: { message: "{{child_name}} reported missing. Missing-from-care protocol activated." } },
    ],
    enabled: true,
    priority: 2,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 8. Restraint Used ──────────────────────────────────────────────────────
  {
    id: "rule_restraint_used",
    name: "Restraint Used — Post-Incident Protocol",
    description:
      "When physical intervention / restraint is used: create a body map task, create a PI debrief task, create a manager review task, notify the RI, and add a timeline event.",
    trigger: "restraint_used",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Complete body map for {{child_name}} following restraint", assignee_role: "shift_senior", due_hours: 1, priority: "critical" } },
      { action: "create_task", params: { title: "PI debrief — child and staff — {{child_name}}", assignee_role: "registered_manager", due_hours: 24, priority: "high" } },
      { action: "create_task", params: { title: "Manager review of restraint for {{child_name}}", assignee_role: "registered_manager", due_hours: 24, priority: "high" } },
      { action: "notify_manager", params: { message: "Restraint used on {{child_name}}. Body map, debrief, and review required. Reg 20 compliance." } },
      { action: "add_timeline_event", params: { category: "restraint", summary: "Physical intervention used: {{restraint_summary}}" } },
      { action: "log_audit_event", params: { event: "restraint_used", child_id: "{{child_id}}" } },
    ],
    enabled: true,
    priority: 3,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 9. Medication Missed ───────────────────────────────────────────────────
  {
    id: "rule_medication_missed",
    name: "Medication Missed — Alert & Record",
    description:
      "When a medication administration is missed: create an alert for the senior on shift, notify senior staff, and add a timeline event.",
    trigger: "medication_missed",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Medication missed for {{child_name}} — {{medication_name}} — action required", assignee_role: "shift_senior", due_hours: 1, priority: "critical" } },
      { action: "notify_senior", params: { message: "Medication missed: {{medication_name}} for {{child_name}}. Immediate attention required." } },
      { action: "add_timeline_event", params: { category: "medication", summary: "Medication missed: {{medication_name}}" } },
      { action: "log_audit_event", params: { event: "medication_missed", child_id: "{{child_id}}", medication: "{{medication_name}}" } },
    ],
    enabled: true,
    priority: 5,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 10. Care Plan Review Due ───────────────────────────────────────────────
  {
    id: "rule_care_plan_review_due",
    name: "Care Plan Review Due — Schedule & Notify",
    description:
      "When a care plan review is approaching: schedule the review meeting, create preparation tasks, and notify the key worker.",
    trigger: "care_plan_review_due",
    conditions: [],
    actions: [
      { action: "schedule_review", params: { type: "care_plan", child_id: "{{child_id}}", due_days: 14 } },
      { action: "create_task", params: { title: "Prepare care plan review for {{child_name}}", assignee_role: "key_worker", due_days: 7, priority: "medium" } },
      { action: "notify_staff", params: { message: "Care plan review for {{child_name}} is due. Please begin preparation." } },
    ],
    enabled: true,
    priority: 20,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 11. Report Generated — Auto-Aggregate ─────────────────────────────────
  {
    id: "rule_report_generated",
    name: "Report Generated — Pull All Sources",
    description:
      "When a formal report is generated: pull data from all relevant sources automatically and include in the report package.",
    trigger: "report_generated",
    conditions: [],
    actions: [
      { action: "include_in_report", params: { sources: ["incidents", "risk_assessments", "safeguarding", "daily_logs", "direct_work", "medication", "missing_episodes", "restraints"] } },
      { action: "log_audit_event", params: { event: "report_generated", report_type: "{{report_type}}", child_id: "{{child_id}}" } },
    ],
    enabled: true,
    priority: 30,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 12. Placement Ending in 28 Days ────────────────────────────────────────
  {
    id: "rule_placement_ending_28_days",
    name: "Placement Ending — 28-Day Transition Planning",
    description:
      "Twenty-eight days before a placement ends: create a transition planning task, notify the allocated social worker, and add a timeline event.",
    trigger: "placement_ending_28_days",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Transition planning for {{child_name}} — placement ending", assignee_role: "key_worker", due_days: 14, priority: "high" } },
      { action: "send_notification", params: { role: "social_worker", message: "Placement for {{child_name}} is ending in 28 days. Transition planning required." } },
      { action: "add_timeline_event", params: { category: "placement", summary: "Placement ending in 28 days — transition planning initiated" } },
      { action: "flag_dashboard", params: { flag: "placement_ending", child_id: "{{child_id}}" } },
    ],
    enabled: true,
    priority: 15,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 13. Staff Supervision Overdue ──────────────────────────────────────────
  {
    id: "rule_staff_supervision_overdue",
    name: "Staff Supervision Overdue — Chase",
    description:
      "When a staff member's supervision is overdue: create a task for the line manager and notify the registered manager.",
    trigger: "staff_supervision_overdue",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Schedule supervision for {{staff_name}} — overdue", assignee_role: "line_manager", due_days: 3, priority: "high" } },
      { action: "notify_manager", params: { message: "Supervision for {{staff_name}} is overdue. Reg 33 compliance at risk." } },
      { action: "update_compliance_status", params: { area: "supervision", status: "overdue", staff_id: "{{staff_id}}" } },
    ],
    enabled: true,
    priority: 20,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 14. Training Expiring ──────────────────────────────────────────────────
  {
    id: "rule_training_expiring",
    name: "Training Expiring — Renewal Alert",
    description:
      "When a staff member's mandatory training is about to expire: create a renewal task and raise a compliance alert.",
    trigger: "training_expiring",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Renew {{training_name}} training for {{staff_name}}", assignee_role: "training_coordinator", due_days: 14, priority: "medium" } },
      { action: "create_compliance_alert", params: { title: "{{training_name}} training expiring for {{staff_name}}", reg_ref: "Reg 33" } },
      { action: "notify_manager", params: { message: "{{training_name}} training for {{staff_name}} expires soon. Please arrange renewal." } },
    ],
    enabled: true,
    priority: 25,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 15. Compliance Breach ──────────────────────────────────────────────────
  {
    id: "rule_compliance_breach",
    name: "Compliance Breach — Flag & Action Plan",
    description:
      "When a compliance breach is detected: flag the dashboard, notify the RI, create an action plan task, and log the audit event.",
    trigger: "compliance_breach",
    conditions: [],
    actions: [
      { action: "flag_dashboard", params: { flag: "compliance_breach", area: "{{breach_area}}" } },
      { action: "notify_manager", params: { message: "Compliance breach detected in {{breach_area}}. Immediate action plan required." } },
      { action: "create_task", params: { title: "Action plan for compliance breach — {{breach_area}}", assignee_role: "registered_manager", due_hours: 24, priority: "critical" } },
      { action: "log_audit_event", params: { event: "compliance_breach", area: "{{breach_area}}", detail: "{{breach_detail}}" } },
    ],
    enabled: true,
    priority: 5,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 16. Medication Error ───────────────────────────────────────────────────
  {
    id: "rule_medication_error",
    name: "Medication Error — Escalation",
    description:
      "When a medication error is reported: notify the registered manager, create an investigation task, flag the dashboard, and add a timeline event.",
    trigger: "medication_error",
    conditions: [],
    actions: [
      { action: "notify_manager", params: { message: "Medication error reported for {{child_name}}: {{error_summary}}. Immediate review required." } },
      { action: "create_task", params: { title: "Investigate medication error — {{child_name}}", assignee_role: "registered_manager", due_hours: 12, priority: "critical" } },
      { action: "flag_dashboard", params: { flag: "medication_error", child_id: "{{child_id}}" } },
      { action: "add_timeline_event", params: { category: "medication", summary: "Medication error: {{error_summary}}" } },
      { action: "log_audit_event", params: { event: "medication_error", child_id: "{{child_id}}", detail: "{{error_summary}}" } },
    ],
    enabled: true,
    priority: 5,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 17. Safeguarding Referral Required ─────────────────────────────────────
  {
    id: "rule_safeguarding_referral_required",
    name: "Safeguarding Referral Required — External Notification",
    description:
      "When a safeguarding concern requires external referral: create a referral task, escalate safeguarding, notify manager, and create a compliance alert for Ofsted notification.",
    trigger: "safeguarding_referral_required",
    conditions: [],
    actions: [
      { action: "create_task", params: { title: "Complete safeguarding referral to {{referral_body}} for {{child_name}}", assignee_role: "registered_manager", due_hours: 4, priority: "critical" } },
      { action: "escalate_safeguarding", params: { reason: "External referral required — {{referral_body}}" } },
      { action: "notify_manager", params: { message: "Safeguarding referral required for {{child_name}} to {{referral_body}}. 4-hour deadline." } },
      { action: "create_compliance_alert", params: { title: "Safeguarding referral — Ofsted notification may be required", reg_ref: "Reg 40" } },
      { action: "log_audit_event", params: { event: "safeguarding_referral_required", child_id: "{{child_id}}", referral_body: "{{referral_body}}" } },
    ],
    enabled: true,
    priority: 1,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },

  // ── 18. Task Overdue ───────────────────────────────────────────────────────
  {
    id: "rule_task_overdue",
    name: "Task Overdue — Escalation",
    description:
      "When a task passes its due date: notify the assigned staff member's manager and flag the dashboard.",
    trigger: "task_overdue",
    conditions: [],
    actions: [
      { action: "notify_manager", params: { message: "Task '{{task_title}}' assigned to {{assignee_name}} is overdue. Please follow up." } },
      { action: "flag_dashboard", params: { flag: "task_overdue", task_id: "{{task_id}}" } },
    ],
    enabled: true,
    priority: 30,
    created_by: "system",
    created_at: NOW,
    updated_at: NOW,
    run_count: 0,
  },
];
