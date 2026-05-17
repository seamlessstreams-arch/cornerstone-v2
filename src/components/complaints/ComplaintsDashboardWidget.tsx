// ══════════════════════════════════════════════════════════════════════════════
// ComplaintsDashboardWidget — Complaints & Compliments dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ComplaintComplianceRow {
  complaintId: string;
  title: string;
  category: string;
  stage: string;
  status: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  acknowledgedOnTime: boolean;
  respondedOnTime: boolean;
  outcomeRecorded: boolean;
  ofstedNotifiedIfRequired: boolean;
  daysToResolve?: number;
}

interface Metrics {
  totalComplaints: number;
  openComplaints: number;
  overdueComplaints: number;
  averageDaysToResolve: number;
  responseWithinTarget: number;
  childComplaintsRate: number;
  satisfactionRate: number;
  totalCompliments: number;
  complaintToComplimentRatio: number;
  escalationRate: number;
  lessonsLearnedRate: number;
  byCategory: { category: string; count: number }[];
}

interface Compliment {
  id: string;
  source: string;
  sourceName?: string;
  childName?: string;
  description: string;
  receivedAt: string;
}

interface DashboardData {
  metrics: Metrics;
  complaints: ComplaintComplianceRow[];
  recentCompliments: Compliment[];
}

interface Props {
  homeId?: string;
}

const STAGE_LABELS: Record<string, string> = {
  informal: "Informal",
  stage_1: "Stage 1",
  stage_2: "Stage 2",
  stage_3_panel: "Panel",
  ombudsman: "Ombudsman",
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  investigating: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  escalated: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  withdrawn: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function ComplaintsDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/complaints-engine?homeId=${homeId}&mode=dashboard`);
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
        <div className="h-4 w-40 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, complaints, recentCompliments } = data;
  const nonCompliant = complaints.filter(c => !c.isCompliant);
  const overdue = complaints.filter(c => c.status !== "resolved" && c.status !== "withdrawn" && !c.respondedOnTime);

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Complaints & Compliments</h3>
              <p className="text-xs text-muted-foreground">Reg 39 — Representations</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{metrics.totalComplaints}</p>
            <p className="text-[10px] text-muted-foreground">total complaints</p>
          </div>
        </div>
      </div>

      {/* Overdue / Non-compliant alerts */}
      {(overdue.length > 0 || nonCompliant.length > 0) && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          {overdue.length > 0 && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">
                {overdue.length} overdue response{overdue.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {nonCompliant.length > 0 && (
            <p className="text-[10px] text-red-600 dark:text-red-400">
              {nonCompliant.length} complaint{nonCompliant.length > 1 ? "s" : ""} with compliance issues
            </p>
          )}
        </div>
      )}

      {/* Key Stats Grid */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{metrics.openComplaints}</p>
          <p className="text-[10px] text-muted-foreground">Open</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{metrics.responseWithinTarget}%</p>
          <p className="text-[10px] text-muted-foreground">On target</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{metrics.averageDaysToResolve}d</p>
          <p className="text-[10px] text-muted-foreground">Avg resolve</p>
        </div>
      </div>

      {/* Child voice + satisfaction */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Child voice</span>
            <span className="text-xs font-semibold">{metrics.childComplaintsRate}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500"
              style={{ width: `${metrics.childComplaintsRate}%` }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">complaints from children</p>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground">Satisfaction</span>
            <span className="text-xs font-semibold">{metrics.satisfactionRate}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${metrics.satisfactionRate >= 75 ? "bg-emerald-500" : metrics.satisfactionRate >= 50 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${metrics.satisfactionRate}%` }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">satisfied with outcome</p>
        </div>
      </div>

      {/* Active Complaints */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Active Complaints</p>
        </div>
        <div className="divide-y divide-border">
          {complaints
            .filter(c => c.status !== "resolved" && c.status !== "withdrawn")
            .slice(0, 4)
            .map(c => (
              <div key={c.complaintId} className="px-4 py-2 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{c.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{STAGE_LABELS[c.stage] ?? c.stage}</span>
                    {!c.isCompliant && (
                      <span className="text-[9px] text-red-600 dark:text-red-400 font-medium">! non-compliant</span>
                    )}
                  </div>
                </div>
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_STYLES[c.status] ?? ""}`}>
                  {c.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Compliments */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-900/10">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              Compliments
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{metrics.totalCompliments}</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {recentCompliments.slice(0, 2).map(cp => (
            <div key={cp.id} className="px-4 py-2">
              <p className="text-xs text-foreground line-clamp-1">&ldquo;{cp.description}&rdquo;</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                — {cp.sourceName ?? cp.childName ?? cp.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Escalation rate</span>
          <span className={`font-medium ${metrics.escalationRate > 30 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {metrics.escalationRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mt-1">
          <span className="text-muted-foreground">Lessons captured</span>
          <span className={`font-medium ${metrics.lessonsLearnedRate < 75 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
            {metrics.lessonsLearnedRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mt-1">
          <span className="text-muted-foreground">Complaint:Compliment ratio</span>
          <span className="font-medium">{metrics.complaintToComplimentRatio}:1</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/complaints" className="text-xs text-primary font-medium hover:underline">
          View all complaints & compliments →
        </a>
      </div>
    </div>
  );
}
