// ══════════════════════════════════════════════════════════════════════════════
// Key Working Engine — Tests
//
// Covers: compliance evaluation, metrics calculation, insight generation,
// frequency requirements, engagement tracking, mood trends.
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateKeyworkCompliance,
  calculateKeyworkMetrics,
  generateKeyworkInsights,
  getSessionTypeLabel,
  getOutcomeLabel,
} from "../keywork-engine";
import type {
  KeyworkSession,
  KeyworkAllocation,
} from "../keywork-engine";

// ── Test Fixtures ──────────────────────────────────────────────────────────

function makeSession(overrides: Partial<KeyworkSession> = {}): KeyworkSession {
  return {
    id: "session-001",
    childId: "child-001",
    childName: "Child A",
    keyworkerId: "staff-001",
    keyworkerName: "Key Worker 1",
    homeId: "home-001",
    sessionType: "formal_keywork",
    plannedDate: "2026-05-10T14:00:00Z",
    actualDate: "2026-05-10T14:00:00Z",
    durationMinutes: 45,
    location: "Quiet room",
    outcome: "completed",
    engagementLevel: 4,
    moodBefore: 3,
    moodAfter: 4,
    topicsDiscussed: ["school", "family contact"],
    childVoice: "I feel like school is going better this week.",
    goalsWorkedOn: ["Build confidence in education"],
    achievementsNoted: ["Attended all classes this week"],
    concernsRaised: [],
    actionsAgreed: [],
    followUpRequired: false,
    notes: "Good session. Child engaged well.",
    createdAt: "2026-05-10T15:00:00Z",
    signedOff: true,
    signedOffBy: "staff-001",
    ...overrides,
  };
}

function makeAllocation(overrides: Partial<KeyworkAllocation> = {}): KeyworkAllocation {
  return {
    childId: "child-001",
    childName: "Child A",
    primaryKeyworkerId: "staff-001",
    primaryKeyworkerName: "Key Worker 1",
    allocatedSince: "2026-01-01T00:00:00Z",
    expectedFrequency: "weekly",
    relationshipQuality: "developing",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateKeyworkCompliance", () => {
  const now = "2026-05-17T12:00:00Z";

  it("marks compliant when frequency met", () => {
    const sessions = [
      makeSession({ id: "s1", actualDate: "2026-05-03T14:00:00Z" }),
      makeSession({ id: "s2", actualDate: "2026-05-07T14:00:00Z" }),
      makeSession({ id: "s3", actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s4", actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation({ expectedFrequency: "weekly" });
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.isCompliant).toBe(true);
    expect(result.sessionsThisMonth).toBe(4);
    expect(result.issues).toHaveLength(0);
  });

  it("flags insufficient sessions for weekly frequency", () => {
    const sessions = [
      makeSession({ id: "s1", actualDate: "2026-05-10T14:00:00Z" }),
    ];
    const allocation = makeAllocation({ expectedFrequency: "weekly" });
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.isCompliant).toBe(false);
    expect(result.issues.some(i => i.includes("minimum 4 required"))).toBe(true);
  });

  it("marks fortnightly frequency as compliant with 2 sessions", () => {
    const sessions = [
      makeSession({ id: "s1", actualDate: "2026-05-05T14:00:00Z" }),
      makeSession({ id: "s2", actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation({ expectedFrequency: "fortnightly" });
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.isCompliant).toBe(true);
    expect(result.expectedSessionsThisMonth).toBe(2);
  });

  it("flags gap exceeding 14 days", () => {
    const sessions = [
      makeSession({ id: "s1", actualDate: "2026-04-28T14:00:00Z" }),
    ];
    const allocation = makeAllocation();
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.daysSinceLastSession).toBeGreaterThan(14);
    expect(result.issues.some(i => i.includes("days since last keywork session"))).toBe(true);
  });

  it("flags no completed sessions", () => {
    const sessions: KeyworkSession[] = [];
    const allocation = makeAllocation();
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.isCompliant).toBe(false);
    expect(result.issues.some(i => i.includes("No completed keywork sessions"))).toBe(true);
  });

  it("flags low average engagement", () => {
    const sessions = [
      makeSession({ id: "s1", engagementLevel: 1, actualDate: "2026-05-05T14:00:00Z" }),
      makeSession({ id: "s2", engagementLevel: 2, actualDate: "2026-05-07T14:00:00Z" }),
      makeSession({ id: "s3", engagementLevel: 2, actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s4", engagementLevel: 1, actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation();
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.averageEngagement).toBeLessThan(2.5);
    expect(result.issues.some(i => i.includes("Low average engagement"))).toBe(true);
  });

  it("flags missing child voice", () => {
    const sessions = [
      makeSession({ id: "s1", childVoice: "", actualDate: "2026-05-05T14:00:00Z" }),
      makeSession({ id: "s2", childVoice: "OK", actualDate: "2026-05-07T14:00:00Z" }), // < 10 chars
      makeSession({ id: "s3", childVoice: "", actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s4", childVoice: "", actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation();
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.childVoiceRecorded).toBe(false);
    expect(result.issues.some(i => i.includes("voice/views not recorded"))).toBe(true);
  });

  it("flags overdue actions", () => {
    const sessions = [
      makeSession({
        id: "s1",
        actualDate: "2026-05-05T14:00:00Z",
        actionsAgreed: [
          { description: "Contact social worker", assignedTo: "keyworker", dueDate: "2026-05-10T00:00:00Z", completed: false },
          { description: "Update risk assessment", assignedTo: "manager", dueDate: "2026-05-12T00:00:00Z", completed: false },
        ],
      }),
      makeSession({ id: "s2", actualDate: "2026-05-07T14:00:00Z" }),
      makeSession({ id: "s3", actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s4", actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation();
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.actionsOverdue).toBe(2);
    expect(result.issues.some(i => i.includes("overdue action"))).toBe(true);
  });

  it("only counts sessions for the allocated keyworker", () => {
    const sessions = [
      makeSession({ id: "s1", keyworkerId: "staff-001", actualDate: "2026-05-05T14:00:00Z" }),
      makeSession({ id: "s2", keyworkerId: "staff-002", actualDate: "2026-05-07T14:00:00Z" }), // different keyworker
      makeSession({ id: "s3", keyworkerId: "staff-001", actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s4", keyworkerId: "staff-001", actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const allocation = makeAllocation({ primaryKeyworkerId: "staff-001" });
    const result = evaluateKeyworkCompliance(sessions, allocation, now);
    expect(result.sessionsThisMonth).toBe(3); // not 4
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateKeyworkMetrics", () => {
  const now = "2026-05-17T12:00:00Z";

  const sessions = [
    makeSession({ id: "s1", actualDate: "2026-05-03T14:00:00Z", engagementLevel: 3, moodBefore: 2, moodAfter: 4 }),
    makeSession({ id: "s2", actualDate: "2026-05-07T14:00:00Z", engagementLevel: 4, moodBefore: 3, moodAfter: 3 }),
    makeSession({ id: "s3", actualDate: "2026-05-10T14:00:00Z", engagementLevel: 5, moodBefore: 3, moodAfter: 5 }),
    makeSession({ id: "s4", actualDate: "2026-05-14T14:00:00Z", outcome: "child_declined", engagementLevel: 1, moodBefore: 2, moodAfter: 2 }),
    makeSession({ id: "s5", childId: "child-002", childName: "Child B", actualDate: "2026-05-12T14:00:00Z", engagementLevel: 4 }),
  ];

  const allocations = [
    makeAllocation({ childId: "child-001", childName: "Child A" }),
    makeAllocation({ childId: "child-002", childName: "Child B" }),
  ];

  it("calculates total and monthly session counts", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    expect(result.totalSessions).toBe(5);
    expect(result.sessionsThisMonth).toBe(4); // excludes declined
  });

  it("calculates completion rate", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    // 4 completed out of 5 total = 80%
    expect(result.completionRate).toBe(80);
  });

  it("calculates declined rate", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    // 1 declined out of 5 = 20%
    expect(result.declinedRate).toBe(20);
  });

  it("calculates average engagement (completed sessions only)", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    // (3+4+5+4) / 4 = 4
    expect(result.averageEngagement).toBe(4);
  });

  it("calculates mood improvement rate", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    // s1 (2→4 improved), s3 (3→5 improved), s5 (3→4 improved) = 3 of 4 = 75%
    expect(result.moodImprovementRate).toBe(75);
  });

  it("calculates child voice rate", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    expect(result.childVoiceRate).toBe(100); // all have child voice in fixture
  });

  it("provides per-child summaries", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    expect(result.byChild.length).toBe(2);
    const childA = result.byChild.find(c => c.childId === "child-001");
    expect(childA).toBeDefined();
    expect(childA!.totalSessions).toBe(3); // excludes declined
  });

  it("provides session type breakdown", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    expect(result.bySessionType.length).toBeGreaterThan(0);
    expect(result.bySessionType[0].type).toBe("formal_keywork");
  });

  it("generates monthly trends", () => {
    const result = calculateKeyworkMetrics(sessions, allocations, "home-001", now);
    expect(result.trendsOverTime.length).toBe(6);
    const may = result.trendsOverTime.find(t => t.month === "2026-05");
    expect(may).toBeDefined();
    expect(may!.sessions).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Insights Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("generateKeyworkInsights", () => {
  it("detects improving engagement", () => {
    const sessions = [
      makeSession({ id: "s1", engagementLevel: 2, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", engagementLevel: 2, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", engagementLevel: 3, actualDate: "2026-05-07T14:00:00Z" }),
      makeSession({ id: "s4", engagementLevel: 4, actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s5", engagementLevel: 5, actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.engagementTrend).toBe("improving");
  });

  it("detects declining engagement", () => {
    const sessions = [
      makeSession({ id: "s1", engagementLevel: 5, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", engagementLevel: 4, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", engagementLevel: 3, actualDate: "2026-05-07T14:00:00Z" }),
      makeSession({ id: "s4", engagementLevel: 2, actualDate: "2026-05-10T14:00:00Z" }),
      makeSession({ id: "s5", engagementLevel: 2, actualDate: "2026-05-14T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.engagementTrend).toBe("declining");
    expect(result.recommendations.some(r => r.includes("declining"))).toBe(true);
  });

  it("identifies strong topics", () => {
    const sessions = [
      makeSession({ id: "s1", topicsDiscussed: ["football", "school"], engagementLevel: 5, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", topicsDiscussed: ["football", "family"], engagementLevel: 5, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", topicsDiscussed: ["school"], engagementLevel: 3, actualDate: "2026-05-07T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.strongTopics).toContain("football");
  });

  it("identifies avoided topics", () => {
    const sessions = [
      makeSession({ id: "s1", topicsDiscussed: ["family contact"], engagementLevel: 1, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", topicsDiscussed: ["family contact"], engagementLevel: 2, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", topicsDiscussed: ["school"], engagementLevel: 4, actualDate: "2026-05-07T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.avoidedTopics).toContain("family contact");
  });

  it("calculates relationship strength 0-100", () => {
    const sessions = [
      makeSession({ id: "s1", engagementLevel: 5, moodBefore: 3, moodAfter: 5, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", engagementLevel: 5, moodBefore: 3, moodAfter: 4, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", engagementLevel: 4, moodBefore: 2, moodAfter: 4, actualDate: "2026-05-07T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.relationshipStrength).toBeGreaterThan(0);
    expect(result.relationshipStrength).toBeLessThanOrEqual(100);
  });

  it("provides recommendations for low engagement", () => {
    const sessions = [
      makeSession({ id: "s1", engagementLevel: 1, actualDate: "2026-05-01T14:00:00Z" }),
      makeSession({ id: "s2", engagementLevel: 2, actualDate: "2026-05-04T14:00:00Z" }),
      makeSession({ id: "s3", engagementLevel: 1, actualDate: "2026-05-07T14:00:00Z" }),
    ];
    const result = generateKeyworkInsights(sessions, "child-001");
    expect(result.recommendations.some(r => r.includes("keyworker change"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Helper functions", () => {
  it("getSessionTypeLabel returns readable labels", () => {
    expect(getSessionTypeLabel("formal_keywork")).toBe("Formal Keywork");
    expect(getSessionTypeLabel("life_story_work")).toBe("Life Story Work");
    expect(getSessionTypeLabel("crisis_support")).toBe("Crisis Support");
  });

  it("getOutcomeLabel returns readable labels", () => {
    expect(getOutcomeLabel("completed")).toBe("Completed");
    expect(getOutcomeLabel("child_declined")).toBe("Child Declined");
    expect(getOutcomeLabel("staff_unavailable")).toBe("Staff Unavailable");
  });
});
