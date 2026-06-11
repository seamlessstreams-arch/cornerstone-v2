// ══════════════════════════════════════════════════════════════════════════════
// Cara Community Integration Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateActivityParticipation,
  evaluateSocialNetworks,
  evaluateBarrierManagement,
  evaluateInclusionOutcomes,
  buildChildCommunityProfiles,
  generateCommunityIntegrationIntelligence,
  getRating,
  getActivityCategoryLabel,
  getParticipationLevelLabel,
  getFriendshipQualityLabel,
  getCommunityBarrierLabel,
  getSocialMediaSafetyLabel,
  getRatingLabel,
} from "./community-integration-engine";

export type {
  ActivityCategory,
  ParticipationLevel,
  FriendshipQuality,
  CommunityBarrier,
  SocialMediaSafety,
  Rating,
  CommunityActivity,
  SocialNetwork,
  CommunityBarrierRecord,
  InclusionAssessment,
  ActivityParticipationResult,
  SocialNetworkResult,
  BarrierManagementResult,
  InclusionOutcomesResult,
  ChildCommunityProfile,
  CommunityIntegrationIntelligence,
} from "./community-integration-engine";
