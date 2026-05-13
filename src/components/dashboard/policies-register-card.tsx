"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — POLICIES & PROCEDURES INTELLIGENCE CARD
// Dashboard card for policy register, review compliance, staff acknowledgements,
// required policy coverage, and ARIA policy intelligence.
// CHR 2015 Reg 38 (policies and procedures), Reg 13 (leadership & management).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText, ChevronRight, AlertTriangle, Brain,
  CheckCircle, Clock, BookOpen, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_policies: 14,
  active_policies: 12,
  overdue_reviews: 2,
  upcoming_reviews_30d: 3,
  acknowledgement_rate: 87,
  missing_required: 1,
};

const DEMO_BY_CATEGORY = [
  { category: "Safeguarding", count: 2, overdue: 0 },
  { category: "Behaviour Management", count: 1, overdue: 0 },
  { category: "Health & Safety", count: 2, overdue: 1 },
  { category: "Medication", count: 1, overdue: 0 },
  { category: "Missing Children", count: 1, overdue: 0 },
  { category: "Restraint", count: 1, overdue: 0 },
  { category: "Complaints", count: 1, overdue: 1 },
  { category: "Whistleblowing", count: 1, overdue: 0 },
  { category: "Recruitment", count: 1, overdue: 0 },
  { category: "Data Protection", count: 1, overdue: 0 },
  { category: "Fire Safety", count: 1, overdue: 0 },
  { category: "Anti-Bullying", count: 1, overdue: 0 },
];

const DEMO_OVERDUE = [
  { name: "Health & Safety Policy", reference: "POL-003", days_overdue: 14, owner: "Darren Laville" },
  { name: "Complaints Procedure", reference: "POL-007", days_overdue: 7, owner: "Darren Laville" },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "missing_required", severity: "critical", message: "1 required policy missing: Intimate Care. CHR 2015 requires homes to have documented policies for all key operational areas." },
  { type: "overdue_review", severity: "high", message: "2 policies have overdue reviews (Health & Safety, Complaints). Reg 38 requires policies to be regularly reviewed and kept up to date." },
  { type: "acknowledgement_rate", severity: "medium", message: "Staff acknowledgement rate at 87%. 2 staff members have outstanding policy acknowledgements. Target 100%." },
];

const ARIA_INSIGHTS = [
  "1 required policy missing (Intimate Care) — this is a regulatory requirement under Reg 12 and Reg 38. Create and implement this policy urgently. Ofsted will check for this at inspection. Template available from the local authority.",
  "2 policy reviews overdue: Health & Safety (14 days) and Complaints (7 days). Both are owned by Darren Laville. Schedule reviews this week. 3 further reviews due within 30 days — plan ahead to avoid further backlog.",
  "Overall: 14 policies in register, 12 active. 87% staff acknowledgement rate (improving from 81% last quarter). All policies have document URLs linked. Fire safety and safeguarding policies reviewed within the last 3 months. Internet Safety policy added last month.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function PoliciesRegisterCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" />
            Policies & Procedures
          </CardTitle>
          <Link href="/policies" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.active_policies}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.overdue_reviews === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.overdue_reviews === 0 ? "text-green-600" : "text-red-600")}>
              {m.overdue_reviews}
            </p>
            <p className="text-[10px] text-muted-foreground">Reviews Due</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.acknowledgement_rate >= 90 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.acknowledgement_rate >= 90 ? "text-green-600" : "text-amber-600")}>
              {m.acknowledgement_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Acknowledged</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.missing_required === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.missing_required === 0 ? "text-green-600" : "text-red-600")}>
              {m.missing_required}
            </p>
            <p className="text-[10px] text-muted-foreground">Missing</p>
          </div>
        </div>

        {/* ── Coverage by category ────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            Policy Coverage
          </p>
          <div className="grid grid-cols-2 gap-1">
            {DEMO_BY_CATEGORY.map((c) => (
              <div key={c.category} className="flex items-center justify-between rounded border p-1.5 text-xs">
                <span className="truncate flex-1 text-[11px]">{c.category}</span>
                <div className="flex items-center gap-1 ml-1">
                  {c.overdue > 0 ? (
                    <Badge className="text-[9px] bg-red-100 text-red-700 px-1">{c.overdue} due</Badge>
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Overdue reviews ─────────────────────────────────────────── */}

        {DEMO_OVERDUE.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Overdue Reviews
            </p>
            {DEMO_OVERDUE.map((p) => (
              <div key={p.reference} className="rounded border border-red-200 bg-red-50 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-red-800">{p.name}</span>
                  <Badge className="text-[10px] bg-red-100 text-red-700">{p.days_overdue}d overdue</Badge>
                </div>
                <div className="flex items-center justify-between text-red-700">
                  <span>{p.reference}</span>
                  <span>Owner: {p.owner}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Staff acknowledgement ──────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-500" />
            Staff Acknowledgement
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall acknowledgement rate</span>
              <span className={cn("font-bold tabular-nums", m.acknowledgement_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {m.acknowledgement_rate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", m.acknowledgement_rate >= 90 ? "bg-green-500" : "bg-amber-500")}
                  style={{ width: `${m.acknowledgement_rate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Policy Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "critical" ? "border-red-300 bg-red-50 text-red-800"
                    : alert.severity === "high" ? "border-red-200 bg-red-50 text-red-800"
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
            ARIA Policy Intelligence
          </p>
          {ARIA_INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className={cn(
                "rounded border p-2.5 text-xs leading-relaxed",
                i === 0 ? "border-red-200 bg-red-50 text-red-800"
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
