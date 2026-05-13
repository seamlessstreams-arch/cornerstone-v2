"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S WISHES & FEELINGS INTELLIGENCE CARD
// Dashboard card for tracking children's wishes, feelings and responses.
// CHR 2015 Reg 7. Children Act 1989 s1(3)(a).
// SCCIF: Overall Experiences — "Children's wishes and feelings are
// sought, listened to, and acted upon."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake, ChevronRight, AlertTriangle, Brain,
  MessageSquareHeart, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 22,
  children_with_records: 5,
  participation_rate: 83.3,
  wish_granted_count: 10,
  awaiting_response_count: 3,
  child_satisfied_rate: 85.0,
  positive_feeling_rate: 59.1,
  influenced_care_plan_rate: 45.5,
};

const DEMO_RECORDS: { child: string; category: string; feeling: string; outcome: string }[] = [
  { child: "Child A", category: "Contact", feeling: "Happy", outcome: "Wish Granted" },
  { child: "Child B", category: "Activities", feeling: "Very Happy", outcome: "Wish Granted" },
  { child: "Child C", category: "Placement", feeling: "Unhappy", outcome: "Referred to SW" },
  { child: "Child D", category: "Education", feeling: "Okay", outcome: "Awaiting" },
  { child: "Child E", category: "Daily Life", feeling: "Happy", outcome: "Partially Met" },
  { child: "Child A", category: "Future Plans", feeling: "Mixed", outcome: "Under Consideration" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_wishes_captured", severity: "high", message: "1 child's wishes and feelings not captured — every child's voice must be heard." },
  { type: "wishes_awaiting", severity: "high", message: "3 wishes awaiting response — children need timely feedback on their requests." },
  { type: "very_unhappy", severity: "high", message: "Child C expressed feeling very unhappy about placement — explore and respond to their concerns." },
];

const ARIA_INSIGHTS = [
  "22 wishes/feelings across 5 of 6 children (83.3%). 10 wishes granted. Awaiting: 3. Child satisfied: 85%. Positive feelings: 59.1%. Influencing care plans: 45.5%.",
  "Priority: 1 child's voice not captured at all. 3 wishes awaiting response. Child C unhappy about placement — needs sensitive exploration. Care plan influence at 45.5% should be higher.",
  "Positive: 85% child satisfaction shows staff listen well. 10 wishes granted demonstrates responsiveness. Good use of varied capture methods. Consider monthly 'wishes check-in' to ensure all children are heard regularly.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Wish Granted": { label: "Granted", color: "text-green-700 bg-green-50 border-green-200" },
  "Partially Met": { label: "Partial", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "Awaiting": { label: "Awaiting", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Referred to SW": { label: "Referred", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Under Consideration": { label: "Considering", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function ChildrensWishesFeelingsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-brand" />
            Wishes & Feelings
          </CardTitle>
          <Link href="/childrens-wishes-feelings" className="text-xs text-brand hover:underline flex items-center gap-1">
            Wishes <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.wish_granted_count}</p>
            <p className="text-[10px] text-muted-foreground">Granted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.awaiting_response_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.awaiting_response_count === 0 ? "text-green-600" : "text-amber-600")}>{m.awaiting_response_count}</p>
            <p className="text-[10px] text-muted-foreground">Awaiting</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.participation_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Heard</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.child_satisfied_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Satisfied</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><MessageSquareHeart className="h-3 w-3" />Recent Wishes</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Awaiting"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.category} · {r.feeling}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Wishes Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Wishes Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
