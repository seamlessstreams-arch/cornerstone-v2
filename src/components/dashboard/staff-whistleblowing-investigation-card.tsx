"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ChevronRight, AlertTriangle, Brain, Clock, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_investigations: 6, substantiated_count: 2, ongoing_count: 1, escalated_count: 1, policy_change_count: 1, whistleblower_supported_rate: 66.7, no_detriment_rate: 50.0, regulatory_notified_rate: 66.7, learning_identified_rate: 83.3, learning_shared_rate: 50.0, unique_staff: 4 };

const DEMO_RECORDS: { staff: string; category: string; outcome: string; status: string }[] = [
  { staff: "Staff A", category: "Safeguarding", outcome: "Substantiated", status: "Concluded" },
  { staff: "Staff B", category: "Medication", outcome: "Ongoing", status: "Investigating" },
  { staff: "Staff C", category: "Unsafe Practice", outcome: "Unsubstantiated", status: "Closed" },
  { staff: "Staff A", category: "Data Breach", outcome: "Substantiated", status: "Escalated" },
  { staff: "Staff D", category: "Financial", outcome: "Inconclusive", status: "Concluded" },
  { staff: "Staff B", category: "Bullying", outcome: "Partially", status: "Concluded" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "substantiated_not_notified", severity: "critical", message: "1 substantiated investigation has not notified regulatory body — urgent compliance action needed." },
  { type: "whistleblower_not_supported", severity: "high", message: "2 whistleblowers have not been confirmed as supported or protected from detriment." },
  { type: "learning_not_shared", severity: "medium", message: "3 investigations have learning identified but not shared with team." },
];

const ARIA_INSIGHTS = [
  "6 investigations across 4 staff. Substantiated: 2. Ongoing: 1. Escalated: 1.",
  "Priority: 1 substantiated not notified. Whistleblower supported 66.7%. Learning shared 50.0%.",
  "Whistleblowing protects children and staff. Are whistleblowers supported? Is learning embedded in practice?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Substantiated": { label: "Subst.", color: "text-red-700 bg-red-50 border-red-200" },
  "Partially": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Ongoing": { label: "Ongoing", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Unsubstantiated": { label: "Unsubst.", color: "text-green-700 bg-green-50 border-green-200" },
  "Inconclusive": { label: "Inconc.", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function StaffWhistleblowingInvestigationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4 text-purple-600" /><span className="text-purple-900">WB Investigations</span></CardTitle>
          <Link href="/staff-whistleblowing-investigation" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Investigations <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.substantiated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.substantiated_count === 0 ? "text-green-600" : "text-red-600")}>{m.substantiated_count}</p><p className="text-[10px] text-muted-foreground">Subst.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.ongoing_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.ongoing_count === 0 ? "text-green-600" : "text-amber-600")}>{m.ongoing_count}</p><p className="text-[10px] text-muted-foreground">Ongoing</p></div>
          <div className={cn("text-center rounded-lg p-2", m.escalated_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.escalated_count === 0 ? "text-green-600" : "text-red-600")}>{m.escalated_count}</p><p className="text-[10px] text-muted-foreground">Escalated</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_investigations}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Investigations</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Ongoing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><Scale className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.category} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Investigation Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Investigation Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
