// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Education Attendance & Achievement Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateAttendance,
  evaluateExclusions,
  evaluatePEPQuality,
  evaluateSENDSupport,
  evaluateAchievements,
  generateEducationOutcomesIntelligence,
} from "./education-outcomes-engine";

export type {
  AttendanceStatus,
  ExclusionType,
  PEPStatus,
  SENDCategory,
  AchievementType,
  AttendanceRecord,
  ExclusionRecord,
  PEPRecord,
  SENDSupportRecord,
  AchievementRecord,
  AttendanceEvaluation,
  ExclusionEvaluation,
  PEPQualityEvaluation,
  SENDSupportEvaluation,
  AchievementEvaluation,
  OverallRating,
  EducationOutcomesIntelligence,
} from "./education-outcomes-engine";
