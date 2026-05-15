"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ChevronRight, AlertTriangle, Brain, Clock, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, inadequate_count: 1, requires_improvement_count: 2, urgent_action_count: 1, actions_not_implemented_count: 2, child_views_rate: 62.5, staff_views_rate: 75.0, visitor_views_rate: 37.5, actions_implemented_rate: 50.0, shared_with_children_rate: 37.5, unique_assessors: 3 };

const DEMO_RECORDS: { assessor: string; dimension: string; rating: string; action: string }[] = [
  { assessor: "J. Smith", dimension: "Warmth", rating: "Excellent", action: "None" },
  { assessor: "M. Davies", dimension: "Belonging", rating: "Good", action: "Monitor" },
  { assessor: "J. Smith", dimension: "Safety", rating: "Req. Improv.", action: "Sig. Action" },
  { assessor: "L. Jones", dimension: "Relationships", rating: "Inadequate", action: "Urgent" },
  { assessor: "M. Davies", dimension: "Privacy", rating: "Good", action: "None" },
  { assessor: "J. Smith", dimension: "Fun & Enjoy.", rating: "Adequate", action: "Minor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "inadequate_urgent", severity: "critical", message: "Relationships dimension rated inadequate with urgent action required — immediate review needed." },
  { type: "req_improvement_not_actioned", severity: "high", message: "2 dimensions require improvement but actions not implemented." },
  { type: "child_views_missing", severity: "high", message: "3 assessments have child views not included." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 3 assessors. Inadequate: 1. Requires improvement: 2. Urgent action: 1.",
  "Priority: 1 inadequate with urgent action. Child views included 62.5%. Shared with children 37.5%.",
  "Home should feel like home. Do children feel warm, welcome and safe? Are their views shaping the atmosphere?",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Req. Improv.": { label: "Req. Imp.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Inadequate": { label: "Inadeq.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeAtmosphereAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-orange-200">
      <CardHeader className="pb-3 bg-orange-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Flame className="h-4 w-4 text-orange-600" /><span className="text-orange-900">Home Atmosphere</span></CardTitle>
          <Link href="/home-atmosphere-assessment" className="text-xs text-orange-600 hover:underline flex items-center gap-1">Atmosphere <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.inadequate_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.inadequate_count === 0 ? "text-green-600" : "text-red-600")}>{m.inadequate_count}</p><p className="text-[10px] text-muted-foreground">Inadeq.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.requires_improvement_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.requires_improvement_count === 0 ? "text-green-600" : "text-amber-600")}>{m.requires_improvement_count}</p><p className="text-[10px] text-muted-foreground">Req. Imp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.urgent_action_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.urgent_action_count === 0 ? "text-green-600" : "text-red-600")}>{m.urgent_action_count}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          <div className="text-center rounded-lg p-2 bg-orange-50"><p className="text-lg font-bold tabular-nums text-orange-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Home className="h-3 w-3 text-orange-500 shrink-0" /><span className="font-medium">{r.assessor}</span><span className="text-muted-foreground truncate">{r.dimension} · {r.action}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Atmosphere Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-orange-700"><Brain className="h-3 w-3" />ARIA Atmosphere Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-orange-200 bg-orange-50 text-orange-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
