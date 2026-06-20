"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Milestone, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffLifecycleIntelligence } from "@/hooks/use-home-staff-lifecycle-intelligence";
import type { HomeStaffLifecycleResult, StaffLifecycleRating } from "@/lib/engines/home-staff-lifecycle-intelligence-engine";

const RATING_META: Record<StaffLifecycleRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

export default function StaffLifecycleIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffLifecycleIntelligence();
  const d: HomeStaffLifecycleResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Lifecycle Intelligence" description="Analysing induction, sickness and absence, exit interview quality, and staff recognition across the full employment lifecycle…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Lifecycle Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff lifecycle data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.lifecycle_rating];
  const { induction, sickness, exit_interviews, recognition } = d;

  return (
    <PageShell
      title="Staff Lifecycle Intelligence"
      description="End-to-end workforce lifecycle visibility — induction completion and task progress, sickness absence rates and active episodes, exit interview completion and satisfaction ratings, and staff recognition frequency — evidencing that the home manages the full employment journey from onboarding through to exit in a way that attracts, retains, and develops a high-quality workforce (CHR 2015 Reg 32, 33 & 35; Employment Rights Act 1996; Skills for Care workforce retention evidence; Ofsted SCCIF workforce stability indicators)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Milestone className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lifecycle score: {d.lifecycle_score}/100 · induction {Math.round(induction.completed_count / Math.max(induction.total_records, 1) * 100)}% complete · absence rate {sickness.absence_rate}% · exit interviews {exit_interviews.completed_count}/{exit_interviews.total_exits} · recognition {recognition.total_events_90d} events (90d)
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.lifecycle_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(induction.overdue_count > 0 || sickness.absence_rate > 5 || (exit_interviews.total_exits > 0 && exit_interviews.completed_count / exit_interviews.total_exits < 0.7)) && (
          <div className="flex flex-col gap-2">
            {induction.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {induction.overdue_count} induction task{induction.overdue_count > 1 ? "s" : ""} overdue — CHR 2015 Regulation 33 requires all staff to receive a full induction before working unsupervised with children; overdue induction tasks indicate staff who may be working without the required grounding in safeguarding, the home's therapeutic model, or emergency procedures
              </div>
            )}
            {sickness.absence_rate > 5 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Staff absence rate {sickness.absence_rate}% (90-day rolling) — an absence rate above 5% indicates that the home is consistently operating below its planned staffing complement; high absence rates create pressure on remaining staff, increase agency usage, and can destabilise the consistent relationships that children in residential care depend on; the underlying drivers of absence (stress, injury, burnout, personal circumstances) require active management, not just cover arrangements
              </div>
            )}
            {exit_interviews.total_exits > 0 && exit_interviews.completed_count / exit_interviews.total_exits < 0.7 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Exit interview completion rate {Math.round(exit_interviews.completed_count / exit_interviews.total_exits * 100)}% — exit interviews are one of the most valuable sources of honest feedback about staff experience, culture, and the factors driving turnover; a home that does not systematically complete exit interviews is missing the signal that could allow it to reduce future turnover
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Milestone className="h-4 w-4 text-muted-foreground" /> Induction & Absence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Total inductions", value: induction.total_records },
                  { label: "Completed", value: induction.completed_count },
                  { label: "Overdue tasks", value: induction.overdue_count, alert: induction.overdue_count > 0 },
                  { label: "Avg task completion", value: `${Math.round(induction.avg_task_completion)}%` },
                  { label: "Active sickness", value: sickness.active_episodes },
                  { label: "Episodes (90d)", value: sickness.total_episodes_90d },
                  { label: "Days lost (90d)", value: sickness.total_days_90d },
                  { label: "Absence rate", value: `${sickness.absence_rate}%`, alert: sickness.absence_rate > 5 },
                ].map(({ label, value, alert }) => (
                  <div key={label} className="text-center rounded border bg-muted/30 p-2">
                    <p className={`text-lg font-bold ${alert ? "text-red-600" : "text-foreground"}`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /> Exit Interviews & Recognition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Total exits", value: exit_interviews.total_exits },
                  { label: "Interviews completed", value: exit_interviews.completed_count },
                  { label: "Avg exit rating", value: exit_interviews.avg_rating > 0 ? `${exit_interviews.avg_rating.toFixed(1)}/5` : "—" },
                  { label: "Would recommend", value: `${Math.round(exit_interviews.would_recommend_rate)}%` },
                  { label: "Recognition events (90d)", value: recognition.total_events_90d },
                  { label: "Per staff (90d)", value: recognition.events_per_staff.toFixed(1) },
                  { label: "Child nominations", value: `${Math.round(recognition.child_nomination_rate)}%` },
                  { label: "Public celebrations", value: `${Math.round(recognition.public_celebration_rate)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center rounded border bg-muted/30 p-2">
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
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
          The staff lifecycle view integrates four distinct data domains — induction, sickness, exit, and recognition — that are typically managed separately but are causally connected. High sickness rates and poor recognition practices predict high exit rates; poor induction quality predicts both higher early attrition (staff who do not feel prepared or welcomed are more likely to leave within six months) and higher sickness rates (staff who are not properly prepared for the emotional demands of the role experience more acute distress). Exit interview data, when collected consistently, provides the registered manager with a longitudinal picture of why people leave — the reasons staff give in exit interviews are among the most reliable leading indicators of organisational culture and management quality, because departing staff have little incentive to be diplomatically positive. The recognition profile measures whether the home actively celebrates its staff, which is one of the most cost-effective retention tools available: staff who feel valued are more likely to stay, more likely to invest in their practice, and more likely to model positive professional culture for newer colleagues. The child nomination rate within the recognition profile is a particularly meaningful indicator — when children nominate staff for recognition, it is evidence of genuine relational connection, which is the core of what residential care is trying to achieve.
        </p>
      </div>
    </PageShell>
  );
}
