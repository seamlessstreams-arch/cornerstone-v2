"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction, ChevronRight, AlertTriangle, Brain, Clock, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_surveys: 8, damaged_count: 1, removal_required_count: 1, non_compliant_count: 1, management_plan_rate: 75.0, register_update_rate: 87.5, staff_awareness_rate: 62.5, labelling_rate: 75.0, reinspection_scheduled_rate: 62.5, avg_risk_score: 4, unique_surveyors: 2 };

const DEMO_RECORDS: { surveyor: string; location: string; type: string; condition: string }[] = [
  { surveyor: "D. Laville", location: "Boiler Room", type: "Chrysotile", condition: "Good" },
  { surveyor: "J. Hughes", location: "Roof Void", type: "Amosite", condition: "Fair" },
  { surveyor: "D. Laville", location: "Pipe Lagging", type: "Chrysotile", condition: "Poor" },
  { surveyor: "J. Hughes", location: "Floor Tiles", type: "Presumed ACM", condition: "Good" },
  { surveyor: "D. Laville", location: "Textured Coating", type: "Chrysotile", condition: "Fair" },
  { surveyor: "J. Hughes", location: "Kitchen", type: "No Asbestos Found", condition: "Good" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "damaged_no_removal", severity: "high", message: "Pipe Lagging in poor condition without removal action planned." },
  { type: "no_management_plan", severity: "high", message: "2 locations with asbestos found without management plan." },
  { type: "staff_awareness", severity: "medium", message: "3 locations without staff awareness confirmed." },
];

const ARIA_INSIGHTS = [
  "8 surveys across 2 surveyors. Damaged: 1. Removal required: 1. Non-compliant: 1.",
  "Priority: 1 poor condition location. Management plans 75.0%. Staff awareness 62.5%.",
  "Asbestos duty of care is absolute. Is the register truly up to date? Are staff genuinely aware of ACM locations?",
];

const CONDITION_BADGES: Record<string, { label: string; color: string }> = {
  "Good": { label: "Good", color: "text-green-700 bg-green-50 border-green-200" },
  "Fair": { label: "Fair", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Damaged": { label: "Damaged", color: "text-red-700 bg-red-50 border-red-200" },
  "Severely Damaged": { label: "Severe", color: "text-red-900 bg-red-100 border-red-300" },
};

export function HomeAsbestosManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-zinc-200">
      <CardHeader className="pb-3 bg-zinc-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Construction className="h-4 w-4 text-zinc-600" /><span className="text-zinc-900">Asbestos Mgmt</span></CardTitle>
          <Link href="/home-asbestos-management" className="text-xs text-zinc-600 hover:underline flex items-center gap-1">Surveys <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.damaged_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.damaged_count === 0 ? "text-green-600" : "text-red-600")}>{m.damaged_count}</p><p className="text-[10px] text-muted-foreground">Damaged</p></div>
          <div className={cn("text-center rounded-lg p-2", m.removal_required_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.removal_required_count === 0 ? "text-green-600" : "text-amber-600")}>{m.removal_required_count}</p><p className="text-[10px] text-muted-foreground">Removal</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-amber-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className="text-center rounded-lg p-2 bg-zinc-50"><p className="text-lg font-bold tabular-nums text-zinc-600">{m.total_surveys}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Surveys</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = CONDITION_BADGES[r.condition] ?? CONDITION_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HardHat className="h-3 w-3 text-zinc-500 shrink-0" /><span className="font-medium">{r.surveyor}</span><span className="text-muted-foreground truncate">{r.location} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Asbestos Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-zinc-700"><Brain className="h-3 w-3" />ARIA Asbestos Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-zinc-200 bg-zinc-50 text-zinc-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
