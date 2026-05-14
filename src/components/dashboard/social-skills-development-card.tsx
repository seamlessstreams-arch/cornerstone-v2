"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronRight, AlertTriangle, Brain, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 14, regression_count: 1, no_progress_count: 1, disruptive_count: 1, withdrawn_count: 1, child_engaged_rate: 85.7, strengths_rate: 78.6, targets_rate: 71.4, positive_reinforcement_rate: 85.7, unique_children: 6 };

const DEMO_RECORDS: { child: string; skill: string; competence: string; dynamic: string }[] = [
  { child: "Child A", skill: "Communication", competence: "Proficient", dynamic: "Active" },
  { child: "Child B", skill: "Empathy", competence: "Developing", dynamic: "Passive" },
  { child: "Child C", skill: "Conflict Res.", competence: "Emerging", dynamic: "Disruptive" },
  { child: "Child D", skill: "Teamwork", competence: "Advanced", dynamic: "Leader" },
  { child: "Child E", skill: "Listening", competence: "Not Demo.", dynamic: "Withdrawn" },
  { child: "Child F", skill: "Boundaries", competence: "Developing", dynamic: "Active" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "regression_disruptive", severity: "critical", message: "Child C is regressing in conflict resolution and showing disruptive behaviour." },
  { type: "no_targets_set", severity: "high", message: "4 sessions have no targets set." },
  { type: "no_positive_reinforcement", severity: "medium", message: "2 sessions without positive reinforcement." },
];

const ARIA_INSIGHTS = [
  "14 sessions. Regression: 1. No progress: 1. Disruptive: 1. Withdrawn: 1. Engagement: 85.7%.",
  "Priority: 1 regression with disruptive behaviour. Targets only set in 71.4%. Strengthen goal-setting approach.",
  "Positive: Most children engaged. Communication and teamwork showing good development across group.",
];

const COMPETENCE_BADGES: Record<string, { label: string; color: string }> = {
  "Advanced": { label: "Adv.", color: "text-green-700 bg-green-50 border-green-200" },
  "Proficient": { label: "Prof.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Developing": { label: "Dev.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Emerging": { label: "Emerg.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Not Demo.": { label: "N/D", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SocialSkillsDevelopmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-brand" />Social Skills</CardTitle>
          <Link href="/social-skills-development" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.regression_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.regression_count === 0 ? "text-green-600" : "text-red-600")}>{m.regression_count}</p><p className="text-[10px] text-muted-foreground">Regress.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disruptive_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disruptive_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disruptive_count}</p><p className="text-[10px] text-muted-foreground">Disrupt.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.withdrawn_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.withdrawn_count === 0 ? "text-green-600" : "text-amber-600")}>{m.withdrawn_count}</p><p className="text-[10px] text-muted-foreground">Withdr.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = COMPETENCE_BADGES[r.competence] ?? COMPETENCE_BADGES["Developing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><MessageCircle className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.skill} · {r.dynamic}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Skills Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Social Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
