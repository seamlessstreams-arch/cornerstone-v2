"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S ABSENCE INTELLIGENCE CARD
// Dashboard card for school attendance, absences, exclusions.
// CHR 2015 Reg 8, Reg 7, Reg 25.
// SCCIF: Education — "Children attend school regularly."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, ChevronRight, AlertTriangle, Brain,
  Clock, UserX, School,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_absences: 12,
  authorised_rate: 75.0,
  unauthorised_count: 3,
  exclusion_count: 1,
  average_attendance_percentage: 91.2,
  school_notified_rate: 83.3,
  persistent_absence_count: 1,
  unique_children: 4,
};

const DEMO_RECORDS: { child: string; type: string; date: string; status: string }[] = [
  { child: "Child A", type: "Illness", date: "14 May", status: "Auth" },
  { child: "Child B", type: "Unauthorised", date: "13 May", status: "Unauth" },
  { child: "Child A", type: "Medical Appt", date: "12 May", status: "Auth" },
  { child: "Child C", type: "Exclusion", date: "11 May", status: "Excl" },
  { child: "Child D", type: "Unauthorised", date: "10 May", status: "Unauth" },
  { child: "Child B", type: "Illness", date: "9 May", status: "Auth" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "exclusion", severity: "critical", message: "Child C excluded — review placement support and PEP." },
  { type: "persistent", severity: "high", message: "1 child has persistent absence — implement intervention plan." },
  { type: "unauthorised", severity: "high", message: "3 unauthorised absences — review with school and social worker." },
];

const ARIA_INSIGHTS = [
  "12 absences. Authorised: 75%. Attendance avg: 91.2%. 1 exclusion. 3 unauthorised. 4 children affected.",
  "Priority: 1 exclusion. 1 persistent absence. 3 unauthorised. Address school engagement for Child C.",
  "Positive: Most absences authorised. Schools notified 83.3%. Regular PEP reviews. Improve attendance tracking.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Auth": { label: "Auth", color: "text-green-700 bg-green-50 border-green-200" },
  "Unauth": { label: "Unauth", color: "text-red-700 bg-red-50 border-red-200" },
  "Excl": { label: "Excl", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildrensAbsenceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand" />
            Children&apos;s Absence
          </CardTitle>
          <Link href="/childrens-absences" className="text-xs text-brand hover:underline flex items-center gap-1">
            Absences <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.average_attendance_percentage >= 95 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.average_attendance_percentage >= 95 ? "text-green-600" : "text-amber-600")}>{m.average_attendance_percentage}%</p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.authorised_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.authorised_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.authorised_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Authorised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.exclusion_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.exclusion_count === 0 ? "text-green-600" : "text-red-600")}>{m.exclusion_count}</p>
            <p className="text-[10px] text-muted-foreground">Exclusions</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.unauthorised_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.unauthorised_count === 0 ? "text-green-600" : "text-red-600")}>{m.unauthorised_count}</p>
            <p className="text-[10px] text-muted-foreground">Unauth</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Absences</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Auth"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <School className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Absence Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Absence Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
