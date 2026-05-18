// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Community Integration Intelligence Engine
//
// Evaluates how well children are integrated into their local community
// through activities, social networks, and participation.
//
// Regulatory basis:
//   - CHR 2015 Reg 6 (quality of care standard — health, education, wellbeing)
//   - CHR 2015 Reg 7 (children's views, wishes, and feelings)
//   - SCCIF (experiences and progress of children)
//   - UNCRC Article 31 (right to play, leisure, and cultural life)
//   - NMS 7 (leisure activities)
//   - NMS 10 (enjoying and achieving)
//   - Equality Act 2010 (access without discrimination)
//
// Pure deterministic engine — no AI, no external calls.
// ══════════════════════════════════════════════════════════════════════════════

// ── Type Definitions ─────────────────────────────────────────────────────────

export type ActivityCategory =
  | "sport"
  | "arts_culture"
  | "music"
  | "faith"
  | "volunteering"
  | "youth_group"
  | "social_club"
  | "employment"
  | "training"
  | "community_event";

export type ParticipationLevel =
  | "regular"
  | "occasional"
  | "tried_once"
  | "refused"
  | "not_offered";

export type FriendshipQuality =
  | "strong"
  | "developing"
  | "limited"
  | "isolated"
  | "not_assessed";

export type CommunityBarrier =
  | "transport"
  | "cost"
  | "stigma"
  | "behaviour"
  | "risk_assessment"
  | "staffing"
  | "location"
  | "none";

export type SocialMediaSafety =
  | "safe_and_supported"
  | "some_concerns"
  | "significant_risk"
  | "not_applicable";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// ── Input Interfaces ─────────────────────────────────────────────────────────

export interface CommunityActivity {
  id: string;
  childId: string;
  childName: string;
  activityCategory: ActivityCategory;
  activityName: string;
  participationLevel: ParticipationLevel;
  frequency: "weekly" | "fortnightly" | "monthly" | "ad_hoc";
  startDate: string;
  childEnjoys: boolean;
  staffSupported: boolean;
  independentAttendance: boolean;
  communityBased: boolean;
}

export interface SocialNetwork {
  id: string;
  childId: string;
  childName: string;
  friendshipQuality: FriendshipQuality;
  numberOfFriends: number;
  friendsOutsideCare: boolean;
  socialMediaSafety: SocialMediaSafety;
  communityMentor: boolean;
  regularSocialActivities: number;
}

export interface CommunityBarrierRecord {
  id: string;
  childId: string;
  childName: string;
  barrier: CommunityBarrier;
  barrierDescription: string;
  actionTaken: boolean;
  resolved: boolean;
}

export interface InclusionAssessment {
  id: string;
  childId: string;
  childName: string;
  feelsPartOfCommunity: boolean;
  accessToLocalAmenities: boolean;
  positiveLocalRelationships: boolean;
  stigmaExperienced: boolean;
  independentTravelSkills: boolean;
  assessedDate: string;
  assessedBy: string;
}

// ── Result Interfaces ────────────────────────────────────────────────────────

export interface ActivityParticipationResult {
  overallScore: number; // 0-25
  totalActivities: number;
  regularParticipationRate: number;
  activityVariety: number;
  communityBasedRate: number;
  enjoymentRate: number;
  independentAttendanceRate: number;
}

export interface SocialNetworkResult {
  overallScore: number; // 0-25
  totalNetworks: number;
  friendshipQualityRate: number;
  friendsOutsideCareRate: number;
  mentorRate: number;
  socialMediaSafetyRate: number;
}

export interface BarrierManagementResult {
  overallScore: number; // 0-25
  totalBarriers: number;
  resolutionRate: number;
  actionTakenRate: number;
}

export interface InclusionOutcomesResult {
  overallScore: number; // 0-25
  totalAssessments: number;
  communityBelongingRate: number;
  amenityAccessRate: number;
  positiveRelationshipsRate: number;
  independentTravelRate: number;
}

export interface ChildCommunityProfile {
  childId: string;
  childName: string;
  activityCount: number;
  regularActivityCount: number;
  friendshipQuality: FriendshipQuality | "no_data";
  barriersCount: number;
  barriersResolvedCount: number;
  feelsPartOfCommunity: boolean | null;
  overallScore: number; // 0-10
}

export interface CommunityIntegrationIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  activityParticipation: ActivityParticipationResult;
  socialNetworks: SocialNetworkResult;
  barrierManagement: BarrierManagementResult;
  inclusionOutcomes: InclusionOutcomesResult;
  childProfiles: ChildCommunityProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// ── Label Maps ──────────────────────────────────────────────────────────────

const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  sport: "Sport",
  arts_culture: "Arts & Culture",
  music: "Music",
  faith: "Faith",
  volunteering: "Volunteering",
  youth_group: "Youth Group",
  social_club: "Social Club",
  employment: "Employment",
  training: "Training",
  community_event: "Community Event",
};

const PARTICIPATION_LEVEL_LABELS: Record<ParticipationLevel, string> = {
  regular: "Regular",
  occasional: "Occasional",
  tried_once: "Tried Once",
  refused: "Refused",
  not_offered: "Not Offered",
};

const FRIENDSHIP_QUALITY_LABELS: Record<FriendshipQuality, string> = {
  strong: "Strong",
  developing: "Developing",
  limited: "Limited",
  isolated: "Isolated",
  not_assessed: "Not Assessed",
};

const COMMUNITY_BARRIER_LABELS: Record<CommunityBarrier, string> = {
  transport: "Transport",
  cost: "Cost",
  stigma: "Stigma",
  behaviour: "Behaviour",
  risk_assessment: "Risk Assessment",
  staffing: "Staffing",
  location: "Location",
  none: "None",
};

const SOCIAL_MEDIA_SAFETY_LABELS: Record<SocialMediaSafety, string> = {
  safe_and_supported: "Safe and Supported",
  some_concerns: "Some Concerns",
  significant_risk: "Significant Risk",
  not_applicable: "Not Applicable",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

// ── Label Functions ──────────────────────────────────────────────────────────

export function getActivityCategoryLabel(c: ActivityCategory): string {
  return ACTIVITY_CATEGORY_LABELS[c] ?? c;
}

export function getParticipationLevelLabel(p: ParticipationLevel): string {
  return PARTICIPATION_LEVEL_LABELS[p] ?? p;
}

export function getFriendshipQualityLabel(q: FriendshipQuality): string {
  return FRIENDSHIP_QUALITY_LABELS[q] ?? q;
}

export function getCommunityBarrierLabel(b: CommunityBarrier): string {
  return COMMUNITY_BARRIER_LABELS[b] ?? b;
}

export function getSocialMediaSafetyLabel(s: SocialMediaSafety): string {
  return SOCIAL_MEDIA_SAFETY_LABELS[s] ?? s;
}

export function getRatingLabel(r: Rating): string {
  return RATING_LABELS[r] ?? r;
}

// ── Utility ──────────────────────────────────────────────────────────────────

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// ── Evaluation Functions ─────────────────────────────────────────────────────

/**
 * Evaluates activity participation across children.
 * Considers: regular participation rate, activity variety, community-based rate,
 * enjoyment rate, independent attendance.
 * Max score: 25
 */
export function evaluateActivityParticipation(
  activities: CommunityActivity[],
): ActivityParticipationResult {
  if (activities.length === 0) {
    return {
      overallScore: 0,
      totalActivities: 0,
      regularParticipationRate: 0,
      activityVariety: 0,
      communityBasedRate: 0,
      enjoymentRate: 0,
      independentAttendanceRate: 0,
    };
  }

  let score = 0;

  // Regular participation rate
  const regular = activities.filter(
    (a) => a.participationLevel === "regular",
  ).length;
  const regularParticipationRate = pct(regular, activities.length);
  // +7 for >= 80%, +5 for >= 60%, +3 for >= 40%
  if (regularParticipationRate >= 80) score += 7;
  else if (regularParticipationRate >= 60) score += 5;
  else if (regularParticipationRate >= 40) score += 3;

  // Activity variety (unique categories)
  const uniqueCategories = new Set(activities.map((a) => a.activityCategory));
  const activityVariety = uniqueCategories.size;
  // +5 for >= 5 types, +3 for >= 3, +1 for >= 1
  if (activityVariety >= 5) score += 5;
  else if (activityVariety >= 3) score += 3;
  else if (activityVariety >= 1) score += 1;

  // Community-based rate
  const communityBased = activities.filter((a) => a.communityBased).length;
  const communityBasedRate = pct(communityBased, activities.length);
  // +5 for >= 80%, +3 for >= 60%, +1 for >= 40%
  if (communityBasedRate >= 80) score += 5;
  else if (communityBasedRate >= 60) score += 3;
  else if (communityBasedRate >= 40) score += 1;

  // Enjoyment rate
  const enjoyed = activities.filter((a) => a.childEnjoys).length;
  const enjoymentRate = pct(enjoyed, activities.length);
  // +4 for >= 80%, +2 for >= 60%
  if (enjoymentRate >= 80) score += 4;
  else if (enjoymentRate >= 60) score += 2;

  // Independent attendance rate
  const independent = activities.filter(
    (a) => a.independentAttendance,
  ).length;
  const independentAttendanceRate = pct(independent, activities.length);
  // +4 for >= 50%, +2 for >= 25%
  if (independentAttendanceRate >= 50) score += 4;
  else if (independentAttendanceRate >= 25) score += 2;

  return {
    overallScore: Math.min(score, 25),
    totalActivities: activities.length,
    regularParticipationRate,
    activityVariety,
    communityBasedRate,
    enjoymentRate,
    independentAttendanceRate,
  };
}

/**
 * Evaluates the quality of children's social networks.
 * Considers: friendship quality, friends outside care, mentor rate, social media safety.
 * Max score: 25
 */
export function evaluateSocialNetworks(
  networks: SocialNetwork[],
): SocialNetworkResult {
  if (networks.length === 0) {
    return {
      overallScore: 0,
      totalNetworks: 0,
      friendshipQualityRate: 0,
      friendsOutsideCareRate: 0,
      mentorRate: 0,
      socialMediaSafetyRate: 0,
    };
  }

  let score = 0;
  const total = networks.length;

  // Friendship quality rate (strong or developing)
  const goodFriendships = networks.filter(
    (n) =>
      n.friendshipQuality === "strong" || n.friendshipQuality === "developing",
  ).length;
  const friendshipQualityRate = pct(goodFriendships, total);
  // +8 for >= 80%, +5 for >= 60%, +3 for >= 40%
  if (friendshipQualityRate >= 80) score += 8;
  else if (friendshipQualityRate >= 60) score += 5;
  else if (friendshipQualityRate >= 40) score += 3;

  // Friends outside care rate
  const outsideCare = networks.filter((n) => n.friendsOutsideCare).length;
  const friendsOutsideCareRate = pct(outsideCare, total);
  // +6 for >= 70%, +4 for >= 50%, +2 for >= 30%
  if (friendsOutsideCareRate >= 70) score += 6;
  else if (friendsOutsideCareRate >= 50) score += 4;
  else if (friendsOutsideCareRate >= 30) score += 2;

  // Mentor rate
  const mentored = networks.filter((n) => n.communityMentor).length;
  const mentorRate = pct(mentored, total);
  // +5 for >= 50%, +3 for >= 25%
  if (mentorRate >= 50) score += 5;
  else if (mentorRate >= 25) score += 3;

  // Social media safety rate (safe_and_supported or not_applicable)
  const safeSocial = networks.filter(
    (n) =>
      n.socialMediaSafety === "safe_and_supported" ||
      n.socialMediaSafety === "not_applicable",
  ).length;
  const socialMediaSafetyRate = pct(safeSocial, total);
  // +6 for >= 90%, +4 for >= 70%, +2 for >= 50%
  if (socialMediaSafetyRate >= 90) score += 6;
  else if (socialMediaSafetyRate >= 70) score += 4;
  else if (socialMediaSafetyRate >= 50) score += 2;

  return {
    overallScore: Math.min(score, 25),
    totalNetworks: total,
    friendshipQualityRate,
    friendsOutsideCareRate,
    mentorRate,
    socialMediaSafetyRate,
  };
}

/**
 * Evaluates how well barriers to community participation are managed.
 * Considers: barriers identified, resolution rate, action taken rate.
 * If no barriers exist, score is 25 (no barriers = excellent).
 * Max score: 25
 */
export function evaluateBarrierManagement(
  barriers: CommunityBarrierRecord[],
): BarrierManagementResult {
  // Filter out "none" barriers — they are not real barriers
  const realBarriers = barriers.filter((b) => b.barrier !== "none");

  if (realBarriers.length === 0) {
    return {
      overallScore: 25,
      totalBarriers: 0,
      resolutionRate: 0,
      actionTakenRate: 0,
    };
  }

  let score = 0;

  // Resolution rate
  const resolved = realBarriers.filter((b) => b.resolved).length;
  const resolutionRate = pct(resolved, realBarriers.length);
  // +10 for >= 80%, +7 for >= 60%, +4 for >= 40%, +2 for >= 20%
  if (resolutionRate >= 80) score += 10;
  else if (resolutionRate >= 60) score += 7;
  else if (resolutionRate >= 40) score += 4;
  else if (resolutionRate >= 20) score += 2;

  // Action taken rate
  const actionTaken = realBarriers.filter((b) => b.actionTaken).length;
  const actionTakenRate = pct(actionTaken, realBarriers.length);
  // +10 for >= 90%, +7 for >= 70%, +4 for >= 50%, +2 for >= 30%
  if (actionTakenRate >= 90) score += 10;
  else if (actionTakenRate >= 70) score += 7;
  else if (actionTakenRate >= 50) score += 4;
  else if (actionTakenRate >= 30) score += 2;

  // Bonus for having barriers identified (proactive identification is good)
  // +5 if barriers exist and action rate >= 70% (shows proactive management)
  if (realBarriers.length > 0 && actionTakenRate >= 70) score += 5;
  else if (realBarriers.length > 0 && actionTakenRate >= 50) score += 3;

  return {
    overallScore: Math.min(score, 25),
    totalBarriers: realBarriers.length,
    resolutionRate,
    actionTakenRate,
  };
}

/**
 * Evaluates inclusion outcomes from assessment data.
 * Considers: community belonging, amenity access, positive relationships,
 * independent travel skills.
 * Max score: 25
 */
export function evaluateInclusionOutcomes(
  assessments: InclusionAssessment[],
): InclusionOutcomesResult {
  if (assessments.length === 0) {
    return {
      overallScore: 0,
      totalAssessments: 0,
      communityBelongingRate: 0,
      amenityAccessRate: 0,
      positiveRelationshipsRate: 0,
      independentTravelRate: 0,
    };
  }

  let score = 0;
  const total = assessments.length;

  // Community belonging rate
  const belonging = assessments.filter(
    (a) => a.feelsPartOfCommunity,
  ).length;
  const communityBelongingRate = pct(belonging, total);
  // +7 for >= 80%, +5 for >= 60%, +3 for >= 40%
  if (communityBelongingRate >= 80) score += 7;
  else if (communityBelongingRate >= 60) score += 5;
  else if (communityBelongingRate >= 40) score += 3;

  // Amenity access rate
  const amenityAccess = assessments.filter(
    (a) => a.accessToLocalAmenities,
  ).length;
  const amenityAccessRate = pct(amenityAccess, total);
  // +6 for >= 90%, +4 for >= 70%, +2 for >= 50%
  if (amenityAccessRate >= 90) score += 6;
  else if (amenityAccessRate >= 70) score += 4;
  else if (amenityAccessRate >= 50) score += 2;

  // Positive relationships rate
  const positiveRels = assessments.filter(
    (a) => a.positiveLocalRelationships,
  ).length;
  const positiveRelationshipsRate = pct(positiveRels, total);
  // +6 for >= 80%, +4 for >= 60%, +2 for >= 40%
  if (positiveRelationshipsRate >= 80) score += 6;
  else if (positiveRelationshipsRate >= 60) score += 4;
  else if (positiveRelationshipsRate >= 40) score += 2;

  // Independent travel skills rate
  const independentTravel = assessments.filter(
    (a) => a.independentTravelSkills,
  ).length;
  const independentTravelRate = pct(independentTravel, total);
  // +6 for >= 70%, +4 for >= 50%, +2 for >= 30%
  if (independentTravelRate >= 70) score += 6;
  else if (independentTravelRate >= 50) score += 4;
  else if (independentTravelRate >= 30) score += 2;

  return {
    overallScore: Math.min(score, 25),
    totalAssessments: total,
    communityBelongingRate,
    amenityAccessRate,
    positiveRelationshipsRate,
    independentTravelRate,
  };
}

// ── Child Profiles ───────────────────────────────────────────────────────────

export function buildChildCommunityProfiles(
  activities: CommunityActivity[],
  networks: SocialNetwork[],
  barriers: CommunityBarrierRecord[],
  assessments: InclusionAssessment[],
): ChildCommunityProfile[] {
  // Collect all unique child IDs across all data sources
  const childMap = new Map<string, { id: string; name: string }>();
  for (const a of activities) {
    childMap.set(a.childId, { id: a.childId, name: a.childName });
  }
  for (const n of networks) {
    childMap.set(n.childId, { id: n.childId, name: n.childName });
  }
  for (const b of barriers) {
    childMap.set(b.childId, { id: b.childId, name: b.childName });
  }
  for (const a of assessments) {
    childMap.set(a.childId, { id: a.childId, name: a.childName });
  }

  return [...childMap.values()].map((child) => {
    const childActivities = activities.filter(
      (a) => a.childId === child.id,
    );
    const childNetworks = networks.filter((n) => n.childId === child.id);
    const childBarriers = barriers.filter(
      (b) => b.childId === child.id && b.barrier !== "none",
    );
    const childAssessments = assessments.filter(
      (a) => a.childId === child.id,
    );

    const activityCount = childActivities.length;
    const regularActivityCount = childActivities.filter(
      (a) => a.participationLevel === "regular",
    ).length;

    // Friendship quality from the network record (take the first if multiple)
    const friendshipQuality: FriendshipQuality | "no_data" =
      childNetworks.length > 0 ? childNetworks[0].friendshipQuality : "no_data";

    const barriersCount = childBarriers.length;
    const barriersResolvedCount = childBarriers.filter(
      (b) => b.resolved,
    ).length;

    // Community belonging from the latest assessment
    const latestAssessment =
      childAssessments.length > 0 ? childAssessments[childAssessments.length - 1] : null;
    const feelsPartOfCommunity = latestAssessment
      ? latestAssessment.feelsPartOfCommunity
      : null;

    // Profile score 0-10
    let profileScore = 0;

    // Activities (up to 3 points)
    if (regularActivityCount >= 3) profileScore += 3;
    else if (regularActivityCount >= 2) profileScore += 2;
    else if (regularActivityCount >= 1) profileScore += 1;

    // Friendship quality (up to 2 points)
    if (friendshipQuality === "strong") profileScore += 2;
    else if (friendshipQuality === "developing") profileScore += 1;

    // Barriers managed (up to 2 points)
    if (barriersCount === 0) {
      profileScore += 2;
    } else if (barriersCount > 0 && barriersResolvedCount === barriersCount) {
      profileScore += 2;
    } else if (barriersCount > 0 && barriersResolvedCount > 0) {
      profileScore += 1;
    }

    // Community belonging (up to 2 points)
    if (feelsPartOfCommunity === true) profileScore += 2;

    // Friends outside care bonus (1 point)
    const hasOutsideFriends = childNetworks.some(
      (n) => n.friendsOutsideCare,
    );
    if (hasOutsideFriends) profileScore += 1;

    return {
      childId: child.id,
      childName: child.name,
      activityCount,
      regularActivityCount,
      friendshipQuality,
      barriersCount,
      barriersResolvedCount,
      feelsPartOfCommunity,
      overallScore: Math.max(0, Math.min(profileScore, 10)),
    };
  });
}

// ── Strengths / Areas / Actions ──────────────────────────────────────────────

function generateStrengths(
  activity: ActivityParticipationResult,
  social: SocialNetworkResult,
  barrier: BarrierManagementResult,
  inclusion: InclusionOutcomesResult,
): string[] {
  const strengths: string[] = [];

  if (activity.regularParticipationRate >= 70) {
    strengths.push(
      "Strong regular participation rate — children are consistently engaged in community activities",
    );
  }

  if (activity.activityVariety >= 5) {
    strengths.push(
      "Excellent variety of community activities — children have diverse opportunities",
    );
  }

  if (activity.communityBasedRate >= 80) {
    strengths.push(
      "Majority of activities take place in the community — promoting genuine integration",
    );
  }

  if (activity.enjoymentRate >= 85) {
    strengths.push(
      "High enjoyment rate — children genuinely enjoy their community activities",
    );
  }

  if (activity.independentAttendanceRate >= 50) {
    strengths.push(
      "Good independent attendance rate — children are developing autonomy in community participation",
    );
  }

  if (social.friendshipQualityRate >= 80) {
    strengths.push(
      "Strong friendship quality across children — positive peer relationships evident",
    );
  }

  if (social.friendsOutsideCareRate >= 70) {
    strengths.push(
      "Most children have friends outside the care system — reducing isolation and stigma",
    );
  }

  if (social.mentorRate >= 50) {
    strengths.push(
      "Strong mentoring provision — children benefit from positive community role models",
    );
  }

  if (social.socialMediaSafetyRate >= 90) {
    strengths.push(
      "Social media use is safe and well-supported across children",
    );
  }

  if (barrier.totalBarriers === 0) {
    strengths.push(
      "No barriers to community participation identified — excellent access",
    );
  }

  if (barrier.totalBarriers > 0 && barrier.resolutionRate >= 80) {
    strengths.push(
      "High barrier resolution rate — the home proactively addresses obstacles to participation",
    );
  }

  if (inclusion.communityBelongingRate >= 80) {
    strengths.push(
      "Most children feel part of their local community — strong sense of belonging",
    );
  }

  if (inclusion.positiveRelationshipsRate >= 80) {
    strengths.push(
      "Children have positive relationships with local community members",
    );
  }

  if (inclusion.independentTravelRate >= 70) {
    strengths.push(
      "Good independent travel skills — children can access the community independently",
    );
  }

  return strengths;
}

function generateAreasForImprovement(
  activity: ActivityParticipationResult,
  social: SocialNetworkResult,
  barrier: BarrierManagementResult,
  inclusion: InclusionOutcomesResult,
): string[] {
  const areas: string[] = [];

  if (activity.totalActivities === 0) {
    areas.push(
      "No community activities recorded — children should have regular access to community-based activities",
    );
  }

  if (
    activity.regularParticipationRate < 50 &&
    activity.totalActivities > 0
  ) {
    areas.push(
      `Only ${activity.regularParticipationRate}% of activities have regular participation — consistency needs improvement`,
    );
  }

  if (activity.communityBasedRate < 60 && activity.totalActivities > 0) {
    areas.push(
      `Only ${activity.communityBasedRate}% of activities are community-based — more activities should take place outside the home`,
    );
  }

  if (activity.enjoymentRate < 60 && activity.totalActivities > 0) {
    areas.push(
      `Child enjoyment rate at ${activity.enjoymentRate}% — activities should better reflect children's interests`,
    );
  }

  if (
    activity.independentAttendanceRate < 25 &&
    activity.totalActivities > 0
  ) {
    areas.push(
      `Only ${activity.independentAttendanceRate}% of activities attended independently — more support for independence needed`,
    );
  }

  if (social.totalNetworks === 0) {
    areas.push(
      "No social network assessments recorded — children's friendships and social connections should be assessed",
    );
  }

  if (social.friendshipQualityRate < 50 && social.totalNetworks > 0) {
    areas.push(
      `Friendship quality rate at ${social.friendshipQualityRate}% — children need support to develop stronger peer relationships`,
    );
  }

  if (social.friendsOutsideCareRate < 50 && social.totalNetworks > 0) {
    areas.push(
      `Only ${social.friendsOutsideCareRate}% of children have friends outside care — reducing isolation should be a priority`,
    );
  }

  if (social.socialMediaSafetyRate < 70 && social.totalNetworks > 0) {
    areas.push(
      `Social media safety rate at ${social.socialMediaSafetyRate}% — online safety support needs strengthening`,
    );
  }

  if (barrier.totalBarriers > 0 && barrier.actionTakenRate < 70) {
    areas.push(
      `Action taken on only ${barrier.actionTakenRate}% of identified barriers — barriers need more active management`,
    );
  }

  if (barrier.totalBarriers > 0 && barrier.resolutionRate < 50) {
    areas.push(
      `Barrier resolution rate at ${barrier.resolutionRate}% — more barriers need to be resolved`,
    );
  }

  if (inclusion.totalAssessments === 0) {
    areas.push(
      "No inclusion assessments completed — regular assessment of community integration outcomes is needed",
    );
  }

  if (
    inclusion.communityBelongingRate < 60 &&
    inclusion.totalAssessments > 0
  ) {
    areas.push(
      `Only ${inclusion.communityBelongingRate}% of children feel part of their community — belonging needs attention`,
    );
  }

  if (
    inclusion.amenityAccessRate < 70 &&
    inclusion.totalAssessments > 0
  ) {
    areas.push(
      `Access to local amenities at ${inclusion.amenityAccessRate}% — children should have good access to community facilities`,
    );
  }

  return areas;
}

function generateActions(
  activity: ActivityParticipationResult,
  social: SocialNetworkResult,
  barrier: BarrierManagementResult,
  inclusion: InclusionOutcomesResult,
): string[] {
  const actions: string[] = [];

  if (activity.totalActivities === 0) {
    actions.push(
      "URGENT: Implement community activity programme — Reg 6 requires children to have access to community-based activities",
    );
  }

  if (social.totalNetworks === 0) {
    actions.push(
      "URGENT: Assess children's social networks — friendships and social connections must be actively supported",
    );
  }

  if (inclusion.totalAssessments === 0) {
    actions.push(
      "URGENT: Complete inclusion assessments for all children — community integration outcomes must be monitored",
    );
  }

  if (
    activity.regularParticipationRate < 50 &&
    activity.totalActivities > 0
  ) {
    actions.push(
      "Increase regular participation — review activity schedules and support children to attend consistently",
    );
  }

  if (activity.activityVariety < 3 && activity.totalActivities > 0) {
    actions.push(
      "Broaden the range of community activities — explore sport, arts, volunteering, and youth groups",
    );
  }

  if (
    activity.communityBasedRate < 60 &&
    activity.totalActivities > 0
  ) {
    actions.push(
      "Increase proportion of community-based activities — activities should happen in local venues, not just the home",
    );
  }

  if (social.friendsOutsideCareRate < 50 && social.totalNetworks > 0) {
    actions.push(
      "Support children to develop friendships outside care — facilitate social opportunities and sleepovers",
    );
  }

  if (social.socialMediaSafetyRate < 70 && social.totalNetworks > 0) {
    actions.push(
      "Review social media safety — ensure all children have appropriate online safety support",
    );
  }

  if (barrier.totalBarriers > 0 && barrier.actionTakenRate < 70) {
    actions.push(
      "Address unmanaged barriers — develop action plans for each identified barrier to community participation",
    );
  }

  if (
    inclusion.communityBelongingRate < 60 &&
    inclusion.totalAssessments > 0
  ) {
    actions.push(
      "Focus on community belonging — use 1:1 key-working sessions to explore how children can feel more connected",
    );
  }

  if (
    inclusion.independentTravelRate < 50 &&
    inclusion.totalAssessments > 0
  ) {
    actions.push(
      "Develop independent travel training — support children to travel safely and independently in their community",
    );
  }

  return actions;
}

// ── Main Intelligence Function ───────────────────────────────────────────────

export function generateCommunityIntegrationIntelligence(
  activities: CommunityActivity[],
  networks: SocialNetwork[],
  barriers: CommunityBarrierRecord[],
  assessments: InclusionAssessment[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): CommunityIntegrationIntelligence {
  const activityResult = evaluateActivityParticipation(activities);
  const socialResult = evaluateSocialNetworks(networks);
  const barrierResult = evaluateBarrierManagement(barriers);
  const inclusionResult = evaluateInclusionOutcomes(assessments);

  const overallScore =
    activityResult.overallScore +
    socialResult.overallScore +
    barrierResult.overallScore +
    inclusionResult.overallScore;

  const childProfiles = buildChildCommunityProfiles(
    activities,
    networks,
    barriers,
    assessments,
  );

  const strengths = generateStrengths(
    activityResult,
    socialResult,
    barrierResult,
    inclusionResult,
  );
  const areasForImprovement = generateAreasForImprovement(
    activityResult,
    socialResult,
    barrierResult,
    inclusionResult,
  );
  const actions = generateActions(
    activityResult,
    socialResult,
    barrierResult,
    inclusionResult,
  );

  const regulatoryLinks = [
    "CHR 2015 Reg 6 — quality of care standard including community participation",
    "CHR 2015 Reg 7 — children's views, wishes, and feelings about their community",
    "SCCIF — experiences and progress of children in community integration",
    "UNCRC Article 31 — right to rest, leisure, play, and participation in cultural life",
    "NMS 7 — leisure activities supporting community engagement",
    "NMS 10 — enjoying and achieving in the wider community",
    "Equality Act 2010 — access to community activities without discrimination",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore: Math.min(overallScore, 100),
    rating: getRating(overallScore),
    activityParticipation: activityResult,
    socialNetworks: socialResult,
    barrierManagement: barrierResult,
    inclusionOutcomes: inclusionResult,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
