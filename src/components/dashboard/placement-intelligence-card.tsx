"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PLACEMENT & CARE PLANNING INTELLIGENCE CARD
// Dashboard card for placement plan compliance, LAC review tracking,
// objectives progress, and ARIA care planning intelligence (Reg 11/12/14).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Target, Calendar, ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalPlans: 12,
  activePlans: 10,
  draftPlans: 2,
  overdueReviews: 1,
  completionRate: 80,
  objectivesMetRate: 62.5,
  avgSectionsComplete: 78.3,
};

const CHILDREN_PLANS = [
  {
    name: "Alex W",
    plans: [
      { type: "Placement Plan", status: "active", nextReview: "2026-05-28", complete: 12, total: 13 },
      { type: "Care Plan", status: "active", nextReview: "2026-08-15", complete: 10, total: 13 },
      { type: "Behaviour Support", status: "active", nextReview: "2026-06-10", complete: 8, total: 10 },
    ],
  },
  {
    name: "Tyler R",
    plans: [
      { type: "Placement Plan", status: "active", nextReview: "2026-05-20", complete: 11, total: 13 },
      { type: "Care Plan", status: "active", nextReview: "2026-09-01", complete: 13, total: 13 },
      { type: "Missing Protocol", status: "active", nextReview: "2026-06-15", complete: 6, total: 8 },
    ],
  },
];

const LAC_REVIEW_STATUS = {
  completedThisQuarter: 3,
  scheduled: 1,
  childParticipationRate: 100,
  actionCompletionRate: 75,
  overdueActions: 2,
};

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "review_overdue", severity: "high", message: "Tyler R — Placement Plan review overdue (due 20 May). Schedule review with social worker and key worker." },
  { type: "action_overdue", severity: "medium", message: "2 LAC review actions overdue. Review and update action tracker." },
];

const ARIA_INSIGHTS = [
  "Tyler R's placement plan review is 1 week overdue. The plan was last reviewed 8 weeks ago. Reg 12 requires regular review — schedule urgently with the placing authority.",
  "Alex W has achieved 5 of 8 care plan objectives. 2 objectives are in progress (education targets). Consider updating targets at the next LAC review to reflect current progress.",
  "Positive: 100% child participation in LAC reviews this quarter. All 4 children have active placement plans. 80% plan completion rate exceeds the 70% target. Reg 11/12 compliance is strong.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function PlacementIntelligenceCard() {
  const c = DEMO_COMPLIANCE;
  const lac = LAC_REVIEW_STATUS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            Placement & Care Planning
          </CardTitle>
          <Link href="/placement" className="text-xs text-brand hover:underline flex items-center gap-1">
            Plans <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: c.completionRate >= 75 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.completionRate >= 75 ? "text-green-600" : "text-amber-600")}>
              {c.completionRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Plans Complete</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.objectivesMetRate >= 60 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.objectivesMetRate >= 60 ? "text-green-600" : "text-amber-600")}>
              {c.objectivesMetRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Objectives Met</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.overdueReviews > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.overdueReviews > 0 ? "text-amber-600" : "text-green-600")}>
              {c.overdueReviews}
            </p>
            <p className="text-[10px] text-muted-foreground">Reviews Due</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.draftPlans > 0 ? "bg-blue-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.draftPlans > 0 ? "text-blue-600" : "text-green-600")}>
              {c.draftPlans}
            </p>
            <p className="text-[10px] text-muted-foreground">Drafts</p>
          </div>
        </div>

        {/* ── LAC review bar ──────────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Calendar className={cn("h-4 w-4", lac.overdueActions > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">LAC Reviews</p>
              <p className="text-[10px] text-muted-foreground">
                {lac.completedThisQuarter} completed · {lac.scheduled} scheduled · {lac.childParticipationRate}% participation
              </p>
            </div>
          </div>
          {lac.overdueActions > 0 ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              {lac.overdueActions} actions overdue
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              On track
            </Badge>
          )}
        </div>

        {/* ── Children's plans ────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3" />
            Active Plans by Child
          </p>
          {CHILDREN_PLANS.map((child, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-1.5 text-xs">
              <p className="font-medium">{child.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {child.plans.map((plan, j) => (
                  <div key={j} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px] gap-0.5">
                      <ClipboardCheck className="h-2.5 w-2.5" />
                      {plan.type}
                    </Badge>
                    <span className={cn(
                      "text-[10px] tabular-nums",
                      plan.complete === plan.total ? "text-green-600" : "text-muted-foreground",
                    )}>
                      {plan.complete}/{plan.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Planning Alerts
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
            ARIA Planning Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-red-200 bg-red-50 text-red-800"
                  : i === 1 ? "border-blue-200 bg-blue-50 text-blue-800"
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
