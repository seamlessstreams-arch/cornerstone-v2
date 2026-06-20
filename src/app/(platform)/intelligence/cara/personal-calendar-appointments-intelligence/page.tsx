"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePersonalCalendarAppointmentsIntelligence } from "@/hooks/use-home-personal-calendar-appointments-intelligence";
import type { PersonalCalendarResult, PersonalCalendarRating } from "@/lib/engines/home-personal-calendar-appointments-intelligence-engine";

const RATING_META: Record<PersonalCalendarRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PersonalCalendarAppointmentsIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePersonalCalendarAppointmentsIntelligence();
  const d = (raw as { data?: PersonalCalendarResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Personal Calendar & Appointments" description="Analysing appointment attendance and calendar management data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Personal Calendar & Appointments" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load personal calendar appointments data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.calendar_rating];

  return (
    <PageShell
      title="Personal Calendar & Appointments"
      description="Appointment attendance rates, calendar accuracy, medical compliance, transport timeliness, child preparation, and child autonomy in appointment management — evidencing that children's personal appointments are reliably kept, that medical and health obligations are met, and that children are supported to develop age-appropriate independence over their own schedule (CHR 2015 Reg 7; NMS 3; Children Act 1989 s22)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <CalendarDays className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Calendar score: {d.calendar_score}/100 · attendance {Math.round(d.appointment_attendance_rate)}% · medical compliance {Math.round(d.medical_compliance_rate)}% · calendar accuracy {Math.round(d.calendar_accuracy_rate)}% · transport on time {Math.round(d.transport_timeliness_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.calendar_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.medical_compliance_rate < 80 || d.appointment_attendance_rate < 80 || d.child_preparation_rate < 60) && (
          <div className="flex flex-col gap-2">
            {d.medical_compliance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Medical compliance rate {Math.round(d.medical_compliance_rate)}% — missed medical appointments are a safeguarding concern; every child in care has a statutory entitlement to regular health assessments and the home has a duty to ensure that medical needs are identified and addressed
              </div>
            )}
            {d.appointment_attendance_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Appointment attendance {Math.round(d.appointment_attendance_rate)}% — high missed appointment rates indicate either planning failures, transport difficulties, or insufficient prioritisation of children's personal appointments; each missed appointment requires a documented reason
              </div>
            )}
            {d.child_preparation_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child preparation rate {Math.round(d.child_preparation_rate)}% — preparing children for appointments (explaining what will happen, why, who they will meet) is both good care practice and part of respecting children's right to understand what is happening in their lives; appointments sprung on children without preparation can increase anxiety
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /> Reliability & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Appointment attendance rate" value={d.appointment_attendance_rate} warn={90} />
              <RateBar label="Medical compliance rate" value={d.medical_compliance_rate} warn={95} />
              <RateBar label="Calendar accuracy rate" value={d.calendar_accuracy_rate} warn={90} />
              <RateBar label="Transport timeliness rate" value={d.transport_timeliness_rate} warn={85} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /> Child Experience & Autonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child preparation rate" value={d.child_preparation_rate} warn={80} />
              <RateBar label="Child autonomy rate" value={d.child_autonomy_rate} warn={60} />
              <div className="pt-2 text-xs text-muted-foreground rounded border bg-muted/30 px-3 py-2">
                Child autonomy measures the proportion of appointments where the child is supported to manage their own schedule in an age-appropriate way — booking reminders, knowing what the appointment is for, self-advocating in the appointment. This is a life-skills outcome, not just an attendance one.
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
          CHR 2015 Regulation 7 (promoting health and wellbeing) — the registered person must promote each child's physical, mental and emotional health. Statutory health assessments must take place within 28 days of a child entering care and then annually (bi-annually for children under 5); the home is expected to actively support children to attend and engage with health appointments. Dental checks, optician appointments, and CAMHS appointments sit alongside GP visits as part of a complete health picture; a child whose appointments are routinely missed may not have health needs identified and addressed in time. Children Act 1989 s22 — the child's wishes and feelings must be ascertained and given due weight when making decisions affecting them, including health and appointment decisions. Children who are prepared for appointments, who understand what will happen and why, and who are supported to self-advocate in appointments are better protected from harm and better equipped for independence. Transport failures are a significant barrier to appointment attendance in residential care — homes with poor transport planning are likely to show high missed appointment rates, and this should be treated as an operational failure requiring review, not a series of one-off incidents.
        </p>
      </div>
    </PageShell>
  );
}
