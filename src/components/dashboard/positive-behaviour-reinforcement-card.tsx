"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ChevronRight, AlertTriangle, Brain, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 15, absent_praise_count: 1, negative_response_count: 1, inconsistent_count: 2, indifferent_count: 2, behaviour_specific_rate: 80.0, timely_delivery_rate: 73.3, child_input_rate: 66.7, culturally_sensitive_rate: 86.7, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; praise: string; response: string }[] = [
  { child: "Child A", type: "Verbal Praise", praise: "Specific", response: "Very Positive" },
  { child: "Child B", type: "Reward Chart", praise: "Appropriate", response: "Positive" },
  { child: "Child C", type: "Certificate", praise: "Generic", response: "Neutral" },
  { child: "Child D", type: "Activity", praise: "Absent", response: "Negative" },
  { child: "Child E", type: "Peer Recog.", praise: "Appropriate", response: "Positive" },
  { child: "Child F", type: "Privilege", praise: "Specific", response: "Very Positive" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "absent_negative", severity: "critical", message: "Child D receiving no praise and responding negatively — immediate positive intervention needed." },
  { type: "not_behaviour_specific", severity: "high", message: "3 sessions have non-specific praise." },
  { type: "not_timely", severity: "high", message: "4 sessions have delayed reinforcement." },
];

const ARIA_INSIGHTS = [
  "15 sessions. Absent: 1. Negative: 1. Inconsistent: 2. Specific: 80%. Timely: 73.3%.",
  "Priority: 1 child with absent praise and negative response. Child input only 66.7%. Timeliness at 73.3%.",
  "Positive: Most children respond well. Verbal praise dominant. Cultural sensitivity high at 86.7%.",
];

const RESPONSE_BADGES: Record<string, { label: string; color: string }> = {
  "Very Positive": { label: "V.Pos.", color: "text-green-700 bg-green-50 border-green-200" },
  "Positive": { label: "Posit.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Indifferent": { label: "Indiff.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Negative": { label: "Negat.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PositiveBehaviourReinforcementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-brand" />Positive Behaviour</CardTitle>
          <Link href="/positive-behaviour-reinforcement" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.absent_praise_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.absent_praise_count === 0 ? "text-green-600" : "text-red-600")}>{m.absent_praise_count}</p><p className="text-[10px] text-muted-foreground">No Praise</p></div>
          <div className={cn("text-center rounded-lg p-2", m.negative_response_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.negative_response_count === 0 ? "text-green-600" : "text-amber-600")}>{m.negative_response_count}</p><p className="text-[10px] text-muted-foreground">Negative</p></div>
          <div className={cn("text-center rounded-lg p-2", m.inconsistent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.inconsistent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.inconsistent_count}</p><p className="text-[10px] text-muted-foreground">Inconsist.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESPONSE_BADGES[r.response] ?? RESPONSE_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Star className="h-3 w-3 text-yellow-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.praise}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Behaviour Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Behaviour Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
