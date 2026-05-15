"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, ChevronRight, AlertTriangle, Brain, Clock, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_registrations: 8, active_count: 6, expired_count: 0, lapsed_count: 1, suspended_count: 0, pin_verified_rate: 75.0, cpd_compliance_rate: 62.5, fitness_to_practise_rate: 100.0, conditions_count: 0, renewal_submitted_rate: 25.0, unique_staff: 6, unique_bodies: 3 };

const DEMO_RECORDS: { staff: string; body: string; status: string; pin: string }[] = [
  { staff: "Staff A", body: "Social Work England", status: "Active", pin: "Verified" },
  { staff: "Staff B", body: "HCPC", status: "Active", pin: "Verified" },
  { staff: "Staff C", body: "Social Work England", status: "Lapsed", pin: "Not Verified" },
  { staff: "Staff D", body: "NMC", status: "Active", pin: "Verified" },
  { staff: "Staff E", body: "Social Work England", status: "Pending", pin: "Not Verified" },
  { staff: "Staff F", body: "HCPC", status: "Active", pin: "Verified" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "lapsed", severity: "high", message: "Staff C registration lapsed — arrange renewal immediately." },
  { type: "pin_not_verified", severity: "high", message: "2 staff without PIN verification completed." },
  { type: "cpd_shortfall", severity: "medium", message: "3 staff with CPD hours below required threshold." },
];

const ARIA_INSIGHTS = [
  "8 registrations across 6 staff and 3 bodies. Active: 6. Lapsed: 1. Expired: 0.",
  "Priority: 1 lapsed registration. PIN verified 75.0%. CPD compliance 62.5%.",
  "Professional registration is a regulatory requirement. Are PINs genuinely verified? Is CPD meaningful or just hours counted?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Active": { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  "Pending": { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Lapsed": { label: "Lapsed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Suspended": { label: "Suspended", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
  "Revoked": { label: "Revoked", color: "text-red-900 bg-red-100 border-red-300" },
};

export function StaffProfessionalRegistrationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-indigo-200">
      <CardHeader className="pb-3 bg-indigo-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-indigo-600" /><span className="text-indigo-900">Prof. Registration</span></CardTitle>
          <Link href="/staff-professional-registration" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">Registrations <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p><p className="text-[10px] text-muted-foreground">Expired</p></div>
          <div className={cn("text-center rounded-lg p-2", m.lapsed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.lapsed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.lapsed_count}</p><p className="text-[10px] text-muted-foreground">Lapsed</p></div>
          <div className={cn("text-center rounded-lg p-2", m.suspended_count === 0 ? "bg-green-50" : "bg-orange-50")}><p className={cn("text-lg font-bold tabular-nums", m.suspended_count === 0 ? "text-green-600" : "text-orange-600")}>{m.suspended_count}</p><p className="text-[10px] text-muted-foreground">Suspended</p></div>
          <div className="text-center rounded-lg p-2 bg-indigo-50"><p className="text-lg font-bold tabular-nums text-indigo-600">{m.total_registrations}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Registrations</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Active"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><IdCard className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.body} · {r.pin}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Registration Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-indigo-700"><Brain className="h-3 w-3" />ARIA Registration Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-indigo-200 bg-indigo-50 text-indigo-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
