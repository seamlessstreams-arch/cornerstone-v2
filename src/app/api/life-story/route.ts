// ══════════════════════════════════════════════════════════════════════════════
// Life Story & Identity Work — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateChildLifeStoryCompliance,
  calculateHomeLifeStoryMetrics,
} from "@/lib/life-story";
import type { ChildLifeStoryProfile } from "@/lib/life-story";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_PROFILES: ChildLifeStoryProfile[] = [
  {
    childId: "child-alex",
    childName: "Alex",
    homeId: "home-oak",
    dateOfBirth: "2013-03-15T00:00:00Z",
    lifeStoryBookExists: true,
    lifeStoryBookLastUpdated: "2026-05-10T14:00:00Z",
    memoryBoxExists: true,
    memoryBoxLastUpdated: "2026-04-20T10:00:00Z",
    sessions: [
      { id: "ls-a1", childId: "child-alex", date: "2026-05-10T14:00:00Z", type: "life_story_book", status: "completed", duration: 45, facilitatedBy: "staff-jb-01", topicsCovered: ["Early memories", "Favourite places"], childLedContent: true, childEngagement: "high", childFeedback: "Really enjoyed looking at old photos", addedToLifeStoryBook: true, addedToMemoryBox: false, photographsTaken: false, staffNotes: "Alex engaged well. Wants to do more photo work next time." },
      { id: "ls-a2", childId: "child-alex", date: "2026-04-15T14:00:00Z", type: "memory_box", status: "completed", duration: 30, facilitatedBy: "staff-jb-01", topicsCovered: ["School certificates", "Birthday cards"], childLedContent: true, childEngagement: "moderate", addedToLifeStoryBook: false, addedToMemoryBox: true, photographsTaken: false },
      { id: "ls-a3", childId: "child-alex", date: "2026-03-20T14:00:00Z", type: "photograph_session", status: "completed", duration: 20, facilitatedBy: "staff-kl-02", topicsCovered: ["Photos at football match"], childLedContent: true, childEngagement: "high", addedToLifeStoryBook: true, addedToMemoryBox: true, photographsTaken: true },
    ],
    identityNeeds: [
      { category: "heritage_culture", description: "Mixed heritage (Caribbean/English) — cultural connection", importance: "essential", currentlyMet: true, supportInPlace: ["Caribbean cooking sessions", "Cultural celebration events", "Connection to maternal grandmother"], gaps: [], childView: "I like learning about my nan's cooking" },
      { category: "interests_talents", description: "Football, art, music", importance: "important", currentlyMet: true, supportInPlace: ["Football club membership", "Art supplies", "Guitar lessons"], gaps: [] },
      { category: "religion_faith", description: "No specific faith", importance: "desirable", currentlyMet: true, supportInPlace: ["Open conversations about faith"], gaps: [] },
    ],
    identityInCarePlan: true,
    identityLastReviewed: "2026-04-01T10:00:00Z",
    familyConnections: [
      { id: "fc-a1", relationship: "Maternal grandmother", contactArranged: true, contactFrequency: "Monthly supervised visits", safeToMaintain: true, childWishesToMaintain: true },
      { id: "fc-a2", relationship: "Birth mother", contactArranged: false, contactFrequency: "Letters quarterly", safeToMaintain: true, childWishesToMaintain: false, notes: "Alex does not currently wish face-to-face contact" },
    ],
    familyTreeCompleted: true,
    culturalBackgroundRecorded: true,
    primaryLanguage: "English",
    additionalLanguages: [],
    religionOrFaith: "None specified",
    dietaryNeeds: "None",
    culturalActivitiesProvided: ["Caribbean cooking", "Black History Month activities", "Cultural celebration events"],
    recentPhotographs: true,
    photoConsentObtained: true,
    childContributesToNarrative: true,
    childHasAccessToMaterials: true,
  },
  {
    childId: "child-jordan",
    childName: "Jordan",
    homeId: "home-oak",
    dateOfBirth: "2011-08-22T00:00:00Z",
    lifeStoryBookExists: true,
    lifeStoryBookLastUpdated: "2026-04-28T10:00:00Z",
    memoryBoxExists: true,
    memoryBoxLastUpdated: "2026-03-15T14:00:00Z",
    sessions: [
      { id: "ls-j1", childId: "child-jordan", date: "2026-04-28T14:00:00Z", type: "life_story_book", status: "completed", duration: 40, facilitatedBy: "staff-rm-01", topicsCovered: ["Journey to Oak House", "What home means"], childLedContent: true, childEngagement: "moderate", childFeedback: "OK I guess", addedToLifeStoryBook: true, addedToMemoryBox: false, photographsTaken: false },
      { id: "ls-j2", childId: "child-jordan", date: "2026-03-25T14:00:00Z", type: "identity_discussion", status: "completed", duration: 35, facilitatedBy: "staff-rm-01", topicsCovered: ["Who am I", "Future aspirations"], childLedContent: false, childEngagement: "moderate", addedToLifeStoryBook: false, addedToMemoryBox: false, photographsTaken: false },
      { id: "ls-j3", childId: "child-jordan", date: "2026-05-12T14:00:00Z", type: "creative_expression", status: "child_declined", duration: 0, facilitatedBy: "staff-jb-01", topicsCovered: [], childLedContent: false, childEngagement: "refused", addedToLifeStoryBook: false, addedToMemoryBox: false, photographsTaken: false, staffNotes: "Jordan not in the mood today. Offered to reschedule." },
    ],
    identityNeeds: [
      { category: "heritage_culture", description: "White British — no specific cultural gaps identified", importance: "important", currentlyMet: true, supportInPlace: ["Family recipes explored", "Local community engagement"], gaps: [] },
      { category: "gender_identity", description: "Exploring gender expression — supportive approach needed", importance: "essential", currentlyMet: true, supportInPlace: ["Open conversations", "Access to chosen clothing", "Preferred name used"], gaps: [], childView: "Staff are good about it" },
    ],
    identityInCarePlan: true,
    identityLastReviewed: "2026-03-15T10:00:00Z",
    familyConnections: [
      { id: "fc-j1", relationship: "Birth father", contactArranged: true, contactFrequency: "Fortnightly supervised", safeToMaintain: true, childWishesToMaintain: true },
      { id: "fc-j2", relationship: "Younger sibling (placed elsewhere)", contactArranged: true, contactFrequency: "Monthly activity days", safeToMaintain: true, childWishesToMaintain: true },
    ],
    familyTreeCompleted: true,
    culturalBackgroundRecorded: true,
    primaryLanguage: "English",
    additionalLanguages: [],
    dietaryNeeds: "Vegetarian",
    culturalActivitiesProvided: ["Vegetarian cooking", "Pride month activities"],
    recentPhotographs: true,
    photoConsentObtained: true,
    childContributesToNarrative: true,
    childHasAccessToMaterials: true,
  },
  {
    childId: "child-sam",
    childName: "Sam",
    homeId: "home-oak",
    dateOfBirth: "2014-11-03T00:00:00Z",
    lifeStoryBookExists: true,
    lifeStoryBookLastUpdated: "2026-05-05T10:00:00Z",
    memoryBoxExists: true,
    memoryBoxLastUpdated: "2026-05-05T10:00:00Z",
    sessions: [
      { id: "ls-s1", childId: "child-sam", date: "2026-05-05T14:00:00Z", type: "family_tree", status: "completed", duration: 50, facilitatedBy: "staff-kl-02", topicsCovered: ["Extended family", "Where people live"], childLedContent: true, childEngagement: "high", childFeedback: "I liked drawing the family tree", addedToLifeStoryBook: true, addedToMemoryBox: false, photographsTaken: false },
      { id: "ls-s2", childId: "child-sam", date: "2026-04-08T14:00:00Z", type: "cultural_activity", status: "completed", duration: 60, facilitatedBy: "staff-rm-01", topicsCovered: ["Polish Easter traditions"], childLedContent: false, childEngagement: "high", addedToLifeStoryBook: true, addedToMemoryBox: true, photographsTaken: true },
      { id: "ls-s3", childId: "child-sam", date: "2026-03-10T14:00:00Z", type: "letter_writing", status: "completed", duration: 25, facilitatedBy: "staff-jb-01", topicsCovered: ["Letter to mum"], childLedContent: true, childEngagement: "moderate", addedToLifeStoryBook: false, addedToMemoryBox: false, photographsTaken: false },
    ],
    identityNeeds: [
      { category: "heritage_culture", description: "Polish heritage — mum is Polish, needs language and cultural connection", importance: "essential", currentlyMet: true, supportInPlace: ["Polish food regularly on menu", "Polish Easter and Christmas traditions", "Contact with mum in Polish"], gaps: [] },
      { category: "language", description: "Polish language maintenance", importance: "important", currentlyMet: true, supportInPlace: ["Polish books available", "Skype calls with mum in Polish", "Polish Saturday school"], gaps: [] },
    ],
    identityInCarePlan: true,
    identityLastReviewed: "2026-04-15T10:00:00Z",
    familyConnections: [
      { id: "fc-s1", relationship: "Birth mother", contactArranged: true, contactFrequency: "Weekly video calls", safeToMaintain: true, childWishesToMaintain: true },
    ],
    familyTreeCompleted: true,
    culturalBackgroundRecorded: true,
    primaryLanguage: "English",
    additionalLanguages: ["Polish"],
    religionOrFaith: "Catholic (through mum)",
    dietaryNeeds: "None",
    culturalActivitiesProvided: ["Polish cooking", "Polish Saturday school", "Catholic church visits (when requested)", "Polish Easter/Christmas celebrations"],
    recentPhotographs: true,
    photoConsentObtained: true,
    childContributesToNarrative: true,
    childHasAccessToMaterials: true,
  },
  {
    childId: "child-casey",
    childName: "Casey",
    homeId: "home-oak",
    dateOfBirth: "2012-06-10T00:00:00Z",
    lifeStoryBookExists: true,
    lifeStoryBookLastUpdated: "2026-03-01T10:00:00Z",
    memoryBoxExists: false,
    memoryBoxLastUpdated: undefined,
    sessions: [
      { id: "ls-c1", childId: "child-casey", date: "2026-05-01T14:00:00Z", type: "life_story_book", status: "completed", duration: 30, facilitatedBy: "staff-rm-01", topicsCovered: ["My achievements"], childLedContent: true, childEngagement: "moderate", addedToLifeStoryBook: true, addedToMemoryBox: false, photographsTaken: false },
    ],
    identityNeeds: [
      { category: "heritage_culture", description: "Traveller heritage — cultural connection important", importance: "essential", currentlyMet: false, supportInPlace: ["Discussion about heritage in keywork"], gaps: ["Limited access to Traveller community", "Need cultural mentor/contact"], childView: "I want to know more about where I come from" },
      { category: "interests_talents", description: "Art, horses", importance: "important", currentlyMet: true, supportInPlace: ["Art lessons", "Monthly horse riding session"], gaps: [] },
    ],
    identityInCarePlan: true,
    identityLastReviewed: "2026-02-20T10:00:00Z",
    familyConnections: [
      { id: "fc-c1", relationship: "Older sibling", contactArranged: true, contactFrequency: "Monthly visits", safeToMaintain: true, childWishesToMaintain: true },
      { id: "fc-c2", relationship: "Birth parents", contactArranged: false, safeToMaintain: false, childWishesToMaintain: true, notes: "Not safe at present. Letterbox contact only." },
    ],
    familyTreeCompleted: false,
    culturalBackgroundRecorded: true,
    primaryLanguage: "English",
    additionalLanguages: [],
    dietaryNeeds: "None",
    culturalActivitiesProvided: ["Discussion of Traveller heritage"],
    recentPhotographs: false,
    photoConsentObtained: true,
    childContributesToNarrative: true,
    childHasAccessToMaterials: true,
  },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const childId = searchParams.get("childId");
  const now = new Date().toISOString();

  if (mode === "child" && childId) {
    const profile = DEMO_PROFILES.find(p => p.childId === childId && p.homeId === homeId);
    if (!profile) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    const result = evaluateChildLifeStoryCompliance(profile, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeLifeStoryMetrics(DEMO_PROFILES, homeId, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const metrics = calculateHomeLifeStoryMetrics(DEMO_PROFILES, homeId, now);
  const childSummaries = DEMO_PROFILES
    .filter(p => p.homeId === homeId)
    .map(p => {
      const result = evaluateChildLifeStoryCompliance(p, now);
      return {
        childId: p.childId,
        childName: p.childName,
        overallScore: result.overallScore,
        lifeStoryBookExists: result.lifeStoryBookExists,
        lifeStoryBookCurrent: result.lifeStoryBookCurrent,
        memoryBoxExists: result.memoryBoxExists,
        sessionsLast3Months: result.sessionsLast3Months,
        averageEngagement: result.averageEngagement,
        identityNeedsMet: result.identityNeedsMet,
        familyConnectionsActive: result.familyConnectionsActive,
        sessionFrequencyAdequate: result.sessionFrequencyAdequate,
        isCompliant: result.isCompliant,
        issues: result.issues.length,
        identityGaps: result.identityGaps,
      };
    });

  return NextResponse.json({
    metrics: {
      childrenWithLifeStoryBook: metrics.childrenWithLifeStoryBook,
      childrenWithMemoryBox: metrics.childrenWithMemoryBox,
      childrenWithRecentSession: metrics.childrenWithRecentSession,
      totalChildren: metrics.totalChildren,
      averageOverallScore: metrics.averageOverallScore,
      averageEngagementScore: metrics.averageEngagementScore,
      sessionCompletionRate: metrics.sessionCompletionRate,
      childLedRate: metrics.childLedRate,
      identityInCarePlanRate: metrics.identityInCarePlanRate,
      culturalNeedsSupportedRate: metrics.culturalNeedsSupportedRate,
      familyTreeCompletionRate: metrics.familyTreeCompletionRate,
      totalSessionsLast3Months: metrics.totalSessionsLast3Months,
      averageSessionsPerChild: metrics.averageSessionsPerChild,
    },
    children: childSummaries,
    complianceIssues: metrics.complianceIssues,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, profile, profiles, homeId, now } = body;

  if (action === "evaluate" && profile) {
    const result = evaluateChildLifeStoryCompliance(profile, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && profiles) {
    const result = calculateHomeLifeStoryMetrics(profiles, homeId || "home-oak", now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
