"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEALTIMES & NUTRITION INTELLIGENCE CARD
// Dashboard card for meal quality, dietary compliance, and nutrition monitoring.
// CHR 2015 Reg 9, Reg 6, Reg 36.
// SCCIF: Overall Experiences — "Children enjoy nutritious meals."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UtensilsCrossed, ChevronRight, AlertTriangle, Brain,
  Clock, Salad, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_meals: 42,
  children_ate_rate: 87.5,
  balanced_meal_rate: 81.0,
  fresh_ingredients_rate: 90.5,
  allergies_checked_rate: 95.2,
  cultural_needs_rate: 73.8,
  children_involved_preparation_rate: 33.3,
  children_involved_choice_rate: 54.8,
  positive_atmosphere_rate: 88.1,
  staff_ate_with_children_rate: 64.3,
  food_waste_minimal_rate: 71.4,
  poor_meal_count: 1,
  excellent_meal_count: 12,
};

const DEMO_RECORDS: { type: string; description: string; date: string; quality: string }[] = [
  { type: "Dinner", description: "Chicken stir-fry, rice", date: "12 May", quality: "Excellent" },
  { type: "Lunch", description: "Fish fingers, veg, mash", date: "12 May", quality: "Good" },
  { type: "Breakfast", description: "Cereal, toast, fruit", date: "12 May", quality: "Good" },
  { type: "Dinner", description: "Pasta bolognese, salad", date: "11 May", quality: "Excellent" },
  { type: "Lunch", description: "Jacket potatoes, beans", date: "11 May", quality: "Adequate" },
  { type: "Breakfast", description: "Pancakes, berries", date: "11 May", quality: "Excellent" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "cultural_needs_missed", severity: "medium", message: "11 meals without cultural dietary needs considered — ensure inclusivity." },
  { type: "no_child_choice", severity: "medium", message: "19 meals without children involved in menu choice — promote participation." },
];

const ARIA_INSIGHTS = [
  "42 meals recorded. Children ate: 87.5%. Balanced: 81.0%. Fresh ingredients: 90.5%. Allergies checked: 95.2%. Positive atmosphere: 88.1%.",
  "Priority: Cultural needs considered in 73.8% of meals. Children involved in choice only 54.8%. Staff eating with children 64.3% — all need improvement.",
  "Positive: High allergy checking rate. Good meal quality. Fresh ingredients used consistently. 12 excellent meals. Encourage more child participation.",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adequate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MealtimesNutritionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-brand" />
            Mealtimes & Nutrition
          </CardTitle>
          <Link href="/mealtimes-nutrition" className="text-xs text-brand hover:underline flex items-center gap-1">
            Meals <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_meals}</p>
            <p className="text-[10px] text-muted-foreground">Meals</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.children_ate_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_ate_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.children_ate_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Children Ate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.balanced_meal_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.balanced_meal_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.balanced_meal_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Balanced</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.allergies_checked_rate >= 95 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.allergies_checked_rate >= 95 ? "text-green-600" : "text-red-600")}>{m.allergies_checked_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Allergy Chk.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Meals</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Good"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Salad className="h-3 w-3 text-green-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.description} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Nutrition Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Nutrition Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
