// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Quality of Care Review (Reg 45) — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  generateQualityOfCareReview,
  getDomainLabel,
  getGradeLabel,
  getGradeColor,
} from "./quality-of-care-engine";

export type {
  OfstedGrade,
  SCCIFDomain,
  EvidenceStrength,
  DomainAssessment,
  EvidenceItem,
  QualityInputData,
  SafetyInput,
  EducationInput,
  HealthInput,
  RelationshipsInput,
  ProtectionInput,
  LeadershipInput,
  QualityOfCareReview,
} from "./quality-of-care-engine";
