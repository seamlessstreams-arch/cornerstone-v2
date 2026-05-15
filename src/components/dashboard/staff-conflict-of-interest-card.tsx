"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, ChevronRight, AlertTriangle, Brain, Clock, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_declarations: 6, high_risk_count: 1, critical_risk_count: 0, escalated_count: 1, mitigation_failed_count: 0, annual_review_rate: 50.0, manager_aware_rate: 83.3, documented_rate: 66.7, no_impact_confirmed_rate: 50.0, mitigation_in_place_rate: 60.0, unique_staff: 4 };

const DEMO_RECORDS: { staff: string; type: string; risk: string; status: string }[] = [
  { staff: "Staff A", type: "Financial", risk: "Low", status: "Accepted" },
  { staff: "Staff B", type: "Secondary Job", risk: "Medium", status: "Reviewed" },
  { staff: "Staff C", type: "Family Link", risk: "High", status: "Req. Action" },
  { staff: "Staff A", type: "Gift Accept.", risk: "Low", status: "Accepted" },
  { staff: "Staff D", type: "Social Media", risk: "None", status: "Submitted" },
  { staff: "Staff B", type: "Previous Prof.", risk: "Medium", status: "Escalated" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_risk_unaware", severity: "high", message: "Staff C has high-risk conflict with manager not confirmed aware — immediate review required." },
  { type: "declarations_not_reviewed", severity: "high", message: "2 declarations have not been reviewed." },
  { type: "annual_reviews_incomplete", severity: "medium", message: "3 declarations have annual reviews not completed." },
];

const ARIA_INSIGHTS = [
  "6 declarations across 4 staff. High risk: 1. Escalated: 1. Mitigation in place: 60.0%.",
  "Priority: 1 high-risk unmanaged. Manager aware 83.3%. Annual reviews 50.0%.",
  "Transparency protects everyone. Are conflicts declared openly? Is mitigation effective and reviewed annually?",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "None": { label: "None", color: "text-green-700 bg-green-50 border-green-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffConflictOfInterestCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><AlertOctagon className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Conflict of Interest</span></CardTitle>
          <Link href="/staff-conflict-of-interest" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Declarations <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.critical_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.critical_risk_count}</p><p className="text-[10px] text-muted-foreground">Critical</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-amber-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High Risk</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-amber-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_declarations}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Declarations</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["None"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileWarning className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Conflict Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Conflict Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
