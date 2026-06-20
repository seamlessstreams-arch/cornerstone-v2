"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSensoryTherapeuticEnvironmentIntelligence } from "@/hooks/use-home-sensory-therapeutic-environment-intelligence";
import type { SensoryTherapeuticResult, SensoryTherapeuticRating } from "@/lib/engines/home-sensory-therapeutic-environment-intelligence-engine";

const RATING_META: Record<SensoryTherapeuticRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SensoryTherapeuticEnvironmentIntelligencePage() {
  const { data, isLoading, error } = useHomeSensoryTherapeuticEnvironmentIntelligence();
  const d: SensoryTherapeuticResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Sensory & Therapeutic Environment Intelligence" description="Analysing sensory room usage, equipment condition, physical activity participation, and therapeutic environment quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sensory & Therapeutic Environment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sensory therapeutic environment data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sensory_rating];

  return (
    <PageShell
      title="Sensory & Therapeutic Environment Intelligence"
      description="Sensory room utilisation and therapeutic benefit, sensory equipment condition and safety, physical activity participation and enjoyment — evidencing that the physical environment of the home actively supports children's regulation, wellbeing, and development rather than simply providing shelter (CHR 2015 Reg 9 — Premises & Equipment; Reg 10 — Health & Wellbeing; SCCIF 'Children's experiences and progress')."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Waves className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Environment score: {d.sensory_score}/100 · {d.children_using_sensory_room} using sensory room · beneficial rate {Math.round(d.sensory_beneficial_rate)}% · equipment condition {Math.round(d.equipment_condition_rate)}% · {d.children_physically_active} physically active
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sensory_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.equipment_condition_rate < 80 || d.sensory_beneficial_rate < 70 || d.activity_enjoyment_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.equipment_condition_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sensory equipment condition rate {Math.round(d.equipment_condition_rate)}% — equipment in poor or broken condition cannot be used therapeutically and may present a safety risk; Regulation 9 requires that premises and equipment are maintained to a standard consistent with children's safety and wellbeing; degraded sensory equipment also sends an implicit message to children about whether their needs are valued
              </div>
            )}
            {d.sensory_beneficial_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sensory room beneficial rate {Math.round(d.sensory_beneficial_rate)}% — a low beneficial rate suggests the sensory room is being used in ways that do not meet its therapeutic purpose; possible causes include: children using it to avoid rather than regulate, unsupported sessions without appropriate staff facilitation, poor timing of access relative to the child's sensory state, or equipment that does not match the child's sensory profile
              </div>
            )}
            {d.activity_enjoyment_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Activity enjoyment rate {Math.round(d.activity_enjoyment_rate)}% — physical activity that children do not enjoy is unlikely to be sustained and loses the additional benefit of positive shared experience with staff; the goal is not compliance with an activity schedule but genuine engagement; low enjoyment rates warrant review of whether activities are being chosen with children rather than imposed on them
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Using sensory room", value: d.children_using_sensory_room, color: "text-blue-600" },
            { label: "Sensory beneficial rate", value: `${Math.round(d.sensory_beneficial_rate)}%`, color: d.sensory_beneficial_rate >= 70 ? "text-emerald-600" : "text-amber-600" },
            { label: "Physically active", value: d.children_physically_active, color: "text-blue-600" },
            { label: "Activity enjoyment rate", value: `${Math.round(d.activity_enjoyment_rate)}%`, color: d.activity_enjoyment_rate >= 70 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Waves className="h-4 w-4 text-muted-foreground" /> Environment & Activity Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sensory room beneficial rate" value={d.sensory_beneficial_rate} warn={75} />
            <RateBar label="Sensory equipment condition rate" value={d.equipment_condition_rate} warn={85} />
            <RateBar label="Physical activity enjoyment rate" value={d.activity_enjoyment_rate} warn={75} />
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
          The physical environment of a residential children's home is not neutral: it either supports children's regulation and wellbeing or it works against it. CHR 2015 Regulation 9 sets minimum standards for premises, but the therapeutic expectation is considerably higher — a home that merely meets Regulation 9 has safe and hygienic premises; a home that actively uses its environment therapeutically has spaces that help children regulate, find calm, experience joy, and develop a sense of belonging. The sensory room is the most direct expression of this therapeutic intent: it exists specifically to give children access to the sensory input their nervous systems need, delivered in a structured, staff-supported way. The equipment condition rate is therefore not merely a maintenance indicator — it reflects whether the home invests in and prioritises therapeutic infrastructure. Physical activity is similarly a health and wellbeing obligation under Regulation 10, but the enjoyment rate reframes it as a relational and motivational challenge: the question is not whether the home provides activities, but whether those activities are ones children actually want to do and experience as positive. Staff-child shared physical activity — swimming, cycling, football — is also one of the highest-value relational opportunities available to residential care: it creates natural, informal relationship-building moments outside the formal care structure.
        </p>
      </div>
    </PageShell>
  );
}
