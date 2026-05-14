"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, ChevronRight, AlertTriangle, Brain, Clock, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_inspections: 12, poor_condition_count: 1, unacceptable_condition_count: 0, high_hazard_count: 1, immediate_hazard_count: 0, cleanliness_rate: 91.7, fire_safety_rate: 83.3, maintenance_rate: 75.0, security_rate: 91.7 };

const DEMO_RECORDS: { area: string; condition: string; hazard: string; compliance: string }[] = [
  { area: "Kitchen", condition: "Good", hazard: "None", compliance: "Compliant" },
  { area: "Bathroom", condition: "Satisfactory", hazard: "Low", compliance: "Minor" },
  { area: "Bedroom", condition: "Excellent", hazard: "None", compliance: "Compliant" },
  { area: "Garden", condition: "Poor", hazard: "Medium", compliance: "Significant" },
  { area: "Communal", condition: "Good", hazard: "None", compliance: "Compliant" },
  { area: "Entrance", condition: "Good", hazard: "High", compliance: "Minor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "fire_safety_not_checked", severity: "high", message: "2 inspections have fire safety not checked." },
  { type: "maintenance_overdue", severity: "high", message: "3 inspections show maintenance not up to date." },
  { type: "cleanliness_issues", severity: "medium", message: "2 inspections with cleanliness not acceptable." },
];

const ARIA_INSIGHTS = [
  "12 inspections. Poor: 1. High hazard: 1. Cleanliness: 91.7%. Fire safety: 83.3%. Maintenance: 75%.",
  "Priority: 2 fire safety gaps. 3 maintenance overdue. 2 cleanliness issues. Strengthen inspection follow-up.",
  "Positive: Security consistently adequate. Bedrooms well-maintained. Communal areas homely and welcoming.",
];

const CONDITION_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Satisfactory": { label: "Satisfactory", color: "text-gray-700 bg-gray-50 border-gray-200" },
  "Poor": { label: "Poor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Unacceptable": { label: "Unacceptable", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeEnvironmentInspectionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><HardHat className="h-4 w-4 text-brand" />Environment</CardTitle>
          <Link href="/home-environment-inspection" className="text-xs text-brand hover:underline flex items-center gap-1">Inspections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_condition_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_condition_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_condition_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.high_hazard_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.high_hazard_count === 0 ? "text-green-600" : "text-red-600")}>{m.high_hazard_count}</p><p className="text-[10px] text-muted-foreground">Hazard</p></div>
          <div className={cn("text-center rounded-lg p-2", m.fire_safety_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.fire_safety_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.fire_safety_rate}%</p><p className="text-[10px] text-muted-foreground">Fire</p></div>
          <div className={cn("text-center rounded-lg p-2", m.maintenance_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.maintenance_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.maintenance_rate}%</p><p className="text-[10px] text-muted-foreground">Maint.</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = CONDITION_BADGES[r.condition] ?? CONDITION_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Building className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.area}</span><span className="text-muted-foreground truncate">{r.hazard} · {r.compliance}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Environment Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Environment Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
