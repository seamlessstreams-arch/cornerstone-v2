"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoorOpen, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeAdmissionIntelligence } from "@/hooks/use-home-admission-intelligence";
import type { AdmissionRating } from "@/lib/engines/home-admission-intelligence-engine";

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
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Admission & Placement Intelligence" description="Analysing admission and referral data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Admission & Placement Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load admission intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.admission_rating];
  const rp = d.referral_profile;
  const ap = d.assessment_profile;
  const qp = d.quality_profile;

  return (
    <PageShell
      title="Admission & Placement Intelligence"
      description="Referral pipeline, impact assessment compliance, placement matching quality, decision timeliness and occupancy (CHR 2015 Reg 14; SCCIF Well-led; Statement of Purpose)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <DoorOpen className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Score: {d.admission_score}/100 · {rp.total_referrals} referrals · {rp.acceptance_rate}% acceptance rate · {qp.occupancy_rate}% occupancy
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.admission_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(ap.pending_over_14_days > 0 || rp.emergency_count > 2) && (
          <div className="flex flex-wrap gap-2">
            {ap.pending_over_14_days > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {ap.pending_over_14_days} referral{ap.pending_over_14_days !== 1 ? "s" : ""} pending over 14 days without decision
              </div>
            )}
            {rp.emergency_count > 2 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {rp.emergency_count} emergency admissions — review matching and planning robustness
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  Referral Pipeline
                </CardTitle>
                <Badge variant="outline" className="text-xs">{rp.total_referrals} total</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-blue-50 p-2 text-center">
                  <p className="text-lg font-bold text-blue-700">{rp.active}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="rounded border bg-emerald-50 p-2 text-center">
                  <p className="text-lg font-bold text-emerald-700">{rp.accepted}</p>
                  <p className="text-xs text-muted-foreground">Accepted</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{rp.placed}</p>
                  <p className="text-xs text-muted-foreground">Placed</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{rp.declined}</p>
                  <p className="text-xs text-muted-foreground">Declined</p>
                </div>
                <div className={`rounded border p-2 text-center ${rp.emergency_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${rp.emergency_count > 0 ? "text-amber-700" : "text-foreground"}`}>{rp.emergency_count}</p>
                  <p className="text-xs text-muted-foreground">Emergency</p>
                </div>
              </div>
              <RateBar label="Acceptance rate" value={rp.acceptance_rate} warn={60} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Assessment Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Impact assessment completed" value={ap.impact_assessment_rate} />
              <RateBar label="Matching considerations documented" value={ap.matching_consideration_rate} />
              <RateBar label="Decision reason recorded" value={ap.decision_documented_rate} warn={100} />
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span>Avg days to decision</span>
                <span className={`font-medium ${ap.avg_days_to_decision <= 7 ? "text-emerald-600" : ap.avg_days_to_decision <= 14 ? "text-amber-600" : "text-red-600"}`}>
                  {ap.avg_days_to_decision}d
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Occupancy rate</span>
                <span className={`font-medium ${qp.occupancy_rate >= 80 ? "text-emerald-600" : qp.occupancy_rate >= 50 ? "text-amber-600" : "text-slate-500"}`}>
                  {qp.occupancy_rate}%
                </span>
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
          CHR 2015 Reg 14 (placement). SCCIF: Well-led and managed. Statement of Purpose compliance. Placement matching and impact assessment best practice.
        </p>
      </div>
    </PageShell>
  );
}
