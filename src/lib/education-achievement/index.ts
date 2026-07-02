// ══════════════════════════════════════════════════════════════════════════════
// Cara Education Achievement Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateAttendance,
  evaluatePEPQuality,
  evaluateAcademicProgress,
  evaluateSchoolStability,
  buildChildEducationProfiles,
  generateEducationAchievementIntelligence,
  getRating,
  getSchoolTypeLabel,
  getAttendanceStatusLabel,
  getPEPStatusLabel,
  getPEPQualityLabel,
  getAcademicProgressLabel,
  getExclusionTypeLabel,
  getRatingLabel,
} from "./education-achievement-engine";

export type {
  SchoolType,
  AttendanceStatus,
  PEPStatus,
  PEPQuality,
  AcademicProgress,
  ExclusionType,
  Rating,
  AttendanceRecord,
  PEPRecord,
  AcademicOutcome,
  SchoolStability,
  ExclusionRecord,
  AttendanceResult,
  PEPQualityResult,
  AcademicProgressResult,
  SchoolStabilityResult,
  ChildEducationProfile,
  EducationAchievementIntelligence,
} from "./education-achievement-engine";
