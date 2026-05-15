"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldQuestion, ChevronRight, AlertTriangle, Brain, Clock, Scan } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 6, high_risk_count: 2, severe_impact_count: 2, active_count: 3, unapproved_count: 3, staff_notified_rate: 50.0, children_safeguarded_rate: 66.7, proportionate_rate: 50.0, alternatives_considered_rate: 33.3, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; area: string; likelihood: string; impact: string }[] = [
  { staff: "Staff A", area: "Boundaries", likelihood: "Likely", impact: "Major" },
  { staff: "Staff B", area: "Medication", likelihood: "Possible", impact: "Moderate" },
  { staff: "Staff C", area: "Lone Working", likelihood: "Very Likely", impact: "Severe" },
  { staff: "Staff D", area: "Allegations", likelihood: "Unlikely", impact: "Major" },
  { staff: "Staff E", area: "Resilience", likelihood: "Possible", impact: "Minor" },
  { staff: "Staff F", area: "Errors", likelihood: "Possible", impact: "Moderate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_risk_severe_impact", severity: "critical", message: "Staff C has a high-likelihood, severe-impact practice risk in lone working — immediate review required." },
  { type: "staff_not_notified", severity: "high", message: "3 assessments have staff not yet notified." },
  { type: "children_not_safeguarded", severity: "high", message: "2 assessments have children safeguarding not confirmed." },
];

const ARIA_INSIGHTS = [
  "6 assessments across 5 staff. High risk: 2. Severe impact: 2. Active: 3. Unapproved: 3.",
  "Priority: 2 high-risk cases. Children safeguarded in only 66.7%. Proportionality checked only 50.0%.",
  "Protective, not punitive. What support is needed? What controls are proportionate? Is this fair?",
];

const IMPACT_BADGES: Record<string, { label: string; color: string }> = {
  "Minimal": { label: "Min.", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Moderate": { label: "Mod.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Major": { label: "Major", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Severe": { label: "Severe", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffPracticeRiskAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Practice Risk</span></CardTitle>
          <Link href="/staff-practice-risk-assessment" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High Risk</p></div>
          <div className={cn("text-center rounded-lg p-2", m.severe_impact_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.severe_impact_count === 0 ? "text-green-600" : "text-amber-600")}>{m.severe_impact_count}</p><p className="text-[10px] text-muted-foreground">Severe Imp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unapproved_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unapproved_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unapproved_count}</p><p className="text-[10px] text-muted-foreground">Unapproved</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = IMPACT_BADGES[r.impact] ?? IMPACT_BADGES["Moderate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Scan className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.area} · {r.likelihood}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Practice Risk Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Risk Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
