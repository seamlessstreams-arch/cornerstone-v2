// ══════════════════════════════════════════════════════════════════════════════
// LifeStoryDashboardWidget — Life Story & Identity Work dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ChildSummary {
  childId: string;
  childName: string;
  overallScore: number;
  lifeStoryBookExists: boolean;
  lifeStoryBookCurrent: boolean;
  memoryBoxExists: boolean;
  sessionsLast3Months: number;
  averageEngagement: string;
  identityNeedsMet: number;
  familyConnectionsActive: number;
  sessionFrequencyAdequate: boolean;
  isCompliant: boolean;
  issues: number;
  identityGaps: string[];
}

interface Metrics {
  childrenWithLifeStoryBook: number;
  childrenWithMemoryBox: number;
  childrenWithRecentSession: number;
  totalChildren: number;
  averageOverallScore: number;
  averageEngagementScore: number;
  sessionCompletionRate: number;
  childLedRate: number;
  identityInCarePlanRate: number;
  culturalNeedsSupportedRate: number;
  familyTreeCompletionRate: number;
  totalSessionsLast3Months: number;
  averageSessionsPerChild: number;
}

interface DashboardData {
  metrics: Metrics;
  children: ChildSummary[];
  complianceIssues: string[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getScoreColour(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function getEngagementColour(engagement: string): string {
  switch (engagement) {
    case "high": return "bg-green-50 text-green-700";
    case "moderate": return "bg-blue-50 text-blue-700";
    case "low": return "bg-amber-50 text-amber-700";
    case "refused": return "bg-red-50 text-red-700";
    default: return "bg-slate-50 text-slate-600";
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export function LifeStoryDashboardWidget() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/life-story?homeId=home-oak&mode=dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch life story data");
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
          <div className="h-4 w-1/2 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700 text-sm">Error loading life story data: {error}</p>
      </div>
    );
  }

  const { metrics, children, complianceIssues } = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Life Story & Identity Work
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Memory keeping, identity support, cultural connection, family links
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColour(metrics.averageOverallScore)}`}>
            {metrics.averageOverallScore}%
          </p>
          <p className="text-xs text-slate-400">overall score</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Life Story Books"
          value={`${metrics.childrenWithLifeStoryBook}/${metrics.totalChildren}`}
          sub="children with book"
          alert={metrics.childrenWithLifeStoryBook < metrics.totalChildren}
        />
        <MetricCard
          label="Engagement"
          value={`${metrics.averageEngagementScore}%`}
          sub="average child engagement"
          alert={metrics.averageEngagementScore < 60}
        />
        <MetricCard
          label="Sessions (3m)"
          value={String(metrics.totalSessionsLast3Months)}
          sub={`${metrics.averageSessionsPerChild} per child avg`}
          alert={metrics.averageSessionsPerChild < 2}
        />
        <MetricCard
          label="Child-Led"
          value={`${metrics.childLedRate}%`}
          sub="sessions led by child"
          alert={metrics.childLedRate < 50}
        />
      </div>

      {/* Per-Child Summary */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Children</h4>
        <div className="space-y-2">
          {children.map((child) => (
            <div
              key={child.childId}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    child.overallScore >= 75
                      ? "bg-green-100 text-green-700"
                      : child.overallScore >= 50
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {child.overallScore}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{child.childName}</p>
                  <p className="text-xs text-slate-500">
                    {child.sessionsLast3Months} sessions &middot;
                    {child.familyConnectionsActive} active connections &middot;
                    {child.identityNeedsMet}% identity needs met
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {child.lifeStoryBookExists && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${child.lifeStoryBookCurrent ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                    Book {child.lifeStoryBookCurrent ? "✓" : "!"}
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${getEngagementColour(child.averageEngagement)}`}>
                  {child.averageEngagement}
                </span>
                {!child.sessionFrequencyAdequate && (
                  <span className="text-xs text-amber-600" title="Session overdue">⏱</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identity Gaps */}
      {children.some(c => c.identityGaps.length > 0) && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Identity Gaps</h4>
          <div className="space-y-1">
            {children
              .filter(c => c.identityGaps.length > 0)
              .map((child) => (
                <div key={child.childId} className="text-xs text-amber-700">
                  <span className="font-medium">{child.childName}:</span>{" "}
                  {child.identityGaps.join("; ")}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Compliance Issues */}
      {complianceIssues.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Compliance Issues ({complianceIssues.length})
          </h4>
          <ul className="space-y-1">
            {complianceIssues.map((issue, i) => (
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
            label="Identity in Plan"
            value={`${metrics.identityInCarePlanRate}%`}
            alert={metrics.identityInCarePlanRate < 100}
          />
          <MiniStat
            label="Cultural Support"
            value={`${metrics.culturalNeedsSupportedRate}%`}
            alert={metrics.culturalNeedsSupportedRate < 100}
          />
          <MiniStat
            label="Family Trees"
            value={`${metrics.familyTreeCompletionRate}%`}
            alert={metrics.familyTreeCompletionRate < 100}
          />
        </div>
        <span className="text-xs text-slate-400">
          Reg 5/7/14 &middot; UNCRC Art 8
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
  alert,
}: {
  label: string;
  value: string | number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${alert ? "text-amber-600" : "text-slate-900"}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">{label}:</span>
      <span className={`text-xs font-semibold ${alert ? "text-amber-600" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}
