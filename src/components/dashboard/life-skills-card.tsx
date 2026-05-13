"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — LIFE SKILLS & INDEPENDENCE INTELLIGENCE CARD
// Dashboard card for independence readiness, skill assessments,
// pathway planning, and ARIA independence intelligence (Reg 8/9/14).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, Target, Star, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_OVERVIEW = {
  totalChildren: 4,
  avgReadiness: 52.5,
  childrenWithPathwayPlans: 2,
  pathwayPlansActive: 2,
};

const CHILD_READINESS = [
  { name: "Alex W", age: 17, readiness: 68, pathwayPlan: true, strongest: "Personal Care", weakest: "Money Management" },
  { name: "Tyler R", age: 16, readiness: 45, pathwayPlan: true, strongest: "Social Networks", weakest: "Cooking & Nutrition" },
  { name: "Jordan M", age: 14, readiness: 52, pathwayPlan: false, strongest: "Practical Skills", weakest: "Home Management" },
  { name: "Casey L", age: 13, readiness: 45, pathwayPlan: false, strongest: "Emotional Wellbeing", weakest: "Education & Employment" },
];

const DOMAIN_AVERAGES = [
  { domain: "Personal Care", avg: 72 },
  { domain: "Social Networks", avg: 65 },
  { domain: "Practical Skills", avg: 58 },
  { domain: "Emotional Wellbeing", avg: 55 },
  { domain: "Cooking & Nutrition", avg: 48 },
  { domain: "Education & Employment", avg: 42 },
  { domain: "Home Management", avg: 38 },
  { domain: "Money Management", avg: 32 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "low_readiness", severity: "medium", message: "Money Management is the weakest domain across the home (32% avg). Consider group sessions on budgeting and banking." },
  { type: "pathway_plan", severity: "medium", message: "Tyler R turns 17 in 3 months — pathway plan needs review. Accommodation and education plans need updating." },
];

const ARIA_INSIGHTS = [
  "Alex W (17) has the highest independence readiness at 68% — strong in personal care but needs support with money management. With pathway plan active and target move in 8 months, focus weekly key work sessions on budgeting skills.",
  "Home-wide, personal care and social networks are strongest domains. Money management and home management are weakest. Consider a structured programme covering cooking, budgeting and cleaning for all children. Reg 8 enjoyment & achievement standards partially evidenced.",
  "Positive: Both 16+ children have active pathway plans. All 4 children have had skills assessments in the last 60 days. Tyler R has improved 12 points in practical skills since last assessment. Reg 14 pathway planning requirements met for eligible children.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function LifeSkillsCard() {
  const o = DEMO_OVERVIEW;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Compass className="h-4 w-4 text-brand" />
            Life Skills & Independence
          </CardTitle>
          <Link href="/life-skills" className="text-xs text-brand hover:underline flex items-center gap-1">
            Skills <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2" style={{ background: o.avgReadiness >= 60 ? "hsl(var(--chart-2) / 0.1)" : "hsl(var(--destructive) / 0.08)" }}>
            <p className={cn("text-lg font-bold tabular-nums", o.avgReadiness >= 60 ? "text-green-600" : "text-amber-600")}>
              {o.avgReadiness}%
            </p>
            <p className="text-[10px] text-muted-foreground">Readiness</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {o.totalChildren}
            </p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">
              {o.pathwayPlansActive}
            </p>
            <p className="text-[10px] text-muted-foreground">Pathways</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">
              8
            </p>
            <p className="text-[10px] text-muted-foreground">Domains</p>
          </div>
        </div>

        {/* ── Child readiness ──────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Target className="h-3 w-3" />
            Independence Readiness
          </p>
          {CHILD_READINESS.map((child) => (
            <div key={child.name} className="rounded-lg border p-2.5 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.name}</span>
                  <span className="text-muted-foreground">age {child.age}</span>
                  {child.pathwayPlan && (
                    <Badge className="text-[10px] bg-purple-100 text-purple-700">
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      Pathway
                    </Badge>
                  )}
                </div>
                <Badge className={cn(
                  "text-[10px]",
                  child.readiness >= 60 ? "bg-green-100 text-green-700"
                    : child.readiness >= 40 ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700",
                )}>
                  {child.readiness}%
                </Badge>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    child.readiness >= 60 ? "bg-green-400"
                      : child.readiness >= 40 ? "bg-amber-400"
                      : "bg-red-400",
                  )}
                  style={{ width: `${child.readiness}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                <span>
                  <Star className="h-2.5 w-2.5 inline mr-0.5 text-green-500" />
                  {child.strongest}
                </span>
                <span>
                  <AlertTriangle className="h-2.5 w-2.5 inline mr-0.5 text-amber-500" />
                  {child.weakest}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Domain averages ──────────────────────────────────────────── */}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Skill Domains (Home Average)</p>
          <div className="space-y-1">
            {DOMAIN_AVERAGES.map((d) => (
              <div key={d.domain} className="flex items-center gap-2 text-xs">
                <span className="w-36 text-muted-foreground">{d.domain}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      d.avg >= 60 ? "bg-green-400" : d.avg >= 40 ? "bg-amber-400" : "bg-red-400",
                    )}
                    style={{ width: `${d.avg}%` }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums font-medium">{d.avg}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Independence Alerts
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
            ARIA Independence Intelligence
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
