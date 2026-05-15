"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, ChevronRight, AlertTriangle, Brain, Clock, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, overdue_count: 2, urgent_concern_count: 1, not_completed_count: 1, referral_required_count: 2, child_attended_rate: 75.0, child_views_rate: 62.5, action_plan_rate: 75.0, actions_completed_rate: 50.0, shared_with_sw_rate: 62.5, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; compliance: string }[] = [
  { child: "Child A", type: "IHA", outcome: "Actions Met", compliance: "In Timescale" },
  { child: "Child B", type: "RHA", outcome: "Referral Req.", compliance: "Overdue" },
  { child: "Child C", type: "Dental", outcome: "Urgent", compliance: "Sig. Overdue" },
  { child: "Child A", type: "MH Screening", outcome: "Outstanding", compliance: "In Timescale" },
  { child: "Child D", type: "Optical", outcome: "Actions Met", compliance: "Not Due" },
  { child: "Child B", type: "Immunisation", outcome: "Not Completed", compliance: "Overdue" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "urgent_not_shared", severity: "critical", message: "Child C has urgent health concern not shared with social worker — immediate action required." },
  { type: "significantly_overdue", severity: "high", message: "1 health assessment is significantly overdue." },
  { type: "child_views_missing", severity: "high", message: "3 assessments have child views not captured." },
];

const ARIA_INSIGHTS = [
  "8 health assessments across 4 children. Overdue: 2. Urgent: 1. Not completed: 1.",
  "Priority: 1 urgent concern not shared with SW. Child attended 75.0%. Action plans 75.0%.",
  "Health is a fundamental right. Is every LAC child receiving timely assessments? Are their views heard?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Actions Met": { label: "Met", color: "text-green-700 bg-green-50 border-green-200" },
  "Outstanding": { label: "Outst.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Referral Req.": { label: "Referral", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Urgent": { label: "Urgent", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Completed": { label: "Not Done", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function LacHealthAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-emerald-200">
      <CardHeader className="pb-3 bg-emerald-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Stethoscope className="h-4 w-4 text-emerald-600" /><span className="text-emerald-900">LAC Health</span></CardTitle>
          <Link href="/lac-health-assessment" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">Health <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.urgent_concern_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.urgent_concern_count === 0 ? "text-green-600" : "text-red-600")}>{m.urgent_concern_count}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.overdue_count}</p><p className="text-[10px] text-muted-foreground">Overdue</p></div>
          <div className={cn("text-center rounded-lg p-2", m.referral_required_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.referral_required_count === 0 ? "text-green-600" : "text-amber-600")}>{m.referral_required_count}</p><p className="text-[10px] text-muted-foreground">Referral</p></div>
          <div className="text-center rounded-lg p-2 bg-emerald-50"><p className="text-lg font-bold tabular-nums text-emerald-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Outstanding"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Stethoscope className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.compliance}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Health Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-emerald-700"><Brain className="h-3 w-3" />ARIA Health Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
