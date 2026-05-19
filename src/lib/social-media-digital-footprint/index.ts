// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Social Media & Digital Footprint Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateConsentManagement,
  evaluateDigitalIncidentResponse,
  evaluateDigitalPolicy,
  evaluateStaffDigitalReadiness,
  buildChildDigitalProfiles,
  generateSocialMediaDigitalFootprintIntelligence,
  getRating,
  getConsentTypeLabel,
  getConsentStatusLabel,
  getRiskCategoryLabel,
  getSeverityLabel,
  getRatingLabel,
} from "./social-media-digital-footprint-engine";

export type {
  ConsentType,
  ConsentStatus,
  RiskCategory,
  IncidentSeverity,
  Rating,
  ImageConsentRecord,
  DigitalSafetyIncident,
  DigitalSafetyPolicy,
  StaffDigitalTraining,
  ConsentManagementResult,
  DigitalIncidentResponseResult,
  DigitalPolicyResult,
  StaffDigitalReadinessResult,
  ChildDigitalProfile,
  SocialMediaDigitalFootprintIntelligence,
} from "./social-media-digital-footprint-engine";
