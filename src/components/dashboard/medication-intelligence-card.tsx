"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION INTELLIGENCE CARD
// Dashboard card for MAR compliance, controlled drug audit status,
// medication error tracking, and ARIA medication intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pill, ChevronRight, AlertTriangle, CheckCircle2,
  Clock, Brain, ShieldAlert, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalScheduled: 42,
  totalGiven: 38,
  totalRefused: 2,
  totalWithheld: 1,
  totalMissed: 1,
  complianceRate: 92.9,
  refusalRate: 4.8,
};

const DEMO_CONTROLLED = {
  totalControlled: 2,
  stockDiscrepancies: 0,
  witnessComplianceRate: 100,
  overdueStockChecks: 1,
};

const DEMO_ERRORS = {
  totalErrors: 1,
  errorRate: 2.4,
  bySeverity: { critical: 0, high: 0, medium: 1, low: 0 },
  notificationsRequired: 0,
  notificationsSent: 0,
};

const ACTIVE_PRESCRIPTIONS = [
  {
    id: "rx_1",
    child: "Alex W",
    medication: "Methylphenidate 10mg",
    type: "controlled",
    frequency: "Twice daily",
    stockCount: 14,
    lastStockCheck: "2026-05-11",
  },
  {
    id: "rx_2",
    child: "Tyler R",
    medication: "Melatonin 3mg",
    type: "regular",
    frequency: "At bedtime",
    stockCount: 22,
    lastStockCheck: "2026-05-10",
  },
  {
    id: "rx_3",
    child: "Alex W",
    medication: "Ibuprofen 200mg",
    type: "prn",
    frequency: "As needed (max 3/day)",
    stockCount: 8,
    lastStockCheck: null,
  },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string; child: string }[] = [
  { type: "overdue_stock_check", severity: "medium", message: "Ibuprofen 200mg (PRN) — no stock check recorded. Conduct stock reconciliation.", child: "Alex W" },
  { type: "refusal_pattern", severity: "high", message: "Tyler R refused Melatonin twice this week. Review with prescriber if pattern continues.", child: "Tyler R" },
];

const ARIA_INSIGHTS = [
  "Methylphenidate stock check was 3 days ago — next controlled drug audit due in 4 days. Dual-signature witnessed on all controlled administrations this period.",
  "1 medication error (wrong time) recorded this period. Low severity, no Ofsted notification required. Documentation corrective action completed.",
  "Positive: 92.9% MAR compliance rate exceeds the 90% target. All PRN administrations include documented rationale. Reg 23 health care standards are well evidenced.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLOURS: Record<string, string> = {
  controlled: "bg-red-100 text-red-700",
  regular: "bg-blue-100 text-blue-700",
  prn: "bg-amber-100 text-amber-700",
  otc: "bg-gray-100 text-gray-600",
  topical: "bg-green-100 text-green-700",
  homely_remedy: "bg-purple-100 text-purple-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function MedicationIntelligenceCard() {
  const c = DEMO_COMPLIANCE;
  const ctrl = DEMO_CONTROLLED;
  const err = DEMO_ERRORS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand" />
            Medication Intelligence
          </CardTitle>
          <Link href="/medication" className="text-xs text-brand hover:underline flex items-center gap-1">
            Medication <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: c.complianceRate >= 90 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.complianceRate >= 90 ? "text-green-600" : "text-amber-600")}>
              {c.complianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">MAR Compliance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.refusalRate > 5 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.refusalRate > 5 ? "text-amber-600" : "text-green-600")}>
              {c.refusalRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Refusal Rate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", ctrl.witnessComplianceRate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", ctrl.witnessComplianceRate >= 100 ? "text-green-600" : "text-red-600")}>
              {ctrl.witnessComplianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">CD Witnessed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", err.totalErrors === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", err.totalErrors === 0 ? "text-green-600" : "text-amber-600")}>
              {err.totalErrors}
            </p>
            <p className="text-[10px] text-muted-foreground">Errors</p>
          </div>
        </div>

        {/* ── Controlled drug audit status ─────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Lock className={cn("h-4 w-4", ctrl.overdueStockChecks > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">Controlled Drug Audit</p>
              <p className="text-[10px] text-muted-foreground">
                {ctrl.totalControlled} controlled {ctrl.totalControlled === 1 ? "prescription" : "prescriptions"} · {ctrl.stockDiscrepancies} discrepancies
              </p>
            </div>
          </div>
          {ctrl.overdueStockChecks > 0 ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              {ctrl.overdueStockChecks} check{ctrl.overdueStockChecks !== 1 ? "s" : ""} overdue
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Up to date
            </Badge>
          )}
        </div>

        {/* ── Active prescriptions ────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Active Prescriptions</p>
          {ACTIVE_PRESCRIPTIONS.map((rx) => (
            <div key={rx.id} className="rounded-lg border p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{rx.child}</span>
                  <Badge className={cn("text-[10px]", TYPE_COLOURS[rx.type] ?? "bg-gray-100 text-gray-600")}>
                    {rx.type}
                  </Badge>
                </div>
                <span className="text-muted-foreground tabular-nums">
                  Stock: {rx.stockCount}
                </span>
              </div>
              <p className="text-muted-foreground">{rx.medication} · {rx.frequency}</p>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Medication Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "critical" || alert.severity === "high"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800",
                )}
              >
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Medication Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-blue-200 bg-blue-50 text-blue-800"
                  : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-green-200 bg-green-50 text-green-800",
              )}
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
