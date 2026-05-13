"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — IMPACT & RISK ASSESSMENT INTELLIGENCE CARD
// Dashboard card for placement impact assessments, compatibility,
// risk levels, and ARIA placement intelligence.
// CHR 2015 Reg 12/14/36. SCCIF: Helped & Protected.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield, ChevronRight, AlertTriangle, Brain,
  Target, CheckCircle2, Users, FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_assessments: 8,
  completed: 7,
  pending: 1,
  accepted: 5,
  accepted_with_conditions: 1,
  rejected: 1,
  deferred: 1,
  children_consulted_rate: 100,
  staff_consulted_rate: 100,
  open_mitigations: 2,
};

const DEMO_RECENT = [
  { child: "Child F (referral)", risk: "medium", recommendation: "accept_with_conditions", date: "2026-05-10", status: "in_progress" },
  { child: "Child E", risk: "low", recommendation: "accept", date: "2026-03-20", status: "approved" },
  { child: "Child D", risk: "low", recommendation: "accept", date: "2026-01-15", status: "approved" },
];

const DEMO_RISK_DIST = [
  { level: "Very Low", count: 1 },
  { level: "Low", count: 4 },
  { level: "Medium", count: 2 },
  { level: "High", count: 1 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "mitigations", severity: "medium", message: "Child F's referral assessment has 2 outstanding mitigations: staffing adjustment for night cover and bedroom preparation. Complete before planned placement date." },
];

const ARIA_INSIGHTS = [
  "8 impact risk assessments completed. 5 accepted, 1 accepted with conditions, 1 rejected (incompatible safeguarding profile), 1 currently in progress (Child F). Average risk level: 2.3/5 (low-medium). Children and staff consulted in 100% of completed assessments.",
  "Current referral (Child F): medium risk, age-compatible, no safeguarding conflicts with current residents. 2 conditions: night staffing adjustment needed and bedroom 3 preparation. Compatibility factors: good match on age (13), education needs, and cultural background. Potential concern: behavioural needs overlap with Child B — monitor closely.",
  "Trend: placement stability is strong. No unplanned endings in last 12 months. All impact assessments completed before admission. Reg 14 compliance: 100%. Recommend approving Child F's placement once mitigations are implemented — projected group dynamics remain positive.",
];

const riskColor: Record<string, string> = {
  "Very Low": "bg-green-100 text-green-700",
  Low: "bg-blue-100 text-blue-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
  "Very High": "bg-red-200 text-red-800",
};

const recColor: Record<string, string> = {
  accept: "bg-green-100 text-green-700",
  reject: "bg-red-100 text-red-700",
  accept_with_conditions: "bg-amber-100 text-amber-700",
  defer: "bg-gray-100 text-gray-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function ImpactRiskAssessmentCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            Impact Risk Assessments
          </CardTitle>
          <Link href="/impact-risk-assessment" className="text-xs text-brand hover:underline flex items-center gap-1">
            Assessments <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_assessments}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.accepted}</p>
            <p className="text-[10px] text-muted-foreground">Accepted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.children_consulted_rate === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.children_consulted_rate === 100 ? "text-green-600" : "text-amber-600")}>
              {m.children_consulted_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Consulted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.open_mitigations === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.open_mitigations === 0 ? "text-green-600" : "text-amber-600")}>
              {m.open_mitigations}
            </p>
            <p className="text-[10px] text-muted-foreground">Open Mitig.</p>
          </div>
        </div>

        {/* ── Recent assessments ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <FileSearch className="h-3 w-3" />
            Recent Assessments
          </p>
          {DEMO_RECENT.map((a) => (
            <div key={a.child} className="rounded border p-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{a.child}</span>
                <Badge className={cn("text-[10px]", riskColor[a.risk.charAt(0).toUpperCase() + a.risk.slice(1)] ?? "bg-gray-100 text-gray-700")}>
                  {a.risk}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <Badge className={cn("text-[10px]", recColor[a.recommendation])}>
                  {a.recommendation.replace(/_/g, " ")}
                </Badge>
                <span>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Risk distribution ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Target className="h-3 w-3 text-blue-500" />
            Risk Distribution
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {DEMO_RISK_DIST.map((r) => (
              <div key={r.level} className="text-center">
                <Badge className={cn("text-[10px] w-full justify-center", riskColor[r.level])}>
                  {r.count}
                </Badge>
                <p className="text-[9px] text-muted-foreground mt-0.5">{r.level}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t">
            <div className="text-center">
              <CheckCircle2 className="h-4 w-4 mx-auto text-green-500" />
              <p className="text-[10px] text-muted-foreground">All consulted</p>
            </div>
            <div className="text-center">
              <Users className="h-4 w-4 mx-auto text-green-500" />
              <p className="text-[10px] text-muted-foreground">Staff consulted</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Assessment Alerts
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
            ARIA Placement Intelligence
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
