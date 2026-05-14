"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, AlertTriangle, Brain, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reflections: 18, practice_improved_count: 6, further_support_count: 2, deep_count: 5, surface_count: 3, child_impact_rate: 77.8, evidence_documented_rate: 83.3, shared_with_team_rate: 55.6, unique_staff: 6, average_duration: 42.0 };

const DEMO_RECORDS: { staff: string; type: string; model: string; outcome: string }[] = [
  { staff: "Staff A", type: "Individual", model: "Gibbs", outcome: "Improved" },
  { staff: "Staff B", type: "Group", model: "Kolb", outcome: "Learning" },
  { staff: "Staff C", type: "Critical Inc.", model: "Driscoll", outcome: "Action" },
  { staff: "Staff D", type: "Supervision", model: "Johns", outcome: "Improved" },
  { staff: "Staff A", type: "Peer", model: "Gibbs", outcome: "No Change" },
  { staff: "Staff E", type: "Individual", model: "Informal", outcome: "Support" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "critical_incident", severity: "critical", message: "Critical incident reflection by Staff C not linked to supervision — escalate." },
  { type: "no_impact", severity: "high", message: "4 reflections have not considered child impact." },
  { type: "not_shared", severity: "medium", message: "8 reflections not shared with team — encourage collective learning." },
];

const ARIA_INSIGHTS = [
  "18 reflections. 6 staff. Improved: 6. Deep: 5. Surface: 3. Child impact: 77.8%. Avg: 42 min.",
  "Priority: 1 critical incident gap. 4 no child impact. 8 not shared. Strengthen team learning.",
  "Positive: Good Gibbs usage. Regular frequency. Practice improving. Evidence well documented.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Improved": { label: "Improved", color: "text-green-700 bg-green-50 border-green-200" },
  "Learning": { label: "Learning", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Action": { label: "Action", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "No Change": { label: "No Chg", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Support": { label: "Support", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffReflectivePracticeCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Lightbulb className="h-4 w-4 text-brand" />Reflective Practice</CardTitle>
          <Link href="/staff-reflective-practice" className="text-xs text-brand hover:underline flex items-center gap-1">Reflections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.practice_improved_count}</p><p className="text-[10px] text-muted-foreground">Improved</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.deep_count}</p><p className="text-[10px] text-muted-foreground">Deep</p></div>
          <div className={cn("text-center rounded-lg p-2", m.surface_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.surface_count === 0 ? "text-green-600" : "text-amber-600")}>{m.surface_count}</p><p className="text-[10px] text-muted-foreground">Surface</p></div>
          <div className={cn("text-center rounded-lg p-2", m.further_support_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.further_support_count === 0 ? "text-green-600" : "text-red-600")}>{m.further_support_count}</p><p className="text-[10px] text-muted-foreground">Support</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reflections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Learning"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><BookOpen className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.model}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Reflective Practice Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Reflective Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
