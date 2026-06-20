// ══════════════════════════════════════════════════════════════════════════════
// CARA HEART — Prompt Library
//
// Canonical prompt fragments for the Cara Heart residential practice
// intelligence engine suite. Exported as typed constants so engines, UI
// components and tests all reference the same authoritative text.
//
// British English throughout. "Cara" only — never "Kara".
// ══════════════════════════════════════════════════════════════════════════════

// ── Child-centred recording ───────────────────────────────────────────────────

export const PROMPT_CHILD_CENTRED_RECORDING =
  "Write about the child as a child first, not as a behaviour. Describe what happened factually, what adults noticed, what adults did to help, what the child communicated, and what follow-up is needed. Avoid blame-based language.";

export const PROMPT_CHILD_VOICE_MISSING =
  "The child's voice is not yet visible in this record. Add what the child said, how they presented, whether they declined to speak, or when this will be revisited.";

export const PROMPT_RECORDING_QUALITY =
  "Before rewriting, add what happened before the incident, what staff did to reduce pressure, what the child may have been communicating, whether the child's view was sought, and what follow-up is planned.";

// ── Anti-criminalisation ──────────────────────────────────────────────────────

export const PROMPT_ANTI_CRIMINALISATION =
  "Before criminal justice involvement is recorded, consider immediate safety, seriousness, proportionality, restorative options, manager consultation, social worker notification, and whether the response would be different if the child lived in a family home.";

export const PROMPT_POLICE_CONTACT_RATIONALE =
  "Police contact was recorded. To support defensible anti-criminalisation practice, add the immediate risk, rationale, alternatives considered, manager consultation, and why police involvement was necessary.";

export const PROMPT_POLICE_CONSIDERED_NOT_CALLED =
  "Police contact was considered but not made. Record the rationale, how safety was managed, and what alternative or restorative response was used.";

// ── Repair and restoration ────────────────────────────────────────────────────

export const PROMPT_REPAIR =
  "After conflict, consider what needs repairing: the relationship, the child's dignity, the physical environment, peer relationships, staff confidence, or the child's trust in adults.";

export const PROMPT_REPAIR_MISSING =
  "Repair is not yet recorded. Add whether a restorative conversation happened, or when one will be attempted.";

// ── Staff support and wellbeing ───────────────────────────────────────────────

export const PROMPT_STAFF_SUPPORT =
  "Consider the emotional impact on staff. Has the worker had space to debrief, reflect, recover and understand what happened before returning to similar situations?";

export const PROMPT_STAFF_DEBRIEF_MISSING =
  "This was a high-intensity record. Consider whether staff have had an opportunity to debrief, reflect, and receive support before their next shift.";

// ── Manager oversight and pattern recognition ─────────────────────────────────

export const PROMPT_MANAGER_OVERSIGHT =
  "Look beyond this single incident. Is there a pattern linked to time of day, routine, staff combination, family contact, education, health, sensory overload, missing episodes or unmet need?";

export const PROMPT_MANAGER_OVERSIGHT_NEEDED =
  "This record suggests manager oversight is needed. Ensure the manager has been consulted and that their response is recorded.";

// ── Rights, dignity and daily life ───────────────────────────────────────────

export const PROMPT_RIGHTS_AND_VOICE =
  "Consider whether the child's view, communication needs, dignity, privacy, advocacy rights and right to understand decisions are visible in this record.";

export const PROMPT_DAILY_LIFE_INTERVENTION =
  "Consider how this ordinary moment may be part of the child's therapeutic experience of the home. What did the child learn about adults, safety, routine, repair, belonging or trust?";

// ── Professional accountability ───────────────────────────────────────────────

export const PROMPT_PROFESSIONAL_ACCOUNTABILITY =
  "Cara supports professional reflection and decision-making. Staff and managers remain accountable for safeguarding, statutory notifications and professional judgement.";

// ── Grouped export ────────────────────────────────────────────────────────────

export const PROMPTS = {
  childCentredRecording: PROMPT_CHILD_CENTRED_RECORDING,
  childVoiceMissing: PROMPT_CHILD_VOICE_MISSING,
  recordingQuality: PROMPT_RECORDING_QUALITY,
  antiCriminalisation: PROMPT_ANTI_CRIMINALISATION,
  policeContactRationale: PROMPT_POLICE_CONTACT_RATIONALE,
  policeConsideredNotCalled: PROMPT_POLICE_CONSIDERED_NOT_CALLED,
  repair: PROMPT_REPAIR,
  repairMissing: PROMPT_REPAIR_MISSING,
  staffSupport: PROMPT_STAFF_SUPPORT,
  staffDebriefMissing: PROMPT_STAFF_DEBRIEF_MISSING,
  managerOversight: PROMPT_MANAGER_OVERSIGHT,
  managerOversightNeeded: PROMPT_MANAGER_OVERSIGHT_NEEDED,
  rightsAndVoice: PROMPT_RIGHTS_AND_VOICE,
  dailyLifeIntervention: PROMPT_DAILY_LIFE_INTERVENTION,
  professionalAccountability: PROMPT_PROFESSIONAL_ACCOUNTABILITY,
} as const;

export type PromptKey = keyof typeof PROMPTS;
