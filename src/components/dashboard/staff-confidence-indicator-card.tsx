"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, ChevronRight, AlertTriangle, Brain, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_indicators: 10, low_confidence_count: 3, declining_count: 2, no_confidence_count: 1, improving_count: 3, self_assessed_rate: 60.0, strengths_discussed_rate: 50.0, mentoring_offered_rate: 30.0, wellbeing_considered_rate: 40.0, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; area: string; confidence: string; trend: string }[] = [
  { staff: "Staff A", area: "De-Escalation", confidence: "Confident", trend: "Improving" },
  { staff: "Staff B", area: "Safeguarding", confidence: "Low Confidence", trend: "Declining" },
  { staff: "Staff C", area: "Medication", confidence: "No Confidence", trend: "Declining" },
  { staff: "Staff D", area: "Recording", confidence: "Developing", trend: "Improving" },
  { staff: "Staff E", area: "Communication", confidence: "Very Confident", trend: "Stable" },
  { staff: "Staff F", area: "Lone Working", confidence: "Low Confidence", trend: "Fluctuating" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_confidence_declining", severity: "critical", message: "Staff C has no confidence and declining trend in medication — immediate support needed." },
  { type: "low_confidence_no_support", severity: "high", message: "2 indicators have low/no confidence without a linked development plan." },
  { type: "no_strengths_discussed", severity: "high", message: "5 indicators have no strengths discussed." },
];

const ARIA_INSIGHTS = [
  "10 indicators across 6 staff. Low/no confidence: 3. Declining: 2. Improving: 3.",
  "Priority: 1 no-confidence declining. Mentoring offered only 30.0%. Wellbeing considered 40.0%.",
  "Confidence grows with support, not pressure. Name what's working. Build from strengths.",
];

const CONFIDENCE_BADGES: Record<string, { label: string; color: string }> = {
  "Very Confident": { label: "V.Conf", color: "text-green-700 bg-green-50 border-green-200" },
  "Confident": { label: "Conf.", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Developing": { label: "Dev.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Low Confidence": { label: "Low", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "No Confidence": { label: "None", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffConfidenceIndicatorCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Gauge className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Confidence Indicators</span></CardTitle>
          <Link href="/staff-confidence-indicator" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Indicators <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.low_confidence_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.low_confidence_count === 0 ? "text-green-600" : "text-red-600")}>{m.low_confidence_count}</p><p className="text-[10px] text-muted-foreground">Low/None</p></div>
          <div className={cn("text-center rounded-lg p-2", m.declining_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.declining_count === 0 ? "text-green-600" : "text-amber-600")}>{m.declining_count}</p><p className="text-[10px] text-muted-foreground">Declining</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.improving_count}</p><p className="text-[10px] text-muted-foreground">Improving</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_indicators}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Confidence Indicators</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = CONFIDENCE_BADGES[r.confidence] ?? CONFIDENCE_BADGES["Developing"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><TrendingUp className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.area} · {r.trend}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Confidence Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Confidence Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
