"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S MEETINGS & CONSULTATION CARD
// Dashboard card for house meetings, children's council, consultation records,
// participation rates, action tracking, and ARIA child voice intelligence.
// CHR 2015 Reg 7 (wishes & feelings), Reg 16 (consultation with children).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Users, HandHeart, Megaphone, ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_MEETING_COMPLIANCE = {
  total_meetings: 14,
  avg_attendance: 4.8,
  attendance_rate: 80,
  total_actions: 22,
  actions_completed: 16,
  actions_overdue: 3,
  action_completion_rate: 73,
  minutes_approved_rate: 86,
};

const DEMO_CONSULTATION = {
  total_consultations: 31,
  children_consulted: 5,
  consultation_rate: 83,
  avg_impact: 2.4,
  with_action_taken: 24,
  action_rate: 77,
};

const DEMO_MEETING_TYPES = [
  { type: "House Meeting", count: 8 },
  { type: "Children's Council", count: 2 },
  { type: "Menu Planning", count: 3 },
  { type: "Activities", count: 1 },
];

const DEMO_CONSULTATION_TYPES = [
  { type: "Care Plan", count: 8 },
  { type: "Daily Living", count: 6 },
  { type: "Education", count: 5 },
  { type: "Activities", count: 4 },
  { type: "Contact", count: 4 },
  { type: "Other", count: 4 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "overdue_actions", severity: "medium", message: "3 meeting actions overdue — children may perceive their views are not being acted upon." },
  { type: "unconsulted_children", severity: "high", message: "1 of 6 children have no consultation records — Reg 7 requires seeking each child's wishes and feelings." },
  { type: "unapproved_minutes", severity: "low", message: "2 sets of meeting minutes not yet approved." },
];

const ARIA_INSIGHTS = [
  "1 child has no consultation records. Cross-reference with key work sessions — if this child's voice is also absent from daily logs and LAC reviews, this represents a significant Reg 7 gap. Consider independent advocacy referral.",
  "3 meeting actions overdue. Action completion rate dropped from 85% to 73% this quarter. Review whether actions are realistic and time-bound. Children's council feedback shows they notice when promises aren't kept.",
  "80% attendance rate at house meetings. 83% of children have been consulted this month. Care plan consultations lead with 8 records. Impact rating averaging 2.4/4 (moderate) — good evidence that children's views are influencing decisions.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function MeetingsCard() {
  const m = DEMO_MEETING_COMPLIANCE;
  const c = DEMO_CONSULTATION;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-brand" />
            Children&apos;s Voice & Meetings
          </CardTitle>
          <Link href="/meetings" className="text-xs text-brand hover:underline flex items-center gap-1">
            Meetings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {m.total_meetings}
            </p>
            <p className="text-[10px] text-muted-foreground">Meetings</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.attendance_rate >= 75 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.attendance_rate >= 75 ? "text-green-600" : "text-amber-600")}>
              {m.attendance_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Attendance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.consultation_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.consultation_rate >= 80 ? "text-green-600" : "text-amber-600")}>
              {c.consultation_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Consulted</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">
              {c.total_consultations}
            </p>
            <p className="text-[10px] text-muted-foreground">Consults</p>
          </div>
        </div>

        {/* ── Meeting types ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Meeting Types
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_MEETING_TYPES.map((t) => (
              <div key={t.type} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate">{t.type}</span>
                <Badge variant="outline" className="text-[10px] tabular-nums ml-1">{t.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action tracking ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Meeting Actions
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-green-600">{m.actions_completed}</p>
              <p className="text-[10px] text-muted-foreground">Completed</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className={cn("text-sm font-bold tabular-nums", m.actions_overdue > 0 ? "text-red-600" : "text-gray-600")}>{m.actions_overdue}</p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums">{m.action_completion_rate}%</p>
              <p className="text-[10px] text-muted-foreground">Rate</p>
            </div>
          </div>
        </div>

        {/* ── Consultation summary ────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1">
            <HandHeart className="h-3 w-3 text-pink-500" />
            Consultation Impact
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Action taken on consultations</span>
            <span className={cn("font-bold", c.action_rate >= 70 ? "text-green-600" : "text-amber-600")}>
              {c.action_rate}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Average impact rating</span>
            <span className="font-bold">{c.avg_impact}/4</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Minutes approved</span>
            <span className={cn("font-bold", m.minutes_approved_rate >= 90 ? "text-green-600" : "text-amber-600")}>
              {m.minutes_approved_rate}%
            </span>
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
                    : alert.severity === "medium"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-blue-200 bg-blue-50 text-blue-800",
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
            ARIA Child Voice Intelligence
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
