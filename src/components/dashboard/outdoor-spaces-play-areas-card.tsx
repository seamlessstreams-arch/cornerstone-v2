"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, ChevronRight, AlertTriangle, Brain, Clock, Fence } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_inspections: 11, unsafe_count: 1, hazard_count: 2, poor_condition_count: 2, not_accessible_count: 1, equipment_checked_rate: 81.8, fencing_secure_rate: 72.7, risk_assessed_rate: 81.8, children_consulted_rate: 63.6, unique_children: 5 };

const DEMO_RECORDS: { child: string; space: string; condition: string; safety: string }[] = [
  { child: "Child A", space: "Garden", condition: "Good", safety: "Safe" },
  { child: "Child B", space: "Play Area", condition: "Fair", safety: "Minor" },
  { child: "Child C", space: "Sports Court", condition: "Poor", safety: "Hazards" },
  { child: "Child D", space: "Sensory Garden", condition: "Excellent", safety: "Safe" },
  { child: "Child E", space: "Allotment", condition: "Unsafe", safety: "Closed" },
  { child: "Child A", space: "Seating Area", condition: "Good", safety: "Safe" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unsafe_hazard", severity: "critical", message: "Allotment rated unsafe with significant hazards — close immediately." },
  { type: "fencing_not_secure", severity: "high", message: "3 inspections found fencing not secure." },
  { type: "no_risk_assessment", severity: "high", message: "2 inspections have no risk assessment completed." },
];

const ARIA_INSIGHTS = [
  "11 inspections. Unsafe: 1. Hazards: 2. Poor cond.: 2. Equipment: 81.8%. Fencing: 72.7%.",
  "Priority: 1 unsafe space requiring closure. Fencing at 72.7%. Children consulted only 63.6%.",
  "Positive: Most spaces safe. Sensory garden excellent. Garden well maintained.",
];

const SAFETY_BADGES: Record<string, { label: string; color: string }> = {
  "Safe": { label: "Safe", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Moderate": { label: "Mod.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Hazards": { label: "Hazard", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Closed": { label: "Closed", color: "text-red-700 bg-red-50 border-red-200" },
};

export function OutdoorSpacesPlayAreasCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Trees className="h-4 w-4 text-brand" />Outdoor Spaces</CardTitle>
          <Link href="/outdoor-spaces-play-areas" className="text-xs text-brand hover:underline flex items-center gap-1">Inspections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.unsafe_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.unsafe_count === 0 ? "text-green-600" : "text-red-600")}>{m.unsafe_count}</p><p className="text-[10px] text-muted-foreground">Unsafe</p></div>
          <div className={cn("text-center rounded-lg p-2", m.hazard_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.hazard_count === 0 ? "text-green-600" : "text-amber-600")}>{m.hazard_count}</p><p className="text-[10px] text-muted-foreground">Hazards</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_condition_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_condition_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_condition_count}</p><p className="text-[10px] text-muted-foreground">Poor Cond.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_inspections}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SAFETY_BADGES[r.safety] ?? SAFETY_BADGES["Minor"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Fence className="h-3 w-3 text-green-600 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.space} · {r.condition}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Outdoor Space Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Outdoor Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
