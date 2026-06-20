"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeMultidisciplinaryFormulationIntelligence } from "@/hooks/use-home-multidisciplinary-formulation-intelligence";
import type { FormulationResult, FormulationRating } from "@/lib/engines/home-multidisciplinary-formulation-intelligence-engine";

const RATING_META: Record<FormulationRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function MultidisciplinaryFormulationIntelligencePage() {
  const { data, isLoading, error } = useHomeMultidisciplinaryFormulationIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Multidisciplinary Formulation" description="Analysing multidisciplinary formulation data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Multidisciplinary Formulation" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load multidisciplinary formulation data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.formulation_rating];

  return (
    <PageShell
      title="Multidisciplinary Formulation"
      description="Formulation coverage, Four Ps completeness, child contribution, intervention planning, multi-agency involvement and review scheduling — evidencing that the home understands each child's needs through a structured, shared clinical framework rather than intuition alone (NICE NG11; BPS Practice Guidelines; CARE model; NMS 14)."
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
                  Formulation score: {d.formulation_score}/100 · {d.total_formulations} formulations · coverage {Math.round(d.children_with_formulation_rate)}% · Four Ps completeness {Math.round(d.four_p_completeness_rate)}% · child contribution {Math.round(d.child_contribution_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.formulation_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.children_with_formulation_rate < 80 || d.four_p_completeness_rate < 70 || d.child_contribution_rate < 50) && (
          <div className="flex flex-col gap-2">
            {d.children_with_formulation_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Formulation coverage {Math.round(d.children_with_formulation_rate)}% — a child without a formulation is a child whose needs have not been formally understood; care planning without formulation is reactive and likely to miss the causes of behaviour
              </div>
            )}
            {d.four_p_completeness_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Four Ps completeness {Math.round(d.four_p_completeness_rate)}% — a formulation that only covers some of the predisposing, precipitating, perpetuating and protective factors is incomplete; partial formulations produce partial interventions and leave children at ongoing risk
              </div>
            )}
            {d.child_contribution_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child contribution rate {Math.round(d.child_contribution_rate)}% — formulations done to children rather than with them miss the child's own understanding of their experience; DDP practice requires the child as the expert on their own inner world
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total formulations", value: d.total_formulations, color: d.total_formulations === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Coverage rate", value: `${Math.round(d.children_with_formulation_rate)}%`, color: d.children_with_formulation_rate < 80 ? "text-amber-600" : "text-emerald-600" },
            { label: "Four Ps completeness", value: `${Math.round(d.four_p_completeness_rate)}%`, color: d.four_p_completeness_rate < 70 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Brain className="h-4 w-4 text-muted-foreground" /> Formulation Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Children with formulation rate" value={d.children_with_formulation_rate} warn={90} />
            <RateBar label="Four Ps completeness rate" value={d.four_p_completeness_rate} warn={90} />
            <RateBar label="Child contribution rate" value={d.child_contribution_rate} warn={70} />
            <RateBar label="Intervention planning rate" value={d.intervention_planning_rate} warn={90} />
            <RateBar label="Multi-agency involvement rate" value={d.multi_agency_rate} warn={75} />
            <RateBar label="Review scheduled rate" value={d.review_scheduled_rate} warn={100} />
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
          NICE Clinical Guideline NG11 (2015 — violence and aggression: short-term management in mental health, health and community settings; formulation is the clinical foundation for understanding and responding to distress that may manifest as challenging behaviour; reactive responses without formulation-based understanding are likely to escalate rather than contain). British Psychological Society (BPS) Good Practice Guidelines on the Use of Psychological Formulation (2011) — formulation integrates theory, research and clinical data to provide an individual-specific framework for understanding a person's needs; in residential care this is the essential precondition for therapeutic care. CARE model (Caring for our Children, DfE) — therapeutic approaches in children's homes require an individual formulation of each child's needs to be effective. NMS Standard 14 (care planning — each child's care plan must be based on an assessment of their individual needs; formulation provides the assessment framework that makes this possible).
        </p>
      </div>
    </PageShell>
  );
}
