"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronRight, AlertTriangle, Brain, Clock, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_requests: 8, declined_count: 1, pending_count: 2, critical_understaffing_count: 1, no_cover_count: 2, cover_confirmed_rate: 62.5, handover_completed_rate: 50.0, children_informed_rate: 37.5, minimum_staffing_rate: 75.0, approved_rate: 71.4, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; type: string; status: string; impact: string }[] = [
  { staff: "Staff A", type: "Annual Leave", status: "Approved", impact: "No Impact" },
  { staff: "Staff B", type: "Compassionate", status: "Approved", impact: "Minor" },
  { staff: "Staff C", type: "Annual Leave", status: "Pending Cover", impact: "Significant" },
  { staff: "Staff D", type: "Training Day", status: "Approved", impact: "No Impact" },
  { staff: "Staff E", type: "Annual Leave", status: "Approved", impact: "Critical" },
  { staff: "Staff A", type: "Bank Holiday", status: "Requested", impact: "Moderate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_understaffing", severity: "critical", message: "Staff E leave causes critical understaffing with minimum staffing not maintained — urgent cover needed." },
  { type: "no_cover_confirmed", severity: "high", message: "2 approved leave periods have no cover confirmed." },
  { type: "handover_incomplete", severity: "medium", message: "4 approved leave periods have handover not completed." },
];

const ARIA_INSIGHTS = [
  "8 leave requests across 5 staff. Declined: 1. Pending: 2. Critical understaffing: 1.",
  "Priority: 1 critical understaffing period. Cover confirmed 62.5%. Children informed 37.5%.",
  "Staff leave affects children's routines. Is cover always confirmed? Are children prepared for changes?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Approved": { label: "Approved", color: "text-green-700 bg-green-50 border-green-200" },
  "Requested": { label: "Requested", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Pending Cover": { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
  "Cancelled": { label: "Cancelled", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function StaffAnnualLeaveCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-sky-200">
      <CardHeader className="pb-3 bg-sky-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-600" /><span className="text-sky-900">Staff Leave</span></CardTitle>
          <Link href="/staff-annual-leave" className="text-xs text-sky-600 hover:underline flex items-center gap-1">Leave <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_understaffing_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_understaffing_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_understaffing_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_cover_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_cover_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_cover_count}</p><p className="text-[10px] text-muted-foreground">No Cover</p></div>
          <div className="text-center rounded-lg p-2 bg-sky-50"><p className="text-lg font-bold tabular-nums text-sky-600">{m.total_requests}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Leave</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Requested"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserMinus className="h-3 w-3 text-sky-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.impact}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Leave Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-sky-700"><Brain className="h-3 w-3" />ARIA Leave Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-sky-200 bg-sky-50 text-sky-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
