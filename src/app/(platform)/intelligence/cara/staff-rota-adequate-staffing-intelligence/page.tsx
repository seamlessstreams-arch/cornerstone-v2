"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffRotaAdequateStaffingIntelligence } from "@/hooks/use-home-staff-rota-adequate-staffing-intelligence";
import type { StaffRotaResult, StaffRotaRating } from "@/lib/engines/home-staff-rota-adequate-staffing-intelligence-engine";

const RATING_META: Record<StaffRotaRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffRotaAdequateStaffingIntelligencePage() {
  const raw = useHomeStaffRotaAdequateStaffingIntelligence();
  const d = (raw as { data?: { data?: StaffRotaResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Rota & Adequate Staffing Intelligence" description="Analysing shift coverage, staff-to-child ratios, overtime levels, agency usage, rota planning quality, and staffing satisfaction…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Rota & Adequate Staffing Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load rota & adequate staffing data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.staffing_rating];

  return (
    <PageShell
      title="Staff Rota & Adequate Staffing Intelligence"
      description="Shift coverage rates and handover quality, staff-to-child ratio compliance, overtime and excessive hours monitoring, agency staff usage and integration, and rota planning quality — evidencing that the home consistently deploys sufficient qualified staff to meet children's needs safely and in accordance with its statement of purpose (CHR 2015 Reg 12 & 35; National Minimum Standards for Children's Homes; Ofsted SCCIF 'suitable staffing'; Working Time Regulations 1998; safe staffing principles from NICE and NHS Improvement)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Calendar className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Staffing score: {d.staffing_score}/100 · shift coverage {Math.round(d.shift_coverage_rate)}% · ratio compliance {Math.round(d.ratio_compliance_rate)}% · overtime {Math.round(d.overtime_rate)}% · agency {Math.round(d.agency_usage_rate)}% · rota planning {Math.round(d.rota_planning_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.staffing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.ratio_compliance_rate < 90 || d.shift_coverage_rate < 85 || d.overtime_rate > 30) && (
          <div className="flex flex-col gap-2">
            {d.ratio_compliance_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Staff-to-child ratio compliance {Math.round(d.ratio_compliance_rate)}% — CHR 2015 Regulation 12 requires the home to deploy sufficient staff to meet the needs of the children accommodated; staff-to-child ratios are not minimums — they are the framework within which safe, relationship-based care can be delivered; shifts where ratios fall below the required levels are shifts where children's needs may not be met and where the risk of incidents increases
              </div>
            )}
            {d.shift_coverage_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Shift coverage rate {Math.round(d.shift_coverage_rate)}% — uncovered shifts mean children are being cared for by fewer staff than planned; the planned staffing model is based on an assessment of children's needs, and actual coverage below that model represents a gap between the care that was designed and the care that was delivered; persistent coverage gaps are a Regulation 35 compliance issue
              </div>
            )}
            {d.overtime_rate > 30 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Overtime rate {Math.round(d.overtime_rate)}% — high overtime indicates a gap between the workforce capacity on the rota and the operational requirement; while overtime may be necessary at times, sustained high overtime is a risk indicator for staff fatigue, Working Time Regulations compliance, and workforce wellbeing; fatigued staff are more likely to be reactive in their practice, less emotionally available, and more prone to error
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Shift records", value: d.total_shift_records, color: "text-blue-600" },
            { label: "Ratio records", value: d.total_ratio_records, color: "text-blue-600" },
            { label: "Overtime records", value: d.total_overtime_records, color: "text-blue-600" },
            { label: "Agency records", value: d.total_agency_records, color: "text-blue-600" },
            { label: "Rota records", value: d.total_rota_records, color: "text-blue-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Staffing Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Shift coverage rate" value={d.shift_coverage_rate} warn={90} />
            <RateBar label="Staff-to-child ratio compliance rate" value={d.ratio_compliance_rate} warn={95} />
            <RateBar label="Overtime rate" value={d.overtime_rate} warn={20} />
            <RateBar label="Agency usage rate" value={d.agency_usage_rate} warn={20} />
            <RateBar label="Rota planning quality rate" value={d.rota_planning_rate} warn={80} />
            <RateBar label="Staff satisfaction rate" value={d.staff_satisfaction_rate} warn={70} />
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
          Adequate staffing is the single most fundamental operational requirement of a residential children's home. Every other quality indicator — therapeutic practice, recording quality, safeguarding response, relational care — depends on having enough of the right staff in the right place at the right time. CHR 2015 Regulation 35 requires the registered manager to ensure that there are, at all times, sufficient numbers of suitably qualified, skilled, experienced, and competent staff working at the home; Regulation 12 requires that staffing arrangements meet the needs of the children accommodated. These are absolute requirements, not aspirational targets: a home that consistently falls below its required staffing levels is not meeting its regulatory obligations regardless of the quality of the staff who are present. The overtime and agency usage rates are the leading indicators of structural staffing problems: sustained high overtime suggests that the establishment has been set below the operational requirement, that recruitment is failing to keep pace with attrition, or that absence is consuming the available workforce; sustained high agency usage is expensive and dilutes the consistency of relationships that residential care children need; both are early warning signals that require active management rather than reactive cover arrangements. The staff satisfaction rate within the staffing framework measures whether staff feel that rota and deployment decisions are fair, predictable, and compatible with their wellbeing — dissatisfied staff are more likely to leave, which creates the vacancy cycle that drives further agency usage and overtime.
        </p>
      </div>
    </PageShell>
  );
}
