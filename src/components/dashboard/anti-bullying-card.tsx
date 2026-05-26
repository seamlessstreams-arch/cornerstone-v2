"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — ANTI-BULLYING INTELLIGENCE CARD
// Live data from safeguarding intelligence engine.
// CHR 2015 Reg 12/34/7. SCCIF: Safety.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldOff, ChevronRight, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafeguardingIntelligence } from "@/hooks/use-safeguarding-intelligence";

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

export function AntiBullyingCard() {
  const { data, isLoading } = useSafeguardingIntelligence();

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
  const profile = d?.profile;
  const risk = d?.risk_assessments;
  const insights = d?.insights ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldOff className="h-4 w-4 text-brand" />
            Anti-Bullying
          </CardTitle>
          <Link href="/safeguarding" className="text-xs text-brand hover:underline flex items-center gap-1">
            Safeguarding <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{profile?.total_incidents_90d ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Incidents 90d</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (profile?.child_count_affected ?? 0) > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (profile?.child_count_affected ?? 0) > 0 ? "text-amber-600" : "text-green-600")}>{profile?.child_count_affected ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (profile?.escalation_rate ?? 0) > 20 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (profile?.escalation_rate ?? 0) > 20 ? "text-red-600" : "text-green-600")}>{profile?.escalation_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Escalation</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{profile?.outcome_documented_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Outcome</p>
          </div>
        </div>

        {/* Risk assessment overview */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Risk Assessment Overview</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Total current:</span>{" "}
              <span className="font-semibold">{risk?.total_current ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">High/Very High:</span>{" "}
              <span className="font-semibold">{risk?.high_or_very_high ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Overdue reviews:</span>{" "}
              <span className="font-semibold">{risk?.overdue_reviews ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Review completion:</span>{" "}
              <span className="font-semibold">{risk?.review_completion_rate ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* ARIA insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Anti-Bullying Intelligence
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
