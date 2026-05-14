"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, AlertTriangle, Brain, Clock, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 15, competent_count: 10, not_yet_competent_count: 2, requires_retraining_count: 1, suspended_count: 1, theory_passed_rate: 86.7, practical_observed_rate: 80.0, controlled_drug_rate: 53.3, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; type: string; category: string; outcome: string }[] = [
  { staff: "Staff A", type: "Annual Review", category: "Oral", outcome: "Competent" },
  { staff: "Staff B", type: "Observed", category: "Controlled", outcome: "Competent" },
  { staff: "Staff C", type: "Initial", category: "PRN", outcome: "Not Yet" },
  { staff: "Staff D", type: "Error Retrain", category: "Oral", outcome: "Retraining" },
  { staff: "Staff A", type: "Specialist", category: "Injectable", outcome: "Competent" },
  { staff: "Staff E", type: "Controlled", category: "Controlled", outcome: "Suspended" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "suspended_controlled_drugs", severity: "critical", message: "Staff E suspended from controlled drug administration — ensure no access." },
  { type: "not_competent", severity: "high", message: "3 staff members not yet competent or requiring retraining." },
  { type: "practical_not_observed", severity: "high", message: "3 assessments have no observed practice." },
];

const ARIA_INSIGHTS = [
  "15 assessments. 6 staff. Competent: 10. Not yet: 2. Retraining: 1. Suspended: 1. Theory: 86.7%.",
  "Priority: 1 suspended controlled. 3 not competent. 3 not observed. Strengthen medication training.",
  "Positive: Good theory pass rate. Regular assessments. Pharmacy partnerships. E-learning modules.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Competent": { label: "Competent", color: "text-green-700 bg-green-50 border-green-200" },
  "Not Yet": { label: "Not Yet", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Retraining": { label: "Retrain", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Suspended": { label: "Suspended", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffMedicationCompetencyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-brand" />Med Competency</CardTitle>
          <Link href="/staff-medication-competency" className="text-xs text-brand hover:underline flex items-center gap-1">Competency <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.competent_count}</p><p className="text-[10px] text-muted-foreground">Competent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_yet_competent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_yet_competent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_yet_competent_count}</p><p className="text-[10px] text-muted-foreground">Not Yet</p></div>
          <div className={cn("text-center rounded-lg p-2", m.suspended_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.suspended_count === 0 ? "text-green-600" : "text-red-600")}>{m.suspended_count}</p><p className="text-[10px] text-muted-foreground">Suspended</p></div>
          <div className={cn("text-center rounded-lg p-2", m.theory_passed_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.theory_passed_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.theory_passed_rate}%</p><p className="text-[10px] text-muted-foreground">Theory</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Competent"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Pill className="h-3 w-3 text-brand shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.category}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Competency Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Competency Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
