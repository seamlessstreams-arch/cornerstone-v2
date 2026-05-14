"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronRight, AlertTriangle, Brain, Clock, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_contacts: 12, poor_quality_count: 1, harmful_count: 1, estranged_count: 1, barrier_count: 4, preparation_rate: 66.7, debrief_rate: 58.3, emotional_support_rate: 75.0, life_story_rate: 50.0, unique_children: 5 };

const DEMO_RECORDS: { child: string; sibling: string; type: string; quality: string }[] = [
  { child: "Child A", sibling: "Sibling A1", type: "Face to Face", quality: "Excellent" },
  { child: "Child B", sibling: "Sibling B1", type: "Video Call", quality: "Good" },
  { child: "Child C", sibling: "Sibling C1", type: "Supervised", quality: "Harmful" },
  { child: "Child A", sibling: "Sibling A2", type: "Shared Activity", quality: "Good" },
  { child: "Child D", sibling: "Sibling D1", type: "Phone Call", quality: "Adequate" },
  { child: "Child E", sibling: "Sibling E1", type: "Letter/Card", quality: "Poor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "harmful_estranged", severity: "critical", message: "Child C's contact with Sibling C1 assessed as harmful with estranged relationship." },
  { type: "debrief_not_completed", severity: "high", message: "5 contacts have no debrief completed." },
  { type: "life_story_not_linked", severity: "medium", message: "6 contacts not linked to life story work." },
];

const ARIA_INSIGHTS = [
  "12 contacts. Poor: 1. Harmful: 1. Estranged: 1. Barriers: 4. Prep: 66.7%. Debrief: 58.3%.",
  "Priority: 1 harmful estranged. 5 no debrief. 6 no life story link. Strengthen sibling support.",
  "Positive: Most contacts well-facilitated. Venues suitable. Safeguarding considered for supervised contacts.",
];

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excell.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Harmful": { label: "Harm", color: "text-red-700 bg-red-50 border-red-200" },
};

export function SiblingContactQualityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-brand" />Sibling Contact</CardTitle>
          <Link href="/sibling-contact-quality" className="text-xs text-brand hover:underline flex items-center gap-1">Quality <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.harmful_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.harmful_count === 0 ? "text-green-600" : "text-red-600")}>{m.harmful_count}</p><p className="text-[10px] text-muted-foreground">Harmful</p></div>
          <div className={cn("text-center rounded-lg p-2", m.estranged_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.estranged_count === 0 ? "text-green-600" : "text-red-600")}>{m.estranged_count}</p><p className="text-[10px] text-muted-foreground">Estranged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.barrier_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.barrier_count === 0 ? "text-green-600" : "text-amber-600")}>{m.barrier_count}</p><p className="text-[10px] text-muted-foreground">Barriers</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_contacts}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Contacts</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = QUALITY_BADGES[r.quality] ?? QUALITY_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HeartHandshake className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.sibling} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sibling Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Sibling Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
