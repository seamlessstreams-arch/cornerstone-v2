// ══════════════════════════════════════════════════════════════════════════════
// RiskAssessmentDashboardWidget — Risk Management dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ChildStatus {
  childId: string;
  childName: string;
  overallRiskLevel: string;
  riskManagementScore: number;
  isCompliant: boolean;
  activeHighRisks: string[];
  incidentsLast30Days: number;
  assessmentsOverdue: number;
  issues: string[];
}

interface RecentIncident {
  id: string;
  childName: string;
  category: string;
  severity: string;
  date: string;
  riskReassessed: boolean;
}

interface Metrics {
  overallManagementScore: number;
  childrenAtHighRisk: number;
  childrenAtVeryHighRisk: number;
  totalActiveAssessments: number;
  overdueReviews: number;
  totalIncidents30Days: number;
  highSeverityIncidents30Days: number;
  controlMeasureEffectivenessRate: number;
  positiveRiskTakingRate: number;
  childInvolvementRate: number;
}

interface DashboardData {
  metrics: Metrics;
  children: ChildStatus[];
  recentIncidents: RecentIncident[];
  mostPrevalentRisks: string[];
  complianceIssues: string[];
}

interface Props {
  homeId?: string;
}

const RISK_LEVEL_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  very_high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-orange-600 dark:text-orange-400",
  critical: "text-red-600 dark:text-red-400",
};

const CATEGORY_SHORT: Record<string, string> = {
  self_harm: "Self-Harm",
  suicide: "Suicide",
  cse: "CSE",
  cce: "CCE",
  missing: "Missing",
  aggression_to_others: "Aggression",
  aggression_to_property: "Property",
  substance_misuse: "Substances",
  radicalisation: "Radical.",
  online_harm: "Online",
  bullying_perpetrator: "Bully (P)",
  bullying_victim: "Bully (V)",
  fire_setting: "Fire",
  absconding: "Abscond",
  trafficking: "Trafficking",
  gang_affiliation: "Gangs",
  eating_disorder: "Eating",
  self_neglect: "Neglect",
};

export function RiskAssessmentDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/risk-assessment?homeId=${homeId}&mode=dashboard`);
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

  const { metrics, children, recentIncidents, mostPrevalentRisks, complianceIssues } = data;

  const scoreColor = metrics.overallManagementScore >= 80
    ? "text-emerald-600 dark:text-emerald-400"
    : metrics.overallManagementScore >= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Risk Management</h3>
              <p className="text-xs text-muted-foreground">Assessments & safeguarding</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${scoreColor}`}>
              {metrics.overallManagementScore}%
            </p>
            <p className="text-[10px] text-muted-foreground">managed</p>
          </div>
        </div>
      </div>

      {/* Alert row */}
      {(metrics.childrenAtHighRisk > 0 || metrics.childrenAtVeryHighRisk > 0) && (
        <div className="px-4 py-2 border-b border-border bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2">
            {metrics.childrenAtVeryHighRisk > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 font-medium">
                {metrics.childrenAtVeryHighRisk} Very High
              </span>
            )}
            {metrics.childrenAtHighRisk > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200 font-medium">
                {metrics.childrenAtHighRisk} High
              </span>
            )}
            {metrics.overdueReviews > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-medium">
                {metrics.overdueReviews} Overdue
              </span>
            )}
          </div>
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{metrics.totalActiveAssessments}</p>
          <p className="text-[10px] text-muted-foreground">Assessments</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.totalIncidents30Days > 5 ? "text-amber-600 dark:text-amber-400" : ""}`}>
            {metrics.totalIncidents30Days}
          </p>
          <p className="text-[10px] text-muted-foreground">Incidents (30d)</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.controlMeasureEffectivenessRate >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.controlMeasureEffectivenessRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Measures eff.</p>
        </div>
      </div>

      {/* Per-child risk levels */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Per Child</p>
        </div>
        <div className="px-4 py-2 space-y-1.5">
          {children.map(child => (
            <div key={child.childId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${RISK_LEVEL_COLORS[child.overallRiskLevel] || ""}`}>
                  {child.overallRiskLevel.replace("_", " ")}
                </span>
                <span className="text-[11px] font-medium">{child.childName}</span>
              </div>
              <div className="flex items-center gap-2">
                {child.incidentsLast30Days > 0 && (
                  <span className="text-[9px] text-muted-foreground">{child.incidentsLast30Days} inc.</span>
                )}
                {child.assessmentsOverdue > 0 && (
                  <span className="text-[9px] text-amber-600 font-medium">Review due</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent incidents */}
      {recentIncidents.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Recent Incidents</p>
          </div>
          <div className="px-4 py-2 space-y-1">
            {recentIncidents.slice(0, 4).map(incident => (
              <div key={incident.id} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">
                    {new Date(incident.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <span className="font-medium">{incident.childName}</span>
                  <span className="text-muted-foreground">{CATEGORY_SHORT[incident.category] || incident.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-medium ${SEVERITY_COLORS[incident.severity] || ""}`}>
                    {incident.severity}
                  </span>
                  {incident.riskReassessed && (
                    <span className="text-[8px] text-emerald-600">reviewed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Positive risk-taking</span>
          <span className={`font-medium ${metrics.positiveRiskTakingRate >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.positiveRiskTakingRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Child involvement</span>
          <span className={`font-medium ${metrics.childInvolvementRate === 100 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.childInvolvementRate}%
          </span>
        </div>
        {mostPrevalentRisks.length > 0 && (
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Key risks</span>
            <span className="font-medium text-right">
              {mostPrevalentRisks.slice(0, 3).map(r => CATEGORY_SHORT[r] || r).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Compliance issues */}
      {complianceIssues.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50 dark:bg-red-950/20">
          <p className="text-[10px] font-medium text-red-700 dark:text-red-400 mb-1">Compliance Issues</p>
          {complianceIssues.slice(0, 3).map((issue, i) => (
            <p key={i} className="text-[10px] text-red-600 dark:text-red-400">
              {issue}
            </p>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/risk-assessment" className="text-xs text-primary font-medium hover:underline">
          View risk assessments →
        </a>
      </div>
    </div>
  );
}
