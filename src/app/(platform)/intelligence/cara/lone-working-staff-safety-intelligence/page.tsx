"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLoneWorkingStaffSafetyIntelligence } from "@/hooks/use-home-lone-working-staff-safety-intelligence";
import type { LoneWorkingSafetyResult, LoneWorkingSafetyRating } from "@/lib/engines/home-lone-working-staff-safety-intelligence-engine";

const RATING_META: Record<LoneWorkingSafetyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LoneWorkingStaffSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeLoneWorkingStaffSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Lone Working & Staff Safety" description="Analysing lone working and staff safety data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Lone Working & Staff Safety" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load lone working staff safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.safety_rating];

  return (
    <PageShell
      title="Lone Working & Staff Safety"
      description="Lone working risk assessments, alarm coverage, check-in compliance, training validity and high-risk staff identification — evidencing that the home meets its duty of care to staff working alone in a residential setting with complex and sometimes volatile young people (Health and Safety at Work Act 1974; Management of Health and Safety at Work Regulations 1999; CHR 2015 Reg 32)."
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
                  Safety score: {d.safety_score}/100 · {d.staff_with_assessments} staff assessed · alarm coverage {Math.round(d.alarm_coverage_rate)}% · check-in compliance {Math.round(d.check_in_compliance_rate)}% · {d.high_risk_staff} high-risk
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.high_risk_staff > 0 || d.alarm_coverage_rate < 100 || d.check_in_compliance_rate < 90) && (
          <div className="flex flex-col gap-2">
            {d.high_risk_staff > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.high_risk_staff} staff in high-risk lone working situation{d.high_risk_staff > 1 ? "s" : ""} — staff in high-risk contexts must have specific named mitigations, not just a generic lone working policy; each is a potential employer liability if an incident occurs without adequate safeguards
              </div>
            )}
            {d.alarm_coverage_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Alarm coverage {Math.round(d.alarm_coverage_rate)}% — staff without lone working alarm provision are unprotected if they are assaulted or injured; this is a legal duty of care failure
              </div>
            )}
            {d.check_in_compliance_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Check-in compliance {Math.round(d.check_in_compliance_rate)}% — a lone working system that is not being used is no system at all; non-compliance must be addressed as a serious safety matter, not a process issue
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Staff with assessments", value: d.staff_with_assessments, color: "text-blue-600" },
            { label: "High-risk staff", value: d.high_risk_staff, color: d.high_risk_staff > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Alarm coverage", value: `${Math.round(d.alarm_coverage_rate)}%`, color: d.alarm_coverage_rate < 100 ? "text-red-600" : "text-emerald-600" },
            { label: "Training validity", value: `${Math.round(d.training_validity_rate)}%`, color: d.training_validity_rate < 80 ? "text-amber-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
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
            <RateBar label="Alarm coverage rate" value={d.alarm_coverage_rate} warn={100} />
            <RateBar label="Check-in compliance rate" value={d.check_in_compliance_rate} warn={95} />
            <RateBar label="Training validity rate" value={d.training_validity_rate} warn={90} />
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
          Health and Safety at Work Act 1974 (employers have a legal duty to ensure the health, safety and welfare of all employees at work; lone working in a residential care setting is a specific and documented high-risk activity). Management of Health and Safety at Work Regulations 1999 (Regulation 3 — employers must carry out suitable and sufficient risk assessments for all lone working; the assessment must be specific to the individual, the role and the context). CHR 2015 Regulation 32 (the registered person must ensure that staff are appropriately supported and have access to the means to summon assistance; this includes lone working protections). Residential care staff are statistically among the highest-risk groups for workplace injury and assault; a robust lone working framework is both a legal requirement and a basic obligation to the workforce.
        </p>
      </div>
    </PageShell>
  );
}
