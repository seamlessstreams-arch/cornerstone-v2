"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronRight, AlertTriangle, Brain, Clock, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, inadequate_count: 0, requires_improvement_count: 2, outstanding_count: 1, evidence_missing_count: 1, evidence_documented_rate: 75.0, staff_prepared_rate: 87.5, children_consulted_rate: 62.5, environment_ready_rate: 75.0, policies_current_rate: 87.5, records_accessible_rate: 75.0, improvement_completed_rate: 50.0, self_evaluation_rate: 62.5, mock_inspection_rate: 37.5, regulatory_met_rate: 87.5, previous_recommendations_rate: 75.0, unique_assessors: 3 };

const DEMO_RECORDS: { assessor: string; area: string; rating: string; evidence: string }[] = [
  { assessor: "D. Laville", area: "Safety", rating: "Good", evidence: "Gathered" },
  { assessor: "J. Hughes", area: "Leadership", rating: "Req. Impr.", evidence: "Partial" },
  { assessor: "D. Laville", area: "Health", rating: "Outstanding", evidence: "Gathered" },
  { assessor: "L. Jones", area: "Education", rating: "Good", evidence: "Gathered" },
  { assessor: "J. Hughes", area: "Experience", rating: "Req. Impr.", evidence: "Missing" },
  { assessor: "D. Laville", area: "Progress", rating: "Good", evidence: "Gathered" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "ri_no_actions", severity: "high", message: "2 areas rated 'requires improvement' with no improvement actions identified." },
  { type: "evidence_missing_safety", severity: "high", message: "Evidence missing in key inspection area — gather before next visit." },
  { type: "mock_not_completed", severity: "medium", message: "5 areas have not had mock inspection completed." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 3 assessors. Outstanding: 1. Requires improvement: 2. Evidence missing: 1.",
  "Priority: 2 RI areas without actions. Mock inspections 37.5%. Self-evaluation 62.5%.",
  "Inspection readiness is continuous. Are self-evaluations honest? Is evidence current and accessible? Are children's voices central?",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Outstanding": { label: "Outstdg.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Req. Impr.": { label: "RI", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Inadequate": { label: "Inadeq.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function OfstedInspectionReadinessCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-blue-200">
      <CardHeader className="pb-3 bg-blue-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-blue-600" /><span className="text-blue-900">Inspection Readiness</span></CardTitle>
          <Link href="/ofsted-inspection-readiness" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Readiness <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.inadequate_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.inadequate_count === 0 ? "text-green-600" : "text-red-600")}>{m.inadequate_count}</p><p className="text-[10px] text-muted-foreground">Inadequate</p></div>
          <div className={cn("text-center rounded-lg p-2", m.requires_improvement_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.requires_improvement_count === 0 ? "text-green-600" : "text-amber-600")}>{m.requires_improvement_count}</p><p className="text-[10px] text-muted-foreground">Req. Impr.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.evidence_missing_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.evidence_missing_count === 0 ? "text-green-600" : "text-amber-600")}>{m.evidence_missing_count}</p><p className="text-[10px] text-muted-foreground">No Evidence</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileSearch className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.assessor}</span><span className="text-muted-foreground truncate">{r.area} · {r.evidence}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Readiness Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-blue-700"><Brain className="h-3 w-3" />ARIA Inspection Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
