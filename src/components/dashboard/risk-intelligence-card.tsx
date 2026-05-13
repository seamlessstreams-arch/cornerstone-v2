"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — RISK INTELLIGENCE CARD
// Dashboard card showing overall risk profile, high-risk children,
// overdue reviews, and ARIA risk pattern alerts.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert, ChevronRight, AlertTriangle, TrendingDown,
  TrendingUp, Brain, User, Calendar, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_RISK_PROFILE = {
  totalAssessments: 28,
  active: 22,
  byLevel: {
    very_high: 1,
    high: 4,
    medium: 9,
    low: 6,
    very_low: 2,
  },
  needsImmediateReview: 5,
  overallRiskLevel: "medium" as const,
  trendDirection: "improving" as const,
};

const HIGH_RISK_CHILDREN = [
  { name: "Alex W", riskLevel: "very_high", activeRisks: 4, categories: ["Self-Harm", "Absconding", "Exploitation"] },
  { name: "Tyler R", riskLevel: "high", activeRisks: 3, categories: ["Violence", "Substance Misuse"] },
  { name: "Jayden W", riskLevel: "high", activeRisks: 2, categories: ["Online Safety", "Bullying"] },
];

const OVERDUE_REVIEWS = [
  { title: "Alex W — Self-Harm Assessment", daysOverdue: 8 },
  { title: "Environmental — Fire Risk", daysOverdue: 3 },
];

const ARIA_INSIGHTS = [
  "Alex W's self-harm risk assessment is 8 days overdue for review. Recent daily logs mention increased emotional dysregulation — recommend urgent reassessment.",
  "Exploitation risk scores across 3 children have decreased following targeted intervention work. Consider updating assessments to reflect reduced risk.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_COLOURS: Record<string, string> = {
  very_high: "bg-red-600 text-white",
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
  very_low: "bg-green-50 text-green-600",
};

const LEVEL_BAR: Record<string, string> = {
  very_high: "bg-red-600",
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-green-400",
  very_low: "bg-green-300",
};

const TREND_ICON: Record<string, typeof TrendingUp> = {
  improving: TrendingDown,
  stable: Minus,
  deteriorating: TrendingUp,
};

const TREND_COLOUR: Record<string, string> = {
  improving: "text-green-600",
  stable: "text-gray-500",
  deteriorating: "text-red-600",
};

// ── Component ────────────────────────────────────────────────────────────────

export function RiskIntelligenceCard() {
  const profile = DEMO_RISK_PROFILE;
  const TrendIcon = TREND_ICON[profile.trendDirection] ?? Minus;
  const maxLevel = Math.max(...Object.values(profile.byLevel), 1);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand" />
            Risk Intelligence
          </CardTitle>
          <Link href="/risk-register" className="text-xs text-brand hover:underline flex items-center gap-1">
            Risk Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <p className="text-lg font-bold tabular-nums">{profile.active}</p>
            <p className="text-[10px] text-muted-foreground">Active Risks</p>
          </div>
          <div className="text-center rounded-lg p-2.5" style={{ background: "hsl(var(--destructive) / 0.08)" }}>
            <p className="text-lg font-bold tabular-nums text-red-600">{profile.needsImmediateReview}</p>
            <p className="text-[10px] text-muted-foreground">Need Review</p>
          </div>
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <div className="flex items-center justify-center gap-1">
              <TrendIcon className={cn("h-4 w-4", TREND_COLOUR[profile.trendDirection])} />
              <span className={cn("text-xs font-bold capitalize", TREND_COLOUR[profile.trendDirection])}>
                {profile.trendDirection}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Trend</p>
          </div>
        </div>

        {/* ── Risk level distribution ──────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Risk Distribution</p>
          {(["very_high", "high", "medium", "low", "very_low"] as const).map((level) => {
            const count = profile.byLevel[level];
            const pct = (count / maxLevel) * 100;
            return (
              <div key={level} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-16 text-right capitalize">
                  {level.replace("_", " ")}
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", LEVEL_BAR[level])}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold tabular-nums w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* ── High-risk children ───────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
            <User className="h-3 w-3" />
            Highest Risk Children
          </p>
          {HIGH_RISK_CHILDREN.map((child, i) => (
            <div key={i} className="flex items-center justify-between rounded border p-2.5 text-xs">
              <div className="min-w-0">
                <span className="font-medium">{child.name}</span>
                <span className="text-muted-foreground ml-1">({child.activeRisks} risks)</span>
                <p className="text-[10px] text-muted-foreground truncate">
                  {child.categories.join(", ")}
                </p>
              </div>
              <Badge className={cn("text-[10px] flex-shrink-0 capitalize", LEVEL_COLOURS[child.riskLevel])}>
                {child.riskLevel.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>

        {/* ── Overdue reviews ──────────────────────────────────────────── */}

        {OVERDUE_REVIEWS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Overdue Reviews
            </p>
            {OVERDUE_REVIEWS.map((review, i) => (
              <div key={i} className="flex items-center justify-between rounded border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs">
                <span className="text-amber-800">{review.title}</span>
                <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300">
                  {review.daysOverdue}d overdue
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Risk Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className="rounded border border-purple-100 bg-purple-50 p-2.5 text-xs text-purple-800 leading-relaxed"
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
