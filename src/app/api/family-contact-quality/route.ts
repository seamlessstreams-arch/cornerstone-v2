// ==============================================================================
// API: /api/family-contact-quality
//
// Family Contact Quality Intelligence
//
// GET  — Returns family contact assessment with Oak House demo data
// POST — Accepts custom data and returns tailored assessment
// ==============================================================================

import { NextResponse } from "next/server";
import {
  generateFamilyContactQualityIntelligence,
  getContactTypeLabel,
  getContactOutcomeLabel,
  getContactFrequencyLabel,
  getSupervisionLevelLabel,
  getFamilyMemberLabel,
  getChildViewLabel,
} from "@/lib/family-contact-quality";
import type {
  ContactRecord,
  ContactPlan,
  SiblingContact,
  FamilyEngagement,
} from "@/lib/family-contact-quality";

// -- Demo Data: Oak House -------------------------------------------------------

const DEMO_CONTACTS: ContactRecord[] = [
  { id: "cr-a1", childId: "child-alex", childName: "Alex", familyMember: "mother", familyMemberName: "Sarah M", contactType: "face_to_face", contactDate: "2026-05-10", supervisionLevel: "unsupervised", outcome: "positive", durationMinutes: 120, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Very happy after visit", staffFacilitator: "Sarah Johnson" },
  { id: "cr-a2", childId: "child-alex", childName: "Alex", familyMember: "father", familyMemberName: "Mark", contactType: "video_call", contactDate: "2026-05-12", supervisionLevel: "light_touch", outcome: "mostly_positive", durationMinutes: 45, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Good conversation" },
  { id: "cr-a3", childId: "child-alex", childName: "Alex", familyMember: "grandparent", familyMemberName: "Nan", contactType: "telephone", contactDate: "2026-05-15", supervisionLevel: "unsupervised", outcome: "positive", durationMinutes: 30, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Chatty and cheerful" },
  { id: "cr-j1", childId: "child-jordan", childName: "Jordan", familyMember: "mother", familyMemberName: "Claire", contactType: "supervised_visit", contactDate: "2026-05-08", supervisionLevel: "supervised", outcome: "mixed", durationMinutes: 60, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: false, debriefAfterContact: true, impactOnChild: "Unsettled after visit", staffFacilitator: "Tom Richards" },
  { id: "cr-j2", childId: "child-jordan", childName: "Jordan", familyMember: "sibling", familyMemberName: "Jamie", contactType: "family_activity", contactDate: "2026-05-14", supervisionLevel: "light_touch", outcome: "positive", durationMinutes: 180, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Great day out with Jamie" },
  { id: "cr-m1", childId: "child-morgan", childName: "Morgan", familyMember: "grandparent", familyMemberName: "Nana Pat", contactType: "face_to_face", contactDate: "2026-05-11", supervisionLevel: "unsupervised", outcome: "positive", durationMinutes: 90, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Loved visiting Nana", staffFacilitator: "Lisa Williams" },
  { id: "cr-m2", childId: "child-morgan", childName: "Morgan", familyMember: "father", familyMemberName: "Dave", contactType: "telephone", contactDate: "2026-05-15", supervisionLevel: "unsupervised", outcome: "positive", durationMinutes: 30, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Good chat" },
  { id: "cr-m3", childId: "child-morgan", childName: "Morgan", familyMember: "aunt_uncle", familyMemberName: "Auntie Sue", contactType: "unsupervised_visit", contactDate: "2026-05-16", supervisionLevel: "unsupervised", outcome: "mostly_positive", durationMinutes: 150, childPreparedForContact: true, childViewsSought: true, childEnjoyedContact: true, debriefAfterContact: true, impactOnChild: "Enjoyed cooking together" },
];

const DEMO_PLANS: ContactPlan[] = [
  { id: "cp-a1", childId: "child-alex", childName: "Alex", familyMember: "mother", familyMemberName: "Sarah M", agreedFrequency: "weekly", actualFrequencyMet: true, childViewOnContact: "happy_with_current", courtOrderInPlace: false, lastReviewedDate: "2026-04-15", reviewedBy: "Sarah Johnson", planIsChildCentred: true },
  { id: "cp-a2", childId: "child-alex", childName: "Alex", familyMember: "father", familyMemberName: "Mark", agreedFrequency: "fortnightly", actualFrequencyMet: true, childViewOnContact: "happy_with_current", courtOrderInPlace: false, lastReviewedDate: "2026-04-15", reviewedBy: "Sarah Johnson", planIsChildCentred: true },
  { id: "cp-j1", childId: "child-jordan", childName: "Jordan", familyMember: "mother", familyMemberName: "Claire", agreedFrequency: "fortnightly", actualFrequencyMet: true, childViewOnContact: "wants_more", courtOrderInPlace: true, contactConditions: "Supervised due to court order", lastReviewedDate: "2026-05-01", reviewedBy: "Tom Richards", planIsChildCentred: true },
  { id: "cp-m1", childId: "child-morgan", childName: "Morgan", familyMember: "grandparent", familyMemberName: "Nana Pat", agreedFrequency: "weekly", actualFrequencyMet: true, childViewOnContact: "happy_with_current", courtOrderInPlace: false, lastReviewedDate: "2026-04-20", reviewedBy: "Lisa Williams", planIsChildCentred: true },
];

const DEMO_SIBLINGS: SiblingContact[] = [
  { id: "sc-j1", childId: "child-jordan", childName: "Jordan", siblingId: "child-jamie", siblingName: "Jamie", siblingPlacement: "Foster care with Smith family", contactFrequency: "fortnightly", frequencyMet: true, lastContactDate: "2026-05-14", qualityRating: "positive" },
  { id: "sc-m1", childId: "child-morgan", childName: "Morgan", siblingId: "child-leigh", siblingName: "Leigh", siblingPlacement: "With birth mother", contactFrequency: "monthly", frequencyMet: true, lastContactDate: "2026-05-01", qualityRating: "mostly_positive" },
];

const DEMO_ENGAGEMENTS: FamilyEngagement[] = [
  { id: "fe-a", childId: "child-alex", childName: "Alex", familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true, familyRelationshipsSupported: true, culturalLinksPromoted: true, familyGroupConferencing: false, lifestoryWorkIncludesFamily: true },
  { id: "fe-j", childId: "child-jordan", childName: "Jordan", familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true, familyRelationshipsSupported: true, culturalLinksPromoted: false, familyGroupConferencing: true, lifestoryWorkIncludesFamily: true },
  { id: "fe-m", childId: "child-morgan", childName: "Morgan", familyInvolvedInReviews: true, familyInvolvedInCarePlanning: true, familyRelationshipsSupported: true, culturalLinksPromoted: true, familyGroupConferencing: false, lifestoryWorkIncludesFamily: true },
];

// -- GET ------------------------------------------------------------------------

export async function GET() {
  const result = generateFamilyContactQualityIntelligence(
    DEMO_CONTACTS,
    DEMO_PLANS,
    DEMO_SIBLINGS,
    DEMO_ENGAGEMENTS,
    "oak-house",
    "2026-01-01",
    "2026-05-18",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        contactTypeLabels: Object.fromEntries(
          (["face_to_face", "telephone", "video_call", "letter", "supervised_visit", "unsupervised_visit", "family_activity", "sibling_contact", "overnight_stay"] as const).map(
            (t) => [t, getContactTypeLabel(t)],
          ),
        ),
        contactOutcomeLabels: Object.fromEntries(
          (["positive", "mostly_positive", "mixed", "difficult", "distressing", "did_not_occur"] as const).map(
            (o) => [o, getContactOutcomeLabel(o)],
          ),
        ),
        contactFrequencyLabels: Object.fromEntries(
          (["more_than_weekly", "weekly", "fortnightly", "monthly", "less_than_monthly", "no_contact"] as const).map(
            (f) => [f, getContactFrequencyLabel(f)],
          ),
        ),
        supervisionLevelLabels: Object.fromEntries(
          (["unsupervised", "light_touch", "supervised", "closely_supervised", "suspended"] as const).map(
            (l) => [l, getSupervisionLevelLabel(l)],
          ),
        ),
        familyMemberLabels: Object.fromEntries(
          (["mother", "father", "sibling", "grandparent", "aunt_uncle", "other_relative", "significant_other"] as const).map(
            (m) => [m, getFamilyMemberLabel(m)],
          ),
        ),
        childViewLabels: Object.fromEntries(
          (["wants_more", "happy_with_current", "wants_less", "does_not_want", "not_recorded"] as const).map(
            (v) => [v, getChildViewLabel(v)],
          ),
        ),
      },
    },
  });
}

// -- POST -----------------------------------------------------------------------

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { contacts, plans, siblings, engagements, homeId, periodStart, periodEnd } = body as {
    contacts?: ContactRecord[];
    plans?: ContactPlan[];
    siblings?: SiblingContact[];
    engagements?: FamilyEngagement[];
    homeId?: string;
    periodStart?: string;
    periodEnd?: string;
  };

  if (!periodStart || !periodEnd) {
    return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });
  }

  const result = generateFamilyContactQualityIntelligence(
    contacts ?? [],
    plans ?? [],
    siblings ?? [],
    engagements ?? [],
    homeId ?? "unknown",
    periodStart,
    periodEnd,
  );

  return NextResponse.json({ data: result });
}
