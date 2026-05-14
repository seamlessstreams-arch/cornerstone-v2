"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, ChevronRight, AlertTriangle, Brain, Clock, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_shifts: 12, high_fatigue_count: 2, critical_fatigue_count: 1, understaffed_count: 2, critically_understaffed_count: 1, rest_period_rate: 75.0, working_time_rate: 83.3, handover_rate: 75.0, average_shift_duration: 9.5, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; shift: string; fatigue: string; staffing: string }[] = [
  { staff: "Staff A", shift: "Morning", fatigue: "Low", staffing: "Fully Staffed" },
  { staff: "Staff B", shift: "Night", fatigue: "Critical", staffing: "Understaffed" },
  { staff: "Staff C", shift: "Evening", fatigue: "High", staffing: "Adequate" },
  { staff: "Staff D", shift: "Waking Night", fatigue: "Moderate", staffing: "Fully Staffed" },
  { staff: "Staff E", shift: "Double Shift", fatigue: "High", staffing: "Critically Under" },
  { staff: "Staff A", shift: "Sleep-In", fatigue: "Low", staffing: "Adequate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_fatigue_no_rest", severity: "critical", message: "Staff B has critical fatigue without rest period compliance." },
  { type: "critically_understaffed", severity: "high", message: "1 shift is critically understaffed." },
  { type: "working_time_breached", severity: "high", message: "2 shifts have working time directive breaches." },
];

const ARIA_INSIGHTS = [
  "12 shifts. Critical fatigue: 1. High: 2. Understaffed: 2. Critically: 1. Rest: 75%. WTD: 83.3%. Avg: 9.5h.",
  "Priority: 1 critical fatigue no rest. 1 critically understaffed. 2 WTD breaches. Address fatigue risk.",
  "Positive: Most handovers completed. DBS checks current. Staff wellbeing routinely checked.",
];

const FATIGUE_BADGES: Record<string, { label: string; color: string }> = {
  "Very Low": { label: "Very Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Moderate": { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffShiftPatternMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand" />Shift Patterns</CardTitle>
          <Link href="/staff-shift-pattern-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_fatigue_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_fatigue_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_fatigue_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.critically_understaffed_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critically_understaffed_count === 0 ? "text-green-600" : "text-red-600")}>{m.critically_understaffed_count}</p><p className="text-[10px] text-muted-foreground">Crit Under</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_fatigue_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_fatigue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.high_fatigue_count}</p><p className="text-[10px] text-muted-foreground">High Fat.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_shifts}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Shifts</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = FATIGUE_BADGES[r.fatigue] ?? FATIGUE_BADGES["Moderate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCog className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.shift} · {r.staffing}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Shift Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Shift Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
