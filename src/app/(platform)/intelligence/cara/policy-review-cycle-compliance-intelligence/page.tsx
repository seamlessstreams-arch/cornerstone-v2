"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomePolicyReviewCycleComplianceIntelligence } from "@/hooks/use-home-policy-review-cycle-compliance-intelligence";
import type { PolicyReviewCycleComplianceResult, PolicyReviewRating } from "@/lib/engines/home-policy-review-cycle-compliance-intelligence-engine";

const RATING_META: Record<PolicyReviewRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function PolicyReviewCycleComplianceIntelligencePage() {
  const { data: raw, isLoading, error } = useHomePolicyReviewCycleComplianceIntelligence();
  const d = (raw as { data?: PolicyReviewCycleComplianceResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Policy Review Cycle Compliance" description="Analysing policy review schedules, version control, staff acknowledgement, regulatory alignment, and accessibility data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Policy Review Cycle Compliance" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load policy review cycle compliance data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.policy_rating];

  return (
    <PageShell
      title="Policy Review Cycle Compliance"
      description="Policy review schedule adherence, version control quality, staff acknowledgement tracking, regulatory alignment, and policy accessibility — evidencing that the home's policy framework is actively maintained, regularly reviewed, and genuinely accessible to the staff who need to use it (CHR 2015 Reg 36; SCCIF: Well-led and managed)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <RefreshCw className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Policy score: {d.policy_score}/100 · {d.total_review_records} review records · {d.total_version_records} version records · {d.total_acknowledgement_records} acknowledgements · {d.total_alignment_records} alignment checks · {d.total_accessibility_records} accessibility records
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.policy_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.review_schedule_rate < 70 || d.regulatory_alignment_rate < 70 || d.staff_acknowledgement_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.review_schedule_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Review schedule compliance {Math.round(d.review_schedule_rate)}% — policies that are not reviewed on schedule become stale documents that may actively mislead staff about current standards and expectations; the review cycle is the mechanism by which the home's written framework stays alive and relevant
              </div>
            )}
            {d.regulatory_alignment_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Regulatory alignment rate {Math.round(d.regulatory_alignment_rate)}% — policies that are not aligned to current regulations cannot evidence compliance during inspection; any significant legislative change (e.g. changes to Working Together, CHR amendments) requires policies to be updated promptly
              </div>
            )}
            {d.staff_acknowledgement_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Staff acknowledgement rate {Math.round(d.staff_acknowledgement_rate)}% — staff who have not acknowledged updated policies may still be working to previous versions; acknowledgement tracking is how the home knows that changes to practice standards have reached the workforce
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: "Review records", value: d.total_review_records, color: "text-foreground" },
            { label: "Version records", value: d.total_version_records, color: "text-foreground" },
            { label: "Acknowledgements", value: d.total_acknowledgement_records, color: "text-foreground" },
            { label: "Alignment checks", value: d.total_alignment_records, color: "text-foreground" },
            { label: "Accessibility", value: d.total_accessibility_records, color: "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><RefreshCw className="h-4 w-4 text-muted-foreground" /> Policy Cycle Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Review schedule adherence rate" value={d.review_schedule_rate} warn={85} />
            <RateBar label="Version control rate" value={d.version_control_rate} warn={90} />
            <RateBar label="Staff acknowledgement rate" value={d.staff_acknowledgement_rate} warn={85} />
            <RateBar label="Regulatory alignment rate" value={d.regulatory_alignment_rate} warn={85} />
            <RateBar label="Accessibility rate" value={d.accessibility_rate} warn={90} />
            <RateBar label="Update timeliness rate" value={d.update_timeliness_rate} warn={85} />
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
          CHR 2015 Regulation 36 — the registered person must have a written statement of purpose and policies that are reviewed annually and updated as needed; Regulation 16 — staff must receive the information and supervision necessary to carry out their duties safely. Policy review cycle compliance is the operational evidence that these requirements are met. SCCIF "Well-led and managed" asks how leaders and managers ensure that policies are current, communicated, and used. A policy framework with high review schedule compliance, documented version control, and trackable acknowledgements demonstrates active governance rather than paper compliance. Regulatory alignment tracking is particularly important in the current period: Working Together 2023, the review of the Independent Review of Children's Social Care, and ongoing developments in trauma-informed practice mean that any home that does not actively track legislative and guidance changes risks its policies diverging from current best practice. Young people's consultation on policies (where developmentally appropriate) is a hallmark of outstanding practice and directly evidences NMS Standard 7 on participation.
        </p>
      </div>
    </PageShell>
  );
}
