"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MULTI-AGENCY WORKING INTELLIGENCE CARD
// Dashboard card for professional contacts, LAC reviews, multi-agency
// meetings, and ARIA multi-agency intelligence.
// CHR 2015 Reg 5 (engagement), Reg 13 (leadership),
// Working Together to Safeguard Children 2018.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Network, ChevronRight, AlertTriangle, Brain,
  Users, Calendar, FileText, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  active_contacts: 18,
  children_with_sw: 5,
  total_children: 5,
  overdue_contacts: 2,
  lac_reviews_this_year: 8,
  child_participation_rate: 88,
  care_plan_agreement_rate: 100,
  home_report_rate: 75,
  meetings_this_quarter: 6,
  follow_up_completion_rate: 83,
};

const DEMO_UPCOMING_REVIEWS = [
  { child: "Child A", type: "Subsequent", date: "2026-05-20", iro: "S. Williams", report_submitted: true },
  { child: "Child C", type: "Second", date: "2026-05-28", iro: "M. Khan", report_submitted: false },
];

const DEMO_MEETING_TYPES = [
  { type: "LAC Review", count: 3, completed: 3 },
  { type: "PEP Meeting", count: 2, completed: 2 },
  { type: "Professionals Meeting", count: 2, completed: 1 },
  { type: "Strategy Meeting", count: 1, completed: 1 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "home_report", severity: "high", message: "Home report not submitted for Child C's LAC review on 28 May. Reports must be submitted at least 3 working days before the review." },
  { type: "overdue_contact", severity: "medium", message: "2 professional contacts overdue — Child B's CAMHS worker (21 days) and Child D's YOT worker (16 days). Schedule contact this week." },
];

const ARIA_INSIGHTS = [
  "2 LAC reviews upcoming: Child A (subsequent, 20 May — report submitted) and Child C (second review, 28 May — report NOT submitted). Prioritise Child C's home report. Ensure both children have been consulted about their wishes and feelings for the review.",
  "Professional network: 18 active contacts across 5 children. All children have allocated social workers — good compliance with Reg 5. 2 contacts overdue (CAMHS and YOT). Next professionals meeting scheduled for 2 June.",
  "Overall: 8 LAC reviews this year, 88% child participation rate, 100% care plan agreement. Home report submission rate at 75% — target 100%. 6 multi-agency meetings this quarter. Follow-up completion at 83%. Strengthen CAMHS engagement for Child B — 3 cancelled appointments in 2 months.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function MultiAgencyCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Network className="h-4 w-4 text-brand" />
            Multi-Agency Working
          </CardTitle>
          <Link href="/multi-agency" className="text-xs text-brand hover:underline flex items-center gap-1">
            Contacts <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.children_with_sw === m.total_children ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_with_sw === m.total_children ? "text-green-600" : "text-red-600")}>
              {m.children_with_sw}/{m.total_children}
            </p>
            <p className="text-[10px] text-muted-foreground">Have SW</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.active_contacts}</p>
            <p className="text-[10px] text-muted-foreground">Contacts</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_participation_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_participation_rate >= 90 ? "text-green-600" : "text-amber-600")}>
              {m.child_participation_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Participation</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_contacts === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_contacts === 0 ? "text-green-600" : "text-amber-600")}>
              {m.overdue_contacts}
            </p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        {/* ── Upcoming LAC reviews ────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Upcoming LAC Reviews
          </p>
          {DEMO_UPCOMING_REVIEWS.map((r) => (
            <div key={r.child} className="rounded border p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.child}</span>
                <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} — IRO: {r.iro}</span>
                <Badge className={cn(
                  "text-[10px]",
                  r.report_submitted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                )}>
                  <FileText className="h-2.5 w-2.5 mr-0.5" />
                  {r.report_submitted ? "Report sent" : "Report due"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Meeting types ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Meetings This Quarter ({m.meetings_this_quarter})
          </p>
          {DEMO_MEETING_TYPES.map((mt) => (
            <div key={mt.type} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="truncate flex-1">{mt.type}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge variant="outline" className="text-[10px] tabular-nums">{mt.count}</Badge>
                <Badge className={cn(
                  "text-[10px]",
                  mt.completed === mt.count ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                )}>
                  {mt.completed}/{mt.count}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Compliance ─────────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            Compliance
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center rounded border p-2">
              <p className={cn("text-sm font-bold tabular-nums", m.care_plan_agreement_rate === 100 ? "text-green-600" : "text-amber-600")}>
                {m.care_plan_agreement_rate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Care Plans</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className={cn("text-sm font-bold tabular-nums", m.home_report_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {m.home_report_rate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Reports</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className={cn("text-sm font-bold tabular-nums", m.follow_up_completion_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {m.follow_up_completion_rate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Follow-ups</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Multi-Agency Alerts
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
            ARIA Multi-Agency Intelligence
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
