"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeNotifiableEventsIntelligence } from "@/hooks/use-home-notifiable-events-intelligence";
import type { HomeNotifiableEventsResult, NotifiableEventsRating } from "@/lib/engines/home-notifiable-events-intelligence-engine";

const RATING_META: Record<NotifiableEventsRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function NotifiableEventsIntelligencePage() {
  const { data, isLoading, error } = useHomeNotifiableEventsIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Notifiable Events Intelligence" description="Analysing notifiable events compliance data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Notifiable Events Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load notifiable events data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.events_rating];
  const ep = d.events_profile;
  const eventTypeEntries = Object.entries(ep.event_types).sort(([, a], [, b]) => b - a);

  return (
    <PageShell
      title="Notifiable Events Intelligence"
      description="Notification compliance, pending events, follow-up rates, lesson-learned embedding, multi-agency notification and repeat-child patterns — evidencing that the home meets its statutory duty to notify and that every notifiable event produces learning, not just paperwork (CHR 2015 Reg 40; Schedule 5; Ofsted notification guidance)."
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
                  Events score: {d.events_score}/100 · {ep.total_events_90d} events (90d) · notification compliance {Math.round(ep.notification_compliance_rate)}% · {ep.pending_count} pending · lesson learned {Math.round(ep.lesson_learned_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.events_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(ep.notification_compliance_rate < 100 || ep.pending_count > 0 || ep.repeat_children.length > 0) && (
          <div className="flex flex-col gap-2">
            {ep.notification_compliance_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Notification compliance {Math.round(ep.notification_compliance_rate)}% — failing to notify Ofsted or the local authority of a notifiable event within 24 hours is a regulatory offence; it is not discretionary and cannot be remedied retrospectively
              </div>
            )}
            {ep.pending_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ep.pending_count} event{ep.pending_count > 1 ? "s" : ""} pending notification — pending events represent an unresolved statutory duty; each day a notification is outstanding increases the regulatory risk to the home
              </div>
            )}
            {ep.repeat_children.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {ep.repeat_children.length} child{ep.repeat_children.length > 1 ? "ren" : ""} involved in multiple events — repeat involvement in notifiable events is a significant pattern that requires a dedicated safeguarding strategy, not just repeated notifications
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total events (90d)", value: ep.total_events_90d, color: "text-blue-600" },
            { label: "Pending notifications", value: ep.pending_count, color: ep.pending_count > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Children involved", value: ep.children_involved.length, color: "text-foreground" },
            { label: "Repeat children", value: ep.repeat_children.length, color: ep.repeat_children.length > 0 ? "text-amber-600" : "text-foreground" },
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
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /> Compliance & Learning Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Notification compliance rate (24h)" value={ep.notification_compliance_rate} warn={100} />
              <RateBar label="Follow-up completion rate" value={ep.follow_up_rate} warn={90} />
              <RateBar label="Lesson learned embedding rate" value={ep.lesson_learned_rate} warn={80} />
              <RateBar label="Multi-agency notification rate" value={ep.multi_agency_rate} warn={95} />
            </CardContent>
          </Card>

          {eventTypeEntries.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /> Event Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {eventTypeEntries.map(([type, count]) => (
                    <div key={type} className="flex items-center gap-1.5 rounded border bg-muted/30 px-2.5 py-1.5">
                      <span className="text-xs font-medium capitalize">{type.replace(/_/g, " ")}</span>
                      <Badge variant="secondary" className="text-xs h-4 px-1.5">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 40 and Schedule 5 (notifiable events — the registered person must notify Ofsted, the placing authority and, where applicable, the local authority for the area where the home is located within 24 hours of specified events occurring; these include but are not limited to: death of a child, serious injury, missing from care, allegations against staff, serious incidents, unauthorised absence, and police involvement in a notifiable matter). Failure to notify is not merely a procedural failure — it deprives statutory bodies of their ability to exercise oversight and may constitute an obstruction of regulatory functions. Ofsted takes notification failures very seriously and may treat them as an indicator of a wider governance failure. The test is not whether the registered person believes the event is serious enough to notify — if it is listed in Schedule 5, it must be notified, regardless of the home's assessment of its severity.
        </p>
      </div>
    </PageShell>
  );
}
