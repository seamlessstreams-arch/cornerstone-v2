"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeStaffDisciplinaryConductIntelligence } from "@/hooks/use-home-staff-disciplinary-conduct-intelligence";
import type { StaffDisciplinaryConductResult, StaffDisciplinaryRating } from "@/lib/engines/home-staff-disciplinary-conduct-intelligence-engine";

const RATING_META: Record<StaffDisciplinaryRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function StaffDisciplinaryConductIntelligencePage() {
  const raw = useHomeStaffDisciplinaryConductIntelligence();
  const d = (raw as { data?: { data?: StaffDisciplinaryConductResult } | undefined }).data?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Staff Disciplinary & Conduct Intelligence" description="Analysing disciplinary case volume, severity distribution, investigation quality, LADO referrals, and lessons learned…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Disciplinary & Conduct Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff disciplinary conduct data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.disciplinary_rating];

  return (
    <PageShell
      title="Staff Disciplinary & Conduct Intelligence"
      description="Staff disciplinary case volume, severity distribution, investigation completion, LADO referral compliance, outcome recording quality, and lessons learned integration — evidencing that the home manages conduct fairly, thoroughly, and transparently, with appropriate safeguarding referrals and organisational learning from every case (CHR 2015 Reg 32 & 34; Employment Rights Act 1996; ACAS Code of Practice on Disciplinary and Grievance Procedures; Working Together to Safeguard Children LADO threshold guidance; Ofsted SCCIF safer staffing indicators)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Gavel className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Conduct score: {d.disciplinary_score}/100 · {d.total_cases} case{d.total_cases !== 1 ? "s" : ""} · gross misconduct: {d.gross_misconduct_count} · serious: {d.serious_misconduct_count} · suspended: {d.suspended_count} · investigation completion: {Math.round(d.investigation_completion_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.disciplinary_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.gross_misconduct_count > 0 || d.suspended_count > 0 || d.investigation_completion_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.gross_misconduct_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.gross_misconduct_count} gross misconduct case{d.gross_misconduct_count > 1 ? "s" : ""} recorded — gross misconduct cases require a thorough investigation under the ACAS Code of Practice, appropriate LADO referrals where the conduct involves children, and clear outcome documentation; inadequate handling of gross misconduct cases exposes the home to employment tribunal risk, regulatory criticism, and safeguarding concerns
              </div>
            )}
            {d.suspended_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.suspended_count} staff member{d.suspended_count > 1 ? "s" : ""} currently suspended — suspension should be a neutral act while an investigation is conducted; Ofsted will look for evidence that suspended staff are not working with children and that investigations are progressing in a timely way; prolonged suspension without resolution is both a welfare and an operational risk
              </div>
            )}
            {d.investigation_completion_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Investigation completion rate {Math.round(d.investigation_completion_rate)}% — unresolved disciplinary cases carry ongoing risk: staff under investigation may remain in the workplace or on suspension; delay in completion is inconsistent with the ACAS Code of Practice requirement for prompt and fair procedures; cases that remain open for extended periods are more likely to result in successful unfair dismissal claims
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total cases", value: d.total_cases, color: "text-blue-600" },
            { label: "Gross misconduct", value: d.gross_misconduct_count, color: d.gross_misconduct_count === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Serious misconduct", value: d.serious_misconduct_count, color: d.serious_misconduct_count === 0 ? "text-emerald-600" : "text-amber-600" },
            { label: "Currently suspended", value: d.suspended_count, color: d.suspended_count === 0 ? "text-emerald-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Gavel className="h-4 w-4 text-muted-foreground" /> Investigation & Process Quality</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Investigation completion rate" value={d.investigation_completion_rate} warn={90} />
            <RateBar label="LADO referral rate (serious/gross)" value={d.lado_referral_rate} warn={95} />
            <RateBar label="Outcome recording rate" value={d.outcome_recording_rate} warn={95} />
            <RateBar label="Lessons learned documentation rate" value={d.lessons_learned_rate} warn={70} />
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
          Disciplinary and conduct management is one of the most legally and ethically complex areas of residential care management. The registered manager must simultaneously fulfil obligations under employment law (ACAS Code of Practice, Employment Rights Act 1996, Equality Act 2010), safeguarding law (Working Together LADO threshold guidance, CHR 2015 Regulation 34), and regulatory requirements (Ofsted SCCIF safer staffing indicators). The LADO referral rate is arguably the most critical metric: any conduct that could constitute harm to a child must be referred to the Local Authority Designated Officer, and failure to refer is not only a regulatory failure but a child protection failure; the threshold for referral is low by design, and the LADO's role is to decide whether an allegation is substantiated, not to filter out cases that "probably don't need referring." The investigation completion rate is the procedural quality indicator: cases that remain open are cases where uncertainty persists — about whether the member of staff can continue working with children, about what the outcome for the home will be, and about what learning can be extracted. The lessons learned rate measures whether the home treats disciplinary cases as learning opportunities: conduct issues often reveal training gaps, supervision failures, or cultural problems that contributed to the behaviour; extracting this learning is how a home prevents the same type of case from recurring.
        </p>
      </div>
    </PageShell>
  );
}
