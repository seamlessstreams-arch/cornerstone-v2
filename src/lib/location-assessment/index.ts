// ═══════════════���══════════════════════════════════════════════════════════════
// Cornerstone Location Assessment — Public API
// ═══════���══════════════════════════════════════════════════════════════════════

export {
  evaluateLocationCompliance,
  calculateHomeLocationMetrics,
  getServiceLabel,
  getAreaRiskLabel,
  getRiskLevelLabel,
} from "./location-engine";

export type {
  RiskLevel,
  AssessmentStatus,
  ServiceCategory,
  AreaRiskCategory,
  LocalService,
  AreaRisk,
  NeighbourRelationship,
  LocationAssessment,
  ActionPlanItem,
  LocationComplianceResult,
  HomeLocationMetrics,
} from "./location-engine";
