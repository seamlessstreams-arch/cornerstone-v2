"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronRight, AlertTriangle, Brain, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_goals: 12, stalled_count: 2, not_started_count: 1, disengaged_count: 1, no_support_count: 1, child_led_rate: 75.0, progress_celebrated_rate: 58.3, mentor_rate: 50.0, review_scheduled_rate: 66.7, unique_children: 6 };

const DEMO_RECORDS: { child: string; category: string; status: string; motivation: string }[] = [
  { child: "Child A", category: "Education", status: "On Track", motivation: "Motivated" },
  { child: "Child B", category: "Career", status: "Achieved", motivation: "Highly Motivated" },
  { child: "Child C", category: "Sport", status: "Stalled", motivation: "Disengaged" },
  { child: "Child D", category: "Creative Arts", status: "In Progress", motivation: "Variable" },
  { child: "Child E", category: "Independent Living", status: "Not Started", motivation: "Low" },
  { child: "Child F", category: "Relationships", status: "On Track", motivation: "Motivated" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disengaged_no_support", severity: "critical", message: "Child C is disengaged from sport goal with no support." },
  { type: "goals_stalled", severity: "high", message: "2 goals have stalled — review support and remove barriers." },
  { type: "no_mentor", severity: "medium", message: "6 goals without mentor involvement." },
];

const ARIA_INSIGHTS = [
  "12 goals. Stalled: 2. Not started: 1. Disengaged: 1. No support: 1. Child-led: 75%. Celebrated: 58.3%.",
  "Priority: 1 disengaged no support. 2 stalled. 6 no mentor. Strengthen aspirational support framework.",
  "Positive: Most goals child-led. Education and career well-supported. Family awareness maintained.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Achieved": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "On Track": { label: "Track", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "In Progress": { label: "Prog.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Stalled": { label: "Stalled", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Not Started": { label: "Not St.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildrensAspirationsGoalsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-brand" />Aspirations & Goals</CardTitle>
          <Link href="/childrens-aspirations-goals" className="text-xs text-brand hover:underline flex items-center gap-1">Goals <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.stalled_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.stalled_count === 0 ? "text-green-600" : "text-red-600")}>{m.stalled_count}</p><p className="text-[10px] text-muted-foreground">Stalled</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disengaged_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.disengaged_count === 0 ? "text-green-600" : "text-red-600")}>{m.disengaged_count}</p><p className="text-[10px] text-muted-foreground">Disengaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_support_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_support_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_support_count}</p><p className="text-[10px] text-muted-foreground">No Supp.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_goals}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Current Goals</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["In Progress"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Target className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.category} · {r.motivation}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Goal Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Aspirations Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
