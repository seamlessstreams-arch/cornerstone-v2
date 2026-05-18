// ==============================================================================
// THERAPEUTIC CRISIS INTERVENTION INTELLIGENCE ENGINE
//
// Pure deterministic engine for assessing the quality of crisis intervention
// within a children's residential home. Covers de-escalation effectiveness,
// crisis prevention planning, post-crisis response, and staff preparedness.
//
// Regulatory basis:
//   - CHR 2015, Reg 12 — The protection of children standard
//   - CHR 2015, Reg 19 — Behaviour management policies and records
//   - CHR 2015, Reg 20 — Restraint and deprivation of liberty
//   - SCCIF — Overall experiences and progress of children
//   - Reducing the Need for Restraint and Restrictive Intervention (DfE)
//   - UNCRC Article 19 — Protection from violence and maltreatment
//   - UNCRC Article 37 — Protection from torture and deprivation of liberty
//
// No AI. No external calls. Pure input -> output.
// ==============================================================================

// -- Types --------------------------------------------------------------------

export type CrisisLevel = "low" | "medium" | "high" | "critical";

export type InterventionType =
  | "verbal_de_escalation"
  | "distraction"
  | "environmental_change"
  | "therapeutic_hold"
  | "physical_intervention"
  | "medical_emergency"
  | "police_called";

export type DeEscalationOutcome =
  | "fully_resolved"
  | "partially_resolved"
  | "escalated"
  | "required_restraint";

export type DebriefStatus =
  | "completed_within_24h"
  | "completed_late"
  | "not_completed";

export type RecoveryPlanStatus =
  | "in_place"
  | "in_progress"
  | "not_started"
  | "not_applicable";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// -- Input Interfaces ---------------------------------------------------------

export interface CrisisEpisode {
  id: string;
  childId: string;
  childName: string;
  date: string;
  time: string;
  crisisLevel: CrisisLevel;
  trigger: string;
  interventionType: InterventionType;
  deEscalationAttempted: boolean;
  deEscalationOutcome: DeEscalationOutcome;
  duration: number;
  staffInvolved: string[];
  physicalInterventionUsed: boolean;
  debriefStatus: DebriefStatus;
  childViewSought: boolean;
  childViewRecorded: boolean;
  recoveryPlanStatus: RecoveryPlanStatus;
}

export interface CrisisPreventionPlan {
  id: string;
  childId: string;
  childName: string;
  planDate: string;
  triggersIdentified: boolean;
  earlyWarningSignsDocumented: boolean;
  preferredCopingStrategies: string[];
  staffAwareOfPlan: boolean;
  lastReviewDate: string;
  reviewCurrent: boolean;
}

export interface StaffCrisisTraining {
  id: string;
  staffId: string;
  staffName: string;
  deEscalationTrained: boolean;
  therapeuticCrisisTrained: boolean;
  physicalInterventionCertified: boolean;
  traumaInformedTrained: boolean;
  postCrisisDebriefTrained: boolean;
}

export interface PostCrisisReview {
  id: string;
  episodeId: string;
  childId: string;
  childName: string;
  reviewDate: string;
  lessonsIdentified: boolean;
  planUpdated: boolean;
  childParticipated: boolean;
  parentCarerNotified: boolean;
  managementInformed: boolean;
}

// -- Result Interfaces --------------------------------------------------------

export interface DeEscalationEffectivenessResult {
  overallScore: number;
  totalEpisodes: number;
  deEscalationAttemptedRate: number;
  fullyResolvedRate: number;
  physicalInterventionRate: number;
  averageDuration: number;
}

export interface CrisisPlanningResult {
  overallScore: number;
  totalPlans: number;
  plansPerChildRate: number;
  triggersIdentifiedRate: number;
  reviewCurrentRate: number;
  staffAwarenessRate: number;
}

export interface PostCrisisResponseResult {
  overallScore: number;
  totalEpisodes: number;
  debriefWithin24hRate: number;
  childViewSoughtRate: number;
  recoveryPlanRate: number;
  lessonsIdentifiedRate: number;
}

export interface StaffPreparednessResult {
  overallScore: number;
  totalStaff: number;
  deEscalationTrainedRate: number;
  therapeuticCrisisTrainedRate: number;
  physicalInterventionCertifiedRate: number;
  traumaInformedTrainedRate: number;
  postCrisisDebriefTrainedRate: number;
}

export interface ChildCrisisProfile {
  childId: string;
  childName: string;
  episodeCount: number;
  deEscalationSuccessRate: number;
  debriefCompletionRate: number;
  hasPlan: boolean;
  overallScore: number;
}

export interface TherapeuticCrisisInterventionIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  deEscalationEffectiveness: DeEscalationEffectivenessResult;
  crisisPlanning: CrisisPlanningResult;
  postCrisisResponse: PostCrisisResponseResult;
  staffPreparedness: StaffPreparednessResult;
  childProfiles: ChildCrisisProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Helpers ------------------------------------------------------------------

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

// -- Label Maps & Getters -----------------------------------------------------

const CRISIS_LEVEL_LABELS: Record<CrisisLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const INTERVENTION_TYPE_LABELS: Record<InterventionType, string> = {
  verbal_de_escalation: "Verbal De-escalation",
  distraction: "Distraction",
  environmental_change: "Environmental Change",
  therapeutic_hold: "Therapeutic Hold",
  physical_intervention: "Physical Intervention",
  medical_emergency: "Medical Emergency",
  police_called: "Police Called",
};

const DE_ESCALATION_OUTCOME_LABELS: Record<DeEscalationOutcome, string> = {
  fully_resolved: "Fully Resolved",
  partially_resolved: "Partially Resolved",
  escalated: "Escalated",
  required_restraint: "Required Restraint",
};

const DEBRIEF_STATUS_LABELS: Record<DebriefStatus, string> = {
  completed_within_24h: "Completed Within 24h",
  completed_late: "Completed Late",
  not_completed: "Not Completed",
};

const RECOVERY_PLAN_STATUS_LABELS: Record<RecoveryPlanStatus, string> = {
  in_place: "In Place",
  in_progress: "In Progress",
  not_started: "Not Started",
  not_applicable: "Not Applicable",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

export function getCrisisLevelLabel(v: CrisisLevel): string { return CRISIS_LEVEL_LABELS[v]; }
export function getInterventionTypeLabel(v: InterventionType): string { return INTERVENTION_TYPE_LABELS[v]; }
export function getDeEscalationOutcomeLabel(v: DeEscalationOutcome): string { return DE_ESCALATION_OUTCOME_LABELS[v]; }
export function getDebriefStatusLabel(v: DebriefStatus): string { return DEBRIEF_STATUS_LABELS[v]; }
export function getRecoveryPlanStatusLabel(v: RecoveryPlanStatus): string { return RECOVERY_PLAN_STATUS_LABELS[v]; }
export function getRatingLabel(v: Rating): string { return RATING_LABELS[v]; }

// -- Evaluators ---------------------------------------------------------------

/**
 * Evaluates de-escalation effectiveness across crisis episodes.
 * Empty (no episodes) = 25 — no crises is excellent.
 */
export function evaluateDeEscalationEffectiveness(
  episodes: CrisisEpisode[],
): DeEscalationEffectivenessResult {
  if (episodes.length === 0) {
    return {
      overallScore: 25,
      totalEpisodes: 0,
      deEscalationAttemptedRate: 0,
      fullyResolvedRate: 0,
      physicalInterventionRate: 0,
      averageDuration: 0,
    };
  }

  let deEscalationAttempted = 0;
  let fullyResolved = 0;
  let physicalIntervention = 0;
  let totalDuration = 0;

  for (const ep of episodes) {
    if (ep.deEscalationAttempted) deEscalationAttempted++;
    if (ep.deEscalationOutcome === "fully_resolved") fullyResolved++;
    if (ep.physicalInterventionUsed) physicalIntervention++;
    totalDuration += ep.duration;
  }

  const deEscalationAttemptedRate = pct(deEscalationAttempted, episodes.length);
  const fullyResolvedRate = pct(fullyResolved, episodes.length);
  const physicalInterventionRate = pct(physicalIntervention, episodes.length);
  const averageDuration = Math.round(totalDuration / episodes.length);

  // Scoring: de-escalation attempted rate (0-7), fully resolved rate (0-7),
  // low physical intervention rate bonus (0-6), average duration trend (0-5)
  let score = 0;
  score += Math.round((deEscalationAttemptedRate / 100) * 7);
  score += Math.round((fullyResolvedRate / 100) * 7);

  // Low physical intervention bonus
  if (physicalInterventionRate === 0) score += 6;
  else if (physicalInterventionRate <= 20) score += 4;
  else if (physicalInterventionRate <= 50) score += 2;

  // Duration scoring — shorter is better (under 30 min = excellent)
  if (averageDuration <= 15) score += 5;
  else if (averageDuration <= 30) score += 4;
  else if (averageDuration <= 60) score += 2;
  else if (averageDuration <= 120) score += 1;

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalEpisodes: episodes.length,
    deEscalationAttemptedRate,
    fullyResolvedRate,
    physicalInterventionRate,
    averageDuration,
  };
}

/**
 * Evaluates crisis prevention planning quality.
 * Empty (no plans) = 0 — absence of plans is non-compliant.
 */
export function evaluateCrisisPlanning(
  plans: CrisisPreventionPlan[],
  childIds: string[],
): CrisisPlanningResult {
  if (plans.length === 0) {
    return {
      overallScore: 0,
      totalPlans: 0,
      plansPerChildRate: 0,
      triggersIdentifiedRate: 0,
      reviewCurrentRate: 0,
      staffAwarenessRate: 0,
    };
  }

  const childrenWithPlans = new Set(plans.map((p) => p.childId));
  const uniqueChildren = new Set(childIds);
  const plansPerChildRate = pct(childrenWithPlans.size, Math.max(uniqueChildren.size, childrenWithPlans.size));

  let triggersIdentified = 0;
  let reviewCurrent = 0;
  let staffAware = 0;

  for (const p of plans) {
    if (p.triggersIdentified) triggersIdentified++;
    if (p.reviewCurrent) reviewCurrent++;
    if (p.staffAwareOfPlan) staffAware++;
  }

  const triggersIdentifiedRate = pct(triggersIdentified, plans.length);
  const reviewCurrentRate = pct(reviewCurrent, plans.length);
  const staffAwarenessRate = pct(staffAware, plans.length);

  // Scoring: plans exist per child (0-7), triggers identified (0-6),
  // review current (0-6), staff awareness (0-6)
  let score = 0;
  score += Math.round((plansPerChildRate / 100) * 7);
  score += Math.round((triggersIdentifiedRate / 100) * 6);
  score += Math.round((reviewCurrentRate / 100) * 6);
  score += Math.round((staffAwarenessRate / 100) * 6);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalPlans: plans.length,
    plansPerChildRate,
    triggersIdentifiedRate,
    reviewCurrentRate,
    staffAwarenessRate,
  };
}

/**
 * Evaluates post-crisis response quality.
 * Empty (no episodes) = 25 — no crises needing response is excellent.
 */
export function evaluatePostCrisisResponse(
  episodes: CrisisEpisode[],
  reviews: PostCrisisReview[],
): PostCrisisResponseResult {
  if (episodes.length === 0) {
    return {
      overallScore: 25,
      totalEpisodes: 0,
      debriefWithin24hRate: 0,
      childViewSoughtRate: 0,
      recoveryPlanRate: 0,
      lessonsIdentifiedRate: 0,
    };
  }

  let debriefWithin24h = 0;
  let childViewSought = 0;
  let recoveryPlan = 0;

  for (const ep of episodes) {
    if (ep.debriefStatus === "completed_within_24h") debriefWithin24h++;
    if (ep.childViewSought) childViewSought++;
    if (ep.recoveryPlanStatus === "in_place" || ep.recoveryPlanStatus === "in_progress") recoveryPlan++;
  }

  let lessonsIdentified = 0;
  for (const r of reviews) {
    if (r.lessonsIdentified) lessonsIdentified++;
  }

  const debriefWithin24hRate = pct(debriefWithin24h, episodes.length);
  const childViewSoughtRate = pct(childViewSought, episodes.length);
  const recoveryPlanRate = pct(recoveryPlan, episodes.length);
  const lessonsIdentifiedRate = pct(lessonsIdentified, reviews.length);

  // Scoring: debrief within 24h rate (0-8), child view sought rate (0-6),
  // recovery plan rate (0-6), lessons identified rate (0-5)
  let score = 0;
  score += Math.round((debriefWithin24hRate / 100) * 8);
  score += Math.round((childViewSoughtRate / 100) * 6);
  score += Math.round((recoveryPlanRate / 100) * 6);
  score += Math.round((lessonsIdentifiedRate / 100) * 5);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalEpisodes: episodes.length,
    debriefWithin24hRate,
    childViewSoughtRate,
    recoveryPlanRate,
    lessonsIdentifiedRate,
  };
}

/**
 * Evaluates staff preparedness for crisis intervention.
 * Empty (no training) = 0 — no trained staff is non-compliant.
 */
export function evaluateStaffPreparedness(
  training: StaffCrisisTraining[],
): StaffPreparednessResult {
  if (training.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      deEscalationTrainedRate: 0,
      therapeuticCrisisTrainedRate: 0,
      physicalInterventionCertifiedRate: 0,
      traumaInformedTrainedRate: 0,
      postCrisisDebriefTrainedRate: 0,
    };
  }

  let deEscalation = 0;
  let therapeuticCrisis = 0;
  let physicalIntervention = 0;
  let traumaInformed = 0;
  let postCrisisDebrief = 0;

  for (const t of training) {
    if (t.deEscalationTrained) deEscalation++;
    if (t.therapeuticCrisisTrained) therapeuticCrisis++;
    if (t.physicalInterventionCertified) physicalIntervention++;
    if (t.traumaInformedTrained) traumaInformed++;
    if (t.postCrisisDebriefTrained) postCrisisDebrief++;
  }

  const deEscalationTrainedRate = pct(deEscalation, training.length);
  const therapeuticCrisisTrainedRate = pct(therapeuticCrisis, training.length);
  const physicalInterventionCertifiedRate = pct(physicalIntervention, training.length);
  const traumaInformedTrainedRate = pct(traumaInformed, training.length);
  const postCrisisDebriefTrainedRate = pct(postCrisisDebrief, training.length);

  // Scoring: de-escalation trained (0-6), therapeutic crisis (0-6),
  // physical intervention certified (0-5), trauma informed (0-4),
  // post-crisis debrief (0-4)
  let score = 0;
  score += Math.round((deEscalationTrainedRate / 100) * 6);
  score += Math.round((therapeuticCrisisTrainedRate / 100) * 6);
  score += Math.round((physicalInterventionCertifiedRate / 100) * 5);
  score += Math.round((traumaInformedTrainedRate / 100) * 4);
  score += Math.round((postCrisisDebriefTrainedRate / 100) * 4);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalStaff: training.length,
    deEscalationTrainedRate,
    therapeuticCrisisTrainedRate,
    physicalInterventionCertifiedRate,
    traumaInformedTrainedRate,
    postCrisisDebriefTrainedRate,
  };
}

// -- Child Profiles -----------------------------------------------------------

export function buildChildCrisisProfiles(
  episodes: CrisisEpisode[],
  plans: CrisisPreventionPlan[],
): ChildCrisisProfile[] {
  const childIds = new Set<string>();
  const childNames = new Map<string, string>();

  for (const ep of episodes) {
    childIds.add(ep.childId);
    childNames.set(ep.childId, ep.childName);
  }
  for (const p of plans) {
    childIds.add(p.childId);
    childNames.set(p.childId, p.childName);
  }

  return Array.from(childIds).map((childId) => {
    const childEpisodes = episodes.filter((ep) => ep.childId === childId);
    const childPlans = plans.filter((p) => p.childId === childId);
    const hasPlan = childPlans.length > 0;

    const fullyResolved = childEpisodes.filter(
      (ep) => ep.deEscalationOutcome === "fully_resolved",
    ).length;
    const deEscalationSuccessRate = pct(fullyResolved, childEpisodes.length);

    const debriefed = childEpisodes.filter(
      (ep) => ep.debriefStatus === "completed_within_24h" || ep.debriefStatus === "completed_late",
    ).length;
    const debriefCompletionRate = pct(debriefed, childEpisodes.length);

    // Score 0-10
    let score = 0;

    // Episode count — fewer crises is better (0-3)
    if (childEpisodes.length === 0) score += 3;
    else if (childEpisodes.length <= 1) score += 2;
    else if (childEpisodes.length <= 3) score += 1;

    // De-escalation success (0-3)
    if (childEpisodes.length === 0) score += 3;
    else score += Math.round((deEscalationSuccessRate / 100) * 3);

    // Debrief quality (0-2)
    if (childEpisodes.length === 0) score += 2;
    else score += Math.round((debriefCompletionRate / 100) * 2);

    // Plan status (0-2)
    if (hasPlan) {
      score += 1;
      if (childPlans.some((p) => p.reviewCurrent)) score += 1;
    }

    return {
      childId,
      childName: childNames.get(childId) || "Unknown",
      episodeCount: childEpisodes.length,
      deEscalationSuccessRate,
      debriefCompletionRate,
      hasPlan,
      overallScore: Math.min(10, score),
    };
  });
}

// -- Main Function ------------------------------------------------------------

export function generateTherapeuticCrisisInterventionIntelligence(
  episodes: CrisisEpisode[],
  plans: CrisisPreventionPlan[],
  training: StaffCrisisTraining[],
  reviews: PostCrisisReview[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): TherapeuticCrisisInterventionIntelligence {
  // Collect unique child IDs from episodes and plans
  const allChildIds: string[] = [];
  for (const ep of episodes) allChildIds.push(ep.childId);
  for (const p of plans) allChildIds.push(p.childId);
  const uniqueChildIds = Array.from(new Set(allChildIds));

  const deEscalationEffectiveness = evaluateDeEscalationEffectiveness(episodes);
  const crisisPlanning = evaluateCrisisPlanning(plans, uniqueChildIds);
  const postCrisisResponse = evaluatePostCrisisResponse(episodes, reviews);
  const staffPreparedness = evaluateStaffPreparedness(training);

  const rawScore =
    deEscalationEffectiveness.overallScore +
    crisisPlanning.overallScore +
    postCrisisResponse.overallScore +
    staffPreparedness.overallScore;

  const overallScore = Math.min(100, Math.max(0, rawScore));
  const rating = getRating(overallScore);

  const childProfiles = buildChildCrisisProfiles(episodes, plans);

  // -- Strengths --
  const strengths: string[] = [];
  if (episodes.length === 0)
    strengths.push("No crisis episodes recorded in period — excellent preventative practice");
  if (episodes.length > 0 && deEscalationEffectiveness.deEscalationAttemptedRate === 100)
    strengths.push("De-escalation attempted in 100% of crisis episodes");
  if (episodes.length > 0 && deEscalationEffectiveness.fullyResolvedRate >= 75)
    strengths.push("High de-escalation success — " + deEscalationEffectiveness.fullyResolvedRate + "% of episodes fully resolved");
  if (episodes.length > 0 && deEscalationEffectiveness.physicalInterventionRate === 0)
    strengths.push("No physical interventions used — therapeutic approaches consistently applied");
  if (plans.length > 0 && crisisPlanning.plansPerChildRate === 100)
    strengths.push("Crisis prevention plans in place for all children");
  if (plans.length > 0 && crisisPlanning.triggersIdentifiedRate === 100)
    strengths.push("Triggers identified in all crisis prevention plans");
  if (plans.length > 0 && crisisPlanning.reviewCurrentRate === 100)
    strengths.push("All crisis prevention plans are current and reviewed");
  if (episodes.length > 0 && postCrisisResponse.debriefWithin24hRate === 100)
    strengths.push("Post-crisis debriefs completed within 24 hours for all episodes");
  if (episodes.length > 0 && postCrisisResponse.childViewSoughtRate === 100)
    strengths.push("Child's views sought after every crisis episode");
  if (training.length > 0 && staffPreparedness.deEscalationTrainedRate === 100)
    strengths.push("All staff trained in de-escalation techniques");
  if (training.length > 0 && staffPreparedness.traumaInformedTrainedRate === 100)
    strengths.push("All staff trained in trauma-informed care");

  // -- Areas for Improvement --
  const areasForImprovement: string[] = [];
  if (episodes.length > 0 && deEscalationEffectiveness.deEscalationAttemptedRate < 100)
    areasForImprovement.push("De-escalation not attempted in " + (100 - deEscalationEffectiveness.deEscalationAttemptedRate) + "% of episodes — must be first response");
  if (episodes.length > 0 && deEscalationEffectiveness.physicalInterventionRate > 30)
    areasForImprovement.push("Physical intervention rate at " + deEscalationEffectiveness.physicalInterventionRate + "% — review therapeutic alternatives");
  if (plans.length === 0)
    areasForImprovement.push("No crisis prevention plans in place — all children should have individualised plans");
  if (plans.length > 0 && crisisPlanning.plansPerChildRate < 100)
    areasForImprovement.push("Crisis prevention plans missing for " + (100 - crisisPlanning.plansPerChildRate) + "% of children");
  if (plans.length > 0 && crisisPlanning.reviewCurrentRate < 80)
    areasForImprovement.push("Only " + crisisPlanning.reviewCurrentRate + "% of crisis prevention plans are current — reviews needed");
  if (episodes.length > 0 && postCrisisResponse.debriefWithin24hRate < 80)
    areasForImprovement.push("Debrief within 24 hours achieved in only " + postCrisisResponse.debriefWithin24hRate + "% of episodes — target 100%");
  if (episodes.length > 0 && postCrisisResponse.childViewSoughtRate < 80)
    areasForImprovement.push("Child views sought in only " + postCrisisResponse.childViewSoughtRate + "% of episodes — target 100%");
  if (training.length === 0)
    areasForImprovement.push("No staff crisis training records — all staff must be trained");
  if (training.length > 0 && staffPreparedness.deEscalationTrainedRate < 100)
    areasForImprovement.push("Only " + staffPreparedness.deEscalationTrainedRate + "% of staff trained in de-escalation — all staff require this training");
  if (training.length > 0 && staffPreparedness.traumaInformedTrainedRate < 75)
    areasForImprovement.push("Trauma-informed training completed by only " + staffPreparedness.traumaInformedTrainedRate + "% of staff");

  // -- Actions --
  const actions: string[] = [];
  const physicalEpisodes = episodes.filter((ep) => ep.physicalInterventionUsed);
  const notDebriefed = episodes.filter((ep) => ep.debriefStatus === "not_completed");
  const criticalEpisodes = episodes.filter((ep) => ep.crisisLevel === "critical");

  if (criticalEpisodes.length > 0)
    actions.push("URGENT: " + criticalEpisodes.length + " critical-level crisis episode(s) recorded — immediate management review required");
  if (notDebriefed.length > 0)
    actions.push("URGENT: " + notDebriefed.length + " crisis episode(s) without debrief — complete within 24 hours as per regulation");
  if (physicalEpisodes.length > 0 && deEscalationEffectiveness.physicalInterventionRate > 50)
    actions.push("URGENT: Physical intervention used in " + deEscalationEffectiveness.physicalInterventionRate + "% of episodes — review restraint reduction strategy");
  if (plans.length === 0 && uniqueChildIds.length > 0)
    actions.push("Create crisis prevention plans for all children — statutory requirement under CHR 2015 Reg 12");
  if (plans.length > 0 && crisisPlanning.staffAwarenessRate < 100)
    actions.push("Ensure all staff are aware of crisis prevention plans — currently " + crisisPlanning.staffAwarenessRate + "% awareness");
  if (training.length === 0)
    actions.push("URGENT: Arrange crisis intervention training for all staff immediately");
  if (training.length > 0 && staffPreparedness.physicalInterventionCertifiedRate < 100)
    actions.push("Ensure all staff are certified in physical intervention techniques — currently " + staffPreparedness.physicalInterventionCertifiedRate + "%");
  if (episodes.length > 0 && postCrisisResponse.recoveryPlanRate < 80)
    actions.push("Review recovery plan status — only " + postCrisisResponse.recoveryPlanRate + "% of episodes have recovery plans in place or in progress");

  const regulatoryLinks: string[] = [
    "CHR 2015, Reg 12 — The protection of children standard",
    "CHR 2015, Reg 19 — Behaviour management policies and records",
    "CHR 2015, Reg 20 — Restraint and deprivation of liberty",
    "SCCIF — Overall experiences and progress of children and young people",
    "Reducing the Need for Restraint and Restrictive Intervention (DfE) — Guidance on minimising use of force",
    "UNCRC Article 19 — Protection from all forms of violence and maltreatment",
    "UNCRC Article 37 — Protection from torture, cruel treatment and deprivation of liberty",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    deEscalationEffectiveness,
    crisisPlanning,
    postCrisisResponse,
    staffPreparedness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
