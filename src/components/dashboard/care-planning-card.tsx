"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CARE PLANNING INTELLIGENCE CARD
// Dashboard card for care plans, reviews, objectives, and statutory compliance.
// CHR 2015 Reg 14/6. SCCIF: Experiences and Progress.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList, ChevronRight, AlertTriangle, Brain,
  Target, Calendar, CheckCircle2, Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_plans: 28,
  current_plans: 22,
  overdue_reviews: 1,
  reviews_due_soon: 3,
  plan_coverage_rate: 100,
  total_objectives: 45,
  objectives_completed: 18,
  objectives_at_risk: 3,
  objective_completion_rate: 40,
  reviews_this_quarter: 12,
  child_participation_rate: 91.7,
};

const DEMO_CHILDREN_PLANS = [
  { name: "Child A", plans: 6, reviewDue: "2026-05-28", overdue: false, objectivesAtRisk: 1 },
  { name: "Child B", plans: 5, reviewDue: "2026-06-02", overdue: false, objectivesAtRisk: 0 },
  { name: "Child C", plans: 6, reviewDue: "2026-05-10", overdue: true, objectivesAtRisk: 2 },
  { name: "Child D", plans: 5, reviewDue: "2026-06-15", overdue: false, objectivesAtRisk: 0 },
  { name: "Child E", plans: 6, reviewDue: "2026-05-22", overdue: false, objectivesAtRisk: 0 },
];

const DEMO_UPCOMING_REVIEWS = [
  { child: "Child E", type: "LAC Review", date: "2026-05-22", daysUntil: 9 },
  { child: "Child A", type: "PEP Review", date: "2026-05-28", daysUntil: 15 },
  { child: "Child B", type: "Placement Plan Review", date: "2026-06-02", daysUntil: 20 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "review_overdue", severity: "high", message: "Child C's Care Plan review is 3 days overdue — contact IRO to reschedule urgently." },
  { type: "objective_at_risk", severity: "high", message: "Child C has 2 care plan objectives at risk — behaviour support plan targets not being met." },
];

const ARIA_INSIGHTS = [
  "28 active plans across 5 children (100% coverage). 22 current, 1 overdue review. 45 objectives tracked — 18 completed (40%), 3 at risk. 12 reviews completed this quarter with 91.7% child participation rate.",
  "Priority: Child C's care plan review is overdue and 2 objectives are at risk. Key worker reports increased dysregulation linked to contact arrangements. Social worker meeting requested. Child E's LAC review is in 9 days — ensure all reports are submitted by Friday.",
  "Positive: all children have comprehensive plan sets covering placement, education, health, and behaviour. Child participation rate at 91.7% — above target. Recommend standardising the objective-setting process so targets are SMART and consistently measurable across all plans.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function CarePlanningCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-brand" />
            Care Planning
          </CardTitle>
          <Link href="/care-planning" className="text-xs text-brand hover:underline flex items-center gap-1">
            Plans <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.plan_coverage_rate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.plan_coverage_rate >= 100 ? "text-green-600" : "text-red-600")}>
              {m.plan_coverage_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_reviews === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_reviews === 0 ? "text-green-600" : "text-red-600")}>
              {m.overdue_reviews}
            </p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.objectives_at_risk === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.objectives_at_risk === 0 ? "text-green-600" : "text-amber-600")}>
              {m.objectives_at_risk}
            </p>
            <p className="text-[10px] text-muted-foreground">At Risk</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.reviews_this_quarter}</p>
            <p className="text-[10px] text-muted-foreground">Reviews</p>
          </div>
        </div>

        {/* ── Children plan overview ─────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Plans by Child
          </p>
          <div className="space-y-1">
            {DEMO_CHILDREN_PLANS.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded border p-2 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.plans} plans</span>
                  {c.objectivesAtRisk > 0 && (
                    <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700 bg-amber-50">
                      {c.objectivesAtRisk} at risk
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {c.overdue ? (
                    <Badge variant="outline" className="text-[10px] border-red-200 text-red-700 bg-red-50">
                      <AlertTriangle className="h-2.5 w-2.5 mr-0.5" /> Overdue
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-0.5" />{c.reviewDue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upcoming reviews ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-blue-500" />
            Upcoming Reviews
          </p>
          {DEMO_UPCOMING_REVIEWS.map((r) => (
            <div key={`${r.child}-${r.type}`} className="flex items-center justify-between text-xs">
              <span className="truncate flex-1">{r.child} — {r.type}</span>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <span className="text-muted-foreground">{r.date}</span>
                <Badge variant="outline" className={cn("text-[10px]",
                  r.daysUntil <= 7 ? "border-amber-200 text-amber-700 bg-amber-50" : "border-blue-200 text-blue-700 bg-blue-50"
                )}>
                  {r.daysUntil}d
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Objectives progress ────────────────────────────────────── */}

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded border p-2">
            <p className="text-sm font-bold tabular-nums text-green-600">{m.objectives_completed}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5" /> Completed
            </p>
          </div>
          <div className="text-center rounded border p-2">
            <p className="text-sm font-bold tabular-nums text-blue-600">{m.total_objectives - m.objectives_completed}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <Target className="h-2.5 w-2.5" /> Active
            </p>
          </div>
          <div className="text-center rounded border p-2">
            <p className={cn("text-sm font-bold tabular-nums", m.child_participation_rate >= 80 ? "text-green-600" : "text-amber-600")}>
              {m.child_participation_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <Users className="h-2.5 w-2.5" /> Participation
            </p>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Care Plan Alerts
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
            ARIA Care Planning Intelligence
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
