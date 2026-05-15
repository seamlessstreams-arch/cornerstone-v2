"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, ChevronRight, AlertTriangle, Brain, Clock, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, underweight_count: 1, overweight_count: 1, obese_count: 0, concern_count: 2, weight_recorded_rate: 87.5, bmi_calculated_rate: 75.0, dietary_needs_met_rate: 87.5, hydration_rate: 75.0, clinical_referral_rate: 25.0, weight_plan_rate: 37.5, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; bmi: string; status: string }[] = [
  { child: "Child A", type: "Quarterly", bmi: "Healthy", status: "Routine" },
  { child: "Child B", type: "Concern", bmi: "Underweight", status: "Plan" },
  { child: "Child C", type: "Annual", bmi: "Overweight", status: "Concern" },
  { child: "Child A", type: "Follow Up", bmi: "Healthy", status: "Resolved" },
  { child: "Child D", type: "Initial", bmi: "Healthy", status: "Routine" },
  { child: "Child B", type: "Clinical", bmi: "Underweight", status: "Clinical" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "underweight_no_plan", severity: "high", message: "Child B underweight without weight management plan — nutritional support needed." },
  { type: "dietary_not_met", severity: "high", message: "1 child with dietary needs not being met." },
  { type: "bmi_not_calculated", severity: "medium", message: "2 assessments without BMI calculated." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 4 children. Underweight: 1. Overweight: 1. Concerns: 2.",
  "Priority: 1 underweight without plan. Dietary needs met 87.5%. BMI calculated 75.0%.",
  "Good nutrition supports every aspect of development. Are dietary needs genuinely met? Are weight concerns addressed with sensitivity and clinical support?",
];

const BMI_BADGES: Record<string, { label: string; color: string }> = {
  "Healthy": { label: "Healthy", color: "text-green-700 bg-green-50 border-green-200" },
  "Underweight": { label: "Under", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Overweight": { label: "Over", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Obese": { label: "Obese", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildNutritionWeightMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-lime-200">
      <CardHeader className="pb-3 bg-lime-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Apple className="h-4 w-4 text-lime-600" /><span className="text-lime-900">Nutrition & Weight</span></CardTitle>
          <Link href="/child-nutrition-weight-monitoring" className="text-xs text-lime-600 hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.obese_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.obese_count === 0 ? "text-green-600" : "text-red-600")}>{m.obese_count}</p><p className="text-[10px] text-muted-foreground">Obese</p></div>
          <div className={cn("text-center rounded-lg p-2", m.underweight_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.underweight_count === 0 ? "text-green-600" : "text-amber-600")}>{m.underweight_count}</p><p className="text-[10px] text-muted-foreground">Under</p></div>
          <div className={cn("text-center rounded-lg p-2", m.overweight_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.overweight_count === 0 ? "text-green-600" : "text-amber-600")}>{m.overweight_count}</p><p className="text-[10px] text-muted-foreground">Over</p></div>
          <div className="text-center rounded-lg p-2 bg-lime-50"><p className="text-lg font-bold tabular-nums text-lime-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = BMI_BADGES[r.bmi] ?? BMI_BADGES["Healthy"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Scale className="h-3 w-3 text-lime-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Nutrition Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-lime-700"><Brain className="h-3 w-3" />ARIA Nutrition Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-lime-200 bg-lime-50 text-lime-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
