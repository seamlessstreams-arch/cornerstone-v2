"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S FEEDBACK INTELLIGENCE CARD
// Dashboard card for satisfaction surveys, feedback sessions, suggestions.
// CHR 2015 Reg 7, Reg 10, Reg 45.
// SCCIF: Overall Experiences — "Children's views are actively sought."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquareHeart, ChevronRight, AlertTriangle, Brain,
  Clock, Smile, ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_feedback: 14,
  survey_count: 5,
  session_count: 4,
  suggestion_count: 3,
  positive_rate: 64.3,
  negative_rate: 14.3,
  completed_rate: 50.0,
  pending_count: 3,
  not_actioned_count: 1,
  child_satisfied_rate: 57.1,
  unique_children: 5,
};

const DEMO_RECORDS: { type: string; child: string; date: string; rating: string; status: string }[] = [
  { type: "Survey", child: "Child A", date: "12 May", rating: "Happy", status: "Done" },
  { type: "Session", child: "Child B", date: "10 May", rating: "V. Happy", status: "Done" },
  { type: "Suggestion", child: "Child C", date: "8 May", rating: "Neutral", status: "Pending" },
  { type: "Food", child: "Child A", date: "5 May", rating: "Unhappy", status: "In Progress" },
  { type: "Activity", child: "Child D", date: "3 May", rating: "Happy", status: "Done" },
  { type: "Survey", child: "Child E", date: "1 May", rating: "V. Unhappy", status: "Pending" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "very_unhappy", severity: "critical", message: "Child E reported very unhappy feedback on 1 May — respond urgently." },
  { type: "not_actioned", severity: "high", message: "1 feedback item has not been actioned — respond to children's views." },
  { type: "pending", severity: "high", message: "3 feedback responses are pending — acknowledge children's input promptly." },
];

const ARIA_INSIGHTS = [
  "14 feedback items. Positive: 64.3%. Negative: 14.3%. Completed: 50%. 5 children. Satisfied: 57.1%.",
  "Priority: 1 very unhappy feedback. 1 not actioned. 3 pending responses. Improve response rate and follow-through.",
  "Positive: Regular surveys. Multiple feedback methods. Most children happy. Improve completion and child satisfaction.",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "V. Happy": { label: "V. Happy", color: "text-green-700 bg-green-50 border-green-200" },
  "Happy": { label: "Happy", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Neutral": { label: "Neutral", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Unhappy": { label: "Unhappy", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "V. Unhappy": { label: "V. Unhappy", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ChildrensFeedbackCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquareHeart className="h-4 w-4 text-brand" />
            Children&apos;s Feedback
          </CardTitle>
          <Link href="/childrens-feedback" className="text-xs text-brand hover:underline flex items-center gap-1">
            Feedback <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.positive_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.positive_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.positive_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Positive</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.completed_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.completed_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.completed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.not_actioned_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.not_actioned_count === 0 ? "text-green-600" : "text-red-600")}>{m.not_actioned_count}</p>
            <p className="text-[10px] text-muted-foreground">Ignored</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_count}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Feedback</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["Neutral"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Smile className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.child} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Feedback Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Feedback Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
