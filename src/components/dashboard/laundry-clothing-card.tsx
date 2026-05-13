"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — LAUNDRY & CLOTHING INTELLIGENCE CARD
// Dashboard card for clothing provision, laundry standards, and child choice.
// CHR 2015 Reg 7, Reg 6, Reg 10.
// SCCIF: Overall Experiences — "Children are well-clothed."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shirt, ChevronRight, AlertTriangle, Brain,
  Clock, Sparkles, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 15,
  clothing_purchase_count: 5,
  clothing_inventory_count: 4,
  laundry_check_count: 3,
  child_chose_own_rate: 73.3,
  adequate_wardrobe_rate: 86.7,
  school_uniform_adequate_rate: 93.3,
  seasonal_clothing_rate: 80.0,
  laundry_done_regularly_rate: 86.7,
  clothes_returned_promptly_rate: 80.0,
  dignity_maintained_rate: 100.0,
  cultural_needs_met_rate: 86.7,
  poor_laundry_count: 1,
  needs_replacing_count: 2,
  no_choice_count: 1,
  full_choice_rate: 53.3,
  total_budget: 1250.00,
  total_spent: 985.50,
  review_overdue_count: 1,
};

const DEMO_RECORDS: { child: string; type: string; condition: string; date: string; choice: string }[] = [
  { child: "Child A", type: "Purchase", condition: "New", date: "11 May", choice: "Full" },
  { child: "Child B", type: "Inventory", condition: "Good", date: "10 May", choice: "Some" },
  { child: "Child C", type: "Laundry", condition: "Good", date: "9 May", choice: "Full" },
  { child: "Child A", type: "Uniform", condition: "Good", date: "7 May", choice: "Full" },
  { child: "Child D", type: "Seasonal", condition: "Fair", date: "5 May", choice: "Limited" },
  { child: "Child B", type: "Purchase", condition: "New", date: "3 May", choice: "Full" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "inadequate_wardrobe", severity: "high", message: "2 children have inadequate wardrobe — arrange clothing provision." },
  { type: "no_clothing_choice", severity: "high", message: "1 record shows no clothing choice given — children must choose their own clothes." },
  { type: "review_overdue", severity: "medium", message: "1 clothing review is overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "15 records. Child chose own: 73.3%. Adequate wardrobe: 86.7%. Dignity maintained: 100%. Cultural needs met: 86.7%. Budget: £1,250 / Spent: £985.50.",
  "Priority: 2 inadequate wardrobes. 1 no choice given. 1 overdue review. Full choice rate at 53.3% needs improvement. 2 items need replacing.",
  "Positive: Dignity maintained in all records. School uniforms adequate 93.3%. Good laundry regularity. Cultural needs mostly met. Improve clothing choice.",
];

const CHOICE_BADGES: Record<string, { label: string; color: string }> = {
  "Full": { label: "Full", color: "text-green-700 bg-green-50 border-green-200" },
  "Some": { label: "Some", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Limited": { label: "Limited", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "None": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function LaundryClothingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shirt className="h-4 w-4 text-brand" />
            Laundry & Clothing
          </CardTitle>
          <Link href="/laundry-clothing" className="text-xs text-brand hover:underline flex items-center gap-1">
            Clothing <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.adequate_wardrobe_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.adequate_wardrobe_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.adequate_wardrobe_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Adequate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_chose_own_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_chose_own_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_chose_own_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Child Choice</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.dignity_maintained_rate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.dignity_maintained_rate >= 100 ? "text-green-600" : "text-red-600")}>{m.dignity_maintained_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Dignity</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.needs_replacing_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.needs_replacing_count === 0 ? "text-green-600" : "text-amber-600")}>{m.needs_replacing_count}</p>
            <p className="text-[10px] text-muted-foreground">Replace</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Clothing Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = CHOICE_BADGES[r.choice] ?? CHOICE_BADGES["Some"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Heart className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.condition} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Clothing Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Clothing Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
