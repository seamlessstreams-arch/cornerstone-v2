import { describe, it, expect } from "vitest";
import { buildDefensibleDecision, type DefensibleDecisionInput } from "../defensible-decision-engine";

const TODAY = "2026-06-15";

function full(over: Partial<DefensibleDecisionInput> = {}): DefensibleDecisionInput {
  return {
    childName: "Jordan",
    decisionSummary: "Increase staffing to 2:1 during community time",
    whatHappened: "Two missing episodes.",
    informationConsidered: ["records", "risk assessment"],
    childView: "Jordan understands the worry.",
    whatWeKnow: ["same location each time"],
    whatWeDoNotKnow: ["who they are meeting"],
    risks: ["possible exploitation"],
    strengths: ["returns willingly"],
    optionsConsidered: ["maintain 1:1", "increase to 2:1", "pause community time"],
    rationaleForChoice: "Balances freedom and safety.",
    whyAlternativesRejected: "Pausing would be disproportionate.",
    actionRequired: "Roster 2:1 and review weekly.",
    responsibleRole: "registered_manager",
    reviewDate: "2026-06-29",
    whatWouldChangeThisDecision: "Two settled weeks.",
    riskLevel: "high",
    ...over,
  };
}

describe("buildDefensibleDecision", () => {
  it("scores a complete decision as strong with no gaps", () => {
    const d = buildDefensibleDecision(full(), TODAY);
    expect(d.gaps).toEqual([]);
    expect(d.defensibilityScore).toBe(100);
    expect(d.defensibility).toBe("strong");
    expect(d.confidence).toBe("high");
    expect(d.narrative).toMatch(/Why alternatives were rejected/);
  });

  it("flags the classic defensibility gaps (no review date / alternatives / what-would-change)", () => {
    const d = buildDefensibleDecision(full({ reviewDate: undefined, whatWouldChangeThisDecision: undefined, whyAlternativesRejected: undefined }), TODAY);
    const sections = d.gaps.map((g) => g.section);
    expect(sections).toEqual(expect.arrayContaining(["Review date", "What would change this decision", "Why alternatives were rejected"]));
    expect(d.gaps.every((g) => g.severity === "significant")).toBe(true);
    expect(d.defensibilityScore).toBeLessThan(90);
  });

  it("flags a single-option decision as not weighing alternatives", () => {
    const d = buildDefensibleDecision(full({ optionsConsidered: ["increase to 2:1"] }), TODAY);
    expect(d.gaps.some((g) => /Only one option/.test(g.issue))).toBe(true);
  });

  it("flags a missing child view", () => {
    const d = buildDefensibleDecision(full({ childView: undefined }), TODAY);
    expect(d.gaps.some((g) => g.section === "What the child says")).toBe(true);
  });

  it("rates a sparse decision as weak", () => {
    const d = buildDefensibleDecision({ decisionSummary: "Do X" }, TODAY);
    expect(d.defensibility).toBe("weak");
    expect(d.confidence).toBe("low");
    expect(d.gaps.length).toBeGreaterThan(5);
  });

  it("is deterministic", () => {
    expect(buildDefensibleDecision(full(), TODAY)).toEqual(buildDefensibleDecision(full(), TODAY));
  });
});
