"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF GRIEVANCE INTELLIGENCE CARD
// Dashboard card for grievance tracking, investigation progress, and outcomes.
// CHR 2015 Reg 33, Reg 13; ACAS Code of Practice.
// SCCIF: Leadership & Management — "Staff grievances handled fairly."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale, ChevronRight, AlertTriangle, Brain,
  Clock, FileText, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_grievances: 7,
  open_grievances: 3,
  resolved_grievances: 3,
  upheld_count: 2,
  appeal_count: 1,
  acknowledged_rate: 71.4,
  acas_code_followed_rate: 85.7,
  average_days_to_resolution: 18.3,
};

const DEMO_RECORDS: { staff: string; category: string; date: string; stage: string }[] = [
  { staff: "J. Adams", category: "Working Conditions", date: "11 May", stage: "Investigating" },
  { staff: "K. Patel", category: "Bullying", date: "8 May", stage: "Hearing" },
  { staff: "M. Taylor", category: "Pay/Benefits", date: "3 May", stage: "Resolved" },
  { staff: "R. Chen", category: "Workload", date: "28 Apr", stage: "Resolved" },
  { staff: "S. Jones", category: "Management", date: "22 Apr", stage: "Outcome Issued" },
  { staff: "A. Williams", category: "Discrimination", date: "15 Apr", stage: "Appeal" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "serious_grievance", severity: "critical", message: "Active bullying harassment grievance from K. Patel — prioritise investigation." },
  { type: "serious_grievance", severity: "critical", message: "Active discrimination grievance from A. Williams — prioritise investigation." },
  { type: "late_acknowledgement", severity: "high", message: "2 grievances were not acknowledged within 5 working days." },
  { type: "no_impact_assessment", severity: "medium", message: "2 grievances without assessment of impact on children — ensure safeguarding considerations are addressed." },
];

const ARIA_INSIGHTS = [
  "7 grievances. Open: 3. Resolved: 3. Upheld: 2. Appeals: 1. ACAS compliance: 85.7%. Avg resolution: 18.3 days. Acknowledgement rate: 71.4%.",
  "Priority: Active bullying and discrimination grievances require immediate investigation. 2 late acknowledgements breach ACAS Code. Impact on children not assessed for 2 cases.",
  "Positive: 85.7% ACAS compliance. Average 18.3 day resolution. Learning identified from resolved cases. Improve acknowledgement timeliness and impact assessments.",
];

const STAGE_BADGES: Record<string, { label: string; color: string }> = {
  "Investigating": { label: "Investigating", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Hearing": { label: "Hearing", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Resolved": { label: "Resolved", color: "text-green-700 bg-green-50 border-green-200" },
  "Outcome Issued": { label: "Outcome", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Appeal": { label: "Appeal", color: "text-red-700 bg-red-50 border-red-200" },
  "Withdrawn": { label: "Withdrawn", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function StaffGrievanceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="h-4 w-4 text-brand" />
            Staff Grievances
          </CardTitle>
          <Link href="/staff-grievances" className="text-xs text-brand hover:underline flex items-center gap-1">
            Grievances <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_grievances}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.open_grievances > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.open_grievances > 0 ? "text-amber-600" : "text-green-600")}>{m.open_grievances}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.acas_code_followed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">ACAS Comp.</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 p-2">
            <p className="text-lg font-bold tabular-nums text-emerald-600">{m.average_days_to_resolution}d</p>
            <p className="text-[10px] text-muted-foreground">Avg Resolve</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Grievances</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STAGE_BADGES[r.stage] ?? STAGE_BADGES["Investigating"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.staff}</span>
                    <span className="text-muted-foreground truncate">{r.category} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Grievance Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Grievance Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
