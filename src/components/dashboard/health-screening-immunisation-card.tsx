"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Syringe, ChevronRight, AlertTriangle, Brain, Clock, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_screenings: 12, treatment_required_count: 1, referral_needed_count: 2, behind_immunisation_count: 1, high_risk_count: 1, child_consented_rate: 91.7, gp_notified_rate: 75.0, follow_up_rate: 83.3, confidentiality_rate: 91.7, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; immunisation: string }[] = [
  { child: "Child A", type: "Immunisation", outcome: "All Clear", immunisation: "Up to Date" },
  { child: "Child B", type: "Dental", outcome: "Minor Issues", immunisation: "Mostly" },
  { child: "Child C", type: "Mental Health", outcome: "Referral", immunisation: "Behind" },
  { child: "Child D", type: "Optical", outcome: "All Clear", immunisation: "Up to Date" },
  { child: "Child E", type: "BMI/Growth", outcome: "Treatment", immunisation: "Partially" },
  { child: "Child F", type: "Developmental", outcome: "Further Asst.", immunisation: "Mostly" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_risk_no_followup", severity: "critical", message: "Child E has high health risk from BMI/growth check without follow-up arranged." },
  { type: "immunisation_behind", severity: "high", message: "1 screening has children significantly behind on immunisations." },
  { type: "records_not_updated", severity: "medium", message: "2 screenings without health records updated." },
];

const ARIA_INSIGHTS = [
  "12 screenings. Treatment required: 1. Referrals: 2. Behind immunisations: 1. High risk: 1. Consent: 91.7%.",
  "Priority: 1 high-risk without follow-up. 1 significantly behind immunisations. Strengthen GP notifications at 75%.",
  "Positive: Most children consented. Confidentiality maintained well. Age-appropriate explanations provided.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "All Clear": { label: "Clear", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Issues": { label: "Minor", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Referral": { label: "Referral", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Treatment": { label: "Treat.", color: "text-red-700 bg-red-50 border-red-200" },
  "Further Asst.": { label: "Further", color: "text-orange-700 bg-orange-50 border-orange-200" },
};

export function HealthScreeningImmunisationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Syringe className="h-4 w-4 text-brand" />Health Screening</CardTitle>
          <Link href="/health-screening-immunisation" className="text-xs text-brand hover:underline flex items-center gap-1">Screenings <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High Risk</p></div>
          <div className={cn("text-center rounded-lg p-2", m.behind_immunisation_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.behind_immunisation_count === 0 ? "text-green-600" : "text-amber-600")}>{m.behind_immunisation_count}</p><p className="text-[10px] text-muted-foreground">Behind</p></div>
          <div className={cn("text-center rounded-lg p-2", m.referral_needed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.referral_needed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.referral_needed_count}</p><p className="text-[10px] text-muted-foreground">Referrals</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_screenings}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Screenings</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["All Clear"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Stethoscope className="h-3 w-3 text-teal-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.immunisation}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Screening Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Health Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
