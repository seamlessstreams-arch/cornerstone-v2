import { describe, it, expect } from "vitest";
import {
  generateOversightPrompts,
  OVERSIGHT_REGULATION_REFS,
} from "./oversight-service";
import type { OversightPromptContext } from "./oversight-service";

// -- Factory ------------------------------------------------------------------

function makeContext(overrides: Partial<OversightPromptContext> = {}): OversightPromptContext {
  return {
    recordType: "incident",
    recordSummary: "Physical altercation between two young people",
    childName: "Alex",
    childAge: 14,
    historicalContext: "Previous incidents recorded",
    regulationRefs: ["CHR2015:Reg12"],
    ...overrides,
  };
}

// -- generateOversightPrompts -------------------------------------------------

describe("generateOversightPrompts", () => {
  it("returns opening, 5 dimensions, and closing", () => {
    const result = generateOversightPrompts(makeContext());
    expect(result.opening).toContain("incident");
    expect(result.dimensions).toHaveLength(5);
    expect(result.closing).toBeTruthy();
  });

  it("includes child name and age in dimension prompts", () => {
    const result = generateOversightPrompts(makeContext({ childName: "Beth", childAge: 12 }));
    const allPrompts = result.dimensions.map((d) => d.prompt).join(" ");
    expect(allPrompts).toContain("Beth");
    expect(allPrompts).toContain("12");
  });

  it("uses 'the young person' when no child name given", () => {
    const result = generateOversightPrompts(makeContext({ childName: undefined, childAge: undefined }));
    const allPrompts = result.dimensions.map((d) => d.prompt).join(" ");
    expect(allPrompts).toContain("the young person");
  });

  it("has correct dimension names in order", () => {
    const result = generateOversightPrompts(makeContext());
    const names = result.dimensions.map((d) => d.dimension);
    expect(names).toEqual([
      "Reflective Analysis",
      "Child Focus",
      "Professional Challenge",
      "Decision Clarity",
      "Action Specificity",
    ]);
  });

  it("includes regulation refs in closing when provided", () => {
    const result = generateOversightPrompts(makeContext({ regulationRefs: ["CHR2015:Reg7", "SCCIF:SafeChildren"] }));
    expect(result.closing).toContain("CHR2015:Reg7");
    expect(result.closing).toContain("SCCIF:SafeChildren");
  });

  it("does not mention regulations in closing when none provided", () => {
    const result = generateOversightPrompts(makeContext({ regulationRefs: undefined }));
    expect(result.closing).not.toContain("Relevant regulations");
  });

  it("maps each record type to its label", () => {
    const types: Array<OversightPromptContext["recordType"]> = [
      "incident", "safeguarding", "missing_episode", "complaint",
      "supervision", "restraint", "disclosure",
    ];
    for (const rt of types) {
      const result = generateOversightPrompts(makeContext({ recordType: rt }));
      expect(result.opening.length).toBeGreaterThan(0);
    }
  });

  it("each dimension has non-empty prompt and guidance", () => {
    const result = generateOversightPrompts(makeContext());
    for (const d of result.dimensions) {
      expect(d.prompt.length).toBeGreaterThan(10);
      expect(d.guidance.length).toBeGreaterThan(10);
    }
  });
});

// -- OVERSIGHT_REGULATION_REFS ------------------------------------------------

describe("OVERSIGHT_REGULATION_REFS", () => {
  it("has entries for all record types", () => {
    const expectedTypes = [
      "incident", "safeguarding", "missing_episode", "complaint",
      "daily_log", "medication_error", "restraint", "disclosure",
      "risk_assessment", "care_plan_review", "supervision",
      "key_work_session", "contact_session",
    ];
    for (const t of expectedTypes) {
      expect(OVERSIGHT_REGULATION_REFS[t as keyof typeof OVERSIGHT_REGULATION_REFS]).toBeDefined();
      expect(OVERSIGHT_REGULATION_REFS[t as keyof typeof OVERSIGHT_REGULATION_REFS].length).toBeGreaterThan(0);
    }
  });

  it("all entries contain CHR2015 or SCCIF or KCSIE refs", () => {
    for (const refs of Object.values(OVERSIGHT_REGULATION_REFS)) {
      for (const ref of refs) {
        expect(ref).toMatch(/CHR2015|SCCIF|KCSIE/);
      }
    }
  });
});
