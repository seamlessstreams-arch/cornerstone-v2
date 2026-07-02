// ══════════════════════════════════════════════════════════════════════════════
// CARA — PRACTICE REASONING ENGINE (Layer 3, the "brain")
//
// reasonOverChild(signals) → a structured, evidence-bound reasoning view. Pure +
// deterministic. Every finding carries a confidence and its basis; competing
// explanations are always offered where there is uncertainty; nothing is stated
// as certain beyond what the records support. No model calls — enhanced
// reflective drafting is only ever RECOMMENDED via the LLM gatekeeper.
// ══════════════════════════════════════════════════════════════════════════════

import {
  REASONING_ENGINE_VERSION,
  REASONING_DISCLAIMER,
  type ReasoningSignalsInput,
  type PracticeReasoning,
  type ReasoningFinding,
  type ReasoningOption,
  type ReasoningNextStep,
  type Confidence,
} from "./types";
import { buildUncertaintyRegister } from "./uncertainty-register";
import { shouldCallLLM } from "./should-call-llm";

const MISSING_TYPES = new Set(["missing_from_care", "missing_episode"]);
const RESTRAINT_TYPES = new Set(["physical_intervention"]);
const SAFEGUARDING_TYPES = new Set(["safeguarding_concern", "allegation", "exploitation_concern", "contextual_safeguarding"]);
const SELF_HARM_TYPES = new Set(["self_harm"]);

function countWhere(input: ReasoningSignalsInput, set: Set<string>): number {
  return input.incidents.filter((i) => set.has(i.type)).length;
}

/** Trend of the most recent mood scores: needs ≥3 points to call a direction. */
function moodTrend(scores: number[]): "improving" | "declining" | "stable" | "unknown" {
  if (scores.length < 3) return "unknown";
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const lastHalf = scores.slice(Math.ceil(scores.length / 2));
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const delta = avg(lastHalf) - avg(firstHalf);
  if (delta >= 1) return "improving";
  if (delta <= -1) return "declining";
  return "stable";
}

/** Most frequently repeated incident type (≥2 occurrences). */
function repeatedType(input: ReasoningSignalsInput): { type: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const i of input.incidents) counts.set(i.type, (counts.get(i.type) ?? 0) + 1);
  let best: { type: string; count: number } | null = null;
  for (const [type, count] of counts) {
    if (count >= 2 && (!best || count > best.count)) best = { type, count };
  }
  return best;
}

const humanType = (t: string) => t.replace(/_/g, " ");

export function reasonOverChild(input: ReasoningSignalsInput): PracticeReasoning {
  const w = input.recentWindowDays;
  const missingCount = countWhere(input, MISSING_TYPES);
  const restraintCount = countWhere(input, RESTRAINT_TYPES);
  const safeguardingCount = countWhere(input, SAFEGUARDING_TYPES);
  const selfHarmCount = countWhere(input, SELF_HARM_TYPES);
  const trend = moodTrend(input.moodScores);
  const repeated = repeatedType(input);
  const complex = safeguardingCount > 0 || missingCount > 0 || restraintCount >= 2 || input.incidents.length >= 3 || selfHarmCount > 0;

  // ── Noticing ──────────────────────────────────────────────────────────────
  const noticing: ReasoningFinding[] = [];
  if (input.incidents.length) {
    noticing.push({
      statement: `${input.incidents.length} incident(s) recorded in the last ${w} days.`,
      confidence: "high",
      basis: "Incident records.",
    });
  } else {
    noticing.push({ statement: `No incidents recorded in the last ${w} days.`, confidence: "high", basis: "Incident records." });
  }
  if (repeated) {
    noticing.push({
      statement: `A repeated pattern of "${humanType(repeated.type)}" events (${repeated.count}).`,
      confidence: repeated.count >= 3 ? "high" : "medium",
      basis: "Repeated incident type within the window.",
    });
  }
  if (missingCount) noticing.push({ statement: `${missingCount} missing-from-care episode(s).`, confidence: "high", basis: "Incident records." });
  if (restraintCount) noticing.push({ statement: `${restraintCount} physical intervention(s).`, confidence: "high", basis: "Incident records." });
  if (safeguardingCount) noticing.push({ statement: `${safeguardingCount} safeguarding-related concern(s).`, confidence: "high", basis: "Incident records." });
  if (input.significantEvents.length)
    noticing.push({ statement: `${input.significantEvents.length} significant chronology event(s).`, confidence: "medium", basis: "Chronology (significant/critical)." });
  if (trend !== "unknown")
    noticing.push({ statement: `Recorded wellbeing appears to be ${trend}.`, confidence: "medium", basis: `${input.moodScores.length} recent mood scores.` });

  // ── Meaning (cautious; tied to evidence) ───────────────────────────────────
  const meaning: ReasoningFinding[] = [];
  if (missingCount && safeguardingCount) {
    meaning.push({
      statement: "The combination of missing episodes and safeguarding concern may indicate extra-familial / contextual risk that warrants a contextual safeguarding lens.",
      confidence: "medium",
      basis: "Co-occurring missing + safeguarding signals.",
    });
  }
  if (repeated && RESTRAINT_TYPES.has(repeated.type)) {
    meaning.push({
      statement: "The repeated need for physical intervention may indicate current strategies are not yet meeting the child's needs; the behaviour support plan should be reviewed with the child.",
      confidence: "medium",
      basis: "Repeated physical intervention.",
    });
  }
  if (trend === "declining") {
    meaning.push({
      statement: "A declining wellbeing trend may reflect an unmet need, a recent change, or distress the child has not yet been able to name.",
      confidence: "low",
      basis: "Mood-score trend (indicative only).",
    });
  }
  if (!meaning.length) {
    meaning.push({
      statement: input.incidents.length
        ? "The records show activity but do not yet support a firm interpretation; hold this lightly and confirm with the child and team."
        : "A relatively settled period on the available records; continue to monitor and keep capturing the child's voice.",
      confidence: "low",
      basis: "Limited / non-specific signals.",
    });
  }

  // ── What the child may be communicating ────────────────────────────────────
  const childMayBeCommunicating: string[] = [
    "Behaviour is communication — these events may be the child expressing distress, an unmet need, or a bid for safety and connection rather than defiance.",
  ];
  if (missingCount) childMayBeCommunicating.push("Going missing may be communicating that something here does not yet feel safe, or that a pull or relationship outside is strong.");
  if (trend === "declining") childMayBeCommunicating.push("Lower mood may be communicating grief, worry, or a change the child has not been able to put into words.");
  if (!input.childVoicePresent) childMayBeCommunicating.push("With the child's own voice absent from recent records, we are interpreting from the outside — their view should be sought directly.");

  // ── Risks & strengths ───────────────────────────────────────────────────────
  const risks: ReasoningFinding[] = [];
  if (safeguardingCount) risks.push({ statement: "Active safeguarding concern requires a safeguarding-led response.", confidence: "high", basis: "Safeguarding incident(s)." });
  if (missingCount) risks.push({ statement: "Risk associated with going missing (exploitation / harm while absent).", confidence: "high", basis: "Missing episode(s)." });
  if (restraintCount >= 2) risks.push({ statement: "Escalating behaviour requiring restrictive physical intervention.", confidence: "medium", basis: "Repeated physical intervention." });
  if (selfHarmCount) risks.push({ statement: "Recorded self-harm — health and emotional-safety risk.", confidence: "high", basis: "Self-harm incident(s)." });
  for (const flag of input.knownRiskFlags) risks.push({ statement: `Known risk area: ${flag}.`, confidence: "medium", basis: "Recorded risk flags." });
  if (!risks.length) risks.push({ statement: "No acute risks evident on the available records; continue routine monitoring.", confidence: "low", basis: "Absence of risk signals (not proof of safety)." });

  const strengths: ReasoningFinding[] = [];
  if (trend === "improving") strengths.push({ statement: "Recorded wellbeing appears to be improving.", confidence: "medium", basis: "Mood-score trend." });
  if (input.childVoicePresent) strengths.push({ statement: "The child's voice is being captured in recent recording.", confidence: "medium", basis: "Recent records include the child's perspective." });
  if (input.incidents.length && input.incidents.every((i) => i.reviewed)) strengths.push({ statement: "Events are being reviewed by managers (oversight present).", confidence: "high", basis: "All incidents show management oversight." });
  if (!input.incidents.length) strengths.push({ statement: "A settled period with no recorded incidents.", confidence: "medium", basis: "No incidents in the window." });
  if (!strengths.length) strengths.push({ statement: "Strengths are likely present but under-recorded; ensure positives and progress are captured, not only concerns.", confidence: "low", basis: "Deficit-weighted recording is common — look actively for strengths." });

  // ── Competing explanations (always ≥2 where uncertain) ──────────────────────
  const competingExplanations: string[] = [];
  if (input.incidents.length) {
    competingExplanations.push("These events may reflect escalating risk — OR a child testing whether this placement is genuinely safe and stable. Both should be held until clearer.");
  } else {
    competingExplanations.push("A quiet period may mean the child is settling — OR that distress is being internalised and under-recorded. Confirm directly with the child.");
  }
  if (trend === "declining") competingExplanations.push("Declining mood may be a temporary response to a specific event — OR an early sign of a deeper unmet need. Monitor and ask.");
  if (missingCount) competingExplanations.push("Missing episodes may be peer-driven and external — OR a response to something within the placement. Explore both with the child and the network.");

  // ── Options ────────────────────────────────────────────────────────────────
  const options: ReasoningOption[] = [
    { option: "Review the risk assessment and behaviour support plan with the child.", rationale: "Keeps the plan current and co-produced rather than done to the child." },
    { option: "Hold a reflective team discussion / formulation.", rationale: "Integrates the signals into a shared hypothesis and reduces single-worker bias." },
  ];
  if (safeguardingCount || missingCount) options.push({ option: "Consider a contextual safeguarding / multi-agency discussion.", rationale: "Extra-familial risk needs a response beyond the home alone." });
  if (!input.childVoicePresent) options.push({ option: "Prioritise capturing the child's voice.", rationale: "Reasoning is currently adult-only; the child's view may change the picture." });

  // ── Next steps ───────────────────────────────────────────────────────────────
  const nextSteps: ReasoningNextStep[] = [];
  const unreviewed = input.incidents.filter((i) => !i.reviewed).length;
  if (unreviewed) nextSteps.push({ action: `Complete management oversight for ${unreviewed} outstanding incident(s).`, responsibleRole: "registered_manager", timescale: "48 hours" });
  if (!input.childVoicePresent) nextSteps.push({ action: "Capture the child's voice in a key-work conversation and reflect it in the plan.", responsibleRole: "key_worker", timescale: "1 week" });
  nextSteps.push({ action: "Review and, if needed, update the risk assessment and behaviour support plan with the child.", responsibleRole: "deputy_manager", timescale: "2 weeks" });
  if (safeguardingCount || missingCount) nextSteps.push({ action: "Arrange a contextual safeguarding / multi-agency discussion.", responsibleRole: "registered_manager", timescale: "5 working days" });

  // ── How we'll know it worked ──────────────────────────────────────────────
  const howWeWillKnow: string[] = [];
  if (repeated) howWeWillKnow.push(`A reduction in "${humanType(repeated.type)}" events over the next ${w} days.`);
  if (missingCount) howWeWillKnow.push("Fewer / shorter missing episodes, and return conversations consistently completed.");
  howWeWillKnow.push("The child's voice is recorded and visibly reflected in their plan.");
  howWeWillKnow.push("Recorded wellbeing stabilises or improves.");
  if (unreviewed) howWeWillKnow.push("Outstanding management oversight is complete and actions are tracked to impact.");

  // ── Uncertainty + overall confidence ────────────────────────────────────────
  const uncertaintyRegister = buildUncertaintyRegister(input);
  const sufficiency =
    (input.incidents.length ? 1 : 0) +
    (input.moodScores.length >= 3 ? 1 : 0) +
    (input.recentLogCount >= 3 ? 1 : 0) +
    (input.childVoicePresent ? 1 : 0);
  const overallConfidence: Confidence = sufficiency >= 3 ? "high" : sufficiency >= 2 ? "medium" : "low";

  // ── LLM recommendation (recommend-only, via the gatekeeper) ──────────────────
  const llmRecommended = complex && overallConfidence !== "high";
  const llmGate = shouldCallLLM("reflective_analysis", {
    deterministicConfident: overallConfidence === "high",
    safeguardingSensitive: safeguardingCount > 0,
  });

  return {
    childId: input.childId,
    childName: input.childName,
    noticing,
    meaning,
    childMayBeCommunicating,
    risks,
    strengths,
    competingExplanations,
    options,
    nextSteps,
    howWeWillKnow,
    uncertaintyRegister,
    overallConfidence,
    llmRecommended,
    llmRecommendedFor: llmRecommended
      ? "A reflective formulation that integrates these signals into a fuller practice hypothesis (human-reviewed)."
      : undefined,
    llmGate,
    disclaimer: REASONING_DISCLAIMER,
    engineVersion: REASONING_ENGINE_VERSION,
    generatedAt: input.today,
  };
}
