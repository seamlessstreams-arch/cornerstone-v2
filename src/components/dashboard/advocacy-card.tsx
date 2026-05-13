"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — ADVOCACY & CHILDREN'S RIGHTS INTELLIGENCE CARD
// Dashboard card for advocacy referrals, rights awareness, children's
// participation, and ARIA advocacy intelligence.
// CHR 2015 Reg 7, Reg 14, Reg 45, Children Act 1989 s26 (advocacy).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCheck, ChevronRight, AlertTriangle, Brain,
  Heart, Eye, Scale, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_referrals: 4,
  active_referrals: 2,
  avg_days_to_allocation: 3,
  children_with_advocates: 2,
  rights_awareness_rate: 80,
  rights_exercise_rate: 60,
  total_children: 5,
};

const DEMO_BY_REASON = [
  { reason: "LAC Review", count: 2, active: 1 },
  { reason: "Complaint", count: 1, active: 0 },
  { reason: "Child Request", count: 1, active: 1 },
];

const DEMO_RIGHTS_COVERAGE = [
  { right: "Complaint Process", informed: 5, total: 5 },
  { right: "Advocacy Access", informed: 4, total: 5 },
  { right: "LAC Review Participation", informed: 5, total: 5 },
  { right: "Care Plan Input", informed: 4, total: 5 },
  { right: "Privacy", informed: 3, total: 5 },
  { right: "Ofsted Contact", informed: 3, total: 5 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "rights_gap", severity: "high", message: "2 children have not been informed of their right to contact Ofsted directly. This is a key right under Reg 45." },
  { type: "advocacy_contact", severity: "medium", message: "1 active advocacy referral has had no advocate contact for 28 days. Follow up with the advocate service." },
];

const ARIA_INSIGHTS = [
  "2 active advocacy referrals — Child C (LAC review support, NYAS, allocated) and Child D (child request, Coram Voice, awaiting allocation 4 days). Child D's allocation is approaching the 5-day threshold — follow up with Coram Voice if not allocated by tomorrow.",
  "Rights awareness: 80% of children informed across all right types. Gaps in privacy rights (3/5) and Ofsted contact (3/5). Schedule rights information sessions for Child A and Child E. All children informed of complaint process and LAC review participation.",
  "Overall: 4 referrals in 12 months, 2 active. Average 3 days to advocate allocation. 2 of 5 children currently have active advocates. Rights exercise rate at 60% — children are aware of rights but need encouragement and support to exercise them. No children have reported dissatisfaction with advocacy outcomes.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function AdvocacyCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-brand" />
            Advocacy & Rights
          </CardTitle>
          <Link href="/advocacy" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.active_referrals}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.children_with_advocates}</p>
            <p className="text-[10px] text-muted-foreground">With Advocate</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.rights_awareness_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.rights_awareness_rate >= 90 ? "text-green-600" : "text-amber-600")}>
              {m.rights_awareness_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Rights Aware</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.rights_exercise_rate >= 70 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.rights_exercise_rate >= 70 ? "text-green-600" : "text-amber-600")}>
              {m.rights_exercise_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Exercised</p>
          </div>
        </div>

        {/* ── Referrals by reason ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3" />
            Advocacy Referrals
          </p>
          {DEMO_BY_REASON.map((r) => (
            <div key={r.reason} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="truncate flex-1">{r.reason}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge variant="outline" className="text-[10px] tabular-nums">{r.count}</Badge>
                {r.active > 0 && (
                  <Badge className="text-[10px] bg-blue-100 text-blue-700">{r.active} active</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Rights coverage ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Scale className="h-3 w-3" />
            Rights Awareness Coverage
          </p>
          {DEMO_RIGHTS_COVERAGE.map((r) => (
            <div key={r.right} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="truncate flex-1">{r.right}</span>
              <Badge className={cn(
                "text-[10px]",
                r.informed === r.total ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
              )}>
                {r.informed}/{r.total}
              </Badge>
            </div>
          ))}
        </div>

        {/* ── Participation ───────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1">
            <MessageSquare className="h-3 w-3 text-blue-500" />
            Participation
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">{m.avg_days_to_allocation}d</p>
              <p className="text-[10px] text-muted-foreground">Avg Allocation</p>
            </div>
            <div className="text-center rounded border p-2">
              <p className="text-sm font-bold tabular-nums text-blue-600">{m.total_referrals}</p>
              <p className="text-[10px] text-muted-foreground">Referrals (12m)</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Advocacy Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "critical" || alert.severity === "high"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-amber-200 bg-amber-50 text-amber-800",
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Advocacy Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-amber-200 bg-amber-50 text-amber-800"
                  : i === 1 ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-green-200 bg-green-50 text-green-800",
              )}
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
