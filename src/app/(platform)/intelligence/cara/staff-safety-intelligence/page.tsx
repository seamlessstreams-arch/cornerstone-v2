"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Users, Heart, FileText } from "lucide-react";
import { useHomeStaffSafetyIntelligence } from "@/hooks/use-home-staff-safety-intelligence";
import type { HomeStaffSafetyResult, HomeStaffSafetyRating } from "@/lib/engines/home-staff-safety-intelligence-engine";

const RATING_META: Record<HomeStaffSafetyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffSafetyIntelligence();
  const d: HomeStaffSafetyResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Safety Intelligence" description="Analysing lone working coverage, debrief completion, grievance handling, and lone working risk assessments…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Safety Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.safety_rating];

  return (
    <PageShell
      title="Staff Safety Intelligence"
      description="Lone working risk assessment coverage, post-incident debrief completion and learning, grievance resolution, and lone working risk approval rates — evidencing that the home meets its legal duty to protect staff from foreseeable harm and supports the emotional and physical safety of those delivering care (Health & Safety at Work Act 1974; Management of Health & Safety at Work Regulations 1999; CHR 2015 Reg 33/34; HSE Lone Working guidance; Working Together to Safeguard Children 2023 duty to staff welfare)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Shield className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Safety score: {d.safety_score}/100 · lone working coverage {Math.round(d.lone_working.coverage_rate)}% · debrief completion {Math.round(d.debriefs.completion_rate)}% · grievance resolution {Math.round(d.grievance_profile.resolution_rate)}% · LWRA approval {Math.round(d.lwra.approval_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.lone_working.expired > 0 || d.lwra.overdue_review > 0 || d.debriefs.overdue > 0 || d.grievance_profile.critical_count > 0) && (
          <div className="flex flex-col gap-2">
            {d.lone_working.expired > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.lone_working.expired} lone working assessment{d.lone_working.expired > 1 ? "s" : ""} expired — an expired assessment means the home does not have a current, valid record of the risks a staff member faces when working alone; this is a failure of the legal duty under HSWA 1974 s.2 to ensure, so far as is reasonably practicable, the health, safety, and welfare of employees; expired assessments must be renewed before the staff member next works alone
              </div>
            )}
            {d.lwra.overdue_review > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.lwra.overdue_review} lone working risk assessment{d.lwra.overdue_review > 1 ? "s" : ""} overdue for review — the Management of Health & Safety at Work Regulations 1999 Regulation 3 requires risk assessments to be reviewed when there is reason to suspect they are no longer valid or when there has been a significant change; overdue reviews are a compliance gap and a safeguarding risk
              </div>
            )}
            {d.debriefs.overdue > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Heart className="h-3.5 w-3.5 flex-shrink-0" />
                {d.debriefs.overdue} overdue debrief{d.debriefs.overdue > 1 ? "s" : ""} — staff who have experienced a significant incident without a timely debrief are being left to manage the emotional impact without structured support; this affects staff wellbeing, reflective capacity, and the quality of subsequent care; it also means the home is not extracting the learning that prevents future incidents
              </div>
            )}
            {d.grievance_profile.critical_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.grievance_profile.critical_count} critical severity grievance{d.grievance_profile.critical_count > 1 ? "s" : ""} on record — critical grievances may indicate systemic management failures, harassment, or unsafe working conditions; they require urgent management attention and may have implications for the home's fitness to employ and the wellbeing of both staff and the children in their care
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Lone working records", value: d.lone_working.total_records, color: "text-blue-600" },
            { label: "Debriefs total", value: d.debriefs.total, color: "text-purple-600" },
            { label: "Grievances total", value: d.grievance_profile.total, color: "text-amber-600" },
            { label: "LWRAs total", value: d.lwra.total, color: "text-blue-600" },
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
              <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Lone Working Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Staff coverage rate" value={d.lone_working.coverage_rate} warn={90} />
              <RateBar label="Personal alarm issued rate" value={d.lone_working.alarm_rate} warn={80} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-emerald-600">{d.lone_working.current}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-amber-600">{d.lone_working.due_review}</p>
                  <p className="text-xs text-muted-foreground">Due review</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.lone_working.expired}</p>
                  <p className="text-xs text-muted-foreground">Expired</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                <span>{d.lone_working.unique_staff_covered} staff covered</span>
                <span>{d.lone_working.high_risk_count} high-risk assessments</span>
                <span>{d.lone_working.alarms_issued} alarms issued</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground" /> Post-Incident Debrief Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Debrief completion rate" value={d.debriefs.completion_rate} warn={90} />
              <RateBar label="Learning points rate" value={d.debriefs.learning_rate} warn={70} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{d.debriefs.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.debriefs.overdue}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                <span>{d.debriefs.high_impact_count} high-impact debriefs</span>
                <span>{d.debriefs.follow_up_needed_count} needing follow-up</span>
                <span>{d.debriefs.with_learning_points} with learning points</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> Grievance Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Resolution rate" value={d.grievance_profile.resolution_rate} warn={80} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-emerald-600">{d.grievance_profile.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-amber-600">{d.grievance_profile.open}</p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.grievance_profile.critical_count}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /> Lone Working Risk Assessments (LWRA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="LWRA approval rate" value={d.lwra.approval_rate} warn={90} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-emerald-600">{d.lwra.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-amber-600">{d.lwra.not_approved}</p>
                  <p className="text-xs text-muted-foreground">Not approved</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.lwra.overdue_review}</p>
                  <p className="text-xs text-muted-foreground">Overdue review</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{d.lwra.high_risk_count} high-risk LWRA{d.lwra.high_risk_count !== 1 ? "s" : ""} on record</p>
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
                   <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
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
                    <li key={i} className="text-xs flex gap-2"><CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
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
          Staff safety is the operational condition that makes therapeutic care possible. A staff team that does not feel physically or emotionally safe cannot provide the regulated, relationship-based, trauma-informed care that children in residential settings need. The Health & Safety at Work Act 1974 places an absolute duty on the employer to ensure, so far as is reasonably practicable, the health, safety, and welfare at work of all employees — this duty is not discharged by policy alone but by active risk management, training, monitoring, and responsive support. Lone working is one of the highest risk operational contexts in residential care: staff working without a colleague present are more vulnerable to physical harm, to the cumulative emotional weight of difficult interactions, and to making decisions without peer oversight; lone working risk assessments and check-in protocols are the structural safeguards that manage this risk, and their currency and completeness are therefore a legal and regulatory requirement. Post-incident debriefs are not a nice-to-have — they are the mechanism through which staff process trauma, maintain emotional availability, and generate the learning that prevents recurrence; homes with high debrief completion rates have demonstrably better staff retention, lower absence, and stronger reflective cultures. The grievance framework is the last-resort indicator of workplace health: a home with unresolved critical grievances has a systemic management or culture problem that will manifest in the quality of care delivered to children; resolution rates and response times are the operational measures of whether the home takes staff welfare seriously. Together, these indicators form the staff safety framework that Ofsted and CQC assess as a component of the home's overall fitness and the registered manager's competence.
        </p>
      </div>
    </PageShell>
  );
}
