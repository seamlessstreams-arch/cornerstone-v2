"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S FUND MANAGEMENT INTELLIGENCE CARD
// Dashboard card for pocket money, savings, and financial accountability.
// CHR 2015 Reg 34, Reg 9, Reg 45.
// SCCIF: Overall Experiences — "Children's money is managed safely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PiggyBank, ChevronRight, AlertTriangle, Brain,
  Clock, Receipt, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_transactions: 48,
  total_credit_amount: 485.00,
  total_debit_amount: 312.50,
  net_balance: 172.50,
  unique_children: 4,
  receipt_attached_rate: 72.9,
  authorised_rate: 89.6,
  pending_authorisation_count: 3,
  discrepancy_count: 1,
};

const DEMO_RECORDS: { child: string; type: string; amount: string; date: string; credit: boolean }[] = [
  { child: "Child A", type: "Pocket Money", amount: "£15.00", date: "12 May", credit: true },
  { child: "Child B", type: "Purchase", amount: "£8.50", date: "11 May", credit: false },
  { child: "Child C", type: "Birthday", amount: "£25.00", date: "10 May", credit: true },
  { child: "Child A", type: "Activity", amount: "£12.00", date: "9 May", credit: false },
  { child: "Child D", type: "Savings", amount: "£20.00", date: "8 May", credit: true },
  { child: "Child B", type: "Clothing", amount: "£35.00", date: "7 May", credit: true },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "discrepancy_found", severity: "critical", message: "Financial discrepancy found for Child B on 2025-05-06 — investigate immediately." },
  { type: "pending_authorisation", severity: "high", message: "3 transactions pending authorisation — review and approve promptly." },
  { type: "no_receipt", severity: "medium", message: "5 debit transactions without receipts attached — ensure financial accountability." },
];

const ARIA_INSIGHTS = [
  "48 transactions across 4 children. Credits: £485.00. Debits: £312.50. Net: £172.50. Receipts: 72.9%. Authorised: 89.6%. 3 pending. 1 discrepancy.",
  "Priority: Financial discrepancy for Child B needs immediate investigation. 3 pending authorisations. 5 debits without receipts. Improve receipt compliance.",
  "Positive: 89.6% authorisation rate. Regular pocket money payments. Savings deposits being made. Good financial education opportunities. Improve receipt tracking.",
];

const TYPE_BADGES: Record<string, { color: string }> = {
  "true": { color: "text-green-700 bg-green-50 border-green-200" },
  "false": { color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildrensFundManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-brand" />
            Children&apos;s Fund Management
          </CardTitle>
          <Link href="/fund-management" className="text-xs text-brand hover:underline flex items-center gap-1">
            Funds <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_transactions}</p>
            <p className="text-[10px] text-muted-foreground">Trans.</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">£{m.net_balance}</p>
            <p className="text-[10px] text-muted-foreground">Net Bal.</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.authorised_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Authorised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.discrepancy_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.discrepancy_count > 0 ? "text-red-600" : "text-green-600")}>{m.discrepancy_count}</p>
            <p className="text-[10px] text-muted-foreground">Discrep.</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Transactions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = TYPE_BADGES[String(r.credit)];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Receipt className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{r.amount}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fund Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Fund Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
