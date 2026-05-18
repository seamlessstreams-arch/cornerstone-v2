import { describe, it, expect } from "vitest";
import {
  evaluateContactQuality,
  evaluateContactPlanCompliance,
  evaluateSiblingContact,
  evaluateFamilyEngagement,
  buildChildContactProfiles,
  generateFamilyContactQualityIntelligence,
  getRating,
  getContactTypeLabel,
  getContactOutcomeLabel,
  getContactFrequencyLabel,
  getSupervisionLevelLabel,
  getFamilyMemberLabel,
  getChildViewLabel,
} from "../family-contact-quality-engine";
import type {
  ContactRecord,
  ContactPlan,
  SiblingContact,
  FamilyEngagement,
} from "../family-contact-quality-engine";

// ── Demo Data ───────────────────────────────────────────────────────────────

const CONTACT_ALEX_MUM: ContactRecord = {
  id: "cr-a1", childId: "child-alex", childName: "Alex",
  familyMember: "mother", familyMemberName: "Sarah",
  contactType: "face_to_face", contactDate: "2026-05-10",
  supervisionLevel: "unsupervised", outcome: "positive",
  durationMinutes: 120, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: true,
  debriefAfterContact: true, impactOnChild: "Very happy after visit",
};

const CONTACT_ALEX_DAD: ContactRecord = {
  id: "cr-a2", childId: "child-alex", childName: "Alex",
  familyMember: "father", familyMemberName: "Mark",
  contactType: "video_call", contactDate: "2026-05-12",
  supervisionLevel: "light_touch", outcome: "mostly_positive",
  durationMinutes: 45, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: true,
  debriefAfterContact: true, impactOnChild: "Good conversation",
};

const CONTACT_JORDAN_MUM: ContactRecord = {
  id: "cr-j1", childId: "child-jordan", childName: "Jordan",
  familyMember: "mother", familyMemberName: "Claire",
  contactType: "supervised_visit", contactDate: "2026-05-08",
  supervisionLevel: "supervised", outcome: "mixed",
  durationMinutes: 60, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: false,
  debriefAfterContact: true, impactOnChild: "Upset after visit",
};

const CONTACT_JORDAN_SIBLING: ContactRecord = {
  id: "cr-j2", childId: "child-jordan", childName: "Jordan",
  familyMember: "sibling", familyMemberName: "Jamie",
  contactType: "family_activity", contactDate: "2026-05-14",
  supervisionLevel: "light_touch", outcome: "positive",
  durationMinutes: 180, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: true,
  debriefAfterContact: true, impactOnChild: "Great day out with Jamie",
};

const CONTACT_MORGAN_GRAN: ContactRecord = {
  id: "cr-m1", childId: "child-morgan", childName: "Morgan",
  familyMember: "grandparent", familyMemberName: "Nana Pat",
  contactType: "face_to_face", contactDate: "2026-05-11",
  supervisionLevel: "unsupervised", outcome: "positive",
  durationMinutes: 90, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: true,
  debriefAfterContact: true, impactOnChild: "Loved visiting Nana",
};

const CONTACT_MORGAN_DAD: ContactRecord = {
  id: "cr-m2", childId: "child-morgan", childName: "Morgan",
  familyMember: "father", familyMemberName: "Dave",
  contactType: "telephone", contactDate: "2026-05-15",
  supervisionLevel: "unsupervised", outcome: "positive",
  durationMinutes: 30, childPreparedForContact: true,
  childViewsSought: true, childEnjoyedContact: true,
  debriefAfterContact: true, impactOnChild: "Good chat",
};

const ALL_CONTACTS = [CONTACT_ALEX_MUM, CONTACT_ALEX_DAD, CONTACT_JORDAN_MUM, CONTACT_JORDAN_SIBLING, CONTACT_MORGAN_GRAN, CONTACT_MORGAN_DAD];

const PLAN_ALEX_MUM: ContactPlan = {
  id: "cp-a1", childId: "child-alex", childName: "Alex",
  familyMember: "mother", familyMemberName: "Sarah",
  agreedFrequency: "weekly", actualFrequencyMet: true,
  childViewOnContact: "happy_with_current", courtOrderInPlace: false,
  lastReviewedDate: "2026-04-15", reviewedBy: "Sarah Johnson",
  planIsChildCentred: true,
};

const PLAN_JORDAN_MUM: ContactPlan = {
  id: "cp-j1", childId: "child-jordan", childName: "Jordan",
  familyMember: "mother", familyMemberName: "Claire",
  agreedFrequency: "fortnightly", actualFrequencyMet: true,
  childViewOnContact: "wants_more", courtOrderInPlace: true,
  contactConditions: "Supervised due to court order",
  lastReviewedDate: "2026-05-01", reviewedBy: "Tom Richards",
  planIsChildCentred: true,
};

const PLAN_MORGAN_GRAN: ContactPlan = {
  id: "cp-m1", childId: "child-morgan", childName: "Morgan",
  familyMember: "grandparent", familyMemberName: "Nana Pat",
  agreedFrequency: "weekly", actualFrequencyMet: true,
  childViewOnContact: "happy_with_current", courtOrderInPlace: false,
  lastReviewedDate: "2026-04-20", reviewedBy: "Lisa Williams",
  planIsChildCentred: true,
};

const ALL_PLANS = [PLAN_ALEX_MUM, PLAN_JORDAN_MUM, PLAN_MORGAN_GRAN];

const SIBLING_JORDAN_JAMIE: SiblingContact = {
  id: "sc-j1", childId: "child-jordan", childName: "Jordan",
  siblingId: "child-jamie", siblingName: "Jamie",
  siblingPlacement: "Foster care with Smith family",
  contactFrequency: "fortnightly", frequencyMet: true,
  lastContactDate: "2026-05-14", qualityRating: "positive",
};

const SIBLING_MORGAN_LEIGH: SiblingContact = {
  id: "sc-m1", childId: "child-morgan", childName: "Morgan",
  siblingId: "child-leigh", siblingName: "Leigh",
  siblingPlacement: "With birth mother",
  contactFrequency: "monthly", frequencyMet: true,
  lastContactDate: "2026-05-01", qualityRating: "mostly_positive",
};

const ALL_SIBLINGS = [SIBLING_JORDAN_JAMIE, SIBLING_MORGAN_LEIGH];

const ENGAGEMENT_ALEX: FamilyEngagement = {
  id: "fe-a", childId: "child-alex", childName: "Alex",
  familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true,
  familyRelationshipsSupported: true, culturalLinksPromoted: true,
  familyGroupConferencing: false, lifestoryWorkIncludesFamily: true,
};

const ENGAGEMENT_JORDAN: FamilyEngagement = {
  id: "fe-j", childId: "child-jordan", childName: "Jordan",
  familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true,
  familyRelationshipsSupported: true, culturalLinksPromoted: false,
  familyGroupConferencing: true, lifestoryWorkIncludesFamily: true,
};

const ENGAGEMENT_MORGAN: FamilyEngagement = {
  id: "fe-m", childId: "child-morgan", childName: "Morgan",
  familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true,
  familyRelationshipsSupported: true, culturalLinksPromoted: true,
  familyGroupConferencing: false, lifestoryWorkIncludesFamily: true,
};

const ALL_ENGAGEMENTS = [ENGAGEMENT_ALEX, ENGAGEMENT_JORDAN, ENGAGEMENT_MORGAN];

// ── Label Tests ─────────────────────────────────────────────────────────────

describe("label functions", () => {
  it("getContactTypeLabel returns correct labels", () => {
    expect(getContactTypeLabel("face_to_face")).toBe("Face to Face");
    expect(getContactTypeLabel("video_call")).toBe("Video Call");
    expect(getContactTypeLabel("supervised_visit")).toBe("Supervised Visit");
    expect(getContactTypeLabel("overnight_stay")).toBe("Overnight Stay");
    expect(getContactTypeLabel("sibling_contact")).toBe("Sibling Contact");
    expect(getContactTypeLabel("family_activity")).toBe("Family Activity");
    expect(getContactTypeLabel("telephone")).toBe("Telephone");
    expect(getContactTypeLabel("letter")).toBe("Letter");
    expect(getContactTypeLabel("unsupervised_visit")).toBe("Unsupervised Visit");
  });

  it("getContactOutcomeLabel returns correct labels", () => {
    expect(getContactOutcomeLabel("positive")).toBe("Positive");
    expect(getContactOutcomeLabel("mostly_positive")).toBe("Mostly Positive");
    expect(getContactOutcomeLabel("mixed")).toBe("Mixed");
    expect(getContactOutcomeLabel("difficult")).toBe("Difficult");
    expect(getContactOutcomeLabel("distressing")).toBe("Distressing");
    expect(getContactOutcomeLabel("did_not_occur")).toBe("Did Not Occur");
  });

  it("getContactFrequencyLabel returns correct labels", () => {
    expect(getContactFrequencyLabel("more_than_weekly")).toBe("More Than Weekly");
    expect(getContactFrequencyLabel("weekly")).toBe("Weekly");
    expect(getContactFrequencyLabel("fortnightly")).toBe("Fortnightly");
    expect(getContactFrequencyLabel("monthly")).toBe("Monthly");
    expect(getContactFrequencyLabel("less_than_monthly")).toBe("Less Than Monthly");
    expect(getContactFrequencyLabel("no_contact")).toBe("No Contact");
  });

  it("getSupervisionLevelLabel returns correct labels", () => {
    expect(getSupervisionLevelLabel("unsupervised")).toBe("Unsupervised");
    expect(getSupervisionLevelLabel("light_touch")).toBe("Light Touch");
    expect(getSupervisionLevelLabel("supervised")).toBe("Supervised");
    expect(getSupervisionLevelLabel("closely_supervised")).toBe("Closely Supervised");
    expect(getSupervisionLevelLabel("suspended")).toBe("Suspended");
  });

  it("getFamilyMemberLabel returns correct labels", () => {
    expect(getFamilyMemberLabel("mother")).toBe("Mother");
    expect(getFamilyMemberLabel("father")).toBe("Father");
    expect(getFamilyMemberLabel("sibling")).toBe("Sibling");
    expect(getFamilyMemberLabel("grandparent")).toBe("Grandparent");
    expect(getFamilyMemberLabel("aunt_uncle")).toBe("Aunt/Uncle");
    expect(getFamilyMemberLabel("other_relative")).toBe("Other Relative");
    expect(getFamilyMemberLabel("significant_other")).toBe("Significant Other");
  });

  it("getChildViewLabel returns correct labels", () => {
    expect(getChildViewLabel("wants_more")).toBe("Wants More Contact");
    expect(getChildViewLabel("happy_with_current")).toBe("Happy With Current");
    expect(getChildViewLabel("wants_less")).toBe("Wants Less Contact");
    expect(getChildViewLabel("does_not_want")).toBe("Does Not Want Contact");
    expect(getChildViewLabel("not_recorded")).toBe("Not Recorded");
  });
});

// ── getRating ───────────────────────────────────────────────────────────────

describe("getRating", () => {
  it("returns outstanding >= 80", () => {
    expect(getRating(80)).toBe("outstanding");
    expect(getRating(100)).toBe("outstanding");
  });
  it("returns good >= 60", () => {
    expect(getRating(60)).toBe("good");
    expect(getRating(79)).toBe("good");
  });
  it("returns requires_improvement >= 40", () => {
    expect(getRating(40)).toBe("requires_improvement");
    expect(getRating(59)).toBe("requires_improvement");
  });
  it("returns inadequate < 40", () => {
    expect(getRating(0)).toBe("inadequate");
    expect(getRating(39)).toBe("inadequate");
  });
});

// ── evaluateContactQuality ──────────────────────────────────────────────────

describe("evaluateContactQuality", () => {
  it("returns 0 score for empty records", () => {
    const r = evaluateContactQuality([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalContacts).toBe(0);
    expect(r.positiveOutcomeRate).toBe(0);
    expect(r.childPreparedRate).toBe(0);
    expect(r.childViewsSoughtRate).toBe(0);
    expect(r.childEnjoyedRate).toBe(0);
    expect(r.debriefRate).toBe(0);
    expect(r.averageDurationMinutes).toBe(0);
  });

  it("scores high for all positive contacts", () => {
    const r = evaluateContactQuality(ALL_CONTACTS);
    expect(r.totalContacts).toBe(6);
    // 5/6 positive/mostly_positive (Jordan mum is mixed)
    expect(r.positiveOutcomeRate).toBe(83);
    expect(r.childPreparedRate).toBe(100);
    expect(r.childViewsSoughtRate).toBe(100);
    expect(r.debriefRate).toBe(100);
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("counts did_not_occur as not occurred", () => {
    const didNotOccur: ContactRecord = {
      ...CONTACT_ALEX_MUM, id: "cr-dno", outcome: "did_not_occur",
      childEnjoyedContact: false, debriefAfterContact: false,
    };
    const r = evaluateContactQuality([CONTACT_ALEX_MUM, didNotOccur]);
    expect(r.totalContacts).toBe(2);
    // Only 1 occurred, so rates are based on 1
    expect(r.positiveOutcomeRate).toBe(100);
    // But prepared/views sought based on total (2)
    expect(r.childPreparedRate).toBe(100);
  });

  it("calculates average duration for occurred contacts", () => {
    const r = evaluateContactQuality([CONTACT_ALEX_MUM, CONTACT_ALEX_DAD]);
    // (120 + 45) / 2 = 82.5, rounded = 83
    expect(r.averageDurationMinutes).toBe(83);
  });

  it("counts contacts by type", () => {
    const r = evaluateContactQuality(ALL_CONTACTS);
    expect(r.contactsByType["face_to_face"]).toBe(2);
    expect(r.contactsByType["video_call"]).toBe(1);
    expect(r.contactsByType["supervised_visit"]).toBe(1);
    expect(r.contactsByType["family_activity"]).toBe(1);
    expect(r.contactsByType["telephone"]).toBe(1);
  });

  it("gives variety bonus for 4+ contact types", () => {
    const r = evaluateContactQuality(ALL_CONTACTS);
    // 5 different types -> +2 variety bonus
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("low enjoyment reduces score", () => {
    const bad: ContactRecord = {
      ...CONTACT_ALEX_MUM, id: "cr-bad", outcome: "difficult",
      childEnjoyedContact: false, childPreparedForContact: false,
      childViewsSought: false, debriefAfterContact: false,
    };
    const r = evaluateContactQuality([bad]);
    expect(r.positiveOutcomeRate).toBe(0);
    expect(r.childEnjoyedRate).toBe(0);
    expect(r.overallScore).toBeLessThan(5);
  });

  it("score capped at 25", () => {
    const r = evaluateContactQuality(ALL_CONTACTS);
    expect(r.overallScore).toBeLessThanOrEqual(25);
  });

  it("single contact with all positive indicators", () => {
    const r = evaluateContactQuality([CONTACT_ALEX_MUM]);
    expect(r.positiveOutcomeRate).toBe(100);
    expect(r.childPreparedRate).toBe(100);
    expect(r.childViewsSoughtRate).toBe(100);
    expect(r.childEnjoyedRate).toBe(100);
    expect(r.debriefRate).toBe(100);
    // Only 1 type so +1 variety
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("multiple distressing contacts score poorly", () => {
    const distressing: ContactRecord = {
      ...CONTACT_ALEX_MUM, id: "cr-dist", outcome: "distressing",
      childEnjoyedContact: false, childPreparedForContact: false,
      childViewsSought: false, debriefAfterContact: false,
    };
    const r = evaluateContactQuality([distressing, { ...distressing, id: "cr-dist2" }]);
    expect(r.positiveOutcomeRate).toBe(0);
    expect(r.overallScore).toBeLessThan(5);
  });
});

// ── evaluateContactPlanCompliance ───────────────────────────────────────────

describe("evaluateContactPlanCompliance", () => {
  it("returns 0 for empty plans", () => {
    const r = evaluateContactPlanCompliance([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalPlans).toBe(0);
    expect(r.frequencyMetRate).toBe(0);
    expect(r.childCentredRate).toBe(0);
  });

  it("scores well for plans meeting frequency", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    expect(r.totalPlans).toBe(3);
    expect(r.frequencyMetRate).toBe(100);
    expect(r.childCentredRate).toBe(100);
  });

  it("deducts for children wanting more contact", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    // Jordan wants more => -1 penalty
    expect(r.childWantsMoreCount).toBe(1);
  });

  it("counts happy children", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    expect(r.childHappyCount).toBe(2); // Alex and Morgan
  });

  it("counts court orders", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    expect(r.courtOrderCount).toBe(1); // Jordan
  });

  it("score capped at 25", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    expect(r.overallScore).toBeLessThanOrEqual(25);
  });

  it("low frequency met rate reduces score", () => {
    const notMet: ContactPlan = {
      ...PLAN_ALEX_MUM, id: "cp-nm", actualFrequencyMet: false,
      planIsChildCentred: false, childViewOnContact: "not_recorded",
    };
    const r = evaluateContactPlanCompliance([notMet]);
    expect(r.frequencyMetRate).toBe(0);
    expect(r.childCentredRate).toBe(0);
    expect(r.overallScore).toBeLessThan(5);
  });

  it("multiple children wanting more applies higher penalty", () => {
    const wantsMore: ContactPlan = {
      ...PLAN_ALEX_MUM, id: "cp-wm", childViewOnContact: "wants_more",
    };
    const r = evaluateContactPlanCompliance([PLAN_JORDAN_MUM, wantsMore]);
    expect(r.childWantsMoreCount).toBe(2);
  });

  it("recently reviewed calculated from current date", () => {
    const r = evaluateContactPlanCompliance(ALL_PLANS);
    // All plans reviewed within last 90 days
    expect(r.recentlyReviewedRate).toBeGreaterThan(0);
  });

  it("all not child-centred reduces score significantly", () => {
    const notCentred: ContactPlan = {
      ...PLAN_ALEX_MUM, id: "cp-nc", planIsChildCentred: false,
      childViewOnContact: "not_recorded",
    };
    const r = evaluateContactPlanCompliance([notCentred]);
    expect(r.childCentredRate).toBe(0);
    expect(r.overallScore).toBeLessThan(15);
  });

  it("score cannot go below 0 from penalties", () => {
    const wm1: ContactPlan = { ...PLAN_ALEX_MUM, id: "wm1", childViewOnContact: "wants_more", actualFrequencyMet: false, planIsChildCentred: false };
    const wm2: ContactPlan = { ...PLAN_ALEX_MUM, id: "wm2", childViewOnContact: "wants_more", actualFrequencyMet: false, planIsChildCentred: false };
    const wm3: ContactPlan = { ...PLAN_ALEX_MUM, id: "wm3", childViewOnContact: "wants_more", actualFrequencyMet: false, planIsChildCentred: false };
    const r = evaluateContactPlanCompliance([wm1, wm2, wm3]);
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
  });
});

// ── evaluateSiblingContact ──────────────────────────────────────────────────

describe("evaluateSiblingContact", () => {
  it("returns 25 for empty siblings (no gaps)", () => {
    const r = evaluateSiblingContact([]);
    expect(r.overallScore).toBe(25);
    expect(r.totalSiblingPairs).toBe(0);
    expect(r.frequencyMetRate).toBe(100);
    expect(r.positiveQualityRate).toBe(100);
  });

  it("scores well for all frequency met and positive", () => {
    const r = evaluateSiblingContact(ALL_SIBLINGS);
    expect(r.totalSiblingPairs).toBe(2);
    expect(r.frequencyMetRate).toBe(100);
    expect(r.positiveQualityRate).toBe(100);
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("calculates average contact gap", () => {
    const r = evaluateSiblingContact(ALL_SIBLINGS);
    expect(r.averageContactGapDays).toBeGreaterThan(0);
  });

  it("not met frequency reduces score", () => {
    const notMet: SiblingContact = {
      ...SIBLING_JORDAN_JAMIE, frequencyMet: false, qualityRating: "difficult",
      lastContactDate: "2026-01-01",
    };
    const r = evaluateSiblingContact([notMet]);
    expect(r.frequencyMetRate).toBe(0);
    expect(r.positiveQualityRate).toBe(0);
    expect(r.overallScore).toBeLessThan(10);
  });

  it("score capped at 25", () => {
    const r = evaluateSiblingContact(ALL_SIBLINGS);
    expect(r.overallScore).toBeLessThanOrEqual(25);
  });

  it("mixed quality ratings produce correct rate", () => {
    const bad: SiblingContact = {
      ...SIBLING_JORDAN_JAMIE, id: "sc-bad", qualityRating: "difficult",
    };
    const r = evaluateSiblingContact([SIBLING_JORDAN_JAMIE, bad]);
    expect(r.positiveQualityRate).toBe(50);
  });

  it("all frequency met gives bonus", () => {
    const r = evaluateSiblingContact(ALL_SIBLINGS);
    // 100% met = +5 bonus
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });
});

// ── evaluateFamilyEngagement ────────────────────────────────────────────────

describe("evaluateFamilyEngagement", () => {
  it("returns 0 for empty engagements", () => {
    const r = evaluateFamilyEngagement([]);
    expect(r.overallScore).toBe(0);
    expect(r.totalChildren).toBe(0);
    expect(r.reviewInvolvementRate).toBe(0);
    expect(r.carePlanningRate).toBe(0);
    expect(r.relationshipsSupportedRate).toBe(0);
  });

  it("scores well for full engagement", () => {
    const r = evaluateFamilyEngagement(ALL_ENGAGEMENTS);
    expect(r.totalChildren).toBe(3);
    expect(r.reviewInvolvementRate).toBe(100);
    expect(r.carePlanningRate).toBe(100);
    expect(r.relationshipsSupportedRate).toBe(100);
    expect(r.lifestoryRate).toBe(100);
    expect(r.overallScore).toBeGreaterThanOrEqual(20);
  });

  it("cultural links rate calculated correctly", () => {
    const r = evaluateFamilyEngagement(ALL_ENGAGEMENTS);
    // Alex yes, Jordan no, Morgan yes = 67%
    expect(r.culturalLinksRate).toBe(67);
  });

  it("conferencing rate calculated correctly", () => {
    const r = evaluateFamilyEngagement(ALL_ENGAGEMENTS);
    // Only Jordan has conferencing = 33%
    expect(r.familyConferencingRate).toBe(33);
  });

  it("no engagement at all scores 0", () => {
    const noEngagement: FamilyEngagement = {
      id: "fe-none", childId: "child-test", childName: "Test",
      familyInvolvedInReviews: false, familyInvolvedInCarePlanning: false,
      familyRelationshipsSupported: false, culturalLinksPromoted: false,
      familyGroupConferencing: false, lifestoryWorkIncludesFamily: false,
    };
    const r = evaluateFamilyEngagement([noEngagement]);
    expect(r.overallScore).toBe(0);
  });

  it("score capped at 25", () => {
    const r = evaluateFamilyEngagement(ALL_ENGAGEMENTS);
    expect(r.overallScore).toBeLessThanOrEqual(25);
  });

  it("partial engagement produces mid-range score", () => {
    const partial: FamilyEngagement = {
      id: "fe-p", childId: "child-test", childName: "Test",
      familyInvolvedInReviews: true, familyInvolvedInCarePlanning: false,
      familyRelationshipsSupported: true, culturalLinksPromoted: false,
      familyGroupConferencing: false, lifestoryWorkIncludesFamily: false,
    };
    const r = evaluateFamilyEngagement([partial]);
    expect(r.overallScore).toBeGreaterThan(0);
    expect(r.overallScore).toBeLessThan(20);
  });
});

// ── buildChildContactProfiles ───────────────────────────────────────────────

describe("buildChildContactProfiles", () => {
  it("builds profiles for all children", () => {
    const profiles = buildChildContactProfiles(ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS);
    expect(profiles.length).toBe(3);
  });

  it("Alex profile has correct data", () => {
    const profiles = buildChildContactProfiles(ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS);
    const alex = profiles.find((p) => p.childId === "child-alex");
    expect(alex).toBeDefined();
    expect(alex!.childName).toBe("Alex");
    expect(alex!.totalContacts).toBe(2);
    expect(alex!.positiveRate).toBe(100);
    expect(alex!.childViewOnContact).toBe("happy_with_current");
    expect(alex!.familyEngaged).toBe(true);
  });

  it("Jordan profile reflects mixed outcomes", () => {
    const profiles = buildChildContactProfiles(ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS);
    const jordan = profiles.find((p) => p.childId === "child-jordan");
    expect(jordan).toBeDefined();
    expect(jordan!.totalContacts).toBe(2);
    // 1 positive, 1 mixed = 50%
    expect(jordan!.positiveRate).toBe(50);
    expect(jordan!.childViewOnContact).toBe("wants_more");
    expect(jordan!.siblingContactMet).toBe(true);
  });

  it("profile score clamped between 0-10", () => {
    const profiles = buildChildContactProfiles(ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS);
    profiles.forEach((p) => {
      expect(p.overallScore).toBeGreaterThanOrEqual(0);
      expect(p.overallScore).toBeLessThanOrEqual(10);
    });
  });

  it("child with no contacts gets penalty", () => {
    const noContactPlan: ContactPlan = {
      ...PLAN_ALEX_MUM, childId: "child-none", childName: "NoContact",
      childViewOnContact: "not_recorded",
    };
    const profiles = buildChildContactProfiles([], [noContactPlan], [], []);
    const noContact = profiles.find((p) => p.childId === "child-none");
    expect(noContact!.totalContacts).toBe(0);
    expect(noContact!.overallScore).toBeLessThan(5);
  });

  it("child with no siblings has sibling contact met as true", () => {
    const profiles = buildChildContactProfiles(ALL_CONTACTS, ALL_PLANS, [], ALL_ENGAGEMENTS);
    const alex = profiles.find((p) => p.childId === "child-alex");
    // Alex has no siblings in data -> vacuously true
    expect(alex!.siblingContactMet).toBe(true);
  });
});

// ── generateFamilyContactQualityIntelligence ────────────────────────────────

describe("generateFamilyContactQualityIntelligence", () => {
  it("returns complete structure", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result).toHaveProperty("homeId", "oak-house");
    expect(result).toHaveProperty("periodStart", "2026-01-01");
    expect(result).toHaveProperty("periodEnd", "2026-05-18");
    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("rating");
    expect(result).toHaveProperty("contactQuality");
    expect(result).toHaveProperty("planCompliance");
    expect(result).toHaveProperty("siblingContact");
    expect(result).toHaveProperty("familyEngagement");
    expect(result).toHaveProperty("childProfiles");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("areasForImprovement");
    expect(result).toHaveProperty("actions");
    expect(result).toHaveProperty("regulatoryLinks");
  });

  it("overall score is sum of 4 components", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    const expected = result.contactQuality.overallScore +
      result.planCompliance.overallScore +
      result.siblingContact.overallScore +
      result.familyEngagement.overallScore;
    expect(result.overallScore).toBe(Math.min(expected, 100));
  });

  it("empty data produces low score (no contacts recorded)", () => {
    const result = generateFamilyContactQualityIntelligence(
      [], [], [], [],
      "oak-house", "2026-01-01", "2026-05-18",
    );
    // empty contacts=0, plans=0, siblings=25, engagements=0 = 25
    expect(result.overallScore).toBe(25);
    expect(result.rating).toBe("inadequate");
  });

  it("demo data produces good or outstanding rating", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(["good", "outstanding"]).toContain(result.rating);
  });

  it("includes regulatory links", () => {
    const result = generateFamilyContactQualityIntelligence(
      [], [], [], [],
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.regulatoryLinks.length).toBeGreaterThan(0);
    expect(result.regulatoryLinks.some((l) => l.includes("CHR 2015 Reg 8"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("UNCRC Article 9"))).toBe(true);
    expect(result.regulatoryLinks.some((l) => l.includes("CA 1989 s34"))).toBe(true);
  });

  it("generates strengths for good practice", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("generates areas when children want more contact", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    // Jordan wants more contact
    expect(result.areasForImprovement.some((a) => a.includes("want more"))).toBe(true);
  });

  it("generates URGENT action when no contacts recorded", () => {
    const result = generateFamilyContactQualityIntelligence(
      [], ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.actions.some((a) => a.startsWith("URGENT"))).toBe(true);
  });

  it("generates URGENT action when children want more", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.actions.some((a) => a.includes("wanting more contact"))).toBe(true);
  });

  it("score capped at 100", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("positive contact strengths mention UNCRC", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.strengths.some((s) => s.includes("UNCRC"))).toBe(true);
  });

  it("sibling contact strength mentions bonds", () => {
    const result = generateFamilyContactQualityIntelligence(
      ALL_CONTACTS, ALL_PLANS, ALL_SIBLINGS, ALL_ENGAGEMENTS,
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.strengths.some((s) => s.includes("sibling bonds") || s.includes("Sibling"))).toBe(true);
  });
});

// ── Edge cases ──────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("all contacts distressing produces low score", () => {
    const distressing: ContactRecord = {
      ...CONTACT_ALEX_MUM, id: "cr-d", outcome: "distressing",
      childEnjoyedContact: false, childPreparedForContact: false,
      childViewsSought: false, debriefAfterContact: false,
    };
    const r = evaluateContactQuality([distressing, { ...distressing, id: "cr-d2" }]);
    expect(r.overallScore).toBeLessThan(5);
  });

  it("all plans not met with children wanting more", () => {
    const bad: ContactPlan = {
      ...PLAN_ALEX_MUM, id: "cp-b", actualFrequencyMet: false,
      planIsChildCentred: false, childViewOnContact: "wants_more",
    };
    const r = evaluateContactPlanCompliance([bad, { ...bad, id: "cp-b2" }, { ...bad, id: "cp-b3" }]);
    // Recently reviewed gives some points, but penalty for 3 children wanting more (-3)
    expect(r.overallScore).toBeLessThan(5);
  });

  it("no siblings means max sibling score", () => {
    const r = evaluateSiblingContact([]);
    expect(r.overallScore).toBe(25);
  });

  it("all sibling contact failed", () => {
    const failed: SiblingContact = {
      ...SIBLING_JORDAN_JAMIE, frequencyMet: false, qualityRating: "did_not_occur",
      lastContactDate: "2025-01-01",
    };
    const r = evaluateSiblingContact([failed]);
    expect(r.frequencyMetRate).toBe(0);
    expect(r.overallScore).toBeLessThan(10);
  });

  it("full intelligence with all poor data", () => {
    const badContact: ContactRecord = {
      ...CONTACT_ALEX_MUM, id: "cr-bad", outcome: "distressing",
      childEnjoyedContact: false, childPreparedForContact: false,
      childViewsSought: false, debriefAfterContact: false,
    };
    const badPlan: ContactPlan = {
      ...PLAN_ALEX_MUM, id: "cp-bad", actualFrequencyMet: false,
      planIsChildCentred: false, childViewOnContact: "wants_more",
    };
    const badSibling: SiblingContact = {
      ...SIBLING_JORDAN_JAMIE, frequencyMet: false, qualityRating: "distressing",
      lastContactDate: "2025-01-01",
    };
    const badEngagement: FamilyEngagement = {
      id: "fe-bad", childId: "child-test", childName: "Test",
      familyInvolvedInReviews: false, familyInvolvedInCarePlanning: false,
      familyRelationshipsSupported: false, culturalLinksPromoted: false,
      familyGroupConferencing: false, lifestoryWorkIncludesFamily: false,
    };
    const result = generateFamilyContactQualityIntelligence(
      [badContact], [badPlan], [badSibling], [badEngagement],
      "oak-house", "2026-01-01", "2026-05-18",
    );
    expect(result.rating).toBe("inadequate");
    expect(result.overallScore).toBeLessThan(20);
  });
});
