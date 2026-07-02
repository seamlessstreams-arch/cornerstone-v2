import { describe, it, expect } from "vitest";
import {
  computeHomeWellbeing,
  type HomeWellbeingInput,
  type MoodEntryInput,
  type SleepEntryInput,
  type WelfareCheckEntryInput,
  type IncidentEntryInput,
  type ActivityEntryInput,
} from "../home-wellbeing-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = "2026-05-26";

function daysAgo(n: number): string {
  const d = new Date("2026-05-26");
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function makeMood(childId: string, daysBack: number, score: number): MoodEntryInput {
  return { child_id: childId, date: daysAgo(daysBack), mood_score: score };
}

function makeSleep(childId: string, daysBack: number, quality: string, disturbances = 0): SleepEntryInput {
  return { child_id: childId, date: daysAgo(daysBack), quality, disturbance_count: disturbances };
}

function makeWelfare(childId: string, daysBack: number, outcome: string): WelfareCheckEntryInput {
  return { child_id: childId, date: daysAgo(daysBack), outcome };
}

function makeIncident(childId: string, daysBack: number, severity = "medium"): IncidentEntryInput {
  return { child_id: childId, date: daysAgo(daysBack), severity };
}

function makeActivity(childId: string, daysBack: number, participated = true): ActivityEntryInput {
  return { child_id: childId, date: daysAgo(daysBack), participated };
}

function baseInput(overrides: Partial<HomeWellbeingInput> = {}): HomeWellbeingInput {
  return {
    today: TODAY,
    children: [
      { id: "c1", name: "Alex" },
      { id: "c2", name: "Jordan" },
      { id: "c3", name: "Casey" },
    ],
    mood_entries: [
      // Good moods for all children across 30d
      makeMood("c1", 1, 8), makeMood("c1", 5, 7), makeMood("c1", 15, 7), makeMood("c1", 25, 6),
      makeMood("c2", 1, 7), makeMood("c2", 5, 8), makeMood("c2", 15, 6), makeMood("c2", 25, 7),
      makeMood("c3", 1, 6), makeMood("c3", 5, 7), makeMood("c3", 15, 8), makeMood("c3", 25, 7),
    ],
    sleep_entries: [
      makeSleep("c1", 1, "good"), makeSleep("c1", 3, "good"), makeSleep("c1", 5, "fair"),
      makeSleep("c2", 1, "good"), makeSleep("c2", 3, "good"),
      makeSleep("c3", 1, "good"), makeSleep("c3", 3, "fair"),
    ],
    welfare_checks: [
      makeWelfare("c1", 1, "ok"), makeWelfare("c1", 5, "ok"), makeWelfare("c1", 10, "ok"),
      makeWelfare("c2", 1, "ok"), makeWelfare("c2", 5, "ok"),
      makeWelfare("c3", 1, "ok"), makeWelfare("c3", 5, "ok"),
    ],
    incidents: [],
    activities: [
      makeActivity("c1", 5), makeActivity("c1", 10),
      makeActivity("c2", 3), makeActivity("c2", 8),
      makeActivity("c3", 2), makeActivity("c3", 7), makeActivity("c3", 14),
    ],
    ...overrides,
  };
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe("computeHomeWellbeing", () => {
  // ── Output Shape ──────────────────────────────────────────────────────
  it("returns all required top-level fields", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r).toHaveProperty("generated_at", TODAY);
    expect(r).toHaveProperty("temperature");
    expect(r).toHaveProperty("temperature_score");
    expect(r).toHaveProperty("headline");
    expect(r).toHaveProperty("mood_snapshot");
    expect(r).toHaveProperty("sleep_overview");
    expect(r).toHaveProperty("child_profiles");
    expect(r).toHaveProperty("children_of_concern");
    expect(r).toHaveProperty("strengths");
    expect(r).toHaveProperty("concerns");
    expect(r).toHaveProperty("recommendations");
    expect(r).toHaveProperty("insights");
  });

  // ── Temperature ───────────────────────────────────────────────────────
  it("produces positive or higher temperature with good inputs", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(["thriving", "positive", "settled"]).toContain(r.temperature);
  });

  it("produces lower temperature with poor inputs", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3),
        makeMood("c2", 1, 3), makeMood("c2", 5, 2),
        makeMood("c3", 1, 2), makeMood("c3", 5, 3),
      ],
      sleep_entries: [
        makeSleep("c1", 1, "poor", 3),
        makeSleep("c2", 1, "disturbed", 2),
        makeSleep("c3", 1, "poor", 4),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c2", 3, "high"),
        makeIncident("c3", 1, "critical"),
      ],
      activities: [],
    }));
    expect(["unsettled", "concerning"]).toContain(r.temperature);
  });

  // ── Mood Snapshot ─────────────────────────────────────────────────────
  it("calculates average mood across all children", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.mood_snapshot.average_mood_7d).toBeGreaterThan(0);
    expect(r.mood_snapshot.average_mood_30d).toBeGreaterThan(0);
  });

  it("detects improving mood trend", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        // Recent: high
        makeMood("c1", 1, 9), makeMood("c1", 5, 8), makeMood("c2", 1, 8), makeMood("c3", 1, 9),
        // Previous: lower
        makeMood("c1", 40, 5), makeMood("c1", 50, 4), makeMood("c2", 40, 5), makeMood("c3", 40, 4),
      ],
    }));
    expect(r.mood_snapshot.trend).toBe("improving");
  });

  // ── Sleep Overview ────────────────────────────────────────────────────
  it("calculates sleep quality rates", () => {
    const r = computeHomeWellbeing(baseInput({
      sleep_entries: [
        makeSleep("c1", 1, "good"),
        makeSleep("c2", 1, "good"),
        makeSleep("c3", 1, "poor", 3),
      ],
    }));
    expect(r.sleep_overview.good_rate).toBe(67);
    expect(r.sleep_overview.disturbed_rate).toBe(33);
    expect(r.sleep_overview.children_with_poor_sleep).toContain("Casey");
  });

  it("counts total disturbances", () => {
    const r = computeHomeWellbeing(baseInput({
      sleep_entries: [
        makeSleep("c1", 1, "fair", 2),
        makeSleep("c2", 1, "disturbed", 5),
      ],
    }));
    expect(r.sleep_overview.total_disturbances_7d).toBe(7);
  });

  // ── Per-Child Profiles ────────────────────────────────────────────────
  it("creates a profile for each child", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.child_profiles.length).toBe(3);
  });

  it("sorts profiles by wellbeing score (lowest first)", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 9), makeMood("c1", 5, 8),
        makeMood("c2", 1, 3), makeMood("c2", 5, 2),
        makeMood("c3", 1, 6), makeMood("c3", 5, 7),
      ],
    }));
    expect(r.child_profiles[0].wellbeing_score).toBeLessThanOrEqual(r.child_profiles[1].wellbeing_score);
    expect(r.child_profiles[1].wellbeing_score).toBeLessThanOrEqual(r.child_profiles[2].wellbeing_score);
  });

  it("flags children with low mood", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3), makeMood("c1", 10, 2),
        makeMood("c2", 1, 8), makeMood("c2", 5, 7),
        makeMood("c3", 1, 7), makeMood("c3", 5, 8),
      ],
    }));
    const alex = r.child_profiles.find((p) => p.child_id === "c1");
    expect(alex!.flags.some((f) => f.includes("Low mood"))).toBe(true);
  });

  it("flags children with declining mood", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        // Recent: low
        makeMood("c1", 1, 3), makeMood("c1", 5, 4),
        // Previous: high
        makeMood("c1", 40, 8), makeMood("c1", 50, 7),
        // Other children fine
        makeMood("c2", 1, 7), makeMood("c3", 1, 7),
      ],
    }));
    const alex = r.child_profiles.find((p) => p.child_id === "c1");
    expect(alex!.mood_trend).toBe("declining");
    expect(alex!.flags.some((f) => f.includes("declining"))).toBe(true);
  });

  // ── Children of Concern ───────────────────────────────────────────────
  it("identifies children of concern", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3), makeMood("c1", 10, 2),
        makeMood("c2", 1, 8),
        makeMood("c3", 1, 7),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c1", 10, "high"),
        makeIncident("c1", 15, "medium"),
      ],
    }));
    expect(r.children_of_concern).toContain("Alex");
    expect(r.children_of_concern).not.toContain("Jordan");
  });

  // ── Scoring ───────────────────────────────────────────────────────────
  it("gives higher score for positive home atmosphere", () => {
    const good = computeHomeWellbeing(baseInput());
    const bad = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c2", 1, 3), makeMood("c3", 1, 2),
      ],
      sleep_entries: [
        makeSleep("c1", 1, "poor", 3),
        makeSleep("c2", 1, "disturbed", 2),
        makeSleep("c3", 1, "poor", 4),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c2", 3, "critical"),
      ],
      activities: [],
    }));
    expect(good.temperature_score).toBeGreaterThan(bad.temperature_score);
  });

  it("clamps score between 0 and 100", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.temperature_score).toBeGreaterThanOrEqual(0);
    expect(r.temperature_score).toBeLessThanOrEqual(100);
  });

  // ── Headline ──────────────────────────────────────────────────────────
  it("includes temperature in headline", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.headline).toContain(r.temperature);
  });

  // ── Strengths ─────────────────────────────────────────────────────────
  it("notes positive home atmosphere as strength", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.strengths.length).toBeGreaterThan(0);
  });

  it("notes no children of concern as strength", () => {
    const r = computeHomeWellbeing(baseInput());
    expect(r.strengths.some((s) => s.includes("No children") || s.includes("no child"))).toBe(true);
  });

  // ── Concerns ──────────────────────────────────────────────────────────
  it("flags children of concern in concerns", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3), makeMood("c1", 10, 2),
        makeMood("c2", 1, 8),
        makeMood("c3", 1, 7),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c1", 10, "high"),
        makeIncident("c1", 15, "medium"),
      ],
    }));
    expect(r.concerns.some((c) => c.includes("Alex"))).toBe(true);
  });

  it("flags poor sleep in concerns", () => {
    const r = computeHomeWellbeing(baseInput({
      sleep_entries: [
        makeSleep("c1", 1, "poor", 3),
        makeSleep("c2", 1, "disturbed", 2),
        makeSleep("c3", 1, "poor", 1),
        makeSleep("c1", 3, "good"),
      ],
    }));
    expect(r.concerns.some((c) => c.includes("sleep") || c.includes("Sleep"))).toBe(true);
  });

  // ── Recommendations ───────────────────────────────────────────────────
  it("recommends wellbeing reviews for children of concern", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3), makeMood("c1", 10, 2),
        makeMood("c2", 1, 8),
        makeMood("c3", 1, 7),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c1", 10, "high"),
        makeIncident("c1", 15, "medium"),
      ],
    }));
    expect(r.recommendations.some((rec) => rec.recommendation.includes("wellbeing") || rec.recommendation.includes("Alex"))).toBe(true);
  });

  it("orders recommendations by rank", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 40, 7),
        makeMood("c2", 1, 3), makeMood("c2", 40, 8),
        makeMood("c3", 1, 2), makeMood("c3", 40, 7),
      ],
      sleep_entries: [
        makeSleep("c1", 1, "poor", 3), makeSleep("c2", 1, "disturbed", 2), makeSleep("c3", 1, "poor", 4),
      ],
    }));
    for (let i = 1; i < r.recommendations.length; i++) {
      expect(r.recommendations[i].rank).toBeGreaterThan(r.recommendations[i - 1].rank);
    }
  });

  // ── Cara Insights ─────────────────────────────────────────────────────
  it("generates positive insight for thriving home", () => {
    const r = computeHomeWellbeing(baseInput());
    if (r.temperature === "thriving") {
      expect(r.insights.some((i) => i.severity === "positive")).toBe(true);
    }
  });

  it("generates critical insight for concerning home", () => {
    const r = computeHomeWellbeing(baseInput({
      mood_entries: [
        makeMood("c1", 1, 2), makeMood("c1", 5, 3),
        makeMood("c2", 1, 3), makeMood("c2", 5, 2),
        makeMood("c3", 1, 2), makeMood("c3", 5, 3),
      ],
      sleep_entries: [
        makeSleep("c1", 1, "poor", 3), makeSleep("c2", 1, "disturbed", 2), makeSleep("c3", 1, "poor", 4),
      ],
      incidents: [
        makeIncident("c1", 5, "critical"),
        makeIncident("c2", 3, "critical"),
        makeIncident("c3", 1, "critical"),
      ],
      activities: [],
    }));
    expect(r.insights.some((i) => i.severity === "critical")).toBe(true);
  });

  // ── Empty Input ───────────────────────────────────────────────────────
  it("handles empty children list gracefully", () => {
    const r = computeHomeWellbeing(baseInput({
      children: [],
      mood_entries: [],
      sleep_entries: [],
      welfare_checks: [],
      incidents: [],
      activities: [],
    }));
    expect(r.child_profiles.length).toBe(0);
    expect(r.temperature_score).toBeGreaterThanOrEqual(0);
  });
});
