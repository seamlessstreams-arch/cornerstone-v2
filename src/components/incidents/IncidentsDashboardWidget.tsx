// ══════════════════════════════════════════════════════════════════════════════
// IncidentsDashboardWidget — Live incident & restraint overview
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface IncidentMetrics {
  totalIncidents: number;
  incidentsThisMonth: number;
  incidentsThisQuarter: number;
  complianceRate: number;
  averageResponseMinutes: number;
  childrenInvolved: number;
  requiresOfstedNotification: number;
  bySeverity: { severity: number; count: number }[];
  byCategory: { category: string; count: number }[];
  repeatPatterns: { childId: string; childName: string; count: number }[];
  restraintMetrics: {
    totalRestraints: number;
    restraintsThisMonth: number;
    averageDurationMinutes: number;
    approvedTechniqueRate: number;
    deEscalationAttemptedRate: number;
    childDebriefRate: number;
    staffDebriefRate: number;
    trend: "increasing" | "stable" | "decreasing";
    byChild: { childId: string; childName: string; count: number }[];
  };
}

interface Props {
  homeId?: string;
}

const SEVERITY_COLORS = ["", "bg-blue-500", "bg-amber-500", "bg-orange-500", "bg-red-500", "bg-red-700"];
const TREND_LABELS: Record<string, string> = { increasing: "↑ Rising", stable: "→ Stable", decreasing: "↓ Reducing" };
const TREND_STYLES: Record<string, string> = {
  increasing: "text-red-600 dark:text-red-400",
  stable: "text-gray-600 dark:text-gray-400",
  decreasing: "text-emerald-600 dark:text-emerald-400",
};

export function IncidentsDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<IncidentMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/incidents?homeId=${homeId}&view=overview`);
      const json = await res.json();
      setData(json);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { restraintMetrics } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Incidents & Restraint</h3>
              <p className="text-xs text-muted-foreground">
                {data.incidentsThisMonth} this month
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            data.complianceRate >= 90 ? "bg-emerald-100 text-emerald-800" :
            data.complianceRate >= 70 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {data.complianceRate}% compliant
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Month" value={String(data.incidentsThisMonth)} />
        <Stat label="Restraints" value={String(restraintMetrics.restraintsThisMonth)} />
        <Stat label="De-esc %" value={`${restraintMetrics.deEscalationAttemptedRate}%`} />
        <Stat label="Debrief" value={`${restraintMetrics.childDebriefRate}%`} />
      </div>

      {/* Severity bar */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-1.5">Severity distribution</p>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          {data.bySeverity.map(s => (
            <div
              key={s.severity}
              className={`${SEVERITY_COLORS[s.severity]} h-full`}
              style={{ width: `${(s.count / data.totalIncidents) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <span className="text-[10px] text-muted-foreground">Critical</span>
        </div>
      </div>

      {/* Restraint trend */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Restraint trend</span>
        <span className={`text-xs font-medium ${TREND_STYLES[restraintMetrics.trend]}`}>
          {TREND_LABELS[restraintMetrics.trend]}
        </span>
      </div>

      {/* Repeat patterns */}
      {data.repeatPatterns.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {data.repeatPatterns.slice(0, 3).map(child => (
            <div key={child.childId} className="px-4 py-2 flex items-center justify-between">
              <p className="text-xs font-medium">{child.childName}</p>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {child.count} incidents
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Ofsted notification warning */}
      {data.requiresOfstedNotification > 0 && (
        <div className="border-t border-border bg-red-50/50 dark:bg-red-900/10 p-3">
          <p className="text-xs font-medium text-red-700 dark:text-red-400">
            {data.requiresOfstedNotification} incident{data.requiresOfstedNotification !== 1 ? "s" : ""} requiring Ofsted notification
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/incidents" className="text-xs text-primary font-medium hover:underline">
          View incident log →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
