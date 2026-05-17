// ══════════════════════════════════════════════════════════════════════════════
// LeavingCareDashboardWidget — Leaving Care & Aftercare dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface YoungPerson {
  childId: string;
  childName: string;
  ageYears: number;
  status: string;
  statusLabel: string;
  eetLabel: string;
  accommodationLabel: string;
  overallPreparedness: number;
  isCompliant: boolean;
  issueCount: number;
  daysUntilDeparture?: number;
  daysSinceDeparture?: number;
  contactUpToDate: boolean;
}

interface Metrics {
  totalYoungPeople: number;
  activePreparation: number;
  stayingClose: number;
  aftercare: number;
  pathwayPlanComplianceRate: number;
  personalAdviserRate: number;
  accommodationSecuredRate: number;
  eetRate: number;
  averagePreparedness: number;
  contactComplianceRate: number;
  stayingCloseAcceptanceRate: number;
}

interface DashboardData {
  metrics: Metrics;
  youngPeople: YoungPerson[];
  complianceIssues: string[];
}

interface Props {
  homeId?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pre_planning: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  pathway_planning: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  transition: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  departed: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  staying_close: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  aftercare: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
};

export function LeavingCareDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/leaving-care?homeId=${homeId}&mode=dashboard`);
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

  const { metrics, youngPeople, complianceIssues } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Leaving Care & Aftercare</h3>
              <p className="text-xs text-muted-foreground">Pathway plans & staying close</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{metrics.totalYoungPeople}</p>
            <p className="text-[10px] text-muted-foreground">young people</p>
          </div>
        </div>
      </div>

      {/* Issues alert */}
      {complianceIssues.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {complianceIssues.length} area{complianceIssues.length > 1 ? "s" : ""} needing attention
            </span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 line-clamp-1">
            {complianceIssues[0]}
          </p>
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.pathwayPlanComplianceRate >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.pathwayPlanComplianceRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Plans current</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.eetRate >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.eetRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">In EET</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{metrics.averagePreparedness}%</p>
          <p className="text-[10px] text-muted-foreground">Prepared</p>
        </div>
      </div>

      {/* Young people list */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Young People</p>
        </div>
        <div className="divide-y divide-border">
          {youngPeople.map(yp => (
            <div key={yp.childId} className="px-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium">{yp.childName}</p>
                  <span className="text-[9px] text-muted-foreground">({yp.ageYears}y)</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[yp.status] ?? ""}`}>
                  {yp.statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{yp.eetLabel}</span>
                <div className="flex items-center gap-2">
                  {yp.daysUntilDeparture !== undefined && (
                    <span className="text-[9px] text-muted-foreground">{yp.daysUntilDeparture}d to go</span>
                  )}
                  {yp.daysSinceDeparture !== undefined && (
                    <span className="text-[9px] text-muted-foreground">{yp.daysSinceDeparture}d since</span>
                  )}
                </div>
              </div>
              <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    yp.overallPreparedness >= 70 ? "bg-emerald-500" :
                    yp.overallPreparedness >= 40 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${yp.overallPreparedness}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Staying Close</span>
          <span className="font-medium">{metrics.stayingClose} active</span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Aftercare (18-25)</span>
          <span className="font-medium">{metrics.aftercare} supported</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Contact compliance</span>
          <span className={`font-medium ${metrics.contactComplianceRate >= 100 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.contactComplianceRate}%
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/leaving-care" className="text-xs text-primary font-medium hover:underline">
          View leaving care dashboard →
        </a>
      </div>
    </div>
  );
}
