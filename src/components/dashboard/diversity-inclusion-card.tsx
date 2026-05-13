"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DIVERSITY & INCLUSION INTELLIGENCE CARD
// Dashboard card for equality, diversity and inclusion monitoring.
// CHR 2015 Reg 6/11. Equality Act 2010.
// SCCIF: Overall Experiences — "Diversity is celebrated."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe, ChevronRight, AlertTriangle, Brain,
  CheckCircle2, XCircle, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_records: 22,
  children_with_records: 5,
  children_coverage: 83.3,
  in_place_count: 14,
  not_met_count: 2,
  staff_trained_rate: 68.2,
  equality_impact_rate: 54.5,
  child_satisfied_rate: 85.7,
};

const DEMO_RECORDS: { child: string; characteristic: string; need: string; status: string }[] = [
  { child: "Child A", characteristic: "Religion", need: "Halal dietary provision", status: "In Place" },
  { child: "Child B", characteristic: "Disability", need: "Wheelchair accessibility", status: "In Place" },
  { child: "Child C", characteristic: "Language", need: "Interpreter for reviews", status: "Partially Met" },
  { child: "Child D", characteristic: "Cultural Heritage", need: "Cultural celebration days", status: "In Place" },
  { child: "Child A", characteristic: "Language", need: "Bilingual resources", status: "Not Met" },
  { child: "Child E", characteristic: "Gender Identity", need: "Identity-affirming practice", status: "Under Review" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "need_not_met", severity: "critical", message: "Child A's language need (bilingual resources) is not met — immediate action required." },
  { type: "staff_not_aware", severity: "high", message: "Staff not aware of Child E's gender identity needs — brief all staff immediately." },
  { type: "no_eia", severity: "medium", message: "No equality impact assessment for Child C's language support — complete EIA." },
];

const ARIA_INSIGHTS = [
  "22 diversity records across 5 children (83.3% coverage). 14 in place, 2 not met. Staff trained: 68.2%. EIA completed: 54.5%. Child satisfaction: 85.7%.",
  "Priority: Child A's bilingual resource need unmet — source appropriate materials urgently. Staff awareness gaps need addressing through whole-team briefing. Equality impact assessments only at 54.5% — target 100% for Equality Act compliance.",
  "Positive: Dietary and accessibility provisions well established. Child satisfaction at 85.7% shows children feel their diversity is respected. Cultural celebration days positively received. Expand identity-affirming practice training across team.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  "In Place": { label: "In Place", color: "text-green-700 bg-green-50 border-green-200" },
  "Partially Met": { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Not Met": { label: "Not Met", color: "text-red-700 bg-red-50 border-red-200" },
  "Under Review": { label: "Review", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Not Applicable": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function DiversityInclusionCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand" />
            Diversity & Inclusion
          </CardTitle>
          <Link href="/diversity-inclusion" className="text-xs text-brand hover:underline flex items-center gap-1">
            EDI <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.in_place_count}</p>
            <p className="text-[10px] text-muted-foreground">In Place</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.not_met_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.not_met_count === 0 ? "text-green-600" : "text-red-600")}>{m.not_met_count}</p>
            <p className="text-[10px] text-muted-foreground">Not Met</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.staff_trained_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.staff_trained_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.staff_trained_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Trained</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_satisfied_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_satisfied_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.child_satisfied_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Satisfied</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />EDI Support Records</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = STATUS_BADGES[r.status] ?? STATUS_BADGES["Under Review"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{r.child}</span>
                    <span className="text-muted-foreground truncate">{r.characteristic} · {r.need}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />EDI Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA EDI Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
