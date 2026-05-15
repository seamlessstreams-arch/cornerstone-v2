"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ChevronRight, AlertTriangle, Brain, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 8, inadequate_count: 1, requires_improvement_count: 2, immediate_priority_count: 1, actions_not_assigned_count: 2, children_consulted_rate: 62.5, staff_consulted_rate: 75.0, external_feedback_rate: 37.5, reg44_reviewed_rate: 50.0, shared_with_ofsted_rate: 37.5, unique_reviewers: 2 };

const DEMO_RECORDS: { reviewer: string; domain: string; rating: string; priority: string }[] = [
  { reviewer: "D. Laville", domain: "Overall Exp.", rating: "Good", priority: "Medium" },
  { reviewer: "D. Laville", domain: "Protection", rating: "Inadequate", priority: "Immediate" },
  { reviewer: "J. Hughes", domain: "Education", rating: "Req. Improv.", priority: "High" },
  { reviewer: "D. Laville", domain: "Health", rating: "Good", priority: "Low" },
  { reviewer: "J. Hughes", domain: "Leadership", rating: "Req. Improv.", priority: "High" },
  { reviewer: "D. Laville", domain: "Relationships", rating: "Outstanding", priority: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "inadequate_immediate", severity: "critical", message: "Protection domain rated inadequate with immediate priority — urgent action required." },
  { type: "req_improvement_unassigned", severity: "high", message: "2 domains require improvement but actions not assigned." },
  { type: "children_not_consulted", severity: "high", message: "3 reviews have children not consulted." },
];

const ARIA_INSIGHTS = [
  "8 domain reviews across 2 reviewers. Inadequate: 1. Requires improvement: 2. Immediate priority: 1.",
  "Priority: 1 inadequate with immediate action. Children consulted 62.5%. Shared with Ofsted 37.5%.",
  "Quality of care defines outcomes. Are children shaping the review? Are actions driving real improvement?",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Outstanding": { label: "Outst.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Req. Improv.": { label: "Req. Imp.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Inadequate": { label: "Inadeq.", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Assessed": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function QualityOfCareReviewCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-yellow-200">
      <CardHeader className="pb-3 bg-yellow-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Award className="h-4 w-4 text-yellow-600" /><span className="text-yellow-900">Quality of Care</span></CardTitle>
          <Link href="/quality-of-care-review" className="text-xs text-yellow-600 hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.inadequate_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.inadequate_count === 0 ? "text-green-600" : "text-red-600")}>{m.inadequate_count}</p><p className="text-[10px] text-muted-foreground">Inadeq.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.requires_improvement_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.requires_improvement_count === 0 ? "text-green-600" : "text-amber-600")}>{m.requires_improvement_count}</p><p className="text-[10px] text-muted-foreground">Req. Imp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.immediate_priority_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.immediate_priority_count === 0 ? "text-green-600" : "text-red-600")}>{m.immediate_priority_count}</p><p className="text-[10px] text-muted-foreground">Immediate</p></div>
          <div className="text-center rounded-lg p-2 bg-yellow-50"><p className="text-lg font-bold tabular-nums text-yellow-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Not Assessed"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Star className="h-3 w-3 text-yellow-500 shrink-0" /><span className="font-medium">{r.reviewer}</span><span className="text-muted-foreground truncate">{r.domain} · {r.priority}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Quality Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-yellow-700"><Brain className="h-3 w-3" />ARIA Quality Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-yellow-200 bg-yellow-50 text-yellow-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
