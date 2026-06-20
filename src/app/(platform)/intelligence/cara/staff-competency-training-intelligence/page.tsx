"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffCompetencyTrainingIntelligence } from "@/hooks/use-home-staff-competency-training-intelligence";
import type { StaffCompetencyResult, StaffCompetencyRating } from "@/lib/engines/home-staff-competency-training-intelligence-engine";

const RATING_META: Record<StaffCompetencyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffCompetencyTrainingIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffCompetencyTrainingIntelligence();
  const d: StaffCompetencyResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Competency & Training Intelligence" description="Analysing competency assessment coverage, training compliance, CPD engagement, handbook acknowledgement, and workforce capability…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Competency & Training Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff competency training data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.competency_rating];

  return (
    <PageShell
      title="Staff Competency & Training Intelligence"
      description="Competency assessment coverage, mandatory training compliance, CPD engagement and professional development, policy handbook acknowledgement, and overall workforce capability ratings — evidencing that the home deploys only competent, trained staff and invests in continuous professional development that keeps pace with evolving practice standards (CHR 2015 Reg 32 & 33; Level 3 Diploma in Residential Childcare; Social Care Wales/Skills for Care workforce standards; Ofsted SCCIF workforce quality indicators)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <GraduationCap className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Competency score: {d.competency_score}/100 · assessed {Math.round(d.staff_assessed_rate)}% · competent+ {Math.round(d.competent_or_above_rate)}% · training compliance {Math.round(d.training_compliance_rate)}% · CPD {Math.round(d.cpd_engagement_rate)}% · handbook {Math.round(d.handbook_acknowledgement_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.competency_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.staff_assessed_rate < 80 || d.training_compliance_rate < 85 || d.competent_or_above_rate < 75) && (
          <div className="flex flex-col gap-2">
            {d.staff_assessed_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Competency assessment coverage {Math.round(d.staff_assessed_rate)}% — CHR 2015 Regulation 32 requires the registered manager to ensure all staff are fit for their role and to evidence this; staff who have not been formally assessed cannot be demonstrated to be competent; an Ofsted inspection will examine competency assessment records as part of its evaluation of staff fitness, and gaps will be identified as a concern
              </div>
            )}
            {d.training_compliance_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Training compliance {Math.round(d.training_compliance_rate)}% — staff who are not up to date with mandatory training (safeguarding, fire safety, first aid, medication, physical intervention) are working outside the safety framework that the home's risk management depends on; mandatory training is not optional professional development — it is the baseline safety requirement for the role
              </div>
            )}
            {d.competent_or_above_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Competent or above rate {Math.round(d.competent_or_above_rate)}% — more than a quarter of assessed staff are below competent, meaning the home's therapeutic practice is being delivered by staff who have not yet demonstrated the skills the role requires; this is a significant workforce quality issue that requires a targeted development response, not just training provision
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /> Workforce Competency & Development Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Competency assessment coverage rate" value={d.staff_assessed_rate} warn={90} />
            <RateBar label="Competent or above in assessment" value={d.competent_or_above_rate} warn={85} />
            <RateBar label="Mandatory training compliance rate" value={d.training_compliance_rate} warn={90} />
            <RateBar label="CPD engagement rate" value={d.cpd_engagement_rate} warn={80} />
            <RateBar label="Policy handbook acknowledgement rate" value={d.handbook_acknowledgement_rate} warn={85} />
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
          The quality of care in a residential children's home is the sum of the competencies of the staff who deliver it. No policy, system, or therapeutic model can compensate for a staff team that lacks the skills to implement it. CHR 2015 Regulation 32 sets the minimum standard: every member of staff must have the knowledge, skills, and experience appropriate to the role; the registered manager must be satisfied that this is the case and must be able to evidence it. The competency assessment rate is the evidence baseline — without completed assessments, the manager cannot demonstrate compliance with Regulation 32, regardless of how confident they are in their team. The CPD engagement rate is the forward-looking indicator: a staff team that is not engaging with professional development is one that is becoming less qualified for a role that is growing more complex as the population of children in residential care presents with increasingly severe needs and as practice expectations continue to rise. The handbook acknowledgement rate is both a governance indicator and a liability indicator: staff who have not acknowledged the policies and procedures that govern their practice cannot be held to those standards in the same way; it also leaves the registered manager in a weaker position when managing conduct or capability, because a key element of the "reasonable instruction" test is that the instruction was communicated and received.
        </p>
      </div>
    </PageShell>
  );
}
