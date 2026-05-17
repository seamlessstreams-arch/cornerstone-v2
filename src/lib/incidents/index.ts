// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Incidents & Restraint — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateIncidentCompliance,
  analyzeRestraints,
  calculateIncidentMetrics,
  getSeverityLabel,
  getCategoryLabel,
  getRestraintTypeLabel,
} from "./incident-engine";

export type {
  IncidentCategory,
  IncidentSeverity,
  RestraintType,
  DeEscalationTechnique,
  PostIncidentAction,
  Incident,
  RestraintRecord,
  InjuryRecord,
  NotificationRecord,
  IncidentComplianceResult,
  RestraintAnalysis,
  IncidentMetrics,
} from "./incident-engine";
