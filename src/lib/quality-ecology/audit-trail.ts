// ══════════════════════════════════════════════════════════════════════════════
// Cara Quality Ecology — Audit Trail Engine
//
// Immutable audit logging for every action in the system. Every transition,
// approval, amendment, access decision, and break-glass event is captured.
//
// The audit trail serves:
//   1. Ofsted evidence — demonstrating quality processes
//   2. Reg 44 reporting — independent visitor review material
//   3. Safeguarding reviews — showing who knew what and when
//   4. Staff accountability — clear trail of actions
//   5. System integrity — detecting unauthorized access attempts
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

import type { LifecycleStatus } from "./types";
import type { Role } from "../permissions/types";

// ── Event Types ────────────────────────────────────────────────────────────

export type AuditEventType =
  | "lifecycle_transition"
  | "approval"
  | "rejection"
  | "amendment_created"
  | "amendment_approved"
  | "amendment_rejected"
  | "record_locked"
  | "record_filed"
  | "access_granted"
  | "access_denied"
  | "break_glass"
  | "temporary_grant_created"
  | "temporary_grant_expired"
  | "delegation_created"
  | "delegation_revoked"
  | "escalation"
  | "overdue_detected"
  | "qa_sample"
  | "login"
  | "logout"
  | "shift_start"
  | "shift_end"
  | "data_export"
  | "print"
  | "permission_change";

// ── Severity ───────────────────────────────────────────────────────────────

export type AuditSeverity = "info" | "warning" | "alert" | "critical";

// ── Audit Event ────────────────────────────────────────────────────────────

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  timestamp: string;
  userId: string;
  userRole: Role;
  homeId?: string;
  childId?: string;

  // Resource context
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;

  // Event details
  details: AuditEventDetails;

  // Metadata
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface AuditEventDetails {
  action: string;
  description: string;
  fromStatus?: LifecycleStatus;
  toStatus?: LifecycleStatus;
  reason?: string;
  outcome?: "success" | "denied" | "error";
  relatedUserId?: string;
  relatedResourceId?: string;
  metadata?: Record<string, any>;
}

// ── Audit Event Builder ────────────────────────────────────────────────────

export interface AuditEventInput {
  eventType: AuditEventType;
  userId: string;
  userRole: Role;
  homeId?: string;
  childId?: string;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  details: AuditEventDetails;
  now?: string;
}

export function buildAuditEvent(input: AuditEventInput): AuditEvent {
  const timestamp = input.now ?? new Date().toISOString();
  const severity = determineSeverity(input.eventType, input.details.outcome);

  return {
    id: `audit-${timestamp.replace(/[^0-9]/g, "")}-${Math.random().toString(36).slice(2, 8)}`,
    eventType: input.eventType,
    severity,
    timestamp,
    userId: input.userId,
    userRole: input.userRole,
    homeId: input.homeId,
    childId: input.childId,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    resourceName: input.resourceName,
    details: input.details,
  };
}

// ── Severity Determination ─────────────────────────────────────────────────

function determineSeverity(eventType: AuditEventType, outcome?: string): AuditSeverity {
  // Critical events
  if (eventType === "break_glass") return "critical";
  if (eventType === "access_denied" && outcome === "denied") return "warning";
  if (eventType === "escalation") return "alert";
  if (eventType === "permission_change") return "alert";
  if (eventType === "data_export") return "warning";

  // Warning events
  if (eventType === "overdue_detected") return "warning";
  if (eventType === "amendment_rejected") return "warning";

  // Info events
  return "info";
}

// ── Audit Filter ───────────────────────────────────────────────────────────

export interface AuditFilter {
  userId?: string;
  homeId?: string;
  childId?: string;
  eventTypes?: AuditEventType[];
  severity?: AuditSeverity[];
  resourceId?: string;
  fromDate?: string;
  toDate?: string;
}

export function filterAuditEvents(events: AuditEvent[], filter: AuditFilter): AuditEvent[] {
  return events.filter(event => {
    if (filter.userId && event.userId !== filter.userId) return false;
    if (filter.homeId && event.homeId !== filter.homeId) return false;
    if (filter.childId && event.childId !== filter.childId) return false;
    if (filter.eventTypes && !filter.eventTypes.includes(event.eventType)) return false;
    if (filter.severity && !filter.severity.includes(event.severity)) return false;
    if (filter.resourceId && event.resourceId !== filter.resourceId) return false;
    if (filter.fromDate && event.timestamp < filter.fromDate) return false;
    if (filter.toDate && event.timestamp > filter.toDate) return false;
    return true;
  });
}

// ── Audit Summary ──────────────────────────────────────────────────────────

export interface AuditSummary {
  totalEvents: number;
  byType: Record<string, number>;
  bySeverity: Record<AuditSeverity, number>;
  accessDeniedCount: number;
  breakGlassCount: number;
  escalationCount: number;
  amendmentCount: number;
  uniqueUsers: number;
  period: { from: string; to: string };
}

export function summarizeAuditEvents(
  events: AuditEvent[],
  from: string,
  to: string,
): AuditSummary {
  const filtered = events.filter(e => e.timestamp >= from && e.timestamp <= to);

  const byType: Record<string, number> = {};
  const bySeverity: Record<AuditSeverity, number> = { info: 0, warning: 0, alert: 0, critical: 0 };
  const users = new Set<string>();

  let accessDenied = 0;
  let breakGlass = 0;
  let escalations = 0;
  let amendments = 0;

  for (const event of filtered) {
    byType[event.eventType] = (byType[event.eventType] ?? 0) + 1;
    bySeverity[event.severity]++;
    users.add(event.userId);

    if (event.eventType === "access_denied") accessDenied++;
    if (event.eventType === "break_glass") breakGlass++;
    if (event.eventType === "escalation") escalations++;
    if (event.eventType === "amendment_created" || event.eventType === "amendment_approved") amendments++;
  }

  return {
    totalEvents: filtered.length,
    byType,
    bySeverity,
    accessDeniedCount: accessDenied,
    breakGlassCount: breakGlass,
    escalationCount: escalations,
    amendmentCount: amendments,
    uniqueUsers: users.size,
    period: { from, to },
  };
}

// ── Compliance Reporting Helpers ───────────────────────────────────────────

export function getEscalationEvents(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e => e.eventType === "escalation");
}

export function getAccessDenials(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e => e.eventType === "access_denied");
}

export function getBreakGlassEvents(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e => e.eventType === "break_glass");
}

export function getAmendmentEvents(events: AuditEvent[]): AuditEvent[] {
  return events.filter(e =>
    e.eventType === "amendment_created" ||
    e.eventType === "amendment_approved" ||
    e.eventType === "amendment_rejected"
  );
}

// ── Event Type Labels ──────────────────────────────────────────────────────

export const AUDIT_EVENT_LABELS: Record<AuditEventType, string> = {
  lifecycle_transition: "Status Change",
  approval: "Approved",
  rejection: "Returned",
  amendment_created: "Amendment Created",
  amendment_approved: "Amendment Approved",
  amendment_rejected: "Amendment Rejected",
  record_locked: "Record Locked",
  record_filed: "Record Filed",
  access_granted: "Access Granted",
  access_denied: "Access Denied",
  break_glass: "Break Glass Access",
  temporary_grant_created: "Temporary Access Granted",
  temporary_grant_expired: "Temporary Access Expired",
  delegation_created: "Delegation Created",
  delegation_revoked: "Delegation Revoked",
  escalation: "Escalation",
  overdue_detected: "Overdue Detected",
  qa_sample: "QA Sample",
  login: "Login",
  logout: "Logout",
  shift_start: "Shift Started",
  shift_end: "Shift Ended",
  data_export: "Data Export",
  print: "Print",
  permission_change: "Permission Change",
};
