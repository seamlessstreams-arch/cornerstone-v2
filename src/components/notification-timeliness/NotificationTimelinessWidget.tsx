"use client";

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION TIMELINESS INTELLIGENCE DASHBOARD WIDGET
//
// Displays notification timeliness intelligence:
// - Overall score and rating badge
// - Key metrics (on-time %, late %, completeness, acknowledgement)
// - Event-by-event timeliness results
// - Score breakdown
// - Strengths, areas for improvement, actions
// - Regulatory links
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

// ── Interfaces ─────────────────────────────────────────────────────────────

interface EventResult {
  eventId: string;
  type: string;
  category: string;
  title: string;
  ofstedNotifiedOnTime: boolean;
  ofstedDelayHours: number;
  requiredRecipients: string[];
  notifiedRecipients: string[];
  missingRecipients: string[];
  allRecipientsNotified: boolean;
  hasAcknowledgements: boolean;
  acknowledgementRate: number;
  hasFollowUp: boolean;
  issues: string[];
}

interface TimelinessMetrics {
  totalEvents: number;
  schedule5Count: number;
  schedule6Count: number;
  onTimeCount: number;
  lateCount: number;
  notSubmittedCount: number;
  pendingCount: number;
  onTimeRate: number;
  lateRate: number;
  notSubmittedRate: number;
  averageDelayHours: number;
  completenessRate: number;
  acknowledgementRate: number;
  followUpRate: number;
}

interface ScoreBreakdown {
  ofstedTimeliness: number;
  stakeholderNotification: number;
  qualityCompleteness: number;
  policyCompliance: number;
  total: number;
}

interface NotificationTimelinessData {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  metrics: TimelinessMetrics;
  score: ScoreBreakdown;
  rating: string;
  eventResults: EventResult[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
  meta?: {
    ratingLabel: string;
    notificationTypeLabels?: Record<string, string>;
    recipientLabels?: Record<string, string>;
  };
}

// ── Rating Badge ──────────────────────────────────────────────────────────

function RatingBadge({ score, rating, label }: { score: number; rating: string; label?: string }) {
  const colorClass =
    rating === "outstanding" ? "bg-green-100 text-green-800 border-green-300"
      : rating === "good" ? "bg-blue-100 text-blue-800 border-blue-300"
        : rating === "requires_improvement" ? "bg-orange-100 text-orange-800 border-orange-300"
          : "bg-red-100 text-red-800 border-red-300";

  const displayLabel = label
    ?? (rating === "outstanding" ? "Outstanding"
      : rating === "good" ? "Good"
        : rating === "requires_improvement" ? "Requires Improvement"
          : "Inadequate");

  return (
    <div className={`rounded-lg border px-4 py-3 text-center ${colorClass}`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-sm font-medium mt-1">{displayLabel}</div>
    </div>
  );
}

// ── Score Bar ─────────────────────────────────────────────────────────────

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────

function MetricCard({ label, value, suffix, color }: { label: string; value: number | string; suffix?: string; color: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-gray-50">
      <div className={`text-xl font-bold ${color}`}>
        {value}{suffix}
      </div>
      <div className="text-[10px] text-gray-500 uppercase">{label}</div>
    </div>
  );
}

// ── Event Result Card ─────────────────────────────────────────────────────

function EventCard({ event, typeLabels, recipientLabels }: {
  event: EventResult;
  typeLabels?: Record<string, string>;
  recipientLabels?: Record<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);

  const statusColor = event.ofstedNotifiedOnTime
    ? "border-green-200 bg-green-50"
    : event.ofstedDelayHours > 0
      ? "border-red-200 bg-red-50"
      : "border-yellow-200 bg-yellow-50";

  const typeLabel = typeLabels?.[event.type] ?? event.type.replace(/_/g, " ");
  const categoryLabel = event.category === "schedule_5" ? "Sch 5" : "Sch 6";

  return (
    <div className={`rounded-lg border p-3 ${statusColor}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">{event.title}</span>
          <span className="text-[10px] text-gray-500 ml-2 shrink-0">{expanded ? "Hide" : "Details"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-1.5 py-0.5 rounded bg-white border text-gray-600">{categoryLabel}</span>
          <span className="text-gray-500 capitalize">{typeLabel}</span>
          {event.ofstedNotifiedOnTime && (
            <span className="text-green-600 font-medium">On time</span>
          )}
          {!event.ofstedNotifiedOnTime && event.ofstedDelayHours > 0 && (
            <span className="text-red-600 font-medium">{event.ofstedDelayHours}h late</span>
          )}
          {!event.ofstedNotifiedOnTime && event.ofstedDelayHours === 0 && (
            <span className="text-yellow-600 font-medium">Pending</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Recipients notified:</span>{" "}
              <span className="font-medium">{event.notifiedRecipients.length}/{event.requiredRecipients.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Acknowledgement:</span>{" "}
              <span className="font-medium">{event.acknowledgementRate}%</span>
            </div>
            <div>
              <span className="text-gray-500">Follow-up:</span>{" "}
              <span className={`font-medium ${event.hasFollowUp ? "text-green-600" : "text-red-600"}`}>
                {event.hasFollowUp ? "Complete" : "Pending"}
              </span>
            </div>
          </div>

          {event.missingRecipients.length > 0 && (
            <div className="text-xs">
              <span className="text-red-600 font-medium">Missing: </span>
              {event.missingRecipients.map(r => recipientLabels?.[r] ?? r).join(", ")}
            </div>
          )}

          {event.issues.length > 0 && (
            <div className="space-y-0.5">
              {event.issues.map((issue, i) => (
                <div key={i} className="text-[10px] text-red-600">{issue}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Expandable Section ────────────────────────────────────────────────────

function Section({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {title}
        <span className="text-gray-400">{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────

export function NotificationTimelinessWidget() {
  const [data, setData] = useState<NotificationTimelinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/notification-timeliness");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
        <div className="h-24 bg-gray-100 rounded mb-3" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-800">Notification Timeliness Intelligence</h3>
        <p className="text-sm text-red-600 mt-1">{error ?? "No data available"}</p>
      </div>
    );
  }

  const { metrics, score, eventResults } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Notification Timeliness Intelligence
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {metrics.totalEvents} events | Sch 5: {metrics.schedule5Count} | Sch 6: {metrics.schedule6Count} | Reg 40, Sch 5 & 6
          </p>
        </div>
        <RatingBadge
          score={score.total}
          rating={data.rating}
          label={data.meta?.ratingLabel}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MetricCard
          label="On-Time Rate"
          value={metrics.onTimeRate}
          suffix="%"
          color={metrics.onTimeRate >= 80 ? "text-green-700" : metrics.onTimeRate >= 60 ? "text-yellow-700" : "text-red-700"}
        />
        <MetricCard
          label="Late Rate"
          value={metrics.lateRate}
          suffix="%"
          color={metrics.lateRate === 0 ? "text-green-700" : metrics.lateRate <= 20 ? "text-yellow-700" : "text-red-700"}
        />
        <MetricCard
          label="Completeness"
          value={metrics.completenessRate}
          suffix="%"
          color={metrics.completenessRate >= 80 ? "text-green-700" : metrics.completenessRate >= 60 ? "text-yellow-700" : "text-red-700"}
        />
        <MetricCard
          label="Avg Delay"
          value={metrics.averageDelayHours > 0 ? `${metrics.averageDelayHours}h` : "0h"}
          color={metrics.averageDelayHours === 0 ? "text-green-700" : metrics.averageDelayHours <= 12 ? "text-yellow-700" : "text-red-700"}
        />
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <MetricCard
          label="Not Submitted"
          value={metrics.notSubmittedCount}
          color={metrics.notSubmittedCount === 0 ? "text-green-700" : "text-red-700"}
        />
        <MetricCard
          label="Acknowledgement"
          value={metrics.acknowledgementRate}
          suffix="%"
          color={metrics.acknowledgementRate >= 70 ? "text-green-700" : metrics.acknowledgementRate >= 40 ? "text-yellow-700" : "text-red-700"}
        />
        <MetricCard
          label="Follow-Up"
          value={metrics.followUpRate}
          suffix="%"
          color={metrics.followUpRate >= 80 ? "text-green-700" : metrics.followUpRate >= 60 ? "text-yellow-700" : "text-red-700"}
        />
      </div>

      {/* Score Breakdown */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-xs font-medium text-gray-600 uppercase mb-2">Score Breakdown</h4>
        <ScoreBar label="Ofsted Timeliness" value={score.ofstedTimeliness} max={30} color="bg-blue-500" />
        <ScoreBar label="Stakeholder Notification" value={score.stakeholderNotification} max={25} color="bg-indigo-500" />
        <ScoreBar label="Quality & Completeness" value={score.qualityCompleteness} max={25} color="bg-purple-500" />
        <ScoreBar label="Policy Compliance" value={score.policyCompliance} max={20} color="bg-teal-500" />
      </div>

      {/* Event Results */}
      <Section title={`Event Results (${eventResults.length})`} defaultOpen>
        <div className="space-y-2">
          {eventResults.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              typeLabels={data.meta?.notificationTypeLabels}
              recipientLabels={data.meta?.recipientLabels}
            />
          ))}
        </div>
      </Section>

      {/* Strengths */}
      {data.strengths.length > 0 && (
        <div className="mt-3">
          <Section title={`Strengths (${data.strengths.length})`}>
            <ul className="space-y-1.5">
              {data.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {/* Areas for Improvement */}
      {data.areasForImprovement.length > 0 && (
        <div className="mt-3">
          <Section title={`Areas for Improvement (${data.areasForImprovement.length})`}>
            <ul className="space-y-1.5">
              {data.areasForImprovement.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-orange-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {/* Actions */}
      {data.actions.length > 0 && (
        <div className="mt-3">
          <Section title={`Actions (${data.actions.length})`}>
            <ul className="space-y-1.5">
              {data.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {/* Regulatory Links */}
      <div className="mt-3">
        <Section title="Regulatory Framework">
          <ul className="space-y-1">
            {data.regulatoryLinks.map((link, i) => (
              <li key={i} className="text-xs text-gray-600">{link}</li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
