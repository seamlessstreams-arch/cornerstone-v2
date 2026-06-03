"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DUPLICATE DETECTION CARD
// The "never duplicate" guardrail: likely duplicate events (same type, same child,
// within 48h, near-identical wording) surfaced so staff link to the original
// instead of re-recording it. Powered by the Duplicate Detection Engine.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyCheck, ChevronRight, Loader2, Brain, Link2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDuplicateDetection } from "@/hooks/use-duplicate-detection";

const INSIGHT_STYLES: Record<string, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  positive: "border-green-200 bg-green-50 text-green-800",
};

export function DuplicateDetectionCard() {
  const { data, isLoading } = useDuplicateDetection();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CopyCheck className="h-4 w-4 text-brand" />
            Duplicate Detection
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
  const insights = intel.insights ?? [];
  const pairs = (intel.duplicates ?? []).slice(0, 4);
  const clean = o.suspected_duplicates === 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CopyCheck className="h-4 w-4 text-brand" />
            Duplicate Detection
          </CardTitle>
          <Link href="/duplicate-detection" className="text-xs text-brand hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── KPI grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <p className="text-lg font-bold tabular-nums">{o.total_events}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Events</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", clean ? "bg-green-50" : "bg-amber-50")}>
            <p className={cn("text-lg font-bold tabular-nums", clean ? "text-green-600" : "text-amber-600")}>{o.suspected_duplicates}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Suspected</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", o.clusters > 0 ? "bg-red-50" : "bg-gray-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.clusters > 0 ? "text-red-600" : "text-gray-500")}>{o.clusters}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Clusters</p>
          </div>
        </div>

        {/* ── Suspected pairs ───────────────────────────────────────────── */}
        {pairs.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[var(--cs-text-muted)] flex items-center gap-1">
              <Layers className="h-3 w-3" /> Suspected duplicate pairs
            </p>
            {pairs.map((d, i) => (
              <div key={i} className="rounded-lg border p-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Badge className="text-[9px] bg-[var(--cs-bg)] text-[var(--cs-text-secondary)] border">{d.event_type.replace(/_/g, " ")}</Badge>
                    <span className="truncate text-[var(--cs-text-secondary)]">{d.child_name}</span>
                  </div>
                  <Badge className="text-[9px] shrink-0 bg-amber-100 text-amber-700 border-amber-200">{Math.round(d.similarity * 100)}% match</Badge>
                </div>
                <p className="text-[11px] text-[var(--cs-text-muted)] flex items-start gap-1">
                  <Link2 className="h-3 w-3 mt-0.5 shrink-0 text-brand" />
                  {d.suggested_action}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-2.5 text-xs text-green-700">
            No likely duplicates — capture-once is holding across the record.
          </div>
        )}

        {/* ── ARIA insights ─────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Duplicate Intelligence
            </p>
            {insights.slice(0, 2).map((insight, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", INSIGHT_STYLES[insight.severity] ?? INSIGHT_STYLES.positive)}>
                {insight.text}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
