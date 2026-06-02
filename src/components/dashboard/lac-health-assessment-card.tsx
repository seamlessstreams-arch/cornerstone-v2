"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — LAC HEALTH ASSESSMENT INTELLIGENCE CARD
// Live data from health & wellbeing engine.
// CHR 2015 Reg 7/33. SCCIF: Health.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope, ChevronRight, Brain, Loader2, AlertTriangle,
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

export function LacHealthAssessmentCard() {
  const { data, isLoading } = useHealthWellbeing();

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-emerald-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const d = data?.data;
  const compliance = d?.compliance;
  const appointments = d?.appointments;
  const childProfiles = d?.child_profiles ?? [];
  const alerts = d?.alerts ?? [];
  const insights = d?.insights ?? [];

  return (
    <Card className="overflow-hidden border-emerald-200">
      <CardHeader className="pb-3 bg-emerald-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-900">LAC Health</span>
          </CardTitle>
          <Link href="/health" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
            Health <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", (compliance?.health_assessment_current ?? 0) === (compliance?.total_children ?? 0) ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (compliance?.health_assessment_current ?? 0) === (compliance?.total_children ?? 0) ? "text-green-600" : "text-amber-600")}>{compliance?.health_assessment_current ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">HA Current</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (compliance?.overall_compliance_rate ?? 0) >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (compliance?.overall_compliance_rate ?? 0) >= 90 ? "text-green-600" : "text-amber-600")}>{compliance?.overall_compliance_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Compliance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (appointments?.dna_rate ?? 0) === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (appointments?.dna_rate ?? 0) === 0 ? "text-green-600" : "text-red-600")}>{appointments?.dna_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">DNA Rate</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-emerald-50">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{appointments?.upcoming_7d ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Upcoming 7d</p>
          </div>
        </div>

        {/* Child compliance profiles */}
        {childProfiles.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Child Health Compliance</p>
            <div className="space-y-1">
              {childProfiles.map((c) => (
                <div key={c.child_id} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Stethoscope className="h-3 w-3 text-emerald-500 shrink-0" />
                    <span className="font-medium">{c.child_name}</span>
                    <span className="text-muted-foreground truncate">
                      {c.dental_up_to_date ? "Dental" : ""}{c.dental_up_to_date && c.optician_up_to_date ? " · " : ""}{c.optician_up_to_date ? "Optician" : ""}
                      {!c.dental_up_to_date && !c.optician_up_to_date ? "Checks overdue" : ""}
                    </span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", c.dental_up_to_date && c.optician_up_to_date ? "text-green-700 bg-green-50 border-green-200" : "text-amber-700 bg-amber-50 border-amber-200")}>
                    {c.dental_up_to_date && c.optician_up_to_date ? "Up to date" : "Gaps"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Health Alerts
            </p>
            {alerts.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", ALERT_STYLES[a.severity] ?? ALERT_STYLES.medium)}>
                {a.message}
              </div>
            ))}
          </div>
        )}

        {/* ARIA insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-emerald-700">
              <Brain className="h-3 w-3" />
              ARIA Health Intelligence
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
