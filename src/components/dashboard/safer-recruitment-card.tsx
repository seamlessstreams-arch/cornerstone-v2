"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SAFER RECRUITMENT INTELLIGENCE CARD
// Dashboard card powered by /api/safer-recruitment compliance engine.
// CHR 2015 Reg 32 (fitness of staff), Reg 33 (employment of staff),
// Reg 34, Schedule 2, SCCIF Leadership & Management.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ChevronRight, AlertTriangle, Brain,
  FileCheck, UserCheck, Clock, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface PipelineMetrics {
  totalCandidates: number;
  byStage: Record<string, number>;
  averageTimeToHire: number;
  blockedCount: number;
  clearanceRate: number;
  overdueChecks: number;
  expiringChecks: number;
}

interface CandidateCompliance {
  candidateId: string;
  candidateName: string;
  role: string;
  stage: string;
  compliance: {
    isCompliant: boolean;
    canProgress: boolean;
    canStart: boolean;
    completionPercentage: number;
    issues: { severity: string; message: string; code: string }[];
    nextActions: string[];
    reg34Compliant: boolean;
    schedule2Complete: boolean;
  };
}

interface DBSItem {
  staffName: string;
  daysUntilExpiry: number;
  status: "valid" | "expiring_soon" | "expired";
  dbsNumber: string;
  onUpdateService: boolean;
}

interface DBSSummary {
  total: number;
  expiringSoon: number;
  expired: number;
  items?: DBSItem[];
}

interface DashboardData {
  metrics: PipelineMetrics;
  blockedCandidates: CandidateCompliance[];
  dbsSummary: DBSSummary;
  recentCandidates: CandidateCompliance[];
  schedule2Summary: {
    totalActive: number;
    fullyCompliant: number;
    withBlockers: number;
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export function SaferRecruitmentCard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/safer-recruitment?view=overview")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 bg-slate-100 rounded w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-slate-100 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="overflow-hidden border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">Failed to load recruitment data</p>
        </CardContent>
      </Card>
    );
  }

  const complianceRate = data.schedule2Summary.totalActive > 0
    ? Math.round((data.schedule2Summary.fullyCompliant / data.schedule2Summary.totalActive) * 100)
    : 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Safer Recruitment
          </CardTitle>
          <Link href="/safer-recruitment-tracker" className="text-xs text-brand hover:underline flex items-center gap-1">
            Full Pipeline <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", complianceRate >= 95 ? "bg-green-50" : complianceRate >= 80 ? "bg-amber-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", complianceRate >= 95 ? "text-green-600" : complianceRate >= 80 ? "text-amber-600" : "text-red-600")}>
              {complianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", data.metrics.blockedCount === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", data.metrics.blockedCount === 0 ? "text-green-600" : "text-red-600")}>
              {data.metrics.blockedCount}
            </p>
            <p className="text-[10px] text-muted-foreground">Blocked</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", data.dbsSummary.expired === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", data.dbsSummary.expired === 0 ? "text-green-600" : "text-red-600")}>
              {data.dbsSummary.expired}
            </p>
            <p className="text-[10px] text-muted-foreground">DBS Expired</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", "bg-blue-50")}>
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {data.schedule2Summary.totalActive}
            </p>
            <p className="text-[10px] text-muted-foreground">In Pipeline</p>
          </div>
        </div>

        {/* ── DBS Tracker ─────────────────────────────────────────────── */}

        {data.dbsSummary.items && data.dbsSummary.items.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <FileCheck className="h-3 w-3" />
              DBS Status ({data.dbsSummary.total} staff)
            </p>
            {data.dbsSummary.items.slice(0, 5).map((d) => (
              <div key={d.dbsNumber || d.staffName} className="flex items-center justify-between rounded border p-2 text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium truncate">{d.staffName}</span>
                  {d.onUpdateService && (
                    <Badge className="text-[9px] bg-blue-100 text-blue-700 px-1">Update Svc</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-muted-foreground tabular-nums">
                    {d.daysUntilExpiry <= 0
                      ? `${Math.abs(d.daysUntilExpiry)}d overdue`
                      : `${d.daysUntilExpiry}d`
                    }
                  </span>
                  <Badge className={cn(
                    "text-[10px]",
                    d.status === "valid" ? "bg-green-100 text-green-700"
                      : d.status === "expiring_soon" ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700",
                  )}>
                    {d.status === "valid" ? <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> : <Clock className="h-2.5 w-2.5 mr-0.5" />}
                    {d.status === "valid" ? "Valid" : d.status === "expiring_soon" ? "Expiring" : "Expired"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Blocked candidates ──────────────────────────────────────── */}

        {data.blockedCandidates.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Candidates With Blockers
            </p>
            {data.blockedCandidates.slice(0, 4).map((candidate) => {
              const topIssue = candidate.compliance.issues.find(i => i.severity === "blocker");
              return (
                <div
                  key={candidate.candidateId}
                  className="rounded border border-red-200 bg-red-50 p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{candidate.candidateName}</span>
                    <span className="text-muted-foreground">{formatStage(candidate.stage)}</span>
                  </div>
                  {topIssue && (
                    <p className="text-red-700 mt-1">{topIssue.message}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${candidate.compliance.completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-red-600 font-medium tabular-nums">
                      {candidate.compliance.completionPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pipeline visualization ──────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">
            Pipeline ({data.metrics.totalCandidates} candidates)
          </p>
          <PipelineBar byStage={data.metrics.byStage} />
          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
            <div>
              <p className="font-bold text-slate-700 tabular-nums">{data.metrics.averageTimeToHire}d</p>
              <p className="text-[10px] text-muted-foreground">Avg. Hire Time</p>
            </div>
            <div>
              <p className="font-bold text-green-600 tabular-nums">{data.metrics.clearanceRate}%</p>
              <p className="text-[10px] text-muted-foreground">Clearance Rate</p>
            </div>
            <div>
              <p className={cn("font-bold tabular-nums", data.metrics.overdueChecks > 0 ? "text-amber-600" : "text-green-600")}>
                {data.metrics.overdueChecks}
              </p>
              <p className="text-[10px] text-muted-foreground">Overdue Checks</p>
            </div>
          </div>
        </div>

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Recruitment Intelligence
          </p>
          {generateInsights(data).map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                insight.severity === "critical" ? "border-red-200 bg-red-50 text-red-800"
                  : insight.severity === "warning" ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-green-200 bg-green-50 text-green-800",
              )}
            >
              {insight.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Pipeline Bar ─────────────────────────────────────────────────────────────

function PipelineBar({ byStage }: { byStage: Record<string, number> }) {
  const stages = [
    { key: "application_received", label: "Applied", color: "bg-slate-300" },
    { key: "shortlisted", label: "Shortlisted", color: "bg-blue-300" },
    { key: "interview_scheduled", label: "Interview", color: "bg-blue-400" },
    { key: "interview_completed", label: "Interviewed", color: "bg-indigo-400" },
    { key: "conditional_offer", label: "Offer", color: "bg-purple-400" },
    { key: "pre_start_checks", label: "Checks", color: "bg-amber-400" },
    { key: "final_clearance", label: "Clearance", color: "bg-green-400" },
    { key: "appointed", label: "Appointed", color: "bg-green-600" },
  ];

  const activeTotal = stages.reduce((sum, s) => sum + (byStage[s.key] ?? 0), 0);
  if (activeTotal === 0) return null;

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
        {stages.map(s => {
          const count = byStage[s.key] ?? 0;
          if (count === 0) return null;
          const width = (count / activeTotal) * 100;
          return (
            <div
              key={s.key}
              className={`${s.color} transition-all`}
              style={{ width: `${width}%` }}
              title={`${s.label}: ${count}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
        {stages.filter(s => (byStage[s.key] ?? 0) > 0).map(s => (
          <span key={s.key} className="text-[10px] text-muted-foreground">
            <span className={`inline-block w-2 h-2 rounded-full ${s.color} mr-0.5`} />
            {s.label} ({byStage[s.key]})
          </span>
        ))}
      </div>
    </div>
  );
}

// ── ARIA Insight Generator ───────────────────────────────────────────────────

function generateInsights(data: DashboardData): { severity: "critical" | "warning" | "good"; message: string }[] {
  const insights: { severity: "critical" | "warning" | "good"; message: string }[] = [];

  // Critical: expired DBS
  if (data.dbsSummary.expired > 0) {
    insights.push({
      severity: "critical",
      message: `${data.dbsSummary.expired} staff member${data.dbsSummary.expired > 1 ? "s" : ""} with expired DBS. They must not work unsupervised until renewed (Reg 32). Immediate action required.`,
    });
  }

  // Warning: blocked candidates near start date
  const blockedNearStart = data.blockedCandidates.filter(c =>
    c.stage === "pre_start_checks" || c.stage === "final_clearance",
  );
  if (blockedNearStart.length > 0) {
    insights.push({
      severity: "warning",
      message: `${blockedNearStart.length} candidate${blockedNearStart.length > 1 ? "s" : ""} in pre-start/clearance stage with outstanding blockers. Chase providers to avoid delayed start dates.`,
    });
  }

  // Warning: expiring DBS
  if (data.dbsSummary.expiringSoon > 0) {
    insights.push({
      severity: "warning",
      message: `${data.dbsSummary.expiringSoon} DBS expiring within 60 days. Initiate renewal process now to prevent compliance lapse.`,
    });
  }

  // Good: high clearance rate
  if (data.metrics.clearanceRate >= 70 && insights.length < 3) {
    insights.push({
      severity: "good",
      message: `Clearance rate at ${data.metrics.clearanceRate}%. Schedule 2 completion tracking on target. ${data.schedule2Summary.fullyCompliant} of ${data.schedule2Summary.totalActive} active candidates fully compliant.`,
    });
  }

  return insights.slice(0, 3);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatStage(stage: string): string {
  const labels: Record<string, string> = {
    vacancy_posted: "Vacancy Posted",
    application_received: "Application Received",
    shortlisted: "Shortlisted",
    interview_scheduled: "Interview Scheduled",
    interview_completed: "Interview Completed",
    conditional_offer: "Conditional Offer",
    pre_start_checks: "Pre-Start Checks",
    final_clearance: "Final Clearance",
    onboarding: "Onboarding",
    appointed: "Appointed",
    withdrawn: "Withdrawn",
    rejected: "Rejected",
  };
  return labels[stage] ?? stage;
}
