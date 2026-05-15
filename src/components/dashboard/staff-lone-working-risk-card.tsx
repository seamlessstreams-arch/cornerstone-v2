"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonStanding, ChevronRight, AlertTriangle, Brain, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, high_risk_count: 1, unacceptable_count: 0, risk_assessment_rate: 75.0, check_in_rate: 62.5, personal_alarm_rate: 37.5, training_rate: 75.0, incident_count: 1, unique_staff: 6, unique_assessors: 2 };

const DEMO_RECORDS: { staff: string; type: string; risk: string; assessor: string }[] = [
  { staff: "Staff A", type: "Night Shift", risk: "Low", assessor: "D. Laville" },
  { staff: "Staff B", type: "Sleep-In", risk: "Medium", assessor: "J. Hughes" },
  { staff: "Staff C", type: "Home Visit", risk: "High", assessor: "D. Laville" },
  { staff: "Staff D", type: "Transport", risk: "Low", assessor: "J. Hughes" },
  { staff: "Staff E", type: "Community Outing", risk: "Medium", assessor: "D. Laville" },
  { staff: "Staff F", type: "Emergency Cover", risk: "Low", assessor: "J. Hughes" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_no_assessment", severity: "critical", message: "Staff C lone working at high risk without completed risk assessment." },
  { type: "no_check_in", severity: "high", message: "3 lone workers without agreed check-in protocol." },
  { type: "no_training", severity: "medium", message: "2 lone workers without completed lone working training." },
];

const ARIA_INSIGHTS = [
  "8 lone working assessments across 6 staff. High risk: 1. Unacceptable: 0. Incidents: 1.",
  "Priority: 1 high-risk without assessment. Check-in protocol 62.5%. Personal alarms 37.5%.",
  "Lone working is inherently higher risk. Are check-ins genuinely happening? Are personal alarms tested? Is the lone working policy reviewed after every incident?",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-red-700 bg-red-50 border-red-200" },
  "Unacceptable": { label: "Unacceptable", color: "text-red-900 bg-red-100 border-red-300" },
};

export function StaffLoneWorkingRiskCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-indigo-200">
      <CardHeader className="pb-3 bg-indigo-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><PersonStanding className="h-4 w-4 text-indigo-600" /><span className="text-indigo-900">Lone Working Risk</span></CardTitle>
          <Link href="/staff-lone-working-risk" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High</p></div>
          <div className={cn("text-center rounded-lg p-2", m.incident_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.incident_count === 0 ? "text-green-600" : "text-amber-600")}>{m.incident_count}</p><p className="text-[10px] text-muted-foreground">Incidents</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_staff}</p><p className="text-[10px] text-muted-foreground">Staff</p></div>
          <div className="text-center rounded-lg p-2 bg-indigo-50"><p className="text-lg font-bold tabular-nums text-indigo-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["Low"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><ShieldCheck className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.assessor}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Lone Working Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-indigo-700"><Brain className="h-3 w-3" />ARIA Lone Working Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-indigo-200 bg-indigo-50 text-indigo-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
