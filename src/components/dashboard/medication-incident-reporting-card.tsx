"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, ChevronRight, AlertTriangle, Brain, Clock, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_incidents: 6, serious_harm_count: 1, moderate_harm_count: 1, near_miss_count: 2, open_investigation_count: 2, gp_notified_rate: 66.7, parent_notified_rate: 83.3, social_worker_notified_rate: 50.0, root_cause_rate: 50.0, learning_shared_rate: 33.3, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; severity: string; status: string }[] = [
  { child: "Child A", type: "Wrong Dose", severity: "Minor", status: "Closed" },
  { child: "Child B", type: "Missed Dose", severity: "No Harm", status: "Investigating" },
  { child: "Child C", type: "Adverse React.", severity: "Serious", status: "Investigating" },
  { child: "Child A", type: "Near Miss", severity: "No Harm", status: "Actions Done" },
  { child: "Child D", type: "Wrong Time", severity: "Moderate", status: "Root Cause" },
  { child: "Child B", type: "Near Miss", severity: "No Harm", status: "Closed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "serious_not_notified", severity: "critical", message: "Child C has serious harm incident with Ofsted not notified — immediate regulatory notification required." },
  { type: "moderate_no_candour", severity: "high", message: "1 moderate+ harm incident has duty of candour not applied." },
  { type: "multiple_incidents_child", severity: "high", message: "Child A and Child B have multiple medication incidents." },
];

const ARIA_INSIGHTS = [
  "6 incidents across 4 children. Serious: 1. Moderate: 1. Near miss: 2. Open: 2.",
  "Priority: 1 serious harm not notified to Ofsted. Root cause identified 50.0%. Learning shared 33.3%.",
  "Medication safety is non-negotiable. Are root causes identified? Is learning preventing recurrence?",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "No Harm": { label: "No Harm", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Moderate": { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Serious": { label: "Serious", color: "text-red-700 bg-red-50 border-red-200" },
  "Death": { label: "Death", color: "text-red-900 bg-red-100 border-red-300" },
};

export function MedicationIncidentReportingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-rose-200">
      <CardHeader className="pb-3 bg-rose-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Pill className="h-4 w-4 text-rose-600" /><span className="text-rose-900">Med Incidents</span></CardTitle>
          <Link href="/medication-incident-reporting" className="text-xs text-rose-600 hover:underline flex items-center gap-1">Incidents <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.serious_harm_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.serious_harm_count === 0 ? "text-green-600" : "text-red-600")}>{m.serious_harm_count}</p><p className="text-[10px] text-muted-foreground">Serious</p></div>
          <div className={cn("text-center rounded-lg p-2", m.moderate_harm_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.moderate_harm_count === 0 ? "text-green-600" : "text-amber-600")}>{m.moderate_harm_count}</p><p className="text-[10px] text-muted-foreground">Moderate</p></div>
          <div className={cn("text-center rounded-lg p-2", m.open_investigation_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.open_investigation_count === 0 ? "text-green-600" : "text-amber-600")}>{m.open_investigation_count}</p><p className="text-[10px] text-muted-foreground">Open</p></div>
          <div className="text-center rounded-lg p-2 bg-rose-50"><p className="text-lg font-bold tabular-nums text-rose-600">{m.total_incidents}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Incidents</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["No Harm"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><CircleAlert className="h-3 w-3 text-rose-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Med Incident Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-rose-700"><Brain className="h-3 w-3" />ARIA Med Safety Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-rose-200 bg-rose-50 text-rose-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
