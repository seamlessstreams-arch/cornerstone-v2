"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAFF EXIT INTERVIEWS INTELLIGENCE CARD
// Dashboard card for staff departure tracking, satisfaction, and handover.
// CHR 2015 Reg 33, Reg 13.
// SCCIF: Leadership — "The home learns from staff departures."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserMinus, ChevronRight, AlertTriangle, Brain,
  Clock, Key, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_exits: 8,
  career_progression_count: 3,
  burnout_count: 2,
  management_issues_count: 1,
  dismissal_count: 1,
  very_satisfied_rate: 25.0,
  dissatisfied_count: 2,
  handover_completed_rate: 62.5,
  handover_not_started_count: 1,
  would_recommend_rate: 50.0,
  felt_supported_rate: 62.5,
  safeguarding_debrief_rate: 75.0,
  keys_returned_rate: 87.5,
  access_revoked_rate: 75.0,
  children_informed_rate: 62.5,
  average_service_months: 18.4,
};

const DEMO_RECORDS: { name: string; reason: string; date: string; satisfaction: string; handover: string }[] = [
  { name: "Staff A", reason: "Career", date: "10 May", satisfaction: "Satisfied", handover: "Complete" },
  { name: "Staff B", reason: "Burnout", date: "5 May", satisfaction: "Dissatisfied", handover: "Partial" },
  { name: "Staff C", reason: "Relocation", date: "28 Apr", satisfaction: "Neutral", handover: "Complete" },
  { name: "Staff D", reason: "Dismissal", date: "20 Apr", satisfaction: "V. Dissatisfied", handover: "N/A" },
  { name: "Staff E", reason: "Career", date: "15 Apr", satisfaction: "V. Satisfied", handover: "Complete" },
  { name: "Staff F", reason: "Pay", date: "8 Apr", satisfaction: "Neutral", handover: "Not Started" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_safeguarding_debrief", severity: "critical", message: "Safeguarding debrief not completed for Staff B leaving on 5 May — complete before departure." },
  { type: "access_not_revoked", severity: "high", message: "2 departing staff members have access not yet revoked — action immediately." },
  { type: "keys_not_returned", severity: "high", message: "1 departing staff member has not returned keys — retrieve immediately." },
  { type: "children_not_informed", severity: "medium", message: "3 departures — children have not been informed — communicate sensitively." },
];

const ARIA_INSIGHTS = [
  "8 exits. Avg service: 18.4 months. Career progression: 3. Burnout: 2. Would recommend: 50%. Handover complete: 62.5%.",
  "Priority: 2 no safeguarding debrief. 2 access not revoked. 1 keys not returned. 3 children not informed. Burnout trend emerging.",
  "Positive: Most keys returned. Career progression top reason. Improve exit interview completion, handover processes, and children's transition support.",
];

const SATISFACTION_BADGES: Record<string, { label: string; color: string }> = {
  "V. Satisfied": { label: "V. Sat", color: "text-green-700 bg-green-50 border-green-200" },
  "Satisfied": { label: "Sat", color: "text-green-700 bg-green-50 border-green-200" },
  "Neutral": { label: "Neutral", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Dissatisfied": { label: "Dissat", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "V. Dissatisfied": { label: "V. Dis", color: "text-red-700 bg-red-50 border-red-200" },
};

export function StaffExitInterviewsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserMinus className="h-4 w-4 text-brand" />
            Staff Exit Interviews
          </CardTitle>
          <Link href="/staff-exit-interviews" className="text-xs text-brand hover:underline flex items-center gap-1">
            Exits <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.handover_completed_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.handover_completed_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.handover_completed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Handover</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.safeguarding_debrief_rate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.safeguarding_debrief_rate >= 100 ? "text-green-600" : "text-red-600")}>{m.safeguarding_debrief_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Debriefed</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.access_revoked_rate >= 100 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.access_revoked_rate >= 100 ? "text-green-600" : "text-red-600")}>{m.access_revoked_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Access Off</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.burnout_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.burnout_count === 0 ? "text-green-600" : "text-amber-600")}>{m.burnout_count}</p>
            <p className="text-[10px] text-muted-foreground">Burnout</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Exits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = SATISFACTION_BADGES[r.satisfaction] ?? SATISFACTION_BADGES["Neutral"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Key className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="font-medium">{r.name}</span>
                    <span className="text-muted-foreground truncate">{r.reason} · {r.date} · {r.handover}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Exit Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Exit Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
