"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, AlertTriangle, Brain, Clock, BookCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 10, current_count: 6, overdue_count: 1, expired_count: 0, due_soon_count: 2, booked_count: 1, certificate_rate: 90.0, competency_rate: 80.0, refresher_booked_rate: 30.0, avg_training_hours: 4.5, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; training: string; status: string; method: string }[] = [
  { staff: "Staff A", training: "Safeguarding", status: "Current", method: "Classroom" },
  { staff: "Staff B", training: "First Aid", status: "Due Soon", method: "Blended" },
  { staff: "Staff C", training: "Fire Safety", status: "Current", method: "E-Learning" },
  { staff: "Staff D", training: "Restraint", status: "Overdue", method: "Classroom" },
  { staff: "Staff E", training: "Medication", status: "Current", method: "Workplace" },
  { staff: "Staff F", training: "Manual Handling", status: "Due Soon", method: "External" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "overdue", severity: "high", message: "Staff D restraint training overdue — arrange refresher immediately." },
  { type: "due_soon_not_booked", severity: "medium", message: "2 training records due soon without refresher booked." },
  { type: "not_competent", severity: "medium", message: "2 staff not assessed as competent in training area." },
];

const ARIA_INSIGHTS = [
  "10 records across 6 staff. Current: 6. Overdue: 1. Due soon: 2. Expired: 0.",
  "Priority: 1 overdue. Refresher booked 30.0%. Certificate rate 90.0%. Competency 80.0%.",
  "Training must translate to practice. Are refreshers meaningful or tick-box? Is competency genuinely assessed?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Current": { label: "Current", color: "text-green-700 bg-green-50 border-green-200" },
  "Due Soon": { label: "Due Soon", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Overdue": { label: "Overdue", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
  "Booked": { label: "Booked", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function StaffMandatoryRefresherTrainingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-amber-200">
      <CardHeader className="pb-3 bg-amber-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-amber-600" /><span className="text-amber-900">Refresher Training</span></CardTitle>
          <Link href="/staff-mandatory-refresher-training" className="text-xs text-amber-600 hover:underline flex items-center gap-1">Training <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p><p className="text-[10px] text-muted-foreground">Expired</p></div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-orange-50")}><p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-orange-600")}>{m.overdue_count}</p><p className="text-[10px] text-muted-foreground">Overdue</p></div>
          <div className={cn("text-center rounded-lg p-2", m.due_soon_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.due_soon_count === 0 ? "text-green-600" : "text-amber-600")}>{m.due_soon_count}</p><p className="text-[10px] text-muted-foreground">Due Soon</p></div>
          <div className="text-center rounded-lg p-2 bg-amber-50"><p className="text-lg font-bold tabular-nums text-amber-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Training</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Current"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><BookCheck className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.training} · {r.method}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Training Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-amber-700"><Brain className="h-3 w-3" />ARIA Training Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-amber-200 bg-amber-50 text-amber-800" : i === 1 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
