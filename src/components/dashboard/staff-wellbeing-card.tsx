"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF WELLBEING INTELLIGENCE CARD
// Dashboard card for staff mental health, stress levels, debriefing,
// support access, and ARIA wellbeing intelligence.
// CHR 2015 Reg 33 (staff support), Reg 34 (employment policies).
// SCCIF: Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse, ChevronRight, AlertTriangle, Brain,
  Smile, BarChart3, Shield, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  staff_checked: 8,
  total_staff: 8,
  avg_wellbeing: 3.9,
  avg_stress: 2.4,
  struggling_or_crisis: 0,
  workload_manageable_rate: 88,
  feeling_supported_rate: 100,
  debriefs_this_quarter: 2,
  overdue_follow_ups: 0,
};

const DEMO_WELLBEING_DIST = [
  { rating: "Excellent", count: 2, color: "bg-green-100 text-green-700" },
  { rating: "Good", count: 4, color: "bg-blue-100 text-blue-700" },
  { rating: "Fair", count: 2, color: "bg-amber-100 text-amber-700" },
  { rating: "Struggling", count: 0, color: "bg-red-100 text-red-700" },
];

const DEMO_RECENT_DEBRIEFS = [
  { date: "2026-05-02", trigger: "Restraint", staff: 3, followUp: true },
  { date: "2026-04-18", trigger: "Missing child", staff: 4, followUp: false },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [];

const ARIA_INSIGHTS = [
  "All 8 staff have had wellbeing checks this quarter. Average wellbeing: 3.9/5 (good). Average stress: 2.4/5 (low-moderate). No staff currently struggling or in crisis. 100% feel supported. 88% report manageable workloads — 1 staff member flagged workload concerns, addressed through rota adjustment.",
  "2 debriefs this quarter: post-restraint (3 staff, 2 May) and missing child incident (4 staff, 18 April). All follow-ups completed. Support offered and accepted in both cases. No ongoing wellbeing concerns arising from either incident.",
  "Trend: staff wellbeing is stable-to-improving. Sickness absence below sector average. EAP utilisation: 1 referral this quarter (voluntary, resolved). Team morale positive — staff report feeling valued and included in decision-making. Recommend: continue quarterly wellbeing checks and maintain open-door support culture.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function StaffWellbeingCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-brand" />
            Staff Wellbeing
          </CardTitle>
          <Link href="/staff-wellbeing" className="text-xs text-brand hover:underline flex items-center gap-1">
            Checks <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.staff_checked === m.total_staff ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.staff_checked === m.total_staff ? "text-green-600" : "text-amber-600")}>
              {m.staff_checked}/{m.total_staff}
            </p>
            <p className="text-[10px] text-muted-foreground">Checked</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.avg_wellbeing >= 3.5 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.avg_wellbeing >= 3.5 ? "text-green-600" : "text-amber-600")}>
              {m.avg_wellbeing}
            </p>
            <p className="text-[10px] text-muted-foreground">Wellbeing</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.avg_stress <= 3.0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.avg_stress <= 3.0 ? "text-green-600" : "text-amber-600")}>
              {m.avg_stress}
            </p>
            <p className="text-[10px] text-muted-foreground">Stress /5</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.feeling_supported_rate === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.feeling_supported_rate === 100 ? "text-green-600" : "text-amber-600")}>
              {m.feeling_supported_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Supported</p>
          </div>
        </div>

        {/* ── Wellbeing distribution ──────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Smile className="h-3 w-3 text-blue-500" />
            Wellbeing Ratings
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {DEMO_WELLBEING_DIST.map((r) => (
              <div key={r.rating} className="text-center">
                <Badge className={cn("text-[10px] w-full justify-center", r.color)}>
                  {r.count}
                </Badge>
                <p className="text-[9px] text-muted-foreground mt-0.5">{r.rating}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Workload OK
              </span>
              <span className="font-bold tabular-nums text-green-600">{m.workload_manageable_rate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Debriefs (Q)
              </span>
              <span className="font-bold tabular-nums text-blue-600">{m.debriefs_this_quarter}</span>
            </div>
          </div>
        </div>

        {/* ── Recent debriefs ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            Recent Debriefs
          </p>
          {DEMO_RECENT_DEBRIEFS.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{d.trigger}</span>
                <span className="text-muted-foreground">
                  {new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] tabular-nums">{d.staff} staff</Badge>
                <Badge className={cn("text-[10px]", !d.followUp ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                  {d.followUp ? "follow-up due" : "complete"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Wellbeing Alerts
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
            ARIA Wellbeing Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-blue-200 bg-blue-50 text-blue-800"
                  : i === 1 ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-800",
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
