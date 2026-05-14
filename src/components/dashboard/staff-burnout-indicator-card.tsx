"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, ChevronRight, AlertTriangle, Brain, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_indicators: 11, critical_count: 2, concerning_count: 4, unresolved_count: 7, escalated_count: 1, staff_aware_rate: 63.6, wellbeing_check_rate: 45.5, workload_reviewed_rate: 36.4, peer_support_rate: 27.3, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; type: string; severity: string; status: string }[] = [
  { staff: "Staff A", type: "Emotional Exh.", severity: "Critical", status: "Supporting" },
  { staff: "Staff B", type: "Compassion Fat.", severity: "Concerning", status: "Monitoring" },
  { staff: "Staff C", type: "Quality Decline", severity: "Developing", status: "Supporting" },
  { staff: "Staff D", type: "Workload Overw.", severity: "Critical", status: "Escalated" },
  { staff: "Staff E", type: "Withdrawal", severity: "Early Sign", status: "Monitoring" },
  { staff: "Staff F", type: "Cynicism", severity: "Developing", status: "Improving" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_unsupported", severity: "critical", message: "Staff B shows critical burnout signs with only monitoring — immediate support needed." },
  { type: "staff_not_aware", severity: "high", message: "4 indicators have staff not yet aware of concern." },
  { type: "no_wellbeing_check", severity: "high", message: "6 indicators have no wellbeing check completed." },
];

const ARIA_INSIGHTS = [
  "11 indicators across 6 staff. Critical: 2. Concerning: 4. Unresolved: 7. Escalated: 1.",
  "Priority: 2 critical burnout cases. Wellbeing checks only 45.5%. Peer support only 27.3%.",
  "Values people. Supports people early. Protects children through better workforce intelligence.",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Early Sign": { label: "Early", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Developing": { label: "Devel.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Concerning": { label: "Conc.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Critical": { label: "Crit.", color: "text-red-700 bg-red-50 border-red-200" },
  "Resolved": { label: "Res.", color: "text-green-700 bg-green-50 border-green-200" },
};

export function StaffBurnoutIndicatorCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HeartPulse className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Burnout Indicators</span></CardTitle>
          <Link href="/staff-burnout-indicator" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Indicators <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.concerning_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.concerning_count === 0 ? "text-green-600" : "text-amber-600")}>{m.concerning_count}</p><p className="text-[10px] text-muted-foreground">Concerning</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_indicators}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Indicators</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Early Sign"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Flame className="h-3 w-3 text-orange-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Burnout Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Wellbeing Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
