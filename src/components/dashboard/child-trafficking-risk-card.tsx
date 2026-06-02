"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILD TRAFFICKING RISK CARD
// Live data from safeguarding intelligence engine.
// CHR 2015 Reg 12, Reg 34. SCCIF: Helped & Protected.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HandMetal, ChevronRight, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafeguardingIntelligence } from "@/hooks/use-safeguarding-intelligence";

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

export function ChildTraffickingRiskCard() {
  const { data, isLoading } = useSafeguardingIntelligence();

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-fuchsia-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const d = data?.data;
  const risk = d?.risk_assessments;
  const notifiable = d?.notifiable_events;
  const insights = d?.insights ?? [];

  return (
    <Card className="overflow-hidden border-fuchsia-200">
      <CardHeader className="pb-3 bg-fuchsia-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HandMetal className="h-4 w-4 text-fuchsia-600" />
            <span className="text-fuchsia-900">Trafficking Risk</span>
          </CardTitle>
          <Link href="/safeguarding" className="text-xs text-fuchsia-600 hover:underline flex items-center gap-1">
            Safeguarding <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-fuchsia-50 p-2">
            <p className="text-lg font-bold tabular-nums text-fuchsia-600">{risk?.total_current ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", (risk?.high_or_very_high ?? 0) > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (risk?.high_or_very_high ?? 0) > 0 ? "text-red-600" : "text-green-600")}>{risk?.high_or_very_high ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">High+</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{risk?.review_completion_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Review</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{risk?.mitigation_documented_rate ?? 0}%</p>
            <p className="text-[10px] text-muted-foreground">Mitigation</p>
          </div>
        </div>

        {/* Notifiable events */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Notifiable Events</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Total events:</span>{" "}
              <span className="font-semibold">{notifiable?.total_events ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">On time:</span>{" "}
              <span className="font-semibold">{notifiable?.notified_on_time ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Notified late:</span>{" "}
              <span className="font-semibold">{notifiable?.notified_late ?? 0}</span>
            </div>
            <div className="rounded border p-2">
              <span className="text-muted-foreground">Not yet notified:</span>{" "}
              <span className="font-semibold">{notifiable?.not_yet_notified ?? 0}</span>
            </div>
          </div>
        </div>

        {/* ARIA insights */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Trafficking Intelligence
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
