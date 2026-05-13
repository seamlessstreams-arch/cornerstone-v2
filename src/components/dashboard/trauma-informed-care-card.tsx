"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — TRAUMA-INFORMED CARE INTELLIGENCE CARD
// Dashboard card for trauma assessments, therapeutic models, and recovery.
// CHR 2015 Reg 6, Reg 14, Reg 16.
// SCCIF: Overall Experiences — "Staff understand children's trauma
// and respond therapeutically."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse, ChevronRight, AlertTriangle, Brain,
  Stethoscope, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 6,
  children_assessed: 6,
  assessment_coverage: 100,
  average_aces_score: 5.2,
  therapist_involved_rate: 83.3,
  plan_in_place_rate: 83.3,
  staff_aware_rate: 66.7,
  average_staff_trained: 72.5,
};

const DEMO_RECORDS: { child: string; model: string; recovery: string; aces: number }[] = [
  { child: "Child A", model: "PACE", recovery: "Some Improvement", aces: 6 },
  { child: "Child B", model: "Theraplay", recovery: "Significant Improvement", aces: 4 },
  { child: "Child C", model: "EMDR", recovery: "Deteriorating", aces: 8 },
  { child: "Child D", model: "CBT", recovery: "Stable", aces: 3 },
  { child: "Child E", model: "Play Therapy", recovery: "Some Improvement", aces: 5 },
  { child: "Child F", model: "PACE", recovery: "Stable", aces: 5 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "deteriorating", severity: "critical", message: "Child C's trauma recovery is deteriorating — review therapeutic approach and consider specialist referral." },
  { type: "staff_unaware", severity: "high", message: "Staff not aware of Child D's trauma triggers — brief all staff to prevent re-traumatisation." },
  { type: "low_training", severity: "medium", message: "Only 40% of staff trained in Child E's therapeutic model (play therapy) — increase TIC training." },
];

const ARIA_INSIGHTS = [
  "6 trauma assessments covering all 6 children (100%). Average ACEs: 5.2. Therapist involved: 83.3%. Plans in place: 83.3%. Staff awareness: 66.7%.",
  "Priority: Child C deteriorating with ACEs of 8 — urgent therapeutic review. Staff unaware of Child D's triggers — immediate briefing needed. Play therapy training at 40% — upskill remaining staff.",
  "Positive: 100% assessment coverage. PACE and Theraplay showing positive outcomes. 83.3% therapist involvement demonstrates therapeutic commitment. Consider peer supervision to embed TIC practice.",
];

const RECOVERY_BADGES: Record<string, { label: string; color: string }> = {
  "Significant Improvement": { label: "Sig. Improv.", color: "text-green-700 bg-green-50 border-green-200" },
  "Some Improvement": { label: "Improving", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  "Stable": { label: "Stable", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Deteriorating": { label: "Deteriorating", color: "text-red-700 bg-red-50 border-red-200" },
  "Not Assessed": { label: "Not Assessed", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function TraumaInformedCareCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-brand" />
            Trauma-Informed Care
          </CardTitle>
          <Link href="/trauma-informed-care" className="text-xs text-brand hover:underline flex items-center gap-1">
            Assessments <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">{m.average_aces_score}</p>
            <p className="text-[10px] text-muted-foreground">Avg ACEs</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.therapist_involved_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Therapist</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.plan_in_place_rate}%</p>
            <p className="text-[10px] text-muted-foreground">TIC Plans</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.staff_aware_rate < 80 ? "bg-amber-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.staff_aware_rate < 80 ? "text-amber-600" : "text-green-600")}>{m.staff_aware_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Staff Aware</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Stethoscope className="h-3 w-3" />Current Assessments</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = RECOVERY_BADGES[r.recovery] ?? RECOVERY_BADGES["Not Assessed"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.model} · ACEs {r.aces}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Trauma Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Trauma Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
