"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronRight, AlertTriangle, Brain, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_supports: 24, regulated_independently_count: 8, not_regulated_count: 2, escalated_count: 1, trauma_reminder_count: 4, trauma_informed_rate: 87.5, child_participated_rate: 83.3, average_duration: 18.5, unique_children: 5 };

const DEMO_RECORDS: { child: string; strategy: string; trigger: string; outcome: string }[] = [
  { child: "Child A", strategy: "Co-Reg", trigger: "Transition", outcome: "Regulated" },
  { child: "Child B", strategy: "Breathing", trigger: "Peer", outcome: "With Support" },
  { child: "Child C", strategy: "Safe Space", trigger: "Trauma", outcome: "Partial" },
  { child: "Child D", strategy: "Coaching", trigger: "School", outcome: "Independent" },
  { child: "Child A", strategy: "Sensory", trigger: "Overload", outcome: "Regulated" },
  { child: "Child E", strategy: "Activity", trigger: "Contact", outcome: "Escalated" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "escalated_not_trauma_informed", severity: "critical", message: "Child E escalated without trauma-informed approach — review therapeutic practice." },
  { type: "not_trauma_informed", severity: "high", message: "3 emotional regulation supports were not trauma-informed." },
  { type: "child_not_participated", severity: "high", message: "4 supports have child not participating." },
];

const ARIA_INSIGHTS = [
  "24 supports. 5 children. Independent: 8. Escalated: 1. Trauma-informed: 87.5%. Avg: 18.5 min.",
  "Priority: 1 escalated not trauma-informed. 3 not trauma-informed. 4 not participating. Adapt.",
  "Positive: Good co-regulation practice. Sensory tools available. Safe spaces established.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Regulated": { label: "Regulated", color: "text-green-700 bg-green-50 border-green-200" },
  "Independent": { label: "Independent", color: "text-green-700 bg-green-50 border-green-200" },
  "With Support": { label: "Supported", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Partial": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Escalated": { label: "Escalated", color: "text-red-700 bg-red-50 border-red-200" },
};

export function EmotionalRegulationSupportCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-brand" />Emotional Regulation</CardTitle>
          <Link href="/emotional-regulation-support" className="text-xs text-brand hover:underline flex items-center gap-1">Support <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.regulated_independently_count}</p><p className="text-[10px] text-muted-foreground">Self-Reg</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className={cn("text-center rounded-lg p-2", m.trauma_informed_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.trauma_informed_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.trauma_informed_rate}%</p><p className="text-[10px] text-muted-foreground">Trauma</p></div>
          <div className={cn("text-center rounded-lg p-2", m.trauma_reminder_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.trauma_reminder_count === 0 ? "text-green-600" : "text-amber-600")}>{m.trauma_reminder_count}</p><p className="text-[10px] text-muted-foreground">Triggers</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Support</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Regulated"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Sparkles className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.strategy} · {r.trigger}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Regulation Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Wellbeing Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
