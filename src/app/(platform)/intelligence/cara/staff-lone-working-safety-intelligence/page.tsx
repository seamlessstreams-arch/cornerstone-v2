"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffLoneWorkingSafetyIntelligence } from "@/hooks/use-home-staff-lone-working-safety-intelligence";
import type { StaffLoneWorkingResult, StaffLoneWorkingRating } from "@/lib/engines/home-staff-lone-working-safety-intelligence-engine";

const RATING_META: Record<StaffLoneWorkingRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
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

export default function StaffLoneWorkingSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffLoneWorkingSafetyIntelligence();
  const d: StaffLoneWorkingResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Lone Working Safety Intelligence" description="Analysing lone working risk assessments, check-in compliance, safety protocols, communication devices, and incident reporting…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Lone Working Safety Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff lone working safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.lone_working_rating];

  return (
    <PageShell
      title="Staff Lone Working Safety Intelligence"
      description="Lone working risk assessment coverage, check-in protocol compliance, safety procedure documentation, communication device availability, incident reporting completeness, and staff confidence — evidencing that the home's lone working arrangements protect staff safety and meet its duty of care under health and safety law (Health and Safety at Work Act 1974 s.2; Management of Health and Safety at Work Regulations 1999 Reg 3 & 16; CHR 2015 Reg 12; HSE Lone Working guidance; Suzy Lamplugh Trust professional lone working standards)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lone working score: {d.lone_working_score}/100 · risk assessments {Math.round(d.risk_assessment_rate)}% · check-ins {Math.round(d.check_in_compliance_rate)}% · protocols {Math.round(d.safety_protocol_rate)}% · devices {Math.round(d.communication_device_rate)}% · confidence {Math.round(d.staff_confidence_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.lone_working_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.risk_assessment_rate < 90 || d.check_in_compliance_rate < 85 || d.communication_device_rate < 85 || d.refresher_overdue_count > 0) && (
          <div className="flex flex-col gap-2">
            {d.risk_assessment_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Lone working risk assessment coverage {Math.round(d.risk_assessment_rate)}% — Management of Health and Safety at Work Regulations 1999 Regulation 3 requires the employer to undertake a suitable and sufficient assessment of the risks to employees, including lone workers; a gap in lone working risk assessments means that hazards have not been systematically identified and control measures have not been put in place, leaving both the employer and the lone worker exposed
              </div>
            )}
            {d.check_in_compliance_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Check-in compliance rate {Math.round(d.check_in_compliance_rate)}% — check-in protocols are the operational mechanism that converts a lone working policy into a safety system; a lone worker who does not check in as required cannot be monitored for non-response, meaning that in the event of an incident, the escalation system fails; this is the single most important procedural element of lone working safety
              </div>
            )}
            {d.communication_device_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Communication device coverage {Math.round(d.communication_device_rate)}% — staff who do not have a working communication device during lone working shifts cannot check in, call for assistance, or raise an alarm; device coverage is the hardware foundation of the lone working safety system; gaps in coverage are an immediate operational risk
              </div>
            )}
            {d.refresher_overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.refresher_overdue_count} lone working training refresher{d.refresher_overdue_count > 1 ? "s" : ""} overdue — lone working training is not a one-off induction activity; procedures change, new staff join, and existing staff can develop complacency; regular refresher training maintains the competency baseline and provides an opportunity to address emerging risks
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Risk assessments", value: d.total_risk_assessments, color: "text-blue-600" },
            { label: "Check-ins recorded", value: d.total_check_ins, color: "text-blue-600" },
            { label: "Communication devices", value: d.total_devices, color: "text-blue-600" },
            { label: "Incidents reported", value: d.total_incidents, color: d.total_incidents === 0 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Lone Working Safety Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Lone working risk assessment rate" value={d.risk_assessment_rate} warn={95} />
            <RateBar label="Check-in protocol compliance rate" value={d.check_in_compliance_rate} warn={90} />
            <RateBar label="Safety protocol documentation rate" value={d.safety_protocol_rate} warn={90} />
            <RateBar label="Communication device coverage rate" value={d.communication_device_rate} warn={90} />
            <RateBar label="Incident reporting completion rate" value={d.incident_reporting_rate} warn={95} />
            <RateBar label="Staff confidence rate" value={d.staff_confidence_rate} warn={80} />
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
          Lone working is a defining feature of residential children's care — sleep-in shifts, night working, early morning or late evening shifts, and community outreach all involve staff working without immediate colleague support. The Health and Safety at Work Act 1974 Section 2 places a general duty on employers to ensure, so far as is reasonably practicable, the health, safety, and welfare of employees; the Management of Health and Safety at Work Regulations 1999 Regulation 16 specifically requires employers to take particular account of lone workers, who are at greater risk because they cannot call on a colleague for immediate assistance. The practical consequence of this duty is a structured lone working framework: individual risk assessments that identify the specific hazards of each role and environment; a check-in protocol that provides a systematic way of monitoring lone workers and escalating non-responses; communication devices that work reliably in the home's environment; and clear incident reporting procedures that capture near-misses as well as actual incidents. The staff confidence rate is the human complement to the procedural indicators: a lone working policy that staff do not trust or understand is not a functioning safety system, regardless of how well it is documented; regular training, clear communication, and visible management commitment are the conditions that produce genuine staff confidence in lone working safety.
        </p>
      </div>
    </PageShell>
  );
}
