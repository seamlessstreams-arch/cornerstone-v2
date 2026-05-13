"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — WHISTLEBLOWING INTELLIGENCE CARD
// Dashboard card for whistleblowing disclosures, investigation tracking,
// policy compliance, and ARIA whistleblowing intelligence.
// CHR 2015 Reg 41 (whistleblowing), Public Interest Disclosure Act 1998.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone, ChevronRight, AlertTriangle, Brain,
  Shield, Eye, Clock, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_METRICS = {
  total_reports: 3,
  open_reports: 1,
  avg_resolution_days: 18,
  external_referrals: 1,
  detriment_reported: 0,
  policy_compliance_rate: 83,
  staff_training_rate: 90,
};

const DEMO_BY_CATEGORY = [
  { category: "Safeguarding Concern", count: 1, open: 0 },
  { category: "Staff Misconduct", count: 1, open: 1 },
  { category: "Regulatory Breach", count: 1, open: 0 },
];

const DEMO_OPEN_CASES: { category: string; risk_level: string; status: string; days_open: number; investigating_officer: string }[] = [
  {
    category: "Staff Misconduct",
    risk_level: "high",
    status: "under_investigation",
    days_open: 12,
    investigating_officer: "J. Peters",
  },
];

const DEMO_ALERTS: { type: string; severity: "critical" | "high" | "medium" | "low"; message: string }[] = [
  { type: "investigation_duration", severity: "medium", message: "1 open investigation has been ongoing for 12 days. Monitor progress and ensure timely resolution." },
  { type: "policy_compliance", severity: "medium", message: "Policy compliance at 83%. Not all staff have confirmed awareness of whistleblowing procedures. Target 100%." },
];

const ARIA_INSIGHTS = [
  "1 active whistleblowing investigation (staff misconduct, high risk). Investigation commenced 12 days ago by J. Peters. No external referral made yet — assess whether Ofsted or LADO notification is required. Ensure the whistleblower is protected from detriment per PIDA 1998.",
  "Whistleblowing policy review up to date. 90% of staff trained on whistleblowing procedures — 1 staff member still to complete. External contact numbers (Ofsted, LADO, police) displayed in all communal areas. Children have been informed of how to raise concerns.",
  "Overall: 3 disclosures in the last 12 months. Average resolution time 18 days. 1 external referral made (to LADO). No detriment reported by any whistleblower. All resolved cases have documented outcomes. Policy compliance improving — was 75% at last review.",
];

// ── Component ────────────────────────────────────────────────────────────────

export function WhistleblowingCard() {
  const m = DEMO_METRICS;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-brand" />
            Whistleblowing
          </CardTitle>
          <Link href="/whistleblowing" className="text-xs text-brand hover:underline flex items-center gap-1">
            Register <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.total_reports}</p>
            <p className="text-[10px] text-muted-foreground">Reports (12m)</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.open_reports === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.open_reports === 0 ? "text-green-600" : "text-amber-600")}>
              {m.open_reports}
            </p>
            <p className="text-[10px] text-muted-foreground">Open</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">{m.avg_resolution_days}d</p>
            <p className="text-[10px] text-muted-foreground">Avg Resolution</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", m.detriment_reported === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", m.detriment_reported === 0 ? "text-green-600" : "text-red-600")}>
              {m.detriment_reported}
            </p>
            <p className="text-[10px] text-muted-foreground">Detriment</p>
          </div>
        </div>

        {/* ── Category breakdown ──────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Disclosures by Category
          </p>
          {DEMO_BY_CATEGORY.map((c) => (
            <div key={c.category} className="flex items-center justify-between rounded border p-2 text-xs">
              <span className="truncate flex-1">{c.category}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <Badge variant="outline" className="text-[10px] tabular-nums">{c.count}</Badge>
                {c.open > 0 && (
                  <Badge className="text-[10px] bg-amber-100 text-amber-700">{c.open} open</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Active investigations ───────────────────────────────────── */}

        {DEMO_OPEN_CASES.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Active Investigations
            </p>
            {DEMO_OPEN_CASES.map((c, i) => (
              <div key={i} className="rounded border border-amber-200 bg-amber-50 p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-800">{c.category}</span>
                  <Badge className={cn(
                    "text-[10px]",
                    c.risk_level === "critical" || c.risk_level === "high"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700",
                  )}>
                    {c.risk_level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-amber-700">
                  <span>Investigating: {c.investigating_officer}</span>
                  <span className="font-medium">{c.days_open} days</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Compliance ─────────────────────────────────────────────── */}

        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1">
            <Shield className="h-3 w-3 text-blue-500" />
            Policy Compliance
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Staff trained
              </span>
              <span className={cn("font-bold tabular-nums", m.staff_training_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {m.staff_training_rate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", m.staff_training_rate >= 90 ? "bg-green-500" : "bg-amber-500")}
                  style={{ width: `${m.staff_training_rate}%` }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Policy compliance</span>
              <span className={cn("font-bold tabular-nums", m.policy_compliance_rate >= 90 ? "text-green-600" : "text-amber-600")}>
                {m.policy_compliance_rate}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", m.policy_compliance_rate >= 90 ? "bg-green-500" : "bg-amber-500")}
                  style={{ width: `${m.policy_compliance_rate}%` }}
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
              Whistleblowing Alerts
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
            ARIA Whistleblowing Intelligence
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
