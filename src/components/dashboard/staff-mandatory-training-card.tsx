"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, AlertTriangle, Brain, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 12, expired_count: 2, expiring_soon_count: 3, not_started_count: 1, current_count: 6, competence_assessed_rate: 50.0, manager_verified_rate: 58.3, refresher_scheduled_rate: 33.3, evaluation_completed_rate: 41.7, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; training: string; status: string; level: string }[] = [
  { staff: "Staff A", training: "Safeguarding L3", status: "Expired", level: "Advanced" },
  { staff: "Staff B", training: "First Aid", status: "Expiring Soon", level: "Intermediate" },
  { staff: "Staff C", training: "Fire Safety", status: "Current", level: "Foundation" },
  { staff: "Staff D", training: "Medication", status: "Current", level: "Advanced" },
  { staff: "Staff E", training: "Restraint", status: "Expired", level: "Specialist" },
  { staff: "Staff F", training: "Food Hygiene", status: "Booked", level: "Awareness" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "expired_critical_training", severity: "critical", message: "Staff A has expired Safeguarding Level 3 training — immediate action required." },
  { type: "expired_training", severity: "high", message: "2 training records have expired." },
  { type: "no_competence_assessed", severity: "high", message: "6 training records have competence not assessed." },
];

const ARIA_INSIGHTS = [
  "12 training records across 6 staff. Expired: 2. Expiring soon: 3. Not started: 1. Current: 6.",
  "Priority: 2 expired (including safeguarding). Competence assessed only 50.0%. Refreshers scheduled 33.3%.",
  "Training must be current, assessed and applied. Expired safeguarding or restraint training is a regulatory risk.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Current": { label: "Current", color: "text-green-700 bg-green-50 border-green-200" },
  "Expiring Soon": { label: "Expiring", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Started": { label: "Not Start", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Booked": { label: "Booked", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function StaffMandatoryTrainingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Mandatory Training</span></CardTitle>
          <Link href="/staff-mandatory-training" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Training <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p><p className="text-[10px] text-muted-foreground">Expired</p></div>
          <div className={cn("text-center rounded-lg p-2", m.expiring_soon_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.expiring_soon_count === 0 ? "text-green-600" : "text-amber-600")}>{m.expiring_soon_count}</p><p className="text-[10px] text-muted-foreground">Expiring</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.current_count}</p><p className="text-[10px] text-muted-foreground">Current</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Training Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Current"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Award className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.training} · {r.level}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Training Compliance Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Training Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
