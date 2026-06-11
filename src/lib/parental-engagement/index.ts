// ══════════════════════════════════════════════════════════════════════════════
// Cara Parental Engagement Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateContactQuality,
  evaluateParentalSupport,
  evaluateFamilyPlanning,
  evaluateParentalFeedback,
  buildFamilyProfiles,
  generateParentalEngagementIntelligence,
  getRating,
  getContactTypeLabel,
  getContactOutcomeLabel,
  getEngagementLevelLabel,
  getSupportTypeLabel,
  getRelationshipLabel,
  getEffectivenessLabel,
} from "./parental-engagement-engine";

export type {
  ContactType,
  ContactOutcome,
  EngagementLevel,
  SupportType,
  Relationship,
  SupportEffectiveness,
  Rating,
  ContactRecord,
  ParentalSupportRecord,
  FamilyPlanRecord,
  ParentalFeedbackRecord,
  ContactQualityResult,
  ParentalSupportResult,
  FamilyPlanningResult,
  ParentalFeedbackResult,
  FamilyProfile,
  ParentalEngagementIntelligenceResult,
} from "./parental-engagement-engine";
