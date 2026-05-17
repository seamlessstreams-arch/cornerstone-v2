// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Leaving Care & Aftercare Engine
//
// Deterministic engine for managing leaving care preparation, pathway
// planning, staying close/staying put, and post-18 aftercare support.
//
// Aligned to:
//   - Children (Leaving Care) Act 2000
//   - Children & Social Work Act 2017 (extended duties to 25)
//   - CHR 2015 Reg 14 — Preparation for ceasing to be looked after
//   - Care Leavers (England) Regulations 2010
//   - National Care Leaver Covenant
//   - Staying Close / Staying Put guidance (2022)
//   - SCCIF — Experiences and progress: leaving care preparation
//
// Key requirements:
//   - Pathway Plan from age 16 (reviewed every 6 months)
//   - Personal Adviser (PA) allocated from 16+
//   - Independence assessment informing pathway plan
//   - Staying Close offer from residential settings
//   - Support to 25 (extended personal adviser support)
//   - Education, employment & training (EET) status tracked
//   - Accommodation secured before leaving
//   - Financial capability assessment
//   - Health passport / summary provided
//   - Life story work completed
//   - "Keeping in touch" protocol after departure
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type LeavingCareStatus =
  | "pre_planning"        // 15-16, awareness stage
  | "pathway_planning"    // 16+, active planning
  | "transition"          // approaching departure
  | "departed"            // left care
  | "staying_close"       // post-departure, keeping connected
  | "aftercare";          // 18-25, post-care support

export type AccommodationType =
  | "staying_put"           // remains with foster carer
  | "staying_close"         // independent but linked to home
  | "supported_lodgings"
  | "semi_independent"
  | "independent_tenancy"
  | "university_halls"
  | "family_return"
  | "shared_housing"
  | "not_secured"
  | "other";

export type EETStatus =
  | "education_ft"        // full-time education
  | "education_pt"        // part-time education
  | "employment_ft"
  | "employment_pt"
  | "apprenticeship"
  | "training"
  | "volunteering"
  | "neet"                // not in education, employment or training
  | "neet_illness";       // NEET due to illness/disability

export type SupportFrequency =
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "quarterly"
  | "as_needed";

// ── Core Interfaces ──��─────────────────────────────────────────────────────

export interface LeavingCareProfile {
  id: string;
  childId: string;
  childName: string;
  dateOfBirth: string;
  homeId: string;
  status: LeavingCareStatus;
  personalAdviser?: string;
  personalAdviserAllocatedDate?: string;
  pathwayPlan?: PathwayPlan;
  pathwayPlanReviews: PathwayPlanReview[];
  accommodationPlan: AccommodationType;
  accommodationSecured: boolean;
  accommodationDetails?: string;
  eetStatus: EETStatus;
  eetDetails?: string;
  financialCapabilityAssessed: boolean;
  financialCapabilityScore?: number;     // 0-100
  bankAccountOpened: boolean;
  budgetingSupport: boolean;
  healthPassportProvided: boolean;
  gpRegistered: boolean;
  dentistRegistered: boolean;
  lifeStoryWorkCompleted: boolean;
  stayingCloseOffered: boolean;
  stayingCloseAccepted?: boolean;
  keepingInTouchFrequency?: SupportFrequency;
  lastContactDate?: string;
  departureDate?: string;
  expectedDepartureDate?: string;
  supportEndDate?: string;               // up to 25
}

export interface PathwayPlan {
  createdDate: string;
  lastReviewedDate: string;
  nextReviewDue: string;
  createdBy: string;
  status: "draft" | "active" | "under_review" | "completed";
  accommodationPlanned: boolean;
  educationPlanned: boolean;
  healthPlanned: boolean;
  financePlanned: boolean;
  socialNetworksPlanned: boolean;
  contingencyPlan: boolean;
  youngPersonContributed: boolean;
  socialWorkerSigned: boolean;
}

export interface PathwayPlanReview {
  date: string;
  reviewedBy: string;
  attendees: string[];
  youngPersonAttended: boolean;
  youngPersonViews: string;
  progressSummary: string;
  actionsAgreed: string[];
  nextReviewDate: string;
}

export interface AftercareSupportRecord {
  id: string;
  childId: string;
  date: string;
  type: "visit" | "phone" | "text" | "email" | "activity";
  duration?: number;          // minutes
  topics: string[];
  supportProvided: string[];
  concerns?: string[];
  mood?: "positive" | "neutral" | "low" | "crisis";
  recordedBy: string;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface LeavingCareComplianceResult {
  childId: string;
  childName: string;
  ageYears: number;
  status: LeavingCareStatus;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  pathwayPlanInPlace: boolean;
  pathwayPlanCurrent: boolean;         // reviewed within 6 months
  personalAdviserAllocated: boolean;
  accommodationSecured: boolean;
  eetEngaged: boolean;                 // not NEET
  financialCapabilityAssessed: boolean;
  healthPassportProvided: boolean;
  lifeStoryCompleted: boolean;
  stayingCloseOffered: boolean;
  overallPreparedness: number;         // 0-100
  daysUntilDeparture?: number;
  daysSinceDeparture?: number;
  contactUpToDate: boolean;
}

export interface HomeLeavingCareMetrics {
  homeId: string;
  totalYoungPeople: number;
  activePreparation: number;           // in pathway planning or transition
  departed: number;
  stayingClose: number;
  aftercare: number;
  pathwayPlanComplianceRate: number;
  personalAdviserRate: number;
  accommodationSecuredRate: number;
  eetRate: number;                     // % engaged in EET
  healthPassportRate: number;
  financialCapabilityRate: number;
  stayingCloseAcceptanceRate: number;
  averagePreparedness: number;
  contactComplianceRate: number;       // post-departure contact up to date
  youngPeopleNeedingAttention: { childName: string; issues: string[] }[];
  complianceIssues: string[];
}

// ── Configuration ─���────────────────────────────────────────────────────────

const PATHWAY_PLAN_REVIEW_MONTHS = 6;       // reviewed every 6 months
const PATHWAY_PLAN_START_AGE = 16;           // starts at 16
const PA_ALLOCATION_AGE = 16;                // PA from 16
const CONTACT_OVERDUE_DAYS: Record<SupportFrequency, number> = {
  weekly: 10,
  fortnightly: 21,
  monthly: 45,
  quarterly: 100,
  as_needed: 90,
};

// ── Core: Evaluate Leaving Care Compliance ─────────────────────────────────

export function evaluateLeavingCareCompliance(
  profile: LeavingCareProfile,
  supportRecords: AftercareSupportRecord[],
  now?: string,
): LeavingCareComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const issues: string[] = [];
  const warnings: string[] = [];

  const dob = new Date(profile.dateOfBirth);
  const ageYears = Math.floor((currentTime - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  // Pathway Plan
  const pathwayPlanInPlace = !!profile.pathwayPlan;
  let pathwayPlanCurrent = false;

  if (ageYears >= PATHWAY_PLAN_START_AGE) {
    if (!pathwayPlanInPlace) {
      issues.push("Pathway Plan not in place (required from age 16)");
    } else {
      const lastReview = new Date(profile.pathwayPlan!.lastReviewedDate).getTime();
      const sixMonthsAgo = currentTime - PATHWAY_PLAN_REVIEW_MONTHS * 30.44 * 24 * 60 * 60 * 1000;
      pathwayPlanCurrent = lastReview > sixMonthsAgo;
      if (!pathwayPlanCurrent) {
        issues.push("Pathway Plan not reviewed in last 6 months");
      }
      if (!profile.pathwayPlan!.youngPersonContributed) {
        warnings.push("Young person has not contributed to Pathway Plan");
      }
    }
  }

  // Personal Adviser
  const personalAdviserAllocated = !!profile.personalAdviser;
  if (ageYears >= PA_ALLOCATION_AGE && !personalAdviserAllocated) {
    issues.push("Personal Adviser not allocated (required from age 16)");
  }

  // Accommodation
  const inTransitionOrDeparted = profile.status === "transition" || profile.status === "departed" || profile.status === "staying_close" || profile.status === "aftercare";
  if (inTransitionOrDeparted && !profile.accommodationSecured) {
    issues.push("Accommodation not secured for leaving care");
  } else if (profile.status === "pathway_planning" && !profile.accommodationSecured && profile.expectedDepartureDate) {
    const daysUntil = Math.round((new Date(profile.expectedDepartureDate).getTime() - currentTime) / (24 * 60 * 60 * 1000));
    if (daysUntil < 90) {
      warnings.push(`Accommodation not secured — departure expected in ${daysUntil} days`);
    }
  }

  // EET
  const eetEngaged = profile.eetStatus !== "neet" && profile.eetStatus !== "neet_illness";
  if (!eetEngaged && profile.status !== "pre_planning") {
    if (profile.eetStatus === "neet") {
      issues.push("Young person NEET — EET plan needed");
    } else {
      warnings.push("Young person NEET due to illness — support plan should be in place");
    }
  }

  // Financial capability
  if (ageYears >= 16 && !profile.financialCapabilityAssessed) {
    warnings.push("Financial capability not yet assessed");
  }

  // Health passport
  if (inTransitionOrDeparted && !profile.healthPassportProvided) {
    issues.push("Health passport/summary not provided");
  }

  // Life story
  if (inTransitionOrDeparted && !profile.lifeStoryWorkCompleted) {
    warnings.push("Life story work not completed before departure");
  }

  // Staying Close
  if ((profile.status === "transition" || profile.status === "departed") && !profile.stayingCloseOffered) {
    issues.push("Staying Close offer not made (statutory requirement from residential)");
  }

  // Contact (post-departure)
  let contactUpToDate = true;
  if ((profile.status === "staying_close" || profile.status === "aftercare") && profile.keepingInTouchFrequency) {
    const overdueDays = CONTACT_OVERDUE_DAYS[profile.keepingInTouchFrequency];
    if (profile.lastContactDate) {
      const daysSinceContact = (currentTime - new Date(profile.lastContactDate).getTime()) / (24 * 60 * 60 * 1000);
      if (daysSinceContact > overdueDays) {
        contactUpToDate = false;
        warnings.push(`Contact overdue — last contact ${Math.round(daysSinceContact)} days ago`);
      }
    } else {
      contactUpToDate = false;
      warnings.push("No recorded contact since departure");
    }
  }

  // Days until/since departure
  let daysUntilDeparture: number | undefined;
  let daysSinceDeparture: number | undefined;
  if (profile.expectedDepartureDate && !profile.departureDate) {
    daysUntilDeparture = Math.round((new Date(profile.expectedDepartureDate).getTime() - currentTime) / (24 * 60 * 60 * 1000));
  }
  if (profile.departureDate) {
    daysSinceDeparture = Math.round((currentTime - new Date(profile.departureDate).getTime()) / (24 * 60 * 60 * 1000));
  }

  // Overall preparedness score
  const factors = [
    pathwayPlanInPlace && pathwayPlanCurrent ? 15 : pathwayPlanInPlace ? 8 : 0,
    personalAdviserAllocated ? 10 : 0,
    profile.accommodationSecured ? 20 : 0,
    eetEngaged ? 15 : 0,
    profile.financialCapabilityAssessed ? 10 : 0,
    profile.bankAccountOpened ? 5 : 0,
    profile.healthPassportProvided ? 10 : 0,
    profile.gpRegistered ? 3 : 0,
    profile.dentistRegistered ? 2 : 0,
    profile.lifeStoryWorkCompleted ? 5 : 0,
    profile.stayingCloseOffered ? 5 : 0,
  ];
  const overallPreparedness = factors.reduce((a, b) => a + b, 0);

  return {
    childId: profile.childId,
    childName: profile.childName,
    ageYears,
    status: profile.status,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    pathwayPlanInPlace,
    pathwayPlanCurrent,
    personalAdviserAllocated,
    accommodationSecured: profile.accommodationSecured,
    eetEngaged,
    financialCapabilityAssessed: profile.financialCapabilityAssessed,
    healthPassportProvided: profile.healthPassportProvided,
    lifeStoryCompleted: profile.lifeStoryWorkCompleted,
    stayingCloseOffered: profile.stayingCloseOffered,
    overallPreparedness,
    daysUntilDeparture,
    daysSinceDeparture,
    contactUpToDate,
  };
}

// ── Core: Calculate Home Leaving Care Metrics ──────────────────────────────

export function calculateHomeLeavingCareMetrics(
  profiles: LeavingCareProfile[],
  supportRecords: AftercareSupportRecord[],
  homeId: string,
  now?: string,
): HomeLeavingCareMetrics {
  const homeProfiles = profiles.filter(p => p.homeId === homeId);
  const results = homeProfiles.map(p => evaluateLeavingCareCompliance(p, supportRecords, now));

  const totalYoungPeople = homeProfiles.length;
  const activePreparation = homeProfiles.filter(p => p.status === "pathway_planning" || p.status === "transition").length;
  const departed = homeProfiles.filter(p => p.status === "departed").length;
  const stayingClose = homeProfiles.filter(p => p.status === "staying_close").length;
  const aftercare = homeProfiles.filter(p => p.status === "aftercare").length;

  // Compliance rates (only for those old enough / in relevant status)
  const planningAge = results.filter(r => r.ageYears >= 16);
  const pathwayPlanComplianceRate = planningAge.length > 0
    ? Math.round((planningAge.filter(r => r.pathwayPlanInPlace && r.pathwayPlanCurrent).length / planningAge.length) * 100)
    : 100;

  const personalAdviserRate = planningAge.length > 0
    ? Math.round((planningAge.filter(r => r.personalAdviserAllocated).length / planningAge.length) * 100)
    : 100;

  const transitionOrLater = results.filter(r =>
    r.status === "transition" || r.status === "departed" || r.status === "staying_close" || r.status === "aftercare"
  );
  const accommodationSecuredRate = transitionOrLater.length > 0
    ? Math.round((transitionOrLater.filter(r => r.accommodationSecured).length / transitionOrLater.length) * 100)
    : 100;

  const relevantForEET = results.filter(r => r.status !== "pre_planning");
  const eetRate = relevantForEET.length > 0
    ? Math.round((relevantForEET.filter(r => r.eetEngaged).length / relevantForEET.length) * 100)
    : 100;

  const healthPassportRate = transitionOrLater.length > 0
    ? Math.round((transitionOrLater.filter(r => r.healthPassportProvided).length / transitionOrLater.length) * 100)
    : 100;

  const financialCapabilityRate = planningAge.length > 0
    ? Math.round((planningAge.filter(r => r.financialCapabilityAssessed).length / planningAge.length) * 100)
    : 100;

  // Staying close
  const stayingCloseEligible = results.filter(r => r.status === "transition" || r.status === "departed" || r.status === "staying_close");
  const stayingCloseAccepted = homeProfiles.filter(p => p.stayingCloseAccepted === true).length;
  const stayingCloseAcceptanceRate = stayingCloseEligible.length > 0
    ? Math.round((stayingCloseAccepted / stayingCloseEligible.length) * 100)
    : 0;

  // Average preparedness
  const averagePreparedness = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.overallPreparedness, 0) / results.length)
    : 0;

  // Contact compliance (post-departure only)
  const postDeparture = results.filter(r => r.status === "staying_close" || r.status === "aftercare");
  const contactComplianceRate = postDeparture.length > 0
    ? Math.round((postDeparture.filter(r => r.contactUpToDate).length / postDeparture.length) * 100)
    : 100;

  // Young people needing attention
  const youngPeopleNeedingAttention = results
    .filter(r => r.issues.length > 0)
    .map(r => ({ childName: r.childName, issues: r.issues }))
    .sort((a, b) => b.issues.length - a.issues.length);

  const allIssues = results.flatMap(r => r.issues);
  const complianceIssues = [...new Set(allIssues)];

  return {
    homeId,
    totalYoungPeople,
    activePreparation,
    departed,
    stayingClose,
    aftercare,
    pathwayPlanComplianceRate,
    personalAdviserRate,
    accommodationSecuredRate,
    eetRate,
    healthPassportRate,
    financialCapabilityRate,
    stayingCloseAcceptanceRate,
    averagePreparedness,
    contactComplianceRate,
    youngPeopleNeedingAttention,
    complianceIssues,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

export function getLeavingCareStatusLabel(status: LeavingCareStatus): string {
  const labels: Record<LeavingCareStatus, string> = {
    pre_planning: "Pre-Planning",
    pathway_planning: "Pathway Planning",
    transition: "In Transition",
    departed: "Departed",
    staying_close: "Staying Close",
    aftercare: "Aftercare",
  };
  return labels[status] ?? status;
}

export function getAccommodationTypeLabel(type: AccommodationType): string {
  const labels: Record<AccommodationType, string> = {
    staying_put: "Staying Put",
    staying_close: "Staying Close",
    supported_lodgings: "Supported Lodgings",
    semi_independent: "Semi-Independent",
    independent_tenancy: "Independent Tenancy",
    university_halls: "University Halls",
    family_return: "Return to Family",
    shared_housing: "Shared Housing",
    not_secured: "Not Yet Secured",
    other: "Other",
  };
  return labels[type] ?? type;
}

export function getEETStatusLabel(status: EETStatus): string {
  const labels: Record<EETStatus, string> = {
    education_ft: "Education (Full-Time)",
    education_pt: "Education (Part-Time)",
    employment_ft: "Employment (Full-Time)",
    employment_pt: "Employment (Part-Time)",
    apprenticeship: "Apprenticeship",
    training: "Training",
    volunteering: "Volunteering",
    neet: "NEET",
    neet_illness: "NEET (Illness/Disability)",
  };
  return labels[status] ?? status;
}
