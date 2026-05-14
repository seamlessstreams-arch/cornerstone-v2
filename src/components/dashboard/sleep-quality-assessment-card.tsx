"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, ChevronRight, AlertTriangle, Brain, Clock, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 18, poor_sleep_count: 3, very_poor_sleep_count: 1, no_routine_count: 1, unsuitable_environment_count: 0, continuous_disturbance_count: 1, bedtime_consistent_rate: 77.8, screen_free_rate: 66.7, average_sleep_hours: 7.8, unique_children: 5 };

const DEMO_RECORDS: { child: string; quality: string; hours: string; concern: string }[] = [
  { child: "Child A", quality: "Good", hours: "8.5h", concern: "None" },
  { child: "Child B", quality: "Poor", hours: "5.5h", concern: "Anxiety" },
  { child: "Child C", quality: "Fair", hours: "7.0h", concern: "Nightmares" },
  { child: "Child D", quality: "V.Poor", hours: "4.5h", concern: "Insomnia" },
  { child: "Child A", quality: "Good", hours: "8.0h", concern: "None" },
  { child: "Child E", quality: "Excellent", hours: "9.5h", concern: "None" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_poor_no_gp_referral", severity: "critical", message: "Child D has very poor sleep quality without GP referral considered — urgent health review needed." },
  { type: "no_sleep_plan", severity: "high", message: "2 children have no sleep plan in place." },
  { type: "screens_before_bed", severity: "medium", message: "6 assessments show screens not removed before bed." },
];

const ARIA_INSIGHTS = [
  "18 assessments. 5 children. Poor: 3. V.Poor: 1. Avg: 7.8h. Consistent bedtime: 77.8%. Screen-free: 66.7%.",
  "Priority: 1 very poor no GP referral. 2 no sleep plans. 6 screens before bed. Strengthen sleep hygiene.",
  "Positive: Good routine adherence improving. Room comfort high. Relaxation activities embedded.",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Fair": { label: "Fair", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "V.Poor": { label: "V.Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SleepQualityAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BedDouble className="h-4 w-4 text-brand" />Sleep Quality</CardTitle>
          <Link href="/sleep-quality-assessment" className="text-xs text-brand hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.bedtime_consistent_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.bedtime_consistent_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.bedtime_consistent_rate}%</p><p className="text-[10px] text-muted-foreground">Consistent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.very_poor_sleep_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.very_poor_sleep_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_poor_sleep_count}</p><p className="text-[10px] text-muted-foreground">V.Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_sleep_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_sleep_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_sleep_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.average_sleep_hours}h</p><p className="text-[10px] text-muted-foreground">Avg Hours</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Moon className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.hours} · {r.concern}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sleep Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Sleep Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
