"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ChevronRight, AlertTriangle, Brain, Clock, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 10, poor_quality_count: 1, concerning_quality_count: 1, no_friendships_count: 1, aggressive_conflict_count: 1, child_views_rate: 90.0, bullying_screened_rate: 80.0, social_skills_rate: 70.0, conflict_resolution_rate: 60.0, unique_children: 5 };

const DEMO_RECORDS: { child: string; quality: string; skills: string; stability: string }[] = [
  { child: "Child A", quality: "Good", skills: "Age Approp.", stability: "Stable" },
  { child: "Child B", quality: "Developing", skills: "Developing", stability: "Fluctuating" },
  { child: "Child C", quality: "Poor", skills: "Below Exp.", stability: "Unstable" },
  { child: "Child D", quality: "Excellent", skills: "Advanced", stability: "Very Stable" },
  { child: "Child E", quality: "Concerning", skills: "Not Assessed", stability: "No Friends" },
  { child: "Child A", quality: "Good", skills: "Age Approp.", stability: "Stable" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "concerning_no_bullying_screen", severity: "critical", message: "Child E has concerning peer relationships without bullying screening — investigate immediately." },
  { type: "no_friendships", severity: "high", message: "1 assessment shows child with no friendships." },
  { type: "conflict_resolution_not_taught", severity: "medium", message: "4 assessments without conflict resolution teaching." },
];

const ARIA_INSIGHTS = [
  "10 assessments. 5 children. Poor: 1. Concerning: 1. No friends: 1. Bullying screened: 80%.",
  "Priority: 1 concerning no screening. 1 no friendships. 4 no conflict resolution. Strengthen social skills.",
  "Positive: Most relationships developing well. Child views routinely sought. Group activities increasing.",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Developing": { label: "Developing", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Concerning": { label: "Concerning", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PeerRelationshipAssessmentCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><UserPlus className="h-4 w-4 text-brand" />Peer Relationships</CardTitle>
          <Link href="/peer-relationship-assessment" className="text-xs text-brand hover:underline flex items-center gap-1">Assessments <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.concerning_quality_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.concerning_quality_count === 0 ? "text-green-600" : "text-red-600")}>{m.concerning_quality_count}</p><p className="text-[10px] text-muted-foreground">Concern</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_friendships_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_friendships_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_friendships_count}</p><p className="text-[10px] text-muted-foreground">No Friends</p></div>
          <div className={cn("text-center rounded-lg p-2", m.aggressive_conflict_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.aggressive_conflict_count === 0 ? "text-green-600" : "text-amber-600")}>{m.aggressive_conflict_count}</p><p className="text-[10px] text-muted-foreground">Aggress.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_children}</p><p className="text-[10px] text-muted-foreground">Children</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Developing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Handshake className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.skills} · {r.stability}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Relationship Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Relationship Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
