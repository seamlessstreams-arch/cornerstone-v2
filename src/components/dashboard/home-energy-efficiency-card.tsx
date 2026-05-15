"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronRight, AlertTriangle, Brain, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_assessments: 8, poor_rating_count: 1, improvement_identified_count: 3, completed_count: 2, deferred_count: 1, epc_valid_rate: 75.0, smart_meter_rate: 62.5, led_lighting_rate: 87.5, insulation_rate: 75.0, draught_proofing_rate: 50.0, renewable_rate: 25.0, energy_saving_rate: 75.0, children_involved_rate: 37.5, total_monthly_cost: 1850, total_carbon: 4.2, unique_assessors: 3 };

const DEMO_RECORDS: { assessor: string; area: string; rating: string; status: string }[] = [
  { assessor: "D. Laville", area: "Heating", rating: "C", status: "Completed" },
  { assessor: "J. Hughes", area: "Insulation", rating: "D", status: "In Progress" },
  { assessor: "D. Laville", area: "Lighting", rating: "B", status: "Completed" },
  { assessor: "L. Jones", area: "Windows", rating: "E", status: "Identified" },
  { assessor: "J. Hughes", area: "Water Heat.", rating: "C", status: "Approved" },
  { assessor: "D. Laville", area: "Appliances", rating: "B", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "epc_not_valid", severity: "critical", message: "2 assessments show EPC not valid — renew energy performance certificate urgently." },
  { type: "poor_no_improvement", severity: "high", message: "Windows rated E with improvement deferred — address poor energy efficiency." },
  { type: "smart_meter_missing", severity: "medium", message: "3 areas without smart meter installed — consider installation for monitoring." },
];

const ARIA_INSIGHTS = [
  "8 assessments across 3 assessors. Poor ratings: 1. Improvements identified: 3. Completed: 2.",
  "Priority: 1 poor rating deferred. EPC valid 75.0%. Renewable energy 25.0%.",
  "Energy efficiency saves money and teaches responsibility. Are children involved in saving energy? Is the home sustainable for the future?",
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  "A": { label: "A", color: "text-green-700 bg-green-50 border-green-200" },
  "B": { label: "B", color: "text-green-700 bg-green-50 border-green-200" },
  "C": { label: "C", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "D": { label: "D", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "E": { label: "E", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "F": { label: "F", color: "text-red-700 bg-red-50 border-red-200" },
  "G": { label: "G", color: "text-red-700 bg-red-50 border-red-200" },
};

export function HomeEnergyEfficiencyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-orange-200">
      <CardHeader className="pb-3 bg-orange-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-orange-600" /><span className="text-orange-900">Energy Efficiency</span></CardTitle>
          <Link href="/home-energy-efficiency" className="text-xs text-orange-600 hover:underline flex items-center gap-1">Efficiency <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.poor_rating_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_rating_count === 0 ? "text-green-600" : "text-red-600")}>{m.poor_rating_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.deferred_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.deferred_count === 0 ? "text-green-600" : "text-amber-600")}>{m.deferred_count}</p><p className="text-[10px] text-muted-foreground">Deferred</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.completed_count}</p><p className="text-[10px] text-muted-foreground">Completed</p></div>
          <div className="text-center rounded-lg p-2 bg-orange-50"><p className="text-lg font-bold tabular-nums text-orange-600">{m.total_assessments}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RATING_BADGES[r.rating] ?? RATING_BADGES["C"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Lightbulb className="h-3 w-3 text-orange-500 shrink-0" /><span className="font-medium">{r.assessor}</span><span className="text-muted-foreground truncate">{r.area} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Energy Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-orange-700"><Brain className="h-3 w-3" />ARIA Energy Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-orange-200 bg-orange-50 text-orange-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
