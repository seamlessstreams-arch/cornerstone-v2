"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CONTACT MONITORING INTELLIGENCE CARD
// Dashboard card for family contact session tracking and outcomes.
// CHR 2015 Reg 7/8. Care Planning Regs 2010.
// SCCIF: Overall Experiences — Contact arrangements.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone, ChevronRight, AlertTriangle, Brain,
  Calendar, Heart, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_sessions: 42,
  completed_count: 32,
  cancelled_count: 5,
  no_show_count: 3,
  refused_count: 2,
  completion_rate: 76.2,
  positive_outcome_rate: 68.8,
  negative_outcome_rate: 9.4,
  children_with_contact: 5,
  contact_coverage: 83.3,
  concerns_raised_count: 2,
  supervised_count: 18,
  court_ordered_count: 8,
  average_duration: 55,
  child_views_recorded_rate: 71.4,
};

const DEMO_SESSIONS: { child: string; contact: string; type: string; outcome: string; mood: string }[] = [
  { child: "Child A", contact: "Mother", type: "Face to Face", outcome: "Positive", mood: "happy" },
  { child: "Child B", contact: "Father", type: "Supervised Visit", outcome: "Neutral", mood: "calm" },
  { child: "Child C", contact: "Grandmother", type: "Video Call", outcome: "Positive", mood: "excited" },
  { child: "Child A", contact: "Father", type: "Phone Call", outcome: "Negative", mood: "upset" },
  { child: "Child D", contact: "Mother", type: "Face to Face", outcome: "Positive", mood: "happy" },
  { child: "Child B", contact: "Sibling", type: "Community Outing", outcome: "Positive", mood: "excited" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "concern_not_reported", severity: "critical", message: "Concerns raised during Child A's contact with Father but social worker not informed — immediate action required." },
  { type: "repeated_no_show", severity: "high", message: "Father has not attended 3 scheduled contacts with Child B — discuss with social worker and review contact plan." },
  { type: "distress_after_contact", severity: "medium", message: "Child A was upset after contact with Father — review contact arrangements." },
];

const ARIA_INSIGHTS = [
  "42 contact sessions across 5 children (83.3% coverage). 32 completed (76.2%), 5 cancelled, 3 no-shows, 2 refused. Positive: 68.8%. Avg duration: 55 mins. Court-ordered: 8. Concerns raised: 2.",
  "Priority: Unreported concerns from Child A's contact with Father is a critical safeguarding issue — must inform social worker immediately. Father's repeated no-shows with Child B require contact plan review. Child A distressed after paternal contact — consider supervision level increase.",
  "Positive: Maternal contacts consistently positive. Sibling contact (community outings) producing excellent outcomes. Grandparent video calls working well. Child views recorded in 71.4% of sessions — target 100% to evidence Reg 7 compliance.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  Positive: { label: "Positive", color: "text-green-700 bg-green-50 border-green-200" },
  Neutral: { label: "Neutral", color: "text-gray-700 bg-gray-50 border-gray-200" },
  Negative: { label: "Negative", color: "text-red-700 bg-red-50 border-red-200" },
  "No Show": { label: "No Show", color: "text-amber-700 bg-amber-50 border-amber-200" },
  Cancelled: { label: "Cancelled", color: "text-orange-700 bg-orange-50 border-orange-200" },
  Refused: { label: "Refused", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function ContactMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4 text-brand" />
            Contact Monitoring
          </CardTitle>
          <Link href="/contact-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">
            Contacts <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.completion_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.completion_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.completion_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.positive_outcome_rate >= 70 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.positive_outcome_rate >= 70 ? "text-green-600" : "text-amber-600")}>{m.positive_outcome_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Positive</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.no_show_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.no_show_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_show_count}</p>
            <p className="text-[10px] text-muted-foreground">No Shows</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.concerns_raised_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.concerns_raised_count === 0 ? "text-green-600" : "text-red-600")}>{m.concerns_raised_count}</p>
            <p className="text-[10px] text-muted-foreground">Concerns</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Recent Contact Sessions</p>
          <div className="space-y-1">
            {DEMO_SESSIONS.map((cs, i) => {
              const badge = OUTCOME_BADGES[cs.outcome] ?? OUTCOME_BADGES.Neutral;
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Heart className="h-3 w-3 text-pink-500 shrink-0" />
                    <span className="font-medium">{cs.child}</span>
                    <span className="text-muted-foreground truncate">{cs.contact} · {cs.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{cs.mood}</span>
                    <Badge variant="outline" className={cn("text-[10px]", badge.color)}>{badge.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Contact Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Contact Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
