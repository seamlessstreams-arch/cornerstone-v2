// ══════════════════════════════════════════════════════════════════════════════
// House Meetings & Children's Council Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateMeetingsCompliance,
  calculateHomeMeetingsMetrics,
  getMeetingTypeLabel,
  getActionStatusLabel,
} from "../house-meetings-engine";
import type {
  HomeMeetingsProfile,
  HouseMeeting,
  MeetingAction,
} from "../house-meetings-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeMeeting(overrides: Partial<HouseMeeting> = {}): HouseMeeting {
  return {
    id: "hm-001",
    homeId: "home-oak",
    date: "2026-05-14T17:00:00Z",
    type: "house_meeting",
    facilitatedBy: "staff-rm-01",
    duration: 30,
    childAttendance: [
      { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
      { childId: "child-jordan", childName: "Jordan", status: "attended", contributionLevel: "some" },
      { childId: "child-sam", childName: "Sam", status: "attended", contributionLevel: "active" },
      { childId: "child-casey", childName: "Casey", status: "declined", contributionLevel: undefined },
    ],
    staffPresent: ["staff-rm-01", "staff-jb-01"],
    agendaItems: [
      { id: "ai-1", topic: "Weekend activities", suggestedBy: "child_suggested", suggestedByName: "Alex", discussed: true, outcome: "Cinema trip agreed for Saturday", actionRequired: true },
      { id: "ai-2", topic: "Menu changes", suggestedBy: "child_suggested", suggestedByName: "Sam", discussed: true, outcome: "Pizza Fridays agreed", actionRequired: true },
      { id: "ai-3", topic: "Wi-Fi speed", suggestedBy: "child_suggested", suggestedByName: "Jordan", discussed: true, outcome: "RM to investigate upgrade options", actionRequired: true },
      { id: "ai-4", topic: "Fire drill feedback", suggestedBy: "staff_suggested", discussed: true, outcome: "Well done all, 2 mins 30 secs", actionRequired: false },
    ],
    childrenContributedToAgenda: true,
    minutesRecorded: true,
    minutesAccessibleToChildren: true,
    actionsAgreed: [
      { id: "ma-1", meetingId: "hm-001", description: "Book cinema trip", assignedTo: "staff-jb-01", dueDate: "2026-05-16T00:00:00Z", status: "completed", completedDate: "2026-05-15T10:00:00Z", childSuggested: true },
      { id: "ma-2", meetingId: "hm-001", description: "Update menu rota with pizza Fridays", assignedTo: "staff-rm-01", dueDate: "2026-05-17T00:00:00Z", status: "completed", completedDate: "2026-05-16T08:00:00Z", childSuggested: true },
      { id: "ma-3", meetingId: "hm-001", description: "Get Wi-Fi upgrade quotes", assignedTo: "staff-rm-01", dueDate: "2026-05-21T00:00:00Z", status: "in_progress", childSuggested: true },
    ],
    previousActionsReviewed: true,
    childrenChaired: false,
    snacksProvided: true,
    funElement: true,
    staffNotes: "Good meeting. Children engaged well. Casey declined but we spoke to her afterwards.",
    ...overrides,
  };
}

function makeProfile(overrides: Partial<HomeMeetingsProfile> = {}): HomeMeetingsProfile {
  return {
    homeId: "home-oak",
    meetings: [
      makeMeeting({ id: "hm-001", date: "2026-05-14T17:00:00Z" }),
      makeMeeting({ id: "hm-002", date: "2026-05-07T17:00:00Z", childrenChaired: true }),
      makeMeeting({ id: "hm-003", date: "2026-04-30T17:00:00Z" }),
      makeMeeting({ id: "hm-004", date: "2026-04-23T17:00:00Z", childrenChaired: true }),
      makeMeeting({ id: "hm-005", date: "2026-04-16T17:00:00Z" }),
      makeMeeting({ id: "hm-006", date: "2026-04-09T17:00:00Z" }),
      makeMeeting({ id: "hm-007", date: "2026-04-02T17:00:00Z" }),
      makeMeeting({ id: "hm-008", date: "2026-03-26T17:00:00Z" }),
    ],
    meetingFrequencyTarget: "weekly",
    childrenCouncilActive: true,
    childrenCouncilReps: ["Jordan", "Sam"],
    suggestionsBoxAvailable: true,
    previousActionsOutstanding: [],
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Meetings Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateMeetingsCompliance", () => {
  it("marks compliant home with good practice", () => {
    const result = evaluateMeetingsCompliance(makeProfile(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.frequencyAdequate).toBe(true);
    expect(result.meetingsLast30Days).toBeGreaterThanOrEqual(3);
    expect(result.averageAttendanceRate).toBe(75); // 3 of 4 attend
    expect(result.childAgendaRate).toBe(75); // 3 of 4 items child-suggested
  });

  it("flags missed meeting frequency", () => {
    const profile = makeProfile({
      meetings: [makeMeeting({ date: "2026-04-20T17:00:00Z" })], // 27 days ago
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.frequencyAdequate).toBe(false);
    expect(result.issues.some(i => i.includes("No house meeting in"))).toBe(true);
  });

  it("warns about low attendance", () => {
    const profile = makeProfile({
      meetings: [
        makeMeeting({
          id: "hm-1",
          date: "2026-05-14T17:00:00Z",
          childAttendance: [
            { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
            { childId: "child-jordan", childName: "Jordan", status: "declined" },
            { childId: "child-sam", childName: "Sam", status: "declined" },
            { childId: "child-casey", childName: "Casey", status: "absent" },
          ],
        }),
        makeMeeting({
          id: "hm-2",
          date: "2026-05-07T17:00:00Z",
          childAttendance: [
            { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "some" },
            { childId: "child-jordan", childName: "Jordan", status: "declined" },
            { childId: "child-sam", childName: "Sam", status: "absent" },
            { childId: "child-casey", childName: "Casey", status: "absent" },
          ],
        }),
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.averageAttendanceRate).toBe(25);
    expect(result.warnings.some(w => w.includes("Low meeting attendance"))).toBe(true);
  });

  it("warns about low child agenda contribution", () => {
    const profile = makeProfile({
      meetings: [
        makeMeeting({
          date: "2026-05-14T17:00:00Z",
          agendaItems: [
            { id: "ai-1", topic: "Staffing update", suggestedBy: "staff_suggested", discussed: true, actionRequired: false },
            { id: "ai-2", topic: "Policy change", suggestedBy: "staff_suggested", discussed: true, actionRequired: false },
            { id: "ai-3", topic: "Health and safety", suggestedBy: "standing_item", discussed: true, actionRequired: false },
          ],
        }),
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.childAgendaRate).toBe(0);
    expect(result.warnings.some(w => w.includes("agenda items suggested by children"))).toBe(true);
  });

  it("flags missing minutes", () => {
    const profile = makeProfile({
      meetings: [
        makeMeeting({ id: "hm-1", date: "2026-05-14T17:00:00Z", minutesRecorded: false }),
        makeMeeting({ id: "hm-2", date: "2026-05-07T17:00:00Z", minutesRecorded: true }),
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.minutesRecordedRate).toBe(50);
    expect(result.issues.some(i => i.includes("Minutes not recorded"))).toBe(true);
  });

  it("warns about inaccessible minutes", () => {
    const profile = makeProfile({
      meetings: [
        makeMeeting({ date: "2026-05-14T17:00:00Z", minutesAccessibleToChildren: false }),
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.minutesAccessibleRate).toBe(0);
    expect(result.warnings.some(w => w.includes("minutes not always accessible"))).toBe(true);
  });

  it("flags low action completion rate", () => {
    const profile = makeProfile({
      meetings: [makeMeeting({ date: "2026-05-14T17:00:00Z" })],
      previousActionsOutstanding: [
        { id: "oa-1", meetingId: "hm-old", description: "Fix garden gate", assignedTo: "staff-rm-01", dueDate: "2026-04-01T00:00:00Z", status: "overdue", childSuggested: true },
        { id: "oa-2", meetingId: "hm-old", description: "Get new board games", assignedTo: "staff-jb-01", dueDate: "2026-04-15T00:00:00Z", status: "overdue", childSuggested: true },
        { id: "oa-3", meetingId: "hm-old", description: "Arrange cooking session", assignedTo: "staff-kl-02", dueDate: "2026-04-20T00:00:00Z", status: "overdue", childSuggested: true },
        { id: "oa-4", meetingId: "hm-old", description: "Another thing", assignedTo: "staff-rm-01", dueDate: "2026-04-25T00:00:00Z", status: "overdue", childSuggested: false },
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.actionsOverdue).toBe(4);
    expect(result.warnings.some(w => w.includes("overdue action"))).toBe(true);
  });

  it("identifies children who never attend", () => {
    const profile = makeProfile({
      meetings: [
        makeMeeting({
          id: "hm-1",
          date: "2026-05-14T17:00:00Z",
          childAttendance: [
            { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
            { childId: "child-casey", childName: "Casey", status: "declined" },
          ],
        }),
        makeMeeting({
          id: "hm-2",
          date: "2026-05-07T17:00:00Z",
          childAttendance: [
            { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
            { childId: "child-casey", childName: "Casey", status: "absent" },
          ],
        }),
        makeMeeting({
          id: "hm-3",
          date: "2026-04-30T17:00:00Z",
          childAttendance: [
            { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "some" },
            { childId: "child-casey", childName: "Casey", status: "declined" },
          ],
        }),
      ],
    });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.childrenNeverAttending).toContain("Casey");
    expect(result.childrenAlwaysAttending).toContain("Alex");
    expect(result.warnings.some(w => w.includes("Casey"))).toBe(true);
  });

  it("warns about missing suggestions box", () => {
    const profile = makeProfile({ suggestionsBoxAvailable: false });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("suggestions box"))).toBe(true);
  });

  it("calculates children chaired rate", () => {
    const result = evaluateMeetingsCompliance(makeProfile(), NOW);
    // 2 of 8 meetings chaired by children = 25%
    expect(result.childrenChairedRate).toBe(25);
  });

  it("handles no meetings at all", () => {
    const profile = makeProfile({ meetings: [] });
    const result = evaluateMeetingsCompliance(profile, NOW);
    expect(result.frequencyAdequate).toBe(false);
    expect(result.meetingsLast30Days).toBe(0);
    expect(result.daysSinceLastMeeting).toBe(999);
  });

  it("tracks child-suggested actions", () => {
    const result = evaluateMeetingsCompliance(makeProfile(), NOW);
    // All recent meeting actions are child-suggested
    expect(result.childSuggestedActionsRate).toBeGreaterThan(50);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Meetings Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomeMeetingsMetrics", () => {
  it("calculates overall metrics", () => {
    const result = calculateHomeMeetingsMetrics(makeProfile(), NOW);
    expect(result.totalMeetingsLast90Days).toBeGreaterThanOrEqual(7);
    expect(result.frequencyMet).toBe(true);
    expect(result.overallScore).toBeGreaterThan(40);
    expect(result.participationScore).toBeGreaterThan(0);
    expect(result.governanceScore).toBeGreaterThan(0);
  });

  it("calculates next meeting due date", () => {
    const result = calculateHomeMeetingsMetrics(makeProfile(), NOW);
    const nextDue = new Date(result.nextMeetingDue);
    const lastMeeting = new Date("2026-05-14T17:00:00Z");
    // Weekly target = 7 days after last meeting
    expect(nextDue.getTime()).toBe(lastMeeting.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  it("counts meetings by type", () => {
    const result = calculateHomeMeetingsMetrics(makeProfile(), NOW);
    expect(result.meetingsByType.length).toBeGreaterThan(0);
    expect(result.meetingsByType[0].type).toBe("house_meeting");
  });

  it("handles empty profile", () => {
    const profile = makeProfile({ meetings: [] });
    const result = calculateHomeMeetingsMetrics(profile, NOW);
    expect(result.totalMeetingsLast90Days).toBe(0);
    expect(result.frequencyMet).toBe(false);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Helper Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("Label helpers", () => {
  it("getMeetingTypeLabel returns readable labels", () => {
    expect(getMeetingTypeLabel("house_meeting")).toBe("House Meeting");
    expect(getMeetingTypeLabel("childrens_council")).toBe("Children's Council");
    expect(getMeetingTypeLabel("menu_planning")).toBe("Menu Planning");
  });

  it("getActionStatusLabel returns readable labels", () => {
    expect(getActionStatusLabel("in_progress")).toBe("In Progress");
    expect(getActionStatusLabel("overdue")).toBe("Overdue");
  });
});
