// ==============================================================================
// HEALTH SCREENING COMPLIANCE INTELLIGENCE ENGINE
//
// Pure deterministic engine for analysing health screening compliance,
// dental/optical/immunisation tracking, GP registration, annual health
// assessments, and development checks for looked-after children.
//
// Regulatory basis:
//   - CHR 2015, Reg 10 — Health and wellbeing of children
//   - Promoting the Health and Wellbeing of Looked After Children (2015)
//   - SCCIF — Health and wellbeing of children
//   - NMS 4 — Health care standard
//   - NICE PH28 — LAC health needs
//   - UNCRC Article 24 — Right to health
//   - CA 1989 s22(3)(a) — Duty to safeguard and promote welfare
//
// No AI. No external calls. Pure input → output.
// ==============================================================================

// ── Types ──────────────────────────────────────────────────────────────────

export type ScreeningType =
  | "dental_check"
  | "optical_check"
  | "hearing_test"
  | "immunisation"
  | "developmental_check"
  | "annual_health_assessment"
  | "initial_health_assessment"
  | "review_health_assessment"
  | "mental_health_screening"
  | "sexual_health";

export type ScreeningStatus =
  | "completed_on_time"
  | "completed_late"
  | "overdue"
  | "scheduled"
  | "declined"
  | "not_applicable";

export type ScreeningOutcome =
  | "no_concerns"
  | "minor_concerns"
  | "referral_made"
  | "treatment_required"
  | "follow_up_needed"
  | "awaiting_results";

export type GPRegistrationStatus =
  | "registered"
  | "pending_registration"
  | "not_registered"
  | "transferring";

export type ConsentStatus =
  | "consent_given"
  | "consent_refused"
  | "gillick_competent"
  | "awaiting_consent"
  | "delegated_authority";

export type Rating =
  | "outstanding"
  | "good"
  | "requires_improvement"
  | "inadequate";

// ── Input Interfaces ───────────────────────────────────────────────────────

export interface HealthScreeningRecord {
  id: string;
  childId: string;
  childName: string;
  screeningType: ScreeningType;
  status: ScreeningStatus;
  scheduledDate: string;
  completedDate: string | null;
  outcome: ScreeningOutcome | null;
  provider: string | null;
  consentStatus: ConsentStatus;
  referralMade: boolean;
  referralFollowedUp: boolean | null;
  documentedInCareFile: boolean;
}

export interface GPRegistration {
  id: string;
  childId: string;
  childName: string;
  gpRegistrationStatus: GPRegistrationStatus;
  gpPractice: string | null;
  registeredDate: string | null;
  lastAppointment: string | null;
  namedNurse: boolean;
  healthPassportUpToDate: boolean;
}

export interface HealthActionPlan {
  id: string;
  childId: string;
  childName: string;
  planDate: string;
  reviewDate: string | null;
  healthNeedsIdentified: number;
  healthNeedsAddressed: number;
  childContributed: boolean;
  socialWorkerInformed: boolean;
  carerInformed: boolean;
  SDQCompleted: boolean;
  SDQScore: number | null;
}

export interface HealthTraining {
  id: string;
  staffId: string;
  staffName: string;
  firstAidCurrent: boolean;
  medicationTrained: boolean;
  mentalHealthFirstAid: boolean;
  epilepsyTrained: boolean;
  allergyAwareness: boolean;
  healthPromotionTrained: boolean;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface ScreeningComplianceResult {
  overallScore: number;
  totalScreenings: number;
  onTimeRate: number;
  overdueCount: number;
  declinedCount: number;
  referralFollowUpRate: number;
  documentedRate: number;
  typeDistribution: Record<ScreeningType, number>;
  outcomeDistribution: Record<ScreeningOutcome, number>;
}

export interface GPAccessResult {
  overallScore: number;
  totalChildren: number;
  registeredRate: number;
  namedNurseRate: number;
  healthPassportRate: number;
  pendingRegistrations: number;
  notRegisteredCount: number;
}

export interface HealthPlanningResult {
  overallScore: number;
  totalPlans: number;
  needsAddressedRate: number;
  childContributionRate: number;
  socialWorkerInformedRate: number;
  sdqCompletionRate: number;
  reviewRate: number;
  averageSDQScore: number | null;
}

export interface StaffHealthReadinessResult {
  overallScore: number;
  totalStaff: number;
  firstAidRate: number;
  medicationTrainedRate: number;
  mentalHealthRate: number;
  epilepsyRate: number;
  allergyRate: number;
  healthPromotionRate: number;
}

export interface ChildHealthProfile {
  childId: string;
  childName: string;
  gpRegistered: boolean;
  screeningsCompleted: number;
  screeningsOverdue: number;
  healthNeedsAddressedRate: number;
  hasHealthPassport: boolean;
  latestSDQScore: number | null;
  overallScore: number;
}

export interface HealthScreeningComplianceIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  screeningCompliance: ScreeningComplianceResult;
  gpAccess: GPAccessResult;
  healthPlanning: HealthPlanningResult;
  staffHealthReadiness: StaffHealthReadinessResult;
  childProfiles: ChildHealthProfile[];
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

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// ── Label Functions ────────────────────────────────────────────────────────

const SCREENING_TYPE_LABELS: Record<ScreeningType, string> = {
  dental_check: "Dental Check",
  optical_check: "Optical Check",
  hearing_test: "Hearing Test",
  immunisation: "Immunisation",
  developmental_check: "Developmental Check",
  annual_health_assessment: "Annual Health Assessment",
  initial_health_assessment: "Initial Health Assessment",
  review_health_assessment: "Review Health Assessment",
  mental_health_screening: "Mental Health Screening",
  sexual_health: "Sexual Health",
};

const SCREENING_STATUS_LABELS: Record<ScreeningStatus, string> = {
  completed_on_time: "Completed On Time",
  completed_late: "Completed Late",
  overdue: "Overdue",
  scheduled: "Scheduled",
  declined: "Declined",
  not_applicable: "Not Applicable",
};

const SCREENING_OUTCOME_LABELS: Record<ScreeningOutcome, string> = {
  no_concerns: "No Concerns",
  minor_concerns: "Minor Concerns",
  referral_made: "Referral Made",
  treatment_required: "Treatment Required",
  follow_up_needed: "Follow-Up Needed",
  awaiting_results: "Awaiting Results",
};

const GP_REGISTRATION_LABELS: Record<GPRegistrationStatus, string> = {
  registered: "Registered",
  pending_registration: "Pending Registration",
  not_registered: "Not Registered",
  transferring: "Transferring",
};

const CONSENT_STATUS_LABELS: Record<ConsentStatus, string> = {
  consent_given: "Consent Given",
  consent_refused: "Consent Refused",
  gillick_competent: "Gillick Competent",
  awaiting_consent: "Awaiting Consent",
  delegated_authority: "Delegated Authority",
};

const RATING_LABELS: Record<Rating, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

export function getScreeningTypeLabel(v: ScreeningType): string {
  return SCREENING_TYPE_LABELS[v];
}

export function getScreeningStatusLabel(v: ScreeningStatus): string {
  return SCREENING_STATUS_LABELS[v];
}

export function getScreeningOutcomeLabel(v: ScreeningOutcome): string {
  return SCREENING_OUTCOME_LABELS[v];
}

export function getGPRegistrationStatusLabel(v: GPRegistrationStatus): string {
  return GP_REGISTRATION_LABELS[v];
}

export function getConsentStatusLabel(v: ConsentStatus): string {
  return CONSENT_STATUS_LABELS[v];
}

export function getRatingLabel(v: Rating): string {
  return RATING_LABELS[v];
}

// ── Evaluators ─────────────────────────────────────────────────────────────

export function evaluateScreeningCompliance(
  screenings: HealthScreeningRecord[],
): ScreeningComplianceResult {
  const typeDistribution = {} as Record<ScreeningType, number>;
  for (const t of [
    "dental_check", "optical_check", "hearing_test", "immunisation",
    "developmental_check", "annual_health_assessment", "initial_health_assessment",
    "review_health_assessment", "mental_health_screening", "sexual_health",
  ] as ScreeningType[]) {
    typeDistribution[t] = 0;
  }

  const outcomeDistribution = {} as Record<ScreeningOutcome, number>;
  for (const o of [
    "no_concerns", "minor_concerns", "referral_made", "treatment_required",
    "follow_up_needed", "awaiting_results",
  ] as ScreeningOutcome[]) {
    outcomeDistribution[o] = 0;
  }

  if (screenings.length === 0) {
    return {
      overallScore: 0,
      totalScreenings: 0,
      onTimeRate: 0,
      overdueCount: 0,
      declinedCount: 0,
      referralFollowUpRate: 0,
      documentedRate: 0,
      typeDistribution,
      outcomeDistribution,
    };
  }

  let onTime = 0;
  let overdue = 0;
  let declined = 0;
  let referralsMade = 0;
  let referralsFollowed = 0;
  let documented = 0;

  for (const s of screenings) {
    typeDistribution[s.screeningType] = (typeDistribution[s.screeningType] || 0) + 1;
    if (s.outcome) {
      outcomeDistribution[s.outcome] = (outcomeDistribution[s.outcome] || 0) + 1;
    }

    if (s.status === "completed_on_time") onTime++;
    if (s.status === "overdue") overdue++;
    if (s.status === "declined") declined++;

    if (s.referralMade) {
      referralsMade++;
      if (s.referralFollowedUp) referralsFollowed++;
    }

    if (s.documentedInCareFile) documented++;
  }

  const onTimeRate = pct(onTime, screenings.length);
  const referralFollowUpRate = pct(referralsFollowed, referralsMade);
  const documentedRate = pct(documented, screenings.length);

  // Scoring: on-time rate (0-8), documented (0-6), referral follow-up (0-5),
  // low overdue penalty (0-3), low declined penalty (0-3)
  let score = 0;
  score += Math.round((onTimeRate / 100) * 8);
  score += Math.round((documentedRate / 100) * 6);
  score += Math.round((referralFollowUpRate / 100) * 5);
  // Bonus for few overdues: 3 if 0, 2 if 1, 1 if 2, 0 if 3+
  score += Math.max(0, 3 - overdue);
  // Bonus for few declines: 3 if 0, 2 if 1, 1 if 2, 0 if 3+
  score += Math.max(0, 3 - declined);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalScreenings: screenings.length,
    onTimeRate,
    overdueCount: overdue,
    declinedCount: declined,
    referralFollowUpRate,
    documentedRate,
    typeDistribution,
    outcomeDistribution,
  };
}

export function evaluateGPAccess(
  registrations: GPRegistration[],
): GPAccessResult {
  if (registrations.length === 0) {
    return {
      overallScore: 0,
      totalChildren: 0,
      registeredRate: 0,
      namedNurseRate: 0,
      healthPassportRate: 0,
      pendingRegistrations: 0,
      notRegisteredCount: 0,
    };
  }

  let registered = 0;
  let namedNurse = 0;
  let healthPassport = 0;
  let pending = 0;
  let notRegistered = 0;

  for (const r of registrations) {
    if (r.gpRegistrationStatus === "registered") registered++;
    if (r.gpRegistrationStatus === "pending_registration") pending++;
    if (r.gpRegistrationStatus === "not_registered") notRegistered++;
    if (r.namedNurse) namedNurse++;
    if (r.healthPassportUpToDate) healthPassport++;
  }

  const registeredRate = pct(registered, registrations.length);
  const namedNurseRate = pct(namedNurse, registrations.length);
  const healthPassportRate = pct(healthPassport, registrations.length);

  // Scoring: registered rate (0-8), health passport (0-6), named nurse (0-5),
  // penalty per not_registered: -3 each (capped)
  let score = 0;
  score += Math.round((registeredRate / 100) * 8);
  score += Math.round((healthPassportRate / 100) * 6);
  score += Math.round((namedNurseRate / 100) * 5);
  // Bonus for no pending/not registered: up to 6
  score += Math.max(0, 3 - pending);
  score += Math.max(0, 3 - notRegistered);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalChildren: registrations.length,
    registeredRate,
    namedNurseRate,
    healthPassportRate,
    pendingRegistrations: pending,
    notRegisteredCount: notRegistered,
  };
}

export function evaluateHealthPlanning(
  plans: HealthActionPlan[],
): HealthPlanningResult {
  if (plans.length === 0) {
    return {
      overallScore: 0,
      totalPlans: 0,
      needsAddressedRate: 0,
      childContributionRate: 0,
      socialWorkerInformedRate: 0,
      sdqCompletionRate: 0,
      reviewRate: 0,
      averageSDQScore: null,
    };
  }

  let totalNeeds = 0;
  let totalAddressed = 0;
  let childContributed = 0;
  let swInformed = 0;
  let sdqCompleted = 0;
  let reviewed = 0;
  let sdqTotal = 0;
  let sdqCount = 0;

  for (const p of plans) {
    totalNeeds += p.healthNeedsIdentified;
    totalAddressed += p.healthNeedsAddressed;
    if (p.childContributed) childContributed++;
    if (p.socialWorkerInformed) swInformed++;
    if (p.SDQCompleted) sdqCompleted++;
    if (p.reviewDate) reviewed++;
    if (p.SDQScore !== null) {
      sdqTotal += p.SDQScore;
      sdqCount++;
    }
  }

  const needsAddressedRate = pct(totalAddressed, totalNeeds);
  const childContributionRate = pct(childContributed, plans.length);
  const socialWorkerInformedRate = pct(swInformed, plans.length);
  const sdqCompletionRate = pct(sdqCompleted, plans.length);
  const reviewRate = pct(reviewed, plans.length);
  const averageSDQScore = sdqCount > 0 ? Math.round((sdqTotal / sdqCount) * 10) / 10 : null;

  // Scoring: needs addressed (0-7), child contribution (0-5), SDQ completion (0-5),
  // social worker informed (0-4), review rate (0-4)
  let score = 0;
  score += Math.round((needsAddressedRate / 100) * 7);
  score += Math.round((childContributionRate / 100) * 5);
  score += Math.round((sdqCompletionRate / 100) * 5);
  score += Math.round((socialWorkerInformedRate / 100) * 4);
  score += Math.round((reviewRate / 100) * 4);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalPlans: plans.length,
    needsAddressedRate,
    childContributionRate,
    socialWorkerInformedRate,
    sdqCompletionRate,
    reviewRate,
    averageSDQScore,
  };
}

export function evaluateStaffHealthReadiness(
  training: HealthTraining[],
): StaffHealthReadinessResult {
  if (training.length === 0) {
    return {
      overallScore: 0,
      totalStaff: 0,
      firstAidRate: 0,
      medicationTrainedRate: 0,
      mentalHealthRate: 0,
      epilepsyRate: 0,
      allergyRate: 0,
      healthPromotionRate: 0,
    };
  }

  let firstAid = 0;
  let medication = 0;
  let mentalHealth = 0;
  let epilepsy = 0;
  let allergy = 0;
  let healthPromo = 0;

  for (const t of training) {
    if (t.firstAidCurrent) firstAid++;
    if (t.medicationTrained) medication++;
    if (t.mentalHealthFirstAid) mentalHealth++;
    if (t.epilepsyTrained) epilepsy++;
    if (t.allergyAwareness) allergy++;
    if (t.healthPromotionTrained) healthPromo++;
  }

  const firstAidRate = pct(firstAid, training.length);
  const medicationTrainedRate = pct(medication, training.length);
  const mentalHealthRate = pct(mentalHealth, training.length);
  const epilepsyRate = pct(epilepsy, training.length);
  const allergyRate = pct(allergy, training.length);
  const healthPromotionRate = pct(healthPromo, training.length);

  // Scoring: first aid (0-7), medication (0-6), mental health first aid (0-5),
  // epilepsy (0-3), allergy (0-2), health promotion (0-2)
  let score = 0;
  score += Math.round((firstAidRate / 100) * 7);
  score += Math.round((medicationTrainedRate / 100) * 6);
  score += Math.round((mentalHealthRate / 100) * 5);
  score += Math.round((epilepsyRate / 100) * 3);
  score += Math.round((allergyRate / 100) * 2);
  score += Math.round((healthPromotionRate / 100) * 2);

  return {
    overallScore: Math.min(25, Math.max(0, score)),
    totalStaff: training.length,
    firstAidRate,
    medicationTrainedRate,
    mentalHealthRate,
    epilepsyRate,
    allergyRate,
    healthPromotionRate,
  };
}

// ── Child Profiles ─────────────────────────────────────────────────────────

export function buildChildHealthProfiles(
  screenings: HealthScreeningRecord[],
  registrations: GPRegistration[],
  plans: HealthActionPlan[],
): ChildHealthProfile[] {
  const childIds = new Set<string>();
  const childNames = new Map<string, string>();

  for (const s of screenings) {
    childIds.add(s.childId);
    childNames.set(s.childId, s.childName);
  }
  for (const r of registrations) {
    childIds.add(r.childId);
    childNames.set(r.childId, r.childName);
  }
  for (const p of plans) {
    childIds.add(p.childId);
    childNames.set(p.childId, p.childName);
  }

  return Array.from(childIds).map((childId) => {
    const childScreenings = screenings.filter((s) => s.childId === childId);
    const reg = registrations.find((r) => r.childId === childId);
    const childPlans = plans.filter((p) => p.childId === childId);

    const completed = childScreenings.filter(
      (s) => s.status === "completed_on_time" || s.status === "completed_late",
    ).length;
    const overdueCount = childScreenings.filter((s) => s.status === "overdue").length;
    const gpRegistered = reg ? reg.gpRegistrationStatus === "registered" : false;
    const hasHealthPassport = reg ? reg.healthPassportUpToDate : false;

    // Health needs addressed rate
    let totalNeeds = 0;
    let totalAddressed = 0;
    for (const p of childPlans) {
      totalNeeds += p.healthNeedsIdentified;
      totalAddressed += p.healthNeedsAddressed;
    }
    const needsAddressedRate = pct(totalAddressed, totalNeeds);

    // Latest SDQ
    const sdqPlans = childPlans.filter((p) => p.SDQScore !== null);
    const latestSDQ = sdqPlans.length > 0
      ? sdqPlans.sort((a, b) => b.planDate.localeCompare(a.planDate))[0].SDQScore
      : null;

    // Score: 0-10
    let score = 0;
    if (gpRegistered) score += 2;
    if (hasHealthPassport) score += 1;
    if (overdueCount === 0) score += 2;
    score += Math.min(2, Math.round((completed / Math.max(childScreenings.length, 1)) * 2));
    score += Math.min(2, Math.round((needsAddressedRate / 100) * 2));
    if (latestSDQ !== null && latestSDQ <= 13) score += 1; // Normal SDQ range

    return {
      childId,
      childName: childNames.get(childId) || "Unknown",
      gpRegistered,
      screeningsCompleted: completed,
      screeningsOverdue: overdueCount,
      healthNeedsAddressedRate: needsAddressedRate,
      hasHealthPassport,
      latestSDQScore: latestSDQ,
      overallScore: Math.min(10, score),
    };
  });
}

// ── Main Function ──────────────────────────────────────────────────────────

export function generateHealthScreeningComplianceIntelligence(
  screenings: HealthScreeningRecord[],
  registrations: GPRegistration[],
  plans: HealthActionPlan[],
  training: HealthTraining[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): HealthScreeningComplianceIntelligence {
  const screeningCompliance = evaluateScreeningCompliance(screenings);
  const gpAccess = evaluateGPAccess(registrations);
  const healthPlanning = evaluateHealthPlanning(plans);
  const staffHealthReadiness = evaluateStaffHealthReadiness(training);

  const rawScore =
    screeningCompliance.overallScore +
    gpAccess.overallScore +
    healthPlanning.overallScore +
    staffHealthReadiness.overallScore;

  const overallScore = Math.min(100, Math.max(0, rawScore));
  const rating = getRating(overallScore);

  const childProfiles = buildChildHealthProfiles(screenings, registrations, plans);

  // ── Strengths ──
  const strengths: string[] = [];
  if (screeningCompliance.onTimeRate >= 90)
    strengths.push("Excellent screening compliance with " + screeningCompliance.onTimeRate + "% completed on time");
  if (gpAccess.registeredRate === 100)
    strengths.push("All children registered with a GP");
  if (gpAccess.healthPassportRate >= 90)
    strengths.push("Health passports well maintained across the home");
  if (healthPlanning.childContributionRate >= 80)
    strengths.push("Strong child voice in health planning with " + healthPlanning.childContributionRate + "% contribution rate");
  if (healthPlanning.sdqCompletionRate >= 90)
    strengths.push("Consistent SDQ completion supporting emotional wellbeing monitoring");
  if (staffHealthReadiness.firstAidRate === 100)
    strengths.push("All staff hold current first aid certification");
  if (staffHealthReadiness.mentalHealthRate >= 75)
    strengths.push("Good proportion of staff trained in mental health first aid");
  if (screeningCompliance.referralFollowUpRate === 100 && screenings.some((s) => s.referralMade))
    strengths.push("All health referrals followed up appropriately");
  if (screeningCompliance.documentedRate >= 95)
    strengths.push("Health screenings consistently documented in care files");

  // ── Areas for Improvement ──
  const areasForImprovement: string[] = [];
  if (screeningCompliance.overdueCount > 0)
    areasForImprovement.push(screeningCompliance.overdueCount + " health screening(s) currently overdue requiring immediate attention");
  if (gpAccess.notRegisteredCount > 0)
    areasForImprovement.push(gpAccess.notRegisteredCount + " child(ren) not registered with a GP");
  if (gpAccess.namedNurseRate < 100)
    areasForImprovement.push("Not all children have a named nurse — currently " + gpAccess.namedNurseRate + "%");
  if (healthPlanning.needsAddressedRate < 80)
    areasForImprovement.push("Health needs addressed rate at " + healthPlanning.needsAddressedRate + "% — target 80%+");
  if (healthPlanning.sdqCompletionRate < 80)
    areasForImprovement.push("SDQ completion rate at " + healthPlanning.sdqCompletionRate + "% — consider embedding into review cycle");
  if (staffHealthReadiness.firstAidRate < 100)
    areasForImprovement.push("First aid certification not current for all staff — " + staffHealthReadiness.firstAidRate + "%");
  if (staffHealthReadiness.medicationTrainedRate < 80)
    areasForImprovement.push("Medication training coverage at " + staffHealthReadiness.medicationTrainedRate + "% — aim for 80%+");
  if (screeningCompliance.declinedCount > 0)
    areasForImprovement.push(screeningCompliance.declinedCount + " screening(s) declined — review consent and engagement approach");

  // ── Actions ──
  const actions: string[] = [];
  if (gpAccess.notRegisteredCount > 0)
    actions.push("URGENT: Register " + gpAccess.notRegisteredCount + " child(ren) with a GP immediately — statutory requirement under Reg 10");
  if (screeningCompliance.overdueCount >= 3)
    actions.push("URGENT: Address " + screeningCompliance.overdueCount + " overdue screenings — schedule within 5 working days");
  if (screeningCompliance.overdueCount > 0 && screeningCompliance.overdueCount < 3)
    actions.push("Schedule outstanding overdue screening(s) within 10 working days");
  if (staffHealthReadiness.firstAidRate < 75)
    actions.push("URGENT: Arrange first aid training — " + (100 - staffHealthReadiness.firstAidRate) + "% of staff uncertified");
  if (healthPlanning.reviewRate < 80)
    actions.push("Review health action plans due for review — current rate " + healthPlanning.reviewRate + "%");
  if (gpAccess.healthPassportRate < 80)
    actions.push("Update health passports for all children — current rate " + gpAccess.healthPassportRate + "%");
  if (healthPlanning.childContributionRate < 60)
    actions.push("Strengthen child participation in health planning — explore age-appropriate methods");
  if (staffHealthReadiness.mentalHealthRate < 50)
    actions.push("Book mental health first aid training for staff — only " + staffHealthReadiness.mentalHealthRate + "% trained");
  if (screeningCompliance.declinedCount > 2)
    actions.push("Review consent and engagement strategies for children declining health screenings");

  const regulatoryLinks: string[] = [
    "CHR 2015, Reg 10 — Health and wellbeing standard: duty to promote physical, emotional and mental health",
    "Promoting the Health and Wellbeing of Looked After Children (2015) — Statutory guidance on health assessments and health plans",
    "SCCIF — Health and wellbeing: children receive timely, high-quality health care including dental, optical and immunisations",
    "NMS 4 — Health care standard: children's health needs are identified and met through effective health care planning",
    "NICE PH28 — Looked-after children and young people: comprehensive health assessments and care",
    "UNCRC Article 24 — Right to the enjoyment of the highest attainable standard of health",
    "CA 1989, s22(3)(a) — Duty to safeguard and promote the welfare of looked-after children",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating,
    screeningCompliance,
    gpAccess,
    healthPlanning,
    staffHealthReadiness,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
