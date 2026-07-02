// ══════════════════════════════════════════════════════════════════════════════
// Cara Staff Deployment Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateStaffingAdequacy,
  evaluateAgencyMinimisation,
  evaluateConsistencyOfCare,
  evaluateRotaCompliance,
  evaluateIncidentManagement,
  generateStaffDeploymentIntelligence,
} from "./staff-deployment-engine";

export type {
  StaffRole,
  ShiftType,
  DeploymentStatus,
  OverallRating,
  StaffMember,
  ShiftRota,
  AgencyUsage,
  StaffingIncident,
  ConsistencyRecord,
  StaffingAdequacyResult,
  AgencyMinimisationResult,
  ConsistencyOfCareResult,
  ChildConsistencyDetail,
  RotaComplianceResult,
  IncidentManagementResult,
  RegulatoryLink,
  StaffDeploymentProfile,
  StaffDeploymentIntelligence,
} from "./staff-deployment-engine";
