"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, ChevronRight, AlertTriangle, Brain, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 50, present_count: 40, unauthorised_count: 3, exclusion_count: 2, refused_count: 2, pep_up_to_date_rate: 80.0, school_contacted_rate: 85.0, attendance_percentage: 88.5, unique_children: 5 };

const DEMO_RECORDS: { child: string; status: string; setting: string; engagement: string }[] = [
  { child: "Child A", status: "Present", setting: "Mainstream", engagement: "Fully" },
  { child: "Child B", status: "Auth Abs", setting: "Special", engagement: "Mostly" },
  { child: "Child C", status: "Unauth Abs", setting: "PRU", engagement: "Partial" },
  { child: "Child D", status: "FT Excl", setting: "Mainstream", engagement: "Disengaged" },
  { child: "Child A", status: "Present", setting: "Mainstream", engagement: "Fully" },
  { child: "Child E", status: "Present", setting: "Alt Prov", engagement: "Mostly" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "permanent_exclusion", severity: "critical", message: "Child D has a permanent exclusion from mainstream school — ensure alternative provision and advocacy." },
  { type: "pep_not_current", severity: "high", message: "10 records show PEP not up to date." },
  { type: "child_views_not_sought", severity: "medium", message: "8 attendance records without child views sought." },
];

const ARIA_INSIGHTS = [
  "50 records. 5 children. Present: 40. Unauth: 3. Exclusions: 2. Attendance: 88.5%. PEP: 80%.",
  "Priority: 1 permanent exclusion. 10 PEP not current. 8 no child views. Strengthen education advocacy.",
  "Positive: Good attendance trend. School relationships positive. Homework support consistent.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Present": { label: "Present", color: "text-green-700 bg-green-50 border-green-200" },
  "Auth Abs": { label: "Auth", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Unauth Abs": { label: "Unauth", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "FT Excl": { label: "Exclusion", color: "text-red-700 bg-red-50 border-red-200" },
};

export function EducationAttendanceTrackingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><School className="h-4 w-4 text-brand" />Education Attendance</CardTitle>
          <Link href="/education-attendance-tracking" className="text-xs text-brand hover:underline flex items-center gap-1">Attendance <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.attendance_percentage >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.attendance_percentage >= 95 ? "text-green-600" : "text-amber-600")}>{m.attendance_percentage}%</p><p className="text-[10px] text-muted-foreground">Attendance</p></div>
          <div className={cn("text-center rounded-lg p-2", m.exclusion_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.exclusion_count === 0 ? "text-green-600" : "text-red-600")}>{m.exclusion_count}</p><p className="text-[10px] text-muted-foreground">Exclusions</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unauthorised_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unauthorised_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unauthorised_count}</p><p className="text-[10px] text-muted-foreground">Unauth</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Attendance</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Present"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><BookOpen className="h-3 w-3 text-teal-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.setting} · {r.engagement}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Education Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Education Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
