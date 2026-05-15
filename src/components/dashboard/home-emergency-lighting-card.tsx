"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, AlertTriangle, Brain, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_tests: 8, fail_count: 1, remedial_count: 1, pass_rate: 75.0, battery_good_rate: 62.5, escape_route_rate: 87.5, signage_rate: 87.5, fault_rectified_rate: 50.0, unique_locations: 6, unique_testers: 2 };

const DEMO_RECORDS: { tester: string; type: string; location: string; result: string }[] = [
  { tester: "D. Laville", type: "Monthly Function Test", location: "Hallway 1", result: "Pass" },
  { tester: "J. Hughes", type: "Monthly Function Test", location: "Kitchen", result: "Pass" },
  { tester: "D. Laville", type: "Annual Duration Test", location: "Staircase", result: "Fail" },
  { tester: "J. Hughes", type: "Monthly Function Test", location: "Bedroom 1", result: "Pass" },
  { tester: "D. Laville", type: "Quarterly Inspection", location: "Entrance", result: "Partial" },
  { tester: "J. Hughes", type: "Replacement", location: "Bathroom 2", result: "Pass" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "fail_escape", severity: "critical", message: "Emergency lighting failed on staircase escape route — immediate replacement required." },
  { type: "battery_poor", severity: "high", message: "3 luminaires with poor or failed battery condition." },
  { type: "fault_open", severity: "medium", message: "2 faults identified but not yet rectified." },
];

const ARIA_INSIGHTS = [
  "8 emergency lighting tests across 6 locations. Fail: 1. Remedial required: 1. Pass rate 75.0%.",
  "Priority: 1 escape route lighting failure. Battery good 62.5%. Fault rectified 50.0%.",
  "Emergency lighting is critical for safe evacuation. Is BS 5266 testing schedule maintained? Are batteries replaced proactively before failure?",
];

const RESULT_BADGES: Record<string, { label: string; color: string }> = {
  "Pass": { label: "Pass", color: "text-green-700 bg-green-50 border-green-200" },
  "Fail": { label: "Fail", color: "text-red-700 bg-red-50 border-red-200" },
  "Partial": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Tested": { label: "Not Tested", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function HomeEmergencyLightingCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-yellow-200">
      <CardHeader className="pb-3 bg-yellow-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-600" /><span className="text-yellow-900">Emergency Lighting</span></CardTitle>
          <Link href="/home-emergency-lighting" className="text-xs text-yellow-600 hover:underline flex items-center gap-1">Tests <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.fail_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.fail_count === 0 ? "text-green-600" : "text-red-600")}>{m.fail_count}</p><p className="text-[10px] text-muted-foreground">Fail</p></div>
          <div className={cn("text-center rounded-lg p-2", m.remedial_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.remedial_count === 0 ? "text-green-600" : "text-amber-600")}>{m.remedial_count}</p><p className="text-[10px] text-muted-foreground">Remedial</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_locations}</p><p className="text-[10px] text-muted-foreground">Locations</p></div>
          <div className="text-center rounded-lg p-2 bg-yellow-50"><p className="text-lg font-bold tabular-nums text-yellow-600">{m.total_tests}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Tests</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESULT_BADGES[r.result] ?? RESULT_BADGES["Pass"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Zap className="h-3 w-3 text-yellow-500 shrink-0" /><span className="font-medium">{r.tester}</span><span className="text-muted-foreground truncate">{r.type} · {r.location}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Lighting Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-yellow-700"><Brain className="h-3 w-3" />ARIA Lighting Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-yellow-200 bg-yellow-50 text-yellow-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
