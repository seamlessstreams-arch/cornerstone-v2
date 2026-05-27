import { describe, it, expect } from "vitest";
import {
  computeAccidentInjurySurveillance,
  type AccidentInjuryInput,
  type AccidentRecordInput,
  type InjuryRecordInput,
  type SafetyCheckInput,
} from "../home-accident-injury-surveillance-intelligence-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeAccident(id: string, o: Partial<AccidentRecordInput> = {}): AccidentRecordInput {
  return {
    id, child_id: "c1", staff_id: null, date: "2026-05-10",
    severity: "minor", location: "garden", type: "fall",
    investigated: true, debrief_completed: true,
    hospital_visit: false, riddor_reportable: false,
    ...o,
  };
}

function makeInjury(id: string, o: Partial<InjuryRecordInput> = {}): InjuryRecordInput {
  return {
    id, child_id: "c1", date: "2026-05-10",
    origin: "accidental", body_map_completed: true,
    photographed: true, reported_to_social_worker: true,
    ...o,
  };
}

function makeCheck(id: string, o: Partial<SafetyCheckInput> = {}): SafetyCheckInput {
  return { id, date: "2026-05-10", area: "kitchen", passed: true, issues_found: 0, issues_resolved: 0, ...o };
}

function baseInput(overrides: Partial<AccidentInjuryInput> = {}): AccidentInjuryInput {
  return {
    today: "2026-05-15",
    total_children: 6, total_staff: 8,
    accidents: [], injuries: [],
    safety_checks: [makeCheck("sc1"), makeCheck("sc2"), makeCheck("sc3")],
    debrief_records_total: 5, debrief_records_completed: 5,
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Accident & Injury Surveillance Intelligence Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no children and no records", () => {
      const r = computeAccidentInjurySurveillance({
        today: "2026-05-15", total_children: 0, total_staff: 0,
        accidents: [], injuries: [], safety_checks: [],
        debrief_records_total: 0, debrief_records_completed: 0,
      });
      expect(r.surveillance_rating).toBe("insufficient_data");
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with zero accidents and good checks", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.surveillance_score).toBeGreaterThanOrEqual(80);
      expect(r.surveillance_rating).toBe("outstanding");
    });

    it("rates outstanding with only minor accidents fully investigated", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [makeAccident("a1"), makeAccident("a2")],
      }));
      expect(r.surveillance_score).toBeGreaterThanOrEqual(80);
      expect(r.surveillance_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with moderate accident load", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1"), makeAccident("a2"), makeAccident("a3"),
          makeAccident("a4", { severity: "moderate" }),
        ],
        injuries: [
          makeInjury("i1"), makeInjury("i2"),
          makeInjury("i3", { child_id: "c2" }),
        ],
        safety_checks: [
          makeCheck("sc1"), makeCheck("sc2"),
          makeCheck("sc3", { passed: false, issues_found: 2, issues_resolved: 1 }),
        ],
      }));
      expect(r.surveillance_score).toBeGreaterThanOrEqual(65);
      expect(r.surveillance_score).toBeLessThan(80);
      expect(r.surveillance_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with concerning patterns", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1", { severity: "serious" }),
          makeAccident("a2"), makeAccident("a3"), makeAccident("a4"),
          makeAccident("a5", { investigated: false, debrief_completed: false }),
          makeAccident("a6", { investigated: false, debrief_completed: false }),
        ],
        injuries: [
          makeInjury("i1", { origin: "unexplained", body_map_completed: false }),
          makeInjury("i2", { body_map_completed: false, reported_to_social_worker: false }),
          makeInjury("i3", { child_id: "c1" }),
          makeInjury("i4", { child_id: "c1" }),
          makeInjury("i5", { child_id: "c1" }),
        ],
        safety_checks: [
          makeCheck("sc1", { passed: false, issues_found: 3, issues_resolved: 1 }),
          makeCheck("sc2", { passed: false, issues_found: 2, issues_resolved: 0 }),
          makeCheck("sc3"),
        ],
      }));
      expect(r.surveillance_score).toBeGreaterThanOrEqual(45);
      expect(r.surveillance_score).toBeLessThan(65);
      expect(r.surveillance_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severe safety failures", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1", { severity: "critical", hospital_visit: true, riddor_reportable: true }),
          makeAccident("a2", { severity: "serious", hospital_visit: true, riddor_reportable: true }),
          makeAccident("a3", { severity: "serious" }),
          makeAccident("a4", { severity: "serious" }),
          makeAccident("a5", { investigated: false, debrief_completed: false }),
          makeAccident("a6", { investigated: false, debrief_completed: false }),
          makeAccident("a7", { investigated: false, debrief_completed: false }),
          makeAccident("a8", { investigated: false, debrief_completed: false }),
          makeAccident("a9"), makeAccident("a10"), makeAccident("a11"), makeAccident("a12"),
          makeAccident("a13"),
        ],
        injuries: [
          makeInjury("i1", { origin: "unexplained", body_map_completed: false }),
          makeInjury("i2", { origin: "unexplained", body_map_completed: false }),
          makeInjury("i3", { origin: "unexplained", body_map_completed: false }),
          makeInjury("i4", { origin: "unexplained", body_map_completed: false }),
          makeInjury("i5", { child_id: "c1" }),
          makeInjury("i6", { child_id: "c1" }),
          makeInjury("i7", { child_id: "c1" }),
          makeInjury("i8", { child_id: "c2" }),
          makeInjury("i9", { child_id: "c2" }),
          makeInjury("i10", { child_id: "c2" }),
        ],
        safety_checks: [
          makeCheck("sc1", { passed: false, issues_found: 5, issues_resolved: 0 }),
          makeCheck("sc2", { passed: false, issues_found: 3, issues_resolved: 1 }),
          makeCheck("sc3", { passed: false, issues_found: 4, issues_resolved: 0 }),
        ],
        debrief_records_total: 10, debrief_records_completed: 3,
      }));
      expect(r.surveillance_score).toBeLessThan(45);
      expect(r.surveillance_rating).toBe("inadequate");
    });
  });

  describe("metrics", () => {
    it("counts accidents and injuries correctly", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [makeAccident("a1"), makeAccident("a2", { severity: "serious" })],
        injuries: [makeInjury("i1"), makeInjury("i2", { origin: "unexplained" })],
      }));
      expect(r.accidents_total).toBe(2);
      expect(r.accidents_serious).toBe(1);
      expect(r.injuries_total).toBe(2);
      expect(r.injuries_unexplained).toBe(1);
    });

    it("counts repeat injury children", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        injuries: [
          makeInjury("i1", { child_id: "c1" }),
          makeInjury("i2", { child_id: "c1" }),
          makeInjury("i3", { child_id: "c1" }),
        ],
      }));
      expect(r.children_with_repeat_injuries).toBe(1);
    });

    it("tracks hospital visits and RIDDOR", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1", { hospital_visit: true, riddor_reportable: true }),
        ],
      }));
      expect(r.hospital_visits).toBe(1);
      expect(r.riddor_count).toBe(1);
    });
  });

  describe("strengths", () => {
    it("generates zero accidents strength", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.strengths.some(s => s.includes("Zero accidents"))).toBe(true);
    });

    it("generates safety check strength", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.strengths.some(s => s.includes("Safety check"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises unexplained injury concern", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        injuries: [
          makeInjury("i1", { origin: "unexplained" }),
          makeInjury("i2", { origin: "unexplained" }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("unexplained"))).toBe(true);
    });

    it("raises serious accident concern", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1", { severity: "serious" }),
          makeAccident("a2", { severity: "critical" }),
          makeAccident("a3", { severity: "serious" }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("serious") || c.includes("safety failure"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends safeguarding review for unexplained injuries", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        injuries: [
          makeInjury("i1", { origin: "unexplained" }),
          makeInjury("i2", { origin: "unexplained" }),
        ],
      }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates location hotspot insight", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [
          makeAccident("a1", { location: "stairs" }),
          makeAccident("a2", { location: "stairs" }),
          makeAccident("a3", { location: "stairs" }),
        ],
      }));
      expect(r.insights.some(i => i.text.includes("hotspot") || i.text.includes("stairs"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("excludes old accidents beyond 90 days", () => {
      const r = computeAccidentInjurySurveillance(baseInput({
        accidents: [makeAccident("a1", { date: "2026-01-01" })],
      }));
      expect(r.accidents_total).toBe(0);
    });

    it("scores are 0-100", () => {
      const r = computeAccidentInjurySurveillance(baseInput());
      expect(r.surveillance_score).toBeGreaterThanOrEqual(0);
      expect(r.surveillance_score).toBeLessThanOrEqual(100);
    });
  });
});
