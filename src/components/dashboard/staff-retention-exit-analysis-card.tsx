"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMinus, ChevronRight, AlertTriangle, Brain, Clock, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_exits: 8, career_progression_count: 2, burnout_count: 2, pay_dissatisfaction_count: 1, critical_risk_count: 1, exit_interview_rate: 75.0, notice_served_rate: 87.5, knowledge_transfer_rate: 62.5, counter_offer_rate: 25.0, replacement_rate: 50.0, stay_interview_rate: 37.5, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; reason: string; risk: string; status: string }[] = [
  { staff: "Staff A", reason: "Career Prog.", risk: "Low", status: "Closed" },
  { staff: "Staff B", reason: "Burnout", risk: "High", status: "Analysed" },
  { staff: "Staff C", reason: "Pay", risk: "Medium", status: "Interview Done" },
  { staff: "Staff D", reason: "Personal", risk: "Low", status: "Closed" },
  { staff: "Staff E", reason: "Burnout", risk: "Critical", status: "Action Planned" },
  { staff: "Staff F", reason: "Career Prog.", risk: "Low", status: "Interview Sched." },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_no_action", severity: "critical", message: "Staff E at critical retention risk with no retention action completed — immediate intervention required." },
  { type: "burnout_no_stay", severity: "high", message: "2 staff leaving due to burnout without stay interviews completed." },
  { type: "no_exit_interview", severity: "high", message: "2 exits without exit interviews — valuable feedback being lost." },
];

const ARIA_INSIGHTS = [
  "8 exits across 6 staff. Burnout: 2. Career progression: 2. Critical risk: 1.",
  "Priority: 1 critical-risk exit unmanaged. Stay interviews 37.5%. Knowledge transfer 62.5%.",
  "Workforce stability underpins care quality. Are exit patterns being analysed? Are retention strategies proactive or reactive?",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffRetentionExitAnalysisCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-amber-200">
      <CardHeader className="pb-3 bg-amber-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><UserMinus className="h-4 w-4 text-amber-600" /><span className="text-amber-900">Staff Retention</span></CardTitle>
          <Link href="/staff-retention-exit-analysis" className="text-xs text-amber-600 hover:underline flex items-center gap-1">Analysis <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_risk_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.burnout_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.burnout_count === 0 ? "text-green-600" : "text-amber-600")}>{m.burnout_count}</p><p className="text-[10px] text-muted-foreground">Burnout</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pay_dissatisfaction_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.pay_dissatisfaction_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pay_dissatisfaction_count}</p><p className="text-[10px] text-muted-foreground">Pay</p></div>
          <div className="text-center rounded-lg p-2 bg-amber-50"><p className="text-lg font-bold tabular-nums text-amber-600">{m.total_exits}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Exits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["Low"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><TrendingDown className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.reason} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Retention Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-amber-700"><Brain className="h-3 w-3" />ARIA Retention Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-amber-200 bg-amber-50 text-amber-800" : i === 1 ? "border-orange-200 bg-orange-50 text-orange-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
