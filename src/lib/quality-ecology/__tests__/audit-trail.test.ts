// ══════════════════════════════════════════════════════════════════════════════
// Cara Quality Ecology — Audit Trail Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  buildAuditEvent,
  filterAuditEvents,
  summarizeAuditEvents,
  getEscalationEvents,
  getAccessDenials,
  getBreakGlassEvents,
  getAmendmentEvents,
  AUDIT_EVENT_LABELS,
} from "../audit-trail";
import type { AuditEvent, AuditEventInput } from "../audit-trail";

// ── Constants ──────────────────────────────────────────────────────────────

const FIXED_NOW = "2026-05-16T12:00:00Z";

// ── Factory Helpers ────────────────────────────────────────────────────────

function makeEvent(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    id: "audit-1",
    eventType: "lifecycle_transition",
    severity: "info",
    timestamp: FIXED_NOW,
    userId: "user-1",
    userRole: "team_leader",
    homeId: "home-1",
    details: {
      action: "transition",
      description: "Moved from submitted to checked.",
      fromStatus: "submitted",
      toStatus: "checked",
      outcome: "success",
    },
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// buildAuditEvent
// ══════════════════════════════════════════════════════════════════════════════

describe("buildAuditEvent", () => {
  it("builds a basic audit event", () => {
    const input: AuditEventInput = {
      eventType: "lifecycle_transition",
      userId: "user-1",
      userRole: "team_leader",
      homeId: "home-1",
      resourceType: "scheduled_occurrence",
      resourceId: "occ-1",
      details: {
        action: "transition",
        description: "Approved daily fire check.",
        fromStatus: "checked",
        toStatus: "approved",
        outcome: "success",
      },
      now: FIXED_NOW,
    };
    const event = buildAuditEvent(input);
    expect(event.eventType).toBe("lifecycle_transition");
    expect(event.severity).toBe("info");
    expect(event.timestamp).toBe(FIXED_NOW);
    expect(event.userId).toBe("user-1");
    expect(event.userRole).toBe("team_leader");
  });

  it("generates unique ID", () => {
    const input: AuditEventInput = {
      eventType: "approval",
      userId: "user-1",
      userRole: "deputy_manager",
      details: { action: "approve", description: "Approved." },
      now: FIXED_NOW,
    };
    const event1 = buildAuditEvent(input);
    const event2 = buildAuditEvent(input);
    expect(event1.id).not.toBe(event2.id);
  });

  it("sets critical severity for break_glass", () => {
    const event = buildAuditEvent({
      eventType: "break_glass",
      userId: "user-1",
      userRole: "registered_manager",
      details: { action: "break_glass", description: "Emergency access." },
      now: FIXED_NOW,
    });
    expect(event.severity).toBe("critical");
  });

  it("sets warning severity for access_denied", () => {
    const event = buildAuditEvent({
      eventType: "access_denied",
      userId: "user-1",
      userRole: "rsw",
      details: { action: "view", description: "Denied access.", outcome: "denied" },
      now: FIXED_NOW,
    });
    expect(event.severity).toBe("warning");
  });

  it("sets alert severity for escalation", () => {
    const event = buildAuditEvent({
      eventType: "escalation",
      userId: "system",
      userRole: "team_leader",
      details: { action: "escalate", description: "Overdue escalated." },
      now: FIXED_NOW,
    });
    expect(event.severity).toBe("alert");
  });

  it("sets alert severity for permission_change", () => {
    const event = buildAuditEvent({
      eventType: "permission_change",
      userId: "user-admin",
      userRole: "registered_manager",
      details: { action: "change_role", description: "Role updated." },
      now: FIXED_NOW,
    });
    expect(event.severity).toBe("alert");
  });

  it("sets warning severity for data_export", () => {
    const event = buildAuditEvent({
      eventType: "data_export",
      userId: "user-1",
      userRole: "registered_manager",
      details: { action: "export", description: "Exported records." },
      now: FIXED_NOW,
    });
    expect(event.severity).toBe("warning");
  });

  it("includes optional resource context", () => {
    const event = buildAuditEvent({
      eventType: "qa_sample",
      userId: "user-1",
      userRole: "deputy_manager",
      resourceType: "fire_check",
      resourceId: "occ-123",
      resourceName: "Daily Fire Check — 16/05/2026",
      childId: "child-1",
      details: { action: "qa_sample", description: "Sampled." },
      now: FIXED_NOW,
    });
    expect(event.resourceType).toBe("fire_check");
    expect(event.resourceId).toBe("occ-123");
    expect(event.resourceName).toBe("Daily Fire Check — 16/05/2026");
    expect(event.childId).toBe("child-1");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// filterAuditEvents
// ══════════════════════════════════════════════════════════════════════════════

describe("filterAuditEvents", () => {
  const events: AuditEvent[] = [
    makeEvent({ id: "a-1", userId: "user-1", homeId: "home-1", eventType: "approval", severity: "info" }),
    makeEvent({ id: "a-2", userId: "user-2", homeId: "home-1", eventType: "access_denied", severity: "warning" }),
    makeEvent({ id: "a-3", userId: "user-1", homeId: "home-2", eventType: "escalation", severity: "alert" }),
    makeEvent({ id: "a-4", userId: "user-3", homeId: "home-1", eventType: "break_glass", severity: "critical", childId: "child-1" }),
    makeEvent({ id: "a-5", userId: "user-1", homeId: "home-1", eventType: "amendment_created", severity: "info", timestamp: "2026-05-15T08:00:00Z" }),
  ];

  it("filters by userId", () => {
    const result = filterAuditEvents(events, { userId: "user-1" });
    expect(result).toHaveLength(3);
    expect(result.every(e => e.userId === "user-1")).toBe(true);
  });

  it("filters by homeId", () => {
    const result = filterAuditEvents(events, { homeId: "home-2" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a-3");
  });

  it("filters by eventTypes", () => {
    const result = filterAuditEvents(events, { eventTypes: ["approval", "break_glass"] });
    expect(result).toHaveLength(2);
  });

  it("filters by severity", () => {
    const result = filterAuditEvents(events, { severity: ["warning", "critical"] });
    expect(result).toHaveLength(2);
  });

  it("filters by childId", () => {
    const result = filterAuditEvents(events, { childId: "child-1" });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a-4");
  });

  it("filters by date range", () => {
    const result = filterAuditEvents(events, {
      fromDate: "2026-05-16T00:00:00Z",
      toDate: "2026-05-16T23:59:59Z",
    });
    expect(result).toHaveLength(4); // All except a-5 which is May 15
  });

  it("combines multiple filters", () => {
    const result = filterAuditEvents(events, {
      userId: "user-1",
      homeId: "home-1",
    });
    expect(result).toHaveLength(2); // a-1 and a-5
  });

  it("returns all when no filters", () => {
    const result = filterAuditEvents(events, {});
    expect(result).toHaveLength(5);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// summarizeAuditEvents
// ══════════════════════════════════════════════════════════════════════════════

describe("summarizeAuditEvents", () => {
  const events: AuditEvent[] = [
    makeEvent({ id: "a-1", userId: "user-1", eventType: "approval", severity: "info" }),
    makeEvent({ id: "a-2", userId: "user-2", eventType: "access_denied", severity: "warning" }),
    makeEvent({ id: "a-3", userId: "user-1", eventType: "escalation", severity: "alert" }),
    makeEvent({ id: "a-4", userId: "user-3", eventType: "break_glass", severity: "critical" }),
    makeEvent({ id: "a-5", userId: "user-1", eventType: "amendment_created", severity: "info" }),
    makeEvent({ id: "a-6", userId: "user-2", eventType: "amendment_approved", severity: "info" }),
  ];

  it("summarizes event counts", () => {
    const summary = summarizeAuditEvents(events, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.totalEvents).toBe(6);
  });

  it("groups by type", () => {
    const summary = summarizeAuditEvents(events, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.byType.approval).toBe(1);
    expect(summary.byType.access_denied).toBe(1);
    expect(summary.byType.escalation).toBe(1);
    expect(summary.byType.break_glass).toBe(1);
    expect(summary.byType.amendment_created).toBe(1);
    expect(summary.byType.amendment_approved).toBe(1);
  });

  it("groups by severity", () => {
    const summary = summarizeAuditEvents(events, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.bySeverity.info).toBe(3);
    expect(summary.bySeverity.warning).toBe(1);
    expect(summary.bySeverity.alert).toBe(1);
    expect(summary.bySeverity.critical).toBe(1);
  });

  it("counts specific event types", () => {
    const summary = summarizeAuditEvents(events, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.accessDeniedCount).toBe(1);
    expect(summary.breakGlassCount).toBe(1);
    expect(summary.escalationCount).toBe(1);
    expect(summary.amendmentCount).toBe(2);
  });

  it("counts unique users", () => {
    const summary = summarizeAuditEvents(events, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.uniqueUsers).toBe(3);
  });

  it("respects date range", () => {
    const mixedEvents = [
      makeEvent({ id: "a-1", timestamp: "2026-05-15T12:00:00Z" }),
      makeEvent({ id: "a-2", timestamp: "2026-05-16T12:00:00Z" }),
      makeEvent({ id: "a-3", timestamp: "2026-05-17T12:00:00Z" }),
    ];
    const summary = summarizeAuditEvents(mixedEvents, "2026-05-16T00:00:00Z", "2026-05-16T23:59:59Z");
    expect(summary.totalEvents).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper filter functions
// ══════════════════════════════════════════════════════════════════════════════

describe("event filter helpers", () => {
  const events: AuditEvent[] = [
    makeEvent({ id: "a-1", eventType: "escalation" }),
    makeEvent({ id: "a-2", eventType: "access_denied" }),
    makeEvent({ id: "a-3", eventType: "break_glass" }),
    makeEvent({ id: "a-4", eventType: "amendment_created" }),
    makeEvent({ id: "a-5", eventType: "amendment_approved" }),
    makeEvent({ id: "a-6", eventType: "amendment_rejected" }),
    makeEvent({ id: "a-7", eventType: "approval" }),
  ];

  it("getEscalationEvents returns only escalations", () => {
    expect(getEscalationEvents(events)).toHaveLength(1);
  });

  it("getAccessDenials returns only denials", () => {
    expect(getAccessDenials(events)).toHaveLength(1);
  });

  it("getBreakGlassEvents returns only break glass", () => {
    expect(getBreakGlassEvents(events)).toHaveLength(1);
  });

  it("getAmendmentEvents returns all amendment types", () => {
    expect(getAmendmentEvents(events)).toHaveLength(3);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT_EVENT_LABELS
// ══════════════════════════════════════════════════════════════════════════════

describe("AUDIT_EVENT_LABELS", () => {
  it("has labels for all event types", () => {
    const types = [
      "lifecycle_transition", "approval", "rejection", "amendment_created",
      "amendment_approved", "amendment_rejected", "record_locked", "record_filed",
      "access_granted", "access_denied", "break_glass", "temporary_grant_created",
      "temporary_grant_expired", "delegation_created", "delegation_revoked",
      "escalation", "overdue_detected", "qa_sample", "login", "logout",
      "shift_start", "shift_end", "data_export", "print", "permission_change",
    ];
    for (const type of types) {
      expect(AUDIT_EVENT_LABELS[type as keyof typeof AUDIT_EVENT_LABELS]).toBeDefined();
      expect(AUDIT_EVENT_LABELS[type as keyof typeof AUDIT_EVENT_LABELS].length).toBeGreaterThan(0);
    }
  });
});
