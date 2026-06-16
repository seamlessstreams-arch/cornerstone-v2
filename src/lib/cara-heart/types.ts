// ══════════════════════════════════════════════════════════════════════════════
// CARA — CARA HEART & RESIDENTIAL PRACTICE INTELLIGENCE ENGINE · types
//
// Unified type definitions for the master practice intelligence orchestrator.
// Design principle: deterministic-first, human-accountable, child-centred.
// Cara advises. Professionals decide. Managers oversee. Systems audit.
// ══════════════════════════════════════════════════════════════════════════════

export type CaraPracticeRecordType =
  | "daily_log"
  | "incident"
  | "missing_episode"
  | "physical_intervention"
  | "police_contact"
  | "behaviour_record"
  | "key_work"
  | "family_contact"
  | "education"
  | "health"
  | "medication"
  | "restorative_conversation"
  | "staff_debrief"
  | "manager_review"
  | "other";

export type ImmediateRisk = "none" | "low" | "medium" | "high" | "critical";
export type RecordSeverity = 1 | 2 | 3 | 4 | 5;
export type IntelligenceMode = "deterministic_only" | "hybrid" | "llm_required";
export type AuditSeverity = "info" | "prompt" | "warning" | "urgent";
export type HeartTone = "supportive" | "urgent" | "reflective" | "managerial";
export type StaffSupportNeed =
  | "none"
  | "informal_check_in"
  | "formal_debrief"
  | "supervision"
  | "manager_review"
  | "clinical_consultation"
  | "workforce_risk_review";

// ── Input record ──────────────────────────────────────────────────────────────

export interface CaraPracticeRecord {
  id: string;
  childId: string;
  staffIds?: string[];
  homeId?: string;
  type: CaraPracticeRecordType;
  dateTime: string;
  severity?: RecordSeverity;
  description: string;
  staffResponse?: string;
  childVoice?: string;
  childPresentation?: string;
  knownTriggers?: string[];
  immediateRisk?: ImmediateRisk;
  policeCalled?: boolean;
  policeConsidered?: boolean;
  restraintUsed?: boolean;
  missingFromCare?: boolean;
  weaponConcern?: boolean;
  exploitationConcern?: boolean;
  sexualHarmConcern?: boolean;
  selfHarmConcern?: boolean;
  fireSettingConcern?: boolean;
  staffInjury?: boolean;
  propertyDamage?: boolean;
  repairRecorded?: boolean;
  staffDebriefRecorded?: boolean;
  managerConsulted?: boolean;
  socialWorkerNotified?: boolean;
  safeguardingActionTaken?: boolean;
  statutoryNotificationRequired?: boolean;
  statutoryNotificationCompleted?: boolean;
  linkedPlanIds?: string[];
  metadata?: Record<string, unknown>;
}

// ── Audit trail ───────────────────────────────────────────────────────────────

export interface IntelligenceAuditEntry {
  ruleId: string;
  engine: string;
  triggered: boolean;
  reason: string;
  severity: AuditSeverity;
  timestamp: string;
}

// ── Cara Heart Card (the unified output surface) ──────────────────────────────

export interface CaraHeartCard {
  title: string;
  tone: HeartTone;
  summary: string;
  prompts: string[];
  missingInformation: string[];
  suggestedActions: string[];
  escalationRequired: boolean;
  professionalReminder: string;
}

// ── Heart check (rubric scores) ───────────────────────────────────────────────

export interface CaraHeartCheck {
  childDignityProtected: boolean;
  childVoiceIncluded: boolean;
  adultReflectionIncluded: boolean;
  traumaContextConsidered: boolean;
  relationalRepairConsidered: boolean;
  rightsConsidered: boolean;
  antiCriminalisationConsidered: boolean;
  proportionalityConsidered: boolean;
  staffSupportConsidered: boolean;
  managerOversightNeeded: boolean;
  safeguardingEscalationNeeded: boolean;
  missingInformation: string[];
  suggestedPrompts: string[];
}

// ── Safeguarding override ─────────────────────────────────────────────────────

export interface SafeguardingOverride {
  triggered: boolean;
  reason: string[];
  requiredAction: string[];
  urgency: "standard" | "same_day" | "immediate";
}

// ── Residential intervention ──────────────────────────────────────────────────

export interface ResidentialInterventionInsight {
  childId: string;
  interventionPurpose: string;
  currentNeedPattern: string[];
  dailyLifeOpportunities: string[];
  staffPracticePrompts: string[];
  managerReflectionPrompts: string[];
  riskOfReactiveCare: "low" | "medium" | "high";
  recommendedNextSteps: string[];
}

// ── Life space moments ────────────────────────────────────────────────────────

export type LifeSpaceContext =
  | "morning_routine"
  | "bedtime"
  | "meal_time"
  | "education_transition"
  | "family_contact"
  | "missing_return"
  | "health"
  | "hygiene"
  | "activity"
  | "boundary"
  | "conflict"
  | "repair"
  | "informal_conversation"
  | "other";

export type PracticeValue =
  | "trust_building"
  | "co_regulation"
  | "identity"
  | "belonging"
  | "repair"
  | "routine"
  | "emotional_literacy"
  | "rights"
  | "safety"
  | "independence";

export interface LifeSpaceMoment {
  id: string;
  childId: string;
  dateTime: string;
  context: LifeSpaceContext;
  observedBehaviour: string;
  possibleMeaning: string[];
  relationalOpportunity: string[];
  practiceValue: PracticeValue;
  recordingPrompt: string;
}

// ── Anti-criminalisation / police decision support ────────────────────────────

export interface PoliceDecisionSupport {
  immediateRiskLevel: ImmediateRisk;
  policeContactRecommended: boolean;
  policeContactReason?: string;
  alternativesConsidered: string[];
  restorativeOptions: string[];
  managerConsultationRequired: boolean;
  socialWorkerNotificationRequired: boolean;
  recordRationaleRequired: boolean;
  antiCriminalisationWarning?: string;
  safeguardingOverride?: string;
}

// ── Social pedagogy (Head / Heart / Hands) ────────────────────────────────────

export interface SocialPedagogyReflection {
  head: {
    whatDoWeKnow: string[];
    theoryOrPlanLinks: string[];
    patterns: string[];
  };
  heart: {
    whatMightTheChildFeel: string[];
    whatMightTheAdultFeel: string[];
    relationshipImpact: string[];
  };
  hands: {
    practicalActionsTaken: string[];
    nextPracticalSteps: string[];
    repairActions: string[];
  };
  rightsAndEthics: {
    childRightsConsidered: string[];
    dignityIssues: string[];
    powerImbalanceConsidered: boolean;
    fairnessConsidered: boolean;
  };
}

// ── Care for carers ───────────────────────────────────────────────────────────

export interface StaffSupportSignal {
  staffId?: string;
  teamId?: string;
  childId?: string;
  incidentIds: string[];
  stressIndicators: string[];
  supportNeed: StaffSupportNeed;
  recommendedAction: string[];
  urgency: "low" | "medium" | "high";
}

// ── Restorative repair ────────────────────────────────────────────────────────

export type RuptureType =
  | "staff_child_conflict"
  | "peer_conflict"
  | "property_damage"
  | "restraint"
  | "police_contact"
  | "missing_episode"
  | "boundary_conflict"
  | "family_contact"
  | "other";

export interface RepairPlan {
  ruptureType: RuptureType;
  childReadyForConversation: boolean;
  adultReadyForConversation: boolean;
  suggestedTiming:
    | "immediate"
    | "after_regulation"
    | "within_24_hours"
    | "planned_keywork"
    | "manager_led";
  repairQuestions: string[];
  practicalRepairOptions: string[];
  emotionalRepairOptions: string[];
  recordingPrompts: string[];
}

// ── Child voice & rights ──────────────────────────────────────────────────────

export interface ChildVoiceRightsReview {
  childVoicePresent: boolean;
  childVoiceSummary?: string;
  reasonVoiceNotCaptured?: string;
  communicationNeedsConsidered: boolean;
  rightsConsidered: string[];
  advocacyNeeded: boolean;
  dignityConcern: boolean;
  suggestedFollowUp: string[];
}

// ── Recording quality ─────────────────────────────────────────────────────────

export interface FlaggedLanguageItem {
  phrase: string;
  concern: string;
  reflectivePrompt: string;
  alternativeLanguageSuggestion: string;
}

export interface RecordingQualityReview {
  factualClarityScore: number;
  childCentredLanguageScore: number;
  analysisScore: number;
  staffActionScore: number;
  childVoiceScore: number;
  followUpScore: number;
  riskClarityScore: number;
  flaggedLanguage: FlaggedLanguageItem[];
  missingElements: string[];
  suggestedRewritePrompts: string[];
}

// ── Manager pattern insights ──────────────────────────────────────────────────

export type PatternInsightType =
  | "incident_frequency"
  | "missing_episode"
  | "police_contact"
  | "restraint"
  | "staff_stress"
  | "recording_quality"
  | "child_voice_gap"
  | "routine_trigger"
  | "relationship_pattern"
  | "education_transition"
  | "family_contact"
  | "health"
  | "other";

export interface ManagerPatternInsight {
  patternType: PatternInsightType;
  childId?: string;
  staffIds?: string[];
  dateRange?: { from: string; to: string };
  evidence: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedManagerActions: string[];
  supervisionPrompts: string[];
  planReviewNeeded: boolean;
}

// ── Master output ─────────────────────────────────────────────────────────────

export interface CaraPracticeIntelligenceOutput {
  recordId: string;
  childId: string;
  heartCard: CaraHeartCard;
  heartCheck: CaraHeartCheck;
  safeguardingOverride: SafeguardingOverride;
  residentialInterventionInsight?: ResidentialInterventionInsight;
  lifeSpaceMoments?: LifeSpaceMoment[];
  antiCriminalisationReview?: PoliceDecisionSupport;
  socialPedagogyReflection?: SocialPedagogyReflection;
  staffSupportSignals?: StaffSupportSignal[];
  repairPlan?: RepairPlan;
  childVoiceRightsReview?: ChildVoiceRightsReview;
  recordingQualityReview?: RecordingQualityReview;
  managerPatternInsights?: ManagerPatternInsight[];
  deterministicPrompts: string[];
  llmRequired: boolean;
  llmReason?: string;
  mode: IntelligenceMode;
  auditTrail: IntelligenceAuditEntry[];
}
