"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Banknote, ChevronRight, AlertTriangle, Brain, Clock, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_checks: 8, non_compliant_count: 1, action_required_count: 1, right_to_work_rate: 87.5, pension_enrolled_rate: 62.5, tax_code_rate: 100.0, ni_verified_rate: 100.0, contract_rate: 87.5, pay_rate_confirmed_rate: 87.5, review_scheduled_rate: 62.5, unique_staff: 6, unique_reviewers: 2 };

const DEMO_RECORDS: { staff: string; type: string; status: string; reviewer: string }[] = [
  { staff: "Staff A", type: "Right to Work", status: "Compliant", reviewer: "D. Laville" },
  { staff: "Staff B", type: "Pension Enrolment", status: "Compliant", reviewer: "J. Hughes" },
  { staff: "Staff C", type: "Tax Code", status: "Non-Compliant", reviewer: "D. Laville" },
  { staff: "Staff D", type: "NI Verification", status: "Compliant", reviewer: "J. Hughes" },
  { staff: "Staff E", type: "Pay Rate Review", status: "Action Required", reviewer: "D. Laville" },
  { staff: "Staff F", type: "HMRC Compliance", status: "Compliant", reviewer: "J. Hughes" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "right_to_work", severity: "critical", message: "1 staff member without right to work verified — illegal to employ." },
  { type: "non_compliant", severity: "high", message: "Staff C non-compliant on tax code — resolve immediately." },
  { type: "no_pension", severity: "medium", message: "2 staff without pension enrolment (no opt-out recorded)." },
];

const ARIA_INSIGHTS = [
  "8 checks across 6 staff. Non-compliant: 1. Action required: 1. Right to work 87.5%.",
  "Priority: 1 right to work gap. Pension enrolled 62.5%. Contract on file 87.5%.",
  "Payroll compliance protects both staff and organisation. Is right to work re-checked at renewal? Are pension duties genuinely met?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Non-Compliant": { label: "Non-Comp.", color: "text-red-700 bg-red-50 border-red-200" },
  "Action Required": { label: "Action", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Pending Verification": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function StaffPayrollComplianceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-green-200">
      <CardHeader className="pb-3 bg-green-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Banknote className="h-4 w-4 text-green-600" /><span className="text-green-900">Payroll Compliance</span></CardTitle>
          <Link href="/staff-payroll-compliance" className="text-xs text-green-600 hover:underline flex items-center gap-1">Checks <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-red-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.action_required_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.action_required_count === 0 ? "text-green-600" : "text-amber-600")}>{m.action_required_count}</p><p className="text-[10px] text-muted-foreground">Action</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_staff}</p><p className="text-[10px] text-muted-foreground">Staff</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.total_checks}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Receipt className="h-3 w-3 text-green-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.reviewer}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Payroll Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-green-700"><Brain className="h-3 w-3" />ARIA Payroll Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-green-200 bg-green-50 text-green-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
