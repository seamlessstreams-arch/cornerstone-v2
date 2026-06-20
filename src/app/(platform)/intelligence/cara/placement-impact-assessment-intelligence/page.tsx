"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePlacementImpactAssessmentIntelligence } from "@/hooks/use-home-placement-impact-assessment-intelligence";
import type { PlacementImpactResult, PlacementImpactRating } from "@/lib/engines/home-placement-impact-assessment-intelligence-engine";

const RATING_META: Record<PlacementImpactRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PlacementImpactAssessmentIntelligencePage() {
  const { data, isLoading, error } = useHomePlacementImpactAssessmentIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Placement Impact Assessment Intelligence" description="Analysing placement impact assessment quality and completion data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Placement Impact Assessment Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load placement impact assessment data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.impact_rating];

  return (
    <PageShell
      title="Placement Impact Assessment Intelligence"
      description="Placement impact assessment completion rates, decision documentation, child view capture, mitigation strategy rates, compatibility positivity, safeguarding coverage, and review scheduling — evidencing that every placement decision is analytically grounded, safeguarding-conscious, and structured to protect both the incoming child and existing residents (CHR 2015 Reg 5; Placement in Children's Homes DfE 2020; matching framework)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <BarChart2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Impact score: {d.impact_score}/100 · {d.total_assessments} assessments · completion {Math.round(d.decision_documented_rate)}% · safeguarding coverage {Math.round(d.safeguarding_coverage_rate)}% · child views {Math.round(d.child_view_capture_rate)}% · mitigations {Math.round(d.mitigation_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.impact_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.safeguarding_coverage_rate < 100 || d.decision_documented_rate < 90 || d.child_view_capture_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.safeguarding_coverage_rate < 100 && d.total_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Safeguarding coverage {Math.round(d.safeguarding_coverage_rate)}% — a placement impact assessment that does not include a safeguarding section is incomplete; every placement decision must consider the safeguarding implications for the incoming child, for existing residents, and for the group as a whole
              </div>
            )}
            {d.decision_documented_rate < 90 && d.total_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Decision documentation rate {Math.round(d.decision_documented_rate)}% — placement decisions without documented rationale cannot be scrutinised, reviewed, or learned from; the decision to place (or not place) a child is a clinical and safeguarding judgment that must be recorded
              </div>
            )}
            {d.child_view_capture_rate < 70 && d.total_assessments > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child views captured in only {Math.round(d.child_view_capture_rate)}% of assessments — existing residents have a right to understand that a new child is joining their home and, where appropriate, to have their views considered in the matching decision; this is both a participation right and a safeguarding measure
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total assessments", value: d.total_assessments, color: "text-blue-600" },
            { label: "Decision documented", value: `${Math.round(d.decision_documented_rate)}%`, color: d.decision_documented_rate >= 95 ? "text-emerald-600" : d.decision_documented_rate >= 80 ? "text-amber-600" : "text-red-600" },
            { label: "Safeguarding covered", value: `${Math.round(d.safeguarding_coverage_rate)}%`, color: d.safeguarding_coverage_rate >= 100 ? "text-emerald-600" : d.safeguarding_coverage_rate >= 80 ? "text-amber-600" : "text-red-600" },
            { label: "Child views captured", value: `${Math.round(d.child_view_capture_rate)}%`, color: d.child_view_capture_rate >= 80 ? "text-emerald-600" : d.child_view_capture_rate >= 60 ? "text-amber-600" : "text-red-600" },
            { label: "Mitigations in place", value: `${Math.round(d.mitigation_rate)}%`, color: d.mitigation_rate >= 80 ? "text-emerald-600" : d.mitigation_rate >= 60 ? "text-amber-600" : "text-red-600" },
            { label: "Reviews scheduled", value: `${Math.round(d.review_scheduled_rate)}%`, color: d.review_scheduled_rate >= 80 ? "text-emerald-600" : d.review_scheduled_rate >= 60 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><BarChart2 className="h-4 w-4 text-muted-foreground" /> Assessment Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Decision documented rate" value={d.decision_documented_rate} warn={95} />
            <RateBar label="Safeguarding coverage rate" value={d.safeguarding_coverage_rate} warn={100} />
            <RateBar label="Child view capture rate" value={d.child_view_capture_rate} warn={80} />
            <RateBar label="Mitigation strategy rate" value={d.mitigation_rate} warn={80} />
            <RateBar label="Compatibility positive rate" value={d.compatibility_positive_rate} warn={75} />
            <RateBar label="Review scheduled rate" value={d.review_scheduled_rate} warn={90} />
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
          Placement in Children's Homes (DfE, 2020) — "the responsible individual and the registered manager should undertake a thorough assessment of the likely impact of the proposed placement on existing residents and on the home more widely." This assessment — the placement impact assessment — must consider each existing child's needs, vulnerabilities, and history in relation to the incoming child; the group dynamics and culture of the home; and any safeguarding risks that the combination of children may create. CHR 2015 Regulation 5 (welfare) — the welfare of all children in the home must be considered, not just the child being placed; accepting a referral without assessing the impact on existing residents is a failure to safeguard. Mitigation strategies in impact assessments are the home's documented plan for managing any identified risks that arise from the matching — they give the home a defensible basis for accepting a challenging referral and a framework for the first weeks of the placement. Assessments without reviews scheduled are snapshots, not living documents; impact does not stand still, and an assessment that was valid at admission may be invalid six weeks later.
        </p>
      </div>
    </PageShell>
  );
}
