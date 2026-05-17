// ══════════════════════════════════════════════════════════════════════════════
// SupervisionDashboardWidget — Staff supervision compliance & wellbeing
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface TeamMetrics {
  homeId: string;
  staffCount: number;
  complianceRate: number;
  overdueCount: number;
  averageDaysSinceLast: number;
  averageWellbeing: number;
  totalOpenActions: number;
  totalOverdueActions: number;
  reflectivePracticeRate: number;
  safeguardingDiscussionRate: number;
  staffAtRisk: { staffId: string; staffName: string; issue: string }[];
  upcomingDue: { staffId: string; staffName: string; dueBy: string }[];
}

interface Props {
  homeId?: string;
}

export function SupervisionDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/supervision?homeId=${homeId}&view=overview`);
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

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Staff Supervision</h3>
              <p className="text-xs text-muted-foreground">
                {data.staffCount} staff tracked
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            data.complianceRate >= 90 ? "bg-emerald-100 text-emerald-800" :
            data.complianceRate >= 70 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {data.complianceRate}% on time
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Overdue" value={String(data.overdueCount)} alert={data.overdueCount > 0} />
        <Stat label="Wellbeing" value={`${data.averageWellbeing.toFixed(1)}/5`} />
        <Stat label="Reflect" value={`${data.reflectivePracticeRate}%`} />
        <Stat label="Safeguard" value={`${data.safeguardingDiscussionRate}%`} />
      </div>

      {/* Actions summary */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Open actions</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium">{data.totalOpenActions} open</span>
          {data.totalOverdueActions > 0 && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {data.totalOverdueActions} overdue
            </span>
          )}
        </div>
      </div>

      {/* Staff at risk */}
      {data.staffAtRisk.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {data.staffAtRisk.slice(0, 4).map(staff => (
            <div key={staff.staffId} className="px-4 py-2 flex items-center justify-between">
              <p className="text-xs font-medium">{staff.staffName}</p>
              <span className="text-xs text-amber-600 dark:text-amber-400">{staff.issue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming due */}
      {data.upcomingDue.length > 0 && data.staffAtRisk.length === 0 && (
        <div className="divide-y divide-border border-t border-border">
          {data.upcomingDue.slice(0, 3).map(staff => (
            <div key={staff.staffId} className="px-4 py-2 flex items-center justify-between">
              <p className="text-xs font-medium">{staff.staffName}</p>
              <span className="text-xs text-muted-foreground">
                Due {new Date(staff.dueBy).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/supervision" className="text-xs text-primary font-medium hover:underline">
          View supervision tracker →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className={`text-lg font-bold ${alert ? "text-red-600 dark:text-red-400" : ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
