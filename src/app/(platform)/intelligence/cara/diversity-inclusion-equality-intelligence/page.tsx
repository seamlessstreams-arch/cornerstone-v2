"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeDiversityInclusionEqualityIntelligence } from "@/hooks/use-home-diversity-inclusion-equality-intelligence";
import type { DiversityInclusionResult, DiversityInclusionRating } from "@/lib/engines/home-diversity-inclusion-equality-intelligence-engine";

const RATING_META: Record<DiversityInclusionRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function DiversityInclusionEqualityIntelligencePage() {
  const { data, isLoading, error } = useHomeDiversityInclusionEqualityIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Diversity, Inclusion & Equality" description="Analysing diversity and inclusion data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Diversity, Inclusion & Equality" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load diversity and inclusion data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.diversity_rating];

  return (
    <PageShell
      title="Diversity, Inclusion & Equality"
      description="Identity affirmation planning, hate incident management, diversity events and cultural celebration — affirming every child's identity and creating an environment where diversity is celebrated, not merely tolerated (Equality Act 2010; CHR 2015 Reg 9; NMS 1 — Statement of Purpose; UN CRC Articles 2, 8, 14, 30)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Users className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Diversity score: {d.diversity_score}/100 · {d.children_with_cultural_plans} children with plans · {d.diversity_events_completed} events completed · {d.hate_incidents_total} hate incidents
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.diversity_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {d.hate_incidents_total > 0 && d.hate_resolution_rate < 100 && (
          <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            {d.hate_incidents_total} hate {d.hate_incidents_total === 1 ? "incident" : "incidents"} recorded — {Math.round(d.hate_resolution_rate)}% resolution rate. All hate incidents require a documented response, safety planning and Equality Act consideration.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Children with cultural plans", value: d.children_with_cultural_plans, color: "text-blue-600" },
            { label: "Diversity events completed", value: d.diversity_events_completed, color: "text-emerald-600" },
            { label: "Hate incidents total", value: d.hate_incidents_total, color: d.hate_incidents_total > 0 ? "text-red-600" : "" },
            { label: "Identity affirmation rate", value: `${Math.round(d.identity_affirmation_rate)}%`, color: d.identity_affirmation_rate < 70 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-lg border bg-muted/30 p-3 text-center ${typeof value === "number" && label === "Hate incidents total" && d.hate_incidents_total > 0 ? "bg-red-50" : ""}`}>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Diversity & Inclusion Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Identity affirmation rate" value={d.identity_affirmation_rate} warn={85} />
            <RateBar label="Hate incident resolution rate" value={d.hate_resolution_rate} warn={100} />
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
          Equality Act 2010 (nine protected characteristics; public sector equality duty). CHR 2015 Regulation 9 (Supporting healthy development). NMS 1 (Statement of Purpose — commitment to equality and diversity). UN CRC Articles 2 (non-discrimination), 8 (identity), 14 (religion), 30 (minority cultures). Every child has the right to have their identity affirmed and their cultural background celebrated — not as a box-ticking exercise, but as a lived practice.
        </p>
      </div>
    </PageShell>
  );
}
