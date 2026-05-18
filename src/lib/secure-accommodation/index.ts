// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Secure Accommodation Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateOrderCompliance,
  evaluateWelfareReviewQuality,
  evaluateChildWelfare,
  evaluateDischargePreparedness,
  buildChildSecureProfiles,
  generateSecureAccommodationIntelligence,
  getRating,
  getSecureOrderStatusLabel,
  getWelfareReviewStatusLabel,
  getReviewParticipantLabel,
  getRestrictionJustificationLabel,
  getProgressOutcomeLabel,
  getDischargeReadinessLabel,
} from "./secure-accommodation-engine";

export type {
  SecureOrderStatus,
  WelfareReviewStatus,
  ReviewParticipant,
  RestrictionJustification,
  ProgressOutcome,
  DischargeReadiness,
  Rating,
  SecureAccommodationOrder,
  WelfareReview,
  ChildWelfare,
  DischargeAssessment,
  OrderComplianceResult,
  WelfareReviewQualityResult,
  ChildWelfareResult,
  DischargePreparednessResult,
  ChildSecureProfile,
  SecureAccommodationIntelligence,
} from "./secure-accommodation-engine";
