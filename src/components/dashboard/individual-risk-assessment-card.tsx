"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — INDIVIDUAL RISK ASSESSMENT INTELLIGENCE CARD
// Dashboard card for per-child risk assessments and management.
// CHR 2015 Reg 12, Reg 13, Reg 34.
// SCCIF: Helped & Protected — "Individual risks are identified,
// assessed, and managed with clear plans."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCog, ChevronRight, AlertTriangle, Brain,
  Shield, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_assessments: 15,
  children_assessed: 5,
  assessment_coverage: 83.3,
  very_high_count: 1,
  high_count: 4,
  expired_count: 2,
  staff_aware_rate: 80.0,
};

const DEMO_ASSESSMENTS: { child: string; domain: string; rating: string; status: string }[] = [
  { child: "Child A", domain: "Self-Harm", rating: "Very High", status: "Current" },
  { child: "Child B", domain: "Absconding", rating: "High", status: "Current" },
  { child: "Child C", domain: "CSE", rating: "High", status: "Current" },
  { child: "Child D", domain: "Aggression", rating: "Medium", status: "Current" },
  { child: "Child A", domain: "Substance Misuse", rating: "High", status: "Current" },
  { child: "Child E", domain: "Online Risk", rating: "Low", status: "Expired" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_high_risk", severity: "critical", message: "Very high self-harm risk for Child A — requires enhanced monitoring and multi-agency response." },
  { type: "expired_high_risk", severity: "critical", message: "High CSE risk assessment for Child C has expired — reassess immediately." },
  { type: "staff_not_aware", severity: "high", message: "Staff not aware of Child B's absconding risk (high) — brief all staff immediately." },
  { type: "no_assessment", severity: "medium", message: "1 child has no individual risk assessment — all children should have assessed risks documented." },
];

const ARIA_INSIGHTS = [
  "15 individual risk assessments across 5 of 6 children (83.3%). 1 very high, 4 high, 2 expired. Staff awareness: 80%. Multi-agency involved in 40% of assessments.",
  "Priority: Child A's very high self-harm risk needs daily monitoring plan review. Child C's CSE assessment expired — critical gap in safeguarding oversight. 1 child completely unassessed. 3 assessments lack management strategies.",
  "Positive: 80% staff awareness of risks shows good communication. Child D's aggression risk well-managed with 5 strategies documented. Consider themed risk supervision sessions and linking individual risks to BSPs where applicable.",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Very High": { label: "Very High", color: "text-red-700 bg-red-50 border-red-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Minimal": { label: "Minimal", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function IndividualRiskAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCog className="h-4 w-4 text-brand" />
            Individual Risk Assessments
          </CardTitle>
          <Link href="/individual-risk-assessments" className="text-xs text-brand hover:underline flex items-center gap-1">
            Assessments <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.very_high_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.very_high_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_high_count}</p>
            <p className="text-[10px] text-muted-foreground">V.High</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.high_count === 0 ? "bg-green-50" : "bg-orange-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.high_count === 0 ? "text-green-600" : "text-orange-600")}>{m.high_count}</p>
            <p className="text-[10px] text-muted-foreground">High</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.expired_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.expired_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_count}</p>
            <p className="text-[10px] text-muted-foreground">Expired</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.staff_aware_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Aware</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" />Risk Assessments</p>
          <div className="space-y-1">
            {DEMO_ASSESSMENTS.map((a, i) => {
              const badge = RATING_BADGES[a.rating] ?? RATING_BADGES["Medium"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{a.child}</span>
                    <span className="text-muted-foreground truncate">{a.domain} · {a.status}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Risk Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Individual Risk Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
