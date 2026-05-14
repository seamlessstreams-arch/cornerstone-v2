"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ChevronRight, AlertTriangle, Brain, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_incidents: 22, accepted_count: 12, escalated_count: 2, refused_count: 3, inconsistent_count: 3, trauma_informed_rate: 81.8, child_voice_rate: 77.3, relationship_maintained_rate: 90.9, unique_children: 5 };

const DEMO_RECORDS: { child: string; boundary: string; response: string; approach: string }[] = [
  { child: "Child A", boundary: "Screen Time", response: "Accepted", approach: "Calm" },
  { child: "Child B", boundary: "Bedtime", response: "Tested", approach: "Redirect" },
  { child: "Child C", boundary: "House Rules", response: "Escalated", approach: "De-Esc" },
  { child: "Child D", boundary: "Language", response: "Accepted", approach: "Positive" },
  { child: "Child A", boundary: "Money", response: "Negotiated", approach: "Calm" },
  { child: "Child E", boundary: "Community", response: "Refused", approach: "Space" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "escalated_no_deescalation", severity: "critical", message: "Child C escalated during house rules boundary without de-escalation — review." },
  { type: "not_trauma_informed", severity: "high", message: "4 boundary interactions were not trauma-informed." },
  { type: "child_voice_not_heard", severity: "high", message: "5 boundary interactions have child voice not heard." },
];

const ARIA_INSIGHTS = [
  "22 incidents. 5 children. Accepted: 12. Escalated: 2. Trauma-informed: 81.8%. Voice: 77.3%.",
  "Priority: 1 escalated no de-esc. 4 not trauma-informed. 5 voice not heard. Strengthen practice.",
  "Positive: Good relationship maintenance. Consistent approaches. Restorative practice established.",
];

const RESPONSE_BADGES: Record<string, { label: string; color: string }> = {
  "Accepted": { label: "Accepted", color: "text-green-700 bg-green-50 border-green-200" },
  "Negotiated": { label: "Negotiated", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Tested": { label: "Tested", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Refused": { label: "Refused", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Escalated": { label: "Escalated", color: "text-red-700 bg-red-50 border-red-200" },
};

export function BoundaryManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" />Boundaries</CardTitle>
          <Link href="/boundary-management" className="text-xs text-brand hover:underline flex items-center gap-1">Boundaries <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.accepted_count}</p><p className="text-[10px] text-muted-foreground">Accepted</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className={cn("text-center rounded-lg p-2", m.trauma_informed_rate >= 95 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.trauma_informed_rate >= 95 ? "text-green-600" : "text-amber-600")}>{m.trauma_informed_rate}%</p><p className="text-[10px] text-muted-foreground">Trauma</p></div>
          <div className={cn("text-center rounded-lg p-2", m.inconsistent_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.inconsistent_count === 0 ? "text-green-600" : "text-amber-600")}>{m.inconsistent_count}</p><p className="text-[10px] text-muted-foreground">Inconsist</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Incidents</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = RESPONSE_BADGES[r.response] ?? RESPONSE_BADGES["Accepted"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Target className="h-3 w-3 text-blue-500 shrink-0" /><span className="font-medium">{r.child}</span><span className="text-muted-foreground truncate">{r.boundary} · {r.approach}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Boundary Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Boundary Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
