"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, ChevronRight, AlertTriangle, Brain, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_audits: 18, excellent_count: 5, good_count: 8, poor_count: 3, inadequate_count: 1, medication_info_rate: 83.3, safeguarding_updates_rate: 88.9, read_and_signed_rate: 72.2 };

const DEMO_RECORDS: { type: string; outgoing: string; quality: string; status: string }[] = [
  { type: "Day→Night", outgoing: "Staff A", quality: "Good", status: "Good" },
  { type: "Night→Day", outgoing: "Staff B", quality: "Excellent", status: "Excellent" },
  { type: "Day→Night", outgoing: "Staff C", quality: "Poor", status: "Poor" },
  { type: "Weekend", outgoing: "Staff D", quality: "Good", status: "Good" },
  { type: "Day→Night", outgoing: "Staff E", quality: "Inadequate", status: "Inadeq." },
  { type: "Day→Day", outgoing: "Staff A", quality: "Good", status: "Good" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding", severity: "critical", message: "Inadequate handover — safeguarding updates not shared." },
  { type: "medication", severity: "high", message: "3 handovers have medication info not shared." },
  { type: "risk", severity: "high", message: "2 handovers have risk information not shared." },
];

const ARIA_INSIGHTS = [
  "18 audits. Excellent: 5. Good: 8. Poor: 3. Inadequate: 1. Medication: 83.3%. Signed: 72.2%.",
  "Priority: 1 safeguarding gap. 3 medication gaps. 2 risk gaps. Improve handover completeness.",
  "Positive: Most handovers good+. Regular auditing. Written records maintained. Face-to-face standard.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-green-700 bg-green-50 border-green-200" },
  "Poor": { label: "Poor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Inadeq.": { label: "Inadeq.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function ShiftHandoverQualityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ArrowRightLeft className="h-4 w-4 text-brand" />Handover Quality</CardTitle>
          <Link href="/shift-handover-quality" className="text-xs text-brand hover:underline flex items-center gap-1">Handovers <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.medication_info_rate >= 100 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.medication_info_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.medication_info_rate}%</p><p className="text-[10px] text-muted-foreground">Meds</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.excellent_count + m.good_count}</p><p className="text-[10px] text-muted-foreground">Good+</p></div>
          <div className={cn("text-center rounded-lg p-2", m.poor_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.poor_count === 0 ? "text-green-600" : "text-amber-600")}>{m.poor_count}</p><p className="text-[10px] text-muted-foreground">Poor</p></div>
          <div className={cn("text-center rounded-lg p-2", m.inadequate_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.inadequate_count === 0 ? "text-green-600" : "text-red-600")}>{m.inadequate_count}</p><p className="text-[10px] text-muted-foreground">Inadeq.</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Audits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Good"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileText className="h-3 w-3 text-sky-500 shrink-0" /><span className="font-medium">{r.type}</span><span className="text-muted-foreground truncate">{r.outgoing} · {r.quality}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Handover Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Handover Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
