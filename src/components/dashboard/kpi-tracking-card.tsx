"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — KPI TRACKING INTELLIGENCE CARD
// Dashboard card for key performance indicators, targets, trends,
// and ARIA performance intelligence.
// CHR 2015 Reg 45/35. SCCIF: Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, ChevronRight, AlertTriangle, Brain,
  Target, TrendingUp, TrendingDown, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_kpis: 24,
  on_target: 16,
  above_target: 4,
  below_target: 3,
  at_risk: 1,
  on_target_rate: 83.3,
  improving: 8,
  declining: 2,
};

const DEMO_BY_DOMAIN = [
  { domain: "Safeguarding", total: 4, onTarget: 4 },
  { domain: "Health", total: 3, onTarget: 3 },
  { domain: "Education", total: 3, onTarget: 2 },
  { domain: "Behaviour", total: 2, onTarget: 2 },
  { domain: "Staffing", total: 4, onTarget: 3 },
  { domain: "Compliance", total: 4, onTarget: 4 },
  { domain: "Participation", total: 2, onTarget: 2 },
  { domain: "Finance", total: 2, onTarget: 1 },
];

const DEMO_DECLINING = [
  { name: "Education attendance rate", value: 88, target: 95, trend: "declining" },
  { name: "Agency staff usage", value: 18, target: 10, trend: "declining" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "at_risk", severity: "high", message: "Agency staff usage at 18% — target is below 10%. Rising trend over 3 months. Review recruitment strategy." },
];

const ARIA_INSIGHTS = [
  "24 KPIs tracked across 8 domains. 83.3% on or above target (20/24). 8 KPIs improving, 2 declining. Strongest domains: safeguarding (4/4), health (3/3), compliance (4/4). All critical safety KPIs are green.",
  "Focus areas: (1) Education attendance at 88% vs 95% target — 1 child's persistent absence is driving this down, PEP meeting scheduled. (2) Agency staff usage rising to 18% vs 10% target — 2 vacancies currently being recruited. Finance budget adherence at 94% vs 98% — additional agency costs contributing.",
  "Trend: overall KPI performance has improved from 75% to 83.3% over the last quarter. 3 KPIs moved from below target to on target this quarter (medication compliance, supervision completion, participation rate). Recommend focusing on the 2 declining KPIs before Reg 45 review next month.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function KpiTrackingCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand" />
            Key Performance Indicators
          </CardTitle>
          <Link href="/kpi-tracking" className="text-xs text-brand hover:underline flex items-center gap-1">
            KPIs <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.on_target_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.on_target_rate >= 80 ? "text-green-600" : "text-amber-600")}>
              {m.on_target_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">On Target</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.on_target + m.above_target}</p>
            <p className="text-[10px] text-muted-foreground">Green</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.at_risk === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.at_risk === 0 ? "text-green-600" : "text-red-600")}>
              {m.below_target + m.at_risk}
            </p>
            <p className="text-[10px] text-muted-foreground">Below/Risk</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.improving}</p>
            <p className="text-[10px] text-muted-foreground">Improving</p>
          </div>
        </div>

        {/* ── Domain performance ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3" />
            Performance by Domain
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_BY_DOMAIN.map((d) => (
              <div key={d.domain} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate flex-1">{d.domain}</span>
                <span className={cn("font-bold tabular-nums ml-1",
                  d.onTarget === d.total ? "text-green-600" : d.onTarget >= d.total * 0.7 ? "text-blue-600" : "text-amber-600"
                )}>
                  {d.onTarget}/{d.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Declining KPIs ──────────────────────────────────────────── */}

        {DEMO_DECLINING.length > 0 && (
          <div className="rounded-lg border p-3 space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              Declining KPIs
            </p>
            {DEMO_DECLINING.map((k) => (
              <div key={k.name} className="flex items-center justify-between text-xs">
                <span className="truncate flex-1">{k.name}</span>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <span className="tabular-nums text-red-600 font-semibold">{k.value}%</span>
                  <span className="text-muted-foreground">/ {k.target}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              KPI Alerts
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

        {/* ── ARIA insights ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Performance Intelligence
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
