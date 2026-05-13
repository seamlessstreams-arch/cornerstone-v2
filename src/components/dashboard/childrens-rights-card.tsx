"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILDREN'S RIGHTS INTELLIGENCE CARD
// Dashboard card for rights monitoring, empowerment, and advocacy.
// CHR 2015 Reg 7/8/16. SCCIF: Overall Experiences.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale, ChevronRight, AlertTriangle, Brain,
  Shield, CheckCircle2, Users, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  children_with_profiles: 5,
  profile_coverage_rate: 100,
  knows_rights_rate: 80,
  knows_complaints_rate: 100,
  has_advocate_rate: 80,
  views_sought_rate: 100,
  fully_empowered_count: 3,
  not_empowered_count: 0,
  rights_fully_met: 10,
  rights_partially_met: 2,
  rights_not_met: 1,
};

const DEMO_CHILDREN = [
  { name: "Child A", knowsRights: true, advocate: true, empowerment: "fully_empowered", complaintsAware: true },
  { name: "Child B", knowsRights: true, advocate: true, empowerment: "mostly_empowered", complaintsAware: true },
  { name: "Child C", knowsRights: false, advocate: false, empowerment: "partially_empowered", complaintsAware: true },
  { name: "Child D", knowsRights: true, advocate: true, empowerment: "fully_empowered", complaintsAware: true },
  { name: "Child E", knowsRights: true, advocate: true, empowerment: "fully_empowered", complaintsAware: true },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium"; message: string }[] = [
  { type: "rights_not_known", severity: "high", message: "Child C does not fully understand their rights — schedule rights discussion with age-appropriate materials this week." },
  { type: "no_advocate", severity: "medium", message: "Child C does not have an independent advocate — refer to advocacy service." },
];

const ARIA_INSIGHTS = [
  "5/5 children have rights profiles (100% coverage). 80% understand their rights, 100% know how to complain, 80% have advocates, 100% have views regularly sought. 3 children assessed as fully empowered.",
  "Priority: Child C (youngest, age 9) needs age-appropriate rights materials. Language barrier identified as participation barrier — consider visual/pictorial resources. Advocacy referral has been made, awaiting allocation.",
  "Latest rights audit: 10/13 rights fully met, 2 partially met (right to privacy — bedroom locks being fitted, right to religion — halal meals now available but Friday prayers transport not yet arranged). 1 not met: right to identity — ensure life story work is progressed for all children.",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const EMPOWERMENT_BADGES: Record<string, { label: string; color: string }> = {
  fully_empowered: { label: "Empowered", color: "text-green-700 bg-green-50 border-green-200" },
  mostly_empowered: { label: "Mostly", color: "text-blue-700 bg-blue-50 border-blue-200" },
  partially_empowered: { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  not_empowered: { label: "Not Empowered", color: "text-red-700 bg-red-50 border-red-200" },
  not_assessed: { label: "Not Assessed", color: "text-gray-700 bg-gray-50 border-gray-200" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function ChildrensRightsCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="h-4 w-4 text-brand" />
            Children&apos;s Rights
          </CardTitle>
          <Link href="/childrens-rights" className="text-xs text-brand hover:underline flex items-center gap-1">
            Rights <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", m.knows_rights_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.knows_rights_rate >= 100 ? "text-green-600" : "text-amber-600")}>
              {m.knows_rights_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Know Rights</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.knows_complaints_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.knows_complaints_rate >= 100 ? "text-green-600" : "text-amber-600")}>
              {m.knows_complaints_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Complaints</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.has_advocate_rate >= 100 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.has_advocate_rate >= 100 ? "text-green-600" : "text-amber-600")}>
              {m.has_advocate_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Advocates</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2">
            <p className="text-lg font-bold tabular-nums text-green-600">{m.fully_empowered_count}</p>
            <p className="text-[10px] text-muted-foreground">Empowered</p>
          </div>
        </div>

        {/* ── Children's rights profiles ─────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Rights Profiles
          </p>
          <div className="space-y-1">
            {DEMO_CHILDREN.map((c) => {
              const badge = EMPOWERMENT_BADGES[c.empowerment] ?? EMPOWERMENT_BADGES.not_assessed;
              return (
                <div key={c.name} className="flex items-center justify-between rounded border p-2 text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-medium">{c.name}</span>
                    {c.knowsRights && <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />}
                    {c.advocate && <Shield className="h-3 w-3 text-blue-500 shrink-0" />}
                    {c.complaintsAware && <MessageCircle className="h-3 w-3 text-green-500 shrink-0" />}
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", badge.color)}>
                    {badge.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Rights audit summary ───────────────────────────────────── */}

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded border p-2">
            <p className="text-sm font-bold tabular-nums text-green-600">{m.rights_fully_met}</p>
            <p className="text-[10px] text-muted-foreground">Fully Met</p>
          </div>
          <div className={cn("text-center rounded border p-2", m.rights_partially_met > 0 && "border-amber-200 bg-amber-50")}>
            <p className={cn("text-sm font-bold tabular-nums", m.rights_partially_met > 0 ? "text-amber-600" : "text-green-600")}>
              {m.rights_partially_met}
            </p>
            <p className="text-[10px] text-muted-foreground">Partial</p>
          </div>
          <div className={cn("text-center rounded border p-2", m.rights_not_met > 0 && "border-red-200 bg-red-50")}>
            <p className={cn("text-sm font-bold tabular-nums", m.rights_not_met > 0 ? "text-red-600" : "text-green-600")}>
              {m.rights_not_met}
            </p>
            <p className="text-[10px] text-muted-foreground">Not Met</p>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Rights Alerts
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
            ARIA Rights Intelligence
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
