"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, AlertTriangle, Brain, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 16, disengaged_count: 1, refused_count: 1, no_progress_count: 1, regression_count: 1, homework_completed_rate: 81.3, school_liaison_rate: 68.8, pep_updated_rate: 62.5, learning_needs_rate: 87.5, unique_children: 6 };

const DEMO_RECORDS: { child: string; subject: string; engagement: string; progress: string }[] = [
  { child: "Child A", subject: "English", engagement: "Engaged", progress: "Met Exp." },
  { child: "Child B", subject: "Maths", engagement: "Highly Eng.", progress: "Exceeded" },
  { child: "Child C", subject: "Science", engagement: "Disengaged", progress: "No Progress" },
  { child: "Child D", subject: "Humanities", engagement: "Engaged", progress: "Some Prog." },
  { child: "Child E", subject: "Languages", engagement: "Refused", progress: "Regression" },
  { child: "Child F", subject: "Technology", engagement: "Partial", progress: "Some Prog." },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "refused_regressing", severity: "critical", message: "Child E refusing languages support and regressing academically." },
  { type: "no_school_liaison", severity: "high", message: "5 sessions have no school liaison." },
  { type: "pep_not_updated", severity: "high", message: "6 sessions have PEP not updated." },
];

const ARIA_INSIGHTS = [
  "16 sessions. Disengaged: 1. Refused: 1. No progress: 1. Regression: 1. Homework: 81.3%.",
  "Priority: 1 refusing and regressing. School liaison at 68.8%. PEP updates at 62.5%.",
  "Positive: Most children engaged. Homework completion strong. Good subject variety covered.",
];

const PROGRESS_BADGES: Record<string, { label: string; color: string }> = {
  "Exceeded": { label: "Exceed", color: "text-green-700 bg-green-50 border-green-200" },
  "Met Exp.": { label: "Met", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Some Prog.": { label: "Some", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "No Progress": { label: "None", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Regression": { label: "Regress", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeworkAcademicSupportCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand" />Academic Support</CardTitle>
          <Link href="/homework-academic-support" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.regression_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.regression_count === 0 ? "text-green-600" : "text-red-600")}>{m.regression_count}</p><p className="text-[10px] text-muted-foreground">Regress.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.refused_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.refused_count === 0 ? "text-green-600" : "text-amber-600")}>{m.refused_count}</p><p className="text-[10px] text-muted-foreground">Refused</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disengaged_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disengaged_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disengaged_count}</p><p className="text-[10px] text-muted-foreground">Diseng.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PROGRESS_BADGES[r.progress] ?? PROGRESS_BADGES["Some Prog."]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><GraduationCap className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.subject} · {r.engagement}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Academic Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Academic Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
