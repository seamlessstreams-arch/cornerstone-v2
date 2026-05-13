"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S ACHIEVEMENTS INTELLIGENCE CARD
// Dashboard card for celebrating children's achievements and milestones.
// CHR 2015 Reg 6, Reg 7, Reg 12.
// SCCIF: Overall Experiences — "Children's achievements are celebrated."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, ChevronRight, AlertTriangle, Brain,
  Star, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_achievements: 18,
  children_with_achievements: 5,
  achievement_coverage: 83.3,
  exceptional_count: 3,
  significant_count: 5,
  shared_with_family_rate: 72.2,
  added_to_life_story_rate: 44.4,
  child_proud_rate: 88.9,
};

const DEMO_ACHIEVEMENTS: { child: string; title: string; category: string; significance: string }[] = [
  { child: "Child A", title: "Passed Maths GCSE", category: "Academic", significance: "Exceptional" },
  { child: "Child B", title: "First sleepover at friend's", category: "Social", significance: "Significant" },
  { child: "Child C", title: "Completed Duke of Edinburgh Bronze", category: "Personal Growth", significance: "Exceptional" },
  { child: "Child D", title: "Made breakfast independently", category: "Independence", significance: "Notable" },
  { child: "Child E", title: "Joined football team", category: "Sporting", significance: "Significant" },
  { child: "Child A", title: "Volunteered at charity shop", category: "Community", significance: "Notable" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_achievements", severity: "high", message: "1 child has no achievements recorded — every child has something to celebrate." },
  { type: "not_in_life_story", severity: "medium", message: "4 significant achievements not added to life story work — important milestones should be captured." },
  { type: "not_shared_family", severity: "medium", message: "3 notable achievements not shared with families — sharing successes strengthens family relationships." },
];

const ARIA_INSIGHTS = [
  "18 achievements across 5 of 6 children (83.3% coverage). 3 exceptional, 5 significant. Children proud: 88.9%. Shared with family: 72.2%. Life story: 44.4%.",
  "Priority: 1 child has no achievements recorded — proactively identify and celebrate their strengths. Life story rate of 44.4% needs improving — exceptional achievements especially should be captured. 3 achievements not shared with families.",
  "Positive: 88.9% of children are proud of their achievements — staff recognition is working well. Strong academic success with Child A's GCSE. DofE completion shows excellent engagement. Consider a monthly celebration board to increase visibility.",
];

const SIGNIFICANCE_BADGES: Record<string, { label: string; color: string }> = {
  "Exceptional": { label: "Exceptional", color: "text-purple-700 bg-purple-50 border-purple-200" },
  "Significant": { label: "Significant", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Notable": { label: "Notable", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "Everyday": { label: "Everyday", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function ChildrensAchievementsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand" />
            Children&apos;s Achievements
          </CardTitle>
          <Link href="/childrens-achievements" className="text-xs text-brand hover:underline flex items-center gap-1">
            Achievements <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.total_achievements}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">{m.exceptional_count}</p>
            <p className="text-[10px] text-muted-foreground">Exceptional</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.achievement_coverage}%</p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.child_proud_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Proud</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" />Recent Achievements</p>
          <div className="space-y-1">
            {DEMO_ACHIEVEMENTS.map((a, i) => {
              const badge = SIGNIFICANCE_BADGES[a.significance] ?? SIGNIFICANCE_BADGES["Notable"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                    <span className="font-medium">{a.child}</span>
                    <span className="text-muted-foreground truncate">{a.title}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Achievement Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Achievements Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
