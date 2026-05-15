"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, ChevronRight, AlertTriangle, Brain, Clock, BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_incidents: 8, severe_count: 1, crisis_count: 0, trauma_linked_count: 3, ongoing_count: 2, settled_within_hour_rate: 62.5, sleep_plan_rate: 75.0, clinical_referral_rate: 37.5, pattern_identified_rate: 50.0, environment_adapted_rate: 37.5, staff_debriefed_rate: 75.0, parent_informed_rate: 62.5, trauma_link_rate: 37.5, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; severity: string; outcome: string }[] = [
  { child: "Child A", type: "Nightmares", severity: "Moderate", outcome: "Improved" },
  { child: "Child B", type: "Insomnia", severity: "Severe", outcome: "Ongoing" },
  { child: "Child C", type: "Night Terrors", severity: "Moderate", outcome: "Resolved" },
  { child: "Child A", type: "Trauma Flash.", severity: "Moderate", outcome: "Referral" },
  { child: "Child D", type: "Hypervigilance", severity: "Mild", outcome: "Resolved" },
  { child: "Child B", type: "Anxiety", severity: "Moderate", outcome: "Ongoing" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "severe_no_plan", severity: "high", message: "Child B has severe sleep disturbance without a sleep plan in place — immediate support needed." },
  { type: "trauma_no_therapy", severity: "high", message: "3 incidents with trauma link identified but no therapeutic support arranged." },
  { type: "pattern_no_adapt", severity: "medium", message: "4 incidents with pattern identified but environment not yet adapted." },
];

const ARIA_INSIGHTS = [
  "8 incidents across 4 children. Severe: 1. Trauma-linked: 3. Ongoing: 2.",
  "Priority: 1 severe without sleep plan. Trauma-linked 37.5%. Settled within hour 62.5%.",
  "Sleep is fundamental to wellbeing. Are trauma links being explored? Are sleep plans personalised and reviewed regularly?",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Mild": { label: "Mild", color: "text-green-700 bg-green-50 border-green-200" },
  "Moderate": { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Severe": { label: "Severe", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Crisis": { label: "Crisis", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SleepDisturbanceInterventionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-indigo-200">
      <CardHeader className="pb-3 bg-indigo-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-indigo-600" /><span className="text-indigo-900">Sleep Disturbance</span></CardTitle>
          <Link href="/sleep-disturbance-intervention" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">Interventions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.crisis_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.crisis_count === 0 ? "text-green-600" : "text-red-600")}>{m.crisis_count}</p><p className="text-[10px] text-muted-foreground">Crisis</p></div>
          <div className={cn("text-center rounded-lg p-2", m.severe_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.severe_count === 0 ? "text-green-600" : "text-amber-600")}>{m.severe_count}</p><p className="text-[10px] text-muted-foreground">Severe</p></div>
          <div className={cn("text-center rounded-lg p-2", m.trauma_linked_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.trauma_linked_count === 0 ? "text-green-600" : "text-amber-600")}>{m.trauma_linked_count}</p><p className="text-[10px] text-muted-foreground">Trauma</p></div>
          <div className="text-center rounded-lg p-2 bg-indigo-50"><p className="text-lg font-bold tabular-nums text-indigo-600">{m.total_incidents}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Incidents</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Mild"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><BedDouble className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.outcome}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sleep Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-indigo-700"><Brain className="h-3 w-3" />ARIA Sleep Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-indigo-200 bg-indigo-50 text-indigo-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
