"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronRight, AlertTriangle, Brain, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_findings: 10, not_started_count: 2, in_progress_count: 3, completed_count: 3, evidenced_count: 1, overdue_count: 1, completion_rate: 40.0, evidence_gathered_rate: 50.0 };

const DEMO_RECORDS: { finding: string; type: string; priority: string; status: string }[] = [
  { finding: "Recording quality", type: "Requirement", priority: "High", status: "In Prog." },
  { finding: "Staff training", type: "Recommend.", priority: "Medium", status: "Complete" },
  { finding: "Care plans", type: "Requirement", priority: "High", status: "Overdue" },
  { finding: "Safeguarding", type: "Area Imp.", priority: "Immediate", status: "In Prog." },
  { finding: "Environment", type: "Recommend.", priority: "Low", status: "Evidenced" },
  { finding: "Participation", type: "Strength", priority: "Info", status: "Complete" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "overdue", severity: "critical", message: "Requirement from inspection is overdue — target date passed." },
  { type: "not_started", severity: "high", message: "2 findings have not been started — begin implementation." },
  { type: "no_evidence", severity: "high", message: "5 in-progress findings without evidence gathered." },
];

const ARIA_INSIGHTS = [
  "10 findings. Completed: 3. Evidenced: 1. In progress: 3. Not started: 2. Overdue: 1. Rate: 40%.",
  "Priority: 1 overdue requirement. 2 not started. Evidence gaps. Accelerate action plan delivery.",
  "Positive: Some findings evidenced. Regular progress reviews. Good engagement with recommendations.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "In Prog.": { label: "In Prog.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Complete": { label: "Complete", color: "text-green-700 bg-green-50 border-green-200" },
  "Evidenced": { label: "Evidenced", color: "text-green-700 bg-green-50 border-green-200" },
  "Overdue": { label: "Overdue", color: "text-red-700 bg-red-50 border-red-200" },
};

export function OfstedActionPlanCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand" />Ofsted Action Plan</CardTitle>
          <Link href="/ofsted-action-plans" className="text-xs text-brand hover:underline flex items-center gap-1">Actions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.completion_rate >= 80 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.completion_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.completion_rate}%</p><p className="text-[10px] text-muted-foreground">Complete</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_started_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_started_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_started_count}</p><p className="text-[10px] text-muted-foreground">Not Start</p></div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-red-600")}>{m.overdue_count}</p><p className="text-[10px] text-muted-foreground">Overdue</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.evidenced_count}</p><p className="text-[10px] text-muted-foreground">Evidenced</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Action Items</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["In Prog."]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileCheck className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.finding}</span><span className="text-muted-foreground truncate">{r.type} · {r.priority}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Ofsted Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Ofsted Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
