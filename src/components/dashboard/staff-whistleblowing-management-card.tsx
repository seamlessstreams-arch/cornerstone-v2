"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ChevronRight, AlertTriangle, Brain, Clock, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_disclosures: 5, open_count: 2, under_investigation_count: 1, substantiated_count: 1, whistleblower_protected_rate: 80.0, anonymity_rate: 60.0, investigation_opened_rate: 60.0, feedback_rate: 40.0, unique_disclosers: 4, unique_handlers: 2 };

const DEMO_RECORDS: { discloser: string; type: string; status: string; handler: string }[] = [
  { discloser: "Staff A", type: "Safeguarding Concern", status: "Closed", handler: "D. Laville" },
  { discloser: "Staff B", type: "Health & Safety", status: "Under Investigation", handler: "J. Hughes" },
  { discloser: "Staff C", type: "Financial Misconduct", status: "Open", handler: "D. Laville" },
  { discloser: "Staff D", type: "Regulatory Breach", status: "Open", handler: "J. Hughes" },
  { discloser: "Staff A", type: "Cover-Up", status: "Closed", handler: "D. Laville" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "detriment_reported", severity: "critical", message: "Whistleblower detriment reported — investigate immediately under PIDA 1998." },
  { type: "no_investigation", severity: "high", message: "2 disclosures without investigation opened." },
  { type: "no_feedback", severity: "medium", message: "3 disclosures without feedback provided to whistleblower." },
];

const ARIA_INSIGHTS = [
  "5 disclosures across 4 staff. Open: 2. Under investigation: 1. Substantiated: 1.",
  "Priority: 1 detriment reported. Protection rate 80.0%. Investigation rate 60.0%.",
  "Whistleblowing culture reflects organisational health. Are staff confident to raise concerns? Is the policy genuinely accessible? Are outcomes shared appropriately?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Open": { label: "Open", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Under Investigation": { label: "Investigating", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Closed": { label: "Closed", color: "text-green-700 bg-green-50 border-green-200" },
  "Escalated": { label: "Escalated", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffWhistleblowingManagementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-violet-200">
      <CardHeader className="pb-3 bg-violet-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4 text-violet-600" /><span className="text-violet-900">Whistleblowing</span></CardTitle>
          <Link href="/staff-whistleblowing-management" className="text-xs text-violet-600 hover:underline flex items-center gap-1">Disclosures <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.open_count === 0 ? "bg-green-50" : "bg-blue-50")}><p className={cn("text-lg font-bold tabular-nums", m.open_count === 0 ? "text-green-600" : "text-blue-600")}>{m.open_count}</p><p className="text-[10px] text-muted-foreground">Open</p></div>
          <div className={cn("text-center rounded-lg p-2", m.under_investigation_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.under_investigation_count === 0 ? "text-green-600" : "text-amber-600")}>{m.under_investigation_count}</p><p className="text-[10px] text-muted-foreground">Investigating</p></div>
          <div className="text-center rounded-lg p-2 bg-blue-50"><p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_disclosers}</p><p className="text-[10px] text-muted-foreground">Staff</p></div>
          <div className="text-center rounded-lg p-2 bg-violet-50"><p className="text-lg font-bold tabular-nums text-violet-600">{m.total_disclosures}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Disclosures</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Open"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileWarning className="h-3 w-3 text-violet-500 shrink-0" /><span className="font-medium">{r.discloser}</span><span className="text-muted-foreground truncate">{r.type} · {r.handler}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Whistleblowing Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-violet-700"><Brain className="h-3 w-3" />ARIA Whistleblowing Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-violet-200 bg-violet-50 text-violet-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
