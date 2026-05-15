"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ChevronRight, AlertTriangle, Brain, Clock, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 9, needs_improvement_count: 2, immediate_followup_count: 1, disputed_count: 1, finalised_count: 4, strengths_acknowledged_rate: 66.7, staff_views_rate: 55.6, wellbeing_discussed_rate: 44.4, safeguarding_discussed_rate: 33.3, unique_staff: 6 };

const DEMO_RECORDS: { staff: string; type: string; outcome: string; urgency: string }[] = [
  { staff: "Staff A", type: "Supervision", outcome: "Good", urgency: "Next Review" },
  { staff: "Staff B", type: "Probation", outcome: "Needs Improv.", urgency: "Immediate" },
  { staff: "Staff C", type: "Annual Appraisal", outcome: "Excellent", urgency: "None" },
  { staff: "Staff D", type: "Return to Work", outcome: "Satisfactory", urgency: "Within Week" },
  { staff: "Staff E", type: "Performance", outcome: "Unsatisfactory", urgency: "Within Week" },
  { staff: "Staff F", type: "Informal Check-in", outcome: "Good", urgency: "Next Review" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "immediate_unsatisfactory", severity: "critical", message: "Staff B has an unsatisfactory review requiring immediate follow-up — manager action needed." },
  { type: "staff_views_not_recorded", severity: "high", message: "4 reviews have staff views not recorded." },
  { type: "no_strengths_acknowledged", severity: "high", message: "3 reviews have no strengths acknowledged." },
];

const ARIA_INSIGHTS = [
  "9 reviews across 6 staff. Needs improvement: 2. Immediate follow-up: 1. Disputed: 1. Finalised: 4.",
  "Priority: 1 immediate follow-up needed. Staff views recorded 55.6%. Wellbeing discussed only 44.4%.",
  "Reviews build trust when fair. Were strengths named first? Was the voice of the staff member heard?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excl.", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Satisfactory": { label: "Sat.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Needs Improv.": { label: "N/Imp", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Unsatisfactory": { label: "Unsat.", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffReviewOutcomeCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-purple-200">
      <CardHeader className="pb-3 bg-purple-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-purple-600" /><span className="text-purple-900">Review Outcomes</span></CardTitle>
          <Link href="/staff-review-outcome" className="text-xs text-purple-600 hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.needs_improvement_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.needs_improvement_count === 0 ? "text-green-600" : "text-red-600")}>{m.needs_improvement_count}</p><p className="text-[10px] text-muted-foreground">Needs Imp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.disputed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.disputed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.disputed_count}</p><p className="text-[10px] text-muted-foreground">Disputed</p></div>
          <div className="text-center rounded-lg p-2 bg-green-50"><p className="text-lg font-bold tabular-nums text-green-600">{m.finalised_count}</p><p className="text-[10px] text-muted-foreground">Finalised</p></div>
          <div className="text-center rounded-lg p-2 bg-purple-50"><p className="text-lg font-bold tabular-nums text-purple-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Satisfactory"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileSearch className="h-3 w-3 text-purple-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.type} · {r.urgency}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Review Outcome Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Review Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-purple-200 bg-purple-50 text-purple-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
