"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — INCIDENT ANALYTICS CARD
// Dashboard widget showing incident trends, PI analysis, notification
// compliance, and ARIA pattern intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle, ChevronRight, TrendingDown, TrendingUp,
  Minus, Brain, Bell, Shield, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_SUMMARY = {
  total: 18,
  averagePerWeek: 4.5,
  trendDirection: "decreasing" as const,
  percentageChange: -15,
  bySeverity: {
    critical: 0,
    major: 2,
    moderate: 7,
    minor: 9,
  },
  topCategories: [
    { category: "Physical Intervention", count: 5 },
    { category: "Missing", count: 4 },
    { category: "Property Damage", count: 3 },
    { category: "Self-Harm", count: 2 },
  ],
  piAnalysis: {
    totalPI: 5,
    uniqueChildren: 3,
    avgDuration: 4.2,
    injuryRate: 0,
    debriefRate: 80,
    repeatChildren: [{ name: "Alex W", count: 3 }],
  },
  notifications: {
    required: 6,
    sent: 5,
    outstanding: 1,
    compliancePercentage: 83,
  },
};

const ARIA_PATTERNS = [
  {
    severity: "high" as const,
    message: "3 incidents involving Alex W within a 48-hour window (Mon 5th – Tue 6th). Pattern suggests environmental trigger — all occurred during evening transition periods.",
  },
  {
    severity: "info" as const,
    message: "PI incidents down 25% compared to previous month. De-escalation training completed by 4 staff members correlates with reduced use of physical intervention.",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_BAR: Record<string, string> = {
  critical: "bg-red-600",
  major: "bg-red-400",
  moderate: "bg-amber-400",
  minor: "bg-green-400",
};

const TREND_ICON: Record<string, typeof TrendingUp> = {
  increasing: TrendingUp,
  stable: Minus,
  decreasing: TrendingDown,
};

const TREND_COLOUR: Record<string, { text: string; bg: string }> = {
  increasing: { text: "text-red-600", bg: "bg-red-50" },
  stable: { text: "text-gray-600", bg: "bg-gray-50" },
  decreasing: { text: "text-green-600", bg: "bg-green-50" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function IncidentAnalyticsCard() {
  const s = DEMO_SUMMARY;
  const TrendIcon = TREND_ICON[s.trendDirection] ?? Minus;
  const tColour = TREND_COLOUR[s.trendDirection] ?? TREND_COLOUR.stable;
  const maxSev = Math.max(...Object.values(s.bySeverity), 1);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            Incident Analytics
          </CardTitle>
          <Link href="/incidents" className="text-xs text-brand hover:underline flex items-center gap-1">
            All Incidents <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Headline strip ───────────────────────────────────────────── */}

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <p className="text-lg font-bold tabular-nums">{s.total}</p>
            <p className="text-[10px] text-muted-foreground">This Month</p>
          </div>
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <p className="text-lg font-bold tabular-nums">{s.averagePerWeek}</p>
            <p className="text-[10px] text-muted-foreground">Per Week</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", tColour.bg)}>
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={cn("h-4 w-4", tColour.text)} />
              <span className={cn("text-sm font-bold", tColour.text)}>
                {Math.abs(s.percentageChange)}%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground capitalize">{s.trendDirection}</p>
          </div>
        </div>

        {/* ── Severity breakdown ───────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Severity</p>
          {(["critical", "major", "moderate", "minor"] as const).map((sev) => {
            const count = s.bySeverity[sev];
            const pct = (count / maxSev) * 100;
            return (
              <div key={sev} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-14 text-right capitalize">{sev}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", SEVERITY_BAR[sev])}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold tabular-nums w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* ── Top categories ───────────────────────────────────────────── */}

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Top Categories</p>
          {s.topCategories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between text-xs px-1">
              <span>{cat.category}</span>
              <span className="font-bold tabular-nums">{cat.count}</span>
            </div>
          ))}
        </div>

        {/* ── PI analysis ──────────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Shield className="h-3 w-3 text-brand" />
            Physical Interventions
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div>
              <p className="font-bold text-sm">{s.piAnalysis.totalPI}</p>
              <p className="text-muted-foreground">Total PIs</p>
            </div>
            <div>
              <p className="font-bold text-sm">{s.piAnalysis.avgDuration}m</p>
              <p className="text-muted-foreground">Avg Duration</p>
            </div>
            <div>
              <p className={cn("font-bold text-sm", s.piAnalysis.debriefRate >= 90 ? "text-green-600" : "text-amber-600")}>
                {s.piAnalysis.debriefRate}%
              </p>
              <p className="text-muted-foreground">Debriefed</p>
            </div>
          </div>
          {s.piAnalysis.repeatChildren.length > 0 && (
            <div className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Repeat PI: {s.piAnalysis.repeatChildren.map((c) => `${c.name} (${c.count}x)`).join(", ")}
            </div>
          )}
        </div>

        {/* ── Notification compliance ──────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Bell className={cn("h-4 w-4", s.notifications.outstanding > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">Notifications</p>
              <p className="text-[10px] text-muted-foreground">
                {s.notifications.sent}/{s.notifications.required} sent
              </p>
            </div>
          </div>
          <Badge className={cn(
            "text-[10px]",
            s.notifications.compliancePercentage >= 100
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700",
          )}>
            {s.notifications.outstanding > 0
              ? `${s.notifications.outstanding} outstanding`
              : "All sent"}
          </Badge>
        </div>

        {/* ── ARIA patterns ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Pattern Intelligence
          </p>
          {ARIA_PATTERNS.map((pattern, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                pattern.severity === "high"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-blue-200 bg-blue-50 text-blue-800",
              )}
            >
              {pattern.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
