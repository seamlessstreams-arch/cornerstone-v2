"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, ChevronRight, AlertTriangle, Brain, Clock, Salad } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_meals: 24, poor_nutrition_count: 2, refused_count: 3, allergen_concern_count: 2, cultural_not_met_count: 1, allergens_checked_rate: 91.7, dietary_needs_met_rate: 83.3, child_chose_rate: 58.3, mealtime_positive_rate: 75.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; meal: string; nutrition: string; satisfaction: string }[] = [
  { child: "Child A", meal: "Dinner", nutrition: "Excellent", satisfaction: "Loved It" },
  { child: "Child B", meal: "Lunch", nutrition: "Good", satisfaction: "Enjoyed" },
  { child: "Child C", meal: "Breakfast", nutrition: "Poor", satisfaction: "Refused" },
  { child: "Child A", meal: "Packed Lunch", nutrition: "Good", satisfaction: "Okay" },
  { child: "Child D", meal: "Dinner", nutrition: "Adequate", satisfaction: "Didn't Like" },
  { child: "Child B", meal: "Supper", nutrition: "Good", satisfaction: "Enjoyed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "allergen_medical_risk", severity: "critical", message: "Child C has a medical diet with allergens not checked — immediate review required." },
  { type: "allergens_not_checked", severity: "high", message: "2 meals have allergens not checked." },
  { type: "dietary_needs_not_met", severity: "high", message: "4 meals have dietary needs not met." },
];

const ARIA_INSIGHTS = [
  "24 meals across 4 children. Poor nutrition: 2. Refused: 3. Allergen concerns: 2.",
  "Priority: 1 medical diet allergen risk. Allergens checked 91.7%. Child chose meal 58.3%.",
  "Food is care. Are meals varied? Cultural? Does the child feel involved? Are mealtimes positive?",
];

const NUTRITION_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Inadequate": { label: "Inadeq.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MenuPlanningDietaryCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-amber-200">
      <CardHeader className="pb-3 bg-amber-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-amber-600" /><span className="text-amber-900">Menu & Dietary</span></CardTitle>
          <Link href="/menu-planning-dietary" className="text-xs text-amber-600 hover:underline flex items-center gap-1">Meals <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_nutrition_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_nutrition_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_nutrition_count}</p><p className="text-[10px] text-muted-foreground">Poor Nutr.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-amber-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.allergen_concern_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.allergen_concern_count === 0 ? "text-green-600" : "text-red-600")}>{m.allergen_concern_count}</p><p className="text-[10px] text-muted-foreground">Allergen</p></div>
          <div className="text-center rounded-lg p-2 bg-amber-50"><p className="text-lg font-bold tabular-nums text-amber-600">{m.total_meals}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Meals</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = NUTRITION_BADGES[r.nutrition] ?? NUTRITION_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Salad className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.meal} · {r.satisfaction}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Dietary Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-amber-700"><Brain className="h-3 w-3" />ARIA Nutrition Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-amber-200 bg-amber-50 text-amber-800" : i === 1 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
