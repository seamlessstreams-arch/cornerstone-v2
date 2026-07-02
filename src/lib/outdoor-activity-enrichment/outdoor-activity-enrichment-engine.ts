// ==============================================================================
// Cara Outdoor Activity & Enrichment Intelligence Engine
//
// Evaluates the quality, breadth, and safety of outdoor activities and
// enrichment experiences provided to children in residential care.
//
// Regulatory basis:
//   - CHR 2015 Reg 6 (quality of care)
//   - CHR 2015 Reg 9 (enjoyment and achievement)
//   - NMS 12 (promoting positive behaviour through activity)
//   - SCCIF (experiences and progress of children)
//   - UNCRC Article 31 (right to rest, leisure, play)
//   - Working Together 2023
//   - CA 1989 s22(3)(a)
//
// Pure deterministic engine — no AI, no external calls.
// ==============================================================================

// -- Type Definitions ---------------------------------------------------------

export type ActivityCategory =
  | "outdoor_adventure"
  | "sports"
  | "creative_arts"
  | "cultural_visit"
  | "nature_environment"
  | "community_service"
  | "educational_trip"
  | "social_event"
  | "therapeutic_activity"
  | "life_skill_practice";

export type RiskBenefitOutcome =
  | "excellent"
  | "good"
  | "adequate"
  | "poor";

export type ChildEngagement =
  | "enthusiastic"
  | "willing"
  | "reluctant"
  | "refused"
  | "not_offered";

export type ActivityFrequency =
  | "daily"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "termly"
  | "one_off";

export type WeatherCondition =
  | "good"
  | "mixed"
  | "poor"
  | "extreme";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// -- Input Interfaces ---------------------------------------------------------

export interface ActivityRecord {
  id: string;
  childId: string;
  childName: string;
  category: ActivityCategory;
  date: string;
  description: string;
  duration: number; // minutes
  location: string;
  staffLed: boolean;
  childChose: boolean;
  riskBenefitAssessed: boolean;
  riskBenefitOutcome: RiskBenefitOutcome | null;
  childEngagement: ChildEngagement;
  outdoors: boolean;
  communityBased: boolean;
  newExperience: boolean;
  peersInvolved: boolean;
}

export interface EnrichmentPlan {
  id: string;
  childId: string;
  childName: string;
  planDate: string;
  reviewDate: string | null;
  interestsIdentified: string[];
  activitiesPlanned: number;
  activitiesCompleted: number;
  childContributed: boolean;
  diverseRange: boolean;
  barrierIdentified: string | null;
  barrierAddressed: boolean | null;
}

export interface RiskBenefitAssessment {
  id: string;
  activityId: string;
  assessedBy: string;
  assessDate: string;
  hazardsIdentified: number;
  controlMeasures: number;
  benefitsArticulated: boolean;
  childViewSought: boolean;
  dynamicAssessment: boolean;
  outcome: RiskBenefitOutcome;
}

export interface StaffActivityTraining {
  id: string;
  staffId: string;
  staffName: string;
  firstAidCurrent: boolean;
  outdoorQualifications: string[];
  activityLeaderTrained: boolean;
  riskAssessmentTrained: boolean;
  safeguardingCurrent: boolean;
}

// -- Result Interfaces --------------------------------------------------------

export interface ActivityParticipationResult {
  overallScore: number; // 0-25
  totalActivities: number;
  outdoorRate: number; // pct
  communityRate: number; // pct
  childChoiceRate: number; // pct
  newExperienceRate: number; // pct
  averageDuration: number; // minutes
  categoryDistribution: Record<ActivityCategory, number>;
  engagementDistribution: Record<ChildEngagement, number>;
}

export interface EnrichmentQualityResult {
  overallScore: number; // 0-25
  totalPlans: number;
  currentPlanRate: number; // pct
  completionRate: number; // pct
  childContributionRate: number; // pct
  diverseRangeRate: number; // pct
  barriersAddressedRate: number; // pct
  averageActivitiesPlanned: number;
}

export interface RiskManagementResult {
  overallScore: number; // 0-25
  totalAssessments: number;
  assessmentRate: number; // pct of activities with risk assessments
  goodOrExcellentRate: number; // pct
  childViewRate: number; // pct
  dynamicAssessmentRate: number; // pct
  benefitsArticulatedRate: number; // pct
  averageHazards: number;
}

export interface StaffReadinessResult {
  overallScore: number; // 0-25
  totalStaff: number;
  firstAidRate: number; // pct
  activityLeaderRate: number; // pct
  riskAssessmentTrainedRate: number; // pct
  safeguardingRate: number; // pct
  averageQualifications: number;
}

export interface ChildEnrichmentProfile {
  childId: string;
  childName: string;
  totalActivities: number;
  outdoorRate: number;
  choiceRate: number;
  engagementScore: number; // 0-10 based on engagement distribution
  planCompletionRate: number;
  overallScore: number; // 0-10
}

export interface OutdoorActivityEnrichmentIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number; // 0-100, capped
  rating: Rating;
  activityParticipation: ActivityParticipationResult;
  enrichmentQuality: EnrichmentQualityResult;
  riskManagement: RiskManagementResult;
  staffReadiness: StaffReadinessResult;
  childProfiles: ChildEnrichmentProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Label Maps ---------------------------------------------------------------

const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  outdoor_adventure: "Outdoor Adventure",
  sports: "Sports",
  creative_arts: "Creative Arts",
  cultural_visit: "Cultural Visit",
  nature_environment: "Nature & Environment",
  community_service: "Community Service",
  educational_trip: "Educational Trip",
  social_event: "Social Event",
  therapeutic_activity: "Therapeutic Activity",
  life_skill_practice: "Life Skill Practice",
};

const RISK_BENEFIT_OUTCOME_LABELS: Record<RiskBenefitOutcome, string> = {
  excellent: "Excellent",
  good: "Good",
  adequate: "Adequate",
  poor: "Poor",
};

const CHILD_ENGAGEMENT_LABELS: Record<ChildEngagement, string> = {
  enthusiastic: "Enthusiastic",
  willing: "Willing",
  reluctant: "Reluctant",
  refused: "Refused",
  not_offered: "Not Offered",
};

const ACTIVITY_FREQUENCY_LABELS: Record<ActivityFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
  termly: "Termly",
  one_off: "One-off",
};

const WEATHER_CONDITION_LABELS: Record<WeatherCondition, string> = {
  good: "Good",
  mixed: "Mixed",
  poor: "Poor",
  extreme: "Extreme",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

// -- Label Functions ----------------------------------------------------------

export function getActivityCategoryLabel(c: ActivityCategory): string {
  return ACTIVITY_CATEGORY_LABELS[c] ?? c;
}

export function getRiskBenefitOutcomeLabel(o: RiskBenefitOutcome): string {
  return RISK_BENEFIT_OUTCOME_LABELS[o] ?? o;
}

export function getChildEngagementLabel(e: ChildEngagement): string {
  return CHILD_ENGAGEMENT_LABELS[e] ?? e;
}

export function getActivityFrequencyLabel(f: ActivityFrequency): string {
  return ACTIVITY_FREQUENCY_LABELS[f] ?? f;
}

export function getWeatherConditionLabel(w: WeatherCondition): string {
  return WEATHER_CONDITION_LABELS[w] ?? w;
}

export function getRatingLabel(r: Rating): string {
  return RATING_LABELS[r] ?? r;
}

// -- Utility ------------------------------------------------------------------

export function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// -- Evaluation Functions -----------------------------------------------------

/**
 * Evaluates activity participation across children.
 * Scoring: outdoor rate (0-7), child choice rate (0-6), community rate (0-5),
 * new experience rate (0-4), engagement adjustments (max +3, -2 per refused where not_offered).
 * Max score: 25. Empty data = 0.
 */
export function evaluateActivityParticipation(
  activities: ActivityRecord[],
): ActivityParticipationResult {
  const emptyCategoryDist: Record<ActivityCategory, number> = {
    outdoor_adventure: 0, sports: 0, creative_arts: 0, cultural_visit: 0,
    nature_environment: 0, community_service: 0, educational_trip: 0,
    social_event: 0, therapeutic_activity: 0, life_skill_practice: 0,
  };
  const emptyEngagementDist: Record<ChildEngagement, number> = {
    enthusiastic: 0, willing: 0, reluctant: 0, refused: 0, not_offered: 0,
  };

  if (activities.length === 0) {
    return {
      overallScore: 0,
      totalActivities: 0,
      outdoorRate: 0,
      communityRate: 0,
      childChoiceRate: 0,
      newExperienceRate: 0,
      averageDuration: 0,
      categoryDistribution: { ...emptyCategoryDist },
      engagementDistribution: { ...emptyEngagementDist },
    };
  }

  const total = activities.length;

  // Rates
  const outdoorCount = activities.filter((a) => a.outdoors).length;
  const outdoorRate = pct(outdoorCount, total);

  const communityCount = activities.filter((a) => a.communityBased).length;
  const communityRate = pct(communityCount, total);

  const childChoiceCount = activities.filter((a) => a.childChose).length;
  const childChoiceRate = pct(childChoiceCount, total);

  const newExpCount = activities.filter((a) => a.newExperience).length;
  const newExperienceRate = pct(newExpCount, total);

  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  const averageDuration = Math.round(totalDuration / total);

  // Category distribution
  const categoryDistribution = { ...emptyCategoryDist };
  for (const a of activities) {
    categoryDistribution[a.category]++;
  }

  // Engagement distribution
  const engagementDistribution = { ...emptyEngagementDist };
  for (const a of activities) {
    engagementDistribution[a.childEngagement]++;
  }

  // Scoring
  let score = 0;

  // Outdoor rate (0-7)
  if (outdoorRate >= 80) score += 7;
  else if (outdoorRate >= 60) score += 5;
  else if (outdoorRate >= 40) score += 3;
  else if (outdoorRate >= 20) score += 1;

  // Child choice rate (0-6)
  if (childChoiceRate >= 80) score += 6;
  else if (childChoiceRate >= 60) score += 4;
  else if (childChoiceRate >= 40) score += 3;
  else if (childChoiceRate >= 20) score += 1;

  // Community rate (0-5)
  if (communityRate >= 80) score += 5;
  else if (communityRate >= 60) score += 3;
  else if (communityRate >= 40) score += 2;
  else if (communityRate >= 20) score += 1;

  // New experience rate (0-4)
  if (newExperienceRate >= 60) score += 4;
  else if (newExperienceRate >= 40) score += 3;
  else if (newExperienceRate >= 20) score += 2;
  else if (newExperienceRate > 0) score += 1;

  // Engagement adjustments: -2 per refused (not not_offered), +1 per enthusiastic (max 3)
  const refusedCount = engagementDistribution.refused;
  score -= refusedCount * 2;

  const enthusiasticCount = engagementDistribution.enthusiastic;
  score += Math.min(enthusiasticCount, 3);

  return {
    overallScore: Math.max(0, Math.min(score, 25)),
    totalActivities: total,
    outdoorRate,
    communityRate,
    childChoiceRate,
    newExperienceRate,
    averageDuration,
    categoryDistribution,
    engagementDistribution,
  };
}

/**
 * Evaluates enrichment planning quality.
 * Scoring: plan completion rate (0-8), child contribution (0-6),
 * diverse range (0-5), barriers addressed (0-4), current plans (0-2).
 * Max score: 25. Empty data = 0.
 */
export function evaluateEnrichmentQuality(
  plans: EnrichmentPlan[],
): EnrichmentQualityResult {
  if (plans.length === 0) {
    return {
      overallScore: 0,
      totalPlans: 0,
      currentPlanRate: 0,
      completionRate: 0,
      childContributionRate: 0,
      diverseRangeRate: 0,
      barriersAddressedRate: 0,
      averageActivitiesPlanned: 0,
    };
  }

  const total = plans.length;

  // Current plan rate (has a reviewDate)
  const currentPlans = plans.filter((p) => p.reviewDate !== null).length;
  const currentPlanRate = pct(currentPlans, total);

  // Completion rate (activitiesCompleted / activitiesPlanned across all plans)
  const totalPlanned = plans.reduce((sum, p) => sum + p.activitiesPlanned, 0);
  const totalCompleted = plans.reduce(
    (sum, p) => sum + p.activitiesCompleted,
    0,
  );
  const completionRate = pct(totalCompleted, totalPlanned);

  // Child contribution rate
  const childContrib = plans.filter((p) => p.childContributed).length;
  const childContributionRate = pct(childContrib, total);

  // Diverse range rate
  const diverseCount = plans.filter((p) => p.diverseRange).length;
  const diverseRangeRate = pct(diverseCount, total);

  // Barriers addressed rate (only among plans with barriers)
  const plansWithBarriers = plans.filter(
    (p) => p.barrierIdentified !== null,
  );
  const barriersAddressed = plansWithBarriers.filter(
    (p) => p.barrierAddressed === true,
  ).length;
  const barriersAddressedRate = pct(
    barriersAddressed,
    plansWithBarriers.length,
  );

  // Average activities planned
  const averageActivitiesPlanned = Math.round(totalPlanned / total);

  // Scoring
  let score = 0;

  // Plan completion rate (0-8)
  if (completionRate >= 90) score += 8;
  else if (completionRate >= 75) score += 6;
  else if (completionRate >= 50) score += 4;
  else if (completionRate >= 25) score += 2;

  // Child contribution (0-6)
  if (childContributionRate >= 90) score += 6;
  else if (childContributionRate >= 70) score += 4;
  else if (childContributionRate >= 50) score += 3;
  else if (childContributionRate >= 25) score += 1;

  // Diverse range (0-5)
  if (diverseRangeRate >= 80) score += 5;
  else if (diverseRangeRate >= 60) score += 3;
  else if (diverseRangeRate >= 40) score += 2;
  else if (diverseRangeRate >= 20) score += 1;

  // Barriers addressed (0-4)
  if (plansWithBarriers.length === 0) {
    // No barriers = full marks for this dimension
    score += 4;
  } else if (barriersAddressedRate >= 80) {
    score += 4;
  } else if (barriersAddressedRate >= 60) {
    score += 3;
  } else if (barriersAddressedRate >= 40) {
    score += 2;
  } else if (barriersAddressedRate >= 20) {
    score += 1;
  }

  // Current plans (0-2)
  if (currentPlanRate >= 80) score += 2;
  else if (currentPlanRate >= 50) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalPlans: total,
    currentPlanRate,
    completionRate,
    childContributionRate,
    diverseRangeRate,
    barriersAddressedRate,
    averageActivitiesPlanned,
  };
}

/**
 * Evaluates risk management quality.
 * Scoring: assessment rate (0-8), good/excellent outcome (0-6),
 * child view sought (0-4), dynamic assessment (0-4), benefits articulated (0-3).
 * Max score: 25. Empty data = 0 (no assessments = bad).
 */
export function evaluateRiskManagement(
  assessments: RiskBenefitAssessment[],
  activities: ActivityRecord[],
): RiskManagementResult {
  if (assessments.length === 0) {
    return {
      overallScore: 0,
      totalAssessments: 0,
      assessmentRate: 0,
      goodOrExcellentRate: 0,
      childViewRate: 0,
      dynamicAssessmentRate: 0,
      benefitsArticulatedRate: 0,
      averageHazards: 0,
    };
  }

  const total = assessments.length;

  // Assessment rate (pct of activities that have a risk assessment)
  const activitiesWithAssessment = activities.filter((a) =>
    a.riskBenefitAssessed,
  ).length;
  const assessmentRate = pct(activitiesWithAssessment, activities.length);

  // Good or excellent outcome rate
  const goodOrExcellent = assessments.filter(
    (a) => a.outcome === "good" || a.outcome === "excellent",
  ).length;
  const goodOrExcellentRate = pct(goodOrExcellent, total);

  // Child view sought rate
  const childView = assessments.filter((a) => a.childViewSought).length;
  const childViewRate = pct(childView, total);

  // Dynamic assessment rate
  const dynamic = assessments.filter((a) => a.dynamicAssessment).length;
  const dynamicAssessmentRate = pct(dynamic, total);

  // Benefits articulated rate
  const benefits = assessments.filter((a) => a.benefitsArticulated).length;
  const benefitsArticulatedRate = pct(benefits, total);

  // Average hazards
  const totalHazards = assessments.reduce(
    (sum, a) => sum + a.hazardsIdentified,
    0,
  );
  const averageHazards = Math.round((totalHazards / total) * 10) / 10;

  // Scoring
  let score = 0;

  // Assessment rate (0-8)
  if (assessmentRate >= 90) score += 8;
  else if (assessmentRate >= 75) score += 6;
  else if (assessmentRate >= 50) score += 4;
  else if (assessmentRate >= 25) score += 2;

  // Good/excellent outcome rate (0-6)
  if (goodOrExcellentRate >= 90) score += 6;
  else if (goodOrExcellentRate >= 70) score += 4;
  else if (goodOrExcellentRate >= 50) score += 3;
  else if (goodOrExcellentRate >= 30) score += 1;

  // Child view sought (0-4)
  if (childViewRate >= 80) score += 4;
  else if (childViewRate >= 60) score += 3;
  else if (childViewRate >= 40) score += 2;
  else if (childViewRate >= 20) score += 1;

  // Dynamic assessment (0-4)
  if (dynamicAssessmentRate >= 80) score += 4;
  else if (dynamicAssessmentRate >= 60) score += 3;
  else if (dynamicAssessmentRate >= 40) score += 2;
  else if (dynamicAssessmentRate >= 20) score += 1;

  // Benefits articulated (0-3)
  if (benefitsArticulatedRate >= 80) score += 3;
  else if (benefitsArticulatedRate >= 60) score += 2;
  else if (benefitsArticulatedRate >= 40) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalAssessments: total,
    assessmentRate,
    goodOrExcellentRate,
    childViewRate,
    dynamicAssessmentRate,
    benefitsArticulatedRate,
    averageHazards,
  };
}

/**
 * Evaluates staff readiness for outdoor and enrichment activities.
 * Scoring: first aid (0-8), activity leader trained (0-7),
 * risk assessment trained (0-5), safeguarding current (0-5).
 * Max score: 25. Empty data = 0.
 */
export function evaluateStaffReadiness(
  staff: StaffActivityTraining[],
): StaffReadinessResult {
  if (staff.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      firstAidRate: 0,
      activityLeaderRate: 0,
      riskAssessmentTrainedRate: 0,
      safeguardingRate: 0,
      averageQualifications: 0,
    };
  }

  const total = staff.length;

  // First aid rate
  const firstAidCount = staff.filter((s) => s.firstAidCurrent).length;
  const firstAidRate = pct(firstAidCount, total);

  // Activity leader rate
  const leaderCount = staff.filter((s) => s.activityLeaderTrained).length;
  const activityLeaderRate = pct(leaderCount, total);

  // Risk assessment trained rate
  const riskTrainedCount = staff.filter(
    (s) => s.riskAssessmentTrained,
  ).length;
  const riskAssessmentTrainedRate = pct(riskTrainedCount, total);

  // Safeguarding rate
  const safeguardingCount = staff.filter(
    (s) => s.safeguardingCurrent,
  ).length;
  const safeguardingRate = pct(safeguardingCount, total);

  // Average qualifications
  const totalQuals = staff.reduce(
    (sum, s) => sum + s.outdoorQualifications.length,
    0,
  );
  const averageQualifications =
    Math.round((totalQuals / total) * 10) / 10;

  // Scoring
  let score = 0;

  // First aid (0-8)
  if (firstAidRate >= 90) score += 8;
  else if (firstAidRate >= 70) score += 6;
  else if (firstAidRate >= 50) score += 4;
  else if (firstAidRate >= 25) score += 2;

  // Activity leader trained (0-7)
  if (activityLeaderRate >= 80) score += 7;
  else if (activityLeaderRate >= 60) score += 5;
  else if (activityLeaderRate >= 40) score += 3;
  else if (activityLeaderRate >= 20) score += 1;

  // Risk assessment trained (0-5)
  if (riskAssessmentTrainedRate >= 80) score += 5;
  else if (riskAssessmentTrainedRate >= 60) score += 3;
  else if (riskAssessmentTrainedRate >= 40) score += 2;
  else if (riskAssessmentTrainedRate >= 20) score += 1;

  // Safeguarding current (0-5)
  if (safeguardingRate >= 90) score += 5;
  else if (safeguardingRate >= 70) score += 3;
  else if (safeguardingRate >= 50) score += 2;
  else if (safeguardingRate >= 25) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalStaff: total,
    firstAidRate,
    activityLeaderRate,
    riskAssessmentTrainedRate,
    safeguardingRate,
    averageQualifications,
  };
}

// -- Child Profiles -----------------------------------------------------------

export function buildChildEnrichmentProfiles(
  activities: ActivityRecord[],
  plans: EnrichmentPlan[],
): ChildEnrichmentProfile[] {
  // Collect unique children from activities and plans
  const childMap = new Map<string, { id: string; name: string }>();
  for (const a of activities) {
    childMap.set(a.childId, { id: a.childId, name: a.childName });
  }
  for (const p of plans) {
    childMap.set(p.childId, { id: p.childId, name: p.childName });
  }

  return [...childMap.values()].map((child) => {
    const childActivities = activities.filter(
      (a) => a.childId === child.id,
    );
    const childPlans = plans.filter((p) => p.childId === child.id);

    const totalActivities = childActivities.length;

    // Outdoor rate
    const outdoorCount = childActivities.filter((a) => a.outdoors).length;
    const outdoorRate = pct(outdoorCount, totalActivities);

    // Choice rate
    const choiceCount = childActivities.filter((a) => a.childChose).length;
    const choiceRate = pct(choiceCount, totalActivities);

    // Engagement score (0-10 based on engagement distribution)
    let engagementScore = 0;
    if (totalActivities > 0) {
      const enthusiastic = childActivities.filter(
        (a) => a.childEngagement === "enthusiastic",
      ).length;
      const willing = childActivities.filter(
        (a) => a.childEngagement === "willing",
      ).length;
      const reluctant = childActivities.filter(
        (a) => a.childEngagement === "reluctant",
      ).length;
      const refused = childActivities.filter(
        (a) => a.childEngagement === "refused",
      ).length;

      // Weighted: enthusiastic=10, willing=7, reluctant=3, refused=0, not_offered=0
      const weightedSum =
        enthusiastic * 10 + willing * 7 + reluctant * 3 + refused * 0;
      engagementScore = Math.round((weightedSum / totalActivities) * 10) / 10;
      engagementScore = Math.min(engagementScore, 10);
    }

    // Plan completion rate
    const totalPlanned = childPlans.reduce(
      (sum, p) => sum + p.activitiesPlanned,
      0,
    );
    const totalCompleted = childPlans.reduce(
      (sum, p) => sum + p.activitiesCompleted,
      0,
    );
    const planCompletionRate = pct(totalCompleted, totalPlanned);

    // Overall score (0-10)
    let overallScore = 0;

    // Activity count (up to 2 points)
    if (totalActivities >= 5) overallScore += 2;
    else if (totalActivities >= 2) overallScore += 1;

    // Outdoor rate (up to 2 points)
    if (outdoorRate >= 60) overallScore += 2;
    else if (outdoorRate >= 30) overallScore += 1;

    // Choice rate (up to 2 points)
    if (choiceRate >= 60) overallScore += 2;
    else if (choiceRate >= 30) overallScore += 1;

    // Engagement (up to 2 points)
    if (engagementScore >= 7) overallScore += 2;
    else if (engagementScore >= 4) overallScore += 1;

    // Plan completion (up to 2 points)
    if (planCompletionRate >= 75) overallScore += 2;
    else if (planCompletionRate >= 40) overallScore += 1;

    return {
      childId: child.id,
      childName: child.name,
      totalActivities,
      outdoorRate,
      choiceRate,
      engagementScore,
      planCompletionRate,
      overallScore: Math.max(0, Math.min(overallScore, 10)),
    };
  });
}

// -- Strengths / Areas / Actions ----------------------------------------------

function generateStrengths(
  activity: ActivityParticipationResult,
  enrichment: EnrichmentQualityResult,
  risk: RiskManagementResult,
  staff: StaffReadinessResult,
): string[] {
  const strengths: string[] = [];

  if (activity.outdoorRate >= 70) {
    strengths.push(
      "Strong outdoor activity provision — children regularly experience the outdoors",
    );
  }

  if (activity.childChoiceRate >= 70) {
    strengths.push(
      "Excellent child choice rate — children are actively involved in selecting their activities",
    );
  }

  if (activity.communityRate >= 70) {
    strengths.push(
      "High proportion of community-based activities — promoting genuine community integration",
    );
  }

  if (activity.newExperienceRate >= 50) {
    strengths.push(
      "Good exposure to new experiences — children are being offered diverse opportunities",
    );
  }

  if (activity.engagementDistribution.enthusiastic > activity.engagementDistribution.reluctant + activity.engagementDistribution.refused) {
    strengths.push(
      "Positive engagement levels — most children are enthusiastic about their activities",
    );
  }

  if (enrichment.completionRate >= 80) {
    strengths.push(
      "High enrichment plan completion rate — planned activities are being delivered consistently",
    );
  }

  if (enrichment.childContributionRate >= 80) {
    strengths.push(
      "Children actively contribute to their enrichment plans — strong voice of the child",
    );
  }

  if (enrichment.diverseRangeRate >= 80) {
    strengths.push(
      "Enrichment plans include a diverse range of activities — promoting holistic development",
    );
  }

  if (risk.assessmentRate >= 80) {
    strengths.push(
      "Excellent risk-benefit assessment coverage — activities are properly assessed before delivery",
    );
  }

  if (risk.goodOrExcellentRate >= 80) {
    strengths.push(
      "Risk-benefit outcomes are predominantly good or excellent — effective risk management in place",
    );
  }

  if (risk.childViewRate >= 70) {
    strengths.push(
      "Children's views are sought in risk assessments — child-centred approach to safety",
    );
  }

  if (risk.dynamicAssessmentRate >= 70) {
    strengths.push(
      "Dynamic risk assessment is well-embedded — staff adapt to changing conditions effectively",
    );
  }

  if (staff.firstAidRate >= 80) {
    strengths.push(
      "High first aid coverage among staff — children's safety is well-supported",
    );
  }

  if (staff.activityLeaderRate >= 70) {
    strengths.push(
      "Good proportion of activity-leader-trained staff — capable of leading a range of activities",
    );
  }

  if (staff.safeguardingRate >= 90) {
    strengths.push(
      "All staff have current safeguarding training — robust safeguarding framework",
    );
  }

  return strengths;
}

function generateAreasForImprovement(
  activity: ActivityParticipationResult,
  enrichment: EnrichmentQualityResult,
  risk: RiskManagementResult,
  staff: StaffReadinessResult,
): string[] {
  const areas: string[] = [];

  if (activity.totalActivities === 0) {
    areas.push(
      "No activity records found — children must have regular access to enrichment activities",
    );
  }

  if (activity.outdoorRate < 40 && activity.totalActivities > 0) {
    areas.push(
      `Outdoor activity rate at ${activity.outdoorRate}% — more outdoor experiences are needed`,
    );
  }

  if (activity.childChoiceRate < 50 && activity.totalActivities > 0) {
    areas.push(
      `Child choice rate at ${activity.childChoiceRate}% — children should have greater say in activity selection`,
    );
  }

  if (activity.communityRate < 40 && activity.totalActivities > 0) {
    areas.push(
      `Only ${activity.communityRate}% of activities are community-based — more activities should take place outside the home`,
    );
  }

  if (activity.newExperienceRate < 20 && activity.totalActivities > 0) {
    areas.push(
      `New experience rate at ${activity.newExperienceRate}% — children need more exposure to new activities`,
    );
  }

  if (activity.engagementDistribution.refused > 0) {
    areas.push(
      `${activity.engagementDistribution.refused} activity refusal(s) recorded — explore underlying reasons and adapt provision`,
    );
  }

  if (enrichment.totalPlans === 0) {
    areas.push(
      "No enrichment plans recorded — each child should have an individualised enrichment plan",
    );
  }

  if (enrichment.completionRate < 50 && enrichment.totalPlans > 0) {
    areas.push(
      `Enrichment plan completion rate at ${enrichment.completionRate}% — planned activities need to be consistently delivered`,
    );
  }

  if (enrichment.childContributionRate < 50 && enrichment.totalPlans > 0) {
    areas.push(
      `Child contribution to plans at ${enrichment.childContributionRate}% — children should co-create their enrichment plans`,
    );
  }

  if (enrichment.diverseRangeRate < 50 && enrichment.totalPlans > 0) {
    areas.push(
      `Only ${enrichment.diverseRangeRate}% of plans include diverse activities — broader range of experiences needed`,
    );
  }

  if (risk.totalAssessments === 0) {
    areas.push(
      "No risk-benefit assessments recorded — all activities require proper risk-benefit assessment",
    );
  }

  if (risk.assessmentRate < 50 && risk.totalAssessments > 0) {
    areas.push(
      `Risk assessment coverage at ${risk.assessmentRate}% — more activities need formal risk-benefit assessment`,
    );
  }

  if (risk.childViewRate < 50 && risk.totalAssessments > 0) {
    areas.push(
      `Children's views sought in only ${risk.childViewRate}% of risk assessments — child voice must be central to risk management`,
    );
  }

  if (risk.dynamicAssessmentRate < 50 && risk.totalAssessments > 0) {
    areas.push(
      `Dynamic assessment used in only ${risk.dynamicAssessmentRate}% of cases — staff need to routinely adapt to changing conditions`,
    );
  }

  if (staff.totalStaff === 0) {
    areas.push(
      "No staff training records found — activity training must be tracked",
    );
  }

  if (staff.firstAidRate < 50 && staff.totalStaff > 0) {
    areas.push(
      `First aid coverage at ${staff.firstAidRate}% — more staff need current first aid certification`,
    );
  }

  if (staff.activityLeaderRate < 40 && staff.totalStaff > 0) {
    areas.push(
      `Activity leader training at ${staff.activityLeaderRate}% — more staff should be trained to lead activities`,
    );
  }

  if (staff.safeguardingRate < 80 && staff.totalStaff > 0) {
    areas.push(
      `Safeguarding currency at ${staff.safeguardingRate}% — all staff must have current safeguarding training`,
    );
  }

  return areas;
}

function generateActions(
  activity: ActivityParticipationResult,
  enrichment: EnrichmentQualityResult,
  risk: RiskManagementResult,
  staff: StaffReadinessResult,
): string[] {
  const actions: string[] = [];

  if (activity.totalActivities === 0) {
    actions.push(
      "URGENT: Develop and implement an activity programme — Reg 9 requires enrichment opportunities for every child",
    );
  }

  if (enrichment.totalPlans === 0) {
    actions.push(
      "URGENT: Create individualised enrichment plans for each child — plans must reflect interests and needs",
    );
  }

  if (risk.totalAssessments === 0) {
    actions.push(
      "URGENT: Implement risk-benefit assessment framework — all activities must be assessed before delivery",
    );
  }

  if (staff.totalStaff === 0) {
    actions.push(
      "URGENT: Establish staff activity training records — qualifications and currency must be tracked",
    );
  }

  if (staff.firstAidRate < 50 && staff.totalStaff > 0) {
    actions.push(
      "URGENT: Arrange first aid training — at least 50% of staff should hold current first aid certification",
    );
  }

  if (staff.safeguardingRate < 80 && staff.totalStaff > 0) {
    actions.push(
      "URGENT: Update safeguarding training — all staff leading activities must have current safeguarding certification",
    );
  }

  if (activity.outdoorRate < 40 && activity.totalActivities > 0) {
    actions.push(
      "Increase outdoor activity provision — schedule regular outdoor experiences each week",
    );
  }

  if (activity.childChoiceRate < 50 && activity.totalActivities > 0) {
    actions.push(
      "Enhance child choice — introduce activity menus and regular feedback sessions",
    );
  }

  if (activity.communityRate < 40 && activity.totalActivities > 0) {
    actions.push(
      "Expand community-based activities — identify local clubs, groups, and venues",
    );
  }

  if (enrichment.completionRate < 50 && enrichment.totalPlans > 0) {
    actions.push(
      "Improve enrichment plan delivery — review barriers to completion and allocate dedicated activity time",
    );
  }

  if (enrichment.childContributionRate < 50 && enrichment.totalPlans > 0) {
    actions.push(
      "Increase child participation in planning — use key-working sessions to co-create enrichment plans",
    );
  }

  if (risk.assessmentRate < 50 && risk.totalAssessments > 0) {
    actions.push(
      "Improve risk assessment coverage — embed risk-benefit assessment into the activity planning workflow",
    );
  }

  if (risk.childViewRate < 50 && risk.totalAssessments > 0) {
    actions.push(
      "Include children in risk assessments — seek their views on hazards, benefits, and controls",
    );
  }

  if (risk.dynamicAssessmentRate < 50 && risk.totalAssessments > 0) {
    actions.push(
      "Train staff in dynamic risk assessment — adapt to conditions on the day of activities",
    );
  }

  if (staff.activityLeaderRate < 40 && staff.totalStaff > 0) {
    actions.push(
      "Invest in activity leader training — equip staff to confidently lead outdoor and enrichment activities",
    );
  }

  return actions;
}

// -- Main Intelligence Function -----------------------------------------------

export function generateOutdoorActivityEnrichmentIntelligence(
  activities: ActivityRecord[],
  plans: EnrichmentPlan[],
  riskAssessments: RiskBenefitAssessment[],
  staff: StaffActivityTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): OutdoorActivityEnrichmentIntelligence {
  const activityResult = evaluateActivityParticipation(activities);
  const enrichmentResult = evaluateEnrichmentQuality(plans);
  const riskResult = evaluateRiskManagement(riskAssessments, activities);
  const staffResult = evaluateStaffReadiness(staff);

  const rawScore =
    activityResult.overallScore +
    enrichmentResult.overallScore +
    riskResult.overallScore +
    staffResult.overallScore;
  const overallScore = Math.max(0, Math.min(rawScore, 100));

  const childProfiles = buildChildEnrichmentProfiles(activities, plans);

  const strengths = generateStrengths(
    activityResult,
    enrichmentResult,
    riskResult,
    staffResult,
  );
  const areasForImprovement = generateAreasForImprovement(
    activityResult,
    enrichmentResult,
    riskResult,
    staffResult,
  );
  const actions = generateActions(
    activityResult,
    enrichmentResult,
    riskResult,
    staffResult,
  );

  const regulatoryLinks = [
    "CHR 2015 Reg 6 — quality of care standard including enrichment and outdoor activities",
    "CHR 2015 Reg 9 — enjoyment and achievement through diverse activity provision",
    "NMS 12 — promoting positive behaviour and development through structured activity",
    "SCCIF — experiences and progress of children in enrichment and outdoor activity",
    "UNCRC Article 31 — right to rest, leisure, play, and recreational activities",
    "Working Together 2023 — multi-agency guidance supporting safe activity provision",
    "CA 1989 s22(3)(a) — duty to safeguard and promote the welfare of looked-after children",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating: getRating(overallScore),
    activityParticipation: activityResult,
    enrichmentQuality: enrichmentResult,
    riskManagement: riskResult,
    staffReadiness: staffResult,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
