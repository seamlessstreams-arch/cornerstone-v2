// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — CareForCarersEngine (pure / deterministic)
//
// Detects staff pressure, emotional labour, burnout risk, and the need for
// debrief or supervision. Protects staff so that staff can protect children.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  CaraPracticeRecord,
  StaffSupportSignal,
  StaffSupportNeed,
  IntelligenceAuditEntry,
} from "../types";

const ENGINE = "CareForCarersEngine";

function deriveSupportNeed(severity: number, stressCount: number): StaffSupportNeed {
  if (severity >= 5 || stressCount >= 3) return "formal_debrief";
  if (severity >= 4 || stressCount >= 2) return "formal_debrief";
  if (severity >= 3 || stressCount >= 1) return "informal_check_in";
  return "none";
}

function deriveUrgency(severity: number): "low" | "medium" | "high" {
  if (severity >= 5) return "high";
  if (severity >= 4) return "medium";
  return "low";
}

export interface CareForCarersResult {
  signals: StaffSupportSignal[];
  audit: IntelligenceAuditEntry[];
}

export function runCareForCarersEngine(
  record: CaraPracticeRecord,
  now: string = new Date().toISOString(),
): CareForCarersResult {
  const audit: IntelligenceAuditEntry[] = [];
  const severity = record.severity ?? 1;
  const stressIndicators: string[] = [];

  // ── Stress indicator detection ────────────────────────────────────────────
  if (record.restraintUsed) stressIndicators.push("Physical intervention used");
  if (record.staffInjury) stressIndicators.push("Staff injury recorded");
  if (record.policeCalled) stressIndicators.push("Police contact recorded");
  if (severity >= 4) stressIndicators.push(`High-intensity record (severity ${severity})`);
  if (record.type === "physical_intervention") stressIndicators.push("Physical intervention record type");
  if (record.missingFromCare) stressIndicators.push("Missing from care episode — staff may carry worry");
  if (!record.staffDebriefRecorded && severity >= 3)
    stressIndicators.push("No debrief recorded after a significant incident");

  const hasSignificantStress = stressIndicators.length > 0;

  audit.push({
    ruleId: "CC_STRESS_INDICATORS",
    engine: ENGINE,
    triggered: hasSignificantStress,
    reason: hasSignificantStress
      ? `${stressIndicators.length} staff stress indicator(s) detected: ${stressIndicators.join("; ")}`
      : "No staff stress indicators detected.",
    severity: hasSignificantStress ? "warning" : "info",
    timestamp: now,
  });

  if (!hasSignificantStress) {
    return { signals: [], audit };
  }

  // ── Build support signal ──────────────────────────────────────────────────
  const supportNeed = deriveSupportNeed(severity, stressIndicators.length);
  const urgency = deriveUrgency(severity);

  const recommendedAction: string[] = [];

  if (supportNeed === "formal_debrief" || supportNeed === "supervision") {
    recommendedAction.push(
      "Offer a formal debrief to staff involved in this record before their next shift with this child.",
    );
  } else if (supportNeed === "informal_check_in") {
    recommendedAction.push(
      "Offer an informal check-in to the staff member to acknowledge the impact of the situation and ensure they are supported.",
    );
  }

  if (record.staffInjury) {
    recommendedAction.push(
      "Ensure the injured staff member has received or been offered medical attention. Record the injury formally.",
    );
  }

  if (!record.staffDebriefRecorded && severity >= 3) {
    recommendedAction.push(
      "A staff debrief has not been recorded. Consider whether this should happen before the staff member's next shift.",
    );
  }

  recommendedAction.push(
    "Check in with the staff team more broadly: high-intensity incidents affect the whole team, even those not directly involved.",
  );
  recommendedAction.push(
    "The home can only care well for children when it cares well for its staff. Make staff wellbeing an explicit management priority.",
  );

  const managerPrompts = [
    "Has every worker involved in this incident had an opportunity to debrief and reflect?",
    "Is this worker being repeatedly exposed to high-intensity interactions? Review their recent record and rota.",
    "Is the team becoming reactive rather than therapeutic? Consider whether a reflective team space is needed.",
    "Are workers emotionally available, or are they moving towards compassion fatigue or survival mode?",
    "Is the rota supporting relational consistency and reasonable rest for workers?",
  ];

  recommendedAction.push(...managerPrompts);

  audit.push({
    ruleId: "CC_SUPPORT_NEED",
    engine: ENGINE,
    triggered: true,
    reason: `Staff support need identified as '${supportNeed}' (urgency: ${urgency}).`,
    severity: urgency === "high" ? "urgent" : urgency === "medium" ? "warning" : "prompt",
    timestamp: now,
  });

  const signal: StaffSupportSignal = {
    staffId: record.staffIds?.[0],
    childId: record.childId,
    incidentIds: [record.id],
    stressIndicators,
    supportNeed,
    recommendedAction,
    urgency,
  };

  return { signals: [signal], audit };
}
