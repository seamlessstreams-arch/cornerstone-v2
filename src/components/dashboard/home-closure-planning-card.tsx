"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorClosed, ChevronRight, AlertTriangle, Brain, Clock, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 6, disrupted_count: 1, not_started_count: 1, children_without_plan_count: 1, regulatory_not_sent_count: 1, child_views_rate: 66.7, transition_plan_rate: 50.0, risk_assessment_rate: 66.7, staff_consultation_rate: 50.0, child_wishes_rate: 50.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; phase: string; transfer: string; reason: string }[] = [
  { child: "Child A", phase: "Consultation", transfer: "Matching", reason: "Provider Decision" },
  { child: "Child B", phase: "Active Trans.", transfer: "Transferred", reason: "Lease Expiry" },
  { child: "Child C", phase: "Pre-Planning", transfer: "Not Started", reason: "Strategic" },
  { child: "Child A", phase: "Active Trans.", transfer: "Identified", reason: "Provider Decision" },
  { child: "Child D", phase: "Active Trans.", transfer: "Disrupted", reason: "Staffing Failure" },
  { child: "Child B", phase: "Final Closure", transfer: "Transferred", reason: "Lease Expiry" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disrupted_no_plan", severity: "critical", message: "Child D has a disrupted transfer with no transition plan — immediate review required." },
  { type: "regulatory_not_sent", severity: "high", message: "1 active transition has regulatory notification not sent." },
  { type: "child_views_not_sought", severity: "high", message: "2 children have views not sought during closure planning." },
];

const ARIA_INSIGHTS = [
  "6 closure records across 4 children. Disrupted: 1. Not started: 1. No plan: 1.",
  "Priority: 1 disrupted transfer without plan. Child views sought 66.7%. Transition plans 50.0%.",
  "Home closure affects every child profoundly. Is every child heard? Is every transfer planned and supported?",
];

const PHASE_BADGES: Record<string, { label: string; color: string }> = {
  "Pre-Planning": { label: "Pre-Plan", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Consultation": { label: "Consult", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Active Trans.": { label: "Active", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Final Closure": { label: "Final", color: "text-red-700 bg-red-50 border-red-200" },
  "Post-Closure": { label: "Post", color: "text-green-700 bg-green-50 border-green-200" },
};

export function HomeClosurePlanningCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-violet-200">
      <CardHeader className="pb-3 bg-violet-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><DoorClosed className="h-4 w-4 text-violet-600" /><span className="text-violet-900">Closure Planning</span></CardTitle>
          <Link href="/home-closure-planning" className="text-xs text-violet-600 hover:underline flex items-center gap-1">Planning <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.disrupted_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.disrupted_count === 0 ? "text-green-600" : "text-red-600")}>{m.disrupted_count}</p><p className="text-[10px] text-muted-foreground">Disrupted</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_started_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_started_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_started_count}</p><p className="text-[10px] text-muted-foreground">Not Started</p></div>
          <div className={cn("text-center rounded-lg p-2", m.regulatory_not_sent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.regulatory_not_sent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.regulatory_not_sent_count}</p><p className="text-[10px] text-muted-foreground">Reg. Unsent</p></div>
          <div className="text-center rounded-lg p-2 bg-violet-50"><p className="text-lg font-bold tabular-nums text-violet-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Closure Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PHASE_BADGES[r.phase] ?? PHASE_BADGES["Pre-Planning"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><ArrowRightLeft className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.transfer} · {r.reason}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Closure Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-violet-700"><Brain className="h-3 w-3" />ARIA Closure Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-violet-200 bg-violet-50 text-violet-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
