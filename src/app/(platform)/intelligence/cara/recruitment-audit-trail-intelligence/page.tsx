"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserSearch, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeRecruitmentAuditTrailIntelligence } from "@/hooks/use-home-recruitment-audit-trail-intelligence";
import type { RecruitmentAuditTrailResult, RecruitmentAuditRating } from "@/lib/engines/home-recruitment-audit-trail-intelligence-engine";

const RATING_META: Record<RecruitmentAuditRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function RecruitmentAuditTrailIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeRecruitmentAuditTrailIntelligence();
  const d = (raw as { data?: RecruitmentAuditTrailResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Recruitment Audit Trail Intelligence" description="Analysing recruitment audit completeness, conditional offer tracking, exceptional start compliance, and audit depth data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Recruitment Audit Trail Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load recruitment audit trail data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.audit_rating];

  return (
    <PageShell
      title="Recruitment Audit Trail Intelligence"
      description="Recruitment audit completeness, notes coverage, state tracking quality, conditional offer management, exceptional start compliance, and audit depth — evidencing that the home's safer recruitment processes are documented with sufficient rigour to withstand regulatory scrutiny and to protect children from the risk of unsuitable staff (CHR 2015 Reg 32, Sch 2; Safer Recruitment guidance; DBS requirements)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <UserSearch className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Audit score: {d.audit_score}/100 · {d.total_audit_entries} entries · {d.unique_candidates_audited} candidates · completeness {Math.round(d.audit_completeness_rate)}% · exceptional start compliance {Math.round(d.exceptional_start_compliance)}% · vacancy fill {Math.round(d.vacancy_fill_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.audit_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.audit_completeness_rate < 80 || d.exceptional_start_compliance < 90 || d.notes_coverage_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.audit_completeness_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Audit completeness rate {Math.round(d.audit_completeness_rate)}% — incomplete recruitment audit trails are a significant safeguarding risk; they mean the home cannot demonstrate that all required safer recruitment checks were completed before a person began working with children; Ofsted will treat incomplete audit trails as a serious concern
              </div>
            )}
            {d.exceptional_start_compliance < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Exceptional start compliance {Math.round(d.exceptional_start_compliance)}% — staff who started in exceptional circumstances (before all checks were returned) without proper documentation and risk assessment represent a direct safeguarding risk; exceptional starts must be time-limited, risk-assessed, and fully documented
              </div>
            )}
            {d.notes_coverage_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Notes coverage rate {Math.round(d.notes_coverage_rate)}% — recruitment decisions without documented rationale cannot be defended if challenged; notes coverage is the difference between a recruitment process that can be audited and one that relied on undocumented judgment calls
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total audit entries", value: d.total_audit_entries, color: "text-blue-600" },
            { label: "Candidates audited", value: d.unique_candidates_audited, color: "text-foreground" },
            { label: "Avg audit depth", value: d.average_audit_depth.toFixed(1), color: d.average_audit_depth >= 4 ? "text-emerald-600" : d.average_audit_depth >= 2.5 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><UserSearch className="h-4 w-4 text-muted-foreground" /> Audit Trail Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Audit completeness rate" value={d.audit_completeness_rate} warn={90} />
            <RateBar label="Notes coverage rate" value={d.notes_coverage_rate} warn={85} />
            <RateBar label="State tracking rate" value={d.state_tracking_rate} warn={90} />
            <RateBar label="Offers with conditions rate" value={d.offers_with_conditions_rate} warn={80} />
            <RateBar label="Exceptional start compliance" value={d.exceptional_start_compliance} warn={95} />
            <RateBar label="Vacancy fill rate" value={d.vacancy_fill_rate} warn={75} />
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
          CHR 2015 Regulation 32 and Schedule 2 — the registered person must ensure that fitness checks are carried out for all staff; these checks (DBS enhanced disclosure, references, right to work, identity verification, professional registration, health declaration) must be documented in full. The Disclosure and Barring Service Code of Practice and the Keeping Children Safe in Education guidance (as adapted for residential settings) set out the minimum information that must be gathered before a person starts working with children. Exceptional starts — where a person begins work before all checks are returned — are permitted only in very limited circumstances and require documented risk assessment, supervision arrangements, and a plan for completing outstanding checks; exceptional starts that are not managed to this standard represent an unmitigated safeguarding risk. Audit depth is a measure of whether the recruitment audit trail contains sufficient information to reconstruct the decision-making process: a shallow audit (application form and DBS only) cannot evidence that references were taken up, that gaps in employment were explored, or that concerns identified at interview were risk-assessed. The home's safer recruitment audit trail is one of the first things an Ofsted inspector will examine on an announced or unannounced visit.
        </p>
      </div>
    </PageShell>
  );
}
