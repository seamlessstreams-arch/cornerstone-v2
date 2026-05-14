"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint, ChevronRight, AlertTriangle, Brain, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 12, neglectful_count: 1, not_involved_count: 1, negative_impact_count: 1, poor_care_count: 2, animal_welfare_rate: 83.3, veterinary_care_rate: 91.7, hygiene_rate: 75.0, risk_assessment_rate: 83.3, unique_children: 5 };

const DEMO_RECORDS: { child: string; pet: string; quality: string; impact: string }[] = [
  { child: "Child A", pet: "Dog", quality: "Excellent", impact: "V. Positive" },
  { child: "Child B", pet: "Rabbit", quality: "Good", impact: "Positive" },
  { child: "Child C", pet: "Cat", quality: "Neglectful", impact: "Negative" },
  { child: "Child D", pet: "Fish", quality: "Adequate", impact: "Neutral" },
  { child: "Child E", pet: "Guinea Pig", quality: "Good", impact: "Positive" },
  { child: "Child F", pet: "Hamster", quality: "Poor", impact: "Minimal" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "neglectful_negative", severity: "critical", message: "Child C experienced neglectful pet care with negative therapeutic impact — welfare review required." },
  { type: "no_animal_welfare", severity: "high", message: "2 sessions have animal welfare standards not met." },
  { type: "no_risk_assessment", severity: "high", message: "2 sessions have no risk assessment completed." },
];

const ARIA_INSIGHTS = [
  "12 sessions. Neglectful: 1. Poor care: 2. Negative impact: 1. Welfare: 83.3%. Vet care: 91.7%.",
  "Priority: 1 neglectful care case. Animal welfare at 83.3%. Hygiene at 75.0% needs improvement.",
  "Positive: Most children engaged positively with pets. Veterinary care high. Empathy developing.",
];

const IMPACT_BADGES: Record<string, { label: string; color: string }> = {
  "V. Positive": { label: "V.Pos", color: "text-green-700 bg-green-50 border-green-200" },
  "Positive": { label: "Pos.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neut.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Minimal": { label: "Min.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Negative": { label: "Neg.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PetCareResponsibilityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><PawPrint className="h-4 w-4 text-brand" />Pet Care</CardTitle>
          <Link href="/pet-care-responsibility" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.neglectful_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.neglectful_count === 0 ? "text-green-600" : "text-red-600")}>{m.neglectful_count}</p><p className="text-[10px] text-muted-foreground">Neglectful</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_care_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_care_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_care_count}</p><p className="text-[10px] text-muted-foreground">Poor Care</p></div>
          <div className={cn("text-center rounded-lg p-2", m.negative_impact_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.negative_impact_count === 0 ? "text-green-600" : "text-amber-600")}>{m.negative_impact_count}</p><p className="text-[10px] text-muted-foreground">Neg. Impact</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = IMPACT_BADGES[r.impact] ?? IMPACT_BADGES["Neutral"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Heart className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.pet} · {r.quality}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pet Care Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Pet Care Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
