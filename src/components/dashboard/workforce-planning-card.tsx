"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — WORKFORCE PLANNING INTELLIGENCE CARD
// Dashboard card for staffing levels, vacancies, ratios, and succession.
// CHR 2015 Reg 33/34. SCCIF: Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, ChevronRight, AlertTriangle, Brain,
  UserPlus, Shield, TrendingDown, CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  established_posts: 14,
  filled_posts: 12,
  vacancies: 2,
  vacancy_rate: 14.3,
  agency_count: 2,
  agency_rate: 14.3,
  staff_child_ratio: 2.4,
  meets_ratio: true,
  open_vacancies: 2,
  avg_time_to_fill: 34,
  succession_coverage: 60,
  roles_at_risk: 2,
};

const DEMO_VACANCIES = [
  { title: "Residential Care Worker", role: "residential_care_worker", days: 28, status: "interviewing", applications: 6 },
  { title: "Waking Night Staff", role: "waking_night", days: 42, status: "advertised", applications: 2 },
];

const DEMO_SUCCESSION = [
  { role: "Registered Manager", holder: "Sarah Mitchell", successor: "James Wilson", readiness: "ready_1_year" },
  { role: "Deputy Manager", holder: "James Wilson", successor: "Emma Roberts", readiness: "ready_2_years" },
  { role: "Senior RCW (Day)", holder: "Emma Roberts", successor: null, readiness: "not_identified" },
  { role: "Senior RCW (Night)", holder: "Tom Davies", successor: "Lisa Chen", readiness: "development_needed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "long_vacancy", severity: "high", message: "Waking Night Staff vacancy open for 42 days — only 2 applications received. Consider widening recruitment or increasing salary offer." },
  { type: "succession_gap", severity: "high", message: "No successor identified for Senior RCW (Day) — risk: shift leadership gap if Emma Roberts is absent or promoted." },
];

const ARIA_INSIGHTS = [
  "14 established posts, 12 filled (85.7%). 2 vacancies being actively recruited. Agency usage at 14.3% (2 staff) — just under the 15% threshold. Staff-to-child ratio is 2.4:1, meeting minimum requirements for 5 children.",
  "Recruitment focus: RCW vacancy at interview stage with 6 applicants — likely to fill within 2 weeks. Waking night role struggling to attract — sector-wide shortage. Consider enhanced shift allowance. Average time to fill is 34 days — slightly above sector average of 28 days.",
  "Succession: 2 of 5 critical roles have ready successors (60% coverage). RM succession plan is on track — James Wilson completing Level 5 Leadership. Priority gap: Senior RCW (Day) has no identified successor — recommend development conversation with Tom Davies or Lisa Chen.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const READINESS_BADGES: Record<string, { label: string; color: string }> = {
  ready_now: { label: "Ready Now", color: "text-green-700 bg-green-50 border-green-200" },
  ready_1_year: { label: "1 Year", color: "text-blue-700 bg-blue-50 border-blue-200" },
  ready_2_years: { label: "2 Years", color: "text-amber-700 bg-amber-50 border-amber-200" },
  development_needed: { label: "Dev Needed", color: "text-orange-700 bg-orange-50 border-orange-200" },
  not_identified: { label: "No Successor", color: "text-red-700 bg-red-50 border-red-200" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function WorkforcePlanningCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" />
            Workforce Planning
          </CardTitle>
          <Link href="/workforce-planning" className="text-xs text-brand hover:underline flex items-center gap-1">
            Workforce <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.filled_posts}/{m.established_posts}</p>
            <p className="text-[10px] text-muted-foreground">Filled/Est</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.vacancies === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.vacancies === 0 ? "text-green-600" : "text-amber-600")}>
              {m.vacancies}
            </p>
            <p className="text-[10px] text-muted-foreground">Vacancies</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.agency_rate <= 15 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.agency_rate <= 15 ? "text-green-600" : "text-red-600")}>
              {m.agency_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Agency</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.meets_ratio ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.meets_ratio ? "text-green-600" : "text-red-600")}>
              {m.staff_child_ratio}:1
            </p>
            <p className="text-[10px] text-muted-foreground">Ratio</p>
          </div>
        </div>

        {/* ── Active vacancies ───────────────────────────────────────── */}

        {DEMO_VACANCIES.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <UserPlus className="h-3 w-3" />
              Active Vacancies
            </p>
            <div className="space-y-1">
              {DEMO_VACANCIES.map((v) => (
                <div key={v.title} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate font-medium">{v.title}</span>
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {v.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-1">
                    <span className="text-muted-foreground">{v.applications} apps</span>
                    <span className={cn("tabular-nums font-semibold", v.days > 30 ? "text-amber-600" : "text-blue-600")}>
                      <Clock className="h-3 w-3 inline mr-0.5" />{v.days}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Succession planning ────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Succession Planning ({m.succession_coverage}% Coverage)
          </p>
          <div className="space-y-1">
            {DEMO_SUCCESSION.map((s) => {
              const badge = READINESS_BADGES[s.readiness] ?? READINESS_BADGES.not_identified;
              return (
                <div key={s.role} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{s.role}</span>
                    <span className="text-muted-foreground ml-1">({s.holder})</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {s.successor && (
                      <span className="text-muted-foreground truncate max-w-[80px]">{s.successor}</span>
                    )}
                    <Badge variant="outline" className={cn("text-[10px]", badge.color)}>
                      {badge.label}
                    </Badge>
                  </div>
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
              Workforce Alerts
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
            ARIA Workforce Intelligence
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
