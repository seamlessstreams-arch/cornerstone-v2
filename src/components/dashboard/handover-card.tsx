"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — SHIFT HANDOVER INTELLIGENCE CARD
// Dashboard card for handover completion, quality metrics, safeguarding flags,
// carried-forward tasks, and ARIA continuity-of-care intelligence.
// CHR 2015 Reg 12, 13, 34 — care continuity, leadership, staffing records.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight, ChevronRight, AlertTriangle, CheckCircle2,
  Brain, ClipboardCheck, ShieldAlert, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMPLIANCE = {
  total_handovers: 42,
  completed_count: 39,
  completion_rate: 93,
  avg_children_covered: 5.2,
  with_safeguarding_flags: 3,
  with_incidents: 7,
  avg_tasks_carried_forward: 2.1,
};

const DEMO_QUALITY = {
  with_mood_notes_rate: 95,
  with_medication_notes_rate: 82,
  with_behaviour_notes_rate: 88,
  with_risk_changes_rate: 71,
  fully_detailed_rate: 62,
};

const DEMO_TYPE_BREAKDOWN = [
  { type: "shift_change", label: "Shift Change", count: 28 },
  { type: "sleep_in_waking", label: "Sleep-In → Waking", count: 8 },
  { type: "waking_day", label: "Waking Night → Day", count: 5 },
  { type: "emergency", label: "Emergency", count: 1 },
];

const DEMO_ALERTS: { type: string; severity: string; message: string }[] = [
  { type: "incomplete_handover", severity: "high", message: "Handover on 2026-05-12 (shift_change) has not been completed within 2 hours of creation." },
  { type: "safeguarding_flag", severity: "critical", message: "Handover on 2026-05-11 contains 2 safeguarding flag(s): LAC review concern, missing episode risk." },
  { type: "high_tasks_carried", severity: "medium", message: "Handover on 2026-05-10 has 6 tasks carried forward." },
];

const ARIA_INSIGHTS = [
  "3 incomplete handovers this month — 2 shift changes and 1 waking night. This correlates with shifts where only 2 staff were on rota. Consider whether staffing levels allow adequate handover time, per Reg 13 (leadership & management).",
  "Risk change notes are completed in only 71% of child updates. This is the weakest quality metric. Risk changes are critical for Ofsted evidence — update handover template to make risk change a mandatory field.",
  "93% handover completion rate this month (target: 100%). Average 5.2 children covered per handover against 6 placed. Mood notes (95%) and behaviour notes (88%) are strong. Medication notes (82%) need improvement — cross-reference with medication administration records.",
];

// ── Quality bar helper ───────────────────────────────────────────────────────

function QualityBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 90 ? "bg-green-400"
              : value >= 75 ? "bg-amber-400"
              : "bg-red-400",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={cn(
        "w-8 text-right tabular-nums font-medium",
        value >= 90 ? "text-green-600" : value >= 75 ? "text-amber-600" : "text-red-600",
      )}>
        {value}%
      </span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function HandoverCard() {
  const c = DEMO_COMPLIANCE;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-brand" />
            Shift Handovers
          </CardTitle>
          <Link href="/handovers" className="text-xs text-brand hover:underline flex items-center gap-1">
            Handovers <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2", c.completion_rate >= 95 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.completion_rate >= 95 ? "text-green-600" : "text-amber-600")}>
              {c.completion_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2">
            <p className="text-lg font-bold tabular-nums text-blue-600">
              {c.total_handovers}
            </p>
            <p className="text-[10px] text-muted-foreground">This Month</p>
          </div>
          <div className={cn("text-center rounded-lg p-2", c.with_safeguarding_flags === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", c.with_safeguarding_flags === 0 ? "text-green-600" : "text-red-600")}>
              {c.with_safeguarding_flags}
            </p>
            <p className="text-[10px] text-muted-foreground">Safeguarding</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2">
            <p className="text-lg font-bold tabular-nums text-purple-600">
              {c.avg_children_covered}
            </p>
            <p className="text-[10px] text-muted-foreground">Avg Children</p>
          </div>
        </div>

        {/* ── Type breakdown ──────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            Handover Types
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_TYPE_BREAKDOWN.map((t) => (
              <div key={t.type} className="flex items-center justify-between rounded border p-2 text-xs">
                <span className="truncate">{t.label}</span>
                <Badge variant="outline" className="text-[10px] tabular-nums ml-1">{t.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quality metrics ─────────────────────────────────────────── */}

        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">Note Quality</p>
          <QualityBar label="Mood notes" value={DEMO_QUALITY.with_mood_notes_rate} />
          <QualityBar label="Behaviour" value={DEMO_QUALITY.with_behaviour_notes_rate} />
          <QualityBar label="Medication" value={DEMO_QUALITY.with_medication_notes_rate} />
          <QualityBar label="Risk changes" value={DEMO_QUALITY.with_risk_changes_rate} />
          <div className="flex items-center justify-between text-xs mt-1 border-t pt-1.5">
            <span className="text-muted-foreground">Fully detailed handovers</span>
            <span className={cn(
              "font-bold tabular-nums",
              DEMO_QUALITY.fully_detailed_rate >= 80 ? "text-green-600"
                : DEMO_QUALITY.fully_detailed_rate >= 60 ? "text-amber-600"
                : "text-red-600",
            )}>
              {DEMO_QUALITY.fully_detailed_rate}%
            </span>
          </div>
        </div>

        {/* ── Key indicators ──────────────────────────────────────────── */}

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded border p-2.5 text-xs">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <p className="font-medium">{c.with_incidents} incidents</p>
              <p className="text-[10px] text-muted-foreground">recorded this month</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded border p-2.5 text-xs">
            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <p className="font-medium">{c.avg_tasks_carried_forward} avg tasks</p>
              <p className="text-[10px] text-muted-foreground">carried forward</p>
            </div>
          </div>
        </div>

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {DEMO_ALERTS.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Handover Alerts
            </p>
            {DEMO_ALERTS.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  alert.severity === "critical"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : alert.severity === "high"
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
            ARIA Handover Intelligence
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
