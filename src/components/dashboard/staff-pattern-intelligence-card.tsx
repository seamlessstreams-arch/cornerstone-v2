"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ChevronRight, AlertTriangle, Brain, Clock, ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_insights: 18, manager_review_count: 3, support_recommended_count: 4, low_confidence_count: 2, unreviewed_count: 5, concern_count: 6, strength_count: 5, evidence_verified_rate: 72.2, staff_notified_rate: 66.7, wellbeing_checked_rate: 55.6, unique_staff: 8 };

const DEMO_RECORDS: { staff: string; type: string; severity: string; status: string }[] = [
  { staff: "Staff A", type: "Repeated Strength", severity: "Informational", status: "Reviewed" },
  { staff: "Staff B", type: "Recording Quality", severity: "Pattern Emerging", status: "Exploring" },
  { staff: "Staff C", type: "Confidence Gap", severity: "Support Recom.", status: "Pending" },
  { staff: "Staff D", type: "Training Gap", severity: "Needs Expl.", status: "Draft" },
  { staff: "Staff E", type: "Burnout Risk", severity: "Manager Review", status: "Pending" },
  { staff: "Staff F", type: "Relationship", severity: "Informational", status: "Actioned" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unreviewed_serious", severity: "critical", message: "Staff E has an unreviewed pattern insight requiring manager review — manager action needed." },
  { type: "no_evidence_verified", severity: "high", message: "5 insights have evidence not yet verified." },
  { type: "staff_not_notified", severity: "high", message: "6 insights have staff not yet notified." },
];

const ARIA_INSIGHTS = [
  "18 insights across 8 staff. Manager review: 3. Support recommended: 4. Unreviewed: 5. Strengths: 5.",
  "Priority: 3 insights awaiting manager review. Evidence verification at 72.2%. Wellbeing checks only 55.6%.",
  "Positive: 5 repeated strengths identified. Staff A and F showing consistent good practice across records.",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Informational": { label: "Info", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Needs Expl.": { label: "Expl.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Pattern Emerging": { label: "Patt.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Support Recom.": { label: "Supp.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Manager Review": { label: "Mgr.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffPatternIntelligenceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-purple-600" /><span className="text-purple-900">ARIA Staff Patterns</span></CardTitle>
          <Link href="/staff-pattern-intelligence" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Insights <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.manager_review_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.manager_review_count === 0 ? "text-green-600" : "text-red-600")}>{m.manager_review_count}</p><p className="text-[10px] text-muted-foreground">Mgr Review</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unreviewed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unreviewed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unreviewed_count}</p><p className="text-[10px] text-muted-foreground">Unreviewed</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.strength_count}</p><p className="text-[10px] text-muted-foreground">Strengths</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_insights}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Insights</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Informational"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><ScanSearch className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Staff Pattern Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Staff Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
