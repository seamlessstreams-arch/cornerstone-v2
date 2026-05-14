"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, ChevronRight, AlertTriangle, Brain, Clock, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_checkins: 30, unhappy_count: 3, very_unhappy_count: 1, concerns_identified_count: 4, follow_up_needed_count: 3, child_engaged_rate: 90.0, child_voice_rate: 86.7, average_wellbeing_score: 7.2, unique_children: 5 };

const DEMO_RECORDS: { child: string; mood: string; time: string; state: string }[] = [
  { child: "Child A", mood: "Happy", time: "Morning", state: "Calm" },
  { child: "Child B", mood: "Okay", time: "After School", state: "Anxious" },
  { child: "Child C", mood: "V.Unhappy", time: "Evening", state: "Withdrawn" },
  { child: "Child D", mood: "Happy", time: "Bedtime", state: "Content" },
  { child: "Child A", mood: "V.Happy", time: "Morning", state: "Excited" },
  { child: "Child E", mood: "Unhappy", time: "Ad Hoc", state: "Sad" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_unhappy_no_followup", severity: "critical", message: "Child C reported very unhappy during evening check-in without follow-up planned — immediate review needed." },
  { type: "concerns_sw_not_informed", severity: "high", message: "2 check-ins have concerns identified without social worker informed." },
  { type: "not_eating_well", severity: "medium", message: "3 check-ins show children not eating well." },
];

const ARIA_INSIGHTS = [
  "30 check-ins. 5 children. Unhappy: 3. V.Unhappy: 1. Engaged: 90%. Voice: 86.7%. Avg score: 7.2/10.",
  "Priority: 1 very unhappy no follow-up. 2 concerns no SW. 3 not eating well. Strengthen pastoral support.",
  "Positive: Regular check-ins embedded. Child engagement high. Wellbeing scores trending upward.",
];

const MOOD_BADGES: Record<string, { label: string; color: string }> = {
  "V.Happy": { label: "V.Happy", color: "text-green-700 bg-green-50 border-green-200" },
  "Happy": { label: "Happy", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Okay": { label: "Okay", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Unhappy": { label: "Unhappy", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "V.Unhappy": { label: "V.Unhappy", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildWellbeingCheckinCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Smile className="h-4 w-4 text-brand" />Wellbeing Check-Ins</CardTitle>
          <Link href="/child-wellbeing-checkin" className="text-xs text-brand hover:underline flex items-center gap-1">Check-ins <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.child_voice_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_voice_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.child_voice_rate}%</p><p className="text-[10px] text-muted-foreground">Voice</p></div>
          <div className={cn("text-center rounded-lg p-2", m.very_unhappy_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.very_unhappy_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_unhappy_count}</p><p className="text-[10px] text-muted-foreground">V.Unhappy</p></div>
          <div className={cn("text-center rounded-lg p-2", m.concerns_identified_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.concerns_identified_count === 0 ? "text-green-600" : "text-amber-600")}>{m.concerns_identified_count}</p><p className="text-[10px] text-muted-foreground">Concerns</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.average_wellbeing_score}</p><p className="text-[10px] text-muted-foreground">Avg Score</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Check-Ins</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = MOOD_BADGES[r.mood] ?? MOOD_BADGES["Okay"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HeartHandshake className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.time} · {r.state}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Wellbeing Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Wellbeing Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
