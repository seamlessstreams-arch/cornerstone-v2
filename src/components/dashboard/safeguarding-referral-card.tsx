"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SAFEGUARDING REFERRAL CARD
// Dashboard card powered by the Safeguarding Intelligence Engine.
// Focus: referrals, incidents, oversight, and risk details.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldAlert, ChevronRight, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafeguardingIntelligence } from "@/hooks/use-safeguarding-intelligence";

// ── Styling ─────────────────────────────────────────────────────────────────

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning:  "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

// ── Component ───────────────────────────────────────────────────────────────

export function SafeguardingReferralCard() {
  const { data, isLoading } = useSafeguardingIntelligence();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand" />
            Safeguarding Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--cs-text-muted)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const p = intel.profile;
  const ra = intel.risk_assessments;
  const r = intel.restraints;
  const m = intel.missing;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand" />
            Safeguarding Referrals
          </CardTitle>
          <Link href="/safeguarding" className="text-xs text-brand hover:underline flex items-center gap-1">
            Safeguarding <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Referral summary strip ──────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{p.total_incidents_90d}</p>
            <p className="text-[10px] text-muted-foreground">Incidents 90d</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", p.safeguarding_incidents_90d === 0 ? "bg-green-50" : p.safeguarding_incidents_90d <= 3 ? "bg-amber-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", p.safeguarding_incidents_90d === 0 ? "text-green-600" : p.safeguarding_incidents_90d <= 3 ? "text-amber-600" : "text-red-600")}>{p.safeguarding_incidents_90d}</p>
            <p className="text-[10px] text-muted-foreground">SG Referrals</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", p.open_incidents === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", p.open_incidents === 0 ? "text-green-600" : "text-amber-600")}>{p.open_incidents}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", p.incidents_needing_oversight === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", p.incidents_needing_oversight === 0 ? "text-green-600" : "text-red-600")}>{p.incidents_needing_oversight}</p>
            <p className="text-[10px] text-muted-foreground">Need Oversight</p>
          </div>
        </div>

        {/* ── Incident & risk detail ──────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Incident & Risk Detail</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className={cn("text-sm font-bold tabular-nums", m.children_with_episodes === 0 ? "text-green-600" : "text-amber-600")}>{m.children_with_episodes}</p>
              <p className="text-[10px] text-muted-foreground">Children</p>
            </div>
            <div>
              <p className={cn("text-sm font-bold tabular-nums", ra.high_or_very_high === 0 ? "text-green-600" : "text-red-600")}>{ra.high_or_very_high}</p>
              <p className="text-[10px] text-muted-foreground">High Risk</p>
            </div>
            <div>
              <p className={cn("text-sm font-bold tabular-nums", ra.overdue_reviews === 0 ? "text-green-600" : "text-red-600")}>{ra.overdue_reviews}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
            <div>
              <p className={cn("text-sm font-bold tabular-nums", ra.worsening_trend === 0 ? "text-green-600" : "text-red-600")}>{ra.worsening_trend}</p>
              <p className="text-[10px] text-muted-foreground">Worsening</p>
            </div>
          </div>
        </div>

        {/* ── Compliance indicators ───────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Compliance</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={cn("text-sm font-bold tabular-nums", r.debrief_completion_rate >= 100 ? "text-green-600" : r.debrief_completion_rate >= 80 ? "text-amber-600" : "text-red-600")}>{r.debrief_completion_rate}%</p>
              <p className="text-[10px] text-muted-foreground">Debrief Rate</p>
            </div>
            <div>
              <p className={cn("text-sm font-bold tabular-nums", r.review_completion_rate >= 100 ? "text-green-600" : r.review_completion_rate >= 80 ? "text-amber-600" : "text-red-600")}>{r.review_completion_rate}%</p>
              <p className="text-[10px] text-muted-foreground">Review Done</p>
            </div>
            <div>
              <p className={cn("text-sm font-bold tabular-nums", m.return_interview_rate >= 100 ? "text-green-600" : m.return_interview_rate >= 80 ? "text-amber-600" : "text-red-600")}>{m.return_interview_rate}%</p>
              <p className="text-[10px] text-muted-foreground">RI Rate</p>
            </div>
          </div>
        </div>

        {/* ── ARIA Referral Intelligence ──────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Referral Intelligence
            </p>
            {intel.insights.slice(0, 3).map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  INSIGHT_STYLES[insight.severity] ?? INSIGHT_STYLES.positive,
                )}
              >
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
