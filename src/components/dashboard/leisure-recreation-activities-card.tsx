"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronRight, AlertTriangle, Brain, Clock, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_activities: 15, refused_count: 1, disliked_count: 1, decline_count: 1, no_choice_count: 2, child_chose_rate: 86.7, community_based_rate: 66.7, inclusive_access_rate: 80.0, risk_assessed_rate: 86.7, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; enjoyment: string; participation: string }[] = [
  { child: "Child A", type: "Sport", enjoyment: "Loved It", participation: "Enthusiastic" },
  { child: "Child B", type: "Music", enjoyment: "Enjoyed", participation: "Willing" },
  { child: "Child C", type: "Outdoor Adv.", enjoyment: "Neutral", participation: "Reluctant" },
  { child: "Child D", type: "Creative Arts", enjoyment: "Loved It", participation: "Enthusiastic" },
  { child: "Child E", type: "Community", enjoyment: "Disliked", participation: "Refused" },
  { child: "Child F", type: "Cooking", enjoyment: "Enjoyed", participation: "Willing" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_declining", severity: "critical", message: "Child E refused community group and showing skill decline." },
  { type: "no_child_choice", severity: "high", message: "2 activities have child not choosing activity." },
  { type: "no_community_activities", severity: "medium", message: "5 activities not community-based — increase integration." },
];

const ARIA_INSIGHTS = [
  "15 activities. Refused: 1. Disliked: 1. Declining: 1. Child choice: 86.7%. Community: 66.7%.",
  "Priority: 1 child refusing with decline. 2 activities not child-chosen. Community integration at 66.7%.",
  "Positive: Most children enthusiastic. Good variety of activities. Strong peer interaction observed.",
];

const ENJOYMENT_BADGES: Record<string, { label: string; color: string }> = {
  "Loved It": { label: "Loved", color: "text-green-700 bg-green-50 border-green-200" },
  "Enjoyed": { label: "Enjoyed", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Disliked": { label: "Disliked", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Hated": { label: "Hated", color: "text-red-700 bg-red-50 border-red-200" },
};

export function LeisureRecreationActivitiesCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-brand" />Leisure & Recreation</CardTitle>
          <Link href="/leisure-recreation-activities" className="text-xs text-brand hover:underline flex items-center gap-1">Activities <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-red-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disliked_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disliked_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disliked_count}</p><p className="text-[10px] text-muted-foreground">Disliked</p></div>
          <div className={cn("text-center rounded-lg p-2", m.decline_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.decline_count === 0 ? "text-green-600" : "text-amber-600")}>{m.decline_count}</p><p className="text-[10px] text-muted-foreground">Decline</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_activities}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Activities</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = ENJOYMENT_BADGES[r.enjoyment] ?? ENJOYMENT_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><TreePine className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.participation}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Leisure Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Leisure Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
