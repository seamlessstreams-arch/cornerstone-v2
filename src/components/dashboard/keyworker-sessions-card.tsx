"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronRight, AlertTriangle, Brain, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 24, excellent_count: 6, good_count: 10, poor_count: 2, distressed_count: 1, child_led_rate: 75.0, wishes_feelings_rate: 83.3, session_recorded_rate: 91.7, unique_children: 5, average_duration: 32.5 };

const DEMO_RECORDS: { child: string; keyworker: string; focus: string; quality: string }[] = [
  { child: "Child A", keyworker: "Staff A", focus: "Emotional", quality: "Excellent" },
  { child: "Child B", keyworker: "Staff B", focus: "Care Plan", quality: "Good" },
  { child: "Child C", keyworker: "Staff A", focus: "Life Skills", quality: "Good" },
  { child: "Child D", keyworker: "Staff C", focus: "Advocacy", quality: "Adequate" },
  { child: "Child A", keyworker: "Staff A", focus: "Targets", quality: "Excellent" },
  { child: "Child E", keyworker: "Staff B", focus: "Emotional", quality: "Poor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "distressed", severity: "critical", message: "Child E distressed during poor quality session — review keyworker support." },
  { type: "not_recorded", severity: "high", message: "2 sessions not recorded — maintain session records." },
  { type: "not_child_led", severity: "medium", message: "6 sessions not child-led — improve child participation." },
];

const ARIA_INSIGHTS = [
  "24 sessions. 5 children. Excellent: 6. Good: 10. Poor: 2. Distressed: 1. Child-led: 75%. Avg: 32.5 min.",
  "Priority: 1 distressed. 2 not recorded. 6 not child-led. Improve participation. Strengthen records.",
  "Positive: Most sessions good quality. Regular frequency. Wishes captured 83%. Strong keyworker bonds.",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-green-700 bg-green-50 border-green-200" },
  "Adequate": { label: "Adequate", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function KeyworkerSessionsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-brand" />Keyworker Sessions</CardTitle>
          <Link href="/keyworker-sessions" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.child_led_rate >= 80 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_led_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_led_rate}%</p><p className="text-[10px] text-muted-foreground">Child-Led</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.excellent_count}</p><p className="text-[10px] text-muted-foreground">Excellent</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.good_count}</p><p className="text-[10px] text-muted-foreground">Good</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><User className="h-3 w-3 text-brand shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.keyworker} · {r.focus}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Session Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Keyworker Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
