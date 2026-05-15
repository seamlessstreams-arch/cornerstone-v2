"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, ChevronRight, AlertTriangle, Brain, Clock, FireExtinguisher } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, high_risk_count: 0, intolerable_count: 0, non_compliant_count: 0, major_deficiency_count: 1, escape_routes_rate: 87.5, fire_doors_rate: 75.0, detection_rate: 87.5, extinguishers_rate: 75.0, evacuation_plan_rate: 87.5, staff_trained_rate: 75.0, fire_drills_rate: 62.5, compartmentation_rate: 87.5, unique_assessors: 3 };

const DEMO_RECORDS: { assessor: string; area: string; risk: string; compliance: string }[] = [
  { assessor: "D. Laville", area: "Escape Routes", risk: "Low", compliance: "Compliant" },
  { assessor: "J. Hughes", area: "Detection", risk: "Low", compliance: "Compliant" },
  { assessor: "D. Laville", area: "Fire Doors", risk: "Medium", compliance: "Minor Def." },
  { assessor: "L. Jones", area: "Housekeeping", risk: "Low", compliance: "Compliant" },
  { assessor: "J. Hughes", area: "Electrical", risk: "Medium", compliance: "Major Def." },
  { assessor: "D. Laville", area: "Emergency Lt.", risk: "Low", compliance: "Compliant" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "escape_routes", severity: "high", message: "1 assessment with escape routes not clear — immediate corrective action needed." },
  { type: "fire_drills", severity: "medium", message: "3 areas where fire drills not completed — schedule immediately." },
  { type: "peep_missing", severity: "medium", message: "2 assessments without Personal Emergency Evacuation Plan in place." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 3 assessors. High risk: 0. Intolerable: 0. Major deficiency: 1.",
  "Priority: 1 major deficiency. Fire drills 62.5%. Staff trained 75.0%.",
  "Fire safety saves lives. Are drills realistic? Are PEEPs current for every child? Is compartmentation intact and tested?",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "Low": { label: "Low", color: "text-green-700 bg-green-50 border-green-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Significant": { label: "Signif.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "High": { label: "High", color: "text-red-700 bg-red-50 border-red-200" },
  "Intolerable": { label: "Intoler.", color: "text-red-900 bg-red-100 border-red-300" },
};

export function HomeFireRiskAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-red-200">
      <CardHeader className="pb-3 bg-red-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Flame className="h-4 w-4 text-red-600" /><span className="text-red-900">Fire Risk</span></CardTitle>
          <Link href="/home-fire-risk-assessment" className="text-xs text-red-600 hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.intolerable_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.intolerable_count === 0 ? "text-green-600" : "text-red-600")}>{m.intolerable_count}</p><p className="text-[10px] text-muted-foreground">Intolerable</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-amber-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className="text-center rounded-lg p-2 bg-red-50"><p className="text-lg font-bold tabular-nums text-red-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["Low"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FireExtinguisher className="h-3 w-3 text-red-500 shrink-0" /><span className="font-medium">{r.assessor}</span><span className="text-muted-foreground truncate">{r.area} · {r.compliance}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fire Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-red-700"><Brain className="h-3 w-3" />ARIA Fire Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-red-200 bg-red-50 text-red-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
