"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — VEHICLE MANAGEMENT INTELLIGENCE CARD
// Dashboard card for vehicle checks, MOT, safety, and driver authorisation.
// CHR 2015 Reg 25, Reg 36, Reg 12.
// SCCIF: Helped & Protected — "Children are transported safely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car, ChevronRight, AlertTriangle, Brain,
  Clock, Wrench, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_checks: 18,
  daily_check_count: 10,
  weekly_count: 4,
  mot_count: 2,
  pass_rate: 83.3,
  fail_count: 1,
  advisory_count: 2,
  fully_authorised_rate: 94.4,
  unroadworthy_count: 0,
  incident_count: 1,
  unique_vehicles: 3,
};

const DEMO_RECORDS: { type: string; vehicle: string; date: string; outcome: string }[] = [
  { type: "Daily", vehicle: "AB12 CDE", date: "13 May", outcome: "Pass" },
  { type: "Weekly", vehicle: "FG34 HIJ", date: "12 May", outcome: "Advisory" },
  { type: "Daily", vehicle: "KL56 MNO", date: "12 May", outcome: "Pass" },
  { type: "MOT", vehicle: "AB12 CDE", date: "10 May", outcome: "Pass" },
  { type: "Daily", vehicle: "FG34 HIJ", date: "9 May", outcome: "Fail" },
  { type: "Service", vehicle: "KL56 MNO", date: "5 May", outcome: "Pass" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "check_failure", severity: "high", message: "1 vehicle check has failed — address defects before use." },
  { type: "journey_incident", severity: "high", message: "1 incident during journey — review and report." },
  { type: "safety_equipment", severity: "medium", message: "2 checks without first aid kit present — ensure all vehicles are equipped." },
];

const ARIA_INSIGHTS = [
  "18 checks. Pass rate: 83.3%. Fully authorised: 94.4%. 3 vehicles. 1 incident. 1 fail. 2 advisories.",
  "Priority: 1 failed check. 1 journey incident. 2 missing first aid kits. Address defects immediately.",
  "Positive: High authorisation rate. Regular daily checks. MOTs current. Improve safety equipment compliance.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Pass": { label: "Pass", color: "text-green-700 bg-green-50 border-green-200" },
  "Advisory": { label: "Advisory", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Fail": { label: "Fail", color: "text-red-700 bg-red-50 border-red-200" },
};

export function VehicleManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Car className="h-4 w-4 text-brand" />
            Vehicle Management
          </CardTitle>
          <Link href="/vehicle-management" className="text-xs text-brand hover:underline flex items-center gap-1">
            Vehicles <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.pass_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.pass_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.pass_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Pass Rate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.fully_authorised_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.fully_authorised_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.fully_authorised_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Authorised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.fail_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.fail_count === 0 ? "text-green-600" : "text-red-600")}>{m.fail_count}</p>
            <p className="text-[10px] text-muted-foreground">Failures</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.incident_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.incident_count === 0 ? "text-green-600" : "text-red-600")}>{m.incident_count}</p>
            <p className="text-[10px] text-muted-foreground">Incidents</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Pass"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Wrench className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.vehicle} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Vehicle Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Vehicle Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
