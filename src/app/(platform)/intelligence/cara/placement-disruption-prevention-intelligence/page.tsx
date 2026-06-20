"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePlacementDisruptionPreventionIntelligence } from "@/hooks/use-home-placement-disruption-prevention-intelligence";
import type { DisruptionPreventionResult, DisruptionPreventionRating } from "@/lib/engines/home-placement-disruption-prevention-intelligence-engine";

const RATING_META: Record<DisruptionPreventionRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80, invertWarn = false }: { label: string; value: number; warn?: number; invertWarn?: boolean }) {
  const pct = Math.round(value);
  let color: string;
  if (invertWarn) {
    color = pct <= warn ? "bg-emerald-500" : pct <= warn * 2 ? "bg-amber-400" : "bg-red-400";
  } else {
    color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  }
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${(!invertWarn && pct < 50) || (invertWarn && pct > warn * 2) ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PlacementDisruptionPreventionIntelligencePage() {
  const { data, isLoading, error } = useHomePlacementDisruptionPreventionIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Placement Disruption Prevention" description="Analysing placement stability and disruption prevention data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Placement Disruption Prevention" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load placement disruption prevention data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.disruption_rating];

  return (
    <PageShell
      title="Placement Disruption Prevention"
      description="Disruption prevention plan coverage, planned versus unplanned ending rates, disruption rates, average placement length, and high-risk children — evidencing the home's proactive approach to preventing placement breakdown and the stability it provides as a foundation for children's development and therapeutic progress (CHR 2015 Reg 5; CiCC 2020; placement stability research)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Home className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Disruption score: {d.disruption_score}/100 · {d.children_with_plans} with plans · disruption rate {Math.round(d.disruption_rate)}% · planned endings {Math.round(d.planned_ending_rate)}% · avg placement {d.average_placement_months.toFixed(1)}m · {d.high_risk_children} high risk
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.disruption_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.disruption_rate > 20 || d.high_risk_children > 0 || d.planned_ending_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.disruption_rate > 20 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Disruption rate {Math.round(d.disruption_rate)}% — placement instability is one of the strongest predictors of poor long-term outcomes for children in care; high disruption rates require a systemic review of placement matching, therapeutic support, and the home's practice in managing escalating risk before placement ends
              </div>
            )}
            {d.high_risk_children > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.high_risk_children} child{d.high_risk_children > 1 ? "ren" : ""} at high risk of placement disruption — each high-risk child requires an active, reviewed disruption prevention plan with documented escalation triggers and a named person responsible for monitoring placement stability
              </div>
            )}
            {d.planned_ending_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Planned ending rate {Math.round(d.planned_ending_rate)}% — when placement endings are predominantly unplanned, children experience additional trauma and disruption; the home should review whether early warning systems are in place and whether disruption prevention plans are being actively used before crisis point
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "With prevention plans", value: d.children_with_plans, color: "text-blue-600" },
            { label: "Disruption rate", value: `${Math.round(d.disruption_rate)}%`, color: d.disruption_rate <= 10 ? "text-emerald-600" : d.disruption_rate <= 20 ? "text-amber-600" : "text-red-600" },
            { label: "Planned endings", value: `${Math.round(d.planned_ending_rate)}%`, color: d.planned_ending_rate >= 80 ? "text-emerald-600" : d.planned_ending_rate >= 60 ? "text-amber-600" : "text-red-600" },
            { label: "High-risk children", value: d.high_risk_children, color: d.high_risk_children === 0 ? "text-emerald-600" : d.high_risk_children <= 1 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Home className="h-4 w-4 text-muted-foreground" /> Stability Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Planned ending rate" value={d.planned_ending_rate} warn={80} />
            <RateBar label="Disruption rate" value={d.disruption_rate} warn={10} invertWarn />
            <div className="flex items-center justify-between rounded border bg-muted/30 px-3 py-2">
              <span className="text-xs text-muted-foreground">Average placement length</span>
              <span className={`text-sm font-bold ${d.average_placement_months >= 12 ? "text-emerald-600" : d.average_placement_months >= 6 ? "text-amber-600" : "text-red-600"}`}>{d.average_placement_months.toFixed(1)} months</span>
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
          CHR 2015 Regulation 5 (welfare) and the statutory guidance Placement in Children's Homes (DfE, 2020) — placement stability is fundamental to children's wellbeing; the home and the placing authority share responsibility for preventing avoidable placement disruption. The Care Inquiry (2013) found that "love, stability and care from the people who look after children" are the most important determinants of good outcomes; placement breakdown interrupts these relationships and can cause significant additional harm to children who have already experienced loss, rejection, and trauma. Research (Sinclair et al., 2007) consistently shows that placement instability is strongly associated with poor educational, emotional, and long-term outcomes. Every unplanned placement ending should trigger a serious case review-style analysis: what early warning signs were present, what interventions were tried, what could have been done differently — not to apportion blame, but to learn. A home that has a high disruption rate but no systemic analysis of why is repeating harm without learning from it. The difference between a planned and unplanned placement ending is often the difference between a child experiencing a difficult but supported transition and a child experiencing rejection and abandonment.
        </p>
      </div>
    </PageShell>
  );
}
