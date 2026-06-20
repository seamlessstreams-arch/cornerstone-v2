"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLeavingCareTransitionIntelligence } from "@/hooks/use-home-leaving-care-transition-intelligence";
import type { LeavingCareResult, LeavingCareRating } from "@/lib/engines/home-leaving-care-transition-intelligence-engine";

const RATING_META: Record<LeavingCareRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LeavingCareTransitionIntelligencePage() {
  const { data, isLoading, error } = useHomeLeavingCareTransitionIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Leaving Care & Transition Intelligence" description="Analysing pathway plan and transition data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Leaving Care & Transition Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load leaving care transition data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.leaving_care_rating];

  return (
    <PageShell
      title="Leaving Care & Transition Intelligence"
      description="Pathway plan coverage, goal achievement, aspiration recording, travel readiness and financial readiness — evidencing that children approaching independence are being prepared with the practical, emotional and financial foundations they need to live independently (Children (Leaving Care) Act 2000; Reg 5; Care Leavers Charter)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ArrowRight className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Leaving care score: {d.leaving_care_score}/100 · {d.children_with_pathway_plans} children with pathway plans · goal achievement {Math.round(d.goal_achievement_rate)}% · financial readiness {Math.round(d.financial_readiness_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.leaving_care_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.goal_achievement_rate < 70 || d.financial_readiness_rate < 60 || d.travel_readiness_rate < 60) && (
          <div className="flex flex-col gap-2">
            {d.goal_achievement_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Goal achievement rate {Math.round(d.goal_achievement_rate)}% — children leaving care without achieving their transition goals face significantly higher risk of homelessness, unemployment and mental health crisis; this demands urgent attention
              </div>
            )}
            {d.financial_readiness_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Financial readiness {Math.round(d.financial_readiness_rate)}% — research consistently shows that financial literacy is the single biggest predictor of care leavers avoiding debt crisis in their first independent year
              </div>
            )}
            {d.travel_readiness_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Travel readiness {Math.round(d.travel_readiness_rate)}% — inability to travel independently limits access to employment, education and healthcare; it should be a specific preparation target in every pathway plan
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-3 text-center">
          <p className="text-3xl font-bold text-blue-600">{d.children_with_pathway_plans}</p>
          <p className="text-sm text-muted-foreground mt-1">Children with active pathway plans</p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              Transition Readiness Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Goal achievement rate" value={d.goal_achievement_rate} warn={85} />
            <RateBar label="Aspiration recording rate" value={d.aspiration_recording_rate} warn={90} />
            <RateBar label="Travel readiness rate" value={d.travel_readiness_rate} warn={75} />
            <RateBar label="Financial readiness rate" value={d.financial_readiness_rate} warn={75} />
          </CardContent>
        </Card>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const sev = ins.severity as string;
              const cls =
                sev === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                sev === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {sev === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   sev === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
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
                const urg = rec.urgency as string;
                const urgencyColor =
                  urg === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  urg === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          Children (Leaving Care) Act 2000 (local authorities and their partners — including children's homes — must assess and meet the needs of care leavers through pathway planning; the responsible authority retains duties until age 25). CHR 2015 Regulation 5 (the registered person must ensure children's welfare is promoted — for young people approaching independence, this includes active preparation for adult life). Care Leavers Charter (16 pledges to care leavers including access to support, financial assistance and accommodation). Research from Nacro, Catch22 and the Care Leavers Association consistently shows that the quality of pathway planning is the strongest predictor of stable independent living. Children who leave care without adequate financial and travel literacy are at significantly higher risk of homelessness within 12 months.
        </p>
      </div>
    </PageShell>
  );
}
