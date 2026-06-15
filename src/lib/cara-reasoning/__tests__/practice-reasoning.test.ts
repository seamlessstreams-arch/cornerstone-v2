import { describe, it, expect } from "vitest";
import { shouldCallLLM, isLlmEligibleTask } from "../should-call-llm";
import { buildReasoningSignals } from "../hydrate";
import { buildUncertaintyRegister } from "../uncertainty-register";
import { reasonOverChild } from "../practice-reasoning-engine";
import type { ReasoningSignalsInput } from "../types";

function sig(over: Partial<ReasoningSignalsInput> = {}): ReasoningSignalsInput {
  return {
    childId: "yp_test",
    childName: "Alex",
    childAge: 14,
    knownRiskFlags: [],
    recentWindowDays: 90,
    incidents: [],
    significantEvents: [],
    moodScores: [],
    recentLogCount: 5,
    childVoicePresent: true,
    today: "2026-06-14",
    ...over,
  };
}

// ── LLM gatekeeper ────────────────────────────────────────────────────────────
describe("shouldCallLLM", () => {
  it("denies anything not on the approved list (default false)", () => {
    expect(shouldCallLLM("daily_log_summary").allowed).toBe(false);
    expect(shouldCallLLM("risk_score").allowed).toBe(false);
    expect(isLlmEligibleTask("daily_log_summary")).toBe(false);
  });
  it("permits an approved task by default", () => {
    expect(shouldCallLLM("writing_to_child").allowed).toBe(true);
    expect(isLlmEligibleTask("writing_to_child")).toBe(true);
  });
  it("skips an approved task when deterministic output is already confident", () => {
    expect(shouldCallLLM("reflective_analysis", { deterministicConfident: true }).allowed).toBe(false);
  });
  it("permits when a human explicitly requests it, even if deterministic is confident", () => {
    expect(shouldCallLLM("reflective_analysis", { deterministicConfident: true, userRequested: true }).allowed).toBe(true);
  });
  it("never auto-calls for safeguarding-sensitive content unless explicitly requested", () => {
    expect(shouldCallLLM("therapeutic_narrative", { safeguardingSensitive: true }).allowed).toBe(false);
    expect(shouldCallLLM("therapeutic_narrative", { safeguardingSensitive: true, userRequested: true }).allowed).toBe(true);
  });
});

// ── hydration ─────────────────────────────────────────────────────────────────
describe("buildReasoningSignals", () => {
  it("filters to the window and derives mood, voice and review status", () => {
    const signals = buildReasoningSignals({
      childId: "yp_alex",
      youngPerson: { id: "yp_alex", first_name: "Alexander", preferred_name: "Alex", date_of_birth: "2012-06-01", risk_flags: ["missing from care"] },
      incidents: [
        { type: "physical_intervention", severity: "high", date: "2026-06-01", oversight_by: "staff_darren" },
        { type: "behaviour_incident", severity: "low", date: "2020-01-01", oversight_by: null }, // outside window
      ],
      dailyLogs: [
        { date: "2026-06-10", mood_score: 7, content: "Alex said he felt happy today." },
        { date: "2026-06-12", mood_score: 5, content: "A quieter day." },
      ],
      chronology: [{ date: "2026-06-05", category: "safeguarding", significance: "critical", title: "A concern was raised" }],
      today: "2026-06-14",
    });
    expect(signals.childName).toBe("Alex");
    expect(signals.childAge).toBe(14);
    expect(signals.incidents.length).toBe(1); // 2020 entry filtered out
    expect(signals.incidents[0].reviewed).toBe(true);
    expect(signals.moodScores).toEqual([7, 5]); // chronological
    expect(signals.childVoicePresent).toBe(true); // "said ... felt"
    expect(signals.significantEvents.length).toBe(1);
    expect(signals.knownRiskFlags).toContain("missing from care");
  });

  it("flags absent child voice when no reporting language or quotes are present", () => {
    const signals = buildReasoningSignals({
      childId: "yp_x",
      youngPerson: { id: "yp_x", first_name: "Sam" },
      dailyLogs: [{ date: "2026-06-12", content: "Routine evening; medication given." }],
      today: "2026-06-14",
    });
    expect(signals.childVoicePresent).toBe(false);
  });
});

// ── uncertainty register ───────────────────────────────────────────────────────
describe("buildUncertaintyRegister", () => {
  it("records unknown child-view and missing oversight + wellbeing where applicable", () => {
    const reg = buildUncertaintyRegister(
      sig({
        childVoicePresent: false,
        moodScores: [],
        incidents: [{ type: "incident", severity: "high", date: "2026-06-10", reviewed: false }],
      }),
    );
    expect(reg.some((u) => u.status === "unknown" && /child's own view/i.test(u.area))).toBe(true);
    expect(reg.some((u) => u.status === "missing" && /Management oversight/i.test(u.area))).toBe(true);
    expect(reg.some((u) => u.status === "missing" && /Wellbeing/i.test(u.area))).toBe(true);
    // review dates derived deterministically from `today`
    expect(reg.find((u) => /Management oversight/i.test(u.area))?.reviewBy).toBe("2026-06-16");
  });
});

// ── reasoning engine ────────────────────────────────────────────────────────────
describe("reasonOverChild", () => {
  it("reasons over a complex, high-risk picture", () => {
    const r = reasonOverChild(
      sig({
        knownRiskFlags: ["child exploitation"],
        childVoicePresent: false,
        moodScores: [],
        incidents: [
          { type: "missing_from_care", severity: "high", date: "2026-06-10", reviewed: false },
          { type: "safeguarding_concern", severity: "critical", date: "2026-06-08", reviewed: true },
        ],
      }),
    );
    expect(r.risks.some((x) => /safeguarding/i.test(x.statement))).toBe(true);
    expect(r.risks.some((x) => /missing/i.test(x.statement))).toBe(true);
    expect(r.meaning.some((x) => /contextual/i.test(x.statement))).toBe(true);
    expect(r.nextSteps.some((s) => /oversight/i.test(s.action))).toBe(true);
    expect(r.nextSteps.some((s) => /multi-agency|contextual/i.test(s.action))).toBe(true);
    expect(r.competingExplanations.length).toBeGreaterThanOrEqual(2);
    // complex + not-high confidence ⇒ recommend a (human-authored) reflective formulation,
    // but the gate must NOT auto-call for safeguarding-sensitive content.
    expect(r.llmRecommended).toBe(true);
    expect(r.llmGate.allowed).toBe(false);
  });

  it("recognises a settled picture and surfaces strengths with higher confidence", () => {
    const r = reasonOverChild(sig({ incidents: [], childVoicePresent: true, moodScores: [6, 7, 8], recentLogCount: 6 }));
    expect(r.noticing[0].statement).toMatch(/No incidents/i);
    expect(r.strengths.some((x) => /improving/i.test(x.statement))).toBe(true);
    expect(r.overallConfidence).toBe("high");
    expect(r.llmRecommended).toBe(false);
  });

  it("is deterministic", () => {
    const input = sig({ incidents: [{ type: "physical_intervention", severity: "high", date: "2026-06-10", reviewed: true }] });
    expect(reasonOverChild(input)).toEqual(reasonOverChild(input));
  });

  it("always offers at least one strength even on a deficit-heavy record", () => {
    const r = reasonOverChild(sig({ childVoicePresent: false, moodScores: [], recentLogCount: 0, incidents: [{ type: "incident", severity: "high", date: "2026-06-10", reviewed: false }] }));
    expect(r.strengths.length).toBeGreaterThanOrEqual(1);
  });
});
