import { describe, it, expect } from "vitest";
import {
  computeHomeOfstedReadiness,
  type HomeOfstedReadinessInput,
  type EngineScoreInput,
} from "../home-ofsted-readiness-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeEngine(name: string, score: number, rating: string, domain: string): EngineScoreInput {
  return { engine_name: name, score, rating, domain };
}

function fullEngineSet(defaultScore: number, defaultRating: string): EngineScoreInput[] {
  const engines: [string, string][] = [
    // Experiences
    ["health-wellbeing", "experiences"], ["mental-health", "experiences"],
    ["education-engagement", "experiences"], ["therapeutic-progress", "experiences"],
    ["enrichment-achievement", "experiences"], ["community-access", "experiences"],
    ["independence-life-skills", "experiences"], ["living-environment", "experiences"],
    ["cultural-identity", "experiences"], ["life-story-identity", "experiences"],
    ["placement-journey", "experiences"], ["childrens-rights-participation", "experiences"],
    ["night-care-safety", "experiences"], ["placement-stability-depth", "experiences"],
    // Protection
    ["safeguarding-depth", "protection"], ["safeguarding-prevention", "protection"],
    ["exploitation-screening", "protection"], ["missing-episodes", "protection"],
    ["incident-safety", "protection"], ["risk-assessment", "protection"],
    ["strategic-risk", "protection"], ["building-ops-safety", "protection"],
    ["medication-governance", "protection"], ["restrictive-practice", "protection"],
    // Leadership
    ["regulatory-compliance", "leadership"], ["reg4445-evidence", "leadership"],
    ["quality-assurance", "leadership"], ["data-governance", "leadership"],
    ["document-governance", "leadership"], ["organizational-learning", "leadership"],
    // Workforce
    ["workforce-planning", "workforce"], ["staff-lifecycle", "workforce"],
    ["supervision", "workforce"], ["competency-landscape", "workforce"],
    ["safer-recruitment", "workforce"], ["shift-pattern", "workforce"],
  ];
  return engines.map(([name, domain]) => makeEngine(name, defaultScore, defaultRating, domain));
}

function baseInput(overrides: Partial<HomeOfstedReadinessInput> = {}): HomeOfstedReadinessInput {
  return {
    today: "2026-05-15",
    engine_scores: fullEngineSet(85, "outstanding"),
    total_children: 4,
    total_staff: 8,
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Ofsted Readiness Composite Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no scorable engines", () => {
      const r = computeHomeOfstedReadiness({
        today: "2026-05-15",
        engine_scores: [makeEngine("test", 0, "insufficient_data", "experiences")],
        total_children: 0, total_staff: 0,
      });
      expect(r.overall_grade).toBe("insufficient_data");
      expect(r.overall_score).toBe(0);
    });

    it("returns insufficient_data when no engines at all", () => {
      const r = computeHomeOfstedReadiness({
        today: "2026-05-15", engine_scores: [],
        total_children: 4, total_staff: 8,
      });
      expect(r.overall_grade).toBe("insufficient_data");
    });
  });

  describe("outstanding overall", () => {
    it("rates outstanding when all engines are outstanding", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.overall_grade).toBe("outstanding");
      expect(r.overall_score).toBe(85);
      expect(r.engines_outstanding).toBe(36);
    });
  });

  describe("good overall", () => {
    it("rates good when mix of outstanding and good engines", () => {
      const engines = fullEngineSet(75, "good");
      // A few outstanding to verify it doesn't over-promote
      engines.filter(e => e.engine_name === "health-wellbeing").forEach(e => { e.score = 85; e.rating = "outstanding"; });
      engines.filter(e => e.engine_name === "safeguarding-depth").forEach(e => { e.score = 82; e.rating = "outstanding"; });
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.overall_grade).toBe("good");
      expect(r.overall_score).toBeGreaterThanOrEqual(65);
      expect(r.overall_score).toBeLessThan(80);
    });
  });

  describe("requires_improvement overall", () => {
    it("rates requires_improvement when areas are mixed", () => {
      const engines = fullEngineSet(55, "adequate");
      // Some inadequate
      engines.filter(e => e.engine_name === "safeguarding-depth").forEach(e => { e.score = 35; e.rating = "inadequate"; });
      engines.filter(e => e.engine_name === "missing-episodes").forEach(e => { e.score = 40; e.rating = "inadequate"; });
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.overall_grade).toBe("requires_improvement");
    });
  });

  describe("inadequate overall", () => {
    it("rates inadequate when any judgement area is inadequate", () => {
      const engines = fullEngineSet(70, "good");
      // Make all protection engines inadequate
      engines.filter(e => e.domain === "protection").forEach(e => { e.score = 30; e.rating = "inadequate"; });
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.overall_grade).toBe("inadequate");
    });
  });

  describe("judgement areas", () => {
    it("computes 4 judgement areas", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.judgement_areas).toHaveLength(4);
    });

    it("identifies weakest and strongest engines per area", () => {
      const engines = fullEngineSet(80, "outstanding");
      engines.find(e => e.engine_name === "mental-health")!.score = 60;
      engines.find(e => e.engine_name === "mental-health")!.rating = "adequate";
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      const expArea = r.judgement_areas.find(a => a.name.includes("experiences"));
      expect(expArea?.weakest_engine).toBe("Mental Health");
      expect(expArea?.weakest_score).toBe(60);
    });

    it("handles missing area engines gracefully", () => {
      const r = computeHomeOfstedReadiness(baseInput({
        engine_scores: [
          makeEngine("health-wellbeing", 85, "outstanding", "experiences"),
          makeEngine("safeguarding-depth", 85, "outstanding", "protection"),
        ],
      }));
      const workforceArea = r.judgement_areas.find(a => a.name.includes("social work"));
      expect(workforceArea?.grade).toBe("insufficient_data");
    });
  });

  describe("engine counts", () => {
    it("counts engines by rating correctly", () => {
      const r = computeHomeOfstedReadiness(baseInput({
        engine_scores: [
          makeEngine("a", 90, "outstanding", "experiences"),
          makeEngine("b", 70, "good", "protection"),
          makeEngine("c", 55, "adequate", "leadership"),
          makeEngine("d", 30, "inadequate", "workforce"),
          makeEngine("e", 0, "insufficient_data", "experiences"),
        ],
      }));
      expect(r.engines_outstanding).toBe(1);
      expect(r.engines_good).toBe(1);
      expect(r.engines_adequate).toBe(1);
      expect(r.engines_inadequate).toBe(1);
      expect(r.engines_no_data).toBe(1);
      expect(r.total_engines).toBe(4); // excludes insufficient_data
    });
  });

  describe("strengths", () => {
    it("generates outstanding count strength", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.strengths.some(s => s.includes("outstanding"))).toBe(true);
    });

    it("generates no inadequate strength when applicable", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.strengths.some(s => s.includes("No engines rated inadequate"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("flags inadequate engines", () => {
      const engines = fullEngineSet(80, "outstanding");
      engines.find(e => e.engine_name === "safeguarding-depth")!.score = 30;
      engines.find(e => e.engine_name === "safeguarding-depth")!.rating = "inadequate";
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.concerns.some(c => c.includes("inadequate"))).toBe(true);
    });

    it("flags insufficient data engines", () => {
      const engines = fullEngineSet(80, "outstanding");
      const noDataEngines = Array.from({ length: 12 }, (_, i) => makeEngine(`nodata-${i}`, 0, "insufficient_data", "experiences"));
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: [...engines, ...noDataEngines] }));
      expect(r.concerns.some(c => c.includes("insufficient data"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends improving inadequate engines", () => {
      const engines = fullEngineSet(80, "outstanding");
      engines.find(e => e.engine_name === "safeguarding-depth")!.score = 25;
      engines.find(e => e.engine_name === "safeguarding-depth")!.rating = "inadequate";
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.recommendation.includes("Safeguarding Depth"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding insight", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("outstanding"))).toBe(true);
    });

    it("generates inadequate insight", () => {
      const engines = fullEngineSet(30, "inadequate");
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.insights.some(i => i.severity === "critical")).toBe(true);
    });

    it("generates inconsistency insight when areas differ widely", () => {
      const engines = fullEngineSet(85, "outstanding");
      engines.filter(e => e.domain === "protection").forEach(e => { e.score = 30; e.rating = "inadequate"; });
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.insights.some(i => i.text.includes("inconsistency"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeHomeOfstedReadiness(baseInput());
      expect(r.headline).toContain("Outstanding");
    });

    it("inadequate headline", () => {
      const engines = fullEngineSet(30, "inadequate");
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      expect(r.headline).toContain("Inadequate");
    });
  });

  describe("edge cases", () => {
    it("single engine", () => {
      const r = computeHomeOfstedReadiness(baseInput({
        engine_scores: [makeEngine("health-wellbeing", 85, "outstanding", "experiences")],
      }));
      expect(r.overall_grade).toBe("outstanding");
      expect(r.total_engines).toBe(1);
    });

    it("overall limited by weakest area — inadequate area forces overall down", () => {
      const engines = fullEngineSet(85, "outstanding");
      engines.filter(e => e.domain === "protection").forEach(e => { e.score = 30; e.rating = "inadequate"; });
      const r = computeHomeOfstedReadiness(baseInput({ engine_scores: engines }));
      // Protection area is inadequate → overall must be inadequate regardless of other areas
      expect(r.overall_grade).toBe("inadequate");
    });
  });
});
