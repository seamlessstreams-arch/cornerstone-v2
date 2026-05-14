"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ChevronRight, AlertTriangle, Brain, Clock, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 13, not_understood_count: 1, disengaged_count: 2, not_appropriate_count: 1, harmful_count: 1, safe_space_rate: 76.9, child_consented_rate: 84.6, trigger_warnings_rate: 69.2, confidentiality_rate: 84.6, unique_children: 6 };

const DEMO_RECORDS: { child: string; topic: string; understanding: string; appropriate: string }[] = [
  { child: "Child A", topic: "Consent", understanding: "Confident", appropriate: "Appropriate" },
  { child: "Child B", topic: "Boundaries", understanding: "Good", appropriate: "V. Approp." },
  { child: "Child C", topic: "Body Safety", understanding: "Not Und.", appropriate: "Harmful" },
  { child: "Child D", topic: "Online Safety", understanding: "Developing", appropriate: "Appropriate" },
  { child: "Child E", topic: "Peer Press.", understanding: "Limited", appropriate: "Somewhat" },
  { child: "Child F", topic: "Emotional Lit.", understanding: "Good", appropriate: "Appropriate" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "harmful_not_understood", severity: "critical", message: "Child C received harmful content on body safety with no understanding — safeguarding review." },
  { type: "no_safe_space", severity: "high", message: "3 sessions have no safe space provided." },
  { type: "no_consent", severity: "high", message: "2 sessions have no child consent obtained." },
];

const ARIA_INSIGHTS = [
  "13 sessions. Not understood: 1. Disengaged: 2. Not appropriate: 1. Harmful: 1. Safe space: 76.9%.",
  "Priority: 1 harmful content delivery. Safe space at 76.9%. Trigger warnings only 69.2%.",
  "Positive: Most children understanding. Good confidentiality. Consent improving across topics.",
];

const APPROPRIATENESS_BADGES: Record<string, { label: string; color: string }> = {
  "V. Approp.": { label: "V.Appr", color: "text-green-700 bg-green-50 border-green-200" },
  "Appropriate": { label: "Approp.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Somewhat": { label: "Some", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Approp.": { label: "Not Ap.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Harmful": { label: "Harmful", color: "text-red-700 bg-red-50 border-red-200" },
};

export function RelationshipEducationSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" />Relationship Ed.</CardTitle>
          <Link href="/relationship-education-safety" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.harmful_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.harmful_count === 0 ? "text-green-600" : "text-red-600")}>{m.harmful_count}</p><p className="text-[10px] text-muted-foreground">Harmful</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_appropriate_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_appropriate_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_appropriate_count}</p><p className="text-[10px] text-muted-foreground">Not Approp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_understood_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_understood_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_understood_count}</p><p className="text-[10px] text-muted-foreground">Not Und.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = APPROPRIATENESS_BADGES[r.appropriate] ?? APPROPRIATENESS_BADGES["Somewhat"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HeartHandshake className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.topic} · {r.understanding}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Relationship Ed. Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Relationship Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
