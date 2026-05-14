"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — UTILITY MANAGEMENT INTELLIGENCE CARD
// Dashboard card for energy, water, gas, costs, and sustainability.
// CHR 2015 Reg 25, Reg 36, Reg 15.
// SCCIF: Overall Experiences — "The home is warm and comfortable."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap, ChevronRight, AlertTriangle, Brain,
  Clock, Gauge, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 12,
  electricity_count: 4,
  gas_count: 4,
  water_count: 3,
  within_budget_rate: 75.0,
  over_budget_count: 1,
  total_cost: 3450.00,
  heating_adequate_rate: 91.7,
  fault_count: 1,
};

const DEMO_RECORDS: { type: string; utility: string; date: string; status: string }[] = [
  { type: "Meter", utility: "Electric", date: "13 May", status: "Budget" },
  { type: "Bill", utility: "Gas", date: "10 May", status: "Over" },
  { type: "Meter", utility: "Water", date: "8 May", status: "Budget" },
  { type: "Fault", utility: "Gas", date: "5 May", status: "Reported" },
  { type: "Meter", utility: "Electric", date: "1 May", status: "Budget" },
  { type: "Audit", utility: "All", date: "28 Apr", status: "Budget" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "over_budget", severity: "high", message: "1 utility is over budget — review spending." },
  { type: "fault", severity: "high", message: "1 utility fault has been reported — resolve promptly." },
  { type: "efficiency", severity: "medium", message: "3 records without energy saving measures — review sustainability." },
];

const ARIA_INSIGHTS = [
  "12 records. Within budget: 75%. Total cost: £3,450. Heating adequate: 91.7%. 1 fault. 1 over budget.",
  "Priority: 1 over budget utility. 1 fault reported. Low energy saving uptake. Address gas overspend.",
  "Positive: Heating mostly adequate. Regular meter readings. Water within budget. Improve sustainability measures.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Budget": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Over": { label: "Over", color: "text-red-700 bg-red-50 border-red-200" },
  "Reported": { label: "Fault", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function UtilityManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand" />
            Utility Management
          </CardTitle>
          <Link href="/utility-management" className="text-xs text-brand hover:underline flex items-center gap-1">
            Utilities <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.within_budget_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.within_budget_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.within_budget_rate}%</p>
            <p className="text-[10px] text-muted-foreground">In Budget</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.heating_adequate_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.heating_adequate_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.heating_adequate_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Heated</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.over_budget_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.over_budget_count === 0 ? "text-green-600" : "text-red-600")}>{m.over_budget_count}</p>
            <p className="text-[10px] text-muted-foreground">Over Budget</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.fault_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.fault_count === 0 ? "text-green-600" : "text-amber-600")}>{m.fault_count}</p>
            <p className="text-[10px] text-muted-foreground">Faults</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Budget"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Gauge className="h-3 w-3 text-yellow-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.utility} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Utility Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Utility Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
