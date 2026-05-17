// ════════════════════════════════════════════════════════════════════════════���═
// RestraintDashboardWidget — Restraint & Physical Intervention dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface RecentRecord {
  id: string;
  childName: string;
  date: string;
  interventionType: string;
  durationMinutes: number;
  trigger: string;
  deEscalationMethods: number;
  deEscalationDuration: number;
  isCompliant: boolean;
  issues: number;
}

interface ChildCount {
  childName: string;
  count: number;
}

interface TimePeriod {
  period: string;
  count: number;
}

interface TriggerCount {
  trigger: string;
  count: number;
}

interface Metrics {
  totalRestraints30Days: number;
  totalRestraints90Days: number;
  averagePerMonth: number;
  reductionAchieved: number;
  onTarget: boolean;
  overallComplianceRate: number;
  deEscalationRate: number;
  childDebriefRate: number;
  staffDebriefRate: number;
  medicalCheckRate: number;
  averageDuration: number;
  averageDeEscalationTime: number;
  injuryRate: number;
  childAccountRate: number;
}

interface DashboardData {
  metrics: Metrics;
  recentRecords: RecentRecord[];
  incidentsByChild: ChildCount[];
  incidentsByTimeOfDay: TimePeriod[];
  commonTriggers: TriggerCount[];
  complianceIssues: string[];
}

interface Props {
  homeId?: string;
}

const INTERVENTION_LABELS: Record<string, string> = {
  physical_restraint: "Restraint",
  guided_away: "Guided",
  held_briefly: "Held",
  room_separation: "Separated",
  vehicle_restraint: "Vehicle",
};

export function RestraintDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/restraint?homeId=${homeId}&mode=dashboard`);
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

  const { metrics, recentRecords, incidentsByChild, incidentsByTimeOfDay, commonTriggers, complianceIssues } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Restraint Log</h3>
              <p className="text-xs text-muted-foreground">Physical interventions</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${metrics.overallComplianceRate >= 90 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {metrics.overallComplianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">compliant</p>
          </div>
        </div>
      </div>

      {/* Volume & trend */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{metrics.totalRestraints30Days}</p>
          <p className="text-[10px] text-muted-foreground">Last 30d</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{metrics.averagePerMonth}/mo</p>
          <p className="text-[10px] text-muted-foreground">Average</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.onTarget ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {metrics.reductionAchieved > 0 ? "-" : ""}{metrics.reductionAchieved}%
          </p>
          <p className="text-[10px] text-muted-foreground">Reduction</p>
        </div>
      </div>

      {/* De-escalation & debrief rates */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">De-escalation evidenced</span>
          <span className={`font-medium ${metrics.deEscalationRate === 100 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.deEscalationRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Child debrief completed</span>
          <span className={`font-medium ${metrics.childDebriefRate === 100 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.childDebriefRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Medical check completed</span>
          <span className={`font-medium ${metrics.medicalCheckRate === 100 ? "text-emerald-600" : "text-amber-600"}`}>
            {metrics.medicalCheckRate}%
          </span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Avg de-escalation time</span>
          <span className="font-medium">{metrics.averageDeEscalationTime} mins</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Avg restraint duration</span>
          <span className="font-medium">{metrics.averageDuration} mins</span>
        </div>
      </div>

      {/* Recent records */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Recent Interventions</p>
        </div>
        <div className="px-4 py-2 space-y-1.5">
          {recentRecords.slice(0, 4).map(record => (
            <div key={record.id} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">
                  {new Date(record.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                <span className="font-medium">{record.childName}</span>
                <span className="text-muted-foreground">{INTERVENTION_LABELS[record.interventionType] || record.interventionType}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">{record.durationMinutes}m</span>
                {record.isCompliant ? (
                  <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">OK</span>
                ) : (
                  <span className="text-[8px] px-1 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">{record.issues} issue{record.issues > 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patterns */}
      {incidentsByChild.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Patterns (90 days)</p>
          <div className="space-y-1">
            {incidentsByChild.slice(0, 3).map((child, i) => (
              <div key={i} className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{child.childName}</span>
                <span className="font-medium">{child.count} incident{child.count > 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
          {commonTriggers.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-border">
              <p className="text-[9px] text-muted-foreground mb-0.5">Top triggers:</p>
              <p className="text-[10px] font-medium">
                {commonTriggers.slice(0, 2).map(t => t.trigger).join(" · ")}
              </p>
            </div>
          )}
        </div>
      )}

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
        <a href="/restraint" className="text-xs text-primary font-medium hover:underline">
          View restraint log →
        </a>
      </div>
    </div>
  );
}
