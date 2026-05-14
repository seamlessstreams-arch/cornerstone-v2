"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, AlertTriangle, Brain, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 14, fully_engaged_count: 8, declined_count: 1, distressed_count: 1, trauma_informed_rate: 85.7, child_led_rate: 71.4, consent_obtained_rate: 92.9, unique_children: 5 };

const DEMO_RECORDS: { child: string; type: string; engagement: string; status: string }[] = [
  { child: "Child A", type: "Life Story Book", engagement: "Fully", status: "Engaged" },
  { child: "Child B", type: "Memory Box", engagement: "Mostly", status: "Engaged" },
  { child: "Child C", type: "Timeline", engagement: "Reluctant", status: "Reluctant" },
  { child: "Child D", type: "Family Tree", engagement: "Fully", status: "Engaged" },
  { child: "Child A", type: "Photos", engagement: "Fully", status: "Engaged" },
  { child: "Child E", type: "Digital Story", engagement: "Declined", status: "Declined" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "distressed", severity: "critical", message: "Child B was distressed during session — therapist not consulted." },
  { type: "not_trauma", severity: "high", message: "2 sessions not trauma-informed — review approach." },
  { type: "consent", severity: "medium", message: "1 session without consent obtained." },
];

const ARIA_INSIGHTS = [
  "14 sessions. 5 children. Engaged: 8. Trauma-informed: 85.7%. Child-led: 71.4%. 1 distressed.",
  "Priority: 1 distressed without therapist. 2 not trauma-informed. Improve consent. Support reluctant child.",
  "Positive: Good engagement overall. Regular sessions. Life story books progressing. Memory boxes created.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Engaged": { label: "Engaged", color: "text-green-700 bg-green-50 border-green-200" },
  "Reluctant": { label: "Reluctant", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
};

export function LifeStoryWorkCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand" />Life Story Work</CardTitle>
          <Link href="/life-story-work" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Sessions</p></div>
          <div className={cn("text-center rounded-lg p-2", m.trauma_informed_rate >= 100 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.trauma_informed_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.trauma_informed_rate}%</p><p className="text-[10px] text-muted-foreground">Trauma</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.fully_engaged_count}</p><p className="text-[10px] text-muted-foreground">Engaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.distressed_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.distressed_count === 0 ? "text-green-600" : "text-red-600")}>{m.distressed_count}</p><p className="text-[10px] text-muted-foreground">Distress</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Engaged"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Heart className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.engagement}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Life Story Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Life Story Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
