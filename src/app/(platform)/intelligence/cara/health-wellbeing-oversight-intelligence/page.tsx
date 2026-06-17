"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHealthWellbeingOversightIntelligence } from "@/hooks/use-home-health-wellbeing-oversight-intelligence";
import type { HealthWellbeingOversightResult, HealthWellbeingRating } from "@/lib/engines/home-health-wellbeing-oversight-intelligence-engine";

const RATING_META: Record<HealthWellbeingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function HealthWellbeingOversightIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeHealthWellbeingOversightIntelligence();
  const d = (raw as { data?: HealthWellbeingOversightResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Health & Wellbeing Oversight" description="Analysing health and wellbeing oversight data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Health & Wellbeing Oversight" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load health and wellbeing oversight data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.wellbeing_rating];

  return (
    <PageShell
      title="Health & Wellbeing Oversight"
      description="Health assessment compliance, dental checks, passport currency, monitoring completion, immunisation, consent and follow-up — the manager's oversight view confirming that every statutory health obligation is being met across the whole cohort (CHR 2015 Reg 33; SCCIF Health; NMS 2)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ClipboardCheck className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wellbeing score: {d.wellbeing_score}/100 · {d.total_health_assessments} health assessments · compliance {Math.round(d.health_assessment_compliance_rate)}% · follow-up {Math.round(d.follow_up_completion_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.wellbeing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.health_assessment_compliance_rate < 90 || d.immunisation_rate < 90 || d.health_passport_currency_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.health_assessment_compliance_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Health assessment compliance {Math.round(d.health_assessment_compliance_rate)}% — annual health assessments are a statutory requirement under CHR 2015 Reg 33
              </div>
            )}
            {d.immunisation_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Immunisation rate {Math.round(d.immunisation_rate)}% — the home has a duty to ensure children are up to date with vaccinations
              </div>
            )}
            {d.health_passport_currency_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Health passport currency {Math.round(d.health_passport_currency_rate)}% — outdated passports risk missing allergies, conditions or medications in emergencies
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                Health Compliance Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="space-y-3">
                  <RateBar label="Health assessment compliance" value={d.health_assessment_compliance_rate} warn={95} />
                  <RateBar label="Dental check rate" value={d.dental_check_rate} warn={90} />
                  <RateBar label="Health passport currency" value={d.health_passport_currency_rate} warn={85} />
                  <RateBar label="Immunisation rate" value={d.immunisation_rate} warn={95} />
                </div>
                <div className="space-y-3">
                  <RateBar label="Monitoring completion rate" value={d.monitoring_completion_rate} warn={90} />
                  <RateBar label="Health action completion rate" value={d.health_action_completion_rate} warn={85} />
                  <RateBar label="Consent form rate" value={d.consent_form_rate} warn={100} />
                  <RateBar label="Follow-up completion rate" value={d.follow_up_completion_rate} warn={90} />
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
          CHR 2015 Regulation 33 (Health — the registered provider must promote the health and wellbeing of every child). SCCIF Health (health outcomes are a primary Ofsted inspection domain). NMS 2 (Health — the home supports children to access the healthcare they need). The oversight view does not replace the individual clinical record — it tells the manager whether the system of health care is working across the whole cohort. If any rate falls below threshold, a child may be falling through the gap.
        </p>
      </div>
    </PageShell>
  );
}
