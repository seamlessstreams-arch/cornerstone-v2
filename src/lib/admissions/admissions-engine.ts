// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Admissions & Impact Assessment Engine
//
// Deterministic engine for evaluating new placement referrals, matching
// suitability, impact assessments on existing children, and admission
// decision compliance.
//
// Aligned to:
//   - CHR 2015 Reg 5 — Quality and purpose of care
//   - CHR 2015 Reg 12 — Protection of children (matching)
//   - CHR 2015 Reg 14 — Care planning
//   - CHR 2015 Reg 16 — Statement of purpose (child compatibility)
//   - SCCIF — Impact of other children, matching decisions
//   - DfE Guide to Children's Homes Regulations: Matching
//   - Children Act 1989 s.22C — Placement decisions
//
// Key requirements:
//   - Impact assessment completed for every potential admission
//   - Existing children's views sought before admission
//   - Matching criteria: age, gender, needs, risks, dynamics
//   - Statement of purpose compatibility checked
//   - Staff capacity and skill-mix considered
//   - Emergency/unplanned admissions still require assessment (within 72 hrs)
//   - Decision rationale recorded and signed off
//   - Post-admission review scheduled (within 72 hours)
//   - Children involved in welcoming new placements
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type ReferralStatus =
  | "received"
  | "under_assessment"
  | "impact_assessment_complete"
  | "approved"
  | "declined"
  | "withdrawn"
  | "admitted";

export type AdmissionType =
  | "planned"
  | "emergency"
  | "respite"
  | "step_down";

export type MatchingFactor =
  | "age_compatibility"
  | "gender_mix"
  | "risk_compatibility"
  | "needs_compatibility"
  | "peer_dynamics"
  | "statement_of_purpose"
  | "staff_skills"
  | "capacity"
  | "location_suitability"
  | "education_provision"
  | "cultural_needs"
  | "sibling_connection";

export type ImpactLevel = "positive" | "neutral" | "low_concern" | "significant_concern" | "incompatible";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface AdmissionReferral {
  id: string;
  homeId: string;
  referralDate: string;
  childName: string;
  childAge: number;
  childGender: string;
  placingAuthority: string;
  admissionType: AdmissionType;
  status: ReferralStatus;
  // Assessment
  impactAssessment?: ImpactAssessment;
  matchingScores: MatchingScore[];
  // Decision
  decisionDate?: string;
  decisionBy?: string;
  decisionRationale?: string;
  approvedByRI?: boolean;
  // Post-admission
  admissionDate?: string;
  postAdmissionReviewDate?: string;
  postAdmissionReviewCompleted?: boolean;
  welcomePlanInPlace?: boolean;
  existingChildrenInformed?: boolean;
}

export interface ImpactAssessment {
  id: string;
  completedDate: string;
  completedBy: string;
  overallImpactLevel: ImpactLevel;
  existingChildrenConsulted: boolean;
  childrenConsulted: string[];
  staffConsulted: boolean;
  riskAssessmentCompleted: boolean;
  // Impact on each existing child
  childImpacts: ChildImpact[];
  // Factors
  staffingAdequate: boolean;
  environmentSuitable: boolean;
  educationArranged: boolean;
  healthNeedsAssessable: boolean;
  // Mitigations if concerns
  mitigations: string[];
  conditions: string[];
}

export interface ChildImpact {
  childName: string;
  childId: string;
  impactLevel: ImpactLevel;
  considerations: string[];
  childView?: string;
  mitigations: string[];
}

export interface MatchingScore {
  factor: MatchingFactor;
  score: number;                           // 1-5 (1=poor, 5=excellent)
  rationale: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface ReferralComplianceResult {
  referralId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Compliance checks
  impactAssessmentCompleted: boolean;
  existingChildrenConsulted: boolean;
  matchingScoreAvailable: boolean;
  overallMatchScore: number;               // avg of matching scores (1-5)
  decisionRecorded: boolean;
  riApproval: boolean;
  postAdmissionReviewDone: boolean;
  welcomePlanExists: boolean;
  // Timing
  daysToDecision: number;
  assessmentTimely: boolean;               // emergency: 72hrs, planned: before admission
}

export interface HomeAdmissionsMetrics {
  homeId: string;
  // Volume
  totalReferralsLast12Months: number;
  admittedCount: number;
  declinedCount: number;
  withdrawnCount: number;
  pendingCount: number;
  // Quality
  impactAssessmentRate: number;            // % with completed assessment
  childConsultationRate: number;           // % where existing children consulted
  averageMatchScore: number;               // avg across all admitted
  riApprovalRate: number;
  postAdmissionReviewRate: number;
  welcomePlanRate: number;
  // Timing
  averageDaysToDecision: number;
  emergencyAssessmentTimelyRate: number;
  // Current state
  currentOccupancy: number;
  maxCapacity: number;
  occupancyRate: number;
  // Issues
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const EMERGENCY_ASSESSMENT_HOURS = 72;
const POST_ADMISSION_REVIEW_HOURS = 72;
const MINIMUM_MATCH_SCORE = 3;             // avg score below 3 is a concern
const MAX_DAYS_TO_DECISION_PLANNED = 5;

// ── Core: Evaluate Referral Compliance ──────────────────────────────────

export function evaluateReferralCompliance(
  referral: AdmissionReferral,
  now?: string,
): ReferralComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Impact assessment
  const impactAssessmentCompleted = !!referral.impactAssessment;
  if (!impactAssessmentCompleted && referral.status !== "received" && referral.status !== "withdrawn") {
    issues.push("Impact assessment not completed");
  }

  // Existing children consulted
  const existingChildrenConsulted = referral.impactAssessment?.existingChildrenConsulted ?? false;
  if (impactAssessmentCompleted && !existingChildrenConsulted) {
    issues.push("Existing children not consulted about new admission");
  }

  // Matching scores
  const matchingScoreAvailable = referral.matchingScores.length > 0;
  const overallMatchScore = referral.matchingScores.length > 0
    ? Math.round(referral.matchingScores.reduce((s, m) => s + m.score, 0) / referral.matchingScores.length * 10) / 10
    : 0;

  if (matchingScoreAvailable && overallMatchScore < MINIMUM_MATCH_SCORE) {
    warnings.push(`Low overall match score (${overallMatchScore}/5) — review suitability`);
  }

  if (!matchingScoreAvailable && referral.status !== "received" && referral.status !== "withdrawn") {
    warnings.push("Matching scores not recorded");
  }

  // Decision recorded
  const decisionRecorded = !!referral.decisionDate && !!referral.decisionRationale;
  if ((referral.status === "approved" || referral.status === "admitted" || referral.status === "declined") && !decisionRecorded) {
    issues.push("Decision not properly recorded with rationale");
  }

  // RI approval
  const riApproval = referral.approvedByRI ?? false;
  if ((referral.status === "approved" || referral.status === "admitted") && !riApproval) {
    issues.push("Responsible Individual approval not obtained");
  }

  // Post-admission review
  let postAdmissionReviewDone = false;
  if (referral.status === "admitted") {
    postAdmissionReviewDone = referral.postAdmissionReviewCompleted ?? false;
    if (referral.admissionDate) {
      const hoursSinceAdmission = (currentTime - new Date(referral.admissionDate).getTime()) / (60 * 60 * 1000);
      if (hoursSinceAdmission > POST_ADMISSION_REVIEW_HOURS && !postAdmissionReviewDone) {
        issues.push("Post-admission review not completed within 72 hours");
      }
    }
  }

  // Welcome plan
  const welcomePlanExists = referral.welcomePlanInPlace ?? false;
  if (referral.status === "admitted" && !welcomePlanExists) {
    warnings.push("Welcome plan not in place for new admission");
  }

  // Existing children informed
  if (referral.status === "admitted" && !referral.existingChildrenInformed) {
    warnings.push("Existing children not informed about new admission");
  }

  // Timing
  let daysToDecision = 0;
  let assessmentTimely = true;

  if (referral.decisionDate) {
    daysToDecision = Math.round(
      (new Date(referral.decisionDate).getTime() - new Date(referral.referralDate).getTime()) / (24 * 60 * 60 * 1000)
    );
  }

  if (referral.admissionType === "emergency" && impactAssessmentCompleted && referral.impactAssessment) {
    const hoursToAssessment = (new Date(referral.impactAssessment.completedDate).getTime() - new Date(referral.referralDate).getTime()) / (60 * 60 * 1000);
    assessmentTimely = hoursToAssessment <= EMERGENCY_ASSESSMENT_HOURS;
    if (!assessmentTimely) {
      warnings.push("Emergency impact assessment not completed within 72 hours");
    }
  } else if (referral.admissionType === "planned" && daysToDecision > MAX_DAYS_TO_DECISION_PLANNED) {
    warnings.push(`Decision took ${daysToDecision} days (target: ${MAX_DAYS_TO_DECISION_PLANNED} days)`);
  }

  // Significant concerns in impact
  if (referral.impactAssessment) {
    const significantImpacts = referral.impactAssessment.childImpacts.filter(
      c => c.impactLevel === "significant_concern" || c.impactLevel === "incompatible"
    );
    if (significantImpacts.length > 0 && referral.status === "admitted") {
      warnings.push(`Admitted despite ${significantImpacts.length} significant concern(s) in impact assessment`);
    }
  }

  return {
    referralId: referral.id,
    childName: referral.childName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    impactAssessmentCompleted,
    existingChildrenConsulted,
    matchingScoreAvailable,
    overallMatchScore,
    decisionRecorded,
    riApproval,
    postAdmissionReviewDone,
    welcomePlanExists,
    daysToDecision,
    assessmentTimely,
  };
}

// ── Core: Calculate Home Admissions Metrics ─────────────────────────────

export function calculateHomeAdmissionsMetrics(
  referrals: AdmissionReferral[],
  homeId: string,
  maxCapacity: number,
  currentOccupancy: number,
  now?: string,
): HomeAdmissionsMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const oneYearAgo = currentTime - 365 * 24 * 60 * 60 * 1000;

  const homeReferrals = referrals.filter(
    r => r.homeId === homeId && new Date(r.referralDate).getTime() > oneYearAgo
  );

  const totalReferralsLast12Months = homeReferrals.length;
  const admittedCount = homeReferrals.filter(r => r.status === "admitted").length;
  const declinedCount = homeReferrals.filter(r => r.status === "declined").length;
  const withdrawnCount = homeReferrals.filter(r => r.status === "withdrawn").length;
  const pendingCount = homeReferrals.filter(
    r => r.status === "received" || r.status === "under_assessment" || r.status === "impact_assessment_complete" || r.status === "approved"
  ).length;

  // Quality metrics (on decided referrals)
  const decidedReferrals = homeReferrals.filter(
    r => r.status === "admitted" || r.status === "declined" || r.status === "approved"
  );
  const results = decidedReferrals.map(r => evaluateReferralCompliance(r, now));

  const withImpact = decidedReferrals.filter(r => r.impactAssessment).length;
  const impactAssessmentRate = decidedReferrals.length > 0
    ? Math.round((withImpact / decidedReferrals.length) * 100)
    : 100;

  const withConsultation = decidedReferrals.filter(r => r.impactAssessment?.existingChildrenConsulted).length;
  const childConsultationRate = decidedReferrals.length > 0
    ? Math.round((withConsultation / decidedReferrals.length) * 100)
    : 100;

  // Average match score (admitted only)
  const admittedReferrals = homeReferrals.filter(r => r.status === "admitted");
  const matchScores = admittedReferrals
    .filter(r => r.matchingScores.length > 0)
    .map(r => r.matchingScores.reduce((s, m) => s + m.score, 0) / r.matchingScores.length);
  const averageMatchScore = matchScores.length > 0
    ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length * 10) / 10
    : 0;

  // RI approval
  const needingApproval = decidedReferrals.filter(r => r.status === "admitted" || r.status === "approved");
  const withApproval = needingApproval.filter(r => r.approvedByRI);
  const riApprovalRate = needingApproval.length > 0
    ? Math.round((withApproval.length / needingApproval.length) * 100)
    : 100;

  // Post-admission review
  const admittedWithReview = admittedReferrals.filter(r => r.postAdmissionReviewCompleted);
  const postAdmissionReviewRate = admittedReferrals.length > 0
    ? Math.round((admittedWithReview.length / admittedReferrals.length) * 100)
    : 100;

  // Welcome plan
  const withWelcomePlan = admittedReferrals.filter(r => r.welcomePlanInPlace);
  const welcomePlanRate = admittedReferrals.length > 0
    ? Math.round((withWelcomePlan.length / admittedReferrals.length) * 100)
    : 100;

  // Timing
  const daysToDecisions = decidedReferrals
    .filter(r => r.decisionDate)
    .map(r => Math.round((new Date(r.decisionDate!).getTime() - new Date(r.referralDate).getTime()) / (24 * 60 * 60 * 1000)));
  const averageDaysToDecision = daysToDecisions.length > 0
    ? Math.round(daysToDecisions.reduce((a, b) => a + b, 0) / daysToDecisions.length)
    : 0;

  const emergencyReferrals = decidedReferrals.filter(r => r.admissionType === "emergency");
  const emergencyTimely = emergencyReferrals.filter(r => {
    if (!r.impactAssessment) return false;
    const hours = (new Date(r.impactAssessment.completedDate).getTime() - new Date(r.referralDate).getTime()) / (60 * 60 * 1000);
    return hours <= EMERGENCY_ASSESSMENT_HOURS;
  });
  const emergencyAssessmentTimelyRate = emergencyReferrals.length > 0
    ? Math.round((emergencyTimely.length / emergencyReferrals.length) * 100)
    : 100;

  // Occupancy
  const occupancyRate = maxCapacity > 0
    ? Math.round((currentOccupancy / maxCapacity) * 100)
    : 0;

  // Compliance issues
  const complianceIssues = [...new Set(results.flatMap(r => r.issues))];

  return {
    homeId,
    totalReferralsLast12Months,
    admittedCount,
    declinedCount,
    withdrawnCount,
    pendingCount,
    impactAssessmentRate,
    childConsultationRate,
    averageMatchScore,
    riApprovalRate,
    postAdmissionReviewRate,
    welcomePlanRate,
    averageDaysToDecision,
    emergencyAssessmentTimelyRate,
    currentOccupancy,
    maxCapacity,
    occupancyRate,
    complianceIssues,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getMatchingFactorLabel(factor: MatchingFactor): string {
  const labels: Record<MatchingFactor, string> = {
    age_compatibility: "Age Compatibility",
    gender_mix: "Gender Mix",
    risk_compatibility: "Risk Compatibility",
    needs_compatibility: "Needs Compatibility",
    peer_dynamics: "Peer Dynamics",
    statement_of_purpose: "Statement of Purpose",
    staff_skills: "Staff Skills",
    capacity: "Capacity",
    location_suitability: "Location",
    education_provision: "Education Provision",
    cultural_needs: "Cultural Needs",
    sibling_connection: "Sibling Connection",
  };
  return labels[factor] ?? factor;
}

export function getImpactLevelLabel(level: ImpactLevel): string {
  const labels: Record<ImpactLevel, string> = {
    positive: "Positive",
    neutral: "Neutral",
    low_concern: "Low Concern",
    significant_concern: "Significant Concern",
    incompatible: "Incompatible",
  };
  return labels[level] ?? level;
}
