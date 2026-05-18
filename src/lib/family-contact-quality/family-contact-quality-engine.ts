// ==============================================================================
// Cornerstone Family Contact Quality Intelligence Engine
//
// Evaluates the quality, frequency, and child-centredness of family contact
// arrangements for looked-after children in residential care.
//
// Regulatory basis:
//   CHR 2015 Reg 8 — promotion of contact between child and family
//   CA 1989 s34 — contact with children in care
//   CA 1989 Schedule 2 Para 15 — promotion and maintenance of contact
//   UNCRC Article 9 — right to maintain contact with parents
//   SCCIF — experiences and progress of children, including family contact
//   NMS 10 — contact and relationships
//   Working Together 2023 — family involvement in care planning
//
// Pure deterministic engine — no AI, no external calls.
// ==============================================================================

// -- Types --------------------------------------------------------------------

export type ContactType =
  | "face_to_face"
  | "telephone"
  | "video_call"
  | "letter"
  | "supervised_visit"
  | "unsupervised_visit"
  | "family_activity"
  | "sibling_contact"
  | "overnight_stay";

export type ContactOutcome =
  | "positive"
  | "mostly_positive"
  | "mixed"
  | "difficult"
  | "distressing"
  | "did_not_occur";

export type ContactFrequency =
  | "more_than_weekly"
  | "weekly"
  | "fortnightly"
  | "monthly"
  | "less_than_monthly"
  | "no_contact";

export type SupervisionLevel =
  | "unsupervised"
  | "light_touch"
  | "supervised"
  | "closely_supervised"
  | "suspended";

export type FamilyMember =
  | "mother"
  | "father"
  | "sibling"
  | "grandparent"
  | "aunt_uncle"
  | "other_relative"
  | "significant_other";

export type ChildViewOnContact =
  | "wants_more"
  | "happy_with_current"
  | "wants_less"
  | "does_not_want"
  | "not_recorded";

export type Rating = "outstanding" | "good" | "requires_improvement" | "inadequate";

// -- Interfaces ---------------------------------------------------------------

export interface ContactRecord {
  id: string;
  childId: string;
  childName: string;
  familyMember: FamilyMember;
  familyMemberName: string;
  contactType: ContactType;
  contactDate: string;
  supervisionLevel: SupervisionLevel;
  outcome: ContactOutcome;
  durationMinutes: number;
  childPreparedForContact: boolean;
  childViewsSought: boolean;
  childEnjoyedContact: boolean;
  debriefAfterContact: boolean;
  impactOnChild: string;
  staffFacilitator?: string;
}

export interface ContactPlan {
  id: string;
  childId: string;
  childName: string;
  familyMember: FamilyMember;
  familyMemberName: string;
  agreedFrequency: ContactFrequency;
  actualFrequencyMet: boolean;
  childViewOnContact: ChildViewOnContact;
  courtOrderInPlace: boolean;
  contactConditions?: string;
  lastReviewedDate: string;
  reviewedBy: string;
  planIsChildCentred: boolean;
}

export interface SiblingContact {
  id: string;
  childId: string;
  childName: string;
  siblingId: string;
  siblingName: string;
  siblingPlacement: string;
  contactFrequency: ContactFrequency;
  frequencyMet: boolean;
  lastContactDate: string;
  qualityRating: ContactOutcome;
}

export interface FamilyEngagement {
  id: string;
  childId: string;
  childName: string;
  familyInvolvedInReviews: boolean;
  familyInvolvedInCarePlanning: boolean;
  familyRelationshipsSupported: boolean;
  culturalLinksPromoted: boolean;
  familyGroupConferencing: boolean;
  lifestoryWorkIncludesFamily: boolean;
}

// -- Result Types -------------------------------------------------------------

export interface ContactQualityResult {
  overallScore: number; // 0-25
  totalContacts: number;
  positiveOutcomeRate: number;
  childPreparedRate: number;
  childViewsSoughtRate: number;
  childEnjoyedRate: number;
  debriefRate: number;
  averageDurationMinutes: number;
  contactsByType: Record<string, number>;
}

export interface ContactPlanComplianceResult {
  overallScore: number; // 0-25
  totalPlans: number;
  frequencyMetRate: number;
  childCentredRate: number;
  childWantsMoreCount: number;
  childHappyCount: number;
  recentlyReviewedRate: number;
  courtOrderCount: number;
}

export interface SiblingContactResult {
  overallScore: number; // 0-25
  totalSiblingPairs: number;
  frequencyMetRate: number;
  positiveQualityRate: number;
  averageContactGapDays: number;
}

export interface FamilyEngagementResult {
  overallScore: number; // 0-25
  totalChildren: number;
  reviewInvolvementRate: number;
  carePlanningRate: number;
  relationshipsSupportedRate: number;
  culturalLinksRate: number;
  familyConferencingRate: number;
  lifestoryRate: number;
}

export interface ChildContactProfile {
  childId: string;
  childName: string;
  totalContacts: number;
  positiveRate: number;
  siblingContactMet: boolean;
  familyEngaged: boolean;
  childViewOnContact: ChildViewOnContact;
  overallScore: number; // 0-10
}

export interface FamilyContactQualityIntelligence {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: Rating;
  contactQuality: ContactQualityResult;
  planCompliance: ContactPlanComplianceResult;
  siblingContact: SiblingContactResult;
  familyEngagement: FamilyEngagementResult;
  childProfiles: ChildContactProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
}

// -- Label Functions ----------------------------------------------------------

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  face_to_face: "Face to Face",
  telephone: "Telephone",
  video_call: "Video Call",
  letter: "Letter",
  supervised_visit: "Supervised Visit",
  unsupervised_visit: "Unsupervised Visit",
  family_activity: "Family Activity",
  sibling_contact: "Sibling Contact",
  overnight_stay: "Overnight Stay",
};

const CONTACT_OUTCOME_LABELS: Record<ContactOutcome, string> = {
  positive: "Positive",
  mostly_positive: "Mostly Positive",
  mixed: "Mixed",
  difficult: "Difficult",
  distressing: "Distressing",
  did_not_occur: "Did Not Occur",
};

const CONTACT_FREQUENCY_LABELS: Record<ContactFrequency, string> = {
  more_than_weekly: "More Than Weekly",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
  less_than_monthly: "Less Than Monthly",
  no_contact: "No Contact",
};

const SUPERVISION_LEVEL_LABELS: Record<SupervisionLevel, string> = {
  unsupervised: "Unsupervised",
  light_touch: "Light Touch",
  supervised: "Supervised",
  closely_supervised: "Closely Supervised",
  suspended: "Suspended",
};

const FAMILY_MEMBER_LABELS: Record<FamilyMember, string> = {
  mother: "Mother",
  father: "Father",
  sibling: "Sibling",
  grandparent: "Grandparent",
  aunt_uncle: "Aunt/Uncle",
  other_relative: "Other Relative",
  significant_other: "Significant Other",
};

const CHILD_VIEW_LABELS: Record<ChildViewOnContact, string> = {
  wants_more: "Wants More Contact",
  happy_with_current: "Happy With Current",
  wants_less: "Wants Less Contact",
  does_not_want: "Does Not Want Contact",
  not_recorded: "Not Recorded",
};

export function getContactTypeLabel(t: ContactType): string {
  return CONTACT_TYPE_LABELS[t] ?? t;
}
export function getContactOutcomeLabel(o: ContactOutcome): string {
  return CONTACT_OUTCOME_LABELS[o] ?? o;
}
export function getContactFrequencyLabel(f: ContactFrequency): string {
  return CONTACT_FREQUENCY_LABELS[f] ?? f;
}
export function getSupervisionLevelLabel(l: SupervisionLevel): string {
  return SUPERVISION_LEVEL_LABELS[l] ?? l;
}
export function getFamilyMemberLabel(m: FamilyMember): string {
  return FAMILY_MEMBER_LABELS[m] ?? m;
}
export function getChildViewLabel(v: ChildViewOnContact): string {
  return CHILD_VIEW_LABELS[v] ?? v;
}

// -- Helpers ------------------------------------------------------------------

function pct(num: number, den: number): number {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 80) return "outstanding";
  if (score >= 60) return "good";
  if (score >= 40) return "requires_improvement";
  return "inadequate";
}

// -- Evaluation Functions -----------------------------------------------------

export function evaluateContactQuality(records: ContactRecord[]): ContactQualityResult {
  if (records.length === 0) {
    return {
      overallScore: 0,
      totalContacts: 0,
      positiveOutcomeRate: 0,
      childPreparedRate: 0,
      childViewsSoughtRate: 0,
      childEnjoyedRate: 0,
      debriefRate: 0,
      averageDurationMinutes: 0,
      contactsByType: {},
    };
  }

  const total = records.length;
  const occurred = records.filter((r) => r.outcome !== "did_not_occur");
  const occurredCount = occurred.length;

  const positive = occurred.filter(
    (r) => r.outcome === "positive" || r.outcome === "mostly_positive",
  ).length;
  const positiveOutcomeRate = pct(positive, occurredCount);

  const prepared = records.filter((r) => r.childPreparedForContact).length;
  const childPreparedRate = pct(prepared, total);

  const viewsSought = records.filter((r) => r.childViewsSought).length;
  const childViewsSoughtRate = pct(viewsSought, total);

  const enjoyed = occurred.filter((r) => r.childEnjoyedContact).length;
  const childEnjoyedRate = pct(enjoyed, occurredCount);

  const debriefed = occurred.filter((r) => r.debriefAfterContact).length;
  const debriefRate = pct(debriefed, occurredCount);

  const totalDuration = occurred.reduce((sum, r) => sum + r.durationMinutes, 0);
  const averageDurationMinutes = occurredCount > 0 ? Math.round(totalDuration / occurredCount) : 0;

  const contactsByType: Record<string, number> = {};
  for (const r of records) {
    contactsByType[r.contactType] = (contactsByType[r.contactType] || 0) + 1;
  }

  // Scoring: 0-25
  let score = 0;

  // Positive outcome rate (0-6)
  if (positiveOutcomeRate >= 80) score += 6;
  else if (positiveOutcomeRate >= 60) score += 4;
  else if (positiveOutcomeRate >= 40) score += 2;

  // Child prepared (0-5)
  if (childPreparedRate >= 90) score += 5;
  else if (childPreparedRate >= 70) score += 3;
  else if (childPreparedRate >= 50) score += 1;

  // Child views sought (0-5)
  if (childViewsSoughtRate >= 90) score += 5;
  else if (childViewsSoughtRate >= 70) score += 3;
  else if (childViewsSoughtRate >= 50) score += 1;

  // Enjoyment (0-4)
  if (childEnjoyedRate >= 80) score += 4;
  else if (childEnjoyedRate >= 60) score += 2;

  // Debrief (0-3)
  if (debriefRate >= 90) score += 3;
  else if (debriefRate >= 70) score += 2;
  else if (debriefRate >= 50) score += 1;

  // Contact variety bonus (0-2)
  const typeCount = Object.keys(contactsByType).length;
  if (typeCount >= 4) score += 2;
  else if (typeCount >= 2) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalContacts: total,
    positiveOutcomeRate,
    childPreparedRate,
    childViewsSoughtRate,
    childEnjoyedRate,
    debriefRate,
    averageDurationMinutes,
    contactsByType,
  };
}

export function evaluateContactPlanCompliance(plans: ContactPlan[]): ContactPlanComplianceResult {
  if (plans.length === 0) {
    return {
      overallScore: 0,
      totalPlans: 0,
      frequencyMetRate: 0,
      childCentredRate: 0,
      childWantsMoreCount: 0,
      childHappyCount: 0,
      recentlyReviewedRate: 0,
      courtOrderCount: 0,
    };
  }

  const total = plans.length;

  const frequencyMet = plans.filter((p) => p.actualFrequencyMet).length;
  const frequencyMetRate = pct(frequencyMet, total);

  const childCentred = plans.filter((p) => p.planIsChildCentred).length;
  const childCentredRate = pct(childCentred, total);

  const childWantsMoreCount = plans.filter((p) => p.childViewOnContact === "wants_more").length;
  const childHappyCount = plans.filter((p) => p.childViewOnContact === "happy_with_current").length;

  // Recently reviewed = within 3 months (90 days)
  const now = new Date();
  const recentlyReviewed = plans.filter((p) => {
    const reviewDate = new Date(p.lastReviewedDate);
    const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 90;
  }).length;
  const recentlyReviewedRate = pct(recentlyReviewed, total);

  const courtOrderCount = plans.filter((p) => p.courtOrderInPlace).length;

  // Scoring: 0-25
  let score = 0;

  // Frequency met (0-7)
  if (frequencyMetRate >= 90) score += 7;
  else if (frequencyMetRate >= 70) score += 5;
  else if (frequencyMetRate >= 50) score += 3;
  else if (frequencyMetRate > 0) score += 1;

  // Child-centred plans (0-6)
  if (childCentredRate >= 90) score += 6;
  else if (childCentredRate >= 70) score += 4;
  else if (childCentredRate >= 50) score += 2;

  // Child satisfaction (0-5)
  const happyRate = pct(childHappyCount, total);
  if (happyRate >= 80) score += 5;
  else if (happyRate >= 50) score += 3;
  else if (happyRate > 0) score += 1;

  // Recently reviewed (0-4)
  if (recentlyReviewedRate >= 90) score += 4;
  else if (recentlyReviewedRate >= 70) score += 2;
  else if (recentlyReviewedRate >= 50) score += 1;

  // Penalty: children wanting more contact
  if (childWantsMoreCount > 0) {
    score -= Math.min(childWantsMoreCount, 3);
  }

  return {
    overallScore: Math.max(0, Math.min(score, 25)),
    totalPlans: total,
    frequencyMetRate,
    childCentredRate,
    childWantsMoreCount,
    childHappyCount,
    recentlyReviewedRate,
    courtOrderCount,
  };
}

export function evaluateSiblingContact(contacts: SiblingContact[]): SiblingContactResult {
  if (contacts.length === 0) {
    return {
      overallScore: 25,
      totalSiblingPairs: 0,
      frequencyMetRate: 100,
      positiveQualityRate: 100,
      averageContactGapDays: 0,
    };
  }

  const total = contacts.length;

  const frequencyMet = contacts.filter((c) => c.frequencyMet).length;
  const frequencyMetRate = pct(frequencyMet, total);

  const positiveQuality = contacts.filter(
    (c) => c.qualityRating === "positive" || c.qualityRating === "mostly_positive",
  ).length;
  const positiveQualityRate = pct(positiveQuality, total);

  // Average gap from last contact
  const now = new Date();
  const gaps = contacts.map((c) => {
    const last = new Date(c.lastContactDate);
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  });
  const averageContactGapDays = gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0;

  // Scoring: 0-25
  let score = 0;

  // Frequency met (0-8)
  if (frequencyMetRate >= 90) score += 8;
  else if (frequencyMetRate >= 70) score += 6;
  else if (frequencyMetRate >= 50) score += 4;
  else if (frequencyMetRate > 0) score += 2;

  // Quality (0-7)
  if (positiveQualityRate >= 80) score += 7;
  else if (positiveQualityRate >= 60) score += 5;
  else if (positiveQualityRate >= 40) score += 3;

  // Contact gap (0-5)
  if (averageContactGapDays <= 14) score += 5;
  else if (averageContactGapDays <= 30) score += 3;
  else if (averageContactGapDays <= 60) score += 1;

  // All siblings in contact bonus (0-5)
  if (frequencyMetRate === 100) score += 5;
  else if (frequencyMetRate >= 80) score += 3;

  return {
    overallScore: Math.min(score, 25),
    totalSiblingPairs: total,
    frequencyMetRate,
    positiveQualityRate,
    averageContactGapDays,
  };
}

export function evaluateFamilyEngagement(engagements: FamilyEngagement[]): FamilyEngagementResult {
  if (engagements.length === 0) {
    return {
      overallScore: 0,
      totalChildren: 0,
      reviewInvolvementRate: 0,
      carePlanningRate: 0,
      relationshipsSupportedRate: 0,
      culturalLinksRate: 0,
      familyConferencingRate: 0,
      lifestoryRate: 0,
    };
  }

  const total = engagements.length;

  const reviewInvolved = engagements.filter((e) => e.familyInvolvedInReviews).length;
  const reviewInvolvementRate = pct(reviewInvolved, total);

  const carePlanning = engagements.filter((e) => e.familyInvolvedInCarePlanning).length;
  const carePlanningRate = pct(carePlanning, total);

  const relSupported = engagements.filter((e) => e.familyRelationshipsSupported).length;
  const relationshipsSupportedRate = pct(relSupported, total);

  const cultural = engagements.filter((e) => e.culturalLinksPromoted).length;
  const culturalLinksRate = pct(cultural, total);

  const conferencing = engagements.filter((e) => e.familyGroupConferencing).length;
  const familyConferencingRate = pct(conferencing, total);

  const lifestory = engagements.filter((e) => e.lifestoryWorkIncludesFamily).length;
  const lifestoryRate = pct(lifestory, total);

  // Scoring: 0-25
  let score = 0;

  // Review involvement (0-5)
  if (reviewInvolvementRate >= 80) score += 5;
  else if (reviewInvolvementRate >= 60) score += 3;
  else if (reviewInvolvementRate >= 40) score += 1;

  // Care planning (0-5)
  if (carePlanningRate >= 80) score += 5;
  else if (carePlanningRate >= 60) score += 3;
  else if (carePlanningRate >= 40) score += 1;

  // Relationships supported (0-5)
  if (relationshipsSupportedRate >= 90) score += 5;
  else if (relationshipsSupportedRate >= 70) score += 3;
  else if (relationshipsSupportedRate >= 50) score += 1;

  // Cultural links (0-4)
  if (culturalLinksRate >= 80) score += 4;
  else if (culturalLinksRate >= 60) score += 2;

  // Family conferencing (0-3)
  if (familyConferencingRate >= 50) score += 3;
  else if (familyConferencingRate >= 25) score += 1;

  // Life story (0-3)
  if (lifestoryRate >= 80) score += 3;
  else if (lifestoryRate >= 50) score += 2;
  else if (lifestoryRate >= 25) score += 1;

  return {
    overallScore: Math.min(score, 25),
    totalChildren: total,
    reviewInvolvementRate,
    carePlanningRate,
    relationshipsSupportedRate,
    culturalLinksRate,
    familyConferencingRate,
    lifestoryRate,
  };
}

// -- Child Profiles -----------------------------------------------------------

export function buildChildContactProfiles(
  records: ContactRecord[],
  plans: ContactPlan[],
  siblings: SiblingContact[],
  engagements: FamilyEngagement[],
): ChildContactProfile[] {
  const childIds = new Set<string>();
  records.forEach((r) => childIds.add(r.childId));
  plans.forEach((p) => childIds.add(p.childId));
  siblings.forEach((s) => childIds.add(s.childId));
  engagements.forEach((e) => childIds.add(e.childId));

  return Array.from(childIds).map((childId) => {
    const childRecords = records.filter((r) => r.childId === childId);
    const childPlans = plans.filter((p) => p.childId === childId);
    const childSiblings = siblings.filter((s) => s.childId === childId);
    const childEngagement = engagements.find((e) => e.childId === childId);

    const childName =
      childRecords[0]?.childName ??
      childPlans[0]?.childName ??
      childSiblings[0]?.childName ??
      childEngagement?.childName ??
      childId;

    const occurred = childRecords.filter((r) => r.outcome !== "did_not_occur");
    const totalContacts = occurred.length;
    const positive = occurred.filter(
      (r) => r.outcome === "positive" || r.outcome === "mostly_positive",
    ).length;
    const positiveRate = pct(positive, totalContacts);

    const siblingContactMet = childSiblings.length === 0 || childSiblings.every((s) => s.frequencyMet);
    const familyEngaged = childEngagement
      ? childEngagement.familyInvolvedInReviews && childEngagement.familyRelationshipsSupported
      : false;

    const primaryPlan = childPlans[0];
    const childViewOnContact = primaryPlan?.childViewOnContact ?? "not_recorded";

    let profileScore = 3;
    if (positiveRate >= 80) profileScore += 2;
    else if (positiveRate >= 50) profileScore += 1;
    if (siblingContactMet) profileScore += 2;
    if (familyEngaged) profileScore += 1;
    if (childViewOnContact === "happy_with_current") profileScore += 2;
    else if (childViewOnContact === "wants_more") profileScore += 0;
    else if (childViewOnContact === "not_recorded") profileScore -= 1;
    if (totalContacts === 0) profileScore -= 2;

    return {
      childId,
      childName,
      totalContacts,
      positiveRate,
      siblingContactMet,
      familyEngaged,
      childViewOnContact,
      overallScore: Math.max(0, Math.min(profileScore, 10)),
    };
  });
}

// -- Strengths / Areas / Actions ----------------------------------------------

function generateStrengths(
  cq: ContactQualityResult,
  pc: ContactPlanComplianceResult,
  sc: SiblingContactResult,
  fe: FamilyEngagementResult,
): string[] {
  const strengths: string[] = [];

  if (cq.positiveOutcomeRate >= 80 && cq.totalContacts > 0) {
    strengths.push("High proportion of family contacts have positive outcomes — children benefit from quality interactions");
  }
  if (cq.childViewsSoughtRate >= 90 && cq.totalContacts > 0) {
    strengths.push("Child views consistently sought before contact — strong UNCRC Article 9 compliance");
  }
  if (cq.childPreparedRate >= 90 && cq.totalContacts > 0) {
    strengths.push("Children consistently prepared for family contact — reducing anxiety and improving outcomes");
  }
  if (cq.debriefRate >= 90 && cq.totalContacts > 0) {
    strengths.push("Post-contact debriefs routinely completed — supporting emotional processing");
  }
  if (pc.frequencyMetRate >= 90 && pc.totalPlans > 0) {
    strengths.push("Contact frequency plans consistently met — maintaining family relationships as planned");
  }
  if (pc.childCentredRate >= 90 && pc.totalPlans > 0) {
    strengths.push("Contact plans are child-centred — reflecting individual needs and wishes");
  }
  if (sc.frequencyMetRate >= 90 && sc.totalSiblingPairs > 0) {
    strengths.push("Sibling contact maintained at agreed frequency — preserving sibling bonds");
  }
  if (sc.totalSiblingPairs === 0) {
    strengths.push("No sibling contact gaps identified");
  }
  if (fe.reviewInvolvementRate >= 80 && fe.totalChildren > 0) {
    strengths.push("Families actively involved in reviews — promoting partnership working");
  }
  if (fe.culturalLinksRate >= 80 && fe.totalChildren > 0) {
    strengths.push("Cultural and identity links promoted through family contact");
  }

  return strengths;
}

function generateAreasForImprovement(
  cq: ContactQualityResult,
  pc: ContactPlanComplianceResult,
  sc: SiblingContactResult,
  fe: FamilyEngagementResult,
): string[] {
  const areas: string[] = [];

  if (cq.totalContacts === 0) {
    areas.push("No family contact records found — contact recording may need urgent attention");
  }
  if (cq.positiveOutcomeRate < 60 && cq.totalContacts > 0) {
    areas.push(`Only ${cq.positiveOutcomeRate}% of contacts have positive outcomes — review contact support arrangements`);
  }
  if (cq.childPreparedRate < 80 && cq.totalContacts > 0) {
    areas.push(`Children prepared for contact in only ${cq.childPreparedRate}% of cases — preparation reduces distress`);
  }
  if (cq.childViewsSoughtRate < 80 && cq.totalContacts > 0) {
    areas.push(`Child views sought before only ${cq.childViewsSoughtRate}% of contacts`);
  }
  if (cq.debriefRate < 70 && cq.totalContacts > 0) {
    areas.push(`Post-contact debriefs completed for only ${cq.debriefRate}% of contacts`);
  }
  if (pc.frequencyMetRate < 80 && pc.totalPlans > 0) {
    areas.push(`Contact frequency plans met for only ${pc.frequencyMetRate}% of arrangements`);
  }
  if (pc.childWantsMoreCount > 0) {
    areas.push(`${pc.childWantsMoreCount} child(ren) want more family contact than currently arranged`);
  }
  if (sc.frequencyMetRate < 80 && sc.totalSiblingPairs > 0) {
    areas.push(`Sibling contact frequency met for only ${sc.frequencyMetRate}% of sibling pairs`);
  }
  if (fe.reviewInvolvementRate < 60 && fe.totalChildren > 0) {
    areas.push(`Family involvement in reviews at only ${fe.reviewInvolvementRate}% — below expected standard`);
  }
  if (fe.relationshipsSupportedRate < 70 && fe.totalChildren > 0) {
    areas.push(`Family relationships actively supported for only ${fe.relationshipsSupportedRate}% of children`);
  }

  return areas;
}

function generateActions(
  cq: ContactQualityResult,
  pc: ContactPlanComplianceResult,
  sc: SiblingContactResult,
  fe: FamilyEngagementResult,
): string[] {
  const actions: string[] = [];

  if (cq.totalContacts === 0) {
    actions.push("URGENT: Establish family contact recording — Reg 8 requires promotion and monitoring of contact");
  }
  if (pc.childWantsMoreCount > 0) {
    actions.push("URGENT: Review contact plans for children wanting more contact — consider increasing frequency or exploring barriers");
  }
  if (cq.childViewsSoughtRate < 80 && cq.totalContacts > 0) {
    actions.push("Implement routine child-voice check before every contact session");
  }
  if (cq.childPreparedRate < 80 && cq.totalContacts > 0) {
    actions.push("Develop contact preparation protocol — age-appropriate preparation reduces anxiety");
  }
  if (cq.debriefRate < 80 && cq.totalContacts > 0) {
    actions.push("Ensure post-contact debriefs are conducted after every family contact");
  }
  if (pc.frequencyMetRate < 80 && pc.totalPlans > 0) {
    actions.push("Audit contact plan adherence and address barriers to meeting agreed frequency");
  }
  if (sc.frequencyMetRate < 80 && sc.totalSiblingPairs > 0) {
    actions.push("Prioritise sibling contact — UNCRC Article 9 protects the right to maintain family bonds");
  }
  if (fe.reviewInvolvementRate < 60 && fe.totalChildren > 0) {
    actions.push("Actively invite and support family attendance at reviews — remove barriers to participation");
  }
  if (fe.culturalLinksRate < 60 && fe.totalChildren > 0) {
    actions.push("Strengthen cultural identity links through family contact and community engagement");
  }
  if (fe.familyConferencingRate < 25 && fe.totalChildren > 0) {
    actions.push("Consider family group conferencing to improve family involvement in decision-making");
  }

  return actions;
}

// -- Main Function ------------------------------------------------------------

export function generateFamilyContactQualityIntelligence(
  records: ContactRecord[],
  plans: ContactPlan[],
  siblings: SiblingContact[],
  engagements: FamilyEngagement[],
  homeId: string,
  periodStart: string,
  periodEnd: string,
): FamilyContactQualityIntelligence {
  const contactQuality = evaluateContactQuality(records);
  const planCompliance = evaluateContactPlanCompliance(plans);
  const siblingContact = evaluateSiblingContact(siblings);
  const familyEngagement = evaluateFamilyEngagement(engagements);

  const overallScore = Math.min(
    contactQuality.overallScore +
    planCompliance.overallScore +
    siblingContact.overallScore +
    familyEngagement.overallScore,
    100,
  );

  const childProfiles = buildChildContactProfiles(records, plans, siblings, engagements);
  const strengths = generateStrengths(contactQuality, planCompliance, siblingContact, familyEngagement);
  const areasForImprovement = generateAreasForImprovement(contactQuality, planCompliance, siblingContact, familyEngagement);
  const actions = generateActions(contactQuality, planCompliance, siblingContact, familyEngagement);

  const regulatoryLinks = [
    "CHR 2015 Reg 8 — promotion of contact between child and family members",
    "CA 1989 s34 — contact with children in care and parental contact rights",
    "CA 1989 Schedule 2 Para 15 — promotion and maintenance of contact",
    "UNCRC Article 9 — right to maintain contact with parents when separated",
    "SCCIF — experiences and progress of children, quality of family contact",
    "NMS 10 — maintaining and promoting contact with family and friends",
    "Working Together 2023 — family involvement in care planning and review",
    "NICE CG89 — when children are removed from their families",
  ];

  return {
    homeId,
    periodStart,
    periodEnd,
    overallScore,
    rating: getRating(overallScore),
    contactQuality,
    planCompliance,
    siblingContact,
    familyEngagement,
    childProfiles,
    strengths,
    areasForImprovement,
    actions,
    regulatoryLinks,
  };
}
