"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PEST CONTROL INTELLIGENCE CARD
// Dashboard card for pest inspections, treatments, and prevention.
// CHR 2015 Reg 25, Reg 36, Reg 15.
// SCCIF: Overall Experiences — "The home is clean and well-maintained."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bug, ChevronRight, AlertTriangle, Brain,
  Clock, Shield, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_inspections: 8,
  routine_count: 4,
  reactive_count: 1,
  resolved_rate: 62.5,
  ongoing_count: 1,
  no_pest_found_rate: 50.0,
  high_risk_count: 0,
  critical_risk_count: 0,
  food_areas_affected_count: 1,
  follow_up_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; pest: string; date: string; outcome: string; risk: string }[] = [
  { type: "Routine", pest: "None", date: "12 May", outcome: "Clear", risk: "None" },
  { type: "Reactive", pest: "Ants", date: "8 May", outcome: "Resolved", risk: "Low" },
  { type: "Routine", pest: "None", date: "1 May", outcome: "Clear", risk: "None" },
  { type: "Follow Up", pest: "Rodents", date: "28 Apr", outcome: "Ongoing", risk: "Medium" },
  { type: "Emergency", pest: "Wasps", date: "20 Apr", outcome: "Resolved", risk: "High" },
  { type: "Seasonal", pest: "Moths", date: "15 Apr", outcome: "Resolved", risk: "Low" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "food_area", severity: "high", message: "1 inspection has found pests in food areas — urgent action required." },
  { type: "ongoing", severity: "high", message: "1 pest treatment is ongoing — monitor progress." },
  { type: "follow_up_overdue", severity: "high", message: "1 pest control follow-up is overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "8 inspections. Resolved: 62.5%. No pests: 50%. Food areas affected: 1. Follow-ups overdue: 1.",
  "Priority: 1 food area affected. 1 ongoing treatment. 1 overdue follow-up. Monitor rodent issue closely.",
  "Positive: Regular routine inspections. No critical risks. Most issues resolved. Improve follow-up completion.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Clear": { label: "Clear", color: "text-green-700 bg-green-50 border-green-200" },
  "Resolved": { label: "Resolved", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Ongoing": { label: "Ongoing", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function PestControlCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug className="h-4 w-4 text-brand" />
            Pest Control
          </CardTitle>
          <Link href="/pest-control" className="text-xs text-brand hover:underline flex items-center gap-1">
            Inspections <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.resolved_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.resolved_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.resolved_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Resolved</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.no_pest_found_rate >= 70 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.no_pest_found_rate >= 70 ? "text-green-600" : "text-amber-600")}>{m.no_pest_found_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Clear</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.food_areas_affected_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.food_areas_affected_count === 0 ? "text-green-600" : "text-red-600")}>{m.food_areas_affected_count}</p>
            <p className="text-[10px] text-muted-foreground">Food Areas</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.follow_up_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.follow_up_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Clear"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Search className="h-3 w-3 text-amber-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.pest} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pest Control Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Pest Control Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
