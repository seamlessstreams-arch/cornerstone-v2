// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Leaving Care & Aftercare — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateLeavingCareCompliance,
  calculateHomeLeavingCareMetrics,
  getLeavingCareStatusLabel,
  getAccommodationTypeLabel,
  getEETStatusLabel,
} from "./leaving-care-engine";

export type {
  LeavingCareStatus,
  AccommodationType,
  EETStatus,
  SupportFrequency,
  LeavingCareProfile,
  PathwayPlan,
  PathwayPlanReview,
  AftercareSupportRecord,
  LeavingCareComplianceResult,
  HomeLeavingCareMetrics,
} from "./leaving-care-engine";
