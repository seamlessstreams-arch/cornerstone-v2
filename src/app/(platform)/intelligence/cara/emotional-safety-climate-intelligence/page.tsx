"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeEmotionalSafetyClimateIntelligence } from "@/hooks/use-home-emotional-safety-climate-intelligence";
import type { EmotionalSafetyClimateResult, EmotionalSafetyRating } from "@/lib/engines/home-emotional-safety-climate-intelligence-engine";

const RATING_META: Record<EmotionalSafetyRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function EmotionalSafetyClimateIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeEmotionalSafetyClimateIntelligence();
  const d = (raw as { data?: EmotionalSafetyClimateResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Emotional Safety Climate" description="Analysing emotional safety climate data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Emotional Safety Climate" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load emotional safety climate data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.safety_rating];

  return (
    <PageShell
      title="Emotional Safety Climate"
      description="Restraint quality, de-escalation, post-incident debrief, reward-to-sanction ratio, achievement celebration and injury monitoring — measuring whether the home feels emotionally safe for children to be themselves (PACE; DDP; NMS 4; CHR 2015 Reg 20 — Restraint)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <HeartHandshake className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Safety score: {d.safety_score}/100 · {d.total_restraints} restraints · de-escalation {Math.round(d.de_escalation_attempt_rate)}% · reward:sanction {d.reward_to_sanction_ratio.toFixed(1)}:1
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.injury_rate > 0 || d.child_debrief_rate < 90 || d.body_map_completion_rate < 100) && (
          <div className="flex flex-col gap-2">
            {d.injury_rate > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {Math.round(d.injury_rate)}% restraint injury rate — every injury during restraint requires immediate investigation and regulatory notification
              </div>
            )}
            {d.body_map_completion_rate < 100 && d.total_restraints > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Body map completion {Math.round(d.body_map_completion_rate)}% — body maps are mandatory for all physical interventions under CHR 2015 Reg 20
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total restraints", value: d.total_restraints, color: d.total_restraints > 0 ? "text-amber-600" : "text-emerald-600" },
            { label: "Avg duration (min)", value: d.average_restraint_duration > 0 ? d.average_restraint_duration.toFixed(1) : "—", color: "" },
            { label: "Achievements celebrated", value: d.positive_achievement_count, color: "text-emerald-600" },
            { label: "Reward:sanction ratio", value: `${d.reward_to_sanction_ratio.toFixed(1)}:1`, color: d.reward_to_sanction_ratio >= 3 ? "text-emerald-600" : "text-amber-600" },
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
                <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                Post-Incident Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Restraint review rate" value={d.restraint_review_rate} warn={100} />
              <RateBar label="Child debrief rate" value={d.child_debrief_rate} warn={100} />
              <RateBar label="Staff debrief rate" value={d.staff_debrief_rate} warn={100} />
              <RateBar label="Body map completion rate" value={d.body_map_completion_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                Therapeutic Climate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="De-escalation attempt rate" value={d.de_escalation_attempt_rate} warn={90} />
              <RateBar label="Achievement celebration rate" value={d.achievement_celebration_rate} warn={80} />
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
          CHR 2015 Regulation 20 (Restraint — physical intervention must be last resort, proportionate, and reviewed). NMS 4 (Emotional and behavioural support). PACE principles (Playfulness, Acceptance, Curiosity, Empathy). A reward-to-sanction ratio below 3:1 suggests the home may be more punitive than therapeutic. Every child who experiences restraint must be debriefed and have a body map completed.
        </p>
      </div>
    </PageShell>
  );
}
