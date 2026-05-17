// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Complaints & Compliments — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateComplaintCompliance,
  calculateComplaintsMetrics,
  getCategoryLabel,
  getStageLabel,
  getOutcomeLabel,
} from "./complaints-engine";

export type {
  ComplaintStatus,
  ComplaintStage,
  ComplaintCategory,
  ComplainantType,
  ResolutionOutcome,
  Complaint,
  Compliment,
  ComplaintComplianceResult,
  ComplaintsMetrics,
} from "./complaints-engine";
