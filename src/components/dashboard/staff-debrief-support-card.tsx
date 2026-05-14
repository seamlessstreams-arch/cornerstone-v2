"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronRight, AlertTriangle, Brain, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_debriefs: 15, critical_severity_count: 2, significantly_affected_count: 3, further_support_count: 2, declined_support_count: 1, timely_debrief_rate: 80.0, learning_captured_rate: 73.3, average_duration: 35, unique_staff: 8 };

const DEMO_RECORDS: { staff: string; type: string; severity: string; impact: string }[] = [
  { staff: "Staff A", type: "Post-Incident", severity: "High", impact: "Moderate" },
  { staff: "Staff B", type: "Post-Restraint", severity: "Critical", impact: "Significant" },
  { staff: "Staff C", type: "End of Shift", severity: "N/A", impact: "Not Affected" },
  { staff: "Staff D", type: "Critical Incident", severity: "Critical", impact: "Significant" },
  { staff: "Staff A", type: "Team Reflect", severity: "Low", impact: "Mild" },
  { staff: "Staff E", type: "Post-Missing", severity: "Medium", impact: "Moderate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "significantly_affected_no_followup", severity: "critical", message: "Staff B significantly affected after post restraint without follow-up scheduled — ensure wellbeing support." },
  { type: "not_timely", severity: "high", message: "3 debriefs were not conducted in a timely manner." },
  { type: "no_emotional_support", severity: "medium", message: "4 debriefs without emotional support offered." },
];

const ARIA_INSIGHTS = [
  "15 debriefs. 8 staff. Critical: 2. Significant: 3. Timely: 80%. Learning: 73.3%. Avg: 35 min.",
  "Priority: 1 sig. affected no follow-up. 3 not timely. 4 no emotional support. Strengthen debrief protocol.",
  "Positive: Peer support culture growing. Supervision linkage improving. EAP awareness increasing.",
];

const IMPACT_BADGES: Record<string, { label: string; color: string }> = {
  "Not Affected": { label: "None", color: "text-green-700 bg-green-50 border-green-200" },
  "Mild": { label: "Mild", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Moderate": { label: "Moderate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Significant": { label: "Significant", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffDebriefSupportCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4 text-brand" />Staff Debriefs</CardTitle>
          <Link href="/staff-debrief-support" className="text-xs text-brand hover:underline flex items-center gap-1">Debriefs <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.timely_debrief_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.timely_debrief_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.timely_debrief_rate}%</p><p className="text-[10px] text-muted-foreground">Timely</p></div>
          <div className={cn("text-center rounded-lg p-2", m.significantly_affected_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.significantly_affected_count === 0 ? "text-green-600" : "text-red-600")}>{m.significantly_affected_count}</p><p className="text-[10px] text-muted-foreground">Sig.Affected</p></div>
          <div className={cn("text-center rounded-lg p-2", m.further_support_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.further_support_count === 0 ? "text-green-600" : "text-amber-600")}>{m.further_support_count}</p><p className="text-[10px] text-muted-foreground">More Support</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_staff}</p><p className="text-[10px] text-muted-foreground">Staff</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Debriefs</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = IMPACT_BADGES[r.impact] ?? IMPACT_BADGES["Mild"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Shield className="h-3 w-3 text-sky-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.severity}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Debrief Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Debrief Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
