// ══════════════════════════════════════════════════════════════════════════════
// TESTS — Child Emotional Wellbeing Intelligence Engine
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  computeChildEmotionalWellbeing,
  type ChildEmotionalWellbeingInput,
  type MoodEntryInput,
  type BehaviourEntryInput,
  type KeyworkSessionInput,
  type TherapySessionInput,
  type SanctionRewardInput,
} from "../child-emotional-wellbeing-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = "2026-05-26";

function daysAgo(n: number): string {
  const d = new Date("2026-05-26");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function makeMood(overrides: Partial<MoodEntryInput> = {}): MoodEntryInput {
  return {
    id: `mood_${Math.random().toString(36).slice(2, 8)}`,
    date: daysAgo(1),
    mood_score: 7,
    time: "10:00",
    ...overrides,
  };
}

function makeBehaviour(overrides: Partial<BehaviourEntryInput> = {}): BehaviourEntryInput {
  return {
    id: `beh_${Math.random().toString(36).slice(2, 8)}`,
    date: daysAgo(1),
    direction: "positive",
    intensity: "low",
    trigger: "",
    has_strategy_used: false,
    ...overrides,
  };
}

function makeKeywork(overrides: Partial<KeyworkSessionInput> = {}): KeyworkSessionInput {
  return {
    id: `kw_${Math.random().toString(36).slice(2, 8)}`,
    date: daysAgo(5),
    has_child_voice: true,
    mood_before: 5,
    mood_after: 7,
    ...overrides,
  };
}

function makeTherapy(overrides: Partial<TherapySessionInput> = {}): TherapySessionInput {
  return {
    id: `th_${Math.random().toString(36).slice(2, 8)}`,
    date: daysAgo(7),
    attended: true,
    engagement_level: "good",
    ...overrides,
  };
}

function makeSR(overrides: Partial<SanctionRewardInput> = {}): SanctionRewardInput {
  return {
    id: `sr_${Math.random().toString(36).slice(2, 8)}`,
    date: daysAgo(3),
    direction: "reward",
    child_response: "Pleased",
    ...overrides,
  };
}

function baseInput(overrides: Partial<ChildEmotionalWellbeingInput> = {}): ChildEmotionalWellbeingInput {
  return {
    today: TODAY,
    child_id: "yp_alex",
    child_name: "Alex",
    mood_entries: [],
    behaviour_entries: [],
    keywork_sessions: [],
    therapy_sessions: [],
    sanction_rewards: [],
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("Child Emotional Wellbeing Intelligence Engine", () => {

  // ── Output Shape ────────────────────────────────────────────────────────

  it("returns correct output shape", () => {
    const r = computeChildEmotionalWellbeing(baseInput());
    expect(r).toHaveProperty("generated_at");
    expect(r).toHaveProperty("child_id");
    expect(r).toHaveProperty("emotional_wellbeing_rating");
    expect(r).toHaveProperty("emotional_wellbeing_score");
    expect(r).toHaveProperty("headline");
    expect(r).toHaveProperty("mood");
    expect(r).toHaveProperty("behaviour");
    expect(r).toHaveProperty("engagement");
    expect(r).toHaveProperty("reward_balance");
    expect(r).toHaveProperty("strengths");
    expect(r).toHaveProperty("concerns");
    expect(r).toHaveProperty("recommendations");
    expect(r).toHaveProperty("insights");
  });

  it("sets generated_at and child details", () => {
    const r = computeChildEmotionalWellbeing(baseInput());
    expect(r.generated_at).toBe(TODAY);
    expect(r.child_id).toBe("yp_alex");
    expect(r.child_name).toBe("Alex");
  });

  // ── Rating ────────────────────────────────────────────────────────────

  it("rates insufficient_data when no data exists", () => {
    const r = computeChildEmotionalWellbeing(baseInput());
    expect(r.emotional_wellbeing_rating).toBe("insufficient_data");
    expect(r.emotional_wellbeing_score).toBe(0);
  });

  it("rates good/outstanding with positive indicators", () => {
    const moods = Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 7 + Math.floor(i % 3) }));
    const behaviours = Array.from({ length: 8 }, (_, i) => makeBehaviour({ date: daysAgo(i + 1), direction: "positive" }));
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: moods,
      behaviour_entries: behaviours,
      keywork_sessions: [makeKeywork(), makeKeywork({ date: daysAgo(10) }), makeKeywork({ date: daysAgo(20) })],
      sanction_rewards: [makeSR(), makeSR({ date: daysAgo(7) }), makeSR({ date: daysAgo(14) })],
    }));
    expect(["good", "outstanding"]).toContain(r.emotional_wellbeing_rating);
  });

  it("rates lower with poor mood and behaviour", () => {
    const moods = Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 3 }));
    const behaviours = Array.from({ length: 6 }, (_, i) => makeBehaviour({ date: daysAgo(i + 1), direction: "concerning", intensity: "high" }));
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: moods,
      behaviour_entries: behaviours,
    }));
    expect(["inadequate", "adequate"]).toContain(r.emotional_wellbeing_rating);
  });

  // ── Mood Trajectory ───────────────────────────────────────────────────

  it("calculates mood averages", () => {
    const moods = [
      makeMood({ date: daysAgo(1), mood_score: 8 }),
      makeMood({ date: daysAgo(2), mood_score: 6 }),
      makeMood({ date: daysAgo(3), mood_score: 7 }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ mood_entries: moods }));
    expect(r.mood.avg_mood_7d).toBe(7);
    expect(r.mood.avg_mood_30d).toBe(7);
    expect(r.mood.lowest_mood_30d).toBe(6);
    expect(r.mood.highest_mood_30d).toBe(8);
  });

  it("detects improving mood trend", () => {
    // First half (older): low mood
    const older = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(20 + i), mood_score: 4 }));
    // Second half (recent): higher mood
    const recent = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(1 + i), mood_score: 8 }));
    const r = computeChildEmotionalWellbeing(baseInput({ mood_entries: [...older, ...recent] }));
    expect(r.mood.mood_trend).toBe("improving");
  });

  it("detects declining mood trend", () => {
    const older = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(20 + i), mood_score: 8 }));
    const recent = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(1 + i), mood_score: 3 }));
    const r = computeChildEmotionalWellbeing(baseInput({ mood_entries: [...older, ...recent] }));
    expect(r.mood.mood_trend).toBe("declining");
  });

  it("counts low mood days", () => {
    const moods = [
      makeMood({ date: daysAgo(1), mood_score: 3 }),
      makeMood({ date: daysAgo(2), mood_score: 4 }),
      makeMood({ date: daysAgo(3), mood_score: 8 }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ mood_entries: moods }));
    expect(r.mood.low_mood_days).toBe(2);
  });

  it("detects high mood variability", () => {
    const moods = [
      makeMood({ date: daysAgo(1), mood_score: 2 }),
      makeMood({ date: daysAgo(2), mood_score: 9 }),
      makeMood({ date: daysAgo(3), mood_score: 3 }),
      makeMood({ date: daysAgo(4), mood_score: 8 }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ mood_entries: moods }));
    expect(r.mood.mood_variability).toBe("high");
  });

  // ── Behaviour Profile ─────────────────────────────────────────────────

  it("calculates positive behaviour rates", () => {
    const behaviours = [
      makeBehaviour({ date: daysAgo(1), direction: "positive" }),
      makeBehaviour({ date: daysAgo(2), direction: "positive" }),
      makeBehaviour({ date: daysAgo(3), direction: "concerning" }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ behaviour_entries: behaviours }));
    expect(r.behaviour.positive_rate_30d).toBe(67);
  });

  it("counts severe incidents", () => {
    const behaviours = [
      makeBehaviour({ date: daysAgo(1), direction: "concerning", intensity: "severe" }),
      makeBehaviour({ date: daysAgo(2), direction: "concerning", intensity: "high" }),
      makeBehaviour({ date: daysAgo(3), direction: "concerning", intensity: "low" }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ behaviour_entries: behaviours }));
    expect(r.behaviour.severe_incidents_30d).toBe(2);
  });

  it("identifies trigger themes", () => {
    const behaviours = [
      makeBehaviour({ date: daysAgo(1), direction: "concerning", trigger: "Family contact" }),
      makeBehaviour({ date: daysAgo(3), direction: "concerning", trigger: "Family contact" }),
      makeBehaviour({ date: daysAgo(5), direction: "concerning", trigger: "Peer conflict" }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ behaviour_entries: behaviours }));
    expect(r.behaviour.trigger_themes.length).toBe(2);
    expect(r.behaviour.trigger_themes[0].trigger).toBe("Family contact");
    expect(r.behaviour.trigger_themes[0].count).toBe(2);
  });

  it("calculates strategy use rate", () => {
    const behaviours = [
      makeBehaviour({ date: daysAgo(1), direction: "concerning", has_strategy_used: true }),
      makeBehaviour({ date: daysAgo(2), direction: "concerning", has_strategy_used: false }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ behaviour_entries: behaviours }));
    expect(r.behaviour.strategy_use_rate).toBe(50);
  });

  // ── Engagement Profile ────────────────────────────────────────────────

  it("counts keywork sessions and voice rate", () => {
    const kw = [
      makeKeywork({ date: daysAgo(5), has_child_voice: true }),
      makeKeywork({ date: daysAgo(10), has_child_voice: true }),
      makeKeywork({ date: daysAgo(15), has_child_voice: false }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ keywork_sessions: kw }));
    expect(r.engagement.keywork_sessions_30d).toBe(3);
    expect(r.engagement.keywork_voice_rate).toBe(67);
  });

  it("calculates keywork mood improvement rate", () => {
    const kw = [
      makeKeywork({ mood_before: 4, mood_after: 7 }),  // improved
      makeKeywork({ date: daysAgo(10), mood_before: 6, mood_after: 6 }),  // stable
      makeKeywork({ date: daysAgo(15), mood_before: 5, mood_after: 7 }),  // improved
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ keywork_sessions: kw }));
    expect(r.engagement.keywork_mood_improvement_rate).toBe(67); // 2/3
  });

  it("calculates therapy attendance rate", () => {
    const therapy = [
      makeTherapy({ date: daysAgo(5), attended: true }),
      makeTherapy({ date: daysAgo(12), attended: false }),
      makeTherapy({ date: daysAgo(19), attended: true }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ therapy_sessions: therapy }));
    expect(r.engagement.therapy_attendance_rate).toBe(67);
  });

  // ── Reward Balance ────────────────────────────────────────────────────

  it("calculates reward ratio", () => {
    const sr = [
      makeSR({ date: daysAgo(1), direction: "reward" }),
      makeSR({ date: daysAgo(3), direction: "reward" }),
      makeSR({ date: daysAgo(5), direction: "sanction" }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ sanction_rewards: sr }));
    expect(r.reward_balance.rewards_30d).toBe(2);
    expect(r.reward_balance.sanctions_30d).toBe(1);
    expect(r.reward_balance.reward_ratio).toBe(67);
    expect(r.reward_balance.balance_rating).toBe("balanced");
  });

  it("identifies sanctions-heavy balance", () => {
    const sr = [
      makeSR({ date: daysAgo(1), direction: "sanction" }),
      makeSR({ date: daysAgo(3), direction: "sanction" }),
      makeSR({ date: daysAgo(5), direction: "sanction" }),
      makeSR({ date: daysAgo(7), direction: "reward" }),
    ];
    const r = computeChildEmotionalWellbeing(baseInput({ sanction_rewards: sr }));
    expect(r.reward_balance.balance_rating).toBe("sanctions_heavy");
  });

  // ── Scoring ───────────────────────────────────────────────────────────

  it("higher mood scores higher", () => {
    const good = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 8 })),
    }));
    const bad = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 3 })),
    }));
    expect(good.emotional_wellbeing_score).toBeGreaterThan(bad.emotional_wellbeing_score);
  });

  it("clamps score to 0-100", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 9 })),
      behaviour_entries: Array.from({ length: 5 }, (_, i) => makeBehaviour({ date: daysAgo(i + 1) })),
    }));
    expect(r.emotional_wellbeing_score).toBeGreaterThanOrEqual(0);
    expect(r.emotional_wellbeing_score).toBeLessThanOrEqual(100);
  });

  // ── Strengths ─────────────────────────────────────────────────────────

  it("generates strengths for good indicators", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 8 })),
      behaviour_entries: Array.from({ length: 5 }, (_, i) => makeBehaviour({ date: daysAgo(i + 1) })),
    }));
    expect(r.strengths.length).toBeGreaterThan(0);
  });

  // ── Concerns ──────────────────────────────────────────────────────────

  it("generates concern for low mood", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 3 })),
    }));
    expect(r.concerns.some((c) => c.includes("struggling"))).toBe(true);
  });

  it("generates concern for sanctions-heavy approach", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      sanction_rewards: [
        makeSR({ date: daysAgo(1), direction: "sanction" }),
        makeSR({ date: daysAgo(3), direction: "sanction" }),
        makeSR({ date: daysAgo(5), direction: "sanction" }),
        makeSR({ date: daysAgo(7), direction: "reward" }),
      ],
    }));
    expect(r.concerns.some((c) => c.includes("Sanctions"))).toBe(true);
  });

  // ── Recommendations ───────────────────────────────────────────────────

  it("recommends urgent review for very low mood", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 3 })),
    }));
    expect(r.recommendations.some((rec) => rec.urgency === "immediate")).toBe(true);
  });

  // ── Insights ──────────────────────────────────────────────────────────

  it("generates critical insight for very low mood", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: Array.from({ length: 10 }, (_, i) => makeMood({ date: daysAgo(i + 1), mood_score: 3 })),
    }));
    expect(r.insights.some((i) => i.severity === "critical")).toBe(true);
  });

  it("generates positive insight when both mood and behaviour improving", () => {
    // Older: low mood + concerning behaviour
    const olderMoods = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(20 + i), mood_score: 4 }));
    const recentMoods = Array.from({ length: 4 }, (_, i) => makeMood({ date: daysAgo(1 + i), mood_score: 8 }));
    const olderBeh = Array.from({ length: 4 }, (_, i) => makeBehaviour({ date: daysAgo(35 + i), direction: "concerning" }));
    const recentBeh = Array.from({ length: 4 }, (_, i) => makeBehaviour({ date: daysAgo(1 + i), direction: "positive" }));
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: [...olderMoods, ...recentMoods],
      behaviour_entries: [...olderBeh, ...recentBeh],
    }));
    if (r.mood.mood_trend === "improving" && r.behaviour.behaviour_trend === "improving") {
      expect(r.insights.some((i) => i.severity === "positive" && i.text.includes("improving"))).toBe(true);
    }
  });

  // ── Headline ──────────────────────────────────────────────────────────

  it("includes rating in headline", () => {
    const r = computeChildEmotionalWellbeing(baseInput());
    expect(r.headline).toContain("insufficient_data");
  });

  it("includes mood in headline when available", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: [makeMood({ mood_score: 7 })],
    }));
    expect(r.headline).toContain("mood");
  });

  // ── Edge Cases ────────────────────────────────────────────────────────

  it("handles null mood scores", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      mood_entries: [makeMood({ mood_score: null })],
      behaviour_entries: [makeBehaviour()],
    }));
    expect(r.mood.avg_mood_7d).toBeNull();
    expect(r.emotional_wellbeing_rating).not.toBe("insufficient_data"); // has behaviour data
  });

  it("handles only sanction/reward data", () => {
    const r = computeChildEmotionalWellbeing(baseInput({
      sanction_rewards: [makeSR(), makeSR({ date: daysAgo(5) })],
    }));
    expect(r.emotional_wellbeing_rating).not.toBe("insufficient_data");
  });
});
