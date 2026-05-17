// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone House Meetings & Children's Council Engine
//
// Deterministic engine for evaluating house meeting governance, children's
// collective voice, agenda ownership, action tracking, and compliance with
// participation requirements.
//
// Aligned to:
//   - CHR 2015 Reg 7 — Children's wishes and feelings (collective)
//   - CHR 2015 Reg 5 — Quality and purpose of care
//   - SCCIF — Children's voice in day-to-day running of home
//   - UNCRC Article 12 — Right to be heard
//   - UNCRC Article 15 — Freedom of association/assembly
//
// Key requirements:
//   - Regular house meetings (minimum weekly or fortnightly)
//   - Children set/contribute to agenda
//   - Minutes accessible to all children
//   - Actions arising from meetings tracked and completed
//   - Children can raise concerns collectively
//   - Staff facilitate but don't dominate
//   - Food, activities, rules, environment all discussable
//   - Outcomes fed into home improvement
//   - Attendance tracked (voluntary but encouraged)
//   - Children's council/reps for older children where appropriate
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type MeetingType =
  | "house_meeting"
  | "childrens_council"
  | "menu_planning"
  | "activity_planning"
  | "rules_review"
  | "special_topic";

export type AgendaSource =
  | "child_suggested"
  | "staff_suggested"
  | "standing_item"
  | "action_review";

export type ActionStatus = "open" | "in_progress" | "completed" | "overdue" | "cancelled";

export type AttendanceStatus = "attended" | "declined" | "absent" | "not_invited";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface AgendaItem {
  id: string;
  topic: string;
  suggestedBy: AgendaSource;
  suggestedByName?: string;                // child's name if child-suggested
  discussed: boolean;
  outcome?: string;
  actionRequired: boolean;
}

export interface MeetingAction {
  id: string;
  meetingId: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: ActionStatus;
  completedDate?: string;
  feedbackToChildren?: string;
  childSuggested: boolean;
}

export interface MeetingAttendance {
  childId: string;
  childName: string;
  status: AttendanceStatus;
  contributionLevel?: "active" | "some" | "minimal" | "observer";
}

export interface HouseMeeting {
  id: string;
  homeId: string;
  date: string;
  type: MeetingType;
  facilitatedBy: string;
  duration: number;                        // minutes
  // Attendance
  childAttendance: MeetingAttendance[];
  staffPresent: string[];
  // Agenda
  agendaItems: AgendaItem[];
  childrenContributedToAgenda: boolean;
  // Content
  minutesRecorded: boolean;
  minutesAccessibleToChildren: boolean;
  // Actions
  actionsAgreed: MeetingAction[];
  previousActionsReviewed: boolean;
  // Quality
  childrenChaired: boolean;
  snacksProvided: boolean;
  funElement: boolean;                     // game/activity included
  // Notes
  staffNotes?: string;
  childFeedback?: string;
}

export interface HomeMeetingsProfile {
  homeId: string;
  meetings: HouseMeeting[];
  meetingFrequencyTarget: "weekly" | "fortnightly" | "monthly";
  childrenCouncilActive: boolean;
  childrenCouncilReps?: string[];
  suggestionsBoxAvailable: boolean;
  previousActionsOutstanding: MeetingAction[];
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface MeetingsComplianceResult {
  homeId: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  // Frequency
  meetingsLast30Days: number;
  meetingsLast90Days: number;
  frequencyAdequate: boolean;
  daysSinceLastMeeting: number;
  // Participation
  averageAttendanceRate: number;           // %
  averageContributionLevel: string;
  childAgendaRate: number;                 // % of agenda items from children
  childrenChairedRate: number;             // % of meetings chaired by children
  // Quality
  minutesRecordedRate: number;             // %
  minutesAccessibleRate: number;           // %
  previousActionsReviewedRate: number;     // %
  // Actions
  totalActionsCreated: number;
  actionsCompletedRate: number;            // %
  actionsOverdue: number;
  childSuggestedActionsRate: number;       // %
  // Engagement
  childrenNeverAttending: string[];
  childrenAlwaysAttending: string[];
  // Governance
  childrenCouncilActive: boolean;
  suggestionsBoxAvailable: boolean;
}

export interface HomeMeetingsMetrics {
  homeId: string;
  // Activity
  totalMeetingsLast90Days: number;
  frequencyMet: boolean;
  nextMeetingDue: string;                  // ISO date
  daysSinceLastMeeting: number;
  // Scores
  participationScore: number;              // 0-100
  governanceScore: number;                 // 0-100
  actionFollowThroughScore: number;        // 0-100
  overallScore: number;                    // 0-100
  // Breakdown
  averageAttendance: number;
  childAgendaRate: number;
  actionCompletionRate: number;
  overdueActions: number;
  // Meeting types
  meetingsByType: { type: string; count: number }[];
  // Issues
  complianceIssues: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const FREQUENCY_TARGETS: Record<string, number> = {
  weekly: 7,
  fortnightly: 14,
  monthly: 30,
};

// ── Core: Evaluate Meetings Compliance ────────────────────────────────────

export function evaluateMeetingsCompliance(
  profile: HomeMeetingsProfile,
  now?: string,
): MeetingsComplianceResult {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const thirtyDaysAgo = currentTime - 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;

  const issues: string[] = [];
  const warnings: string[] = [];

  // Recent meetings
  const meetings30 = profile.meetings.filter(m => new Date(m.date).getTime() > thirtyDaysAgo);
  const meetings90 = profile.meetings.filter(m => new Date(m.date).getTime() > ninetyDaysAgo);

  const meetingsLast30Days = meetings30.length;
  const meetingsLast90Days = meetings90.length;

  // Frequency check
  const targetDays = FREQUENCY_TARGETS[profile.meetingFrequencyTarget] || 14;
  const sortedMeetings = [...profile.meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastMeetingDate = sortedMeetings[0]?.date;
  const daysSinceLastMeeting = lastMeetingDate
    ? Math.round((currentTime - new Date(lastMeetingDate).getTime()) / (24 * 60 * 60 * 1000))
    : 999;

  const frequencyAdequate = daysSinceLastMeeting <= targetDays + 3; // 3 day grace
  if (!frequencyAdequate) {
    issues.push(`No house meeting in ${daysSinceLastMeeting} days (target: ${profile.meetingFrequencyTarget})`);
  }

  // Attendance
  const allAttendances = meetings90.flatMap(m => m.childAttendance);
  const attendedCount = allAttendances.filter(a => a.status === "attended").length;
  const totalInvited = allAttendances.filter(a => a.status !== "not_invited").length;
  const averageAttendanceRate = totalInvited > 0
    ? Math.round((attendedCount / totalInvited) * 100)
    : 0;

  if (averageAttendanceRate < 50) {
    warnings.push(`Low meeting attendance (${averageAttendanceRate}%) — review engagement approach`);
  }

  // Contribution level
  const contributions = allAttendances
    .filter(a => a.status === "attended" && a.contributionLevel)
    .map(a => a.contributionLevel!);
  const contributionScores: Record<string, number> = { active: 3, some: 2, minimal: 1, observer: 0 };
  const avgContribution = contributions.length > 0
    ? contributions.reduce((s, c) => s + contributionScores[c], 0) / contributions.length
    : 0;
  const averageContributionLevel = avgContribution >= 2.5 ? "active" : avgContribution >= 1.5 ? "some" : avgContribution >= 0.5 ? "minimal" : "observer";

  // Child agenda
  const allAgendaItems = meetings90.flatMap(m => m.agendaItems);
  const childSuggestedItems = allAgendaItems.filter(a => a.suggestedBy === "child_suggested");
  const childAgendaRate = allAgendaItems.length > 0
    ? Math.round((childSuggestedItems.length / allAgendaItems.length) * 100)
    : 0;

  if (meetings90.length > 0 && childAgendaRate < 20) {
    warnings.push("Less than 20% of agenda items suggested by children");
  }

  // Children chaired
  const childChaired = meetings90.filter(m => m.childrenChaired).length;
  const childrenChairedRate = meetings90.length > 0
    ? Math.round((childChaired / meetings90.length) * 100)
    : 0;

  // Minutes
  const withMinutes = meetings90.filter(m => m.minutesRecorded);
  const minutesRecordedRate = meetings90.length > 0
    ? Math.round((withMinutes.length / meetings90.length) * 100)
    : 100;

  if (meetings90.length > 0 && minutesRecordedRate < 100) {
    issues.push(`Minutes not recorded for ${meetings90.length - withMinutes.length} meeting(s)`);
  }

  const accessibleMinutes = meetings90.filter(m => m.minutesAccessibleToChildren);
  const minutesAccessibleRate = meetings90.length > 0
    ? Math.round((accessibleMinutes.length / meetings90.length) * 100)
    : 100;

  if (meetings90.length > 0 && minutesAccessibleRate < 100) {
    warnings.push("Meeting minutes not always accessible to children");
  }

  // Previous actions reviewed
  const actionsReviewed = meetings90.filter(m => m.previousActionsReviewed);
  const previousActionsReviewedRate = meetings90.length > 0
    ? Math.round((actionsReviewed.length / meetings90.length) * 100)
    : 100;

  if (meetings90.length > 2 && previousActionsReviewedRate < 75) {
    warnings.push("Previous actions not consistently reviewed in meetings");
  }

  // Actions
  const allActions = [...meetings90.flatMap(m => m.actionsAgreed), ...profile.previousActionsOutstanding];
  const totalActionsCreated = allActions.length;
  const completed = allActions.filter(a => a.status === "completed").length;
  const actionsCompletedRate = totalActionsCreated > 0
    ? Math.round((completed / totalActionsCreated) * 100)
    : 100;
  const actionsOverdue = allActions.filter(a => a.status === "overdue").length;
  const childSuggested = allActions.filter(a => a.childSuggested).length;
  const childSuggestedActionsRate = totalActionsCreated > 0
    ? Math.round((childSuggested / totalActionsCreated) * 100)
    : 0;

  if (actionsOverdue > 0) {
    warnings.push(`${actionsOverdue} overdue action(s) from house meetings`);
  }

  if (totalActionsCreated > 0 && actionsCompletedRate < 50) {
    issues.push(`Low action completion rate (${actionsCompletedRate}%) — children may lose trust in process`);
  }

  // Children never/always attending
  const childAttendanceCounts: Record<string, { attended: number; total: number; name: string }> = {};
  meetings90.forEach(m => {
    m.childAttendance.forEach(a => {
      if (a.status === "not_invited") return;
      if (!childAttendanceCounts[a.childId]) {
        childAttendanceCounts[a.childId] = { attended: 0, total: 0, name: a.childName };
      }
      childAttendanceCounts[a.childId].total++;
      if (a.status === "attended") childAttendanceCounts[a.childId].attended++;
    });
  });

  const childrenNeverAttending = Object.entries(childAttendanceCounts)
    .filter(([, v]) => v.attended === 0 && v.total >= 2)
    .map(([, v]) => v.name);

  const childrenAlwaysAttending = Object.entries(childAttendanceCounts)
    .filter(([, v]) => v.attended === v.total && v.total >= 2)
    .map(([, v]) => v.name);

  if (childrenNeverAttending.length > 0) {
    warnings.push(`${childrenNeverAttending.join(", ")} never attending meetings — explore barriers`);
  }

  // Governance
  if (!profile.suggestionsBoxAvailable) {
    warnings.push("No suggestions box available for children between meetings");
  }

  return {
    homeId: profile.homeId,
    isCompliant: issues.length === 0,
    issues,
    warnings,
    meetingsLast30Days,
    meetingsLast90Days,
    frequencyAdequate,
    daysSinceLastMeeting,
    averageAttendanceRate,
    averageContributionLevel,
    childAgendaRate,
    childrenChairedRate,
    minutesRecordedRate,
    minutesAccessibleRate,
    previousActionsReviewedRate,
    totalActionsCreated,
    actionsCompletedRate,
    actionsOverdue,
    childSuggestedActionsRate,
    childrenNeverAttending,
    childrenAlwaysAttending,
    childrenCouncilActive: profile.childrenCouncilActive,
    suggestionsBoxAvailable: profile.suggestionsBoxAvailable,
  };
}

// ── Core: Calculate Home Meetings Metrics ─────────────────────────────────

export function calculateHomeMeetingsMetrics(
  profile: HomeMeetingsProfile,
  now?: string,
): HomeMeetingsMetrics {
  const currentTime = now ? new Date(now).getTime() : Date.now();
  const compliance = evaluateMeetingsCompliance(profile, now);

  // Next meeting due
  const targetDays = FREQUENCY_TARGETS[profile.meetingFrequencyTarget] || 14;
  const sortedMeetings = [...profile.meetings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastMeetingTime = sortedMeetings[0]
    ? new Date(sortedMeetings[0].date).getTime()
    : currentTime - targetDays * 24 * 60 * 60 * 1000;
  const nextMeetingDue = new Date(lastMeetingTime + targetDays * 24 * 60 * 60 * 1000).toISOString();

  // Participation score
  const participationScore = Math.round(
    (compliance.averageAttendanceRate * 0.4) +
    (compliance.childAgendaRate * 0.3) +
    (compliance.childrenChairedRate * 0.3)
  );

  // Governance score
  let governanceScore = 0;
  if (compliance.minutesRecordedRate >= 100) governanceScore += 30;
  else governanceScore += Math.round(compliance.minutesRecordedRate * 0.3);
  if (compliance.minutesAccessibleRate >= 100) governanceScore += 20;
  if (profile.childrenCouncilActive) governanceScore += 20;
  if (profile.suggestionsBoxAvailable) governanceScore += 15;
  if (compliance.frequencyAdequate) governanceScore += 15;

  // Action follow-through score
  const actionFollowThroughScore = Math.round(
    (compliance.actionsCompletedRate * 0.6) +
    (compliance.previousActionsReviewedRate * 0.4)
  );

  const overallScore = Math.round(
    participationScore * 0.35 +
    governanceScore * 0.35 +
    actionFollowThroughScore * 0.3
  );

  // Meeting types
  const ninetyDaysAgo = currentTime - 90 * 24 * 60 * 60 * 1000;
  const meetings90 = profile.meetings.filter(m => new Date(m.date).getTime() > ninetyDaysAgo);
  const typeCounts: Record<string, number> = {};
  meetings90.forEach(m => { typeCounts[m.type] = (typeCounts[m.type] || 0) + 1; });
  const meetingsByType = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    homeId: profile.homeId,
    totalMeetingsLast90Days: compliance.meetingsLast90Days,
    frequencyMet: compliance.frequencyAdequate,
    nextMeetingDue,
    daysSinceLastMeeting: compliance.daysSinceLastMeeting,
    participationScore,
    governanceScore,
    actionFollowThroughScore,
    overallScore,
    averageAttendance: compliance.averageAttendanceRate,
    childAgendaRate: compliance.childAgendaRate,
    actionCompletionRate: compliance.actionsCompletedRate,
    overdueActions: compliance.actionsOverdue,
    meetingsByType,
    complianceIssues: compliance.issues,
  };
}

// ── Label Helpers ────────────────────────────────────────────────────────

export function getMeetingTypeLabel(type: MeetingType): string {
  const labels: Record<MeetingType, string> = {
    house_meeting: "House Meeting",
    childrens_council: "Children's Council",
    menu_planning: "Menu Planning",
    activity_planning: "Activity Planning",
    rules_review: "Rules Review",
    special_topic: "Special Topic",
  };
  return labels[type] ?? type;
}

export function getActionStatusLabel(status: ActionStatus): string {
  const labels: Record<ActionStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    completed: "Completed",
    overdue: "Overdue",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}
