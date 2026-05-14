"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronRight, AlertTriangle, Brain, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_debriefs: 8, no_concerns_count: 4, learning_identified_count: 2, investigation_count: 1, distressed_count: 2, child_debrief_rate: 87.5, medical_check_rate: 75.0, proportionate_rate: 87.5, unique_children: 4, average_restraint_duration: 6.3 };

const DEMO_RECORDS: { child: string; type: string; restraint: string; outcome: string }[] = [
  { child: "Child A", type: "Child Debrief", restraint: "Guided Away", outcome: "No Concerns" },
  { child: "Child B", type: "Combined", restraint: "Standing Hold", outcome: "Learning" },
  { child: "Child C", type: "Staff Debrief", restraint: "Emergency", outcome: "Investigate" },
  { child: "Child A", type: "Management", restraint: "Guided Away", outcome: "No Concerns" },
  { child: "Child D", type: "Child Debrief", restraint: "Standing Hold", outcome: "Plan Update" },
  { child: "Child B", type: "Follow-Up", restraint: "Standing Hold", outcome: "No Concerns" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "disproportionate", severity: "critical", message: "Restraint of Child C assessed as disproportionate — investigate immediately." },
  { type: "no_child_debrief", severity: "high", message: "1 restraint has no child debrief completed — essential for recovery." },
  { type: "no_medical", severity: "high", message: "2 restraints have no medical check completed." },
];

const ARIA_INSIGHTS = [
  "8 debriefs. 4 children. No concerns: 4. Learning: 2. Investigate: 1. Distressed: 2. Avg: 6.3 min.",
  "Priority: 1 disproportionate. 1 no debrief. 2 no medical. Strengthen post-restraint process.",
  "Positive: 87.5% proportionate. Most debriefs completed. Learning documented. Good follow-up.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "No Concerns": { label: "No Concern", color: "text-green-700 bg-green-50 border-green-200" },
  "Learning": { label: "Learning", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Plan Update": { label: "Plan Upd.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Investigate": { label: "Investig.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function RestraintDebriefCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-brand" />Restraint Debriefs</CardTitle>
          <Link href="/restraint-debriefs" className="text-xs text-brand hover:underline flex items-center gap-1">Debriefs <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.proportionate_rate >= 90 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.proportionate_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.proportionate_rate}%</p><p className="text-[10px] text-muted-foreground">Proport.</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.no_concerns_count}</p><p className="text-[10px] text-muted-foreground">No Concern</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.learning_identified_count}</p><p className="text-[10px] text-muted-foreground">Learning</p></div>
          <div className={cn("text-center rounded-lg p-2", m.investigation_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.investigation_count === 0 ? "text-green-600" : "text-red-600")}>{m.investigation_count}</p><p className="text-[10px] text-muted-foreground">Investig.</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Debriefs</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["No Concerns"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><AlertCircle className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.restraint}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Debrief Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Restraint Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
