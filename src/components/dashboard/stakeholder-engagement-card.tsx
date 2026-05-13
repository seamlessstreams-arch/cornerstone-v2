"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STAKEHOLDER ENGAGEMENT INTELLIGENCE CARD
// Dashboard card for multi-agency relationships, professional contacts,
// satisfaction, and ARIA stakeholder intelligence.
// CHR 2015 Reg 45 (independent person), Reg 44 (visiting),
// Reg 36 (notifications), Reg 14 (multi-agency working).
// SCCIF: Well-Led, Helped & Protected.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Handshake, ChevronRight, AlertTriangle, Brain,
  Users, Star, Phone, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  contacts_this_month: 28,
  unique_stakeholders: 12,
  home_initiated_rate: 64,
  avg_satisfaction: 4.3,
  follow_up_completion: 92,
  overdue_follow_ups: 1,
};

const DEMO_BY_TYPE = [
  { type: "Social Workers", count: 10 },
  { type: "Schools", count: 6 },
  { type: "Health Professionals", count: 4 },
  { type: "Parents/Carers", count: 4 },
  { type: "IROs", count: 2 },
  { type: "CAMHS", count: 2 },
];

const DEMO_RECENT = [
  { stakeholder: "Jane Smith (SW)", date: "2026-05-12", method: "phone", purpose: "Child A review update" },
  { stakeholder: "Oakfield Academy", date: "2026-05-11", method: "email", purpose: "PEP meeting confirmation" },
  { stakeholder: "Dr. Patel", date: "2026-05-10", method: "meeting", purpose: "Child B health review" },
];

const DEMO_RELATIONSHIPS = [
  { quality: "Excellent", count: 4 },
  { quality: "Good", count: 6 },
  { quality: "Adequate", count: 1 },
  { quality: "Strained", count: 1 },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "follow_up", severity: "medium", message: "Follow-up with IRO for Child D is 5 days overdue — was due after LAC review on 8 May." },
];

const ARIA_INSIGHTS = [
  "28 stakeholder contacts this month across 12 professionals. 64% initiated by the home (proactive). Top contacts: social workers (10), schools (6), health professionals (4). Follow-up completion rate: 92% — 1 overdue follow-up with IRO.",
  "Stakeholder satisfaction: 4.3/5 average. 4 excellent relationships (social workers, schools), 6 good. 1 strained relationship with placing authority for Child C — communication frequency has dropped. Recommend proactive outreach.",
  "Multi-agency working is strong. All LAC reviews attended, all PEP meetings arranged, health referrals actioned within target timescales. Key strength: responsive communication — average callback time under 2 hours. Area for development: increase IRO contact frequency between formal reviews.",
];

const methodIcon: Record<string, string> = {
  phone: "📞",
  email: "✉️",
  meeting: "🤝",
  video_call: "📹",
  visit: "🏠",
};

const qualityColor: Record<string, string> = {
  Excellent: "bg-green-100 text-green-700",
  Good: "bg-blue-100 text-blue-700",
  Adequate: "bg-amber-100 text-amber-700",
  Strained: "bg-red-100 text-red-700",
  Poor: "bg-red-100 text-red-700",
};

// ── Component ────────────────────────────────────────────────────────────────

export function StakeholderEngagementCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Handshake className="h-4 w-4 text-brand" />
            Stakeholder Engagement
          </CardTitle>
          <Link href="/stakeholder-engagement" className="text-xs text-brand hover:underline flex items-center gap-1">
            Contacts <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.contacts_this_month}</p>
            <p className="text-[10px] text-muted-foreground">Contacts (M)</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.unique_stakeholders}</p>
            <p className="text-[10px] text-muted-foreground">Stakeholders</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.avg_satisfaction >= 4.0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.avg_satisfaction >= 4.0 ? "text-green-600" : "text-amber-600")}>
              {m.avg_satisfaction}
            </p>
            <p className="text-[10px] text-muted-foreground">Satisfaction</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.follow_up_completion >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.follow_up_completion >= 90 ? "text-green-600" : "text-amber-600")}>
              {m.follow_up_completion}%
            </p>
            <p className="text-[10px] text-muted-foreground">Follow-ups</p>
          </div>
        </div>

        {/* ── By stakeholder type ─────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-500" />
            Contacts by Type
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_BY_TYPE.map((t) => (
              <div key={t.type} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate flex-1">{t.type}</span>
                <span className="font-bold tabular-nums text-blue-600 ml-1">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent contacts ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            Recent Contacts
          </p>
          {DEMO_RECENT.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded border p-2 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span>{methodIcon[c.method] ?? "📋"}</span>
                <span className="font-medium truncate">{c.stakeholder}</span>
              </div>
              <span className="text-muted-foreground text-[10px] shrink-0 ml-1">
                {new Date(c.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
          ))}
        </div>

        {/* ── Relationships ───────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-1.5">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500" />
            Relationship Quality
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {DEMO_RELATIONSHIPS.map((r) => (
              <div key={r.quality} className="text-center">
                <Badge className={cn("text-[10px] w-full justify-center", qualityColor[r.quality])}>
                  {r.count}
                </Badge>
                <p className="text-[9px] text-muted-foreground mt-0.5">{r.quality}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Engagement Alerts
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
            ARIA Stakeholder Intelligence
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
