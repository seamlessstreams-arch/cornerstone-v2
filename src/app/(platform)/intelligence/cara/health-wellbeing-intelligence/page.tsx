"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeHealthWellbeingIntelligence } from "@/hooks/use-home-health-wellbeing-intelligence";
import type { HomeHealthWellbeingResult, HealthWellbeingRating } from "@/lib/engines/home-health-wellbeing-intelligence-engine";

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

function CoverageChip({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs border ${active ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      {active ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </div>
  );
}

export default function HealthWellbeingIntelligencePage() {
  const { data, isLoading, error } = useHomeHealthWellbeingIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Health & Wellbeing" description="Analysing health and wellbeing data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Health & Wellbeing" description="Unable to load data.">
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
      title="Health & Wellbeing"
      description="Health records, medication administration, follow-up compliance and health domain coverage — an integrated view of how well the home is promoting and protecting each child's physical and mental health (CHR 2015 Reg 10, 23; NMS 2; SCCIF Health)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <HeartPulse className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Health score: {d.health_score}/100 · {rec.total_records_180d} health records (180d) · {rec.children_with_records.length} children with records · follow-up compliance {Math.round(rec.follow_up_compliance_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.health_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(rec.children_without_records.length > 0 || med.missed_count > 0 || rec.overdue_follow_ups > 0) && (
          <div className="flex flex-col gap-2">
            {rec.children_without_records.length > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rec.children_without_records.length} child{rec.children_without_records.length !== 1 ? "ren" : ""} with no health records in 180 days — Ofsted will view this as failure to promote health outcomes under Regulation 10
              </div>
            )}
            {med.missed_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {med.missed_count} missed medication dose{med.missed_count !== 1 ? "s" : ""} — requires immediate clinical review; may indicate safeguarding concerns
              </div>
            )}
            {rec.overdue_follow_ups > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {rec.overdue_follow_ups} overdue follow-up{rec.overdue_follow_ups !== 1 ? "s" : ""} — health actions not being tracked undermines the health action plan
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
                Health Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold text-blue-600">{rec.total_records_180d}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Records</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold text-emerald-600">{rec.health_assessments_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Assessments</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className={`text-xl font-bold ${rec.overdue_follow_ups > 0 ? "text-red-600" : "text-emerald-600"}`}>{rec.overdue_follow_ups}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Overdue</p>
                </div>
              </div>
              <RateBar label="Follow-up compliance rate" value={rec.follow_up_compliance_rate} warn={90} />
              <RateBar label="Outcome documentation rate" value={rec.outcome_rate} warn={80} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Medication Administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-xl font-bold text-blue-600">{med.active_medications}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Active medications</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className={`text-xl font-bold ${med.missed_count > 0 ? "text-red-600" : "text-emerald-600"}`}>{med.missed_count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Missed doses</p>
                </div>
              </div>
              <RateBar label="Administration rate" value={med.administered_rate} warn={98} />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Refused: {med.refused_count} · Late: {med.late_count} · 30-day records: {med.admin_records_30d}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Health Domain Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <CoverageChip label="Dental" active={cov.dental_coverage} />
              <CoverageChip label="Optical" active={cov.optical_coverage} />
              <CoverageChip label="Immunisation" active={cov.immunisation_coverage} />
              <CoverageChip label="Mental health" active={cov.mental_health_monitored} />
              <CoverageChip label="Growth monitoring" active={cov.growth_monitored} />
            </div>
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
          CHR 2015 Regulation 10 (Healthcare — the registered person must promote and protect children's health). Regulation 23 (Administration of medicines). NMS 2 (Health — the home must help children maintain and improve their health). SCCIF Health. Children in care have a right not just to healthcare but to better health outcomes. A missed medication dose or an undocumented follow-up is not a clerical error — it is a gap in the protection of a vulnerable child.
        </p>
      </div>
    </PageShell>
  );
}
