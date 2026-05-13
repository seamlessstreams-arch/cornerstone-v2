"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — BUSINESS CONTINUITY INTELLIGENCE CARD
// Dashboard card for BCP plans, testing, recovery readiness, and ARIA
// business continuity intelligence.
// CHR 2015 Reg 29 (business continuity), Reg 12 (protection from harm).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, ChevronRight, AlertTriangle, Brain,
  FileCheck, Clock, Zap, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  active_plans: 6,
  plans_due_review: 1,
  tests_this_year: 4,
  critical_plans: 2,
  plans_without_test: 1,
  avg_recovery_hours: 4,
};

const DEMO_PLANS = [
  { title: "Full BCP", type: "full_bcp", risk: "critical", status: "active", tested: true },
  { title: "Fire & Evacuation", type: "fire_evacuation", risk: "critical", status: "active", tested: true },
  { title: "Staff Shortage", type: "staff_shortage", risk: "high", status: "active", tested: true },
  { title: "Pandemic Plan", type: "pandemic", risk: "medium", status: "active", tested: false },
  { title: "IT Failure", type: "it_failure", risk: "medium", status: "active", tested: true },
  { title: "Power Outage", type: "power_outage", risk: "low", status: "active", tested: false },
];

const DEMO_RECENT_TESTS = [
  { plan: "Fire & Evacuation", type: "Full Drill", date: "2026-04-15", outcome: "passed" },
  { plan: "Full BCP", type: "Tabletop", date: "2026-03-20", outcome: "partial_pass" },
  { plan: "Staff Shortage", type: "Walkthrough", date: "2026-02-10", outcome: "passed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "plan_due_review", severity: "high", message: "Pandemic plan due for annual review in 18 days. Last reviewed January 2025. Update required to reflect current guidance." },
  { type: "no_test_conducted", severity: "medium", message: "Power outage plan has never been tested — schedule a tabletop exercise or walkthrough within the next quarter." },
];

const ARIA_INSIGHTS = [
  "Full BCP and Fire & Evacuation plans are critical priority and both tested within the last 3 months. Fire drill on 15 April achieved full evacuation in 3 minutes 45 seconds — meets target. BCP tabletop exercise identified one gap: communication cascade to parents took 40 minutes vs 20-minute target. Action raised.",
  "Pandemic plan approaching review date — last updated for COVID-19 in January 2025. Consider updating with lessons learned from winter respiratory illness outbreak in March 2026. Staff shortage plan tested and effective — 3 agency staff on standby list confirmed available.",
  "Overall: 6 active plans covering key risk scenarios. 4 tests completed this year. Average recovery time objective: 4 hours. 1 plan untested (power outage). All critical plans approved and tested. Reg 29 compliance: GOOD.",
];

const riskColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-green-100 text-green-700",
};

const outcomeColor: Record<string, string> = {
  passed: "bg-green-100 text-green-700",
  partial_pass: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function BusinessContinuityCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            Business Continuity
          </CardTitle>
          <Link href="/business-continuity" className="text-xs text-brand hover:underline flex items-center gap-1">
            Plans <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.active_plans}</p>
            <p className="text-[10px] text-muted-foreground">Active Plans</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.critical_plans > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.critical_plans > 0 ? "text-red-600" : "text-green-600")}>
              {m.critical_plans}
            </p>
            <p className="text-[10px] text-muted-foreground">Critical</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.tests_this_year}</p>
            <p className="text-[10px] text-muted-foreground">Tests (YTD)</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.plans_without_test === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.plans_without_test === 0 ? "text-green-600" : "text-amber-600")}>
              {m.plans_without_test}
            </p>
            <p className="text-[10px] text-muted-foreground">Untested</p>
          </div>
        </div>

        {/* ── Plans by risk ──────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Active Plans
          </p>
          {DEMO_PLANS.map((p) => (
            <div key={p.title} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="truncate flex-1 font-medium">{p.title}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge className={cn("text-[10px]", riskColor[p.risk])}>{p.risk}</Badge>
                <Badge className={cn("text-[10px]", p.tested ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                  {p.tested ? "Tested" : "Untested"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent tests ───────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <FileCheck className="h-3 w-3 text-blue-500" />
            Recent Tests
          </p>
          {DEMO_RECENT_TESTS.map((t, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="truncate flex-1">{t.plan} — {t.type}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge className={cn("text-[10px]", outcomeColor[t.outcome])}>
                  {t.outcome === "partial_pass" ? "Partial" : t.outcome}
                </Badge>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Avg Recovery Target
            </span>
            <span className="font-bold tabular-nums text-blue-600">{m.avg_recovery_hours}h</span>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              BCP Alerts
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
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA BCP Intelligence
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
