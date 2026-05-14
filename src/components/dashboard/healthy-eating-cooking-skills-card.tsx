"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ChevronRight, AlertTriangle, Brain, Clock, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 14, not_started_count: 1, disengaged_count: 2, declined_count: 1, refused_count: 1, food_hygiene_rate: 85.7, kitchen_safety_rate: 78.6, child_chose_recipe_rate: 71.4, allergy_awareness_rate: 92.9, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; skill: string; outcome: string }[] = [
  { child: "Child A", type: "Meal Prep", skill: "Competent", outcome: "Improved" },
  { child: "Child B", type: "Baking", skill: "Developing", outcome: "Maintained" },
  { child: "Child C", type: "Food Hygiene", skill: "Not Started", outcome: "Declined" },
  { child: "Child D", type: "Menu Plan", skill: "Advanced", outcome: "Sig. Impr." },
  { child: "Child E", type: "Shopping", skill: "Basic", outcome: "Some Impr." },
  { child: "Child F", type: "Cultural", skill: "Developing", outcome: "Maintained" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_declining", severity: "critical", message: "Child C refusing cooking sessions and health declining — intervention needed." },
  { type: "no_food_hygiene", severity: "high", message: "2 sessions have food hygiene not followed." },
  { type: "no_kitchen_safety", severity: "high", message: "3 sessions have kitchen safety not followed." },
];

const ARIA_INSIGHTS = [
  "14 sessions. Not started: 1. Disengaged: 2. Declined: 1. Hygiene: 85.7%. Safety: 78.6%.",
  "Priority: 1 child refusing with declining health. Kitchen safety at 78.6%. Recipe choice 71.4%.",
  "Positive: Most children engaged. Allergy awareness high at 92.9%. Advanced skills developing.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Sig. Impr.": { label: "Sig.Imp", color: "text-green-700 bg-green-50 border-green-200" },
  "Some Impr.": { label: "Impr.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Improved": { label: "Impr.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Maintained": { label: "Maint.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Sl. Decline": { label: "Sl.Dec.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Declined": { label: "Decl.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HealthyEatingCookingSkillsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ChefHat className="h-4 w-4 text-brand" />Cooking Skills</CardTitle>
          <Link href="/healthy-eating-cooking-skills" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-red-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disengaged_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disengaged_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disengaged_count}</p><p className="text-[10px] text-muted-foreground">Disengaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.declined_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.declined_count === 0 ? "text-green-600" : "text-amber-600")}>{m.declined_count}</p><p className="text-[10px] text-muted-foreground">Declined</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Maintained"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UtensilsCrossed className="h-3 w-3 text-orange-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.skill}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cooking Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Cooking Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
