"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, AlertTriangle, Brain, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 6, not_delivered_count: 1, below_expected_count: 2, review_due_count: 2, no_ehcp_count: 1, ehcp_in_place_rate: 83.3, child_views_rate: 50.0, provision_monitored_rate: 66.7, transition_planned_rate: 33.3, unique_children: 4 };

const DEMO_RECORDS: { child: string; category: string; provision: string; progress: string }[] = [
  { child: "Child A", category: "Autism", provision: "Fully Delivered", progress: "On Track" },
  { child: "Child B", category: "SEMH", provision: "Partially", progress: "Below Expected" },
  { child: "Child C", category: "Speech & Lang.", provision: "Not Delivered", progress: "Sig. Below" },
  { child: "Child A", category: "Cognition", provision: "Mostly", progress: "On Track" },
  { child: "Child D", category: "Sensory", provision: "Fully Delivered", progress: "Exceeding" },
  { child: "Child B", category: "SpLD", provision: "Under Review", progress: "Below Expected" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "not_delivered_below_expected", severity: "critical", message: "Child C has SEND provision not delivered with below-expected outcomes — urgent action needed." },
  { type: "no_ehcp_in_place", severity: "high", message: "1 child record has no EHCP in place." },
  { type: "child_views_not_captured", severity: "high", message: "3 child records have child views not captured." },
];

const ARIA_INSIGHTS = [
  "6 SEND records across 4 children. Not delivered: 1. Below expected: 2. Reviews due: 2.",
  "Priority: 1 undelivered provision with poor outcomes. Child views captured only 50.0%. Transition planned 33.3%.",
  "Every child with SEND deserves their full provision. Is the EHCP being delivered? Are outcomes improving?",
];

const PROGRESS_BADGES: Record<string, { label: string; color: string }> = {
  "Exceeding": { label: "Exceed", color: "text-green-700 bg-green-50 border-green-200" },
  "On Track": { label: "On Track", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Below Expected": { label: "Below", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Sig. Below": { label: "Sig.Below", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Assessed": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function EhcpSendMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-indigo-200">
      <CardHeader className="pb-3 bg-indigo-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-indigo-600" /><span className="text-indigo-900">EHCP & SEND</span></CardTitle>
          <Link href="/ehcp-send-monitoring" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">SEND <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.not_delivered_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_delivered_count === 0 ? "text-green-600" : "text-red-600")}>{m.not_delivered_count}</p><p className="text-[10px] text-muted-foreground">Not Deliv.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.below_expected_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.below_expected_count === 0 ? "text-green-600" : "text-amber-600")}>{m.below_expected_count}</p><p className="text-[10px] text-muted-foreground">Below Exp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.review_due_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.review_due_count === 0 ? "text-green-600" : "text-amber-600")}>{m.review_due_count}</p><p className="text-[10px] text-muted-foreground">Review Due</p></div>
          <div className="text-center rounded-lg p-2 bg-indigo-50"><p className="text-lg font-bold tabular-nums text-indigo-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />SEND Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PROGRESS_BADGES[r.progress] ?? PROGRESS_BADGES["Not Assessed"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><GraduationCap className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.category} · {r.provision}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />SEND Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-indigo-700"><Brain className="h-3 w-3" />ARIA SEND Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-indigo-200 bg-indigo-50 text-indigo-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
