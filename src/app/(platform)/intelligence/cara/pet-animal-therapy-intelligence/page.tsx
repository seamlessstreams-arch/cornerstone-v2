"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePetAnimalTherapyIntelligence } from "@/hooks/use-home-pet-animal-therapy-intelligence";
import type { PetAnimalTherapyResult, PetAnimalTherapyRating } from "@/lib/engines/home-pet-animal-therapy-intelligence-engine";

const RATING_META: Record<PetAnimalTherapyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PetAnimalTherapyIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePetAnimalTherapyIntelligence();
  const d = (raw as { data?: PetAnimalTherapyResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Pet & Animal Therapy Intelligence" description="Analysing pet therapy session and animal interaction data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Pet & Animal Therapy Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load pet animal therapy data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.therapy_rating];

  return (
    <PageShell
      title="Pet & Animal Therapy Intelligence"
      description="Pet therapy session frequency, child engagement, interaction outcomes, mood improvement, goal achievement, pet care responsibility, and animal welfare compliance — evidencing that animal-assisted interventions are delivered with therapeutic purpose, that outcomes are tracked, and that animal welfare standards are met (NMS 3; SCCIF; Animal Welfare Act 2006)."
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
                  Therapy score: {d.therapy_score}/100 · {d.total_sessions} sessions · engagement {Math.round(d.child_engagement_rate)}% · benefit {Math.round(d.child_benefit_rate)}% · mood improvement avg {d.mood_improvement_avg.toFixed(1)} · welfare compliance {Math.round(d.welfare_compliance_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.therapy_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.welfare_compliance_rate < 100 || d.child_benefit_rate < 60) && (
          <div className="flex flex-col gap-2">
            {d.welfare_compliance_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Animal welfare compliance {Math.round(d.welfare_compliance_rate)}% — Animal Welfare Act 2006 places a positive duty of care on anyone responsible for an animal; non-compliance is not only a legal risk but undermines the therapeutic value of animal-assisted work and harms the animals in the home's care
              </div>
            )}
            {d.child_benefit_rate < 60 && d.total_sessions > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Documented child benefit rate {Math.round(d.child_benefit_rate)}% — animal-assisted interventions in residential care require therapeutic framing and documented outcomes to distinguish them from recreational pet ownership; without benefit tracking, the therapeutic value cannot be evidenced to Ofsted or placing authorities
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total sessions", value: d.total_sessions, color: "text-blue-600" },
            { label: "Goal achievement", value: d.session_goal_achievement_avg.toFixed(1), color: d.session_goal_achievement_avg >= 4 ? "text-emerald-600" : d.session_goal_achievement_avg >= 3 ? "text-amber-600" : "text-red-600" },
            { label: "Mood improvement", value: d.mood_improvement_avg.toFixed(1), color: d.mood_improvement_avg >= 4 ? "text-emerald-600" : d.mood_improvement_avg >= 3 ? "text-amber-600" : "text-red-600" },
            { label: "Welfare compliance", value: `${Math.round(d.welfare_compliance_rate)}%`, color: d.welfare_compliance_rate >= 100 ? "text-emerald-600" : d.welfare_compliance_rate >= 80 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground" /> Therapy & Welfare Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Child engagement rate" value={d.child_engagement_rate} warn={80} />
            <RateBar label="Child benefit rate" value={d.child_benefit_rate} warn={70} />
            <RateBar label="Therapy frequency rate" value={d.therapy_frequency_rate} warn={70} />
            <RateBar label="Interaction outcome rate" value={d.interaction_outcome_rate} warn={75} />
            <RateBar label="Pet care responsibility rate" value={d.pet_care_responsibility_rate} warn={70} />
            <RateBar label="Animal welfare compliance" value={d.welfare_compliance_rate} warn={100} />
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
          NMS Standard 3 (Promoting health and wellbeing) — the home provides activities that promote children's emotional, social, and physical wellbeing; animal-assisted interventions, when properly structured and outcome-tracked, are recognised as evidence-based approaches to emotional regulation, attachment, and confidence-building for children with complex trauma histories. The therapeutic value of animal interaction for children in residential care is grounded in the literature on non-verbal, non-judgmental relational experiences (Chandler, 2012; NICE evidence review). Animal Welfare Act 2006 — any animal kept in the home is subject to the five welfare needs: environment, diet, normal behaviour, companionship, and protection from pain/suffering/disease; failure to meet these needs is a criminal offence and also undermines the therapeutic relationship children may have with the animal. Giving children age-appropriate responsibility for pet care (feeding, grooming, cleaning) is a legitimate therapeutic and life-skills intervention; how this is structured and supervised should be documented. SCCIF inspectors assess whether activities are appropriate, purposeful, and matched to individual children's needs — undocumented pet interactions are unlikely to impress.
        </p>
      </div>
    </PageShell>
  );
}
