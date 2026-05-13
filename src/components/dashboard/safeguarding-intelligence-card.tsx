"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SAFEGUARDING INTELLIGENCE CARD
// Dashboard card for safeguarding referral tracking, multi-agency compliance,
// Ofsted notification status, and ARIA safeguarding intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, ChevronRight, AlertTriangle, CheckCircle2,
  Clock, Brain, Bell, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalReferrals: 8,
  pending: 1,
  overdueAcknowledgement: 0,
  ofstedNotificationsRequired: 5,
  ofstedNotificationsSent: 4,
  notificationCompliancePct: 80,
  averageResolutionDays: 12,
  byType: {
    mash: 3,
    lado: 1,
    strategy_meeting: 2,
    professional_consultation: 2,
  },
};

const ACTIVE_REFERRALS = [
  {
    id: "sr_1",
    child: "Alex W",
    type: "MASH Referral",
    urgency: "within_24h",
    status: "investigating",
    daysOpen: 8,
    multiAgency: ["MASH", "Police", "Social Worker"],
  },
  {
    id: "sr_2",
    child: "Tyler R",
    type: "Strategy Meeting",
    urgency: "within_72h",
    status: "submitted",
    daysOpen: 3,
    multiAgency: ["Social Worker", "School"],
  },
];

const CHILDREN_ON_CP = [
  { name: "Alex W", planType: "Child Protection Plan", since: "2026-03-15" },
];

const ARIA_INSIGHTS = [
  "1 outstanding Ofsted notification for the MASH referral on Alex W (submitted 8 days ago). Reg 40 requires notification without delay.",
  "Tyler R's strategy meeting outcome is due within 72 hours. Ensure all multi-agency documentation is prepared and filed.",
  "Positive pattern: All safeguarding referrals in the past quarter have been submitted within required timeframes. This evidences strong safeguarding practice.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const URGENCY_COLOURS: Record<string, string> = {
  immediate: "bg-red-100 text-red-700",
  within_24h: "bg-amber-100 text-amber-700",
  within_72h: "bg-blue-100 text-blue-700",
  routine: "bg-gray-100 text-gray-600",
};

const STATUS_COLOURS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  submitted: "bg-blue-100 text-blue-700",
  investigating: "bg-purple-100 text-purple-700",
  outcome_received: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

// ── Component ────────────────────────────────────────────────────────────────

export function SafeguardingIntelligenceCard() {
  const c = DEMO_COMPLIANCE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            Safeguarding Intelligence
          </CardTitle>
          <Link href="/safeguarding" className="text-xs text-brand hover:underline flex items-center gap-1">
            Safeguarding <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-gray-50 p-2">
            <p className="text-lg font-bold tabular-nums">{c.totalReferrals}</p>
            <p className="text-[10px] text-muted-foreground">Referrals</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.pending > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.pending > 0 ? "text-amber-600" : "text-green-600")}>{c.pending}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className="text-center rounded-lg bg-gray-50 p-2">
            <p className="text-lg font-bold tabular-nums">{c.averageResolutionDays}d</p>
            <p className="text-[10px] text-muted-foreground">Avg Resolve</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.notificationCompliancePct >= 100 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.notificationCompliancePct >= 100 ? "text-green-600" : "text-amber-600")}>
              {c.notificationCompliancePct}%
            </p>
            <p className="text-[10px] text-muted-foreground">Notified</p>
          </div>
        </div>

        {/* ── Ofsted notification bar ──────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Bell className={cn("h-4 w-4", c.ofstedNotificationsSent < c.ofstedNotificationsRequired ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">Reg 40 Notifications</p>
              <p className="text-[10px] text-muted-foreground">
                {c.ofstedNotificationsSent}/{c.ofstedNotificationsRequired} sent to Ofsted
              </p>
            </div>
          </div>
          {c.ofstedNotificationsSent < c.ofstedNotificationsRequired ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              {c.ofstedNotificationsRequired - c.ofstedNotificationsSent} outstanding
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Compliant
            </Badge>
          )}
        </div>

        {/* ── Active referrals ─────────────────────────────────────────── */}

        {ACTIVE_REFERRALS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Active Referrals</p>
            {ACTIVE_REFERRALS.map((ref) => (
              <div key={ref.id} className="rounded-lg border p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ref.child}</span>
                    <Badge className={cn("text-[10px]", URGENCY_COLOURS[ref.urgency] ?? "")}>
                      {ref.urgency.replace("_", " ")}
                    </Badge>
                  </div>
                  <Badge className={cn("text-[10px]", STATUS_COLOURS[ref.status] ?? "")}>
                    {ref.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{ref.type} · Open {ref.daysOpen} days</p>
                <div className="flex items-center gap-1 flex-wrap">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  {ref.multiAgency.map((agency) => (
                    <span key={agency} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {agency}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Children on CP plans ─────────────────────────────────────── */}

        {CHILDREN_ON_CP.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-1">
            <p className="text-xs font-semibold text-red-800 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Children on Protection Plans
            </p>
            {CHILDREN_ON_CP.map((child, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-red-700">
                <span className="font-medium">{child.name}</span>
                <span>{child.planType} (since {child.since})</span>
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Safeguarding Intelligence
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
