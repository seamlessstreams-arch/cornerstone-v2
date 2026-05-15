"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, ChevronRight, AlertTriangle, Brain, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_inspections: 8, active_issues: 1, infestation_count: 0, treatment_completion_rate: 75.0, proofing_rate: 87.5, hygiene_rate: 87.5, food_storage_rate: 100.0, unique_locations: 6, unique_inspectors: 2 };

const DEMO_RECORDS: { inspector: string; pest: string; location: string; status: string }[] = [
  { inspector: "D. Laville", pest: "Rodents", location: "Kitchen", status: "Resolved" },
  { inspector: "J. Hughes", pest: "Ants", location: "Garden Room", status: "Under Treatment" },
  { inspector: "D. Laville", pest: "None Found", location: "Bathroom 1", status: "Clear" },
  { inspector: "J. Hughes", pest: "Moths", location: "Linen Store", status: "Resolved" },
  { inspector: "D. Laville", pest: "Flies", location: "Kitchen", status: "Clear" },
  { inspector: "J. Hughes", pest: "Bed Bugs", location: "Bedroom 2", status: "Active Issue" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "infestation", severity: "critical", message: "Bed bugs active in Bedroom 2 — immediate treatment and room isolation required." },
  { type: "hygiene_fail", severity: "high", message: "1 location with unsatisfactory hygiene standards." },
  { type: "re_inspection_due", severity: "medium", message: "2 locations with re-inspection overdue." },
];

const ARIA_INSIGHTS = [
  "8 pest inspections across 6 locations. Active issues: 1. Infestations: 0. Treatment completion 75.0%.",
  "Priority: 1 active bed bug issue. Proofing adequate 87.5%. Food storage 100.0%.",
  "Pest control protects resident welfare and home reputation. Are proofing measures maintained? Is the integrated pest management plan reviewed quarterly?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Clear": { label: "Clear", color: "text-green-700 bg-green-50 border-green-200" },
  "Active Issue": { label: "Active", color: "text-red-700 bg-red-50 border-red-200" },
  "Under Treatment": { label: "Treating", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Resolved": { label: "Resolved", color: "text-green-700 bg-green-50 border-green-200" },
  "Re-Inspection Due": { label: "Re-inspect", color: "text-blue-700 bg-blue-50 border-blue-200" },
};

export function HomePestControlManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-lime-200">
      <CardHeader className="pb-3 bg-lime-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Bug className="h-4 w-4 text-lime-600" /><span className="text-lime-900">Pest Control</span></CardTitle>
          <Link href="/home-pest-control-management" className="text-xs text-lime-600 hover:underline flex items-center gap-1">Inspections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.active_issues === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.active_issues === 0 ? "text-green-600" : "text-red-600")}>{m.active_issues}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
          <div className={cn("text-center rounded-lg p-2", m.infestation_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.infestation_count === 0 ? "text-green-600" : "text-red-600")}>{m.infestation_count}</p><p className="text-[10px] text-muted-foreground">Infestation</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_locations}</p><p className="text-[10px] text-muted-foreground">Locations</p></div>
          <div className="text-center rounded-lg p-2 bg-lime-50"><p className="text-lg font-bold tabular-nums text-lime-600">{m.total_inspections}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Clear"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Search className="h-3 w-3 text-lime-500 shrink-0" /><span className="font-medium">{r.inspector}</span><span className="text-muted-foreground truncate">{r.pest} · {r.location}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pest Control Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-lime-700"><Brain className="h-3 w-3" />ARIA Pest Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-lime-200 bg-lime-50 text-lime-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
