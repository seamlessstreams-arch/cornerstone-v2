"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffWellbeingRetentionIntelligence } from "@/hooks/use-home-staff-wellbeing-retention-intelligence";
import type { StaffWellbeingRetentionResult, StaffWellbeingRating } from "@/lib/engines/home-staff-wellbeing-retention-intelligence-engine";

const RATING_META: Record<StaffWellbeingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffWellbeingRetentionIntelligencePage() {
  const raw = useHomeStaffWellbeingRetentionIntelligence();
  const d = (raw as { data?: { data?: StaffWellbeingRetentionResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Wellbeing & Retention Intelligence" description="Analysing sickness absence, wellbeing survey engagement, retention rates, support uptake, and exit interview completion…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Wellbeing & Retention Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff wellbeing & retention data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.wellbeing_rating];

  return (
    <PageShell
      title="Staff Wellbeing & Retention Intelligence"
      description="Sickness absence rates, wellbeing survey completion, staff retention and turnover patterns, wellbeing support uptake, exit interview completion, and staff satisfaction — evidencing that the home actively manages workforce stability and invests in the conditions that enable staff to remain, develop, and deliver consistently high-quality care (CHR 2015 Regulation 35; NHS People Plan 2020/21; NICE guidance NG113: Workplace health; HSE Stress Management Standards; Working Together to Safeguard Children 2023 duty to staff wellbeing)."
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
                  Wellbeing score: {d.wellbeing_score}/100 · retention rate {Math.round(d.retention_rate)}% · sickness absence {Math.round(d.sickness_absence_rate)}% · staff satisfaction {Math.round(d.staff_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.wellbeing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.sickness_absence_rate > 10 || d.retention_rate < 80 || d.exit_interview_completion_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.sickness_absence_rate > 10 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sickness absence rate {Math.round(d.sickness_absence_rate)}% — NICE guidance NG113 defines an absence rate above 4% as cause for organisational concern; a rate above 10% in residential care is a significant workforce risk indicator; it signals stress, burnout, inadequate support, or unsafe working conditions, all of which are also care quality risks; repeated short-term absences by the same individuals often signal moral distress or compassion fatigue that the supervision and wellbeing system has not yet identified or addressed
              </div>
            )}
            {d.retention_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Staff retention rate {Math.round(d.retention_rate)}% — high turnover in residential care is a direct care quality risk; children who have experienced disrupted attachments are particularly sensitive to staff changes, and frequent staff turnover reinforces the belief that relationships are unreliable and that adults leave; retention is therefore not an HR metric but a therapeutic one — the home's duty to minimise disruption to children's relationships includes a duty to retain the staff those relationships are built with
              </div>
            )}
            {d.exit_interview_completion_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Exit interview completion rate {Math.round(d.exit_interview_completion_rate)}% — staff who leave without being asked why represent a missed learning opportunity; exit interviews are the most direct mechanism through which the home can understand whether its working conditions, management practices, and culture are driving avoidable attrition; a low completion rate may indicate that interviews are not being arranged promptly, or that the culture does not feel safe enough for candid feedback
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Sickness records", value: d.total_sickness_records, color: "text-blue-600" },
            { label: "Survey records", value: d.total_survey_records, color: "text-blue-600" },
            { label: "Retention events", value: d.total_retention_events, color: "text-blue-600" },
            { label: "Support records", value: d.total_support_records, color: "text-blue-600" },
            { label: "Exit interviews", value: d.total_exit_interviews, color: "text-blue-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /> Wellbeing & Retention Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Staff retention rate" value={d.retention_rate} warn={85} />
            <RateBar label="Staff satisfaction rate" value={d.staff_satisfaction_rate} warn={75} />
            <RateBar label="Wellbeing survey completion rate" value={d.wellbeing_survey_completion_rate} warn={80} />
            <RateBar label="Wellbeing support uptake rate" value={d.wellbeing_support_uptake_rate} warn={70} />
            <RateBar label="Exit interview completion rate" value={d.exit_interview_completion_rate} warn={80} />
            <RateBar label="Sickness absence rate" value={d.sickness_absence_rate} warn={95} />
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
          Staff retention and wellbeing are the two sides of the same organisational condition: a home that retains its staff is a home whose staff feel valued, supported, and able to do meaningful work; a home that struggles to retain staff has a working environment that does not sustain people, and the most direct expression of that is turnover. In residential children's care, the cost of turnover is borne not just by the home (recruitment, induction, overtime cover) but by the children: every staff departure is a relational rupture for children who have already experienced too many. The retention rate is therefore the single most child-centred metric in the workforce dataset — it measures whether the conditions of employment are compatible with the therapeutic mission of the home. The sickness absence rate is the leading indicator of retention risk: sustained high absence is the physiological and psychological expression of a workforce under stress; staff who are repeatedly absent are telling the organisation something that the organisation needs to hear, and the response should be formulation (what is driving this?) not management (is this becoming a conduct issue?). The wellbeing survey completion rate measures whether staff trust the organisation enough to participate in its self-assessment; low completion rates in wellbeing surveys indicate either that the survey is burdensome and poorly designed or that staff do not believe their responses will be taken seriously. The exit interview completion rate closes the feedback loop: a home that routinely completes exit interviews with leavers builds a learning organisation; one that lets staff leave without a structured conversation loses the most candid feedback it will ever receive about its own conditions.
        </p>
      </div>
    </PageShell>
  );
}
