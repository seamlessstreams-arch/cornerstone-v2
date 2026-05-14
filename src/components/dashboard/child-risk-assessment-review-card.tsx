"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ChevronRight, AlertTriangle, Brain, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 15, risk_increased_count: 2, new_risk_count: 1, risk_reduced_count: 5, very_high_count: 1, child_participated_rate: 80.0, staff_briefed_rate: 86.7, safety_plan_updated_rate: 73.3, unique_children: 5 };

const DEMO_RECORDS: { child: string; domain: string; level: string; outcome: string }[] = [
  { child: "Child A", domain: "Self-Harm", level: "High", outcome: "Reduced" },
  { child: "Child B", domain: "Exploitation", level: "V. High", outcome: "Increased" },
  { child: "Child C", domain: "Missing", level: "Medium", outcome: "Unchanged" },
  { child: "Child D", domain: "Online", level: "Low", outcome: "Reduced" },
  { child: "Child A", domain: "Substance", level: "Medium", outcome: "Reduced" },
  { child: "Child E", domain: "Bullying", level: "High", outcome: "New Risk" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "risk_increased", severity: "critical", message: "Child B risk increased in exploitation — safety plan not updated." },
  { type: "not_participated", severity: "high", message: "3 reviews have no child participation." },
  { type: "not_briefed", severity: "high", message: "2 reviews have not briefed staff." },
];

const ARIA_INSIGHTS = [
  "15 reviews. 5 children. Increased: 2. New: 1. Reduced: 5. V.High: 1. Participated: 80%.",
  "Priority: 1 risk increase no plan. 3 no participation. 2 staff not briefed. Strengthen reviews.",
  "Positive: 5 risks reduced. Good review frequency. Dynamic factors assessed. Strong documentation.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Reduced": { label: "Reduced", color: "text-green-700 bg-green-50 border-green-200" },
  "Unchanged": { label: "Unchg.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Increased": { label: "Incr.", color: "text-red-700 bg-red-50 border-red-200" },
  "New Risk": { label: "New", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildRiskAssessmentReviewCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-brand" />Risk Assessment Reviews</CardTitle>
          <Link href="/child-risk-assessment-reviews" className="text-xs text-brand hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.risk_reduced_count}</p><p className="text-[10px] text-muted-foreground">Reduced</p></div>
          <div className={cn("text-center rounded-lg p-2", m.risk_increased_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.risk_increased_count === 0 ? "text-green-600" : "text-red-600")}>{m.risk_increased_count}</p><p className="text-[10px] text-muted-foreground">Increased</p></div>
          <div className={cn("text-center rounded-lg p-2", m.very_high_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.very_high_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_high_count}</p><p className="text-[10px] text-muted-foreground">V. High</p></div>
          <div className={cn("text-center rounded-lg p-2", m.child_participated_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_participated_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.child_participated_rate}%</p><p className="text-[10px] text-muted-foreground">Involved</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Unchanged"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Target className="h-3 w-3 text-red-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.domain} · {r.level}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Risk Review Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Risk Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
