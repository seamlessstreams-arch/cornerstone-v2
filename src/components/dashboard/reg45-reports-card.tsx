"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — REG 45 QUALITY OF CARE REPORTS INTELLIGENCE CARD
// Dashboard card for responsible individual's six-monthly quality reviews,
// action tracking, evaluation ratings, and ARIA Reg 45 intelligence.
// CHR 2015 Reg 45 (review of quality of care), Reg 44 (independent
// person reports), Reg 16 (statement of purpose compliance).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck, ChevronRight, AlertTriangle, Brain,
  Star, ClipboardCheck, Users, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_reports: 4,
  latest_rating: "good",
  open_actions: 3,
  overdue_actions: 1,
  next_report_due: "2026-08-15",
  days_to_next: 94,
  children_interviewed_last: 5,
  staff_interviewed_last: 8,
};

const DEMO_LATEST_EVALUATIONS = [
  { area: "Quality of Care", rating: "good" },
  { area: "Children's Views", rating: "outstanding" },
  { area: "Safeguarding", rating: "good" },
  { area: "Education", rating: "good" },
  { area: "Leadership", rating: "requires_improvement" },
  { area: "Staffing", rating: "good" },
];

const DEMO_ACTIONS = [
  { description: "Improve supervision frequency for new staff", priority: "high", status: "in_progress", area: "Leadership" },
  { description: "Update Statement of Purpose — staffing section", priority: "medium", status: "open", area: "SoP Compliance" },
  { description: "Address Reg 44 action on medication storage", priority: "high", status: "overdue", area: "Safeguarding" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "action_overdue", severity: "high", message: "1 Reg 45 action overdue: medication storage improvement (assigned to D. Laville) — 12 days past due date." },
  { type: "requires_improvement", severity: "medium", message: "Leadership & Management rated 'requires improvement' in latest Reg 45 — supervision frequency and staff induction highlighted. Action plan in place." },
];

const ARIA_INSIGHTS = [
  "Latest Reg 45 report (Nov 2025–Apr 2026) rated overall quality as Good. 5 children and 8 staff interviewed. All Reg 44 reports reviewed (6 reports, 2 actions outstanding). One area rated 'requires improvement': Leadership & Management — specifically supervision frequency for newly qualified staff.",
  "1 of 3 open actions is overdue: medication storage review (12 days past due). The other 2 actions are on track. Cross-reference with Reg 44 April report which also flagged medication audit findings — coordinated response needed between RI and RM.",
  "Trend: quality ratings have been consistently 'Good' across last 4 reports. Children's Views rated 'Outstanding' in latest report — strong child voice practice. Next Reg 45 due 15 August 2026. RI to schedule unannounced visit by July.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const ratingColor: Record<string, string> = {
  outstanding: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  requires_improvement: "bg-amber-100 text-amber-700",
  inadequate: "bg-red-100 text-red-700",
};

const ratingLabel: Record<string, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "RI",
  inadequate: "Inadequate",
};

// ── Component ────────────────────────────────────────────────────────────────

export function Reg45ReportsCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-brand" />
            Reg 45 Quality Reports
          </CardTitle>
          <Link href="/reg45-reports" className="text-xs text-brand hover:underline flex items-center gap-1">
            Reports <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_reports}</p>
            <p className="text-[10px] text-muted-foreground">Reports</p>
          </div>
          <div className="text-center rounded-lg p-2">
            <Badge className={cn("text-xs", ratingColor[m.latest_rating])}>
              {ratingLabel[m.latest_rating]}
            </Badge>
            <p className="text-[10px] text-muted-foreground mt-1">Latest</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_actions === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_actions === 0 ? "text-green-600" : "text-red-600")}>
              {m.overdue_actions}
            </p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.days_to_next}</p>
            <p className="text-[10px] text-muted-foreground">Days to Next</p>
          </div>
        </div>

        {/* ── Latest evaluation ratings ───────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3" />
            Latest Evaluation Ratings
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_LATEST_EVALUATIONS.map((e) => (
              <div key={e.area} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate flex-1">{e.area}</span>
                <Badge className={cn("text-[10px] ml-1", ratingColor[e.rating])}>
                  {ratingLabel[e.rating]}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interview coverage ──────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-500" />
            Latest Report Coverage
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">{m.children_interviewed_last}</p>
              <p className="text-[10px] text-muted-foreground">Children Interviewed</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">{m.staff_interviewed_last}</p>
              <p className="text-[10px] text-muted-foreground">Staff Interviewed</p>
            </div>
          </div>
        </div>

        {/* ── Open actions ────────────────────────────────────────────── */}

        {DEMO_ACTIONS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <ClipboardCheck className="h-3 w-3" />
              Open Actions ({m.open_actions})
            </p>
            {DEMO_ACTIONS.map((a, i) => (
              <div key={i} className="rounded border p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate flex-1">{a.description}</span>
                  <Badge className={cn(
                    "text-[10px] ml-1",
                    a.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
                  )}>
                    {a.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{a.area}</span>
                  <Badge className={cn(
                    "text-[10px]",
                    a.status === "overdue" ? "bg-red-100 text-red-700"
                      : a.status === "in_progress" ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700",
                  )}>
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    {a.status === "overdue" ? "Overdue" : a.status === "in_progress" ? "In Progress" : "Open"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Reg 45 Alerts
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
            ARIA Reg 45 Intelligence
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
