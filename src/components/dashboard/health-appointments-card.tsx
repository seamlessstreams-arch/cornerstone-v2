"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HEALTH APPOINTMENTS INTELLIGENCE CARD
// Dashboard card for children's medical, dental, optician, and CAMHS appointments.
// CHR 2015 Reg 7, Reg 10, Reg 33.
// SCCIF: Health — "Children receive timely healthcare."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope, ChevronRight, AlertTriangle, Brain,
  Clock, Heart, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_appointments: 24,
  gp_count: 8,
  dental_count: 5,
  optician_count: 3,
  camhs_count: 4,
  attended_rate: 83.3,
  missed_count: 2,
  cancelled_count: 1,
  pending_count: 3,
  child_accompanied_rate: 91.7,
  child_views_captured_rate: 75.0,
  child_anxious_count: 3,
  health_plan_updated_rate: 70.8,
  social_worker_informed_rate: 83.3,
  parent_carer_informed_rate: 87.5,
  follow_up_needed_count: 6,
  follow_up_overdue_count: 2,
  unique_children: 5,
};

const DEMO_RECORDS: { child: string; type: string; status: string; date: string; outcome: string }[] = [
  { child: "Child A", type: "GP Visit", status: "Attended", date: "12 May", outcome: "No Concerns" },
  { child: "Child B", type: "Dental", status: "Attended", date: "10 May", outcome: "Treatment" },
  { child: "Child C", type: "CAMHS", status: "Attended", date: "8 May", outcome: "Follow-Up" },
  { child: "Child A", type: "Optician", status: "Missed", date: "5 May", outcome: "N/A" },
  { child: "Child D", type: "Immunisation", status: "Attended", date: "3 May", outcome: "No Concerns" },
  { child: "Child E", type: "Specialist", status: "Pending", date: "15 May", outcome: "N/A" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "consent_refused", severity: "critical", message: "Consent refused for Child B's dental check on 2 May — assess capacity and welfare." },
  { type: "missed_appointments", severity: "high", message: "2 missed appointments — rebook and investigate barriers." },
  { type: "follow_up_overdue", severity: "high", message: "2 health follow-ups are overdue — arrange promptly." },
  { type: "views_not_captured", severity: "medium", message: "5 attended appointments without child views captured — ensure participation." },
];

const ARIA_INSIGHTS = [
  "24 appointments across 5 children. Attended: 83.3%. GP: 8, Dental: 5, CAMHS: 4, Optician: 3. Views captured: 75%. Health plan updated: 70.8%.",
  "Priority: 1 consent refused. 2 missed appointments. 2 overdue follow-ups. 5 attended without child views. 3 children anxious at appointments.",
  "Positive: Good attendance rate. SW informed 83.3%. Parents informed 87.5%. Children accompanied 91.7%. Improve views capture and follow-up tracking.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Attended": { label: "Attended", color: "text-green-700 bg-green-50 border-green-200" },
  "Missed": { label: "Missed", color: "text-red-700 bg-red-50 border-red-200" },
  "Pending": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Cancelled": { label: "Cancelled", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function HealthAppointmentsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-brand" />
            Health Appointments
          </CardTitle>
          <Link href="/health-appointments" className="text-xs text-brand hover:underline flex items-center gap-1">
            Appointments <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.attended_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.attended_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.attended_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Attended</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.missed_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.missed_count === 0 ? "text-green-600" : "text-red-600")}>{m.missed_count}</p>
            <p className="text-[10px] text-muted-foreground">Missed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_views_captured_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_views_captured_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_views_captured_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Views</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.follow_up_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.follow_up_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Appointments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Pending"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Heart className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.date} · {r.outcome}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Health Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Health Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
