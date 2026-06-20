"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffDebriefEmotionalSupportIntelligence } from "@/hooks/use-home-staff-debrief-emotional-support-intelligence";
import type { StaffDebriefResult, StaffDebriefRating } from "@/lib/engines/home-staff-debrief-emotional-support-intelligence-engine";

const RATING_META: Record<StaffDebriefRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffDebriefEmotionalSupportIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffDebriefEmotionalSupportIntelligence();
  const d: StaffDebriefResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Debrief & Emotional Support Intelligence" description="Analysing post-incident debrief completion, wellbeing checks, follow-up compliance, and emotional support quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Debrief & Emotional Support Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff debrief & emotional support data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.debrief_rating];

  return (
    <PageShell
      title="Staff Debrief & Emotional Support Intelligence"
      description="Post-incident debrief completion rates, wellbeing check coverage, follow-up compliance, high-impact event support, and learning integration — evidencing that the home takes staff welfare seriously as both an ethical obligation and a retention and practice quality imperative (CHR 2015 Reg 33; Health and Safety at Work Act 1974 s.2; NHS Staff Survey wellbeing frameworks; Social Care Institute for Excellence staff wellbeing guidance; Ofsted SCCIF 'Care for carers')."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Heart className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Debrief score: {d.debrief_score}/100 · {d.total_debriefs} debriefs · completion {Math.round(d.completion_rate)}% · wellbeing checks {Math.round(d.wellbeing_check_rate)}% · follow-up {Math.round(d.follow_up_completion_rate)}% · high-impact: {d.high_impact_count}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.debrief_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.completion_rate < 80 || d.wellbeing_check_rate < 70 || d.high_impact_count > 0) && (
          <div className="flex flex-col gap-2">
            {d.completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Debrief completion rate {Math.round(d.completion_rate)}% — staff who are not debriefed after significant incidents carry unprocessed emotional material into their next shift; the cumulative effect of repeated exposure without debrief is a primary driver of compassion fatigue, vicarious trauma, and burnout in residential care; debriefing is not optional welfare provision — it is a core element of the safe-staffing framework
              </div>
            )}
            {d.wellbeing_check_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Wellbeing check coverage {Math.round(d.wellbeing_check_rate)}% — regular wellbeing checks allow managers to identify stress, fatigue, or distress before they reach crisis point; staff who are not regularly asked about their wellbeing are less likely to disclose difficulties; the wellbeing check rate is the early-warning indicator for workforce mental health
              </div>
            )}
            {d.high_impact_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.high_impact_count} high-impact event{d.high_impact_count > 1 ? "s" : ""} recorded — high-impact events (serious injuries, restraints, missing from care, allegations) carry the highest risk of staff trauma; every member of staff involved in a high-impact event requires a structured debrief, not just a check-in conversation; these are the events most likely to result in psychological injury if not properly addressed
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total debriefs", value: d.total_debriefs, color: "text-blue-600" },
            { label: "High-impact events", value: d.high_impact_count, color: d.high_impact_count === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Follow-up completion", value: `${Math.round(d.follow_up_completion_rate)}%`, color: d.follow_up_completion_rate >= 80 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground" /> Staff Debrief & Wellbeing Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Debrief completion rate" value={d.completion_rate} warn={85} />
            <RateBar label="Follow-up completion rate" value={d.follow_up_completion_rate} warn={80} />
            <RateBar label="Wellbeing check coverage rate" value={d.wellbeing_check_rate} warn={80} />
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
          Staff who work in residential care for children are regularly exposed to distressing events — physical assaults, self-harm, disclosures of abuse, missing from care incidents, restraints, and the cumulative weight of children's trauma histories. The psychological impact of this work is not a personal weakness; it is an occupational hazard with well-documented pathways from repeated exposure without adequate support to compassion fatigue, vicarious trauma, secondary traumatic stress disorder, and burnout. Debriefing is the primary protective mechanism: it provides an opportunity to process the emotional content of an incident in a structured way, to restore a sense of safety and control, and to extract learning that reduces the risk of repetition. CHR 2015 Regulation 33 requires the registered manager to support the wellbeing of staff, and Ofsted's SCCIF includes "care for carers" as an explicit quality indicator. A home that debrief its staff consistently and supports them emotionally is not just fulfilling a regulatory requirement — it is maintaining the human infrastructure on which the quality of children's care depends. Staff who feel cared for are more able to care; staff who feel unsupported are more likely to leave, to become reactive in their practice, or to develop the kind of emotional numbing that prevents genuine relational connection with children.
        </p>
      </div>
    </PageShell>
  );
}
