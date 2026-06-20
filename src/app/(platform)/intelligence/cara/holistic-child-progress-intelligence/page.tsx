"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHolisticChildProgressIntelligence } from "@/hooks/use-home-holistic-child-progress-intelligence";
import type { HolisticChildProgressResult, HolisticProgressRating } from "@/lib/engines/home-holistic-child-progress-intelligence-engine";

const RATING_META: Record<HolisticProgressRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function HolisticChildProgressIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeHolisticChildProgressIntelligence();
  const d = (raw as { data?: HolisticChildProgressResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Holistic Child Progress" description="Analysing holistic child progress data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Holistic Child Progress" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load holistic child progress data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.progress_rating];

  return (
    <PageShell
      title="Holistic Child Progress"
      description="Outcome improvement, child voice, education engagement, attendance, key work completion, goal progress, independence readiness and domain coverage — a whole-child view of how children are progressing across all seven life domains (CHR 2015 Reg 5, 7, 8, 10; SCCIF Experiences; NMS 2, 3)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <TrendingUp className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Progress score: {d.progress_score}/100 · {d.children_with_data} children tracked · {d.domain_coverage} domains covered · child voice composite {Math.round(d.child_voice_composite_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.progress_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.education_engagement_rate < 70 || d.average_attendance < 90 || d.outcome_improvement_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.education_engagement_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Education engagement rate {Math.round(d.education_engagement_rate)}% — low engagement puts children at risk of exclusion, persistent absence and reduced life chances
              </div>
            )}
            {d.average_attendance < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Average attendance {Math.round(d.average_attendance)}% — persistent absence is a known safeguarding indicator; 90% is the minimum expectation
              </div>
            )}
            {d.outcome_improvement_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Outcome improvement rate only {Math.round(d.outcome_improvement_rate)}% — fewer than half of review outcomes show improvement; care plans and interventions may need review
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Children tracked", value: d.children_with_data, color: "text-blue-600" },
            { label: "Domain coverage", value: d.domain_coverage, color: d.domain_coverage < 5 ? "text-amber-600" : "text-emerald-600" },
            { label: "Independence readiness avg", value: `${d.independence_readiness_average.toFixed(1)}/10`, color: "" },
            { label: "Child voice composite", value: `${Math.round(d.child_voice_composite_rate)}%`, color: "" },
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
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Outcomes & Voice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Outcome improvement rate" value={d.outcome_improvement_rate} warn={60} />
              <RateBar label="Outcome child voice rate" value={d.outcome_child_voice_rate} warn={75} />
              <RateBar label="Child voice composite rate" value={d.child_voice_composite_rate} warn={70} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Education & Key Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Education engagement rate" value={d.education_engagement_rate} warn={85} />
              <RateBar label="Average attendance" value={d.average_attendance} warn={92} />
              <RateBar label="Key work completion rate" value={d.key_work_completion_rate} warn={85} />
              <RateBar label="Key work goal progress rate" value={d.key_work_goal_progress_rate} warn={70} />
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
          CHR 2015 Regulation 5 (Quality and purpose of care — supporting children's progress across all life domains). Regulation 7 (Children's wishes and feelings). Regulation 8 (Education). Regulation 10 (Health). SCCIF Experiences and progress (children's outcomes and progress across all seven domains). NMS 2, 3. The aspiration is simple: every child in care should leave better equipped for life than they arrived. Holistic progress is not about ticking boxes — it is about whether each child is growing as a whole person.
        </p>
      </div>
    </PageShell>
  );
}
