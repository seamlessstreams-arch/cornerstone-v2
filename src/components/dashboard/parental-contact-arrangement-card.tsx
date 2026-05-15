"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users2, ChevronRight, AlertTriangle, Brain, Clock, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_contacts: 8, negative_count: 1, cancelled_count: 2, court_order_non_compliant_count: 1, refused_count: 1, child_views_before_rate: 62.5, child_views_after_rate: 50.0, social_worker_informed_rate: 75.0, recorded_in_care_plan_rate: 62.5, court_compliance_rate: 66.7, unique_children: 4 };

const DEMO_RECORDS: { child: string; type: string; outcome: string; experience: string }[] = [
  { child: "Child A", type: "Face-to-Face", outcome: "Positive", experience: "Happy" },
  { child: "Child B", type: "Video Call", outcome: "Mixed", experience: "Anxious" },
  { child: "Child C", type: "Supervised", outcome: "Negative", experience: "Upset After" },
  { child: "Child A", type: "Telephone", outcome: "Positive", experience: "Settled" },
  { child: "Child D", type: "Community", outcome: "Cancelled", experience: "Refused" },
  { child: "Child B", type: "Letter", outcome: "Positive", experience: "Indifferent" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "court_breach_negative", severity: "critical", message: "Child C has court-ordered contact non-compliant with negative outcome — urgent review required." },
  { type: "repeated_cancellations", severity: "high", message: "Child D has multiple cancelled contacts." },
  { type: "child_views_not_captured", severity: "high", message: "4 contacts have child views not captured before or after." },
];

const ARIA_INSIGHTS = [
  "8 contacts across 4 children. Negative: 1. Cancelled: 2. Court non-compliant: 1.",
  "Priority: 1 court breach with negative outcome. Child views before 62.5%. After 50.0%.",
  "Contact with family matters deeply. Is the child prepared? Are their feelings heard before and after?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Positive": { label: "Positive", color: "text-green-700 bg-green-50 border-green-200" },
  "Mixed": { label: "Mixed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Negative": { label: "Negative", color: "text-red-700 bg-red-50 border-red-200" },
  "Cancelled": { label: "Cancelled", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Refused": { label: "Refused", color: "text-orange-700 bg-orange-50 border-orange-200" },
};

export function ParentalContactArrangementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-lime-200">
      <CardHeader className="pb-3 bg-lime-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Users2 className="h-4 w-4 text-lime-600" /><span className="text-lime-900">Parental Contact</span></CardTitle>
          <Link href="/parental-contact-arrangement" className="text-xs text-lime-600 hover:underline flex items-center gap-1">Contact <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.negative_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.negative_count === 0 ? "text-green-600" : "text-red-600")}>{m.negative_count}</p><p className="text-[10px] text-muted-foreground">Negative</p></div>
          <div className={cn("text-center rounded-lg p-2", m.cancelled_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.cancelled_count === 0 ? "text-green-600" : "text-amber-600")}>{m.cancelled_count}</p><p className="text-[10px] text-muted-foreground">Cancelled</p></div>
          <div className={cn("text-center rounded-lg p-2", m.court_order_non_compliant_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.court_order_non_compliant_count === 0 ? "text-green-600" : "text-red-600")}>{m.court_order_non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Compl.</p></div>
          <div className="text-center rounded-lg p-2 bg-lime-50"><p className="text-lg font-bold tabular-nums text-lime-600">{m.total_contacts}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Contacts</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Mixed"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HeartHandshake className="h-3 w-3 text-lime-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.experience}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Contact Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-lime-700"><Brain className="h-3 w-3" />ARIA Contact Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-lime-200 bg-lime-50 text-lime-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
