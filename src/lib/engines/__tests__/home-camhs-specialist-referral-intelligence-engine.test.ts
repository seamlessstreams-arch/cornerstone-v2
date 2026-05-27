import { describe, it, expect } from "vitest";
import {
  computeCamhsSpecialistReferral,
  type CamhsSpecialistInput,
  type CamhsReferralInput,
  type EmergencyReferralInput,
  type SpecialistContactInput,
} from "../home-camhs-specialist-referral-intelligence-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeReferral(id: string, childId: string, o: Partial<CamhsReferralInput> = {}): CamhsReferralInput {
  return { id, child_id: childId, referral_date: "2026-04-01", status: "active", waiting_days: 0, appointments_offered: 6, appointments_attended: 6, outcome_recorded: true, ...o };
}
function makeEmergency(id: string, childId: string, o: Partial<EmergencyReferralInput> = {}): EmergencyReferralInput {
  return { id, child_id: childId, date: "2026-05-01", type: "crisis", response_within_24h: true, follow_up_completed: true, ...o };
}
function makeSpecialist(id: string, childId: string, o: Partial<SpecialistContactInput> = {}): SpecialistContactInput {
  return { id, child_id: childId, service: "camhs", date: "2026-05-01", attended: true, outcome_recorded: true, ...o };
}

function baseInput(overrides: Partial<CamhsSpecialistInput> = {}): CamhsSpecialistInput {
  return {
    today: "2026-05-15", total_children: 4,
    camhs_referrals: [makeReferral("r1", "c1"), makeReferral("r2", "c2"), makeReferral("r3", "c3")],
    emergency_referrals: [makeEmergency("e1", "c1")],
    specialist_contacts: [
      makeSpecialist("s1", "c1"), makeSpecialist("s2", "c2"),
      makeSpecialist("s3", "c3"), makeSpecialist("s4", "c4"),
    ],
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home CAMHS & Specialist Referral Intelligence Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no children", () => {
      const r = computeCamhsSpecialistReferral({ today: "2026-05-15", total_children: 0, camhs_referrals: [], emergency_referrals: [], specialist_contacts: [] });
      expect(r.camhs_rating).toBe("insufficient_data");
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with comprehensive CAMHS and specialist access", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.camhs_score).toBeGreaterThanOrEqual(80);
      expect(r.camhs_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some gaps in service access", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [
          makeReferral("r1", "c1"),
          makeReferral("r2", "c2", { appointments_offered: 6, appointments_attended: 5 }),
          makeReferral("r3", "c3", { status: "waiting", waiting_days: 30 }),
        ],
        emergency_referrals: [makeEmergency("e1", "c1")],
        specialist_contacts: [
          makeSpecialist("s1", "c1"), makeSpecialist("s2", "c2"),
          makeSpecialist("s3", "c3"),
        ],
      }));
      expect(r.camhs_score).toBeGreaterThanOrEqual(65);
      expect(r.camhs_score).toBeLessThan(80);
      expect(r.camhs_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with moderate concerns", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [
          makeReferral("r1", "c1", { appointments_offered: 6, appointments_attended: 4 }),
          makeReferral("r2", "c2", { status: "waiting", waiting_days: 50, outcome_recorded: false }),
          makeReferral("r3", "c3", { status: "rejected", outcome_recorded: false }),
        ],
        emergency_referrals: [
          makeEmergency("e1", "c1", { response_within_24h: true, follow_up_completed: true }),
          makeEmergency("e2", "c2", { response_within_24h: true, follow_up_completed: false }),
        ],
        specialist_contacts: [
          makeSpecialist("s1", "c1"),
          makeSpecialist("s2", "c2", { outcome_recorded: false }),
        ],
      }));
      expect(r.camhs_score).toBeGreaterThanOrEqual(45);
      expect(r.camhs_score).toBeLessThan(65);
      expect(r.camhs_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severe service failures", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [
          makeReferral("r1", "c1", { appointments_offered: 8, appointments_attended: 3, outcome_recorded: false }),
          makeReferral("r2", "c2", { status: "waiting", waiting_days: 120, outcome_recorded: false }),
          makeReferral("r3", "c3", { status: "rejected", outcome_recorded: false }),
          makeReferral("r4", "c4", { status: "rejected", outcome_recorded: false }),
        ],
        emergency_referrals: [
          makeEmergency("e1", "c1", { response_within_24h: false, follow_up_completed: false }),
          makeEmergency("e2", "c2", { response_within_24h: false, follow_up_completed: false }),
          makeEmergency("e3", "c3", { response_within_24h: true, follow_up_completed: false }),
        ],
        specialist_contacts: [
          makeSpecialist("s1", "c1", { attended: false, outcome_recorded: false }),
        ],
      }));
      expect(r.camhs_score).toBeLessThan(45);
      expect(r.camhs_rating).toBe("inadequate");
    });
  });

  describe("metrics", () => {
    it("counts active referrals correctly", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.active_referrals).toBe(3);
    });

    it("calculates attendance rate", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.appointment_attendance_rate).toBe(100);
    });

    it("counts children waiting", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [
          makeReferral("r1", "c1"),
          makeReferral("r2", "c2", { status: "waiting", waiting_days: 14 }),
        ],
      }));
      expect(r.children_waiting).toBe(1);
    });

    it("calculates emergency response rate", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.emergency_response_rate).toBe(100);
    });

    it("calculates specialist coverage rate", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.specialist_coverage_rate).toBe(100);
    });
  });

  describe("strengths", () => {
    it("generates no-waiting strength", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.strengths.some(s => s.includes("waiting") || s.includes("progressed"))).toBe(true);
    });

    it("generates attendance strength", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.strengths.some(s => s.includes("attendance") || s.includes("engage"))).toBe(true);
    });

    it("generates emergency response strength", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.strengths.some(s => s.includes("emergency") || s.includes("24 hours"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for long waits", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [
          makeReferral("r1", "c1"),
          makeReferral("r2", "c2", { status: "waiting", waiting_days: 70 }),
          makeReferral("r3", "c3", { status: "waiting", waiting_days: 80 }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("wait") || c.includes("delay"))).toBe(true);
    });

    it("raises concern for low emergency response", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        emergency_referrals: [
          makeEmergency("e1", "c1", { response_within_24h: false }),
          makeEmergency("e2", "c2", { response_within_24h: false }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("emergency") || c.includes("Emergency"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("generates recommendations for poor emergency response", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        emergency_referrals: [
          makeEmergency("e1", "c1", { response_within_24h: false }),
          makeEmergency("e2", "c2", { response_within_24h: true }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("emergency") || rec.recommendation.includes("crisis"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("handles no referrals at all with children", () => {
      const r = computeCamhsSpecialistReferral(baseInput({
        camhs_referrals: [], emergency_referrals: [], specialist_contacts: [],
      }));
      expect(r.camhs_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeCamhsSpecialistReferral(baseInput());
      expect(r.camhs_score).toBeGreaterThanOrEqual(0);
      expect(r.camhs_score).toBeLessThanOrEqual(100);
    });
  });
});
