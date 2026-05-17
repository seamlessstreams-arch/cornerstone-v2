// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Quality of Care Review Engine (Reg 45)
//
// Deterministic engine for evaluating and scoring the quality of care across
// all SCCIF judgement areas. Used to generate the 6-monthly Regulation 45
// Quality of Care Review required by CHR 2015 Reg 45.
//
// Aligned to:
//   - CHR 2015 Reg 45 — Review of quality of care
//   - SCCIF (Social Care Common Inspection Framework) — Judgement areas
//   - Ofsted Grade Descriptors — Outstanding/Good/RI/Inadequate criteria
//   - CHR 2015 Reg 5 — Statement of purpose compliance
//
// The RM must review at least every 6 months and produce a written report
// evaluating the adequacy and quality of care provided.
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type OfstedGrade = "outstanding" | "good" | "requires_improvement" | "inadequate";

export type SCCIFDomain =
  | "overall_experiences"
  | "safety"
  | "education_and_learning"
  | "health_and_wellbeing"
  | "positive_relationships"
  | "protection_of_children"
  | "leadership_and_management";

export type EvidenceStrength = "strong" | "adequate" | "limited" | "absent";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface DomainAssessment {
  domain: SCCIFDomain;
  score: number;                       // 0-100
  grade: OfstedGrade;
  strengths: string[];
  areasForImprovement: string[];
  evidenceItems: EvidenceItem[];
  evidenceStrength: EvidenceStrength;
  keyMetrics: { label: string; value: string; target?: string; met: boolean }[];
  reg44Findings?: string[];            // from independent visitor
  childVoiceEvidence?: string[];       // what children say
  partnerFeedback?: string[];          // social workers, IROs, etc.
}

export interface EvidenceItem {
  type: "metric" | "observation" | "child_voice" | "partner_feedback" | "reg44" | "incident" | "document";
  description: string;
  source: string;
  date?: string;
  positive: boolean;
}

export interface QualityInputData {
  homeId: string;
  homeName: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  registeredManager: string;
  registeredCapacity: number;
  currentOccupancy: number;

  // Domain-specific input metrics
  safety: SafetyInput;
  education: EducationInput;
  health: HealthInput;
  relationships: RelationshipsInput;
  protection: ProtectionInput;
  leadership: LeadershipInput;
}

export interface SafetyInput {
  totalIncidents: number;
  restraintCount: number;
  restraintReductionTrend: "reducing" | "stable" | "increasing";
  missingEpisodes: number;
  missingRepeatChildren: number;
  bullyingIncidents: number;
  environmentalRiskAssessmentsComplete: boolean;
  fireDrillsCompliant: boolean;
  medicationErrorCount: number;
  deEscalationRate: number;           // %
  childrenFeelSafe: number;           // % from surveys
}

export interface EducationInput {
  averageAttendance: number;          // %
  pepCompliance: number;              // %
  exclusionDays: number;
  childrenInEducation: number;        // %
  ppSpendRate: number;                // %
  progressingTowardsTargets: number;  // %
  enrichmentActivitiesPerWeek: number;
}

export interface HealthInput {
  ihaComplianceRate: number;          // %
  rhaComplianceRate: number;          // %
  sdqCompletionRate: number;          // %
  dentalCheckRate: number;            // %
  immunisationRate: number;           // %
  camhsReferralsMade: number;
  camhsWaitingList: number;
  healthyEatingScore: number;         // 0-100
  physicalActivityHoursPerWeek: number;
}

export interface RelationshipsInput {
  keyworkComplianceRate: number;      // %
  keyworkEngagementScore: number;     // 1-5
  childVoiceRate: number;             // %
  familyContactRate: number;          // % of planned contacts happening
  childrensMeetingsHeld: number;
  complaintsCount: number;
  complimentsCount: number;
  staffTurnoverRate: number;          // %
  agencyUsageRate: number;            // %
}

export interface ProtectionInput {
  safeguardingReferralsMade: number;
  safeguardingConcernsOpen: number;
  dbsComplianceRate: number;          // %
  saferRecruitmentCompliant: boolean;
  trainingComplianceRate: number;     // %
  supervisionComplianceRate: number;  // %
  allegationsThisPeriod: number;
  notifiableEvents: number;
  notifiableEventsCompliant: number;
  whistleblowingCulture: number;      // 0-100 from staff survey
}

export interface LeadershipInput {
  reg44VisitsCompliant: boolean;
  reg44ActionsClosed: number;         // %
  staffSupervisionRate: number;       // %
  staffQualificationRate: number;     // % at Level 3+
  policyReviewsCurrent: boolean;
  statementOfPurposeCurrent: boolean;
  complaintResponseRate: number;      // % responded within 10 days
  ofstedActionsComplete: number;      // %
  improvementPlanProgress: number;    // %
  staffMorale: number;                // 0-100
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface QualityOfCareReview {
  homeId: string;
  homeName: string;
  reviewDate: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  registeredManager: string;
  overallGrade: OfstedGrade;
  overallScore: number;               // 0-100
  domains: DomainAssessment[];
  topStrengths: string[];
  priorityActions: string[];
  regulatoryCompliance: {
    reg44Compliant: boolean;
    notifiableEventsCompliant: boolean;
    statementOfPurposeCurrent: boolean;
    staffingAdequate: boolean;
    recordKeepingAdequate: boolean;
  };
  childrenSummary: {
    capacity: number;
    occupancy: number;
    averageStay: number;
    placementStability: number;
  };
  previousReviewComparison?: {
    previousScore: number;
    trend: "improving" | "stable" | "declining";
    domainsImproved: SCCIFDomain[];
    domainsDeteriorated: SCCIFDomain[];
  };
}

// ── Configuration ──────────────────────────────────────────────────────────

const GRADE_THRESHOLDS: { grade: OfstedGrade; min: number }[] = [
  { grade: "outstanding", min: 85 },
  { grade: "good", min: 65 },
  { grade: "requires_improvement", min: 40 },
  { grade: "inadequate", min: 0 },
];

const DOMAIN_LABELS: Record<SCCIFDomain, string> = {
  overall_experiences: "Overall Experiences & Progress",
  safety: "How Safe Children Are",
  education_and_learning: "Education & Learning",
  health_and_wellbeing: "Health & Wellbeing",
  positive_relationships: "Positive Relationships",
  protection_of_children: "Protection of Children",
  leadership_and_management: "Leadership & Management",
};

const DOMAIN_WEIGHTS: Record<SCCIFDomain, number> = {
  overall_experiences: 0.20,
  safety: 0.15,
  education_and_learning: 0.15,
  health_and_wellbeing: 0.10,
  positive_relationships: 0.15,
  protection_of_children: 0.10,
  leadership_and_management: 0.15,
};

// ── Core: Generate Quality of Care Review ────────────────────────────────

export function generateQualityOfCareReview(
  input: QualityInputData,
  previousScore?: number,
): QualityOfCareReview {
  const reviewDate = new Date().toISOString();
  const domains: DomainAssessment[] = [];

  // Assess each domain
  domains.push(assessSafety(input));
  domains.push(assessEducation(input));
  domains.push(assessHealth(input));
  domains.push(assessRelationships(input));
  domains.push(assessProtection(input));
  domains.push(assessLeadership(input));

  // Calculate overall from domain scores
  const overallScore = calculateOverallScore(domains);
  domains.unshift(assessOverall(input, domains, overallScore));

  const overallGrade = scoreToGrade(overallScore);

  // Extract top strengths and priority actions
  const allStrengths = domains.flatMap(d => d.strengths);
  const allImprovements = domains.flatMap(d => d.areasForImprovement);
  const topStrengths = allStrengths.slice(0, 5);
  const priorityActions = allImprovements.slice(0, 5);

  // Regulatory compliance summary
  const regulatoryCompliance = {
    reg44Compliant: input.leadership.reg44VisitsCompliant,
    notifiableEventsCompliant: input.protection.notifiableEvents === 0 ||
      input.protection.notifiableEventsCompliant === input.protection.notifiableEvents,
    statementOfPurposeCurrent: input.leadership.statementOfPurposeCurrent,
    staffingAdequate: input.relationships.agencyUsageRate < 30 && input.relationships.staffTurnoverRate < 25,
    recordKeepingAdequate: input.leadership.staffSupervisionRate >= 80,
  };

  // Previous review comparison
  let previousReviewComparison: QualityOfCareReview["previousReviewComparison"];
  if (previousScore !== undefined) {
    const diff = overallScore - previousScore;
    const trend = diff > 3 ? "improving" : diff < -3 ? "declining" : "stable";
    previousReviewComparison = {
      previousScore,
      trend,
      domainsImproved: [],
      domainsDeteriorated: [],
    };
  }

  return {
    homeId: input.homeId,
    homeName: input.homeName,
    reviewDate,
    reviewPeriodStart: input.reviewPeriodStart,
    reviewPeriodEnd: input.reviewPeriodEnd,
    registeredManager: input.registeredManager,
    overallGrade,
    overallScore,
    domains,
    topStrengths,
    priorityActions,
    regulatoryCompliance,
    childrenSummary: {
      capacity: input.registeredCapacity,
      occupancy: input.currentOccupancy,
      averageStay: 0, // would come from placement data
      placementStability: 0,
    },
    previousReviewComparison,
  };
}

// ── Domain Assessments ───────────────────────────────────────────────────

function assessSafety(input: QualityInputData): DomainAssessment {
  const s = input.safety;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70; // base

  // De-escalation
  if (s.deEscalationRate >= 80) {
    score += 10;
    strengths.push("High de-escalation success rate demonstrating skilled practice");
  } else if (s.deEscalationRate < 50) {
    score -= 15;
    improvements.push("De-escalation rate below expectations — training review needed");
  }
  metrics.push({ label: "De-escalation rate", value: `${s.deEscalationRate}%`, target: "80%", met: s.deEscalationRate >= 80 });

  // Restraint trend
  if (s.restraintReductionTrend === "reducing") {
    score += 10;
    strengths.push("Restraint use is reducing — proactive behaviour support evident");
  } else if (s.restraintReductionTrend === "increasing") {
    score -= 15;
    improvements.push("Restraint use is increasing — review behaviour support plans");
  }

  // Missing episodes
  if (s.missingEpisodes === 0) {
    score += 5;
    strengths.push("No missing from care episodes this period");
  } else if (s.missingRepeatChildren > 0) {
    score -= 10;
    improvements.push(`${s.missingRepeatChildren} child(ren) with repeat missing episodes — pattern disruption needed`);
  }
  metrics.push({ label: "Missing episodes", value: String(s.missingEpisodes), target: "0", met: s.missingEpisodes === 0 });

  // Children feel safe
  if (s.childrenFeelSafe >= 90) {
    score += 10;
    strengths.push("Children consistently report feeling safe in the home");
  } else if (s.childrenFeelSafe < 70) {
    score -= 20;
    improvements.push("Children report not feeling safe — immediate review required");
  }
  metrics.push({ label: "Children feel safe", value: `${s.childrenFeelSafe}%`, target: "90%", met: s.childrenFeelSafe >= 90 });

  // Medication errors
  if (s.medicationErrorCount > 3) {
    score -= 10;
    improvements.push("Multiple medication errors — competency review needed");
  }

  // Fire drills
  if (!s.fireDrillsCompliant) {
    score -= 5;
    improvements.push("Fire drills not meeting frequency requirements");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "safety",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessEducation(input: QualityInputData): DomainAssessment {
  const e = input.education;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70;

  // Attendance
  if (e.averageAttendance >= 95) {
    score += 15;
    strengths.push("Excellent school attendance above national expectations");
  } else if (e.averageAttendance < 90) {
    score -= 15;
    improvements.push("School attendance below persistent absence threshold");
  }
  metrics.push({ label: "Attendance", value: `${e.averageAttendance}%`, target: "95%", met: e.averageAttendance >= 95 });

  // PEP compliance
  if (e.pepCompliance >= 100) {
    score += 10;
    strengths.push("All Personal Education Plans are current and reviewed");
  } else if (e.pepCompliance < 80) {
    score -= 10;
    improvements.push("PEP compliance below required standard");
  }
  metrics.push({ label: "PEP compliance", value: `${e.pepCompliance}%`, target: "100%", met: e.pepCompliance >= 100 });

  // Exclusions
  if (e.exclusionDays === 0) {
    score += 5;
    strengths.push("No exclusion days this period");
  } else if (e.exclusionDays > 5) {
    score -= 10;
    improvements.push(`${e.exclusionDays} exclusion days — education disruption concern`);
  }

  // Pupil Premium
  if (e.ppSpendRate >= 80) {
    score += 5;
    strengths.push("Good utilisation of Pupil Premium Plus funding");
  } else if (e.ppSpendRate < 50) {
    score -= 5;
    improvements.push("Pupil Premium Plus underspent — review allocation plans");
  }
  metrics.push({ label: "PP spend", value: `${e.ppSpendRate}%`, target: "80%", met: e.ppSpendRate >= 80 });

  // Progress
  if (e.progressingTowardsTargets >= 80) {
    score += 5;
    strengths.push("Most children making progress towards educational targets");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "education_and_learning",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessHealth(input: QualityInputData): DomainAssessment {
  const h = input.health;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70;

  // IHA/RHA
  if (h.ihaComplianceRate >= 100 && h.rhaComplianceRate >= 100) {
    score += 15;
    strengths.push("All health assessments (IHA/RHA) are current");
  } else if (h.rhaComplianceRate < 80) {
    score -= 10;
    improvements.push("Review Health Assessment compliance below target");
  }
  metrics.push({ label: "RHA compliance", value: `${h.rhaComplianceRate}%`, target: "100%", met: h.rhaComplianceRate >= 100 });

  // Dental
  if (h.dentalCheckRate >= 90) {
    score += 5;
    strengths.push("Regular dental check attendance maintained");
  } else if (h.dentalCheckRate < 70) {
    score -= 5;
    improvements.push("Dental check attendance requires improvement");
  }
  metrics.push({ label: "Dental checks", value: `${h.dentalCheckRate}%`, target: "90%", met: h.dentalCheckRate >= 90 });

  // SDQ
  if (h.sdqCompletionRate >= 100) {
    score += 5;
    strengths.push("SDQ assessments completed for all children");
  }
  metrics.push({ label: "SDQ completion", value: `${h.sdqCompletionRate}%`, target: "100%", met: h.sdqCompletionRate >= 100 });

  // CAMHS wait
  if (h.camhsWaitingList > 0) {
    score -= 5;
    improvements.push(`${h.camhsWaitingList} child(ren) on CAMHS waiting list — advocate for prioritisation`);
  }

  // Physical activity
  if (h.physicalActivityHoursPerWeek >= 3) {
    score += 5;
    strengths.push("Good levels of physical activity engagement");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "health_and_wellbeing",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessRelationships(input: QualityInputData): DomainAssessment {
  const r = input.relationships;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70;

  // Key working
  if (r.keyworkComplianceRate >= 90 && r.keyworkEngagementScore >= 4) {
    score += 15;
    strengths.push("Consistent, high-quality key working with strong engagement");
  } else if (r.keyworkComplianceRate < 70) {
    score -= 10;
    improvements.push("Key working sessions not meeting frequency requirements");
  }
  metrics.push({ label: "Keywork compliance", value: `${r.keyworkComplianceRate}%`, target: "90%", met: r.keyworkComplianceRate >= 90 });

  // Child voice
  if (r.childVoiceRate >= 80) {
    score += 10;
    strengths.push("Children's voice is well captured and evidenced in decisions");
  } else if (r.childVoiceRate < 50) {
    score -= 10;
    improvements.push("Child voice evidence insufficient — increase participation opportunities");
  }
  metrics.push({ label: "Child voice", value: `${r.childVoiceRate}%`, target: "80%", met: r.childVoiceRate >= 80 });

  // Family contact
  if (r.familyContactRate >= 90) {
    score += 5;
    strengths.push("Family contact plans consistently facilitated");
  } else if (r.familyContactRate < 70) {
    score -= 5;
    improvements.push("Family contact delivery below planned frequency");
  }

  // Staff stability
  if (r.staffTurnoverRate < 15 && r.agencyUsageRate < 15) {
    score += 10;
    strengths.push("Low staff turnover and minimal agency use — stable team");
  } else if (r.staffTurnoverRate > 30 || r.agencyUsageRate > 30) {
    score -= 15;
    improvements.push("High staff turnover/agency use impacting relationship continuity");
  }
  metrics.push({ label: "Staff turnover", value: `${r.staffTurnoverRate}%`, target: "<20%", met: r.staffTurnoverRate < 20 });

  // Complaints/compliments ratio
  if (r.complimentsCount > r.complaintsCount * 2) {
    score += 5;
    strengths.push("Positive feedback significantly outweighs complaints");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "positive_relationships",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessProtection(input: QualityInputData): DomainAssessment {
  const p = input.protection;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70;

  // DBS
  if (p.dbsComplianceRate >= 100) {
    score += 10;
    strengths.push("All staff DBS checks current");
  } else if (p.dbsComplianceRate < 90) {
    score -= 20;
    improvements.push("DBS compliance below acceptable level — immediate action required");
  }
  metrics.push({ label: "DBS compliance", value: `${p.dbsComplianceRate}%`, target: "100%", met: p.dbsComplianceRate >= 100 });

  // Training
  if (p.trainingComplianceRate >= 90) {
    score += 10;
    strengths.push("Staff training compliance at good level");
  } else if (p.trainingComplianceRate < 75) {
    score -= 10;
    improvements.push("Mandatory training compliance requires immediate attention");
  }
  metrics.push({ label: "Training", value: `${p.trainingComplianceRate}%`, target: "90%", met: p.trainingComplianceRate >= 90 });

  // Supervision
  if (p.supervisionComplianceRate >= 90) {
    score += 10;
    strengths.push("Supervision frequency meeting regulatory expectations");
  } else if (p.supervisionComplianceRate < 70) {
    score -= 15;
    improvements.push("Supervision compliance below Ofsted expectations");
  }
  metrics.push({ label: "Supervision", value: `${p.supervisionComplianceRate}%`, target: "90%", met: p.supervisionComplianceRate >= 90 });

  // Safer recruitment
  if (p.saferRecruitmentCompliant) {
    score += 5;
    strengths.push("Safer recruitment practices consistently applied");
  } else {
    score -= 15;
    improvements.push("Safer recruitment non-compliant — regulatory risk");
  }

  // Notifiable events
  if (p.notifiableEvents > 0 && p.notifiableEventsCompliant < p.notifiableEvents) {
    score -= 10;
    improvements.push("Notifiable events not all submitted within statutory deadline");
  }

  // Allegations
  if (p.allegationsThisPeriod > 0) {
    score -= 5;
    improvements.push(`${p.allegationsThisPeriod} allegation(s) this period — ensure LADO process followed`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "protection_of_children",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessLeadership(input: QualityInputData): DomainAssessment {
  const l = input.leadership;
  const strengths: string[] = [];
  const improvements: string[] = [];
  const metrics: DomainAssessment["keyMetrics"] = [];
  let score = 70;

  // Reg 44
  if (l.reg44VisitsCompliant) {
    score += 10;
    strengths.push("Regulation 44 independent visits completed monthly");
  } else {
    score -= 15;
    improvements.push("Regulation 44 visits not compliant — monthly requirement not met");
  }

  // Reg 44 actions
  if (l.reg44ActionsClosed >= 90) {
    score += 5;
    strengths.push("Reg 44 actions followed up and closed promptly");
  } else if (l.reg44ActionsClosed < 60) {
    score -= 10;
    improvements.push("Reg 44 actions not being addressed in timely manner");
  }
  metrics.push({ label: "Reg 44 actions closed", value: `${l.reg44ActionsClosed}%`, target: "90%", met: l.reg44ActionsClosed >= 90 });

  // Staff qualifications
  if (l.staffQualificationRate >= 80) {
    score += 10;
    strengths.push("Good proportion of staff qualified to Level 3+");
  } else if (l.staffQualificationRate < 60) {
    score -= 10;
    improvements.push("Workforce qualification levels below sector standard");
  }
  metrics.push({ label: "Qualified staff", value: `${l.staffQualificationRate}%`, target: "80%", met: l.staffQualificationRate >= 80 });

  // Policies
  if (l.policyReviewsCurrent && l.statementOfPurposeCurrent) {
    score += 5;
    strengths.push("Policies and Statement of Purpose reviewed and current");
  } else {
    score -= 5;
    improvements.push("Policy reviews overdue or Statement of Purpose requires update");
  }

  // Complaint handling
  if (l.complaintResponseRate >= 90) {
    score += 5;
    strengths.push("Complaints handled promptly within statutory timescales");
  }

  // Staff morale
  if (l.staffMorale >= 75) {
    score += 5;
    strengths.push("Staff report high morale and job satisfaction");
  } else if (l.staffMorale < 50) {
    score -= 10;
    improvements.push("Staff morale is low — wellbeing support review needed");
  }

  // Improvement plan
  if (l.improvementPlanProgress >= 80) {
    score += 5;
    strengths.push("Strong progress against improvement plan objectives");
  }
  metrics.push({ label: "Improvement progress", value: `${l.improvementPlanProgress}%`, target: "80%", met: l.improvementPlanProgress >= 80 });

  score = Math.max(0, Math.min(100, score));

  return {
    domain: "leadership_and_management",
    score,
    grade: scoreToGrade(score),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: score >= 75 ? "strong" : score >= 50 ? "adequate" : "limited",
    keyMetrics: metrics,
  };
}

function assessOverall(input: QualityInputData, domains: DomainAssessment[], overallScore: number): DomainAssessment {
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Pick best domain
  const best = [...domains].sort((a, b) => b.score - a.score)[0];
  if (best && best.score >= 85) {
    strengths.push(`${getDomainLabel(best.domain)} is a particular strength`);
  }

  // Pick weakest domain
  const weakest = [...domains].sort((a, b) => a.score - b.score)[0];
  if (weakest && weakest.score < 65) {
    improvements.push(`${getDomainLabel(weakest.domain)} requires priority attention`);
  }

  // Occupancy
  const occupancyRate = Math.round((input.currentOccupancy / input.registeredCapacity) * 100);
  if (occupancyRate >= 75 && occupancyRate <= 100) {
    strengths.push("Healthy occupancy level supporting sustainability");
  }

  return {
    domain: "overall_experiences",
    score: overallScore,
    grade: scoreToGrade(overallScore),
    strengths,
    areasForImprovement: improvements,
    evidenceItems: [],
    evidenceStrength: overallScore >= 75 ? "strong" : overallScore >= 50 ? "adequate" : "limited",
    keyMetrics: [],
  };
}

// ── Utilities ────────────────────────────────────────────────────────────

function calculateOverallScore(domains: DomainAssessment[]): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const domain of domains) {
    const weight = DOMAIN_WEIGHTS[domain.domain] ?? 0.1;
    weightedSum += domain.score * weight;
    totalWeight += weight;
  }

  return Math.round(totalWeight > 0 ? weightedSum / totalWeight : 0);
}

function scoreToGrade(score: number): OfstedGrade {
  for (const { grade, min } of GRADE_THRESHOLDS) {
    if (score >= min) return grade;
  }
  return "inadequate";
}

export function getDomainLabel(domain: SCCIFDomain): string {
  return DOMAIN_LABELS[domain] ?? domain.replace(/_/g, " ");
}

export function getGradeLabel(grade: OfstedGrade): string {
  const labels: Record<OfstedGrade, string> = {
    outstanding: "Outstanding",
    good: "Good",
    requires_improvement: "Requires Improvement",
    inadequate: "Inadequate",
  };
  return labels[grade] ?? grade;
}

export function getGradeColor(grade: OfstedGrade): string {
  const colors: Record<OfstedGrade, string> = {
    outstanding: "emerald",
    good: "blue",
    requires_improvement: "amber",
    inadequate: "red",
  };
  return colors[grade] ?? "gray";
}
