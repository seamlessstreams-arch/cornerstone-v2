"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffDevelopmentIntelligence } from "@/hooks/use-home-staff-development-intelligence";
import type { HomeStaffDevelopmentResult, StaffDevelopmentRating } from "@/lib/engines/home-staff-development-intelligence-engine";

const RATING_META: Record<StaffDevelopmentRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffDevelopmentIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffDevelopmentIntelligence();
  const d: HomeStaffDevelopmentResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Development Intelligence" description="Analysing supervision, training compliance, qualifications, inductions, and workforce development health…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Development Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff development data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.staff_development_rating];
  const { supervision, training, qualifications, inductions } = d;

  return (
    <PageShell
      title="Staff Development Intelligence"
      description="Supervision completion rates and wellbeing scores, mandatory training compliance, qualification progression, induction quality and probation outcomes — evidencing a learning organisation that invests in the professional development of its workforce at every stage from induction through to qualification and continuous professional development (CHR 2015 Reg 32, 33 & 35; Level 3 Diploma in Residential Childcare; Social Care Wales/Skills for Care; Working Together to Safeguard Children; Ofsted SCCIF staff development indicators)."
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
                  Development score: {d.staff_development_score}/100 · supervision {Math.round(supervision.completion_rate_6m)}% · training compliance {Math.round(training.mandatory_compliance_rate)}% · qualifications {Math.round(qualifications.mandatory_completion_rate)}% · inductions {inductions.completed_count}/{inductions.total_inductions}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.staff_development_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(supervision.overdue_count > 0 || training.expired_count > 0 || inductions.overdue_count > 0) && (
          <div className="flex flex-col gap-2">
            {supervision.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {supervision.overdue_count} supervision{supervision.overdue_count > 1 ? "s" : ""} overdue — CHR 2015 Regulation 33 requires regular supervision for all staff; supervision is the primary governance mechanism for monitoring practice quality, identifying concerns, providing support, and maintaining the registered manager's oversight of the workforce; overdue supervisions are a compliance gap that will be examined by an Ofsted inspector
              </div>
            )}
            {training.expired_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {training.expired_count} training record{training.expired_count > 1 ? "s" : ""} expired — staff with expired mandatory training (safeguarding, first aid, medication, fire safety) are working outside the competency framework the home's insurance, risk management, and regulatory compliance depends on; expired training is an active compliance risk, not a future one
              </div>
            )}
            {inductions.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {inductions.overdue_count} induction{inductions.overdue_count > 1 ? "s" : ""} overdue — staff with incomplete inductions may be working with children before they have been introduced to the home's therapeutic approach, safeguarding procedures, or emergency protocols; an incomplete induction is a safety issue as well as a development issue
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Supervisions overdue", value: supervision.overdue_count, color: supervision.overdue_count === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Training expired", value: training.expired_count, color: training.expired_count === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Qualifications in progress", value: qualifications.in_progress_count, color: "text-blue-600" },
            { label: "Inductions completed", value: inductions.completed_count, color: "text-blue-600" },
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
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" /> Supervision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Supervision completion rate (6m)" value={supervision.completion_rate_6m} warn={85} />
              <RateBar label="Dual signature rate" value={supervision.dual_signature_rate} warn={90} />
              {supervision.avg_wellbeing_score !== null && (
                <div className="text-xs text-muted-foreground pt-1">
                  Average wellbeing score: <span className={`font-medium ${(supervision.avg_wellbeing_score ?? 0) < 5 ? "text-red-600" : "text-foreground"}`}>{supervision.avg_wellbeing_score?.toFixed(1)}/10</span>
                  {supervision.low_wellbeing_staff.length > 0 && (
                    <span className="ml-2 text-amber-600">({supervision.low_wellbeing_staff.length} staff below 5)</span>
                  )}
                </div>
              )}
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1 pt-1">
                <div>Completed (6m): <span className="font-medium text-foreground">{supervision.total_completed_6m}</span></div>
                <div>Scheduled: <span className="font-medium text-foreground">{supervision.total_scheduled}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Training & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Mandatory training compliance" value={training.mandatory_compliance_rate} warn={90} />
              <RateBar label="Mandatory qualification completion" value={qualifications.mandatory_completion_rate} warn={80} />
              <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1 pt-1">
                <div>Training records: <span className="font-medium text-foreground">{training.total_records}</span></div>
                <div>Expiring soon: <span className={`font-medium ${training.expiring_soon_count > 0 ? "text-amber-600" : "text-foreground"}`}>{training.expiring_soon_count}</span></div>
                <div>Quals in progress: <span className="font-medium text-foreground">{qualifications.in_progress_count}</span></div>
                <div>Not started: <span className={`font-medium ${qualifications.not_started_count > 0 ? "text-amber-600" : "text-foreground"}`}>{qualifications.not_started_count}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /> Induction Programme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Total inductions", value: inductions.total_inductions },
                { label: "Completed", value: inductions.completed_count },
                { label: "In progress", value: inductions.in_progress_count },
                { label: "Overdue", value: inductions.overdue_count },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <RateBar label="Probation pass rate" value={inductions.probation_pass_rate} warn={85} />
            {inductions.avg_completion_rate > 0 && (
              <div className="mt-3">
                <RateBar label="Average in-progress completion rate" value={inductions.avg_completion_rate} warn={60} />
              </div>
            )}
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
          Staff development in residential children's care is not a nice-to-have — it is the operational mechanism through which a home ensures that the people delivering care are equipped to do so safely and effectively. CHR 2015 Regulation 32 sets the minimum requirement: staff must have the qualifications, skills, and experience appropriate to the children they care for; Regulation 33 requires the manager to monitor and support staff wellbeing; Regulation 35 requires that the home has a sufficient number of suitably qualified, skilled, and experienced staff at all times. The supervision rate is the manager's primary tool for fulfilling these regulations: without regular supervision, the manager cannot know how individual staff members are developing, what support they need, or whether their practice is of the standard required. The training compliance rate is the safety floor: staff with expired mandatory training are working without the competency baseline the role requires. The qualification rate is the development indicator: the Level 3 Diploma in Residential Childcare (or equivalent) is the professional benchmark for residential care workers, and a home where a significant proportion of staff do not hold or are not working towards this qualification is a home that has not fully committed to professional practice as a standard. The induction programme is the onboarding gateway: staff who are not properly inducted into the home's therapeutic model, safeguarding procedures, and operational expectations are more likely to make avoidable errors and less likely to stay.
        </p>
      </div>
    </PageShell>
  );
}
