"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — BODY MAP INTELLIGENCE CARD
// Live data from safeguarding intelligence engine.
// CHR 2015 Reg 12/36/34. SCCIF: Safety.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PersonStanding, ChevronRight, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafeguardingIntelligence } from "@/hooks/use-safeguarding-intelligence";

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

export function BodyMapCard() {
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
  const restraints = d?.restraints;
  const insights = d?.insights ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <PersonStanding className="h-4 w-4 text-brand" />
            Body Maps
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
            <p className="text-lg font-bold tabular-nums text-blue-600">{restraints?.total_restraints_30d ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Restraints 30d</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (restraints?.children_restrained ?? 0) > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (restraints?.children_restrained ?? 0) > 0 ? "text-amber-600" : "text-green-600")}>{restraints?.children_restrained ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (restraints?.injury_rate ?? 0) > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (restraints?.injury_rate ?? 0) > 0 ? "text-red-600" : "text-green-600")}>{restraints?.injury_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Injury</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (restraints?.debrief_rate ?? 0) >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (restraints?.debrief_rate ?? 0) >= 100 ? "text-green-600" : "text-amber-600")}>{restraints?.debrief_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Debrief</p>
          </div>
        </div>

        {/* Restraint details */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Restraint Details</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Restraints 90d:</span>{" "}
              <span className="font-semibold">{restraints?.total_restraints_90d ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Avg duration:</span>{" "}
              <span className="font-semibold">{restraints?.avg_duration_mins ?? 0} min</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Repeat use same child:</span>{" "}
              <span className="font-semibold">{restraints?.repeat_use_same_child ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Children restrained:</span>{" "}
              <span className="font-semibold">{restraints?.children_restrained ?? 0}</span>
            </div>
          </div>
        </div>

        {/* ARIA insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Body Map Intelligence
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
