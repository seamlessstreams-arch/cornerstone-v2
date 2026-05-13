"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — THERAPEUTIC INTERVENTIONS INTELLIGENCE CARD
// Dashboard card for therapy tracking, engagement, progress, and referrals.
// CHR 2015 Reg 6/10/14. SCCIF: Experiences and Progress.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart, ChevronRight, AlertTriangle, Brain,
  TrendingUp, TrendingDown, Clock, Users,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  active_referrals: 6,
  children_in_therapy: 4,
  children_waiting: 1,
  sessions_attended: 28,
  attendance_rate: 87.5,
  avg_engagement: 4.2,
  children_progressing: 3,
  children_regressing: 1,
  avg_waiting_days: 18,
};

const DEMO_CHILDREN = [
  { name: "Child A", therapy: "Play Therapy", sessions: 8, engagement: "Fully Engaged", progress: "some_progress" },
  { name: "Child B", therapy: "CBT", sessions: 12, engagement: "Fully Engaged", progress: "significant_progress" },
  { name: "Child C", therapy: "EMDR", sessions: 4, engagement: "Partially Engaged", progress: "stable" },
  { name: "Child D", therapy: "Art Therapy", sessions: 6, engagement: "Reluctant", progress: "some_regression" },
];

const DEMO_WAITING = [
  { name: "Child E", therapy: "Family Therapy", waitingDays: 22, provider: "CAMHS" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "some_regression", severity: "medium", message: "Child D showing some regression in Art Therapy — discuss therapeutic approach with therapist." },
  { type: "engagement_reluctant", severity: "medium", message: "Child D reluctant in recent sessions — explore barriers, consider adapting the environment." },
];

const ARIA_INSIGHTS = [
  "4 children actively in therapy across 4 modalities (Play, CBT, EMDR, Art). 28 sessions attended with 87.5% attendance rate. Average engagement score: 4.2/5 — strong overall. 3 children are progressing, 1 showing some regression.",
  "Focus: Child D's regression in Art Therapy coincides with increased contact with birth family. Recommend discussing with therapist whether current modality remains appropriate. Child E has been waiting 22 days for Family Therapy via CAMHS — chase referral this week.",
  "Positive: Child B has made significant progress in CBT over 12 sessions — therapist recommends reducing to fortnightly. Child A engaging well with Play Therapy — life story work goals being addressed. All therapy goals are aligned with care plans and reviewed at LAC reviews.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const PROGRESS_LABELS: Record<string, { label: string; color: string }> = {
  significant_progress: { label: "Significant", color: "text-green-700 bg-green-50 border-green-200" },
  some_progress: { label: "Some Progress", color: "text-blue-700 bg-blue-50 border-blue-200" },
  stable: { label: "Stable", color: "text-gray-700 bg-gray-50 border-gray-200" },
  some_regression: { label: "Regression", color: "text-amber-700 bg-amber-50 border-amber-200" },
  significant_regression: { label: "Sig. Regression", color: "text-red-700 bg-red-50 border-red-200" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function TherapeuticInterventionsCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand" />
            Therapeutic Interventions
          </CardTitle>
          <Link href="/therapeutic-interventions" className="text-xs text-brand hover:underline flex items-center gap-1">
            Therapy <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.children_in_therapy}</p>
            <p className="text-[10px] text-muted-foreground">In Therapy</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.attendance_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.attendance_rate >= 80 ? "text-green-600" : "text-amber-600")}>
              {m.attendance_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.children_progressing}</p>
            <p className="text-[10px] text-muted-foreground">Progressing</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.children_waiting === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_waiting === 0 ? "text-green-600" : "text-amber-600")}>
              {m.children_waiting}
            </p>
            <p className="text-[10px] text-muted-foreground">Waiting</p>
          </div>
        </div>

        {/* ── Children in therapy ─────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Active Therapy
          </p>
          <div className="space-y-1">
            {DEMO_CHILDREN.map((c) => {
              const progress = PROGRESS_LABELS[c.progress] ?? PROGRESS_LABELS.stable;
              return (
                <div key={c.name} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{c.therapy}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-1">
                    <span className="tabular-nums text-muted-foreground">{c.sessions} sessions</span>
                    <Badge variant="outline" className={cn("text-[10px]", progress.color)}>
                      {c.progress === "some_progress" || c.progress === "significant_progress" ? (
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                      ) : c.progress === "some_regression" || c.progress === "significant_regression" ? (
                        <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                      ) : null}
                      {progress.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Waiting list ───────────────────────────────────────────── */}

        {DEMO_WAITING.length > 0 && (
          <div className="rounded-lg border p-3 space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              Waiting for Therapy
            </p>
            {DEMO_WAITING.map((w) => (
              <div key={w.name} className="flex items-center justify-between text-xs">
                <span className="truncate flex-1">{w.name} — {w.therapy} ({w.provider})</span>
                <span className="text-amber-600 font-semibold shrink-0 ml-1">{w.waitingDays} days</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Therapy Alerts
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
            ARIA Therapeutic Intelligence
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
