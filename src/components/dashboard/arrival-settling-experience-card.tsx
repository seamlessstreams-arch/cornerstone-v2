"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ChevronRight, AlertTriangle, Brain, Clock, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 12, distressed_count: 1, poor_welcome_count: 2, uncomfortable_count: 2, unsettled_count: 2, room_prepared_rate: 83.3, preferences_asked_rate: 66.7, peer_introductions_rate: 75.0, key_worker_rate: 91.7, unique_children: 5 };

const DEMO_RECORDS: { child: string; stage: string; settling: string; comfort: string }[] = [
  { child: "Child A", stage: "First Day", settling: "Settled", comfort: "Comfy" },
  { child: "Child B", stage: "Week Review", settling: "Adjusting", comfort: "Neutral" },
  { child: "Child C", stage: "Pre-Arrival", settling: "V. Distressed", comfort: "V. Uncomfy" },
  { child: "Child D", stage: "Month Review", settling: "Mostly Set.", comfort: "Comfy" },
  { child: "Child E", stage: "Peer Intro", settling: "Unsettled", comfort: "Uncomfy" },
  { child: "Child A", stage: "2 Week Check", settling: "Settled", comfort: "V. Comfy" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "distressed_poor_welcome", severity: "critical", message: "Child C very distressed with poor welcome — immediate support needed." },
  { type: "no_room_prepared", severity: "high", message: "2 reviews have room not prepared." },
  { type: "no_key_worker", severity: "high", message: "1 review has no key worker assigned." },
];

const ARIA_INSIGHTS = [
  "12 reviews. Distressed: 1. Poor welcome: 2. Uncomfortable: 2. Room prep: 83.3%. Key worker: 91.7%.",
  "Priority: 1 distressed child with poor welcome. Preferences asked only 66.7%. Peer intros at 75%.",
  "Positive: Most children settling well. Key worker assignment at 91.7%. Good dietary checks.",
];

const COMFORT_BADGES: Record<string, { label: string; color: string }> = {
  "V. Comfy": { label: "V.Cmfy", color: "text-green-700 bg-green-50 border-green-200" },
  "Comfy": { label: "Comfy", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Uncomfy": { label: "Uncomf.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "V. Uncomfy": { label: "V.Uncm", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ArrivalSettlingExperienceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Home className="h-4 w-4 text-brand" />Arrival &amp; Settling</CardTitle>
          <Link href="/arrival-settling-experience" className="text-xs text-brand hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.distressed_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.distressed_count === 0 ? "text-green-600" : "text-red-600")}>{m.distressed_count}</p><p className="text-[10px] text-muted-foreground">Distressed</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_welcome_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_welcome_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_welcome_count}</p><p className="text-[10px] text-muted-foreground">Poor Welc.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unsettled_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unsettled_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unsettled_count}</p><p className="text-[10px] text-muted-foreground">Unsettled</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = COMFORT_BADGES[r.comfort] ?? COMFORT_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HandHeart className="h-3 w-3 text-rose-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.stage} · {r.settling}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Settling Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Settling Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
