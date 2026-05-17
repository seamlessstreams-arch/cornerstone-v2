// ══════════════════════════════════════════════════════════════════════════════
// House Meetings & Children's Council — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateMeetingsCompliance,
  calculateHomeMeetingsMetrics,
} from "@/lib/house-meetings";
import type { HomeMeetingsProfile, HouseMeeting, MeetingAction } from "@/lib/house-meetings";

// ── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_MEETINGS: HouseMeeting[] = [
  {
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
      { childId: "child-casey", childName: "Casey", status: "declined" },
    ],
    staffPresent: ["staff-rm-01", "staff-jb-01"],
    agendaItems: [
      { id: "ai-1", topic: "Weekend cinema trip", suggestedBy: "child_suggested", suggestedByName: "Alex", discussed: true, outcome: "Agreed — Saturday afternoon", actionRequired: true },
      { id: "ai-2", topic: "Pizza Friday menu change", suggestedBy: "child_suggested", suggestedByName: "Sam", discussed: true, outcome: "Pizza added to Friday rota", actionRequired: true },
      { id: "ai-3", topic: "Wi-Fi speed", suggestedBy: "child_suggested", suggestedByName: "Jordan", discussed: true, outcome: "RM to get quotes for upgrade", actionRequired: true },
      { id: "ai-4", topic: "Fire drill review", suggestedBy: "staff_suggested", discussed: true, outcome: "All clear in 2:30, well done", actionRequired: false },
    ],
    childrenContributedToAgenda: true,
    minutesRecorded: true,
    minutesAccessibleToChildren: true,
    actionsAgreed: [
      { id: "ma-1", meetingId: "hm-001", description: "Book cinema for Saturday", assignedTo: "staff-jb-01", dueDate: "2026-05-16T00:00:00Z", status: "completed", completedDate: "2026-05-15T10:00:00Z", childSuggested: true, feedbackToChildren: "All booked for 2pm Saturday!" },
      { id: "ma-2", meetingId: "hm-001", description: "Update menu rota with pizza Fridays", assignedTo: "staff-rm-01", dueDate: "2026-05-17T00:00:00Z", status: "completed", completedDate: "2026-05-16T08:00:00Z", childSuggested: true },
      { id: "ma-3", meetingId: "hm-001", description: "Get Wi-Fi upgrade quotes", assignedTo: "staff-rm-01", dueDate: "2026-05-21T00:00:00Z", status: "in_progress", childSuggested: true },
    ],
    previousActionsReviewed: true,
    childrenChaired: false,
    snacksProvided: true,
    funElement: true,
    staffNotes: "Good meeting. Children engaged well. Casey declined but spoken to afterwards — said she was tired.",
  },
  {
    id: "hm-002",
    homeId: "home-oak",
    date: "2026-05-07T17:00:00Z",
    type: "house_meeting",
    facilitatedBy: "staff-jb-01",
    duration: 35,
    childAttendance: [
      { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "some" },
      { childId: "child-jordan", childName: "Jordan", status: "attended", contributionLevel: "active" },
      { childId: "child-sam", childName: "Sam", status: "attended", contributionLevel: "some" },
      { childId: "child-casey", childName: "Casey", status: "attended", contributionLevel: "minimal" },
    ],
    staffPresent: ["staff-jb-01", "staff-kl-02"],
    agendaItems: [
      { id: "ai-5", topic: "Garden improvements", suggestedBy: "child_suggested", suggestedByName: "Casey", discussed: true, outcome: "Hanging basket project agreed", actionRequired: true },
      { id: "ai-6", topic: "Bedtime routine feedback", suggestedBy: "staff_suggested", discussed: true, outcome: "Current times working well", actionRequired: false },
      { id: "ai-7", topic: "Summer holiday ideas", suggestedBy: "child_suggested", suggestedByName: "Jordan", discussed: true, outcome: "Beach trip and theme park shortlisted", actionRequired: true },
      { id: "ai-8", topic: "Review last week's actions", suggestedBy: "action_review", discussed: true, outcome: "All completed", actionRequired: false },
    ],
    childrenContributedToAgenda: true,
    minutesRecorded: true,
    minutesAccessibleToChildren: true,
    actionsAgreed: [
      { id: "ma-4", meetingId: "hm-002", description: "Buy hanging baskets and compost", assignedTo: "staff-kl-02", dueDate: "2026-05-12T00:00:00Z", status: "completed", completedDate: "2026-05-10T14:00:00Z", childSuggested: true },
      { id: "ma-5", meetingId: "hm-002", description: "Research summer holiday options and costs", assignedTo: "staff-rm-01", dueDate: "2026-05-20T00:00:00Z", status: "in_progress", childSuggested: true },
    ],
    previousActionsReviewed: true,
    childrenChaired: true,
    snacksProvided: true,
    funElement: true,
    childFeedback: "Jordan chaired really well — kept everyone on track!",
  },
  {
    id: "hm-003",
    homeId: "home-oak",
    date: "2026-04-30T17:00:00Z",
    type: "house_meeting",
    facilitatedBy: "staff-rm-01",
    duration: 25,
    childAttendance: [
      { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
      { childId: "child-jordan", childName: "Jordan", status: "attended", contributionLevel: "some" },
      { childId: "child-sam", childName: "Sam", status: "declined" },
      { childId: "child-casey", childName: "Casey", status: "attended", contributionLevel: "some" },
    ],
    staffPresent: ["staff-rm-01", "staff-jb-01"],
    agendaItems: [
      { id: "ai-9", topic: "New board games", suggestedBy: "child_suggested", suggestedByName: "Alex", discussed: true, outcome: "Budget agreed for 3 new games", actionRequired: true },
      { id: "ai-10", topic: "Kitchen rules reminder", suggestedBy: "standing_item", discussed: true, outcome: "Discussed — all understand", actionRequired: false },
    ],
    childrenContributedToAgenda: true,
    minutesRecorded: true,
    minutesAccessibleToChildren: true,
    actionsAgreed: [
      { id: "ma-6", meetingId: "hm-003", description: "Order board games from wishlist", assignedTo: "staff-jb-01", dueDate: "2026-05-05T00:00:00Z", status: "completed", completedDate: "2026-05-03T10:00:00Z", childSuggested: true },
    ],
    previousActionsReviewed: true,
    childrenChaired: false,
    snacksProvided: true,
    funElement: false,
  },
  {
    id: "hm-004",
    homeId: "home-oak",
    date: "2026-04-23T17:00:00Z",
    type: "menu_planning",
    facilitatedBy: "staff-kl-02",
    duration: 20,
    childAttendance: [
      { childId: "child-alex", childName: "Alex", status: "attended", contributionLevel: "active" },
      { childId: "child-jordan", childName: "Jordan", status: "declined" },
      { childId: "child-sam", childName: "Sam", status: "attended", contributionLevel: "active" },
      { childId: "child-casey", childName: "Casey", status: "attended", contributionLevel: "some" },
    ],
    staffPresent: ["staff-kl-02"],
    agendaItems: [
      { id: "ai-11", topic: "Next week meal choices", suggestedBy: "standing_item", discussed: true, outcome: "Menu agreed by majority vote", actionRequired: true },
      { id: "ai-12", topic: "Cooking together session", suggestedBy: "child_suggested", suggestedByName: "Sam", discussed: true, outcome: "Wednesday curry night — Sam to help cook", actionRequired: true },
    ],
    childrenContributedToAgenda: true,
    minutesRecorded: true,
    minutesAccessibleToChildren: true,
    actionsAgreed: [
      { id: "ma-7", meetingId: "hm-004", description: "Buy ingredients for Sam's curry", assignedTo: "staff-kl-02", dueDate: "2026-04-26T00:00:00Z", status: "completed", completedDate: "2026-04-25T10:00:00Z", childSuggested: true },
    ],
    previousActionsReviewed: true,
    childrenChaired: true,
    snacksProvided: false,
    funElement: false,
  },
];

const DEMO_PROFILE: HomeMeetingsProfile = {
  homeId: "home-oak",
  meetings: DEMO_MEETINGS,
  meetingFrequencyTarget: "weekly",
  childrenCouncilActive: true,
  childrenCouncilReps: ["Jordan", "Sam"],
  suggestionsBoxAvailable: true,
  previousActionsOutstanding: [],
};

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const homeId = searchParams.get("homeId") || "home-oak";
  const mode = searchParams.get("mode") || "dashboard";
  const now = new Date().toISOString();

  if (mode === "compliance") {
    const result = evaluateMeetingsCompliance(DEMO_PROFILE, now);
    return NextResponse.json(result);
  }

  if (mode === "metrics") {
    const metrics = calculateHomeMeetingsMetrics(DEMO_PROFILE, now);
    return NextResponse.json(metrics);
  }

  // Dashboard mode
  const compliance = evaluateMeetingsCompliance(DEMO_PROFILE, now);
  const metrics = calculateHomeMeetingsMetrics(DEMO_PROFILE, now);

  const recentMeetings = DEMO_MEETINGS
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map(m => ({
      id: m.id,
      date: m.date,
      type: m.type,
      duration: m.duration,
      attendance: m.childAttendance.filter(a => a.status === "attended").length,
      totalChildren: m.childAttendance.filter(a => a.status !== "not_invited").length,
      childrenChaired: m.childrenChaired,
      actionsCount: m.actionsAgreed.length,
      childAgendaItems: m.agendaItems.filter(a => a.suggestedBy === "child_suggested").length,
      totalAgendaItems: m.agendaItems.length,
    }));

  return NextResponse.json({
    compliance: {
      isCompliant: compliance.isCompliant,
      frequencyAdequate: compliance.frequencyAdequate,
      daysSinceLastMeeting: compliance.daysSinceLastMeeting,
      averageAttendanceRate: compliance.averageAttendanceRate,
      childAgendaRate: compliance.childAgendaRate,
      childrenChairedRate: compliance.childrenChairedRate,
      actionsCompletedRate: compliance.actionsCompletedRate,
      actionsOverdue: compliance.actionsOverdue,
      minutesRecordedRate: compliance.minutesRecordedRate,
      childrenNeverAttending: compliance.childrenNeverAttending,
      issues: compliance.issues,
      warnings: compliance.warnings,
    },
    metrics: {
      overallScore: metrics.overallScore,
      participationScore: metrics.participationScore,
      governanceScore: metrics.governanceScore,
      actionFollowThroughScore: metrics.actionFollowThroughScore,
      totalMeetingsLast90Days: metrics.totalMeetingsLast90Days,
      nextMeetingDue: metrics.nextMeetingDue,
      overdueActions: metrics.overdueActions,
    },
    recentMeetings,
    governance: {
      childrenCouncilActive: DEMO_PROFILE.childrenCouncilActive,
      childrenCouncilReps: DEMO_PROFILE.childrenCouncilReps,
      suggestionsBoxAvailable: DEMO_PROFILE.suggestionsBoxAvailable,
      meetingFrequencyTarget: DEMO_PROFILE.meetingFrequencyTarget,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, profile, now } = body;

  if (action === "evaluate" && profile) {
    const result = evaluateMeetingsCompliance(profile, now);
    return NextResponse.json(result);
  }

  if (action === "metrics" && profile) {
    const result = calculateHomeMeetingsMetrics(profile, now);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
