// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Homework & Learning Support Intelligence — Public API
// ══════════════════════════════════════════════════════════════════════════════

export {
  evaluateHomeworkEngagement,
  evaluateLearningEnvironment,
  evaluateLearningPolicy,
  evaluateStaffLearningReadiness,
  buildChildLearningProfiles,
  generateHomeworkLearningSupportIntelligence,
  getSubjectAreaLabel,
  getEngagementLevelLabel,
  getRatingLabel,
  getRating,
  pct,
} from "./homework-learning-support-engine";

export type {
  SubjectArea,
  EngagementLevel,
  Rating,
  HomeworkSession,
  LearningPolicy,
  StaffLearningTraining,
  HomeworkEngagementResult,
  LearningEnvironmentResult,
  LearningPolicyResult,
  StaffLearningReadinessResult,
  ChildLearningProfile,
  HomeworkLearningSupportIntelligence,
} from "./homework-learning-support-engine";
