"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — FAMILY ENGAGEMENT INTELLIGENCE CARD
// Dashboard card for family contact, relationships, and engagement tracking.
// CHR 2015 Reg 7/14/6. SCCIF: Experiences and Progress.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake, ChevronRight, AlertTriangle, Brain,
  Phone, TrendingUp, TrendingDown, Users,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  contacts_this_month: 18,
  contacts_this_quarter: 52,
  children_with_contact: 5,
  positive_contact_rate: 72.2,
  cancelled_dna_rate: 11.5,
  avg_contact_duration: 68,
  relationships_strong: 6,
  relationships_fragile: 2,
  relationships_no_contact: 1,
  engagement_improving: 3,
  engagement_declining: 1,
};

const DEMO_CHILDREN = [
  { name: "Child A", contacts: 5, quality: "strong", trend: "stable", lastContact: "2026-05-11" },
  { name: "Child B", contacts: 4, quality: "developing", trend: "improving", lastContact: "2026-05-09" },
  { name: "Child C", contacts: 3, quality: "fragile", trend: "declining", lastContact: "2026-04-28" },
  { name: "Child D", contacts: 4, quality: "strong", trend: "stable", lastContact: "2026-05-12" },
  { name: "Child E", contacts: 2, quality: "strained", trend: "stable", lastContact: "2026-05-05" },
];

const DEMO_RECENT = [
  { child: "Child D", member: "Mum", type: "Face to Face", outcome: "positive", date: "2026-05-12" },
  { child: "Child A", member: "Dad", type: "Video Call", outcome: "positive", date: "2026-05-11" },
  { child: "Child B", member: "Sibling", type: "Community Outing", outcome: "positive", date: "2026-05-09" },
  { child: "Child E", member: "Mum", type: "Supervised", outcome: "mixed", date: "2026-05-05" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "declining_engagement", severity: "medium", message: "Child C's relationship with birth mother is declining — 2 cancelled contacts this month. Discuss at next LAC review." },
  { type: "no_recent_contact", severity: "medium", message: "Child C has had no contact with birth father for 45 days — check if contact arrangement needs updating." },
];

const ARIA_INSIGHTS = [
  "18 family contacts this month across 5 children (100% had at least one contact). 72.2% rated positive. Average contact duration 68 minutes. 6 strong relationships, 2 fragile, 1 no-contact arrangement (court-ordered).",
  "Focus: Child C's contact with birth mother is declining — 2 of last 3 sessions cancelled by family. Key worker to call mum this week. Child E's supervised contact with mum was 'mixed' — child was unsettled afterwards. Review with therapist whether contact is supporting or undermining therapeutic progress.",
  "Positive: Child B's sibling contact programme is working well — relationship quality has improved from fragile to developing over 3 months. Child D's mum is now attending regularly and relationship is strong. Consider requesting unsupervised contact for Child D at next review.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const QUALITY_BADGES: Record<string, { label: string; color: string }> = {
  strong: { label: "Strong", color: "text-green-700 bg-green-50 border-green-200" },
  developing: { label: "Developing", color: "text-blue-700 bg-blue-50 border-blue-200" },
  fragile: { label: "Fragile", color: "text-amber-700 bg-amber-50 border-amber-200" },
  strained: { label: "Strained", color: "text-red-700 bg-red-50 border-red-200" },
  no_contact: { label: "No Contact", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

const OUTCOME_COLORS: Record<string, string> = {
  positive: "text-green-600",
  mixed: "text-amber-600",
  difficult: "text-orange-600",
  distressing: "text-red-600",
};

// ── Component ────────────────────────────────────────────────────────────────

export function FamilyEngagementCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-brand" />
            Family Engagement
          </CardTitle>
          <Link href="/family-engagement" className="text-xs text-brand hover:underline flex items-center gap-1">
            Family <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.contacts_this_month}</p>
            <p className="text-[10px] text-muted-foreground">This Month</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.positive_contact_rate >= 70 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.positive_contact_rate >= 70 ? "text-green-600" : "text-amber-600")}>
              {m.positive_contact_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Positive</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.relationships_strong}</p>
            <p className="text-[10px] text-muted-foreground">Strong</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.relationships_fragile === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.relationships_fragile === 0 ? "text-green-600" : "text-amber-600")}>
              {m.relationships_fragile}
            </p>
            <p className="text-[10px] text-muted-foreground">Fragile</p>
          </div>
        </div>

        {/* ── Children's family engagement ────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Family Relationships
          </p>
          <div className="space-y-1">
            {DEMO_CHILDREN.map((c) => {
              const badge = QUALITY_BADGES[c.quality] ?? QUALITY_BADGES.developing;
              return (
                <div key={c.name} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{c.contacts} contacts</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {c.trend === "improving" && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {c.trend === "declining" && <TrendingDown className="h-3 w-3 text-red-500" />}
                    <Badge variant="outline" className={cn("text-[10px]", badge.color)}>
                      {badge.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent contacts ────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Phone className="h-3 w-3 text-blue-500" />
            Recent Contacts
          </p>
          {DEMO_RECENT.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="truncate flex-1">{r.child} — {r.member} ({r.type})</span>
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                <span className={cn("font-semibold", OUTCOME_COLORS[r.outcome] ?? "text-gray-600")}>
                  {r.outcome}
                </span>
                <span className="text-muted-foreground">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Family Engagement Alerts
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
            ARIA Family Intelligence
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
