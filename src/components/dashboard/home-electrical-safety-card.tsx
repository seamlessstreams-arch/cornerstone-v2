"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronRight, AlertTriangle, Brain, Clock, PlugZap } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_inspections: 8, unsatisfactory_count: 1, c1_total: 0, c2_total: 2, c3_total: 4, fi_total: 1, remedial_completion_rate: 62.5, satisfactory_rate: 75.0, next_inspection_scheduled_rate: 87.5, non_compliant_count: 1, unique_inspectors: 2 };

const DEMO_RECORDS: { inspector: string; type: string; result: string; defects: number }[] = [
  { inspector: "D. Laville", type: "EICR", result: "Satisfactory", defects: 0 },
  { inspector: "J. Hughes", type: "PAT Testing", result: "Satisfactory", defects: 0 },
  { inspector: "D. Laville", type: "Emergency Lighting", result: "Satisfactory", defects: 1 },
  { inspector: "J. Hughes", type: "EICR", result: "Unsatisfactory", defects: 3 },
  { inspector: "D. Laville", type: "Fire Alarm", result: "Satisfactory", defects: 0 },
  { inspector: "J. Hughes", type: "PAT Testing", result: "Further Investigation", defects: 2 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unsatisfactory_no_remedial", severity: "critical", message: "1 unsatisfactory EICR without remedial work completed." },
  { type: "c2_no_remedial", severity: "high", message: "2 C2 (potentially dangerous) defects without remedial completion." },
  { type: "major_non_compliance", severity: "high", message: "1 inspection with major non-compliance status." },
];

const ARIA_INSIGHTS = [
  "8 inspections across 2 inspectors. Unsatisfactory: 1. C1: 0. C2: 2. C3: 4.",
  "Priority: 1 unsatisfactory without remedial. Remedial completion 62.5%. Satisfactory 75.0%.",
  "Electrical safety is non-negotiable. Are C2 defects being resolved within 28 days? Is the EICR within its 5-year validity?",
];

const RESULT_BADGES: Record<string, { label: string; color: string }> = {
  "Satisfactory": { label: "Satisfactory", color: "text-green-700 bg-green-50 border-green-200" },
  "Unsatisfactory": { label: "Unsatisfactory", color: "text-red-700 bg-red-50 border-red-200" },
  "Further Investigation": { label: "Further Inv.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Tested": { label: "Not Tested", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function HomeElectricalSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-blue-200">
      <CardHeader className="pb-3 bg-blue-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-blue-600" /><span className="text-blue-900">Electrical Safety</span></CardTitle>
          <Link href="/home-electrical-safety" className="text-xs text-blue-600 hover:underline flex items-center gap-1">Inspections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.c1_total === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.c1_total === 0 ? "text-green-600" : "text-red-600")}>{m.c1_total}</p><p className="text-[10px] text-muted-foreground">C1 Danger</p></div>
          <div className={cn("text-center rounded-lg p-2", m.c2_total === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.c2_total === 0 ? "text-green-600" : "text-amber-600")}>{m.c2_total}</p><p className="text-[10px] text-muted-foreground">C2 Potent.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unsatisfactory_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.unsatisfactory_count === 0 ? "text-green-600" : "text-red-600")}>{m.unsatisfactory_count}</p><p className="text-[10px] text-muted-foreground">Unsatisf.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_inspections}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESULT_BADGES[r.result] ?? RESULT_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><PlugZap className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.inspector}</span><span className="text-muted-foreground truncate">{r.type} · {r.defects} defects</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Electrical Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-blue-700"><Brain className="h-3 w-3" />ARIA Electrical Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
