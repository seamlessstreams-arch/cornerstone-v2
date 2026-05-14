"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, ChevronRight, AlertTriangle, Brain, Clock, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_sessions: 10, not_supported_count: 1, disengaged_count: 1, poor_sensitivity_count: 2, insensitive_count: 1, child_wishes_rate: 80.0, attendance_rate: 70.0, cultural_awareness_rate: 80.0, festivals_rate: 70.0, unique_children: 5 };

const DEMO_RECORDS: { child: string; type: string; support: string; sensitivity: string }[] = [
  { child: "Child A", type: "Worship", support: "Fully Supp.", sensitivity: "Excellent" },
  { child: "Child B", type: "Festival", support: "Well Supp.", sensitivity: "Good" },
  { child: "Child C", type: "Dietary", support: "Not Supp.", sensitivity: "Insensitive" },
  { child: "Child D", type: "Prayer", support: "Partially", sensitivity: "Adequate" },
  { child: "Child E", type: "Community", support: "Well Supp.", sensitivity: "Good" },
  { child: "Child F", type: "Education", support: "Partially", sensitivity: "Poor" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "insensitive_not_supported", severity: "critical", message: "Child C experienced insensitive and unsupported faith observance — safeguarding review." },
  { type: "wishes_not_respected", severity: "high", message: "2 sessions have child wishes not respected." },
  { type: "attendance_not_facilitated", severity: "high", message: "3 sessions have worship attendance not facilitated." },
];

const ARIA_INSIGHTS = [
  "10 sessions. Not supported: 1. Poor sensitivity: 2. Insensitive: 1. Wishes: 80.0%. Attendance: 70.0%.",
  "Priority: 1 insensitive/unsupported case. Attendance at 70.0%. Festivals acknowledged at 70.0%.",
  "Positive: Most children's faith respected. Good community links. Cultural awareness improving.",
];

const SENSITIVITY_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excel.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Insensitive": { label: "Insens.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function FaithSpiritualObservanceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Church className="h-4 w-4 text-brand" />Faith Observance</CardTitle>
          <Link href="/faith-spiritual-observance" className="text-xs text-brand hover:underline flex items-center gap-1">Sessions <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.insensitive_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.insensitive_count === 0 ? "text-green-600" : "text-red-600")}>{m.insensitive_count}</p><p className="text-[10px] text-muted-foreground">Insensitive</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_sensitivity_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_sensitivity_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_sensitivity_count}</p><p className="text-[10px] text-muted-foreground">Poor Sens.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.not_supported_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.not_supported_count === 0 ? "text-green-600" : "text-amber-600")}>{m.not_supported_count}</p><p className="text-[10px] text-muted-foreground">Not Supp.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_sessions}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Sessions</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = SENSITIVITY_BADGES[r.sensitivity] ?? SENSITIVITY_BADGES["Adequate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><HandHeart className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.type} · {r.support}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Faith Observance Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Faith Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
