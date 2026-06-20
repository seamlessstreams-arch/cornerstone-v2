"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSleepQualityRestManagementIntelligence } from "@/hooks/use-home-sleep-quality-rest-management-intelligence";
import type { SleepQualityRestManagementResult, SleepQualityRating } from "@/lib/engines/home-sleep-quality-rest-management-intelligence-engine";

const RATING_META: Record<SleepQualityRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80 }: { label: string; value: number; warn?: number }) {
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

export default function SleepQualityRestManagementIntelligencePage() {
  const raw = useHomeSleepQualityRestManagementIntelligence();
  const d = (raw as { data?: SleepQualityRestManagementResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sleep Quality & Rest Management Intelligence" description="Analysing sleep routine adherence, sleep environment quality, disturbance resolution, bedtime support, and child satisfaction…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sleep Quality & Rest Management Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sleep quality rest management data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sleep_rating];

  return (
    <PageShell
      title="Sleep Quality & Rest Management Intelligence"
      description="Sleep routine adherence, sleep environment quality, disturbance resolution effectiveness, bedtime support quality, sleep improvement plan coverage, and child satisfaction with their sleep — measuring the therapeutic quality of the home's approach to children's rest and sleep needs beyond compliance to actual child experience (CHR 2015 Reg 5 & 10; NICE CG91 insomnia; Sleep Scotland guidance for children with complex needs; ACEs and sleep research)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BedDouble className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sleep score: {d.sleep_score}/100 · {d.total_routine_records} routine records · {d.total_disturbances} disturbances · routine adherence {Math.round(d.routine_adherence_rate)}% · environment quality {Math.round(d.environment_quality_rate)}% · child satisfaction {Math.round(d.child_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sleep_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.routine_adherence_rate < 75 || d.disturbance_resolution_rate < 70 || d.child_satisfaction_rate < 65) && (
          <div className="flex flex-col gap-2">
            {d.routine_adherence_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sleep routine adherence {Math.round(d.routine_adherence_rate)}% — consistent bedtime routines are one of the most evidence-based interventions for improving sleep quality in children with developmental trauma and anxiety; the routine creates predictability, signals safety, and helps the child's nervous system transition from alertness to rest; inconsistent routines undermine the therapeutic benefit even when the routine itself is well-designed
              </div>
            )}
            {d.disturbance_resolution_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Disturbance resolution rate {Math.round(d.disturbance_resolution_rate)}% — disturbances that are not resolved effectively leave children in prolonged distress overnight, which has cumulative effects on their regulation and emotional health; effective resolution requires staff who can co-regulate, tolerate distress, and respond therapeutically at 3am — this is one of the most demanding practice skills in residential care
              </div>
            )}
            {d.child_satisfaction_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child satisfaction with sleep {Math.round(d.child_satisfaction_rate)}% — children who are not satisfied with their sleep arrangements are telling the home something important; they may need a different environment, different routine, different support, or their distress about sleep may be a proxy for something else; their dissatisfaction should be explored with curiosity, not managed with reassurance
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Sleep routine records", value: d.total_routine_records, color: "text-blue-600" },
            { label: "Total disturbances", value: d.total_disturbances, color: d.total_disturbances === 0 ? "text-emerald-600" : d.total_disturbances <= 10 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><BedDouble className="h-4 w-4 text-muted-foreground" /> Sleep & Rest Management Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sleep routine adherence rate" value={d.routine_adherence_rate} warn={85} />
            <RateBar label="Sleep environment quality rate" value={d.environment_quality_rate} warn={80} />
            <RateBar label="Disturbance resolution effectiveness rate" value={d.disturbance_resolution_rate} warn={80} />
            <RateBar label="Bedtime support quality rate" value={d.bedtime_support_quality_rate} warn={80} />
            <RateBar label="Sleep improvement plan coverage rate" value={d.improvement_plan_coverage_rate} warn={75} />
            <RateBar label="Child satisfaction with sleep arrangements" value={d.child_satisfaction_rate} warn={70} />
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
          The distinction between this page and the Sleep Quality Intelligence page is one of depth: Sleep Quality Intelligence captures compliance and safety (were checks done, was the building secure, how many disturbances); this page captures the therapeutic quality of the home's approach to sleep (are the routines therapeutic, is the environment conducive, is the bedtime process supportive, are children improving). Both matter, but for different reasons. The sleep improvement plan coverage rate is particularly important: not every child needs a formal sleep improvement plan, but every child who is regularly experiencing disturbed sleep, chronic difficulty settling, or distress at bedtime does; the absence of a plan for a child who clearly needs one is the therapeutic equivalent of a child who needs a physio referral but has never been referred — the home has identified the need and not acted on it. The bedtime support quality rate is the one that most directly reflects staff skill and relationship quality: getting a traumatised young person to bed safely, with warmth, in a way that leaves them feeling contained rather than abandoned, is one of the highest-skill therapeutic tasks in residential care; a low rate here is a staff development priority, not just a practice gap.
        </p>
      </div>
    </PageShell>
  );
}
