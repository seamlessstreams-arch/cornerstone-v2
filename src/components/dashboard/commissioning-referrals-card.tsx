"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — COMMISSIONING & REFERRALS INTELLIGENCE CARD
// Dashboard card for placement referrals, occupancy, and matching.
// CHR 2015 Reg 36/12/14. SCCIF: Well-Led.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building, ChevronRight, AlertTriangle, Brain,
  UserPlus, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  active_referrals: 2,
  accepted: 8,
  declined: 4,
  placed: 7,
  acceptance_rate: 66.7,
  avg_decision_days: 4,
  current_occupancy_rate: 83.3,
  available_places: 1,
  registered_places: 6,
  children_in_placement: 5,
};

const DEMO_ACTIVE = [
  { child: "Child F", age: 13, authority: "Leeds City Council", urgency: "planned", days: 3, status: "matching_assessment" },
  { child: "Child G", age: 10, authority: "Bradford MDC", urgency: "standard", days: 1, status: "under_review" },
];

const DEMO_RECENT_DECISIONS = [
  { child: "Child E", authority: "Kirklees", decision: "accepted", days: 3 },
  { child: "Referral 11", authority: "Wakefield", decision: "declined", reason: "needs_mismatch", days: 5 },
  { child: "Referral 10", authority: "Leeds", decision: "declined", reason: "no_capacity", days: 2 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "stale_referral", severity: "medium", message: "Only 1 registered place available — ensure matching assessment for Child F is thorough before committing." },
];

const ARIA_INSIGHTS = [
  "2 active referrals in progress (1 at matching assessment, 1 under review). 5/6 places occupied (83.3%). Acceptance rate: 66.7% — 8 accepted, 4 declined this year. Average decision time: 4 days.",
  "Matching: Child F (age 13, Leeds) is at matching assessment stage. Key consideration: existing group is aged 10-14, mix of 3 boys and 2 girls. Presenting needs include attachment difficulties and school refusal — align with therapeutic model. Child G (age 10, Bradford) received yesterday — initial screening today.",
  "Trend: 3 of 4 recent declines were capacity-related rather than needs-based — home is consistently near full occupancy. Consider whether statement of purpose should be updated to reflect current referral patterns. Commissioning relationships with Leeds and Bradford are strong — maintain proactive communication.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const URGENCY_BADGES: Record<string, { label: string; color: string }> = {
  emergency: { label: "Emergency", color: "text-red-700 bg-red-50 border-red-200" },
  urgent: { label: "Urgent", color: "text-orange-700 bg-orange-50 border-orange-200" },
  planned: { label: "Planned", color: "text-blue-700 bg-blue-50 border-blue-200" },
  standard: { label: "Standard", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function CommissioningReferralsCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building className="h-4 w-4 text-brand" />
            Commissioning & Referrals
          </CardTitle>
          <Link href="/commissioning-referrals" className="text-xs text-brand hover:underline flex items-center gap-1">
            Referrals <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.active_referrals > 0 ? "bg-blue-50" : "bg-gray-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.active_referrals > 0 ? "text-blue-600" : "text-gray-600")}>
              {m.active_referrals}
            </p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.acceptance_rate}%</p>
            <p className="text-[10px] text-muted-foreground">Accepted</p>
          </div>
          <div className={cn("text-center rounded-lg p-2",
            m.current_occupancy_rate < 80 ? "bg-green-50" : m.current_occupancy_rate < 100 ? "bg-amber-50" : "bg-red-50"
          )}>
            <p className={cn("text-lg font-bold tabular-nums",
              m.current_occupancy_rate < 80 ? "text-green-600" : m.current_occupancy_rate < 100 ? "text-amber-600" : "text-red-600"
            )}>
              {m.current_occupancy_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Occupancy</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.available_places > 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.available_places > 0 ? "text-green-600" : "text-red-600")}>
              {m.available_places}
            </p>
            <p className="text-[10px] text-muted-foreground">Places</p>
          </div>
        </div>

        {/* ── Active referrals ───────────────────────────────────────── */}

        {DEMO_ACTIVE.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <UserPlus className="h-3 w-3" />
              Active Referrals
            </p>
            <div className="space-y-1">
              {DEMO_ACTIVE.map((r) => {
                const badge = URGENCY_BADGES[r.urgency] ?? URGENCY_BADGES.standard;
                return (
                  <div key={r.child} className="flex items-center justify-between rounded border p-2 text-xs">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium">{r.child}</span>
                      <span className="text-muted-foreground">age {r.age}</span>
                      <span className="text-muted-foreground truncate">{r.authority}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <Badge variant="outline" className={cn("text-[10px]", badge.color)}>
                        {badge.label}
                      </Badge>
                      <span className="tabular-nums text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-0.5" />{r.days}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Recent decisions ───────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-blue-500" />
            Recent Decisions
          </p>
          {DEMO_RECENT_DECISIONS.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="truncate flex-1">{d.child} — {d.authority}</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                {d.decision === "accepted" ? (
                  <Badge variant="outline" className="text-[10px] border-green-200 text-green-700 bg-green-50">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Accepted
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] border-red-200 text-red-700 bg-red-50">
                    <XCircle className="h-2.5 w-2.5 mr-0.5" /> Declined
                  </Badge>
                )}
                <span className="tabular-nums text-muted-foreground">{d.days}d</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Referral Alerts
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

        {/* ── ARIA insights ───────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
            <Brain className="h-3 w-3" />
            ARIA Commissioning Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-blue-200 bg-blue-50 text-blue-800"
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
