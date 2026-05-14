"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, ChevronRight, AlertTriangle, Brain, Clock, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 10, escalated_count: 1, unresolved_count: 1, coerced_count: 0, worsened_count: 1, child_voice_rate: 80.0, victim_supported_rate: 70.0, agreement_rate: 80.0, staff_trained_rate: 70.0, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; impact: string }[] = [
  { child: "Child A", type: "Conversation", outcome: "Resolved", impact: "Improved" },
  { child: "Child B", type: "Peer Mediation", outcome: "Mostly", impact: "Improved" },
  { child: "Child C", type: "Circle Time", outcome: "Escalated", impact: "Worsened" },
  { child: "Child D", type: "Reparation", outcome: "Resolved", impact: "Sig. Improved" },
  { child: "Child E", type: "Shuttle Med.", outcome: "Partially", impact: "No Change" },
  { child: "Child F", type: "Family Conf.", outcome: "Unresolved", impact: "No Change" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "child_voice_not_heard", severity: "high", message: "2 sessions have child voice not heard." },
  { type: "victim_not_supported", severity: "high", message: "3 sessions have victim not supported." },
  { type: "staff_not_trained", severity: "medium", message: "3 sessions facilitated by untrained staff." },
];

const ARIA_INSIGHTS = [
  "10 sessions. Escalated: 1. Unresolved: 1. Worsened: 1. Child voice: 80%. Agreement: 80%.",
  "Priority: Child voice not heard in 2 sessions. Victim support at 70%. Staff training needed at 70%.",
  "Positive: Most sessions reach agreement. Relationship improvement in majority. Reparation activities effective.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Resolved": { label: "Resolved", color: "text-green-700 bg-green-50 border-green-200" },
  "Mostly": { label: "Mostly", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Partially": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Unresolved": { label: "Unres.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Escalated": { label: "Escalated", color: "text-red-700 bg-red-50 border-red-200" },
};

export function RestorativeJusticePracticeCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-brand" />Restorative Justice</CardTitle>
          <Link href="/restorative-justice-practice" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unresolved_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unresolved_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unresolved_count}</p><p className="text-[10px] text-muted-foreground">Unresolved</p></div>
          <div className={cn("text-center rounded-lg p-2", m.worsened_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.worsened_count === 0 ? "text-green-600" : "text-amber-600")}>{m.worsened_count}</p><p className="text-[10px] text-muted-foreground">Worsened</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Partially"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Handshake className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.impact}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Restorative Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Restorative Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
