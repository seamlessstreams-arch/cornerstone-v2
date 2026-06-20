"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeBSPEffectivenessIntelligence } from "@/hooks/use-home-bsp-effectiveness-intelligence";
import type { BSPEffectivenessRating } from "@/lib/engines/home-bsp-effectiveness-intelligence-engine";

const RATING_META: Record<BSPEffectivenessRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function BSPEffectivenessIntelligencePage() {
  const { data, isLoading, error } = useHomeBSPEffectivenessIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="BSP Effectiveness" description="Analysing behaviour support plan effectiveness…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="BSP Effectiveness" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load BSP effectiveness data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.bsp_rating];

  return (
    <PageShell
      title="BSP Effectiveness"
      description="Behaviour support plan quality, currency, strategy uptake, restraint reduction and coverage across all children in placement (CHR 2015 Reg 19; Reg 20; SCCIF 'How well children are helped and protected')."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  BSP score: {d.bsp_score}/100 · {d.coverage.children_with_active_bsp} active BSPs · {d.coverage.children_with_concerning_no_bsp} concerning without BSP
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.bsp_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.coverage.children_with_concerning_no_bsp > 0 || d.currency.overdue_reviews > 0) && (
          <div className="flex flex-col gap-2">
            {d.coverage.children_with_concerning_no_bsp > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.coverage.children_with_concerning_no_bsp} child(ren) showing concerning behaviour with no active BSP — safeguarding review required
              </div>
            )}
            {d.currency.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.currency.overdue_reviews} BSP review(s) overdue — update required under CHR 2015 Reg 19
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{d.coverage.coverage_rate}%</p>
            <p className="text-xs text-muted-foreground mt-1">BSP coverage</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.coverage.children_with_concerning_no_bsp > 0 ? "bg-red-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.coverage.children_with_concerning_no_bsp > 0 ? "text-red-600" : "text-foreground"}`}>
              {d.coverage.children_with_concerning_no_bsp}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Concerning without BSP</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.currency.overdue_reviews > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.currency.overdue_reviews > 0 ? "text-amber-600" : "text-foreground"}`}>
              {d.currency.overdue_reviews}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Overdue reviews</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.plan_quality.total_active}</p>
            <p className="text-xs text-muted-foreground mt-1">Active BSPs</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Plan Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Strategy effectiveness rate" value={d.plan_quality.strategy_effectiveness_rate} warn={80} />
            <RateBar label="Child voice included" value={d.plan_quality.child_voice_rate} warn={90} />
            <RateBar label="Professional input included" value={d.plan_quality.professional_input_rate} warn={80} />
            <RateBar label="Safety plan included" value={d.plan_quality.safety_plan_rate} warn={80} />
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold">{d.plan_quality.avg_triggers.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg triggers</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold">{d.plan_quality.avg_de_escalation_stages.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">De-escalation stages</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold">{d.plan_quality.avg_guidance_points.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Guidance points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Behaviour in Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Positive behaviour rate" value={d.behaviour.positive_rate} warn={70} />
              <RateBar label="Strategy usage rate" value={d.behaviour.strategy_usage_rate} warn={80} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">High-intensity incidents</span>
                <span className={`font-medium ${d.behaviour.high_intensity_count > 3 ? "text-red-600" : "text-foreground"}`}>{d.behaviour.high_intensity_count}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Restraint &amp; De-escalation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Post-restraint debrief rate" value={d.restraint.debrief_rate} warn={100} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total restraints</span>
                <span className={`font-medium ${d.restraint.total_restraints > 0 ? "text-amber-600" : "text-foreground"}`}>{d.restraint.total_restraints}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg de-escalation steps</span>
                <span className="font-medium">{d.restraint.avg_de_escalation.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Review Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className={`text-base font-semibold ${d.currency.overdue_reviews > 0 ? "text-red-600" : "text-foreground"}`}>{d.currency.overdue_reviews}</p>
                <p className="text-xs text-muted-foreground">Overdue</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold text-amber-600">{d.currency.upcoming_reviews}</p>
                <p className="text-xs text-muted-foreground">Upcoming (30d)</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold">{d.currency.avg_days_since_review}</p>
                <p className="text-xs text-muted-foreground">Avg days since review</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2 text-center">
                <p className="text-base font-semibold">{d.currency.review_depth.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg review depth</p>
              </div>
            </div>
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
          CHR 2015 Regulation 19 (Behaviour management) and Regulation 20 (Restraint and deprivation of liberty). SCCIF — How well children are helped and protected. BSP reviews must reflect current needs and be updated following significant incidents.
        </p>
      </div>
    </PageShell>
  );
}
