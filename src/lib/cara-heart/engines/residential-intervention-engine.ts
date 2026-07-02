// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — ResidentialInterventionEngine (pure / deterministic)
//
// Helps staff and managers understand the child's placement as a purposeful,
// planned residential childcare intervention — not simply accommodation or a
// "last resort". Frames daily life and every record within the therapeutic
// intention of the home.
//
// Inspired by residential childcare scholarship emphasising placement purpose,
// intentional care, and the home as a skilled relational intervention.
// ══════════════════════════════════════════════════════════════════════════════

import { matchedKeywords } from "@/lib/keyword-match";
import type {
  CaraPracticeRecord,
  ResidentialInterventionInsight,
  IntelligenceAuditEntry,
} from "../types";

const ENGINE = "ResidentialInterventionEngine";

const REACTIVE_CARE_INDICATORS = [
  "no reason",
  "kicked off",
  "played up",
  "for no reason",
  "bad behaviour",
  "refused again",
  "keeps doing this",
  "nothing worked",
  "not sure why",
  "we don't know",
];

const INTENTIONAL_CARE_INDICATORS = [
  "placement plan",
  "care plan",
  "known trigger",
  "therapeutic",
  "planned response",
  "strategy",
  "pattern",
  "attachment",
  "relationship",
  "trust",
  "regulation",
  "debrief",
  "key work",
  "co-regul",
  "co regul",
];

type ReactiveRisk = "low" | "medium" | "high";

function assessReactiveCareRisk(record: CaraPracticeRecord): ReactiveRisk {
  const lower = [record.description, record.staffResponse ?? ""].join(" ").toLowerCase();
  const reactiveHits = matchedKeywords(lower, REACTIVE_CARE_INDICATORS).length;
  const intentionalHits = matchedKeywords(lower, INTENTIONAL_CARE_INDICATORS).length;

  if (reactiveHits >= 3 && intentionalHits === 0) return "high";
  if (reactiveHits >= 2 || (reactiveHits >= 1 && intentionalHits === 0)) return "medium";
  return "low";
}

export interface ResidentialInterventionResult {
  insight: ResidentialInterventionInsight;
  audit: IntelligenceAuditEntry[];
}

export function runResidentialInterventionEngine(
  record: CaraPracticeRecord,
  now: string = new Date().toISOString(),
): ResidentialInterventionResult {
  const audit: IntelligenceAuditEntry[] = [];
  const riskLevel = assessReactiveCareRisk(record);

  audit.push({
    ruleId: "RI_REACTIVE_RISK",
    engine: ENGINE,
    triggered: riskLevel !== "low",
    reason: `Reactive care risk assessed as ${riskLevel}.`,
    severity: riskLevel === "high" ? "warning" : riskLevel === "medium" ? "prompt" : "info",
    timestamp: now,
  });

  // ── Intervention purpose prompts ──────────────────────────────────────────
  const staffPracticePrompts: string[] = [
    "Consider how this interaction connects to the overall purpose of this child's placement. What is the home uniquely trying to provide?",
    "Does this record reflect a planned therapeutic response, or a reactive response to the immediate moment?",
    "What does the child's placement plan say about situations like this? Was that guidance followed?",
    "What do we now know about this child's needs that we did not know before? Does the plan need to reflect this?",
  ];

  if (riskLevel === "high") {
    staffPracticePrompts.push(
      "This record may suggest the team is responding reactively rather than therapeutically. Consider a reflective team discussion about the child's needs and the home's planned response.",
    );
  }

  if (record.type === "incident" || record.type === "behaviour_record") {
    staffPracticePrompts.push(
      "Behind every challenging behaviour is a child with a history, unmet needs, and a story. What does this incident tell us about what this child needs from residential care?",
    );
  }

  // ── Daily life opportunities ──────────────────────────────────────────────
  const dailyLifeOpportunities: string[] = [
    "Ordinary daily moments — meals, bedtimes, journeys, conversations — are the primary therapeutic medium in residential care. Record what happened and what it showed about the child.",
    "Positive progress in small moments is as important as recording difficulties. What went well? What did the child allow or accept today?",
  ];

  if (record.type === "daily_log") {
    dailyLifeOpportunities.push(
      "This daily log is a window into the child's lived experience of the home. Does it show the home as a safe, relational, and purposeful space for this child?",
    );
  }

  // ── Manager reflection prompts ────────────────────────────────────────────
  const managerReflectionPrompts: string[] = [
    "Is the team clear about the purpose of this child's placement and their individual role in delivering it?",
    "Are staff responses to this child consistently planned and therapeutic, or are they becoming reactive?",
    "Does the home's daily life reflect intentional, therapeutic residential care — or does it feel like containment and crisis management?",
    "Is the rota supporting relational consistency for this child? Are their key workers reliably present?",
  ];

  if (riskLevel === "high") {
    managerReflectionPrompts.push(
      "There are signs that responses to this child may be becoming reactive. A reflective team discussion, case formulation, or external consultation may help the team move from reactive to intentional practice.",
    );
  }

  // ── Need patterns ─────────────────────────────────────────────────────────
  const currentNeedPattern: string[] = [];
  const lower = [record.description, record.staffResponse ?? ""].join(" ").toLowerCase();

  if (lower.includes("family") || lower.includes("contact") || lower.includes("mum") || lower.includes("dad"))
    currentNeedPattern.push("Connection with family and significant others");
  if (lower.includes("missing") || lower.includes("absent"))
    currentNeedPattern.push("Safety and stability — missing episodes suggest unmet need beyond the home");
  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("exhausted"))
    currentNeedPattern.push("Restorative rest and physical wellbeing");
  if (lower.includes("school") || lower.includes("education") || lower.includes("college") || lower.includes("lesson"))
    currentNeedPattern.push("Educational continuity and a sense of achievement");
  if (lower.includes("angry") || lower.includes("agitated") || lower.includes("dysregulat") || lower.includes("overwhelm"))
    currentNeedPattern.push("Emotional regulation and co-regulation support from adults");
  if (lower.includes("friend") || lower.includes("peer") || lower.includes("bully"))
    currentNeedPattern.push("Safe peer relationships and belonging");
  if (currentNeedPattern.length === 0)
    currentNeedPattern.push("Review the child's current needs in their care and placement plan");

  return {
    insight: {
      childId: record.childId,
      interventionPurpose:
        "This child's placement in residential care should reflect a purposeful, planned therapeutic intervention. Every daily record should connect to the home's understanding of what this child needs, and why residential care is the right environment to provide it.",
      currentNeedPattern,
      dailyLifeOpportunities,
      staffPracticePrompts,
      managerReflectionPrompts,
      riskOfReactiveCare: riskLevel,
      recommendedNextSteps:
        riskLevel === "high"
          ? [
              "Convene a reflective team meeting to review the child's plan and the team's response.",
              "Consider whether a case formulation or external consultation would help.",
              "Review whether the placement plan is current and whether staff have access to it.",
            ]
          : riskLevel === "medium"
            ? [
                "Discuss this record in the next team briefing and consider the child's need pattern.",
                "Review the placement plan to ensure it is current and accessible to all staff.",
              ]
            : [
                "Continue to build on intentional, plan-led practice.",
                "Record positive moments and evidence of therapeutic progress.",
              ],
    },
    audit,
  };
}
