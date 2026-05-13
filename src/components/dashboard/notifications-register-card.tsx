"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — NOTIFICATIONS REGISTER INTELLIGENCE CARD
// Dashboard card for statutory notifications to Ofsted, LA, LADO, police.
// CHR 2015 Reg 40, Reg 41.
// SCCIF: Leadership — "Notifications are made promptly and accurately."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell, ChevronRight, AlertTriangle, Brain,
  Clock, Send, FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_notifications: 18,
  serious_injury_count: 2,
  missing_child_count: 3,
  restraint_count: 4,
  allegation_count: 1,
  submitted_rate: 83.3,
  draft_count: 3,
  within_24_hours_rate: 66.7,
  late_count: 2,
  significantly_late_count: 1,
  evidence_attached_rate: 72.2,
  reg40_count: 12,
  reg41_count: 8,
  follow_up_overdue_count: 2,
};

const DEMO_RECORDS: { type: string; status: string; date: string; timeliness: string; body: string }[] = [
  { type: "Restraint", status: "Submitted", date: "12 May", timeliness: "24h", body: "Ofsted" },
  { type: "Missing Child", status: "Acknowledged", date: "10 May", timeliness: "24h", body: "Ofsted, Police" },
  { type: "Allegation", status: "Draft", date: "8 May", timeliness: "—", body: "LADO" },
  { type: "Serious Injury", status: "Submitted", date: "5 May", timeliness: "Late", body: "Ofsted, LA" },
  { type: "Restraint", status: "Closed", date: "1 May", timeliness: "24h", body: "Ofsted" },
  { type: "Significant Event", status: "Draft", date: "28 Apr", timeliness: "—", body: "LA" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "significantly_late", severity: "critical", message: "Serious injury notification on 5 May was significantly late — review notification procedures." },
  { type: "draft_not_submitted", severity: "high", message: "3 notifications are still in draft — submit without delay." },
  { type: "late_notification", severity: "high", message: "2 notifications were submitted late — improve timeliness." },
  { type: "follow_up_overdue", severity: "high", message: "2 notification follow-ups are overdue — complete promptly." },
];

const ARIA_INSIGHTS = [
  "18 notifications. Submitted: 83.3%. Within 24h: 66.7%. Reg 40: 12, Reg 41: 8. Evidence attached: 72.2%. 2 follow-ups overdue.",
  "Priority: 1 significantly late notification. 3 still in draft. 2 late. 2 overdue follow-ups. Timeliness needs improvement.",
  "Positive: Good submission rate. Most notifications acknowledged. Reg 40/41 compliance tracked. Improve draft turnaround and evidence attachment.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Submitted": { label: "Sent", color: "text-green-700 bg-green-50 border-green-200" },
  "Acknowledged": { label: "Ack'd", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Draft": { label: "Draft", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Closed": { label: "Closed", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function NotificationsRegisterCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand" />
            Notifications Register
          </CardTitle>
          <Link href="/notifications-register" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.submitted_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.submitted_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.submitted_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Submitted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.within_24_hours_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.within_24_hours_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.within_24_hours_rate}%</p>
            <p className="text-[10px] text-muted-foreground">On Time</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.draft_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.draft_count === 0 ? "text-green-600" : "text-red-600")}>{m.draft_count}</p>
            <p className="text-[10px] text-muted-foreground">Drafts</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.significantly_late_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.significantly_late_count === 0 ? "text-green-600" : "text-red-600")}>{m.significantly_late_count}</p>
            <p className="text-[10px] text-muted-foreground">Very Late</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Notifications</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Draft"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Send className="h-3 w-3 text-indigo-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.body} · {r.date} · {r.timeliness}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Notification Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Notification Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
