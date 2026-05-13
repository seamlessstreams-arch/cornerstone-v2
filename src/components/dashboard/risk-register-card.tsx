"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — RISK REGISTER INTELLIGENCE CARD
// Dashboard card for organisational risk management overview.
// CHR 2015 Reg 13 (risk management), Reg 40, Reg 45.
// SCCIF: Leadership & Management — "Risks are identified, managed,
// and regularly reviewed."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ChevronRight, AlertTriangle, Brain,
  Target, CheckCircle2, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_risks: 12,
  open_risks: 5,
  critical_risks: 1,
  high_risks: 3,
  escalated_risks: 1,
  review_overdue_count: 2,
  risks_without_mitigations: 1,
  average_risk_score: 9.2,
};

const DEMO_RISKS: { title: string; category: string; score: number; level: string; status: string }[] = [
  { title: "Staff vacancy — senior carer", category: "Staffing", score: 20, level: "Critical", status: "Escalated" },
  { title: "Safeguarding allegation procedure", category: "Safeguarding", score: 16, level: "High", status: "Open" },
  { title: "Fire evacuation compliance", category: "Health & Safety", score: 12, level: "High", status: "Open" },
  { title: "Medication storage temperature", category: "Operational", score: 9, level: "Medium", status: "Mitigated" },
  { title: "Ofsted rating perception", category: "Reputational", score: 8, level: "Medium", status: "Monitoring" },
  { title: "Budget variance Q2", category: "Financial", score: 4, level: "Low", status: "Open" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_risk", severity: "critical", message: "Critical risk: Staff vacancy — senior carer (score 20) — requires immediate management attention and escalation." },
  { type: "safeguarding_risk", severity: "high", message: "High safeguarding risk: Safeguarding allegation procedure (score 16) — ensure robust safeguarding measures in place." },
  { type: "no_mitigations", severity: "high", message: "Risk \"Budget variance Q2\" has no mitigation strategies — identify and implement controls." },
  { type: "review_overdue", severity: "medium", message: "2 risk reviews overdue — review and update risk assessments." },
];

const ARIA_INSIGHTS = [
  "12 risks tracked: 5 open, 1 critical (score 20), 3 high. 1 escalated to senior management. 2 review overdue. 1 risk without mitigations. Average score: 9.2.",
  "Priority: Critical staffing risk (score 20) escalated — recruitment urgently needed. Safeguarding procedure risk at score 16 needs robust controls. 2 overdue reviews must be completed this week. Budget risk needs mitigation strategies.",
  "Positive: Medication storage risk successfully mitigated. Reputational risk being actively monitored. Risk register is proactive and well-maintained. Consider linking staffing risk to contingency planning and succession protocols.",
];

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  "Critical": { label: "Critical", color: "text-red-700 bg-red-50 border-red-200" },
  "High": { label: "High", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
};

export function RiskRegisterCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Risk Register
          </CardTitle>
          <Link href="/risk-register" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.critical_risks === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.critical_risks === 0 ? "text-green-600" : "text-red-600")}>{m.critical_risks}</p>
            <p className="text-[10px] text-muted-foreground">Critical</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.high_risks === 0 ? "bg-green-50" : "bg-orange-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.high_risks === 0 ? "text-green-600" : "text-orange-600")}>{m.high_risks}</p>
            <p className="text-[10px] text-muted-foreground">High</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_risks === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.escalated_risks === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_risks}</p>
            <p className="text-[10px] text-muted-foreground">Escalated</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.review_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.review_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.review_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" />Risk Overview</p>
          <div className="space-y-1">
            {DEMO_RISKS.map((r, i) => {
              const badge = LEVEL_BADGES[r.level] ?? LEVEL_BADGES["Low"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <TrendingUp className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium truncate">{r.title}</span>
                    <span className="text-muted-foreground shrink-0">({r.score})</span>
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
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Risk Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
