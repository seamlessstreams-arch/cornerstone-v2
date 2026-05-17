// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Risk Assessment & Management Engine
//
// Deterministic engine for individual child risk profiles, risk categories,
// control measures, dynamic scoring, review cycles, and escalation triggers.
//
// Aligned to:
//   - CHR 2015 Reg 12 — Protection of children
//   - CHR 2015 Reg 13 — Behaviour management
//   - CHR 2015 Reg 34 — Significant events notification
//   - SCCIF — Safety: risk management
//   - Working Together to Safeguard Children 2023
//   - DfE Risk Assessment Framework for Residential Settings
//   - NICE CG158 — Antisocial behaviour (management)
//
// Key requirements:
//   - Individual risk assessments for each child
//   - Dynamic scoring based on recent incidents and context
//   - Control measures documented and reviewed
//   - Regular review cycles (minimum monthly, or post-incident)
//   - Escalation triggers clearly defined
//   - Multi-agency information sharing evidenced
//   - Children involved in their own risk management
//   - Positive risk-taking recorded where appropriate
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type RiskCategory =
  | "self_harm"
  | "suicide"
  | "cse"
  | "cce"
  | "missing"
  | "aggression_to_others"
  | "aggression_to_property"
  | "substance_misuse"
  | "radicalisation"
  | "online_harm"
  | "bullying_perpetrator"
  | "bullying_victim"
  | "fire_setting"
  | "absconding"
  | "trafficking"
  | "gang_affiliation"
  | "eating_disorder"
  | "self_neglect";

export type RiskLevel = "low" | "medium" | "high" | "very_high";

export type ControlMeasureStatus = "active" | "reviewed" | "discontinued" | "escalated";

export type ReviewOutcome = "maintained" | "increased" | "decreased" | "new_measures" | "closed";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface ChildRiskProfile {
  childId: string;
  childName: string;
  homeId: string;
  dateOfBirth: string;
  riskAssessments: RiskAssessment[];
  incidents: RiskIncident[];
  positiveRiskTaking: PositiveRiskEntry[];
  childInvolvedInPlanning: boolean;
  multiAgencyMeetingDate?: string;
  lastOverallReviewDate?: string;
}

export interface RiskAssessment {
  id: string;
  category: RiskCategory;
  currentLevel: RiskLevel;
  previousLevel?: RiskLevel;
  dateAssessed: string;
  nextReviewDate: string;
  assessedBy: string;
  triggers: string[];
  controlMeasures: ControlMeasure[];
  contextualFactors: string[];
  protectiveFactors: string[];
  escalationPlan: string;
  childAware: boolean;
}

export interface ControlMeasure {
  id: string;
  description: string;
  status: ControlMeasureStatus;
  implementedDate: string;
  lastReviewedDate: string;
  responsiblePerson: string;
  effectiveness?: "effective" | "partially_effective" | "ineffective";
}

export interface RiskIncident {
  id: string;
  date: string;
  category: RiskCategory;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  immediateActionTaken: string;
  riskReassessed: boolean;
  notifiedParties: string[];
  recordedBy: string;
}

export interface PositiveRiskEntry {
  id: string;
  date: string;
  description: string;
  riskIdentified: string;
  mitigationsInPlace: string[];
  outcome: string;
  recordedBy: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface ChildRiskResult {
  childId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Risk summary
  overallRiskLevel: RiskLevel;
  totalAssessments: number;
  activeHighRisks: RiskCategory[];
  activeMediumRisks: RiskCategory[];
  // Reviews
  assessmentsOverdue: { category: RiskCategory; daysPastDue: number }[];
  overallReviewOverdue: boolean;
  // Incidents
  incidentsLast30Days: number;
  incidentsLast90Days: number;
  highSeverityIncidents30Days: number;
  // Control measures
  totalControlMeasures: number;
  activeControlMeasures: number;
  ineffectiveMeasures: number;
  // Positive risk
  positiveRiskEntries: number;
  // Score
  riskManagementScore: number;           // 0-100 (how well risk is MANAGED, not how risky)
}

export interface HomeRiskMetrics {
  homeId: string;
  childCount: number;
  overallManagementScore: number;
  childrenAtHighRisk: number;
  childrenAtVeryHighRisk: number;
  totalActiveAssessments: number;
  overdueReviews: number;
  totalIncidents30Days: number;
  totalIncidents90Days: number;
  highSeverityIncidents30Days: number;
  incidentsByCategory: { category: RiskCategory; count: number }[];
  mostPrevalentRisks: RiskCategory[];
  controlMeasureEffectivenessRate: number;
  positiveRiskTakingRate: number;        // % children with entries
  childInvolvementRate: number;
  multiAgencyEngagementRate: number;
  childrenWithIssues: { childName: string; issues: string[] }[];
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const REVIEW_OVERDUE_DAYS = 7;            // days past review date before flagging
const OVERALL_REVIEW_MAX_DAYS = 30;       // monthly overall review minimum
const MULTI_AGENCY_MAX_DAYS = 90;         // quarterly multi-agency engagement
const HIGH_INCIDENT_THRESHOLD = 3;        // 3+ incidents in 30 days triggers warning
const CRITICAL_INCIDENT_THRESHOLD = 1;    // any critical incident flags immediately

const RISK_LEVEL_WEIGHTS: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  very_high: 4,
};

// ── Core: Evaluate Child Risk Compliance ─────────────────────────────────

export function evaluateChildRiskCompliance(
  profile: ChildRiskProfile,
  now?: string,
): ChildRiskResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;
  const issues: string[] = [];
  const warnings: string[] = [];

  // ── Risk Level Summary ──────────────────────────────────────────────────
  const activeHighRisks = profile.riskAssessments
    .filter(a => a.currentLevel === "high" || a.currentLevel === "very_high")
    .filter(a => a.currentLevel === "high")
    .map(a => a.category);

  const veryHighRisks = profile.riskAssessments
    .filter(a => a.currentLevel === "very_high")
    .map(a => a.category);

  const activeMediumRisks = profile.riskAssessments
    .filter(a => a.currentLevel === "medium")
    .map(a => a.category);

  // Overall risk = highest single risk
  let overallRiskLevel: RiskLevel = "low";
  for (const assessment of profile.riskAssessments) {
    if (RISK_LEVEL_WEIGHTS[assessment.currentLevel] > RISK_LEVEL_WEIGHTS[overallRiskLevel]) {
      overallRiskLevel = assessment.currentLevel;
    }
  }

  // ── Review Compliance ───────────────────────────────────────────────────
  const assessmentsOverdue: { category: RiskCategory; daysPastDue: number }[] = [];
  for (const assessment of profile.riskAssessments) {
    const reviewDue = new Date(assessment.nextReviewDate).getTime();
    const daysOverdue = Math.floor((currentTime - reviewDue) / (24 * 60 * 60 * 1000));
    if (daysOverdue > REVIEW_OVERDUE_DAYS) {
      assessmentsOverdue.push({ category: assessment.category, daysPastDue: daysOverdue });
    }
  }

  if (assessmentsOverdue.length > 0) {
    issues.push(`${assessmentsOverdue.length} risk assessment(s) overdue for review`);
  }

  // Overall review
  let overallReviewOverdue = false;
  if (profile.lastOverallReviewDate) {
    const daysSinceOverall = (currentTime - new Date(profile.lastOverallReviewDate).getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceOverall > OVERALL_REVIEW_MAX_DAYS) {
      overallReviewOverdue = true;
      warnings.push(`Overall risk review overdue (${Math.round(daysSinceOverall)} days since last review)`);
    }
  } else if (profile.riskAssessments.length > 0) {
    overallReviewOverdue = true;
    issues.push("No overall risk review date recorded");
  }

  // ── Incidents ───────────────────────────────────────────────────────────
  const incidentsLast30Days = profile.incidents.filter(
    i => new Date(i.date).getTime() > thirtyDaysAgo
  ).length;

  const incidentsLast90Days = profile.incidents.filter(
    i => new Date(i.date).getTime() > ninetyDaysAgo
  ).length;

  const highSeverityIncidents30Days = profile.incidents.filter(
    i => new Date(i.date).getTime() > thirtyDaysAgo &&
      (i.severity === "high" || i.severity === "critical")
  ).length;

  if (incidentsLast30Days >= HIGH_INCIDENT_THRESHOLD) {
    warnings.push(`${incidentsLast30Days} incidents in last 30 days — review risk level`);
  }

  if (highSeverityIncidents30Days >= CRITICAL_INCIDENT_THRESHOLD) {
    warnings.push(`${highSeverityIncidents30Days} high/critical incident(s) in 30 days — immediate review needed`);
  }

  // Check incidents triggered reassessment
  const unreassessedIncidents = profile.incidents
    .filter(i => new Date(i.date).getTime() > thirtyDaysAgo && !i.riskReassessed &&
      (i.severity === "high" || i.severity === "critical"));

  if (unreassessedIncidents.length > 0) {
    issues.push("High/critical incident(s) without subsequent risk reassessment");
  }

  // ── Control Measures ────────────────────────────────────────────────────
  const allMeasures = profile.riskAssessments.flatMap(a => a.controlMeasures);
  const activeMeasures = allMeasures.filter(m => m.status === "active" || m.status === "reviewed");
  const ineffectiveMeasures = allMeasures.filter(m => m.effectiveness === "ineffective");

  if (ineffectiveMeasures.length > 0) {
    warnings.push(`${ineffectiveMeasures.length} control measure(s) marked ineffective — review needed`);
  }

  // High/very_high risks must have active control measures
  const highRiskAssessments = profile.riskAssessments.filter(
    a => a.currentLevel === "high" || a.currentLevel === "very_high"
  );
  for (const assessment of highRiskAssessments) {
    const activeForCategory = assessment.controlMeasures.filter(
      m => m.status === "active" || m.status === "reviewed"
    );
    if (activeForCategory.length === 0) {
      issues.push(`No active control measures for ${getRiskCategoryLabel(assessment.category)} (${assessment.currentLevel} risk)`);
    }
  }

  // ── Child Involvement ───────────────────────────────────────────────────
  if (!profile.childInvolvedInPlanning) {
    warnings.push("Child not involved in risk management planning");
  }

  const assessmentsChildUnaware = profile.riskAssessments.filter(a => !a.childAware);
  if (assessmentsChildUnaware.length > 0 && profile.riskAssessments.length > 0) {
    warnings.push(`Child not aware of ${assessmentsChildUnaware.length} risk assessment(s)`);
  }

  // ── Multi-Agency ────────────────────────────────────────────────────────
  if (profile.multiAgencyMeetingDate) {
    const daysSinceMAM = (currentTime - new Date(profile.multiAgencyMeetingDate).getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceMAM > MULTI_AGENCY_MAX_DAYS && (overallRiskLevel === "high" || overallRiskLevel === "very_high")) {
      warnings.push("Multi-agency engagement overdue for high-risk child");
    }
  } else if (overallRiskLevel === "high" || overallRiskLevel === "very_high") {
    issues.push("No multi-agency meeting recorded for high-risk child");
  }

  // ── No Assessments Check ────────────────────────────────────────────────
  if (profile.riskAssessments.length === 0) {
    issues.push("No risk assessments on file — mandatory baseline required");
  }

  // ── Score (Management Quality) ─────────────────────────────────────────
  const scoringFactors = [
    profile.riskAssessments.length > 0 ? 15 : 0,
    assessmentsOverdue.length === 0 ? 20 : assessmentsOverdue.length === 1 ? 10 : 0,
    !overallReviewOverdue ? 10 : 0,
    ineffectiveMeasures.length === 0 ? 10 : 0,
    unreassessedIncidents.length === 0 ? 15 : 0,
    profile.childInvolvedInPlanning ? 10 : 0,
    profile.positiveRiskTaking.length > 0 ? 10 : 0,
    (highRiskAssessments.length === 0 || highRiskAssessments.every(a =>
      a.controlMeasures.some(m => m.status === "active" || m.status === "reviewed")
    )) ? 10 : 0,
  ];
  const riskManagementScore = scoringFactors.reduce((a, b) => a + b, 0);

  return {
    childId: profile.childId,
    childName: profile.childName,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    overallRiskLevel,
    totalAssessments: profile.riskAssessments.length,
    activeHighRisks: [...activeHighRisks, ...veryHighRisks],
    activeMediumRisks,
    assessmentsOverdue,
    overallReviewOverdue,
    incidentsLast30Days,
    incidentsLast90Days,
    highSeverityIncidents30Days,
    totalControlMeasures: allMeasures.length,
    activeControlMeasures: activeMeasures.length,
    ineffectiveMeasures: ineffectiveMeasures.length,
    positiveRiskEntries: profile.positiveRiskTaking.length,
    riskManagementScore,
  };
}

// ── Core: Calculate Home Risk Metrics ────────────────────────────────────

export function calculateHomeRiskMetrics(
  profiles: ChildRiskProfile[],
  homeId: string,
  now?: string,
): HomeRiskMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;

  const homeProfiles = profiles.filter(p => p.homeId === homeId);
  const results = homeProfiles.map(p => evaluateChildRiskCompliance(p, now));
  const childCount = homeProfiles.length;

  // Management score
  const overallManagementScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.riskManagementScore, 0) / results.length)
    : 0;

  // Risk levels
  const childrenAtHighRisk = results.filter(
    r => r.overallRiskLevel === "high"
  ).length;
  const childrenAtVeryHighRisk = results.filter(
    r => r.overallRiskLevel === "very_high"
  ).length;

  // Assessments
  const totalActiveAssessments = results.reduce((s, r) => s + r.totalAssessments, 0);
  const overdueReviews = results.reduce((s, r) => s + r.assessmentsOverdue.length, 0);

  // Incidents
  const totalIncidents30Days = results.reduce((s, r) => s + r.incidentsLast30Days, 0);
  const totalIncidents90Days = results.reduce((s, r) => s + r.incidentsLast90Days, 0);
  const highSeverityIncidents30Days = results.reduce((s, r) => s + r.highSeverityIncidents30Days, 0);

  // Incidents by category
  const allIncidents = homeProfiles.flatMap(p => p.incidents)
    .filter(i => new Date(i.date).getTime() > ninetyDaysAgo);
  const categoryCounts = new Map<RiskCategory, number>();
  for (const incident of allIncidents) {
    categoryCounts.set(incident.category, (categoryCounts.get(incident.category) || 0) + 1);
  }
  const incidentsByCategory = [...categoryCounts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Most prevalent risks
  const riskCategoryCounts = new Map<RiskCategory, number>();
  for (const profile of homeProfiles) {
    for (const assessment of profile.riskAssessments) {
      if (assessment.currentLevel !== "low") {
        riskCategoryCounts.set(assessment.category, (riskCategoryCounts.get(assessment.category) || 0) + 1);
      }
    }
  }
  const mostPrevalentRisks = [...riskCategoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category]) => category);

  // Control measure effectiveness
  const allMeasures = homeProfiles
    .flatMap(p => p.riskAssessments)
    .flatMap(a => a.controlMeasures)
    .filter(m => m.effectiveness);
  const effectiveMeasures = allMeasures.filter(m => m.effectiveness === "effective");
  const controlMeasureEffectivenessRate = allMeasures.length > 0
    ? Math.round((effectiveMeasures.length / allMeasures.length) * 100)
    : 100;

  // Positive risk taking
  const childrenWithPositiveRisk = homeProfiles.filter(p => p.positiveRiskTaking.length > 0).length;
  const positiveRiskTakingRate = childCount > 0
    ? Math.round((childrenWithPositiveRisk / childCount) * 100)
    : 0;

  // Child involvement
  const childrenInvolved = homeProfiles.filter(p => p.childInvolvedInPlanning).length;
  const childInvolvementRate = childCount > 0
    ? Math.round((childrenInvolved / childCount) * 100)
    : 0;

  // Multi-agency
  const withRecentMAM = homeProfiles.filter(p => {
    if (!p.multiAgencyMeetingDate) return false;
    return (currentTime - new Date(p.multiAgencyMeetingDate).getTime()) < MULTI_AGENCY_MAX_DAYS * 24 * 60 * 60 * 1000;
  }).length;
  const highRiskChildren = homeProfiles.filter(p =>
    p.riskAssessments.some(a => a.currentLevel === "high" || a.currentLevel === "very_high")
  ).length;
  const multiAgencyEngagementRate = highRiskChildren > 0
    ? Math.round((withRecentMAM / highRiskChildren) * 100)
    : 100;

  // Issues
  const childrenWithIssues = results
    .filter(r => r.issues.length > 0)
    .map(r => ({ childName: r.childName, issues: r.issues }));

  const complianceIssues = [...new Set(results.flatMap(r => r.issues))];

  return {
    homeId,
    childCount,
    overallManagementScore,
    childrenAtHighRisk,
    childrenAtVeryHighRisk,
    totalActiveAssessments,
    overdueReviews,
    totalIncidents30Days,
    totalIncidents90Days,
    highSeverityIncidents30Days,
    incidentsByCategory,
    mostPrevalentRisks,
    controlMeasureEffectivenessRate,
    positiveRiskTakingRate,
    childInvolvementRate,
    multiAgencyEngagementRate,
    childrenWithIssues,
    complianceIssues,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getRiskCategoryLabel(category: RiskCategory): string {
  const labels: Record<RiskCategory, string> = {
    self_harm: "Self-Harm",
    suicide: "Suicide / Suicidal Ideation",
    cse: "Child Sexual Exploitation",
    cce: "Child Criminal Exploitation",
    missing: "Missing from Care",
    aggression_to_others: "Aggression to Others",
    aggression_to_property: "Aggression to Property",
    substance_misuse: "Substance Misuse",
    radicalisation: "Radicalisation",
    online_harm: "Online Harm",
    bullying_perpetrator: "Bullying (Perpetrator)",
    bullying_victim: "Bullying (Victim)",
    fire_setting: "Fire Setting",
    absconding: "Absconding",
    trafficking: "Trafficking",
    gang_affiliation: "Gang Affiliation",
    eating_disorder: "Eating Disorder",
    self_neglect: "Self-Neglect",
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
