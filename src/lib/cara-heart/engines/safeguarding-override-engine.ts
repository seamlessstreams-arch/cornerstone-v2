// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — SafeguardingOverrideEngine (pure / deterministic)
//
// Safety and statutory action ALWAYS override reflective prompts. This engine
// runs first in the orchestrator chain. When triggered it sets the Heart Card
// tone to "urgent" and prepends safeguarding actions to every output.
//
// Hard rule: this engine NEVER prevents practitioners from taking immediate
// action. Cara supports reflection AFTER immediate safety has been addressed.
// ══════════════════════════════════════════════════════════════════════════════

import type { CaraPracticeRecord, SafeguardingOverride, IntelligenceAuditEntry } from "../types";

const ENGINE = "SafeguardingOverrideEngine";

export const SAFEGUARDING_DISCLAIMER =
  "Cara supports professional reflection and recording. Staff and managers remain fully accountable for safeguarding decisions, statutory notifications, and any immediate protective action required. Reflective prompts are for use once immediate safety has been addressed.";

/** Immediate-trigger criteria — any one flag triggers an "immediate" override. */
const IMMEDIATE_FLAGS: Array<{
  ruleId: string;
  check: (r: CaraPracticeRecord) => boolean;
  reason: string;
  requiredAction: string;
}> = [
  {
    ruleId: "SG_WEAPON",
    check: (r) => !!r.weaponConcern,
    reason: "Weapon concern recorded.",
    requiredAction:
      "Ensure all individuals are safe. Follow emergency procedures. Contact police if required. Notify the manager and social worker immediately. Record factually.",
  },
  {
    ruleId: "SG_SEXUAL_HARM",
    check: (r) => !!r.sexualHarmConcern,
    reason: "Concern about sexual harm or exploitation recorded.",
    requiredAction:
      "Do not delay safeguarding action. Refer to the designated safeguarding lead. Consider LADO, social worker, and police involvement. Do not discuss the concern with the child in a way that may contaminate evidence.",
  },
  {
    ruleId: "SG_EXPLOITATION",
    check: (r) => !!r.exploitationConcern,
    reason: "Exploitation concern recorded.",
    requiredAction:
      "Notify the manager and social worker immediately. Consider NRM referral. Do not put the child at risk of further exploitation. Consider Regulation 40 notification.",
  },
  {
    ruleId: "SG_FIRE",
    check: (r) => !!r.fireSettingConcern,
    reason: "Fire-setting concern recorded.",
    requiredAction:
      "Ensure physical safety of all persons. Contact emergency services if required. Notify manager and social worker. Record factually and preserve evidence.",
  },
  {
    ruleId: "SG_CRITICAL_RISK",
    check: (r) => r.immediateRisk === "critical",
    reason: "Immediate risk recorded as critical.",
    requiredAction:
      "Take immediate protective action. Contact emergency services if required. Notify manager, social worker and placing authority. Consider Regulation 40 notification.",
  },
  {
    ruleId: "SG_STAFF_INJURY",
    check: (r) => !!r.staffInjury,
    reason: "Staff injury recorded.",
    requiredAction:
      "Ensure the injured staff member receives medical attention. Notify the manager immediately. Record the injury. Review the incident for prevention.",
  },
];

/** Same-day trigger criteria (serious but not requiring an emergency response right now). */
const SAME_DAY_FLAGS: Array<{
  ruleId: string;
  check: (r: CaraPracticeRecord) => boolean;
  reason: string;
  requiredAction: string;
}> = [
  {
    ruleId: "SG_SELF_HARM",
    check: (r) => !!r.selfHarmConcern,
    reason: "Self-harm concern recorded.",
    requiredAction:
      "Ensure the child's immediate safety. Seek medical advice if required. Notify the manager and social worker. Update the risk assessment. Record the child's voice where safe to do so.",
  },
  {
    ruleId: "SG_HIGH_RISK",
    check: (r) => r.immediateRisk === "high",
    reason: "Immediate risk recorded as high.",
    requiredAction:
      "Notify the manager on the same day. Review the risk assessment. Consider whether a Regulation 40 notification is required. Ensure follow-up is recorded.",
  },
  {
    ruleId: "SG_STATUTORY_NOTIFICATION",
    check: (r) => !!r.statutoryNotificationRequired && !r.statutoryNotificationCompleted,
    reason: "Statutory notification identified but not yet completed.",
    requiredAction:
      "Complete the statutory notification without further delay. Record who made the notification, to whom, at what time, and the response received.",
  },
  {
    ruleId: "SG_MISSING_HIGH_RISK",
    check: (r) =>
      !!r.missingFromCare &&
      (r.immediateRisk === "high" || r.immediateRisk === "critical"),
    reason: "Missing from care episode recorded with high or critical risk.",
    requiredAction:
      "Ensure a police referral has been made. Notify the social worker and placing authority immediately. Carry out a return home interview. Update the missing from care plan.",
  },
];

export interface SafeguardingOverrideResult {
  override: SafeguardingOverride;
  audit: IntelligenceAuditEntry[];
}

export function runSafeguardingOverride(
  record: CaraPracticeRecord,
  now: string = new Date().toISOString(),
): SafeguardingOverrideResult {
  const audit: IntelligenceAuditEntry[] = [];
  const reasons: string[] = [];
  const actions: string[] = [];
  let urgency: "standard" | "same_day" | "immediate" = "standard";

  for (const flag of IMMEDIATE_FLAGS) {
    if (flag.check(record)) {
      reasons.push(flag.reason);
      actions.push(flag.requiredAction);
      urgency = "immediate";
      audit.push({
        ruleId: flag.ruleId,
        engine: ENGINE,
        triggered: true,
        reason: flag.reason,
        severity: "urgent",
        timestamp: now,
      });
    } else {
      audit.push({
        ruleId: flag.ruleId,
        engine: ENGINE,
        triggered: false,
        reason: `${flag.ruleId} not triggered.`,
        severity: "info",
        timestamp: now,
      });
    }
  }

  if (urgency !== "immediate") {
    for (const flag of SAME_DAY_FLAGS) {
      if (flag.check(record)) {
        reasons.push(flag.reason);
        actions.push(flag.requiredAction);
        if (urgency === "standard") urgency = "same_day";
        audit.push({
          ruleId: flag.ruleId,
          engine: ENGINE,
          triggered: true,
          reason: flag.reason,
          severity: "urgent",
          timestamp: now,
        });
      } else {
        audit.push({
          ruleId: flag.ruleId,
          engine: ENGINE,
          triggered: false,
          reason: `${flag.ruleId} not triggered.`,
          severity: "info",
          timestamp: now,
        });
      }
    }
  }

  return {
    override: {
      triggered: reasons.length > 0,
      reason: reasons,
      requiredAction: actions,
      urgency,
    },
    audit,
  };
}
