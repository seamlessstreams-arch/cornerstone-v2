"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — COMMUNAL AREA AUDIT INTELLIGENCE CARD
// Dashboard card for communal area cleanliness, safety, and homeliness audits.
// CHR 2015 Reg 36, Reg 6, Reg 25.
// SCCIF: Overall Experiences — "The home is welcoming and homely."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sofa, ChevronRight, AlertTriangle, Brain,
  Clock, Sparkles, Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_audits: 18,
  spotless_rate: 27.8,
  clean_rate: 44.4,
  unacceptable_count: 1,
  very_homely_rate: 38.9,
  institutional_count: 1,
  all_clear_rate: 72.2,
  immediate_risk_count: 0,
  significant_hazard_count: 1,
  furniture_good_rate: 83.3,
  decoration_fresh_rate: 77.8,
  temperature_comfortable_rate: 88.9,
  lighting_adequate_rate: 94.4,
  accessible_rate: 88.9,
  child_artwork_rate: 61.1,
  age_appropriate_rate: 83.3,
  hazards_removed_rate: 88.9,
  fire_exits_clear_rate: 94.4,
  children_consulted_rate: 55.6,
  audit_overdue_count: 2,
};

const DEMO_RECORDS: { area: string; cleanliness: string; homeliness: string; date: string; safety: string }[] = [
  { area: "Lounge", cleanliness: "Clean", homeliness: "Homely", date: "12 May", safety: "Clear" },
  { area: "Kitchen", cleanliness: "Spotless", homeliness: "Very Homely", date: "11 May", safety: "Clear" },
  { area: "Dining Room", cleanliness: "Acceptable", homeliness: "Adequate", date: "10 May", safety: "Minor" },
  { area: "Garden", cleanliness: "Clean", homeliness: "Homely", date: "8 May", safety: "Clear" },
  { area: "Bathroom", cleanliness: "Needs Attention", homeliness: "Institutional", date: "6 May", safety: "Clear" },
  { area: "Hallway", cleanliness: "Clean", homeliness: "Homely", date: "5 May", safety: "Clear" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "institutional", severity: "high", message: "Bathroom rated as institutional on 6 May — make more homely." },
  { type: "unacceptable_cleanliness", severity: "high", message: "1 area has unacceptable cleanliness — deep clean required." },
  { type: "audit_overdue", severity: "medium", message: "2 communal area audits are overdue — schedule promptly." },
];

const ARIA_INSIGHTS = [
  "18 audits. Clean/Spotless: 72.2%. Homely/Very Homely: 61.1%. Safety all clear: 72.2%. Fire exits clear: 94.4%. Children consulted: 55.6%.",
  "Priority: 1 institutional area. 1 unacceptable cleanliness. 2 audits overdue. Children consulted only 55.6%. Child artwork displayed 61.1%.",
  "Positive: Good lighting 94.4%. Temperature comfortable 88.9%. Accessible 88.9%. Hazards removed 88.9%. Improve homeliness and child consultation.",
];

const SAFETY_BADGES: Record<string, { label: string; color: string }> = {
  "Clear": { label: "Clear", color: "text-green-700 bg-green-50 border-green-200" },
  "Minor": { label: "Minor", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Significant": { label: "Hazard", color: "text-red-700 bg-red-50 border-red-200" },
  "Immediate": { label: "Risk!", color: "text-red-700 bg-red-100 border-red-300" },
};

export function CommunalAreaAuditCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sofa className="h-4 w-4 text-brand" />
            Communal Area Audits
          </CardTitle>
          <Link href="/communal-area-audits" className="text-xs text-brand hover:underline flex items-center gap-1">
            Audits <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", (m.spotless_rate + m.clean_rate) >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", (m.spotless_rate + m.clean_rate) >= 80 ? "text-green-600" : "text-amber-600")}>{Math.round((m.spotless_rate + m.clean_rate) * 10) / 10}%</p>
            <p className="text-[10px] text-muted-foreground">Clean</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.very_homely_rate >= 50 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.very_homely_rate >= 50 ? "text-green-600" : "text-amber-600")}>{m.very_homely_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Homely</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.all_clear_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.all_clear_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.all_clear_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Safe</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.institutional_count === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.institutional_count === 0 ? "text-green-600" : "text-red-600")}>{m.institutional_count}</p>
            <p className="text-[10px] text-muted-foreground">Institutional</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Area Audits</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = SAFETY_BADGES[r.safety] ?? SAFETY_BADGES["Clear"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Home className="h-3 w-3 text-teal-500 shrink-0" />
                    <span className="font-medium">{r.area}</span>
                    <span className="text-muted-foreground truncate">{r.cleanliness} · {r.homeliness} · {r.date}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Area Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Communal Area Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
