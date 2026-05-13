"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — INFECTION CONTROL INTELLIGENCE CARD
// Dashboard card for infection prevention, hygiene, and outbreak monitoring.
// CHR 2015 Reg 25, Reg 12, Reg 36.
// SCCIF: Helped & Protected — "Infection control measures protect children."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldPlus, ChevronRight, AlertTriangle, Brain,
  Clock, Sparkles, HandMetal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 20,
  hand_hygiene_audit_count: 6,
  cleaning_check_count: 5,
  outbreak_count: 1,
  infection_incident_count: 1,
  excellent_hygiene_rate: 45.0,
  poor_hygiene_count: 1,
  hand_washing_observed_rate: 85.0,
  sanitiser_available_rate: 90.0,
  cleaning_schedule_followed_rate: 80.0,
  laundry_procedures_rate: 85.0,
  food_hygiene_rate: 90.0,
  ppe_fully_compliant_rate: 70.0,
  ppe_non_compliant_count: 2,
  total_children_symptomatic: 3,
  total_staff_symptomatic: 1,
  active_outbreak_count: 0,
  review_overdue_count: 1,
};

const DEMO_RECORDS: { type: string; standard: string; date: string; outbreak: string }[] = [
  { type: "Hand Hygiene", standard: "Good", date: "12 May", outbreak: "None" },
  { type: "Cleaning Check", standard: "Excellent", date: "11 May", outbreak: "None" },
  { type: "PPE Check", standard: "Acceptable", date: "10 May", outbreak: "None" },
  { type: "Illness Report", standard: "Good", date: "8 May", outbreak: "Suspected" },
  { type: "Deep Clean", standard: "Excellent", date: "6 May", outbreak: "None" },
  { type: "Outbreak Mgmt", standard: "Good", date: "5 May", outbreak: "Resolved" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "poor_hygiene", severity: "high", message: "Poor hygiene standard found on 2025-04-28 — immediate deep clean and review required." },
  { type: "ppe_non_compliant", severity: "high", message: "2 PPE non-compliance findings — retrain staff and provide equipment." },
  { type: "review_overdue", severity: "medium", message: "1 infection control review is overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "20 records. Hand washing observed: 85.0%. Sanitiser available: 90.0%. Cleaning followed: 80.0%. PPE compliant: 70.0%. Food hygiene: 90.0%.",
  "Priority: 1 poor hygiene finding. 2 PPE non-compliance. 1 overdue review. PPE compliance at 70.0% needs improvement. 3 children symptomatic total.",
  "Positive: High sanitiser availability. Good food hygiene. No active outbreaks. Regular hand hygiene audits. Improve PPE compliance and cleaning adherence.",
];

const STANDARD_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Acceptable": { label: "Acceptable", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function InfectionControlCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldPlus className="h-4 w-4 text-brand" />
            Infection Control
          </CardTitle>
          <Link href="/infection-control" className="text-xs text-brand hover:underline flex items-center gap-1">
            Infection Ctrl <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.hand_washing_observed_rate >= 85 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.hand_washing_observed_rate >= 85 ? "text-green-600" : "text-amber-600")}>{m.hand_washing_observed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Hand Wash</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.cleaning_schedule_followed_rate >= 85 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.cleaning_schedule_followed_rate >= 85 ? "text-green-600" : "text-amber-600")}>{m.cleaning_schedule_followed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Cleaning</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.ppe_fully_compliant_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.ppe_fully_compliant_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.ppe_fully_compliant_rate}%</p>
            <p className="text-[10px] text-muted-foreground">PPE</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.active_outbreak_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.active_outbreak_count === 0 ? "text-green-600" : "text-red-600")}>{m.active_outbreak_count}</p>
            <p className="text-[10px] text-muted-foreground">Outbreaks</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Infection Control</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STANDARD_BADGES[r.standard] ?? STANDARD_BADGES["Good"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Infection Control Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Infection Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
