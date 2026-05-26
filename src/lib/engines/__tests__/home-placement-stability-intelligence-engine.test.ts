import { describe, it, expect } from "vitest";
import {
  computeHomePlacementStability,
  type HomePlacementStabilityInput,
  type PlacementChildInput,
  type PlacementIncidentInput,
  type PlacementMissingInput,
} from "../home-placement-stability-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = "2026-05-26";

function makeChild(overrides?: Partial<PlacementChildInput>): PlacementChildInput {
  return {
    child_id: "c1",
    placement_start: "2025-09-01",
    risk_flag_count: 0,
    ...overrides,
  };
}

function makeIncident(overrides?: Partial<PlacementIncidentInput>): PlacementIncidentInput {
  return {
    child_id: "c1",
    date: "2026-04-01",
    severity: "low",
    ...overrides,
  };
}

function makeMissing(overrides?: Partial<PlacementMissingInput>): PlacementMissingInput {
  return {
    child_id: "c1",
    date: "2026-04-01",
    risk_level: "low",
    duration_hours: 1.5,
    return_interview_completed: true,
    contextual_safeguarding_risk: false,
    ...overrides,
  };
}

function baseInput(overrides?: Partial<HomePlacementStabilityInput>): HomePlacementStabilityInput {
  return {
    today: TODAY,
    children: [],
    incidents: [],
    missing_episodes: [],
    lookback_days: 180,
    ...overrides,
  };
}

/** 4 children placed ~267 days ago, 0 flags each — clean outstanding baseline */
function outstandingChildren(): PlacementChildInput[] {
  return [
    makeChild({ child_id: "c1", placement_start: "2025-09-01", risk_flag_count: 0 }),
    makeChild({ child_id: "c2", placement_start: "2025-09-01", risk_flag_count: 0 }),
    makeChild({ child_id: "c3", placement_start: "2025-09-01", risk_flag_count: 1 }),
    makeChild({ child_id: "c4", placement_start: "2025-09-01", risk_flag_count: 1 }),
  ];
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("computeHomePlacementStability", () => {

  // ─── Insufficient Data ───────────────────────────────────────────

  describe("insufficient data", () => {
    it("returns insufficient_data when no children provided", () => {
      const r = computeHomePlacementStability(baseInput());
      expect(r.stability_rating).toBe("insufficient_data");
      expect(r.stability_score).toBe(0);
    });

    it("returns empty profiles on insufficient data", () => {
      const r = computeHomePlacementStability(baseInput());
      expect(r.tenure_profile.avg_tenure_days).toBe(0);
      expect(r.incident_profile.total_incidents).toBe(0);
      expect(r.missing_profile.total_episodes).toBe(0);
      expect(r.stability_profile.stability_rate).toBe(0);
    });

    it("returns concern, recommendation and critical insight on insufficient data", () => {
      const r = computeHomePlacementStability(baseInput());
      expect(r.concerns.length).toBeGreaterThan(0);
      expect(r.recommendations.length).toBe(1);
      expect(r.recommendations[0].urgency).toBe("immediate");
      expect(r.insights[0].severity).toBe("critical");
    });
  });

  // ─── Rating Classifications ──────────────────────────────────────

  describe("rating classifications", () => {
    it("rates outstanding with clean placements — score 80", () => {
      // 4 children, 267d tenure, 0 flags avg 0.5, 0 incidents, 0 missing
      // tenure 267d → +5 | rate 0 → +4 | highSev 0 → +3 | missing 0 → +4
      // highRisk 0 → +3 | return n/a → +3 | stability 100% → +3 | flags 0.5 → +3
      // = 52 + 28 = 80
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(),
      }));
      expect(r.stability_score).toBe(80);
      expect(r.stability_rating).toBe("outstanding");
    });

    it("rates good with minor events — score 72", () => {
      // 4 children, 114d tenure, 1 flag each
      // 2 incidents (both for c1, 0 high severity), 1 missing (c1, low risk, return done)
      // tenure 114d → +3 | rate 0.5 → +2 | highSev 0 → +3 | missing 1 → +2
      // highRisk 0 → +3 | return 100% → +3 | stability 3/4=75% → +1 | flags 1.0 → +3
      // = 52 + 20 = 72
      const children = [
        makeChild({ child_id: "c1", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c2", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c3", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c4", placement_start: "2026-02-01", risk_flag_count: 1 }),
      ];
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01", severity: "low" }),
        makeIncident({ child_id: "c1", date: "2026-04-15", severity: "medium" }),
      ];
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-03-15" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.stability_score).toBe(72);
      expect(r.stability_rating).toBe("good");
    });

    it("rates adequate with mixed stability — score 52", () => {
      // 4 children, 55d tenure, 2 flags each
      // 6 incidents (1 high), 3 missing (1 high risk, 1/3 return interview)
      // tenure 55d → +1 | rate 1.5 → +0 | highSev 1 → +1 | missing 3 → +0
      // highRisk 1 → +1 | return 33% → -2 | stability 25% → -2 | flags 2.0 → +1
      // = 52 + 0 = 52
      const children = [
        makeChild({ child_id: "c1", placement_start: "2026-04-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c2", placement_start: "2026-04-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c3", placement_start: "2026-04-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c4", placement_start: "2026-04-01", risk_flag_count: 2 }),
      ];
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-10", severity: "low" }),
        makeIncident({ child_id: "c1", date: "2026-04-20", severity: "high" }),
        makeIncident({ child_id: "c2", date: "2026-04-15", severity: "low" }),
        makeIncident({ child_id: "c2", date: "2026-04-25", severity: "medium" }),
        makeIncident({ child_id: "c3", date: "2026-05-01", severity: "low" }),
        makeIncident({ child_id: "c3", date: "2026-05-10", severity: "medium" }),
      ];
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-04-12", risk_level: "high", return_interview_completed: true }),
        makeMissing({ child_id: "c2", date: "2026-04-18", risk_level: "low", return_interview_completed: false }),
        makeMissing({ child_id: "c3", date: "2026-05-05", risk_level: "low", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.stability_score).toBe(52);
      expect(r.stability_rating).toBe("adequate");
    });

    it("rates inadequate with severe instability — score 32", () => {
      // 4 children, 16d tenure, 3 flags each
      // 12 incidents (3 high), 5 missing (2 high risk, 1/5 return interview)
      // tenure 16d → -4 | rate 3.0 → -3 | highSev 3 → -2 | missing 5 → -3
      // highRisk 2 → -2 | return 20% → -2 | stability 0% → -2 | flags 3.0 → -2
      // = 52 - 20 = 32
      const children = [
        makeChild({ child_id: "c1", placement_start: "2026-05-10", risk_flag_count: 3 }),
        makeChild({ child_id: "c2", placement_start: "2026-05-10", risk_flag_count: 3 }),
        makeChild({ child_id: "c3", placement_start: "2026-05-10", risk_flag_count: 3 }),
        makeChild({ child_id: "c4", placement_start: "2026-05-10", risk_flag_count: 3 }),
      ];
      const incidents: PlacementIncidentInput[] = [];
      for (let i = 0; i < 12; i++) {
        incidents.push(makeIncident({
          child_id: `c${(i % 4) + 1}`,
          date: "2026-05-15",
          severity: i < 3 ? "high" : "low",
        }));
      }
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-05-12", risk_level: "high", return_interview_completed: true }),
        makeMissing({ child_id: "c2", date: "2026-05-13", risk_level: "high", return_interview_completed: false }),
        makeMissing({ child_id: "c3", date: "2026-05-14", risk_level: "low", return_interview_completed: false }),
        makeMissing({ child_id: "c4", date: "2026-05-15", risk_level: "low", return_interview_completed: false }),
        makeMissing({ child_id: "c1", date: "2026-05-16", risk_level: "low", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.stability_score).toBe(32);
      expect(r.stability_rating).toBe("inadequate");
    });
  });

  // ─── Tenure Profile ──────────────────────────────────────────────

  describe("tenure profile", () => {
    it("calculates average tenure in days", () => {
      const children = outstandingChildren();
      const r = computeHomePlacementStability(baseInput({ children }));
      // Sep 1 2025 to May 26 2026 = 267 days
      expect(r.tenure_profile.avg_tenure_days).toBe(267);
    });

    it("tracks longest and shortest tenure", () => {
      const children = [
        makeChild({ child_id: "c1", placement_start: "2025-09-01" }), // 267d
        makeChild({ child_id: "c2", placement_start: "2026-04-01" }), // 55d
      ];
      const r = computeHomePlacementStability(baseInput({ children }));
      expect(r.tenure_profile.longest_tenure_days).toBe(267);
      expect(r.tenure_profile.shortest_tenure_days).toBe(55);
    });

    it("counts children over 6 months and under 3 months", () => {
      const children = [
        makeChild({ child_id: "c1", placement_start: "2025-09-01" }), // 267d ≥ 180
        makeChild({ child_id: "c2", placement_start: "2026-01-01" }), // 145d
        makeChild({ child_id: "c3", placement_start: "2026-04-01" }), // 55d < 90
      ];
      const r = computeHomePlacementStability(baseInput({ children }));
      expect(r.tenure_profile.children_over_6_months).toBe(1);
      expect(r.tenure_profile.children_under_3_months).toBe(1);
    });

    it("clamps negative tenure to 0 for future start dates", () => {
      const children = [makeChild({ placement_start: "2026-06-01" })]; // starts after today
      const r = computeHomePlacementStability(baseInput({ children }));
      expect(r.tenure_profile.avg_tenure_days).toBe(0);
    });
  });

  // ─── Incident Profile ────────────────────────────────────────────

  describe("incident profile", () => {
    it("counts incidents within lookback window", () => {
      const children = outstandingChildren();
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c2", date: "2026-05-01" }),
        makeIncident({ child_id: "c1", date: "2025-01-01" }), // outside lookback
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.incident_profile.total_incidents).toBe(2);
    });

    it("calculates incident rate per child", () => {
      const children = outstandingChildren(); // 4 children
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c1", date: "2026-04-15" }),
        makeIncident({ child_id: "c2", date: "2026-05-01" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      // 3 / 4 = 0.75 → round to 0.8
      expect(r.incident_profile.incident_rate).toBe(0.8);
    });

    it("counts high severity incidents", () => {
      const children = [makeChild()];
      const incidents = [
        makeIncident({ date: "2026-04-01", severity: "low" }),
        makeIncident({ date: "2026-04-10", severity: "high" }),
        makeIncident({ date: "2026-04-20", severity: "critical" }),
        makeIncident({ date: "2026-05-01", severity: "medium" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.incident_profile.high_severity_count).toBe(2);
    });

    it("counts unique children with incidents", () => {
      const children = outstandingChildren();
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c1", date: "2026-04-15" }),
        makeIncident({ child_id: "c3", date: "2026-05-01" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.incident_profile.children_with_incidents).toBe(2);
    });
  });

  // ─── Missing Profile ─────────────────────────────────────────────

  describe("missing profile", () => {
    it("counts episodes within lookback window", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01" }),
        makeMissing({ date: "2026-05-01" }),
        makeMissing({ date: "2025-01-01" }), // outside lookback
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.missing_profile.total_episodes).toBe(2);
    });

    it("calculates average duration", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", duration_hours: 2.0 }),
        makeMissing({ date: "2026-05-01", duration_hours: 4.0 }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.missing_profile.avg_duration_hours).toBe(3);
    });

    it("counts high-risk episodes and CS risk", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", risk_level: "low", contextual_safeguarding_risk: false }),
        makeMissing({ date: "2026-04-10", risk_level: "high", contextual_safeguarding_risk: true }),
        makeMissing({ date: "2026-05-01", risk_level: "critical", contextual_safeguarding_risk: true }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.missing_profile.high_risk_count).toBe(2);
      expect(r.missing_profile.cs_risk_count).toBe(2);
    });

    it("calculates return interview rate", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", return_interview_completed: true }),
        makeMissing({ date: "2026-04-10", return_interview_completed: false }),
        makeMissing({ date: "2026-05-01", return_interview_completed: true }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      // 2/3 = 67%
      expect(r.missing_profile.return_interview_rate).toBe(67);
    });
  });

  // ─── Stability Profile ───────────────────────────────────────────

  describe("stability profile", () => {
    it("calculates stability rate — children with no events", () => {
      const children = outstandingChildren();
      const incidents = [makeIncident({ child_id: "c1", date: "2026-04-01" })];
      const missing_episodes = [makeMissing({ child_id: "c2", date: "2026-04-01" })];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      // c1 has incident, c2 has missing → c3, c4 are clean = 2/4 = 50%
      expect(r.stability_profile.children_with_no_events).toBe(2);
      expect(r.stability_profile.stability_rate).toBe(50);
    });

    it("returns 100% when no incidents or missing episodes", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.stability_profile.stability_rate).toBe(100);
    });

    it("calculates average risk flags", () => {
      const children = [
        makeChild({ child_id: "c1", risk_flag_count: 1 }),
        makeChild({ child_id: "c2", risk_flag_count: 3 }),
        makeChild({ child_id: "c3", risk_flag_count: 2 }),
      ];
      const r = computeHomePlacementStability(baseInput({ children }));
      // (1+3+2)/3 = 2.0
      expect(r.stability_profile.avg_risk_flags).toBe(2);
    });
  });

  // ─── Scoring Modifiers ──────────────────────────────────────────

  describe("scoring modifiers", () => {
    it("modifier 1: tenure 90–179d gives +3", () => {
      // 4 children at 114d, rest outstanding
      const children = [
        makeChild({ child_id: "c1", placement_start: "2026-02-01" }),
        makeChild({ child_id: "c2", placement_start: "2026-02-01" }),
        makeChild({ child_id: "c3", placement_start: "2026-02-01" }),
        makeChild({ child_id: "c4", placement_start: "2026-02-01" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children }));
      // 52 +3 +4 +3 +4 +3 +3 +3 +3 = 78
      expect(r.stability_score).toBe(78);
    });

    it("modifier 2: incident rate 0.1–1.0 gives +2", () => {
      // Outstanding children with 2 incidents for c1 → rate 0.5
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c1", date: "2026-04-15" }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), incidents,
      }));
      // 52 +5 +2 +3 +4 +3 +3 +1(stability 75%) +3 = 76
      expect(r.stability_score).toBe(76);
    });

    it("modifier 3: 1 high severity incident gives +1", () => {
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01", severity: "high" }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), incidents,
      }));
      // 52 +5 +2(rate 0.3) +1 +4 +3 +3 +1(stability 75%) +3 = 74
      expect(r.stability_score).toBe(74);
    });

    it("modifier 4: 2–3 missing episodes gives +0", () => {
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-04-01" }),
        makeMissing({ child_id: "c1", date: "2026-04-15" }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), missing_episodes,
      }));
      // 52 +5 +4 +3 +0(2 episodes) +3(0 high) +3(100% return) +1(stability 75%) +3 = 74
      expect(r.stability_score).toBe(74);
    });

    it("modifier 5: 1 high-risk missing gives +1", () => {
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-04-01", risk_level: "high" }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), missing_episodes,
      }));
      // 52 +5 +4 +3 +2(1 episode) +1(1 high) +3(100% return) +1(stability 75%) +3 = 74
      expect(r.stability_score).toBe(74);
    });

    it("modifier 6: return interview < 70% gives -2", () => {
      const missing_episodes = [
        makeMissing({ child_id: "c1", date: "2026-04-01", return_interview_completed: false }),
        makeMissing({ child_id: "c1", date: "2026-04-15", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), missing_episodes,
      }));
      // 52 +5 +4 +3 +0(2 episodes) +3(0 high) -2(0% return) +1(stability 75%) +3 = 69
      expect(r.stability_score).toBe(69);
    });

    it("modifier 7: stability 50–79% gives +1", () => {
      // 2 of 4 children have incidents
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c2", date: "2026-04-01" }),
      ];
      const r = computeHomePlacementStability(baseInput({
        children: outstandingChildren(), incidents,
      }));
      // 52 +5 +2(rate 0.5) +3 +4 +3 +3 +1(stability 50%) +3 = 76
      expect(r.stability_score).toBe(76);
    });

    it("modifier 8: risk flags avg 1.1–2.0 gives +1", () => {
      const children = [
        makeChild({ child_id: "c1", placement_start: "2025-09-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c2", placement_start: "2025-09-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c3", placement_start: "2025-09-01", risk_flag_count: 2 }),
        makeChild({ child_id: "c4", placement_start: "2025-09-01", risk_flag_count: 2 }),
      ];
      const r = computeHomePlacementStability(baseInput({ children }));
      // 52 +5 +4 +3 +4 +3 +3 +3 +1 = 78
      expect(r.stability_score).toBe(78);
    });
  });

  // ─── Strengths ──────────────────────────────────────────────────

  describe("strengths", () => {
    it("includes tenure strength when avg ≥ 180d", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.strengths.some(s => s.includes("settled and stable"))).toBe(true);
    });

    it("includes no-incidents strength when 0 incidents", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.strengths.some(s => s.includes("No incidents"))).toBe(true);
    });

    it("includes no-missing strength when 0 episodes", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.strengths.some(s => s.includes("No missing"))).toBe(true);
    });

    it("includes stability rate strength when ≥ 80%", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.strengths.some(s => s.includes("stability"))).toBe(true);
    });
  });

  // ─── Concerns ───────────────────────────────────────────────────

  describe("concerns", () => {
    it("flags short tenure as a concern", () => {
      const children = [makeChild({ placement_start: "2026-05-10" })]; // 16d
      const r = computeHomePlacementStability(baseInput({ children }));
      expect(r.concerns.some(c => c.includes("tenure"))).toBe(true);
    });

    it("flags multiple high severity incidents as a concern", () => {
      const children = [makeChild()];
      const incidents = [
        makeIncident({ date: "2026-04-01", severity: "high" }),
        makeIncident({ date: "2026-04-15", severity: "critical" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.concerns.some(c => c.includes("high/critical severity"))).toBe(true);
    });

    it("flags many missing episodes as a concern", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-03-01" }),
        makeMissing({ date: "2026-03-15" }),
        makeMissing({ date: "2026-04-01" }),
        makeMissing({ date: "2026-04-15" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.concerns.some(c => c.includes("missing from care episodes"))).toBe(true);
    });

    it("flags low return interview rate as a concern", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", return_interview_completed: false }),
        makeMissing({ date: "2026-04-15", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.concerns.some(c => c.includes("return interviews"))).toBe(true);
    });
  });

  // ─── Recommendations ────────────────────────────────────────────

  describe("recommendations", () => {
    it("recommends review for high severity incidents", () => {
      const children = [makeChild()];
      const incidents = [
        makeIncident({ date: "2026-04-01", severity: "high" }),
        makeIncident({ date: "2026-04-15", severity: "high" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.recommendations.some(rec =>
        rec.urgency === "immediate" && rec.recommendation.includes("multi-agency"),
      )).toBe(true);
    });

    it("recommends return interview compliance when < 70%", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", return_interview_completed: false }),
        makeMissing({ date: "2026-04-15", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.recommendations.some(rec =>
        rec.urgency === "immediate" && rec.recommendation.includes("return interview"),
      )).toBe(true);
    });

    it("references correct regulations", () => {
      const children = [makeChild({ placement_start: "2026-05-10", risk_flag_count: 3 })];
      const incidents = [makeIncident({ date: "2026-05-15", severity: "high" }), makeIncident({ date: "2026-05-16", severity: "high" })];
      const missing_episodes = [
        makeMissing({ date: "2026-05-12", return_interview_completed: false }),
        makeMissing({ date: "2026-05-13", return_interview_completed: false }),
        makeMissing({ date: "2026-05-14", return_interview_completed: false }),
        makeMissing({ date: "2026-05-15", return_interview_completed: false }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.recommendations.length).toBeGreaterThan(0);
      r.recommendations.forEach(rec => {
        expect(["Reg 36", "Reg 44"]).toContain(rec.regulatory_ref);
      });
    });
  });

  // ─── Insights ───────────────────────────────────────────────────

  describe("insights", () => {
    it("generates exemplary positive insight for outstanding", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("exemplary"))).toBe(true);
    });

    it("generates critical insight for high severity incidents", () => {
      const children = [makeChild()];
      const incidents = [
        makeIncident({ date: "2026-04-01", severity: "high" }),
        makeIncident({ date: "2026-04-15", severity: "critical" }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("escalation"))).toBe(true);
    });

    it("generates critical insight for many missing episodes", () => {
      const children = [makeChild()];
      const missing_episodes = Array.from({ length: 5 }, (_, i) =>
        makeMissing({ date: `2026-0${Math.min(i + 3, 5)}-01` }),
      );
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.insights.some(i => i.severity === "critical" && i.text.includes("missing from care"))).toBe(true);
    });

    it("generates warning insight for contextual safeguarding risk", () => {
      const children = [makeChild()];
      const missing_episodes = [
        makeMissing({ date: "2026-04-01", contextual_safeguarding_risk: true }),
      ];
      const r = computeHomePlacementStability(baseInput({ children, missing_episodes }));
      expect(r.insights.some(i => i.severity === "warning" && i.text.includes("contextual safeguarding"))).toBe(true);
    });
  });

  // ─── Headlines ──────────────────────────────────────────────────

  describe("headlines", () => {
    it("outstanding headline includes child count and metrics", () => {
      const r = computeHomePlacementStability(baseInput({ children: outstandingChildren() }));
      expect(r.headline).toContain("Outstanding");
      expect(r.headline).toContain("4 children");
    });

    it("good headline", () => {
      const children = [
        makeChild({ child_id: "c1", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c2", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c3", placement_start: "2026-02-01", risk_flag_count: 1 }),
        makeChild({ child_id: "c4", placement_start: "2026-02-01", risk_flag_count: 1 }),
      ];
      const incidents = [
        makeIncident({ child_id: "c1", date: "2026-04-01" }),
        makeIncident({ child_id: "c1", date: "2026-04-15" }),
      ];
      const missing_episodes = [makeMissing({ child_id: "c1", date: "2026-03-15" })];
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.headline).toContain("Good");
    });

    it("inadequate headline", () => {
      const children = [makeChild({ placement_start: "2026-05-10", risk_flag_count: 3 })];
      const incidents = Array.from({ length: 5 }, (_, i) =>
        makeIncident({ date: "2026-05-15", severity: i < 2 ? "high" : "low" }),
      );
      const missing_episodes = Array.from({ length: 4 }, () =>
        makeMissing({ date: "2026-05-16", risk_level: "high", return_interview_completed: false }),
      );
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.headline).toContain("inadequate");
    });

    it("insufficient data headline", () => {
      const r = computeHomePlacementStability(baseInput());
      expect(r.headline).toContain("No current placements");
    });
  });

  // ─── Edge Cases ─────────────────────────────────────────────────

  describe("edge cases", () => {
    it("respects custom lookback_days", () => {
      const children = [makeChild()];
      const incidents = [makeIncident({ date: "2026-04-01" })]; // ~55 days ago
      const r30 = computeHomePlacementStability(baseInput({ children, incidents, lookback_days: 30 }));
      const r180 = computeHomePlacementStability(baseInput({ children, incidents, lookback_days: 180 }));
      expect(r30.incident_profile.total_incidents).toBe(0); // excluded
      expect(r180.incident_profile.total_incidents).toBe(1); // included
    });

    it("filters incidents outside lookback window", () => {
      const children = [makeChild()];
      const incidents = [
        makeIncident({ date: "2025-01-01" }), // way outside
        makeIncident({ date: "2026-05-01" }), // inside
      ];
      const r = computeHomePlacementStability(baseInput({ children, incidents }));
      expect(r.incident_profile.total_incidents).toBe(1);
    });

    it("score stays within 0–100 bounds", () => {
      const children = [makeChild({ placement_start: "2026-05-25", risk_flag_count: 5 })];
      const incidents = Array.from({ length: 20 }, () =>
        makeIncident({ date: "2026-05-25", severity: "critical" }),
      );
      const missing_episodes = Array.from({ length: 10 }, () =>
        makeMissing({ date: "2026-05-25", risk_level: "critical", return_interview_completed: false }),
      );
      const r = computeHomePlacementStability(baseInput({ children, incidents, missing_episodes }));
      expect(r.stability_score).toBeGreaterThanOrEqual(0);
      expect(r.stability_score).toBeLessThanOrEqual(100);
    });

    it("single child home calculates correctly", () => {
      const children = [makeChild({ placement_start: "2025-09-01", risk_flag_count: 0 })];
      const r = computeHomePlacementStability(baseInput({ children }));
      expect(r.stability_profile.stability_rate).toBe(100);
      expect(r.tenure_profile.avg_tenure_days).toBe(267);
    });
  });
});
