"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ChevronRight, AlertTriangle, Brain, Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_checks: 8, expired_count: 0, renewal_due_count: 1, pending_count: 1, disclosed_count: 1, enhanced_rate: 87.5, barred_list_rate: 87.5, update_service_rate: 50.0, identity_rate: 100.0, right_to_work_rate: 100.0, risk_assessment_rate: 75.0, overseas_rate: 25.0, references_rate: 87.5, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; type: string; status: string; outcome: string }[] = [
  { staff: "Staff A", type: "Enhanced", status: "Current", outcome: "Clear" },
  { staff: "Staff B", type: "Enhanced+", status: "Current", outcome: "Clear" },
  { staff: "Staff C", type: "Enhanced", status: "Renewal Due", outcome: "Clear" },
  { staff: "Staff D", type: "Enhanced+", status: "Current", outcome: "Disclosed" },
  { staff: "Staff E", type: "Enhanced", status: "Pending", outcome: "Pending" },
  { staff: "Staff F", type: "Update Svc.", status: "Current", outcome: "Clear" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "renewal_overdue", severity: "high", message: "Staff C DBS renewal approaching — arrange renewal to maintain compliance." },
  { type: "update_service", severity: "medium", message: "4 staff not registered with DBS Update Service." },
  { type: "overseas_check", severity: "medium", message: "6 staff without overseas police check completed." },
];

const ARIA_INSIGHTS = [
  "8 checks across 6 staff. Expired: 0. Renewal due: 1. Pending: 1. Disclosed: 1.",
  "Priority: 1 renewal approaching. Enhanced completed 87.5%. Update service 50.0%.",
  "DBS checks are non-negotiable for safeguarding. Is every staff member current? Are disclosed results risk-assessed and managed?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Current": { label: "Current", color: "text-green-700 bg-green-50 border-green-200" },
  "Renewal Due": { label: "Renewal", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Pending": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffDbsRenewalTrackingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4 text-purple-600" /><span className="text-purple-900">DBS Tracking</span></CardTitle>
          <Link href="/staff-dbs-renewal-tracking" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Checks <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p><p className="text-[10px] text-muted-foreground">Expired</p></div>
          <div className={cn("text-center rounded-lg p-2", m.renewal_due_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.renewal_due_count === 0 ? "text-green-600" : "text-amber-600")}>{m.renewal_due_count}</p><p className="text-[10px] text-muted-foreground">Renewal</p></div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-blue-50")}><p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-blue-600")}>{m.pending_count}</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_checks}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Current"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCheck className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.outcome}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />DBS Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA DBS Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
