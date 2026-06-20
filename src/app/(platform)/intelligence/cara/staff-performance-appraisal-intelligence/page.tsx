"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffPerformanceAppraisalIntelligence } from "@/hooks/use-home-staff-performance-appraisal-intelligence";
import type { StaffPerformanceResult, StaffPerformanceRating } from "@/lib/engines/home-staff-performance-appraisal-intelligence-engine";

const RATING_META: Record<StaffPerformanceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffPerformanceAppraisalIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffPerformanceAppraisalIntelligence();
  const d: StaffPerformanceResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Performance Appraisal Intelligence" description="Analysing appraisal completion, target achievement, competency assessment, development progress, and feedback quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Performance Appraisal Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff performance appraisal data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.appraisal_rating];
  const { appraisal_profile, target_profile, competency_profile, development_profile, feedback_profile } = d;

  return (
    <PageShell
      title="Staff Performance Appraisal Intelligence"
      description="Appraisal completion and quality, target setting and achievement, competency assessment and gap management, development goal progress, and feedback culture — evidencing a performance management framework that supports staff to deliver high-quality care, identifies underperformance early, and provides the documented evidence of workforce management that regulators and commissioners expect (CHR 2015 Reg 32 & 33; ACAS Managing Performance guidance; Ofsted SCCIF workforce quality indicators; Skills for Care performance management standards)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Target className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Appraisal score: {d.appraisal_score}/100 · completion {Math.round(d.appraisal_completion_rate)}% · targets achieved {Math.round(d.target_achievement_rate)}% · competency {Math.round(d.competency_rate)}% · development {Math.round(d.development_progress_rate)}% · staff satisfaction {Math.round(d.staff_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.appraisal_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(appraisal_profile.overdue_count > 0 || competency_profile.gap_count > 0 || d.appraisal_completion_rate < 80) && (
          <div className="flex flex-col gap-2">
            {appraisal_profile.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {appraisal_profile.overdue_count} appraisal{appraisal_profile.overdue_count > 1 ? "s" : ""} overdue — CHR 2015 Regulation 33 requires the manager to monitor and assess staff performance; appraisals are the formal mechanism for this; overdue appraisals mean that staff are working without formal performance feedback, without reviewed objectives, and without documented evidence that the manager has assessed their practice
              </div>
            )}
            {competency_profile.gap_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {competency_profile.gap_count} competency gap{competency_profile.gap_count > 1 ? "s" : ""} identified ({competency_profile.gap_count - competency_profile.gap_with_action_plan_count} without an action plan) — competency gaps that do not have an action plan are unmanaged capability risks; the registered manager is responsible for ensuring that gaps are identified and actively addressed, not simply recorded
              </div>
            )}
            {d.appraisal_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Appraisal completion rate {Math.round(d.appraisal_completion_rate)}% — fewer than 80% of staff have a current completed appraisal; an Ofsted inspector reviewing the home's performance management documentation will look for evidence that all staff receive regular formal appraisals; this gap will be identified as a concern
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-muted-foreground" /> Appraisals & Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Appraisal completion rate" value={d.appraisal_completion_rate} warn={85} />
              <RateBar label="Dual signature rate" value={appraisal_profile.dual_signature_rate} warn={90} />
              <RateBar label="Objectives set rate" value={appraisal_profile.objectives_set_rate} warn={80} />
              <RateBar label="Development plan rate" value={appraisal_profile.development_plan_rate} warn={80} />
              <RateBar label="Target achievement rate" value={d.target_achievement_rate} warn={75} />
              <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-1">
                <div>Targets total: <span className="font-medium text-foreground">{target_profile.total_targets}</span></div>
                <div>At risk: <span className={`font-medium ${target_profile.at_risk_count > 0 ? "text-amber-600" : "text-foreground"}`}>{target_profile.at_risk_count}</span></div>
                <div>Not met: <span className={`font-medium ${target_profile.not_met_count > 0 ? "text-red-600" : "text-foreground"}`}>{target_profile.not_met_count}</span></div>
                <div>Overdue appraisals: <span className={`font-medium ${appraisal_profile.overdue_count > 0 ? "text-red-600" : "text-foreground"}`}>{appraisal_profile.overdue_count}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Competency & Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Competency assessment rate" value={d.competency_rate} warn={85} />
              <RateBar label="Development goal progress rate" value={d.development_progress_rate} warn={70} />
              <RateBar label="Feedback quality rate" value={d.feedback_quality_rate} warn={75} />
              <RateBar label="Staff satisfaction rate" value={d.staff_satisfaction_rate} warn={70} />
              <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-1">
                <div>Competency gaps: <span className={`font-medium ${competency_profile.gap_count > 0 ? "text-amber-600" : "text-foreground"}`}>{competency_profile.gap_count}</span></div>
                <div>With action plan: <span className="font-medium text-foreground">{competency_profile.gap_with_action_plan_count}</span></div>
                <div>Dev goals total: <span className="font-medium text-foreground">{development_profile.total_goals}</span></div>
                <div>Avg feedback score: <span className="font-medium text-foreground">{feedback_profile.avg_quality_rating && feedback_profile.avg_quality_rating > 0 ? `${feedback_profile.avg_quality_rating.toFixed(1)}/10` : "—"}</span></div>
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
          Performance appraisal in residential children's care serves multiple simultaneous purposes: it is the formal mechanism for setting expectations, reviewing progress, identifying competency gaps, planning development, and creating the documented record that demonstrates the manager is actively managing workforce quality. CHR 2015 Regulation 33 requires the registered manager to monitor and assess the performance of all staff, and the appraisal documentation is the primary evidence that this obligation is being met. The competency gap data is particularly important: a gap that is identified and has an action plan is a managed risk; a gap that is identified but has no action plan is an unmanaged risk; a gap that is not identified is an invisible risk. The development goal progress rate connects the appraisal framework to actual professional development: objectives that are set but never reviewed or pursued are not a performance management tool — they are a compliance fiction; genuine performance management requires that development goals are revisited, progress is recognised, and obstacles are addressed. The staff satisfaction rate within the appraisal framework is a culture indicator: appraisals that staff find useful and motivating are appraisals that drive engagement and performance; appraisals that staff experience as box-ticking exercises generate compliance but not commitment.
        </p>
      </div>
    </PageShell>
  );
}
