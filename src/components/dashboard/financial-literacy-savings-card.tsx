"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, ChevronRight, AlertTriangle, Brain, Clock, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 12, not_understood_count: 1, disengaged_count: 2, no_savings_count: 1, in_debt_count: 1, age_appropriate_rate: 91.7, savings_account_rate: 66.7, budget_created_rate: 75.0, pathway_plan_rate: 83.3, unique_children: 5 };

const DEMO_RECORDS: { child: string; topic: string; understanding: string; progress: string }[] = [
  { child: "Child A", topic: "Budgeting", understanding: "Confident", progress: "On Target" },
  { child: "Child B", topic: "Savings", understanding: "Good", progress: "Exceeding" },
  { child: "Child C", topic: "Banking", understanding: "Developing", progress: "Below" },
  { child: "Child D", topic: "Bills", understanding: "Limited", progress: "No Savings" },
  { child: "Child E", topic: "Debt Aware.", understanding: "Not Understood", progress: "In Debt" },
  { child: "Child A", topic: "Shopping", understanding: "Good", progress: "On Target" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "in_debt_not_understood", severity: "critical", message: "Child E in debt with topic not understood — urgent financial support needed." },
  { type: "no_savings_account", severity: "high", message: "4 sessions have no active savings account for the child." },
  { type: "no_pathway_plan", severity: "high", message: "2 sessions have pathway plan not updated." },
];

const ARIA_INSIGHTS = [
  "12 sessions. Not understood: 1. Disengaged: 2. No savings: 1. In debt: 1. Accounts: 66.7%.",
  "Priority: 1 child in debt with no understanding. Savings account rate at 66.7%. Budget creation 75%.",
  "Positive: Most children engaged. Good age-appropriate delivery. Budgeting improving.",
];

const PROGRESS_BADGES: Record<string, { label: string; color: string }> = {
  "Exceeding": { label: "Exceed", color: "text-green-700 bg-green-50 border-green-200" },
  "On Target": { label: "Target", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Below": { label: "Below", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "No Savings": { label: "None", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "In Debt": { label: "Debt", color: "text-red-700 bg-red-50 border-red-200" },
};

export function FinancialLiteracySavingsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Coins className="h-4 w-4 text-brand" />Financial Literacy</CardTitle>
          <Link href="/financial-literacy-savings" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.in_debt_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.in_debt_count === 0 ? "text-green-600" : "text-red-600")}>{m.in_debt_count}</p><p className="text-[10px] text-muted-foreground">In Debt</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disengaged_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disengaged_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disengaged_count}</p><p className="text-[10px] text-muted-foreground">Disengaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_understood_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_understood_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_understood_count}</p><p className="text-[10px] text-muted-foreground">Not Und.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PROGRESS_BADGES[r.progress] ?? PROGRESS_BADGES["Below"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><PiggyBank className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.topic} · {r.understanding}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Financial Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Financial Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
