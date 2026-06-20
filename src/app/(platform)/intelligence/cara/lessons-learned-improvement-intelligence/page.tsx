"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLessonsLearnedImprovementIntelligence } from "@/hooks/use-home-lessons-learned-improvement-intelligence";
import type { LessonsLearnedResult, LessonsLearnedRating } from "@/lib/engines/home-lessons-learned-improvement-intelligence-engine";

const RATING_META: Record<LessonsLearnedRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LessonsLearnedImprovementIntelligencePage() {
  const { data, isLoading, error } = useHomeLessonsLearnedImprovementIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Lessons Learned & Improvement Intelligence" description="Analysing lessons learned and improvement cycle data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Lessons Learned & Improvement Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load lessons learned data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.lessons_rating];

  return (
    <PageShell
      title="Lessons Learned & Improvement Intelligence"
      description="Lesson embedding rates, staff briefing coverage, improvement objective completion and audit scores — evidencing that the home learns from its own experience, embeds that learning in practice and can demonstrate a continuous improvement cycle to regulators (CHR 2015 Reg 45; Quality of Care Review; Reg 44 action plans)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Lightbulb className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lessons score: {d.lessons_score}/100 · {d.total_lessons} lessons · embedded {Math.round(d.embedded_rate)}% · objectives completion {Math.round(d.objective_completion_rate)}% · avg audit {d.average_audit_score.toFixed(1)}/10
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.lessons_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.embedded_rate < 70 || d.overdue_objectives > 0 || d.staff_briefing_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.embedded_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Lesson embedding rate {Math.round(d.embedded_rate)}% — a lesson that is not embedded in practice is not a lesson at all; it is documentation. Ofsted specifically tests whether learning is visible in staff behaviour and outcomes for children, not just in paperwork
              </div>
            )}
            {d.overdue_objectives > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.overdue_objectives} overdue improvement objective{d.overdue_objectives > 1 ? "s" : ""} — overdue improvement objectives are a direct failure of the improvement cycle; inspectors will check whether Reg 44 / Quality of Care Review actions have been completed on time
              </div>
            )}
            {d.staff_briefing_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Staff briefing rate {Math.round(d.staff_briefing_rate)}% — staff cannot embed learning they have not received; team briefing coverage is the first step in the improvement cascade
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total lessons", value: d.total_lessons, color: d.total_lessons === 0 ? "text-amber-600" : "text-blue-600" },
            { label: "Overdue objectives", value: d.overdue_objectives, color: d.overdue_objectives > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Objective completion", value: `${Math.round(d.objective_completion_rate)}%`, color: d.objective_completion_rate < 80 ? "text-amber-600" : "text-emerald-600" },
            { label: "Avg audit score", value: `${d.average_audit_score.toFixed(1)}/10`, color: d.average_audit_score < 6 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              Improvement Cycle Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Lesson embedding rate" value={d.embedded_rate} warn={85} />
            <RateBar label="Staff briefing coverage rate" value={d.staff_briefing_rate} warn={90} />
            <RateBar label="Objective completion rate" value={d.objective_completion_rate} warn={90} />
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
          CHR 2015 Regulation 45 (Quality of care review — the registered person must, at intervals of not more than six months, produce a report on the quality of care in the home; the report must include a description of how the home has responded to the previous report's recommendations). Regulation 44 (Independent visitor reports — the registered person must also show how they have acted on Reg 44 findings). The National Minimum Standards require homes to demonstrate continuous improvement. A home that produces reports but does not embed the learning is not a learning organisation — and Ofsted grades are partly determined by the quality and completeness of the improvement cycle, not just the quality of the home at the time of inspection.
        </p>
      </div>
    </PageShell>
  );
}
