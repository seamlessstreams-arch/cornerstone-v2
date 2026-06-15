// ══════════════════════════════════════════════════════════════════════════════
// CARA — UNCERTAINTY REGISTER
//
// Makes the boundary of what we actually know explicit: known / unknown /
// missing, each with a confidence level and (where relevant) a clarification
// action and review date. This moves practice from "predict and act" towards
// "monitor and adapt" — you cannot be certain of what the records do not show.
// Pure + deterministic (review dates derived from an injected `today`).
// ══════════════════════════════════════════════════════════════════════════════

import type { ReasoningSignalsInput, UncertaintyItem } from "./types";

function addDays(today: string, days: number): string {
  const d = new Date(today);
  if (isNaN(d.getTime())) return today;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Expected minimum daily-log entries for the window before recording looks thin. */
function expectedLogFloor(windowDays: number): number {
  return Math.max(2, Math.round(windowDays / 14)); // ~1 entry / fortnight as a floor
}

export function buildUncertaintyRegister(input: ReasoningSignalsInput): UncertaintyItem[] {
  const items: UncertaintyItem[] = [];
  const add = (
    area: string,
    status: UncertaintyItem["status"],
    detail: string,
    confidence: UncertaintyItem["confidence"],
    clarificationAction?: string,
    reviewBy?: string,
  ) => items.push({ area, status, detail, confidence, clarificationAction, reviewBy });

  // ── Known ────────────────────────────────────────────────────────────────
  add(
    "Recorded events",
    "known",
    `${input.incidents.length} incident(s) and ${input.significantEvents.length} significant event(s) are recorded in the last ${input.recentWindowDays} days.`,
    "high",
  );
  if (input.knownRiskFlags.length) {
    add("Known risks", "known", `Recorded risk areas: ${input.knownRiskFlags.join(", ")}.`, "high");
  }
  if (input.moodScores.length) {
    add("Wellbeing data", "known", `${input.moodScores.length} recent wellbeing/mood score(s) are available.`, "medium");
  }

  // ── Unknown ──────────────────────────────────────────────────────────────
  add(
    "Antecedents & triggers",
    "unknown",
    "The detailed antecedents and triggers behind recorded events are not captured in the structured signals available; the narrative records should be read directly.",
    "medium",
    "Read the incident narratives for antecedent detail and confirm triggers in the risk assessment.",
  );
  if (!input.childVoicePresent) {
    add(
      "The child's own view",
      "unknown",
      "The child's own perspective is not evidenced in recent recording, so any interpretation is from the adults' viewpoint only.",
      "low",
      "Offer a key-work conversation and capture the child's voice in their own words.",
      addDays(input.today, 7),
    );
  }

  // ── Missing ──────────────────────────────────────────────────────────────
  if (input.recentLogCount < expectedLogFloor(input.recentWindowDays)) {
    add(
      "Recent daily recording",
      "missing",
      `Only ${input.recentLogCount} daily-log entr(y/ies) in the window — recording may not be current, which limits how confident this reasoning can be.`,
      "medium",
      "Check that daily recording is up to date for this child.",
      addDays(input.today, 3),
    );
  }
  const unreviewed = input.incidents.filter((i) => !i.reviewed).length;
  if (unreviewed > 0) {
    add(
      "Management oversight",
      "missing",
      `${unreviewed} incident(s) have no recorded management oversight, so the professional response to them is not yet assured.`,
      "high",
      "Complete management oversight for the outstanding incident(s).",
      addDays(input.today, 2),
    );
  }
  if (!input.moodScores.length) {
    add(
      "Wellbeing data",
      "missing",
      "No recent wellbeing/mood scores are recorded, so emotional trend cannot be assessed from the data.",
      "low",
      "Record wellbeing/mood observations in daily logs or key-work.",
    );
  }

  return items;
}
