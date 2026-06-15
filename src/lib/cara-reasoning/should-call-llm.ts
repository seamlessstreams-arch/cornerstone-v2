// ══════════════════════════════════════════════════════════════════════════════
// CARA — LLM GATEKEEPER
//
// The single deterministic decision point for "should we spend a model call?".
// Default is FALSE. Only an explicit, approved reason — and only when the
// deterministic output is genuinely insufficient — permits a model call.
//
// This does NOT call the model; it decides whether a caller MAY. The actual
// provider call still goes through src/lib/cara/cara-provider.ts (generateText),
// which independently falls back to deterministic output when no key is set.
// Target: 80%+ reduction in unnecessary API calls.
// ══════════════════════════════════════════════════════════════════════════════

/** The only reasons a model call is ever appropriate. Everything else is deterministic. */
export type LlmTask =
  | "writing_to_child"
  | "complex_formulation"
  | "reflective_analysis"
  | "multi_agency_summary"
  | "advanced_report"
  | "child_friendly_explanation"
  | "therapeutic_narrative";

const LLM_ALLOWED: ReadonlySet<string> = new Set<LlmTask>([
  "writing_to_child",
  "complex_formulation",
  "reflective_analysis",
  "multi_agency_summary",
  "advanced_report",
  "child_friendly_explanation",
  "therapeutic_narrative",
]);

export interface LlmGateOptions {
  /** The deterministic engine already produced a high-confidence result — prefer it. */
  deterministicConfident?: boolean;
  /** A human explicitly asked for enhanced drafting (overrides the confidence skip). */
  userRequested?: boolean;
  /** Safeguarding-sensitive content that must stay deterministic / human-authored. */
  safeguardingSensitive?: boolean;
}

export interface LlmGateDecision {
  allowed: boolean;
  task: string;
  reason: string;
}

/**
 * Decide whether a model call is permitted for a given task. Pure + deterministic.
 *
 *   shouldCallLLM("reflective_analysis", { deterministicConfident: true }).allowed === false
 *   shouldCallLLM("daily_log_summary").allowed === false   // not an approved reason
 *   shouldCallLLM("writing_to_child", { userRequested: true }).allowed === true
 */
export function shouldCallLLM(task: string, opts: LlmGateOptions = {}): LlmGateDecision {
  if (!LLM_ALLOWED.has(task)) {
    return {
      allowed: false,
      task,
      reason: `Handled deterministically — "${task}" is not an approved reason to call the model.`,
    };
  }
  // Safeguarding-sensitive material is never auto-sent to a model; a human authors it.
  if (opts.safeguardingSensitive && !opts.userRequested) {
    return {
      allowed: false,
      task,
      reason: "Safeguarding-sensitive content is kept deterministic / human-authored unless explicitly requested.",
    };
  }
  // Even an approved task is skipped when the deterministic output is already strong,
  // unless a human explicitly asked for the enhanced version.
  if (opts.deterministicConfident && !opts.userRequested) {
    return {
      allowed: false,
      task,
      reason: "Deterministic output is sufficient; a model call has been avoided.",
    };
  }
  return { allowed: true, task, reason: `Model call permitted for "${task}".` };
}

/** Convenience: is this task ever eligible for a model call (ignoring runtime options)? */
export function isLlmEligibleTask(task: string): boolean {
  return LLM_ALLOWED.has(task);
}
