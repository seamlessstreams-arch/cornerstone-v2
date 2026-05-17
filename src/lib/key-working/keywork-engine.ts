// ══════════════════════════════════════════════════════════════════════════════
// Cornerstone Key Working Engine
//
// Deterministic engine for managing keywork sessions, plans, relationship
// quality, and regulatory compliance for children's residential care.
//
// Aligned to:
//   - CHR 2015 Reg 10 — The duty of the registered person (care plan)
//   - CHR 2015 Reg 14 — The care planning standard
//   - SCCIF Framework — Quality of care judgement area
//   - Quality Standards 2015 — Standard 3 (aspirations, views, wishes)
//   - DfE Guide to CRH — Keywork as therapeutic relationship
//
// Keywork in residential care is:
//   - Regular 1:1 time between named keyworker and child
//   - Building trusted relationship for therapeutic work
//   - Advocacy for the child's wishes and feelings
//   - Direct work on care plan goals
//   - Monitoring emotional wellbeing
//   - Preparing for LAC reviews, education reviews, transitions
//
// No AI. No external calls. Pure input → output.
// ══════════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type SessionType =
  | "formal_keywork"          // planned, structured 1:1
  | "informal_check_in"      // casual, relationship-building
  | "direct_work"            // therapeutic activity
  | "life_story_work"        // exploring identity and history
  | "preparation"            // prep for review/meeting/transition
  | "crisis_support"         // unplanned support during crisis
  | "celebration"            // acknowledging achievements
  | "goal_review";           // reviewing care plan goals

export type SessionOutcome =
  | "completed"
  | "partially_completed"
  | "child_declined"
  | "staff_unavailable"
  | "postponed"
  | "cancelled_by_home";

export type EngagementLevel = 1 | 2 | 3 | 4 | 5;
// 1 = Refused / withdrew completely
// 2 = Minimal engagement, monosyllabic
// 3 = Moderate — participated but guarded
// 4 = Good engagement — shared openly
// 5 = Excellent — fully engaged, initiated discussion

export type MoodRating = 1 | 2 | 3 | 4 | 5;
// 1 = Very low / distressed
// 2 = Low / withdrawn
// 3 = Neutral / OK
// 4 = Positive / cheerful
// 5 = Very positive / upbeat

export type RelationshipQuality = "strong" | "developing" | "strained" | "new" | "breakdown";

// ── Core Interfaces ────────────────────────────────────────────────────────

export interface KeyworkSession {
  id: string;
  childId: string;
  childName: string;
  keyworkerId: string;
  keyworkerName: string;
  homeId: string;

  // Session details
  sessionType: SessionType;
  plannedDate: string;
  actualDate?: string;
  durationMinutes: number;
  location: string;
  outcome: SessionOutcome;

  // Engagement
  engagementLevel: EngagementLevel;
  moodBefore: MoodRating;
  moodAfter: MoodRating;

  // Content
  topicsDiscussed: string[];
  childVoice: string;            // child's own words/views
  goalsWorkedOn: string[];
  achievementsNoted: string[];
  concernsRaised: string[];

  // Actions
  actionsAgreed: KeyworkAction[];
  followUpRequired: boolean;
  followUpDetails?: string;

  // Metadata
  notes: string;
  linkedToCarePlanGoal?: string;
  createdAt: string;
  signedOff: boolean;
  signedOffBy?: string;
}

export interface KeyworkAction {
  description: string;
  assignedTo: "keyworker" | "child" | "other_staff" | "social_worker" | "manager";
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface KeyworkAllocation {
  childId: string;
  childName: string;
  primaryKeyworkerId: string;
  primaryKeyworkerName: string;
  secondaryKeyworkerId?: string;
  secondaryKeyworkerName?: string;
  allocatedSince: string;
  expectedFrequency: "weekly" | "fortnightly" | "as_needed";
  relationshipQuality: RelationshipQuality;
}

// ── Result Interfaces ──────────────────────────────────────────────────────

export interface KeyworkComplianceResult {
  childId: string;
  childName: string;
  keyworkerId: string;
  isCompliant: boolean;
  issues: string[];
  sessionsThisMonth: number;
  expectedSessionsThisMonth: number;
  lastSessionDate: string | null;
  daysSinceLastSession: number | null;
  averageEngagement: number;
  childVoiceRecorded: boolean;
  actionsOverdue: number;
}

export interface KeyworkMetrics {
  homeId: string;
  totalSessions: number;
  sessionsThisMonth: number;
  sessionsThisQuarter: number;
  completionRate: number;           // % sessions completed vs planned
  declinedRate: number;             // % child declined
  averageEngagement: number;        // mean engagement across all sessions
  averageDuration: number;          // mean minutes
  moodImprovementRate: number;      // % sessions where mood improved
  childVoiceRate: number;           // % sessions with child voice recorded
  goalProgressRate: number;         // % sessions linked to care plan goals
  complianceRate: number;           // % children meeting frequency requirement
  byChild: ChildKeyworkSummary[];
  bySessionType: { type: SessionType; count: number }[];
  trendsOverTime: MonthlyKeyworkStat[];
}

export interface ChildKeyworkSummary {
  childId: string;
  childName: string;
  keyworkerName: string;
  totalSessions: number;
  sessionsThisMonth: number;
  lastSession: string | null;
  averageEngagement: number;
  averageMoodChange: number;        // positive = improvement
  relationshipQuality: RelationshipQuality;
  isCompliant: boolean;
  overdueActions: number;
}

export interface MonthlyKeyworkStat {
  month: string;                    // YYYY-MM
  sessions: number;
  avgEngagement: number;
  completionRate: number;
}

export interface KeyworkInsights {
  childId: string;
  engagementTrend: "improving" | "stable" | "declining";
  moodTrend: "improving" | "stable" | "declining";
  strongTopics: string[];           // topics that drive high engagement
  avoidedTopics: string[];          // topics linked to low engagement / decline
  bestTimeOfDay: string;            // when child engages most
  optimalDuration: number;          // minutes before engagement drops
  relationshipStrength: number;     // 0-100 composite score
  recommendations: string[];
}

// ── Configuration ──────────────────────────────────────────────────────────

const MIN_SESSIONS_PER_MONTH_WEEKLY = 4;
const MIN_SESSIONS_PER_MONTH_FORTNIGHTLY = 2;
const MAX_DAYS_BETWEEN_SESSIONS = 14;          // flag if > 14 days since last
const MIN_SESSION_DURATION = 15;               // less than 15 min is a concern
const VOICE_RECORDING_THRESHOLD = 10;          // at least 10 chars of child voice

// ── Core: Evaluate Compliance Per Child ────────────────────────────────────

export function evaluateKeyworkCompliance(
  sessions: KeyworkSession[],
  allocation: KeyworkAllocation,
  now?: string,
): KeyworkComplianceResult {
  const currentDate = now ? new Date(now) : new Date();
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const issues: string[] = [];

  const childSessions = sessions.filter(
    s => s.childId === allocation.childId && s.keyworkerId === allocation.primaryKeyworkerId
  );

  const completedSessions = childSessions.filter(s => s.outcome === "completed" || s.outcome === "partially_completed");
  const thisMonthSessions = completedSessions.filter(s => {
    const sessionDate = new Date(s.actualDate ?? s.plannedDate);
    return sessionDate >= thisMonth;
  });

  // Expected frequency
  const expectedPerMonth = allocation.expectedFrequency === "weekly"
    ? MIN_SESSIONS_PER_MONTH_WEEKLY
    : allocation.expectedFrequency === "fortnightly"
    ? MIN_SESSIONS_PER_MONTH_FORTNIGHTLY
    : 1;

  if (thisMonthSessions.length < expectedPerMonth) {
    issues.push(
      `Only ${thisMonthSessions.length} session(s) this month — minimum ${expectedPerMonth} required for ${allocation.expectedFrequency} frequency.`
    );
  }

  // Days since last session
  const sortedSessions = completedSessions
    .sort((a, b) => new Date(b.actualDate ?? b.plannedDate).getTime() - new Date(a.actualDate ?? a.plannedDate).getTime());
  const lastSession = sortedSessions[0];
  const lastSessionDate = lastSession ? (lastSession.actualDate ?? lastSession.plannedDate) : null;
  let daysSinceLastSession: number | null = null;

  if (lastSessionDate) {
    daysSinceLastSession = Math.floor((currentDate.getTime() - new Date(lastSessionDate).getTime()) / (24 * 60 * 60 * 1000));
    if (daysSinceLastSession > MAX_DAYS_BETWEEN_SESSIONS) {
      issues.push(`${daysSinceLastSession} days since last keywork session (max: ${MAX_DAYS_BETWEEN_SESSIONS} days).`);
    }
  } else {
    issues.push("No completed keywork sessions found for this child/keyworker pairing.");
  }

  // Average engagement
  const engagements = completedSessions.map(s => s.engagementLevel);
  const averageEngagement = engagements.length > 0
    ? Math.round((engagements.reduce((a, b) => a + b, 0) / engagements.length) * 10) / 10
    : 0;

  if (averageEngagement > 0 && averageEngagement < 2.5) {
    issues.push(`Low average engagement (${averageEngagement}/5) — consider relationship review.`);
  }

  // Child voice recorded
  const voiceRecorded = completedSessions.some(s =>
    s.childVoice && s.childVoice.trim().length >= VOICE_RECORDING_THRESHOLD
  );
  if (!voiceRecorded && completedSessions.length > 0) {
    issues.push("Child's voice/views not recorded in any completed session.");
  }

  // Overdue actions
  const allActions = completedSessions.flatMap(s => s.actionsAgreed);
  const overdueActions = allActions.filter(a =>
    !a.completed && new Date(a.dueDate) < currentDate
  ).length;
  if (overdueActions > 0) {
    issues.push(`${overdueActions} overdue action(s) from previous sessions.`);
  }

  return {
    childId: allocation.childId,
    childName: allocation.childName,
    keyworkerId: allocation.primaryKeyworkerId,
    isCompliant: issues.length === 0,
    issues,
    sessionsThisMonth: thisMonthSessions.length,
    expectedSessionsThisMonth: expectedPerMonth,
    lastSessionDate,
    daysSinceLastSession,
    averageEngagement,
    childVoiceRecorded: voiceRecorded,
    actionsOverdue: overdueActions,
  };
}

// ── Core: Home-Level Metrics ─────────────────────────────────────────────

export function calculateKeyworkMetrics(
  sessions: KeyworkSession[],
  allocations: KeyworkAllocation[],
  homeId: string,
  now?: string,
): KeyworkMetrics {
  const currentDate = now ? new Date(now) : new Date();
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const thisQuarter = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);

  const homeSessions = sessions.filter(s => s.homeId === homeId);
  const completed = homeSessions.filter(s => s.outcome === "completed" || s.outcome === "partially_completed");
  const declined = homeSessions.filter(s => s.outcome === "child_declined");

  const sessionsThisMonth = completed.filter(s => new Date(s.actualDate ?? s.plannedDate) >= thisMonth).length;
  const sessionsThisQuarter = completed.filter(s => new Date(s.actualDate ?? s.plannedDate) >= thisQuarter).length;

  // Rates
  const completionRate = homeSessions.length > 0
    ? Math.round((completed.length / homeSessions.length) * 100) : 100;
  const declinedRate = homeSessions.length > 0
    ? Math.round((declined.length / homeSessions.length) * 100) : 0;

  // Averages
  const engagements = completed.map(s => s.engagementLevel);
  const averageEngagement = engagements.length > 0
    ? Math.round((engagements.reduce((a, b) => a + b, 0) / engagements.length) * 10) / 10 : 0;

  const durations = completed.map(s => s.durationMinutes);
  const averageDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  // Mood improvement
  const moodImproved = completed.filter(s => s.moodAfter > s.moodBefore).length;
  const moodImprovementRate = completed.length > 0
    ? Math.round((moodImproved / completed.length) * 100) : 0;

  // Child voice
  const voiceRecorded = completed.filter(s =>
    s.childVoice && s.childVoice.trim().length >= VOICE_RECORDING_THRESHOLD
  ).length;
  const childVoiceRate = completed.length > 0
    ? Math.round((voiceRecorded / completed.length) * 100) : 0;

  // Goal progress
  const linkedToGoal = completed.filter(s => s.goalsWorkedOn.length > 0).length;
  const goalProgressRate = completed.length > 0
    ? Math.round((linkedToGoal / completed.length) * 100) : 0;

  // Per-child compliance
  const homeAllocations = allocations.filter(a =>
    sessions.some(s => s.childId === a.childId && s.homeId === homeId)
  );
  const complianceResults = homeAllocations.map(a =>
    evaluateKeyworkCompliance(sessions, a, now)
  );
  const compliantChildren = complianceResults.filter(r => r.isCompliant).length;
  const complianceRate = homeAllocations.length > 0
    ? Math.round((compliantChildren / homeAllocations.length) * 100) : 100;

  // By child
  const byChild: ChildKeyworkSummary[] = homeAllocations.map(allocation => {
    const childSessions = completed.filter(s => s.childId === allocation.childId);
    const thisMonthChild = childSessions.filter(s => new Date(s.actualDate ?? s.plannedDate) >= thisMonth);
    const childEngagements = childSessions.map(s => s.engagementLevel);
    const avgEng = childEngagements.length > 0
      ? Math.round((childEngagements.reduce((a, b) => a + b, 0) / childEngagements.length) * 10) / 10 : 0;
    const moodChanges = childSessions.map(s => s.moodAfter - s.moodBefore);
    const avgMoodChange = moodChanges.length > 0
      ? Math.round((moodChanges.reduce((a, b) => a + b, 0) / moodChanges.length) * 10) / 10 : 0;

    const sorted = childSessions.sort((a, b) =>
      new Date(b.actualDate ?? b.plannedDate).getTime() - new Date(a.actualDate ?? a.plannedDate).getTime()
    );

    const compliance = complianceResults.find(r => r.childId === allocation.childId);

    return {
      childId: allocation.childId,
      childName: allocation.childName,
      keyworkerName: allocation.primaryKeyworkerName,
      totalSessions: childSessions.length,
      sessionsThisMonth: thisMonthChild.length,
      lastSession: sorted[0] ? (sorted[0].actualDate ?? sorted[0].plannedDate) : null,
      averageEngagement: avgEng,
      averageMoodChange: avgMoodChange,
      relationshipQuality: allocation.relationshipQuality,
      isCompliant: compliance?.isCompliant ?? true,
      overdueActions: compliance?.actionsOverdue ?? 0,
    };
  });

  // By session type
  const typeCounts = new Map<SessionType, number>();
  for (const s of completed) {
    typeCounts.set(s.sessionType, (typeCounts.get(s.sessionType) ?? 0) + 1);
  }
  const bySessionType = Array.from(typeCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly trends (last 6 months)
  const trendsOverTime: MonthlyKeyworkStat[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0, 23, 59, 59);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

    const monthSessions = homeSessions.filter(s => {
      const d = new Date(s.actualDate ?? s.plannedDate);
      return d >= monthDate && d <= monthEnd;
    });
    const monthCompleted = monthSessions.filter(s => s.outcome === "completed" || s.outcome === "partially_completed");
    const monthEngagements = monthCompleted.map(s => s.engagementLevel);

    trendsOverTime.push({
      month: monthKey,
      sessions: monthCompleted.length,
      avgEngagement: monthEngagements.length > 0
        ? Math.round((monthEngagements.reduce((a, b) => a + b, 0) / monthEngagements.length) * 10) / 10 : 0,
      completionRate: monthSessions.length > 0
        ? Math.round((monthCompleted.length / monthSessions.length) * 100) : 0,
    });
  }

  return {
    homeId,
    totalSessions: homeSessions.length,
    sessionsThisMonth,
    sessionsThisQuarter,
    completionRate,
    declinedRate,
    averageEngagement,
    averageDuration,
    moodImprovementRate,
    childVoiceRate,
    goalProgressRate,
    complianceRate,
    byChild,
    bySessionType,
    trendsOverTime,
  };
}

// ── Core: Child Keywork Insights ─────────────────────────────────────────

export function generateKeyworkInsights(
  sessions: KeyworkSession[],
  childId: string,
): KeyworkInsights {
  const childSessions = sessions.filter(s =>
    s.childId === childId && (s.outcome === "completed" || s.outcome === "partially_completed")
  ).sort((a, b) => new Date(a.actualDate ?? a.plannedDate).getTime() - new Date(b.actualDate ?? b.plannedDate).getTime());

  // Engagement trend (last 5 sessions)
  const recent = childSessions.slice(-5);
  let engagementTrend: KeyworkInsights["engagementTrend"] = "stable";
  if (recent.length >= 3) {
    const first = recent.slice(0, 2).reduce((s, r) => s + r.engagementLevel, 0) / 2;
    const last = recent.slice(-2).reduce((s, r) => s + r.engagementLevel, 0) / 2;
    if (last - first >= 0.5) engagementTrend = "improving";
    else if (first - last >= 0.5) engagementTrend = "declining";
  }

  // Mood trend
  let moodTrend: KeyworkInsights["moodTrend"] = "stable";
  if (recent.length >= 3) {
    const firstMood = recent.slice(0, 2).reduce((s, r) => s + r.moodAfter, 0) / 2;
    const lastMood = recent.slice(-2).reduce((s, r) => s + r.moodAfter, 0) / 2;
    if (lastMood - firstMood >= 0.5) moodTrend = "improving";
    else if (firstMood - lastMood >= 0.5) moodTrend = "declining";
  }

  // Topics analysis
  const topicEngagement = new Map<string, { total: number; count: number }>();
  for (const s of childSessions) {
    for (const topic of s.topicsDiscussed) {
      const existing = topicEngagement.get(topic) ?? { total: 0, count: 0 };
      existing.total += s.engagementLevel;
      existing.count += 1;
      topicEngagement.set(topic, existing);
    }
  }

  const topicAvgs = Array.from(topicEngagement.entries()).map(([topic, { total, count }]) => ({
    topic,
    avgEngagement: total / count,
    count,
  }));

  const strongTopics = topicAvgs
    .filter(t => t.avgEngagement >= 4 && t.count >= 2)
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3)
    .map(t => t.topic);

  const avoidedTopics = topicAvgs
    .filter(t => t.avgEngagement <= 2 && t.count >= 2)
    .sort((a, b) => a.avgEngagement - b.avgEngagement)
    .slice(0, 3)
    .map(t => t.topic);

  // Best time of day
  const timeEngagement: Record<string, { total: number; count: number }> = {
    morning: { total: 0, count: 0 },
    afternoon: { total: 0, count: 0 },
    evening: { total: 0, count: 0 },
  };
  for (const s of childSessions) {
    const date = s.actualDate ?? s.plannedDate;
    const hour = new Date(date).getUTCHours();
    const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    timeEngagement[period].total += s.engagementLevel;
    timeEngagement[period].count += 1;
  }
  const bestTime = Object.entries(timeEngagement)
    .filter(([_, v]) => v.count > 0)
    .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))[0];
  const bestTimeOfDay = bestTime ? bestTime[0] : "afternoon";

  // Optimal duration
  const highEngSessions = childSessions.filter(s => s.engagementLevel >= 4);
  const optimalDuration = highEngSessions.length > 0
    ? Math.round(highEngSessions.reduce((s, r) => s + r.durationMinutes, 0) / highEngSessions.length)
    : 30;

  // Relationship strength (composite)
  const avgEngagement = childSessions.length > 0
    ? childSessions.reduce((s, r) => s + r.engagementLevel, 0) / childSessions.length : 0;
  const frequency = childSessions.length; // more sessions = stronger
  const moodImpact = childSessions.filter(s => s.moodAfter > s.moodBefore).length / Math.max(1, childSessions.length);
  const relationshipStrength = Math.min(100, Math.round(
    (avgEngagement / 5) * 40 +
    Math.min(frequency / 10, 1) * 30 +
    moodImpact * 30
  ));

  // Recommendations
  const recommendations: string[] = [];
  if (engagementTrend === "declining") {
    recommendations.push("Engagement declining — consider changing approach or activities.");
  }
  if (moodTrend === "declining") {
    recommendations.push("Mood trend declining — discuss with team and review wellbeing plan.");
  }
  if (childSessions.length > 0 && avgEngagement < 2.5) {
    recommendations.push("Low overall engagement — explore whether a keyworker change is needed.");
  }
  if (strongTopics.length > 0) {
    recommendations.push(`Build on strong engagement topics: ${strongTopics.join(", ")}.`);
  }
  if (avoidedTopics.length > 0) {
    recommendations.push(`Approach with care — low engagement on: ${avoidedTopics.join(", ")}.`);
  }
  if (optimalDuration < 20) {
    recommendations.push("Short optimal session length — consider brief, frequent check-ins.");
  }

  return {
    childId,
    engagementTrend,
    moodTrend,
    strongTopics,
    avoidedTopics,
    bestTimeOfDay,
    optimalDuration,
    relationshipStrength,
    recommendations,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function getSessionTypeLabel(type: SessionType): string {
  const labels: Record<SessionType, string> = {
    formal_keywork: "Formal Keywork",
    informal_check_in: "Informal Check-in",
    direct_work: "Direct Work",
    life_story_work: "Life Story Work",
    preparation: "Preparation",
    crisis_support: "Crisis Support",
    celebration: "Celebration",
    goal_review: "Goal Review",
  };
  return labels[type];
}

export function getOutcomeLabel(outcome: SessionOutcome): string {
  const labels: Record<SessionOutcome, string> = {
    completed: "Completed",
    partially_completed: "Partially Completed",
    child_declined: "Child Declined",
    staff_unavailable: "Staff Unavailable",
    postponed: "Postponed",
    cancelled_by_home: "Cancelled",
  };
  return labels[outcome];
}
