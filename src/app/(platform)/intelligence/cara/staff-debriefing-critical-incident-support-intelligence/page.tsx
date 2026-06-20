"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffDebriefingCriticalIncidentSupportIntelligence } from "@/hooks/use-home-staff-debriefing-critical-incident-support-intelligence";
import type { StaffDebriefingResult, StaffDebriefingRating } from "@/lib/engines/home-staff-debriefing-critical-incident-support-intelligence-engine";

const RATING_META: Record<StaffDebriefingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffDebriefingCriticalIncidentSupportPage() {
  const { data, isLoading, error } = useHomeStaffDebriefingCriticalIncidentSupportIntelligence();
  const d: StaffDebriefingResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Debriefing & Critical Incident Support Intelligence" description="Analysing critical incident debriefing, timeliness, wellbeing follow-up, learning extraction, and support access…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Debriefing & Critical Incident Support Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff debriefing & critical incident support data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.debriefing_rating];

  return (
    <PageShell
      title="Staff Debriefing & Critical Incident Support Intelligence"
      description="Structured debriefing coverage following critical incidents, debrief timeliness, wellbeing follow-up, learning extraction and implementation, formal support access and barriers — evidencing that the home deploys a systemic, trauma-informed approach to staff support that converts difficult experiences into learning, protects staff psychological safety, and meets its duty of care under health and safety and workforce regulations (CHR 2015 Reg 16 & 34; HSWA 1974; NHS-HEE workforce wellbeing frameworks; trauma-informed employer standards)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldAlert className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Debriefing score: {d.debriefing_score}/100 · {d.total_debriefings} debriefings · {d.total_critical_incidents} critical incidents · completion {Math.round(d.debriefing_completion_rate)}% · offered within 24h {Math.round(d.offered_within_24h_rate)}% · learning implemented {Math.round(d.learning_implemented_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.debriefing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.debriefing_completion_rate < 80 || d.offered_within_24h_rate < 70 || d.support_barriers_rate > 30) && (
          <div className="flex flex-col gap-2">
            {d.debriefing_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Critical incident debriefing completion {Math.round(d.debriefing_completion_rate)}% — critical incidents by definition expose staff to the most psychologically intense events the role produces; leaving staff undebriefed after critical incidents is the fastest route to workforce trauma and the most direct risk factor for turnover; the completion rate should be close to 100%
              </div>
            )}
            {d.offered_within_24h_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Debrief offered within 24h rate {Math.round(d.offered_within_24h_rate)}% — research on trauma-informed workforce support consistently shows that the window between 24 and 72 hours is the optimal period for a structured debrief; debriefs offered after this window are less effective at processing the acute psychological response; early offer does not mean immediate completion — it means the manager has made contact and a debrief has been scheduled
              </div>
            )}
            {d.support_barriers_rate > 30 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Support barriers rate {Math.round(d.support_barriers_rate)}% — more than a third of staff who need formal support are encountering barriers; the most common barriers in residential care are stigma ("I should be able to cope"), availability (EAP referral wait times), and a culture that treats emotional reaction to traumatic events as weakness; these are systemic issues that require active leadership to address, not just better information about what is available
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Debriefings", value: d.total_debriefings, color: "text-blue-600" },
            { label: "Critical incidents", value: d.total_critical_incidents, color: d.total_critical_incidents === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Wellbeing follow-ups", value: d.total_wellbeing_followups, color: "text-blue-600" },
            { label: "Learning extractions", value: d.total_learning_extractions, color: "text-blue-600" },
            { label: "Support accesses", value: d.total_support_accesses, color: "text-blue-600" },
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
              <CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-muted-foreground" /> Debriefing & Incident Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Debriefing completion rate" value={d.debriefing_completion_rate} warn={90} />
              <RateBar label="Incident support rate" value={d.incident_support_rate} warn={85} />
              <RateBar label="Offered within 24 hours" value={d.offered_within_24h_rate} warn={80} />
              <RateBar label="Completed within 48 hours" value={d.completed_within_48h_rate} warn={75} />
              <RateBar label="Management response rate" value={d.management_response_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Follow-Up & Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Wellbeing follow-up rate" value={d.wellbeing_followup_rate} warn={80} />
              <RateBar label="Follow-up on time rate" value={d.followup_on_time_rate} warn={75} />
              <RateBar label="Learning extraction rate" value={d.learning_extraction_rate} warn={70} />
              <RateBar label="Learning implemented rate" value={d.learning_implemented_rate} warn={65} />
              <RateBar label="Support access rate" value={d.support_access_rate} warn={70} />
              <RateBar label="Staff satisfaction rate" value={d.staff_satisfaction_rate} warn={70} />
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
          Critical incidents — physical assaults involving injury, serious self-harm events, missing from care that results in harm, allegations against staff, unexpected deaths — are the events that most acutely test the psychological resilience of staff teams. The research evidence on occupational trauma in caring professions is unambiguous: structured debriefing following these events, offered within 24-72 hours, significantly reduces the risk of secondary traumatic stress disorder, shortens recovery time, and increases the likelihood that the member of staff returns to effective practice. It also has a secondary benefit: the learning extraction rate measures whether critical incidents are generating actionable learning, which is the only way in which repeated exposure to the same type of incident can be prevented. A home that debrief its staff well after critical incidents is a home that gets better at preventing the conditions that produce those incidents; a home that does not is a home that keeps repeating the same mistakes while its staff become progressively more traumatised and less capable of the attuned, relational practice that children need. The support barriers rate is the systemic indicator: it measures whether the organisation has created the conditions in which staff feel safe to access support, which requires active cultural work, not just the provision of an EAP phone number.
        </p>
      </div>
    </PageShell>
  );
}
