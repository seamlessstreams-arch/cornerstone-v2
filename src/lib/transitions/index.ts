// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Transitions & Admissions — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateTransitionCompliance,
  calculateTransitionMetrics,
  getTransitionTypeLabel,
  getTransitionStatusLabel,
} from "./transitions-engine";

export type {
  TransitionType,
  TransitionStatus,
  MatchingDomain,
  MatchingScore,
  Transition,
  MatchingAssessment,
  ImpactAssessment,
  SettlingInReview,
  TransitionComplianceResult,
  HomeTransitionMetrics,
} from "./transitions-engine";
