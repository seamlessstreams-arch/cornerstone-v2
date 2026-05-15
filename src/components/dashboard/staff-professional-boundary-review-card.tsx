"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ChevronRight, AlertTriangle, Brain, Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 8, boundary_breached_count: 0, investigation_count: 0, crossed_count: 1, follow_up_count: 2, training_completed_rate: 75.0, supervision_discussed_rate: 87.5, policy_acknowledged_rate: 87.5, self_assessment_rate: 62.5, child_impact_rate: 75.0, management_aware_rate: 87.5, action_plan_rate: 50.0, action_completed_rate: 37.5, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; area: string; outcome: string; status: string }[] = [
  { staff: "Staff A", area: "Emotional", outcome: "Appropriate", status: "Completed" },
  { staff: "Staff B", area: "Social Media", outcome: "Minor Conc.", status: "Follow Up" },
  { staff: "Staff C", area: "Gift Giving", outcome: "Crossed", status: "In Progress" },
  { staff: "Staff A", area: "Confidentiality", outcome: "Appropriate", status: "Closed" },
  { staff: "Staff D", area: "Phys. Contact", outcome: "Minor Conc.", status: "Follow Up" },
  { staff: "Staff E", area: "Dual Relat.", outcome: "Appropriate", status: "Completed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "crossed_no_action", severity: "high", message: "1 boundary crossed with no action plan created — immediate review required." },
  { type: "supervision_gap", severity: "medium", message: "1 boundary concern not discussed in supervision." },
  { type: "child_impact_gap", severity: "medium", message: "2 boundary concerns without child impact assessment completed." },
];

const ARIA_INSIGHTS = [
  "8 reviews across 5 staff. Breached: 0. Crossed: 1. Follow-up required: 2.",
  "Priority: 1 crossed without action plan. Self-assessment 62.5%. Action completed 37.5%.",
  "Professional boundaries protect children. Is training refreshed regularly? Are concerns explored through supervision without blame?",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Appropriate": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Conc.": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Crossed": { label: "Crossed", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Breached": { label: "Breached", color: "text-red-700 bg-red-50 border-red-200" },
  "Investigation": { label: "Invest.", color: "text-red-900 bg-red-100 border-red-300" },
};

export function StaffProfessionalBoundaryReviewCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-slate-200">
      <CardHeader className="pb-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-600" /><span className="text-slate-900">Boundary Reviews</span></CardTitle>
          <Link href="/staff-professional-boundary-review" className="text-xs text-slate-600 hover:underline flex items-center gap-1">Reviews <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.boundary_breached_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.boundary_breached_count === 0 ? "text-green-600" : "text-red-600")}>{m.boundary_breached_count}</p><p className="text-[10px] text-muted-foreground">Breached</p></div>
          <div className={cn("text-center rounded-lg p-2", m.crossed_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.crossed_count === 0 ? "text-green-600" : "text-amber-600")}>{m.crossed_count}</p><p className="text-[10px] text-muted-foreground">Crossed</p></div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.follow_up_count === 0 ? "text-green-600" : "text-amber-600")}>{m.follow_up_count}</p><p className="text-[10px] text-muted-foreground">Follow Up</p></div>
          <div className="text-center rounded-lg p-2 bg-slate-50"><p className="text-lg font-bold tabular-nums text-slate-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Appropriate"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><UserCheck className="h-3 w-3 text-slate-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.area} · {r.status}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Boundary Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-slate-700"><Brain className="h-3 w-3" />ARIA Boundary Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-slate-200 bg-slate-50 text-slate-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
