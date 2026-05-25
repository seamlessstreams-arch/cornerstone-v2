"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION CONSENT CARD
// Dashboard widget for medication consent compliance, adherence, witnessing,
// and per-child compliance profiles.
// Powered by the Medication Intelligence Engine — live data (Reg 23/12).
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pill, ChevronRight, AlertTriangle, Brain,
  Loader2, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMedicationIntelligence } from "@/hooks/use-medication-intelligence";

// ── Styling ─────────────────────────────────────────────────────────────────

const ALERT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-blue-200 bg-blue-50 text-blue-800",
};

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

const COMPLIANCE_STYLES: Record<string, { bg: string; text: string }> = {
  excellent: { bg: "bg-green-100", text: "text-green-700" },
  good: { bg: "bg-blue-100", text: "text-blue-700" },
  concerns: { bg: "bg-amber-100", text: "text-amber-700" },
  critical: { bg: "bg-red-100", text: "text-red-700" },
};

// ── Component ────────────────────────────────────────────────────────────────

export function MedicationConsentCard() {
  const { data, isLoading } = useMedicationIntelligence();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand" />
            Medication Consent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--cs-text-muted)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const o = intel.overview;
  const childrenOnMeds = intel.child_profiles.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Pill className="h-4 w-4 text-brand" />
            Medication Consent
          </CardTitle>
          <Link href="/medication" className="text-xs text-brand hover:underline flex items-center gap-1">
            Consent <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2.5", o.adherence_rate >= 95 ? "bg-green-50" : o.adherence_rate >= 80 ? "bg-amber-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.adherence_rate >= 95 ? "text-green-600" : o.adherence_rate >= 80 ? "text-amber-600" : "text-red-600")}>
              {o.adherence_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Adherence</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{o.total_active_medications}</p>
            <p className="text-[10px] text-muted-foreground">Active Meds</p>
          </div>
          <div className="text-center rounded-lg bg-purple-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-purple-600">{childrenOnMeds}</p>
            <p className="text-[10px] text-muted-foreground">Children</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", o.witnessing_rate >= 95 ? "bg-green-50" : o.witnessing_rate >= 80 ? "bg-amber-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.witnessing_rate >= 95 ? "text-green-600" : o.witnessing_rate >= 80 ? "text-amber-600" : "text-red-600")}>
              {o.witnessing_rate}%
            </p>
            <p className="text-[10px] text-muted-foreground">Witnessed</p>
          </div>
        </div>

        {/* ── Per-child compliance profiles ────────────────────────────── */}

        {intel.child_profiles.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Child Compliance
            </p>
            {intel.child_profiles.slice(0, 5).map((profile) => {
              const cStyle = COMPLIANCE_STYLES[profile.compliance_status];
              return (
                <div key={profile.child_id} className="rounded-lg border p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{profile.child_name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {profile.active_medications} med{profile.active_medications > 1 ? "s" : ""}
                      </span>
                    </div>
                    <Badge className={cn("text-[10px]", cStyle.bg, cStyle.text)}>
                      {profile.compliance_status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                    <span className="text-[10px]">{profile.adherence_rate}% adherence</span>
                    {profile.refusal_count_30d > 0 && (
                      <Badge className="text-[9px] bg-amber-100 text-amber-700">
                        {profile.refusal_count_30d} refused
                      </Badge>
                    )}
                    {profile.missed_count_30d > 0 && (
                      <Badge className="text-[9px] bg-red-100 text-red-700">
                        {profile.missed_count_30d} missed
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}

        {intel.alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Consent Alerts
            </p>
            {intel.alerts.slice(0, 3).map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  ALERT_STYLES[alert.severity] ?? ALERT_STYLES.medium,
                )}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA Insights ───────────────────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Consent Intelligence
            </p>
            {intel.insights.slice(0, 3).map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "rounded border p-2.5 text-xs leading-relaxed",
                  INSIGHT_STYLES[insight.severity] ?? INSIGHT_STYLES.positive,
                )}
              >
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
