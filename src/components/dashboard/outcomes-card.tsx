"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — YOUNG PERSON OUTCOMES INTELLIGENCE CARD
// Dashboard card for Every Child Matters outcomes tracking, domain progress,
// achievement rates, and ARIA outcome intelligence.
// Reg 7–14, SCCIF Overall Experiences & Progress.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target, ChevronRight, AlertTriangle, TrendingUp,
  TrendingDown, Brain, Heart, ShieldCheck,
  BookOpen, Users, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_HOME_OUTCOMES = {
  total_children: 6,
  total_active_targets: 24,
  total_achieved: 8,
  overall_achievement_rate: 25,
  children_improving: 4,
  children_stable: 1,
  children_declining: 1,
};

const DEMO_DOMAIN_PROGRESS = [
  { domain: "be_healthy", label: "Be Healthy", icon: Heart, avg_progress: 50, targets: 6, color: "text-red-500" },
  { domain: "stay_safe", label: "Stay Safe", icon: ShieldCheck, avg_progress: 67, targets: 5, color: "text-blue-500" },
  { domain: "enjoy_achieve", label: "Enjoy & Achieve", icon: BookOpen, avg_progress: 40, targets: 5, color: "text-purple-500" },
  { domain: "positive_contribution", label: "Positive Contribution", icon: Users, avg_progress: 33, targets: 4, color: "text-green-500" },
  { domain: "economic_wellbeing", label: "Economic Wellbeing", icon: Wallet, avg_progress: 25, targets: 4, color: "text-amber-500" },
];

const DEMO_ALERTS: { type: string; severity: "high" | "medium" | "low"; message: string; child_name?: string }[] = [
  { type: "declining_outcomes", severity: "high", message: "Jayden has 2 outcomes declining below baseline — urgent review recommended", child_name: "Jayden" },
  { type: "overdue_review", severity: "medium", message: "Outcome target \"Improve school attendance\" for Amara was due for review on 2026-04-15" },
  { type: "low_achievement", severity: "medium", message: "Economic Wellbeing domain has 0% achievement rate across 4 active targets" },
];

const ARIA_INSIGHTS = [
  "1 child is declining across 2 outcome domains (Be Healthy, Stay Safe). Schedule an urgent LAC review and update care plan targets. Review key worker sessions for missed early indicators.",
  "Economic Wellbeing has the weakest progress at 25%. Consider adding pathway plan activities, budgeting workshops, and employment taster sessions. Link to life-skills assessments for evidence.",
  "Positive trend: 4 of 6 children are improving. 8 targets achieved this period. Stay Safe domain leads at 67% progress — evidence safeguarding and placement stability are working well.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function OutcomesCard() {
  const h = DEMO_HOME_OUTCOMES;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-brand" />
            Young Person Outcomes
          </CardTitle>
          <Link href="/outcomes" className="text-xs text-brand hover:underline flex items-center gap-1">
            Outcomes <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {h.total_active_targets}
            </p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">
              {h.total_achieved}
            </p>
            <p className="text-[10px] text-muted-foreground">Achieved</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", h.overall_achievement_rate >= 40 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", h.overall_achievement_rate >= 40 ? "text-green-600" : "text-amber-600")}>
              {h.overall_achievement_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Achievement</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-purple-50">
            <p className="text-lg font-bold tabular-nums text-purple-600">
              {h.total_children}
            </p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
        </div>

        {/* ── Children trend ──────────────────────────────────────────── */}

        <div className="flex items-center justify-between text-xs border rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-green-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-medium">{h.children_improving} improving</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="font-medium">{h.children_stable} stable</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-600">
            <TrendingDown className="h-3.5 w-3.5" />
            <span className="font-medium">{h.children_declining} declining</span>
          </div>
        </div>

        {/* ── Domain progress ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">ECM Domain Progress</p>
          {DEMO_DOMAIN_PROGRESS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.domain} className="flex items-center gap-2 text-xs">
                <Icon className={cn("h-3.5 w-3.5 shrink-0", d.color)} />
                <span className="w-28 truncate">{d.label}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      d.avg_progress >= 60 ? "bg-green-400"
                        : d.avg_progress >= 40 ? "bg-amber-400"
                        : "bg-red-400",
                    )}
                    style={{ width: `${d.avg_progress}%` }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums font-medium">{d.avg_progress}%</span>
                <Badge variant="outline" className="text-[10px] tabular-nums">{d.targets}</Badge>
              </div>
            );
          })}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Outcome Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "high"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : alert.severity === "medium"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-blue-200 bg-blue-50 text-blue-800",
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
            ARIA Outcomes Intelligence
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
