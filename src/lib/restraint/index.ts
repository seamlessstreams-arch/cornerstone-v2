// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Restraint & Physical Intervention — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateRestraintCompliance,
  calculateHomeRestraintMetrics,
  getInterventionTypeLabel,
  getDeEscalationLabel,
} from "./restraint-engine";

export type {
  InterventionType,
  ApprovedTechnique,
  DeEscalationMethod,
  PostIncidentAction,
  RestraintRecord,
  StaffInvolvement,
  InjuryRecord,
  PostIncidentRecord,
  HomeRestraintProfile,
  RestraintComplianceResult,
  HomeRestraintMetrics,
} from "./restraint-engine";
