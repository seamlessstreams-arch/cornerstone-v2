"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePhysicalActivityRecreationIntelligence } from "@/hooks/use-home-physical-activity-recreation-intelligence";
import type { PhysicalActivityRecreationResult, PhysicalActivityRating } from "@/lib/engines/home-physical-activity-recreation-intelligence-engine";

const RATING_META: Record<PhysicalActivityRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PhysicalActivityRecreationIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePhysicalActivityRecreationIntelligence();
  const d = (raw as { data?: PhysicalActivityRecreationResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Physical Activity & Recreation" description="Analysing physical activity programme and recreation data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Physical Activity & Recreation" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load physical activity recreation data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.activity_rating];

  return (
    <PageShell
      title="Physical Activity & Recreation"
      description="Exercise programme engagement, recreational activity diversity, outdoor participation, fitness assessment coverage, activity accessibility, and child choice rates — evidencing that the home provides varied, accessible, child-led physical and recreational opportunities that support physical health, emotional regulation, and positive use of time (CHR 2015 Reg 5; NMS 3; SCCIF activities)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Activity className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Activity score: {d.activity_score}/100 · {d.total_exercise_programmes} exercise programmes · {d.total_recreational_activities} recreational activities · {d.total_outdoor_engagements} outdoor · engagement {Math.round(d.exercise_engagement_rate)}% · child choice {Math.round(d.child_choice_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.activity_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.child_choice_rate < 60 || d.activity_accessibility_rate < 70 || d.exercise_engagement_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.child_choice_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Child choice rate {Math.round(d.child_choice_rate)}% — physical activity and recreation is most effective when children choose activities that they find meaningful and enjoyable; adult-imposed exercise programmes without child input are less likely to be sustained and miss the opportunity to develop lifelong physical health habits
              </div>
            )}
            {d.activity_accessibility_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Activity accessibility rate {Math.round(d.activity_accessibility_rate)}% — every child, regardless of disability, health conditions, or past trauma, must have access to appropriate physical and recreational activities; low accessibility rates indicate that activity planning is not being individualised to each child's needs and circumstances
              </div>
            )}
            {d.exercise_engagement_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Exercise engagement rate {Math.round(d.exercise_engagement_rate)}% — low engagement with physical activity programmes is both a health concern and a potential indicator of disengagement or lack of appropriate activity planning; explore whether activities are well-matched to children's interests and abilities
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Exercise programmes", value: d.total_exercise_programmes, color: "text-blue-600" },
            { label: "Recreational activities", value: d.total_recreational_activities, color: "text-foreground" },
            { label: "Outdoor engagements", value: d.total_outdoor_engagements, color: "text-emerald-600" },
            { label: "Fitness assessments", value: d.total_fitness_assessments, color: "text-foreground" },
            { label: "Accessibility records", value: d.total_accessibility_records, color: "text-foreground" },
            { label: "Diversity score", value: `${d.recreational_diversity_score}/100`, color: d.recreational_diversity_score >= 70 ? "text-emerald-600" : d.recreational_diversity_score >= 50 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground" /> Activity Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Exercise programme engagement" value={d.exercise_engagement_rate} warn={75} />
            <RateBar label="Outdoor participation rate" value={d.outdoor_participation_rate} warn={80} />
            <RateBar label="Activity accessibility rate" value={d.activity_accessibility_rate} warn={90} />
            <RateBar label="Child choice rate" value={d.child_choice_rate} warn={70} />
            <RateBar label="Fitness assessment coverage" value={d.fitness_assessment_coverage_rate} warn={80} />
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
          CHR 2015 Regulation 5 (welfare) — the registered person must promote each child's physical development, including through physical activity and recreation. NMS Standard 3 (Promoting health and wellbeing) — "children engage in a range of leisure activities and interests; the home takes reasonable steps to promote healthy lifestyles." SCCIF inspects whether "children's leisure, social and cultural interests are promoted and nurtured." Physical inactivity is a significant health risk; children in residential care are at elevated risk of poor physical health outcomes due to the disruption and instability of their earlier lives, and the home has an active role in establishing positive physical health habits. Chief Medical Officers' guidelines recommend 60 minutes of moderate-to-vigorous physical activity per day for children and young people aged 5–18. Activity diversity matters: a home that records only football for boys and skipping for girls, or only structured exercise, is providing a narrow activity environment; variety, choice, and cultural appropriateness are all indicators of quality. Fitness assessments allow the home to understand each child's starting point and to track progress over time — without them, activity planning cannot be truly individualised.
        </p>
      </div>
    </PageShell>
  );
}
