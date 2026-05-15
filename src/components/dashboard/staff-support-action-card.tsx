"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, ChevronRight, AlertTriangle, Brain, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_actions: 8, overdue_count: 1, urgent_count: 1, completed_count: 3, no_change_count: 1, staff_consulted_rate: 62.5, success_criteria_rate: 37.5, follow_up_rate: 50.0, impact_assessed_rate: 25.0, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; action: string; status: string; priority: string }[] = [
  { staff: "Staff A", action: "Training Course", status: "Overdue", priority: "Urgent" },
  { staff: "Staff B", action: "Mentoring", status: "In Progress", priority: "High" },
  { staff: "Staff C", action: "Supervision Adj.", status: "Completed", priority: "Medium" },
  { staff: "Staff D", action: "Wellbeing Int.", status: "Planned", priority: "Medium" },
  { staff: "Staff E", action: "Peer Support", status: "Completed", priority: "Low" },
  { staff: "Staff F", action: "Coaching", status: "In Progress", priority: "Routine" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "overdue_urgent", severity: "critical", message: "Staff A has an overdue urgent support action — immediate attention needed." },
  { type: "staff_not_consulted", severity: "high", message: "3 actions have staff not consulted." },
  { type: "no_success_criteria", severity: "high", message: "5 actions have no success criteria set." },
];

const ARIA_INSIGHTS = [
  "8 support actions across 6 staff. Overdue: 1. Urgent: 1. Completed: 3. No change: 1.",
  "Priority: 1 overdue urgent action. Success criteria set only 37.5%. Impact assessed only 25.0%.",
  "Support is only effective if it's right, timely, and monitored. What worked? What didn't? Why?",
];

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  "Urgent": { label: "Urgent", color: "text-red-700 bg-red-50 border-red-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Medium": { label: "Med.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Routine": { label: "Routine", color: "text-green-700 bg-green-50 border-green-200" },
};

export function StaffSupportActionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Support Actions</span></CardTitle>
          <Link href="/staff-support-action" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Actions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-red-600")}>{m.overdue_count}</p><p className="text-[10px] text-muted-foreground">Overdue</p></div>
          <div className={cn("text-center rounded-lg p-2", m.urgent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.urgent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.urgent_count}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.completed_count}</p><p className="text-[10px] text-muted-foreground">Completed</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_actions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Support Actions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PRIORITY_BADGES[r.priority] ?? PRIORITY_BADGES["Medium"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Activity className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.action} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Support Action Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Support Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
