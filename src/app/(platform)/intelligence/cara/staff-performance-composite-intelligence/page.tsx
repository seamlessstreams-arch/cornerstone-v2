"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffPerformanceCompositeIntelligence } from "@/hooks/use-home-staff-performance-composite-intelligence";
import type { StaffPerformanceCompositeResult, StaffPerformanceRating } from "@/lib/engines/home-staff-performance-composite-intelligence-engine";

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

export default function StaffPerformanceCompositeIntelligencePage() {
  const raw = useHomeStaffPerformanceCompositeIntelligence();
  const d = (raw as { data?: { data?: StaffPerformanceCompositeResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Performance Composite Intelligence" description="Analysing appraisal completion, supervision quality, training compliance, and objective achievement across the staff team…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Performance Composite Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff performance composite data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.performance_rating];

  return (
    <PageShell
      title="Staff Performance Composite Intelligence"
      description="A synthesised view of the staff team's performance across appraisals, supervision, training compliance, and objective achievement — evidencing that the home maintains a competent, developing, and accountable workforce that meets its obligations under CHR 2015 Regulation 35 (sufficient numbers of suitably qualified staff), Regulation 33 (fitness of workers), the Social Work England Professional Standards, and the Ofsted SCCIF 'suitable staffing' and 'leadership and management' judgement areas."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BarChart2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Performance score: {d.performance_score}/100 · appraisals {Math.round(d.appraisal_completion_rate)}% · supervision {Math.round(d.supervision_completion_rate)}% · training {Math.round(d.training_compliance_rate)}% · avg competency {d.average_competency_score}/10
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.performance_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.expired_mandatory_count > 0 || d.appraisal_completion_rate < 80 || d.supervision_completion_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.expired_mandatory_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.expired_mandatory_count} expired mandatory training course{d.expired_mandatory_count > 1 ? "s" : ""} — expired mandatory training means the home cannot demonstrate that the staff member is currently competent in the area the training covers; Ofsted and CQC treat expired mandatory training as a direct fitness concern under CHR 2015 Regulation 35; safeguarding and restrictive-practice training in particular must be current at all times
              </div>
            )}
            {d.appraisal_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Appraisal completion rate {Math.round(d.appraisal_completion_rate)}% — staff without a current appraisal have not had their practice formally assessed against the role's competency framework; this is a CHR 2015 Regulation 35 concern and limits the manager's ability to identify development needs, performance issues, or safeguarding risks in individual practitioners
              </div>
            )}
            {d.supervision_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Supervision completion rate {Math.round(d.supervision_completion_rate)}% — regular supervision is the mechanism through which the home supports staff practice, manages risk, and provides professional accountability; staff who are not being regularly supervised are more vulnerable to cumulative stress, professional drift, and practice deterioration
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Appraisals", value: d.total_appraisals, color: "text-blue-600" },
            { label: "Supervisions", value: d.total_supervisions, color: "text-purple-600" },
            { label: "Training records", value: d.total_training, color: "text-emerald-600" },
            { label: "Expired mandatory", value: d.expired_mandatory_count, color: d.expired_mandatory_count > 0 ? "text-red-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><BarChart2 className="h-4 w-4 text-muted-foreground" /> Appraisal & Competency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Appraisal completion rate" value={d.appraisal_completion_rate} warn={90} />
              <RateBar label="Objective achievement rate" value={d.objective_achievement_rate} warn={75} />
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span>Average competency score</span>
                <span className="font-medium text-foreground">{d.average_competency_score}/10</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Supervision Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Supervision completion rate" value={d.supervision_completion_rate} warn={90} />
              <RateBar label="Safeguarding discussion rate" value={d.safeguarding_discussion_rate} warn={85} />
              <RateBar label="Action completion rate" value={d.action_completion_rate} warn={80} />
              <RateBar label="Wellbeing check rate" value={d.wellbeing_check_rate} warn={75} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Training Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <RateBar label="Mandatory training compliance rate" value={d.training_compliance_rate} warn={95} />
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
          The staff performance composite is the single metric that answers whether the home has a workforce that is not only present but competent, developing, and accountable. CHR 2015 Regulation 35 requires the registered manager to ensure that sufficient numbers of suitably qualified, skilled, experienced, and competent staff are working at the home at all times — the word "competent" is doing significant work here: it is not enough to be present; each staff member must be able to evidence the knowledge and skills that the role requires. The three pillars of workforce competence are appraisal (which formally assesses performance against the competency framework and sets development objectives), supervision (which provides the ongoing reflective space in which practice is examined, risks are managed, and professional accountability is maintained), and training (which ensures that the knowledge base is current, particularly for high-stakes areas like safeguarding, restrictive practices, and medication management). A composite view across all three allows the manager to see where the workforce is strong and where gaps are accumulating — and to act before individual gaps become systemic risks. The average competency score and objective achievement rate are the leading indicators of workforce development direction: a workforce where competency scores are rising and objectives are being achieved is a workforce that is developing; one where scores are static or falling is a workforce in which development investment is not translating into practice change, which is the most important management signal to act on.
        </p>
      </div>
    </PageShell>
  );
}
