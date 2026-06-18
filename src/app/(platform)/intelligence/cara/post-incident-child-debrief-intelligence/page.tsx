"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePostIncidentChildDebriefIntelligence } from "@/hooks/use-home-post-incident-child-debrief-intelligence";
import type { PostIncidentDebriefResult, PostIncidentDebriefRating } from "@/lib/engines/home-post-incident-child-debrief-intelligence-engine";

const RATING_META: Record<PostIncidentDebriefRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 75 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 40 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PostIncidentChildDebriefIntelligencePage() {
  const { data: d, isLoading, error } = useHomePostIncidentChildDebriefIntelligence();

  if (isLoading) {
    return (
      <PageShell title="Post-Incident Child Debrief" description="Analysing post-incident debrief rates, timeliness, child readiness, voice capture, restorative actions, and follow-up data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Post-Incident Child Debrief" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load post-incident child debrief data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.debrief_rating];

  return (
    <PageShell
      title="Post-Incident Child Debrief"
      description="Post-incident debrief rates, timeliness, child-readiness checking before debrief, depth of voice capture, restorative action rates, and follow-up completion — evidencing the home's commitment to hearing the child's experience of significant incidents rather than allowing those incidents to remain unprocessed and unaddressed (CHR 2015 Reg 35; DDP rupture-repair; Working Together; UN CRC Article 12)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MessageCircle className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Debrief score: {d.debrief_score}/100 · {d.total_debriefs} debriefs · debriefed {Math.round(d.children_debriefed_rate)}% · timely {Math.round(d.timeliness_rate)}% · voice depth {Math.round(d.voice_depth_rate)}% · restorative actions {Math.round(d.restorative_action_rate)}% · follow-up {Math.round(d.follow_up_rate)}% · method diversity {d.method_diversity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.debrief_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.children_debriefed_rate < 80 || d.voice_depth_rate < 50 || d.restorative_action_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.children_debriefed_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Children debriefed rate {Math.round(d.children_debriefed_rate)}% — an incident that is not followed by a debrief from the child's perspective has not been properly resolved; children who experience significant incidents without any opportunity to share their experience are left to process those events alone; this is both a safeguarding concern and a relational failure
              </div>
            )}
            {d.voice_depth_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Voice depth rate {Math.round(d.voice_depth_rate)}% — a debrief that records only basic factual information rather than the child's emotional experience, their understanding of what happened, and their wishes going forward is a missed opportunity; depth of voice capture is a measure of whether the child was truly heard
              </div>
            )}
            {d.restorative_action_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Restorative action rate {Math.round(d.restorative_action_rate)}% — a debrief without a restorative action is a conversation rather than a commitment; the rupture-repair cycle is only complete when the child can see that what they shared has led to something changing; restorative actions are the evidence that the home heard the child and responded
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total debriefs", value: d.total_debriefs, color: "text-blue-600" },
            { label: "Method diversity", value: d.method_diversity, color: "text-foreground" },
            { label: "Child readiness rate", value: `${Math.round(d.child_readiness_rate)}%`, color: d.child_readiness_rate >= 90 ? "text-emerald-600" : d.child_readiness_rate >= 70 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4 text-muted-foreground" /> Debrief Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Children debriefed rate" value={d.children_debriefed_rate} warn={85} />
            <RateBar label="Timeliness rate" value={d.timeliness_rate} warn={80} />
            <RateBar label="Child readiness checked rate" value={d.child_readiness_rate} warn={90} />
            <RateBar label="Voice depth rate" value={d.voice_depth_rate} warn={70} />
            <RateBar label="Restorative action rate" value={d.restorative_action_rate} warn={70} />
            <RateBar label="Follow-up completion rate" value={d.follow_up_rate} warn={75} />
          </CardContent>
        </Card>

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
          CHR 2015 Regulation 35 — the registered person must have a behaviour management policy; the post-incident debrief is the mechanism through which that policy is applied to the individual child's experience rather than to the home's administrative record. Working Together to Safeguard Children 2023 — children must be seen, heard, and their views given weight in every safeguarding process; incidents are safeguarding events and the debrief is the primary mechanism for hearing the child's perspective on what happened. DDP (Dyadic Developmental Psychotherapy, Hughes) — the rupture-repair cycle is central to therapeutic practice; the debrief is how the repair is made explicit and documented; a home with high debrief rates and documented restorative actions can show inspectors a concrete, measurable rupture-repair culture. Child-readiness checking before a debrief is not procedural caution but therapeutic competence: asking a child to debrief before they are emotionally regulated or willing is likely to re-traumatise rather than repair. Method diversity — using conversation, drawing, sand-tray, written reflection, and other non-verbal approaches — ensures that the debrief process is accessible to all children regardless of their communication style, developmental level, or trauma history.
        </p>
      </div>
    </PageShell>
  );
}
