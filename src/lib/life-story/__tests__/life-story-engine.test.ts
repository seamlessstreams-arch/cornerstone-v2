// ══════════════════════════════════════════════════════════════════════════════
// Life Story & Identity Work Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateChildLifeStoryCompliance,
  calculateHomeLifeStoryMetrics,
  getSessionTypeLabel,
  getIdentityCategoryLabel,
} from "../life-story-engine";
import type {
  ChildLifeStoryProfile,
  LifeStorySession,
  IdentityNeed,
  FamilyConnection,
} from "../life-story-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeSession(overrides: Partial<LifeStorySession> = {}): LifeStorySession {
  return {
    id: "ls-001",
    childId: "child-alex",
    date: "2026-05-10T14:00:00Z",
    type: "life_story_book",
    status: "completed",
    duration: 45,
    facilitatedBy: "staff-jb-01",
    topicsCovered: ["Early memories", "Favourite places"],
    childLedContent: true,
    childEngagement: "high",
    childFeedback: "Really enjoyed looking at old photos",
    addedToLifeStoryBook: true,
    addedToMemoryBox: false,
    photographsTaken: false,
    staffNotes: "Alex engaged well. Wants to do more photo work next time.",
    ...overrides,
  };
}

function makeIdentityNeed(overrides: Partial<IdentityNeed> = {}): IdentityNeed {
  return {
    category: "heritage_culture",
    description: "Mixed heritage (Caribbean/English) — cultural connection needed",
    importance: "essential",
    currentlyMet: true,
    supportInPlace: ["Caribbean cooking sessions", "Cultural celebration events", "Connection to maternal grandmother"],
    gaps: [],
    childView: "I like learning about my nan's cooking",
    ...overrides,
  };
}

function makeFamilyConnection(overrides: Partial<FamilyConnection> = {}): FamilyConnection {
  return {
    id: "fc-001",
    relationship: "Maternal grandmother",
    contactArranged: true,
    contactFrequency: "Monthly supervised visits",
    safeToMaintain: true,
    childWishesToMaintain: true,
    ...overrides,
  };
}

function makeProfile(overrides: Partial<ChildLifeStoryProfile> = {}): ChildLifeStoryProfile {
  return {
    childId: "child-alex",
    childName: "Alex",
    homeId: "home-oak",
    dateOfBirth: "2013-03-15T00:00:00Z",
    lifeStoryBookExists: true,
    lifeStoryBookLastUpdated: "2026-05-10T14:00:00Z",
    memoryBoxExists: true,
    memoryBoxLastUpdated: "2026-04-20T10:00:00Z",
    sessions: [
      makeSession({ id: "ls-001", date: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "ls-002", date: "2026-04-15T14:00:00Z", type: "memory_box", childEngagement: "moderate" }),
      makeSession({ id: "ls-003", date: "2026-03-20T14:00:00Z", type: "photograph_session" }),
    ],
    identityNeeds: [
      makeIdentityNeed(),
      makeIdentityNeed({ category: "religion_faith", description: "No specific faith — explore if interested", importance: "desirable", currentlyMet: true, supportInPlace: ["Open conversations about faith"], gaps: [] }),
      makeIdentityNeed({ category: "interests_talents", description: "Football, art, music", importance: "important", currentlyMet: true, supportInPlace: ["Football club membership", "Art supplies", "Guitar lessons"], gaps: [] }),
    ],
    identityInCarePlan: true,
    identityLastReviewed: "2026-04-01T10:00:00Z",
    familyConnections: [
      makeFamilyConnection(),
      makeFamilyConnection({ id: "fc-002", relationship: "Birth mother", contactArranged: false, contactFrequency: "Letters only", safeToMaintain: true, childWishesToMaintain: false }),
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
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Child Life Story Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateChildLifeStoryCompliance", () => {
  it("marks compliant child with good practice", () => {
    const result = evaluateChildLifeStoryCompliance(makeProfile(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.lifeStoryBookExists).toBe(true);
    expect(result.lifeStoryBookCurrent).toBe(true);
    expect(result.memoryBoxExists).toBe(true);
    expect(result.sessionsLast3Months).toBe(3);
    expect(result.overallScore).toBeGreaterThan(70);
  });

  it("flags missing life story book", () => {
    const profile = makeProfile({ lifeStoryBookExists: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.isCompliant).toBe(false);
    expect(result.lifeStoryBookExists).toBe(false);
    expect(result.issues.some(i => i.includes("Life story book not in place"))).toBe(true);
  });

  it("warns about outdated life story book", () => {
    const profile = makeProfile({ lifeStoryBookLastUpdated: "2026-01-01T10:00:00Z" });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.lifeStoryBookCurrent).toBe(false);
    expect(result.warnings.some(w => w.includes("not updated in over 3 months"))).toBe(true);
  });

  it("warns about missing memory box", () => {
    const profile = makeProfile({ memoryBoxExists: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("Memory box"))).toBe(true);
  });

  it("flags no sessions recorded", () => {
    const profile = makeProfile({ sessions: [] });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("No life story sessions"))).toBe(true);
  });

  it("warns about session frequency gap", () => {
    const profile = makeProfile({
      sessions: [
        makeSession({ date: "2026-03-01T14:00:00Z" }), // > 30 days ago from NOW
      ],
    });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.sessionFrequencyAdequate).toBe(false);
    expect(result.warnings.some(w => w.includes("No life story session in"))).toBe(true);
  });

  it("calculates engagement score", () => {
    const profile = makeProfile({
      sessions: [
        makeSession({ id: "ls-1", date: "2026-05-10T14:00:00Z", childEngagement: "high" }),
        makeSession({ id: "ls-2", date: "2026-04-15T14:00:00Z", childEngagement: "moderate" }),
        makeSession({ id: "ls-3", date: "2026-03-20T14:00:00Z", childEngagement: "high" }),
      ],
    });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    // (100 + 70 + 100) / 3 = 90
    expect(result.engagementScore).toBe(90);
  });

  it("flags identity not in care plan", () => {
    const profile = makeProfile({ identityInCarePlan: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("Identity needs not included in care plan"))).toBe(true);
  });

  it("flags cultural background not recorded", () => {
    const profile = makeProfile({ culturalBackgroundRecorded: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("Cultural background not recorded"))).toBe(true);
  });

  it("calculates identity needs met percentage", () => {
    const profile = makeProfile({
      identityNeeds: [
        makeIdentityNeed({ currentlyMet: true }),
        makeIdentityNeed({ category: "language", currentlyMet: false, gaps: ["Polish language support needed"] }),
      ],
    });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.identityNeedsMet).toBe(50);
    expect(result.identityGaps).toContain("Polish language support needed");
  });

  it("warns about inactive safe family connections", () => {
    const profile = makeProfile({
      familyConnections: [
        makeFamilyConnection({ contactArranged: false, safeToMaintain: true }),
      ],
    });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("No active family contact"))).toBe(true);
  });

  it("warns about missing photographs", () => {
    const profile = makeProfile({ recentPhotographs: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("No photographs"))).toBe(true);
  });

  it("flags child without access to materials", () => {
    const profile = makeProfile({ childHasAccessToMaterials: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("does not have access"))).toBe(true);
  });

  it("warns about incomplete family tree", () => {
    const profile = makeProfile({ familyTreeCompleted: false });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.familyTreeCompleted).toBe(false);
    expect(result.warnings.some(w => w.includes("Family tree"))).toBe(true);
  });

  it("tracks family connections correctly", () => {
    const profile = makeProfile({
      familyConnections: [
        makeFamilyConnection({ id: "fc-1", safeToMaintain: true, contactArranged: true }),
        makeFamilyConnection({ id: "fc-2", safeToMaintain: true, contactArranged: false }),
        makeFamilyConnection({ id: "fc-3", safeToMaintain: false, contactArranged: false }),
      ],
    });
    const result = evaluateChildLifeStoryCompliance(profile, NOW);
    expect(result.familyConnectionsSafe).toBe(2);
    expect(result.familyConnectionsActive).toBe(1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Life Story Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeLifeStoryMetrics", () => {
  it("calculates metrics for home", () => {
    const profiles = [
      makeProfile({ childId: "child-alex", childName: "Alex" }),
      makeProfile({
        childId: "child-jordan",
        childName: "Jordan",
        sessions: [
          makeSession({ id: "ls-j1", childId: "child-jordan", date: "2026-05-08T14:00:00Z" }),
        ],
      }),
    ];
    const result = calculateHomeLifeStoryMetrics(profiles, "home-oak", NOW);
    expect(result.totalChildren).toBe(2);
    expect(result.childrenWithLifeStoryBook).toBe(2);
    expect(result.childrenWithMemoryBox).toBe(2);
    expect(result.averageOverallScore).toBeGreaterThan(60);
  });

  it("counts children with recent sessions", () => {
    const profiles = [
      makeProfile({
        childId: "child-alex",
        sessions: [makeSession({ date: "2026-05-10T14:00:00Z" })],
      }),
      makeProfile({
        childId: "child-jordan",
        childName: "Jordan",
        sessions: [makeSession({ id: "ls-j1", childId: "child-jordan", date: "2026-03-01T14:00:00Z" })],
      }),
    ];
    const result = calculateHomeLifeStoryMetrics(profiles, "home-oak", NOW);
    expect(result.childrenWithRecentSession).toBe(1); // Only Alex has session in last 30 days
  });

  it("calculates session completion rate", () => {
    const profiles = [
      makeProfile({
        sessions: [
          makeSession({ id: "ls-1", date: "2026-05-10T14:00:00Z", status: "completed" }),
          makeSession({ id: "ls-2", date: "2026-04-15T14:00:00Z", status: "cancelled" }),
          makeSession({ id: "ls-3", date: "2026-03-20T14:00:00Z", status: "completed" }),
        ],
      }),
    ];
    const result = calculateHomeLifeStoryMetrics(profiles, "home-oak", NOW);
    expect(result.sessionCompletionRate).toBe(67); // 2 completed out of 3 total
  });

  it("calculates child-led rate", () => {
    const profiles = [
      makeProfile({
        sessions: [
          makeSession({ id: "ls-1", date: "2026-05-10T14:00:00Z", childLedContent: true }),
          makeSession({ id: "ls-2", date: "2026-04-15T14:00:00Z", childLedContent: false }),
        ],
      }),
    ];
    const result = calculateHomeLifeStoryMetrics(profiles, "home-oak", NOW);
    expect(result.childLedRate).toBe(50);
  });

  it("handles empty profiles", () => {
    const result = calculateHomeLifeStoryMetrics([], "home-oak", NOW);
    expect(result.totalChildren).toBe(0);
    expect(result.averageOverallScore).toBe(0);
    expect(result.complianceIssues).toHaveLength(0);
  });

  it("calculates identity and cultural rates", () => {
    const profiles = [
      makeProfile({ identityInCarePlan: true, familyTreeCompleted: true }),
      makeProfile({
        childId: "child-jordan",
        childName: "Jordan",
        identityInCarePlan: false,
        familyTreeCompleted: false,
        sessions: [],
      }),
    ];
    const result = calculateHomeLifeStoryMetrics(profiles, "home-oak", NOW);
    expect(result.identityInCarePlanRate).toBe(50);
    expect(result.familyTreeCompletionRate).toBe(50);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Label helpers", () => {
  it("getSessionTypeLabel returns readable labels", () => {
    expect(getSessionTypeLabel("life_story_book")).toBe("Life Story Book");
    expect(getSessionTypeLabel("creative_expression")).toBe("Creative Expression");
  });

  it("getIdentityCategoryLabel returns readable labels", () => {
    expect(getIdentityCategoryLabel("heritage_culture")).toBe("Heritage & Culture");
    expect(getIdentityCategoryLabel("gender_identity")).toBe("Gender Identity");
  });
});
