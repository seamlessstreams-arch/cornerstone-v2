"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FootprintsIcon, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSlipsTripsFallsPreventionIntelligence } from "@/hooks/use-home-slips-trips-falls-prevention-intelligence";
import type { SlipsTripsFallsPreventionResult, SlipsTripsFallsRating } from "@/lib/engines/home-slips-trips-falls-prevention-intelligence-engine";

const RATING_META: Record<SlipsTripsFallsRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 65 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 65 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SlipsTripsFallsPreventionIntelligencePage() {
  const raw = useHomeSlipsTripsFallsPreventionIntelligence();
  const d = (raw as { data?: SlipsTripsFallsPreventionResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Slips, Trips & Falls Prevention Intelligence" description="Analysing risk assessment coverage, flooring condition, wet floor protocols, stairway safety, incident learning, and staff awareness…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Slips, Trips & Falls Prevention Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load slips trips falls prevention data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.falls_prevention_rating];

  return (
    <PageShell
      title="Slips, Trips & Falls Prevention Intelligence"
      description="Slip, trip and fall risk assessment coverage, flooring condition and maintenance, wet floor signage and protocol adherence, stairway and banister safety, incident learning and corrective action rates, and staff awareness — evidencing that the home proactively manages one of the most common causes of injury to children and staff in residential settings (CHR 2015 Reg 9; Health and Safety at Work Act 1974; Management of Health and Safety at Work Regulations 1999; HSE slips and trips guidance; RIDDOR)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <FootprintsIcon className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prevention score: {d.falls_prevention_score}/100 · risk assessments {Math.round(d.risk_assessment_rate)}% · flooring {Math.round(d.flooring_condition_rate)}% · wet floor protocols {Math.round(d.wet_floor_protocol_rate)}% · stairway safety {Math.round(d.stairway_safety_rate)}% · staff awareness {Math.round(d.staff_awareness_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.falls_prevention_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.risk_assessment_rate < 85 || d.flooring_condition_rate < 85 || d.stairway_safety_rate < 85) && (
          <div className="flex flex-col gap-2">
            {d.risk_assessment_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Slip/trip/fall risk assessment rate {Math.round(d.risk_assessment_rate)}% — areas or activities without current risk assessments represent uncontrolled risks; the Management of Health and Safety at Work Regulations 1999 require risk assessments to be suitable, sufficient, and regularly reviewed; an area without a current assessment is one where the employer cannot demonstrate that risks have been identified and controlled
              </div>
            )}
            {d.flooring_condition_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Flooring condition rate {Math.round(d.flooring_condition_rate)}% — damaged, worn, or inadequate flooring is one of the most common contributory factors in slip and trip incidents; CHR 2015 Regulation 9 requires premises to be maintained to a standard consistent with children's safety; flooring defects identified in inspections or incident investigations must be rectified promptly, not deferred to the next planned maintenance cycle
              </div>
            )}
            {d.stairway_safety_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Stairway safety rate {Math.round(d.stairway_safety_rate)}% — stairways are the highest-risk area for falls in residential settings, particularly for children who may run, use the stairway at night, or have reduced awareness of risk; banister integrity, stair tread condition, and adequate lighting at the top of stairways are all non-negotiable safety features that must be maintained to standard
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><FootprintsIcon className="h-4 w-4 text-muted-foreground" /> Prevention Compliance Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Slip/trip/fall risk assessment coverage" value={d.risk_assessment_rate} warn={92} />
            <RateBar label="Flooring condition and maintenance rate" value={d.flooring_condition_rate} warn={90} />
            <RateBar label="Wet floor protocol compliance rate" value={d.wet_floor_protocol_rate} warn={95} />
            <RateBar label="Stairway and banister safety rate" value={d.stairway_safety_rate} warn={95} />
            <RateBar label="Incident learning and corrective action rate" value={d.incident_learning_rate} warn={85} />
            <RateBar label="Staff awareness and training rate" value={d.staff_awareness_rate} warn={85} />
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
          Slips, trips and falls are the most common cause of non-intentional injury in residential care settings and consistently appear in HSE enforcement action and RIDDOR reportable incidents. The context of residential childcare introduces specific risk factors that are not present in a typical domestic property: children who run indoors, who may be in emotional crisis and less aware of physical hazards, who may use staircases at night when lighting is low and their awareness is reduced; children who have mobility difficulties, sensory processing differences that affect proprioception, or who are on medications that affect coordination or alertness. The wet floor protocol rate is deceptively important: the gap between a wet floor and a slip is seconds, and in a home where children are moving unpredictably through communal areas, a wet floor without appropriate signage and exclusion zone is a high-probability injury risk. The incident learning rate is the quality indicator that closes the loop: a home that records slip/trip/fall incidents but does not analyse them for preventable causes, make physical changes, and verify improvement is a home that will continue to have the same incidents. RIDDOR requires reporting of injuries over 7 days' absence — any home that is reaching that threshold has a prevention problem, not a reporting problem.
        </p>
      </div>
    </PageShell>
  );
}
