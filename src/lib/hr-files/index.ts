// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone HR Files — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateTrainingCompliance,
  evaluateSupervisionCompliance,
  calculateWorkforceMetrics,
  identifyTrainingGaps,
  getMandatoryTraining,
  getTrainingRenewalYears,
  formatTrainingName,
} from "./workforce-engine";

export type {
  TrainingCategory,
  TrainingStatus,
  SupervisionType,
  AbsenceType,
  ProbationStatus,
  StaffMember,
  TrainingRecord,
  SupervisionRecord,
  AbsenceRecord,
  ProbationRecord,
  TrainingComplianceResult,
  SupervisionComplianceResult,
  WorkforceMetrics,
  TrainingGap,
} from "./workforce-engine";
