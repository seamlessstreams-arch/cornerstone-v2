// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Transitions & Admissions Engine
//
// Deterministic engine for managing placement transitions — admissions,
// planned moves, emergency placements, and leaving care. Tracks matching
// quality, impact assessments, settling-in, and regulatory compliance.
//
// Aligned to:
//   - CHR 2015 Reg 14 — Admissions (matching & impact assessment)
//   - CHR 2015 Reg 36 — Statement of purpose (matching criteria)
//   - Sufficiency Duty (s.22G Children Act 1989)
//   - SCCIF — Matching and placement stability
//   - Care Planning Regulations 2010 — Placement Plan within 5 days
//
// Key requirements:
//   - Impact assessment before every admission
//   - Matching assessment against home's Statement of Purpose
//   - Placement Plan within 5 working days
//   - Settling-in period monitoring (first 72 hours critical)
//   - Reg 44 independent visitor notified of all admissions
//   - Children's guide provided on arrival
//   - Risk assessment completed before or on admission
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type TransitionType =
  | "admission_planned"
  | "admission_emergency"
  | "internal_move"
  | "step_down"
  | "step_up"
  | "leaving_planned"
  | "leaving_unplanned"
  | "leaving_18"
  | "reunification";

export type TransitionStatus =
  | "referral_received"
  | "matching_assessment"
  | "impact_assessment"
  | "approved"
  | "placement_confirmed"
  | "arrived"
  | "settling_in"
  | "established"
  | "move_planning"
  | "departed"
  | "cancelled"
  | "rejected";

export type MatchingDomain =
  | "age_appropriateness"
  | "gender_dynamics"
  | "risk_compatibility"
  | "needs_capability"
  | "location_suitability"
  | "education_continuity"
  | "cultural_identity"
  | "peer_relationships"
  | "staffing_capacity"
  | "therapeutic_fit";

export type MatchingScore = 1 | 2 | 3 | 4 | 5;
// 1 = Poor fit, 2 = Below average, 3 = Adequate, 4 = Good fit, 5 = Excellent fit

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface Transition {
  id: string;
  childId: string;
  childName: string;
  homeId: string;
  type: TransitionType;
  status: TransitionStatus;
  referralDate: string;
  referralSource: string;               // placing authority
  placingAuthority: string;
  socialWorkerName: string;
  expectedArrivalDate?: string;
  actualArrivalDate?: string;
  expectedDepartureDate?: string;
  actualDepartureDate?: string;
  matchingAssessment?: MatchingAssessment;
  impactAssessment?: ImpactAssessment;
  placementPlanDate?: string;
  placementPlanDue: string;
  riskAssessmentCompleted: boolean;
  childrenGuideProvided: boolean;
  reg44Notified: boolean;
  settlingInReviews: SettlingInReview[];
  departureReason?: string;
  departureDestination?: string;
  handoverCompleted?: boolean;
  recordedBy: string;
}

export interface MatchingAssessment {
  completedAt: string;
  completedBy: string;
  domains: { domain: MatchingDomain; score: MatchingScore; notes: string }[];
  overallScore: number;                 // average
  recommendation: "accept" | "accept_with_conditions" | "reject";
  conditions?: string[];
  existingChildrenConsulted: boolean;
  existingChildrenViews?: string;
}

export interface ImpactAssessment {
  completedAt: string;
  completedBy: string;
  impactOnExistingChildren: "positive" | "neutral" | "manageable" | "concerning" | "high_risk";
  impactOnStaffing: "adequate" | "stretched" | "insufficient";
  impactOnDynamics: string;
  mitigationActions: string[];
  approvedBy: string;
  approvedAt: string;
}

export interface SettlingInReview {
  date: string;
  hoursPostArrival: number;
  childSettling: "well" | "mixed" | "struggling";
  sleepFirstNight?: boolean;
  eatFirstMeal?: boolean;
  engagedWithPeers?: boolean;
  expressedWorries: string[];
  supportProvided: string[];
  concerns: string[];
  reviewedBy: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface TransitionComplianceResult {
  transitionId: string;
  childName: string;
  type: TransitionType;
  status: TransitionStatus;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  matchingCompleted: boolean;
  matchingScore?: number;
  impactAssessmentCompleted: boolean;
  placementPlanOnTime: boolean;
  riskAssessmentDone: boolean;
  childrenGuideGiven: boolean;
  reg44Notified: boolean;
  settlingInMonitored: boolean;
  daysInPlacement?: number;
}

export interface HomeTransitionMetrics {
  homeId: string;
  currentOccupancy: number;
  registeredCapacity: number;
  occupancyRate: number;                // %
  totalTransitions12Months: number;
  admissionsThisYear: number;
  departuresThisYear: number;
  emergencyAdmissionRate: number;       // %
  averageMatchingScore: number;
  matchingComplianceRate: number;       // % with assessment done
  impactAssessmentRate: number;         // %
  placementPlanOnTimeRate: number;      // %
  settlingInComplianceRate: number;     // %
  averagePlacementLength: number;       // months
  plannedMoveRate: number;              // % departures that were planned
  activeTransitions: { childName: string; type: string; status: string; days: number }[];
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const PLACEMENT_PLAN_DEADLINE_DAYS = 5;     // 5 working days
const SETTLING_IN_HOURS = [4, 24, 72];       // reviews at 4h, 24h, 72h
const MATCHING_THRESHOLD = 3;                // minimum acceptable matching score

// ── Core: Evaluate Transition Compliance ────────────────────────────────────

export function evaluateTransitionCompliance(
  transition: Transition,
  now?: string,
): TransitionComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  const isAdmission = transition.type.startsWith("admission") || transition.type === "internal_move" || transition.type === "step_down" || transition.type === "step_up";
  const hasArrived = transition.status === "arrived" || transition.status === "settling_in" || transition.status === "established" || transition.status === "departed";

  // Matching assessment
  const matchingCompleted = !!transition.matchingAssessment;
  if (isAdmission && !matchingCompleted && transition.type !== "admission_emergency") {
    issues.push("Matching assessment not completed before admission");
  }

  // Impact assessment
  const impactAssessmentCompleted = !!transition.impactAssessment;
  if (isAdmission && !impactAssessmentCompleted) {
    if (transition.type === "admission_emergency") {
      if (hasArrived) {
        warnings.push("Emergency admission — impact assessment should be completed within 72 hours");
      }
    } else {
      issues.push("Impact assessment not completed (Reg 14 requirement)");
    }
  }

  // Placement plan
  let placementPlanOnTime = true;
  if (hasArrived) {
    const planDueTime = new Date(transition.placementPlanDue).getTime();
    if (transition.placementPlanDate) {
      const planTime = new Date(transition.placementPlanDate).getTime();
      if (planTime > planDueTime) {
        placementPlanOnTime = false;
        warnings.push("Placement plan completed after 5-day deadline");
      }
    } else if (currentTime > planDueTime) {
      placementPlanOnTime = false;
      issues.push("Placement plan overdue (5 working days from admission)");
    }
  }

  // Risk assessment
  if (hasArrived && !transition.riskAssessmentCompleted) {
    issues.push("Risk assessment not completed for placed child");
  }

  // Children's guide
  if (hasArrived && !transition.childrenGuideProvided) {
    issues.push("Children's guide not provided on arrival");
  }

  // Reg 44 notification
  if (isAdmission && hasArrived && !transition.reg44Notified) {
    warnings.push("Reg 44 independent visitor not notified of admission");
  }

  // Settling-in reviews
  let settlingInMonitored = true;
  if (hasArrived && transition.actualArrivalDate) {
    const hoursSinceArrival = (currentTime - new Date(transition.actualArrivalDate).getTime()) / (60 * 60 * 1000);
    const expectedReviews = SETTLING_IN_HOURS.filter(h => h <= hoursSinceArrival);
    if (expectedReviews.length > transition.settlingInReviews.length) {
      settlingInMonitored = false;
      warnings.push(`Settling-in reviews behind schedule (${transition.settlingInReviews.length}/${expectedReviews.length} expected)`);
    }
  }

  // Matching score check
  let matchingScore: number | undefined;
  if (transition.matchingAssessment) {
    matchingScore = transition.matchingAssessment.overallScore;
    if (matchingScore < MATCHING_THRESHOLD) {
      warnings.push(`Low matching score (${matchingScore.toFixed(1)}/5) — review conditions`);
    }
  }

  // Days in placement
  let daysInPlacement: number | undefined;
  if (transition.actualArrivalDate) {
    const endTime = transition.actualDepartureDate
      ? new Date(transition.actualDepartureDate).getTime()
      : currentTime;
    daysInPlacement = Math.round((endTime - new Date(transition.actualArrivalDate).getTime()) / (24 * 60 * 60 * 1000));
  }

  return {
    transitionId: transition.id,
    childName: transition.childName,
    type: transition.type,
    status: transition.status,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    matchingCompleted,
    matchingScore,
    impactAssessmentCompleted,
    placementPlanOnTime,
    riskAssessmentDone: transition.riskAssessmentCompleted,
    childrenGuideGiven: transition.childrenGuideProvided,
    reg44Notified: transition.reg44Notified,
    settlingInMonitored,
    daysInPlacement,
  };
}

// ── Core: Calculate Home Metrics ────────────────────────────────────────────

export function calculateTransitionMetrics(
  transitions: Transition[],
  homeId: string,
  registeredCapacity: number,
  now?: string,
): HomeTransitionMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const twelveMonthsAgo = currentTime - 365 * 24 * 60 * 60 * 1000;

  const homeTransitions = transitions.filter(t => t.homeId === homeId);
  const last12Months = homeTransitions.filter(t => new Date(t.referralDate).getTime() > twelveMonthsAgo);

  // Current occupancy (children currently placed)
  const currentResidents = homeTransitions.filter(t =>
    t.actualArrivalDate &&
    !t.actualDepartureDate &&
    (t.status === "arrived" || t.status === "settling_in" || t.status === "established")
  );
  const currentOccupancy = currentResidents.length;
  const occupancyRate = registeredCapacity > 0 ? Math.round((currentOccupancy / registeredCapacity) * 100) : 0;

  // Admissions and departures
  const admissions = last12Months.filter(t => t.type.startsWith("admission") || t.type === "step_down" || t.type === "step_up");
  const departures = last12Months.filter(t => t.status === "departed");

  // Emergency rate
  const emergencyAdmissions = admissions.filter(t => t.type === "admission_emergency");
  const emergencyAdmissionRate = admissions.length > 0
    ? Math.round((emergencyAdmissions.length / admissions.length) * 100)
    : 0;

  // Matching scores
  const withMatching = admissions.filter(t => t.matchingAssessment);
  const averageMatchingScore = withMatching.length > 0
    ? Math.round((withMatching.reduce((s, t) => s + t.matchingAssessment!.overallScore, 0) / withMatching.length) * 10) / 10
    : 0;
  const matchingComplianceRate = admissions.length > 0
    ? Math.round((withMatching.length / admissions.length) * 100)
    : 100;

  // Impact assessment rate
  const withImpact = admissions.filter(t => t.impactAssessment);
  const impactAssessmentRate = admissions.length > 0
    ? Math.round((withImpact.length / admissions.length) * 100)
    : 100;

  // Placement plan compliance
  const arrivedTransitions = homeTransitions.filter(t => t.actualArrivalDate);
  const complianceResults = arrivedTransitions.map(t => evaluateTransitionCompliance(t, now));
  const planOnTime = complianceResults.filter(r => r.placementPlanOnTime);
  const placementPlanOnTimeRate = complianceResults.length > 0
    ? Math.round((planOnTime.length / complianceResults.length) * 100)
    : 100;

  // Settling-in compliance
  const settlingCompliant = complianceResults.filter(r => r.settlingInMonitored);
  const settlingInComplianceRate = complianceResults.length > 0
    ? Math.round((settlingCompliant.length / complianceResults.length) * 100)
    : 100;

  // Average placement length
  const completedPlacements = homeTransitions.filter(t => t.actualArrivalDate && t.actualDepartureDate);
  const totalDays = completedPlacements.reduce((sum, t) => {
    const days = (new Date(t.actualDepartureDate!).getTime() - new Date(t.actualArrivalDate!).getTime()) / (24 * 60 * 60 * 1000);
    return sum + days;
  }, 0);
  const averagePlacementLength = completedPlacements.length > 0
    ? Math.round((totalDays / completedPlacements.length / 30.44) * 10) / 10
    : 0;

  // Planned move rate
  const plannedDepartures = departures.filter(t =>
    t.type === "leaving_planned" || t.type === "leaving_18" || t.type === "reunification" || t.type === "step_down"
  );
  const plannedMoveRate = departures.length > 0
    ? Math.round((plannedDepartures.length / departures.length) * 100)
    : 100;

  // Active transitions
  const active = homeTransitions
    .filter(t => t.status !== "departed" && t.status !== "cancelled" && t.status !== "rejected" && t.status !== "established")
    .map(t => {
      const startTime = new Date(t.referralDate).getTime();
      const days = Math.round((currentTime - startTime) / (24 * 60 * 60 * 1000));
      return { childName: t.childName, type: t.type, status: t.status, days };
    });

  // Compliance issues
  const allIssues = complianceResults.flatMap(r => r.issues);
  const uniqueIssues = [...new Set(allIssues)];

  return {
    homeId,
    currentOccupancy,
    registeredCapacity,
    occupancyRate,
    totalTransitions12Months: last12Months.length,
    admissionsThisYear: admissions.length,
    departuresThisYear: departures.length,
    emergencyAdmissionRate,
    averageMatchingScore,
    matchingComplianceRate,
    impactAssessmentRate,
    placementPlanOnTimeRate,
    settlingInComplianceRate,
    averagePlacementLength,
    plannedMoveRate,
    activeTransitions: active,
    complianceIssues: uniqueIssues,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function getTransitionTypeLabel(type: TransitionType): string {
  const labels: Record<TransitionType, string> = {
    admission_planned: "Planned Admission",
    admission_emergency: "Emergency Admission",
    internal_move: "Internal Move",
    step_down: "Step Down",
    step_up: "Step Up",
    leaving_planned: "Planned Departure",
    leaving_unplanned: "Unplanned Departure",
    leaving_18: "Leaving at 18",
    reunification: "Reunification",
  };
  return labels[type] ?? type;
}

export function getTransitionStatusLabel(status: TransitionStatus): string {
  const labels: Record<TransitionStatus, string> = {
    referral_received: "Referral Received",
    matching_assessment: "Matching",
    impact_assessment: "Impact Assessment",
    approved: "Approved",
    placement_confirmed: "Confirmed",
    arrived: "Arrived",
    settling_in: "Settling In",
    established: "Established",
    move_planning: "Move Planning",
    departed: "Departed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return labels[status] ?? status;
}
