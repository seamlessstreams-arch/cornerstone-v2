// ══════════════════════════════════════════════════════════════════════════════
// HOMEWORK & LEARNING SUPPORT INTELLIGENCE ENGINE
//
// Pure deterministic engine for evaluating how well a children's residential
// home supports homework, academic learning, and educational engagement
// outside school hours.
//
// Regulatory basis:
//   - CHR 2015 Regulation 8 — The education standard
//   - CHR 2015 Regulation 10 — Enjoyment and achievement
//   - SCCIF — Experiences and progress of children
//   - NMS 8 — Education
//   - Children Act 1989 — Welfare of the child
//   - UNCRC Article 28 — Right to education
//   - Ofsted ILACS — Education, employment and training
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type SubjectArea =
  | "english"
  | "maths"
  | "science"
  | "humanities"
  | "languages"
  | "creative_arts"
  | "technology"
  | "life_skills";

export type EngagementLevel =
  | "enthusiastic"
  | "willing"
  | "reluctant"
  | "refused"
  | "unable";

export type Rating = "outstanding" | "good" | "requires_improvement" | "inadequate";

// ── Label Maps & Getters ──────────────────────────────────────────────────

const SUBJECT_AREA_LABELS: Record<SubjectArea, string> = {
  english: "English",
  maths: "Maths",
  science: "Science",
  humanities: "Humanities",
  languages: "Languages",
  creative_arts: "Creative Arts",
  technology: "Technology",
  life_skills: "Life Skills",
};

const ENGAGEMENT_LEVEL_LABELS: Record<EngagementLevel, string> = {
  enthusiastic: "Enthusiastic",
  willing: "Willing",
  reluctant: "Reluctant",
  refused: "Refused",
  unable: "Unable",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

export function getSubjectAreaLabel(area: SubjectArea): string {
  return SUBJECT_AREA_LABELS[area];
}

export function getEngagementLevelLabel(level: EngagementLevel): string {
  return ENGAGEMENT_LEVEL_LABELS[level];
}

export function getRatingLabel(rating: Rating): string {
  return RATING_LABELS[rating];
}

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface HomeworkSession {
  id: string;
  childId: string;
  childName: string;
  sessionDate: string; // ISO date
  subjectArea: SubjectArea;
  engagementLevel: EngagementLevel;
  taskCompleted: boolean;
  staffSupported: boolean;
  quietSpaceProvided: boolean;
  resourcesAvailable: boolean;
  progressNoted: boolean;
  documentedInLog: boolean;
}

export interface LearningPolicy {
  id: string;
  homeworkPolicy: boolean;
  quietStudySpaces: boolean;
  learningResources: boolean;
  educationLiaison: boolean;
  individualLearningPlans: boolean;
  tutoringProvision: boolean;
  regularReview: boolean;
}

export interface StaffLearningTraining {
  id: string;
  staffId: string;
  staffName: string;
  homeworkSupport: boolean;
  learningDifficulties: boolean;
  educationalMotivation: boolean;
  senAwareness: boolean;
  digitalLiteracy: boolean;
  communicationWithSchools: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface HomeworkEngagementResult {
  totalSessions: number;
  completionCount: number;
  completionRate: number;
  engagementCount: number;
  engagementRate: number;
  progressNotedCount: number;
  progressNotedRate: number;
  staffSupportedCount: number;
  staffSupportedRate: number;
  documentedInLogCount: number;
  documentedInLogRate: number;
  score: number; // 0-25
}

export interface LearningEnvironmentResult {
  totalSessions: number;
  quietSpaceCount: number;
  quietSpaceRate: number;
  resourcesAvailableCount: number;
  resourcesAvailableRate: number;
  staffSupportedCount: number;
  staffSupportedRate: number;
  score: number; // 0-25
}

export interface LearningPolicyResult {
  homeworkPolicy: boolean;
  quietStudySpaces: boolean;
  learningResources: boolean;
  educationLiaison: boolean;
  individualLearningPlans: boolean;
  tutoringProvision: boolean;
  regularReview: boolean;
  score: number; // 0-25
}

export interface StaffLearningReadinessResult {
  totalStaff: number;
  homeworkSupportCount: number;
  homeworkSupportRate: number;
  learningDifficultiesCount: number;
  learningDifficultiesRate: number;
  educationalMotivationCount: number;
  educationalMotivationRate: number;
  senAwarenessCount: number;
  senAwarenessRate: number;
  digitalLiteracyCount: number;
  digitalLiteracyRate: number;
  communicationWithSchoolsCount: number;
  communicationWithSchoolsRate: number;
  score: number; // 0-25
}

export interface ChildLearningProfile {
  childId: string;
  childName: string;
  totalSessions: number;
  completionRate: number;
  engagementRate: number;
  subjectDiversity: number;
  score: number; // 0-10
}

export interface HomeworkLearningSupportIntelligence {
  homeId: string;
  assessedAt: string;
  periodStart: string;
  periodEnd: string;

  overallScore: number; // 0-100
  rating: Rating;

  homeworkEngagement: HomeworkEngagementResult;
  learningEnvironment: LearningEnvironmentResult;
  learningPolicy: LearningPolicyResult;
  staffLearningReadiness: StaffLearningReadinessResult;

  childProfiles: ChildLearningProfile[];

  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// ── Core Function 1: Evaluate Homework Engagement (0-25) ─────────────────

export function evaluateHomeworkEngagement(
  sessions: HomeworkSession[],
): HomeworkEngagementResult {
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      completionCount: 0,
      completionRate: 0,
      engagementCount: 0,
      engagementRate: 0,
      progressNotedCount: 0,
      progressNotedRate: 0,
      staffSupportedCount: 0,
      staffSupportedRate: 0,
      documentedInLogCount: 0,
      documentedInLogRate: 0,
      score: 0,
    };
  }

  // Completion rate
  const completionCount = sessions.filter((s) => s.taskCompleted).length;
  const completionRate = pct(completionCount, totalSessions);

  // Engagement rate (enthusiastic + willing)
  const engagementCount = sessions.filter(
    (s) => s.engagementLevel === "enthusiastic" || s.engagementLevel === "willing",
  ).length;
  const engagementRate = pct(engagementCount, totalSessions);

  // Progress noted rate
  const progressNotedCount = sessions.filter((s) => s.progressNoted).length;
  const progressNotedRate = pct(progressNotedCount, totalSessions);

  // Staff supported rate
  const staffSupportedCount = sessions.filter((s) => s.staffSupported).length;
  const staffSupportedRate = pct(staffSupportedCount, totalSessions);

  // Documented in log rate
  const documentedInLogCount = sessions.filter((s) => s.documentedInLog).length;
  const documentedInLogRate = pct(documentedInLogCount, totalSessions);

  // Score (out of 25)
  let score = 0;
  // Completion rate: max 7
  score += (completionRate / 100) * 7;
  // Engagement rate: max 6
  score += (engagementRate / 100) * 6;
  // Progress noted rate: max 6
  score += (progressNotedRate / 100) * 6;
  // Combined staffSupported + documentedInLog: max 6
  const combinedRate = pct(staffSupportedCount + documentedInLogCount, totalSessions * 2);
  score += (combinedRate / 100) * 6;

  score = clamp(Math.round(score * 10) / 10, 0, 25);

  return {
    totalSessions,
    completionCount,
    completionRate,
    engagementCount,
    engagementRate,
    progressNotedCount,
    progressNotedRate,
    staffSupportedCount,
    staffSupportedRate,
    documentedInLogCount,
    documentedInLogRate,
    score,
  };
}

// ── Core Function 2: Evaluate Learning Environment (0-25) ────────────────

export function evaluateLearningEnvironment(
  sessions: HomeworkSession[],
): LearningEnvironmentResult {
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      quietSpaceCount: 0,
      quietSpaceRate: 0,
      resourcesAvailableCount: 0,
      resourcesAvailableRate: 0,
      staffSupportedCount: 0,
      staffSupportedRate: 0,
      score: 0,
    };
  }

  // Quiet space provided
  const quietSpaceCount = sessions.filter((s) => s.quietSpaceProvided).length;
  const quietSpaceRate = pct(quietSpaceCount, totalSessions);

  // Resources available
  const resourcesAvailableCount = sessions.filter((s) => s.resourcesAvailable).length;
  const resourcesAvailableRate = pct(resourcesAvailableCount, totalSessions);

  // Staff support
  const staffSupportedCount = sessions.filter((s) => s.staffSupported).length;
  const staffSupportedRate = pct(staffSupportedCount, totalSessions);

  // Score (out of 25)
  let score = 0;
  // Quiet space rate: max 8
  score += (quietSpaceRate / 100) * 8;
  // Resources available rate: max 9
  score += (resourcesAvailableRate / 100) * 9;
  // Staff support rate: max 8
  score += (staffSupportedRate / 100) * 8;

  score = clamp(Math.round(score * 10) / 10, 0, 25);

  return {
    totalSessions,
    quietSpaceCount,
    quietSpaceRate,
    resourcesAvailableCount,
    resourcesAvailableRate,
    staffSupportedCount,
    staffSupportedRate,
    score,
  };
}

// ── Core Function 3: Evaluate Learning Policy (0-25) ─────────────────────

export function evaluateLearningPolicy(
  policy: LearningPolicy | null,
): LearningPolicyResult {
  if (policy === null) {
    return {
      homeworkPolicy: false,
      quietStudySpaces: false,
      learningResources: false,
      educationLiaison: false,
      individualLearningPlans: false,
      tutoringProvision: false,
      regularReview: false,
      score: 0,
    };
  }

  // 7 booleans weighted: 4+4+4+4+3+3+3 = 25
  let score = 0;
  if (policy.homeworkPolicy) score += 4;
  if (policy.quietStudySpaces) score += 4;
  if (policy.learningResources) score += 4;
  if (policy.educationLiaison) score += 4;
  if (policy.individualLearningPlans) score += 3;
  if (policy.tutoringProvision) score += 3;
  if (policy.regularReview) score += 3;

  score = clamp(score, 0, 25);

  return {
    homeworkPolicy: policy.homeworkPolicy,
    quietStudySpaces: policy.quietStudySpaces,
    learningResources: policy.learningResources,
    educationLiaison: policy.educationLiaison,
    individualLearningPlans: policy.individualLearningPlans,
    tutoringProvision: policy.tutoringProvision,
    regularReview: policy.regularReview,
    score,
  };
}

// ── Core Function 4: Evaluate Staff Learning Readiness (0-25) ────────────

export function evaluateStaffLearningReadiness(
  training: StaffLearningTraining[],
): StaffLearningReadinessResult {
  const totalStaff = training.length;

  if (totalStaff === 0) {
    return {
      totalStaff: 0,
      homeworkSupportCount: 0,
      homeworkSupportRate: 0,
      learningDifficultiesCount: 0,
      learningDifficultiesRate: 0,
      educationalMotivationCount: 0,
      educationalMotivationRate: 0,
      senAwarenessCount: 0,
      senAwarenessRate: 0,
      digitalLiteracyCount: 0,
      digitalLiteracyRate: 0,
      communicationWithSchoolsCount: 0,
      communicationWithSchoolsRate: 0,
      score: 0,
    };
  }

  // Homework support
  const homeworkSupportCount = training.filter((t) => t.homeworkSupport).length;
  const homeworkSupportRate = pct(homeworkSupportCount, totalStaff);

  // Learning difficulties
  const learningDifficultiesCount = training.filter((t) => t.learningDifficulties).length;
  const learningDifficultiesRate = pct(learningDifficultiesCount, totalStaff);

  // Educational motivation
  const educationalMotivationCount = training.filter((t) => t.educationalMotivation).length;
  const educationalMotivationRate = pct(educationalMotivationCount, totalStaff);

  // SEN awareness
  const senAwarenessCount = training.filter((t) => t.senAwareness).length;
  const senAwarenessRate = pct(senAwarenessCount, totalStaff);

  // Digital literacy
  const digitalLiteracyCount = training.filter((t) => t.digitalLiteracy).length;
  const digitalLiteracyRate = pct(digitalLiteracyCount, totalStaff);

  // Communication with schools
  const communicationWithSchoolsCount = training.filter((t) => t.communicationWithSchools).length;
  const communicationWithSchoolsRate = pct(communicationWithSchoolsCount, totalStaff);

  // Score (out of 25): 6+5+5+4+3+2 = 25
  let score = 0;
  score += (homeworkSupportRate / 100) * 6;
  score += (learningDifficultiesRate / 100) * 5;
  score += (educationalMotivationRate / 100) * 5;
  score += (senAwarenessRate / 100) * 4;
  score += (digitalLiteracyRate / 100) * 3;
  score += (communicationWithSchoolsRate / 100) * 2;

  score = clamp(Math.round(score * 10) / 10, 0, 25);

  return {
    totalStaff,
    homeworkSupportCount,
    homeworkSupportRate,
    learningDifficultiesCount,
    learningDifficultiesRate,
    educationalMotivationCount,
    educationalMotivationRate,
    senAwarenessCount,
    senAwarenessRate,
    digitalLiteracyCount,
    digitalLiteracyRate,
    communicationWithSchoolsCount,
    communicationWithSchoolsRate,
    score,
  };
}

// ── Build Child Learning Profiles ────────────────────────────────────────

export function buildChildLearningProfiles(
  sessions: HomeworkSession[],
): ChildLearningProfile[] {
  // Group by childId
  const childMap = new Map<string, { childId: string; childName: string; sessions: HomeworkSession[] }>();

  for (const session of sessions) {
    const existing = childMap.get(session.childId);
    if (existing) {
      existing.sessions.push(session);
    } else {
      childMap.set(session.childId, {
        childId: session.childId,
        childName: session.childName,
        sessions: [session],
      });
    }
  }

  return Array.from(childMap.values()).map((child) => {
    const totalSessions = child.sessions.length;
    const completedCount = child.sessions.filter((s) => s.taskCompleted).length;
    const completionRate = pct(completedCount, totalSessions);

    const engagedCount = child.sessions.filter(
      (s) => s.engagementLevel === "enthusiastic" || s.engagementLevel === "willing",
    ).length;
    const engagementRate = pct(engagedCount, totalSessions);

    const uniqueSubjects = new Set(child.sessions.map((s) => s.subjectArea)).size;

    // Score 0-10
    let score = 0;
    // Frequency: 0-2 (>=10 sessions → 2, >=5 → 1, <5 → 0)
    if (totalSessions >= 10) {
      score += 2;
    } else if (totalSessions >= 5) {
      score += 1;
    }
    // Completion: 0-3
    score += (completionRate / 100) * 3;
    // Engagement: 0-3
    score += (engagementRate / 100) * 3;
    // Subject diversity: 0-2 (>=5 subjects → 2, >=3 → 1, <3 → 0)
    if (uniqueSubjects >= 5) {
      score += 2;
    } else if (uniqueSubjects >= 3) {
      score += 1;
    }

    score = clamp(Math.round(score * 10) / 10, 0, 10);

    return {
      childId: child.childId,
      childName: child.childName,
      totalSessions,
      completionRate,
      engagementRate,
      subjectDiversity: uniqueSubjects,
      score,
    };
  });
}

// ── Generate Homework Learning Support Intelligence ──────────────────────

export function generateHomeworkLearningSupportIntelligence(
  sessions: HomeworkSession[],
  policy: LearningPolicy | null,
  training: StaffLearningTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): HomeworkLearningSupportIntelligence {
  const assessedAt = new Date().toISOString();

  // Evaluate each layer
  const homeworkEngagement = evaluateHomeworkEngagement(sessions);
  const learningEnvironment = evaluateLearningEnvironment(sessions);
  const learningPolicyResult = evaluateLearningPolicy(policy);
  const staffLearningReadiness = evaluateStaffLearningReadiness(training);

  // Build child profiles
  const childProfiles = buildChildLearningProfiles(sessions);

  // Overall score (100 points, capped)
  const rawScore =
    homeworkEngagement.score +
    learningEnvironment.score +
    learningPolicyResult.score +
    staffLearningReadiness.score;
  const overallScore = clamp(Math.round(rawScore), 0, 100);

  const rating = getRating(overallScore);

  // Derive strengths, areas for improvement, actions, regulatory links
  const strengths = deriveStrengths(homeworkEngagement, learningEnvironment, learningPolicyResult, staffLearningReadiness, overallScore);
  const areasForImprovement = deriveAreasForImprovement(homeworkEngagement, learningEnvironment, overallScore);
  const actions = deriveActions(sessions, policy, training, homeworkEngagement, learningEnvironment);
  const regulatoryLinks = [
    "CHR 2015 Regulation 8 — The education standard",
    "CHR 2015 Regulation 10 — Enjoyment and achievement",
    "SCCIF — Experiences and progress of children",
    "NMS 8 — Education",
    "Children Act 1989 — Welfare of the child",
    "UNCRC Article 28 — Right to education",
    "Ofsted ILACS — Education, employment and training",
  ];

  return {
    homeId,
    assessedAt,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    homeworkEngagement,
    learningEnvironment,
    learningPolicy: learningPolicyResult,
    staffLearningReadiness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}

// ── Derive Strengths ─────────────────────────────────────────────────────

function deriveStrengths(
  engagement: HomeworkEngagementResult,
  environment: LearningEnvironmentResult,
  policy: LearningPolicyResult,
  staff: StaffLearningReadinessResult,
  overallScore: number,
): string[] {
  const strengths: string[] = [];

  if (overallScore >= 80) {
    strengths.push("Overall homework and learning support rated Outstanding (" + overallScore + "/100)");
  } else if (overallScore >= 60) {
    strengths.push("Overall homework and learning support rated Good (" + overallScore + "/100)");
  }

  if (engagement.completionRate >= 80) {
    strengths.push("Strong homework completion rate: " + engagement.completionRate + "% of tasks completed");
  }

  if (engagement.engagementRate >= 80) {
    strengths.push("Positive learning engagement: " + engagement.engagementRate + "% of sessions show enthusiastic or willing participation");
  }

  if (environment.quietSpaceRate >= 80) {
    strengths.push("Excellent learning environment: quiet study space provided in " + environment.quietSpaceRate + "% of sessions");
  }

  if (environment.resourcesAvailableRate >= 80) {
    strengths.push("Learning resources consistently available: " + environment.resourcesAvailableRate + "% of sessions");
  }

  if (policy.score === 25) {
    strengths.push("Comprehensive learning support policy with all key elements in place");
  }

  if (staff.homeworkSupportRate >= 90) {
    strengths.push("Excellent staff homework support training: " + staff.homeworkSupportRate + "% of staff trained");
  }

  return strengths;
}

// ── Derive Areas for Improvement ─────────────────────────────────────────

function deriveAreasForImprovement(
  engagement: HomeworkEngagementResult,
  environment: LearningEnvironmentResult,
  overallScore: number,
): string[] {
  const areas: string[] = [];

  if (overallScore < 40) {
    areas.push("Overall homework and learning support rated Inadequate (" + overallScore + "/100) — urgent review required");
  } else if (overallScore < 60) {
    areas.push("Overall homework and learning support Requires Improvement (" + overallScore + "/100)");
  }

  if (engagement.totalSessions > 0 && engagement.completionRate < 60) {
    areas.push("Homework completion rate at " + engagement.completionRate + "% — below 60% threshold, children may need additional support");
  }

  if (engagement.totalSessions > 0 && engagement.engagementRate < 60) {
    areas.push("Learning engagement rate at " + engagement.engagementRate + "% — below 60% threshold, motivation strategies needed");
  }

  if (environment.totalSessions > 0 && environment.quietSpaceRate < 60) {
    areas.push("Quiet study space provided in only " + environment.quietSpaceRate + "% of sessions — children need consistent access to quiet learning areas");
  }

  if (environment.totalSessions > 0 && environment.resourcesAvailableRate < 60) {
    areas.push("Learning resources available in only " + environment.resourcesAvailableRate + "% of sessions — resource provision needs attention");
  }

  return areas;
}

// ── Derive Actions ───────────────────────────────────────────────────────

function deriveActions(
  sessions: HomeworkSession[],
  policy: LearningPolicy | null,
  training: StaffLearningTraining[],
  engagement: HomeworkEngagementResult,
  environment: LearningEnvironmentResult,
): string[] {
  const actions: string[] = [];

  if (sessions.length === 0) {
    actions.push("No homework session records found — begin recording homework and learning support sessions immediately");
  }

  if (policy === null) {
    actions.push("URGENT: No learning support policy in place — develop and implement a homework and learning support policy");
  }

  if (training.length === 0) {
    actions.push("URGENT: No staff learning support training records — arrange training for all residential staff");
  }

  if (engagement.totalSessions > 0 && engagement.completionRate < 60) {
    actions.push("Review homework support strategies to improve completion rate from " + engagement.completionRate + "%");
  }

  if (engagement.totalSessions > 0 && engagement.engagementRate < 60) {
    actions.push("Develop engagement strategies to improve learning motivation from " + engagement.engagementRate + "%");
  }

  if (environment.totalSessions > 0 && environment.quietSpaceRate < 60) {
    actions.push("Ensure dedicated quiet study spaces are available and consistently provided");
  }

  if (environment.totalSessions > 0 && environment.resourcesAvailableRate < 60) {
    actions.push("Review and improve availability of learning resources for homework sessions");
  }

  return actions;
}
