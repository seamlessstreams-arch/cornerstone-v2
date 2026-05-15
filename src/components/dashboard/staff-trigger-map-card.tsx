"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronRight, AlertTriangle, Brain, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_maps: 7, severe_count: 2, ineffective_coping_count: 2, active_count: 3, unreviewed_count: 2, staff_involved_rate: 57.1, coping_strategies_rate: 42.9, wellbeing_checked_rate: 42.9, environmental_factors_rate: 28.6, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; trigger: string; severity: string; coping: string }[] = [
  { staff: "Staff A", trigger: "Child Behaviour", severity: "Severe", coping: "Ineffective" },
  { staff: "Staff B", trigger: "Workload", severity: "Moderate", coping: "Partially" },
  { staff: "Staff C", trigger: "Shift Pattern", severity: "Overwhelming", coping: "Counterproductive" },
  { staff: "Staff D", trigger: "Team Conflict", severity: "Mild", coping: "Effective" },
  { staff: "Staff E", trigger: "Personal Stress", severity: "Significant", coping: "Partially" },
  { staff: "Staff F", trigger: "Environmental", severity: "Moderate", coping: "Effective" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "severe_ineffective_coping", severity: "critical", message: "Staff C has a severe trigger with ineffective coping in shift pattern — immediate support needed." },
  { type: "staff_not_involved", severity: "high", message: "3 trigger maps have staff not involved in the process." },
  { type: "no_coping_strategies", severity: "high", message: "4 trigger maps have no coping strategies identified." },
];

const ARIA_INSIGHTS = [
  "7 trigger maps across 5 staff. Severe: 2. Ineffective coping: 2. Active: 3. Unreviewed: 2.",
  "Priority: 2 severe triggers with poor coping. Staff involvement only 57.1%. Wellbeing checked 42.9%.",
  "Understand triggers, don't blame. What environments help? What adjustments prevent recurrence?",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Mild": { label: "Mild", color: "text-green-700 bg-green-50 border-green-200" },
  "Moderate": { label: "Mod.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Significant": { label: "Sig.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Severe": { label: "Severe", color: "text-red-700 bg-red-50 border-red-200" },
  "Overwhelming": { label: "O/whelm", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffTriggerMapCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Trigger Maps</span></CardTitle>
          <Link href="/staff-trigger-map" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Maps <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.severe_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.severe_count === 0 ? "text-green-600" : "text-red-600")}>{m.severe_count}</p><p className="text-[10px] text-muted-foreground">Severe</p></div>
          <div className={cn("text-center rounded-lg p-2", m.ineffective_coping_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.ineffective_coping_count === 0 ? "text-green-600" : "text-amber-600")}>{m.ineffective_coping_count}</p><p className="text-[10px] text-muted-foreground">Ineff. Cope</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unreviewed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unreviewed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unreviewed_count}</p><p className="text-[10px] text-muted-foreground">Unreviewed</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_maps}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Trigger Maps</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Moderate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><MapPin className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.trigger} · {r.coping}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Trigger Map Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Trigger Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
