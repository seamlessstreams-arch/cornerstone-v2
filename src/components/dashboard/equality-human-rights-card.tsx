"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EQUALITY & HUMAN RIGHTS INTELLIGENCE CARD
// Dashboard card for equality assessments, discrimination tracking, and compliance.
// CHR 2015 Reg 11, Reg 4; Equality Act 2010; Human Rights Act 1998.
// SCCIF: Experiences & Progress — "Children are treated with dignity."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Equal, ChevronRight, AlertTriangle, Brain,
  Clock, ShieldCheck, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 14,
  eia_count: 5,
  discrimination_incident_count: 1,
  reasonable_adjustment_count: 3,
  fully_compliant_rate: 78.6,
  non_compliant_count: 1,
  actions_overdue_count: 2,
  impact_on_child_count: 3,
};

const DEMO_RECORDS: { type: string; characteristic: string; date: string; compliance: string }[] = [
  { type: "EIA", characteristic: "Disability", date: "11 May", compliance: "Compliant" },
  { type: "Discrimination", characteristic: "Race", date: "8 May", compliance: "Non-Comp" },
  { type: "Adjustment", characteristic: "Disability", date: "5 May", compliance: "Compliant" },
  { type: "HR Audit", characteristic: "Multiple", date: "1 May", compliance: "Mostly" },
  { type: "Policy Review", characteristic: "None", date: "28 Apr", compliance: "Compliant" },
  { type: "Child Consult.", characteristic: "Religion", date: "22 Apr", compliance: "Compliant" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "discrimination_incident", severity: "critical", message: "Discrimination incident involving race on 2025-05-08 — investigate and take action." },
  { type: "non_compliant", severity: "high", message: "Non-compliant discrimination incident finding on 2025-05-08 — remedial action required." },
  { type: "actions_overdue", severity: "high", message: "2 equality actions are overdue — complete promptly." },
];

const ARIA_INSIGHTS = [
  "14 equality records. EIAs: 5. Discrimination: 1. Adjustments: 3. Compliance: 78.6%. 1 non-compliant. 2 actions overdue. 3 records with child impact.",
  "Priority: 1 discrimination incident (race) non-compliant — urgent investigation required. 2 overdue actions. 3 records with impact on children needing reasonable adjustments.",
  "Positive: 78.6% compliance. Regular EIAs conducted. 3 reasonable adjustments made. Improve discrimination response and overdue action completion.",
];

const COMP_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "Compliant", color: "text-green-700 bg-green-50 border-green-200" },
  "Mostly": { label: "Mostly", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Partial": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Non-Comp": { label: "Non-Comp", color: "text-red-700 bg-red-50 border-red-200" },
};

export function EqualityHumanRightsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Equal className="h-4 w-4 text-brand" />
            Equality & Human Rights
          </CardTitle>
          <Link href="/equality-human-rights" className="text-xs text-brand hover:underline flex items-center gap-1">
            Equality <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_records}</p>
            <p className="text-[10px] text-muted-foreground">Records</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.fully_compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.discrimination_incident_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.discrimination_incident_count > 0 ? "text-red-600" : "text-green-600")}>{m.discrimination_incident_count}</p>
            <p className="text-[10px] text-muted-foreground">Discrim.</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.actions_overdue_count > 0 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.actions_overdue_count > 0 ? "text-amber-600" : "text-green-600")}>{m.actions_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = COMP_BADGES[r.compliance] ?? COMP_BADGES["Compliant"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.characteristic} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Equality Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Equality Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
