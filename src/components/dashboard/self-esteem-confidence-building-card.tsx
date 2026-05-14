"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronRight, AlertTriangle, Brain, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 14, very_low_count: 1, decline_count: 2, negative_image_count: 2, significant_decline_count: 1, child_led_rate: 71.4, strengths_identified_rate: 78.6, goals_set_rate: 85.7, safe_space_rate: 78.6, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; confidence: string; progress: string }[] = [
  { child: "Child A", type: "One-to-One", confidence: "Confident", progress: "Improved" },
  { child: "Child B", type: "Group", confidence: "Developing", progress: "Maintained" },
  { child: "Child C", type: "Skill Build.", confidence: "Very Low", progress: "Sig. Decline" },
  { child: "Child D", type: "Creative", confidence: "Confident", progress: "Improved" },
  { child: "Child E", type: "Peer Support", confidence: "Low", progress: "Slight Dec." },
  { child: "Child F", type: "Physical", confidence: "V. Confident", progress: "Sig. Impr." },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_low_declining", severity: "critical", message: "Child C has very low confidence with significant decline — urgent therapeutic intervention needed." },
  { type: "no_strengths_identified", severity: "high", message: "3 sessions have no strengths identified." },
  { type: "not_child_led", severity: "high", message: "4 sessions are not child-led." },
];

const ARIA_INSIGHTS = [
  "14 sessions. Very low: 1. Declining: 2. Negative image: 2. Child-led: 71.4%. Strengths: 78.6%.",
  "Priority: 1 child with very low confidence declining. Strengths identification at 78.6%. Safe space 78.6%.",
  "Positive: Most children progressing. Goals set at 85.7%. Creative expression effective.",
];

const PROGRESS_BADGES: Record<string, { label: string; color: string }> = {
  "Sig. Impr.": { label: "Sig.Imp", color: "text-green-700 bg-green-50 border-green-200" },
  "Improved": { label: "Improv.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Maintained": { label: "Maint.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Slight Dec.": { label: "Sl.Dec.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Sig. Decline": { label: "Sig.Dec", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SelfEsteemConfidenceBuildingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-brand" />Self-Esteem</CardTitle>
          <Link href="/self-esteem-confidence-building" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.very_low_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.very_low_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_low_count}</p><p className="text-[10px] text-muted-foreground">Very Low</p></div>
          <div className={cn("text-center rounded-lg p-2", m.decline_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.decline_count === 0 ? "text-green-600" : "text-amber-600")}>{m.decline_count}</p><p className="text-[10px] text-muted-foreground">Declining</p></div>
          <div className={cn("text-center rounded-lg p-2", m.negative_image_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.negative_image_count === 0 ? "text-green-600" : "text-amber-600")}>{m.negative_image_count}</p><p className="text-[10px] text-muted-foreground">Neg. Image</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = PROGRESS_BADGES[r.progress] ?? PROGRESS_BADGES["Maintained"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Sparkles className="h-3 w-3 text-pink-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.confidence}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Self-Esteem Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Self-Esteem Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
