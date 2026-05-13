"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — RESPITE & SHORT BREAKS INTELLIGENCE CARD
// Dashboard card for respite care, short breaks, and their impact.
// CHR 2015 Reg 14, Reg 36; Children Act 1989 Sch 2 para 6.
// SCCIF: Overall Experiences — "Short breaks are planned around
// children's needs." "Respite is used positively and not punitively."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palmtree, ChevronRight, AlertTriangle, Brain,
  CalendarCheck2, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_breaks: 12,
  children_with_breaks: 4,
  planned_count: 8,
  emergency_count: 2,
  completed_count: 7,
  total_nights: 28,
  positive_impact_rate: 71.4,
  child_views_sought_rate: 83.3,
};

const DEMO_RECORDS: { child: string; type: string; nights: number; impact: string }[] = [
  { child: "Child A", type: "Planned Respite", nights: 3, impact: "Positive" },
  { child: "Child B", type: "Emergency Break", nights: 2, impact: "Neutral" },
  { child: "Child C", type: "Host Family", nights: 5, impact: "Very Positive" },
  { child: "Child D", type: "Activity Break", nights: 1, impact: "Positive" },
  { child: "Child A", type: "Holiday", nights: 7, impact: "Very Positive" },
  { child: "Child B", type: "Emergency Break", nights: 1, impact: "Negative" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "emergency_no_risk_ax", severity: "high", message: "Emergency break for Child B without completed risk assessment — conduct retrospective assessment." },
  { type: "child_views_missing", severity: "high", message: "2 breaks arranged without seeking the child's views — children must be consulted about respite arrangements." },
  { type: "no_return_plan", severity: "medium", message: "1 active break has no return plan — ensure smooth transitions back." },
];

const ARIA_INSIGHTS = [
  "12 breaks for 4 children. Planned: 8 (67%). Emergency: 2 (17%). Completed: 7. Total nights: 28. Positive impact: 71.4%. Views sought: 83.3%.",
  "Priority: Child B — 2 emergency breaks, 1 with negative impact, missing risk assessment. 2 breaks without child consultation. 1 active break lacks return plan.",
  "Positive: 67% planned vs 17% emergency shows good forward planning. 71.4% positive impact demonstrates breaks benefit children. Host family and activity breaks showing strongest outcomes. Consider involving children more in break planning.",
];

const IMPACT_BADGES: Record<string, { label: string; color: string }> = {
  "Very Positive": { label: "V.Positive", color: "text-green-700 bg-green-50 border-green-200" },
  "Positive": { label: "Positive", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "Neutral": { label: "Neutral", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Negative": { label: "Negative", color: "text-red-700 bg-red-50 border-red-200" },
  "Very Negative": { label: "V.Negative", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Assessed": { label: "N/A", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function RespiteShortBreaksCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palmtree className="h-4 w-4 text-brand" />
            Respite & Short Breaks
          </CardTitle>
          <Link href="/respite-short-breaks" className="text-xs text-brand hover:underline flex items-center gap-1">
            Breaks <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.planned_count}</p>
            <p className="text-[10px] text-muted-foreground">Planned</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.emergency_count > 0 ? "bg-orange-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.emergency_count > 0 ? "text-orange-600" : "text-green-600")}>{m.emergency_count}</p>
            <p className="text-[10px] text-muted-foreground">Emergency</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.positive_impact_rate}%</p>
            <p className="text-[10px] text-muted-foreground">+Impact</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.child_views_sought_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Views Sought</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><CalendarCheck2 className="h-3 w-3" />Recent Breaks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = IMPACT_BADGES[r.impact] ?? IMPACT_BADGES["Not Assessed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.nights}n</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Respite Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Respite Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
