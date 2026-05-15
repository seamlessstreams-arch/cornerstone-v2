"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, ChevronRight, AlertTriangle, Brain, Clock, UserX } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_absences: 8, long_term_count: 2, mental_health_count: 2, work_related_count: 1, ongoing_count: 2, return_to_work_rate: 62.5, occupational_health_rate: 37.5, cover_arranged_rate: 87.5, impact_assessed_rate: 75.0, wellbeing_check_rate: 50.0, total_days_absent: 87, average_days_absent: 10.9, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; type: string; days: string; status: string }[] = [
  { staff: "Staff A", type: "Short Term", days: "3 days", status: "RTW Done" },
  { staff: "Staff B", type: "Long Term", days: "28 days", status: "OH Referred" },
  { staff: "Staff C", type: "Mental Health", days: "14 days", status: "Ongoing" },
  { staff: "Staff D", type: "Physical", days: "5 days", status: "Resolved" },
  { staff: "Staff E", type: "Work Related", days: "7 days", status: "Stage 1" },
  { staff: "Staff F", type: "Mental Health", days: "21 days", status: "Phased Return" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_trigger", severity: "critical", message: "Staff E at Stage 1 trigger without formal review — management action required." },
  { type: "long_term_no_oh", severity: "high", message: "1 long-term absence without occupational health referral." },
  { type: "mental_health_no_check", severity: "medium", message: "1 mental health absence without wellbeing check completed." },
];

const ARIA_INSIGHTS = [
  "8 absences across 6 staff. Long-term: 2. Mental health: 2. Total days: 87.",
  "Priority: 1 trigger without review. OH referral 37.5%. Cover arranged 87.5%.",
  "Staff absence impacts children directly. Are return-to-work interviews meaningful? Is wellbeing genuinely supported, not just managed?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "RTW Done": { label: "RTW", color: "text-green-700 bg-green-50 border-green-200" },
  "Resolved": { label: "Resolved", color: "text-green-700 bg-green-50 border-green-200" },
  "OH Referred": { label: "OH Ref.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Ongoing": { label: "Ongoing", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Stage 1": { label: "Stage 1", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Phased Return": { label: "Phased", color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
};

export function StaffSicknessManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-cyan-200">
      <CardHeader className="pb-3 bg-cyan-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Thermometer className="h-4 w-4 text-cyan-600" /><span className="text-cyan-900">Sickness Mgmt</span></CardTitle>
          <Link href="/staff-sickness-management" className="text-xs text-cyan-600 hover:underline flex items-center gap-1">Absences <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.long_term_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.long_term_count === 0 ? "text-green-600" : "text-red-600")}>{m.long_term_count}</p><p className="text-[10px] text-muted-foreground">Long Term</p></div>
          <div className={cn("text-center rounded-lg p-2", m.mental_health_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.mental_health_count === 0 ? "text-green-600" : "text-amber-600")}>{m.mental_health_count}</p><p className="text-[10px] text-muted-foreground">Mental H.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.ongoing_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.ongoing_count === 0 ? "text-green-600" : "text-amber-600")}>{m.ongoing_count}</p><p className="text-[10px] text-muted-foreground">Ongoing</p></div>
          <div className="text-center rounded-lg p-2 bg-cyan-50"><p className="text-lg font-bold tabular-nums text-cyan-600">{m.total_absences}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Absences</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Ongoing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserX className="h-3 w-3 text-cyan-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.days}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sickness Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-cyan-700"><Brain className="h-3 w-3" />ARIA Sickness Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-cyan-200 bg-cyan-50 text-cyan-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
