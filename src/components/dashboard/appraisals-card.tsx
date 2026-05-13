"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF APPRAISAL INTELLIGENCE CARD
// Dashboard card for appraisal compliance, performance ratings, fitness
// confirmation, goal tracking, and ARIA workforce intelligence.
// CHR 2015 Reg 32 (fitness of workers), Reg 33 (employment of staff).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Target, UserCheck, Star, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  total_appraisals: 12,
  completed: 9,
  overdue: 2,
  scheduled: 1,
  compliance_rate: 75,
  staff_without_appraisal: 3,
  avg_rating: 2.89,
  fitness_confirmed_rate: 89,
};

const DEMO_GOALS = {
  total: 18,
  active: 10,
  achieved: 5,
  overdue: 3,
  achievement_rate: 33,
};

const DEMO_RATING_BREAKDOWN = [
  { rating: "Outstanding", count: 2, color: "bg-green-400" },
  { rating: "Good", count: 5, color: "bg-blue-400" },
  { rating: "Requires Improvement", count: 1, color: "bg-amber-400" },
  { rating: "Inadequate", count: 1, color: "bg-red-400" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "overdue_appraisal", severity: "high", message: "2 staff appraisals overdue — Reg 33 requires regular appraisal of staff fitness and performance." },
  { type: "fitness_not_confirmed", severity: "high", message: "1 completed appraisal has not confirmed fitness to work with children (Reg 32)." },
  { type: "overdue_goals", severity: "medium", message: "3 performance goals are overdue across staff team." },
];

const ARIA_INSIGHTS = [
  "2 overdue appraisals (both annual reviews). Cross-reference with supervision records — if supervision is also overdue for these staff, this indicates a wider Reg 33 compliance gap that Ofsted will scrutinise under leadership & management.",
  "1 staff member rated 'Inadequate' — check whether a performance improvement plan has been created and linked to additional training. PIP should have specific, time-bound objectives with fortnightly review.",
  "75% appraisal compliance rate. 89% fitness confirmation rate among completed appraisals. 3 staff have no appraisal on record — prioritise these for the next scheduling round. Average rating 2.89/4 suggests broadly 'Good' workforce performance.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function AppraisalsCard() {
  const c = DEMO_COMPLIANCE;
  const g = DEMO_GOALS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-brand" />
            Staff Appraisals
          </CardTitle>
          <Link href="/appraisals" className="text-xs text-brand hover:underline flex items-center gap-1">
            Appraisals <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", c.compliance_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.compliance_rate >= 90 ? "text-green-600" : "text-amber-600")}>
              {c.compliance_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Compliance</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {c.completed}/{c.total_appraisals}
            </p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.overdue === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.overdue === 0 ? "text-green-600" : "text-red-600")}>
              {c.overdue}
            </p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.fitness_confirmed_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.fitness_confirmed_rate >= 100 ? "text-green-600" : "text-amber-600")}>
              {c.fitness_confirmed_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Fitness</p>
          </div>
        </div>

        {/* ── Rating breakdown ────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3" />
            Performance Ratings
          </p>
          <div className="flex items-center gap-1 h-4 rounded-full overflow-hidden">
            {DEMO_RATING_BREAKDOWN.map((r) => (
              <div
                key={r.rating}
                className={cn("h-full", r.color)}
                style={{ width: `${(r.count / c.completed) * 100}%` }}
                title={`${r.rating}: ${r.count}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {DEMO_RATING_BREAKDOWN.map((r) => (
              <div key={r.rating} className="flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full", r.color)} />
                <span>{r.rating}: {r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Goal progress ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3" />
            Performance Goals
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums">{g.active}</p>
              <p className="text-[10px] text-muted-foreground">Active</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-green-600">{g.achieved}</p>
              <p className="text-[10px] text-muted-foreground">Achieved</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className={cn("text-sm font-bold tabular-nums", g.overdue > 0 ? "text-red-600" : "text-gray-600")}>{g.overdue}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums">{g.achievement_rate}%</p>
              <p className="text-[10px] text-muted-foreground">Rate</p>
            </div>
          </div>
        </div>

        {/* ── Key indicators ──────────────────────────────────────────── */}

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded border p-2.5 text-xs">
            <UserCheck className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <p className="font-medium">{c.staff_without_appraisal} staff</p>
              <p className="text-[10px] text-muted-foreground">no appraisal on record</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded border p-2.5 text-xs">
            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <p className="font-medium">{c.scheduled} scheduled</p>
              <p className="text-[10px] text-muted-foreground">upcoming appraisals</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Appraisal Alerts
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
            ARIA Workforce Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-red-200 bg-red-50 text-red-800"
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
