"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, ChevronRight, AlertTriangle, Brain, Clock, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = { total_reviews: 8, breach_count: 1, non_compliant_count: 0, investigation_count: 1, significant_concern_count: 1, code_acknowledged_rate: 87.5, training_completed_rate: 75.0, supervision_discussed_rate: 87.5, self_assessment_rate: 62.5, improvement_plan_rate: 50.0, improvement_demonstrated_rate: 37.5, unique_staff: 5 };

const DEMO_RECORDS: { staff: string; area: string; status: string; type: string }[] = [
  { staff: "Staff A", area: "Prof. Conduct", status: "Compliant", type: "Annual" },
  { staff: "Staff B", area: "Social Media", status: "Minor Conc.", type: "Spot Check" },
  { staff: "Staff C", area: "Confidentiality", status: "Breach", type: "Incident" },
  { staff: "Staff A", area: "Safeguarding", status: "Compliant", type: "Induction" },
  { staff: "Staff D", area: "Dress Code", status: "Sig. Concern", type: "Supervision" },
  { staff: "Staff E", area: "Relationships", status: "Compliant", type: "Annual" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "breach_no_investigation", severity: "critical", message: "Staff C has breach identified in confidentiality without investigation completed — urgent action required." },
  { type: "sig_concern_no_plan", severity: "high", message: "1 significant concern without improvement plan agreed." },
  { type: "supervision_gap", severity: "medium", message: "1 concern area not discussed in supervision." },
];

const ARIA_INSIGHTS = [
  "8 reviews across 5 staff. Breaches: 1. Significant concerns: 1. Non-compliant: 0.",
  "Priority: 1 breach without investigation. Code acknowledged 87.5%. Training 75.0%.",
  "A strong code of conduct protects children and staff. Are breaches investigated promptly? Is the code living practice or just paperwork?",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Conc.": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Sig. Concern": { label: "Sig.", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Breach": { label: "Breach", color: "text-red-700 bg-red-50 border-red-200" },
  "Non-Compliant": { label: "Non-Comp.", color: "text-red-900 bg-red-100 border-red-300" },
};

export function StaffCodeOfConductComplianceCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden border-emerald-200">
      <CardHeader className="pb-3 bg-emerald-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Scale className="h-4 w-4 text-emerald-600" /><span className="text-emerald-900">Code of Conduct</span></CardTitle>
          <Link href="/staff-code-of-conduct-compliance" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">Compliance <ChevronRight className="h-3 w-3" /></Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.breach_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.breach_count === 0 ? "text-green-600" : "text-red-600")}>{m.breach_count}</p><p className="text-[10px] text-muted-foreground">Breaches</p></div>
          <div className={cn("text-center rounded-lg p-2", m.non_compliant_count === 0 ? "bg-green-50" : "bg-red-50")}><p className={cn("text-lg font-bold tabular-nums", m.non_compliant_count === 0 ? "text-green-600" : "text-red-600")}>{m.non_compliant_count}</p><p className="text-[10px] text-muted-foreground">Non-Comp.</p></div>
          <div className={cn("text-center rounded-lg p-2", m.significant_concern_count === 0 ? "bg-green-50" : "bg-amber-50")}><p className={cn("text-lg font-bold tabular-nums", m.significant_concern_count === 0 ? "text-green-600" : "text-amber-600")}>{m.significant_concern_count}</p><p className="text-[10px] text-muted-foreground">Sig. Conc.</p></div>
          <div className="text-center rounded-lg p-2 bg-emerald-50"><p className="text-lg font-bold tabular-nums text-emerald-600">{m.total_reviews}</p><p className="text-[10px] text-muted-foreground">Total</p></div>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Reviews</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => { const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Compliant"]; return (<div key={i} className="flex items-center justify-between rounded border p-2 text-xs"><div className="flex items-center gap-2 flex-1 min-w-0"><FileCheck2 className="h-3 w-3 text-emerald-500 shrink-0" /><span className="font-medium">{r.staff}</span><span className="text-muted-foreground truncate">{r.area} · {r.type}</span></div><Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge></div>); })}
          </div>
        </div>
        {DEMO_ALERTS.length > 0 && (<div className="space-y-1.5"><p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Conduct Alerts</p>{DEMO_ALERTS.map((a, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>))}</div>)}
        <div className="space-y-1.5"><p className="text-xs font-semibold flex items-center gap-1 text-emerald-700"><Brain className="h-3 w-3" />ARIA Conduct Intelligence</p>{ARIA_INSIGHTS.map((insight, i) => (<div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-emerald-200 bg-emerald-50 text-emerald-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>))}</div>
      </CardContent>
    </Card>
  );
}
