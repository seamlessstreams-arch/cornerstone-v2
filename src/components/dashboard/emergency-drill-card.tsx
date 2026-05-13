"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EMERGENCY DRILL INTELLIGENCE CARD
// Dashboard card for fire drills, lockdown exercises, and emergency readiness.
// CHR 2015 Reg 25, Reg 36, Regulatory Reform (Fire Safety) Order 2005.
// SCCIF: Helped & Protected — "Children know what to do in an emergency."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Siren, ChevronRight, AlertTriangle, Brain,
  Clock, Timer, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_drills: 12,
  fire_evacuation_count: 5,
  lockdown_count: 3,
  missing_child_count: 2,
  successful_rate: 75.0,
  failed_count: 1,
  cancelled_count: 1,
  all_children_accounted_rate: 91.7,
  all_staff_participated_rate: 83.3,
  assembly_point_used_rate: 91.7,
  equipment_working_rate: 83.3,
  children_distressed_count: 2,
  average_evacuation_time: 142.5,
  fully_prepared_rate: 66.7,
  unprepared_count: 1,
  drill_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; outcome: string; date: string; time: string; evac: string }[] = [
  { type: "Fire Evacuation", outcome: "Successful", date: "12 May", time: "Day", evac: "128s" },
  { type: "Lockdown", outcome: "Successful", date: "8 May", time: "Evening", evac: "—" },
  { type: "Missing Child", outcome: "Partial", date: "5 May", time: "Day", evac: "—" },
  { type: "Fire Evacuation", outcome: "Failed", date: "28 Apr", time: "Night", evac: "195s" },
  { type: "Intruder", outcome: "Successful", date: "22 Apr", time: "Day", evac: "—" },
  { type: "Fire Evacuation", outcome: "Successful", date: "15 Apr", time: "Weekend", evac: "105s" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "children_not_accounted", severity: "critical", message: "Children not all accounted for during missing child drill on 5 May — review procedures immediately." },
  { type: "drill_failed", severity: "high", message: "Fire evacuation drill failed on 28 Apr — retrain staff and repeat drill." },
  { type: "staff_unprepared", severity: "high", message: "1 drill shows staff unprepared — arrange refresher training." },
  { type: "drill_overdue", severity: "medium", message: "1 drill is overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "12 drills conducted. Success rate: 75%. Average evacuation: 142.5s. Children accounted: 91.7%. Assembly point used: 91.7%.",
  "Priority: 1 failed fire drill. Children not accounted in 1 drill. 1 staff unprepared. 1 drill overdue. 2 children distressed during drills.",
  "Positive: 5 fire evacuations practised. Lockdown drills regular. Good assembly point use. Improve night shift drill success and staff readiness.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Successful": { label: "Pass", color: "text-green-700 bg-green-50 border-green-200" },
  "Partial": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Failed": { label: "Failed", color: "text-red-700 bg-red-50 border-red-200" },
  "Cancelled": { label: "Cancelled", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function EmergencyDrillCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Siren className="h-4 w-4 text-brand" />
            Emergency Drills
          </CardTitle>
          <Link href="/emergency-drills" className="text-xs text-brand hover:underline flex items-center gap-1">
            Drills <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.successful_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.successful_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.successful_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Success</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.all_children_accounted_rate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.all_children_accounted_rate >= 100 ? "text-green-600" : "text-red-600")}>{m.all_children_accounted_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Accounted</p>
          </div>
          <div className="text-center rounded-lg p-2 bg-blue-50">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.average_evacuation_time}s</p>
            <p className="text-[10px] text-muted-foreground">Avg Evac</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.failed_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.failed_count === 0 ? "text-green-600" : "text-red-600")}>{m.failed_count}</p>
            <p className="text-[10px] text-muted-foreground">Failed</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Drills</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Cancelled"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Timer className="h-3 w-3 text-orange-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.time} · {r.date} · {r.evac}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Drill Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Drill Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
