// Pocket Money Financial Literacy Intelligence Engine
// Pure deterministic — no AI, no external calls, no randomness, no Date.now()

// ── Type unions ──────────────────────────────────────────────────────────────

export type FinancialSkillType =
  | "budgeting"
  | "saving"
  | "spending_decisions"
  | "banking_basics"
  | "comparison_shopping"
  | "earning_income"
  | "charity_giving"
  | "financial_planning";

export type CompetencyLevel =
  | "independent"
  | "confident"
  | "developing"
  | "emerging"
  | "not_started";

export type Rating = "outstanding" | "good" | "requires_improvement" | "inadequate";

// ── Label maps ───────────────────────────────────────────────────────────────

const FINANCIAL_SKILL_TYPE_LABELS: Record<FinancialSkillType, string> = {
  budgeting: "Budgeting",
  saving: "Saving",
  spending_decisions: "Spending Decisions",
  banking_basics: "Banking Basics",
  comparison_shopping: "Comparison Shopping",
  earning_income: "Earning Income",
  charity_giving: "Charity Giving",
  financial_planning: "Financial Planning",
};

const COMPETENCY_LEVEL_LABELS: Record<CompetencyLevel, string> = {
  independent: "Independent",
  confident: "Confident",
  developing: "Developing",
  emerging: "Emerging",
  not_started: "Not Started",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

export function getFinancialSkillTypeLabel(v: FinancialSkillType): string { return FINANCIAL_SKILL_TYPE_LABELS[v]; }
export function getCompetencyLevelLabel(v: CompetencyLevel): string { return COMPETENCY_LEVEL_LABELS[v]; }
export function getRatingLabel(v: Rating): string { return RATING_LABELS[v]; }

// ── Input interfaces ─────────────────────────────────────────────────────────

export interface FinancialSession {
  id: string;
  childId: string;
  childName: string;
  sessionDate: string;
  skillType: FinancialSkillType;
  competencyLevel: CompetencyLevel;
  childEngaged: boolean;
  practicalApplication: boolean;
  progressDemonstrated: boolean;
  documentedInPlan: boolean;
  staffSupported: boolean;
  feedbackGiven: boolean;
}

export interface FinancialLiteracyPolicy {
  id: string;
  pocketMoneyFramework: boolean;
  savingsSchemePolicy: boolean;
  financialEducationPlan: boolean;
  ageAppropriateBudgeting: boolean;
  independencePreparation: boolean;
  safeguardingFinancialExploitation: boolean;
  regularReview: boolean;
}

export interface StaffFinancialLiteracyTraining {
  id: string;
  staffId: string;
  staffName: string;
  financialEducationSkills: boolean;
  budgetingSupport: boolean;
  ageAppropriateTeaching: boolean;
  safeguardingFinancialAbuse: boolean;
  independencePromotionSkills: boolean;
  recordKeeping: boolean;
}

// ── Result interfaces ────────────────────────────────────────────────────────

export interface FinancialQualityResult {
  overallScore: number;
  totalSessions: number;
  competencyRate: number;
  engagementRate: number;
  practicalApplicationRate: number;
  progressRate: number;
}

export interface FinancialComplianceResult {
  overallScore: number;
  documentedRate: number;
  staffSupportedRate: number;
  feedbackRate: number;
  skillTypeDiversityRatio: number;
}

export interface FinancialPolicyResult {
  overallScore: number;
  pocketMoneyFramework: boolean;
  savingsSchemePolicy: boolean;
  financialEducationPlan: boolean;
  ageAppropriateBudgeting: boolean;
  independencePreparation: boolean;
  safeguardingFinancialExploitation: boolean;
  regularReview: boolean;
}

export interface StaffFinancialReadinessResult {
  overallScore: number;
  totalStaff: number;
  financialEducationSkillsRate: number;
  budgetingSupportRate: number;
  ageAppropriateTeachingRate: number;
  safeguardingFinancialAbuseRate: number;
  independencePromotionSkillsRate: number;
  recordKeepingRate: number;
}

export interface ChildFinancialProfile {
  childId: string;
  childName: string;
  totalSessions: number;
  competencyRate: number;
  engagementRate: number;
  overallScore: number;
}

export interface PocketMoneyFinancialLiteracyIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  financialQuality: FinancialQualityResult;
  financialCompliance: FinancialComplianceResult;
  financialPolicy: FinancialPolicyResult;
  staffFinancialReadiness: StaffFinancialReadinessResult;
  childProfiles: ChildFinancialProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// ── Evaluators ───────────────────────────────────────────────────────────────

/**
 * Evaluate financial quality (0-25).
 *
 * Competent = independent + confident.
 * competencyRate, engagementRate, practicalApplicationRate, progressRate.
 * Weighted: competency 0-7, engagement 0-6, practical 0-6, progress 0-6.
 */
export function evaluateFinancialQuality(sessions: FinancialSession[]): FinancialQualityResult {
  if (sessions.length === 0) {
    return { overallScore: 0, totalSessions: 0, competencyRate: 0, engagementRate: 0, practicalApplicationRate: 0, progressRate: 0 };
  }

  const total = sessions.length;
  const competentCount = sessions.filter((s) => s.competencyLevel === "independent" || s.competencyLevel === "confident").length;
  const engagedCount = sessions.filter((s) => s.childEngaged).length;
  const practicalCount = sessions.filter((s) => s.practicalApplication).length;
  const progressCount = sessions.filter((s) => s.progressDemonstrated).length;

  const competencyRate = pct(competentCount, total);
  const engagementRate = pct(engagedCount, total);
  const practicalApplicationRate = pct(practicalCount, total);
  const progressRate = pct(progressCount, total);

  const compScore = Math.round((competencyRate / 100) * 7);
  const engScore = Math.round((engagementRate / 100) * 6);
  const practScore = Math.round((practicalApplicationRate / 100) * 6);
  const progScore = Math.round((progressRate / 100) * 6);

  const overallScore = Math.min(25, compScore + engScore + practScore + progScore);

  return { overallScore, totalSessions: total, competencyRate, engagementRate, practicalApplicationRate, progressRate };
}

/**
 * Evaluate financial compliance (0-25).
 *
 * documentedRate, staffSupportedRate, feedbackRate.
 * Diversity: unique skillTypes / 8.
 * Weighted: documented 0-8, staffSupported 0-7, feedback 0-5, diversity 0-5.
 */
export function evaluateFinancialCompliance(sessions: FinancialSession[]): FinancialComplianceResult {
  if (sessions.length === 0) {
    return { overallScore: 0, documentedRate: 0, staffSupportedRate: 0, feedbackRate: 0, skillTypeDiversityRatio: 0 };
  }

  const total = sessions.length;
  const documentedCount = sessions.filter((s) => s.documentedInPlan).length;
  const staffCount = sessions.filter((s) => s.staffSupported).length;
  const feedbackCount = sessions.filter((s) => s.feedbackGiven).length;
  const uniqueTypes = new Set(sessions.map((s) => s.skillType)).size;
  const diversityRatio = pct(uniqueTypes, 8);

  const documentedRate = pct(documentedCount, total);
  const staffSupportedRate = pct(staffCount, total);
  const feedbackRate = pct(feedbackCount, total);

  const docScore = Math.round((documentedRate / 100) * 8);
  const staffScore = Math.round((staffSupportedRate / 100) * 7);
  const fbScore = Math.round((feedbackRate / 100) * 5);
  const divScore = Math.round((diversityRatio / 100) * 5);

  const overallScore = Math.min(25, docScore + staffScore + fbScore + divScore);

  return { overallScore, documentedRate, staffSupportedRate, feedbackRate, skillTypeDiversityRatio: diversityRatio };
}

/**
 * Evaluate financial policy (0-25).
 *
 * Weights: 4+4+4+4+3+3+3 = 25.
 */
export function evaluateFinancialPolicy(policy: FinancialLiteracyPolicy | null): FinancialPolicyResult {
  if (!policy) {
    return {
      overallScore: 0,
      pocketMoneyFramework: false,
      savingsSchemePolicy: false,
      financialEducationPlan: false,
      ageAppropriateBudgeting: false,
      independencePreparation: false,
      safeguardingFinancialExploitation: false,
      regularReview: false,
    };
  }

  let score = 0;
  if (policy.pocketMoneyFramework) score += 4;
  if (policy.savingsSchemePolicy) score += 4;
  if (policy.financialEducationPlan) score += 4;
  if (policy.ageAppropriateBudgeting) score += 4;
  if (policy.independencePreparation) score += 3;
  if (policy.safeguardingFinancialExploitation) score += 3;
  if (policy.regularReview) score += 3;

  return {
    overallScore: Math.min(25, score),
    pocketMoneyFramework: policy.pocketMoneyFramework,
    savingsSchemePolicy: policy.savingsSchemePolicy,
    financialEducationPlan: policy.financialEducationPlan,
    ageAppropriateBudgeting: policy.ageAppropriateBudgeting,
    independencePreparation: policy.independencePreparation,
    safeguardingFinancialExploitation: policy.safeguardingFinancialExploitation,
    regularReview: policy.regularReview,
  };
}

/**
 * Evaluate staff financial readiness (0-25).
 *
 * 6 skills. Weighted: 6+5+5+4+3+2 = 25.
 */
export function evaluateStaffFinancialReadiness(training: StaffFinancialLiteracyTraining[]): StaffFinancialReadinessResult {
  if (training.length === 0) {
    return { overallScore: 0, totalStaff: 0, financialEducationSkillsRate: 0, budgetingSupportRate: 0, ageAppropriateTeachingRate: 0, safeguardingFinancialAbuseRate: 0, independencePromotionSkillsRate: 0, recordKeepingRate: 0 };
  }

  const total = training.length;
  const feCount = training.filter((t) => t.financialEducationSkills).length;
  const bsCount = training.filter((t) => t.budgetingSupport).length;
  const atCount = training.filter((t) => t.ageAppropriateTeaching).length;
  const sfCount = training.filter((t) => t.safeguardingFinancialAbuse).length;
  const ipCount = training.filter((t) => t.independencePromotionSkills).length;
  const rkCount = training.filter((t) => t.recordKeeping).length;

  const financialEducationSkillsRate = pct(feCount, total);
  const budgetingSupportRate = pct(bsCount, total);
  const ageAppropriateTeachingRate = pct(atCount, total);
  const safeguardingFinancialAbuseRate = pct(sfCount, total);
  const independencePromotionSkillsRate = pct(ipCount, total);
  const recordKeepingRate = pct(rkCount, total);

  const s1 = Math.round((financialEducationSkillsRate / 100) * 6);
  const s2 = Math.round((budgetingSupportRate / 100) * 5);
  const s3 = Math.round((ageAppropriateTeachingRate / 100) * 5);
  const s4 = Math.round((safeguardingFinancialAbuseRate / 100) * 4);
  const s5 = Math.round((independencePromotionSkillsRate / 100) * 3);
  const s6 = Math.round((recordKeepingRate / 100) * 2);

  const overallScore = Math.min(25, s1 + s2 + s3 + s4 + s5 + s6);

  return { overallScore, totalStaff: total, financialEducationSkillsRate, budgetingSupportRate, ageAppropriateTeachingRate, safeguardingFinancialAbuseRate, independencePromotionSkillsRate, recordKeepingRate };
}

// ── Child profiles ───────────────────────────────────────────────────────────

export function buildChildFinancialProfiles(sessions: FinancialSession[]): ChildFinancialProfile[] {
  if (sessions.length === 0) return [];

  const grouped = new Map<string, FinancialSession[]>();
  for (const s of sessions) {
    if (!grouped.has(s.childId)) grouped.set(s.childId, []);
    grouped.get(s.childId)!.push(s);
  }

  const profiles: ChildFinancialProfile[] = [];

  for (const [childId, sess] of grouped) {
    const childName = sess[0].childName;
    const total = sess.length;
    const competentCount = sess.filter((s) => s.competencyLevel === "independent" || s.competencyLevel === "confident").length;
    const engagedCount = sess.filter((s) => s.childEngaged).length;

    const competencyRate = pct(competentCount, total);
    const engagementRate = pct(engagedCount, total);

    // Score 0-10: frequency + competency + engagement + diversity
    let freqScore = 0;
    if (total >= 10) freqScore = 2;
    else if (total >= 5) freqScore = 1;

    let compScore = 0;
    if (competencyRate >= 80) compScore = 3;
    else if (competencyRate >= 60) compScore = 2;
    else if (competencyRate >= 40) compScore = 1;

    let engScore = 0;
    if (engagementRate >= 80) engScore = 3;
    else if (engagementRate >= 60) engScore = 2;
    else if (engagementRate >= 40) engScore = 1;

    const uniqueTypes = new Set(sess.map((s) => s.skillType)).size;
    let divScore = 0;
    if (uniqueTypes >= 4) divScore = 2;
    else if (uniqueTypes >= 2) divScore = 1;

    const overallScore = Math.min(10, freqScore + compScore + engScore + divScore);

    profiles.push({ childId, childName, totalSessions: total, competencyRate, engagementRate, overallScore });
  }

  return profiles;
}

// ── Orchestrator ─────────────────────────────────────────────────────────────

export function generatePocketMoneyFinancialLiteracyIntelligence(
  sessions: FinancialSession[],
  policy: FinancialLiteracyPolicy | null,
  training: StaffFinancialLiteracyTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): PocketMoneyFinancialLiteracyIntelligence {
  const financialQuality = evaluateFinancialQuality(sessions);
  const financialCompliance = evaluateFinancialCompliance(sessions);
  const financialPolicy = evaluateFinancialPolicy(policy);
  const staffFinancialReadiness = evaluateStaffFinancialReadiness(training);

  const overallScore = Math.min(100, financialQuality.overallScore + financialCompliance.overallScore + financialPolicy.overallScore + staffFinancialReadiness.overallScore);
  const rating = getRating(overallScore);

  const childProfiles = buildChildFinancialProfiles(sessions);

  const strengths: string[] = [];
  const areasForImprovement: string[] = [];
  const actions: string[] = [];

  // -- Strengths --
  if (financialQuality.competencyRate >= 80) strengths.push("Strong financial competency — children are demonstrating independent and confident financial skills");
  if (financialQuality.engagementRate >= 80) strengths.push("High engagement in financial literacy sessions — children are actively participating in learning");
  if (financialQuality.practicalApplicationRate >= 80) strengths.push("Practical application is consistently evidenced — children are applying financial skills in real situations");
  if (financialQuality.progressRate >= 80) strengths.push("Progress is consistently demonstrated across financial literacy sessions");
  if (financialCompliance.documentedRate >= 80) strengths.push("Excellent documentation of financial literacy in care plans");
  if (financialCompliance.staffSupportedRate >= 80) strengths.push("Staff consistently support children's financial literacy development");
  if (financialCompliance.feedbackRate >= 80) strengths.push("Feedback is regularly provided to children on their financial skills progress");
  if (financialCompliance.skillTypeDiversityRatio >= 75) strengths.push("Financial literacy sessions cover a broad range of skill areas, preparing children for financial independence");

  // -- Areas for Improvement --
  if (sessions.length > 0 && financialQuality.competencyRate < 60) areasForImprovement.push("Financial competency rates need improvement — review teaching methods and support levels");
  if (sessions.length > 0 && financialQuality.engagementRate < 60) areasForImprovement.push("Child engagement in financial literacy is low — sessions should be more interactive and age-appropriate");
  if (sessions.length > 0 && financialQuality.practicalApplicationRate < 60) areasForImprovement.push("Practical application of financial skills is insufficient — embed real-world opportunities");
  if (sessions.length > 0 && financialQuality.progressRate < 60) areasForImprovement.push("Progress demonstration is inconsistent — strengthen assessment and tracking");
  if (sessions.length > 0 && financialCompliance.documentedRate < 60) areasForImprovement.push("Documentation of financial literacy in care plans needs improvement");
  if (sessions.length > 0 && financialCompliance.feedbackRate < 60) areasForImprovement.push("Feedback on financial progress not consistently provided to children");
  if (sessions.length > 0 && financialCompliance.skillTypeDiversityRatio < 50) areasForImprovement.push("Limited range of financial skill types covered — broaden the curriculum");

  // -- Actions --
  if (sessions.length === 0) actions.push("No financial literacy session records found — develop and implement a pocket money financial literacy programme");
  if (!policy) actions.push("URGENT: No financial literacy policy in place — develop and implement immediately");
  if (training.length === 0) actions.push("URGENT: No staff financial literacy training recorded — arrange training for all staff");
  if (sessions.length > 0 && financialCompliance.staffSupportedRate < 60) actions.push("Improve staff support for children's financial literacy sessions");
  if (sessions.length > 0 && financialQuality.practicalApplicationRate < 60) actions.push("Increase practical financial activities such as budgeting exercises, shopping trips and savings challenges");

  const regulatoryLinks: string[] = [
    "CHR 2015 Regulation 6 — Health and well-being (financial capability)",
    "CHR 2015 Regulation 9 — Quality of care (preparation for independence)",
    "SCCIF — Experiences and progress of children (independence skills)",
    "NMS 13 — Preparing for adulthood (financial literacy)",
    "Children Act 1989 — Welfare of the child",
    "UNCRC Article 27 — Adequate standard of living",
    "Children (Leaving Care) Act 2000 — Financial support and education",
  ];

  return {
    homeId, periodStart, periodEnd, overallScore, rating,
    financialQuality, financialCompliance, financialPolicy, staffFinancialReadiness,
    childProfiles, strengths, areasForImprovement, actions, regulatoryLinks,
  };
}
