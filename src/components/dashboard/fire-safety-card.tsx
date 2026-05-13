"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — FIRE SAFETY & DRILLS INTELLIGENCE CARD
// Dashboard card for fire drills, evacuations, and safety compliance.
// CHR 2015 Reg 25, Reg 36; Fire Safety Order 2005.
// SCCIF: Helped & Protected — "The home has robust fire safety measures."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Flame, ChevronRight, AlertTriangle, Brain,
  Timer, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_events: 15,
  drills_count: 8,
  night_drills_count: 2,
  successful_evacuation_rate: 87.5,
  average_evacuation_time: 142,
  compliant_rate: 80.0,
  non_compliant_count: 1,
  equipment_operational_rate: 93.3,
};

const DEMO_RECORDS: { type: string; date: string; result: string; time: string }[] = [
  { type: "Planned Drill", date: "10 May", result: "Successful", time: "2m 15s" },
  { type: "Night Drill", date: "5 May", result: "Successful", time: "3m 42s" },
  { type: "Equipment Check", date: "3 May", result: "N/A", time: "—" },
  { type: "Unannounced Drill", date: "28 Apr", result: "Partial", time: "4m 10s" },
  { type: "Risk Assessment", date: "20 Apr", result: "N/A", time: "—" },
  { type: "Planned Drill", date: "15 Apr", result: "Successful", time: "2m 05s" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "persons_not_accounted", severity: "critical", message: "Not all persons accounted for during unannounced drill on 28 Apr — review roll-call procedures." },
  { type: "non_compliant", severity: "high", message: "Non-compliant fire safety finding on 20 Apr (risk assessment) — address immediately." },
  { type: "equipment_out_of_service", severity: "high", message: "1 fire safety equipment item is out of service — arrange repair or replacement." },
];

const ARIA_INSIGHTS = [
  "15 fire safety events. Drills: 8 (2 night). Evacuation success: 87.5%. Avg time: 2m 22s. Compliance: 80.0%. Equipment: 93.3% operational.",
  "Priority: Roll-call failure during unannounced drill — retrain. Non-compliant risk assessment finding outstanding. 1 equipment item out of service. Night drill frequency adequate.",
  "Positive: 8 drills shows good frequency. Night drills happening. Average evacuation under 2.5 minutes. PEEP plans being followed. Consider varying drill scenarios and times.",
];

const RESULT_BADGES: Record<string, { label: string; color: string }> = {
  "Successful": { label: "Success", color: "text-green-700 bg-green-50 border-green-200" },
  "Partial": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Failed": { label: "Failed", color: "text-red-700 bg-red-50 border-red-200" },
  "N/A": { label: "N/A", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function FireSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="h-4 w-4 text-brand" />
            Fire Safety & Drills
          </CardTitle>
          <Link href="/fire-safety" className="text-xs text-brand hover:underline flex items-center gap-1">
            Fire Safety <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.successful_evacuation_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Evac Rate</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.drills_count}</p>
            <p className="text-[10px] text-muted-foreground">Drills</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count > 0 ? "text-red-600" : "text-green-600")}>{m.non_compliant_count}</p>
            <p className="text-[10px] text-muted-foreground">Non-Comp</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.equipment_operational_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Equipment</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" />Recent Events</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = RESULT_BADGES[r.result] ?? RESULT_BADGES["N/A"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.date} · {r.time}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Fire Safety Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Fire Safety Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
