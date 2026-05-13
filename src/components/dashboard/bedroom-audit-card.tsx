"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — BEDROOM AUDIT INTELLIGENCE CARD
// Dashboard card for bedroom standards, personalisation, and safety.
// CHR 2015 Reg 36, Reg 6, Reg 10.
// SCCIF: Overall Experiences — "Children have personalised bedrooms."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble, ChevronRight, AlertTriangle, Brain,
  Clock, Paintbrush, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_audits: 16,
  routine_inspection_count: 8,
  safety_check_count: 4,
  excellent_condition_rate: 37.5,
  poor_condition_count: 1,
  unacceptable_condition_count: 0,
  highly_personalised_rate: 50.0,
  not_personalised_count: 1,
  safe_rating_rate: 81.3,
  unsafe_count: 0,
  child_consulted_rate: 68.8,
  privacy_respected_rate: 93.8,
  audit_overdue_count: 2,
};

const DEMO_RECORDS: { room: string; condition: string; personal: string; date: string; safety: string }[] = [
  { room: "Bedroom 1", condition: "Excellent", personal: "Highly", date: "11 May", safety: "Safe" },
  { room: "Bedroom 2", condition: "Good", personal: "Some", date: "11 May", safety: "Safe" },
  { room: "Bedroom 3", condition: "Good", personal: "Highly", date: "10 May", safety: "Safe" },
  { room: "Bedroom 4", condition: "Satisfactory", personal: "Minimal", date: "10 May", safety: "Minor" },
  { room: "Bedroom 1", condition: "Excellent", personal: "Highly", date: "5 May", safety: "Safe" },
  { room: "Bedroom 5", condition: "Poor", personal: "Not Pers.", date: "3 May", safety: "Concern" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "not_personalised", severity: "high", message: "1 bedroom is not personalised — children must feel at home." },
  { type: "child_not_consulted", severity: "medium", message: "5 audits without child consultation — ensure children's views are captured." },
  { type: "audit_overdue", severity: "medium", message: "2 bedroom audits are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "16 bedroom audits. Excellent condition: 37.5%. Highly personalised: 50.0%. Safe: 81.3%. Child consulted: 68.8%. Privacy respected: 93.8%.",
  "Priority: 1 not personalised. 1 poor condition. 5 audits without child consultation. 2 overdue audits. Personalisation rate needs improvement.",
  "Positive: No unsafe bedrooms. High privacy respect. Regular inspections happening. Excellent condition in 37.5%. Improve child consultation rate.",
];

const CONDITION_BADGES: Record<string, { label: string; color: string }> = {
  "Excellent": { label: "Excellent", color: "text-green-700 bg-green-50 border-green-200" },
  "Good": { label: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Satisfactory": { label: "Satisfac.", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Poor": { label: "Poor", color: "text-red-700 bg-red-50 border-red-200" },
};

export function BedroomAuditCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-brand" />
            Bedroom Audits
          </CardTitle>
          <Link href="/bedroom-audits" className="text-xs text-brand hover:underline flex items-center gap-1">
            Audits <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.safe_rating_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.safe_rating_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.safe_rating_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Safe</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.highly_personalised_rate >= 60 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.highly_personalised_rate >= 60 ? "text-green-600" : "text-amber-600")}>{m.highly_personalised_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Personalised</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_consulted_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_consulted_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_consulted_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Consulted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.audit_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.audit_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.audit_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Bedroom Audits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = CONDITION_BADGES[r.condition] ?? CONDITION_BADGES["Good"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paintbrush className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.room}</span>
                    <span className="text-muted-foreground truncate">{r.personal} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Bedroom Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Bedroom Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
