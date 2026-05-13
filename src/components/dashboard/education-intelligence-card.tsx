"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EDUCATION & ACTIVITIES INTELLIGENCE CARD
// Dashboard card for education status, attendance tracking, enrichment
// activities, and ARIA education intelligence (Reg 8 & 10).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, BookOpen, Trophy, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_PROFILE = {
  totalChildren: 4,
  neetCount: 0,
  excludedCount: 0,
  senCount: 2,
  ehcpCount: 1,
  avgAttendance: 91.3,
  pepOverdue: 1,
  activityCount30d: 18,
};

const CHILDREN_EDUCATION = [
  { name: "Alex W", status: "Full-Time School", school: "Oakwood Academy", attendance: 94.2, sen: "EHCP" },
  { name: "Tyler R", status: "Alternative Provision", school: "Bridge Centre", attendance: 87.5, sen: "SEN Support" },
  { name: "Jordan K", status: "College", school: "City College", attendance: 92.0, sen: null },
  { name: "Sam P", status: "Full-Time School", school: "Riverside High", attendance: 89.4, sen: null },
];

const ACTIVITY_SUMMARY = {
  sport: 6,
  creative: 4,
  social: 3,
  life_skills: 3,
  outdoor: 2,
};

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "low_attendance", severity: "medium", message: "Tyler R attendance at 87.5% — below 90% threshold. Review attendance plan with alternative provision.", },
  { type: "pep_overdue", severity: "medium", message: "Sam P — PEP review is overdue. Schedule with virtual school head and designated teacher.", },
];

const ARIA_INSIGHTS = [
  "Tyler R's attendance has improved from 82% to 87.5% since moving to alternative provision 6 weeks ago. Consider whether the reduced timetable can be gradually extended.",
  "18 enrichment activities recorded this month across 4 children. Sport and creative arts are the most popular categories. Jordan K has not participated in any community activities — consider opportunities.",
  "Positive: Zero NEET children and no current exclusions. All 4 children have active education placements with designated teachers identified. Reg 8 education standards well evidenced.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function EducationIntelligenceCard() {
  const p = DEMO_PROFILE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand" />
            Education & Activities
          </CardTitle>
          <Link href="/education" className="text-xs text-brand hover:underline flex items-center gap-1">
            Education <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: p.avgAttendance >= 90 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", p.avgAttendance >= 90 ? "text-green-600" : "text-amber-600")}>
              {p.avgAttendance}%
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Attendance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", p.neetCount > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", p.neetCount > 0 ? "text-red-600" : "text-green-600")}>
              {p.neetCount}
            </p>
            <p className="text-[10px] text-muted-foreground">NEET</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{p.senCount}</p>
            <p className="text-[10px] text-muted-foreground">SEN/EHCP</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">{p.activityCount30d}</p>
            <p className="text-[10px] text-muted-foreground">Activities (30d)</p>
          </div>
        </div>

        {/* ── Children's education status ──────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Education Placements
          </p>
          {CHILDREN_EDUCATION.map((child, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.name}</span>
                  {child.sen && (
                    <Badge className="text-[10px] bg-blue-100 text-blue-700">{child.sen}</Badge>
                  )}
                </div>
                <span className={cn(
                  "font-medium tabular-nums",
                  child.attendance >= 90 ? "text-green-600" : child.attendance >= 85 ? "text-amber-600" : "text-red-600",
                )}>
                  {child.attendance}%
                </span>
              </div>
              <p className="text-muted-foreground">{child.status} · {child.school}</p>
            </div>
          ))}
        </div>

        {/* ── Activity breakdown ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            Enrichment Activities (30 days)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(ACTIVITY_SUMMARY).map(([cat, count]) => (
              <Badge key={cat} variant="outline" className="text-[10px] gap-1">
                {cat.replace("_", " ")} <span className="font-bold">{count}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Education Alerts
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

        {/* ── PEP status bar ──────────────────────────────────────────── */}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Calendar className={cn("h-4 w-4", p.pepOverdue > 0 ? "text-amber-500" : "text-green-500")} />
            <div>
              <p className="text-xs font-medium">PEP Reviews</p>
              <p className="text-[10px] text-muted-foreground">Personal Education Plans</p>
            </div>
          </div>
          {p.pepOverdue > 0 ? (
            <Badge className="text-[10px] bg-amber-100 text-amber-700">
              {p.pepOverdue} overdue
            </Badge>
          ) : (
            <Badge className="text-[10px] bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              All current
            </Badge>
          )}
        </div>

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Education Intelligence
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
