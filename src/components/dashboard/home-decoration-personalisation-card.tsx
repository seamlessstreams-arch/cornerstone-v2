"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, ChevronRight, AlertTriangle, Brain, Clock, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 18, very_satisfied_count: 7, dissatisfied_count: 2, child_chose_rate: 83.3, reflects_identity_rate: 77.8, child_satisfied_rate: 88.9, unique_children: 5 };

const DEMO_RECORDS: { child: string; type: string; scope: string; satisfaction: string }[] = [
  { child: "Child A", type: "Bedroom", scope: "Bedroom", satisfaction: "V. Satisfied" },
  { child: "Child B", type: "Wall Art", scope: "Bedroom", satisfaction: "Satisfied" },
  { child: "Child C", type: "Colour Scheme", scope: "Both", satisfaction: "Dissatisfied" },
  { child: "Child D", type: "Bedding", scope: "Bedroom", satisfaction: "V. Satisfied" },
  { child: "Child A", type: "Communal", scope: "Communal", satisfaction: "Satisfied" },
  { child: "Child E", type: "Cultural", scope: "Bedroom", satisfaction: "V. Satisfied" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "dissatisfied", severity: "critical", message: "Child C dissatisfied with colour scheme and had no choice — address immediately." },
  { type: "identity", severity: "high", message: "4 assessments show personalisation not reflecting identity." },
  { type: "not_updated", severity: "medium", message: "3 personalisation areas not regularly updated." },
];

const ARIA_INSIGHTS = [
  "18 assessments. 5 children. V. Satisfied: 7. Dissatisfied: 2. Chose: 83.3%. Identity: 77.8%.",
  "Priority: 1 dissatisfied no choice. 4 not reflecting identity. 3 not updated. Improve personalisation.",
  "Positive: 88.9% satisfied. Good cultural sensitivity. Children involved in planning. Homely environments.",
];

const SATISFACTION_BADGES: Record<string, { label: string; color: string }> = {
  "V. Satisfied": { label: "V. Sat.", color: "text-green-700 bg-green-50 border-green-200" },
  "Satisfied": { label: "Satisfied", color: "text-green-700 bg-green-50 border-green-200" },
  "Neutral": { label: "Neutral", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Dissatisfied": { label: "Dissat.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeDecorationPersonalisationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-brand" />Home Personalisation</CardTitle>
          <Link href="/home-decoration-personalisation" className="text-xs text-brand hover:underline flex items-center gap-1">Personalisation <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.child_satisfied_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_satisfied_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.child_satisfied_rate}%</p><p className="text-[10px] text-muted-foreground">Satisfied</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.very_satisfied_count}</p><p className="text-[10px] text-muted-foreground">V. Sat.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.child_chose_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_chose_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.child_chose_rate}%</p><p className="text-[10px] text-muted-foreground">Chose</p></div>
          <div className={cn("text-center rounded-lg p-2", m.dissatisfied_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.dissatisfied_count === 0 ? "text-green-600" : "text-red-600")}>{m.dissatisfied_count}</p><p className="text-[10px] text-muted-foreground">Dissat.</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SATISFACTION_BADGES[r.satisfaction] ?? SATISFACTION_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Smile className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.scope}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Personalisation Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Personalisation Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
