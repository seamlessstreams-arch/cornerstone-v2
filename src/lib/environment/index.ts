// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Environmental Safety & Maintenance — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateEnvironmentCompliance,
  calculateHomeEnvironmentMetrics,
  getCheckCategoryLabel,
  getMaintenancePriorityLabel,
  getMaintenanceStatusLabel,
} from "./environment-engine";

export type {
  CheckCategory,
  CheckStatus,
  MaintenancePriority,
  MaintenanceStatus,
  SafetyCheck,
  FireDrill,
  MaintenanceRequest,
  EnvironmentComplianceResult,
  HomeEnvironmentMetrics,
} from "./environment-engine";
