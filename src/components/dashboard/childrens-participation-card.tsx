"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S PARTICIPATION INTELLIGENCE CARD
// Dashboard card for house meetings, consultations, children's voice,
// and ARIA participation intelligence.
// CHR 2015 Reg 7 (children's views, wishes and feelings),
// UNCRC Article 12 (right to be heard).
// SCCIF: Children's Experiences.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, ChevronRight, AlertTriangle, Brain,
  Users, ThumbsUp, Megaphone, CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  meetings_this_quarter: 6,
  avg_attendance: 88,
  participation_rate: 100,
  actions_implemented: 78,
  consultations_this_quarter: 12,
  satisfaction_rate: 85,
};

const DEMO_RECENT_MEETINGS = [
  { type: "House Meeting", date: "2026-05-08", attended: 5, invited: 5, engagement: "high" },
  { type: "Menu Planning", date: "2026-05-01", attended: 4, invited: 5, engagement: "high" },
  { type: "Activity Planning", date: "2026-04-24", attended: 4, invited: 5, engagement: "moderate" },
];

const DEMO_TOPICS = [
  { category: "Activities & Outings", count: 8 },
  { category: "Food & Menus", count: 6 },
  { category: "House Rules", count: 4 },
  { category: "Individual Needs", count: 3 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "action_feedback", severity: "medium", message: "2 actions from April house meetings have been implemented but children not yet informed of the outcomes. Close the loop by feeding back at the next meeting." },
];

const ARIA_INSIGHTS = [
  "6 participation meetings this quarter with 88% average attendance — all 5 children have participated at least once. Children most engaged in activity planning and menu discussions. 78% of actions from meetings have been implemented — above the 70% target.",
  "12 individual consultations this quarter. Topics: activities (8), food (6), house rules (4), individual needs (3). Child satisfaction with responses: 85%. Children report feeling listened to. 2 actions awaiting feedback — ensure outcomes communicated at next house meeting.",
  "Trend: participation engagement is consistently high. Children's views have directly influenced: new weekend activity schedule (voted on by children), updated menu cycle (3 children's recipe suggestions included), and adjustment to evening routine (15-minute extension requested and granted). Strong Reg 7 compliance.",
];

const engagementColor: Record<string, string> = {
  high: "bg-green-100 text-green-700",
  moderate: "bg-blue-100 text-blue-700",
  low: "bg-amber-100 text-amber-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function ChildrensParticipationCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-brand" />
            Children&apos;s Participation
          </CardTitle>
          <Link href="/childrens-participation" className="text-xs text-brand hover:underline flex items-center gap-1">
            Meetings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.meetings_this_quarter}</p>
            <p className="text-[10px] text-muted-foreground">Meetings (Q)</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.avg_attendance >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.avg_attendance >= 80 ? "text-green-600" : "text-amber-600")}>
              {m.avg_attendance}%
            </p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.participation_rate === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.participation_rate === 100 ? "text-green-600" : "text-amber-600")}>
              {m.participation_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Participation</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.actions_implemented}%</p>
            <p className="text-[10px] text-muted-foreground">Actioned</p>
          </div>
        </div>

        {/* ── Recent meetings ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <CalendarCheck className="h-3 w-3" />
            Recent Meetings
          </p>
          {DEMO_RECENT_MEETINGS.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{m.type}</span>
                <span className="text-muted-foreground">
                  {new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] tabular-nums">
                  <Users className="h-2.5 w-2.5 mr-0.5" />
                  {m.attended}/{m.invited}
                </Badge>
                <Badge className={cn("text-[10px]", engagementColor[m.engagement])}>
                  {m.engagement}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Topics raised ───────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Megaphone className="h-3 w-3 text-blue-500" />
            Top Topics This Quarter
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_TOPICS.map((t) => (
              <div key={t.category} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate flex-1">{t.category}</span>
                <span className="font-bold tabular-nums text-blue-600 ml-1">{t.count}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              Child satisfaction
            </span>
            <span className="font-bold tabular-nums text-green-600">{m.satisfaction_rate}%</span>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Participation Alerts
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
            ARIA Participation Intelligence
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
