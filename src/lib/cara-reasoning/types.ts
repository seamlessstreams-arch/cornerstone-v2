// ══════════════════════════════════════════════════════════════════════════════
// CARA — PRACTICE REASONING LAYER · types
//
// Layer 3 of the Practice Intelligence OS — the reasoning "brain". It takes
// normalised signals about a child (assembled from the existing record
// collections) and produces a structured, evidence-bound reasoning view:
// what we're noticing, what it might mean, what we're uncertain about, what the
// child may be communicating, the risks/strengths, competing explanations,
// options, next steps, and how we'll know if it worked.
//
// No conclusions without evidence. No certainty without evidence. Confidence and
// uncertainty are always explicit. Deterministic — no model calls.
// ══════════════════════════════════════════════════════════════════════════════

/** Aligns with the house RuleResult confidence vocabulary (src/lib/cara/rules-engine.ts). */
export type Confidence = "high" | "medium" | "low";

// ─── Input: normalised signals (assembled in the route from real records) ──────

export interface ReasoningIncident {
  type: string;
  severity: string;
  date: string;
  reviewed: boolean;
}

export interface ReasoningEvent {
  date: string;
  category: string;
  significance: string;
  title: string;
}

export interface ReasoningSignalsInput {
  childId: string;
  childName: string;
  childAge?: number;
  knownRiskFlags: string[];
  recentWindowDays: number;
  /** Incidents within the window (newest-first), already filtered to this child. */
  incidents: ReasoningIncident[];
  /** Significant/critical chronology events within the window. */
  significantEvents: ReasoningEvent[];
  /** Recent daily-log mood scores (0–10), chronological. */
  moodScores: number[];
  recentLogCount: number;
  /** Whether the child's own voice appears in recent recording. */
  childVoicePresent: boolean;
  today: string;
}

// ─── Output ────────────────────────────────────────────────────────────────────

export interface ReasoningFinding {
  statement: string;
  confidence: Confidence;
  basis: string;
}

export type UncertaintyStatus = "known" | "unknown" | "missing";

export interface UncertaintyItem {
  area: string;
  status: UncertaintyStatus;
  detail: string;
  confidence: Confidence;
  clarificationAction?: string;
  reviewBy?: string;
}

export interface ReasoningOption {
  option: string;
  rationale: string;
}

export interface ReasoningNextStep {
  action: string;
  responsibleRole: string;
  timescale: string;
}

export interface PracticeReasoning {
  childId: string;
  childName: string;

  noticing: ReasoningFinding[];
  meaning: ReasoningFinding[];
  childMayBeCommunicating: string[];
  risks: ReasoningFinding[];
  strengths: ReasoningFinding[];
  competingExplanations: string[];

  options: ReasoningOption[];
  nextSteps: ReasoningNextStep[];
  howWeWillKnow: string[];

  uncertaintyRegister: UncertaintyItem[];
  overallConfidence: Confidence;

  /** Whether enhanced reflective drafting by the model is recommended (recommend-only). */
  llmRecommended: boolean;
  llmRecommendedFor?: string;
  /** The deterministic gate decision for that recommendation. */
  llmGate: { allowed: boolean; task: string; reason: string };

  disclaimer: string;
  engineVersion: string;
  generatedAt: string;
}

export const REASONING_ENGINE_VERSION = "1.0.0";

export const REASONING_DISCLAIMER =
  "Cara's reasoning is a deterministic, evidence-bound aid to professional judgement. It surfaces what the records do and do not show, with explicit confidence and uncertainty. It never decides, and every conclusion remains for the practitioner and manager to weigh.";
