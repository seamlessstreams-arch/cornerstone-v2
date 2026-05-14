"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronRight, AlertTriangle, Brain, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_activities: 14, refused_count: 1, reluctant_count: 2, no_progress_count: 1, no_output_count: 2, child_choice_rate: 78.6, achievement_rate: 57.1, self_expression_rate: 85.7, continuation_rate: 64.3, unique_children: 6 };

const DEMO_RECORDS: { child: string; activity: string; engagement: string; output: string }[] = [
  { child: "Child A", activity: "Art/Drawing", engagement: "Deeply Engaged", output: "Exhibited" },
  { child: "Child B", activity: "Music", engagement: "Engaged", output: "Completed" },
  { child: "Child C", activity: "Drama", engagement: "Refused", output: "No Output" },
  { child: "Child D", activity: "Cooking", engagement: "Participating", output: "Work in Progress" },
  { child: "Child E", activity: "Photography", engagement: "Engaged", output: "Completed" },
  { child: "Child F", activity: "Dance", engagement: "Reluctant", output: "Exploratory" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_no_expression", severity: "critical", message: "Child C refused drama without self-expression support." },
  { type: "achievement_not_recognised", severity: "high", message: "6 activities have achievement not recognised." },
  { type: "continuation_not_planned", severity: "medium", message: "5 activities without continuation planned." },
];

const ARIA_INSIGHTS = [
  "14 activities. Refused: 1. Reluctant: 2. No progress: 1. No output: 2. Choice: 78.6%. Achievement: 57.1%.",
  "Priority: 1 refused no expression. 6 unrecognised achievements. 5 no continuation. Celebrate creative efforts.",
  "Positive: Self-expression supported in 85.7%. Activities age-appropriate. Peer interaction positive overall.",
];

const ENGAGEMENT_BADGES: Record<string, { label: string; color: string }> = {
  "Deeply Engaged": { label: "Deep", color: "text-green-700 bg-green-50 border-green-200" },
  "Engaged": { label: "Engaged", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Participating": { label: "Partic.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Reluctant": { label: "Reluct.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Refused": { label: "Refused", color: "text-red-700 bg-red-50 border-red-200" },
};

export function CreativeEnrichmentActivitiesCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-brand" />Creative Enrichment</CardTitle>
          <Link href="/creative-enrichment-activities" className="text-xs text-brand hover:underline flex items-center gap-1">Activities <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-red-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_progress_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_progress_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_progress_count}</p><p className="text-[10px] text-muted-foreground">No Prog.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_output_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_output_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_output_count}</p><p className="text-[10px] text-muted-foreground">No Output</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_activities}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Activities</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = ENGAGEMENT_BADGES[r.engagement] ?? ENGAGEMENT_BADGES["Engaged"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Sparkles className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.activity} · {r.output}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Creative Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Creative Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
