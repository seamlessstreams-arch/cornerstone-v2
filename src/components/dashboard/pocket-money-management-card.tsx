"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, ChevronRight, AlertTriangle, Brain, Clock, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_transactions: 35, purchase_count: 14, savings_deposit_count: 6, declined_count: 2, retrospective_count: 3, receipt_obtained_rate: 80.0, budget_discussed_rate: 71.4, balance_reconciled_rate: 85.7, total_amount_pence: 48750, unique_children: 5 };

const DEMO_RECORDS: { child: string; type: string; amount: string; status: string }[] = [
  { child: "Child A", type: "Allowance", amount: "+£10.00", status: "Approved" },
  { child: "Child B", type: "Purchase", amount: "-£4.50", status: "Approved" },
  { child: "Child C", type: "Savings", amount: "+£5.00", status: "N/A" },
  { child: "Child D", type: "Purchase", amount: "-£12.00", status: "Retro" },
  { child: "Child A", type: "Birthday", amount: "+£20.00", status: "N/A" },
  { child: "Child E", type: "Purchase", amount: "-£8.99", status: "Declined" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "retrospective_no_receipt", severity: "critical", message: "Child D has retrospective electronics transaction without receipt — ensure financial accountability." },
  { type: "balance_not_reconciled", severity: "high", message: "5 transactions have balance not reconciled." },
  { type: "budget_not_discussed", severity: "medium", message: "10 transactions without budget discussion." },
];

const ARIA_INSIGHTS = [
  "35 transactions. 5 children. Purchases: 14. Savings: 6. Declined: 2. Receipts: 80%. Reconciled: 85.7%.",
  "Priority: 1 retrospective no receipt. 5 not reconciled. 10 no budget discussion. Strengthen financial literacy.",
  "Positive: Savings culture growing. Age-appropriate spending. Financial independence developing well.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Approved": { label: "Approved", color: "text-green-700 bg-green-50 border-green-200" },
  "N/A": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Retro": { label: "Retro", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PocketMoneyManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><PiggyBank className="h-4 w-4 text-brand" />Pocket Money</CardTitle>
          <Link href="/pocket-money-management" className="text-xs text-brand hover:underline flex items-center gap-1">Transactions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.balance_reconciled_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.balance_reconciled_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.balance_reconciled_rate}%</p><p className="text-[10px] text-muted-foreground">Reconciled</p></div>
          <div className={cn("text-center rounded-lg p-2", m.retrospective_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.retrospective_count === 0 ? "text-green-600" : "text-amber-600")}>{m.retrospective_count}</p><p className="text-[10px] text-muted-foreground">Retro</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.savings_deposit_count}</p><p className="text-[10px] text-muted-foreground">Savings</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Transactions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Approved"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Banknote className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.amount}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Financial Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Financial Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
