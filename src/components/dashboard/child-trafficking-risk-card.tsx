"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandMetal, ChevronRight, AlertTriangle, Brain, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 6, high_risk_count: 1, immediate_count: 0, nrm_referral_rate: 33.3, first_responder_rate: 50.0, safety_plan_rate: 50.0, multi_agency_rate: 50.0, unique_children: 4, unique_assessors: 2 };

const DEMO_RECORDS: { child: string; risk: string; type: string; nrm: string }[] = [
  { child: "Child A", risk: "No Identified Risk", type: "N/A", nrm: "None" },
  { child: "Child B", risk: "Medium", type: "Criminal Exploitation", nrm: "None" },
  { child: "Child C", risk: "High", type: "Sexual Exploitation", nrm: "Pending" },
  { child: "Child A", risk: "Low", type: "Not Determined", nrm: "None" },
  { child: "Child D", risk: "Medium", type: "Labour Exploitation", nrm: "None" },
  { child: "Child C", risk: "High", type: "Criminal Exploitation", nrm: "Reasonable Grounds" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_no_nrm", severity: "critical", message: "Child C at high risk without NRM referral — first responder duty applies." },
  { type: "no_safety_plan", severity: "high", message: "1 high-risk child without safety plan in place." },
  { type: "no_advocate", severity: "medium", message: "1 high-risk child without independent advocate." },
];

const ARIA_INSIGHTS = [
  "6 assessments across 4 children. High risk: 1. Immediate: 0. NRM referrals 33.3%.",
  "Priority: 1 high-risk without NRM referral. First responder notification 50.0%. Safety plans 50.0%.",
  "Trafficking is hidden exploitation. Are first responder duties understood? Is the NRM pathway clear to all staff? Are safe placements genuinely secure?",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "No Identified Risk": { label: "None", color: "text-green-700 bg-green-50 border-green-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-red-700 bg-red-50 border-red-200" },
  "Immediate": { label: "Immediate", color: "text-red-900 bg-red-100 border-red-300" },
};

export function ChildTraffickingRiskCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-fuchsia-200">
      <CardHeader className="pb-3 bg-fuchsia-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HandMetal className="h-4 w-4 text-fuchsia-600" /><span className="text-fuchsia-900">Trafficking Risk</span></CardTitle>
          <Link href="/child-trafficking-risk" className="text-xs text-fuchsia-600 hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.high_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_risk_count}</p><p className="text-[10px] text-muted-foreground">High+</p></div>
          <div className={cn("text-center rounded-lg p-2", m.immediate_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.immediate_count === 0 ? "text-green-600" : "text-red-600")}>{m.immediate_count}</p><p className="text-[10px] text-muted-foreground">Immediate</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
          <div className="text-center rounded-lg p-2 bg-fuchsia-50"><p className="text-lg font-bold tabular-nums text-fuchsia-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["No Identified Risk"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><MapPin className="h-3 w-3 text-fuchsia-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.nrm}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Trafficking Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-fuchsia-700"><Brain className="h-3 w-3" />ARIA Trafficking Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
