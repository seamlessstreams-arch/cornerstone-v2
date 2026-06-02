"use client";

// ═══════════════════��══════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S THERAPY SESSIONS CARD
// Live data from useHealthWellbeing() — CAMHS, wellbeing, child profiles.
// CHR 2015 Reg 23/33. SCCIF: Health & Wellbeing.
// ════════════════════════════���═════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain, ChevronRight, AlertTriangle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthWellbeing } from "@/hooks/use-health-wellbeing";

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

export function ChildrensTherapySessionsCard() {
  const { data, isLoading } = useHealthWellbeing();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-brand" />
            Therapy Sessions
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

  const { camhs, child_profiles } = intel;
  const engaged = child_profiles.filter((c) => c.camhs_status === "active_engagement").length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-brand" />
            Therapy Sessions
          </CardTitle>
          <Link href="/health" className="text-xs text-brand hover:underline flex items-center gap-1">
            Health <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{camhs.active_referrals}</p>
            <p className="text-[10px] text-muted-foreground">Referrals</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{camhs.total_sessions_held}</p>
            <p className="text-[10px] text-muted-foreground">Sessions</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", camhs.waiting_list === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", camhs.waiting_list === 0 ? "text-green-600" : "text-amber-600")}>{camhs.waiting_list}</p>
            <p className="text-[10px] text-muted-foreground">Waiting</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", camhs.disengaged_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", camhs.disengaged_count === 0 ? "text-green-600" : "text-red-600")}>{camhs.disengaged_count}</p>
            <p className="text-[10px] text-muted-foreground">Disengaged</p>
          </div>
        </div>

        {/* ── Engagement detail ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1">
          <p className="text-xs font-semibold">CAMHS Engagement</p>
          <div className="flex flex-wrap gap-1">
            <Badge className="text-[10px] bg-green-100 text-green-700">{engaged} active</Badge>
            <Badge className="text-[10px] bg-amber-100 text-amber-700">{camhs.waiting_list} waiting ({camhs.avg_waiting_weeks}wk avg)</Badge>
            {camhs.disengaged_count > 0 && (
              <Badge className="text-[10px] bg-red-100 text-red-700">{camhs.disengaged_count} disengaged</Badge>
            )}
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {intel.alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Health Alerts
            </p>
            {intel.alerts.slice(0, 2).map((alert, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", ALERT_STYLES[alert.severity] ?? ALERT_STYLES.medium)}>
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ───────────────────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Therapy Intelligence
            </p>
            {intel.insights.slice(0, 2).map((insight, i) => (
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
