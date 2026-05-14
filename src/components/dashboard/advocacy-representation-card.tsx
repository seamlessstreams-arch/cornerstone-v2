"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ChevronRight, AlertTriangle, Brain, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 11, poor_quality_count: 1, dissatisfied_count: 1, ineffective_count: 1, counterproductive_count: 0, child_voice_rate: 81.8, independent_access_rate: 72.7, rights_understood_rate: 72.7, confidentiality_rate: 90.9, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; satisfaction: string; quality: string }[] = [
  { child: "Child A", type: "Independent", satisfaction: "Satisfied", quality: "Good" },
  { child: "Child B", type: "Self-Advocacy", satisfaction: "V. Satisfied", quality: "Excellent" },
  { child: "Child C", type: "Complaints", satisfaction: "Dissatisfied", quality: "Poor" },
  { child: "Child D", type: "Review", satisfaction: "Satisfied", quality: "Good" },
  { child: "Child E", type: "Peer", satisfaction: "Neutral", quality: "Adequate" },
  { child: "Child F", type: "Rights Ed.", satisfaction: "Satisfied", quality: "Good" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_independent_access", severity: "high", message: "3 sessions have no independent access to advocacy." },
  { type: "child_voice_not_heard", severity: "high", message: "2 sessions have child voice not heard." },
  { type: "rights_not_understood", severity: "medium", message: "3 sessions where child did not understand rights." },
];

const ARIA_INSIGHTS = [
  "11 sessions. Poor quality: 1. Dissatisfied: 1. Ineffective: 1. Voice heard: 81.8%. Access: 72.7%.",
  "Priority: Independent access at 72.7%. Child voice not heard in 2 sessions. Rights understood 72.7%.",
  "Positive: Most children satisfied. Confidentiality well maintained. Good advocacy type variety.",
];

const SATISFACTION_BADGES: Record<string, { label: string; color: string }> = {
  "V. Satisfied": { label: "V.Sat.", color: "text-green-700 bg-green-50 border-green-200" },
  "Satisfied": { label: "Sat.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Dissatisfied": { label: "Dissat.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "V. Dissatisfied": { label: "V.Dis.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function AdvocacyRepresentationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4 text-brand" />Advocacy</CardTitle>
          <Link href="/advocacy-representation" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_quality_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_quality_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_quality_count}</p><p className="text-[10px] text-muted-foreground">Poor Qual.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.dissatisfied_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.dissatisfied_count === 0 ? "text-green-600" : "text-amber-600")}>{m.dissatisfied_count}</p><p className="text-[10px] text-muted-foreground">Dissat.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.ineffective_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.ineffective_count === 0 ? "text-green-600" : "text-amber-600")}>{m.ineffective_count}</p><p className="text-[10px] text-muted-foreground">Ineffect.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SATISFACTION_BADGES[r.satisfaction] ?? SATISFACTION_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><ShieldCheck className="h-3 w-3 text-sky-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.quality}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Advocacy Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Advocacy Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
