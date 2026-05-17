// ══════════════════════════════════════════════════════════════════════════════
// HouseMeetingsDashboardWidget — House Meetings & Children's Council card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface RecentMeeting {
  id: string;
  date: string;
  type: string;
  duration: number;
  attendance: number;
  totalChildren: number;
  childrenChaired: boolean;
  actionsCount: number;
  childAgendaItems: number;
  totalAgendaItems: number;
}

interface Compliance {
  isCompliant: boolean;
  frequencyAdequate: boolean;
  daysSinceLastMeeting: number;
  averageAttendanceRate: number;
  childAgendaRate: number;
  childrenChairedRate: number;
  actionsCompletedRate: number;
  actionsOverdue: number;
  minutesRecordedRate: number;
  childrenNeverAttending: string[];
  issues: string[];
  warnings: string[];
}

interface Metrics {
  overallScore: number;
  participationScore: number;
  governanceScore: number;
  actionFollowThroughScore: number;
  totalMeetingsLast90Days: number;
  nextMeetingDue: string;
  overdueActions: number;
}

interface Governance {
  childrenCouncilActive: boolean;
  childrenCouncilReps: string[];
  suggestionsBoxAvailable: boolean;
  meetingFrequencyTarget: string;
}

interface DashboardData {
  compliance: Compliance;
  metrics: Metrics;
  recentMeetings: RecentMeeting[];
  governance: Governance;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getMeetingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    house_meeting: "House Meeting",
    childrens_council: "Children's Council",
    menu_planning: "Menu Planning",
    activity_planning: "Activity Planning",
    rules_review: "Rules Review",
    special_topic: "Special Topic",
  };
  return labels[type] ?? type;
}

function getScoreColour(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

// ── Component ────────────────────────────────────────────────────────────────

export function HouseMeetingsDashboardWidget() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/house-meetings?homeId=home-oak&mode=dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch meetings data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700 text-sm">Error loading meetings data: {error}</p>
      </div>
    );
  }

  const { compliance, metrics, recentMeetings, governance } = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            House Meetings & Children's Voice
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Collective voice, agenda ownership, action tracking
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColour(metrics.overallScore)}`}>
            {metrics.overallScore}%
          </p>
          <p className="text-xs text-slate-400">overall score</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Participation"
          value={`${metrics.participationScore}%`}
          sub={`${compliance.averageAttendanceRate}% attendance`}
          score={metrics.participationScore}
        />
        <MetricCard
          label="Child Agenda"
          value={`${compliance.childAgendaRate}%`}
          sub="items from children"
          score={compliance.childAgendaRate}
        />
        <MetricCard
          label="Actions Done"
          value={`${compliance.actionsCompletedRate}%`}
          sub={`${compliance.actionsOverdue} overdue`}
          score={compliance.actionsCompletedRate}
        />
        <MetricCard
          label="Governance"
          value={`${metrics.governanceScore}%`}
          sub={governance.childrenCouncilActive ? "Council active" : "No council"}
          score={metrics.governanceScore}
        />
      </div>

      {/* Frequency Status */}
      <div className={`flex items-center justify-between p-3 rounded-lg ${compliance.frequencyAdequate ? "bg-green-50" : "bg-red-50"}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${compliance.frequencyAdequate ? "text-green-600" : "text-red-600"}`}>
            {compliance.frequencyAdequate ? "✓" : "!"}
          </span>
          <span className="text-sm text-slate-700">
            {compliance.daysSinceLastMeeting === 999
              ? "No meetings recorded"
              : `Last meeting ${compliance.daysSinceLastMeeting} day(s) ago`}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          Target: {governance.meetingFrequencyTarget} &middot; Next due: {formatDate(metrics.nextMeetingDue)}
        </span>
      </div>

      {/* Recent Meetings */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Meetings</h4>
        <div className="space-y-2">
          {recentMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-12">{formatDate(meeting.date)}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {getMeetingTypeLabel(meeting.type)}
                    {meeting.childrenChaired && (
                      <span className="ml-2 text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                        Child-chaired
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    {meeting.attendance}/{meeting.totalChildren} attended &middot;{" "}
                    {meeting.childAgendaItems}/{meeting.totalAgendaItems} child agenda items &middot;{" "}
                    {meeting.actionsCount} actions
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400">{meeting.duration}min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Alerts */}
      {compliance.childrenNeverAttending.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-1">Engagement Concern</h4>
          <p className="text-xs text-amber-700">
            {compliance.childrenNeverAttending.join(", ")} not attending meetings — explore barriers and alternative ways to participate
          </p>
        </div>
      )}

      {/* Compliance Issues */}
      {compliance.issues.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Issues ({compliance.issues.length})</h4>
          <ul className="space-y-1">
            {compliance.issues.map((issue, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <MiniStat
            label="Children chaired"
            value={`${compliance.childrenChairedRate}%`}
          />
          <MiniStat
            label="Meetings (90d)"
            value={String(metrics.totalMeetingsLast90Days)}
          />
          {governance.childrenCouncilActive && (
            <MiniStat
              label="Council reps"
              value={governance.childrenCouncilReps?.join(", ") || "None"}
            />
          )}
        </div>
        <span className="text-xs text-slate-400">
          Reg 7 &middot; UNCRC Art 12/15
        </span>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  score,
}: {
  label: string;
  value: string;
  sub: string;
  score: number;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${getScoreColour(score)}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">{label}:</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
