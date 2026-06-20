"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePracticeObservationCompetencyIntelligence } from "@/hooks/use-home-practice-observation-competency-intelligence";
import type { PracticeObservationResult, PracticeObservationRating } from "@/lib/engines/home-practice-observation-competency-intelligence-engine";

const RATING_META: Record<PracticeObservationRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PracticeObservationCompetencyIntelligencePage() {
  const { data, isLoading, error } = useHomePracticeObservationCompetencyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Practice Observation & Competency" description="Analysing practice observations, competency standards, sign-off rates, and development plan data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Practice Observation & Competency" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load practice observation competency data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.observation_rating];

  return (
    <PageShell
      title="Practice Observation & Competency"
      description="Practice observation rates, outstanding and meets-standard observations, sign-off rates, development plan coverage, staff response rates, and staff coverage — evidencing that the home actively assesses and develops the direct practice quality of its workforce through observed competency assessments rather than relying solely on supervision and training records (CHR 2015 Reg 32, Reg 16; SCCIF: Quality of care)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Eye className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Observation score: {d.observation_score}/100 · {d.total_observations} observations · outstanding {Math.round(d.outstanding_rate)}% · meets standard {Math.round(d.meets_standard_rate)}% · sign-off {Math.round(d.sign_off_rate)}% · staff coverage {Math.round(d.staff_observed_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.observation_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.staff_observed_rate < 70 || d.sign_off_rate < 70 || d.development_plan_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.staff_observed_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Staff observed rate {Math.round(d.staff_observed_rate)}% — practice observations are the only mechanism for directly assessing whether the care staff deliver to children matches the home's stated approach; supervision records what staff say they do; observation records what they actually do
              </div>
            )}
            {d.sign_off_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Sign-off rate {Math.round(d.sign_off_rate)}% — observations without formal sign-off are not completed; sign-off confirms that the assessment has been reviewed, agreed, and closed — without it, observations remain open-ended assessments with no formal outcome for the staff member or the home
              </div>
            )}
            {d.development_plan_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Development plan rate {Math.round(d.development_plan_rate)}% — an observation without a development plan is a one-off snapshot rather than a continuous improvement tool; development plans are how the home converts observation findings into concrete professional growth for each staff member
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total observations", value: d.total_observations, color: "text-blue-600" },
            { label: "Outstanding rate", value: `${Math.round(d.outstanding_rate)}%`, color: d.outstanding_rate >= 30 ? "text-emerald-600" : "text-foreground" },
            { label: "Meets standard rate", value: `${Math.round(d.meets_standard_rate)}%`, color: d.meets_standard_rate >= 70 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground" /> Observation & Competency Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Outstanding observation rate" value={d.outstanding_rate} warn={25} />
            <RateBar label="Meets standard rate" value={d.meets_standard_rate} warn={75} />
            <RateBar label="Sign-off completion rate" value={d.sign_off_rate} warn={90} />
            <RateBar label="Development plan rate" value={d.development_plan_rate} warn={80} />
            <RateBar label="Staff response rate" value={d.staff_response_rate} warn={85} />
            <RateBar label="Staff observed rate" value={d.staff_observed_rate} warn={80} />
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
          CHR 2015 Regulation 32 — the registered person must ensure that all staff receive the training and development necessary to maintain and improve their skills; Regulation 16 — the registered person must ensure that each member of staff receives the supervision necessary to enable them to carry out their duties safely. Practice observation is the gold standard mechanism for assessing actual practice rather than self-reported competence. The SCCIF "Quality of care" domain assesses whether leaders and managers have direct knowledge of the quality of practice in their home; practice observations that are linked to development plans are the evidence that leaders have first-hand, documented knowledge of how their staff actually work with children. Research into residential care quality consistently identifies that the gap between stated values and lived practice — between what a home says it does and what happens in the corridor at 11pm — is one of the most significant determinants of outcome quality for children; practice observation is the primary tool for measuring and reducing that gap.
        </p>
      </div>
    </PageShell>
  );
}
