"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — REGULATORY REPORTING INTELLIGENCE CARD
// Dashboard card powered by the Regulatory Reporting Intelligence Engine.
// Reg 44 (independent person visits), Reg 45 (quality of care review),
// Reg 40 (notifications to Ofsted), SCCIF Leadership & Management.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, ChevronRight, AlertTriangle, CheckCircle2,
  Clock, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegulatoryReportingIntelligence } from "@/hooks/use-regulatory-reporting-intelligence";

// ── Styling ─────────────────────────────────────────────────────────────────

const ALERT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high:     "border-red-200 bg-red-50 text-red-800",
  medium:   "border-amber-200 bg-amber-50 text-amber-800",
  low:      "border-blue-200 bg-blue-50 text-blue-800",
};

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning:  "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

function dueColour(days: number | null): string {
  if (days === null) return "text-slate-600";
  if (days < 0) return "text-red-600";
  if (days <= 14) return "text-amber-600";
  return "text-green-600";
}

// ── Component ───────────────────────────────────────────────────────────────

export function RegulatoryReportingCard() {
  const { data, isLoading } = useRegulatoryReportingIntelligence();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            Statutory Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--cs-text-muted)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const o = intel.overview;
  const reg44 = intel.reg44_status;
  const reg45 = intel.reg45_status;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            Statutory Reporting
          </CardTitle>
          <Link href="/quality/reg-44" className="text-xs text-brand hover:underline flex items-center gap-1">
            Reports <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Compliance strip ─────────────────────────────────────────── */}

        <div className="grid grid-cols-2 gap-3">
          {/* Reg 44 */}
          <div className={cn(
            "rounded-lg border p-3",
            o.reg44_compliant ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50",
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Reg 44</span>
              {o.reg44_compliant ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last visit</span>
                <span className="font-medium">{reg44.last_visit_date ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next due</span>
                <span className={cn("font-bold", dueColour(reg44.days_until_due))}>
                  {reg44.days_until_due !== null ? `${reg44.days_until_due}d` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">12-month count</span>
                <span className={cn("font-medium", reg44.visits_last_12_months >= 12 ? "text-green-600" : "text-amber-600")}>
                  {reg44.visits_last_12_months}/12
                </span>
              </div>
            </div>
          </div>

          {/* Reg 45 */}
          <div className={cn(
            "rounded-lg border p-3",
            o.reg45_compliant ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50",
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Reg 45</span>
              {o.reg45_compliant ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last submitted</span>
                <span className="font-medium">{reg45.last_submitted ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next due</span>
                <span className={cn("font-bold", dueColour(reg45.days_until_due))}>
                  {reg45.days_until_due !== null ? `${reg45.days_until_due}d` : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">12-month count</span>
                <span className={cn("font-medium", reg45.reports_last_12_months >= 2 ? "text-green-600" : "text-amber-600")}>
                  {reg45.reports_last_12_months}/2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommendations tracker ─────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              Recommendations
            </p>
            <Badge className={cn(
              "text-[10px]",
              intel.recommendation_tracker.outstanding === 0 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
            )}>
              {intel.recommendation_tracker.outstanding} outstanding
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${intel.recommendation_tracker.completion_rate}%` }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
              {intel.recommendation_tracker.completion_rate}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="font-bold text-slate-700 tabular-nums">{intel.recommendation_tracker.total_recommendations}</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="font-bold text-green-600 tabular-nums">{intel.recommendation_tracker.completed}</p>
              <p className="text-[10px] text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className={cn("font-bold tabular-nums", o.notifications_on_time_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {o.notifications_on_time_rate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Notifications</p>
            </div>
          </div>
        </div>

        {/* ── Compliance score ────────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-xs font-semibold">Overall Compliance</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  o.overall_compliance_score >= 80 ? "bg-green-500"
                    : o.overall_compliance_score >= 60 ? "bg-amber-500"
                    : "bg-red-500",
                )}
                style={{ width: `${o.overall_compliance_score}%` }}
              />
            </div>
            <span className={cn(
              "text-sm font-bold tabular-nums",
              o.overall_compliance_score >= 80 ? "text-green-600"
                : o.overall_compliance_score >= 60 ? "text-amber-600"
                : "text-red-600",
            )}>
              {o.overall_compliance_score}%
            </span>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {intel.alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Regulatory Alerts
            </p>
            {intel.alerts.slice(0, 3).map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  ALERT_STYLES[alert.severity] ?? ALERT_STYLES.medium,
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── Cara Regulatory Intelligence ────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              Cara Regulatory Intelligence
            </p>
            {intel.insights.slice(0, 3).map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  INSIGHT_STYLES[insight.severity] ?? INSIGHT_STYLES.positive,
                )}
              >
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
