"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DATA PROTECTION INTELLIGENCE CARD
// Dashboard card for GDPR compliance, DSARs, breaches, and data audits.
// CHR 2015 Reg 37, UK GDPR, DPA 2018.
// SCCIF: Leadership — "Data is handled lawfully and securely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock, ChevronRight, AlertTriangle, Brain,
  Clock, Shield, FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_events: 14,
  dsar_received_count: 3,
  dsar_completed_count: 2,
  data_breach_count: 1,
  privacy_impact_count: 2,
  compliant_rate: 71.4,
  non_compliant_count: 1,
  within_deadline_rate: 64.3,
  overdue_count: 2,
  significantly_overdue_count: 1,
  ico_notified_count: 1,
  dpo_consulted_rate: 57.1,
  deadline_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; compliance: string; date: string; timeliness: string; severity: string }[] = [
  { type: "DSAR Received", compliance: "Compliant", date: "12 May", timeliness: "On Time", severity: "N/A" },
  { type: "Data Breach", compliance: "Non-Compliant", date: "8 May", timeliness: "Overdue", severity: "High" },
  { type: "PIA", compliance: "Compliant", date: "5 May", timeliness: "On Time", severity: "N/A" },
  { type: "Retention Review", compliance: "Under Review", date: "1 May", timeliness: "N/A", severity: "N/A" },
  { type: "DSAR Completed", compliance: "Compliant", date: "28 Apr", timeliness: "On Time", severity: "N/A" },
  { type: "Consent Review", compliance: "Compliant", date: "20 Apr", timeliness: "On Time", severity: "N/A" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "high_severity_breach", severity: "critical", message: "High severity data breach on 8 May — notify ICO within 72 hours and implement remedial actions." },
  { type: "non_compliant", severity: "high", message: "1 data protection event is non-compliant — rectify immediately." },
  { type: "significantly_overdue", severity: "high", message: "1 response is significantly overdue — escalate to DPO." },
  { type: "dpo_not_consulted", severity: "medium", message: "6 events without DPO consultation — ensure data protection officer is involved." },
];

const ARIA_INSIGHTS = [
  "14 events. Compliant: 71.4%. Within deadline: 64.3%. DSARs: 3 received, 2 completed. 1 data breach. DPO consulted: 57.1%.",
  "Priority: 1 high severity breach. 1 non-compliant event. 1 significantly overdue. 1 deadline overdue. DPO consultation low at 57.1%.",
  "Positive: Most DSARs on time. PIAs conducted. Consent reviews happening. Improve DPO consultation and deadline compliance.",
];

const COMPLIANCE_BADGES: Record<string, { label: string; color: string }> = {
  "Compliant": { label: "OK", color: "text-green-700 bg-green-50 border-green-200" },
  "Under Review": { label: "Review", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Non-Compliant": { label: "Fail", color: "text-red-700 bg-red-50 border-red-200" },
};

export function DataProtectionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand" />
            Data Protection
          </CardTitle>
          <Link href="/data-protection" className="text-xs text-brand hover:underline flex items-center gap-1">
            GDPR <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.compliant_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.compliant_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Compliant</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.within_deadline_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.within_deadline_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.within_deadline_rate}%</p>
            <p className="text-[10px] text-muted-foreground">On Time</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.data_breach_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.data_breach_count === 0 ? "text-green-600" : "text-red-600")}>{m.data_breach_count}</p>
            <p className="text-[10px] text-muted-foreground">Breaches</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Events</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = COMPLIANCE_BADGES[r.compliance] ?? COMPLIANCE_BADGES["Under Review"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Shield className="h-3 w-3 text-indigo-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.date} · {r.timeliness}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Data Protection Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Data Protection Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
