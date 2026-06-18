"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeQualityOfCareReviewIntelligence } from "@/hooks/use-home-quality-of-care-review-intelligence";
import type { QualityOfCareReviewResult, QocIntelligenceRating } from "@/lib/engines/home-quality-of-care-review-intelligence-engine";

const RATING_META: Record<QocIntelligenceRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 75 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 45 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 45 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function QualityOfCareReviewIntelligencePage() {
  const { data, isLoading, error } = useHomeQualityOfCareReviewIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Quality of Care Review Intelligence" description="Analysing quality of care review outcomes, action completion, child and staff feedback rates, and domain quality data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Quality of Care Review Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load quality of care review data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.qoc_rating];

  return (
    <PageShell
      title="Quality of Care Review Intelligence"
      description="Quality of care review outcomes, proportion rated good or outstanding, action completion rates, child and staff feedback capture rates, and domain quality assessment — evidencing that the home systematically evaluates the quality of its care delivery across all domains and acts on what it finds (CHR 2015 Reg 34; SCCIF: Quality of care; ILACS framework)."
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
                  QoC score: {d.qoc_score}/100 · {d.total_reviews} reviews · good/outstanding {Math.round(d.good_or_outstanding_rate)}% · action completion {Math.round(d.action_completion_rate)}% · child feedback {Math.round(d.children_feedback_rate)}% · staff feedback {Math.round(d.staff_feedback_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.qoc_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.good_or_outstanding_rate < 60 || d.children_feedback_rate < 50 || d.action_completion_rate < 65) && (
          <div className="flex flex-col gap-2">
            {d.good_or_outstanding_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Good/outstanding rate {Math.round(d.good_or_outstanding_rate)}% — the proportion of quality of care reviews rated good or outstanding is a direct measure of the home's assessed practice quality; a consistent pattern of adequate or below ratings indicates systemic practice concerns that go beyond individual incidents
              </div>
            )}
            {d.children_feedback_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Children feedback rate {Math.round(d.children_feedback_rate)}% — quality of care reviews that do not capture children's feedback are missing the most important perspective on whether care is actually good; children's views cannot be inferred from staff observation or management audit; they must be actively sought
              </div>
            )}
            {d.action_completion_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Action completion rate {Math.round(d.action_completion_rate)}% — reviews that identify areas for improvement but do not drive change through completed actions are a missed opportunity; inspectors will look for evidence that quality of care reviews have led to identifiable improvements
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total reviews", value: d.total_reviews, color: "text-blue-600" },
            { label: "Good/outstanding rate", value: `${Math.round(d.good_or_outstanding_rate)}%`, color: d.good_or_outstanding_rate >= 75 ? "text-emerald-600" : d.good_or_outstanding_rate >= 50 ? "text-amber-600" : "text-red-600" },
            { label: "Domain quality rate", value: `${Math.round(d.domain_quality_rate)}%`, color: d.domain_quality_rate >= 75 ? "text-emerald-600" : d.domain_quality_rate >= 50 ? "text-amber-600" : "text-red-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-muted-foreground" /> Review Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Good or outstanding rate" value={d.good_or_outstanding_rate} warn={70} />
            <RateBar label="Action completion rate" value={d.action_completion_rate} warn={80} />
            <RateBar label="Children's feedback rate" value={d.children_feedback_rate} warn={70} />
            <RateBar label="Staff feedback rate" value={d.staff_feedback_rate} warn={70} />
            <RateBar label="Domain quality rate" value={d.domain_quality_rate} warn={75} />
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
          CHR 2015 Regulation 34 — the quality of care review is the most comprehensive tool the home has for assessing whether it is meeting the needs and welfare of the children in its care; it must cover all the key domains: safeguarding, health, education, relationships, activities, and the physical environment. The SCCIF "Quality of care" domain and the ILACS framework assess whether the home can demonstrate that its internal reviews are rigorous, honest, and followed through. The proportion of reviews rated good or outstanding tracks the overall trajectory of practice quality — a home where this proportion is rising over time is demonstrating continuous improvement; a home where it is static or declining despite improvement plans should be a source of serious concern for managers and governance structures. Children's feedback is not a "nice to have" supplement to adult-produced quality assessments — it is the ground truth against which all other quality metrics should be calibrated; a home that rates itself as good but where children's feedback is negative or absent has a data problem that needs to be resolved before the rating can be trusted. Staff feedback at quality of care reviews is the mechanism through which frontline workers' knowledge of practice realities reaches the management layer that makes decisions.
        </p>
      </div>
    </PageShell>
  );
}
