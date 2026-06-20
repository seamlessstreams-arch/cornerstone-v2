"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeCompetencyLandscapeIntelligence } from "@/hooks/use-home-competency-landscape-intelligence";
import type { CompetencyLandscapeRating } from "@/lib/engines/home-competency-landscape-intelligence-engine";

const RATING_META: Record<CompetencyLandscapeRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function CompetencyLandscapeIntelligencePage() {
  const { data, isLoading, error } = useHomeCompetencyLandscapeIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Competency Landscape" description="Analysing staff competency across the home…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Competency Landscape" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load competency landscape data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.competency_rating];

  return (
    <PageShell
      title="Competency Landscape"
      description="Staff competency readiness, progression plans, assessment currency and stage distribution across the home workforce (CHR 2015 Reg 32 — Fitness of staff; Reg 33 — Staffing; Reg 34 — Supervision; Ofsted SCCIF 'Effective leadership')."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <GraduationCap className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Competency score: {d.competency_score}/100 · {d.readiness.staff_above_70_rate}% staff above 70 readiness · {d.currency.overdue_assessments} overdue assessments
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.competency_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.currency.overdue_assessments > 0 || d.progression.overdue_actions > 0) && (
          <div className="flex flex-col gap-2">
            {d.currency.overdue_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.currency.overdue_assessments} competency assessment(s) overdue — schedule immediately under CHR 2015 Reg 32
              </div>
            )}
            {d.progression.overdue_actions > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.progression.overdue_actions} development plan action(s) overdue — review with staff in supervision
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{Math.round(d.readiness.avg_readiness_score)}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg readiness score</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{d.readiness.staff_above_70}</p>
            <p className="text-xs text-muted-foreground mt-1">Staff above 70 readiness</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.currency.overdue_assessments > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.currency.overdue_assessments > 0 ? "text-amber-600" : "text-foreground"}`}>{d.currency.overdue_assessments}</p>
            <p className="text-xs text-muted-foreground mt-1">Overdue assessments</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.currency.avg_days_since_assessment}</p>
            <p className="text-xs text-muted-foreground mt-1">Avg days since assessment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Readiness Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Staff above 70 readiness rate" value={d.readiness.staff_above_70_rate} warn={80} />
              <RateBar label="Staff with personal targets" value={d.readiness.staff_with_target_rate} warn={90} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Highest readiness score</span>
                <span className="font-medium text-emerald-600">{d.readiness.highest_readiness}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Lowest readiness score</span>
                <span className={`font-medium ${d.readiness.lowest_readiness < 50 ? "text-red-600" : "text-foreground"}`}>{d.readiness.lowest_readiness}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Progression Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Plan coverage rate" value={d.progression.plan_coverage_rate} warn={90} />
              <RateBar label="Action completion rate" value={d.progression.action_completion_rate} warn={80} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Active / completed plans</span>
                <span className="font-medium">{d.progression.active_plans} / {d.progression.completed_plans}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue actions</span>
                <span className={`font-medium ${d.progression.overdue_actions > 0 ? "text-amber-600" : "text-foreground"}`}>{d.progression.overdue_actions}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {d.stage_distribution.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {d.stage_distribution.map((stage, i) => (
                  <div key={i} className="rounded-md bg-muted/40 p-2 text-center">
                    <p className="text-base font-semibold">{stage.count}</p>
                    <p className="text-xs text-muted-foreground capitalize">{stage.stage.replace(/_/g, " ")}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
          CHR 2015 Regulation 32 (Fitness of staff), Regulation 33 (Staffing) and Regulation 34 (Supervision). Ofsted SCCIF — Effective leadership. Competency assessments must be kept current and development plans embedded in supervision.
        </p>
      </div>
    </PageShell>
  );
}
