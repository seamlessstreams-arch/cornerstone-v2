import { describe, it, expect } from "vitest";
import {
  computeHomeChildWellbeingComposite,
  type HomeChildWellbeingCompositeInput,
  type ChildWellbeingSnapshot,
} from "../home-child-wellbeing-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeChild(id: string, o: Partial<ChildWellbeingSnapshot> = {}): ChildWellbeingSnapshot {
  return {
    child_id: id,
    health_appointments_attended: 10, health_appointments_total: 10,
    immunisations_current: true, dental_current: true, optician_current: true,
    mental_health_referral_active: false, therapeutic_sessions_attended: 0,
    therapeutic_sessions_offered: 0, sdq_score: 10,
    positive_behaviour_count: 20, concerning_behaviour_count: 2,
    restraint_count: 0, sanctions_count: 0,
    avg_sleep_hours: 9, sleep_disruptions_7d: 0,
    meals_eaten_rate: 95, dietary_needs_met: true,
    attendance_rate: 97, exclusion_days: 0,
    friends_count: 4, isolation_risk: "none",
    family_contact_frequency: "weekly",
    ...o,
  };
}

function baseInput(overrides: Partial<HomeChildWellbeingCompositeInput> = {}): HomeChildWellbeingCompositeInput {
  return {
    today: "2026-05-15",
    child_snapshots: [makeChild("c1"), makeChild("c2"), makeChild("c3")],
    total_children: 3,
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Child Wellbeing Composite Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no snapshots", () => {
      const r = computeHomeChildWellbeingComposite({
        today: "2026-05-15", child_snapshots: [], total_children: 0,
      });
      expect(r.wellbeing_rating).toBe("insufficient_data");
      expect(r.wellbeing_score).toBe(0);
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding when all children have excellent data", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      expect(r.wellbeing_score).toBeGreaterThanOrEqual(80);
      expect(r.wellbeing_rating).toBe("outstanding");
      expect(r.children_flourishing).toBe(3);
      expect(r.children_crisis).toBe(0);
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some degraded children", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1"), // flourishing
          makeChild("c2", {
            attendance_rate: 82, avg_sleep_hours: 6.5, sdq_score: 18,
            meals_eaten_rate: 65, isolation_risk: "moderate",
            family_contact_frequency: "monthly", restraint_count: 1,
            positive_behaviour_count: 10, concerning_behaviour_count: 8,
          }),
          makeChild("c3", {
            meals_eaten_rate: 60, avg_sleep_hours: 6, sdq_score: 17,
            attendance_rate: 80, family_contact_frequency: "monthly",
            isolation_risk: "moderate", restraint_count: 2,
            positive_behaviour_count: 8, concerning_behaviour_count: 8,
          }),
        ],
      }));
      expect(r.wellbeing_score).toBeGreaterThanOrEqual(65);
      expect(r.wellbeing_score).toBeLessThan(80);
      expect(r.wellbeing_rating).toBe("good");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severely degraded children", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1", {
            health_appointments_attended: 1, health_appointments_total: 10,
            immunisations_current: false, dental_current: false, optician_current: false,
            sdq_score: 25, therapeutic_sessions_attended: 1, therapeutic_sessions_offered: 10,
            positive_behaviour_count: 2, concerning_behaviour_count: 15,
            restraint_count: 5, avg_sleep_hours: 5, sleep_disruptions_7d: 6,
            meals_eaten_rate: 40, dietary_needs_met: false,
            attendance_rate: 60, exclusion_days: 5,
            isolation_risk: "high", family_contact_frequency: "none",
          }),
          makeChild("c2", {
            health_appointments_attended: 2, health_appointments_total: 8,
            immunisations_current: false, dental_current: false, optician_current: false,
            sdq_score: 22, therapeutic_sessions_attended: 0, therapeutic_sessions_offered: 5,
            positive_behaviour_count: 3, concerning_behaviour_count: 10,
            restraint_count: 4, avg_sleep_hours: 5, sleep_disruptions_7d: 5,
            meals_eaten_rate: 35, dietary_needs_met: false,
            attendance_rate: 55, exclusion_days: 8,
            isolation_risk: "high", family_contact_frequency: "none",
          }),
        ],
      }));
      expect(r.wellbeing_score).toBeLessThan(45);
      expect(r.wellbeing_rating).toBe("inadequate");
      expect(r.children_crisis).toBeGreaterThanOrEqual(1);
    });
  });

  describe("child categories", () => {
    it("categorizes children correctly", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1"), // flourishing (≥80)
          makeChild("c2", { avg_sleep_hours: 7, attendance_rate: 88, sdq_score: 16, isolation_risk: "mild" }), // stable (60-79)
          makeChild("c3", {
            health_appointments_attended: 3, health_appointments_total: 10,
            immunisations_current: false, sdq_score: 20,
            positive_behaviour_count: 5, concerning_behaviour_count: 12,
            restraint_count: 3, avg_sleep_hours: 6, sleep_disruptions_7d: 4,
            meals_eaten_rate: 60, attendance_rate: 75, exclusion_days: 3,
            isolation_risk: "moderate", family_contact_frequency: "monthly",
          }), // struggling
        ],
      }));
      expect(r.children_flourishing).toBeGreaterThanOrEqual(1);
      expect(r.children_flourishing + r.children_stable + r.children_struggling + r.children_crisis).toBe(3);
    });
  });

  describe("domain risk detection", () => {
    it("detects health risk", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { immunisations_current: false })],
      }));
      const healthDomain = r.domain_scores.find(d => d.name === "health");
      expect(healthDomain?.children_at_risk).toBe(1);
    });

    it("detects mental health risk", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { sdq_score: 25 })],
      }));
      expect(r.child_summaries[0].domains_at_risk).toContain("mental_health");
    });

    it("detects behaviour risk from restraints", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { restraint_count: 5 })],
      }));
      expect(r.child_summaries[0].domains_at_risk).toContain("behaviour");
    });

    it("detects sleep risk", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { avg_sleep_hours: 5 })],
      }));
      expect(r.child_summaries[0].domains_at_risk).toContain("sleep");
    });

    it("detects education risk", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { attendance_rate: 70, exclusion_days: 5 })],
      }));
      expect(r.child_summaries[0].domains_at_risk).toContain("education");
    });

    it("detects social risk", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { isolation_risk: "high" })],
      }));
      expect(r.child_summaries[0].domains_at_risk).toContain("social");
    });
  });

  describe("strengths", () => {
    it("generates flourishing strength when most children are flourishing", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      expect(r.strengths.some(s => s.includes("flourishing"))).toBe(true);
    });

    it("generates no crisis strength", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      expect(r.strengths.some(s => s.includes("No children in crisis"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for children in crisis", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1", {
            health_appointments_attended: 1, health_appointments_total: 10,
            immunisations_current: false, dental_current: false, optician_current: false,
            sdq_score: 30, restraint_count: 5, avg_sleep_hours: 4,
            meals_eaten_rate: 30, dietary_needs_met: false,
            attendance_rate: 50, exclusion_days: 10,
            isolation_risk: "high", family_contact_frequency: "none",
          }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("crisis"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends urgent review for crisis children", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1", {
            health_appointments_attended: 0, health_appointments_total: 5,
            immunisations_current: false, dental_current: false, optician_current: false,
            sdq_score: 28, restraint_count: 6, avg_sleep_hours: 4,
            meals_eaten_rate: 25, dietary_needs_met: false,
            attendance_rate: 40, exclusion_days: 12,
            isolation_risk: "high", family_contact_frequency: "none",
          }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates variation insight when crisis and flourishing coexist", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [
          makeChild("c1"), // flourishing
          makeChild("c2", {
            health_appointments_attended: 0, health_appointments_total: 8,
            immunisations_current: false, dental_current: false, optician_current: false,
            sdq_score: 28, restraint_count: 6, avg_sleep_hours: 4,
            meals_eaten_rate: 25, dietary_needs_met: false,
            attendance_rate: 40, exclusion_days: 12,
            isolation_risk: "high", family_contact_frequency: "none",
          }),
        ],
      }));
      expect(r.insights.some(i => i.text.includes("variation") || i.text.includes("inconsistent"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("handles single child", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1")], total_children: 1,
      }));
      expect(r.wellbeing_rating).not.toBe("insufficient_data");
      expect(r.child_summaries).toHaveLength(1);
    });

    it("handles null SDQ score", () => {
      const r = computeHomeChildWellbeingComposite(baseInput({
        child_snapshots: [makeChild("c1", { sdq_score: null })],
      }));
      expect(r.wellbeing_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeHomeChildWellbeingComposite(baseInput());
      r.child_summaries.forEach(s => {
        expect(s.overall_score).toBeGreaterThanOrEqual(0);
        expect(s.overall_score).toBeLessThanOrEqual(100);
      });
    });
  });
});
