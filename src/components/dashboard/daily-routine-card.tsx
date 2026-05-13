"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DAILY ROUTINE INTELLIGENCE CARD
// Dashboard card for daily routine compliance and structure.
// CHR 2015 Reg 6, Reg 9, Reg 14.
// SCCIF: Overall Experiences — "Children benefit from stable routines."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock, ChevronRight, AlertTriangle, Brain,
  ListChecks, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 42,
  children_with_routines: 6,
  routine_coverage: 100,
  compliance_rate: 85.7,
  not_followed_count: 3,
  adapted_count: 8,
  child_engaged_rate: 78.6,
};

const DEMO_RECORDS: { child: string; slot: string; type: string; compliance: string }[] = [
  { child: "Child A", slot: "Breakfast", type: "Weekday", compliance: "Fully Followed" },
  { child: "Child B", slot: "School Prep", type: "Weekday", compliance: "Mostly Followed" },
  { child: "Child C", slot: "Bedtime", type: "Weekday", compliance: "Not Followed" },
  { child: "Child D", slot: "Homework", type: "Weekday", compliance: "Adapted" },
  { child: "Child E", slot: "Morning Care", type: "Weekend", compliance: "Fully Followed" },
  { child: "Child F", slot: "Dinner", type: "Weekday", compliance: "Fully Followed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "routine_not_followed", severity: "high", message: "Child C's routine frequently not followed (4/6) — review routine suitability and support." },
  { type: "bedtime_disruption", severity: "medium", message: "3 bedtime routines not followed — consistent bedtimes are essential for children's wellbeing." },
  { type: "low_engagement", severity: "medium", message: "9 routine activities where children were not engaged — review whether routines reflect children's interests." },
];

const ARIA_INSIGHTS = [
  "42 routine records across all 6 children (100%). Compliance: 85.7%. Not followed: 3. Adapted: 8. Child engagement: 78.6%.",
  "Priority: Child C consistently resisting routine — needs conversation about what would work for them. Bedtime disruption pattern across 3 children. Engagement at 78.6% — explore why 21.4% are disengaged.",
  "Positive: 100% coverage — all children have documented routines. 85.7% compliance is strong. Adaptations show flexibility. Weekend routines appropriately different from weekday. Consider involving children in routine design.",
];

const COMPLIANCE_BADGES: Record<string, { label: string; color: string }> = {
  "Fully Followed": { label: "Followed", color: "text-green-700 bg-green-50 border-green-200" },
  "Mostly Followed": { label: "Mostly", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "Not Followed": { label: "Not Followed", color: "text-red-700 bg-red-50 border-red-200" },
  "Adapted": { label: "Adapted", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function DailyRoutineCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-brand" />
            Daily Routines
          </CardTitle>
          <Link href="/daily-routines" className="text-xs text-brand hover:underline flex items-center gap-1">
            Routines <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.compliance_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliance</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.not_followed_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.not_followed_count === 0 ? "text-green-600" : "text-red-600")}>{m.not_followed_count}</p>
            <p className="text-[10px] text-muted-foreground">Missed</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.adapted_count}</p>
            <p className="text-[10px] text-muted-foreground">Adapted</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.child_engaged_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Engaged</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><ListChecks className="h-3 w-3" />Today&apos;s Routines</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = COMPLIANCE_BADGES[r.compliance] ?? COMPLIANCE_BADGES["Fully Followed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.slot} · {r.type}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Routine Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Routine Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
