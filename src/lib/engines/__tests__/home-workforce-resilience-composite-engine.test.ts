import { describe, it, expect } from "vitest";
import {
  computeWorkforceResilience,
  type WorkforceResilienceInput,
  type StaffResilienceSnapshot,
  type HomeLevelWorkforce,
} from "../home-workforce-resilience-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeStaff(id: string, o: Partial<StaffResilienceSnapshot> = {}): StaffResilienceSnapshot {
  return {
    staff_id: id,
    supervision_completed: 10, supervision_due: 10,
    mandatory_training_current: true, qualifications_met: true,
    sickness_days_90d: 1, has_development_plan: true,
    practice_observations: 3, recognition_count: 4,
    grievance_active: false, wellbeing_score: 8,
    dbs_current: true, induction_completed: true,
    ...o,
  };
}

function makeHomeLevel(o: Partial<HomeLevelWorkforce> = {}): HomeLevelWorkforce {
  return {
    vacancy_count: 0, vacancy_total_posts: 12,
    shifts_covered: 98, shifts_total: 100,
    agency_staff_in_use: 0, lone_working_incidents: 0,
    handover_completion_rate: 98,
    exit_interviews_conducted: 2, exit_interviews_due: 2,
    ...o,
  };
}

function baseInput(overrides: Partial<WorkforceResilienceInput> = {}): WorkforceResilienceInput {
  return {
    today: "2026-05-15",
    total_staff: 8,
    staff_snapshots: [makeStaff("s1"), makeStaff("s2"), makeStaff("s3"), makeStaff("s4")],
    home_level: makeHomeLevel(),
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Workforce Resilience Composite Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no staff snapshots", () => {
      const r = computeWorkforceResilience({
        today: "2026-05-15", total_staff: 0, staff_snapshots: [], home_level: makeHomeLevel(),
      });
      expect(r.resilience_rating).toBe("insufficient_data");
      expect(r.resilience_score).toBe(0);
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding when all staff excellent and ops strong", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.resilience_score).toBeGreaterThanOrEqual(80);
      expect(r.resilience_rating).toBe("outstanding");
      expect(r.staff_flourishing).toBe(4);
      expect(r.staff_at_risk).toBe(0);
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some degraded staff and ops", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1"),
          makeStaff("s2", {
            supervision_completed: 5, supervision_due: 10,
            sickness_days_90d: 10, wellbeing_score: 4,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0,
          }),
          makeStaff("s3", {
            mandatory_training_current: false, sickness_days_90d: 8,
            wellbeing_score: 5, practice_observations: 0,
            recognition_count: 0, has_development_plan: false,
          }),
          makeStaff("s4", {
            supervision_completed: 6, supervision_due: 10,
            sickness_days_90d: 9, wellbeing_score: 4,
          }),
        ],
        home_level: makeHomeLevel({
          shifts_covered: 88, shifts_total: 100,
          agency_staff_in_use: 2,
          vacancy_count: 1, vacancy_total_posts: 12,
        }),
      }));
      expect(r.resilience_score).toBeGreaterThanOrEqual(65);
      expect(r.resilience_score).toBeLessThan(80);
      expect(r.resilience_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with significantly degraded workforce", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1", {
            supervision_completed: 6, supervision_due: 10,
            sickness_days_90d: 8, wellbeing_score: 5,
            has_development_plan: false, practice_observations: 1,
            recognition_count: 1,
          }),
          makeStaff("s2", {
            supervision_completed: 5, supervision_due: 10,
            mandatory_training_current: false, sickness_days_90d: 10,
            wellbeing_score: 4, has_development_plan: false,
            practice_observations: 0, recognition_count: 0,
          }),
          makeStaff("s3", {
            supervision_completed: 4, supervision_due: 10,
            sickness_days_90d: 12, wellbeing_score: 3,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
        ],
        home_level: makeHomeLevel({
          shifts_covered: 78, shifts_total: 100,
          agency_staff_in_use: 3,
          vacancy_count: 2, vacancy_total_posts: 12,
          handover_completion_rate: 70,
          lone_working_incidents: 2,
        }),
      }));
      expect(r.resilience_score).toBeGreaterThanOrEqual(45);
      expect(r.resilience_score).toBeLessThan(65);
      expect(r.resilience_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severely degraded workforce", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1", {
            supervision_completed: 1, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 20, wellbeing_score: 1,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
            dbs_current: false, induction_completed: false,
          }),
          makeStaff("s2", {
            supervision_completed: 0, supervision_due: 8,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 25, wellbeing_score: 1,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
            dbs_current: false, induction_completed: false,
          }),
        ],
        home_level: makeHomeLevel({
          shifts_covered: 55, shifts_total: 100,
          agency_staff_in_use: 6,
          vacancy_count: 5, vacancy_total_posts: 12,
          handover_completion_rate: 40,
          lone_working_incidents: 8,
          exit_interviews_conducted: 0, exit_interviews_due: 4,
        }),
      }));
      expect(r.resilience_score).toBeLessThan(45);
      expect(r.resilience_rating).toBe("inadequate");
      expect(r.staff_at_risk).toBeGreaterThanOrEqual(1);
    });
  });

  describe("staff categories", () => {
    it("categorises staff correctly across tiers", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1"),                                             // flourishing ≥80
          makeStaff("s2", {
            sickness_days_90d: 8, wellbeing_score: 5,
            has_development_plan: false, practice_observations: 1,
            recognition_count: 1,
          }),                                                           // stable 60-79
          makeStaff("s3", {
            supervision_completed: 3, supervision_due: 10,
            mandatory_training_current: false, sickness_days_90d: 12,
            wellbeing_score: 3, has_development_plan: false,
            practice_observations: 0, recognition_count: 0,
          }),                                                           // struggling 40-59
        ],
      }));
      expect(r.staff_flourishing + r.staff_stable + r.staff_struggling + r.staff_at_risk).toBe(3);
      expect(r.staff_flourishing).toBeGreaterThanOrEqual(1);
    });
  });

  describe("domain risk detection", () => {
    it("detects supervision risk", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { supervision_completed: 2, supervision_due: 10 })],
      }));
      const supDomain = r.domain_scores.find(d => d.name === "supervision");
      expect(supDomain?.staff_at_risk).toBe(1);
    });

    it("detects training risk", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { mandatory_training_current: false })],
      }));
      const trDomain = r.domain_scores.find(d => d.name === "training");
      expect(trDomain?.staff_at_risk).toBe(1);
    });

    it("detects wellbeing risk from high sickness", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { sickness_days_90d: 20, wellbeing_score: 2 })],
      }));
      const wbDomain = r.domain_scores.find(d => d.name === "wellbeing");
      expect(wbDomain?.staff_at_risk).toBe(1);
    });

    it("detects compliance risk from expired DBS", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { dbs_current: false })],
      }));
      const compDomain = r.domain_scores.find(d => d.name === "compliance");
      expect(compDomain?.staff_at_risk).toBe(1);
    });
  });

  describe("strengths", () => {
    it("generates flourishing strength when most staff flourish", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.strengths.some(s => s.includes("flourishing"))).toBe(true);
    });

    it("generates no at-risk strength", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.strengths.some(s => s.includes("No staff members at risk"))).toBe(true);
    });

    it("generates shift coverage strength", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.strengths.some(s => s.includes("Shift coverage"))).toBe(true);
    });

    it("generates no agency strength", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.strengths.some(s => s.includes("agency"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for multiple at-risk staff", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1", {
            supervision_completed: 0, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 25, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
          makeStaff("s2", {
            supervision_completed: 1, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 20, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
          makeStaff("s3", {
            supervision_completed: 1, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 18, wellbeing_score: 2,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0,
          }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("at risk"))).toBe(true);
    });

    it("raises vacancy concern when high", () => {
      const r = computeWorkforceResilience(baseInput({
        home_level: makeHomeLevel({ vacancy_count: 4, vacancy_total_posts: 12 }),
      }));
      expect(r.concerns.some(c => c.includes("Vacancy rate") || c.includes("vacancy"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends urgent support for at-risk staff", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1", {
            supervision_completed: 0, supervision_due: 8,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 20, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
          makeStaff("s2", {
            supervision_completed: 1, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 25, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates variation insight when at-risk and flourishing coexist", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1"),
          makeStaff("s2", {
            supervision_completed: 0, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 25, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
        ],
      }));
      expect(r.insights.some(i => i.text.includes("Variation") || i.text.includes("variation"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.headline).toContain("Outstanding");
    });

    it("inadequate headline", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [
          makeStaff("s1", {
            supervision_completed: 0, supervision_due: 10,
            mandatory_training_current: false, qualifications_met: false,
            sickness_days_90d: 25, wellbeing_score: 1,
            dbs_current: false, induction_completed: false,
            has_development_plan: false, practice_observations: 0,
            recognition_count: 0, grievance_active: true,
          }),
        ],
        home_level: makeHomeLevel({
          shifts_covered: 50, shifts_total: 100,
          agency_staff_in_use: 7,
          vacancy_count: 5, vacancy_total_posts: 12,
          handover_completion_rate: 30,
        }),
      }));
      expect(r.headline).toContain("inadequate");
    });
  });

  describe("edge cases", () => {
    it("handles single staff member", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1")], total_staff: 1,
      }));
      expect(r.resilience_rating).not.toBe("insufficient_data");
    });

    it("handles null wellbeing score", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { wellbeing_score: null })],
      }));
      expect(r.resilience_rating).not.toBe("insufficient_data");
    });

    it("handles zero supervision due", () => {
      const r = computeWorkforceResilience(baseInput({
        staff_snapshots: [makeStaff("s1", { supervision_completed: 0, supervision_due: 0 })],
      }));
      expect(r.resilience_rating).not.toBe("insufficient_data");
    });

    it("handles zero shifts total", () => {
      const r = computeWorkforceResilience(baseInput({
        home_level: makeHomeLevel({ shifts_covered: 0, shifts_total: 0 }),
      }));
      expect(r.resilience_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeWorkforceResilience(baseInput());
      expect(r.resilience_score).toBeGreaterThanOrEqual(0);
      expect(r.resilience_score).toBeLessThanOrEqual(100);
    });
  });
});
