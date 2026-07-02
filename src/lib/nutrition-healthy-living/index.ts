// ══════════════════════════════════════════════════════════════════════════════
// Cara Nutrition & Healthy Living Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateMealQuality,
  evaluatePhysicalActivity,
  evaluateHealthPromotion,
  evaluateMenuPlanning,
  buildChildNutritionProfiles,
  generateNutritionHealthyLivingIntelligence,
  getRating,
  getMealTypeLabel,
  getDietaryRequirementLabel,
  getMealQualityLabel,
  getActivityTypeLabel,
  getActivityIntensityLabel,
  getHealthOutcomeLabel,
  getHydrationStatusLabel,
} from "./nutrition-healthy-living-engine";

export type {
  MealType,
  DietaryRequirement,
  MealQuality,
  ActivityType,
  ActivityIntensity,
  HealthOutcome,
  HydrationStatus,
  Rating,
  MealRecord,
  ChildDietaryProfile,
  PhysicalActivity,
  HealthPromotion,
  MenuPlan,
  MealQualityResult,
  PhysicalActivityResult,
  HealthPromotionResult,
  MenuPlanningResult,
  ChildNutritionProfile,
  NutritionHealthyLivingIntelligence,
} from "./nutrition-healthy-living-engine";
