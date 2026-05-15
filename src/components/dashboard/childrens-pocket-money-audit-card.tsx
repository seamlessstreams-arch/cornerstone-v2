"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, ChevronRight, AlertTriangle, Brain, Clock, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_audits: 8, significant_discrepancy_count: 1, fraud_suspected_count: 0, discrepancy_found_count: 2, not_audited_count: 1, receipt_rate: 75.0, child_signed_rate: 62.5, staff_witnessed_rate: 87.5, two_signatures_rate: 50.0, balance_matches_rate: 75.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; amount: string }[] = [
  { child: "Child A", type: "Weekly", outcome: "Compliant", amount: "£5.00" },
  { child: "Child B", type: "Clothing", outcome: "Minor Disc.", amount: "£15.00" },
  { child: "Child C", type: "Activity", outcome: "Sig. Disc.", amount: "£10.00" },
  { child: "Child A", type: "Savings", outcome: "Compliant", amount: "£3.00" },
  { child: "Child D", type: "Birthday", outcome: "Compliant", amount: "£20.00" },
  { child: "Child B", type: "Top Up", outcome: "Not Audited", amount: "£5.00" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "significant_discrepancy", severity: "high", message: "Child C has a significant discrepancy with balance not matching records — review required." },
  { type: "two_signatures_missing", severity: "high", message: "4 transactions missing two signatures." },
  { type: "child_not_consulted", severity: "medium", message: "3 transactions have child not consulted on spending." },
];

const ARIA_INSIGHTS = [
  "8 audits across 4 children. Significant discrepancy: 1. Discrepancy found: 2. Not audited: 1.",
  "Priority: 1 significant discrepancy. Two signatures 50.0%. Balance matches 75.0%.",
  "Children's money must be safeguarded. Are two signatures always present? Is the child involved in spending decisions?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Disc.": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Sig. Disc.": { label: "Sig. Disc.", color: "text-red-700 bg-red-50 border-red-200" },
  "Fraud": { label: "Fraud", color: "text-red-900 bg-red-100 border-red-300" },
  "Not Audited": { label: "Unaudited", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function ChildrensPocketMoneyAuditCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-teal-200">
      <CardHeader className="pb-3 bg-teal-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Coins className="h-4 w-4 text-teal-600" /><span className="text-teal-900">Pocket Money Audit</span></CardTitle>
          <Link href="/childrens-pocket-money-audit" className="text-xs text-teal-600 hover:underline flex items-center gap-1">Audits <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.fraud_suspected_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.fraud_suspected_count === 0 ? "text-green-600" : "text-red-600")}>{m.fraud_suspected_count}</p><p className="text-[10px] text-muted-foreground">Fraud</p></div>
          <div className={cn("text-center rounded-lg p-2", m.significant_discrepancy_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.significant_discrepancy_count === 0 ? "text-green-600" : "text-red-600")}>{m.significant_discrepancy_count}</p><p className="text-[10px] text-muted-foreground">Sig. Disc.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.discrepancy_found_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.discrepancy_found_count === 0 ? "text-green-600" : "text-amber-600")}>{m.discrepancy_found_count}</p><p className="text-[10px] text-muted-foreground">Discrepancy</p></div>
          <div className="text-center rounded-lg p-2 bg-teal-50"><p className="text-lg font-bold tabular-nums text-teal-600">{m.total_audits}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Audits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Not Audited"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Receipt className="h-3 w-3 text-teal-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.amount}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Audit Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-teal-700"><Brain className="h-3 w-3" />ARIA Financial Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-teal-200 bg-teal-50 text-teal-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
