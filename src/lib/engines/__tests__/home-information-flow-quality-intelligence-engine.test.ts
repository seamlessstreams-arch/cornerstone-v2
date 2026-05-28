import { describe, it, expect } from "vitest";
import {
  computeInformationFlowQuality,
  type InformationFlowQualityInput,
  type HandoverInput,
  type DailyLogInput,
  type CareEventSummaryInput,
  type NotificationSummaryInput,
} from "../home-information-flow-quality-intelligence-engine";

// ── Factory Helpers ─────────────────────────────────────────────────────────

function makeHandover(overrides: Partial<HandoverInput> = {}): HandoverInput {
  return {
    id: "h-1", shift_date: "2025-03-15", shift_type: "day", handed_over_by: "staff-1",
    received_by: "staff-2", has_content: true, items_count: 5, urgent_items_count: 1,
    children_mentioned_count: 4, total_children: 6, completed: true, created_at: "2025-03-15T07:00:00Z",
    ...overrides,
  };
}

function makeDailyLog(overrides: Partial<DailyLogInput> = {}): DailyLogInput {
  return {
    id: "dl-1", child_id: "child-1", date: "2025-03-15", staff_id: "staff-1",
    has_content: true, word_count: 120, categories_count: 3, has_mood_rating: true,
    has_incident_reference: false, created_at: "2025-03-15T18:00:00Z",
    ...overrides,
  };
}

function makeCareEvent(overrides: Partial<CareEventSummaryInput> = {}): CareEventSummaryInput {
  return {
    id: "ce-1", child_id: "child-1", staff_id: "staff-1", category: "health",
    date: "2025-03-15", is_significant: false, is_verified: true,
    has_handover_note: false, has_follow_up: true,
    ...overrides,
  };
}

function makeNotification(overrides: Partial<NotificationSummaryInput> = {}): NotificationSummaryInput {
  return {
    id: "notif-1", recipient_id: "staff-1", priority: "normal",
    read: true, entity_type: null, created_at: "2025-03-15T08:00:00Z",
    ...overrides,
  };
}

function baseInput(overrides: Partial<InformationFlowQualityInput> = {}): InformationFlowQualityInput {
  return {
    today: "2025-03-15", total_staff: 10, total_children: 6,
    handovers: [], daily_logs: [], care_events: [], notifications: [],
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("computeInformationFlowQuality", () => {
  describe("special cases", () => {
    it("returns insufficient_data when all empty and no children/staff", () => {
      const r = computeInformationFlowQuality(baseInput({ total_staff: 0, total_children: 0 }));
      expect(r.flow_rating).toBe("insufficient_data");
      expect(r.flow_score).toBe(0);
    });

    it("returns inadequate (score 15) when all empty but children exist", () => {
      const r = computeInformationFlowQuality(baseInput({ total_children: 6 }));
      expect(r.flow_rating).toBe("inadequate");
      expect(r.flow_score).toBe(15);
    });

    it("insufficient_data has zero metrics", () => {
      const r = computeInformationFlowQuality(baseInput({ total_staff: 0, total_children: 0 }));
      expect(r.handover_completion_rate).toBe(0);
      expect(r.daily_log_coverage_rate).toBe(0);
      expect(r.notification_read_rate).toBe(0);
    });

    it("insufficient_data has a concern", () => {
      const r = computeInformationFlowQuality(baseInput({ total_staff: 0, total_children: 0 }));
      expect(r.concerns.length).toBeGreaterThan(0);
    });

    it("insufficient_data headline mentions insufficient data", () => {
      const r = computeInformationFlowQuality(baseInput({ total_staff: 0, total_children: 0 }));
      expect(r.headline).toContain("Insufficient data");
    });

    it("all empty with children has critical insight", () => {
      const r = computeInformationFlowQuality(baseInput({ total_children: 6 }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("all empty with children has 2 immediate recommendations", () => {
      const r = computeInformationFlowQuality(baseInput({ total_children: 6 }));
      expect(r.recommendations.filter(rec => rec.urgency === "immediate").length).toBe(2);
    });

    it("all empty with children headline mentions communication failure", () => {
      const r = computeInformationFlowQuality(baseInput({ total_children: 6 }));
      expect(r.headline).toContain("communication failure");
    });
  });

  describe("metric calculations", () => {
    it("calculates handover_completion_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: [
          makeHandover({ id: "h-1", completed: true }),
          makeHandover({ id: "h-2", completed: true }),
          makeHandover({ id: "h-3", completed: false }),
        ],
      }));
      expect(r.handover_completion_rate).toBe(67);
    });

    it("calculates handover_content_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: [
          makeHandover({ id: "h-1", has_content: true }),
          makeHandover({ id: "h-2", has_content: false }),
        ],
      }));
      expect(r.handover_content_rate).toBe(50);
    });

    it("calculates daily_log_coverage_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_children: 4,
        daily_logs: [
          makeDailyLog({ id: "dl-1", child_id: "c-1" }),
          makeDailyLog({ id: "dl-2", child_id: "c-2" }),
          makeDailyLog({ id: "dl-3", child_id: "c-1" }),
        ],
      }));
      expect(r.daily_log_coverage_rate).toBe(50); // 2/4
    });

    it("calculates daily_log_quality_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        daily_logs: [
          makeDailyLog({ id: "dl-1", word_count: 120 }),
          makeDailyLog({ id: "dl-2", word_count: 30 }),
          makeDailyLog({ id: "dl-3", word_count: 80 }),
        ],
      }));
      expect(r.daily_log_quality_rate).toBe(67); // 2/3 with >=50 words
    });

    it("calculates significant_event_handover_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        care_events: [
          makeCareEvent({ id: "ce-1", is_significant: true, has_handover_note: true }),
          makeCareEvent({ id: "ce-2", is_significant: true, has_handover_note: false }),
          makeCareEvent({ id: "ce-3", is_significant: false }),
        ],
      }));
      expect(r.significant_event_handover_rate).toBe(50); // 1/2 significant
    });

    it("calculates care_event_verification_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        care_events: [
          makeCareEvent({ id: "ce-1", is_verified: true }),
          makeCareEvent({ id: "ce-2", is_verified: true }),
          makeCareEvent({ id: "ce-3", is_verified: false }),
        ],
      }));
      expect(r.care_event_verification_rate).toBe(67);
    });

    it("calculates notification_read_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        notifications: [
          makeNotification({ id: "n-1", read: true }),
          makeNotification({ id: "n-2", read: true }),
          makeNotification({ id: "n-3", read: false }),
        ],
      }));
      expect(r.notification_read_rate).toBe(67);
    });

    it("calculates urgent_notification_read_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        notifications: [
          makeNotification({ id: "n-1", priority: "urgent", read: true }),
          makeNotification({ id: "n-2", priority: "high", read: false }),
          makeNotification({ id: "n-3", priority: "normal", read: false }),
        ],
      }));
      expect(r.urgent_notification_read_rate).toBe(50); // 1/2 urgent/high
    });

    it("calculates information_continuity_score correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_children: 1,
        handovers: [makeHandover({ id: "h-1", completed: true })], // 100%
        daily_logs: [makeDailyLog({ id: "dl-1", child_id: "c-1" })], // 100% (1 child)
        care_events: [makeCareEvent({ id: "ce-1", is_verified: true })], // 100%
        notifications: [makeNotification({ id: "n-1", read: true })], // 100%
      }));
      expect(r.information_continuity_score).toBe(100); // avg of four 100s
    });

    it("calculates staff_engagement_rate correctly", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_staff: 5,
        handovers: [makeHandover({ id: "h-1", handed_over_by: "s-1", received_by: "s-2" })],
        daily_logs: [makeDailyLog({ id: "dl-1", staff_id: "s-3" })],
        care_events: [makeCareEvent({ id: "ce-1", staff_id: "s-1" })],
      }));
      expect(r.staff_engagement_rate).toBe(60); // 3 unique / 5 total
    });

    it("staff engagement counts unique staff across all types", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_staff: 4,
        handovers: [makeHandover({ id: "h-1", handed_over_by: "s-1", received_by: "s-2" })],
        daily_logs: [makeDailyLog({ id: "dl-1", staff_id: "s-1" })], // duplicate
        care_events: [makeCareEvent({ id: "ce-1", staff_id: "s-3" })],
      }));
      expect(r.staff_engagement_rate).toBe(75); // 3/4
    });
  });

  describe("score bonuses", () => {
    it("handover completion >= 95 gives +4", () => {
      const handovers = Array.from({ length: 20 }, (_, i) => makeHandover({ id: `h-${i}`, completed: true }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.handover_completion_rate).toBe(100);
    });

    it("handover completion 80-94 gives +2", () => {
      const handovers = Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 9 }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.handover_completion_rate).toBe(90);
    });

    it("daily log coverage >= 90 gives +4", () => {
      const logs = Array.from({ length: 6 }, (_, i) => makeDailyLog({ id: `dl-${i}`, child_id: `c-${i}` }));
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.daily_log_coverage_rate).toBe(100);
    });

    it("significant event handover >= 90 gives +4", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_significant: true, has_handover_note: true,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.significant_event_handover_rate).toBe(100);
    });

    it("care event verification >= 90 gives +3", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_verified: true,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.care_event_verification_rate).toBe(100);
    });

    it("notification read rate >= 90 gives +3", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: true,
      }));
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.notification_read_rate).toBe(100);
    });

    it("urgent notification read rate 100 gives +2", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: true }),
        makeNotification({ id: "n-2", priority: "high", read: true }),
      ];
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.urgent_notification_read_rate).toBe(100);
    });

    it("staff engagement >= 80 gives +2", () => {
      const handovers = Array.from({ length: 5 }, (_, i) => makeHandover({
        id: `h-${i}`, handed_over_by: `s-${i * 2}`, received_by: `s-${i * 2 + 1}`,
      }));
      const r = computeInformationFlowQuality(baseInput({ total_staff: 10, handovers }));
      expect(r.staff_engagement_rate).toBe(100);
    });
  });

  describe("score penalties", () => {
    it("handover completion < 50 gives -5", () => {
      const handovers = Array.from({ length: 10 }, (_, i) => makeHandover({
        id: `h-${i}`, completed: i < 4,
      }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.handover_completion_rate).toBe(40);
    });

    it("significant event handover < 50 gives -5", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_significant: true, has_handover_note: i < 4,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.significant_event_handover_rate).toBe(40);
    });

    it("urgent notification read rate < 70 gives -5", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 5,
      }));
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.urgent_notification_read_rate).toBe(50);
    });

    it("daily log coverage < 40 gives -3", () => {
      const logs = [makeDailyLog({ id: "dl-1", child_id: "c-1" })];
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.daily_log_coverage_rate).toBe(17); // 1/6
    });
  });

  describe("rating thresholds", () => {
    it("score >= 80 is outstanding", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_children: 6, total_staff: 10,
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({
          id: `h-${i}`, completed: true, has_content: true,
          handed_over_by: `s-${i % 5}`, received_by: `s-${(i % 5) + 5}`,
        })),
        daily_logs: Array.from({ length: 6 }, (_, i) => makeDailyLog({
          id: `dl-${i}`, child_id: `c-${i}`, word_count: 120, staff_id: `s-${i}`,
        })),
        care_events: Array.from({ length: 10 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_significant: true, has_handover_note: true, is_verified: true, staff_id: `s-${i % 10}`,
        })),
        notifications: Array.from({ length: 10 }, (_, i) => makeNotification({
          id: `n-${i}`, read: true, priority: i < 3 ? "urgent" : "normal",
        })),
      }));
      expect(r.flow_rating).toBe("outstanding");
      expect(r.flow_score).toBeGreaterThanOrEqual(80);
    });

    it("score 65-79 is good", () => {
      // Need urgent notifs read + significant events with handover to avoid -5 penalties
      const r = computeInformationFlowQuality(baseInput({
        handovers: [makeHandover({ id: "h-1", completed: true, has_content: true })],
        daily_logs: Array.from({ length: 4 }, (_, i) => makeDailyLog({
          id: `dl-${i}`, child_id: `c-${i}`, word_count: 120,
        })),
        care_events: [makeCareEvent({ id: "ce-1", is_verified: true, is_significant: true, has_handover_note: true })],
        notifications: [
          makeNotification({ id: "n-1", read: true, priority: "urgent" }),
          makeNotification({ id: "n-2", read: true }),
        ],
      }));
      expect(r.flow_score).toBeGreaterThanOrEqual(65);
      expect(r.flow_score).toBeLessThan(80);
      expect(r.flow_rating).toBe("good");
    });

    it("score < 45 is inadequate", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 3 })),
        care_events: Array.from({ length: 10 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_significant: true, has_handover_note: i < 3,
        })),
        notifications: Array.from({ length: 10 }, (_, i) => makeNotification({
          id: `n-${i}`, priority: "urgent", read: i < 5,
        })),
      }));
      expect(r.flow_score).toBeLessThan(45);
      expect(r.flow_rating).toBe("inadequate");
    });
  });

  describe("headlines", () => {
    it("outstanding headline mentions outstanding", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_children: 6, total_staff: 10,
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({
          id: `h-${i}`, completed: true, has_content: true,
          handed_over_by: `s-${i % 5}`, received_by: `s-${(i % 5) + 5}`,
        })),
        daily_logs: Array.from({ length: 6 }, (_, i) => makeDailyLog({
          id: `dl-${i}`, child_id: `c-${i}`, word_count: 120, staff_id: `s-${i}`,
        })),
        care_events: Array.from({ length: 10 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_significant: true, has_handover_note: true, is_verified: true, staff_id: `s-${i % 10}`,
        })),
        notifications: Array.from({ length: 10 }, (_, i) => makeNotification({
          id: `n-${i}`, read: true, priority: i < 3 ? "urgent" : "normal",
        })),
      }));
      if (r.flow_rating === "outstanding") {
        expect(r.headline.toLowerCase()).toContain("outstanding");
      }
    });

    it("inadequate headline mentions communication failure or inadequate", () => {
      const r = computeInformationFlowQuality(baseInput({ total_children: 6 }));
      const hl = r.headline.toLowerCase();
      expect(hl.includes("inadequate") || hl.includes("communication failure")).toBe(true);
    });
  });

  describe("strengths", () => {
    it("handover completion >= 95 generates strength", () => {
      const handovers = Array.from({ length: 20 }, (_, i) => makeHandover({ id: `h-${i}`, completed: true }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.strengths.some(s => s.includes("handover"))).toBe(true);
    });

    it("daily log coverage >= 90 generates strength", () => {
      const logs = Array.from({ length: 6 }, (_, i) => makeDailyLog({ id: `dl-${i}`, child_id: `c-${i}` }));
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.strengths.some(s => s.includes("daily log coverage"))).toBe(true);
    });

    it("notification read rate >= 90 generates strength", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({ id: `n-${i}`, read: true }));
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("notification read rate"))).toBe(true);
    });

    it("all urgent read generates strength", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: true }),
        makeNotification({ id: "n-2", priority: "high", read: true }),
      ];
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("urgent"))).toBe(true);
    });

    it("staff engagement >= 80 generates strength", () => {
      const handovers = Array.from({ length: 5 }, (_, i) => makeHandover({
        id: `h-${i}`, handed_over_by: `s-${i * 2}`, received_by: `s-${i * 2 + 1}`,
      }));
      const r = computeInformationFlowQuality(baseInput({ total_staff: 10, handovers }));
      expect(r.strengths.some(s => s.includes("staff engagement"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("handover completion < 50 generates concern", () => {
      const handovers = Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 4 }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.concerns.some(c => c.includes("handover"))).toBe(true);
    });

    it("daily log coverage < 40 generates concern", () => {
      const logs = [makeDailyLog({ id: "dl-1", child_id: "c-1" })];
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.concerns.some(c => c.includes("daily log coverage"))).toBe(true);
    });

    it("significant event handover < 50 generates concern", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_significant: true, has_handover_note: i < 4,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.concerns.some(c => c.includes("significant events"))).toBe(true);
    });

    it("urgent notification read < 70 generates concern", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 5,
      }));
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.concerns.some(c => c.includes("urgent") || c.includes("notification"))).toBe(true);
    });

    it("staff engagement < 50 generates concern", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_staff: 10,
        handovers: [makeHandover({ id: "h-1", handed_over_by: "s-1", received_by: "s-2" })],
      }));
      expect(r.concerns.some(c => c.includes("staff"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("handover completion < 80 triggers immediate recommendation", () => {
      const handovers = Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 7 }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.regulatory_ref === "Reg 13")).toBe(true);
    });

    it("significant event handover < 70 triggers immediate with Reg 36", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_significant: true, has_handover_note: i < 6,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.recommendations.some(rec => rec.regulatory_ref === "Reg 36")).toBe(true);
    });

    it("urgent notification read < 70 triggers immediate", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 5,
      }));
      const r = computeInformationFlowQuality(baseInput({ notifications: notifs }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });

    it("daily log coverage < 70 triggers soon recommendation", () => {
      const logs = [makeDailyLog({ id: "dl-1", child_id: "c-1" }), makeDailyLog({ id: "dl-2", child_id: "c-2" })];
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.recommendations.some(rec => rec.urgency === "soon" || rec.urgency === "immediate")).toBe(true);
    });

    it("recommendations have sequential ranks", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 3 })),
        care_events: Array.from({ length: 10 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_significant: true, has_handover_note: i < 3,
        })),
      }));
      for (let i = 0; i < r.recommendations.length; i++) {
        expect(r.recommendations[i].rank).toBe(i + 1);
      }
    });
  });

  describe("insights", () => {
    it("handover completion < 50 triggers critical insight", () => {
      const handovers = Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 4 }));
      const r = computeInformationFlowQuality(baseInput({ handovers }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("significant event handover < 50 triggers critical insight", () => {
      const events = Array.from({ length: 10 }, (_, i) => makeCareEvent({
        id: `ce-${i}`, is_significant: true, has_handover_note: i < 4,
      }));
      const r = computeInformationFlowQuality(baseInput({ care_events: events }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("all strong metrics trigger positive insight", () => {
      const r = computeInformationFlowQuality(baseInput({
        total_children: 6, total_staff: 10,
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({
          id: `h-${i}`, completed: true, handed_over_by: `s-${i % 5}`, received_by: `s-${(i % 5) + 5}`,
        })),
        daily_logs: Array.from({ length: 6 }, (_, i) => makeDailyLog({
          id: `dl-${i}`, child_id: `c-${i}`, word_count: 120, staff_id: `s-${i}`,
        })),
        care_events: Array.from({ length: 5 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_verified: true, staff_id: `s-${i}`,
        })),
        notifications: Array.from({ length: 10 }, (_, i) => makeNotification({
          id: `n-${i}`, read: true,
        })),
      }));
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("daily log coverage < 40 triggers critical insight", () => {
      const logs = [makeDailyLog({ id: "dl-1", child_id: "c-1" })];
      const r = computeInformationFlowQuality(baseInput({ total_children: 6, daily_logs: logs }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("Daily log"))).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("only handovers with no other data", () => {
      // pct(0,0)=0 for significantEventHandoverRate (<50 → -5) and urgentNotificationReadRate (<70 → -5) and dailyLogCoverage (<40 → -3)
      const r = computeInformationFlowQuality(baseInput({
        handovers: [makeHandover({ id: "h-1", completed: true })],
      }));
      // 52 + 4(handover) + 3(content) - 5(sigEvent) - 5(urgentNotif) - 3(dailyLog) = 46
      expect(r.flow_score).toBeGreaterThan(0);
    });

    it("score clamped 0-100", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: Array.from({ length: 10 }, (_, i) => makeHandover({ id: `h-${i}`, completed: i < 3 })),
        care_events: Array.from({ length: 10 }, (_, i) => makeCareEvent({
          id: `ce-${i}`, is_significant: true, has_handover_note: i < 3,
        })),
        notifications: Array.from({ length: 10 }, (_, i) => makeNotification({
          id: `n-${i}`, priority: "urgent", read: i < 5,
        })),
        daily_logs: [makeDailyLog({ id: "dl-1", child_id: "c-1" })],
      }));
      expect(r.flow_score).toBeGreaterThanOrEqual(0);
      expect(r.flow_score).toBeLessThanOrEqual(100);
    });

    it("return object has all required fields", () => {
      const r = computeInformationFlowQuality(baseInput({
        handovers: [makeHandover({ id: "h-1" })],
      }));
      expect(r).toHaveProperty("flow_rating");
      expect(r).toHaveProperty("flow_score");
      expect(r).toHaveProperty("headline");
      expect(r).toHaveProperty("handover_completion_rate");
      expect(r).toHaveProperty("handover_content_rate");
      expect(r).toHaveProperty("daily_log_coverage_rate");
      expect(r).toHaveProperty("daily_log_quality_rate");
      expect(r).toHaveProperty("significant_event_handover_rate");
      expect(r).toHaveProperty("care_event_verification_rate");
      expect(r).toHaveProperty("notification_read_rate");
      expect(r).toHaveProperty("urgent_notification_read_rate");
      expect(r).toHaveProperty("information_continuity_score");
      expect(r).toHaveProperty("staff_engagement_rate");
      expect(r).toHaveProperty("strengths");
      expect(r).toHaveProperty("concerns");
      expect(r).toHaveProperty("recommendations");
      expect(r).toHaveProperty("insights");
    });
  });
});
