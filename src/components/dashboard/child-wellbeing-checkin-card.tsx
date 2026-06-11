"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — CHILD WELLBEING CHECK-IN INTELLIGENCE CARD
// Live data from health & wellbeing engine.
// CHR 2015 Reg 7/10. SCCIF: Overall Experiences.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smile, ChevronRight, Brain, Loader2, AlertTriangle, TrendingUp, TrendingDown, Minus,
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

export function ChildWellbeingCheckinCard() {
  const { data, isLoading } = useHealthWellbeing();

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const d = data?.data;
  const compliance = d?.compliance;
  const appointments = d?.appointments;
  const camhs = d?.camhs;
  const trends = d?.wellbeing_trends ?? [];
  const alerts = d?.alerts ?? [];
  const insights = d?.insights ?? [];

  const avgWellbeing = trends.length > 0
    ? (trends.reduce((sum, t) => sum + t.current_avg, 0) / trends.length).toFixed(1)
    : "N/A";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smile className="h-4 w-4 text-brand" />
            Wellbeing Check-Ins
          </CardTitle>
          <Link href="/health" className="text-xs text-brand hover:underline flex items-center gap-1">
            Health <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-blue-50">
            <p className="text-lg font-bold tabular-nums text-blue-600">{avgWellbeing}</p>
            <p className="text-[10px] text-muted-foreground">Avg Wellbeing</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (camhs?.active_referrals ?? 0) > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (camhs?.active_referrals ?? 0) > 0 ? "text-amber-600" : "text-green-600")}>{camhs?.active_referrals ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">CAMHS Active</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-blue-50">
            <p className="text-lg font-bold tabular-nums text-blue-600">{compliance?.total_children ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (appointments?.dna_rate ?? 0) > 10 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (appointments?.dna_rate ?? 0) > 10 ? "text-red-600" : "text-green-600")}>{appointments?.dna_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">DNA %</p>
          </div>
        </div>

        {/* Wellbeing trends */}
        {trends.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Wellbeing Trends</p>
            <div className="space-y-1">
              {trends.map((t) => {
                const TrendIcon = t.trend === "improving" ? TrendingUp : t.trend === "declining" ? TrendingDown : Minus;
                const trendColor = t.trend === "improving" ? "text-green-600" : t.trend === "declining" ? "text-red-600" : "text-gray-500";
                return (
                  <div key={t.child_id} className="flex items-center justify-between rounded border p-2 text-xs">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TrendIcon className={cn("h-3 w-3 shrink-0", trendColor)} />
                      <span className="font-medium">{t.child_name}</span>
                      <span className="text-muted-foreground">Score: {t.current_avg.toFixed(1)}</span>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] shrink-0", t.trend === "improving" ? "text-green-700 bg-green-50 border-green-200" : t.trend === "declining" ? "text-red-700 bg-red-50 border-red-200" : "text-gray-700 bg-gray-50 border-gray-200")}>
                      {t.trend}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CAMHS summary */}
        {camhs && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">CAMHS Summary</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border p-2">
                <span className="text-muted-foreground">Active referrals:</span>{" "}
                <span className="font-semibold">{camhs.active_referrals}</span>
              </div>
              <div className="rounded border p-2">
                <span className="text-muted-foreground">Waiting list:</span>{" "}
                <span className="font-semibold">{camhs.waiting_list}</span>
              </div>
              <div className="rounded border p-2">
                <span className="text-muted-foreground">Sessions held:</span>{" "}
                <span className="font-semibold">{camhs.total_sessions_held}</span>
              </div>
              <div className="rounded border p-2">
                <span className="text-muted-foreground">Avg wait (wks):</span>{" "}
                <span className="font-semibold">{camhs.avg_waiting_weeks}</span>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Wellbeing Alerts
            </p>
            {alerts.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", ALERT_STYLES[a.severity] ?? ALERT_STYLES.medium)}>
                {a.message}
              </div>
            ))}
          </div>
        )}

        {/* Cara insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              Cara Wellbeing Intelligence
            </p>
            {insights.map((insight, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", INSIGHT_STYLES[insight.severity] ?? INSIGHT_STYLES.warning)}>
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
