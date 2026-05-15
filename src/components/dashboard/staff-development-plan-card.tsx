"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, ChevronRight, AlertTriangle, Brain, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_plans: 8, urgent_count: 1, active_count: 4, pending_approval_count: 2, completed_count: 2, staff_consulted_rate: 62.5, strengths_identified_rate: 75.0, training_identified_rate: 50.0, mentoring_arranged_rate: 37.5, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; area: string; priority: string; status: string }[] = [
  { staff: "Staff A", area: "De-escalation", priority: "Urgent", status: "Active" },
  { staff: "Staff B", area: "Recording", priority: "High", status: "Active" },
  { staff: "Staff C", area: "Safeguarding", priority: "Medium", status: "Pending" },
  { staff: "Staff D", area: "Leadership", priority: "Developmental", status: "Draft" },
  { staff: "Staff E", area: "Communication", priority: "Medium", status: "Completed" },
  { staff: "Staff F", area: "Child Engage.", priority: "Low", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "urgent_unapproved", severity: "critical", message: "Staff A has an urgent development plan awaiting approval — manager action needed." },
  { type: "no_staff_consulted", severity: "high", message: "3 plans have staff not consulted." },
  { type: "no_strengths_identified", severity: "high", message: "2 plans have no strengths identified." },
];

const ARIA_INSIGHTS = [
  "8 plans across 6 staff. Urgent: 1. Active: 4. Pending approval: 2. Completed: 2.",
  "Priority: 3 staff not consulted. Mentoring only 37.5%. Training identified 50.0%.",
  "Build on strengths. Staff A confident with younger children — extend skills to adolescents.",
];

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  "Urgent": { label: "Urgent", color: "text-red-700 bg-red-50 border-red-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Medium": { label: "Med.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Developmental": { label: "Dev.", color: "text-green-700 bg-green-50 border-green-200" },
};

export function StaffDevelopmentPlanCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Development Plans</span></CardTitle>
          <Link href="/staff-development-plan" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Plans <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.urgent_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.urgent_count === 0 ? "text-green-600" : "text-red-600")}>{m.urgent_count}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_approval_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_approval_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_approval_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.completed_count}</p><p className="text-[10px] text-muted-foreground">Completed</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_plans}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Plans</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PRIORITY_BADGES[r.priority] ?? PRIORITY_BADGES["Medium"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Lightbulb className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.area} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Development Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Development Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
