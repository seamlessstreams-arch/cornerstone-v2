"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PEER MENTORING INTELLIGENCE CARD
// Dashboard card for peer mentoring and buddy programme tracking.
// CHR 2015 Reg 5/6/7. SCCIF: Overall Experiences — Peer relationships.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, ChevronRight, AlertTriangle, Brain,
  Handshake, ShieldAlert, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_METRICS = {
  total_pairings: 8,
  active_pairings: 5,
  completed_pairings: 2,
  ended_early_count: 1,
  children_involved: 6,
  participation_rate: 100.0,
  total_sessions: 34,
  average_sessions_per_pairing: 4.3,
  positive_outcome_rate: 85.7,
  safeguarding_concerns: 1,
  mentor_feedback_rate: 62.5,
  mentee_feedback_rate: 50.0,
};

const DEMO_PAIRINGS: { mentor: string; mentee: string; type: string; status: string; sessions: number }[] = [
  { mentor: "Child A", mentee: "Child F", type: "Welcome Buddy", status: "Active", sessions: 6 },
  { mentor: "Child B", mentee: "Child E", type: "Study Buddy", status: "Active", sessions: 8 },
  { mentor: "Child C", mentee: "Child D", type: "Peer Mentor", status: "Active", sessions: 5 },
  { mentor: "Child A", mentee: "Child D", type: "Activity Partner", status: "Completed", sessions: 10 },
  { mentor: "Child B", mentee: "Child F", type: "Skills Partner", status: "Active", sessions: 3 },
  { mentor: "Child C", mentee: "Child E", type: "Buddy System", status: "Ended Early", sessions: 2 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "safeguarding_concern", severity: "high", message: "Power imbalance concern in pairing between Child C and Child E — review and consider pausing." },
  { type: "no_sessions", severity: "medium", message: "Peer pairing between Child B and Child F is active but only 3 sessions recorded — schedule regular sessions." },
  { type: "negative_outcome", severity: "medium", message: "Last session between Child C and Child E was negative — review pairing suitability." },
];

const ARIA_INSIGHTS = [
  "8 peer pairings involving 6 children (100% participation). 5 active, 2 completed, 1 ended early. 34 total sessions (4.3 avg). Positive outcome rate: 85.7%. 1 safeguarding concern flagged.",
  "Priority: Power imbalance between Child C and Child E needs immediate review. Child C–Child E pairing ended early — investigate root cause. Increase mentee feedback rate from 50% to capture both perspectives.",
  "Positive: 100% of children involved in peer support. Welcome buddy programme helping Child F settle in well. Study buddy pairing (Child B–Child E) showing strong session consistency. Expand skills partner programme.",
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  Active: { label: "Active", color: "text-green-700 bg-green-50 border-green-200" },
  Completed: { label: "Completed", color: "text-blue-700 bg-blue-50 border-blue-200" },
  Paused: { label: "Paused", color: "text-amber-700 bg-amber-50 border-amber-200" },
  "Ended Early": { label: "Ended Early", color: "text-red-700 bg-red-50 border-red-200" },
  "Pending Review": { label: "Review", color: "text-orange-700 bg-orange-50 border-orange-200" },
};

export function PeerMentoringCard() {
  const m = DEMO_METRICS;
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Handshake className="h-4 w-4 text-brand" />
            Peer Mentoring
          </CardTitle>
          <Link href="/peer-mentoring" className="text-xs text-brand hover:underline flex items-center gap-1">
            Pairings <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.active_pairings}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.participation_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Participation</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.positive_outcome_rate >= 80 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.positive_outcome_rate >= 80 ? "text-green-600" : "text-amber-600")}>{m.positive_outcome_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Positive</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.safeguarding_concerns === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.safeguarding_concerns === 0 ? "text-green-600" : "text-red-600")}>{m.safeguarding_concerns}</p>
            <p className="text-[10px] text-muted-foreground">Concerns</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />Peer Pairings</p>
          <div className="space-y-1">
            {DEMO_PAIRINGS.map((pp, i) => {
              const badge = STATUS_BADGES[pp.status] ?? STATUS_BADGES.Active;
              return (
                <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <User className="h-3 w-3 text-blue-500 shrink-0" />
                    <span className="font-medium">{pp.mentor} → {pp.mentee}</span>
                    <span className="text-muted-foreground truncate">{pp.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground">{pp.sessions} sessions</span>
                    <Badge variant="outline" className={cn("text-[10px]", badge.color)}>{badge.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Peer Mentoring Alerts</p>
            {DEMO_ALERTS.map((a, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", a.severity === "critical" || a.severity === "high" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800")}>{a.message}</div>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700"><Brain className="h-3 w-3" />ARIA Peer Intelligence</p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", i === 0 ? "border-blue-200 bg-blue-50 text-blue-800" : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800" : "border-green-200 bg-green-50 text-green-800")}>{insight}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
