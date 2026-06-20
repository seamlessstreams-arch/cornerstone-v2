"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffInductionOnboardingIntelligence } from "@/hooks/use-home-staff-induction-onboarding-intelligence";
import type { StaffInductionOnboardingResult, InductionOnboardingRating } from "@/lib/engines/home-staff-induction-onboarding-intelligence-engine";

const RATING_META: Record<InductionOnboardingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffInductionOnboardingIntelligencePage() {
  const raw = useHomeStaffInductionOnboardingIntelligence();
  const d = (raw as { data?: { data?: StaffInductionOnboardingResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Induction & Onboarding Intelligence" description="Analysing induction completion, safeguarding coverage, shadowing quality, handbook acknowledgement, and lone-working readiness…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Induction & Onboarding Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff induction & onboarding data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.induction_rating];

  return (
    <PageShell
      title="Staff Induction & Onboarding Intelligence"
      description="Induction completion rates across permanent and agency staff, safeguarding and medication training coverage in induction, supervised shadowing quality and competency sign-off, policy handbook acknowledgement, and lone-working readiness — evidencing that all staff are properly inducted before working with children and that the home's onboarding programme meets both regulatory and therapeutic care quality requirements (CHR 2015 Reg 33 & 35; Skills for Care Common Induction Standards; Working Together to Safeguard Children; Ofsted SCCIF workforce quality indicators)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <UserCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Induction score: {d.induction_score}/100 · {d.total_inductions} inductions · completion {Math.round(d.completion_rate)}% · safeguarding {Math.round(d.safeguarding_coverage_rate)}% · medication {Math.round(d.medication_coverage_rate)}% · handbook {Math.round(d.handbook_acknowledgement_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.induction_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.safeguarding_coverage_rate < 95 || d.completion_rate < 80 || d.lone_working_readiness_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.safeguarding_coverage_rate < 95 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Safeguarding induction coverage {Math.round(d.safeguarding_coverage_rate)}% — every member of staff must receive safeguarding training as part of their induction before working with children; staff who have not received this training cannot identify indicators of abuse, cannot respond appropriately to disclosures, and cannot meet their mandatory reporting obligations; this is the highest-priority induction component from a child protection perspective
              </div>
            )}
            {d.completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Induction completion rate {Math.round(d.completion_rate)}% — staff who have not completed their induction may be working with children without having been introduced to the home's therapeutic model, emergency procedures, or conduct standards; incomplete inductions are both a compliance gap (CHR 2015 Reg 33) and a practice quality risk
              </div>
            )}
            {d.lone_working_readiness_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Lone-working readiness rate {Math.round(d.lone_working_readiness_rate)}% — staff who are not lone-working ready may be placed in situations where they are unsupported and unprepared; lone-working readiness includes knowing the lone-working protocol, having completed the relevant risk assessment, and having demonstrated sufficient competency during supervised shifts; deploying staff who are not lone-working ready is a safety risk
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><UserCheck className="h-4 w-4 text-muted-foreground" /> Induction & Onboarding Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Induction completion rate" value={d.completion_rate} warn={90} />
            <RateBar label="Agency staff induction completion rate" value={d.agency_induction_completion_rate} warn={90} />
            <RateBar label="Safeguarding training coverage rate" value={d.safeguarding_coverage_rate} warn={98} />
            <RateBar label="Medication training coverage rate" value={d.medication_coverage_rate} warn={90} />
            <RateBar label="Fire safety training coverage rate" value={d.fire_safety_coverage_rate} warn={95} />
            <RateBar label="Shadowing completion rate" value={d.shadowing_completion_rate} warn={85} />
            <RateBar label="Shadowing competency sign-off rate" value={d.shadowing_competency_rate} warn={80} />
            <RateBar label="Handbook acknowledgement rate" value={d.handbook_acknowledgement_rate} warn={90} />
            <RateBar label="Lone-working readiness rate" value={d.lone_working_readiness_rate} warn={85} />
          </CardContent>
        </Card>

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

        <p className="text-xs text-muted-foreground border-t pt-3">
          The induction programme is the first and most critical stage of the staff development lifecycle in residential children's care. A well-structured induction introduces new staff to the home's therapeutic model, its values, its children, and its operational and safeguarding procedures before they work unsupervised with children — this sequencing is not optional. CHR 2015 Regulation 33 requires the registered manager to ensure that all staff receive appropriate training and induction, and Regulation 35 requires that staff are suitable for their roles; a member of staff who has not completed a safeguarding induction is not yet suitable to work unsupervised with children, regardless of their previous experience. The shadowing programme is the bridge between classroom induction and independent practice: it allows new staff to observe experienced colleagues, to ask questions in context, and to be assessed against competency criteria before they are expected to manage complex situations alone. The agency staff induction rate is a separate indicator because agency workers present a particular risk: they often arrive with little knowledge of the home's specific children, therapeutic model, or emergency procedures, and their competency assumptions are based on general experience rather than this-home knowledge; an agency worker who is not inducted is effectively unknown to the home's quality framework.
        </p>
      </div>
    </PageShell>
  );
}
