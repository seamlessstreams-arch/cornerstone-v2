"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, ChevronRight, AlertTriangle, Brain, Clock, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reports: 8, severe_count: 1, life_threatening_count: 0, gp_not_contacted_count: 1, awaiting_review_count: 2, child_informed_rate: 87.5, gp_contacted_promptly_rate: 75.0, medication_review_rate: 62.5, wellbeing_monitored_rate: 87.5, unique_children: 4 };

const DEMO_RECORDS: { child: string; effect: string; severity: string; gp: string }[] = [
  { child: "Child A", effect: "Drowsiness", severity: "Mild", gp: "Monitoring" },
  { child: "Child B", effect: "Appetite", severity: "Moderate", gp: "Dose Adjusted" },
  { child: "Child C", effect: "Mood Change", severity: "Severe", gp: "Awaiting" },
  { child: "Child D", effect: "Sleep", severity: "Mild", gp: "No Change" },
  { child: "Child A", effect: "Nausea", severity: "Moderate", gp: "Changed" },
  { child: "Child B", effect: "Headache", severity: "Mild", gp: "Not Contacted" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "severe_no_gp_contact", severity: "critical", message: "Child C has severe side effect without prompt GP contact — escalate immediately." },
  { type: "gp_not_contacted", severity: "high", message: "1 side effect report has GP not contacted." },
  { type: "wellbeing_not_monitored", severity: "medium", message: "2 reports without wellbeing monitoring." },
];

const ARIA_INSIGHTS = [
  "8 reports. 4 children. Severe: 1. GP contacted: 75%. Review requested: 62.5%. Wellbeing: 87.5%.",
  "Priority: 1 severe no GP. 1 GP not contacted. 2 no wellbeing monitoring. Strengthen medication oversight.",
  "Positive: Child-informed rate high. Care plans updated. Staff awareness consistent across team.",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Mild": { label: "Mild", color: "text-green-700 bg-green-50 border-green-200" },
  "Moderate": { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Severe": { label: "Severe", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MedicationSideEffectsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Pill className="h-4 w-4 text-brand" />Side Effects</CardTitle>
          <Link href="/medication-side-effects" className="text-xs text-brand hover:underline flex items-center gap-1">Reports <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.severe_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.severe_count === 0 ? "text-green-600" : "text-red-600")}>{m.severe_count}</p><p className="text-[10px] text-muted-foreground">Severe</p></div>
          <div className={cn("text-center rounded-lg p-2", m.gp_not_contacted_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.gp_not_contacted_count === 0 ? "text-green-600" : "text-amber-600")}>{m.gp_not_contacted_count}</p><p className="text-[10px] text-muted-foreground">No GP</p></div>
          <div className={cn("text-center rounded-lg p-2", m.awaiting_review_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.awaiting_review_count === 0 ? "text-green-600" : "text-amber-600")}>{m.awaiting_review_count}</p><p className="text-[10px] text-muted-foreground">Awaiting</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reports</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Mild"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Syringe className="h-3 w-3 text-orange-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.effect} · {r.gp}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Side Effect Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Medication Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
