"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PANEL DECISIONS INTELLIGENCE CARD
// Dashboard card for placement panels, matching, and oversight decisions.
// CHR 2015 Reg 13, Reg 14, Reg 36.
// SCCIF: Leadership — "Placement decisions are robust and evidence-based."
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gavel, ChevronRight, AlertTriangle, Brain,
  Clock, Users, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_panels: 10,
  admission_panel_count: 4,
  matching_panel_count: 3,
  disruption_meeting_count: 1,
  discharge_panel_count: 2,
  approved_rate: 50.0,
  approved_with_conditions_count: 2,
  declined_count: 1,
  deferred_count: 1,
  full_quorum_rate: 70.0,
  quorum_not_met_count: 1,
  child_views_considered_rate: 70.0,
  risk_assessment_reviewed_rate: 80.0,
  minutes_recorded_rate: 90.0,
  all_follow_up_completed_rate: 50.0,
  follow_up_overdue_count: 2,
  unique_children: 6,
};

const DEMO_RECORDS: { type: string; decision: string; date: string; quorum: string; child: string }[] = [
  { type: "Admission", decision: "Approved", date: "11 May", quorum: "Full", child: "Child F" },
  { type: "Matching", decision: "Conditions", date: "8 May", quorum: "Met", child: "Child F" },
  { type: "Admission", decision: "Deferred", date: "5 May", quorum: "Full", child: "Child G" },
  { type: "Discharge", decision: "Approved", date: "1 May", quorum: "Met", child: "Child B" },
  { type: "Disruption", decision: "N/A", date: "28 Apr", quorum: "Not Met", child: "Child A" },
  { type: "Quality", decision: "Approved", date: "20 Apr", quorum: "Full", child: "—" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "quorum_not_met", severity: "critical", message: "Disruption meeting on 28 Apr did not meet quorum — decision may not be valid." },
  { type: "follow_up_overdue", severity: "high", message: "2 panel follow-ups are overdue — complete actions promptly." },
  { type: "child_views_not_considered", severity: "high", message: "3 panels where child views not considered — ensure participation." },
  { type: "minutes_not_recorded", severity: "medium", message: "1 panel without minutes recorded — document decisions." },
];

const ARIA_INSIGHTS = [
  "10 panels. Approved: 50%. Full quorum: 70%. Child views: 70%. Risk reviewed: 80%. Minutes: 90%. Follow-up complete: 50%.",
  "Priority: 1 quorum not met. 2 overdue follow-ups. 3 no child views. 1 no minutes. Deferred decisions need follow-up.",
  "Positive: High risk assessment review rate. Good minutes recording. Matching panels thorough. Improve quorum attendance and child participation.",
];

const DECISION_BADGES: Record<string, { label: string; color: string }> = {
  "Approved": { label: "Approved", color: "text-green-700 bg-green-50 border-green-200" },
  "Conditions": { label: "Conditions", color: "text-blue-700 bg-blue-50 border-blue-200" },
  "Deferred": { label: "Deferred", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Declined": { label: "Declined", color: "text-red-700 bg-red-50 border-red-200" },
  "N/A": { label: "N/A", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

export function PanelDecisionsCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gavel className="h-4 w-4 text-brand" />
            Panel Decisions
          </CardTitle>
          <Link href="/panel-decisions" className="text-xs text-brand hover:underline flex items-center gap-1">
            Panels <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.approved_rate >= 60 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.approved_rate >= 60 ? "text-green-600" : "text-amber-600")}>{m.approved_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Approved</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.full_quorum_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.full_quorum_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.full_quorum_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Quorum</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.child_views_considered_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.child_views_considered_rate >= 90 ? "text-green-600" : "text-amber-600")}>{m.child_views_considered_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Child Views</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_overdue_count === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.follow_up_overdue_count === 0 ? "text-green-600" : "text-amber-600")}>{m.follow_up_overdue_count}</p>
            <p className="text-[10px] text-muted-foreground">Overdue</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Recent Panels</p>
          <div className="space-y-1">
            {DEMO_RECORDS.map((r, i) => {
              const badge = DECISION_BADGES[r.decision] ?? DECISION_BADGES["N/A"];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Scale className="h-3 w-3 text-purple-500 shrink-0" />
                    <span className="font-medium">{r.type}</span>
                    <span className="text-muted-foreground truncate">{r.child} · {r.date} · {r.quorum}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>{badge.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Panel Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Panel Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
