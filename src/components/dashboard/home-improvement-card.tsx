"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME IMPROVEMENT INTELLIGENCE CARD
// Dashboard card for renovation projects, accessibility, personalisation.
// CHR 2015 Reg 25, Reg 36, Reg 15.
// SCCIF: Overall Experiences — "The home is welcoming and homely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Hammer, ChevronRight, AlertTriangle, Brain,
  Clock, HardHat, Paintbrush,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_projects: 8,
  completion_rate: 37.5,
  in_progress_count: 3,
  overdue_count: 1,
  children_consulted_rate: 62.5,
  personalisation_count: 2,
  total_estimated_cost: 15000,
  urgent_count: 1,
};

const DEMO_RECORDS: { name: string; type: string; status: string; priority: string }[] = [
  { name: "Bedroom 3 Redecoration", type: "Personalisation", status: "In Progress", priority: "Medium" },
  { name: "Ramp Installation", type: "Accessibility", status: "Approved", priority: "High" },
  { name: "Kitchen Refit", type: "Refit", status: "Completed", priority: "Urgent" },
  { name: "Garden Play Area", type: "Garden", status: "In Progress", priority: "Medium" },
  { name: "Window Repairs", type: "Safety", status: "Overdue", priority: "High" },
  { name: "Lounge Painting", type: "Decorative", status: "Proposed", priority: "Low" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "overdue", severity: "high", message: "1 project is overdue — review timelines and prioritise." },
  { type: "urgent", severity: "high", message: "1 urgent project has not been started — commence work immediately." },
  { type: "consultation", severity: "medium", message: "3 projects without children being consulted — involve young people." },
];

const ARIA_INSIGHTS = [
  "8 projects. Completed: 37.5%. In progress: 3. Overdue: 1. Est cost: £15,000. Children consulted: 62.5%.",
  "Priority: 1 overdue project. 1 urgent not started. Low children consultation rate. Address window repairs.",
  "Positive: 2 personalisation projects. Kitchen refit completed. Garden area progressing. Improve timelines.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "In Progress": { label: "Active", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Approved": { label: "Approved", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Proposed": { label: "Proposed", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Overdue": { label: "Overdue", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeImprovementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Hammer className="h-4 w-4 text-brand" />
            Home Improvement
          </CardTitle>
          <Link href="/home-improvements" className="text-xs text-brand hover:underline flex items-center gap-1">
            Projects <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.completion_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.completion_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.completion_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Complete</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-blue-50">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.in_progress_count}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-red-600")}>{m.overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-purple-50">
            <p className="text-lg font-bold tabular-nums text-purple-600">{m.personalisation_count}</p>
            <p className="text-[10px] text-muted-foreground">Personal</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Projects</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Proposed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paintbrush className="h-3 w-3 text-amber-500 shrink-0" />
                    <span className="font-medium truncate">{r.name}</span>
                    <span className="text-muted-foreground truncate">{r.type}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Improvement Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Improvement Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
