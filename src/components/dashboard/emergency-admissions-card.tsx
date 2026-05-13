"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EMERGENCY ADMISSIONS INTELLIGENCE CARD
// Dashboard card for emergency placements, matching, and impact assessments.
// CHR 2015 Reg 35, Reg 14, Reg 12.
// SCCIF: Helped & Protected — "Emergency placements managed safely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Ambulance, ChevronRight, AlertTriangle, Brain,
  Clock, ShieldCheck, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_admissions: 9,
  emergency_count: 4,
  crisis_count: 1,
  planned_count: 3,
  risk_assessment_rate: 77.8,
  placement_plan_rate: 66.7,
  good_match_rate: 71.4,
  poor_match_count: 1,
  significant_impact_count: 1,
};

const DEMO_RECORDS: { child: string; type: string; date: string; match: string }[] = [
  { child: "Child A", type: "Emergency", date: "10 May", match: "Good" },
  { child: "Child B", type: "Crisis", date: "7 May", match: "Poor" },
  { child: "Child C", type: "Planned", date: "3 May", match: "Good" },
  { child: "Child D", type: "Emergency", date: "28 Apr", match: "Acceptable" },
  { child: "Child E", type: "Transfer", date: "22 Apr", match: "Good" },
  { child: "Child F", type: "Emergency", date: "18 Apr", match: "Acceptable" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "significant_impact", severity: "critical", message: "Admission of Child B causing significant impact on existing children — review placement suitability." },
  { type: "no_risk_assessment", severity: "high", message: "Crisis admission of Child B without risk assessment — conduct retrospective assessment." },
  { type: "poor_match", severity: "high", message: "Poor matching outcome for Child B — monitor placement stability and review with placing authority." },
  { type: "no_placement_plan", severity: "medium", message: "3 admissions without placement plan within 24 hours — ensure plans are in place." },
];

const ARIA_INSIGHTS = [
  "9 admissions. Emergency: 4. Crisis: 1. Planned: 3. Risk assessments: 77.8%. Placement plans within 24h: 66.7%. Good match rate: 71.4%. 1 poor match. 1 significant impact.",
  "Priority: Child B's crisis admission has significant impact on existing children with poor matching and no risk assessment — immediate review required. 3 admissions lack placement plans.",
  "Positive: 3 planned admissions show proactive practice. 71.4% good match rate is reasonable. Improve emergency risk assessment completion and 24h placement planning.",
];

const MATCH_BADGES: Record<string, { label: string; color: string }> = {
  "Good": { label: "Good", color: "text-green-700 bg-green-50 border-green-200" },
  "Acceptable": { label: "Accept.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
  "N/A": { label: "N/A", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function EmergencyAdmissionsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Ambulance className="h-4 w-4 text-brand" />
            Emergency Admissions
          </CardTitle>
          <Link href="/emergency-admissions" className="text-xs text-brand hover:underline flex items-center gap-1">
            Admissions <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_admissions}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.risk_assessment_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Risk Assess</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.good_match_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Good Match</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.poor_match_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.poor_match_count > 0 ? "text-red-600" : "text-green-600")}>{m.poor_match_count}</p>
            <p className="text-[10px] text-muted-foreground">Poor Match</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Admissions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = MATCH_BADGES[r.match] ?? MATCH_BADGES["N/A"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.type} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Admission Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Admissions Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
