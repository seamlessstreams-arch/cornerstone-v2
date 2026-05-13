"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — TRANSITION PLANNING INTELLIGENCE CARD
// Dashboard card for children's transitions, readiness tracking, goals,
// and ARIA transition intelligence.
// CHR 2015 Reg 12 (preparing children), Reg 36 (notification),
// Reg 14 (care planning). SCCIF Helped & Protected / Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightLeft, ChevronRight, AlertTriangle, Brain,
  Target, CheckCircle2, UserCheck, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  active_transitions: 1,
  planned_transitions: 1,
  completed_this_year: 2,
  avg_readiness: 2.8,
  goals_on_track: 75,
  child_views_sought: 100,
};

const DEMO_TRANSITIONS = [
  { child: "Child B", type: "Semi-Independent", status: "in_progress", planned: "2026-07-01", readiness: "developing" },
  { child: "Child D", type: "Reunification", status: "planned", planned: "2026-09-15", readiness: "mostly_ready" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "low_readiness", severity: "medium", message: "Child B has 3 areas rated 'not ready' for semi-independent living transition. Financial capability, practical skills, and independent living need focused support before July move." },
];

const ARIA_INSIGHTS = [
  "Child B's transition to semi-independent living (planned July 2026) is in progress. Readiness assessment shows 'developing' overall — strong emotional readiness and social networks, but gaps in financial capability and practical skills. 4/6 goals on track. Key worker sessions focused on cooking and budgeting skills.",
  "Child D's reunification with family (planned September 2026) — mostly ready across all areas. Family contact has been increasing from fortnightly to weekly. Social worker supportive. All notifications completed. Follow-up plan includes 6-week post-move welfare checks.",
  "2 transitions completed this year: Child C (foster care, February) and Child A (step-down, April). Both handovers completed with records transferred. Child C's follow-up confirmed positive adjustment. Child views sought for all transitions — 100% compliance with Reg 7.",
];

const readinessColor: Record<string, string> = {
  not_ready: "bg-red-100 text-red-700",
  developing: "bg-amber-100 text-amber-700",
  mostly_ready: "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function TransitionPlanningCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-brand" />
            Transition Planning
          </CardTitle>
          <Link href="/transition-planning" className="text-xs text-brand hover:underline flex items-center gap-1">
            Plans <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.active_transitions}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.planned_transitions}</p>
            <p className="text-[10px] text-muted-foreground">Planned</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.goals_on_track}%</p>
            <p className="text-[10px] text-muted-foreground">Goals On Track</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_views_sought === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_views_sought === 100 ? "text-green-600" : "text-amber-600")}>
              {m.child_views_sought}%
            </p>
            <p className="text-[10px] text-muted-foreground">Views Sought</p>
          </div>
        </div>

        {/* ── Active transitions ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3" />
            Current Transitions
          </p>
          {DEMO_TRANSITIONS.map((t) => (
            <div key={t.child} className="rounded border p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.child}</span>
                <Badge className={cn("text-[10px]", readinessColor[t.readiness])}>
                  {t.readiness.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{t.type}</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {new Date(t.planned).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Readiness overview ──────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-blue-500" />
            Readiness & Compliance
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">{m.avg_readiness.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">Avg Readiness /4</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-green-600">{m.completed_this_year}</p>
              <p className="text-[10px] text-muted-foreground">Completed (YTD)</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">
                <UserCheck className="h-4 w-4 mx-auto text-green-500" />
              </p>
              <p className="text-[10px] text-muted-foreground">All Views Sought</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Transition Alerts
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
            ARIA Transition Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-amber-200 bg-amber-50 text-amber-800"
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
