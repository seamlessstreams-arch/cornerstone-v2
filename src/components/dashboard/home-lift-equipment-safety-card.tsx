"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpFromDot, ChevronRight, AlertTriangle, Brain, Clock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_inspections: 8, prohibited_count: 0, major_defects_count: 1, minor_defects_count: 2, remedial_completion_rate: 62.5, certificate_rate: 87.5, swl_confirmed_rate: 87.5, next_inspection_rate: 75.0, non_compliant_count: 1, defects_total: 5, unique_inspectors: 2 };

const DEMO_RECORDS: { inspector: string; equipment: string; result: string; location: string }[] = [
  { inspector: "Eng. A", equipment: "Passenger Lift", result: "Satisfactory", location: "Main Hall" },
  { inspector: "Eng. B", equipment: "Stairlift", result: "Minor Defects", location: "Staircase 1" },
  { inspector: "Eng. A", equipment: "Hoist", result: "Satisfactory", location: "Bedroom 3" },
  { inspector: "Eng. B", equipment: "Platform Lift", result: "Major Defects", location: "Entrance" },
  { inspector: "Eng. A", equipment: "Bath Hoist", result: "Satisfactory", location: "Bathroom 2" },
  { inspector: "Eng. B", equipment: "Ceiling Track", result: "Minor Defects", location: "Bedroom 1" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "major_no_remedial", severity: "critical", message: "Platform lift with major defects without remedial completed — do not use." },
  { type: "non_compliant", severity: "high", message: "1 equipment item with non-compliant status." },
  { type: "swl_not_confirmed", severity: "medium", message: "1 equipment item without SWL confirmed." },
];

const ARIA_INSIGHTS = [
  "8 inspections across 2 inspectors. Prohibited: 0. Major defects: 1. Minor: 2.",
  "Priority: 1 major defect without remedial. Remedial completion 62.5%. Certificate 87.5%.",
  "LOLER compliance is a legal duty. Is the thorough examination within 6 months for hoists? Are SWL plates visible and correct?",
];

const RESULT_BADGES: Record<string, { label: string; color: string }> = {
  "Satisfactory": { label: "Satisfactory", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Defects": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Major Defects": { label: "Major", color: "text-red-700 bg-red-50 border-red-200" },
  "Prohibited Use": { label: "Prohibited", color: "text-red-900 bg-red-100 border-red-300" },
  "Not Tested": { label: "Not Tested", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function HomeLiftEquipmentSafetyCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ArrowUpFromDot className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Lift Safety</span></CardTitle>
          <Link href="/home-lift-equipment-safety" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Inspections <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.prohibited_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.prohibited_count === 0 ? "text-green-600" : "text-red-600")}>{m.prohibited_count}</p><p className="text-[10px] text-muted-foreground">Prohibited</p></div>
          <div className={cn("text-center rounded-lg p-2", m.major_defects_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.major_defects_count === 0 ? "text-green-600" : "text-red-600")}>{m.major_defects_count}</p><p className="text-[10px] text-muted-foreground">Major</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-amber-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_inspections}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Inspections</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESULT_BADGES[r.result] ?? RESULT_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Wrench className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.inspector}</span><span className="text-muted-foreground truncate">{r.equipment} · {r.location}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Lift Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Lift Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
