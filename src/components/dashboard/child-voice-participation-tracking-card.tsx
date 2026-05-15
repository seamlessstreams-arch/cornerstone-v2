"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronRight, AlertTriangle, Brain, Clock, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_records: 8, views_not_sought_count: 1, not_involved_count: 1, declined_count: 0, decision_changed_count: 3, child_prepared_rate: 75.0, child_felt_heard_rate: 87.5, outcome_fed_back_rate: 62.5, advocate_present_rate: 37.5, age_appropriate_rate: 87.5, decision_changed_rate: 37.5, child_satisfied_rate: 75.0, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; level: string }[] = [
  { child: "Child A", type: "Care Plan", outcome: "Fully Incorp.", level: "Active" },
  { child: "Child B", type: "House Meeting", outcome: "Partially", level: "Leading" },
  { child: "Child C", type: "Reg44 Visit", outcome: "Not Sought", level: "Not Involved" },
  { child: "Child A", type: "Feedback", outcome: "Acknowledged", level: "Consulted" },
  { child: "Child D", type: "Complaints", outcome: "Fully Incorp.", level: "Active" },
  { child: "Child B", type: "Placement Plan", outcome: "Partially", level: "Consulted" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "views_not_sought_formal", severity: "critical", message: "Child C views not sought during Reg 44 visit — regulatory requirement not met." },
  { type: "not_heard_no_feedback", severity: "high", message: "1 child did not feel heard and outcome was not fed back." },
  { type: "outcome_not_fed_back", severity: "medium", message: "3 participation events where outcome not fed back to the child." },
];

const ARIA_INSIGHTS = [
  "8 records across 4 children. Views not sought: 1. Not involved: 1. Decisions changed: 3.",
  "Priority: 1 formal review without voice. Felt heard 87.5%. Outcome fed back 62.5%.",
  "Every child has the right to be heard. Are voices genuinely influencing decisions, or just recorded? Are outcomes always fed back?",
];

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  "Leading": { label: "Leading", color: "text-green-700 bg-green-50 border-green-200" },
  "Active": { label: "Active", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Consulted": { label: "Consult.", color: "text-violet-700 bg-violet-50 border-violet-200" },
  "Informed": { label: "Informed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Involved": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildVoiceParticipationTrackingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-violet-200">
      <CardHeader className="pb-3 bg-violet-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4 text-violet-600" /><span className="text-violet-900">Child Voice</span></CardTitle>
          <Link href="/child-voice-participation-tracking" className="text-xs text-violet-600 hover:underline flex items-center gap-1">Participation <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.views_not_sought_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.views_not_sought_count === 0 ? "text-green-600" : "text-red-600")}>{m.views_not_sought_count}</p><p className="text-[10px] text-muted-foreground">Not Sought</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_involved_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_involved_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_involved_count}</p><p className="text-[10px] text-muted-foreground">Not Involved</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.decision_changed_count}</p><p className="text-[10px] text-muted-foreground">Changed</p></div>
          <div className="text-center rounded-lg p-2 bg-violet-50"><p className="text-lg font-bold tabular-nums text-violet-600">{m.total_records}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Participation</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = LEVEL_BADGES[r.level] ?? LEVEL_BADGES["Consulted"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Mic className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.outcome}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Voice Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-violet-700"><Brain className="h-3 w-3" />ARIA Voice Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-violet-200 bg-violet-50 text-violet-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
