"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandMetal, ChevronRight, AlertTriangle, Brain, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 10, effective_count: 6, needs_revision_count: 2, escalation_required_count: 1, de_escalation_rate: 80.0, child_consulted_rate: 70.0, staff_trained_rate: 90.0, unique_children: 5 };

const DEMO_RECORDS: { child: string; plan: string; trigger: string; status: string }[] = [
  { child: "Child A", plan: "De-Escalation", trigger: "Emotional", status: "Effective" },
  { child: "Child B", plan: "Handling Plan", trigger: "Sensory", status: "Effective" },
  { child: "Child C", plan: "Crisis Plan", trigger: "Transition", status: "Revise" },
  { child: "Child D", plan: "Calming", trigger: "Demand", status: "Effective" },
  { child: "Child A", plan: "Regulation", trigger: "Social", status: "Escalate" },
  { child: "Child E", plan: "Handling Plan", trigger: "Emotional", status: "Effective" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "escalation", severity: "critical", message: "Escalation required for Child A — staff not trained on plan." },
  { type: "no_deesc", severity: "high", message: "2 plans have no de-escalation steps documented." },
  { type: "not_consulted", severity: "high", message: "3 plans have child not consulted." },
];

const ARIA_INSIGHTS = [
  "10 reviews. Effective: 6. Revise: 2. Escalation: 1. De-esc: 80%. Trained: 90%. 5 children.",
  "Priority: 1 escalation untrained. 2 missing de-escalation. 3 children not consulted. Strengthen participation.",
  "Positive: Most plans effective. Good staff training. Regular reviews. Calming strategies in place.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Effective": { label: "Effective", color: "text-green-700 bg-green-50 border-green-200" },
  "Revise": { label: "Revise", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Escalate": { label: "Escalate", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PositiveHandlingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HandMetal className="h-4 w-4 text-brand" />Positive Handling</CardTitle>
          <Link href="/positive-handling" className="text-xs text-brand hover:underline flex items-center gap-1">Plans <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.de_escalation_rate >= 100 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.de_escalation_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.de_escalation_rate}%</p><p className="text-[10px] text-muted-foreground">De-Esc</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.effective_count}</p><p className="text-[10px] text-muted-foreground">Effective</p></div>
          <div className={cn("text-center rounded-lg p-2", m.needs_revision_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.needs_revision_count === 0 ? "text-green-600" : "text-amber-600")}>{m.needs_revision_count}</p><p className="text-[10px] text-muted-foreground">Revise</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalation_required_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalation_required_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalation_required_count}</p><p className="text-[10px] text-muted-foreground">Escalate</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Effective"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Shield className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.plan} · {r.trigger}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Handling Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Handling Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
