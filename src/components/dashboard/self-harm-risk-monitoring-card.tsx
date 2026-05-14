"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ChevronRight, AlertTriangle, Brain, Clock, HeartCrack } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 12, critical_count: 1, high_count: 3, no_safety_plan_count: 1, needs_review_count: 2, child_engaged_rate: 83.3, camhs_involved_rate: 58.3, staff_trained_rate: 75.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; risk: string; intervention: string; plan: string }[] = [
  { child: "Child A", risk: "Medium", intervention: "Therapeutic", plan: "Active" },
  { child: "Child B", risk: "High", intervention: "CAMHS", plan: "Needs Review" },
  { child: "Child C", risk: "Critical", intervention: "Crisis Team", plan: "Not in Place" },
  { child: "Child D", risk: "Low", intervention: "1-to-1", plan: "Active" },
  { child: "Child A", risk: "Medium", intervention: "Safety Plan", plan: "Active" },
  { child: "Child B", risk: "High", intervention: "Env Safety", plan: "Needs Review" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_no_safety_plan", severity: "critical", message: "Child C at critical self-harm risk without safety plan in place — urgent action required." },
  { type: "camhs_not_involved", severity: "high", message: "2 high/critical risk records have CAMHS not involved." },
  { type: "staff_not_trained", severity: "high", message: "3 monitoring records show staff not trained in self-harm support." },
];

const ARIA_INSIGHTS = [
  "12 records. 4 children. Critical: 1. High: 3. No plan: 1. CAMHS: 58.3%. Staff trained: 75%.",
  "Priority: 1 critical no plan. 2 high no CAMHS. 3 staff untrained. Strengthen self-harm protocols.",
  "Positive: Safety plan reviews regular. Environmental checks consistent. Multi-agency working improving.",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SelfHarmRiskMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-brand" />Self-Harm Risk</CardTitle>
          <Link href="/self-harm-risk-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_count === 0 ? "text-green-600" : "text-amber-600")}>{m.high_count}</p><p className="text-[10px] text-muted-foreground">High</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_safety_plan_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_safety_plan_count === 0 ? "text-green-600" : "text-red-600")}>{m.no_safety_plan_count}</p><p className="text-[10px] text-muted-foreground">No Plan</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Monitoring</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["Medium"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HeartCrack className="h-3 w-3 text-rose-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.intervention} · {r.plan}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Risk Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Risk Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
