"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ChevronRight, AlertTriangle, Brain, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_checks: 10, poor_dignity_count: 1, unacceptable_count: 1, intrusion_count: 3, no_response_count: 1, knock_rate: 70.0, confidentiality_rate: 80.0, staff_awareness_rate: 60.0, intimate_care_rate: 90.0, unique_children: 7 };

const DEMO_RECORDS: { child: string; area: string; dignity: string; intrusion: string }[] = [
  { child: "Child A", area: "Bedroom", dignity: "Good", intrusion: "None" },
  { child: "Child B", area: "Bathroom", dignity: "Exemplary", intrusion: "None" },
  { child: "Child C", area: "Belongings", dignity: "Unacceptable", intrusion: "Searched" },
  { child: "Child D", area: "Phone Calls", dignity: "Good", intrusion: "None" },
  { child: "Child E", area: "Correspondence", dignity: "Adequate", intrusion: "Mail Opened" },
  { child: "Child F", area: "Health Info", dignity: "Poor", intrusion: "Info Shared" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "unacceptable_with_intrusion", severity: "critical", message: "Child C's dignity rated unacceptable with belongings searched." },
  { type: "confidentiality_breach", severity: "high", message: "2 checks show confidentiality not maintained." },
  { type: "staff_awareness_lacking", severity: "medium", message: "4 checks with inadequate staff awareness." },
];

const ARIA_INSIGHTS = [
  "10 checks. Poor dignity: 1. Unacceptable: 1. Intrusions: 3. No response: 1. Knock: 70%. Confidentiality: 80%.",
  "Priority: 1 unacceptable intrusion. 2 confidentiality breaches. 4 awareness gaps. Reinforce Reg 21 standards.",
  "Positive: Intimate care policy mostly followed. CCTV compliant. Dignity in language upheld in most interactions.",
];

const DIGNITY_BADGES: Record<string, { label: string; color: string }> = {
  "Exemplary": { label: "Exempl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Adequate": { label: "Adeq.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Unacceptable": { label: "Unacpt.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function PrivacyDignityMonitoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Lock className="h-4 w-4 text-brand" />Privacy & Dignity</CardTitle>
          <Link href="/privacy-dignity-monitoring" className="text-xs text-brand hover:underline flex items-center gap-1">Monitoring <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.unacceptable_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.unacceptable_count === 0 ? "text-green-600" : "text-red-600")}>{m.unacceptable_count}</p><p className="text-[10px] text-muted-foreground">Unacept.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.intrusion_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.intrusion_count === 0 ? "text-green-600" : "text-red-600")}>{m.intrusion_count}</p><p className="text-[10px] text-muted-foreground">Intrusions</p></div>
          <div className={cn("text-center rounded-lg p-2", m.no_response_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.no_response_count === 0 ? "text-green-600" : "text-amber-600")}>{m.no_response_count}</p><p className="text-[10px] text-muted-foreground">No Resp.</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.total_checks}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = DIGNITY_BADGES[r.dignity] ?? DIGNITY_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Eye className="h-3 w-3 text-indigo-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.area} · {r.intrusion}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Privacy Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Privacy Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
