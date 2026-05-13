"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — BEHAVIOUR SUPPORT INTELLIGENCE CARD
// Dashboard card for behaviour trends, PI analysis, de-escalation success,
// rewards/sanctions balance, and ARIA behaviour intelligence (Reg 19/20).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Shield, HandMetal, SmilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_SUMMARY = {
  totalEntries: 34,
  positiveCount: 18,
  concerningCount: 16,
  piCount: 3,
  deEscalationSuccessRate: 78.6,
  piInjuryRate: 0,
  piDebriefCompletionRate: 66.7,
  avgPIDuration: 4,
};

const CATEGORY_BREAKDOWN = {
  positive: 18,
  concerning: 5,
  escalating: 4,
  verbal_aggression: 3,
  aggression: 2,
  property_damage: 1,
  self_harm: 1,
};

const PI_ENTRIES = [
  { child: "Tyler R", date: "2026-05-10", technique: "Guide away", duration: "3 min", debriefed: true, injury: false },
  { child: "Alex W", date: "2026-05-08", technique: "Single elbow", duration: "5 min", debriefed: true, injury: false },
  { child: "Tyler R", date: "2026-05-03", technique: "Guide away", duration: "4 min", debriefed: false, injury: false },
];

const REWARDS_SANCTIONS = {
  totalRewards: 22,
  totalSanctions: 6,
  ratio: 78.6,
};

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "pi_without_debrief", severity: "high", message: "Tyler R — PI on 3 May has no debrief recorded. Complete debrief within 24 hours of incident." },
  { type: "escalating_behaviour", severity: "medium", message: "Tyler R has had 4 concerning/escalating entries in the last 7 days. Review behaviour support plan." },
];

const ARIA_INSIGHTS = [
  "De-escalation success rate at 78.6% — verbal reassurance and offering space are the most effective techniques for this cohort. Consider additional training on grounding techniques.",
  "Reward-to-sanction ratio is 3.7:1 (target 4:1). Tyler R receives more sanctions proportionally. Review whether his behaviour support plan rewards are aligned with his interests.",
  "Positive: Zero injuries from physical interventions this period. 53% of all behaviour entries are positive, indicating a strength-based approach. Reg 19 behaviour management standards well evidenced.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function BehaviourIntelligenceCard() {
  const s = DEMO_SUMMARY;
  const rs = REWARDS_SANCTIONS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            Behaviour Support
          </CardTitle>
          <Link href="/behaviour" className="text-xs text-brand hover:underline flex items-center gap-1">
            Behaviour <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">
              {Math.round((s.positiveCount / s.totalEntries) * 100)}%
            </p>
            <p className="text-[10px] text-muted-foreground">Positive</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: s.deEscalationSuccessRate >= 75 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", s.deEscalationSuccessRate >= 75 ? "text-green-600" : "text-amber-600")}>
              {s.deEscalationSuccessRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">De-escalation</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", s.piCount > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", s.piCount > 0 ? "text-amber-600" : "text-green-600")}>
              {s.piCount}
            </p>
            <p className="text-[10px] text-muted-foreground">PI Events</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", rs.ratio >= 75 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", rs.ratio >= 75 ? "text-green-600" : "text-amber-600")}>
              {rs.ratio}%
            </p>
            <p className="text-[10px] text-muted-foreground">Reward Ratio</p>
          </div>
        </div>

        {/* ── Category breakdown ──────────────────────────────────────── */}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Behaviour Categories</p>
          <div className="space-y-1">
            {Object.entries(CATEGORY_BREAKDOWN).map(([cat, count]) => {
              const pct = Math.round((count / s.totalEntries) * 100);
              return (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span className="w-28 text-muted-foreground capitalize">{cat.replace("_", " ")}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        cat === "positive" ? "bg-green-400" : cat === "self_harm" || cat === "aggression" ? "bg-red-400" : "bg-amber-400",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right tabular-nums font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PI events ──────────────────────────────────────────────── */}

        {PI_ENTRIES.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <HandMetal className="h-3 w-3" />
              Physical Interventions
            </p>
            {PI_ENTRIES.map((pi, i) => (
              <div key={i} className="rounded-lg border p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pi.child}</span>
                  <span className="text-muted-foreground">{pi.technique} · {pi.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pi.debriefed ? (
                    <Badge className="text-[10px] bg-green-100 text-green-700">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      Debriefed
                    </Badge>
                  ) : (
                    <Badge className="text-[10px] bg-red-100 text-red-700">
                      <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                      No debrief
                    </Badge>
                  )}
                  <span className="text-muted-foreground">{pi.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Rewards vs Sanctions ────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <SmilePlus className={cn("h-4 w-4", rs.ratio >= 75 ? "text-green-500" : "text-amber-500")} />
            <div>
              <p className="text-xs font-medium">Rewards vs Sanctions</p>
              <p className="text-[10px] text-muted-foreground">
                {rs.totalRewards} rewards · {rs.totalSanctions} sanctions
              </p>
            </div>
          </div>
          <Badge className={cn("text-[10px]", rs.ratio >= 75 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
            {(rs.totalRewards / Math.max(rs.totalSanctions, 1)).toFixed(1)}:1 ratio
          </Badge>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Behaviour Alerts
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
            ARIA Behaviour Intelligence
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
