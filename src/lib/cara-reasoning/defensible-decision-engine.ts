// ══════════════════════════════════════════════════════════════════════════════
// CARA — DEFENSIBLE DECISION ENGINE (Reasoning Layer)
//
// Structures a professional decision into the 14-point defensible-decision record
// and scores how defensible it currently is — flagging the classic weaknesses
// (no alternatives considered, no review date, no "what would change this
// decision", the child's view not recorded). Pure + deterministic; no model
// calls. Pairs with the management-oversight sign-off.
// ══════════════════════════════════════════════════════════════════════════════

import type { Confidence } from "./types";

export type DecisionRisk = "low" | "medium" | "high" | "critical";

export interface DefensibleDecisionInput {
  childName?: string;
  decisionSummary: string; // the decision being made / taken
  whatHappened?: string; // 1
  informationConsidered?: string[]; // 2
  childView?: string; // 3
  whatWeKnow?: string[]; // 4
  whatWeDoNotKnow?: string[]; // 5
  risks?: string[]; // 6
  strengths?: string[]; // 7
  optionsConsidered?: string[]; // 8
  rationaleForChoice?: string; // 9
  whyAlternativesRejected?: string; // 10
  actionRequired?: string; // 11
  responsibleRole?: string; // 12
  reviewDate?: string; // 13
  whatWouldChangeThisDecision?: string; // 14
  riskLevel?: DecisionRisk;
}

export type DecisionDefensibility = "strong" | "adequate" | "needs_strengthening" | "weak";

export interface DecisionSection {
  key: string;
  label: string;
  content: string | string[];
  present: boolean;
  mandatory: boolean;
}

export interface DecisionGap {
  section: string;
  issue: string;
  severity: "minor" | "moderate" | "significant";
}

export interface DefensibleDecision {
  childName?: string;
  decisionSummary: string;
  sections: DecisionSection[];
  gaps: DecisionGap[];
  defensibilityScore: number; // 0–100
  defensibility: DecisionDefensibility;
  confidence: Confidence;
  narrative: string;
  disclaimer: string;
  engineVersion: string;
  generatedAt: string;
}

export const DECISION_ENGINE_VERSION = "1.0.0";

const DECISION_DISCLAIMER =
  "This is a deterministic structuring of the decision against the defensible-decision framework. It checks the reasoning is complete and recorded — it does not judge whether the decision is right, which remains the professional's accountability.";

const nonEmptyStr = (s?: string) => !!s && s.trim().length > 0;
const nonEmptyArr = (a?: string[]) => Array.isArray(a) && a.filter((x) => nonEmptyStr(x)).length > 0;

/** Build the 14-point defensible-decision record and score its defensibility. */
export function buildDefensibleDecision(input: DefensibleDecisionInput, today: string): DefensibleDecision {
  const present = (v: string | string[] | undefined) => (Array.isArray(v) ? nonEmptyArr(v) : nonEmptyStr(v));

  // The 14 points, with which are mandatory for a defensible record.
  const spec: Array<{ key: string; label: string; value: string | string[] | undefined; mandatory: boolean }> = [
    { key: "whatHappened", label: "What happened", value: input.whatHappened, mandatory: true },
    { key: "informationConsidered", label: "What information was considered", value: input.informationConsidered, mandatory: true },
    { key: "childView", label: "What the child says", value: input.childView, mandatory: true },
    { key: "whatWeKnow", label: "What we know", value: input.whatWeKnow, mandatory: false },
    { key: "whatWeDoNotKnow", label: "What we do not know", value: input.whatWeDoNotKnow, mandatory: true },
    { key: "risks", label: "Risks", value: input.risks, mandatory: true },
    { key: "strengths", label: "Strengths", value: input.strengths, mandatory: false },
    { key: "optionsConsidered", label: "Options considered", value: input.optionsConsidered, mandatory: true },
    { key: "rationaleForChoice", label: "Why this option was chosen", value: input.rationaleForChoice, mandatory: true },
    { key: "whyAlternativesRejected", label: "Why alternatives were rejected", value: input.whyAlternativesRejected, mandatory: true },
    { key: "actionRequired", label: "Action required", value: input.actionRequired, mandatory: true },
    { key: "responsibleRole", label: "Who is responsible", value: input.responsibleRole, mandatory: true },
    { key: "reviewDate", label: "Review date", value: input.reviewDate, mandatory: true },
    { key: "whatWouldChangeThisDecision", label: "What would change this decision", value: input.whatWouldChangeThisDecision, mandatory: true },
  ];

  const sections: DecisionSection[] = spec.map((s) => ({
    key: s.key,
    label: s.label,
    content: s.value ?? (Array.isArray(s.value) ? [] : ""),
    present: present(s.value),
    mandatory: s.mandatory,
  }));

  // Gaps — missing mandatory points, with severity raised for high-stakes decisions.
  const highStakes = input.riskLevel === "high" || input.riskLevel === "critical";
  const gaps: DecisionGap[] = [];
  for (const s of sections) {
    if (s.mandatory && !s.present) {
      // The defensibility-critical four are always significant; others scale with risk.
      const critical = ["optionsConsidered", "whyAlternativesRejected", "reviewDate", "whatWouldChangeThisDecision"].includes(s.key);
      gaps.push({
        section: s.label,
        issue: `${s.label} is not recorded.`,
        severity: critical || highStakes ? "significant" : "moderate",
      });
    }
  }
  // Specific defensibility checks beyond mere presence.
  if (present(input.optionsConsidered) && (input.optionsConsidered?.filter(nonEmptyStr).length ?? 0) < 2) {
    gaps.push({ section: "Options considered", issue: "Only one option is recorded — a defensible decision weighs alternatives.", severity: "significant" });
  }

  // Score: mandatory points carry the weight; a couple of non-mandatory add polish.
  const mandatory = sections.filter((s) => s.mandatory);
  const mandatoryMet = mandatory.filter((s) => s.present).length;
  let score = Math.round((mandatoryMet / mandatory.length) * 100);
  // The "single option" weakness costs more than a simple missing field.
  if (gaps.some((g) => /Only one option/.test(g.issue))) score = Math.max(0, score - 10);
  score = Math.max(0, Math.min(100, score));

  const defensibility: DecisionDefensibility =
    score >= 90 ? "strong" : score >= 70 ? "adequate" : score >= 50 ? "needs_strengthening" : "weak";
  const confidence: Confidence = score >= 90 ? "high" : score >= 70 ? "medium" : "low";

  // Narrative — the assembled record (skips empty sections).
  const lines: string[] = [`Defensible decision: ${input.decisionSummary}${input.childName ? ` (for ${input.childName})` : ""}.`];
  let n = 1;
  for (const s of sections) {
    if (!s.present) {
      n++;
      continue;
    }
    const body = Array.isArray(s.content) ? s.content.filter(nonEmptyStr).join("; ") : s.content;
    lines.push(`${n}. ${s.label}: ${body}`);
    n++;
  }
  if (gaps.length) {
    lines.push("");
    lines.push(`To strengthen this record: ${gaps.map((g) => g.issue).join(" ")}`);
  }

  return {
    childName: input.childName,
    decisionSummary: input.decisionSummary,
    sections,
    gaps,
    defensibilityScore: score,
    defensibility,
    confidence,
    narrative: lines.join("\n"),
    disclaimer: DECISION_DISCLAIMER,
    engineVersion: DECISION_ENGINE_VERSION,
    generatedAt: today,
  };
}
