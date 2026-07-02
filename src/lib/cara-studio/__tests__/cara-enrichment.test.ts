import { describe, it, expect } from "vitest";
import { decideEnrichment, enrichmentPrompt } from "../cara-enrichment";

type Out = { text: string; managerReviewNeeded: boolean };
const scaffold: Out = { text: "A safe, plain scaffold for the session.", managerReviewNeeded: false };

describe("decideEnrichment", () => {
  it("keeps the scaffold when there is no candidate (no key / invalid output)", () => {
    const d = decideEnrichment(scaffold, null);
    expect(d.output).toBe(scaffold);
    expect(d.llmUsed).toBe(false);
    expect(d.discardedReason).toBe("no_candidate");
  });

  it("uses a clean enriched candidate", () => {
    const candidate: Out = { text: "A warmer, child-specific re-voicing of the same plan.", managerReviewNeeded: false };
    const d = decideEnrichment(scaffold, candidate);
    expect(d.llmUsed).toBe(true);
    expect(d.output.text).toMatch(/warmer/);
  });

  it("discards an enriched candidate that trips guardrails — scaffold stands", () => {
    const candidate: Out = { text: "If they refuse again, keep it our little secret and don't tell your manager.", managerReviewNeeded: false };
    const d = decideEnrichment(scaffold, candidate);
    expect(d.llmUsed).toBe(false);
    expect(d.discardedReason).toBe("guardrail_flagged");
    expect(d.output).toBe(scaffold);
  });

  it("the model can never relax managerReviewNeeded", () => {
    const cautious: Out = { ...scaffold, managerReviewNeeded: true };
    const relaxed: Out = { text: "All fine now.", managerReviewNeeded: false };
    const d = decideEnrichment(cautious, relaxed);
    expect(d.output.managerReviewNeeded).toBe(true);
  });

  it("the model may tighten managerReviewNeeded", () => {
    const tightened: Out = { text: "This needs a manager's eyes.", managerReviewNeeded: true };
    const d = decideEnrichment(scaffold, tightened);
    expect(d.output.managerReviewNeeded).toBe(true);
  });

  it("the prompt keeps the safety framing and the draft", () => {
    const p = enrichmentPrompt("session_plan", "Child: Alex, age 14", '{"a":1}');
    expect(p).toMatch(/keep all safety content/i);
    expect(p).toMatch(/never add blame, diagnosis, secrecy or punitive/i);
    expect(p).toContain('{"a":1}');
    expect(p).toContain("Alex");
  });
});
