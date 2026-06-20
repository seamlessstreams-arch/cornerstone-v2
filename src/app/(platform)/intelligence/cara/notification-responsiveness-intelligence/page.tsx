"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeNotificationResponsivenessIntelligence } from "@/hooks/use-home-notification-responsiveness-intelligence";
import type { NotificationResponsivenessResult, NotificationResponsivenessRating } from "@/lib/engines/home-notification-responsiveness-intelligence-engine";

const RATING_META: Record<NotificationResponsivenessRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function NotificationResponsivenessIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeNotificationResponsivenessIntelligence();
  const d = (raw as { data?: NotificationResponsivenessResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Notification Responsiveness" description="Analysing staff notification read and response data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Notification Responsiveness" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load notification responsiveness data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.responsiveness_rating];

  return (
    <PageShell
      title="Notification Responsiveness"
      description="Staff notification read rates, urgent notification response, average response hours, unread counts, oldest unread age and staff coverage — evidencing that safety-critical communications are being received and acted upon rather than accumulating unread in staff inboxes (CHR 2015 Reg 5; safe communications governance)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Bell className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Responsiveness score: {d.responsiveness_score}/100 · {d.total_notifications} notifications · read rate {Math.round(d.read_rate)}% · urgent read {Math.round(d.urgent_read_rate)}% · {d.urgent_unread_count} urgent unread · avg response {d.average_response_hours.toFixed(1)}h
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.responsiveness_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.urgent_unread_count > 0 || d.oldest_unread_hours > 48 || d.urgent_read_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.urgent_unread_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.urgent_unread_count} urgent unread notification{d.urgent_unread_count > 1 ? "s" : ""} — unread urgent notifications may carry information about immediate safety risks, escalations or regulatory requirements; they must be treated as unmanaged risks until read and acted upon
              </div>
            )}
            {d.oldest_unread_hours > 48 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Oldest unread notification is {Math.round(d.oldest_unread_hours)}h old — notifications more than 48 hours unread represent a breakdown in the communications chain; information that never reaches the right person cannot inform decision-making
              </div>
            )}
            {d.urgent_read_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Urgent notification read rate {Math.round(d.urgent_read_rate)}% — if staff are not reading urgent notifications, either the volume is overwhelming, the urgency flagging is overused, or staff are not checking their notifications; all three warrant management attention
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total notifications", value: d.total_notifications, color: "text-blue-600" },
            { label: "Unread notifications", value: d.unread_count, color: d.unread_count > 5 ? "text-amber-600" : "text-foreground" },
            { label: "Urgent unread", value: d.urgent_unread_count, color: d.urgent_unread_count > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Notification types", value: d.notification_type_diversity, color: "text-foreground" },
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
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /> Read Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Overall read rate" value={d.read_rate} warn={90} />
              <RateBar label="Urgent notification read rate" value={d.urgent_read_rate} warn={100} />
              <RateBar label="Staff coverage rate" value={d.staff_coverage_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className={`text-xl font-bold ${d.average_response_hours > 8 ? "text-amber-600" : d.average_response_hours > 24 ? "text-red-600" : "text-emerald-600"}`}>{d.average_response_hours.toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg response time</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className={`text-xl font-bold ${d.urgent_response_hours > 4 ? "text-red-600" : d.urgent_response_hours > 2 ? "text-amber-600" : "text-emerald-600"}`}>{d.urgent_response_hours.toFixed(1)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Urgent response time</p>
                </div>
                <div className={`rounded-lg border p-3 text-center col-span-2 ${d.oldest_unread_hours > 48 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-xl font-bold ${d.oldest_unread_hours > 48 ? "text-amber-600" : "text-foreground"}`}>{d.oldest_unread_hours.toFixed(0)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Oldest unread notification age</p>
                </div>
              </div>
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
          CHR 2015 Regulation 5 (welfare — the home's internal communications system is part of its operational infrastructure for keeping children safe; staff who do not read notifications cannot act on them). Safe communications governance — in residential childcare, notifications carry information about safeguarding concerns, medication changes, incident follow-ups and statutory obligations; unread notifications are not merely an administrative failure, they are a mechanism failure. In serious case reviews, the failure of information to reach the right person at the right time is consistently identified as a contributory factor in harm; notification responsiveness is therefore a measurable safety indicator. Homes with high unread rates or slow urgent-response times should audit whether their notification system is fit for purpose and whether staff have sufficient time and access to engage with it.
        </p>
      </div>
    </PageShell>
  );
}
