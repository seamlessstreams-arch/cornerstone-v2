"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitMerge, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeAdmissionsMatchingAssessmentIntelligence } from "@/hooks/use-home-admissions-matching-assessment-intelligence";
import type { AdmissionsMatchingResult, AdmissionsMatchingRating } from "@/lib/engines/home-admissions-matching-assessment-intelligence-engine";

const RATING_META: Record<AdmissionsMatchingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function AdmissionsMatchingAssessmentIntelligencePage() {
  const raw = useHomeAdmissionsMatchingAssessmentIntelligence();
  const d = (raw as { data?: { data?: AdmissionsMatchingResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Admissions Matching & Assessment Intelligence" description="Analysing referral assessment quality, impact assessments, matching criteria, suitability reviews, admission planning, and child consultation…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Admissions Matching & Assessment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load admissions matching & assessment data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.admissions_rating];

  return (
    <PageShell
      title="Admissions Matching & Assessment Intelligence"
      description="Referral assessment completeness, impact risk assessment quality, matching criteria application, placement suitability review, admission planning, and child consultation rates — evidencing a structured, evidence-based admissions process that protects existing residents, centres the child's voice, and meets the matching and placement obligations of CHR 2015 Regulation 7, the DfE Statutory Guidance on Placements in Residential Homes, the Care Planning Regulations 2010, and Working Together to Safeguard Children 2023."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <GitMerge className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Admissions score: {d.admissions_score}/100 · referral assessment {Math.round(d.referral_assessment_rate)}% · matching quality {Math.round(d.matching_quality_rate)}% · child consultation {Math.round(d.child_consultation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.admissions_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.child_consultation_rate < 80 || d.impact_assessment_rate < 85 || d.matching_quality_rate < 75) && (
          <div className="flex flex-col gap-2">
            {d.child_consultation_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Child consultation rate {Math.round(d.child_consultation_rate)}% — the United Nations Convention on the Rights of the Child Article 12 gives every child the right to express their views in matters that affect them; a placement decision is one of the most consequential decisions in a child's life, and children should be consulted about it in an age-appropriate way that is documented; low consultation rates indicate that the admissions process is treating placement as a logistical matter rather than a child-centred one
              </div>
            )}
            {d.impact_assessment_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Impact risk assessment rate {Math.round(d.impact_assessment_rate)}% — before accepting a referral, the home must assess the likely impact of the potential new placement on the children already in the home; this is not optional — it is a core element of CHR 2015 Regulation 7 and the DfE matching guidance; assessments that are missing prevent the manager from making a defensible decision and expose existing residents to unassessed risk
              </div>
            )}
            {d.matching_quality_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Matching quality rate {Math.round(d.matching_quality_rate)}% — a low matching quality score indicates that the criteria used to assess whether a child is suitable for this home are not being consistently or thoroughly applied; this makes placement decisions less defensible and increases the probability that children will be placed who the home cannot safely and therapeutically accommodate
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Referral assessments", value: d.total_referral_assessments, color: "text-blue-600" },
            { label: "Impact assessments", value: d.total_impact_assessments, color: "text-purple-600" },
            { label: "Matching records", value: d.total_matching_records, color: "text-blue-600" },
            { label: "Suitability reviews", value: d.total_suitability_reviews, color: "text-blue-600" },
            { label: "Admission plans", value: d.total_admission_plans, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><GitMerge className="h-4 w-4 text-muted-foreground" /> Admissions Process Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Referral assessment completion rate" value={d.referral_assessment_rate} warn={90} />
            <RateBar label="Impact risk assessment rate" value={d.impact_assessment_rate} warn={90} />
            <RateBar label="Matching quality rate" value={d.matching_quality_rate} warn={80} />
            <RateBar label="Suitability review rate" value={d.suitability_review_rate} warn={85} />
            <RateBar label="Admission planning rate" value={d.admission_planning_rate} warn={85} />
            <RateBar label="Child consultation rate" value={d.child_consultation_rate} warn={90} />
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
          The matching and assessment process is the quality gate of the residential care system: it is the point at which the home either accepts a responsibility it can discharge safely and therapeutically, or declines a referral because accepting it would compromise the care of existing residents or exceed the home's competence. The DfE's statutory guidance on residential placements is unambiguous: the placement must be suitable for the individual child's needs, and the effect on other residents must be assessed before a decision is made. The six dimensions measured in this dashboard — referral assessment, impact assessment, matching quality, suitability review, admission planning, and child consultation — are the six steps of a thorough admissions process; each one that is absent creates a gap in the evidence base for the decision. Matching quality is the most complex: it requires the manager to compare the child's needs profile with the home's existing competencies, therapeutic model, and current group dynamics; a matching decision that is technically documented but substantively superficial — ticking boxes rather than genuinely interrogating fit — provides false assurance. The admission planning rate measures whether, once a placement is accepted, the home has done the preparatory work that gives it the best chance of success: preparing existing residents, briefing the key worker, establishing initial routines, and confirming what information transfers from the previous placement. Child consultation is the rights-based dimension: the child's voice in their own placement decision is not an administrative courtesy — it is a legal right and a therapeutic priority.
        </p>
      </div>
    </PageShell>
  );
}
