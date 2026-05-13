"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF ATTENDANCE & TIMEKEEPING INTELLIGENCE CARD
// Dashboard card for attendance, punctuality, overtime, and compliance.
// CHR 2015 Reg 33, Reg 22; Working Time Regulations 1998.
// SCCIF: Leadership & Management — "Staffing levels maintained."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock, ChevronRight, AlertTriangle, Brain,
  Clock, Timer, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 56,
  attendance_rate: 92.3,
  punctuality_rate: 85.7,
  average_late_minutes: 12.4,
  total_overtime_hours: 28.5,
  minimum_staffing_met_rate: 94.6,
  compliance_rate: 89.3,
  non_compliant_count: 2,
  agency_staff_used_count: 4,
};

const DEMO_RECORDS: { staff: string; status: string; shift: string; date: string }[] = [
  { staff: "J. Adams", status: "Present", shift: "Day", date: "12 May" },
  { staff: "K. Patel", status: "Late", shift: "Day", date: "12 May" },
  { staff: "M. Taylor", status: "Present", shift: "Night", date: "11 May" },
  { staff: "R. Chen", status: "Sick", shift: "Day", date: "11 May" },
  { staff: "S. Jones", status: "Present", shift: "Day", date: "11 May" },
  { staff: "A. Williams", status: "Present", shift: "Waking Night", date: "10 May" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "minimum_staffing_not_met", severity: "critical", message: "Minimum staffing not met on 2025-05-09 (day shift) — children's safety may be compromised." },
  { type: "working_time_breach", severity: "high", message: "M. Taylor has exceeded 48h week on 2025-05-10 — Working Time Regulations breach." },
  { type: "unauthorised_absence", severity: "high", message: "1 unauthorised absence recorded — investigate and address." },
  { type: "agency_reliance", severity: "medium", message: "Agency staff used on 4 occasions — review recruitment and retention strategy." },
];

const ARIA_INSIGHTS = [
  "56 records. Attendance: 92.3%. Punctuality: 85.7%. Avg late: 12.4 min. Overtime: 28.5h. Staffing met: 94.6%. Compliance: 89.3%. Agency: 4 uses.",
  "Priority: 1 staffing shortfall compromised children's safety. Working time breach for M. Taylor. 1 unauthorised absence. 4 agency staff uses indicate retention issues.",
  "Positive: 92.3% attendance. 94.6% minimum staffing. Night shifts covered. Improve punctuality and reduce overtime reliance through better rota planning.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Present": { label: "Present", color: "text-green-700 bg-green-50 border-green-200" },
  "Late": { label: "Late", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Sick": { label: "Sick", color: "text-red-700 bg-red-50 border-red-200" },
  "Leave": { label: "Leave", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Training": { label: "Training", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function StaffAttendanceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-brand" />
            Staff Attendance
          </CardTitle>
          <Link href="/staff-attendance" className="text-xs text-brand hover:underline flex items-center gap-1">
            Attendance <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.attendance_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.punctuality_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Punctuality</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.minimum_staffing_met_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Staffed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count > 0 ? "text-red-600" : "text-green-600")}>{m.non_compliant_count}</p>
            <p className="text-[10px] text-muted-foreground">Breaches</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Attendance</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Present"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.staff}</span>
                    <span className="text-muted-foreground truncate">{r.shift} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Attendance Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Attendance Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
