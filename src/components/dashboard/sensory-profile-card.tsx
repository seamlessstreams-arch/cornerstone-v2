"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SENSORY PROFILE INTELLIGENCE CARD
// Dashboard card for sensory needs assessment and environmental adaptations.
// CHR 2015 Reg 6/14/15. SCCIF: Overall Experiences — Individual needs.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye, ChevronRight, AlertTriangle, Brain,
  Ear, Fingerprint, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_profiles: 24,
  children_assessed: 5,
  assessment_coverage: 83.3,
  current_profiles: 18,
  outdated_profiles: 3,
  under_review_count: 2,
  hyper_sensitive_count: 7,
  hypo_sensitive_count: 4,
  seeking_count: 3,
  staff_trained_rate: 70.8,
  ot_input_rate: 45.8,
  child_views_rate: 62.5,
  adaptations_in_place: 20,
};

const DEMO_PROFILES: { child: string; domain: string; level: string; adapted: boolean }[] = [
  { child: "Child A", domain: "Auditory", level: "Hyper-Sensitive", adapted: true },
  { child: "Child B", domain: "Tactile", level: "Hyper-Sensitive", adapted: true },
  { child: "Child C", domain: "Visual", level: "Seeking", adapted: true },
  { child: "Child A", domain: "Proprioceptive", level: "Hypo-Sensitive", adapted: false },
  { child: "Child D", domain: "Vestibular", level: "Sensitive", adapted: true },
  { child: "Child B", domain: "Olfactory", level: "Hyper-Sensitive", adapted: true },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "no_profile", severity: "high", message: "1 child has no sensory profile — assess sensory needs to inform care." },
  { type: "staff_not_trained", severity: "high", message: "Staff not trained on Child A's proprioceptive hypo-sensitive needs — training required." },
  { type: "profile_outdated", severity: "medium", message: "Sensory profile for Child C (visual) is outdated — schedule reassessment." },
];

const ARIA_INSIGHTS = [
  "24 sensory profiles across 5 children (83.3% coverage). 18 current, 3 outdated, 2 under review. 7 hyper-sensitive, 4 hypo-sensitive, 3 seeking. Staff trained: 70.8%. OT input: 45.8%.",
  "Priority: 1 child has no sensory profile. Child A's proprioceptive needs have no adaptations in place — immediate action needed. 3 outdated profiles need reassessment. Increase OT involvement from 45.8%.",
  "Positive: 20 of 24 profiles have adaptations in place. Auditory and tactile needs well managed. Increase child views recording from 62.5% — children's input shapes better sensory environments.",
];

const LEVEL_BADGES: Record<string, { label: string; color: string }> = {
  "Hyper-Sensitive": { label: "Hyper", color: "text-red-700 bg-red-50 border-red-200" },
  Sensitive: { label: "Sensitive", color: "text-orange-700 bg-orange-50 border-orange-200" },
  Typical: { label: "Typical", color: "text-gray-700 bg-gray-50 border-gray-200" },
  Seeking: { label: "Seeking", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Hypo-Sensitive": { label: "Hypo", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export function SensoryProfileCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Ear className="h-4 w-4 text-brand" />
            Sensory Profiles
          </CardTitle>
          <Link href="/sensory-profiles" className="text-xs text-brand hover:underline flex items-center gap-1">
            Profiles <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.assessment_coverage === 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.assessment_coverage === 100 ? "text-green-600" : "text-amber-600")}>{m.assessment_coverage}%</p>
            <p className="text-[10px] text-muted-foreground">Coverage</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.current_profiles}</p>
            <p className="text-[10px] text-muted-foreground">Current</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.outdated_profiles === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.outdated_profiles === 0 ? "text-green-600" : "text-amber-600")}>{m.outdated_profiles}</p>
            <p className="text-[10px] text-muted-foreground">Outdated</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.staff_trained_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.staff_trained_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.staff_trained_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Trained</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Fingerprint className="h-3 w-3" />Sensory Assessments</p>
          <div className="space-y-1">
            {DEMO_PROFILES.map((sp, i) => {
              const badge = LEVEL_BADGES[sp.level] ?? LEVEL_BADGES.Typical;
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Eye className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{sp.child}</span>
                    <span className="text-muted-foreground truncate">{sp.domain}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {sp.adapted && <span className="text-[10px] text-green-600">✓ adapted</span>}
                    <Badge variant="outline" className={cn("text-[10px]", badge.color)}>{badge.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Sensory Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Sensory Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
