// ==============================================================================
// Cornerstone Placement Matching Quality Intelligence — Public API
// ==============================================================================

export {
  evaluateMatchingProcess,
  evaluateCompatibility,
  evaluateStabilityOutcomes,
  evaluateDisruptionLearning,
  buildChildProfiles,
  generatePlacementMatchingQualityIntelligence,
  getMatchingOutcomeLabel,
  getStabilityIndicatorLabel,
  getImpactAssessmentStatusLabel,
  getConsultationStatusLabel,
  getMatchingCriteriaLabel,
  getRatingLabel,
} from "./placement-matching-quality-engine";

export type {
  MatchingCriteria,
  MatchingOutcome,
  ImpactAssessmentStatus,
  ConsultationStatus,
  StabilityIndicator,
  Rating,
  PlacementMatch,
  CompatibilityReview,
  PlacementStability,
  DisruptionRecord,
  MatchingProcessResult,
  CompatibilityResult,
  StabilityOutcomeResult,
  DisruptionLearningResult,
  ChildPlacementProfile,
  PlacementMatchingQualityIntelligence,
} from "./placement-matching-quality-engine";
