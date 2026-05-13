"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION ADMINISTRATION INTELLIGENCE CARD
// Dashboard card for medication rounds, MAR compliance, and safety.
// CHR 2015 Reg 23, Reg 6.
// SCCIF: Helped & Protected — "Children's medication is managed
// safely and effectively."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Syringe, ChevronRight, AlertTriangle, Brain,
  Pill, CheckCircle2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_administrations: 84,
  administration_rate: 89.3,
  refused_count: 5,
  refusal_rate: 6.0,
  controlled_drug_count: 12,
  controlled_drug_witnessed_rate: 91.7,
  mar_chart_updated_rate: 95.2,
  side_effects_count: 2,
};

const DEMO_RECORDS: { child: string; med: string; type: string; outcome: string }[] = [
  { child: "Child A", med: "Melatonin 3mg", type: "Regular", outcome: "Administered" },
  { child: "Child B", med: "Methylphenidate 10mg", type: "Controlled", outcome: "Administered" },
  { child: "Child C", med: "Paracetamol 500mg", type: "PRN", outcome: "Administered" },
  { child: "Child A", med: "Sertraline 50mg", type: "Regular", outcome: "Refused" },
  { child: "Child D", med: "Inhaler", type: "Regular", outcome: "Self Administered" },
  { child: "Child B", med: "Methylphenidate 10mg", type: "Controlled", outcome: "Administered" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "cd_not_witnessed", severity: "critical", message: "Controlled drug Methylphenidate administered to Child B without required witness — immediate investigation needed." },
  { type: "side_effects", severity: "high", message: "Side effects observed for Child A after Sertraline — drowsiness and nausea reported." },
  { type: "mar_not_updated", severity: "medium", message: "4 administrations without MAR chart update — ensure all medication records are contemporaneous." },
];

const ARIA_INSIGHTS = [
  "84 administrations today. Admin rate: 89.3%. Refusals: 5 (6.0%). Controlled drugs: 12 (91.7% witnessed). MAR compliance: 95.2%. Side effects: 2.",
  "Priority: Controlled drug witness gap — 1 administration unwitnessed. Child A refusing Sertraline — explore reasons. Side effects need GP review. 4 MAR entries not contemporaneous.",
  "Positive: 89.3% administration rate strong. 91.7% controlled drug witnessing near-target. MAR compliance at 95.2%. Self-administration for Child D shows independence. Review PRN patterns for trends.",
];

const OUTCOME_BADGES: Record<string, { label: string; color: string }> = {
  "Administered": { label: "Given", color: "text-green-700 bg-green-50 border-green-200" },
  "Refused": { label: "Refused", color: "text-red-700 bg-red-50 border-red-200" },
  "Self Administered": { label: "Self", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Delayed": { label: "Delayed", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Available": { label: "N/A", color: "text-slate-600 bg-slate-50 border-slate-200" },
};

export function MedicationAdministrationCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Syringe className="h-4 w-4 text-brand" />
            Medication Administration
          </CardTitle>
          <Link href="/medication-administration" className="text-xs text-brand hover:underline flex items-center gap-1">
            MAR <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.administration_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Admin Rate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.refused_count > 0 ? "bg-red-50" : "bg-green-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.refused_count > 0 ? "text-red-600" : "text-green-600")}>{m.refused_count}</p>
            <p className="text-[10px] text-muted-foreground">Refused</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">{m.controlled_drug_witnessed_rate}%</p>
            <p className="text-[10px] text-muted-foreground">CD Witness</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.mar_chart_updated_rate}%</p>
            <p className="text-[10px] text-muted-foreground">MAR Updated</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Pill className="h-3 w-3" />Recent Administrations</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = OUTCOME_BADGES[r.outcome] ?? OUTCOME_BADGES["Administered"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.med} · {r.type}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Medication Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Medication Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
