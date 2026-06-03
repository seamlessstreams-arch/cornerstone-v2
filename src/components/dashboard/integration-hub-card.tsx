"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — INTEGRATION HUB CARD
// Adapter framework status: typed adapters (rota, payroll, HR/training, calendar,
// notifications, document storage, external forms, LA reporting) each with secure
// credentials, retry handling, idempotency keys, sync status and a manual override.
// Powered by the Integration Hub Engine. NO real external calls — scaffold only.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plug, ChevronRight, AlertTriangle, Brain, Loader2,
  CheckCircle2, XCircle, CircleDashed, RefreshCw, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntegrationHub } from "@/hooks/use-integration-hub";

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
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  connected: { bg: "bg-green-100", text: "text-green-700" },
  syncing: { bg: "bg-blue-100", text: "text-blue-700" },
  error: { bg: "bg-red-100", text: "text-red-700" },
  disconnected: { bg: "bg-amber-100", text: "text-amber-700" },
  not_configured: { bg: "bg-gray-100", text: "text-gray-600" },
};
const STATUS_LABEL: Record<string, string> = {
  connected: "Connected",
  syncing: "Syncing",
  error: "Error",
  disconnected: "Disconnected",
  not_configured: "Not set up",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  connected: <CheckCircle2 className="h-3 w-3 text-green-500" />,
  syncing: <RefreshCw className="h-3 w-3 text-blue-500" />,
  error: <XCircle className="h-3 w-3 text-red-500" />,
  disconnected: <AlertTriangle className="h-3 w-3 text-amber-500" />,
  not_configured: <CircleDashed className="h-3 w-3 text-gray-400" />,
};

export function IntegrationHubCard() {
  const { data, isLoading } = useIntegrationHub();
  const intel = data?.data;

  if (isLoading || !intel) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plug className="h-4 w-4 text-brand" />
            Integration Hub
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
  const adapters = intel.adapters ?? [];
  const alerts = intel.alerts ?? [];
  const insights = intel.insights ?? [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plug className="h-4 w-4 text-brand" />
            Integration Hub
          </CardTitle>
          <Link href="/integration-hub" className="text-xs text-brand hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── KPI strip ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center rounded-lg bg-gray-50 p-2.5">
            <p className="text-lg font-bold tabular-nums">{o.total_adapters}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Adapters</p>
          </div>
          <div className="text-center rounded-lg bg-green-50 p-2.5">
            <p className="text-lg font-bold tabular-nums text-green-600">{o.connected}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Connected</p>
          </div>
          <div className={cn("text-center rounded-lg p-2.5", o.errors > 0 ? "bg-red-50" : "bg-gray-50")}>
            <p className={cn("text-lg font-bold tabular-nums", o.errors > 0 ? "text-red-600" : "text-gray-500")}>{o.errors}</p>
            <p className="text-[10px] text-[var(--cs-text-muted)]">Errors</p>
          </div>
        </div>

        {/* ── Framework guarantee strip ────────────────────────────────── */}
        <div className="flex items-center gap-2 rounded-lg border p-2.5 text-xs">
          <Lock className="h-3.5 w-3.5 text-brand shrink-0" />
          <span className="text-[var(--cs-text-muted)]">Secure credentials, retries, idempotency &amp; audit on every adapter</span>
          <Badge className="text-[9px] bg-gray-100 text-gray-600 ml-auto shrink-0">{o.not_configured} to set up</Badge>
        </div>

        {/* ── Adapter list with status chips ───────────────────────────── */}
        {adapters.length > 0 && (
          <div className="space-y-1.5">
            {adapters.slice(0, 5).map((a) => {
              const st = STATUS_STYLES[a.status] ?? STATUS_STYLES.not_configured;
              return (
                <div key={a.id} className="rounded-lg border p-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {STATUS_ICON[a.status]}
                      <span className="font-medium truncate">{a.kind_label}</span>
                      {a.is_key_adapter && (
                        <Badge className="text-[9px] bg-brand/10 text-brand shrink-0">key</Badge>
                      )}
                    </div>
                    <Badge className={cn("text-[10px] shrink-0", st.bg, st.text)}>
                      {STATUS_LABEL[a.status] ?? a.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--cs-text-muted)] truncate">
                    {a.name} · {a.sync_status}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Alerts ──────────────────────────────────────────────────── */}
        {alerts.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[var(--cs-text-muted)] flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Integration Alerts
            </p>
            {alerts.slice(0, 3).map((alert, i) => (
              <div key={i} className={cn("rounded border p-2.5 text-xs leading-relaxed", ALERT_STYLES[alert.severity] ?? ALERT_STYLES.medium)}>
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* ── ARIA insights ────────────────────────────────────────────── */}
        {insights.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold flex items-center gap-1 text-purple-700">
              <Brain className="h-3 w-3" />
              ARIA Integration Intelligence
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
