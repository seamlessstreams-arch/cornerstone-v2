"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, ChevronRight, AlertTriangle, Brain, Clock, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 10, incompatible_count: 1, high_risk_count: 1, unacceptable_risk_count: 0, emergency_sharing_count: 1, child_consent_rate: 80.0, safeguarding_check_rate: 90.0, privacy_maintained_rate: 80.0, unique_children: 6 };

const DEMO_RECORDS: { child: string; arrangement: string; compatibility: string; risk: string }[] = [
  { child: "Child A", arrangement: "Single", compatibility: "N/A", risk: "None" },
  { child: "Child B", arrangement: "Shared", compatibility: "Compatible", risk: "Low" },
  { child: "Child C", arrangement: "Shared", compatibility: "Manageable", risk: "Medium" },
  { child: "Child D", arrangement: "Emergency", compatibility: "Not Assessed", risk: "High" },
  { child: "Child E", arrangement: "Choice", compatibility: "Highly Compat", risk: "None" },
  { child: "Child F", arrangement: "Temporary", compatibility: "Incompatible", risk: "Medium" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_child_consent", severity: "high", message: "2 room sharing arrangements have no child consent obtained." },
  { type: "risk_assessment_outdated", severity: "high", message: "1 assessment has risk assessment not current." },
  { type: "privacy_not_maintained", severity: "medium", message: "2 assessments show privacy not maintained." },
];

const ARIA_INSIGHTS = [
  "10 assessments. 6 children. Incompatible: 1. High risk: 1. Consent: 80%. Safeguarding: 90%.",
  "Priority: 2 no consent. 1 risk outdated. 2 privacy issues. Strengthen room sharing protocols.",
  "Positive: Most single rooms. Compatibility checks regular. Children's preferences increasingly respected.",
];

const RISK_BADGES: Record<string, { label: string; color: string }> = {
  "None": { label: "None", color: "text-green-700 bg-green-50 border-green-200" },
  "Low": { label: "Low", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Medium": { label: "Medium", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "High": { label: "High", color: "text-red-700 bg-red-50 border-red-200" },
};

export function RoomSharingAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><DoorOpen className="h-4 w-4 text-brand" />Room Sharing</CardTitle>
          <Link href="/room-sharing-assessment" className="text-xs text-brand hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.child_consent_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.child_consent_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.child_consent_rate}%</p><p className="text-[10px] text-muted-foreground">Consent</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unacceptable_risk_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.unacceptable_risk_count === 0 ? "text-green-600" : "text-red-600")}>{m.unacceptable_risk_count}</p><p className="text-[10px] text-muted-foreground">Unaccept.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.incompatible_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.incompatible_count === 0 ? "text-green-600" : "text-amber-600")}>{m.incompatible_count}</p><p className="text-[10px] text-muted-foreground">Incompat.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RISK_BADGES[r.risk] ?? RISK_BADGES["Low"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Home className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.arrangement} · {r.compatibility}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Room Sharing Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Room Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
