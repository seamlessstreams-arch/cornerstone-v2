"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — EMERGENCY PLACEMENT INTELLIGENCE CARD
// Dashboard card for emergency admission tracking and response.
// CHR 2015 Reg 22/27/14/36. SCCIF: Leadership & Management.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Siren, ChevronRight, AlertTriangle, Brain,
  Clock, ShieldCheck, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_referrals: 7,
  admitted_count: 4,
  declined_count: 2,
  pending_count: 1,
  admission_rate: 57.1,
  out_of_hours_count: 3,
  risk_not_completed: 1,
  post_review_overdue: 1,
  active_emergencies: 2,
  essential_info_rate: 75.0,
};

const DEMO_PLACEMENTS: { child: string; reason: string; decision: string; status: string }[] = [
  { child: "Child F", reason: "Placement Breakdown", decision: "Admitted", status: "Active" },
  { child: "Child G", reason: "Safeguarding Removal", decision: "Admitted", status: "Active" },
  { child: "Child H", reason: "Police Protection", decision: "Admitted", status: "Resolved" },
  { child: "Child I", reason: "Parental Crisis", decision: "Admitted", status: "Converted" },
  { child: "Child J", reason: "Court Order", decision: "Declined — Risk", status: "Resolved" },
  { child: "Child K", reason: "Hospital Discharge", decision: "Pending", status: "Active" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "risk_not_completed", severity: "critical", message: "Risk assessment not completed for Child G's emergency admission — complete immediately." },
  { type: "review_overdue", severity: "high", message: "Post-admission review overdue for Child F — complete 72-hour review." },
  { type: "decision_pending", severity: "medium", message: "Emergency placement decision pending for Child K (referred by NHS Trust) — decide and respond." },
];

const ARIA_INSIGHTS = [
  "7 emergency referrals: 4 admitted, 2 declined, 1 pending. Admission rate: 57.1%. Out-of-hours: 3. Risk not completed: 1. Post-review overdue: 1. Active emergencies: 2.",
  "Priority: Child G's risk assessment is critical — placement cannot be safely maintained without completed assessment. Child F's 72-hour review is overdue — complete today. Pending decision for Child K needs immediate attention.",
  "Positive: 75% of essential information received promptly. Declining placements on risk grounds shows robust matching. Placement breakdown admissions handled well. Ensure all out-of-hours admissions have emergency staffing confirmed.",
];

const DECISION_BADGES: Record<string, { label: string; color: string }> = {
  Admitted: { label: "Admitted", color: "text-green-700 bg-green-50 border-green-200" },
  "Declined — Risk": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
  "Declined — Capacity": { label: "Declined", color: "text-orange-700 bg-orange-50 border-orange-200" },
  "Declined — Matching": { label: "Declined", color: "text-amber-700 bg-amber-50 border-amber-200" },
  Pending: { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Referred Elsewhere": { label: "Referred", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function EmergencyPlacementCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Siren className="h-4 w-4 text-brand" />
            Emergency Placements
          </CardTitle>
          <Link href="/emergency-placements" className="text-xs text-brand hover:underline flex items-center gap-1">
            Emergencies <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.active_emergencies === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.active_emergencies === 0 ? "text-green-600" : "text-red-600")}>{m.active_emergencies}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.admitted_count}</p>
            <p className="text-[10px] text-muted-foreground">Admitted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.pending_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.pending_count === 0 ? "text-green-600" : "text-amber-600")}>{m.pending_count}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.risk_not_completed === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.risk_not_completed === 0 ? "text-green-600" : "text-red-600")}>{m.risk_not_completed}</p>
            <p className="text-[10px] text-muted-foreground">No Risk Ax</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Emergency Referrals</p>
          <div className="space-y-1">
            {DEMO_PLACEMENTS.map((ep, i) => {
              const badge = DECISION_BADGES[ep.decision] ?? DECISION_BADGES.Pending;
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ShieldCheck className="h-3 w-3 text-red-500 shrink-0" />
                    <span className="font-medium">{ep.child}</span>
                    <span className="text-muted-foreground truncate">{ep.reason} · {ep.status}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Emergency Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Emergency Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
