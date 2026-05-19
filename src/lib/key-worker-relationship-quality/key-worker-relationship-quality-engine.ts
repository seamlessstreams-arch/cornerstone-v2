// Key Worker Relationship Quality Intelligence Engine
// Pure deterministic — no AI, no external calls, no randomness, no Date.now()

// ── Type unions ──────────────────────────────────────────────────────────────

export type SessionType =
  | "one_to_one"
  | "care_planning"
  | "emotional_support"
  | "advocacy"
  | "goal_setting"
  | "review_preparation"
  | "crisis_support"
  | "recreational";

export type EngagementLevel =
  | "very_engaged"
  | "engaged"
  | "somewhat_engaged"
  | "disengaged"
  | "refused";

export type Rating = "outstanding" | "good" | "requires_improvement" | "inadequate";

// ── Label maps ───────────────────────────────────────────────────────────────

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  one_to_one: "One-to-One",
  care_planning: "Care Planning",
  emotional_support: "Emotional Support",
  advocacy: "Advocacy",
  goal_setting: "Goal Setting",
  review_preparation: "Review Preparation",
  crisis_support: "Crisis Support",
  recreational: "Recreational",
};

const ENGAGEMENT_LEVEL_LABELS: Record<EngagementLevel, string> = {
  very_engaged: "Very Engaged",
  engaged: "Engaged",
  somewhat_engaged: "Somewhat Engaged",
  disengaged: "Disengaged",
  refused: "Refused",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

export function getSessionTypeLabel(v: SessionType): string { return SESSION_TYPE_LABELS[v]; }
export function getEngagementLevelLabel(v: EngagementLevel): string { return ENGAGEMENT_LEVEL_LABELS[v]; }
export function getRatingLabel(v: Rating): string { return RATING_LABELS[v]; }

// ── Input interfaces ─────────────────────────────────────────────────────────

export interface KeyWorkerSession {
  id: string;
  childId: string;
  childName: string;
  keyWorkerId: string;
  keyWorkerName: string;
  sessionDate: string;
  sessionType: SessionType;
  engagementLevel: EngagementLevel;
  childVoiceCaptured: boolean;
  goalsReviewed: boolean;
  actionsPlanCompleted: boolean;
  relationshipStrengthened: boolean;
  documentedInCasefile: boolean;
  followUpScheduled: boolean;
}

export interface KeyWorkerPolicy {
  id: string;
  keyWorkerAllocationPolicy: boolean;
  sessionFrequencyGuidance: boolean;
  childParticipationFramework: boolean;
  documentationStandards: boolean;
  supervisionRequirements: boolean;
  continuityPlanning: boolean;
  regularReview: boolean;
}

export interface StaffKeyWorkerTraining {
  id: string;
  staffId: string;
  staffName: string;
  relationshipBuilding: boolean;
  childVoice: boolean;
  carePlanningSkills: boolean;
  therapeuticApproaches: boolean;
  advocacySkills: boolean;
  documentationSkills: boolean;
}

// ── Result interfaces ────────────────────────────────────────────────────────

export interface SessionQualityResult {
  overallScore: number;
  totalSessions: number;
  engagementRate: number;
  childVoiceRate: number;
  goalsReviewedRate: number;
  actionsPlanRate: number;
}

export interface RelationshipEffectivenessResult {
  overallScore: number;
  relationshipRate: number;
  documentedRate: number;
  followUpRate: number;
  sessionDiversityRatio: number;
}

export interface KeyWorkerPolicyResult {
  overallScore: number;
  keyWorkerAllocationPolicy: boolean;
  sessionFrequencyGuidance: boolean;
  childParticipationFramework: boolean;
  documentationStandards: boolean;
  supervisionRequirements: boolean;
  continuityPlanning: boolean;
  regularReview: boolean;
}

export interface StaffKeyWorkerReadinessResult {
  overallScore: number;
  totalStaff: number;
  relationshipBuildingRate: number;
  childVoiceRate: number;
  carePlanningRate: number;
  therapeuticRate: number;
  advocacyRate: number;
  documentationRate: number;
}

export interface ChildKeyWorkerProfile {
  childId: string;
  childName: string;
  keyWorkerName: string;
  totalSessions: number;
  engagementRate: number;
  childVoiceRate: number;
  overallScore: number;
}

export interface KeyWorkerRelationshipQualityIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  sessionQuality: SessionQualityResult;
  relationshipEffectiveness: RelationshipEffectivenessResult;
  keyWorkerPolicy: KeyWorkerPolicyResult;
  staffReadiness: StaffKeyWorkerReadinessResult;
  childProfiles: ChildKeyWorkerProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// ── Evaluators ───────────────────────────────────────────────────────────────

export function evaluateSessionQuality(sessions: KeyWorkerSession[]): SessionQualityResult {
  if (sessions.length === 0) {
    return { overallScore: 0, totalSessions: 0, engagementRate: 0, childVoiceRate: 0, goalsReviewedRate: 0, actionsPlanRate: 0 };
  }

  const total = sessions.length;
  const engagedCount = sessions.filter((s) => s.engagementLevel === "very_engaged" || s.engagementLevel === "engaged").length;
  const voiceCount = sessions.filter((s) => s.childVoiceCaptured).length;
  const goalsCount = sessions.filter((s) => s.goalsReviewed).length;
  const actionsCount = sessions.filter((s) => s.actionsPlanCompleted).length;

  const engagementRate = pct(engagedCount, total);
  const childVoiceRate = pct(voiceCount, total);
  const goalsReviewedRate = pct(goalsCount, total);
  const actionsPlanRate = pct(actionsCount, total);

  // Weighted: engagement(0-7), childVoice(0-6), goalsReviewed(0-6), actionsPlan(0-6)
  const engagementScore = Math.round((engagementRate / 100) * 7);
  const voiceScore = Math.round((childVoiceRate / 100) * 6);
  const goalsScore = Math.round((goalsReviewedRate / 100) * 6);
  const actionsScore = Math.round((actionsPlanRate / 100) * 6);

  const overallScore = Math.min(25, engagementScore + voiceScore + goalsScore + actionsScore);

  return { overallScore, totalSessions: total, engagementRate, childVoiceRate, goalsReviewedRate, actionsPlanRate };
}

export function evaluateRelationshipEffectiveness(sessions: KeyWorkerSession[]): RelationshipEffectivenessResult {
  if (sessions.length === 0) {
    return { overallScore: 0, relationshipRate: 0, documentedRate: 0, followUpRate: 0, sessionDiversityRatio: 0 };
  }

  const total = sessions.length;
  const relationshipCount = sessions.filter((s) => s.relationshipStrengthened).length;
  const documentedCount = sessions.filter((s) => s.documentedInCasefile).length;
  const followUpCount = sessions.filter((s) => s.followUpScheduled).length;
  const uniqueTypes = new Set(sessions.map((s) => s.sessionType)).size;
  const diversityRatio = pct(uniqueTypes, 8);

  const relationshipRate = pct(relationshipCount, total);
  const documentedRate = pct(documentedCount, total);
  const followUpRate = pct(followUpCount, total);

  // Weighted: relationship(0-8), documented(0-7), followUp(0-5), diversity(0-5)
  const relScore = Math.round((relationshipRate / 100) * 8);
  const docScore = Math.round((documentedRate / 100) * 7);
  const followScore = Math.round((followUpRate / 100) * 5);
  const divScore = Math.round((diversityRatio / 100) * 5);

  const overallScore = Math.min(25, relScore + docScore + followScore + divScore);

  return { overallScore, relationshipRate, documentedRate, followUpRate, sessionDiversityRatio: diversityRatio };
}

export function evaluateKeyWorkerPolicy(policy: KeyWorkerPolicy | null): KeyWorkerPolicyResult {
  if (!policy) {
    return {
      overallScore: 0,
      keyWorkerAllocationPolicy: false,
      sessionFrequencyGuidance: false,
      childParticipationFramework: false,
      documentationStandards: false,
      supervisionRequirements: false,
      continuityPlanning: false,
      regularReview: false,
    };
  }

  let score = 0;
  if (policy.keyWorkerAllocationPolicy) score += 4;
  if (policy.sessionFrequencyGuidance) score += 4;
  if (policy.childParticipationFramework) score += 4;
  if (policy.documentationStandards) score += 4;
  if (policy.supervisionRequirements) score += 3;
  if (policy.continuityPlanning) score += 3;
  if (policy.regularReview) score += 3;

  return {
    overallScore: Math.min(25, score),
    keyWorkerAllocationPolicy: policy.keyWorkerAllocationPolicy,
    sessionFrequencyGuidance: policy.sessionFrequencyGuidance,
    childParticipationFramework: policy.childParticipationFramework,
    documentationStandards: policy.documentationStandards,
    supervisionRequirements: policy.supervisionRequirements,
    continuityPlanning: policy.continuityPlanning,
    regularReview: policy.regularReview,
  };
}

export function evaluateStaffKeyWorkerReadiness(training: StaffKeyWorkerTraining[]): StaffKeyWorkerReadinessResult {
  if (training.length === 0) {
    return { overallScore: 0, totalStaff: 0, relationshipBuildingRate: 0, childVoiceRate: 0, carePlanningRate: 0, therapeuticRate: 0, advocacyRate: 0, documentationRate: 0 };
  }

  const total = training.length;
  const relCount = training.filter((t) => t.relationshipBuilding).length;
  const voiceCount = training.filter((t) => t.childVoice).length;
  const careCount = training.filter((t) => t.carePlanningSkills).length;
  const therapCount = training.filter((t) => t.therapeuticApproaches).length;
  const advCount = training.filter((t) => t.advocacySkills).length;
  const docCount = training.filter((t) => t.documentationSkills).length;

  const relationshipBuildingRate = pct(relCount, total);
  const childVoiceRate = pct(voiceCount, total);
  const carePlanningRate = pct(careCount, total);
  const therapeuticRate = pct(therapCount, total);
  const advocacyRate = pct(advCount, total);
  const documentationRate = pct(docCount, total);

  // Weighted: relationship(0-6), childVoice(0-5), carePlanning(0-5), therapeutic(0-4), advocacy(0-3), documentation(0-2)
  const s1 = Math.round((relationshipBuildingRate / 100) * 6);
  const s2 = Math.round((childVoiceRate / 100) * 5);
  const s3 = Math.round((carePlanningRate / 100) * 5);
  const s4 = Math.round((therapeuticRate / 100) * 4);
  const s5 = Math.round((advocacyRate / 100) * 3);
  const s6 = Math.round((documentationRate / 100) * 2);

  const overallScore = Math.min(25, s1 + s2 + s3 + s4 + s5 + s6);

  return { overallScore, totalStaff: total, relationshipBuildingRate, childVoiceRate, carePlanningRate, therapeuticRate, advocacyRate, documentationRate };
}

// ── Child profiles ───────────────────────────────────────────────────────────

export function buildChildKeyWorkerProfiles(sessions: KeyWorkerSession[]): ChildKeyWorkerProfile[] {
  if (sessions.length === 0) return [];

  const grouped = new Map<string, KeyWorkerSession[]>();
  for (const s of sessions) {
    if (!grouped.has(s.childId)) grouped.set(s.childId, []);
    grouped.get(s.childId)!.push(s);
  }

  const profiles: ChildKeyWorkerProfile[] = [];

  for (const [childId, sess] of grouped) {
    const childName = sess[0].childName;
    const keyWorkerName = sess[0].keyWorkerName;
    const total = sess.length;
    const engagedCount = sess.filter((s) => s.engagementLevel === "very_engaged" || s.engagementLevel === "engaged").length;
    const voiceCount = sess.filter((s) => s.childVoiceCaptured).length;

    const engagementRate = pct(engagedCount, total);
    const childVoiceRate = pct(voiceCount, total);

    // Score 0-10: frequency(0-2), engagement(0-3), childVoice(0-3), consistency(0-2)
    let freqScore = 0;
    if (total >= 10) freqScore = 2;
    else if (total >= 5) freqScore = 1;

    let engScore = 0;
    if (engagementRate >= 80) engScore = 3;
    else if (engagementRate >= 60) engScore = 2;
    else if (engagementRate >= 40) engScore = 1;

    let voiceScore = 0;
    if (childVoiceRate >= 80) voiceScore = 3;
    else if (childVoiceRate >= 60) voiceScore = 2;
    else if (childVoiceRate >= 40) voiceScore = 1;

    // Consistency: same key worker throughout
    const uniqueKeyWorkers = new Set(sess.map((s) => s.keyWorkerId)).size;
    let consistencyScore = 0;
    if (uniqueKeyWorkers === 1) consistencyScore = 2;
    else if (uniqueKeyWorkers <= 2) consistencyScore = 1;

    const overallScore = Math.min(10, freqScore + engScore + voiceScore + consistencyScore);

    profiles.push({ childId, childName, keyWorkerName, totalSessions: total, engagementRate, childVoiceRate, overallScore });
  }

  return profiles;
}

// ── Orchestrator ─────────────────────────────────────────────────────────────

export function generateKeyWorkerRelationshipQualityIntelligence(
  sessions: KeyWorkerSession[],
  policy: KeyWorkerPolicy | null,
  training: StaffKeyWorkerTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): KeyWorkerRelationshipQualityIntelligence {
  const sessionQuality = evaluateSessionQuality(sessions);
  const relationshipEffectiveness = evaluateRelationshipEffectiveness(sessions);
  const keyWorkerPolicy = evaluateKeyWorkerPolicy(policy);
  const staffReadiness = evaluateStaffKeyWorkerReadiness(training);

  const overallScore = Math.min(100, sessionQuality.overallScore + relationshipEffectiveness.overallScore + keyWorkerPolicy.overallScore + staffReadiness.overallScore);
  const rating = getRating(overallScore);

  const childProfiles = buildChildKeyWorkerProfiles(sessions);

  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  const actions: string[] = [];

  // Strengths
  if (sessionQuality.engagementRate >= 80) strengths.push("Strong child engagement in key worker sessions — children are actively participating");
  if (sessionQuality.childVoiceRate >= 80) strengths.push("Excellent capture of children's voices during key worker sessions");
  if (relationshipEffectiveness.relationshipRate >= 80) strengths.push("Key worker relationships are being effectively strengthened through regular sessions");
  if (relationshipEffectiveness.documentedRate >= 80) strengths.push("High quality documentation of key worker sessions in casefiles");

  // Areas for improvement
  if (sessions.length > 0 && sessionQuality.engagementRate < 60) areasForImprovement.push("Child engagement in key worker sessions needs improvement — review session approaches");
  if (sessions.length > 0 && sessionQuality.childVoiceRate < 60) areasForImprovement.push("Children's voices are not consistently captured in key worker sessions");
  if (sessions.length > 0 && relationshipEffectiveness.followUpRate < 60) areasForImprovement.push("Follow-up scheduling after key worker sessions requires attention");
  if (sessions.length > 0 && sessionQuality.goalsReviewedRate < 60) areasForImprovement.push("Goals are not being regularly reviewed during key worker sessions");

  // Actions
  if (sessions.length === 0) actions.push("No key worker session records found — ensure regular key worker sessions are taking place and recorded");
  if (!policy) actions.push("URGENT: No key worker policy in place — develop and implement immediately");
  if (training.length === 0) actions.push("URGENT: No staff key worker training recorded — arrange training for all staff");
  if (sessions.length > 0 && sessionQuality.actionsPlanRate < 60) actions.push("Improve action plan completion rates in key worker sessions");
  if (sessions.length > 0 && relationshipEffectiveness.relationshipRate < 60) actions.push("Review approaches to strengthen key worker-child relationships");

  const regulatoryLinks: string[] = [
    "CHR 2015 Regulation 10 — Positive relationships",
    "CHR 2015 Regulation 12 — The protection of children",
    "SCCIF — Experiences and progress of children",
    "NMS 2 — A child-centred approach",
    "Children Act 1989 — Welfare of the child",
    "UNCRC Article 12 — Right to be heard",
    "Care Planning Regulations 2010 — Review of care plan",
  ];

  return {
    homeId, periodStart, periodEnd, overallScore, rating,
    sessionQuality, relationshipEffectiveness, keyWorkerPolicy, staffReadiness,
    childProfiles, strengths, areasForImprovement, actions, regulatoryLinks,
  };
}
