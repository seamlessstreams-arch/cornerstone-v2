"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSensoryDietRegulationIntelligence } from "@/hooks/use-home-sensory-diet-regulation-intelligence";
import type { SensoryDietResult, SensoryDietRating } from "@/lib/engines/home-sensory-diet-regulation-intelligence-engine";

const RATING_META: Record<SensoryDietRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 55 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SensoryDietRegulationIntelligencePage() {
  const raw = useHomeSensoryDietRegulationIntelligence();
  const d = (raw as { data?: SensoryDietResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sensory Diet & Regulation Intelligence" description="Analysing sensory diet plan coverage, regulation strategy effectiveness, break scheduling, OT integration, and child self-regulation progress…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sensory Diet & Regulation Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sensory diet regulation data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sensory_diet_rating];

  return (
    <PageShell
      title="Sensory Diet & Regulation Intelligence"
      description="Sensory diet plan coverage, regulation strategy effectiveness, scheduled sensory break adherence, occupational therapy integration, child self-regulation progress, and overall child progress rates — evidencing that children with sensory processing differences are supported by evidence-based, OT-informed sensory diets that are consistently implemented by staff, reviewed regularly, and demonstrably improving each child's capacity for self-regulation and engagement with daily life (CHR 2015 Reg 5 & 14; SCCIF; NICE NG56; RCOT sensory integration practice guidance)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Brain className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sensory diet score: {d.sensory_diet_score}/100 · {d.total_diet_plans} plans · coverage {Math.round(d.diet_plan_coverage_rate)}% · strategy effectiveness {Math.round(d.strategy_effectiveness_rate)}% · self-regulation progress {Math.round(d.self_regulation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sensory_diet_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.diet_plan_coverage_rate < 85 || d.therapy_integration_rate < 70 || d.break_scheduling_rate < 75) && (
          <div className="flex flex-col gap-2">
            {d.diet_plan_coverage_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sensory diet plan coverage {Math.round(d.diet_plan_coverage_rate)}% — children who need sensory diets but don't have one are depending on staff improvisation rather than evidence-based, OT-informed intervention; the sensory diet is the structured, prescriptive framework that tells staff exactly what sensory input a child needs, when, and in what form — without it, sensory support becomes reactive and inconsistent
              </div>
            )}
            {d.therapy_integration_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                OT integration rate {Math.round(d.therapy_integration_rate)}% — sensory diet plans without occupational therapist input risk being based on lay interpretation of sensory needs; OTs bring specialist assessment, evidence-based activity prescription, and the ability to distinguish between sensory seeking and sensory avoidance patterns; plans created without this expertise may inadvertently over- or under-stimulate children
              </div>
            )}
            {d.break_scheduling_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Scheduled sensory break rate {Math.round(d.break_scheduling_rate)}% — proactive sensory breaks prevent the sensory overload that leads to dysregulation and, in some children, behavioural incidents; reactive breaks after dysregulation occurs are significantly less effective than breaks taken before the child reaches threshold; the scheduling rate is therefore a leading indicator of the home's ability to prevent rather than manage sensory-driven distress
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sensory diet plans", value: d.total_diet_plans, color: "text-blue-600" },
            { label: "Strategy effectiveness avg", value: `${d.strategy_effectiveness_avg.toFixed(1)}/5`, color: d.strategy_effectiveness_avg >= 4 ? "text-emerald-600" : "text-amber-600" },
            { label: "Self-regulation progress avg", value: `${d.self_regulation_progress_avg.toFixed(1)}/5`, color: d.self_regulation_progress_avg >= 4 ? "text-emerald-600" : "text-amber-600" },
            { label: "Child progress rate", value: `${Math.round(d.child_progress_rate)}%`, color: d.child_progress_rate >= 75 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-muted-foreground" /> Sensory Diet & Regulation Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sensory diet plan coverage rate" value={d.diet_plan_coverage_rate} warn={90} />
            <RateBar label="Regulation strategy effectiveness rate" value={d.strategy_effectiveness_rate} warn={80} />
            <RateBar label="Scheduled sensory break adherence rate" value={d.break_scheduling_rate} warn={85} />
            <RateBar label="OT integration rate" value={d.therapy_integration_rate} warn={80} />
            <RateBar label="Child self-regulation improvement rate" value={d.self_regulation_rate} warn={70} />
            <RateBar label="Overall child progress rate" value={d.child_progress_rate} warn={75} />
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
          A sensory diet — the term coined by occupational therapist Patricia Wilbarger — is not a metaphor: it is a prescriptive programme of sensory activities designed to provide the precise type, quantity, and frequency of sensory input a child's nervous system needs to stay regulated across the day. Unlike ad hoc sensory activities, a sensory diet is designed by an OT following structured sensory assessment, is specific to the child's sensory processing profile, and is written as a timetabled programme that staff implement systematically. For children in residential care — many of whom have developmental trauma, ADHD, autism, or early adverse sensory environments — the difference between a well-implemented sensory diet and no sensory diet can be the difference between a child who is able to engage with school, relationships, and daily life, and one who is in chronic dysregulation. The strategy effectiveness average and self-regulation progress average are the outcome measures that matter most here: they tell the manager whether the home's sensory work is actually changing children's lives. CHR 2015 Regulation 14 requires care plans to address health needs holistically; for children with sensory processing differences, the sensory diet is a health intervention that belongs in the care plan as a prescribed therapeutic activity, not as an informal add-on.
        </p>
      </div>
    </PageShell>
  );
}
