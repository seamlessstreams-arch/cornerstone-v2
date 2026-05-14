"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, ChevronRight, AlertTriangle, Brain, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_appointments: 13, non_compliant_count: 1, refused_count: 1, treatment_refused_count: 1, emergency_count: 2, appointment_attended_rate: 84.6, consent_rate: 92.3, anxiety_managed_rate: 69.2, follow_up_rate: 76.9, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; compliance: string; outcome: string }[] = [
  { child: "Child A", type: "Dental Check", compliance: "Compliant", outcome: "No Treatment" },
  { child: "Child B", type: "Optical Exam", compliance: "Compliant", outcome: "Completed" },
  { child: "Child C", type: "Dental Treat.", compliance: "Non-Comp.", outcome: "Refused" },
  { child: "Child D", type: "Orthodontic", compliance: "Mostly", outcome: "Ongoing" },
  { child: "Child E", type: "Dental Emerg.", compliance: "Compliant", outcome: "Completed" },
  { child: "Child F", type: "Optical Presc.", compliance: "Refused", outcome: "Refused" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_urgent", severity: "critical", message: "Child C refused urgent dental treatment — escalate immediately." },
  { type: "not_attended", severity: "high", message: "2 appointments have not been attended." },
  { type: "no_consent", severity: "high", message: "1 appointment has no consent obtained." },
];

const ARIA_INSIGHTS = [
  "13 appointments. Non-compliant: 1. Refused: 1. Treatment refused: 1. Emergencies: 2. Attended: 84.6%.",
  "Priority: 1 refused urgent treatment. Attendance at 84.6%. Anxiety managed only 69.2%.",
  "Positive: Most appointments attended. Good consent rates. Dental emergencies handled promptly.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "No Treatment": { label: "None", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Ongoing": { label: "Ongoing", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Follow-up": { label: "Follow", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Refused": { label: "Refused", color: "text-red-700 bg-red-50 border-red-200" },
};

export function DentalOpticalHealthCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Stethoscope className="h-4 w-4 text-brand" />Dental &amp; Optical</CardTitle>
          <Link href="/dental-optical-health" className="text-xs text-brand hover:underline flex items-center gap-1">Appointments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.treatment_refused_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.treatment_refused_count === 0 ? "text-green-600" : "text-red-600")}>{m.treatment_refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.emergency_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.emergency_count === 0 ? "text-green-600" : "text-amber-600")}>{m.emergency_count}</p><p className="text-[10px] text-muted-foreground">Urgent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-amber-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_appointments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Appointments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Ongoing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Eye className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.compliance}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Health Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Health Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
