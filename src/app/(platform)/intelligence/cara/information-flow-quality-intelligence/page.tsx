"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeInformationFlowQualityIntelligence } from "@/hooks/use-home-information-flow-quality-intelligence";
import type { InformationFlowQualityResult, InformationFlowRating } from "@/lib/engines/home-information-flow-quality-intelligence-engine";

const RATING_META: Record<InformationFlowRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 50 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function InformationFlowQualityIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeInformationFlowQualityIntelligence();
  const d = (raw as { data?: InformationFlowQualityResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Information Flow Quality" description="Analysing information flow quality data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Information Flow Quality" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load information flow quality data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.flow_rating];

  return (
    <PageShell
      title="Information Flow Quality"
      description="Handover completion and content, daily log coverage and quality, significant-event escalation, notification read rates and staff engagement — evidencing that critical information reaches every team member who needs it, when they need it (CHR 2015 Reg 13, 36)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MessageSquare className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Information flow score: {d.flow_score}/100 · handover completion {Math.round(d.handover_completion_rate)}% · daily log coverage {Math.round(d.daily_log_coverage_rate)}% · urgent notification read {Math.round(d.urgent_notification_read_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.flow_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.handover_completion_rate < 90 || d.urgent_notification_read_rate < 90 || d.significant_event_handover_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.handover_completion_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Handover completion {Math.round(d.handover_completion_rate)}% — incomplete handovers create information gaps that can directly compromise child safety between shifts
              </div>
            )}
            {d.urgent_notification_read_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Urgent notification read rate {Math.round(d.urgent_notification_read_rate)}% — urgent alerts that are not acknowledged cannot be acted upon; unread notifications represent a safety risk
              </div>
            )}
            {d.significant_event_handover_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Significant event handover rate {Math.round(d.significant_event_handover_rate)}% — every significant event must be handed over explicitly; no incoming staff member should be unaware of a critical development
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Continuity score", value: `${d.information_continuity_score}/100`, color: d.information_continuity_score < 60 ? "text-red-600" : d.information_continuity_score >= 80 ? "text-emerald-600" : "text-amber-600" },
            { label: "Urgent notification read", value: `${Math.round(d.urgent_notification_read_rate)}%`, color: d.urgent_notification_read_rate < 90 ? "text-red-600" : "text-emerald-600" },
            { label: "Staff engagement rate", value: `${Math.round(d.staff_engagement_rate)}%`, color: d.staff_engagement_rate < 70 ? "text-amber-600" : "" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" /> Handover Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Handover completion rate" value={d.handover_completion_rate} warn={95} />
              <RateBar label="Handover content quality rate" value={d.handover_content_rate} warn={85} />
              <RateBar label="Significant event handover rate" value={d.significant_event_handover_rate} warn={95} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" /> Daily Logs & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Daily log coverage rate" value={d.daily_log_coverage_rate} warn={90} />
              <RateBar label="Daily log quality rate" value={d.daily_log_quality_rate} warn={80} />
              <RateBar label="Care event verification rate" value={d.care_event_verification_rate} warn={85} />
              <RateBar label="Notification read rate" value={d.notification_read_rate} warn={85} />
            </CardContent>
          </Card>
        </div>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const cls =
                ins.severity === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                ins.severity === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {ins.severity === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   ins.severity === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
                  {ins.text}
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2"><Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 13 (Leadership and management — the registered person must ensure there are effective systems for recording and communicating information about children). Regulation 36 (Notifications — specific information flows to parents, placing authorities and Ofsted are prescribed). SCCIF Leadership and management. Information failures are a recurring theme in serious case reviews. A child's risk escalates between shifts and the incoming staff member doesn't know. An urgent notification is sent and never read. A significant event is not recorded in the handover. This engine makes those gaps visible before they become crises.
        </p>
      </div>
    </PageShell>
  );
}
