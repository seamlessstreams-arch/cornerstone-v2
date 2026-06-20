"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle, AlertTriangle, Clock, FileText } from "lucide-react";
import { useHomeAdmissionIntelligence } from "@/hooks/use-home-admission-intelligence";
import type { HomeAdmissionResult, AdmissionRating } from "@/lib/engines/home-admission-intelligence-engine";

const RATING_META: Record<AdmissionRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function AdmissionIntelligencePage() {
  const { data, isLoading, error } = useHomeAdmissionIntelligence();
  const d: HomeAdmissionResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Admission Intelligence" description="Analysing referral volumes, acceptance decisions, assessment quality, and occupancy…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Admission Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load admission data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.admission_rating];

  return (
    <PageShell
      title="Admission Intelligence"
      description="Referral acceptance rates, emergency admission volumes, matching and assessment quality, decision documentation compliance, days to decision, and occupancy — evidencing that the home manages its admissions process in a way that protects existing residents, makes evidence-based placement decisions, and fulfils its statement of purpose (CHR 2015 Regulation 4 — statement of purpose; Regulation 7 — matching and placement; Working Together to Safeguard Children 2023; Placements in Residential Special Schools and Homes: DfE Statutory Guidance)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <UserPlus className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Admission score: {d.admission_score}/100 · {d.referral_profile.total_referrals} referrals · acceptance {Math.round(d.referral_profile.acceptance_rate)}% · {d.referral_profile.emergency_count} emergency · occupancy {Math.round(d.quality_profile.occupancy_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.admission_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.assessment_profile.pending_over_14_days > 0 || d.assessment_profile.decision_documented_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.assessment_profile.pending_over_14_days > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.assessment_profile.pending_over_14_days} referral{d.assessment_profile.pending_over_14_days > 1 ? "s" : ""} pending decision for over 14 days — a referral that has been assessed but not decided within 14 days represents a child who remains in unsuitable or uncertain circumstances while a placement that may be available to them is not being confirmed; timely decision-making is a core operational expectation and reflects the home's capacity management and management oversight
              </div>
            )}
            {d.assessment_profile.decision_documented_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Decision documentation rate {Math.round(d.assessment_profile.decision_documented_rate)}% — every admission decision (accepted or declined) must be documented with the rationale; undocumented decisions cannot be audited, cannot demonstrate that the home's acceptance criteria were applied consistently, and cannot provide the evidence Ofsted requires under CHR 2015 Regulation 4 that the home is operating within its statement of purpose
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total referrals", value: d.referral_profile.total_referrals, color: "text-blue-600" },
            { label: "Active referrals", value: d.referral_profile.active, color: "text-amber-600" },
            { label: "Placed", value: d.referral_profile.placed, color: "text-emerald-600" },
            { label: "Emergency admissions", value: d.referral_profile.emergency_count, color: d.referral_profile.emergency_count > 2 ? "text-red-600" : "text-blue-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><UserPlus className="h-4 w-4 text-muted-foreground" /> Referral Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-emerald-600">{d.referral_profile.accepted}</p>
                  <p className="text-xs text-muted-foreground">Accepted</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.referral_profile.declined}</p>
                  <p className="text-xs text-muted-foreground">Declined</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-amber-600">{d.referral_profile.withdrawn}</p>
                  <p className="text-xs text-muted-foreground">Withdrawn</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{Math.round(d.referral_profile.acceptance_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Acceptance rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /> Assessment Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Impact assessment rate" value={d.assessment_profile.impact_assessment_rate} warn={90} />
              <RateBar label="Matching consideration rate" value={d.assessment_profile.matching_consideration_rate} warn={90} />
              <RateBar label="Decision documented rate" value={d.assessment_profile.decision_documented_rate} warn={95} />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Avg days to decision</span>
                <span className={`font-medium ${d.assessment_profile.avg_days_to_decision > 14 ? "text-red-600" : "text-foreground"}`}>{d.assessment_profile.avg_days_to_decision} days</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> Referral Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Occupancy rate" value={d.quality_profile.occupancy_rate} warn={75} />
              <RateBar label="Declined with reason rate" value={d.quality_profile.declined_with_reason_rate} warn={100} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex flex-col items-center rounded border bg-muted/30 p-2">
                  <p className="text-sm font-bold text-blue-600">{d.quality_profile.avg_needs_per_referral}</p>
                  <p className="text-xs text-muted-foreground text-center">Avg needs per referral</p>
                </div>
                <div className="flex flex-col items-center rounded border bg-muted/30 p-2">
                  <p className="text-sm font-bold text-amber-600">{d.quality_profile.avg_risk_factors_per_referral}</p>
                  <p className="text-xs text-muted-foreground text-center">Avg risk factors</p>
                </div>
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
          The admissions process is the single most consequential decision the registered manager makes: whether to accept a child into this home, at this time, with these presenting needs, alongside these existing residents. A poor admission decision — accepting a child whose needs exceed the home's competencies, or who presents a risk to existing residents that has not been assessed and managed — can cause harm to that child, harm to existing residents, and systemic disruption to the entire care environment that takes months to resolve. CHR 2015 Regulation 4 requires the statement of purpose to set out which children the home can and cannot accommodate; Regulation 7 requires that before a child is placed, the registered manager must consider whether the placement is suitable and whether the home can meet the child's needs. These are not tick-box requirements — they are the framework within which the manager exercises professional judgement about a decision that will shape a child's lived experience and the home's therapeutic capacity for years. The impact assessment rate measures whether this judgement is being structured and documented; the matching consideration rate measures whether the effect on existing residents is being explicitly considered; the decision documentation rate measures whether the process can be evidenced. Emergency admissions are the highest-risk category: a child placed in an emergency has not been through a proper matching process, existing residents have not been prepared, and the home is immediately managing a new set of needs without the information or the planning that a standard admission would generate. High emergency admission rates are therefore a safeguarding risk indicator as well as a care quality one.
        </p>
      </div>
    </PageShell>
  );
}
