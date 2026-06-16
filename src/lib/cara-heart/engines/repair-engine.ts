// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — RestorativeRepairEngine (pure / deterministic)
//
// Supports repair after conflict, restraint, missing episodes, damage,
// police involvement, or any relational rupture. Generates repair plans that
// are child-led, relational, and appropriate to the severity of the rupture.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  CaraPracticeRecord,
  RepairPlan,
  RuptureType,
  IntelligenceAuditEntry,
} from "../types";

const ENGINE = "RestorativeRepairEngine";

const REPAIR_TYPES: Set<string> = new Set([
  "incident",
  "physical_intervention",
  "police_contact",
  "behaviour_record",
  "missing_episode",
]);

function deriveRuptureType(record: CaraPracticeRecord): RuptureType {
  if (record.restraintUsed || record.type === "physical_intervention") return "restraint";
  if (record.policeCalled || record.type === "police_contact") return "police_contact";
  if (record.missingFromCare || record.type === "missing_episode") return "missing_episode";
  if (record.propertyDamage) return "property_damage";
  if (record.type === "family_contact") return "family_contact";
  if (record.type === "incident") return "staff_child_conflict";
  if (record.type === "behaviour_record") return "staff_child_conflict";
  return "other";
}

function deriveTiming(record: CaraPracticeRecord): RepairPlan["suggestedTiming"] {
  const severity = record.severity ?? 1;
  if (severity >= 5 || record.restraintUsed) return "manager_led";
  if (severity >= 4 || record.policeCalled) return "within_24_hours";
  if (severity >= 3) return "after_regulation";
  return "after_regulation";
}

const CORE_REPAIR_QUESTIONS = [
  "What happened from your point of view?",
  "What were you feeling before it happened?",
  "What did adults do that helped?",
  "What did adults do that made things harder?",
  "What do you need now?",
  "Is there anything we need to put right?",
  "What can we do differently next time?",
  "How can we help you feel safe without making you feel controlled?",
];

function buildPracticalRepairOptions(ruptureType: RuptureType): string[] {
  const options: string[] = [
    "A calm, private conversation with the child's key worker or a trusted adult in the home",
    "An opportunity for the child to share their view of what happened without fear of further consequences",
  ];

  if (ruptureType === "property_damage") {
    options.push("Practical involvement of the child in repairing or replacing what was damaged, where safe and appropriate");
    options.push("An acknowledgement that the environment is back to normal and that the incident is not being held against the child");
  }

  if (ruptureType === "police_contact") {
    options.push("An opportunity for the child to talk about how the police involvement felt for them");
    options.push("Ensure the child understands what happened and why, in age-appropriate language");
  }

  if (ruptureType === "missing_episode") {
    options.push("A return home interview conducted by a trusted adult, without judgement or lecture");
    options.push("An exploration of what the child needed that led to the missing episode");
  }

  if (ruptureType === "restraint") {
    options.push("A physical intervention review conversation to understand the child's experience of the restraint");
    options.push("An acknowledgement from staff that restraint is difficult for everyone involved");
  }

  return options;
}

function buildEmotionalRepairOptions(ruptureType: RuptureType, record: CaraPracticeRecord): string[] {
  return [
    "Acknowledge the child's experience without minimising it or justifying what happened",
    "Express genuine care for the child's wellbeing after the incident",
    "Offer a normal, warm interaction that signals the relationship is intact",
    ruptureType === "restraint"
      ? "Acknowledge that the restraint was difficult and that you care about the child's dignity"
      : "Let the child know that what happened does not change your view of them or how you care for them",
    !record.childVoice
      ? "Create a space where the child can share their perspective when they are ready, without pressure"
      : "Build on the child's voice already recorded — validate what they shared and show how it will be acted on",
  ];
}

function buildRecordingPrompts(ruptureType: RuptureType): string[] {
  return [
    "Record what the repair conversation covered, who was involved, and when it took place",
    "Record the child's response to the repair conversation",
    "Record any agreed actions that came from the repair conversation",
    "Record whether the relational rupture appears to have been resolved, and what follow-up is needed",
    ruptureType === "restraint"
      ? "The physical intervention review record should include the child's view of the restraint"
      : "Update the care and placement plan if the repair conversation revealed new information about the child's needs",
  ];
}

// ── Main engine function ──────────────────────────────────────────────────────

export interface RepairEngineResult {
  plan: RepairPlan | null;
  audit: IntelligenceAuditEntry[];
}

export function runRepairEngine(
  record: CaraPracticeRecord,
  now: string = new Date().toISOString(),
): RepairEngineResult {
  const audit: IntelligenceAuditEntry[] = [];

  const needsRepair = REPAIR_TYPES.has(record.type) || !!record.restraintUsed || !!record.policeCalled;

  audit.push({
    ruleId: "RR_REPAIR_NEEDED",
    engine: ENGINE,
    triggered: needsRepair,
    reason: needsRepair
      ? "This record type indicates a relational rupture that may need restorative repair."
      : "This record type does not typically require a formal repair plan.",
    severity: needsRepair && !record.repairRecorded ? "prompt" : "info",
    timestamp: now,
  });

  if (!needsRepair) return { plan: null, audit };

  const ruptureType = deriveRuptureType(record);
  const timing = deriveTiming(record);

  if (record.repairRecorded) {
    audit.push({
      ruleId: "RR_REPAIR_RECORDED",
      engine: ENGINE,
      triggered: false,
      reason: "A repair has already been recorded for this record.",
      severity: "info",
      timestamp: now,
    });
  } else {
    audit.push({
      ruleId: "RR_REPAIR_NOT_RECORDED",
      engine: ENGINE,
      triggered: true,
      reason: "Repair has not yet been recorded. A repair plan has been generated.",
      severity: "prompt",
      timestamp: now,
    });
  }

  const plan: RepairPlan = {
    ruptureType,
    childReadyForConversation: record.immediateRisk === "none" || record.immediateRisk === "low",
    adultReadyForConversation: !record.staffInjury,
    suggestedTiming: timing,
    repairQuestions: CORE_REPAIR_QUESTIONS,
    practicalRepairOptions: buildPracticalRepairOptions(ruptureType),
    emotionalRepairOptions: buildEmotionalRepairOptions(ruptureType, record),
    recordingPrompts: buildRecordingPrompts(ruptureType),
  };

  return { plan, audit };
}
