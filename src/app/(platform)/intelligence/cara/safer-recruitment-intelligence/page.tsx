"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSaferRecruitmentIntelligence } from "@/hooks/use-home-safer-recruitment-intelligence";
import type { HomeSaferRecruitmentResult, RecruitmentRating } from "@/lib/engines/home-safer-recruitment-intelligence-engine";

const RATING_META: Record<RecruitmentRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SaferRecruitmentIntelligencePage() {
  const { data, isLoading, error } = useHomeSaferRecruitmentIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Safer Recruitment Intelligence" description="Analysing DBS verification, check completion, reference quality, compliance profile, and safer recruitment process data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Safer Recruitment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load safer recruitment intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.recruitment_rating];
  const vac = d.vacancy_profile;
  const chk = d.checks_profile;
  const ref = d.reference_profile;
  const comp = d.compliance_profile;

  return (
    <PageShell
      title="Safer Recruitment Intelligence"
      description="DBS verification rates, pre-employment check completion, reference verification and quality, safeguarding reference coverage, candidate compliance status, and high-risk candidate identification — evidencing that every person working with children at this home has been through a complete, documented safer recruitment process that meets the legal minimum and demonstrates the home's commitment to child protection (CHR 2015 Reg 32, Sch 2; Keeping Children Safe in Education adapted for residential care; DBS Code of Practice; Safer Recruitment Consortium guidance)."
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
                  Recruitment score: {d.recruitment_score}/100 · {vac.total_candidates} candidates · compliance {Math.round(comp.compliance_rate)}% · DBS verified {Math.round(chk.dbs_verified_rate)}% · {comp.high_risk_count} high risk · {comp.non_compliant_candidates} non-compliant
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.recruitment_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(comp.non_compliant_candidates > 0 || comp.high_risk_count > 0 || chk.overdue_count > 0 || chk.concern_count > 0) && (
          <div className="flex flex-col gap-2">
            {comp.non_compliant_candidates > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {comp.non_compliant_candidates} non-compliant candidate{comp.non_compliant_candidates !== 1 ? "s" : ""} — these individuals do not have a complete safer recruitment record; the home cannot demonstrate that all required checks were completed for them; this is a direct safeguarding risk and a potential regulatory breach
              </div>
            )}
            {comp.high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {comp.high_risk_count} high-risk candidate{comp.high_risk_count !== 1 ? "s" : ""} identified — concerns were raised during the recruitment process for these candidates; ensure each has a documented risk assessment and management decision from the registered manager or RP
              </div>
            )}
            {chk.concern_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {chk.concern_count} check{chk.concern_count !== 1 ? "s" : ""} with concerns identified — checks that returned information of concern require documented management consideration; a DBS disclosure or a reference that raises concerns must be assessed against the specific role and the home's safeguarding context
              </div>
            )}
            {chk.overdue_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {chk.overdue_count} overdue check{chk.overdue_count !== 1 ? "s" : ""} — checks that are in progress past their due date need to be chased; an employee whose DBS check has been outstanding for more than 30 days since starting should be risk-assessed and the RP notified
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Pre-Employment Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total checks", value: chk.total_checks, color: "text-foreground" },
                  { label: "Verified", value: chk.verified_count, color: "text-emerald-600" },
                  { label: "In progress", value: chk.in_progress_count, color: chk.in_progress_count > 0 ? "text-amber-600" : "text-foreground" },
                  { label: "Overdue", value: chk.overdue_count, color: chk.overdue_count > 0 ? "text-red-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <RateBar label="Overall check verification rate" value={chk.verification_rate} warn={95} />
              <RateBar label="DBS verified rate" value={chk.dbs_verified_rate} warn={100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-muted-foreground" /> References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Total references", value: ref.total_references, color: "text-foreground" },
                  { label: "Verified", value: ref.verified_count, color: "text-emerald-600" },
                  { label: "Safeguarding refs", value: ref.safeguarding_ref_count, color: "text-blue-600" },
                  { label: "Gap flags", value: ref.gap_flag_count, color: ref.gap_flag_count > 0 ? "text-amber-600" : "text-emerald-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <RateBar label="Reference verification rate" value={ref.verification_rate} warn={95} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /> Candidate Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded border bg-emerald-50 border-emerald-200 p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">{comp.compliant_candidates}</p>
                <p className="text-muted-foreground mt-1">Fully compliant</p>
              </div>
              <div className={`rounded border p-3 text-center ${comp.in_progress_candidates > 0 ? "bg-amber-50 border-amber-200" : "bg-muted/30"}`}>
                <p className={`text-xl font-bold ${comp.in_progress_candidates > 0 ? "text-amber-700" : ""}`}>{comp.in_progress_candidates}</p>
                <p className="text-muted-foreground mt-1">In progress</p>
              </div>
              <div className={`rounded border p-3 text-center ${comp.non_compliant_candidates > 0 ? "bg-red-50 border-red-200" : "bg-muted/30"}`}>
                <p className={`text-xl font-bold ${comp.non_compliant_candidates > 0 ? "text-red-700" : ""}`}>{comp.non_compliant_candidates}</p>
                <p className="text-muted-foreground mt-1">Non-compliant</p>
              </div>
            </div>
            <RateBar label="Overall compliance rate" value={comp.compliance_rate} warn={100} />
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
          CHR 2015 Regulation 32 and Schedule 2 require the registered person to ensure that specified checks are completed before any person begins working in a position which involves contact with children: enhanced DBS check, barred list check (for regulated activity), identity verification, right to work check, medical fitness declaration, full employment history including gap exploration, two references (one from the most recent employer), and professional registration check where applicable. The safeguarding reference is a specific component that the Safer Recruitment Consortium guidance highlights: one of the two references must specifically address safeguarding; a general character reference does not substitute for this. Employment gap flagging is a quality indicator for thoroughness: unexplained gaps in employment history are one of the patterns that the Bichard Inquiry (Soham murders) identified as having been missed in pre-employment checks; a home that systematically flags and explores gaps is demonstrating the level of diligence that post-Bichard guidance requires. The compliance rate should be 100%: a rate below 100% means that at least one person has started working with children before all required checks were complete or verified; every point below 100% represents a safeguarding exposure that cannot be retrospectively remedied.
        </p>
      </div>
    </PageShell>
  );
}
