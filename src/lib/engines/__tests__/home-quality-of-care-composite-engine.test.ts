import { describe, it, expect } from "vitest";
import {
  computeQualityOfCare,
  type QualityOfCareInput,
} from "../home-quality-of-care-composite-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function baseInput(overrides: Partial<QualityOfCareInput> = {}): QualityOfCareInput {
  return {
    today: "2026-05-15",
    total_children: 6,
    feedback_entries_total: 20, feedback_entries_acted_on: 19,
    house_meetings_held: 10, house_meetings_due: 10,
    children_with_voice_captured: 6,
    children_on_council_or_forum: 4,
    advocacy_referrals_offered: 3, advocacy_referrals_accepted: 3,
    keywork_sessions_completed: 24, keywork_sessions_due: 24,
    children_with_keyworker_allocated: 6,
    children_with_cultural_plan: 6,
    cultural_visits_completed: 8, cultural_visits_planned: 8,
    diversity_events_held: 5,
    heritage_language_supported: 5,
    children_with_life_story: 6, life_stories_up_to_date: 6,
    children_with_personal_passport: 6,
    children_with_attachment_profile: 6,
    therapeutic_sessions_attended: 20, therapeutic_sessions_offered: 22,
    children_with_sensory_profile: 5,
    emotional_vocab_sessions: 10,
    children_with_friendship_map: 6,
    children_with_aspiration_record: 6,
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Quality of Care Composite Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no children", () => {
      const r = computeQualityOfCare(baseInput({ total_children: 0 }));
      expect(r.quality_rating).toBe("insufficient_data");
      expect(r.quality_score).toBe(0);
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with excellent quality data", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.quality_score).toBeGreaterThanOrEqual(80);
      expect(r.quality_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some quality gaps", () => {
      const r = computeQualityOfCare(baseInput({
        feedback_entries_acted_on: 15, // 75%
        house_meetings_held: 8, // 80%
        children_with_voice_captured: 5, // 83%
        children_on_council_or_forum: 2, // 33%
        keywork_sessions_completed: 18, keywork_sessions_due: 24, // 75%
        children_with_cultural_plan: 4, // 67%
        cultural_visits_completed: 5, cultural_visits_planned: 8, // 63%
        diversity_events_held: 2,
        heritage_language_supported: 3, // 50%
        life_stories_up_to_date: 4, // 67%
        children_with_personal_passport: 4, // 67%
        therapeutic_sessions_attended: 14, therapeutic_sessions_offered: 22, // 64%
        children_with_sensory_profile: 3, // 50%
        emotional_vocab_sessions: 4,
        children_with_friendship_map: 4, // 67%
        children_with_aspiration_record: 4, // 67%
      }));
      expect(r.quality_score).toBeGreaterThanOrEqual(65);
      expect(r.quality_score).toBeLessThan(80);
      expect(r.quality_rating).toBe("good");
    });
  });

  describe("adequate threshold (45–64)", () => {
    it("rates adequate with significant quality gaps", () => {
      const r = computeQualityOfCare(baseInput({
        feedback_entries_total: 15, feedback_entries_acted_on: 11, // 73%
        house_meetings_held: 7, house_meetings_due: 10, // 70%
        children_with_voice_captured: 5, // 83%
        children_on_council_or_forum: 2, // 33%
        advocacy_referrals_offered: 3, advocacy_referrals_accepted: 2, // 67%
        keywork_sessions_completed: 18, keywork_sessions_due: 24, // 75%
        children_with_keyworker_allocated: 5, // 83%
        children_with_cultural_plan: 3, // 50%
        cultural_visits_completed: 4, cultural_visits_planned: 8, // 50%
        diversity_events_held: 1,
        heritage_language_supported: 2, // 33%
        children_with_life_story: 4, life_stories_up_to_date: 3, // 75%
        children_with_personal_passport: 4, // 67%
        children_with_attachment_profile: 3, // 50%
        therapeutic_sessions_attended: 14, therapeutic_sessions_offered: 22, // 64%
        children_with_sensory_profile: 3, // 50%
        emotional_vocab_sessions: 3,
        children_with_friendship_map: 4, // 67%
        children_with_aspiration_record: 3, // 50%
      }));
      expect(r.quality_score).toBeGreaterThanOrEqual(45);
      expect(r.quality_score).toBeLessThan(65);
      expect(r.quality_rating).toBe("adequate");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severe quality failures", () => {
      const r = computeQualityOfCare(baseInput({
        feedback_entries_total: 3, feedback_entries_acted_on: 1, // 33%
        house_meetings_held: 2, house_meetings_due: 10, // 20%
        children_with_voice_captured: 2, // 33%
        children_on_council_or_forum: 0,
        advocacy_referrals_offered: 0, advocacy_referrals_accepted: 0,
        keywork_sessions_completed: 4, keywork_sessions_due: 24, // 17%
        children_with_keyworker_allocated: 3, // 50%
        children_with_cultural_plan: 1, // 17%
        cultural_visits_completed: 1, cultural_visits_planned: 8, // 13%
        diversity_events_held: 0,
        heritage_language_supported: 0,
        children_with_life_story: 2, life_stories_up_to_date: 1,
        children_with_personal_passport: 1, // 17%
        children_with_attachment_profile: 1, // 17%
        therapeutic_sessions_attended: 4, therapeutic_sessions_offered: 22, // 18%
        children_with_sensory_profile: 0,
        emotional_vocab_sessions: 0,
        children_with_friendship_map: 1, // 17%
        children_with_aspiration_record: 1, // 17%
      }));
      expect(r.quality_score).toBeLessThan(45);
      expect(r.quality_rating).toBe("inadequate");
    });
  });

  describe("domain quality detection", () => {
    it("detects child voice quality gap from low coverage", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_voice_captured: 3, // 50%
        feedback_entries_acted_on: 10, // 50%
      }));
      const domain = r.domain_scores.find(d => d.name === "child_voice");
      expect(domain?.quality_met).toBe(false);
    });

    it("detects key working gap from low allocation", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_keyworker_allocated: 4, // 67%
      }));
      const domain = r.domain_scores.find(d => d.name === "key_working");
      expect(domain?.quality_met).toBe(false);
    });

    it("detects cultural identity gap", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_cultural_plan: 3, // 50%
      }));
      const domain = r.domain_scores.find(d => d.name === "cultural_identity");
      expect(domain?.quality_met).toBe(false);
    });

    it("detects life story gap", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_life_story: 3, // 50%
      }));
      const domain = r.domain_scores.find(d => d.name === "life_story");
      expect(domain?.quality_met).toBe(false);
    });

    it("detects therapeutic climate gap", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_attachment_profile: 3, // 50%
        therapeutic_sessions_attended: 8, // 36%
      }));
      const domain = r.domain_scores.find(d => d.name === "therapeutic_climate");
      expect(domain?.quality_met).toBe(false);
    });
  });

  describe("strengths", () => {
    it("generates all domains met strength", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.strengths.some(s => s.includes("all 7") || s.includes("7 of 7"))).toBe(true);
    });

    it("generates voice coverage strength", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.strengths.some(s => s.includes("voice"))).toBe(true);
    });

    it("generates keyworker strength", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.strengths.some(s => s.includes("keyworker"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for multiple quality gaps", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_voice_captured: 2,
        feedback_entries_acted_on: 5,
        children_with_keyworker_allocated: 3,
        children_with_cultural_plan: 2,
        children_with_life_story: 2,
      }));
      expect(r.concerns.some(c => c.includes("quality domains") || c.includes("threshold"))).toBe(true);
    });

    it("raises concern for low voice coverage", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_voice_captured: 2,
      }));
      expect(r.concerns.some(c => c.includes("voice") || c.includes("heard"))).toBe(true);
    });
  });

  describe("recommendations", () => {
    it("recommends keyworker allocation when low", () => {
      const r = computeQualityOfCare(baseInput({
        children_with_keyworker_allocated: 4, // 67%
      }));
      expect(r.recommendations.some(rec => rec.recommendation.includes("keyworker") || rec.recommendation.includes("Keyworker"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates identity alignment insight when voice+life story+cultural all met", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.insights.some(i => i.text.includes("identity") || i.text.includes("identity-affirming"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("handles all zeroes with children", () => {
      const r = computeQualityOfCare(baseInput({
        feedback_entries_total: 0, feedback_entries_acted_on: 0,
        house_meetings_held: 0, house_meetings_due: 0,
        children_with_voice_captured: 0,
        children_on_council_or_forum: 0,
        advocacy_referrals_offered: 0, advocacy_referrals_accepted: 0,
        keywork_sessions_completed: 0, keywork_sessions_due: 0,
        children_with_keyworker_allocated: 0,
        children_with_cultural_plan: 0,
        cultural_visits_completed: 0, cultural_visits_planned: 0,
        diversity_events_held: 0,
        heritage_language_supported: 0,
        children_with_life_story: 0, life_stories_up_to_date: 0,
        children_with_personal_passport: 0,
        children_with_attachment_profile: 0,
        therapeutic_sessions_attended: 0, therapeutic_sessions_offered: 0,
        children_with_sensory_profile: 0,
        emotional_vocab_sessions: 0,
        children_with_friendship_map: 0,
        children_with_aspiration_record: 0,
      }));
      expect(r.quality_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.quality_score).toBeGreaterThanOrEqual(0);
      expect(r.quality_score).toBeLessThanOrEqual(100);
    });

    it("domain scores have correct structure", () => {
      const r = computeQualityOfCare(baseInput());
      expect(r.domain_scores).toHaveLength(7);
      r.domain_scores.forEach(d => {
        expect(d.score).toBeGreaterThanOrEqual(0);
        expect(d.score).toBeLessThanOrEqual(d.max);
      });
    });
  });
});
