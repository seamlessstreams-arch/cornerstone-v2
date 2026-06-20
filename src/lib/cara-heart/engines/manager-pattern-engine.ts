// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — ManagerPatternOversightEngine (pure / deterministic)
//
// Analyses a single CaraPracticeRecord for manager-level pattern signals.
// Each returned insight prompts the manager to review the record in the
// context of the child's recent history — never as an isolated event.
//
// Pattern types detected from a single record:
//   - incident_frequency   — incident or behaviour record
//   - police_contact       — police called
//   - missing_episode      — missing from care
//   - staff_stress         — high-severity without debrief
//   - recording_quality    — significant record without repair or manager oversight
//
// Production use: pass historical records to enrich the evidence arrays.
// This single-record version establishes the signal — managers review in full.
//
// Cara advises. Managers decide. Professionals remain accountable.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  CaraPracticeRecord,
  ManagerPatternInsight,
  IntelligenceAuditEntry,
} from "../types";

const ENGINE = "ManagerPatternOversightEngine";

export interface ManagerPatternEngineResult {
  insights: ManagerPatternInsight[];
  audit: IntelligenceAuditEntry[];
}

export function runManagerPatternEngine(
  record: CaraPracticeRecord,
  now: string = new Date().toISOString(),
): ManagerPatternEngineResult {
  const insights: ManagerPatternInsight[] = [];
  const audit: IntelligenceAuditEntry[] = [];
  const today = now.slice(0, 10);

  // ── Incident / behaviour frequency ───────────────────────────────────────
  if (record.type === "incident" || record.type === "behaviour_record") {
    const riskLevel =
      (record.severity ?? 1) >= 4
        ? "high"
        : (record.severity ?? 1) >= 3
          ? "medium"
          : "low";

    audit.push({
      ruleId: "MPO_INCIDENT_FREQUENCY",
      engine: ENGINE,
      triggered: true,
      reason: "Incident or behaviour record detected — reviewing pattern context.",
      severity: riskLevel === "high" ? "warning" : "prompt",
      timestamp: now,
    });

    insights.push({
      patternType: "incident_frequency",
      childId: record.childId,
      dateRange: { from: today, to: today },
      evidence: ["Single incident recorded — review in context of the child's recent history"],
      riskLevel,
      recommendedManagerActions: [
        "Review this incident alongside the child's recent record to identify any patterns.",
        "Consider whether the care plan or behaviour support plan needs to be updated.",
      ],
      supervisionPrompts: [
        "Is this child's presentation changing over time? In what direction?",
        "Are staff responses to this child consistent and plan-led?",
      ],
      planReviewNeeded: (record.severity ?? 1) >= 4,
    });
  }

  // ── Police contact ────────────────────────────────────────────────────────
  if (record.policeCalled) {
    audit.push({
      ruleId: "MPO_POLICE_CONTACT",
      engine: ENGINE,
      triggered: true,
      reason: "Police contact recorded — manager oversight of criminalisation risk required.",
      severity: "warning",
      timestamp: now,
    });

    insights.push({
      patternType: "police_contact",
      childId: record.childId,
      dateRange: { from: today, to: today },
      evidence: ["Police contact recorded — review frequency and context across recent history"],
      riskLevel: "medium",
      recommendedManagerActions: [
        "Review all recent police contacts to understand whether a pattern is developing.",
        "Consider whether an anti-criminalisation strategy needs to be embedded in the placement plan.",
      ],
      supervisionPrompts: [
        "Is police involvement becoming normalised for this child?",
        "Is the team using the minimum necessary response to keep everyone safe?",
      ],
      planReviewNeeded: true,
    });
  }

  // ── Missing from care ─────────────────────────────────────────────────────
  if (record.missingFromCare) {
    const riskLevel =
      record.immediateRisk === "high" || record.immediateRisk === "critical"
        ? "high"
        : "medium";

    audit.push({
      ruleId: "MPO_MISSING_EPISODE",
      engine: ENGINE,
      triggered: true,
      reason: "Missing from care episode recorded — manager pattern review required.",
      severity: riskLevel === "high" ? "urgent" : "warning",
      timestamp: now,
    });

    insights.push({
      patternType: "missing_episode",
      childId: record.childId,
      dateRange: { from: today, to: today },
      evidence: [
        "Missing from care episode recorded — review frequency, timing, triggers and return circumstances across recent history",
      ],
      riskLevel,
      recommendedManagerActions: [
        "Review all recent missing episodes to identify patterns in timing, triggers, and protective factors.",
        "Ensure the missing from care plan is current, risk-rated, and known to all staff.",
      ],
      supervisionPrompts: [
        "What is driving this child's missing episodes?",
        "Is this home a place the child feels safe to return to?",
      ],
      planReviewNeeded: true,
    });
  }

  // ── Staff stress / debrief gap ────────────────────────────────────────────
  if (!record.staffDebriefRecorded && (record.severity ?? 1) >= 3) {
    audit.push({
      ruleId: "MPO_STAFF_STRESS",
      engine: ENGINE,
      triggered: true,
      reason: "High-severity record without staff debrief — staff wellbeing risk indicator.",
      severity: "prompt",
      timestamp: now,
    });

    insights.push({
      patternType: "staff_stress",
      childId: record.childId,
      staffIds: record.staffIds,
      dateRange: { from: today, to: today },
      evidence: ["High-severity record without staff debrief recorded"],
      riskLevel: "low",
      recommendedManagerActions: [
        "Review whether staff debriefs are being completed consistently after high-intensity incidents.",
        "Consider whether the team needs a reflective discussion about this child's current presentation.",
      ],
      supervisionPrompts: [
        "Are staff receiving adequate support and debriefing after difficult incidents?",
        "Is compassion fatigue or burnout risk visible in the team?",
      ],
      planReviewNeeded: false,
    });
  }

  // ── Recording quality gap ─────────────────────────────────────────────────
  if (
    (record.severity ?? 1) >= 3 &&
    !record.repairRecorded &&
    !record.managerConsulted
  ) {
    audit.push({
      ruleId: "MPO_RECORDING_QUALITY",
      engine: ENGINE,
      triggered: true,
      reason:
        "Significant record submitted without repair or manager oversight noted.",
      severity: "prompt",
      timestamp: now,
    });

    insights.push({
      patternType: "recording_quality",
      childId: record.childId,
      dateRange: { from: today, to: today },
      evidence: ["Significant record without repair or manager oversight noted"],
      riskLevel: "low",
      recommendedManagerActions: [
        "Review whether significant records are being completed to the required standard.",
        "Ensure staff understand the recording expectations for this type of event.",
      ],
      supervisionPrompts: [
        "Is recording quality consistent across the team after significant events?",
        "Are staff clear about what must be included in a significant record?",
      ],
      planReviewNeeded: false,
    });
  }

  // ── No patterns triggered ─────────────────────────────────────────────────
  if (insights.length === 0) {
    audit.push({
      ruleId: "MPO_NO_PATTERNS",
      engine: ENGINE,
      triggered: false,
      reason: "No pattern indicators detected for this record.",
      severity: "info",
      timestamp: now,
    });
  }

  return { insights, audit };
}
