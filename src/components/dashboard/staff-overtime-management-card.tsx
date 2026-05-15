"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, ChevronRight, AlertTriangle, Brain, Clock, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 8, exceeds_48_count: 2, non_compliant_count: 1, opt_out_rate: 25.0, rest_break_rate: 87.5, overtime_authorised_rate: 75.0, avg_weekly_hours: 42.3, avg_overtime_hours: 6.1, unique_staff: 6, unique_reviewers: 2 };

const DEMO_RECORDS: { staff: string; weekly_avg: string; status: string; reviewer: string }[] = [
  { staff: "Staff A", weekly_avg: "38.5h", status: "Compliant", reviewer: "D. Laville" },
  { staff: "Staff B", weekly_avg: "52.0h", status: "Opt-Out Valid", reviewer: "J. Hughes" },
  { staff: "Staff C", weekly_avg: "49.5h", status: "Non-Compliant", reviewer: "D. Laville" },
  { staff: "Staff D", weekly_avg: "40.0h", status: "Compliant", reviewer: "J. Hughes" },
  { staff: "Staff E", weekly_avg: "45.0h", status: "Compliant", reviewer: "D. Laville" },
  { staff: "Staff F", weekly_avg: "51.0h", status: "Review Required", reviewer: "J. Hughes" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "exceeds_no_opt_out", severity: "critical", message: "Staff C exceeds 48h average without valid opt-out — WTR 1998 breach." },
  { type: "rest_break_fail", severity: "high", message: "1 staff member with rest break non-compliance." },
  { type: "unauthorised_overtime", severity: "medium", message: "2 overtime periods without authorisation." },
];

const ARIA_INSIGHTS = [
  "8 overtime reviews across 6 staff. Exceeds 48h: 2. Non-compliant: 1. Avg weekly: 42.3h.",
  "Priority: 1 staff exceeds 48h without opt-out. Rest break compliance 87.5%. Authorised 75.0%.",
  "Working time regulations protect staff welfare. Are opt-outs genuinely voluntary? Is overtime driven by vacancies or poor rota planning?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Non-Compliant": { label: "Non-Comp.", color: "text-red-700 bg-red-50 border-red-200" },
  "Opt-Out Valid": { label: "Opt-Out", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Review Required": { label: "Review", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function StaffOvertimeManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-amber-200">
      <CardHeader className="pb-3 bg-amber-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Timer className="h-4 w-4 text-amber-600" /><span className="text-amber-900">Overtime Management</span></CardTitle>
          <Link href="/staff-overtime-management" className="text-xs text-amber-600 hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.exceeds_48_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.exceeds_48_count === 0 ? "text-green-600" : "text-red-600")}>{m.exceeds_48_count}</p><p className="text-[10px] text-muted-foreground">&gt;48h</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-red-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_staff}</p><p className="text-[10px] text-muted-foreground">Staff</p></div>
          <div className="text-center rounded-lg p-2 bg-amber-50"><p className="text-lg font-bold tabular-nums text-amber-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCog className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.weekly_avg} · {r.reviewer}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Overtime Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-amber-700"><Brain className="h-3 w-3" />ARIA Overtime Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-amber-200 bg-amber-50 text-amber-800" : i === 1 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
