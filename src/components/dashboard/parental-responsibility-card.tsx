"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PARENTAL RESPONSIBILITY INTELLIGENCE CARD
// Dashboard card for parental responsibility and care order tracking.
// CHR 2015 Reg 14, Reg 21. Children Act 1989 s33.
// SCCIF: Overall Experiences — "PR arrangements are understood."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users2, ChevronRight, AlertTriangle, Brain,
  FileText, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 9,
  children_covered: 6,
  coverage_rate: 100,
  section_20_count: 2,
  full_care_order_count: 3,
  interim_care_order_count: 1,
  conflict_count: 1,
  pr_holder_informed_rate: 77.8,
};

const DEMO_RECORDS: { child: string; order: string; holder: string; status: string }[] = [
  { child: "Child A", order: "Full Care Order", holder: "LA + Birth Mother", status: "Active" },
  { child: "Child B", order: "Section 20", holder: "Birth Mother", status: "Active" },
  { child: "Child C", order: "Interim Care Order", holder: "LA", status: "Active" },
  { child: "Child D", order: "Full Care Order", holder: "LA + Birth Father", status: "Disputed" },
  { child: "Child E", order: "Section 20", holder: "Birth Mother", status: "Active" },
  { child: "Child F", order: "Full Care Order", holder: "LA", status: "Active" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "pr_conflict", severity: "high", message: "Conflict between PR holders for Child D — resolve with social worker and legal advice." },
  { type: "pr_holder_not_informed", severity: "high", message: "PR holder (Birth Father) not informed of Child D's placement — legal obligation to inform." },
  { type: "section_20_notice", severity: "medium", message: "2 children are accommodated under Section 20 — parents can withdraw consent at any time." },
];

const ARIA_INSIGHTS = [
  "9 PR records covering all 6 children (100%). 3 full care orders, 1 interim, 2 section 20. 1 PR conflict active. PR holder informed rate: 77.8%.",
  "Priority: Child D has PR conflict between LA and birth father — impacts decision-making. Birth father not informed of placement, breaching legal obligation. 2 section 20 children — contingency plans needed if parents withdraw consent.",
  "Positive: 100% children have documented PR arrangements. Most PR holders informed and involved. Care order status clear for all children. Consider annual PR review meetings with social workers.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Active": { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  "Disputed": { label: "Disputed", color: "text-red-700 bg-red-50 border-red-200" },
  "Restricted": { label: "Restricted", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function ParentalResponsibilityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users2 className="h-4 w-4 text-brand" />
            Parental Responsibility
          </CardTitle>
          <Link href="/parental-responsibility" className="text-xs text-brand hover:underline flex items-center gap-1">
            PR Records <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.full_care_order_count}</p>
            <p className="text-[10px] text-muted-foreground">Care Orders</p>
          </div>
          <div className="text-center rounded-lg bg-amber-50 p-2">
            <p className="text-lg font-bold tabular-nums text-amber-600">{m.section_20_count}</p>
            <p className="text-[10px] text-muted-foreground">Section 20</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.conflict_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.conflict_count === 0 ? "text-green-600" : "text-red-600")}>{m.conflict_count}</p>
            <p className="text-[10px] text-muted-foreground">Conflicts</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.coverage_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><FileText className="h-3 w-3" />PR Overview</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Active"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.order} · {r.holder}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />PR Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA PR Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
