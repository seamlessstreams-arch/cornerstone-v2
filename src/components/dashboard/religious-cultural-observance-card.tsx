"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, ChevronRight, AlertTriangle, Brain, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_observances: 10, not_accommodated_count: 1, poorly_accommodated_count: 1, poor_sensitivity_count: 1, unaware_count: 1, family_consulted_rate: 70.0, dietary_needs_rate: 80.0, staff_trained_rate: 60.0, community_links_rate: 50.0, unique_children: 6 };

const DEMO_RECORDS: { child: string; type: string; accommodation: string; sensitivity: string }[] = [
  { child: "Child A", type: "Daily Prayer", accommodation: "Fully", sensitivity: "Excellent" },
  { child: "Child B", type: "Dietary Req.", accommodation: "Mostly", sensitivity: "Good" },
  { child: "Child C", type: "Cultural Celeb.", accommodation: "Not Accom.", sensitivity: "Unaware" },
  { child: "Child D", type: "Weekly Worship", accommodation: "Fully", sensitivity: "Good" },
  { child: "Child E", type: "Heritage Activity", accommodation: "Partially", sensitivity: "Adequate" },
  { child: "Child F", type: "Dress Code", accommodation: "Poorly", sensitivity: "Poor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "not_accommodated_unaware", severity: "critical", message: "Child C's cultural celebration not accommodated with cultural unawareness." },
  { type: "dietary_needs_not_met", severity: "high", message: "2 observances have dietary needs not met." },
  { type: "staff_not_trained", severity: "medium", message: "4 observances with untrained staff." },
];

const ARIA_INSIGHTS = [
  "10 observances. Not accommodated: 1. Poorly: 1. Poor sensitivity: 1. Unaware: 1. Dietary: 80%. Trained: 60%.",
  "Priority: 1 unaccommodated unaware. 2 dietary gaps. 4 untrained staff. Strengthen cultural competence.",
  "Positive: Most observances respectfully supported. Celebrations facilitated. Discrimination addressed where found.",
];

const ACCOMMODATION_BADGES: Record<string, { label: string; color: string }> = {
  "Fully": { label: "Full", color: "text-green-700 bg-green-50 border-green-200" },
  "Mostly": { label: "Mostly", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Partially": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poorly": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Not Accom.": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ReligiousCulturalObservanceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Church className="h-4 w-4 text-brand" />Religion & Culture</CardTitle>
          <Link href="/religious-cultural-observance" className="text-xs text-brand hover:underline flex items-center gap-1">Observance <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.not_accommodated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_accommodated_count === 0 ? "text-green-600" : "text-red-600")}>{m.not_accommodated_count}</p><p className="text-[10px] text-muted-foreground">No Accom.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.unaware_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.unaware_count === 0 ? "text-green-600" : "text-red-600")}>{m.unaware_count}</p><p className="text-[10px] text-muted-foreground">Unaware</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_sensitivity_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_sensitivity_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_sensitivity_count}</p><p className="text-[10px] text-muted-foreground">Poor Sens.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_observances}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Observances</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = ACCOMMODATION_BADGES[r.accommodation] ?? ACCOMMODATION_BADGES["Fully"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Globe className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.sensitivity}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Cultural Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Cultural Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
