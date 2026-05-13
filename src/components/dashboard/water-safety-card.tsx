"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — WATER SAFETY & LEGIONELLA INTELLIGENCE CARD
// Dashboard card for water temperature, legionella, and scalding prevention.
// CHR 2015 Reg 25, Reg 36; HSE L8, HSG274.
// SCCIF: Helped & Protected — "Water systems are safe."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplets, ChevronRight, AlertTriangle, Brain,
  Clock, Thermometer, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 36,
  temperature_check_count: 18,
  legionella_assessment_count: 2,
  flushing_count: 8,
  tmv_check_count: 4,
  compliant_rate: 88.9,
  too_hot_count: 1,
  too_cold_count: 2,
  tmv_fault_count: 1,
  tmv_fitted_rate: 83.3,
  tmv_operational_rate: 80.6,
  flushing_completed_rate: 86.1,
  legionella_assessment_current_rate: 91.7,
  scalding_risk_mitigated_rate: 94.4,
  high_risk_count: 1,
  very_high_risk_count: 0,
  average_hot_temp: 43.2,
  average_cold_temp: 12.8,
  check_overdue_count: 2,
};

const DEMO_RECORDS: { type: string; location: string; date: string; status: string }[] = [
  { type: "Temp Check", location: "Bathroom 1", date: "12 May", status: "Compliant" },
  { type: "Temp Check", location: "Kitchen", date: "12 May", status: "Compliant" },
  { type: "TMV Check", location: "En Suite", date: "10 May", status: "TMV Fault" },
  { type: "Flushing", location: "Staff Bath", date: "9 May", status: "Compliant" },
  { type: "Temp Check", location: "Bathroom 2", date: "8 May", status: "Too Hot" },
  { type: "Legionella RA", location: "All", date: "1 May", status: "Compliant" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "scalding_risk", severity: "critical", message: "Scalding risk at bathroom 2 on 2025-05-08 — water too hot, immediate action required." },
  { type: "tmv_fault", severity: "high", message: "1 TMV fault detected — arrange repair to prevent scalding." },
  { type: "check_overdue", severity: "medium", message: "2 water safety checks are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "36 water safety records. Compliant: 88.9%. Avg hot: 43.2°C. Avg cold: 12.8°C. TMV operational: 80.6%. Legionella current: 91.7%.",
  "Priority: 1 scalding risk (too hot). 1 TMV fault. 2 overdue checks. TMV operational rate at 80.6% needs attention.",
  "Positive: High compliance rate. Legionella assessments current. Scalding risks mitigated 94.4%. Regular temperature monitoring in place.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Too Hot": { label: "Too Hot", color: "text-red-700 bg-red-50 border-red-200" },
  "Too Cold": { label: "Too Cold", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "TMV Fault": { label: "TMV Fault", color: "text-amber-700 bg-amber-50 border-amber-200" },
};

export function WaterSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Droplets className="h-4 w-4 text-brand" />
            Water Safety & Legionella
          </CardTitle>
          <Link href="/water-safety" className="text-xs text-brand hover:underline flex items-center gap-1">
            Water Safety <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.compliant_rate >= 85 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.compliant_rate >= 85 ? "text-green-600" : "text-amber-600")}>{m.compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.average_hot_temp}°C</p>
            <p className="text-[10px] text-muted-foreground">Avg Hot</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.tmv_fault_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.tmv_fault_count === 0 ? "text-green-600" : "text-amber-600")}>{m.tmv_fault_count}</p>
            <p className="text-[10px] text-muted-foreground">TMV Faults</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.check_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.check_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.check_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Water Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Thermometer className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.location} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Water Safety Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Water Safety Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
