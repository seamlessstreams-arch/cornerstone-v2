// ═════��════════════════════════════════════════════════════════════════════════
// Cornerstone Location Assessment Engine
//
// Deterministic engine for evaluating children's home location risk
// assessments, Annex A requirements, community safety mapping, and
// environmental suitability checks.
//
// Aligned to:
//   - CHR 2015 Reg 46 — Location assessment (Schedule 4)
//   - CHR 2015 Schedule 4 (Annex A) — Matters to consider
//   - CHR 2015 Reg 12 — Protection of children (area-based risks)
//   - SCCIF — Location and community assessment
//   - DfE Guide: Location assessments for children's homes
//
// Annex A considerations (Schedule 4):
//   - Area profile and demographics
//   - Local services (GP, dentist, CAMHS, education)
//   - Transport links
//   - Local risks (crime, exploitation, substances)
//   - Neighbourhood relationships
//   - Emergency services proximity
//   - Suitability of local area for children placed
//   - Review frequency (annual minimum, or after significant change)
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "very_high";

export type AssessmentStatus = "current" | "due_review" | "overdue" | "draft";

export type ServiceCategory =
  | "gp_surgery"
  | "dentist"
  | "hospital_ae"
  | "camhs"
  | "school_primary"
  | "school_secondary"
  | "college"
  | "police_station"
  | "fire_station"
  | "pharmacy"
  | "public_transport"
  | "leisure_facilities"
  | "library"
  | "social_services";

export type AreaRiskCategory =
  | "crime_general"
  | "drug_activity"
  | "county_lines"
  | "cse_risk"
  | "gang_activity"
  | "antisocial_behaviour"
  | "road_safety"
  | "environmental_hazards"
  | "extremism"
  | "missing_from_home_hotspot";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface LocalService {
  category: ServiceCategory;
  name: string;
  distanceMiles: number;
  accessibleByPublicTransport: boolean;
  waitingTimeWeeks?: number;
  notes?: string;
}

export interface AreaRisk {
  category: AreaRiskCategory;
  level: RiskLevel;
  description: string;
  source: string;                          // e.g. "Police data Q1 2026", "Ofsted area profile"
  dateAssessed: string;
  mitigations: string[];
}

export interface NeighbourRelationship {
  description: string;
  quality: "positive" | "neutral" | "negative" | "unknown";
  dateLastAssessed: string;
  notes?: string;
}

export interface LocationAssessment {
  id: string;
  homeId: string;
  homeName: string;
  address: string;
  assessmentDate: string;
  reviewDueDate: string;
  assessedBy: string;
  approvedBy?: string;
  status: AssessmentStatus;
  // Annex A areas
  localServices: LocalService[];
  areaRisks: AreaRisk[];
  neighbourRelationships: NeighbourRelationship[];
  // Transport
  nearestBusStopMiles: number;
  nearestTrainStationMiles: number;
  publicTransportAdequate: boolean;
  // Environment
  outdoorSpaceAvailable: boolean;
  safePlayAreaNearby: boolean;
  communityActivitiesAvailable: boolean;
  // Children's views
  childrenConsulted: boolean;
  childrenViewsOnArea: string[];
  // Overall
  overallRiskLevel: RiskLevel;
  overallSuitability: "suitable" | "suitable_with_mitigations" | "unsuitable";
  keyStrengths: string[];
  keyRisks: string[];
  actionPlan: ActionPlanItem[];
  // Metadata
  lastReviewDate?: string;
  significantChangeSinceLastReview: boolean;
  triggerForReview?: string;
}

export interface ActionPlanItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: "open" | "in_progress" | "completed" | "overdue";
  completedDate?: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface LocationComplianceResult {
  homeId: string;
  homeName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Status
  assessmentStatus: AssessmentStatus;
  daysSinceAssessment: number;
  daysUntilReviewDue: number;
  overdue: boolean;
  // Annex A coverage
  annexACoverage: number;                  // % of required areas assessed
  servicesAccessScore: number;             // 0-100
  areaRiskScore: number;                   // 0-100 (lower = more risk)
  // Specific checks
  gpAccessible: boolean;
  educationAccessible: boolean;
  camhsAccessible: boolean;
  emergencyServicesNearby: boolean;
  publicTransportAdequate: boolean;
  childrenConsulted: boolean;
  // Risks
  highRiskAreas: string[];
  mitigationsInPlace: number;
  outstandingActions: number;
  overdueActions: number;
  // Suitability
  overallSuitability: string;
  overallRiskLevel: string;
}

export interface HomeLocationMetrics {
  homeId: string;
  // Assessment state
  assessmentCurrent: boolean;
  daysSinceLastAssessment: number;
  daysUntilNextReview: number;
  reviewOverdue: boolean;
  // Scores
  servicesAccessScore: number;
  areaRiskScore: number;
  overallLocationScore: number;
  // Breakdown
  totalServicesAssessed: number;
  servicesWithinReach: number;
  totalAreaRisks: number;
  highRisks: number;
  mediumRisks: number;
  mitigationsInPlace: number;
  // Actions
  totalActions: number;
  completedActions: number;
  outstandingActions: number;
  overdueActions: number;
  actionCompletionRate: number;
  // Community
  neighbourRelationshipsPositive: number;
  neighbourRelationshipsNegative: number;
  childrenConsulted: boolean;
  // Compliance
  complianceIssues: string[];
}

// ── Configuration ───��──────────────────────────────────────────────────────

const REVIEW_OVERDUE_DAYS = 0;             // Past review date = overdue
const MAX_ACCEPTABLE_GP_DISTANCE = 3;      // miles
const MAX_ACCEPTABLE_SCHOOL_DISTANCE = 5;
const MAX_ACCEPTABLE_AE_DISTANCE = 15;
const REQUIRED_SERVICE_CATEGORIES: ServiceCategory[] = [
  "gp_surgery",
  "hospital_ae",
  "school_secondary",
  "police_station",
  "public_transport",
];

// ── Core: Evaluate Location Compliance ────────────────────────────────────

export function evaluateLocationCompliance(
  assessment: LocationAssessment,
  now?: string,
): LocationComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  // Days calculations
  const daysSinceAssessment = Math.round(
    (currentTime - new Date(assessment.assessmentDate).getTime()) / (24 * 60 * 60 * 1000)
  );
  const daysUntilReviewDue = Math.round(
    (new Date(assessment.reviewDueDate).getTime() - currentTime) / (24 * 60 * 60 * 1000)
  );
  const overdue = daysUntilReviewDue < REVIEW_OVERDUE_DAYS;

  if (overdue) {
    issues.push(`Location assessment review overdue by ${Math.abs(daysUntilReviewDue)} day(s)`);
  }

  // Annex A coverage — check required service categories present
  const assessedCategories = new Set(assessment.localServices.map(s => s.category));
  const requiredCovered = REQUIRED_SERVICE_CATEGORIES.filter(c => assessedCategories.has(c));
  const annexACoverage = Math.round((requiredCovered.length / REQUIRED_SERVICE_CATEGORIES.length) * 100);

  if (annexACoverage < 100) {
    const missing = REQUIRED_SERVICE_CATEGORIES.filter(c => !assessedCategories.has(c));
    issues.push(`Annex A: missing assessment of ${missing.map(getServiceLabel).join(", ")}`);
  }

  // Services access score
  const serviceScores = assessment.localServices.map(s => {
    let score = 100;
    if (s.category === "gp_surgery" && s.distanceMiles > MAX_ACCEPTABLE_GP_DISTANCE) score -= 30;
    if (s.category === "hospital_ae" && s.distanceMiles > MAX_ACCEPTABLE_AE_DISTANCE) score -= 40;
    if ((s.category === "school_primary" || s.category === "school_secondary") && s.distanceMiles > MAX_ACCEPTABLE_SCHOOL_DISTANCE) score -= 30;
    if (!s.accessibleByPublicTransport) score -= 20;
    return Math.max(score, 0);
  });
  const servicesAccessScore = serviceScores.length > 0
    ? Math.round(serviceScores.reduce((a, b) => a + b, 0) / serviceScores.length)
    : 0;

  // Specific access checks
  const gpService = assessment.localServices.find(s => s.category === "gp_surgery");
  const gpAccessible = !!gpService && gpService.distanceMiles <= MAX_ACCEPTABLE_GP_DISTANCE;

  const educationService = assessment.localServices.find(
    s => s.category === "school_secondary" || s.category === "school_primary"
  );
  const educationAccessible = !!educationService && educationService.distanceMiles <= MAX_ACCEPTABLE_SCHOOL_DISTANCE;

  const camhsService = assessment.localServices.find(s => s.category === "camhs");
  const camhsAccessible = !!camhsService;

  const emergencyServices = assessment.localServices.filter(
    s => s.category === "hospital_ae" || s.category === "police_station" || s.category === "fire_station"
  );
  const emergencyServicesNearby = emergencyServices.length >= 2;

  if (!gpAccessible) warnings.push("GP surgery not within acceptable distance (3 miles)");
  if (!educationAccessible) warnings.push("Education provision not within acceptable distance (5 miles)");
  if (!camhsAccessible) warnings.push("CAMHS service not assessed or not available locally");
  if (!emergencyServicesNearby) warnings.push("Insufficient emergency services assessed nearby");

  // Area risk score (100 = no risk, 0 = maximum risk)
  const riskScoreMap: Record<RiskLevel, number> = { low: 90, medium: 60, high: 30, very_high: 10 };
  const riskScores = assessment.areaRisks.map(r => riskScoreMap[r.level]);
  const areaRiskScore = riskScores.length > 0
    ? Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length)
    : 100;

  // High risk areas
  const highRiskAreas = assessment.areaRisks
    .filter(r => r.level === "high" || r.level === "very_high")
    .map(r => getAreaRiskLabel(r.category));

  if (highRiskAreas.length > 0) {
    warnings.push(`High/very high risk identified: ${highRiskAreas.join(", ")}`);
  }

  // Mitigations
  const totalMitigations = assessment.areaRisks.reduce((sum, r) => sum + r.mitigations.length, 0);
  const highRisksWithoutMitigations = assessment.areaRisks.filter(
    r => (r.level === "high" || r.level === "very_high") && r.mitigations.length === 0
  );
  if (highRisksWithoutMitigations.length > 0) {
    issues.push(`${highRisksWithoutMitigations.length} high-risk area(s) without mitigations`);
  }

  // Actions
  const outstandingActions = assessment.actionPlan.filter(
    a => a.status === "open" || a.status === "in_progress"
  ).length;
  const overdueActions = assessment.actionPlan.filter(a => a.status === "overdue").length;
  if (overdueActions > 0) {
    warnings.push(`${overdueActions} overdue action(s) in location action plan`);
  }

  // Children consulted
  if (!assessment.childrenConsulted) {
    issues.push("Children not consulted about local area in assessment");
  }

  // Public transport
  const publicTransportAdequate = assessment.publicTransportAdequate;
  if (!publicTransportAdequate) {
    warnings.push("Public transport assessed as inadequate");
  }

  // Approval
  if (!assessment.approvedBy) {
    warnings.push("Location assessment not yet approved by senior manager");
  }

  return {
    homeId: assessment.homeId,
    homeName: assessment.homeName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    assessmentStatus: assessment.status,
    daysSinceAssessment,
    daysUntilReviewDue,
    overdue,
    annexACoverage,
    servicesAccessScore,
    areaRiskScore,
    gpAccessible,
    educationAccessible,
    camhsAccessible,
    emergencyServicesNearby,
    publicTransportAdequate,
    childrenConsulted: assessment.childrenConsulted,
    highRiskAreas,
    mitigationsInPlace: totalMitigations,
    outstandingActions,
    overdueActions,
    overallSuitability: assessment.overallSuitability,
    overallRiskLevel: assessment.overallRiskLevel,
  };
}

// ── Core: Calculate Home Location Metrics ─────────────────────────────────

export function calculateHomeLocationMetrics(
  assessment: LocationAssessment,
  now?: string,
): HomeLocationMetrics {
  const compliance = evaluateLocationCompliance(assessment, now);

  const totalServicesAssessed = assessment.localServices.length;
  const servicesWithinReach = assessment.localServices.filter(s => {
    if (s.category === "gp_surgery") return s.distanceMiles <= MAX_ACCEPTABLE_GP_DISTANCE;
    if (s.category === "hospital_ae") return s.distanceMiles <= MAX_ACCEPTABLE_AE_DISTANCE;
    if (s.category === "school_secondary" || s.category === "school_primary") return s.distanceMiles <= MAX_ACCEPTABLE_SCHOOL_DISTANCE;
    return s.distanceMiles <= 5; // default 5 mile threshold
  }).length;

  const totalAreaRisks = assessment.areaRisks.length;
  const highRisks = assessment.areaRisks.filter(r => r.level === "high" || r.level === "very_high").length;
  const mediumRisks = assessment.areaRisks.filter(r => r.level === "medium").length;
  const mitigationsInPlace = assessment.areaRisks.reduce((s, r) => s + r.mitigations.length, 0);

  const totalActions = assessment.actionPlan.length;
  const completedActions = assessment.actionPlan.filter(a => a.status === "completed").length;
  const outstandingActions = assessment.actionPlan.filter(
    a => a.status === "open" || a.status === "in_progress"
  ).length;
  const overdueActions = assessment.actionPlan.filter(a => a.status === "overdue").length;
  const actionCompletionRate = totalActions > 0
    ? Math.round((completedActions / totalActions) * 100)
    : 100;

  const neighbourRelationshipsPositive = assessment.neighbourRelationships.filter(
    n => n.quality === "positive"
  ).length;
  const neighbourRelationshipsNegative = assessment.neighbourRelationships.filter(
    n => n.quality === "negative"
  ).length;

  // Overall location score (weighted average)
  const overallLocationScore = Math.round(
    compliance.servicesAccessScore * 0.4 +
    compliance.areaRiskScore * 0.4 +
    (compliance.annexACoverage) * 0.2
  );

  return {
    homeId: assessment.homeId,
    assessmentCurrent: !compliance.overdue,
    daysSinceLastAssessment: compliance.daysSinceAssessment,
    daysUntilNextReview: compliance.daysUntilReviewDue,
    reviewOverdue: compliance.overdue,
    servicesAccessScore: compliance.servicesAccessScore,
    areaRiskScore: compliance.areaRiskScore,
    overallLocationScore,
    totalServicesAssessed,
    servicesWithinReach,
    totalAreaRisks,
    highRisks,
    mediumRisks,
    mitigationsInPlace,
    totalActions,
    completedActions,
    outstandingActions,
    overdueActions,
    actionCompletionRate,
    neighbourRelationshipsPositive,
    neighbourRelationshipsNegative,
    childrenConsulted: assessment.childrenConsulted,
    complianceIssues: compliance.issues,
  };
}

// ── Label Helpers ────────��───────────────────────────────────────────────

export function getServiceLabel(category: ServiceCategory): string {
  const labels: Record<ServiceCategory, string> = {
    gp_surgery: "GP Surgery",
    dentist: "Dentist",
    hospital_ae: "Hospital A&E",
    camhs: "CAMHS",
    school_primary: "Primary School",
    school_secondary: "Secondary School",
    college: "College",
    police_station: "Police Station",
    fire_station: "Fire Station",
    pharmacy: "Pharmacy",
    public_transport: "Public Transport Hub",
    leisure_facilities: "Leisure Facilities",
    library: "Library",
    social_services: "Social Services Office",
  };
  return labels[category] ?? category;
}

export function getAreaRiskLabel(category: AreaRiskCategory): string {
  const labels: Record<AreaRiskCategory, string> = {
    crime_general: "General Crime",
    drug_activity: "Drug Activity",
    county_lines: "County Lines",
    cse_risk: "CSE Risk",
    gang_activity: "Gang Activity",
    antisocial_behaviour: "Antisocial Behaviour",
    road_safety: "Road Safety",
    environmental_hazards: "Environmental Hazards",
    extremism: "Extremism",
    missing_from_home_hotspot: "Missing from Home Hotspot",
  };
  return labels[category] ?? category;
}

export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    very_high: "Very High",
  };
  return labels[level] ?? level;
}
