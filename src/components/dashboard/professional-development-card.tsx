"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PROFESSIONAL DEVELOPMENT INTELLIGENCE CARD
// Dashboard card for CPD tracking, qualifications, and development goals.
// CHR 2015 Reg 33/34. SCCIF: Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, ChevronRight, AlertTriangle, Brain,
  BookOpen, Award, Target, Clock, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_cpd_hours: 342,
  avg_cpd_hours_per_staff: 28.5,
  cpd_this_quarter: 18,
  cpd_hours_this_quarter: 96,
  staff_with_cpd: 10,
  qualifications_achieved: 24,
  qualifications_in_progress: 5,
  qualifications_expired: 1,
  qualifications_expiring_soon: 2,
  goals_completed: 8,
  goals_in_progress: 12,
  goals_overdue: 2,
};

const DEMO_STAFF_CPD = [
  { name: "Sarah Mitchell", hours: 42, recentActivity: "Attachment & Trauma workshop", qualified: true },
  { name: "James Wilson", hours: 38, recentActivity: "Level 5 Leadership module 3", qualified: true },
  { name: "Emma Roberts", hours: 32, recentActivity: "Safeguarding refresher", qualified: true },
  { name: "Tom Davies", hours: 28, recentActivity: "PACE approach training", qualified: true },
  { name: "Lisa Chen", hours: 24, recentActivity: "First Aid renewal", qualified: false },
];

const DEMO_EXPIRING = [
  { staff: "Lisa Chen", qualification: "Level 3 Diploma", expiryDate: "2026-06-15" },
  { staff: "Tom Davies", qualification: "First Aid at Work", expiryDate: "2026-06-28" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "qualification_expired", severity: "critical", message: "Mark Taylor's Manual Handling certificate expired 2 weeks ago — renewal must be completed urgently." },
  { type: "goal_overdue", severity: "medium", message: "2 development goals are overdue — review with staff in next supervision." },
];

const ARIA_INSIGHTS = [
  "12 staff have active CPD records — 342 total hours logged (avg 28.5 per person). 18 CPD activities completed this quarter. All staff have completed mandatory safeguarding training. 5 staff are working towards qualifications.",
  "Focus areas: (1) Mark Taylor's manual handling expired — booking renewal this week. (2) 2 qualifications expiring within 30 days (Lisa Chen Level 3, Tom Davies First Aid). (3) 2 development goals overdue — both from staff who had sickness absence last month.",
  "Strength: CPD hours are 40% above sector average. 80% of CPD includes evidenced impact on practice. Recommend: audit learning outcomes quarterly to ensure CPD translates to improved care quality. Consider peer learning sessions — 3 staff completed specialist trauma training that could benefit the whole team.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function ProfessionalDevelopmentCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand" />
            Professional Development
          </CardTitle>
          <Link href="/professional-development" className="text-xs text-brand hover:underline flex items-center gap-1">
            CPD <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_cpd_hours}</p>
            <p className="text-[10px] text-muted-foreground">CPD Hours</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.qualifications_achieved}</p>
            <p className="text-[10px] text-muted-foreground">Qualified</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.qualifications_expired === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.qualifications_expired === 0 ? "text-green-600" : "text-red-600")}>
              {m.qualifications_expired}
            </p>
            <p className="text-[10px] text-muted-foreground">Expired</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.goals_overdue === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.goals_overdue === 0 ? "text-green-600" : "text-amber-600")}>
              {m.goals_in_progress}
            </p>
            <p className="text-[10px] text-muted-foreground">Goals Active</p>
          </div>
        </div>

        {/* ── Staff CPD summary ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Staff CPD Activity
          </p>
          <div className="space-y-1">
            {DEMO_STAFF_CPD.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded border p-2 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="truncate font-medium">{s.name}</span>
                  {s.qualified && (
                    <Badge variant="outline" className="shrink-0 text-[10px] border-green-200 text-green-700 bg-green-50">
                      <Award className="h-2.5 w-2.5 mr-0.5" /> Qualified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-muted-foreground truncate max-w-[120px]">{s.recentActivity}</span>
                  <span className="tabular-nums font-semibold text-blue-600">{s.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Expiring qualifications ────────────────────────────────── */}

        {DEMO_EXPIRING.length > 0 && (
          <div className="rounded-lg border p-3 space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-500" />
              Expiring Within 30 Days
            </p>
            {DEMO_EXPIRING.map((e) => (
              <div key={`${e.staff}-${e.qualification}`} className="flex items-center justify-between text-xs">
                <span className="truncate flex-1">{e.staff} — {e.qualification}</span>
                <span className="text-amber-600 font-semibold shrink-0 ml-1">{e.expiryDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Development goals ──────────────────────────────────────── */}

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded border p-2">
            <p className="text-sm font-bold tabular-nums text-green-600">{m.goals_completed}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5" /> Completed
            </p>
          </div>
          <div className="text-center rounded border p-2">
            <p className="text-sm font-bold tabular-nums text-blue-600">{m.goals_in_progress}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <Target className="h-2.5 w-2.5" /> In Progress
            </p>
          </div>
          <div className={cn("text-center rounded border p-2", m.goals_overdue > 0 && "border-amber-200 bg-amber-50")}>
            <p className={cn("text-sm font-bold tabular-nums", m.goals_overdue > 0 ? "text-amber-600" : "text-green-600")}>{m.goals_overdue}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <AlertTriangle className="h-2.5 w-2.5" /> Overdue
            </p>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              CPD Alerts
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

        {/* ── ARIA insights ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Development Intelligence
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
