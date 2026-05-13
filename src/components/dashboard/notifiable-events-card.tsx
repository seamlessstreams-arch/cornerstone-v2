"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — NOTIFIABLE EVENTS INTELLIGENCE CARD
// Dashboard card for Reg 40 notifiable events tracking, notification
// compliance, response times, and ARIA notification intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Clock, Send, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalEvents: 8,
  totalNotificationsRequired: 18,
  totalNotificationsSent: 16,
  complianceRate: 88.9,
  overdueCount: 1,
  avgResponseHours: 6.4,
};

const RECENT_EVENTS = [
  { type: "Physical Intervention", date: "2026-05-10", child: "Tyler R", notified: true, status: "sent" },
  { type: "Missing from home", date: "2026-05-08", child: "Alex W", notified: true, status: "acknowledged" },
  { type: "Substance misuse", date: "2026-05-05", child: "Tyler R", notified: true, status: "sent" },
  { type: "Allegation against staff", date: "2026-05-03", child: null, notified: false, status: "overdue" },
];

const EVENT_TYPE_BREAKDOWN = [
  { type: "Physical Intervention", count: 3 },
  { type: "Missing from home", count: 2 },
  { type: "Substance misuse", count: 1 },
  { type: "Allegation against staff", count: 1 },
  { type: "Police involvement", count: 1 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "overdue_notification", severity: "critical", message: "Allegation against staff (3 May) — Ofsted notification overdue. 24-hour deadline passed. Send immediately and document reason for delay." },
  { type: "repeat_child", severity: "medium", message: "Tyler R involved in 3 notifiable events in the last 14 days (PI, substance misuse, PI). Review care plan and consider multi-agency strategy meeting." },
];

const ARIA_INSIGHTS = [
  "1 overdue Ofsted notification requires immediate action — allegation against staff on 3 May. This is a regulatory breach. Send notification via Ofsted online portal and record the delay reason. All other notifications sent within deadline.",
  "Tyler R is involved in 37.5% of all notifiable events this period. Pattern suggests escalating risk — PI events and substance misuse may be linked. Recommend multi-agency meeting with social worker, YOT, and substance misuse service.",
  "Positive: 88.9% notification compliance rate. Average response time of 6.4 hours is well within most deadlines. 2 of 8 events have been acknowledged by recipients. Missing from home notifications now include police referral as standard. Reg 40 requirements broadly met.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function NotifiableEventsCard() {
  const c = DEMO_COMPLIANCE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand" />
            Notifiable Events (Reg 40)
          </CardTitle>
          <Link href="/notifiable-events" className="text-xs text-brand hover:underline flex items-center gap-1">
            Events <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {c.totalEvents}
            </p>
            <p className="text-[10px] text-muted-foreground">Events</p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ background: c.complianceRate >= 95 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", c.complianceRate >= 95 ? "text-green-600" : "text-amber-600")}>
              {c.complianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Notified</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.overdueCount > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.overdueCount > 0 ? "text-red-600" : "text-green-600")}>
              {c.overdueCount}
            </p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">
              {c.avgResponseHours}h
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Response</p>
          </div>
        </div>

        {/* ── Recent events ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Recent Events
          </p>
          {RECENT_EVENTS.map((event, i) => (
            <div key={i} className="rounded-lg border p-2.5 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.type}</span>
                {event.child && <span className="text-muted-foreground">— {event.child}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className={cn(
                  "text-[10px]",
                  event.status === "acknowledged" ? "bg-green-100 text-green-700"
                    : event.status === "sent" ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700",
                )}>
                  {event.status === "acknowledged" ? (
                    <><CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />Ack</>
                  ) : event.status === "sent" ? (
                    <><Send className="h-2.5 w-2.5 mr-0.5" />Sent</>
                  ) : (
                    <><Clock className="h-2.5 w-2.5 mr-0.5" />Overdue</>
                  )}
                </Badge>
                <span className="text-muted-foreground">{event.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Event type breakdown ──────────────────────────────────────── */}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Event Types</p>
          <div className="space-y-1">
            {EVENT_TYPE_BREAKDOWN.map((et) => {
              const pct = Math.round((et.count / c.totalEvents) * 100);
              return (
                <div key={et.type} className="flex items-center gap-2 text-xs">
                  <span className="w-36 text-muted-foreground">{et.type}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right tabular-nums font-medium">{et.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Notification Alerts
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
            ARIA Notification Intelligence
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
