"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION ERRORS INTELLIGENCE CARD
// Dashboard card for medication error tracking and investigation.
// CHR 2015 Reg 23, Reg 40. Duty of Candour.
// SCCIF: Helped & Protected — "Medication is managed safely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pill, ChevronRight, AlertTriangle, Brain,
  ShieldAlert, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_errors: 5,
  near_miss_count: 2,
  actual_error_count: 3,
  no_harm_count: 3,
  harm_caused_count: 2,
  child_harmed_count: 1,
  open_investigations: 2,
  actions_outstanding: 1,
  parent_informed_rate: 80.0,
  duty_of_candour_rate: 60.0,
};

const DEMO_ERRORS: { child: string; medication: string; type: string; severity: string; status: string }[] = [
  { child: "Child A", medication: "Melatonin", type: "Wrong Dose", severity: "Low Harm", status: "Actions Identified" },
  { child: "Child C", medication: "Methylphenidate", type: "Omission", severity: "No Harm", status: "Closed" },
  { child: "Child B", medication: "Fluoxetine", type: "Wrong Time", severity: "No Harm", status: "Under Investigation" },
  { child: "Child D", medication: "Risperidone", type: "Double Dose", severity: "Moderate Harm", status: "Reported" },
  { child: "Child A", medication: "Melatonin", type: "Near Miss", severity: "No Harm", status: "Closed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "severe_error", severity: "critical", message: "Parent not informed of medication error causing harm to Child D — duty of candour requires immediate disclosure." },
  { type: "actions_outstanding", severity: "high", message: "Corrective actions outstanding for Child A (Melatonin) wrong dose — complete actions to prevent recurrence." },
  { type: "not_investigated", severity: "medium", message: "Medication error for Child D (Risperidone) reported but not yet investigated — begin investigation." },
];

const ARIA_INSIGHTS = [
  "5 medication errors: 2 near misses, 3 actual errors. 2 caused harm, 1 child harmed. 2 open investigations. 1 outstanding corrective action. Parent informed rate: 80%. Duty of candour: 60%.",
  "Priority: Child D's double dose of Risperidone caused moderate harm — parent not yet informed, breaching duty of candour. Corrective actions for Child A still incomplete. Investigate reported errors within 24 hours.",
  "Positive: 2 near misses caught before reaching children — demonstrates vigilance. Melatonin errors suggest dose-time review needed. Consider medication competency refresher for all staff and double-check protocol for controlled medications.",
];

const SEVERITY_BADGES: Record<string, { label: string; color: string }> = {
  "No Harm": { label: "No Harm", color: "text-green-700 bg-green-50 border-green-200" },
  "Low Harm": { label: "Low", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Moderate Harm": { label: "Moderate", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Severe Harm": { label: "Severe", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MedicationErrorsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand" />
            Medication Errors
          </CardTitle>
          <Link href="/medication-errors" className="text-xs text-brand hover:underline flex items-center gap-1">
            Errors <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.total_errors === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.total_errors === 0 ? "text-green-600" : "text-amber-600")}>{m.total_errors}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.harm_caused_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.harm_caused_count === 0 ? "text-green-600" : "text-red-600")}>{m.harm_caused_count}</p>
            <p className="text-[10px] text-muted-foreground">Harm</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.open_investigations === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.open_investigations === 0 ? "text-green-600" : "text-amber-600")}>{m.open_investigations}</p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.actions_outstanding === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.actions_outstanding === 0 ? "text-green-600" : "text-red-600")}>{m.actions_outstanding}</p>
            <p className="text-[10px] text-muted-foreground">Actions</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><ShieldAlert className="h-3 w-3" />Recent Errors</p>
          <div className="space-y-1">
            {DEMO_ERRORS.map((e, i) => {
              const badge = SEVERITY_BADGES[e.severity] ?? SEVERITY_BADGES["No Harm"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{e.child}</span>
                    <span className="text-muted-foreground truncate">{e.type} · {e.medication}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Error Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Medication Safety Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
