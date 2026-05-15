"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Puzzle, ChevronRight, AlertTriangle, Brain, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, poor_match_count: 2, negative_impact_count: 1, unsuitable_count: 1, pre_admission_count: 3, child_views_rate: 62.5, existing_children_rate: 50.0, risk_assessment_rate: 75.0, contingency_rate: 37.5, unique_children: 4 };

const DEMO_RECORDS: { child: string; domain: string; quality: string; timing: string }[] = [
  { child: "Child A", domain: "Peer Dynamics", quality: "Good Match", timing: "Pre-Admission" },
  { child: "Child B", domain: "Education", quality: "Excellent", timing: "Monthly" },
  { child: "Child C", domain: "Risk Compat.", quality: "Poor Match", timing: "Triggered" },
  { child: "Child A", domain: "Cultural Match", quality: "Adequate", timing: "72hr Review" },
  { child: "Child D", domain: "Staff Skills", quality: "Unsuitable", timing: "Disruption" },
  { child: "Child B", domain: "Location", quality: "Good Match", timing: "Quarterly" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unsuitable_negative", severity: "critical", message: "Child D has an unsuitable placement match with negative impact — immediate review required." },
  { type: "child_views_not_sought", severity: "high", message: "3 assessments have child views not sought." },
  { type: "existing_children_not_consulted", severity: "high", message: "4 assessments have existing children not consulted." },
];

const ARIA_INSIGHTS = [
  "8 matching assessments across 4 children. Poor match: 2. Negative impact: 1. Pre-admission: 3.",
  "Priority: 1 unsuitable match. Child views sought 62.5%. Existing children consulted 50.0%.",
  "Good matching protects everyone. Were existing children consulted? Was the impact on the group assessed?",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good Match": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor Match": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Unsuitable": { label: "Unsuit.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PlacementMatchingAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-teal-200">
      <CardHeader className="pb-3 bg-teal-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Puzzle className="h-4 w-4 text-teal-600" /><span className="text-teal-900">Placement Matching</span></CardTitle>
          <Link href="/placement-matching-assessment" className="text-xs text-teal-600 hover:underline flex items-center gap-1">Matching <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_match_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_match_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_match_count}</p><p className="text-[10px] text-muted-foreground">Poor Match</p></div>
          <div className={cn("text-center rounded-lg p-2", m.negative_impact_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.negative_impact_count === 0 ? "text-green-600" : "text-amber-600")}>{m.negative_impact_count}</p><p className="text-[10px] text-muted-foreground">Neg. Impact</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.pre_admission_count}</p><p className="text-[10px] text-muted-foreground">Pre-Admit</p></div>
          <div className="text-center rounded-lg p-2 bg-teal-50"><p className="text-lg font-bold tabular-nums text-teal-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Layers className="h-3 w-3 text-teal-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.domain} · {r.timing}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Matching Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-teal-700"><Brain className="h-3 w-3" />ARIA Matching Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-teal-200 bg-teal-50 text-teal-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
