"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ChevronRight, AlertTriangle, Brain, Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_feedback: 8, poor_rating_count: 1, very_poor_rating_count: 1, dissatisfied_count: 2, concerns_raised_count: 1, feedback_sought_rate: 75.0, improvement_rate: 62.5, feedback_shared_rate: 75.0, manager_reviewed_rate: 62.5 };

const DEMO_RECORDS: { visitor: string; type: string; rating: string; satisfaction: string }[] = [
  { visitor: "Parent A", type: "Parent", rating: "Good", satisfaction: "Satisfied" },
  { visitor: "SW Jones", type: "Social Worker", rating: "Excellent", satisfaction: "Very Satisfied" },
  { visitor: "Dr Smith", type: "Health Prof", rating: "Very Poor", satisfaction: "Dissatisfied" },
  { visitor: "Reg44 Vis", type: "Reg 44", rating: "Good", satisfaction: "Satisfied" },
  { visitor: "Advocate B", type: "Advocate", rating: "Poor", satisfaction: "Dissatisfied" },
  { visitor: "Parent C", type: "Parent", rating: "Satisfactory", satisfaction: "Neutral" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_poor_with_concerns", severity: "critical", message: "Dr Smith (health professional) gave very poor feedback with concerns." },
  { type: "no_improvement_identified", severity: "high", message: "3 feedbacks have no improvement identified." },
  { type: "manager_not_reviewed", severity: "medium", message: "3 feedbacks without manager review." },
];

const ARIA_INSIGHTS = [
  "8 visitor feedbacks. Poor: 1. Very poor: 1. Dissatisfied: 2. Concerns: 1. Improvement: 62.5%. Shared: 75%.",
  "Priority: 1 very poor with concerns. 3 no improvement. 3 no manager review. Strengthen feedback loop.",
  "Positive: Most feedback proactively sought. Anonymity routinely offered. Child views increasingly included.",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Satisfactory": { label: "Satisfactory", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Poor": { label: "Poor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Very Poor": { label: "Very Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function VisitorFeedbackCollectionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4 text-brand" />Visitor Feedback</CardTitle>
          <Link href="/visitor-feedback-collection" className="text-xs text-brand hover:underline flex items-center gap-1">Collection <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.very_poor_rating_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.very_poor_rating_count === 0 ? "text-green-600" : "text-red-600")}>{m.very_poor_rating_count}</p><p className="text-[10px] text-muted-foreground">Very Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.dissatisfied_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.dissatisfied_count === 0 ? "text-green-600" : "text-amber-600")}>{m.dissatisfied_count}</p><p className="text-[10px] text-muted-foreground">Dissatisfied</p></div>
          <div className={cn("text-center rounded-lg p-2", m.concerns_raised_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.concerns_raised_count === 0 ? "text-green-600" : "text-amber-600")}>{m.concerns_raised_count}</p><p className="text-[10px] text-muted-foreground">Concerns</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_feedback}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Feedback</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCheck className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.visitor}</span><span className="text-muted-foreground truncate">{r.type} · {r.satisfaction}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Feedback Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Feedback Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
