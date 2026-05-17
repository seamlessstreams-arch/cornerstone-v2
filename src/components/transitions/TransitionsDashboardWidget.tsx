// ══════════════════════════════════════════════════════════════════════════════
// TransitionsDashboardWidget — Transitions & Admissions dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ActiveTransition {
  id: string;
  childName: string;
  type: string;
  typeLabel: string;
  status: string;
  statusLabel: string;
  referralDate: string;
  expectedArrivalDate?: string;
  daysInProcess: number;
}

interface RecentDeparture {
  id: string;
  childName: string;
  type: string;
  typeLabel: string;
  departureDate: string;
  destination?: string;
  planned: boolean;
}

interface Metrics {
  currentOccupancy: number;
  registeredCapacity: number;
  occupancyRate: number;
  emergencyAdmissionRate: number;
  averageMatchingScore: number;
  matchingComplianceRate: number;
  plannedMoveRate: number;
  admissionsThisYear: number;
  departuresThisYear: number;
}

interface DashboardData {
  metrics: Metrics;
  activeTransitions: ActiveTransition[];
  recentDepartures: RecentDeparture[];
  issues: string[];
  warnings: string[];
}

interface Props {
  homeId?: string;
}

const STATUS_STYLES: Record<string, string> = {
  referral_received: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  matching_assessment: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  impact_assessment: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  placement_confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  settling_in: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  move_planning: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

export function TransitionsDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/transitions?homeId=${homeId}&mode=dashboard`);
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
        <div className="h-4 w-36 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, activeTransitions, recentDepartures, issues, warnings } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Transitions & Admissions</h3>
              <p className="text-xs text-muted-foreground">Placement moves & matching</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{metrics.currentOccupancy}/{metrics.registeredCapacity}</p>
            <p className="text-[10px] text-muted-foreground">occupancy</p>
          </div>
        </div>
      </div>

      {/* Issues alert */}
      {issues.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              {issues.length} compliance issue{issues.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400 line-clamp-1">
            {issues[0]}
          </p>
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.averageMatchingScore >= 3.5 ? "text-emerald-600 dark:text-emerald-400" : metrics.averageMatchingScore >= 3 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
            {metrics.averageMatchingScore.toFixed(1)}
          </p>
          <p className="text-[10px] text-muted-foreground">Match score</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.matchingComplianceRate >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.matchingComplianceRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Matching done</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.plannedMoveRate >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.plannedMoveRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Planned moves</p>
        </div>
      </div>

      {/* Active transitions */}
      {activeTransitions.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Active Transitions</p>
          </div>
          <div className="divide-y divide-border">
            {activeTransitions.map(t => (
              <div key={t.id} className="px-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium">{t.childName}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[t.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                    {t.statusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{t.typeLabel}</span>
                  <span className="text-[10px] text-muted-foreground">Day {t.daysInProcess}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent departures */}
      {recentDepartures.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Recent Departures</p>
          </div>
          <div className="divide-y divide-border">
            {recentDepartures.slice(0, 2).map(d => (
              <div key={d.id} className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{d.childName}</p>
                  <span className={`text-[9px] font-medium ${d.planned ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {d.planned ? "Planned" : "Unplanned"}
                  </span>
                </div>
                {d.destination && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">{d.destination}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Warnings</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">{warnings.length}</span>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Admissions (12m)</span>
          <span className="font-medium">{metrics.admissionsThisYear}</span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Departures (12m)</span>
          <span className="font-medium">{metrics.departuresThisYear}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Emergency rate</span>
          <span className={`font-medium ${metrics.emergencyAdmissionRate <= 20 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.emergencyAdmissionRate}%
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/transitions" className="text-xs text-primary font-medium hover:underline">
          View transitions dashboard →
        </a>
      </div>
    </div>
  );
}
