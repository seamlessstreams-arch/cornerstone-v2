// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Sensory & Therapeutic Environment Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateChildSensoryProfiles,
  evaluateSpaceQuality,
  evaluateAdaptations,
  evaluateTherapeuticSpaceUsage,
  buildChildEnvironmentProfiles,
  generateSensoryEnvironmentIntelligence,
  getSensoryNeedLabel,
  getSpaceTypeLabel,
  getAdaptationTypeLabel,
  getPersonalisationLevelLabel,
} from "./sensory-environment-engine";

export type {
  SensoryNeed,
  SpaceType,
  AdaptationType,
  PersonalisationLevel,
  ChildSensoryProfile,
  SpaceAssessment,
  EnvironmentalAdaptation,
  TherapeuticSpaceUsage,
  SensoryProfilingResult,
  SpaceQualityResult,
  AdaptationsResult,
  TherapeuticUsageResult,
  ChildEnvironmentProfile,
  SensoryEnvironmentIntelligence,
} from "./sensory-environment-engine";
