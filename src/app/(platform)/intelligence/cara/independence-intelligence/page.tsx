"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeIndependenceIntelligence } from "@/hooks/use-home-independence-intelligence";
import type { HomeIndependenceResult, IndependenceRating } from "@/lib/engines/home-independence-intelligence-engine";

const RATING_META: Record<IndependenceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function IndependenceIntelligencePage() {
  const { data, isLoading, error } = useHomeIndependenceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Independence Intelligence" description="Analysing independence pathway data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Independence Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load independence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.independence_rating];
  const prof = d.independence_profile;
  const dom = d.domain_analysis;
  const childrenWithout = prof.children_without_assessments;

  return (
    <PageShell
      title="Independence Intelligence"
      description="Pathway assessment coverage, readiness scores, pathway plan linkage, overdue reviews, domain strength and evidence quality — evidencing that every child is being actively and equitably prepared for independence (CHR 2015 Reg 7, 8; SCCIF Preparing for adulthood; NMS 6)."
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
                  Independence score: {d.independence_score}/100 · {prof.total_assessments} assessments · avg readiness {prof.avg_readiness}% · {childrenWithout.length} without assessment
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.independence_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(childrenWithout.length > 0 || prof.avg_readiness < 50 || prof.overdue_reviews > 0) && (
          <div className="flex flex-col gap-2">
            {childrenWithout.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {childrenWithout.length} child{childrenWithout.length > 1 ? "ren" : ""} without independence assessments — Ofsted will view this as a failure to prepare children for adulthood under Regulation 7
              </div>
            )}
            {prof.avg_readiness < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Average readiness {prof.avg_readiness}% — Ofsted will examine what the home is doing to accelerate progress towards independence
              </div>
            )}
            {prof.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {prof.overdue_reviews} overdue pathway review{prof.overdue_reviews > 1 ? "s" : ""} — assessments must be reviewed within agreed timescales to remain valid
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total assessments", value: prof.total_assessments, color: prof.total_assessments === 0 ? "text-red-600" : "text-blue-600" },
            { label: "Avg readiness", value: `${prof.avg_readiness}%`, color: prof.avg_readiness < 50 ? "text-red-600" : prof.avg_readiness >= 75 ? "text-emerald-600" : "text-amber-600" },
            { label: "On-track pathways", value: prof.on_track_count, color: "text-emerald-600" },
            { label: "Overdue reviews", value: prof.overdue_reviews, color: prof.overdue_reviews > 0 ? "text-amber-600" : "text-emerald-600" },
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
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Pathway Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Pathway plan linkage rate" value={prof.pathway_plan_linkage_rate} warn={90} />
              <RateBar label="Evidence quality rate" value={prof.evidence_rate} warn={85} />
              <RateBar label="Next steps documented rate" value={prof.next_steps_rate} warn={85} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                Domain Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${dom.avg_domain_score < 5 ? "text-amber-600" : "text-emerald-600"}`}>{dom.avg_domain_score.toFixed(1)}/10</p>
                  <p className="text-xs text-muted-foreground">Avg domain score</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${dom.low_scoring_total > 0 ? "text-red-600" : "text-emerald-600"}`}>{dom.low_scoring_total}</p>
                  <p className="text-xs text-muted-foreground">Low-scoring domains</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{dom.lowest_pathway_avg.toFixed(1)}/10</p>
                  <p className="text-xs text-muted-foreground">Lowest pathway avg</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${dom.readiness_gap > 30 ? "text-amber-600" : "text-foreground"}`}>{dom.readiness_gap}%</p>
                  <p className="text-xs text-muted-foreground">Readiness gap</p>
                </div>
              </div>
              {dom.readiness_gap > 30 && (
                <p className="text-xs text-amber-700 bg-amber-50 rounded border border-amber-200 px-2 py-1.5">
                  A readiness gap of {dom.readiness_gap}% suggests uneven support. Ofsted expects equitable preparation for all young people.
                </p>
              )}
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
          CHR 2015 Regulation 7 (Children's wishes and feelings — the registered person must prepare children for independence). Regulation 8 (Education — must support each child's long-term life skills development). SCCIF Preparing for adulthood and future lives. NMS 6 (Transition planning). Care leavers are disproportionately represented among the homeless, unemployed and those with poor health outcomes. The home that builds independence skills, links them to pathway plans and reviews them regularly is doing the most important work that children's residential care was designed for.
        </p>
      </div>
    </PageShell>
  );
}
