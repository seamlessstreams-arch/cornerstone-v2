// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Filing Cabinet — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  getRetentionPolicy,
  calculateRetentionExpiry,
  checkRetentionStatus,
  approveDestruction,
  executeDestruction,
  placeHold,
  removeHold,
  canAccessDocument,
  calculateFilingStats,
  fileDocument,
  getCategoryLabel,
  getSensitivityLabel,
  getRetentionBasisLabel,
  getDocumentsApproachingExpiry,
  getExpiredDocuments,
  RETENTION_POLICIES,
} from "./retention-engine";

export type {
  FilingCategory,
  RetentionBasis,
  DocumentStatus,
  Sensitivity,
  FiledDocument,
  RetentionPolicy,
  RetentionCheckResult,
  DestructionRequest,
  DestructionResult,
  FilingStats,
  FileDocumentRequest,
} from "./retention-engine";
