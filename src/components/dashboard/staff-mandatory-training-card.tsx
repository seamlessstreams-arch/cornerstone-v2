"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — STAFF MANDATORY TRAINING CARD
// Dashboard card powered by the Workforce Intelligence Engine.
// Tracks training compliance by category. CHR 2015 Reg 33.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, ChevronRight, Brain, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkforceIntelligence } from "@/hooks/use-workforce-intelligence";

// ── Styling ─────────────────────────────────────────────────────────────────

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning:  "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

// ── Component ───────────────────────────────────────────────────────────────

export function StaffMandatoryTrainingCard() {
  const { data, isLoading } = useWorkforceIntelligence();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand" />
            Mandatory Training
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

  const totalExpiring = intel.training.reduce((s, t) => s + t.expiring_soon, 0);
  const totalExpired = intel.training.reduce((s, t) => s + t.expired, 0);
  const avgCompliance = intel.training.length > 0
    ? Math.round(intel.training.reduce((s, t) => s + t.compliance_rate, 0) / intel.training.length)
    : 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-brand" />
            Mandatory Training
          </CardTitle>
          <Link href="/workforce" className="text-xs text-brand hover:underline flex items-center gap-1">
            Workforce <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Summary strip ────────────────────────────────────────────── */}

        <div className="grid grid-cols-4 gap-2">
          <div className={cn("text-center rounded-lg p-2.5", avgCompliance >= 95 ? "bg-green-50" : avgCompliance >= 80 ? "bg-amber-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", avgCompliance >= 95 ? "text-green-600" : avgCompliance >= 80 ? "text-amber-600" : "text-red-600")}>{avgCompliance}%</p>
            <p className="text-[10px] text-muted-foreground">Compliance</p>
          </div>
          <div className="text-center rounded-lg bg-blue-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-blue-600">{intel.training.length}</p>
            <p className="text-[10px] text-muted-foreground">Categories</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", totalExpiring === 0 ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", totalExpiring === 0 ? "text-green-600" : "text-amber-600")}>{totalExpiring}</p>
            <p className="text-[10px] text-muted-foreground">Expiring</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", totalExpired === 0 ? "bg-green-50" : "bg-red-50")}>
            <p className={cn("text-lg font-bold tabular-nums", totalExpired === 0 ? "text-green-600" : "text-red-600")}>{totalExpired}</p>
            <p className="text-[10px] text-muted-foreground">Expired</p>
          </div>
        </div>

        {/* ── Training categories ──────────────────────────────────────── */}

        {intel.training.length > 0 && (
          <div className="space-y-1.5">
            {intel.training.map((t) => (
              <div key={t.category} className="flex items-center gap-2 text-xs">
                <span className="w-28 truncate capitalize text-muted-foreground">{t.category.replace(/_/g, " ")}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", t.compliance_rate >= 95 ? "bg-green-400" : t.compliance_rate >= 80 ? "bg-amber-400" : "bg-red-400")}
                    style={{ width: `${t.compliance_rate}%` }}
                  />
                </div>
                <span className={cn("w-8 text-right tabular-nums font-medium", t.compliance_rate >= 95 ? "text-green-600" : t.compliance_rate >= 80 ? "text-amber-600" : "text-red-600")}>
                  {t.compliance_rate}%
                </span>
                {t.expired > 0 && <Badge className="text-[9px] bg-red-100 text-red-700">{t.expired}</Badge>}
              </div>
            ))}
          </div>
        )}

        {/* ── Cara Intelligence ───────────────────────────────────────── */}

        {intel.insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              Cara Training Intelligence
            </p>
            {intel.insights.slice(0, 2).map((insight, i) => (
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
