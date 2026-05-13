"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — BUILDING SECURITY INTELLIGENCE CARD
// Dashboard card for physical security, access control, and alarm monitoring.
// CHR 2015 Reg 36, Reg 25, Reg 12.
// SCCIF: Helped & Protected — "The home is secure."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ChevronRight, AlertTriangle, Brain,
  Clock, Lock, Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 24,
  routine_check_count: 12,
  security_incident_count: 1,
  secure_rate: 87.5,
  breach_count: 0,
  major_issue_count: 1,
  alarm_operational_rate: 91.7,
  alarm_fault_count: 1,
  keys_accounted_rate: 83.3,
  key_missing_count: 1,
  doors_secure_rate: 95.8,
  windows_secure_rate: 91.7,
  lighting_working_rate: 87.5,
  perimeter_secure_rate: 91.7,
  children_accounted_rate: 100.0,
  check_overdue_count: 2,
};

const DEMO_RECORDS: { type: string; status: string; date: string; checkedBy: string }[] = [
  { type: "Routine Check", status: "Secure", date: "12 May", checkedBy: "D. Laville" },
  { type: "Alarm Test", status: "Secure", date: "11 May", checkedBy: "K. Patel" },
  { type: "Key Audit", status: "Minor Issue", date: "9 May", checkedBy: "D. Laville" },
  { type: "Perimeter Insp.", status: "Secure", date: "7 May", checkedBy: "M. Taylor" },
  { type: "Lock Check", status: "Secure", date: "5 May", checkedBy: "K. Patel" },
  { type: "Lighting Check", status: "Minor Issue", date: "3 May", checkedBy: "D. Laville" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "key_missing", severity: "high", message: "1 missing key identified — replace locks if necessary." },
  { type: "alarm_fault", severity: "high", message: "1 alarm fault detected — arrange repair." },
  { type: "check_overdue", severity: "medium", message: "2 security checks are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "24 security records. Secure: 87.5%. Alarms operational: 91.7%. Keys accounted: 83.3%. Doors: 95.8%. Windows: 91.7%. Children accounted: 100%.",
  "Priority: 1 missing key. 1 alarm fault. 2 overdue checks. External lighting at 87.5%. Key management needs attention at 83.3%.",
  "Positive: All children accounted for in every check. High door/window security rates. No breaches. Perimeter secure 91.7%. Improve key management procedures.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "Secure": { label: "Secure", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor Issue": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Major Issue": { label: "Major", color: "text-red-700 bg-red-50 border-red-200" },
  "Breach": { label: "Breach", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Checked": { label: "Not Chk.", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function BuildingSecurityCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Building Security
          </CardTitle>
          <Link href="/building-security" className="text-xs text-brand hover:underline flex items-center gap-1">
            Security <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.secure_rate >= 85 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.secure_rate >= 85 ? "text-green-600" : "text-amber-600")}>{m.secure_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Secure</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.alarm_operational_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.alarm_operational_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.alarm_operational_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Alarm Op.</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.keys_accounted_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.keys_accounted_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.keys_accounted_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Keys OK</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.check_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.check_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.check_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Security Checks</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Secure"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Lock className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.checkedBy} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Security Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Security Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
