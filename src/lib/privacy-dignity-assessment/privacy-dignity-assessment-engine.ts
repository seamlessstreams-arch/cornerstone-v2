// ==============================================================================
// Privacy & Dignity Assessment Intelligence Engine
//
// Pure deterministic engine — no AI, no external calls, no randomness.
// Evaluates how well children's privacy and dignity is maintained across:
//   1. Personal Privacy Practices (bedroom, bathroom, belongings)
//   2. Communication Privacy (phone, mail, digital)
//   3. Confidentiality Compliance (records, information sharing)
//   4. Staff Awareness & Training
//
// Regulatory: CHR 2015 Reg 10, CHR 2015 Reg 12, SCCIF, NMS 3,
//             UNCRC Article 16, Human Rights Act 1998 Article 8,
//             Data Protection Act 2018
// ==============================================================================

// -- Type unions ---------------------------------------------------------------

export type PrivacyDomain =
  | "bedroom"
  | "bathroom"
  | "communication"
  | "personal_belongings"
  | "personal_information"
  | "bodily_autonomy"
  | "digital_privacy"
  | "mail_correspondence";

export type ComplianceStatus =
  | "fully_compliant"
  | "mostly_compliant"
  | "partially_compliant"
  | "non_compliant";

export type AuditOutcome =
  | "passed"
  | "minor_findings"
  | "major_findings"
  | "failed";

export type ChildFeedbackRating =
  | "very_positive"
  | "positive"
  | "neutral"
  | "negative"
  | "very_negative";

export type IncidentType =
  | "unauthorised_room_entry"
  | "belongings_searched_without_consent"
  | "communication_intercepted"
  | "information_disclosed"
  | "bodily_autonomy_breach"
  | "digital_privacy_breach"
  | "mail_opened"
  | "other";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// -- Label maps ----------------------------------------------------------------

const privacyDomainLabels: Record<PrivacyDomain, string> = {
  bedroom: "Bedroom Privacy",
  bathroom: "Bathroom Privacy",
  communication: "Communication Privacy",
  personal_belongings: "Personal Belongings",
  personal_information: "Personal Information",
  bodily_autonomy: "Bodily Autonomy",
  digital_privacy: "Digital Privacy",
  mail_correspondence: "Mail & Correspondence",
};

const complianceStatusLabels: Record<ComplianceStatus, string> = {
  fully_compliant: "Fully Compliant",
  mostly_compliant: "Mostly Compliant",
  partially_compliant: "Partially Compliant",
  non_compliant: "Non-Compliant",
};

const auditOutcomeLabels: Record<AuditOutcome, string> = {
  passed: "Passed",
  minor_findings: "Minor Findings",
  major_findings: "Major Findings",
  failed: "Failed",
};

const childFeedbackRatingLabels: Record<ChildFeedbackRating, string> = {
  very_positive: "Very Positive",
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  very_negative: "Very Negative",
};

const incidentTypeLabels: Record<IncidentType, string> = {
  unauthorised_room_entry: "Unauthorised Room Entry",
  belongings_searched_without_consent: "Belongings Searched Without Consent",
  communication_intercepted: "Communication Intercepted",
  information_disclosed: "Information Disclosed",
  bodily_autonomy_breach: "Bodily Autonomy Breach",
  digital_privacy_breach: "Digital Privacy Breach",
  mail_opened: "Mail Opened",
  other: "Other",
};

const ratingLabels: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

// -- Label getters -------------------------------------------------------------

export function getPrivacyDomainLabel(d: PrivacyDomain): string {
  return privacyDomainLabels[d] ?? d;
}
export function getComplianceStatusLabel(s: ComplianceStatus): string {
  return complianceStatusLabels[s] ?? s;
}
export function getAuditOutcomeLabel(o: AuditOutcome): string {
  return auditOutcomeLabels[o] ?? o;
}
export function getChildFeedbackRatingLabel(r: ChildFeedbackRating): string {
  return childFeedbackRatingLabels[r] ?? r;
}
export function getIncidentTypeLabel(t: IncidentType): string {
  return incidentTypeLabels[t] ?? t;
}
export function getRatingLabel(r: Rating): string {
  return ratingLabels[r] ?? r;
}

// -- Input interfaces ----------------------------------------------------------

export interface PrivacyAudit {
  id: string;
  auditDate: string;
  auditedBy: string;
  domain: PrivacyDomain;
  complianceStatus: ComplianceStatus;
  auditOutcome: AuditOutcome;
  knockingPolicyObserved: boolean;
  lockableStorageProvided: boolean;
  personalSpaceRespected: boolean;
  findingsNotes: string;
}

export interface ChildPrivacyFeedback {
  id: string;
  childId: string;
  childName: string;
  feedbackDate: string;
  domain: PrivacyDomain;
  rating: ChildFeedbackRating;
  feelsPrivacyRespected: boolean;
  feelsBedroomIsOwn: boolean;
  canMakePrivateCalls: boolean;
  belongingsSafe: boolean;
  comments: string;
}

export interface PrivacyIncident {
  id: string;
  childId: string;
  childName: string;
  date: string;
  incidentType: IncidentType;
  description: string;
  reportedBy: string;
  investigationCompleted: boolean;
  actionTaken: boolean;
  childInformed: boolean;
  preventiveMeasuresImplemented: boolean;
}

export interface StaffPrivacyTraining {
  id: string;
  staffId: string;
  staffName: string;
  privacyRightsAwareness: boolean;
  knockingPolicyTrained: boolean;
  confidentialityTrained: boolean;
  dataProtectionTrained: boolean;
  bodyAutonomyTrained: boolean;
  digitalPrivacyTrained: boolean;
}

// -- Result interfaces ---------------------------------------------------------

export interface PersonalPrivacyResult {
  overallScore: number;
  totalAudits: number;
  fullyCompliantRate: number;
  knockingObservedRate: number;
  lockableStorageRate: number;
  personalSpaceRate: number;
  passedRate: number;
}

export interface CommunicationPrivacyResult {
  overallScore: number;
  totalFeedback: number;
  feelsPrivacyRespectedRate: number;
  canMakePrivateCallsRate: number;
  belongingsSafeRate: number;
  feelsBedroomIsOwnRate: number;
  positiveRatingRate: number;
}

export interface ConfidentialityComplianceResult {
  overallScore: number;
  totalIncidents: number;
  investigationCompletedRate: number;
  actionTakenRate: number;
  childInformedRate: number;
  preventiveMeasuresRate: number;
}

export interface StaffPrivacyReadinessResult {
  overallScore: number;
  totalStaff: number;
  privacyRightsRate: number;
  knockingPolicyRate: number;
  confidentialityRate: number;
  dataProtectionRate: number;
  bodyAutonomyRate: number;
  digitalPrivacyRate: number;
}

export interface ChildPrivacyProfile {
  childId: string;
  childName: string;
  feedbackCount: number;
  positiveRate: number;
  feelsRespected: boolean;
  incidentCount: number;
  overallScore: number;
}

export interface PrivacyDignityIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  personalPrivacy: PersonalPrivacyResult;
  communicationPrivacy: CommunicationPrivacyResult;
  confidentialityCompliance: ConfidentialityComplianceResult;
  staffPrivacyReadiness: StaffPrivacyReadinessResult;
  childProfiles: ChildPrivacyProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Helpers -------------------------------------------------------------------

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

// -- Evaluators ----------------------------------------------------------------

/**
 * Evaluates personal privacy practices through audit results.
 * Empty = 0 (no audits = no evidence of compliance).
 *
 *   Fully compliant rate         → 0-7
 *   Knocking policy observed     → 0-6
 *   Lockable storage provided    → 0-5
 *   Personal space respected     → 0-4
 *   Audit passed rate            → 0-3
 */
export function evaluatePersonalPrivacy(
  audits: PrivacyAudit[],
): PersonalPrivacyResult {
  if (audits.length === 0) {
    return {
      overallScore: 0,
      totalAudits: 0,
      fullyCompliantRate: 0,
      knockingObservedRate: 0,
      lockableStorageRate: 0,
      personalSpaceRate: 0,
      passedRate: 0,
    };
  }

  let score = 0;

  const fullyCompliant = audits.filter(
    (a) => a.complianceStatus === "fully_compliant",
  ).length;
  const fullyCompliantRate = pct(fullyCompliant, audits.length);
  if (fullyCompliantRate >= 90) score += 7;
  else if (fullyCompliantRate >= 70) score += 5;
  else if (fullyCompliantRate >= 50) score += 3;
  else if (fullyCompliantRate > 0) score += 1;

  const knockingObserved = audits.filter(
    (a) => a.knockingPolicyObserved,
  ).length;
  const knockingObservedRate = pct(knockingObserved, audits.length);
  if (knockingObservedRate >= 90) score += 6;
  else if (knockingObservedRate >= 70) score += 4;
  else if (knockingObservedRate >= 50) score += 3;
  else if (knockingObservedRate > 0) score += 1;

  const lockableStorage = audits.filter(
    (a) => a.lockableStorageProvided,
  ).length;
  const lockableStorageRate = pct(lockableStorage, audits.length);
  if (lockableStorageRate >= 90) score += 5;
  else if (lockableStorageRate >= 70) score += 3;
  else if (lockableStorageRate >= 50) score += 2;
  else if (lockableStorageRate > 0) score += 1;

  const personalSpace = audits.filter(
    (a) => a.personalSpaceRespected,
  ).length;
  const personalSpaceRate = pct(personalSpace, audits.length);
  if (personalSpaceRate >= 90) score += 4;
  else if (personalSpaceRate >= 70) score += 3;
  else if (personalSpaceRate >= 50) score += 2;
  else if (personalSpaceRate > 0) score += 1;

  const passed = audits.filter(
    (a) => a.auditOutcome === "passed",
  ).length;
  const passedRate = pct(passed, audits.length);
  if (passedRate >= 90) score += 3;
  else if (passedRate >= 70) score += 2;
  else if (passedRate >= 50) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalAudits: audits.length,
    fullyCompliantRate,
    knockingObservedRate,
    lockableStorageRate,
    personalSpaceRate,
    passedRate,
  };
}

/**
 * Evaluates communication privacy through child feedback.
 * Empty = 0 (no feedback = no evidence children feel respected).
 *
 *   Feels privacy respected      → 0-7
 *   Can make private calls       → 0-6
 *   Belongings safe              → 0-5
 *   Feels bedroom is own         → 0-4
 *   Positive rating rate         → 0-3
 */
export function evaluateCommunicationPrivacy(
  feedback: ChildPrivacyFeedback[],
): CommunicationPrivacyResult {
  if (feedback.length === 0) {
    return {
      overallScore: 0,
      totalFeedback: 0,
      feelsPrivacyRespectedRate: 0,
      canMakePrivateCallsRate: 0,
      belongingsSafeRate: 0,
      feelsBedroomIsOwnRate: 0,
      positiveRatingRate: 0,
    };
  }

  let score = 0;

  const respected = feedback.filter((f) => f.feelsPrivacyRespected).length;
  const feelsPrivacyRespectedRate = pct(respected, feedback.length);
  if (feelsPrivacyRespectedRate >= 90) score += 7;
  else if (feelsPrivacyRespectedRate >= 70) score += 5;
  else if (feelsPrivacyRespectedRate >= 50) score += 3;
  else if (feelsPrivacyRespectedRate > 0) score += 1;

  const privateCalls = feedback.filter((f) => f.canMakePrivateCalls).length;
  const canMakePrivateCallsRate = pct(privateCalls, feedback.length);
  if (canMakePrivateCallsRate >= 90) score += 6;
  else if (canMakePrivateCallsRate >= 70) score += 4;
  else if (canMakePrivateCallsRate >= 50) score += 3;
  else if (canMakePrivateCallsRate > 0) score += 1;

  const belongings = feedback.filter((f) => f.belongingsSafe).length;
  const belongingsSafeRate = pct(belongings, feedback.length);
  if (belongingsSafeRate >= 90) score += 5;
  else if (belongingsSafeRate >= 70) score += 3;
  else if (belongingsSafeRate >= 50) score += 2;
  else if (belongingsSafeRate > 0) score += 1;

  const bedroom = feedback.filter((f) => f.feelsBedroomIsOwn).length;
  const feelsBedroomIsOwnRate = pct(bedroom, feedback.length);
  if (feelsBedroomIsOwnRate >= 90) score += 4;
  else if (feelsBedroomIsOwnRate >= 70) score += 3;
  else if (feelsBedroomIsOwnRate >= 50) score += 2;
  else if (feelsBedroomIsOwnRate > 0) score += 1;

  const positive = feedback.filter(
    (f) => f.rating === "very_positive" || f.rating === "positive",
  ).length;
  const positiveRatingRate = pct(positive, feedback.length);
  if (positiveRatingRate >= 90) score += 3;
  else if (positiveRatingRate >= 70) score += 2;
  else if (positiveRatingRate >= 50) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalFeedback: feedback.length,
    feelsPrivacyRespectedRate,
    canMakePrivateCallsRate,
    belongingsSafeRate,
    feelsBedroomIsOwnRate,
    positiveRatingRate,
  };
}

/**
 * Evaluates confidentiality compliance through incident management.
 * Empty (no incidents) = 25 (no privacy breaches = excellent).
 *
 *   Investigation completed      → 0-8
 *   Action taken                 → 0-7
 *   Child informed               → 0-5
 *   Preventive measures          → 0-5
 */
export function evaluateConfidentialityCompliance(
  incidents: PrivacyIncident[],
): ConfidentialityComplianceResult {
  if (incidents.length === 0) {
    return {
      overallScore: 25,
      totalIncidents: 0,
      investigationCompletedRate: 0,
      actionTakenRate: 0,
      childInformedRate: 0,
      preventiveMeasuresRate: 0,
    };
  }

  let score = 0;

  const investigated = incidents.filter(
    (i) => i.investigationCompleted,
  ).length;
  const investigationCompletedRate = pct(investigated, incidents.length);
  if (investigationCompletedRate >= 90) score += 8;
  else if (investigationCompletedRate >= 70) score += 6;
  else if (investigationCompletedRate >= 50) score += 4;
  else if (investigationCompletedRate > 0) score += 2;

  const actioned = incidents.filter((i) => i.actionTaken).length;
  const actionTakenRate = pct(actioned, incidents.length);
  if (actionTakenRate >= 90) score += 7;
  else if (actionTakenRate >= 70) score += 5;
  else if (actionTakenRate >= 50) score += 3;
  else if (actionTakenRate > 0) score += 1;

  const informed = incidents.filter((i) => i.childInformed).length;
  const childInformedRate = pct(informed, incidents.length);
  if (childInformedRate >= 90) score += 5;
  else if (childInformedRate >= 70) score += 3;
  else if (childInformedRate >= 50) score += 2;
  else if (childInformedRate > 0) score += 1;

  const preventive = incidents.filter(
    (i) => i.preventiveMeasuresImplemented,
  ).length;
  const preventiveMeasuresRate = pct(preventive, incidents.length);
  if (preventiveMeasuresRate >= 90) score += 5;
  else if (preventiveMeasuresRate >= 70) score += 3;
  else if (preventiveMeasuresRate >= 50) score += 2;
  else if (preventiveMeasuresRate > 0) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalIncidents: incidents.length,
    investigationCompletedRate,
    actionTakenRate,
    childInformedRate,
    preventiveMeasuresRate,
  };
}

/**
 * Evaluates staff readiness in privacy and dignity practices.
 * Empty = 0 (no staff training = no evidence of competence).
 *
 *   Privacy rights awareness     → 0-6
 *   Knocking policy trained      → 0-5
 *   Confidentiality trained      → 0-5
 *   Data protection trained      → 0-4
 *   Body autonomy trained        → 0-3
 *   Digital privacy trained      → 0-2
 */
export function evaluateStaffPrivacyReadiness(
  training: StaffPrivacyTraining[],
): StaffPrivacyReadinessResult {
  if (training.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      privacyRightsRate: 0,
      knockingPolicyRate: 0,
      confidentialityRate: 0,
      dataProtectionRate: 0,
      bodyAutonomyRate: 0,
      digitalPrivacyRate: 0,
    };
  }

  let score = 0;

  const privacyRights = training.filter(
    (t) => t.privacyRightsAwareness,
  ).length;
  const privacyRightsRate = pct(privacyRights, training.length);
  if (privacyRightsRate >= 90) score += 6;
  else if (privacyRightsRate >= 70) score += 4;
  else if (privacyRightsRate >= 50) score += 3;
  else if (privacyRightsRate > 0) score += 1;

  const knockingPolicy = training.filter(
    (t) => t.knockingPolicyTrained,
  ).length;
  const knockingPolicyRate = pct(knockingPolicy, training.length);
  if (knockingPolicyRate >= 90) score += 5;
  else if (knockingPolicyRate >= 70) score += 3;
  else if (knockingPolicyRate >= 50) score += 2;
  else if (knockingPolicyRate > 0) score += 1;

  const confidentiality = training.filter(
    (t) => t.confidentialityTrained,
  ).length;
  const confidentialityRate = pct(confidentiality, training.length);
  if (confidentialityRate >= 90) score += 5;
  else if (confidentialityRate >= 70) score += 3;
  else if (confidentialityRate >= 50) score += 2;
  else if (confidentialityRate > 0) score += 1;

  const dataProtection = training.filter(
    (t) => t.dataProtectionTrained,
  ).length;
  const dataProtectionRate = pct(dataProtection, training.length);
  if (dataProtectionRate >= 90) score += 4;
  else if (dataProtectionRate >= 70) score += 3;
  else if (dataProtectionRate >= 50) score += 2;
  else if (dataProtectionRate > 0) score += 1;

  const bodyAutonomy = training.filter(
    (t) => t.bodyAutonomyTrained,
  ).length;
  const bodyAutonomyRate = pct(bodyAutonomy, training.length);
  if (bodyAutonomyRate >= 90) score += 3;
  else if (bodyAutonomyRate >= 70) score += 2;
  else if (bodyAutonomyRate >= 50) score += 1;

  const digitalPrivacy = training.filter(
    (t) => t.digitalPrivacyTrained,
  ).length;
  const digitalPrivacyRate = pct(digitalPrivacy, training.length);
  if (digitalPrivacyRate >= 90) score += 2;
  else if (digitalPrivacyRate >= 70) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalStaff: training.length,
    privacyRightsRate,
    knockingPolicyRate,
    confidentialityRate,
    dataProtectionRate,
    bodyAutonomyRate,
    digitalPrivacyRate,
  };
}

// -- Child Profiles ------------------------------------------------------------

export function buildChildPrivacyProfiles(
  feedback: ChildPrivacyFeedback[],
  incidents: PrivacyIncident[],
): ChildPrivacyProfile[] {
  const childIds = new Set<string>();
  const childNames = new Map<string, string>();

  for (const f of feedback) {
    childIds.add(f.childId);
    childNames.set(f.childId, f.childName);
  }
  for (const i of incidents) {
    childIds.add(i.childId);
    childNames.set(i.childId, i.childName);
  }

  return Array.from(childIds).map((childId) => {
    const childFeedback = feedback.filter((f) => f.childId === childId);
    const childIncidents = incidents.filter((i) => i.childId === childId);
    const childName = childNames.get(childId) ?? childId;

    const feedbackCount = childFeedback.length;
    const positive = childFeedback.filter(
      (f) => f.rating === "very_positive" || f.rating === "positive",
    ).length;
    const positiveRate = pct(positive, feedbackCount);
    const feelsRespected =
      feedbackCount > 0 &&
      childFeedback.every((f) => f.feelsPrivacyRespected);
    const incidentCount = childIncidents.length;

    // Score 0-10
    let score = 0;

    // Positive feedback (0-4)
    if (feedbackCount === 0) {
      score += 0;
    } else if (positiveRate >= 90) {
      score += 4;
    } else if (positiveRate >= 70) {
      score += 3;
    } else if (positiveRate >= 50) {
      score += 2;
    } else {
      score += 1;
    }

    // Feels respected (0-3)
    if (feelsRespected) score += 3;
    else if (feedbackCount > 0) score += 1;

    // Incident penalty (0-3 bonus if none)
    if (incidentCount === 0) {
      score += 3;
    } else if (incidentCount === 1) {
      score += 1;
    }

    return {
      childId,
      childName,
      feedbackCount,
      positiveRate,
      feelsRespected,
      incidentCount,
      overallScore: Math.min(Math.max(score, 0), 10),
    };
  });
}

// -- Main generator ------------------------------------------------------------

export function generatePrivacyDignityIntelligence(
  audits: PrivacyAudit[],
  feedback: ChildPrivacyFeedback[],
  incidents: PrivacyIncident[],
  training: StaffPrivacyTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): PrivacyDignityIntelligence {
  const personalPrivacy = evaluatePersonalPrivacy(audits);
  const communicationPrivacy = evaluateCommunicationPrivacy(feedback);
  const confidentialityCompliance =
    evaluateConfidentialityCompliance(incidents);
  const staffPrivacyReadiness = evaluateStaffPrivacyReadiness(training);

  const rawScore =
    personalPrivacy.overallScore +
    communicationPrivacy.overallScore +
    confidentialityCompliance.overallScore +
    staffPrivacyReadiness.overallScore;
  const overallScore = Math.min(rawScore, 100);
  const rating = getRating(overallScore);

  const childProfiles = buildChildPrivacyProfiles(feedback, incidents);

  // -- Strengths ---------------------------------------------------------------
  const strengths: string[] = [];

  if (personalPrivacy.fullyCompliantRate >= 80) {
    strengths.push(
      "Strong privacy audit compliance — over 80% of audits fully compliant",
    );
  }
  if (personalPrivacy.knockingObservedRate >= 90) {
    strengths.push(
      "Excellent knocking policy adherence observed across the home",
    );
  }
  if (communicationPrivacy.feelsPrivacyRespectedRate >= 80) {
    strengths.push(
      "Children consistently report feeling their privacy is respected",
    );
  }
  if (communicationPrivacy.canMakePrivateCallsRate >= 80) {
    strengths.push(
      "Children have good access to private communication facilities",
    );
  }
  if (confidentialityCompliance.totalIncidents === 0) {
    strengths.push(
      "No privacy incidents recorded during the assessment period",
    );
  }
  if (
    staffPrivacyReadiness.privacyRightsRate >= 90 &&
    staffPrivacyReadiness.confidentialityRate >= 90
  ) {
    strengths.push(
      "Staff demonstrate strong privacy rights awareness and confidentiality training",
    );
  }
  if (communicationPrivacy.positiveRatingRate >= 80) {
    strengths.push(
      "High proportion of positive privacy feedback from children",
    );
  }

  // -- Areas for improvement ---------------------------------------------------
  const areasForImprovement: string[] = [];

  if (personalPrivacy.fullyCompliantRate < 60 && audits.length > 0) {
    areasForImprovement.push(
      "Privacy audit compliance below 60% — review privacy practices across all domains",
    );
  }
  if (personalPrivacy.lockableStorageRate < 70 && audits.length > 0) {
    areasForImprovement.push(
      "Lockable storage provision needs improvement — ensure all children have secure personal storage",
    );
  }
  if (
    communicationPrivacy.canMakePrivateCallsRate < 70 &&
    feedback.length > 0
  ) {
    areasForImprovement.push(
      "Children report limited access to private phone calls — review communication arrangements",
    );
  }
  if (
    communicationPrivacy.feelsBedroomIsOwnRate < 70 &&
    feedback.length > 0
  ) {
    areasForImprovement.push(
      "Some children do not feel their bedroom is truly their own space",
    );
  }
  if (
    confidentialityCompliance.totalIncidents > 0 &&
    confidentialityCompliance.preventiveMeasuresRate < 70
  ) {
    areasForImprovement.push(
      "Preventive measures not consistently implemented after privacy incidents",
    );
  }
  if (staffPrivacyReadiness.digitalPrivacyRate < 60 && training.length > 0) {
    areasForImprovement.push(
      "Digital privacy training coverage is insufficient across staff team",
    );
  }

  // -- Actions -----------------------------------------------------------------
  const actions: string[] = [];

  if (audits.length === 0) {
    actions.push(
      "URGENT: No privacy audits conducted — implement regular privacy and dignity audits immediately",
    );
  }
  if (feedback.length === 0) {
    actions.push(
      "URGENT: No children's privacy feedback collected — establish routine privacy feedback mechanism",
    );
  }
  if (training.length === 0) {
    actions.push(
      "URGENT: No staff privacy training records — deliver privacy and dignity training to all staff",
    );
  }
  if (
    confidentialityCompliance.totalIncidents > 0 &&
    confidentialityCompliance.investigationCompletedRate < 50
  ) {
    actions.push(
      "URGENT: Over half of privacy incidents lack completed investigations",
    );
  }
  if (personalPrivacy.knockingObservedRate < 50 && audits.length > 0) {
    actions.push(
      "Reinforce knocking policy through team meeting and supervision",
    );
  }
  if (staffPrivacyReadiness.bodyAutonomyRate < 70 && training.length > 0) {
    actions.push(
      "Schedule body autonomy training for staff not yet completed",
    );
  }
  if (
    communicationPrivacy.belongingsSafeRate < 70 &&
    feedback.length > 0
  ) {
    actions.push(
      "Review personal belongings security arrangements for all children",
    );
  }

  // -- Regulatory links --------------------------------------------------------
  const regulatoryLinks: string[] = [
    "CHR 2015 Reg 10 — The health and well-being standard (privacy and dignity)",
    "CHR 2015 Reg 12 — The protection of children standard",
    "SCCIF — Social Care Common Inspection Framework (respect and dignity)",
    "NMS 3 — National Minimum Standards (privacy and confidentiality)",
    "UNCRC Article 16 — Right to privacy",
    "Human Rights Act 1998 Article 8 — Right to respect for private and family life",
    "Data Protection Act 2018 — Processing of personal data",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    personalPrivacy,
    communicationPrivacy,
    confidentialityCompliance,
    staffPrivacyReadiness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
