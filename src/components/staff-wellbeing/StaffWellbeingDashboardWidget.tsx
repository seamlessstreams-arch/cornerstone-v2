// ══════════════════════════════════════════════════════════════════════════════
// StaffWellbeingDashboardWidget — Staff burnout risk & wellbeing card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface Assessment {
  staffId: string;
  staffName: string;
  role: string;
  burnoutRiskLevel: string;
  burnoutScore: number;
  wellbeingTrend: string;
  currentWellbeingScore: number;
  issues: string[];
  recommendations: string[];
  supervisionOverdue: boolean;
  overtimeConcern: boolean;
  hasActiveSupport: boolean;
}

interface Metrics {
  staffCount: number;
  averageWellbeingScore: number;
  wellbeingTrend: string;
  burnoutRiskBreakdown: Record<string, number>;
  highRiskStaff: { staffName: string; score: number }[];
  totalAbsenceDays30: number;
  stressRelatedAbsenceRate: number;
  supervisionComplianceRate: number;
  overtimeRate: number;
  agencyReliance: number;
  retentionRate12Months: number;
  reflectivePracticeRate: number;
  activeInterventions: number;
  teamMorale: number;
}

interface DashboardData {
  metrics: Metrics;
  assessments: Assessment[];
}

interface Props {
  homeId?: string;
}

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const RISK_LABELS: Record<string, string> = {
  low: "Low",
  moderate: "Mod",
  high: "High",
  critical: "Crit",
};

const TREND_ICONS: Record<string, string> = {
  improving: "↑",
  stable: "→",
  declining: "↓",
  insufficient_data: "—",
};

export function StaffWellbeingDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/staff-wellbeing?homeId=${homeId}&mode=dashboard`);
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

  const { metrics, assessments } = data;
  const atRisk = assessments.filter(a => a.burnoutRiskLevel === "high" || a.burnoutRiskLevel === "critical");

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Staff Wellbeing</h3>
              <p className="text-xs text-muted-foreground">Burnout risk & resilience</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${metrics.wellbeingTrend === "improving" ? "text-emerald-600" : metrics.wellbeingTrend === "declining" ? "text-red-600" : "text-muted-foreground"}`}>
              {TREND_ICONS[metrics.wellbeingTrend] ?? ""}
            </span>
            <span className="text-lg font-bold">{metrics.teamMorale}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* High risk alert */}
      {atRisk.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              {atRisk.length} staff at high burnout risk
            </span>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400">
            {atRisk[0].staffName} — {atRisk[0].issues[0] ?? "Multiple risk factors"}
          </p>
        </div>
      )}

      {/* Burnout risk breakdown */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Risk Distribution</p>
        <div className="flex gap-1.5">
          {(["low", "moderate", "high", "critical"] as const).map(level => {
            const count = metrics.burnoutRiskBreakdown[level] ?? 0;
            if (count === 0) return null;
            return (
              <div key={level} className={`flex-1 rounded px-2 py-1.5 text-center ${RISK_STYLES[level]}`}>
                <p className="text-sm font-bold">{count}</p>
                <p className="text-[9px]">{RISK_LABELS[level]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.supervisionComplianceRate >= 90 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.supervisionComplianceRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Supervision</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.overtimeRate > 30 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {metrics.overtimeRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Overtime</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{metrics.totalAbsenceDays30}d</p>
          <p className="text-[10px] text-muted-foreground">Absence 30d</p>
        </div>
      </div>

      {/* Staff breakdown */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Team Wellbeing</p>
        </div>
        <div className="divide-y divide-border">
          {assessments.slice(0, 5).map(a => (
            <div key={a.staffId} className="px-4 py-2 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{a.staffName}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.hasActiveSupport && (
                  <span className="text-[9px] text-blue-600 dark:text-blue-400">supported</span>
                )}
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${RISK_STYLES[a.burnoutRiskLevel] ?? ""}`}>
                  {RISK_LABELS[a.burnoutRiskLevel] ?? a.burnoutRiskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Stress absence rate</span>
          <span className={`font-medium ${metrics.stressRelatedAbsenceRate > 20 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {metrics.stressRelatedAbsenceRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Agency reliance</span>
          <span className={`font-medium ${metrics.agencyReliance > 25 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
            {metrics.agencyReliance}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Retention (12m)</span>
          <span className="font-medium">{metrics.retentionRate12Months}%</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Reflective practice</span>
          <span className="font-medium">{metrics.reflectivePracticeRate}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/staff-wellbeing" className="text-xs text-primary font-medium hover:underline">
          View wellbeing dashboard →
        </a>
      </div>
    </div>
  );
}
