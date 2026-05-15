"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandHeart, ChevronRight, AlertTriangle, Brain, Clock, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_plans: 7, active_count: 3, escalated_count: 1, pending_approval_count: 2, completed_count: 1, staff_consulted_rate: 57.1, wellbeing_rate: 42.9, mentor_rate: 28.6, adjustments_rate: 28.6, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; concern: string; supervision: string; status: string }[] = [
  { staff: "Staff A", concern: "Wellbeing", supervision: "Weekly", status: "Active" },
  { staff: "Staff B", concern: "Workload", supervision: "Fortnightly", status: "Active" },
  { staff: "Staff C", concern: "Confidence", supervision: "Weekly", status: "Escalated" },
  { staff: "Staff D", concern: "Attendance", supervision: "Monthly", status: "Pending" },
  { staff: "Staff E", concern: "Boundaries", supervision: "Fortnightly", status: "Completed" },
  { staff: "Staff F", concern: "Communication", supervision: "Six-Weekly", status: "Draft" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "escalated_unapproved", severity: "critical", message: "Staff C has an escalated support plan awaiting approval — manager action needed." },
  { type: "no_staff_consulted", severity: "high", message: "3 plans have staff not consulted." },
  { type: "no_wellbeing_considered", severity: "high", message: "4 plans have wellbeing not considered." },
];

const ARIA_INSIGHTS = [
  "7 plans across 5 staff. Active: 3. Escalated: 1. Pending: 2. Completed: 1.",
  "Priority: 3 staff not consulted. Wellbeing considered only 42.9%. Mentoring only 28.6%.",
  "Support early, support well. What is working? What needs to change? What help is needed?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Draft": { label: "Draft", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Active": { label: "Active", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Pending": { label: "Pend.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Escalated": { label: "Escal.", color: "text-red-700 bg-red-50 border-red-200" },
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
};

export function StaffSupportPlanCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HandHeart className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Support Plans</span></CardTitle>
          <Link href="/staff-support-plan" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Plans <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_approval_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_approval_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_approval_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.completed_count}</p><p className="text-[10px] text-muted-foreground">Completed</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_plans}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Plans</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Draft"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCog className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.concern} · {r.supervision}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Support Plan Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Support Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
