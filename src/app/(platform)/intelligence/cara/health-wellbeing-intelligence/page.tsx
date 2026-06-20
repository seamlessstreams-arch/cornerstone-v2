"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Pill, ClipboardCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHealthWellbeingIntelligence } from "@/hooks/use-home-health-wellbeing-intelligence";
import type { HealthWellbeingRating } from "@/lib/engines/home-health-wellbeing-intelligence-engine";

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
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CoverageCheck({ label, covered }: { label: string; covered: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      {covered ? (
        <CheckCircle className="h-4 w-4 text-emerald-600" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-amber-500" />
      )}
    </div>
  );
}

export default function HealthWellbeingIntelligencePage() {
  const { data, isLoading, error } = useHomeHealthWellbeingIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Health & Wellbeing Intelligence" description="Analysing health and wellbeing data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Health & Wellbeing Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load health and wellbeing data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.health_rating];
  const rec = d.records;
  const med = d.medication;
  const cov = d.coverage;

  return (
    <PageShell
      title="Health & Wellbeing Intelligence"
      description="Health records, medication administration, specialist referrals and health coverage across all children (CHR 2015 Reg 7; Statutory guidance on children looked after)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Heart className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Health score: {d.health_score}/100</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.health_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {(rec.children_without_records.length > 0 || rec.overdue_follow_ups > 0) && (
          <div className="space-y-2">
            {rec.children_without_records.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {rec.children_without_records.length} child(ren) have no health records in the last 180 days — chase appointments urgently (CHR 2015 Reg 7).
              </div>
            )}
            {rec.overdue_follow_ups > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <Clock className="h-4 w-4 flex-shrink-0" />
                {rec.overdue_follow_ups} health follow-up(s) overdue — review and book appointments.
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Health records */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  Health Records (180d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{rec.total_records_180d} records</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{rec.health_assessments_count}</p>
                  <p className="text-xs text-muted-foreground">Assessments</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${rec.referrals_active > 0 ? "text-amber-600" : "text-foreground"}`}>{rec.referrals_active}</p>
                  <p className="text-xs text-muted-foreground">Active referrals</p>
                </div>
              </div>
              <RateBar label="Records per child" value={Math.min(rec.records_per_child * 10, 100)} warn={50} />
              <RateBar label="Follow-up compliance" value={rec.follow_up_compliance_rate} />
              <RateBar label="Records with outcomes" value={rec.outcome_rate} />
            </CardContent>
          </Card>

          {/* Medication */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  Medication Administration (30d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{med.admin_records_30d} records</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{med.active_medications}</p>
                  <p className="text-xs text-muted-foreground">Active meds</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${med.missed_count > 0 ? "text-red-600" : "text-foreground"}`}>{med.missed_count}</p>
                  <p className="text-xs text-muted-foreground">Missed</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${med.refused_count > 0 ? "text-amber-600" : "text-foreground"}`}>{med.refused_count}</p>
                  <p className="text-xs text-muted-foreground">Refused</p>
                </div>
              </div>
              <RateBar label="Administration rate" value={med.administered_rate} warn={95} />
            </CardContent>
          </Card>

          {/* Coverage checklist */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                Health Coverage Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoverageCheck label="Dental coverage" covered={cov.dental_coverage} />
              <CoverageCheck label="Optical coverage" covered={cov.optical_coverage} />
              <CoverageCheck label="Immunisation coverage" covered={cov.immunisation_coverage} />
              <CoverageCheck label="Mental health monitored" covered={cov.mental_health_monitored} />
              <CoverageCheck label="Growth monitored" covered={cov.growth_monitored} />
              <p className="text-xs text-muted-foreground mt-2">
                {Object.values(cov).filter(Boolean).length}/{Object.values(cov).length} coverage areas met
              </p>
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
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          CHR 2015 Reg 7 (health and wellbeing). Statutory guidance on LAC health assessments. Promoting the health and wellbeing of LAC (2015). SCCIF: "Experiences and progress of children in care."
        </p>
      </div>
    </PageShell>
  );
}
