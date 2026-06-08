"use client";

import { PageShell } from "@/components/layout/page-shell";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2, RefreshCw, TrendingUp, TrendingDown, Minus, Activity,
  ArrowUp, ArrowDown, AlertTriangle, AlertOctagon, CheckCircle2, Info, LineChart,
} from "lucide-react";
import { useHomeTrends } from "@/hooks/use-home-trends";
import type {
  HomeTrendsResult, TrendMetricResult, TrendDirection, HomeTrendInsight,
} from "@/lib/engines/home-trends-engine";

type Overall = HomeTrendsResult["overview"]["overall_direction"];

const OVERALL_META: Record<Overall, { label: string; tone: string; print: string; Icon: typeof TrendingUp }> = {
  improving: { label: "Improving", tone: "bg-green-50 text-green-800 ring-green-200", print: "cs-tone-green", Icon: TrendingUp },
  worsening: { label: "Needs attention", tone: "bg-red-50 text-red-800 ring-red-200", print: "cs-tone-red", Icon: TrendingDown },
  mixed: { label: "Mixed picture", tone: "bg-amber-50 text-amber-800 ring-amber-200", print: "cs-tone-amber", Icon: Activity },
  stable: { label: "Steady", tone: "bg-slate-50 text-slate-700 ring-slate-200", print: "cs-tone-slate", Icon: Minus },
  insufficient_data: { label: "Insufficient data", tone: "bg-slate-50 text-slate-700 ring-slate-200", print: "cs-tone-slate", Icon: Minus },
};

const DIR_META: Record<TrendDirection, { label: string; badge: string; rag: string; bar: string; text: string }> = {
  improving: { label: "Improving", badge: "bg-green-100 text-green-800 border-green-200", rag: "cs-rag-green", bar: "bg-green-500", text: "text-green-700" },
  worsening: { label: "Needs attention", badge: "bg-red-100 text-red-800 border-red-200", rag: "cs-rag-red", bar: "bg-red-500", text: "text-red-700" },
  stable: { label: "Steady", badge: "bg-slate-100 text-slate-600 border-slate-200", rag: "cs-rag-slate", bar: "bg-slate-400", text: "text-slate-600" },
  insufficient_data: { label: "No trend yet", badge: "bg-slate-100 text-slate-500 border-slate-200", rag: "cs-rag-slate", bar: "bg-slate-300", text: "text-slate-500" },
};

const INSIGHT_META: Record<HomeTrendInsight["severity"], { Icon: typeof Info; cls: string; rag: string }> = {
  critical: { Icon: AlertOctagon, cls: "text-red-600", rag: "cs-rag-red" },
  warning: { Icon: AlertTriangle, cls: "text-amber-600", rag: "cs-rag-amber" },
  positive: { Icon: CheckCircle2, cls: "text-green-600", rag: "cs-rag-green" },
  info: { Icon: Info, cls: "text-slate-500", rag: "cs-rag-slate" },
};

function Sparkbars({ values, barClass }: { values: number[]; barClass: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-t-sm", barClass)}
          style={{ height: `${Math.max(6, Math.round((v / max) * 100))}%`, opacity: v === 0 ? 0.18 : 1 }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

function MetricCard({ m }: { m: TrendMetricResult }) {
  const dir = DIR_META[m.direction];
  const ArrowIcon = m.change > 0 ? ArrowUp : m.change < 0 ? ArrowDown : Minus;
  return (
    <Card className="break-inside-avoid">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-sm">
          <span className="font-bold text-slate-900">{m.label}</span>
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", dir.badge, dir.rag)}>
            {dir.label}
          </span>
        </CardTitle>
        {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        <Sparkbars values={m.sparkline} barClass={dir.bar} />
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Last 4 wks <span className="font-semibold tabular-nums text-slate-800">{m.recent_4w}</span>
            <span className="mx-1 text-slate-300">vs</span>
            prior <span className="font-semibold tabular-nums text-slate-800">{m.prior_4w}</span>
          </span>
          {m.direction !== "insufficient_data" && (
            <span className={cn("flex items-center gap-0.5 font-bold tabular-nums", dir.text)}>
              <ArrowIcon className="h-3.5 w-3.5" />
              {Math.abs(m.pct_change)}%
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-slate-600">{m.headline}</p>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          {m.total} {m.unit} over {m.series.length} weeks
        </p>
      </CardContent>
    </Card>
  );
}

export default function HomeTrendsPage() {
  const { data, isLoading, isFetching, refetch } = useHomeTrends();
  const overview = data?.overview;
  const meta = overview ? OVERALL_META[overview.overall_direction] : null;

  return (
    <PageShell
      title="Home Trends"
      subtitle="Direction of travel — are the home's key safety & wellbeing signals improving or worsening over the last 8 weeks?"
      ariaContext={{ pageTitle: "Home Trends", sourceType: "general" }}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 print:hidden"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} /> Refresh
          </button>
          <PrintButton title="Home Trends — Direction of Travel" />
        </div>
      }
    >
      <div className="cs-print-color mx-auto max-w-5xl space-y-5">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && overview && meta && (
          <>
            {/* Direction-of-travel banner */}
            <Card className={cn("ring-1", meta.tone, meta.print)}>
              <CardContent className="flex items-start gap-4 py-5">
                <meta.Icon className="mt-0.5 h-8 w-8 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 opacity-70" />
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-70">Direction of Travel</span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold">{meta.label}</h2>
                  <p className="mt-0.5 text-sm opacity-90">{overview.headline}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-white/60 px-2.5 py-1 text-green-800">{overview.improving} improving</span>
                    <span className="rounded-full bg-white/60 px-2.5 py-1 text-red-800">{overview.worsening} worsening</span>
                    <span className="rounded-full bg-white/60 px-2.5 py-1 text-slate-700">{overview.stable} steady</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data!.metrics.map((m) => <MetricCard key={m.key} m={m} />)}
            </div>

            {/* Insights */}
            {data!.insights.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900">What this means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {data!.insights.map((ins, i) => {
                    const im = INSIGHT_META[ins.severity];
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <im.Icon className={cn("mt-0.5 h-4 w-4 shrink-0", im.cls, im.rag)} />
                        <p className="text-sm leading-relaxed text-slate-700">{ins.text}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            <p className="text-center text-[11px] text-slate-400">
              Trends bucket dated records into weekly windows. Direction compares the most recent 4 weeks with the prior 4
              weeks; a move counts only when it is material in both volume and percentage terms.
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
}
