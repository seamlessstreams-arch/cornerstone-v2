"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ChevronRight, AlertTriangle, Brain, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_policies: 8, expired_count: 0, renewal_due_count: 1, gap_count: 0, claim_pending_count: 1, document_held_rate: 87.5, certificate_displayed_rate: 75.0, cover_adequate_rate: 87.5, excess_acceptable_rate: 75.0, broker_reviewed_rate: 62.5, claims_clear_rate: 87.5, regulatory_met_rate: 87.5, management_reviewed_rate: 75.0, total_premium: 12500, unique_policies: 8 };

const DEMO_RECORDS: { policy: string; type: string; status: string; renewal: string }[] = [
  { policy: "Employers Liab.", type: "EL", status: "Compliant", renewal: "Sep 2026" },
  { policy: "Public Liability", type: "PL", status: "Compliant", renewal: "Sep 2026" },
  { policy: "Building", type: "Building", status: "Renewal Due", renewal: "Jun 2026" },
  { policy: "Contents", type: "Contents", status: "Compliant", renewal: "Dec 2026" },
  { policy: "Prof. Indemnity", type: "PI", status: "Compliant", renewal: "Mar 2027" },
  { policy: "Motor Fleet", type: "Motor", status: "Claim Pend.", renewal: "Aug 2026" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "renewal_due", severity: "high", message: "Building insurance renewal due within 30 days — arrange renewal to avoid coverage gap." },
  { type: "cover_inadequate", severity: "medium", message: "1 policy has cover assessed as not adequate — review with broker." },
  { type: "cert_not_displayed", severity: "medium", message: "2 policies without certificate displayed — regulatory requirement for EL." },
];

const ARIA_INSIGHTS = [
  "8 policies tracked. Expired: 0. Renewal due: 1. Gaps: 0. Claims pending: 1.",
  "Priority: 1 renewal due soon. Regulatory met 87.5%. Cover adequate 87.5%.",
  "Insurance protects children and the home. Are all policies current? Is cover adequate for the risks carried? Are certificates displayed?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Renewal Due": { label: "Renewal", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Expired": { label: "Expired", color: "text-red-700 bg-red-50 border-red-200" },
  "Claim Pend.": { label: "Claim", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Gap": { label: "Gap", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeInsuranceComplianceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-zinc-200">
      <CardHeader className="pb-3 bg-zinc-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-zinc-600" /><span className="text-zinc-900">Insurance</span></CardTitle>
          <Link href="/home-insurance-compliance" className="text-xs text-zinc-600 hover:underline flex items-center gap-1">Policies <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p><p className="text-[10px] text-muted-foreground">Expired</p></div>
          <div className={cn("text-center rounded-lg p-2", m.gap_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.gap_count === 0 ? "text-green-600" : "text-red-600")}>{m.gap_count}</p><p className="text-[10px] text-muted-foreground">Gaps</p></div>
          <div className={cn("text-center rounded-lg p-2", m.renewal_due_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.renewal_due_count === 0 ? "text-green-600" : "text-amber-600")}>{m.renewal_due_count}</p><p className="text-[10px] text-muted-foreground">Renewal</p></div>
          <div className="text-center rounded-lg p-2 bg-zinc-50"><p className="text-lg font-bold tabular-nums text-zinc-600">{m.total_policies}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Active Policies</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileCheck className="h-3 w-3 text-zinc-500 shrink-0" /><span className="font-medium">{r.policy}</span><span className="text-muted-foreground truncate">{r.type} · {r.renewal}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Insurance Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-zinc-700"><Brain className="h-3 w-3" />ARIA Insurance Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-zinc-200 bg-zinc-50 text-zinc-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
