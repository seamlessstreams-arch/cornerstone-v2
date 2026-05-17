// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Admissions & Impact Assessment — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateReferralCompliance,
  calculateHomeAdmissionsMetrics,
  getMatchingFactorLabel,
  getImpactLevelLabel,
} from "./admissions-engine";

export type {
  ReferralStatus,
  AdmissionType,
  MatchingFactor,
  ImpactLevel,
  AdmissionReferral,
  ImpactAssessment,
  ChildImpact,
  MatchingScore,
  ReferralComplianceResult,
  HomeAdmissionsMetrics,
} from "./admissions-engine";
