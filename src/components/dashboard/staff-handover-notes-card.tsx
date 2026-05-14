"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, AlertTriangle, Brain, Clock, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_notes: 32, critical_count: 2, high_count: 5, escalated_count: 1, pending_count: 4, acknowledged_rate: 87.5, written_record_rate: 90.6, follow_up_required_count: 8, follow_up_completed_rate: 62.5 };

const DEMO_RECORDS: { staff: string; category: string; shift: string; priority: string }[] = [
  { staff: "Staff A", category: "Safeguarding", shift: "Day-Night", priority: "Critical" },
  { staff: "Staff B", category: "Medication", shift: "Night-Day", priority: "High" },
  { staff: "Staff C", category: "Child Update", shift: "Day-Day", priority: "Medium" },
  { staff: "Staff A", category: "Task", shift: "Day-Night", priority: "Low" },
  { staff: "Staff D", category: "Emotional", shift: "Weekend", priority: "High" },
  { staff: "Staff B", category: "Appointment", shift: "Day-Night", priority: "Medium" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding", severity: "critical", message: "Critical safeguarding note from Staff A still pending — escalate immediately." },
  { type: "not_acknowledged", severity: "high", message: "4 notes not acknowledged by incoming staff." },
  { type: "follow_up", severity: "high", message: "3 notes have follow-up required but not completed." },
];

const ARIA_INSIGHTS = [
  "32 notes. Critical: 2. High: 5. Pending: 4. Acknowledged: 87.5%. Written: 90.6%. Follow-up: 62.5%.",
  "Priority: 1 safeguarding pending. 4 not acknowledged. 3 follow-ups overdue. Improve handover process.",
  "Positive: Good written records. Most notes acknowledged. Strong verbal handovers. Consistent documentation.",
];

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
  "High": { label: "High", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Medium": { label: "Medium", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Low": { label: "Low", color: "text-slate-700 bg-slate-50 border-slate-200" },
};

export function StaffHandoverNotesCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-brand" />Handover Notes</CardTitle>
          <Link href="/staff-handover-notes" className="text-xs text-brand hover:underline flex items-center gap-1">Notes <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.acknowledged_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.acknowledged_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.acknowledged_rate}%</p><p className="text-[10px] text-muted-foreground">Ack&apos;d</p></div>
          <div className={cn("text-center rounded-lg p-2", m.critical_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Notes</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PRIORITY_BADGES[r.priority] ?? PRIORITY_BADGES["Medium"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><StickyNote className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.category} · {r.shift}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Handover Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Handover Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
