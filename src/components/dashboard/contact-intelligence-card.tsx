"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — CONTACT & ENGAGEMENT INTELLIGENCE CARD
// Dashboard card for contact compliance, family time, child profiles,
// mood impact, and Cara contact intelligence.
// Powered by the Contact Engagement Engine — live data.
// ══════════════════════════════════════════════════════════════════════════════

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Brain, AlertTriangle, Loader2,
  Heart, Calendar, Smile, Frown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactEngagement } from "@/hooks/use-contact-engagement";

// ── Colour maps ────────────────────────────────────────────────────────────

const ALERT_STYLES: Record<string, string> = {
  critical: "border-[--cs-risk-soft] bg-[--cs-risk-bg] text-[--cs-risk]",
  high: "border-[--cs-risk-soft] bg-[--cs-risk-bg] text-[--cs-risk]",
  medium: "border-[--cs-warning-soft] bg-[--cs-warning-bg] text-[--cs-warning]",
  low: "border-[--cs-info-soft] bg-[--cs-info-bg] text-[--cs-info]",
};

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-[--cs-risk-soft] bg-[--cs-risk-bg] text-[--cs-risk]",
  warning: "border-[--cs-warning-soft] bg-[--cs-warning-bg] text-[--cs-warning]",
  positive: "border-[--cs-success-soft] bg-[--cs-success-bg] text-[--cs-success]",
};

// ── Component ────────────────────────────────────────────────────────────────

export function ContactIntelligenceCard() {
  const { data, isLoading } = useContactEngagement();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" />
            Contact & Engagement
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

  const c = intel.compliance;
  const ft = intel.family_time;
  const mood = intel.mood_impact;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-brand" />
          Contact & Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: c.contact_plan_rate >= 80 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.contact_plan_rate >= 80 ? "text-[--cs-success]" : "text-[--cs-warning]")}>
              {c.contact_plan_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Plan Rate</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.frequency_met_rate >= 80 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.frequency_met_rate >= 80 ? "text-[--cs-success]" : "text-[--cs-warning]")}>
              {c.frequency_met_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Freq Met</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.supervised_rate >= 80 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.supervised_rate >= 80 ? "text-[--cs-success]" : "text-[--cs-warning]")}>
              {c.supervised_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Supervised</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.risk_assessed_rate >= 80 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.risk_assessed_rate >= 80 ? "text-[--cs-success]" : "text-[--cs-warning]")}>
              {c.risk_assessed_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Risk Assessed</p>
          </div>
        </div>

        {/* ── Family time stats ────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3" />
            Family Time (30 days)
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border p-2">
              <p className="text-sm font-bold tabular-nums text-[var(--cs-navy)]">{ft.attended}/{ft.total_sessions_30d}</p>
              <p className="text-[10px] text-muted-foreground">Attended</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className={cn("text-sm font-bold tabular-nums", ft.cancelled_by_family > 0 ? "text-[--cs-warning]" : "text-[--cs-success]")}>
                {ft.cancelled_by_family}
              </p>
              <p className="text-[10px] text-muted-foreground">Cancelled (Family)</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className={cn("text-sm font-bold tabular-nums", ft.cancelled_by_la > 0 ? "text-[--cs-warning]" : "text-[--cs-success]")}>
                {ft.cancelled_by_la}
              </p>
              <p className="text-[10px] text-muted-foreground">Cancelled (LA)</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-2.5 mt-2">
            <div className="flex items-center gap-2">
              <Smile className={cn("h-4 w-4", ft.positive_outcome_rate >= 75 ? "text-green-500" : "text-amber-500")} />
              <div>
                <p className="text-xs font-medium">Positive Outcomes</p>
                <p className="text-[10px] text-muted-foreground">
                  {ft.positive_outcome_rate}% positive · {ft.child_enjoyed_rate}% child enjoyed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Child contact profiles ──────────────────────────────────── */}

        {intel.child_profiles.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Child Contact Profiles
            </p>
            {intel.child_profiles.map((child) => (
              <div key={child.child_id} className="rounded-lg border p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.child_name}</span>
                  <Badge className={cn("text-[10px]", child.contact_plan ? "bg-[--cs-success-bg] text-[--cs-success]" : "bg-gray-100 text-gray-700")}>
                    {child.contact_plan ? "Plan active" : "No plan"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{child.sessions_30d} sessions</span>
                  <Badge className={cn("text-[10px]", child.positive_rate >= 75 ? "bg-[--cs-success-bg] text-[--cs-success]" : child.positive_rate >= 50 ? "bg-[--cs-warning-bg] text-[--cs-warning]" : "bg-[--cs-risk-bg] text-[--cs-risk]")}>
                    {child.positive_rate}% positive
                  </Badge>
                  {child.missed_rate > 20 && (
                    <Badge className="text-[10px] bg-[--cs-risk-bg] text-[--cs-risk]">
                      {child.missed_rate}% missed
                    </Badge>
                  )}
                  {child.next_session && (
                    <span className="text-[10px] text-muted-foreground">Next: {child.next_session}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Mood impact ──────────────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            {mood.mood_improvement_rate >= 50 ? (
              <Smile className="h-4 w-4 text-green-500" />
            ) : (
              <Frown className="h-4 w-4 text-amber-500" />
            )}
            <div>
              <p className="text-xs font-medium">Mood Impact</p>
              <p className="text-[10px] text-muted-foreground">
                Before: {mood.avg_mood_before.toFixed(1)} · After: {mood.avg_mood_after.toFixed(1)}
              </p>
            </div>
          </div>
          <Badge className={cn("text-[10px]", mood.mood_improvement_rate >= 50 ? "bg-[--cs-success-bg] text-[--cs-success]" : "bg-[--cs-warning-bg] text-[--cs-warning]")}>
            {mood.mood_improvement_rate}% improved
          </Badge>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {intel.alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Contact Alerts
            </p>
            {intel.alerts.slice(0, 3).map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  ALERT_STYLES[alert.severity] ?? ALERT_STYLES.medium,
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── Cara insights ────────────────────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              Cara Contact Intelligence
            </p>
            {intel.insights.map((insight, i) => (
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
