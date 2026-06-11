// ══════════════════════════════════════════════════════════════════════════════
// CARA STUDIO — ENRICHMENT DECISION
//
// The LLM may only RE-VOICE an already-safe deterministic scaffold. This pure
// function decides whether an enriched candidate replaces the scaffold:
//   • null candidate (no key / invalid JSON / failed schema) → scaffold stands
//   • candidate trips ANY guardrail → discarded, scaffold stands
//   • managerReviewNeeded can only be tightened, never loosened by the model
// ══════════════════════════════════════════════════════════════════════════════

import { runCaraGuardrails } from "./cara-guardrails";

export interface EnrichmentDecision<T> {
  output: T;
  llmUsed: boolean;
  discardedReason: "none" | "no_candidate" | "guardrail_flagged";
}

export function decideEnrichment<T extends { managerReviewNeeded: boolean }>(
  scaffold: T,
  candidate: T | null,
): EnrichmentDecision<T> {
  if (!candidate) {
    return { output: scaffold, llmUsed: false, discardedReason: "no_candidate" };
  }
  const check = runCaraGuardrails(candidate);
  if (check.action !== "allow") {
    return { output: scaffold, llmUsed: false, discardedReason: "guardrail_flagged" };
  }
  // The model never gets to relax the review requirement.
  const output: T = {
    ...candidate,
    managerReviewNeeded: candidate.managerReviewNeeded || scaffold.managerReviewNeeded,
  };
  return { output, llmUsed: true, discardedReason: "none" };
}

/** The instruction wrapped around every enrichment call. */
export function enrichmentPrompt(moduleName: string, contextText: string, scaffoldJson: string): string {
  return [
    `Below is a complete, safe DRAFT ${moduleName.replace(/_/g, " ")} produced by Cara's deterministic engine, followed by the child's context.`,
    `Improve the WORDING so it reads naturally and warmly for this specific child and team — keep every field, keep the same JSON shape exactly, keep all safety content (signs to pause, safeguarding notes, recording prompt), and never add blame, diagnosis, secrecy or punitive framing.`,
    `Return ONLY the JSON object.`,
    ``,
    `CHILD CONTEXT:\n${contextText || "(no child context — keep it general)"}`,
    ``,
    `DRAFT:\n${scaffoldJson}`,
  ].join("\n");
}
