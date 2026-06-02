import { describe, it, expect } from "vitest";
import {
  computeSafeguardingOversight,
  type SafeguardingCompositeInput,
} from "../home-safeguarding-oversight-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function baseInput(overrides: Partial<SafeguardingCompositeInput> = {}): SafeguardingCompositeInput {
  return {
    today: "2026-05-15",
    total_children: 6,
    safeguarding_referrals_total: 3, safeguarding_referrals_resolved: 3, safeguarding_referrals_open: 0,
    safeguarding_supervision_sessions: 10, safeguarding_supervision_due: 10,
    exploitation_screenings_completed: 6, exploitation_screenings_due: 6,
    children_high_risk_exploitation: 0,
    missing_episodes_total: 0, missing_episodes_with_return_interview: 0, children_with_repeat_missing: 0,
    restraint_incidents: 0, children_with_restraints: 0, restraint_debrief_completed: 0, restraint_debrief_due: 0,
    incidents_total: 2, incidents_serious: 0, incidents_with_followup: 2,
    notifiable_events_total: 1, notifiable_events_reported_on_time: 1,
    disclosures_total: 2, disclosures_acted_on: 2,
    lado_referrals: 0, lado_referrals_resolved: 0,
    multi_agency_meetings_attended: 4, multi_agency_meetings_due: 4,
    contextual_risks_identified: 2, contextual_risks_mitigated: 2,
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Safeguarding Oversight Composite Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no children", () => {
      const r = computeSafeguardingOversight(baseInput({ total_children: 0 }));
      expect(r.safeguarding_rating).toBe("insufficient_data");
      expect(r.safeguarding_score).toBe(0);
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with excellent safeguarding data", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.safeguarding_score).toBeGreaterThanOrEqual(80);
      expect(r.safeguarding_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some degraded domains", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 6, safeguarding_referrals_resolved: 5, safeguarding_referrals_open: 1,
        safeguarding_supervision_sessions: 8, safeguarding_supervision_due: 10,
        missing_episodes_total: 0, missing_episodes_with_return_interview: 0, children_with_repeat_missing: 0,
        restraint_incidents: 2, children_with_restraints: 1,
        restraint_debrief_completed: 1, restraint_debrief_due: 2,
        incidents_total: 5, incidents_serious: 1, incidents_with_followup: 4,
        notifiable_events_total: 2, notifiable_events_reported_on_time: 1,
        disclosures_total: 4, disclosures_acted_on: 3,
        multi_agency_meetings_attended: 3, multi_agency_meetings_due: 5,
        contextual_risks_identified: 2, contextual_risks_mitigated: 1,
      }));
      expect(r.safeguarding_score).toBeGreaterThanOrEqual(65);
      expect(r.safeguarding_score).toBeLessThan(80);
      expect(r.safeguarding_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with significantly degraded safeguarding", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 8, safeguarding_referrals_resolved: 5, safeguarding_referrals_open: 3,
        safeguarding_supervision_sessions: 6, safeguarding_supervision_due: 10,
        exploitation_screenings_completed: 4, exploitation_screenings_due: 6,
        children_high_risk_exploitation: 1,
        missing_episodes_total: 3, missing_episodes_with_return_interview: 2, children_with_repeat_missing: 1,
        restraint_incidents: 3, children_with_restraints: 2,
        restraint_debrief_completed: 2, restraint_debrief_due: 3,
        incidents_total: 4, incidents_serious: 0, incidents_with_followup: 4,
        notifiable_events_total: 1, notifiable_events_reported_on_time: 1,
        disclosures_total: 5, disclosures_acted_on: 4,
        multi_agency_meetings_attended: 3, multi_agency_meetings_due: 4,
        contextual_risks_identified: 3, contextual_risks_mitigated: 2,
      }));
      expect(r.safeguarding_score).toBeGreaterThanOrEqual(45);
      expect(r.safeguarding_score).toBeLessThan(65);
      expect(r.safeguarding_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severely degraded safeguarding", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 12, safeguarding_referrals_resolved: 3, safeguarding_referrals_open: 9,
        safeguarding_supervision_sessions: 2, safeguarding_supervision_due: 10,
        exploitation_screenings_completed: 1, exploitation_screenings_due: 6,
        children_high_risk_exploitation: 3,
        missing_episodes_total: 15, missing_episodes_with_return_interview: 4, children_with_repeat_missing: 4,
        restraint_incidents: 12, children_with_restraints: 4,
        restraint_debrief_completed: 2, restraint_debrief_due: 12,
        incidents_total: 15, incidents_serious: 6, incidents_with_followup: 5,
        notifiable_events_total: 5, notifiable_events_reported_on_time: 2,
        disclosures_total: 5, disclosures_acted_on: 2,
        lado_referrals: 2, lado_referrals_resolved: 0,
        multi_agency_meetings_attended: 1, multi_agency_meetings_due: 6,
        contextual_risks_identified: 5, contextual_risks_mitigated: 1,
      }));
      expect(r.safeguarding_score).toBeLessThan(45);
      expect(r.safeguarding_rating).toBe("inadequate");
    });
  });

  describe("domain risk detection", () => {
    it("detects referral management risk from open referrals", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 8, safeguarding_referrals_resolved: 3, safeguarding_referrals_open: 5,
      }));
      const domain = r.domain_scores.find(d => d.name === "referral_management");
      expect(domain?.at_risk).toBe(true);
    });

    it("detects exploitation risk from high-risk children", () => {
      const r = computeSafeguardingOversight(baseInput({
        children_high_risk_exploitation: 2,
      }));
      const domain = r.domain_scores.find(d => d.name === "exploitation_screening");
      expect(domain?.at_risk).toBe(true);
    });

    it("detects missing episode risk from repeat patterns", () => {
      const r = computeSafeguardingOversight(baseInput({
        missing_episodes_total: 10, missing_episodes_with_return_interview: 4,
        children_with_repeat_missing: 3,
      }));
      const domain = r.domain_scores.find(d => d.name === "missing_episodes");
      expect(domain?.at_risk).toBe(true);
    });

    it("detects restrictive practice risk from high restraints", () => {
      const r = computeSafeguardingOversight(baseInput({
        restraint_incidents: 8, children_with_restraints: 4,
        restraint_debrief_completed: 3, restraint_debrief_due: 8,
      }));
      const domain = r.domain_scores.find(d => d.name === "restrictive_practice");
      expect(domain?.at_risk).toBe(true);
    });

    it("detects incident risk from serious incidents", () => {
      const r = computeSafeguardingOversight(baseInput({
        incidents_total: 10, incidents_serious: 4, incidents_with_followup: 6,
      }));
      const domain = r.domain_scores.find(d => d.name === "incident_management");
      expect(domain?.at_risk).toBe(true);
    });

    it("detects disclosure risk from poor response", () => {
      const r = computeSafeguardingOversight(baseInput({
        disclosures_total: 5, disclosures_acted_on: 2,
      }));
      const domain = r.domain_scores.find(d => d.name === "disclosure_response");
      expect(domain?.at_risk).toBe(true);
    });
  });

  describe("strengths", () => {
    it("generates no missing episodes strength", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.strengths.some(s => s.includes("No missing episodes"))).toBe(true);
    });

    it("generates no restraint strength", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.strengths.some(s => s.includes("No restraint"))).toBe(true);
    });

    it("generates disclosure strength when all acted on", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.strengths.some(s => s.includes("disclosure"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for exploitation risk", () => {
      const r = computeSafeguardingOversight(baseInput({
        children_high_risk_exploitation: 3,
      }));
      expect(r.concerns.some(c => c.includes("exploitation"))).toBe(true);
    });

    it("raises concern for repeat missing episodes", () => {
      const r = computeSafeguardingOversight(baseInput({
        missing_episodes_total: 8, missing_episodes_with_return_interview: 5,
        children_with_repeat_missing: 3,
      }));
      expect(r.concerns.some(c => c.includes("missing"))).toBe(true);
    });

    it("raises concern for high restraints", () => {
      const r = computeSafeguardingOversight(baseInput({
        restraint_incidents: 8, children_with_restraints: 3,
        restraint_debrief_completed: 4, restraint_debrief_due: 8,
      }));
      expect(r.concerns.some(c => c.includes("restraint"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends immediate action for exploitation", () => {
      const r = computeSafeguardingOversight(baseInput({
        children_high_risk_exploitation: 2,
      }));
      expect(r.recommendations.some(rec => rec.urgency === "immediate" && rec.recommendation.includes("exploitation"))).toBe(true);
    });

    it("recommends restraint review when high", () => {
      const r = computeSafeguardingOversight(baseInput({
        restraint_incidents: 6, children_with_restraints: 3,
        restraint_debrief_completed: 3, restraint_debrief_due: 6,
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("behaviour support") || rec.recommendation.includes("restraint"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates exploitation-missing link insight when both present", () => {
      const r = computeSafeguardingOversight(baseInput({
        children_high_risk_exploitation: 1,
        missing_episodes_total: 5, missing_episodes_with_return_interview: 3,
        children_with_repeat_missing: 1,
      }));
      expect(r.insights.some(i => i.text.includes("Exploitation") || i.text.includes("exploitation"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.headline).toContain("Outstanding");
    });

    it("inadequate headline", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 12, safeguarding_referrals_resolved: 3, safeguarding_referrals_open: 9,
        safeguarding_supervision_sessions: 1, safeguarding_supervision_due: 10,
        exploitation_screenings_completed: 1, exploitation_screenings_due: 6,
        children_high_risk_exploitation: 3,
        missing_episodes_total: 15, missing_episodes_with_return_interview: 3, children_with_repeat_missing: 4,
        restraint_incidents: 12, children_with_restraints: 4,
        restraint_debrief_completed: 2, restraint_debrief_due: 12,
        incidents_total: 15, incidents_serious: 6, incidents_with_followup: 5,
        notifiable_events_total: 5, notifiable_events_reported_on_time: 2,
        disclosures_total: 5, disclosures_acted_on: 2,
        multi_agency_meetings_attended: 1, multi_agency_meetings_due: 6,
        contextual_risks_identified: 5, contextual_risks_mitigated: 1,
      }));
      expect(r.headline).toContain("inadequate");
    });
  });

  describe("edge cases", () => {
    it("handles all zeroes (clean home)", () => {
      const r = computeSafeguardingOversight(baseInput({
        safeguarding_referrals_total: 0, safeguarding_referrals_resolved: 0, safeguarding_referrals_open: 0,
        safeguarding_supervision_sessions: 0, safeguarding_supervision_due: 0,
        exploitation_screenings_completed: 0, exploitation_screenings_due: 0,
        children_high_risk_exploitation: 0,
        missing_episodes_total: 0, missing_episodes_with_return_interview: 0, children_with_repeat_missing: 0,
        restraint_incidents: 0, children_with_restraints: 0,
        restraint_debrief_completed: 0, restraint_debrief_due: 0,
        incidents_total: 0, incidents_serious: 0, incidents_with_followup: 0,
        notifiable_events_total: 0, notifiable_events_reported_on_time: 0,
        disclosures_total: 0, disclosures_acted_on: 0,
        lado_referrals: 0, lado_referrals_resolved: 0,
        multi_agency_meetings_attended: 0, multi_agency_meetings_due: 0,
        contextual_risks_identified: 0, contextual_risks_mitigated: 0,
      }));
      expect(r.safeguarding_rating).not.toBe("insufficient_data");
      expect(r.safeguarding_score).toBeGreaterThanOrEqual(0);
    });

    it("scores are 0-100", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.safeguarding_score).toBeGreaterThanOrEqual(0);
      expect(r.safeguarding_score).toBeLessThanOrEqual(100);
    });

    it("domain scores have correct structure", () => {
      const r = computeSafeguardingOversight(baseInput());
      expect(r.domain_scores).toHaveLength(7);
      r.domain_scores.forEach(d => {
        expect(d.score).toBeGreaterThanOrEqual(0);
        expect(d.score).toBeLessThanOrEqual(d.max);
      });
    });
  });
});
