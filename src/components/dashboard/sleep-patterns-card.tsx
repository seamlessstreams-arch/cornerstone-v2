"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SLEEP & WAKING NIGHT INTELLIGENCE CARD
// Dashboard card for sleep quality, night checks, disturbances,
// and ARIA sleep intelligence.
// CHR 2015 Reg 6 (quality of care — rest), Reg 9 (health — sleep),
// Reg 10 (dignity — bedtime routines). SCCIF: Children's Experiences.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Moon, ChevronRight, AlertTriangle, Brain,
  Clock, Eye, Zap, BedDouble,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  checks_this_week: 21,
  avg_checks_per_night: 3.0,
  env_compliance: 100,
  avg_sleep_quality: 3.8,
  avg_sleep_hours: 8.6,
  disturbances_this_week: 4,
  children_with_concerns: 1,
};

const DEMO_CHILDREN_SLEEP = [
  { name: "Child A", quality: "good", hours: 9.0, disturbances: 0 },
  { name: "Child B", quality: "fair", hours: 7.5, disturbances: 2 },
  { name: "Child C", quality: "good", hours: 9.2, disturbances: 0 },
  { name: "Child D", quality: "excellent", hours: 9.5, disturbances: 0 },
  { name: "Child E", quality: "fair", hours: 8.0, disturbances: 2 },
];

const DEMO_RECENT_CHECKS = [
  { date: "2026-05-12", time: "23:00", by: "Sarah M.", allSleeping: true },
  { date: "2026-05-12", time: "02:00", by: "Sarah M.", allSleeping: false },
  { date: "2026-05-12", time: "05:00", by: "Sarah M.", allSleeping: true },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "sleep_concern", severity: "medium", message: "Child B has had 3 nights of fair/poor sleep this week with anxiety-related disturbances. Consider discussing with CAMHS at next review." },
];

const ARIA_INSIGHTS = [
  "21 night checks this week across 7 nights (average 3.0 per night). Environment, security, and temperature all compliant at every check. All children accounted for at every check — no safeguarding concerns.",
  "Average sleep quality: 3.8/5. Average sleep duration: 8.6 hours. Child D consistently sleeps well (9.5hrs, excellent quality). Child B averaging 7.5 hours with 2 anxiety-related disturbances — below the recommended 8+ hours for their age group.",
  "Trend: overall sleep quality is stable. 4 disturbances this week (2 anxiety, 1 nightmare, 1 noise). Child E's sleep improved after bedtime routine adjustment last week. Recommend: (1) Monitor Child B's anxiety-related waking — consider warm milk/calm routine before bed. (2) Continue current night check frequency.",
];

const qualityColor: Record<string, string> = {
  excellent: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-amber-100 text-amber-700",
  poor: "bg-red-100 text-red-700",
  very_poor: "bg-red-100 text-red-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function SleepPatternsCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Moon className="h-4 w-4 text-brand" />
            Sleep &amp; Night Checks
          </CardTitle>
          <Link href="/sleep-patterns" className="text-xs text-brand hover:underline flex items-center gap-1">
            Records <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.checks_this_week}</p>
            <p className="text-[10px] text-muted-foreground">Checks (W)</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.avg_sleep_quality >= 3.5 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.avg_sleep_quality >= 3.5 ? "text-green-600" : "text-amber-600")}>
              {m.avg_sleep_quality}
            </p>
            <p className="text-[10px] text-muted-foreground">Quality /5</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.avg_sleep_hours}h</p>
            <p className="text-[10px] text-muted-foreground">Avg Hours</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.disturbances_this_week <= 5 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.disturbances_this_week <= 5 ? "text-green-600" : "text-amber-600")}>
              {m.disturbances_this_week}
            </p>
            <p className="text-[10px] text-muted-foreground">Disturb.</p>
          </div>
        </div>

        {/* ── Children's sleep ────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <BedDouble className="h-3 w-3" />
            Sleep This Week
          </p>
          {DEMO_CHILDREN_SLEEP.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded border p-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{c.name}</span>
                <Badge className={cn("text-[10px]", qualityColor[c.quality])}>
                  {c.quality}
                </Badge>
              </div>
              <div className="flex items-center gap-2 tabular-nums">
                <span className="text-muted-foreground">{c.hours}h</span>
                {c.disturbances > 0 && (
                  <span className="flex items-center gap-0.5 text-amber-600">
                    <Zap className="h-2.5 w-2.5" />
                    {c.disturbances}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent checks ───────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Eye className="h-3 w-3 text-blue-500" />
            Last Night&apos;s Checks
          </p>
          {DEMO_RECENT_CHECKS.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                <span className="tabular-nums">{c.time}</span>
                <span className="text-muted-foreground">— {c.by}</span>
              </div>
              <Badge className={cn("text-[10px]", c.allSleeping ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                {c.allSleeping ? "all sleeping" : "1 awake"}
              </Badge>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Sleep Alerts
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
            ARIA Sleep Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-green-200 bg-green-50 text-green-800"
                  : i === 1 ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-amber-200 bg-amber-50 text-amber-800",
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
