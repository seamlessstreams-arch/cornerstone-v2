// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Children's Privacy & Confidentiality — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateChildPrivacyCompliance,
  calculateHomePrivacyMetrics,
  getPrivacyDomainLabel,
  getIncidentTypeLabel,
} from "./privacy-engine";

export type {
  PrivacyDomain,
  ComplianceLevel,
  IncidentType,
  PrivacyAssessment,
  PrivacyIncident,
  ChildPrivacyProfile,
  PrivacyComplianceResult,
  HomePrivacyMetrics,
} from "./privacy-engine";
