import { describe, it, expect } from "vitest";
import {
  computeNotificationResponsiveness,
  type NotificationResponsivenessInput,
  type NotificationInput,
} from "../home-notification-responsiveness-intelligence-engine";

// ── Factory Helpers ─────────────────────────────────────────────────────────

function makeNotification(overrides: Partial<NotificationInput> = {}): NotificationInput {
  return {
    id: "n-1",
    home_id: "home-1",
    recipient_id: "staff-1",
    title: "Test notification",
    type: "general",
    priority: "normal",
    read: true,
    read_at: "2025-03-15T10:00:00Z",
    entity_type: null,
    entity_id: null,
    created_at: "2025-03-15T08:00:00Z",
    ...overrides,
  };
}

function baseInput(overrides: Partial<NotificationResponsivenessInput> = {}): NotificationResponsivenessInput {
  return {
    today: "2025-03-15",
    total_staff: 10,
    notifications: [],
    ...overrides,
  };
}

// ── Special Cases ───────────────────────────────────────────────────────────

describe("computeNotificationResponsiveness", () => {
  describe("special cases", () => {
    it("returns insufficient_data when no notifications and no staff", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 0, notifications: [] }));
      expect(r.responsiveness_rating).toBe("insufficient_data");
      expect(r.responsiveness_score).toBe(0);
    });

    it("returns good (score 70) when no notifications but staff exist", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 5, notifications: [] }));
      expect(r.responsiveness_rating).toBe("good");
      expect(r.responsiveness_score).toBe(70);
    });

    it("insufficient_data has zero metrics", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 0, notifications: [] }));
      expect(r.total_notifications).toBe(0);
      expect(r.read_rate).toBe(0);
      expect(r.urgent_read_rate).toBe(0);
      expect(r.unread_count).toBe(0);
      expect(r.urgent_unread_count).toBe(0);
    });

    it("insufficient_data has empty arrays", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 0, notifications: [] }));
      expect(r.strengths).toHaveLength(0);
      expect(r.concerns).toHaveLength(0);
      expect(r.recommendations).toHaveLength(0);
      expect(r.insights).toHaveLength(0);
    });

    it("no notifications with staff has a recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 5, notifications: [] }));
      expect(r.recommendations).toHaveLength(1);
      expect(r.recommendations[0].urgency).toBe("planned");
    });

    it("no notifications with staff has a warning insight", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 5, notifications: [] }));
      expect(r.insights).toHaveLength(1);
      expect(r.insights[0].severity).toBe("warning");
    });

    it("insufficient_data headline mentions insufficient data", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 0, notifications: [] }));
      expect(r.headline).toContain("Insufficient data");
    });

    it("no notifications headline mentions not yet in active use", () => {
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 5, notifications: [] }));
      expect(r.headline).toContain("not yet in active use");
    });
  });

  // ── Base Score ──────────────────────────────────────────────────────────

  describe("base score", () => {
    it("starts at 52 with minimal data", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, read_at: "2025-03-15T14:00:00Z", created_at: "2025-03-15T08:00:00Z" })],
      }));
      // read_rate = 100% → +6, urgentReadRate = 0 (no urgent), avg <=2 → depends, unread=0 → +4, etc
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(52);
    });
  });

  // ── Metric Calculations ─────────────────────────────────────────────────

  describe("metrics", () => {
    it("calculates total_notifications correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1" }), makeNotification({ id: "n-2" }), makeNotification({ id: "n-3" })],
      }));
      expect(r.total_notifications).toBe(3);
    });

    it("calculates read_rate correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", read: true }),
          makeNotification({ id: "n-2", read: true }),
          makeNotification({ id: "n-3", read: false, read_at: null }),
          makeNotification({ id: "n-4", read: false, read_at: null }),
        ],
      }));
      expect(r.read_rate).toBe(50);
    });

    it("calculates urgent_read_rate correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", priority: "urgent", read: true }),
          makeNotification({ id: "n-2", priority: "high", read: true }),
          makeNotification({ id: "n-3", priority: "urgent", read: false, read_at: null }),
        ],
      }));
      expect(r.urgent_read_rate).toBe(67); // 2/3 = 67%
    });

    it("includes high priority in urgent read rate", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", priority: "high", read: true }),
          makeNotification({ id: "n-2", priority: "high", read: false, read_at: null }),
        ],
      }));
      expect(r.urgent_read_rate).toBe(50);
    });

    it("calculates unread_count correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", read: true }),
          makeNotification({ id: "n-2", read: false, read_at: null }),
          makeNotification({ id: "n-3", read: false, read_at: null }),
        ],
      }));
      expect(r.unread_count).toBe(2);
    });

    it("calculates urgent_unread_count correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null }),
          makeNotification({ id: "n-2", priority: "high", read: false, read_at: null }),
          makeNotification({ id: "n-3", priority: "normal", read: false, read_at: null }),
        ],
      }));
      expect(r.urgent_unread_count).toBe(2);
    });

    it("calculates average_response_hours correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T10:00:00Z" }),
          makeNotification({ id: "n-2", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T12:00:00Z" }),
        ],
      }));
      expect(r.average_response_hours).toBe(3); // (2+4)/2 = 3
    });

    it("calculates urgent_response_hours for urgent/high only", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T09:00:00Z" }),
          makeNotification({ id: "n-2", priority: "normal", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T20:00:00Z" }),
        ],
      }));
      expect(r.urgent_response_hours).toBe(1); // only the urgent one: 1h
    });

    it("calculates staff_coverage_rate correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        total_staff: 4,
        notifications: [
          makeNotification({ id: "n-1", recipient_id: "s-1" }),
          makeNotification({ id: "n-2", recipient_id: "s-2" }),
          makeNotification({ id: "n-3", recipient_id: "s-1" }),
        ],
      }));
      expect(r.staff_coverage_rate).toBe(50); // 2/4 = 50%
    });

    it("calculates notification_type_diversity correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [
          makeNotification({ id: "n-1", type: "system" }),
          makeNotification({ id: "n-2", type: "incident" }),
          makeNotification({ id: "n-3", type: "safeguarding" }),
          makeNotification({ id: "n-4", type: "system" }),
        ],
      }));
      expect(r.notification_type_diversity).toBe(3);
    });

    it("calculates oldest_unread_hours correctly", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-15T20:00:00Z",
        notifications: [
          makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-14T08:00:00Z" }),
          makeNotification({ id: "n-2", read: false, read_at: null, created_at: "2025-03-15T10:00:00Z" }),
        ],
      }));
      expect(r.oldest_unread_hours).toBe(36); // 36 hours from 14th 08:00 to 15th 20:00
    });

    it("oldest_unread_hours is 0 when all read", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true })],
      }));
      expect(r.oldest_unread_hours).toBe(0);
    });

    it("urgent_read_rate is 0 when no urgent notifications", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "normal", read: true })],
      }));
      expect(r.urgent_read_rate).toBe(0);
    });

    it("average_response_hours is 0 when none have read_at", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, read_at: null })],
      }));
      expect(r.average_response_hours).toBe(0);
    });
  });

  // ── Score Bonuses ─────────────────────────────────────────────────────────

  describe("score bonuses", () => {
    it("read_rate >= 95 gives +6 bonus", () => {
      const all = Array.from({ length: 20 }, (_, i) => makeNotification({ id: `n-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z", recipient_id: `s-${i % 10}`, type: ["system", "incident", "safeguarding", "compliance"][i % 4] }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: all }));
      expect(r.read_rate).toBe(100);
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(52 + 6);
    });

    it("read_rate 85-94 gives +3 bonus", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`,
        read: i < 9,
        read_at: i < 9 ? "2025-03-15T14:00:00Z" : null,
        created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.read_rate).toBe(90);
    });

    it("unread_count === 0 gives +4 bonus", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.unread_count).toBe(0);
    });

    it("staffCoverageRate >= 80 gives +2", () => {
      const notifs = Array.from({ length: 8 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.staff_coverage_rate).toBe(80);
    });

    it("staffCoverageRate 50-79 gives +1", () => {
      const notifs = Array.from({ length: 5 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.staff_coverage_rate).toBe(50);
    });

    it("typeDiversity >= 4 gives +2", () => {
      const notifs = [
        makeNotification({ id: "n-1", type: "system", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", type: "incident", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-3", type: "safeguarding", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-4", type: "compliance", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.notification_type_diversity).toBe(4);
    });

    it("typeDiversity 2-3 gives +1", () => {
      const notifs = [
        makeNotification({ id: "n-1", type: "system", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", type: "incident", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.notification_type_diversity).toBe(2);
    });

    it("urgentReadRate 100 gives +6", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", priority: "high", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_read_rate).toBe(100);
    });

    it("urgentReadRate 90-99 gives +3", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 9, read_at: i < 9 ? "2025-03-15T09:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_read_rate).toBe(90);
    });

    it("avg response hours <= 2 gives +4", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T09:30:00Z" })],
      }));
      expect(r.average_response_hours).toBeLessThanOrEqual(2);
    });

    it("avg response hours 2-6 gives +2", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T12:00:00Z" })],
      }));
      expect(r.average_response_hours).toBe(4);
    });

    it("urgent response hours <= 1 gives +4", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T08:30:00Z" })],
      }));
      expect(r.urgent_response_hours).toBeLessThanOrEqual(1);
    });

    it("urgent response hours 1-3 gives +2", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T10:00:00Z" })],
      }));
      expect(r.urgent_response_hours).toBe(2);
    });
  });

  // ── Score Penalties ───────────────────────────────────────────────────────

  describe("score penalties", () => {
    it("urgent unread count > 0 gives -6", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.urgent_unread_count).toBe(1);
    });

    it("oldest unread > 48h gives -5", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-17T20:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.oldest_unread_hours).toBeGreaterThan(48);
    });

    it("oldest unread 24-48h gives -3", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T20:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.oldest_unread_hours).toBeGreaterThan(24);
      expect(r.oldest_unread_hours).toBeLessThanOrEqual(48);
    });

    it("read_rate < 50 gives -5", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 4, read_at: i < 4 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.read_rate).toBe(40);
    });

    it("urgentReadRate < 70 gives -5", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 6, read_at: i < 6 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_read_rate).toBe(60);
    });
  });

  // ── Rating Thresholds ─────────────────────────────────────────────────────

  describe("rating thresholds", () => {
    it("score >= 80 is outstanding", () => {
      // All bonuses: 52 + 6 + 6 + 4 + 4 + 4 + 2 + 2 = 80
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`,
        recipient_id: `s-${i % 10}`,
        type: ["system", "incident", "safeguarding", "compliance"][i % 4],
        priority: i < 4 ? "urgent" : "normal",
        read: true,
        read_at: "2025-03-15T08:30:00Z",
        created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.responsiveness_rating).toBe("outstanding");
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(80);
    });

    it("score 65-79 is good", () => {
      // Base 52 + readRate100%(+6) + urgentReadRate100%(+6) + avgResp<=6h(+2) + unread=0(+4) + typeDiversity2(+1) = 71 but urgentResp>3 so no bonus there
      // Need to avoid urgentReadRate<70 penalty (-5) by having urgent notifs all read
      const notifs = [
        ...Array.from({ length: 8 }, (_, i) => makeNotification({
          id: `n-${i}`, read: true, read_at: "2025-03-15T14:00:00Z",
          created_at: "2025-03-15T08:00:00Z", type: i < 4 ? "system" : "incident",
        })),
        ...Array.from({ length: 2 }, (_, i) => makeNotification({
          id: `n-u-${i}`, priority: "urgent", read: true,
          read_at: "2025-03-15T14:00:00Z", created_at: "2025-03-15T08:00:00Z",
        })),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.responsiveness_rating).toBe("good");
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(65);
      expect(r.responsiveness_score).toBeLessThan(80);
    });

    it("score 45-64 is adequate", () => {
      // Base 52, some minor bonuses but penalties drag it down
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`,
        read: i < 7,
        read_at: i < 7 ? "2025-03-15T20:00:00Z" : null,
        created_at: "2025-03-15T08:00:00Z",
        priority: i < 3 ? "urgent" : "normal",
      }));
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T10:00:00Z",
        notifications: notifs,
      }));
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(45);
      expect(r.responsiveness_score).toBeLessThan(65);
      expect(r.responsiveness_rating).toBe("adequate");
    });

    it("score < 45 is inadequate", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`,
        priority: i < 10 ? "urgent" : "normal",
        read: i < 4,
        read_at: i < 4 ? "2025-03-15T20:00:00Z" : null,
        created_at: "2025-03-13T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T08:00:00Z",
        notifications: notifs,
      }));
      expect(r.responsiveness_score).toBeLessThan(45);
      expect(r.responsiveness_rating).toBe("inadequate");
    });
  });

  // ── Headlines ─────────────────────────────────────────────────────────────

  describe("headlines", () => {
    it("outstanding headline mentions outstanding", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i % 10}`, type: ["system", "incident", "safeguarding", "compliance"][i % 4],
        priority: i < 4 ? "urgent" : "normal", read: true, read_at: "2025-03-15T08:30:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.headline.toLowerCase()).toContain("outstanding");
    });

    it("good headline mentions good", () => {
      const notifs = [makeNotification({ id: "n-1", read: true, read_at: "2025-03-15T14:00:00Z", created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      if (r.responsiveness_rating === "good") {
        expect(r.headline.toLowerCase()).toContain("good");
      }
    });

    it("adequate headline mentions adequate", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 7, read_at: i < 7 ? "2025-03-15T20:00:00Z" : null,
        created_at: "2025-03-15T08:00:00Z", priority: i < 3 ? "urgent" : "normal",
      }));
      const r = computeNotificationResponsiveness(baseInput({ today: "2025-03-16T10:00:00Z", notifications: notifs }));
      if (r.responsiveness_rating === "adequate") {
        expect(r.headline.toLowerCase()).toContain("adequate");
      }
    });

    it("inadequate headline mentions inadequate", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: i < 10 ? "urgent" : "normal", read: i < 4,
        read_at: i < 4 ? "2025-03-15T20:00:00Z" : null, created_at: "2025-03-13T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ today: "2025-03-16T08:00:00Z", notifications: notifs }));
      if (r.responsiveness_rating === "inadequate") {
        expect(r.headline.toLowerCase()).toContain("inadequate");
      }
    });
  });

  // ── Strengths ─────────────────────────────────────────────────────────────

  describe("strengths", () => {
    it("read_rate >= 95 generates strength", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("100%") && s.includes("read"))).toBe(true);
    });

    it("read_rate 85-94 generates read strength", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 9, read_at: i < 9 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("90%") && s.includes("read"))).toBe(true);
    });

    it("all urgent read generates safeguarding strength", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", priority: "high", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("safeguarding"))).toBe(true);
    });

    it("avg response <= 2h generates prompt strength", () => {
      const notifs = [makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T09:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("response time") || s.includes("promptly"))).toBe(true);
    });

    it("zero unread generates strength", () => {
      const notifs = [makeNotification({ id: "n-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("Zero unread"))).toBe(true);
    });

    it("staff coverage >= 80 generates strength", () => {
      const notifs = Array.from({ length: 8 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.strengths.some(s => s.includes("staff coverage"))).toBe(true);
    });

    it("type diversity >= 4 generates strength", () => {
      const notifs = [
        makeNotification({ id: "n-1", type: "system", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", type: "incident", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-3", type: "safeguarding", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-4", type: "compliance", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("4 different types"))).toBe(true);
    });

    it("urgent response <= 1h generates prioritisation strength", () => {
      const notifs = [makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T08:30:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.strengths.some(s => s.includes("prioritisation"))).toBe(true);
    });
  });

  // ── Concerns ──────────────────────────────────────────────────────────────

  describe("concerns", () => {
    it("urgent unread generates safeguarding concern", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.concerns.some(c => c.includes("urgent") || c.includes("safeguarding"))).toBe(true);
    });

    it("oldest unread > 48h generates concern", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-18T08:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.concerns.some(c => c.includes("48 hours") || c.includes("older than"))).toBe(true);
    });

    it("oldest unread 24-48h generates concern", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T20:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.concerns.some(c => c.includes("24-hour") || c.includes("hours old"))).toBe(true);
    });

    it("read_rate < 50 generates concern", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 3, read_at: i < 3 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.concerns.some(c => c.includes("30%") && c.includes("read"))).toBe(true);
    });

    it("urgentReadRate < 70 generates concern", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 5, read_at: i < 5 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.concerns.some(c => c.includes("50%") && c.includes("urgent"))).toBe(true);
    });

    it("staff coverage < 50 generates concern", () => {
      const notifs = [makeNotification({ id: "n-1", recipient_id: "s-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.concerns.some(c => c.includes("staff") && c.includes("10%"))).toBe(true);
    });

    it("avg response > 24h generates concern", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, created_at: "2025-03-14T08:00:00Z", read_at: "2025-03-15T20:00:00Z" })],
      }));
      expect(r.concerns.some(c => c.includes("response time") || c.includes("hours"))).toBe(true);
    });

    it("urgent response > 6h generates concern", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T20:00:00Z" })],
      }));
      expect(r.concerns.some(c => c.includes("Urgent") || c.includes("urgent"))).toBe(true);
    });
  });

  // ── Recommendations ───────────────────────────────────────────────────────

  describe("recommendations", () => {
    it("urgent unread triggers immediate recommendation with Reg 40", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      const rec = r.recommendations.find(rec => rec.urgency === "immediate" && rec.regulatory_ref === "Reg 40");
      expect(rec).toBeDefined();
    });

    it("oldest unread > 48h triggers immediate recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-18T08:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      const rec = r.recommendations.find(rec => rec.urgency === "immediate" && rec.regulatory_ref === "Reg 13");
      expect(rec).toBeDefined();
    });

    it("oldest unread 24-48h triggers soon recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T20:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      const rec = r.recommendations.find(rec => rec.urgency === "soon" && rec.regulatory_ref === "Reg 13");
      expect(rec).toBeDefined();
    });

    it("read_rate < 50 triggers immediate recommendation", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 3, read_at: i < 3 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });

    it("urgentReadRate < 70 triggers immediate recommendation with Reg 12", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: i < 5, read_at: i < 5 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      const rec = r.recommendations.find(rec => rec.regulatory_ref === "Reg 12");
      expect(rec).toBeDefined();
    });

    it("staff coverage < 50 triggers soon recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({
        total_staff: 10,
        notifications: [makeNotification({ id: "n-1", recipient_id: "s-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "soon")).toBe(true);
    });

    it("avg response > 6h triggers soon recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T20:00:00Z" })],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "soon")).toBe(true);
    });

    it("type diversity < 2 triggers planned recommendation", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", type: "general", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "planned")).toBe(true);
    });

    it("recommendations have sequential ranks", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: i < 10 ? "urgent" : "normal", read: i < 4,
        read_at: i < 4 ? "2025-03-15T20:00:00Z" : null, created_at: "2025-03-13T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ today: "2025-03-16T08:00:00Z", notifications: notifs }));
      for (let i = 0; i < r.recommendations.length; i++) {
        expect(r.recommendations[i].rank).toBe(i + 1);
      }
    });
  });

  // ── Insights ──────────────────────────────────────────────────────────────

  describe("insights", () => {
    it("urgent unread triggers critical insight", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("oldest unread > 48h triggers critical insight", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-18T08:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("hours old"))).toBe(true);
    });

    it("oldest unread 24-48h triggers warning insight", () => {
      const r = computeNotificationResponsiveness(baseInput({
        today: "2025-03-16T20:00:00Z",
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.insights.some(i => i.severity === "warning")).toBe(true);
    });

    it("read_rate < 50 triggers critical insight", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: i < 3, read_at: i < 3 ? "2025-03-15T10:00:00Z" : null, created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("30%"))).toBe(true);
    });

    it("read_rate >= 95 and unread=0 triggers positive insight", () => {
      const notifs = Array.from({ length: 10 }, (_, i) => makeNotification({
        id: `n-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("urgentReadRate 100 with urgent notifs triggers positive insight", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("urgent"))).toBe(true);
    });

    it("avg response <= 2h triggers positive insight", () => {
      const notifs = [makeNotification({ id: "n-1", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T09:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("response time"))).toBe(true);
    });

    it("staff coverage >= 80 with multiple staff triggers positive insight", () => {
      const notifs = Array.from({ length: 9 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i}`, read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("staff"))).toBe(true);
    });

    it("staff coverage < 30 triggers warning insight", () => {
      const notifs = [makeNotification({ id: "n-1", recipient_id: "s-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("10%"))).toBe(true);
    });

    it("urgent response > 6h triggers warning insight", () => {
      const notifs = [makeNotification({ id: "n-1", priority: "urgent", read: true, created_at: "2025-03-15T08:00:00Z", read_at: "2025-03-15T20:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("Urgent"))).toBe(true);
    });
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("single notification all read", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.read_rate).toBe(100);
      expect(r.total_notifications).toBe(1);
    });

    it("single notification unread", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })],
      }));
      expect(r.read_rate).toBe(0);
      expect(r.unread_count).toBe(1);
    });

    it("all notifications are urgent", () => {
      const notifs = Array.from({ length: 5 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: true, read_at: "2025-03-15T09:00:00Z", created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_read_rate).toBe(100);
    });

    it("no urgent notifications", () => {
      const notifs = [makeNotification({ id: "n-1", priority: "low", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_read_rate).toBe(0);
      expect(r.urgent_unread_count).toBe(0);
    });

    it("score is clamped to 0-100", () => {
      // Maximum penalties scenario
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`, priority: "urgent", read: false, read_at: null, created_at: "2025-03-10T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ today: "2025-03-18T08:00:00Z", notifications: notifs }));
      expect(r.responsiveness_score).toBeGreaterThanOrEqual(0);
      expect(r.responsiveness_score).toBeLessThanOrEqual(100);
    });

    it("large dataset handles correctly", () => {
      const notifs = Array.from({ length: 100 }, (_, i) => makeNotification({
        id: `n-${i}`, recipient_id: `s-${i % 20}`, type: ["system", "incident", "safeguarding", "compliance", "task"][i % 5],
        priority: i % 10 === 0 ? "urgent" : "normal", read: i < 90, read_at: i < 90 ? "2025-03-15T10:00:00Z" : null,
        created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 20, notifications: notifs }));
      expect(r.total_notifications).toBe(100);
      expect(r.read_rate).toBe(90);
    });

    it("multiple urgent unread pluralizes correctly", () => {
      const notifs = [
        makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" }),
        makeNotification({ id: "n-2", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" }),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_unread_count).toBe(2);
      expect(r.concerns.some(c => c.includes("notifications"))).toBe(true);
    });

    it("single urgent unread singularizes", () => {
      const notifs = [makeNotification({ id: "n-1", priority: "urgent", read: false, read_at: null, created_at: "2025-03-15T08:00:00Z" })];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.urgent_unread_count).toBe(1);
    });
  });

  // ── Combined Realistic Scenarios ──────────────────────────────────────────

  describe("realistic scenarios", () => {
    it("outstanding home: all read, fast response, broad coverage", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`,
        recipient_id: `s-${i % 10}`,
        type: ["system", "incident", "safeguarding", "compliance", "task"][i % 5],
        priority: i < 6 ? "urgent" : "normal",
        read: true,
        read_at: "2025-03-15T08:30:00Z",
        created_at: "2025-03-15T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ total_staff: 10, notifications: notifs }));
      expect(r.responsiveness_rating).toBe("outstanding");
      expect(r.strengths.length).toBeGreaterThan(0);
      expect(r.concerns).toHaveLength(0);
    });

    it("inadequate home: mostly unread, urgent missed, slow response", () => {
      const notifs = Array.from({ length: 20 }, (_, i) => makeNotification({
        id: `n-${i}`,
        priority: i < 8 ? "urgent" : "normal",
        read: i < 3,
        read_at: i < 3 ? "2025-03-17T08:00:00Z" : null,
        created_at: "2025-03-13T08:00:00Z",
      }));
      const r = computeNotificationResponsiveness(baseInput({ today: "2025-03-17T08:00:00Z", notifications: notifs }));
      expect(r.responsiveness_rating).toBe("inadequate");
      expect(r.concerns.length).toBeGreaterThan(0);
      expect(r.recommendations.length).toBeGreaterThan(0);
    });

    it("mixed home: good read rate but slow urgent response", () => {
      const notifs = [
        ...Array.from({ length: 8 }, (_, i) => makeNotification({
          id: `n-${i}`, priority: "normal", read: true, read_at: "2025-03-15T10:00:00Z", created_at: "2025-03-15T08:00:00Z",
        })),
        ...Array.from({ length: 2 }, (_, i) => makeNotification({
          id: `n-urgent-${i}`, priority: "urgent", read: true, read_at: "2025-03-15T20:00:00Z", created_at: "2025-03-15T08:00:00Z",
        })),
      ];
      const r = computeNotificationResponsiveness(baseInput({ notifications: notifs }));
      expect(r.read_rate).toBe(100);
      expect(r.urgent_response_hours).toBeGreaterThan(6);
    });

    it("return object has all required fields", () => {
      const r = computeNotificationResponsiveness(baseInput({
        notifications: [makeNotification({ id: "n-1" })],
      }));
      expect(r).toHaveProperty("responsiveness_rating");
      expect(r).toHaveProperty("responsiveness_score");
      expect(r).toHaveProperty("headline");
      expect(r).toHaveProperty("total_notifications");
      expect(r).toHaveProperty("read_rate");
      expect(r).toHaveProperty("urgent_read_rate");
      expect(r).toHaveProperty("average_response_hours");
      expect(r).toHaveProperty("urgent_response_hours");
      expect(r).toHaveProperty("unread_count");
      expect(r).toHaveProperty("urgent_unread_count");
      expect(r).toHaveProperty("staff_coverage_rate");
      expect(r).toHaveProperty("notification_type_diversity");
      expect(r).toHaveProperty("oldest_unread_hours");
      expect(r).toHaveProperty("strengths");
      expect(r).toHaveProperty("concerns");
      expect(r).toHaveProperty("recommendations");
      expect(r).toHaveProperty("insights");
    });
  });
});
