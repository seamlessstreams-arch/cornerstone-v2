"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, ChevronRight, AlertTriangle, Brain, Clock, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 10, ineffective_count: 1, adverse_effects_count: 1, non_adherent_count: 1, overdue_review_count: 1, side_effects_rate: 80.0, prescriber_rate: 70.0, consent_rate: 90.0, storage_rate: 80.0, unique_children: 6 };

const DEMO_RECORDS: { child: string; category: string; effectiveness: string; adherence: string }[] = [
  { child: "Child A", category: "Stimulant", effectiveness: "Effective", adherence: "Full" },
  { child: "Child B", category: "Antidepressant", effectiveness: "Effective", adherence: "Mostly" },
  { child: "Child C", category: "Antipsychotic", effectiveness: "Adverse", adherence: "Variable" },
  { child: "Child D", category: "Inhaler", effectiveness: "Highly Effective", adherence: "Full" },
  { child: "Child E", category: "Anxiolytic", effectiveness: "Ineffective", adherence: "Non-Adh." },
  { child: "Child F", category: "Anticonvulsant", effectiveness: "Partially", adherence: "Mostly" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "adverse_no_prescriber", severity: "critical", message: "Child C's antipsychotic showing adverse effects without prescriber consultation." },
  { type: "side_effects_not_monitored", severity: "high", message: "2 reviews have side effects not monitored." },
  { type: "storage_not_compliant", severity: "medium", message: "2 reviews with non-compliant medication storage." },
];

const ARIA_INSIGHTS = [
  "10 reviews. Ineffective: 1. Adverse: 1. Non-adherent: 1. Overdue: 1. Side effects: 80%. Prescriber: 70%.",
  "Priority: 1 adverse without prescriber. 2 side effects unmonitored. 2 storage issues. Strengthen medication oversight.",
  "Positive: Consent current for most. Dosage appropriate. Administration correct in majority of cases.",
];

const EFFECTIVENESS_BADGES: Record<string, { label: string; color: string }> = {
  "Highly Effective": { label: "High", color: "text-green-700 bg-green-50 border-green-200" },
  "Effective": { label: "Effect.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Partially": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Ineffective": { label: "Ineff.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Adverse": { label: "Adverse", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MedicationEffectivenessReviewCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Pill className="h-4 w-4 text-brand" />Medication Review</CardTitle>
          <Link href="/medication-effectiveness-review" className="text-xs text-brand hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.adverse_effects_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.adverse_effects_count === 0 ? "text-green-600" : "text-red-600")}>{m.adverse_effects_count}</p><p className="text-[10px] text-muted-foreground">Adverse</p></div>
          <div className={cn("text-center rounded-lg p-2", m.ineffective_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.ineffective_count === 0 ? "text-green-600" : "text-amber-600")}>{m.ineffective_count}</p><p className="text-[10px] text-muted-foreground">Ineff.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_adherent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_adherent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.non_adherent_count}</p><p className="text-[10px] text-muted-foreground">Non-Adh.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = EFFECTIVENESS_BADGES[r.effectiveness] ?? EFFECTIVENESS_BADGES["Effective"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Stethoscope className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.category} · {r.adherence}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Medication Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Medication Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
