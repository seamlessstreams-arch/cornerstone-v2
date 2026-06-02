"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — LAC REVIEW INTELLIGENCE CARD
// Dashboard widget for LAC review compliance, child participation,
// action tracking, placement stability, and ARIA permanence intelligence.
// Powered by the LAC Review Engine — live data (Reg 36, CPR 2010).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck, ChevronRight, AlertTriangle, Brain,
  Users, CheckCircle2, Loader2, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLACReviewIntelligence } from "@/hooks/use-lac-review-intelligence";

// ── Styling ─────────────────────────────────────────────────────────────────

const ALERT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-blue-200 bg-blue-50 text-blue-800",
};

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

const COMPLIANCE_STYLES: Record<string, string> = {
  compliant: "text-green-600",
  due_soon: "text-amber-600",
  overdue: "text-red-600",
};

const STABILITY_BADGE: Record<string, string> = {
  stable: "bg-green-100 text-green-700",
  some_concerns: "bg-amber-100 text-amber-700",
  at_risk: "bg-red-100 text-red-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function LACReviewCard() {
  const { data, isLoading } = useLACReviewIntelligence();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-brand" />
            LAC Reviews
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
  const ac = intel.action_compliance;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-brand" />
            LAC Reviews
          </CardTitle>
          <Link href="/lac-reviews" className="text-xs text-brand hover:underline flex items-center gap-1">
            Reviews <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2.5", o.timeliness_rate === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.timeliness_rate === 100 ? "text-green-600" : "text-amber-600")}>
              {o.timeliness_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Timely</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{o.child_participation_rate}%</p>
            <p className="text-[10px] text-muted-foreground">YP Voice</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-purple-600">{o.total_reviews}</p>
            <p className="text-[10px] text-muted-foreground">Reviews</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", o.care_plan_update_rate === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.care_plan_update_rate === 100 ? "text-green-600" : "text-amber-600")}>
              {o.care_plan_update_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Plan Updated</p>
          </div>
        </div>

        {/* ── Per-child review profiles ────────────────────────────────── */}

        {intel.child_profiles.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Review Status
            </p>
            {intel.child_profiles.slice(0, 4).map((child) => (
              <div key={child.child_id} className="rounded-lg border p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{child.child_name}</span>
                    <span className={cn("text-[10px] font-medium", COMPLIANCE_STYLES[child.compliance_status])}>
                      {child.compliance_status === "compliant" ? "compliant" : child.compliance_status === "due_soon" ? "due soon" : "overdue"}
                    </span>
                  </div>
                  {child.placement_stability && (
                    <Badge className={cn("text-[9px]", STABILITY_BADGE[child.placement_stability])}>
                      {child.placement_stability === "stable" ? "stable" : child.placement_stability === "some_concerns" ? "concerns" : "at risk"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                  {child.last_review_days_ago < 999 && (
                    <span className="text-[10px]">Last: {child.last_review_days_ago}d ago</span>
                  )}
                  {child.next_review_in_days > -999 && (
                    <span className={cn("text-[10px]", child.next_review_in_days < 0 ? "text-red-600 font-medium" : "")}>
                      Next: {child.next_review_in_days > 0 ? `in ${child.next_review_in_days}d` : `${Math.abs(child.next_review_in_days)}d overdue`}
                    </span>
                  )}
                  {child.actions_overdue > 0 && (
                    <Badge className="text-[9px] bg-amber-100 text-amber-700">
                      {child.actions_overdue} action overdue
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Action compliance ────────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Shield className={cn("h-4 w-4", ac.overdue > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">Review Actions</p>
              <p className="text-[10px] text-muted-foreground">
                {ac.completed}/{ac.total_actions} completed · {ac.completion_rate}%
              </p>
            </div>
          </div>
          {ac.overdue > 0 ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
              {ac.overdue} overdue
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              On track
            </Badge>
          )}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {intel.alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Review Alerts
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

        {/* ── ARIA LAC Review Intelligence ─────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Review Intelligence
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
