"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ChevronRight, AlertTriangle, Brain, Clock, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, poor_count: 1, below_standard_count: 1, not_started_count: 2, no_action_plan_count: 2, children_involved_rate: 37.5, staff_trained_rate: 62.5, cost_saving_rate: 50.0, action_plan_rate: 75.0, progress_monitored_rate: 50.0, unique_assessors: 3 };

const DEMO_RECORDS: { assessor: string; area: string; rating: string; status: string }[] = [
  { assessor: "D. Laville", area: "Energy", rating: "Good", status: "Completed" },
  { assessor: "J. Hughes", area: "Waste Mgmt", rating: "Satisfactory", status: "In Progress" },
  { assessor: "D. Laville", area: "Recycling", rating: "Poor", status: "Not Started" },
  { assessor: "L. Jones", area: "Water", rating: "Excellent", status: "Monitoring" },
  { assessor: "J. Hughes", area: "Carbon", rating: "Below Std.", status: "Planning" },
  { assessor: "D. Laville", area: "Food Waste", rating: "Good", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "poor_no_action", severity: "critical", message: "Recycling rated poor with no action plan — immediate environmental action required." },
  { type: "below_standard_not_started", severity: "high", message: "1 below-standard area has no improvement started." },
  { type: "children_not_involved", severity: "medium", message: "5 assessments have children not involved in sustainability efforts." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 3 assessors. Poor: 1. Below standard: 1. Not started: 2.",
  "Priority: 1 poor area without action plan. Children involved 37.5%. Progress monitored 50.0%.",
  "Sustainability teaches responsibility. Are children involved? Are improvements being measured and sustained?",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Satisfactory": { label: "Satis.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Below Std.": { label: "Below", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function EnvironmentalImpactAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-green-200">
      <CardHeader className="pb-3 bg-green-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Leaf className="h-4 w-4 text-green-600" /><span className="text-green-900">Environmental</span></CardTitle>
          <Link href="/environmental-impact-assessment" className="text-xs text-green-600 hover:underline flex items-center gap-1">Impact <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.below_standard_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.below_standard_count === 0 ? "text-green-600" : "text-amber-600")}>{m.below_standard_count}</p><p className="text-[10px] text-muted-foreground">Below Std.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_started_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_started_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_started_count}</p><p className="text-[10px] text-muted-foreground">Not Started</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><TreePine className="h-3 w-3 text-green-500 shrink-0" /><span className="font-medium">{r.assessor}</span><span className="text-muted-foreground truncate">{r.area} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Environmental Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-green-700"><Brain className="h-3 w-3" />ARIA Environmental Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-green-200 bg-green-50 text-green-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
