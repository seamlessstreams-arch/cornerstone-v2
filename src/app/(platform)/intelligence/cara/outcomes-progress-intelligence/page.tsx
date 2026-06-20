"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeOutcomesProgressIntelligence } from "@/hooks/use-home-outcomes-progress-intelligence";
import type { HomeOutcomesProgressResult, OutcomesRating } from "@/lib/engines/home-outcomes-progress-intelligence-engine";

const RATING_META: Record<OutcomesRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function OutcomesProgressIntelligencePage() {
  const { data, isLoading, error } = useHomeOutcomesProgressIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Outcomes Progress Intelligence" description="Analysing therapeutic outcome target progress…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Outcomes Progress Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load outcomes progress data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.outcomes_rating];
  const prog = d.progress_profile;
  const rev = d.review_profile;
  const eq = d.equity_profile;
  const dom = d.domain_profile;

  return (
    <PageShell
      title="Outcomes Progress Intelligence"
      description="Therapeutic outcome target progress across all domains — improving/stable/declining distribution, average rating change from baseline, review timeliness, young person participation, equity of target coverage — evidencing that children are making meaningful progress against their individual plans (CHR 2015 Reg 6, 44, 45; SCCIF outcomes)."
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
                  Outcomes score: {d.outcomes_score}/100 · improving {Math.round(prog.improving_rate)}% · declining {Math.round(prog.declining_rate)}% · avg progress {prog.avg_progress > 0 ? "+" : ""}{prog.avg_progress.toFixed(1)} pts · coverage {Math.round(eq.coverage_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.outcomes_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(prog.declining_rate > 25 || eq.children_without_targets > 0 || rev.overdue_targets > 0) && (
          <div className="flex flex-col gap-2">
            {prog.declining_rate > 25 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {Math.round(prog.declining_rate)}% of targets are declining — children losing ground on their outcomes requires an urgent review of interventions, placement stability, and any external factors that may be driving regression
              </div>
            )}
            {eq.children_without_targets > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {eq.children_without_targets} child{eq.children_without_targets > 1 ? "ren have" : " has"} no outcome targets — every child in a children's home is entitled to a therapeutic plan with measurable progress markers; the absence of targets is not neutral, it is a gap in their care
              </div>
            )}
            {rev.overdue_targets > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {rev.overdue_targets} target review{rev.overdue_targets > 1 ? "s" : ""} overdue — unreviewed targets cannot be updated to reflect a child's changing circumstances; overdue reviews devalue the target-setting process
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-emerald-50 border-emerald-200 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">{prog.improving_count}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Improving ({Math.round(prog.improving_rate)}%)</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Minus className="h-4 w-4 text-slate-500" />
              <p className="text-2xl font-bold text-foreground">{prog.stable_count}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Stable</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${prog.declining_count > 0 ? "bg-red-50 border-red-200" : "bg-muted/30"}`}>
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className={`h-4 w-4 ${prog.declining_count > 0 ? "text-red-600" : "text-muted-foreground"}`} />
              <p className={`text-2xl font-bold ${prog.declining_count > 0 ? "text-red-600" : "text-foreground"}`}>{prog.declining_count}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Declining ({Math.round(prog.declining_rate)}%)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /> Progress & Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Children with outcome targets" value={eq.coverage_rate} warn={100} />
              <RateBar label="Young person voice in targets" value={eq.yp_voice_rate} warn={80} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${prog.avg_progress > 0 ? "text-emerald-600" : prog.avg_progress < 0 ? "text-red-600" : "text-foreground"}`}>{prog.avg_progress > 0 ? "+" : ""}{prog.avg_progress.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg progress</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{prog.achieved_count}</p>
                  <p className="text-xs text-muted-foreground">Targets achieved</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{dom.total_domains_covered}</p>
                  <p className="text-xs text-muted-foreground">Domains covered</p>
                </div>
              </div>
              {dom.domains_missing.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Missing domains</p>
                  <div className="flex flex-wrap gap-1">
                    {dom.domains_missing.map(d => (
                      <Badge key={d} variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">{d}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Review Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="YP participation in reviews" value={rev.yp_participation_rate} warn={80} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{rev.total_reviews}</p>
                  <p className="text-xs text-muted-foreground">Total reviews</p>
                </div>
                <div className={`rounded border p-2 text-center ${rev.overdue_targets > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${rev.overdue_targets > 0 ? "text-amber-600" : "text-emerald-600"}`}>{rev.overdue_targets}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{rev.reviews_with_barriers}</p>
                  <p className="text-xs text-muted-foreground">With barriers noted</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{rev.reviews_with_next_steps}</p>
                  <p className="text-xs text-muted-foreground">With next steps</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`rounded border p-2 text-center ${eq.children_without_targets > 0 ? "border-amber-200 bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${eq.children_without_targets > 0 ? "text-amber-600" : "text-emerald-600"}`}>{eq.children_without_targets}</p>
                  <p className="text-xs text-muted-foreground">Children without targets</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{eq.avg_targets_per_child.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg targets/child</p>
                </div>
              </div>
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
          CHR 2015 Regulation 6 (Quality of care — the registered person must ensure that the care provided promotes and supports each child's development) and Regulations 44/45 (monitoring and review — progress must be evidenced and reviewed). SCCIF — "Impact on children's lives: progress and outcomes" is one of the primary lenses through which Ofsted judges homes; inspectors will look for evidence that children are making progress across multiple domains of their lives, that targets are meaningful and child-led, that reviews happen at appropriate intervals, and that declining trajectories are identified and responded to. The framework of eight domains (living skills, health, relationships, safety, aspirations, work/education, self-care, community) reflects the breadth of what good residential care should address. Homes with narrow domain coverage, poor YP voice rates, or high proportions of declining targets will receive critical feedback; homes with comprehensive, child-led, regularly-reviewed outcome frameworks will demonstrate the "impact on children's lives" that constitutes outstanding practice.
        </p>
      </div>
    </PageShell>
  );
}
