// ══════════��═══════════════════════════════════════════════════════════════════
// SaferRecruitmentDashboardWidget — Recruitment pipeline & compliance card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface PipelineData {
  totalCandidates: number;
  byStage: Record<string, number>;
  averageTimeToHire: number;
  blockedCount: number;
  clearanceRate: number;
  overdueChecks: number;
  expiringChecks: number;
}

interface CandidateRow {
  candidateId: string;
  candidateName: string;
  role: string;
  stage: string;
  completionPercentage: number;
  isCompliant: boolean;
  canStart: boolean;
  issues: { message: string; severity: string }[];
}

interface DashboardData {
  pipeline: PipelineData;
  candidates: CandidateRow[];
  dbsRenewals: { candidateName: string; expiryDate: string; daysUntilExpiry: number }[];
}

interface Props {
  homeId?: string;
}

const STAGE_LABELS: Record<string, string> = {
  vacancy_posted: "Vacancy",
  application_received: "Applied",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  interview_completed: "Interviewed",
  conditional_offer: "Offer",
  pre_start_checks: "Pre-start",
  final_clearance: "Clearance",
  onboarding: "Onboarding",
  appointed: "Appointed",
  withdrawn: "Withdrawn",
  rejected: "Rejected",
};

export function SaferRecruitmentDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/safer-recruitment?view=overview${homeId ? `&homeId=${homeId}` : ""}`);
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

  const { pipeline, candidates, dbsRenewals } = data;
  const activeCandidates = candidates.filter(c =>
    c.stage !== "appointed" && c.stage !== "withdrawn" && c.stage !== "rejected"
  );
  const blockers = candidates.filter(c => c.issues.some(i => i.severity === "blocker"));

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Safer Recruitment</h3>
              <p className="text-xs text-muted-foreground">Reg 34 / Schedule 2</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{activeCandidates.length}</p>
            <p className="text-[10px] text-muted-foreground">in pipeline</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(pipeline.blockedCount > 0 || pipeline.overdueChecks > 0) && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          {pipeline.blockedCount > 0 && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">
                {pipeline.blockedCount} blocked candidate{pipeline.blockedCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {pipeline.overdueChecks > 0 && (
            <p className="text-[10px] text-red-600 dark:text-red-400">
              {pipeline.overdueChecks} overdue check{pipeline.overdueChecks > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{pipeline.clearanceRate}%</p>
          <p className="text-[10px] text-muted-foreground">Clearance</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{pipeline.averageTimeToHire}d</p>
          <p className="text-[10px] text-muted-foreground">Avg hire</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${pipeline.expiringChecks > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {pipeline.expiringChecks}
          </p>
          <p className="text-[10px] text-muted-foreground">Expiring</p>
        </div>
      </div>

      {/* Active candidates */}
      {activeCandidates.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Active Pipeline</p>
          </div>
          <div className="divide-y divide-border">
            {activeCandidates.slice(0, 4).map(c => (
              <div key={c.candidateId} className="px-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium truncate">{c.candidateName}</p>
                  <span className="text-[10px] text-muted-foreground">{STAGE_LABELS[c.stage] ?? c.stage}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.completionPercentage >= 90 ? "bg-emerald-500" : c.completionPercentage >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${c.completionPercentage}%` }}
                  />
                </div>
                {c.issues.length > 0 && (
                  <p className="text-[9px] text-red-600 dark:text-red-400 mt-0.5">
                    {c.issues[0].message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DBS Renewals */}
      {dbsRenewals && dbsRenewals.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-amber-50/30 dark:bg-amber-900/5">
          <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 mb-1">DBS renewals due:</p>
          {dbsRenewals.slice(0, 2).map((r, i) => (
            <p key={i} className="text-[10px] text-amber-600 dark:text-amber-400">
              {r.candidateName} — {r.daysUntilExpiry}d
            </p>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/safer-recruitment" className="text-xs text-primary font-medium hover:underline">
          View recruitment pipeline ���
        </a>
      </div>
    </div>
  );
}
