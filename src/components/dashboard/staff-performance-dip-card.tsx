"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, ChevronRight, AlertTriangle, Brain, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_dips: 9, manager_review_count: 2, support_recommended_count: 3, unresolved_count: 6, escalated_count: 1, staff_informed_rate: 55.6, support_offered_rate: 44.4, triggers_explored_rate: 33.3, wellbeing_assessed_rate: 44.4, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; category: string; severity: string; status: string }[] = [
  { staff: "Staff A", category: "Recording", severity: "Possible Dip", status: "Identified" },
  { staff: "Staff B", category: "Timeliness", severity: "Pattern Emerg.", status: "Exploring" },
  { staff: "Staff C", category: "Safeguarding", severity: "Mgr Review", status: "Supporting" },
  { staff: "Staff D", category: "Communication", severity: "Support Rec.", status: "Exploring" },
  { staff: "Staff E", category: "Child Rel.", severity: "Needs Expl.", status: "Identified" },
  { staff: "Staff F", category: "Team Collab.", severity: "Possible Dip", status: "Resolved" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unreviewed_serious", severity: "critical", message: "Staff C has an unreviewed performance concern requiring manager review — manager action needed." },
  { type: "staff_not_informed", severity: "high", message: "4 dips have staff not yet informed." },
  { type: "no_support_offered", severity: "high", message: "5 dips have no support offered." },
];

const ARIA_INSIGHTS = [
  "9 dips across 6 staff. Manager review: 2. Support recommended: 3. Unresolved: 6. Escalated: 1.",
  "Priority: 4 staff not yet informed. Support offered only 44.4%. Triggers explored only 33.3%.",
  "Key question: Is this a skill, confidence, wellbeing, training, or workload issue? Explore before acting.",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "Possible Dip": { label: "Poss.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Pattern Emerg.": { label: "Patt.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Needs Expl.": { label: "Expl.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Support Rec.": { label: "Supp.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Mgr Review": { label: "Mgr.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffPerformanceDipCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Performance Dips</span></CardTitle>
          <Link href="/staff-performance-dip" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Dips <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.manager_review_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.manager_review_count === 0 ? "text-green-600" : "text-red-600")}>{m.manager_review_count}</p><p className="text-[10px] text-muted-foreground">Mgr Review</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unresolved_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.unresolved_count === 0 ? "text-green-600" : "text-amber-600")}>{m.unresolved_count}</p><p className="text-[10px] text-muted-foreground">Unresolved</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_dips}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Dips</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SEVERITY_BADGES[r.severity] ?? SEVERITY_BADGES["Possible Dip"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Lightbulb className="h-3 w-3 text-amber-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.category} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Performance Dip Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Critical Friend</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
