"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION AUDIT INTELLIGENCE CARD
// Dashboard card for controlled drug counts, storage audits, fridge checks.
// CHR 2015 Reg 23, Reg 12, Reg 40.
// SCCIF: Safety — "Medication is stored and managed safely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck, ChevronRight, AlertTriangle, Brain,
  Clock, Pill, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_audits: 15,
  satisfactory_rate: 73.3,
  failed_count: 1,
  major_issues_count: 1,
  all_drugs_accounted_rate: 86.7,
  cabinet_locked_rate: 93.3,
  expired_items_found_count: 2,
  total_discrepancies: 3,
};

const DEMO_RECORDS: { type: string; outcome: string; date: string; status: string }[] = [
  { type: "CD Count", outcome: "Satisfactory", date: "14 May", status: "OK" },
  { type: "Storage", outcome: "Minor Issues", date: "13 May", status: "Minor" },
  { type: "Fridge", outcome: "Satisfactory", date: "13 May", status: "OK" },
  { type: "Expiry", outcome: "Major Issues", date: "12 May", status: "Major" },
  { type: "MAR Audit", outcome: "Satisfactory", date: "11 May", status: "OK" },
  { type: "Stock", outcome: "Failed", date: "10 May", status: "Failed" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "controlled_drug", severity: "critical", message: "Critical controlled drug discrepancy — investigate immediately." },
  { type: "failed_audit", severity: "high", message: "1 medication audit has failed — take corrective action." },
  { type: "expired", severity: "high", message: "2 audits found expired medication — dispose safely." },
];

const ARIA_INSIGHTS = [
  "15 audits. Satisfactory: 73.3%. 1 failed. Drugs accounted: 86.7%. Cabinet locked: 93.3%. 2 expired items.",
  "Priority: 1 critical CD discrepancy. 1 failed audit. 2 expired medications. Address stock reconciliation.",
  "Positive: Cabinets mostly locked. Regular auditing. Fridge checks ongoing. Improve expiry management.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "OK": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Major": { label: "Major", color: "text-red-700 bg-red-50 border-red-200" },
  "Failed": { label: "Failed", color: "text-red-700 bg-red-50 border-red-200" },
};

export function MedicationAuditCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-brand" />
            Medication Audit
          </CardTitle>
          <Link href="/medication-audits" className="text-xs text-brand hover:underline flex items-center gap-1">
            Audits <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.satisfactory_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.satisfactory_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.satisfactory_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Satisfactory</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.cabinet_locked_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.cabinet_locked_rate >= 100 ? "text-green-600" : "text-amber-600")}>{m.cabinet_locked_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Locked</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.failed_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.failed_count === 0 ? "text-green-600" : "text-red-600")}>{m.failed_count}</p>
            <p className="text-[10px] text-muted-foreground">Failed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.expired_items_found_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.expired_items_found_count === 0 ? "text-green-600" : "text-red-600")}>{m.expired_items_found_count}</p>
            <p className="text-[10px] text-muted-foreground">Expired</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Audits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["OK"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Pill className="h-3 w-3 text-purple-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.outcome} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Medication Audit Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Medication Audit Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
