"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flower2, ChevronRight, AlertTriangle, Brain, Clock, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 11, not_started_count: 1, disengaged_count: 2, no_benefit_count: 1, refused_count: 1, risk_assessment_rate: 81.8, tools_safe_rate: 90.9, child_chose_rate: 72.7, therapeutic_value_rate: 81.8, unique_children: 5 };

const DEMO_RECORDS: { child: string; activity: string; skill: string; benefit: string }[] = [
  { child: "Child A", activity: "Veg Growing", skill: "Competent", benefit: "Sig. Benefit" },
  { child: "Child B", activity: "Flower Gard.", skill: "Developing", benefit: "Some Benefit" },
  { child: "Child C", activity: "Composting", skill: "Not Started", benefit: "No Benefit" },
  { child: "Child D", activity: "Herb Cult.", skill: "Advanced", benefit: "Sig. Benefit" },
  { child: "Child E", activity: "Wildlife", skill: "Basic", benefit: "Maintained" },
  { child: "Child F", activity: "Therapeutic", skill: "Developing", benefit: "Some Benefit" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_no_benefit", severity: "critical", message: "Child C refused garden activities with no health benefit — review engagement approach." },
  { type: "no_risk_assessment", severity: "high", message: "2 sessions have no risk assessment completed." },
  { type: "tools_not_safe", severity: "high", message: "1 session has unsafe tools reported." },
];

const ARIA_INSIGHTS = [
  "11 sessions. Not started: 1. Disengaged: 2. No benefit: 1. Risk assessment: 81.8%. Tools safe: 90.9%.",
  "Priority: 1 child refusing with no benefit. Risk assessments at 81.8%. Child choice 72.7%.",
  "Positive: Most children engaged. Good tool safety. Therapeutic gardening showing benefits.",
];

const BENEFIT_BADGES: Record<string, { label: string; color: string }> = {
  "Sig. Benefit": { label: "Sig.Ben", color: "text-green-700 bg-green-50 border-green-200" },
  "Some Benefit": { label: "Some", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Maintained": { label: "Maint.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Min. Benefit": { label: "Min.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "No Benefit": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function GardenHorticultureActivitiesCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Flower2 className="h-4 w-4 text-brand" />Garden Activities</CardTitle>
          <Link href="/garden-horticulture-activities" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-red-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disengaged_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disengaged_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disengaged_count}</p><p className="text-[10px] text-muted-foreground">Disengaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_benefit_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_benefit_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_benefit_count}</p><p className="text-[10px] text-muted-foreground">No Benefit</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = BENEFIT_BADGES[r.benefit] ?? BENEFIT_BADGES["Maintained"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Sprout className="h-3 w-3 text-green-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.activity} · {r.skill}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Garden Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Garden Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
