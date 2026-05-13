"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HEALTH & WELLBEING INTELLIGENCE CARD
// Dashboard card for health compliance, appointment tracking, wellbeing
// trends, SDQ analysis, and ARIA health intelligence (Reg 23).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Stethoscope, SmilePlus, TrendingUp, TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  totalChildren: 4,
  immunisationUpToDate: 3,
  dentalUpToDate: 3,
  opticianUpToDate: 2,
  healthAssessmentCurrent: 4,
  camhsActive: 1,
  dnaRate: 5.0,
};

const CHILDREN_HEALTH = [
  {
    name: "Alex W",
    wellbeing: 7,
    trend: "improving" as const,
    sdqBand: "borderline" as const,
    dental: true,
    optician: true,
    immunised: true,
    camhs: "active",
  },
  {
    name: "Tyler R",
    wellbeing: 5,
    trend: "stable" as const,
    sdqBand: "abnormal" as const,
    dental: true,
    optician: false,
    immunised: true,
    camhs: "none",
  },
  {
    name: "Jordan K",
    wellbeing: 8,
    trend: "improving" as const,
    sdqBand: "normal" as const,
    dental: false,
    optician: true,
    immunised: true,
    camhs: "none",
  },
  {
    name: "Sam P",
    wellbeing: 6,
    trend: "declining" as const,
    sdqBand: null,
    dental: true,
    optician: false,
    immunised: false,
    camhs: "referred",
  },
];

const SDQ_COLOURS: Record<string, string> = {
  normal: "bg-green-100 text-green-700",
  borderline: "bg-amber-100 text-amber-700",
  abnormal: "bg-red-100 text-red-700",
};

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "sdq_concern", severity: "high", message: "Tyler R SDQ total difficulties in abnormal range. Review with CAMHS referral team and key worker." },
  { type: "wellbeing_declining", severity: "medium", message: "Sam P wellbeing score declining over last 4 assessments (8 → 6). CAMHS referral submitted — monitor closely." },
];

const ARIA_INSIGHTS = [
  "Alex W's wellbeing is improving following increased CAMHS sessions. SDQ total difficulties moved from abnormal to borderline range over 3 months. Consider whether session frequency can be maintained.",
  "2 children overdue for optician appointments. Jordan K dental appointment also overdue. Schedule routine health checks to maintain Reg 23 compliance.",
  "Positive: All 4 children have current health assessments. 75% immunisation compliance. DNA rate at 5% is below the 10% threshold. Health care standards under Reg 23 are well evidenced.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function HealthWellbeingCard() {
  const c = DEMO_COMPLIANCE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-brand" />
            Health & Wellbeing
          </CardTitle>
          <Link href="/health" className="text-xs text-brand hover:underline flex items-center gap-1">
            Health <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", c.immunisationUpToDate === c.totalChildren ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.immunisationUpToDate === c.totalChildren ? "text-green-600" : "text-amber-600")}>
              {c.immunisationUpToDate}/{c.totalChildren}
            </p>
            <p className="text-[10px] text-muted-foreground">Immunised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.dentalUpToDate === c.totalChildren ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.dentalUpToDate === c.totalChildren ? "text-green-600" : "text-amber-600")}>
              {c.dentalUpToDate}/{c.totalChildren}
            </p>
            <p className="text-[10px] text-muted-foreground">Dental</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.healthAssessmentCurrent === c.totalChildren ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.healthAssessmentCurrent === c.totalChildren ? "text-green-600" : "text-amber-600")}>
              {c.healthAssessmentCurrent}/{c.totalChildren}
            </p>
            <p className="text-[10px] text-muted-foreground">Health Assess.</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.dnaRate <= 10 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.dnaRate <= 10 ? "text-green-600" : "text-red-600")}>
              {c.dnaRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">DNA Rate</p>
          </div>
        </div>

        {/* ── Children's health overview ──────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            Children&apos;s Health
          </p>
          {CHILDREN_HEALTH.map((child, i) => (
            <div key={i} className="rounded-lg border p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.name}</span>
                  {child.sdqBand && (
                    <Badge className={cn("text-[10px]", SDQ_COLOURS[child.sdqBand])}>
                      SDQ {child.sdqBand}
                    </Badge>
                  )}
                  {child.camhs !== "none" && (
                    <Badge className={cn("text-[10px]",
                      child.camhs === "active" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    )}>
                      CAMHS {child.camhs}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <SmilePlus className={cn("h-3 w-3",
                    child.wellbeing >= 7 ? "text-green-500" : child.wellbeing >= 5 ? "text-amber-500" : "text-red-500"
                  )} />
                  <span className="tabular-nums font-medium">{child.wellbeing}/10</span>
                  {child.trend === "improving" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {child.trend === "declining" && <TrendingDown className="h-3 w-3 text-red-500" />}
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className={child.dental ? "text-green-600" : "text-amber-600"}>
                  {child.dental ? "✓" : "✗"} Dental
                </span>
                <span className={child.optician ? "text-green-600" : "text-amber-600"}>
                  {child.optician ? "✓" : "✗"} Optician
                </span>
                <span className={child.immunised ? "text-green-600" : "text-amber-600"}>
                  {child.immunised ? "✓" : "✗"} Immunised
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Health Alerts
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
            ARIA Health Intelligence
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
