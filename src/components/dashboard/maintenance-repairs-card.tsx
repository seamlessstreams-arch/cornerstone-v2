"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MAINTENANCE & REPAIRS INTELLIGENCE CARD
// Dashboard card for repair tracking, contractor management, and compliance.
// CHR 2015 Reg 36, Reg 25, Reg 13.
// SCCIF: Helped & Protected — "Premises are well maintained."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wrench, ChevronRight, AlertTriangle, Brain,
  Clock, HardHat, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 28,
  repair_request_count: 12,
  planned_maintenance_count: 8,
  pat_testing_count: 3,
  completed_count: 19,
  open_count: 7,
  completion_rate: 67.9,
  emergency_count: 2,
  urgent_count: 3,
  average_days_to_completion: 4.2,
  total_cost: 3425.50,
  contractor_used_rate: 42.9,
  children_impact_assessed_rate: 78.6,
  safeguarding_check_rate: 85.7,
  certificate_obtained_rate: 71.4,
  overdue_count: 3,
};

const DEMO_RECORDS: { type: string; description: string; date: string; status: string }[] = [
  { type: "Repair", description: "Broken window lock — bedroom 3", date: "12 May", status: "In Progress" },
  { type: "PAT Test", description: "Annual PAT testing — all areas", date: "10 May", status: "Completed" },
  { type: "Plumbing", description: "Leaking tap — kitchen", date: "8 May", status: "Completed" },
  { type: "Gas Safety", description: "Annual gas safety certificate", date: "5 May", status: "Completed" },
  { type: "Repair", description: "Fence panel damaged — garden", date: "3 May", status: "Awaiting Parts" },
  { type: "Electrical", description: "Light fitting — hallway", date: "1 May", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "urgent_outstanding", severity: "high", message: "3 urgent repairs outstanding — prioritise completion." },
  { type: "no_impact_assessment", severity: "medium", message: "6 maintenance jobs without children impact assessment — ensure safety considered." },
  { type: "maintenance_overdue", severity: "medium", message: "3 planned maintenance items are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "28 maintenance records. Completed: 19 (67.9%). Open: 7. Avg completion: 4.2 days. Cost: £3,425.50. Contractor use: 42.9%.",
  "Priority: 3 urgent repairs outstanding. 6 jobs without impact assessment. 3 overdue maintenance. Children impact assessment at 78.6% needs improvement.",
  "Positive: Good average completion time. Safeguarding checks at 85.7%. Regular PAT testing. Gas safety certificate current. Improve impact assessments.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Completed": { label: "Done", color: "text-green-700 bg-green-50 border-green-200" },
  "In Progress": { label: "In Prog.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Awaiting Parts": { label: "Awaiting", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Reported": { label: "Reported", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function MaintenanceRepairsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4 text-brand" />
            Maintenance & Repairs
          </CardTitle>
          <Link href="/maintenance-repairs" className="text-xs text-brand hover:underline flex items-center gap-1">
            Maintenance <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.open_count}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.completion_rate >= 75 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.completion_rate >= 75 ? "text-green-600" : "text-amber-600")}>{m.completion_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Complete</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.average_days_to_completion}d</p>
            <p className="text-[10px] text-muted-foreground">Avg Days</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Maintenance</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Reported"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <HardHat className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.description} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Maintenance Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Maintenance Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
